/**
 * Admin API Routes
 * Phase 4: Performance & Scale administration endpoints
 */

import { Router, Request, Response } from 'express';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth';
import { enterpriseSecurityService } from '../services/security/enterprise-security.service';
import { monitoringService } from '../services/monitoring/monitoring.service';
import { webhookService, WebhookEventType } from '../services/integrations/webhook.service';
import { redisService } from '../services/cache/redis.service';
import { bullQueueService } from '../services/queue/bull-queue.service';
import { connectionPoolService } from '../services/database/connection-pool.service';
import { logger } from '../services/common/logger.service';

const router = Router();

// Admin authentication middleware (requires admin role)
const adminAuth = async (req: AuthenticatedRequest, res: Response, next: any) => {
  if (!req.user || req.user.role !== 'admin') {
    await enterpriseSecurityService.logSecurityEvent(
      'PERMISSION_DENIED' as any,
      req,
      { resource: 'admin_api', action: 'access_denied' },
      'blocked'
    );
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Apply auth middleware to all admin routes
router.use(authMiddleware);
router.use(adminAuth);

// =======================
// SYSTEM HEALTH & STATUS
// =======================

/**
 * GET /api/admin/system-status
 * Get comprehensive system status
 */
router.get('/system-status', async (req: Request, res: Response) => {
  try {
    const [dbHealth, queueStats, cacheStats, securityDashboard, performanceDashboard] = await Promise.all([
      connectionPoolService.healthCheck(),
      bullQueueService.getAllQueueStats(),
      redisService.getStats(),
      enterpriseSecurityService.getSecurityDashboard(),
      monitoringService.getPerformanceDashboard()
    ]);

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: dbHealth,
      queues: queueStats,
      cache: {
        connected: redisService.isConnected(),
        stats: cacheStats
      },
      security: securityDashboard,
      performance: performanceDashboard
    });
  } catch (error) {
    logger.error('Error getting system status', undefined, error instanceof Error ? error.message : String(error));
    res.status(500).json({ error: 'Failed to get system status' });
  }
});

/**
 * GET /api/admin/metrics
 * Get system metrics
 */
