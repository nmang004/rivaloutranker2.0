/**
 * Bull Queue Service
 * Background job processing for heavy operations
 * Part of Phase 4: Performance & Scale
 */

import Bull, { Queue, Job, JobOptions } from 'bull';
import { redisService } from '../cache/redis.service';
import { logger } from '../common/logger.service';

// Job types
export interface AuditJobData {
  auditId: string;
  url: string;
  userId: string;
  teamId?: string;
  options: {
    depth: number;
    includeSubdomains: boolean;
    followExternalLinks: boolean;
    skipImages: boolean;
    mobile: boolean;
  };
}

export interface AnalysisJobData {
  analysisId: string;
  url: string;
  type: 'standard' | 'enhanced';
  userId: string;
  options: {
    includeCompetitors: boolean;
    aiInsights: boolean;
  };
}

export interface CrawlJobData {
  crawlId: string;
  url: string;
  depth: number;
  options: {
    respectRobots: boolean;
    maxPages: number;
    timeout: number;
  };
}

export interface ReportJobData {
  reportId: string;
  auditId: string;
  format: 'pdf' | 'excel' | 'csv';
  userId: string;
  branding?: {
    logo: string;
    colors: Record<string, string>;
    companyName: string;
  };
}

export interface EmailJobData {
  to: string[];
  subject: string;
  template: string;
  data: Record<string, any>;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType: string;
  }>;
}

// Job priorities
export enum JobPriority {
  CRITICAL = 1,
  HIGH = 2,
  NORMAL = 3,
  LOW = 4,
  BACKGROUND = 5
}

class BullQueueService {
  private queues: Map<string, Queue> = new Map();
  private isInitialized = false;

  // Queue configurations
  private queueConfigs = {
    audit: {
      name: 'audit-processing',
      concurrency: 3,
      settings: {
        stalledInterval: 30 * 1000,
        maxStalledCount: 1,
        retryProcessDelay: 5 * 1000,
        backoffStrategies: {
          exponential: (attemptsMade: number) => Math.pow(2, attemptsMade) * 1000
        }
      }
    },
    analysis: {
      name: 'analysis-processing',
      concurrency: 5,
      settings: {
        stalledInterval: 30 * 1000,
        maxStalledCount: 1,
        retryProcessDelay: 3 * 1000
      }
    },
    crawl: {
      name: 'crawl-processing',
      concurrency: 2,
      settings: {
        stalledInterval: 60 * 1000,
        maxStalledCount: 1,
        retryProcessDelay: 10 * 1000
      }
    },
    report: {
      name: 'report-generation',
      concurrency: 4,
      settings: {
        stalledInterval: 45 * 1000,
        maxStalledCount: 2,
        retryProcessDelay: 5 * 1000
      }
    },
    email: {
      name: 'email-sending',
      concurrency: 10,
      settings: {
        stalledInterval: 15 * 1000,
        maxStalledCount: 3,
        retryProcessDelay: 2 * 1000
      }
    },
    cleanup: {
      name: 'cleanup-tasks',
      concurrency: 1,
      settings: {
        stalledInterval: 120 * 1000,
        maxStalledCount: 1,
        retryProcessDelay: 60 * 1000
      }
    }
  };

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      let redisConfig: any;

      if (process.env.REDIS_URL && process.env.REDIS_URL.includes('railway.internal')) {
        // Railway Redis connection
        const publicUrl = process.env.REDIS_PUBLIC_URL || process.env.REDIS_URL;
        redisConfig = publicUrl;
      } else if (process.env.REDIS_URL) {
        // Standard Redis URL
        redisConfig = process.env.REDIS_URL;
      } else {
        // Individual config
        redisConfig = {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379'),
          password: process.env.REDIS_PASSWORD,
          db: parseInt(process.env.REDIS_DB || '1'), // Use different DB for queues
          maxRetriesPerRequest: 3,
          retryDelayOnFailover: 100,
          connectTimeout: 10000,
          commandTimeout: 5000
        };
      }

      // Initialize all queues
      for (const [queueType, config] of Object.entries(this.queueConfigs)) {
        const queue = new Bull(config.name, {
          redis: redisConfig,
          defaultJobOptions: {
            attempts: 3,
            backoff: {
              type: 'exponential',
              delay: 2000
            },
            removeOnComplete: 100, // Keep last 100 completed jobs
            removeOnFail: 50       // Keep last 50 failed jobs
          },
          settings: config.settings
        });

        // Set up event listeners
        this.setupQueueEventListeners(queue, queueType);
        
        this.queues.set(queueType, queue);
      }

      // Initialize job processors
      await this.initializeProcessors();

