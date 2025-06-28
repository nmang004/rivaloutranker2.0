/**
 * Load Balancer and Horizontal Scaling Service
 * Preparation for high-traffic periods and multi-instance deployment
 * Part of Phase 4: Performance & Scale
 */

import cluster from 'cluster';
import os from 'os';
import { logger } from '../common/logger.service';
import { redisService } from '../cache/redis.service';

// Instance health status
export interface InstanceHealth {
  instanceId: string;
  pid: number;
  status: 'healthy' | 'degraded' | 'unhealthy';
  cpuUsage: number;
  memoryUsage: number;
  requestCount: number;
  errorCount: number;
  uptime: number;
  lastCheck: string;
}

// Load balancing strategy
export enum LoadBalancingStrategy {
  ROUND_ROBIN = 'round_robin',
  LEAST_CONNECTIONS = 'least_connections',
  WEIGHTED_ROUND_ROBIN = 'weighted_round_robin',
  IP_HASH = 'ip_hash',
  RESOURCE_BASED = 'resource_based'
}

// Scaling configuration
export interface ScalingConfig {
  minInstances: number;
  maxInstances: number;
  targetCpuUtilization: number;
  targetMemoryUtilization: number;
  scaleUpThreshold: number;
  scaleDownThreshold: number;
  cooldownPeriod: number; // seconds
  strategy: LoadBalancingStrategy;
}

class LoadBalancerService {
  private instances: Map<string, InstanceHealth> = new Map();
  private currentInstance = 0;
  private scalingConfig: ScalingConfig;
  private lastScalingAction = 0;
  private isClusterMode = false;

  constructor() {
    this.scalingConfig = {
      minInstances: parseInt(process.env.MIN_INSTANCES || '1'),
      maxInstances: parseInt(process.env.MAX_INSTANCES || os.cpus().length.toString()),
      targetCpuUtilization: parseInt(process.env.TARGET_CPU_UTILIZATION || '70'),
      targetMemoryUtilization: parseInt(process.env.TARGET_MEMORY_UTILIZATION || '80'),
      scaleUpThreshold: parseInt(process.env.SCALE_UP_THRESHOLD || '80'),
      scaleDownThreshold: parseInt(process.env.SCALE_DOWN_THRESHOLD || '30'),
      cooldownPeriod: parseInt(process.env.SCALING_COOLDOWN || '300'), // 5 minutes
      strategy: (process.env.LOAD_BALANCING_STRATEGY as LoadBalancingStrategy) || LoadBalancingStrategy.ROUND_ROBIN
    };

    this.initializeClusterMode();
    this.startHealthMonitoring();
  }

  /**
   * Initialize cluster mode for horizontal scaling
   */
  private initializeClusterMode(): void {
    const enableCluster = process.env.ENABLE_CLUSTER === 'true';
    const numCPUs = os.cpus().length;
    
    if (enableCluster && cluster.isPrimary) {
      this.isClusterMode = true;
      
      logger.info(`Starting cluster mode with ${numCPUs} CPUs available`);
      logger.info(`Scaling config`, undefined, this.scalingConfig);

      // Fork initial workers
      const initialWorkers = Math.min(this.scalingConfig.minInstances, numCPUs);
      for (let i = 0; i < initialWorkers; i++) {
        this.forkWorker();
      }

      // Handle worker events
      cluster.on('exit', (worker, code, signal) => {
        logger.warn(`Worker ${worker.process.pid} died with code ${code} and signal ${signal}`);
        
        // Remove from instances
        this.instances.delete(worker.id.toString());
        
        // Restart worker if it wasn't intentionally killed
        if (!worker.exitedAfterDisconnect) {
          logger.info('Restarting worker...');
          this.forkWorker();
        }
      });

      cluster.on('online', (worker) => {
        logger.info(`Worker ${worker.process.pid} is online`);
        
        // Add to instances tracking
        this.instances.set(worker.id.toString(), {
          instanceId: worker.id.toString(),
          pid: worker.process.pid!,
          status: 'healthy',
          cpuUsage: 0,
          memoryUsage: 0,
          requestCount: 0,
          errorCount: 0,
          uptime: 0,
          lastCheck: new Date().toISOString()
        });
      });

      // Start auto-scaling monitoring
      this.startAutoScaling();
    }
  }

