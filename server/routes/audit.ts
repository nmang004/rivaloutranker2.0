import { Router } from 'express';
import { z } from 'zod';
import { auditTypeSchema, insertAuditSchema } from '@/shared/schemas/audit';
import { EnhancedAuditService } from '../services/audit/enhanced-audit.service';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth';
import { broadcastAuditProgress } from '../index';

const router = Router();

// Initialize Enhanced Audit Service
const auditService = new EnhancedAuditService();

/**
 * POST /api/audit
 * Enhanced SEO Audit (140+ factors) with real-time WebSocket updates
 */
router.post('/', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const requestSchema = z.object({
      url: z.string().url(),
      title: z.string().optional(),
      type: auditTypeSchema.optional().default('comprehensive'),
      config: z.object({
        maxPages: z.number().min(1).max(100).optional().default(20),
        includeSubdomains: z.boolean().optional().default(false),
        analyzeCompetitors: z.boolean().optional().default(false),
        competitorUrls: z.array(z.string().url()).optional(),
        focusAreas: z.array(z.string()).optional(),
        customFactors: z.array(z.object({
          name: z.string(),
          category: z.string(),
          importance: z.enum(['High', 'Medium', 'Low'])
        })).optional()
      }).optional()
    });

    const { url, title, type, config } = requestSchema.parse(req.body);
    const userId = req.user!.id;
    const teamId = req.user!.teamId;

    console.log(`[Audit API] Starting enhanced audit for ${url}`);

    // Start comprehensive audit
    const audit = await auditService.startAudit({
      url,
      title: title || `Audit of ${new URL(url).hostname}`,
      type,
      config: config || {},
      userId,
      teamId
    });

    res.json({
      success: true,
      auditId: audit.id,
      status: audit.status,
      url: audit.url,
      estimatedTime: '5-15 minutes',
      progress: 0,
      message: 'Enhanced audit started successfully',
      websocketInfo: {
        subscribeMessage: {
          type: 'subscribe_audit',
          auditId: audit.id
        }
      }
    });

  } catch (error) {
    console.error('[Audit API] Error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
        details: error.errors
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to start audit',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/audit/:id
 * Get audit results by ID
 */
router.get('/:id', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const auditId = parseInt(req.params.id);
    const userId = req.user!.id;

    const audit = await auditService.getAudit(auditId, userId);
    
    if (!audit) {
      return res.status(404).json({
        success: false,
        error: 'Audit not found'
      });
    }

    res.json({
      success: true,
      audit: {
        id: audit.id,
        url: audit.url,
        title: audit.title,
        type: audit.type,
        status: audit.status,
        progress: audit.progress,
        results: audit.results,
        metrics: audit.metrics,
        config: audit.config,
        startedAt: audit.startedAt,
        completedAt: audit.completedAt,
        createdAt: audit.createdAt
      }
    });

  } catch (error) {
    console.error('[Audit API] Error fetching audit:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch audit',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/audit/:id/status
 * Get audit status and progress for real-time polling
 */
router.get('/:id/status', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const auditId = parseInt(req.params.id);
    const userId = req.user!.id;

    const status = await auditService.getAuditStatus(auditId, userId);
    
    if (!status) {
      return res.status(404).json({
        success: false,
        error: 'Audit not found'
      });
    }

    res.json({
      success: true,
      ...status
    });

  } catch (error) {
    console.error('[Audit API] Error fetching status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch audit status',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/audit
 * List user's audits with pagination and filtering
 */
router.get('/', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const querySchema = z.object({
      page: z.string().transform(Number).pipe(z.number().int().min(1)).optional().default('1'),
      limit: z.string().transform(Number).pipe(z.number().int().min(1).max(100)).optional().default('20'),
      type: auditTypeSchema.optional(),
      status: z.enum(['pending', 'running', 'completed', 'failed']).optional(),
      url: z.string().optional()
    });

    const { page, limit, type, status, url } = querySchema.parse(req.query);
    const userId = req.user!.id;

    const result = await auditService.getUserAudits(userId, {
      page: Number(page),
      limit: Number(limit),
      type,
      status,
      url
    });

    res.json({
      success: true,
      ...result
    });

  } catch (error) {
    console.error('[Audit API] Error listing audits:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid query parameters',
        details: error.errors
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to fetch audits',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * DELETE /api/audit/:id
 * Delete an audit
 */
router.delete('/:id', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const auditId = parseInt(req.params.id);
    const userId = req.user!.id;

    await auditService.deleteAudit(auditId, userId);

    res.json({
      success: true,
      message: 'Audit deleted successfully'
    });

  } catch (error) {
    console.error('[Audit API] Error deleting audit:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete audit',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/audit/:id/cancel
 * Cancel a running audit
 */
router.post('/:id/cancel', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const auditId = parseInt(req.params.id);
    const userId = req.user!.id;

    await auditService.cancelAudit(auditId, userId);

    // Broadcast cancellation
    broadcastAuditProgress(auditId.toString(), {
      status: 'cancelled',
      progress: 0,
      message: 'Audit cancelled by user'
    });

    res.json({
      success: true,
      message: 'Audit cancelled successfully'
    });

  } catch (error) {
    console.error('[Audit API] Error cancelling audit:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cancel audit',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/audit/:id/regenerate
 * Regenerate an audit with same configuration
 */
router.post('/:id/regenerate', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const auditId = parseInt(req.params.id);
    const userId = req.user!.id;

    const newAudit = await auditService.regenerateAudit(auditId, userId);

    res.json({
      success: true,
      auditId: newAudit.id,
      status: newAudit.status,
      message: 'Audit regeneration started successfully'
    });

  } catch (error) {
    console.error('[Audit API] Error regenerating audit:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to regenerate audit',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/audit/:id/export/:format
 * Export audit results in various formats
 */
router.get('/:id/export/:format', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const auditId = parseInt(req.params.id);
    const format = req.params.format as 'excel' | 'pdf' | 'csv';
    const userId = req.user!.id;

    if (!['excel', 'pdf', 'csv'].includes(format)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid export format. Supported: excel, pdf, csv'
      });
    }

    const exportResult = await auditService.exportAudit(auditId, userId, format);

    if (exportResult.buffer) {
      // Return file directly
      res.set({
        'Content-Type': exportResult.mimeType,
        'Content-Disposition': `attachment; filename="${exportResult.filename}"`
      });
      res.send(exportResult.buffer);
    } else {
      // Return download URL
      res.json({
        success: true,
        downloadUrl: exportResult.url,
        filename: exportResult.filename,
        expiresAt: exportResult.expiresAt
      });
    }

  } catch (error) {
    console.error('[Audit API] Error exporting audit:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export audit',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/audit/:id/white-label-report
 * Generate white-label report for agencies
 */
router.post('/:id/white-label-report', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const auditId = parseInt(req.params.id);
    const userId = req.user!.id;
    
    const requestSchema = z.object({
      agencyName: z.string().min(1),
      clientName: z.string().min(1),
      agencyLogo: z.string().url().optional(),
      reportTitle: z.string().optional(),
      brandColors: z.object({
        primary: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
        secondary: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
        accent: z.string().regex(/^#[0-9A-Fa-f]{6}$/)
      }).optional(),
      includeExecutiveSummary: z.boolean().optional().default(true),
      includeTechnicalDetails: z.boolean().optional().default(true),
      includeImplementationGuide: z.boolean().optional().default(true),
      customSections: z.array(z.object({
        title: z.string(),
        content: z.string(),
        order: z.number()
      })).optional(),
      format: z.enum(['excel', 'pdf', 'html']).optional().default('excel')
    });

    const reportConfig = requestSchema.parse(req.body);
    const { format, ...config } = reportConfig;

    console.log(`[Audit API] Generating white-label report for ${config.agencyName} - ${config.clientName}`);

    const reportResult = await auditService.generateWhiteLabelReport(
      auditId,
      userId,
      config,
      format
    );

    // Return file directly
    res.set({
      'Content-Type': reportResult.mimeType,
      'Content-Disposition': `attachment; filename="${reportResult.filename}"`
    });
    res.send(reportResult.buffer);

  } catch (error) {
    console.error('[Audit API] Error generating white-label report:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid report configuration',
        details: error.errors
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to generate white-label report',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/audit/:id/history
 * Get audit history and changes over time
 */
router.get('/:id/history', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const auditId = parseInt(req.params.id);
    const userId = req.user!.id;

    const history = await auditService.getAuditHistory(auditId, userId);

    res.json({
      success: true,
      history
    });

  } catch (error) {
    console.error('[Audit API] Error fetching audit history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch audit history',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/audit/:id/comments
 * Add comment to audit or specific factor
 */
router.post('/:id/comments', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const auditId = parseInt(req.params.id);
    const userId = req.user!.id;
    
    const commentSchema = z.object({
      content: z.string().min(1),
      factorName: z.string().optional()
    });

    const { content, factorName } = commentSchema.parse(req.body);

    const comment = await auditService.addComment(auditId, userId, {
      content,
      factorName
    });

    res.json({
      success: true,
      comment
    });

  } catch (error) {
    console.error('[Audit API] Error adding comment:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid comment data',
        details: error.errors
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to add comment',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/audit/:id/comments
 * Get comments for audit
 */
router.get('/:id/comments', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const auditId = parseInt(req.params.id);
    const userId = req.user!.id;

    const comments = await auditService.getComments(auditId, userId);

    res.json({
      success: true,
      comments
    });

  } catch (error) {
    console.error('[Audit API] Error fetching comments:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch comments',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;