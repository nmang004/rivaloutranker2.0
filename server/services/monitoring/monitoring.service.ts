/**
 * Enterprise Monitoring and Alerting Service
 * Comprehensive monitoring for Phase 4: Performance & Scale
 */

import crypto from 'crypto';
import { logger } from '../common/logger.service';
import { redisService } from '../cache/redis.service';
import { connectionPoolService } from '../database/connection-pool.service';
import { bullQueueService } from '../queue/bull-queue.service';
import { enterpriseSecurityService } from '../security/enterprise-security.service';

// Metric types
export enum MetricType {
  COUNTER = 'counter',
  GAUGE = 'gauge',
  HISTOGRAM = 'histogram',
  SUMMARY = 'summary'
}

// Metric severity levels
export enum AlertSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

// Metric interface
export interface Metric {
  name: string;
  type: MetricType;
  value: number;
  timestamp: string;
  labels?: Record<string, string>;
  unit?: string;
}

// Alert interface
export interface Alert {
  id: string;
  name: string;
  severity: AlertSeverity;
  message: string;
  metric: string;
  threshold: number;
  currentValue: number;
  timestamp: string;
  resolved: boolean;
  resolvedAt?: string;
}

// Performance thresholds
interface PerformanceThresholds {
  responseTime: {
    warning: number;
    critical: number;
  };
  errorRate: {
    warning: number;
    critical: number;
  };
  memoryUsage: {
    warning: number;
    critical: number;
  };
  diskUsage: {
    warning: number;
    critical: number;
  };
  cpuUsage: {
    warning: number;
    critical: number;
  };
  queueLength: {
    warning: number;
    critical: number;
  };
  cacheHitRate: {
    warning: number;
    critical: number;
  };
}

class MonitoringService {
  private metrics: Map<string, Metric[]> = new Map();
  private alerts: Alert[] = [];
  private activeAlerts: Set<string> = new Set();
  private isCollecting = false;
  private collectionInterval: NodeJS.Timeout | null = null;

  private thresholds: PerformanceThresholds = {
    responseTime: { warning: 1000, critical: 5000 }, // ms
    errorRate: { warning: 5, critical: 10 }, // percentage
    memoryUsage: { warning: 80, critical: 90 }, // percentage
    diskUsage: { warning: 80, critical: 90 }, // percentage
    cpuUsage: { warning: 70, critical: 85 }, // percentage
    queueLength: { warning: 100, critical: 500 }, // number of jobs
    cacheHitRate: { warning: 70, critical: 50 } // percentage (lower is worse)
  };

  constructor() {
    this.startMetricCollection();
  }

  /**
   * Start collecting metrics periodically
   */
  private startMetricCollection(): void {
    if (this.isCollecting) return;

    this.isCollecting = true;
    
    // Collect metrics every 30 seconds
    this.collectionInterval = setInterval(async () => {
      await this.collectSystemMetrics();
    }, 30000);

    logger.info('Monitoring service started - collecting metrics every 30 seconds');
  }

  /**
   * Stop metric collection
   */
  stopMetricCollection(): void {
    if (this.collectionInterval) {
      clearInterval(this.collectionInterval);
      this.collectionInterval = null;
    }
    this.isCollecting = false;
    logger.info('Monitoring service stopped');
  }

  /**
   * Record a custom metric
   */
  recordMetric(metric: Omit<Metric, 'timestamp'>): void {
    const fullMetric: Metric = {
      ...metric,
      timestamp: new Date().toISOString()
    };

    // Store in memory
    if (!this.metrics.has(metric.name)) {
      this.metrics.set(metric.name, []);
    }
    
    const metricHistory = this.metrics.get(metric.name)!;
    metricHistory.push(fullMetric);
    
    // Keep only last 1000 entries per metric
    if (metricHistory.length > 1000) {
      metricHistory.splice(0, metricHistory.length - 1000);
    }

    // Store in Redis for persistence
    this.storeMetricInRedis(fullMetric).catch(error => {
      logger.error('Error storing metric in Redis', undefined, error instanceof Error ? error.message : String(error));
    });

    // Check thresholds and trigger alerts
    this.checkThresholds(fullMetric);
  }