  /**
   * Fork a new worker
   */
  private forkWorker(): void {
    const worker = cluster.fork();
    
    // Set up worker communication
    worker.on('message', (message) => {
      this.handleWorkerMessage(worker.id.toString(), message);
    });
    
  }

  /**
   * Handle messages from workers
   */
  private handleWorkerMessage(workerId: string, message: any): void {
    const instance = this.instances.get(workerId);
    if (!instance) return;

    switch (message.type) {
      case 'health_update':
        instance.cpuUsage = message.data.cpuUsage;
        instance.memoryUsage = message.data.memoryUsage;
        instance.requestCount = message.data.requestCount;
        instance.errorCount = message.data.errorCount;
        instance.uptime = message.data.uptime;
        instance.lastCheck = new Date().toISOString();
        instance.status = this.calculateInstanceHealth(instance);
        break;
        
      case 'request_completed':
        instance.requestCount++;
        break;
        
      case 'request_error':
        instance.errorCount++;
        break;
    }
  }

  /**
   * Calculate instance health based on metrics
   */
  private calculateInstanceHealth(instance: InstanceHealth): 'healthy' | 'degraded' | 'unhealthy' {
    const { cpuUsage, memoryUsage, errorCount, requestCount } = instance;
    
    // Calculate error rate
    const errorRate = requestCount > 0 ? (errorCount / requestCount) * 100 : 0;
    
    // Determine health status
    if (cpuUsage > 90 || memoryUsage > 90 || errorRate > 10) {
      return 'unhealthy';
    } else if (cpuUsage > 70 || memoryUsage > 80 || errorRate > 5) {
      return 'degraded';
    }
    
    return 'healthy';
  }

  /**
   * Start health monitoring for all instances
   */
  private startHealthMonitoring(): void {
    setInterval(() => {
      this.updateInstanceMetrics();
      this.publishHealthStatus();
    }, 30000); // Every 30 seconds
  }

  /**
   * Update metrics for current instance (worker mode)
   */
  private updateInstanceMetrics(): void {
    if (cluster.isWorker && cluster.worker) {
      const memUsage = process.memoryUsage();
      const cpuUsage = process.cpuUsage();
      
      // Send health update to primary
      cluster.worker.send({
        type: 'health_update',
        data: {
          cpuUsage: this.calculateCpuUsage(cpuUsage),
          memoryUsage: (memUsage.heapUsed / memUsage.heapTotal) * 100,
          requestCount: this.getRequestCount(),
          errorCount: this.getErrorCount(),
          uptime: process.uptime()
        }
      });
    }
  }

  /**
   * Calculate CPU usage percentage
   */
  private calculateCpuUsage(cpuUsage: NodeJS.CpuUsage): number {
    // Simple CPU usage calculation
    // In production, you'd want a more sophisticated calculation
    const totalUsage = cpuUsage.user + cpuUsage.system;
    return Math.min(100, (totalUsage / 1000000) * 100); // Convert to percentage
  }

  /**
   * Get request count (would be tracked by middleware)
   */
  private getRequestCount(): number {
    // This would be implemented with actual request tracking
    return Math.floor(Math.random() * 1000);
  }

  /**
   * Get error count (would be tracked by middleware)
   */
  private getErrorCount(): number {
    // This would be implemented with actual error tracking
    return Math.floor(Math.random() * 10);
  }

  /**
   * Publish health status to Redis for load balancer visibility
   */
  private async publishHealthStatus(): Promise<void> {
    if (!this.isClusterMode) return;

    try {
      const healthData = {
        instances: Array.from(this.instances.values()),
        totalInstances: this.instances.size,
        healthyInstances: Array.from(this.instances.values()).filter(i => i.status === 'healthy').length,
        timestamp: new Date().toISOString()
      };

      await redisService.set('cluster:health', healthData, { ttl: 60 });
    } catch (error) {
      logger.error('Error publishing health status', undefined, error instanceof Error ? error.message : String(error));
    }
  }

