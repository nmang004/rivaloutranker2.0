/**
 * Webhook Service
 * RESTful API with webhook system for third-party integrations
 * Part of Phase 4: Performance & Scale
 */

import crypto from 'crypto';
import axios from 'axios';
import { logger } from '../common/logger.service';
import { redisService } from '../cache/redis.service';
import { bullQueueService } from '../queue/bull-queue.service';

// Webhook event types
export enum WebhookEventType {
  AUDIT_COMPLETED = 'audit.completed',
  AUDIT_FAILED = 'audit.failed',
  ANALYSIS_COMPLETED = 'analysis.completed',
  ANALYSIS_FAILED = 'analysis.failed',
  USER_REGISTERED = 'user.registered',
  USER_UPDATED = 'user.updated',
  TEAM_CREATED = 'team.created',
  TEAM_UPDATED = 'team.updated',
  REPORT_GENERATED = 'report.generated',
  ALERT_TRIGGERED = 'alert.triggered',
  SECURITY_BREACH = 'security.breach'
}

// Webhook configuration
export interface WebhookConfig {
  id: string;
  url: string;
  secret: string;
  events: WebhookEventType[];
  active: boolean;
  retries: number;
  timeout: number;
  userId: string;
  teamId?: string;
  createdAt: string;
  updatedAt: string;
  lastDelivery?: {
    timestamp: string;
    status: 'success' | 'failed';
    responseCode?: number;
    error?: string;
  };
}

// Webhook payload
export interface WebhookPayload {
  id: string;
  event: WebhookEventType;
  timestamp: string;
  data: any;
  userId: string;
  teamId?: string;
  signature?: string;
}

// Webhook delivery attempt
export interface WebhookDelivery {
  id: string;
  webhookId: string;
  payloadId: string;
  url: string;
  attempt: number;
  status: 'pending' | 'success' | 'failed';
  responseCode?: number;
  responseTime?: number;
  error?: string;
  timestamp: string;
}

class WebhookService {
  private webhooks: Map<string, WebhookConfig> = new Map();
  private deliveryQueue: string = 'webhook-delivery';
  private maxRetries = 3;
  private defaultTimeout = 30000; // 30 seconds

  constructor() {
    this.initializeWebhookQueue();
  }

  /**
   * Initialize webhook delivery queue
   */
  private async initializeWebhookQueue(): Promise<void> {
    // This would be integrated with Bull Queue for reliable delivery
    logger.info('Webhook delivery queue initialized');
  }