      this.isInitialized = true;
      logger.info('Bull Queue Service initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize Bull Queue Service', undefined, error instanceof Error ? error.message : String(error));
      throw error;
    }
  }

  private setupQueueEventListeners(queue: Queue, queueType: string): void {
    queue.on('ready', () => {
      logger.info(`Queue ${queueType} is ready`);
    });

    queue.on('error', (error) => {
      logger.error(`Queue ${queueType} error`, undefined, error instanceof Error ? error.message : String(error));
    });

    queue.on('waiting', (jobId) => {
      logger.debug(`Job ${jobId} is waiting in queue ${queueType}`);
    });

    queue.on('active', (job) => {
      logger.info(`Job ${job.id} started in queue ${queueType}`);
    });

    queue.on('completed', (job, result) => {
      logger.info(`Job ${job.id} completed in queue ${queueType}`);
    });

    queue.on('failed', (job, err) => {
      logger.error(`Job ${job.id} failed in queue ${queueType}`, undefined, err instanceof Error ? err.message : String(err));
    });

    queue.on('stalled', (job) => {
      logger.warn(`Job ${job.id} stalled in queue ${queueType}`);
    });
  }

  private async initializeProcessors(): Promise<void> {
    // Audit processing
    const auditQueue = this.queues.get('audit')!;
    auditQueue.process(this.queueConfigs.audit.concurrency, this.processAuditJob.bind(this));

    // Analysis processing
    const analysisQueue = this.queues.get('analysis')!;
    analysisQueue.process(this.queueConfigs.analysis.concurrency, this.processAnalysisJob.bind(this));

    // Crawl processing
    const crawlQueue = this.queues.get('crawl')!;
    crawlQueue.process(this.queueConfigs.crawl.concurrency, this.processCrawlJob.bind(this));

    // Report generation
    const reportQueue = this.queues.get('report')!;
    reportQueue.process(this.queueConfigs.report.concurrency, this.processReportJob.bind(this));

    // Email sending
    const emailQueue = this.queues.get('email')!;
    emailQueue.process(this.queueConfigs.email.concurrency, this.processEmailJob.bind(this));

    // Cleanup tasks
    const cleanupQueue = this.queues.get('cleanup')!;
    cleanupQueue.process(this.queueConfigs.cleanup.concurrency, this.processCleanupJob.bind(this));
  }

  /**
   * Add audit job to queue
   */
  async addAuditJob(data: AuditJobData, options: JobOptions = {}): Promise<Job<AuditJobData>> {
    const queue = this.queues.get('audit')!;
    
    const jobOptions: JobOptions = {
      priority: JobPriority.HIGH,
      delay: 0,
      ...options
    };

    return queue.add('process-audit', data, jobOptions);
  }

  /**
   * Add analysis job to queue
   */
  async addAnalysisJob(data: AnalysisJobData, options: JobOptions = {}): Promise<Job<AnalysisJobData>> {
    const queue = this.queues.get('analysis')!;
    
    const jobOptions: JobOptions = {
      priority: JobPriority.NORMAL,
      delay: 0,
      ...options
    };

    return queue.add('process-analysis', data, jobOptions);
  }

  /**
   * Add crawl job to queue
   */
  async addCrawlJob(data: CrawlJobData, options: JobOptions = {}): Promise<Job<CrawlJobData>> {
    const queue = this.queues.get('crawl')!;
    
    const jobOptions: JobOptions = {
      priority: JobPriority.NORMAL,
      delay: 0,
      ...options
    };

    return queue.add('process-crawl', data, jobOptions);
  }

  /**
   * Add report generation job to queue
   */
  async addReportJob(data: ReportJobData, options: JobOptions = {}): Promise<Job<ReportJobData>> {
    const queue = this.queues.get('report')!;
    
    const jobOptions: JobOptions = {
      priority: JobPriority.NORMAL,
      delay: 0,
      ...options
    };

    return queue.add('generate-report', data, jobOptions);
  }

  /**
   * Add email job to queue
   */
  async addEmailJob(data: EmailJobData, options: JobOptions = {}): Promise<Job<EmailJobData>> {
    const queue = this.queues.get('email')!;
    
    const jobOptions: JobOptions = {
      priority: JobPriority.LOW,
      delay: 0,
      ...options
    };

    return queue.add('send-email', data, jobOptions);
  }

  /**
   * Add cleanup job to queue
   */
  async addCleanupJob(data: any, options: JobOptions = {}): Promise<Job> {
    const queue = this.queues.get('cleanup')!;
    
    const jobOptions: JobOptions = {
      priority: JobPriority.BACKGROUND,
      delay: 0,
      ...options
    };

    return queue.add('cleanup-task', data, jobOptions);
  }

  /**
   * Get job by ID
   */
  async getJob(queueType: string, jobId: string): Promise<Job | null> {
    const queue = this.queues.get(queueType);
    if (!queue) {
      return null;
    }

    return queue.getJob(jobId);
  }

  /**
   * Get queue statistics
   */
  async getQueueStats(queueType: string): Promise<any> {
    const queue = this.queues.get(queueType);
    if (!queue) {
      return null;
    }

    const [waiting, active, completed, failed, delayed] = await Promise.all([
      queue.getWaiting(),
      queue.getActive(),
      queue.getCompleted(),
      queue.getFailed(),
      queue.getDelayed()
    ]);

    return {
      waiting: waiting.length,
      active: active.length,
      completed: completed.length,
      failed: failed.length,
      delayed: delayed.length,
      total: waiting.length + active.length + completed.length + failed.length + delayed.length
    };
  }

  /**
   * Get all queue statistics
   */
  async getAllQueueStats(): Promise<Record<string, any>> {
    const stats: Record<string, any> = {};
    
    for (const queueType of this.queues.keys()) {
      stats[queueType] = await this.getQueueStats(queueType);
    }
    
    return stats;
  }

  /**
   * Pause queue
   */
  async pauseQueue(queueType: string): Promise<void> {
    const queue = this.queues.get(queueType);
    if (queue) {
      await queue.pause();
      logger.info(`Queue ${queueType} paused`);
    }
  }

  /**
   * Resume queue
   */
  async resumeQueue(queueType: string): Promise<void> {
    const queue = this.queues.get(queueType);
    if (queue) {
      await queue.resume();
      logger.info(`Queue ${queueType} resumed`);
    }
  }

  /**
   * Clean queue (remove old jobs)
   */
  async cleanQueue(queueType: string, grace: number = 24 * 60 * 60 * 1000): Promise<number> {
    const queue = this.queues.get(queueType);
    if (!queue) {
      return 0;
    }

    const cleanedJobs = await queue.clean(grace, 'completed');
    logger.info(`Cleaned ${cleanedJobs.length} completed jobs from queue ${queueType}`);
    
    return cleanedJobs.length;
  }

  /**
   * Shutdown all queues
   */
  async shutdown(): Promise<void> {
    logger.info('Shutting down Bull Queue Service...');
    
    for (const [queueType, queue] of this.queues) {
      try {
        await queue.close();
        logger.info(`Queue ${queueType} closed`);
      } catch (error) {
        logger.error(`Error closing queue ${queueType}`, undefined, error instanceof Error ? error.message : String(error));
      }
    }
    
    this.isInitialized = false;
  }

  // Job processors (to be implemented)
  private async processAuditJob(job: Job<AuditJobData>): Promise<any> {
    // Implementation will be added when integrating with audit service
    logger.info(`Processing audit job ${job.id}`);
    return { status: 'placeholder' };
  }

  private async processAnalysisJob(job: Job<AnalysisJobData>): Promise<any> {
    // Implementation will be added when integrating with analysis service
    logger.info(`Processing analysis job ${job.id}`);
    return { status: 'placeholder' };
  }

  private async processCrawlJob(job: Job<CrawlJobData>): Promise<any> {
    // Implementation will be added when integrating with crawl service
    logger.info(`Processing crawl job ${job.id}`);
    return { status: 'placeholder' };
  }

  private async processReportJob(job: Job<ReportJobData>): Promise<any> {
    // Implementation will be added when integrating with report service
    logger.info(`Processing report job ${job.id}`);
    return { status: 'placeholder' };
  }

  private async processEmailJob(job: Job<EmailJobData>): Promise<any> {
    // Implementation will be added when integrating with email service
    logger.info(`Processing email job ${job.id}`);
    return { status: 'placeholder' };
  }

  private async processCleanupJob(job: Job): Promise<any> {
    // Implementation for cleanup tasks
    logger.info(`Processing cleanup job ${job.id}`);
    return { status: 'placeholder' };
  }
}

