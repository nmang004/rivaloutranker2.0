import { Router } from 'express';
import { z } from 'zod';
import { analysisConfigSchema, analysisResultSchema, insertAnalysisSchema } from '@/shared/schemas/analysis';
import { StandardAnalysisService } from '../services/analysis/standard-analysis.service';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Initialize Standard Analysis Service
const analysisService = new StandardAnalysisService();

/**
 * POST /api/analysis
 * Standard SEO Analysis (50+ factors) with AI-powered insights
 */
router.post('/', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const requestSchema = z.object({
      url: z.string().url(),
      targetKeyword: z.string().optional(),
      config: analysisConfigSchema.optional()
    });

    const { url, targetKeyword, config } = requestSchema.parse(req.body);
    const userId = req.user!.id;

    console.log(`[Analysis API] Starting standard analysis for ${url}`);

    // Start analysis
    const analysis = await analysisService.analyzeUrl({
      url,
      targetKeyword,
      config: config || { 
        analysisDepth: 'standard',
        runDeepContentAnalysis: false,
        includeCompetitorAnalysis: false
      },
      userId
    });

    res.json({
      success: true,
      analysisId: analysis.id,
      status: analysis.status,
      url: analysis.url,
      estimatedTime: '2-3 minutes',
      message: 'Analysis started successfully'
    });

  } catch (error) {
    console.error('[Analysis API] Error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
        details: error.errors
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to start analysis',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/analysis/:id
 * Get analysis results by ID
 */
router.get('/:id', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const analysisId = parseInt(req.params.id);
    const userId = req.user!.id;

    const analysis = await analysisService.getAnalysis(analysisId, userId);
    
    if (!analysis) {
      return res.status(404).json({
        success: false,
        error: 'Analysis not found'
      });
    }

    res.json({
      success: true,
      analysis: {
        id: analysis.id,
        url: analysis.url,
        title: analysis.title,
        type: analysis.type,
        status: analysis.status,
        results: analysis.results,
        metrics: analysis.metrics,
        startedAt: analysis.startedAt,
        completedAt: analysis.completedAt,
        createdAt: analysis.createdAt
      }
    });

  } catch (error) {
    console.error('[Analysis API] Error fetching analysis:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analysis',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/analysis/:id/status
 * Get analysis status for polling
 */
router.get('/:id/status', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const analysisId = parseInt(req.params.id);
    const userId = req.user!.id;

    const status = await analysisService.getAnalysisStatus(analysisId, userId);
    
    if (!status) {
      return res.status(404).json({
        success: false,
        error: 'Analysis not found'
      });
    }

    res.json({
      success: true,
      ...status
    });

  } catch (error) {
    console.error('[Analysis API] Error fetching status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analysis status',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/analysis
 * List user's analyses with pagination
 */
router.get('/', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const querySchema = z.object({
      page: z.string().transform(Number).pipe(z.number().int().min(1)).optional().default('1'),
      limit: z.string().transform(Number).pipe(z.number().int().min(1).max(100)).optional().default('20'),
      type: z.enum(['basic', 'standard', 'deep', 'competitor', 'keyword']).optional(),
      status: z.enum(['pending', 'running', 'completed', 'failed']).optional()
    });

    const { page, limit, type, status } = querySchema.parse(req.query);
    const userId = req.user!.id;

    const result = await analysisService.getUserAnalyses(userId, {
      page: Number(page),
      limit: Number(limit),
      type,
      status
    });

    res.json({
      success: true,
      ...result
    });

  } catch (error) {
    console.error('[Analysis API] Error listing analyses:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid query parameters',
        details: error.errors
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to fetch analyses',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * DELETE /api/analysis/:id
 * Delete an analysis
 */
router.delete('/:id', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const analysisId = parseInt(req.params.id);
    const userId = req.user!.id;

    await analysisService.deleteAnalysis(analysisId, userId);

    res.json({
      success: true,
      message: 'Analysis deleted successfully'
    });

  } catch (error) {
    console.error('[Analysis API] Error deleting analysis:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete analysis',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/analysis/:id/regenerate
 * Regenerate an analysis with updated data
 */
router.post('/:id/regenerate', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const analysisId = parseInt(req.params.id);
    const userId = req.user!.id;

    const analysis = await analysisService.regenerateAnalysis(analysisId, userId);

    res.json({
      success: true,
      analysisId: analysis.id,
      status: analysis.status,
      message: 'Analysis regeneration started successfully'
    });

  } catch (error) {
    console.error('[Analysis API] Error regenerating analysis:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to regenerate analysis',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/analysis/compare
 * Compare multiple analyses or competitor URLs
 */
router.post('/compare', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const requestSchema = z.object({
      primaryUrl: z.string().url(),
      competitorUrls: z.array(z.string().url()).min(1).max(5),
      targetKeyword: z.string().optional(),
      config: analysisConfigSchema.optional()
    });

    const { primaryUrl, competitorUrls, targetKeyword, config } = requestSchema.parse(req.body);
    const userId = req.user!.id;

    console.log(`[Analysis API] Starting competitor comparison for ${primaryUrl}`);

    const comparison = await analysisService.compareWithCompetitors({
      url: primaryUrl,
      primaryUrl,
      competitorUrls,
      targetKeyword,
      config: { 
        analysisDepth: 'competitor',
        runDeepContentAnalysis: config?.runDeepContentAnalysis || false,
        includeCompetitorAnalysis: true,
        ...config 
      },
      userId
    });

    res.json({
      success: true,
      analysisId: comparison.id,
      status: comparison.status,
      message: 'Competitor comparison started successfully'
    });

  } catch (error) {
    console.error('[Analysis API] Error starting comparison:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
        details: error.errors
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to start comparison',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;