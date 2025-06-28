import { Router } from 'express';
import { z } from 'zod';
import { ExecutiveDashboardService } from '../services/reporting/executive-dashboard.service';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth';
import { db } from '@/lib/db/connection';
import { audits } from '@/shared/schemas/audit';
import { eq, and, desc, gte, lte } from 'drizzle-orm';

const router = Router();

// Initialize Executive Dashboard Service
const dashboardService = new ExecutiveDashboardService();

/**
 * GET /api/dashboard/executive
 * Generate executive dashboard with KPI metrics, ROI analysis, and strategic insights
 */
router.get('/executive', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const querySchema = z.object({
      timeframe: z.enum(['week', 'month', 'quarter', 'year']).optional().default('month'),
      teamId: z.string().transform(Number).optional(),
      compareWithPrevious: z.string().transform(val => val === 'true').optional().default('true')
    });

    const { timeframe, teamId, compareWithPrevious } = querySchema.parse(req.query);
    const userId = req.user!.id;
    const userTeamId = req.user!.teamId;

    console.log(`[Dashboard API] Generating executive dashboard for user ${userId} (${timeframe} view)`);

    // Calculate date range based on timeframe
    const dateRange = calculateDateRange(timeframe);
    
    // Build query conditions
    let whereConditions = [
      eq(audits.status, 'completed')
    ];

    // Add team filtering
    if (teamId && userTeamId && teamId === userTeamId) {
      whereConditions.push(eq(audits.teamId, teamId));
    } else if (userTeamId) {
      // User belongs to a team, filter by team
      whereConditions.push(eq(audits.teamId, userTeamId));
    } else {
      // Individual user, filter by userId
      whereConditions.push(eq(audits.userId, userId));
    }

    // Add date range filtering
    if (dateRange.start) {
      whereConditions.push(gte(audits.completedAt, dateRange.start));
    }
    if (dateRange.end) {
      whereConditions.push(lte(audits.completedAt, dateRange.end));
    }

    // Fetch completed audits for the timeframe
    const completedAudits = await db
      .select()
      .from(audits)
      .where(and(...whereConditions))
      .orderBy(desc(audits.completedAt))
      .limit(1000); // Reasonable limit for dashboard calculations

    console.log(`[Dashboard API] Found ${completedAudits.length} completed audits for analysis`);

    if (completedAudits.length === 0) {
      return res.json({
        success: true,
        dashboard: getEmptyDashboard(),
        message: 'No completed audits found for the selected timeframe'
      });
    }

    // Extract audit results for analysis
    const auditResults = completedAudits
      .filter(audit => audit.results !== null)
      .map(audit => audit.results!);

    // Generate comprehensive dashboard
    const dashboardData = await dashboardService.generateExecutiveDashboard(
      auditResults,
      timeframe,
      compareWithPrevious
    );

    // Add metadata
    const dashboardWithMetadata = {
      ...dashboardData,
      metadata: {
        timeframe,
        auditsAnalyzed: auditResults.length,
        dateRange: {
          start: dateRange.start?.toISOString(),
          end: dateRange.end?.toISOString()
        },
        generatedAt: new Date().toISOString(),
        teamId: userTeamId || null,
        userId: userId
      }
    };

    res.json({
      success: true,
      dashboard: dashboardWithMetadata
    });

  } catch (error) {
    console.error('[Dashboard API] Error generating executive dashboard:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid query parameters',
        details: error.errors
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to generate executive dashboard',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/dashboard/kpi-summary
 * Get high-level KPI summary for quick overview
 */
router.get('/kpi-summary', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;
    const userTeamId = req.user!.teamId;

    // Get recent audits (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    let whereConditions = [
      eq(audits.status, 'completed'),
      gte(audits.completedAt, thirtyDaysAgo)
    ];

    if (userTeamId) {
      whereConditions.push(eq(audits.teamId, userTeamId));
    } else {
      whereConditions.push(eq(audits.userId, userId));
    }

    const recentAudits = await db
      .select()
      .from(audits)
      .where(and(...whereConditions))
      .orderBy(desc(audits.completedAt))
      .limit(100);

    // Calculate basic KPIs
    const totalAudits = recentAudits.length;
    const avgScore = totalAudits > 0 
      ? Math.round(recentAudits.reduce((sum, audit) => 
          sum + (audit.results?.summary?.overallScore || 0), 0) / totalAudits)
      : 0;

    const criticalIssues = recentAudits.reduce((sum, audit) => 
      sum + (audit.results?.summary?.priorityOfiCount || 0), 0);

    const totalIssues = recentAudits.reduce((sum, audit) => 
      sum + (audit.results?.summary?.ofiCount || 0) + (audit.results?.summary?.priorityOfiCount || 0), 0);

    res.json({
      success: true,
      kpiSummary: {
        totalAudits,
        averageScore: avgScore,
        criticalIssues,
        totalIssues,
        period: 'Last 30 days',
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('[Dashboard API] Error fetching KPI summary:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch KPI summary',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/dashboard/performance-trends
 * Get performance trend data for charts
 */
router.get('/performance-trends', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const querySchema = z.object({
      period: z.enum(['7d', '30d', '90d', '1y']).optional().default('30d'),
      metric: z.enum(['score', 'issues', 'audits']).optional().default('score')
    });

    const { period, metric } = querySchema.parse(req.query);
    const userId = req.user!.id;
    const userTeamId = req.user!.teamId;

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    
    switch (period) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(endDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
    }

    let whereConditions = [
      eq(audits.status, 'completed'),
      gte(audits.completedAt, startDate),
      lte(audits.completedAt, endDate)
    ];

    if (userTeamId) {
      whereConditions.push(eq(audits.teamId, userTeamId));
    } else {
      whereConditions.push(eq(audits.userId, userId));
    }

    const trendsAudits = await db
      .select()
      .from(audits)
      .where(and(...whereConditions))
      .orderBy(desc(audits.completedAt));

    // Group data by time periods and calculate trends
    const trendData = groupAuditsByPeriod(trendsAudits, period, metric);

    res.json({
      success: true,
      trends: {
        data: trendData,
        period,
        metric,
        totalDataPoints: trendData.length
      }
    });

  } catch (error) {
    console.error('[Dashboard API] Error fetching performance trends:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid query parameters',
        details: error.errors
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to fetch performance trends',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/dashboard/team-performance
 * Get team performance comparison (for team accounts)
 */
router.get('/team-performance', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;
    const userTeamId = req.user!.teamId;

    if (!userTeamId) {
      return res.status(403).json({
        success: false,
        error: 'Team performance data only available for team accounts'
      });
    }

    // Get team audits from last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const teamAudits = await db
      .select()
      .from(audits)
      .where(and(
        eq(audits.teamId, userTeamId),
        eq(audits.status, 'completed'),
        gte(audits.completedAt, thirtyDaysAgo)
      ))
      .orderBy(desc(audits.completedAt));

    // Group by user and calculate performance metrics
    const userPerformance = new Map();

    teamAudits.forEach(audit => {
      const userId = audit.userId;
      if (!userPerformance.has(userId)) {
        userPerformance.set(userId, {
          userId,
          audits: [],
          totalAudits: 0,
          avgScore: 0,
          totalIssues: 0,
          criticalIssues: 0
        });
      }

      const userStats = userPerformance.get(userId);
      userStats.audits.push(audit);
      userStats.totalAudits++;
      
      if (audit.results?.summary) {
        userStats.avgScore += audit.results.summary.overallScore || 0;
        userStats.totalIssues += (audit.results.summary.ofiCount || 0) + (audit.results.summary.priorityOfiCount || 0);
        userStats.criticalIssues += audit.results.summary.priorityOfiCount || 0;
      }
    });

    // Calculate averages
    const teamStats = Array.from(userPerformance.values()).map(stats => ({
      userId: stats.userId,
      totalAudits: stats.totalAudits,
      avgScore: stats.totalAudits > 0 ? Math.round(stats.avgScore / stats.totalAudits) : 0,
      totalIssues: stats.totalIssues,
      criticalIssues: stats.criticalIssues,
      avgIssuesPerAudit: stats.totalAudits > 0 ? Math.round(stats.totalIssues / stats.totalAudits) : 0
    }));

    res.json({
      success: true,
      teamPerformance: {
        teamId: userTeamId,
        period: 'Last 30 days',
        memberStats: teamStats,
        teamTotals: {
          totalAudits: teamAudits.length,
          avgTeamScore: teamStats.length > 0 
            ? Math.round(teamStats.reduce((sum, stat) => sum + stat.avgScore, 0) / teamStats.length)
            : 0,
          totalIssuesFound: teamStats.reduce((sum, stat) => sum + stat.totalIssues, 0),
          totalCriticalIssues: teamStats.reduce((sum, stat) => sum + stat.criticalIssues, 0)
        }
      }
    });

  } catch (error) {
    console.error('[Dashboard API] Error fetching team performance:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch team performance data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Helper functions

function calculateDateRange(timeframe: string): { start: Date | null; end: Date | null } {
  const end = new Date();
  let start: Date | null = null;

  switch (timeframe) {
    case 'week':
      start = new Date();
      start.setDate(end.getDate() - 7);
      break;
    case 'month':
      start = new Date();
      start.setMonth(end.getMonth() - 1);
      break;
    case 'quarter':
      start = new Date();
      start.setMonth(end.getMonth() - 3);
      break;
    case 'year':
      start = new Date();
      start.setFullYear(end.getFullYear() - 1);
      break;
  }

  return { start, end };
}

function groupAuditsByPeriod(audits: any[], period: string, metric: string): any[] {
  // Simplified implementation - would group by days/weeks/months based on period
  // and calculate the specified metric for each group
  
  const now = new Date();
  const groupedData: any[] = [];
  
  // Generate sample trend data based on period
  const dataPoints = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 12 : 12;
  
  for (let i = dataPoints - 1; i >= 0; i--) {
    const date = new Date(now);
    
    if (period === '7d') {
      date.setDate(date.getDate() - i);
    } else if (period === '30d') {
      date.setDate(date.getDate() - i);
    } else if (period === '90d') {
      date.setDate(date.getDate() - (i * 7)); // Weekly grouping
    } else {
      date.setMonth(date.getMonth() - i); // Monthly grouping
    }
    
    // Filter audits for this period
    const periodAudits = audits.filter(audit => {
      const auditDate = new Date(audit.completedAt);
      const nextPeriodDate = new Date(date);
      
      if (period === '7d' || period === '30d') {
        nextPeriodDate.setDate(nextPeriodDate.getDate() + 1);
      } else if (period === '90d') {
        nextPeriodDate.setDate(nextPeriodDate.getDate() + 7);
      } else {
        nextPeriodDate.setMonth(nextPeriodDate.getMonth() + 1);
      }
      
      return auditDate >= date && auditDate < nextPeriodDate;
    });
    
    let value = 0;
    
    switch (metric) {
      case 'score':
        value = periodAudits.length > 0 
          ? Math.round(periodAudits.reduce((sum, audit) => 
              sum + (audit.results?.summary?.overallScore || 0), 0) / periodAudits.length)
          : 0;
        break;
      case 'issues':
        value = periodAudits.reduce((sum, audit) => 
          sum + (audit.results?.summary?.ofiCount || 0) + (audit.results?.summary?.priorityOfiCount || 0), 0);
        break;
      case 'audits':
        value = periodAudits.length;
        break;
    }
    
    groupedData.push({
      date: date.toISOString().split('T')[0],
      value,
      audits: periodAudits.length
    });
  }
  
  return groupedData;
}

function getEmptyDashboard(): any {
  return {
    kpiMetrics: {
      overview: {
        totalAudits: 0,
        totalWebsites: 0,
        averageScore: 0,
        scoreDistribution: { excellent: 0, good: 0, average: 0, poor: 0 },
        scoreTrend: 0
      },
      categoryPerformance: {
        contentQuality: { score: 0, trend: 0, issues: 0, topOpportunities: [] },
        technicalSEO: { score: 0, trend: 0, issues: 0, topOpportunities: [] },
        localSEO: { score: 0, trend: 0, issues: 0, topOpportunities: [] },
        uxPerformance: { score: 0, trend: 0, issues: 0, topOpportunities: [] }
      },
      issueMetrics: {
        totalIssues: 0,
        criticalIssues: 0,
        resolvedIssues: 0,
        issueResolutionRate: 0,
        averageIssuesPerAudit: 0,
        mostCommonIssues: []
      },
      performanceMetrics: {
        averageAuditTime: 0,
        factorsAnalyzed: 0,
        averageFactorsPerAudit: 0,
        auditCompletionRate: 0,
        aiInsightsGenerated: 0
      }
    },
    roiAnalysis: {
      overview: { totalInvestment: 0, estimatedROI: 0, paybackPeriod: 0, netBenefit: 0 },
      impactMetrics: {},
      costBenefit: {},
      businessImpact: {}
    },
    competitiveIntelligence: {
      marketPosition: {},
      competitorAnalysis: {},
      strategicInsights: {}
    },
    actionPlanPrioritization: {
      immediate: { actions: [], estimatedImpact: '', timeframe: '', resources: '', expectedROI: '' },
      shortTerm: { actions: [], estimatedImpact: '', timeframe: '', resources: '', expectedROI: '' },
      mediumTerm: { actions: [], estimatedImpact: '', timeframe: '', resources: '', expectedROI: '' },
      longTerm: { actions: [], estimatedImpact: '', timeframe: '', resources: '', expectedROI: '' },
      budgetAllocation: { immediate: 0, shortTerm: 0, mediumTerm: 0, longTerm: 0 }
    },
    executiveSummary: {
      keyHighlights: ['No audit data available'],
      criticalFindings: ['Complete your first audit to see insights']
    }
  };
}

export default router;