// Singleton instance
export const bullQueueService = new BullQueueService();

// Scheduled job helpers
export const ScheduledJobs = {
  /**
   * Schedule daily cleanup job
   */
  async scheduleDailyCleanup(): Promise<void> {
    const cleanupData = {
      type: 'daily-cleanup',
      timestamp: new Date().toISOString()
    };

    await bullQueueService.addCleanupJob(cleanupData, {
      repeat: { cron: '0 2 * * *' }, // Daily at 2 AM
      jobId: 'daily-cleanup'
    });
  },

  /**
   * Schedule cache warming job
   */
  async scheduleCacheWarming(): Promise<void> {
    const warmingData = {
      type: 'cache-warming',
      timestamp: new Date().toISOString()
    };

    await bullQueueService.addCleanupJob(warmingData, {
      repeat: { cron: '0 1 * * *' }, // Daily at 1 AM
      jobId: 'cache-warming'
    });
  },

  /**
   * Schedule report cleanup job
   */
  async scheduleReportCleanup(): Promise<void> {
    const cleanupData = {
      type: 'report-cleanup',
      timestamp: new Date().toISOString()
    };

    await bullQueueService.addCleanupJob(cleanupData, {
      repeat: { cron: '0 3 * * 0' }, // Weekly on Sunday at 3 AM
      jobId: 'report-cleanup'
    });
  }
};