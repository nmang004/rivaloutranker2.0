import { Router } from 'express';
import { z } from 'zod';
import { db } from '@/lib/db/connection';
import { projects } from '@/shared/schemas/analysis';
import { analyses } from '@/shared/schemas/analysis';
import { audits } from '@/shared/schemas/audit';
import { eq, and, desc, count, gte, or, ilike } from 'drizzle-orm';
import { authMiddleware, type AuthenticatedRequest } from '../middleware/auth';

const router = Router();

/**
 * POST /api/projects
 * Create a new project for website tracking
 */
router.post('/', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const projectSchema = z.object({
      name: z.string().min(1).max(255),
      description: z.string().max(1000).optional(),
      url: z.string().url(),
      settings: z.object({
        trackingKeywords: z.array(z.string()).optional(),
        competitors: z.array(z.string().url()).optional(),
        analysisFrequency: z.enum(['daily', 'weekly', 'monthly']).optional().default('weekly'),
        alertThresholds: z.object({
          scoreDrops: z.number().min(1).max(50).optional().default(10),
          newIssues: z.boolean().optional().default(true),
          competitorChanges: z.boolean().optional().default(false)
        }).optional()
      }).optional()
    });

    const projectData = projectSchema.parse(req.body);
    const userId = req.user!.id;
    const teamId = req.user!.teamId;

    console.log(`[Projects] Creating project ${projectData.name} for user ${userId}`);

    // Check if project with this URL already exists for user
    const [existingProject] = await db
      .select()
      .from(projects)
      .where(and(
        eq(projects.userId, userId),
        eq(projects.url, projectData.url)
      ))
      .limit(1);

    if (existingProject) {
      return res.status(409).json({
        success: false,
        error: 'Project already exists',
        message: 'A project with this URL already exists'
      });
    }

    // Calculate next analysis date
    const nextAnalysis = calculateNextAnalysisDate(projectData.settings?.analysisFrequency || 'weekly');

    const [newProject] = await db
      .insert(projects)
      .values({
        userId,
        teamId,
        name: projectData.name,
        description: projectData.description,
        url: projectData.url,
        settings: projectData.settings || {},
        nextAnalysis
      })
      .returning();

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project: newProject
    });

  } catch (error) {
    console.error('[Projects] Create project error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid project data',
        details: error.errors
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to create project'
    });
  }
});

/**
 * GET /api/projects
 * Get user's projects with pagination
 */
router.get('/', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const querySchema = z.object({
      page: z.string().transform(Number).pipe(z.number().int().min(1)).optional().default('1'),
      limit: z.string().transform(Number).pipe(z.number().int().min(1).max(100)).optional().default('20'),
      search: z.string().optional(),
      isActive: z.enum(['true', 'false']).optional()
    });

    const { page, limit, search, isActive } = querySchema.parse(req.query);
    const userId = req.user!.id;
    const offset = (Number(page) - 1) * Number(limit);

    let whereConditions = [eq(projects.userId, userId)];
    
    if (search) {
      whereConditions.push(
        or(
          ilike(projects.name, `%${search}%`),
          ilike(projects.url, `%${search}%`)
        )!
      );
    }

    if (isActive !== undefined) {
      whereConditions.push(eq(projects.isActive, isActive === 'true'));
    }

    const userProjects = await db
      .select()
      .from(projects)
      .where(and(...whereConditions))
      .orderBy(desc(projects.createdAt))
      .limit(Number(limit))
      .offset(offset);

    // Get total count
    const [{ count: totalCount }] = await db
      .select({ count: count() })
      .from(projects)
      .where(and(...whereConditions));

    // Get statistics for each project
    const projectsWithStats = await Promise.all(
      userProjects.map(async (project) => {
        const [analysesCount] = await db
          .select({ count: count() })
          .from(analyses)
          .where(and(
            eq(analyses.userId, userId),
            eq(analyses.url, project.url)
          ));

        const [auditsCount] = await db
          .select({ count: count() })
          .from(audits)
          .where(and(
            eq(audits.userId, userId),
            eq(audits.url, project.url)
          ));

        return {
          ...project,
          stats: {
            totalAnalyses: Number(analysesCount.count),
            totalAudits: Number(auditsCount.count),
            lastAnalyzed: project.lastAnalyzed,
            nextAnalysis: project.nextAnalysis
          }
        };
      })
    );

    res.json({
      success: true,
      projects: projectsWithStats,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: Number(totalCount),
        pages: Math.ceil(Number(totalCount) / Number(limit))
      }
    });

  } catch (error) {
    console.error('[Projects] Get projects error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid query parameters',
        details: error.errors
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to fetch projects'
    });
  }
});