  /**
   * Collect comprehensive system metrics
   */
  private async collectSystemMetrics(): Promise<void> {
    try {
      const timestamp = new Date().toISOString();

      // System metrics
      const memUsage = process.memoryUsage();
      const cpuUsage = process.cpuUsage();

      this.recordMetric({
        name: 'system.memory.used',
        type: MetricType.GAUGE,
        value: memUsage.heapUsed,
        unit: 'bytes'
      });

      this.recordMetric({
        name: 'system.memory.total',
        type: MetricType.GAUGE,
        value: memUsage.heapTotal,
        unit: 'bytes'
      });

      this.recordMetric({
        name: 'system.cpu.user',
        type: MetricType.GAUGE,
        value: cpuUsage.user,
        unit: 'microseconds'
      });

      this.recordMetric({
        name: 'system.cpu.system',
        type: MetricType.GAUGE,
        value: cpuUsage.system,
        unit: 'microseconds'
      });

      // Database metrics
      const dbHealth = await connectionPoolService.healthCheck();
      const dbMetrics = connectionPoolService.getMetrics();

      this.recordMetric({
        name: 'database.response_time',
        type: MetricType.GAUGE,
        value: dbHealth.details.responseTime,
        unit: 'ms'
      });

      this.recordMetric({
        name: 'database.connections.total',
        type: MetricType.GAUGE,
        value: dbMetrics.connections.total,
        unit: 'count'
      });

      this.recordMetric({
        name: 'database.connections.idle',
        type: MetricType.GAUGE,
        value: dbMetrics.connections.idle,
        unit: 'count'
      });

      this.recordMetric({
        name: 'database.queries.total',
        type: MetricType.COUNTER,
        value: dbMetrics.totalQueries,
        unit: 'count'
      });

      this.recordMetric({
        name: 'database.queries.slow',
        type: MetricType.COUNTER,
        value: dbMetrics.slowQueries,
        unit: 'count'
      });

      this.recordMetric({
        name: 'database.queries.avg_time',
        type: MetricType.GAUGE,
        value: dbMetrics.avgExecutionTime,
        unit: 'ms'
      });

      // Redis metrics
      const redisStats = redisService.getStats();

      this.recordMetric({
        name: 'redis.cache.hits',
        type: MetricType.COUNTER,
        value: redisStats.hits,
        unit: 'count'
      });

      this.recordMetric({
        name: 'redis.cache.misses',
        type: MetricType.COUNTER,
        value: redisStats.misses,
        unit: 'count'
      });

      this.recordMetric({
        name: 'redis.cache.hit_rate',
        type: MetricType.GAUGE,
        value: redisStats.hitRate,
        unit: 'percentage'
      });

      this.recordMetric({
        name: 'redis.connected',
        type: MetricType.GAUGE,
        value: redisStats.isConnected ? 1 : 0,
        unit: 'boolean'
      });

      // Queue metrics
      const queueStats = await bullQueueService.getAllQueueStats();
      
      for (const [queueName, stats] of Object.entries(queueStats)) {
        this.recordMetric({
          name: 'queue.waiting',
          type: MetricType.GAUGE,
          value: stats.waiting,
          labels: { queue: queueName },
          unit: 'count'
        });

        this.recordMetric({
          name: 'queue.active',
          type: MetricType.GAUGE,
          value: stats.active,
          labels: { queue: queueName },
          unit: 'count'
        });

        this.recordMetric({
          name: 'queue.failed',
          type: MetricType.GAUGE,
          value: stats.failed,
          labels: { queue: queueName },
          unit: 'count'
        });
      }

      // Security metrics
      const securityDashboard = await enterpriseSecurityService.getSecurityDashboard();

      this.recordMetric({
        name: 'security.events.total',
        type: MetricType.COUNTER,
        value: securityDashboard.summary.totalEvents,
        unit: 'count'
      });

      this.recordMetric({
        name: 'security.requests.blocked',
        type: MetricType.COUNTER,
        value: securityDashboard.summary.blockedRequests,
        unit: 'count'
      });

      this.recordMetric({
        name: 'security.ips.suspicious',
        type: MetricType.GAUGE,
        value: securityDashboard.summary.suspiciousIPs,
        unit: 'count'
      });

      this.recordMetric({
        name: 'security.ips.blocked',
        type: MetricType.GAUGE,
        value: securityDashboard.summary.blockedIPs,
        unit: 'count'
      });

      logger.debug('System metrics collected successfully');
    } catch (error) {
      logger.error('Error collecting system metrics', undefined, error instanceof Error ? error.message : String(error));
      
      this.recordMetric({
        name: 'monitoring.collection.errors',
        type: MetricType.COUNTER,
        value: 1,
        unit: 'count'
      });
    }
  }