  /**
   * Register a new webhook
   */
  async registerWebhook(config: Omit<WebhookConfig, 'id' | 'createdAt' | 'updatedAt'>): Promise<WebhookConfig> {
    const webhook: WebhookConfig = {
      id: crypto.randomUUID(),
      ...config,
      secret: config.secret || this.generateWebhookSecret(),
      retries: config.retries || this.maxRetries,
      timeout: config.timeout || this.defaultTimeout,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Validate webhook URL
    if (!this.isValidUrl(webhook.url)) {
      throw new Error('Invalid webhook URL');
    }

    // Test webhook endpoint
    const testResult = await this.testWebhookEndpoint(webhook.url, webhook.secret);
    if (!testResult.success) {
      throw new Error(`Webhook endpoint test failed: ${testResult.error}`);
    }

    // Store webhook configuration
    this.webhooks.set(webhook.id, webhook);
    
    // Persist to Redis
    await redisService.set(`webhook:${webhook.id}`, webhook, { ttl: 365 * 24 * 60 * 60 }); // 1 year

    logger.info(`Webhook registered: ${webhook.id} for user ${webhook.userId}`);
    
    return webhook;
  }

  /**
   * Update webhook configuration
   */
  async updateWebhook(webhookId: string, updates: Partial<WebhookConfig>): Promise<WebhookConfig | null> {
    const webhook = this.webhooks.get(webhookId);
    if (!webhook) {
      return null;
    }

    const updatedWebhook: WebhookConfig = {
      ...webhook,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    // Validate URL if it's being updated
    if (updates.url && !this.isValidUrl(updates.url)) {
      throw new Error('Invalid webhook URL');
    }

    this.webhooks.set(webhookId, updatedWebhook);
    await redisService.set(`webhook:${webhookId}`, updatedWebhook, { ttl: 365 * 24 * 60 * 60 });

    logger.info(`Webhook updated: ${webhookId}`);
    
    return updatedWebhook;
  }

  /**
   * Delete webhook
   */
  async deleteWebhook(webhookId: string): Promise<boolean> {
    const webhook = this.webhooks.get(webhookId);
    if (!webhook) {
      return false;
    }

    this.webhooks.delete(webhookId);
    await redisService.delete(`webhook:${webhookId}`);

    logger.info(`Webhook deleted: ${webhookId}`);
    
    return true;
  }

  /**
   * Get webhook by ID
   */
  async getWebhook(webhookId: string): Promise<WebhookConfig | null> {
    // Try memory first
    let webhook = this.webhooks.get(webhookId);
    
    if (!webhook) {
      // Try Redis
      webhook = await redisService.get<WebhookConfig>(`webhook:${webhookId}`) || undefined;
      if (webhook) {
        this.webhooks.set(webhookId, webhook);
      }
    }
    
    return webhook || null;
  }

  /**
   * Get webhooks for a user
   */
  async getUserWebhooks(userId: string): Promise<WebhookConfig[]> {
    const userWebhooks: WebhookConfig[] = [];
    
    for (const webhook of this.webhooks.values()) {
      if (webhook.userId === userId) {
        userWebhooks.push(webhook);
      }
    }
    
    return userWebhooks;
  }

  /**
   * Trigger webhook event
   */
  async triggerWebhookEvent(
    event: WebhookEventType,
    data: any,
    userId: string,
    teamId?: string
  ): Promise<void> {
    // Find webhooks subscribed to this event
    const targetWebhooks = Array.from(this.webhooks.values()).filter(webhook => 
      webhook.active &&
      webhook.events.includes(event) &&
      (webhook.userId === userId || webhook.teamId === teamId)
    );

    if (targetWebhooks.length === 0) {
      logger.debug(`No webhooks found for event ${event}`);
      return;
    }

    // Create webhook payload
    const payload: WebhookPayload = {
      id: crypto.randomUUID(),
      event,
      timestamp: new Date().toISOString(),
      data,
      userId,
      teamId
    };

    // Queue delivery for each webhook
    for (const webhook of targetWebhooks) {
      await this.queueWebhookDelivery(webhook, payload);
    }

    logger.info(`Triggered ${targetWebhooks.length} webhooks for event ${event}`);
  }

  /**
   * Queue webhook delivery
   */
  private async queueWebhookDelivery(webhook: WebhookConfig, payload: WebhookPayload): Promise<void> {
    // Sign the payload
    payload.signature = this.signPayload(payload, webhook.secret);

    // Create delivery record
    const delivery: WebhookDelivery = {
      id: crypto.randomUUID(),
      webhookId: webhook.id,
      payloadId: payload.id,
      url: webhook.url,
      attempt: 1,
      status: 'pending',
      timestamp: new Date().toISOString()
    };

    // Store delivery record
    await redisService.set(`webhook_delivery:${delivery.id}`, delivery, { ttl: 7 * 24 * 60 * 60 }); // 7 days

    // Queue for delivery using Bull Queue
    await bullQueueService.addEmailJob({
      to: [], // This would be adapted for webhook delivery
      subject: 'webhook_delivery',
      template: 'webhook',
      data: {
        webhook,
        payload,
        delivery
      }
    }, {
      attempts: webhook.retries,
      backoff: {
        type: 'exponential',
        delay: 5000
      },
      delay: 0
    });

    logger.debug(`Queued webhook delivery: ${delivery.id}`);
  }

  /**
   * Deliver webhook (called by queue processor)
   */
  async deliverWebhook(
    webhook: WebhookConfig,
    payload: WebhookPayload,
    delivery: WebhookDelivery
  ): Promise<{ success: boolean; responseCode?: number; error?: string; responseTime: number }> {
    const startTime = Date.now();

    try {
      // Prepare headers
      const headers = {
        'Content-Type': 'application/json',
        'User-Agent': 'Rival-Outranker-Webhooks/2.0',
        'X-Webhook-Event': payload.event,
        'X-Webhook-ID': payload.id,
        'X-Webhook-Timestamp': payload.timestamp,
        'X-Webhook-Signature': payload.signature || ''
      };

      // Make HTTP request
      const response = await axios.post(webhook.url, payload, {
        headers,
        timeout: webhook.timeout,
        validateStatus: (status) => status < 500 // Don't throw on 4xx errors
      });

      const responseTime = Date.now() - startTime;

      // Update delivery record
      delivery.status = response.status < 400 ? 'success' : 'failed';
      delivery.responseCode = response.status;
      delivery.responseTime = responseTime;

      // Update webhook last delivery
      webhook.lastDelivery = {
        timestamp: new Date().toISOString(),
        status: delivery.status,
        responseCode: response.status
      };

      await this.updateWebhook(webhook.id, webhook);
      await redisService.set(`webhook_delivery:${delivery.id}`, delivery, { ttl: 7 * 24 * 60 * 60 });

      logger.info(`Webhook delivered successfully: ${delivery.id} (${responseTime}ms)`);

      return {
        success: delivery.status === 'success',
        responseCode: response.status,
        responseTime
      };

    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      const errorMessage = error.response?.data || error.message || 'Unknown error';

      // Update delivery record
      delivery.status = 'failed';
      delivery.responseCode = error.response?.status;
      delivery.responseTime = responseTime;
      delivery.error = errorMessage;

      // Update webhook last delivery
      webhook.lastDelivery = {
        timestamp: new Date().toISOString(),
        status: 'failed',
        responseCode: error.response?.status,
        error: errorMessage
      };

      await this.updateWebhook(webhook.id, webhook);
      await redisService.set(`webhook_delivery:${delivery.id}`, delivery, { ttl: 7 * 24 * 60 * 60 });

      logger.error(`Webhook delivery failed: ${delivery.id}`, undefined, {
        error: errorMessage,
        responseCode: error.response?.status,
        responseTime
      });

      return {
        success: false,
        responseCode: error.response?.status,
        error: errorMessage,
        responseTime
      };
    }
  }

  /**
   * Test webhook endpoint
   */
  private async testWebhookEndpoint(url: string, secret: string): Promise<{ success: boolean; error?: string }> {
    try {
      const testPayload = {
        id: 'test',
        event: 'test.webhook',
        timestamp: new Date().toISOString(),
        data: { message: 'This is a test webhook' }
      };

      const signature = this.signPayload(testPayload, secret);

      const response = await axios.post(url, testPayload, {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Rival-Outranker-Webhooks/2.0',
          'X-Webhook-Event': 'test.webhook',
          'X-Webhook-Signature': signature
        },
        timeout: 10000, // 10 seconds for test
        validateStatus: (status) => true // Don't throw on any status
      });

      // Accept 2xx and 4xx (endpoint exists but may reject test)
      return {
        success: response.status < 500
      };

    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Generate webhook secret
   */
  private generateWebhookSecret(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Sign webhook payload
   */
  private signPayload(payload: any, secret: string): string {
    const payloadString = JSON.stringify(payload);
    return crypto
      .createHmac('sha256', secret)
      .update(payloadString)
      .digest('hex');
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
    
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  }

  /**
   * Validate URL
   */
  private isValidUrl(url: string): boolean {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.protocol === 'https:' || parsedUrl.protocol === 'http:';
    } catch {
      return false;
    }
  }

  /**
   * Get webhook statistics
   */
  async getWebhookStats(webhookId: string): Promise<any> {
    // This would query delivery records from Redis
    // For now, return basic stats
    const webhook = await this.getWebhook(webhookId);
    if (!webhook) {
      return null;
    }

    return {
      webhookId,
      totalDeliveries: 0, // Would be calculated from delivery records
      successfulDeliveries: 0,
      failedDeliveries: 0,
      averageResponseTime: 0,
      lastDelivery: webhook.lastDelivery
    };
  }

  /**
   * Get all webhook statistics
   */
  getOverallStats(): any {
    const totalWebhooks = this.webhooks.size;
    const activeWebhooks = Array.from(this.webhooks.values()).filter(w => w.active).length;

    return {
      totalWebhooks,
      activeWebhooks,
      inactiveWebhooks: totalWebhooks - activeWebhooks,
      supportedEvents: Object.values(WebhookEventType)
    };
  }
}

// Singleton instance
export const webhookService = new WebhookService();

// Helper functions for common webhook triggers
export const WebhookTriggers = {
  /**
   * Trigger audit completed webhook
   */
  async auditCompleted(auditId: string, userId: string, teamId?: string, auditData?: any): Promise<void> {
    await webhookService.triggerWebhookEvent(
      WebhookEventType.AUDIT_COMPLETED,
      { auditId, ...auditData },
      userId,
      teamId
    );
  },

  /**
   * Trigger analysis completed webhook
   */
  async analysisCompleted(analysisId: string, userId: string, teamId?: string, analysisData?: any): Promise<void> {
    await webhookService.triggerWebhookEvent(
      WebhookEventType.ANALYSIS_COMPLETED,
      { analysisId, ...analysisData },
      userId,
      teamId
    );
  },

  /**
   * Trigger user registered webhook
   */
  async userRegistered(userId: string, userData?: any): Promise<void> {
    await webhookService.triggerWebhookEvent(
      WebhookEventType.USER_REGISTERED,
      { userId, ...userData },
      userId
    );
  },

  /**
   * Trigger security breach webhook
   */
  async securityBreach(incident: any, userId?: string, teamId?: string): Promise<void> {
    await webhookService.triggerWebhookEvent(
      WebhookEventType.SECURITY_BREACH,
      incident,
      userId || 'system',
      teamId
    );
  }
};