/**
 * GET /api/projects/:id
 * Get project by ID with detailed analytics
 */
router.get('/:id', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const projectId = parseInt(req.params.id);
    const userId = req.user!.id;

    const [project] = await db
      .select()
      .from(projects)
      .where(and(
        eq(projects.id, projectId),
        eq(projects.userId, userId)
      ))
      .limit(1);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Get recent analyses for this project
    const recentAnalyses = await db
      .select({
        id: analyses.id,
        type: analyses.type,
        status: analyses.status,
        results: analyses.results,
        createdAt: analyses.createdAt
      })
      .from(analyses)
      .where(and(
        eq(analyses.userId, userId),
        eq(analyses.url, project.url)
      ))
      .orderBy(desc(analyses.createdAt))
      .limit(10);

    // Get recent audits for this project
    const recentAudits = await db
      .select({
        id: audits.id,
        type: audits.type,
        status: audits.status,
        progress: audits.progress,
        results: audits.results,
        createdAt: audits.createdAt
      })
      .from(audits)
      .where(and(
        eq(audits.userId, userId),
        eq(audits.url, project.url)
      ))
      .orderBy(desc(audits.createdAt))
      .limit(10);

    // Calculate score trends (simplified)
    const scoreTrend = calculateScoreTrend(recentAnalyses, recentAudits);

    res.json({
      success: true,
      project: {
        ...project,
        analytics: {
          recentAnalyses,
          recentAudits,
          scoreTrend,
          totalAnalyses: recentAnalyses.length,
          totalAudits: recentAudits.length
        }
      }
    });

  } catch (error) {
    console.error('[Projects] Get project error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch project'
    });
  }
});

/**
 * PUT /api/projects/:id
 * Update project settings
 */
router.put('/:id', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const updateSchema = z.object({
      name: z.string().min(1).max(255).optional(),
      description: z.string().max(1000).optional(),
      settings: z.object({
        trackingKeywords: z.array(z.string()).optional(),
        competitors: z.array(z.string().url()).optional(),
        analysisFrequency: z.enum(['daily', 'weekly', 'monthly']).optional(),
        alertThresholds: z.object({
          scoreDrops: z.number().min(1).max(50).optional(),
          newIssues: z.boolean().optional(),
          competitorChanges: z.boolean().optional()
        }).optional()
      }).optional(),
      isActive: z.boolean().optional()
    });

    const updateData = updateSchema.parse(req.body);
    const projectId = parseInt(req.params.id);
    const userId = req.user!.id;

    console.log(`[Projects] Updating project ${projectId} for user ${userId}`);

    // Get current project
    const [currentProject] = await db
      .select()
      .from(projects)
      .where(and(
        eq(projects.id, projectId),
        eq(projects.userId, userId)
      ))
      .limit(1);

    if (!currentProject) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Merge settings
    const updatedSettings = updateData.settings 
      ? { ...currentProject.settings, ...updateData.settings }
      : currentProject.settings;

    // Calculate new next analysis date if frequency changed
    let nextAnalysis = currentProject.nextAnalysis;
    if (updateData.settings?.analysisFrequency && 
        updateData.settings.analysisFrequency !== currentProject.settings?.analysisFrequency) {
      nextAnalysis = calculateNextAnalysisDate(updateData.settings.analysisFrequency);
    }

    const [updatedProject] = await db
      .update(projects)
      .set({
        name: updateData.name ?? currentProject.name,
        description: updateData.description ?? currentProject.description,
        settings: updatedSettings,
        isActive: updateData.isActive ?? currentProject.isActive,
        nextAnalysis,
        updatedAt: new Date()
      })
      .where(eq(projects.id, projectId))
      .returning();

    res.json({
      success: true,
      message: 'Project updated successfully',
      project: updatedProject
    });

  } catch (error) {
    console.error('[Projects] Update project error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid update data',
        details: error.errors
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to update project'
    });
  }
});

/**
 * DELETE /api/projects/:id
 * Delete project
 */
router.delete('/:id', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const projectId = parseInt(req.params.id);
    const userId = req.user!.id;

    console.log(`[Projects] Deleting project ${projectId} for user ${userId}`);

    const [deletedProject] = await db
      .delete(projects)
      .where(and(
        eq(projects.id, projectId),
        eq(projects.userId, userId)
      ))
      .returning();

    if (!deletedProject) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });

  } catch (error) {
    console.error('[Projects] Delete project error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete project'
    });
  }
});

/**
 * POST /api/projects/:id/analyze
 * Trigger new analysis for project
 */