  /**
   * Store metric in Redis for persistence
   */
  private async storeMetricInRedis(metric: Metric): Promise<void> {
    const key = `metrics:${metric.name}:${Date.now()}`;
    await redisService.set(key, metric, { ttl: 7 * 24 * 60 * 60 }); // 7 days
  }

  /**
   * Check metric thresholds and trigger alerts
   */
  private checkThresholds(metric: Metric): void {
    const alertChecks = [
      {
        metricName: 'database.response_time',
        threshold: this.thresholds.responseTime,
        alertName: 'High Database Response Time'
      },
      {
        metricName: 'redis.cache.hit_rate',
        threshold: this.thresholds.cacheHitRate,
        alertName: 'Low Cache Hit Rate',
        reverse: true // Lower values are worse
      },
      {
        metricName: 'queue.waiting',
        threshold: this.thresholds.queueLength,
        alertName: 'High Queue Length'
      }
    ];

    for (const check of alertChecks) {
      if (metric.name === check.metricName) {
        let severity: AlertSeverity | null = null;

        if (check.reverse) {
          if (metric.value <= check.threshold.critical) {
            severity = AlertSeverity.CRITICAL;
          } else if (metric.value <= check.threshold.warning) {
            severity = AlertSeverity.WARNING;
          }
        } else {
          if (metric.value >= check.threshold.critical) {
            severity = AlertSeverity.CRITICAL;
          } else if (metric.value >= check.threshold.warning) {
            severity = AlertSeverity.WARNING;
          }
        }

        if (severity) {
          this.triggerAlert({
            name: check.alertName,
            severity,
            metric: metric.name,
            threshold: check.reverse ? check.threshold.critical : check.threshold.critical,
            currentValue: metric.value,
            message: `${check.alertName}: ${metric.value}${metric.unit ? ` ${metric.unit}` : ''}`
          });
        } else {
          // Check if we should resolve any existing alerts
          this.resolveAlert(check.alertName);
        }
      }
    }
  }

  /**
   * Trigger an alert
   */
  private triggerAlert(alertData: {
    name: string;
    severity: AlertSeverity;
    metric: string;
    threshold: number;
    currentValue: number;
    message: string;
  }): void {
    const alertId = `${alertData.name}:${alertData.metric}`;
    
    // Don't create duplicate alerts
    if (this.activeAlerts.has(alertId)) {
      return;
    }

    const alert: Alert = {
      id: crypto.randomUUID(),
      ...alertData,
      timestamp: new Date().toISOString(),
      resolved: false
    };

    this.alerts.push(alert);
    this.activeAlerts.add(alertId);

    // Log the alert
    logger.warn(`ALERT: ${alert.message}`, undefined, {
      severity: alert.severity,
      metric: alert.metric,
      currentValue: alert.currentValue,
      threshold: alert.threshold
    });

    // Store in Redis
    redisService.set(`alert:${alert.id}`, alert, { ttl: 30 * 24 * 60 * 60 }).catch(error => {
      logger.error('Error storing alert in Redis', undefined, error instanceof Error ? error.message : String(error));
    });

    // Send notification (in production, integrate with external services)
    this.sendAlertNotification(alert);
  }