  /**
   * Start auto-scaling monitoring
   */
  private startAutoScaling(): void {
    if (!this.isClusterMode) return;

    setInterval(() => {
      this.evaluateScaling();
    }, 60000); // Every minute
  }

  /**
   * Evaluate if scaling is needed
   */
  private evaluateScaling(): void {
    const now = Date.now();
    const timeSinceLastAction = (now - this.lastScalingAction) / 1000;
    
    // Respect cooldown period
    if (timeSinceLastAction < this.scalingConfig.cooldownPeriod) {
      return;
    }

    const instances = Array.from(this.instances.values());
    const healthyInstances = instances.filter(i => i.status === 'healthy');
    
    // Calculate average resource utilization
    const avgCpu = instances.reduce((sum, i) => sum + i.cpuUsage, 0) / instances.length;
    const avgMemory = instances.reduce((sum, i) => sum + i.memoryUsage, 0) / instances.length;
    
    // Determine scaling action
    const shouldScaleUp = (
      (avgCpu > this.scalingConfig.scaleUpThreshold || avgMemory > this.scalingConfig.scaleUpThreshold) &&
      instances.length < this.scalingConfig.maxInstances
    );
    
    const shouldScaleDown = (
      avgCpu < this.scalingConfig.scaleDownThreshold &&
      avgMemory < this.scalingConfig.scaleDownThreshold &&
      instances.length > this.scalingConfig.minInstances &&
      healthyInstances.length > 1
    );

    if (shouldScaleUp) {
      this.scaleUp();
    } else if (shouldScaleDown) {
      this.scaleDown();
    }
  }

  /**
   * Scale up by adding a new worker
   */
  private scaleUp(): void {
    logger.info('Scaling up: Adding new worker instance');
    this.forkWorker();
    this.lastScalingAction = Date.now();
    
    // Log scaling event
    this.logScalingEvent('scale_up', {
      newInstanceCount: this.instances.size + 1,
      reason: 'High resource utilization'
    });
  }

  /**
   * Scale down by removing a worker
   */
  private scaleDown(): void {
    const instances = Array.from(this.instances.values());
    
    // Find least utilized healthy instance
    const leastUtilized = instances
      .filter(i => i.status === 'healthy')
      .sort((a, b) => (a.cpuUsage + a.memoryUsage) - (b.cpuUsage + b.memoryUsage))[0];
    
    if (leastUtilized) {
      logger.info(`Scaling down: Removing worker ${leastUtilized.instanceId}`);
      
      // Gracefully disconnect worker
      const worker = cluster.workers?.[leastUtilized.instanceId];
      if (worker) {
        worker.disconnect();
      }
      
      this.lastScalingAction = Date.now();
      
      // Log scaling event
      this.logScalingEvent('scale_down', {
        removedInstanceId: leastUtilized.instanceId,
        newInstanceCount: this.instances.size - 1,
        reason: 'Low resource utilization'
      });
    }
  }

  /**
   * Log scaling events for monitoring
   */
  private logScalingEvent(action: string, details: any): void {
    const event = {
      action,
      timestamp: new Date().toISOString(),
      details,
      config: this.scalingConfig
    };
    
    logger.info('Auto-scaling event', undefined, event);
    
    // Store in Redis for monitoring dashboard
    redisService.set(`scaling_event:${Date.now()}`, event, { ttl: 24 * 60 * 60 }).catch(error => {
      logger.error('Error storing scaling event', undefined, error instanceof Error ? error.message : String(error));
    });
  }

  /**
   * Get load balancing target based on strategy
   */
  getLoadBalancingTarget(clientIP?: string): string | null {
    const healthyInstances = Array.from(this.instances.values())
      .filter(i => i.status === 'healthy');
    
    if (healthyInstances.length === 0) {
      return null;
    }

    switch (this.scalingConfig.strategy) {
      case LoadBalancingStrategy.ROUND_ROBIN:
        return this.roundRobinSelection(healthyInstances);
        
      case LoadBalancingStrategy.LEAST_CONNECTIONS:
        return this.leastConnectionsSelection(healthyInstances);
        
      case LoadBalancingStrategy.RESOURCE_BASED:
        return this.resourceBasedSelection(healthyInstances);
        
      case LoadBalancingStrategy.IP_HASH:
        return this.ipHashSelection(healthyInstances, clientIP);
        
      default:
        return this.roundRobinSelection(healthyInstances);
    }
  }