router.get('/metrics', async (req: Request, res: Response) => {
  try {
    const metrics = monitoringService.getMetricsSummary();
    res.json({
      metrics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Error getting metrics', undefined, error instanceof Error ? error.message : String(error));
    res.status(500).json({ error: 'Failed to get metrics' });
  }
});

/**
 * GET /api/admin/metrics/:metricName/history
 * Get metric history
 */
router.get('/metrics/:metricName/history', async (req: Request, res: Response) => {
  try {
    const { metricName } = req.params;
    const limit = parseInt(req.query.limit as string) || 100;
    
    const history = monitoringService.getMetricHistory(metricName, limit);
    res.json({
      metric: metricName,
      history,
      count: history.length
    });
  } catch (error) {
    logger.error('Error getting metric history', undefined, error instanceof Error ? error.message : String(error));
    res.status(500).json({ error: 'Failed to get metric history' });
  }
});

// =======================
// CACHE MANAGEMENT
// =======================

/**
 * GET /api/admin/cache/stats
 * Get cache statistics
 */
router.get('/cache/stats', async (req: Request, res: Response) => {
  try {
    const stats = redisService.getStats();
    const info = await redisService.getInfo();
    
    res.json({
      stats,
      info,
      connected: redisService.isConnected()
    });
  } catch (error) {
    logger.error('Error getting cache stats', undefined, error instanceof Error ? error.message : String(error));
    res.status(500).json({ error: 'Failed to get cache statistics' });
  }
});

/**
 * DELETE /api/admin/cache/flush
 * Flush all cache data
 */
router.delete('/cache/flush', async (req: Request, res: Response) => {
  try {
    const result = await redisService.flushAll();
    
    await enterpriseSecurityService.logSecurityEvent(
      'DATA_ACCESS' as any,
      req,
      { action: 'cache_flush', result }
    );
    
    res.json({
      success: result,
      message: result ? 'Cache flushed successfully' : 'Failed to flush cache'
    });
  } catch (error) {
    logger.error('Error flushing cache', undefined, error instanceof Error ? error.message : String(error));
    res.status(500).json({ error: 'Failed to flush cache' });
  }
});

/**
 * DELETE /api/admin/cache/pattern/:pattern
 * Delete cache entries by pattern
 */
router.delete('/cache/pattern/:pattern', async (req: Request, res: Response) => {
  try {
    const { pattern } = req.params;
    const deletedCount = await redisService.deletePattern(pattern);
    
    await enterpriseSecurityService.logSecurityEvent(
      'DATA_ACCESS' as any,
      req,
      { action: 'cache_pattern_delete', pattern, deletedCount }
    );
    
    res.json({
      pattern,
      deletedCount,
      message: `Deleted ${deletedCount} cache entries`
    });
  } catch (error) {
    logger.error('Error deleting cache pattern', undefined, error instanceof Error ? error.message : String(error));
    res.status(500).json({ error: 'Failed to delete cache pattern' });
  }
});

// =======================
// QUEUE MANAGEMENT
// =======================

/**
 * GET /api/admin/queues
 * Get queue statistics
 */
router.get('/queues', async (req: Request, res: Response) => {
  try {
    const stats = await bullQueueService.getAllQueueStats();
    res.json(stats);
  } catch (error) {
    logger.error('Error getting queue stats', undefined, error instanceof Error ? error.message : String(error));
    res.status(500).json({ error: 'Failed to get queue statistics' });
  }
});

/**
 * POST /api/admin/queues/:queueType/pause
 * Pause a queue
 */
router.post('/queues/:queueType/pause', async (req: Request, res: Response) => {
  try {
    const { queueType } = req.params;
    await bullQueueService.pauseQueue(queueType);
    
    await enterpriseSecurityService.logSecurityEvent(
      'SYSTEM_BREACH_ATTEMPT' as any,
      req,
      { action: 'queue_pause', queueType }
    );
    
    res.json({
      success: true,
      message: `Queue ${queueType} paused`
    });
  } catch (error) {
    logger.error('Error pausing queue', undefined, error instanceof Error ? error.message : String(error));
    res.status(500).json({ error: 'Failed to pause queue' });
  }
});

/**
 * POST /api/admin/queues/:queueType/resume
 * Resume a queue
 */
router.post('/queues/:queueType/resume', async (req: Request, res: Response) => {
  try {
    const { queueType } = req.params;
    await bullQueueService.resumeQueue(queueType);
    
    await enterpriseSecurityService.logSecurityEvent(
      'SYSTEM_BREACH_ATTEMPT' as any,
      req,
      { action: 'queue_resume', queueType }
    );
    
    res.json({
      success: true,
      message: `Queue ${queueType} resumed`
    });
  } catch (error) {
    logger.error('Error resuming queue', undefined, error instanceof Error ? error.message : String(error));
    res.status(500).json({ error: 'Failed to resume queue' });
  }
});

/**
 * DELETE /api/admin/queues/:queueType/clean
 * Clean old jobs from queue
 */
router.delete('/queues/:queueType/clean', async (req: Request, res: Response) => {
  try {
    const { queueType } = req.params;
    const grace = parseInt(req.query.grace as string) || 24 * 60 * 60 * 1000; // 24 hours default
    
    const cleanedCount = await bullQueueService.cleanQueue(queueType, grace);
    
    await enterpriseSecurityService.logSecurityEvent(
      'DATA_ACCESS' as any,
      req,
      { action: 'queue_clean', queueType, cleanedCount, grace }
    );
    
    res.json({
      queueType,
      cleanedCount,
      message: `Cleaned ${cleanedCount} jobs from queue ${queueType}`
    });
  } catch (error) {
    logger.error('Error cleaning queue', undefined, error instanceof Error ? error.message : String(error));
    res.status(500).json({ error: 'Failed to clean queue' });
  }
});

// =======================
// SECURITY MANAGEMENT
// =======================

/**
 * GET /api/admin/security/dashboard
 * Get security dashboard
 */
router.get('/security/dashboard', async (req: Request, res: Response) => {
  try {
    const dashboard = await enterpriseSecurityService.getSecurityDashboard();
    res.json(dashboard);
  } catch (error) {
    logger.error('Error getting security dashboard', undefined, error instanceof Error ? error.message : String(error));
    res.status(500).json({ error: 'Failed to get security dashboard' });
  }
});

/**
 * GET /api/admin/security/audit-logs
 * Export audit logs
 */
router.get('/security/audit-logs', async (req: Request, res: Response) => {
  try {
    const startDate = new Date(req.query.startDate as string || Date.now() - 7 * 24 * 60 * 60 * 1000);
    const endDate = new Date(req.query.endDate as string || Date.now());
    const format = (req.query.format as string) || 'json';
    
    const auditLogs = await enterpriseSecurityService.exportAuditLogs(startDate, endDate, format as any);
    
    await enterpriseSecurityService.logSecurityEvent(
      'DATA_EXPORT' as any,
      req,
      { action: 'audit_log_export', startDate, endDate, format }
    );
    
    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="audit-logs.csv"');
    } else {
      res.setHeader('Content-Type', 'application/json');
    }
    
    res.send(auditLogs);
  } catch (error) {
    logger.error('Error exporting audit logs', undefined, error instanceof Error ? error.message : String(error));
    res.status(500).json({ error: 'Failed to export audit logs' });
  }
});

// =======================
// WEBHOOK MANAGEMENT
// =======================

/**
 * GET /api/admin/webhooks
 * Get all webhooks
 */
router.get('/webhooks', async (req: Request, res: Response) => {
  try {
    // In a real implementation, this would get all webhooks from database
    const stats = webhookService.getOverallStats();
    res.json(stats);
  } catch (error) {
    logger.error('Error getting webhooks', undefined, error instanceof Error ? error.message : String(error));
    res.status(500).json({ error: 'Failed to get webhooks' });
  }
});

/**
 * POST /api/admin/webhooks/test
 * Test webhook system
 */
router.post('/webhooks/test', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { url, secret, event } = req.body;
    
    if (!url || !event) {
      return res.status(400).json({ error: 'URL and event are required' });
    }
    
    // Register a temporary webhook for testing
    const testWebhook = await webhookService.registerWebhook({
      url,
      secret: secret || 'test-secret',
      events: [event as WebhookEventType],
      active: true,
      retries: 1,
      timeout: 10000,
      userId: String(req.user!.id)
    });
    
    // Trigger the test event
    await webhookService.triggerWebhookEvent(
      event as WebhookEventType,
      { message: 'This is a test webhook', timestamp: new Date().toISOString() },
      String(req.user!.id)
    );
    
    // Clean up test webhook after a short delay
    setTimeout(async () => {
      await webhookService.deleteWebhook(testWebhook.id);
    }, 60000); // 1 minute
    
    res.json({
      success: true,
      message: 'Test webhook triggered',
      webhookId: testWebhook.id
    });
  } catch (error) {
    logger.error('Error testing webhook', undefined, error instanceof Error ? error.message : String(error));
    res.status(500).json({ error: 'Failed to test webhook' });
  }
});