  /**
   * Resolve an alert
   */
  private resolveAlert(alertName: string): void {
    const alertId = `${alertName}:${alertName}`;
    
    if (this.activeAlerts.has(alertId)) {
      // Find and resolve the alert
      const alert = this.alerts.find(a => 
        a.name === alertName && !a.resolved
      );
      
      if (alert) {
        alert.resolved = true;
        alert.resolvedAt = new Date().toISOString();
        
        this.activeAlerts.delete(alertId);
        
        logger.info(`ALERT RESOLVED: ${alertName}`);
        
        // Update in Redis
        redisService.set(`alert:${alert.id}`, alert, { ttl: 30 * 24 * 60 * 60 }).catch(error => {
          logger.error('Error updating alert in Redis', undefined, error instanceof Error ? error.message : String(error));
        });
      }
    }
  }

  /**
   * Send alert notification
   */
  private sendAlertNotification(alert: Alert): void {
    // In production, integrate with:
    // - Email notifications
    // - Slack/Teams
    // - PagerDuty
    // - SMS alerts
    // - Webhook endpoints
    
    logger.info(`Alert notification sent: ${alert.name}`, undefined, {
      severity: alert.severity,
      message: alert.message
    });
  }

  /**
   * Get current metrics summary
   */
  getMetricsSummary(): Record<string, any> {
    const summary: Record<string, any> = {};
    
    for (const [metricName, metricHistory] of this.metrics) {
      if (metricHistory.length > 0) {
        const latest = metricHistory[metricHistory.length - 1];
        summary[metricName] = {
          value: latest.value,
          timestamp: latest.timestamp,
          unit: latest.unit,
          labels: latest.labels
        };
      }
    }
    
    return summary;
  }

  /**
   * Get metric history
   */
  getMetricHistory(metricName: string, limit: number = 100): Metric[] {
    const history = this.metrics.get(metricName) || [];
    return history.slice(-limit);
  }

  /**
   * Get active alerts
   */
  getActiveAlerts(): Alert[] {
    return this.alerts.filter(alert => !alert.resolved);
  }

  /**
   * Get all alerts
   */
  getAllAlerts(limit: number = 100): Alert[] {
    return this.alerts.slice(-limit);
  }

  /**
   * Get performance dashboard data
   */
  getPerformanceDashboard(): any {
    const metrics = this.getMetricsSummary();
    const activeAlerts = this.getActiveAlerts();
    
    return {
      timestamp: new Date().toISOString(),
      status: activeAlerts.length === 0 ? 'healthy' : 
              activeAlerts.some(a => a.severity === AlertSeverity.CRITICAL) ? 'critical' : 'warning',
      metrics: {
        system: {
          memory: metrics['system.memory.used']?.value || 0,
          cpu: {
            user: metrics['system.cpu.user']?.value || 0,
            system: metrics['system.cpu.system']?.value || 0
          }
        },
        database: {
          responseTime: metrics['database.response_time']?.value || 0,
          connections: metrics['database.connections.total']?.value || 0,
          queries: metrics['database.queries.total']?.value || 0
        },
        cache: {
          hitRate: metrics['redis.cache.hit_rate']?.value || 0,
          connected: metrics['redis.connected']?.value === 1
        },
        security: {
          totalEvents: metrics['security.events.total']?.value || 0,
          blockedRequests: metrics['security.requests.blocked']?.value || 0
        }
      },
      alerts: {
        active: activeAlerts.length,
        critical: activeAlerts.filter(a => a.severity === AlertSeverity.CRITICAL).length,
        warning: activeAlerts.filter(a => a.severity === AlertSeverity.WARNING).length
      },
      thresholds: this.thresholds
    };
  }

  /**
   * Update performance thresholds
   */
  updateThresholds(newThresholds: Partial<PerformanceThresholds>): void {
    this.thresholds = {
      ...this.thresholds,
      ...newThresholds
    };
    
    logger.info('Performance thresholds updated', undefined, newThresholds);
  }
}

// Singleton instance
export const monitoringService = new MonitoringService();