  /**
   * Round-robin load balancing
   */
  private roundRobinSelection(instances: InstanceHealth[]): string {
    const target = instances[this.currentInstance % instances.length];
    this.currentInstance = (this.currentInstance + 1) % instances.length;
    return target.instanceId;
  }

  /**
   * Least connections load balancing
   */
  private leastConnectionsSelection(instances: InstanceHealth[]): string {
    return instances.reduce((least, current) => 
      current.requestCount < least.requestCount ? current : least
    ).instanceId;
  }

  /**
   * Resource-based load balancing
   */
  private resourceBasedSelection(instances: InstanceHealth[]): string {
    return instances.reduce((best, current) => {
      const currentLoad = current.cpuUsage + current.memoryUsage;
      const bestLoad = best.cpuUsage + best.memoryUsage;
      return currentLoad < bestLoad ? current : best;
    }).instanceId;
  }

  /**
   * IP hash load balancing
   */
  private ipHashSelection(instances: InstanceHealth[], clientIP?: string): string {
    if (!clientIP) {
      return this.roundRobinSelection(instances);
    }
    
    // Simple hash of IP address
    const hash = clientIP.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const index = hash % instances.length;
    return instances[index].instanceId;
  }

  /**
   * Get cluster statistics
   */
  getClusterStats(): any {
    const instances = Array.from(this.instances.values());
    
    return {
      clusterMode: this.isClusterMode,
      totalInstances: instances.length,
      healthyInstances: instances.filter(i => i.status === 'healthy').length,
      degradedInstances: instances.filter(i => i.status === 'degraded').length,
      unhealthyInstances: instances.filter(i => i.status === 'unhealthy').length,
      averageCpuUsage: instances.reduce((sum, i) => sum + i.cpuUsage, 0) / instances.length,
      averageMemoryUsage: instances.reduce((sum, i) => sum + i.memoryUsage, 0) / instances.length,
      totalRequests: instances.reduce((sum, i) => sum + i.requestCount, 0),
      totalErrors: instances.reduce((sum, i) => sum + i.errorCount, 0),
      scalingConfig: this.scalingConfig,
      lastScalingAction: this.lastScalingAction
    };
  }

  /**
   * Update scaling configuration
   */
  updateScalingConfig(config: Partial<ScalingConfig>): void {
    this.scalingConfig = {
      ...this.scalingConfig,
      ...config
    };
    
    logger.info('Scaling configuration updated', undefined, this.scalingConfig);
  }

  /**
   * Manual scaling control
   */
  async manualScale(targetInstances: number): Promise<boolean> {
    if (targetInstances < this.scalingConfig.minInstances || 
        targetInstances > this.scalingConfig.maxInstances) {
      throw new Error(`Target instances must be between ${this.scalingConfig.minInstances} and ${this.scalingConfig.maxInstances}`);
    }

    const currentCount = this.instances.size;
    const difference = targetInstances - currentCount;

    if (difference > 0) {
      // Scale up
      for (let i = 0; i < difference; i++) {
        this.forkWorker();
      }
      logger.info(`Manually scaled up to ${targetInstances} instances`);
    } else if (difference < 0) {
      // Scale down
      const instancesToRemove = Math.abs(difference);
      const instances = Array.from(this.instances.values())
        .filter(i => i.status === 'healthy')
        .sort((a, b) => (a.cpuUsage + a.memoryUsage) - (b.cpuUsage + b.memoryUsage));

      for (let i = 0; i < instancesToRemove && i < instances.length; i++) {
        const worker = cluster.workers?.[instances[i].instanceId];
        if (worker) {
          worker.disconnect();
        }
      }
      logger.info(`Manually scaled down to ${targetInstances} instances`);
    }

    this.lastScalingAction = Date.now();
    return true;
  }
}

// Singleton instance
export const loadBalancerService = new LoadBalancerService();