// =======================
// MONITORING MANAGEMENT
// =======================

/**
 * GET /api/admin/alerts
 * Get active alerts
 */
router.get('/alerts', async (req: Request, res: Response) => {
  try {
    const alerts = monitoringService.getActiveAlerts();
    res.json({
      alerts,
      count: alerts.length
    });
  } catch (error) {
    logger.error('Error getting alerts', undefined, error instanceof Error ? error.message : String(error));
    res.status(500).json({ error: 'Failed to get alerts' });
  }
});

/**
 * GET /api/admin/alerts/history
 * Get alert history
 */
router.get('/alerts/history', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 100;
    const alerts = monitoringService.getAllAlerts(limit);
    res.json({
      alerts,
      count: alerts.length
    });
  } catch (error) {
    logger.error('Error getting alert history', undefined, error instanceof Error ? error.message : String(error));
    res.status(500).json({ error: 'Failed to get alert history' });
  }
});

/**
 * PUT /api/admin/monitoring/thresholds
 * Update monitoring thresholds
 */
router.put('/monitoring/thresholds', async (req: Request, res: Response) => {
  try {
    const thresholds = req.body;
    monitoringService.updateThresholds(thresholds);
    
    await enterpriseSecurityService.logSecurityEvent(
      'SYSTEM_BREACH_ATTEMPT' as any,
      req,
      { action: 'threshold_update', thresholds }
    );
    
    res.json({
      success: true,
      message: 'Monitoring thresholds updated'
    });
  } catch (error) {
    logger.error('Error updating thresholds', undefined, error instanceof Error ? error.message : String(error));
    res.status(500).json({ error: 'Failed to update thresholds' });
  }
});

// =======================
// DATABASE MANAGEMENT
// =======================

/**
 * GET /api/admin/database/health
 * Get database health
 */
router.get('/database/health', async (req: Request, res: Response) => {
  try {
    const health = await connectionPoolService.healthCheck();
    const metrics = connectionPoolService.getMetrics();
    const poolStats = connectionPoolService.getPoolStats();
    
    res.json({
      health,
      metrics,
      poolStats
    });
  } catch (error) {
    logger.error('Error getting database health', undefined, error instanceof Error ? error.message : String(error));
    res.status(500).json({ error: 'Failed to get database health' });
  }
});

/**
 * POST /api/admin/database/optimize
 * Optimize database connections
 */
router.post('/database/optimize', async (req: Request, res: Response) => {
  try {
    await connectionPoolService.optimizePool();
    
    await enterpriseSecurityService.logSecurityEvent(
      'SYSTEM_BREACH_ATTEMPT' as any,
      req,
      { action: 'database_optimize' }
    );
    
    res.json({
      success: true,
      message: 'Database optimization completed'
    });
  } catch (error) {
    logger.error('Error optimizing database', undefined, error instanceof Error ? error.message : String(error));
    res.status(500).json({ error: 'Failed to optimize database' });
  }
});

export default router;