router.post('/:id/analyze', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const analysisSchema = z.object({
      type: z.enum(['analysis', 'audit']).default('analysis'),
      analysisDepth: z.enum(['basic', 'standard', 'comprehensive']).optional(),
      includeCompetitors: z.boolean().optional().default(false)
    });

    const { type, analysisDepth, includeCompetitors } = analysisSchema.parse(req.body);
    const projectId = parseInt(req.params.id);
    const userId = req.user!.id;

    const [project] = await db
      .select()
      .from(projects)
      .where(and(
        eq(projects.id, projectId),
        eq(projects.userId, userId)
      ))
      .limit(1);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Update last analyzed timestamp
    await db
      .update(projects)
      .set({
        lastAnalyzed: new Date(),
        nextAnalysis: calculateNextAnalysisDate(project.settings?.analysisFrequency || 'weekly'),
        updatedAt: new Date()
      })
      .where(eq(projects.id, projectId));

    // Here you would integrate with the analysis/audit services
    // For now, return a success response
    res.json({
      success: true,
      message: `${type === 'analysis' ? 'Analysis' : 'Audit'} started for project`,
      projectId,
      analysisType: type,
      estimatedTime: type === 'analysis' ? '2-3 minutes' : '5-15 minutes'
    });

  } catch (error) {
    console.error('[Projects] Trigger analysis error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid analysis request',
        details: error.errors
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to start analysis'
    });
  }
});

/**
 * GET /api/projects/:id/alerts
 * Get project alerts and notifications
 */
router.get('/:id/alerts', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const projectId = parseInt(req.params.id);
    const userId = req.user!.id;

    const [project] = await db
      .select()
      .from(projects)
      .where(and(
        eq(projects.id, projectId),
        eq(projects.userId, userId)
      ))
      .limit(1);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Get recent analyses to check for alerts
    const recentAnalyses = await db
      .select()
      .from(analyses)
      .where(and(
        eq(analyses.userId, userId),
        eq(analyses.url, project.url),
        gte(analyses.createdAt, new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) // Last 30 days
      ))
      .orderBy(desc(analyses.createdAt));

    // Generate alerts based on analysis results and project settings
    const alerts = generateProjectAlerts(project, recentAnalyses);

    res.json({
      success: true,
      alerts
    });

  } catch (error) {
    console.error('[Projects] Get alerts error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch project alerts'
    });
  }
});

// Helper functions

/**
 * Calculate next analysis date based on frequency
 */
function calculateNextAnalysisDate(frequency: string): Date {
  const now = new Date();
  
  switch (frequency) {
    case 'daily':
      return new Date(now.getTime() + 24 * 60 * 60 * 1000);
    case 'weekly':
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    case 'monthly':
      const nextMonth = new Date(now);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      return nextMonth;
    default:
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  }
}

/**
 * Calculate score trend from recent analyses
 */
function calculateScoreTrend(analyses: any[], audits: any[]): any {
  const allResults = [...analyses, ...audits]
    .filter(item => item.results?.overallScore)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  if (allResults.length < 2) {
    return {
      direction: 'stable',
      change: 0,
      currentScore: allResults[0]?.results?.overallScore || 0
    };
  }

  const currentScore = allResults[allResults.length - 1].results.overallScore;
  const previousScore = allResults[allResults.length - 2].results.overallScore;
  const change = currentScore - previousScore;

  return {
    direction: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
    change: Math.abs(change),
    currentScore,
    previousScore
  };
}

/**
 * Generate project alerts based on settings and recent data
 */
function generateProjectAlerts(project: any, recentAnalyses: any[]): any[] {
  const alerts = [];
  const settings = project.settings || {};
  const thresholds = settings.alertThresholds || {};

  if (recentAnalyses.length >= 2 && thresholds.scoreDrops) {
    const latest = recentAnalyses[0];
    const previous = recentAnalyses[1];
    
    if (latest.results?.overallScore && previous.results?.overallScore) {
      const scoreDrop = previous.results.overallScore - latest.results.overallScore;
      
      if (scoreDrop >= thresholds.scoreDrops) {
        alerts.push({
          type: 'score_drop',
          severity: 'warning',
          title: 'Score Drop Detected',
          message: `Overall score dropped by ${scoreDrop} points`,
          createdAt: latest.createdAt
        });
      }
    }
  }

  if (thresholds.newIssues && recentAnalyses.length > 0) {
    const latest = recentAnalyses[0];
    const totalIssues = (latest.results?.summary?.priorityOfiCount || 0) + 
                       (latest.results?.summary?.ofiCount || 0);
    
    if (totalIssues > 0) {
      alerts.push({
        type: 'new_issues',
        severity: 'info',
        title: 'Issues Found',
        message: `${totalIssues} issues found in latest analysis`,
        createdAt: latest.createdAt
      });
    }
  }

  return alerts;
}

export default router;