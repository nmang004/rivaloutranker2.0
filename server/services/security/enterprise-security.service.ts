/**
 * Enterprise Security Service
 * SOC 2 compliance preparation and advanced security features
 * Part of Phase 4: Performance & Scale
 */

import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../common/logger.service';
import { redisService } from '../cache/redis.service';

// Security event types for audit logging
export enum SecurityEventType {
  LOGIN_SUCCESS = 'login_success',
  LOGIN_FAILURE = 'login_failure',
  LOGIN_ATTEMPT_BLOCKED = 'login_attempt_blocked',
  PASSWORD_CHANGE = 'password_change',
  PERMISSION_ESCALATION = 'permission_escalation',
  PERMISSION_DENIED = 'permission_denied',
  DATA_ACCESS = 'data_access',
  DATA_EXPORT = 'data_export',
  API_KEY_CREATED = 'api_key_created',
  API_KEY_REVOKED = 'api_key_revoked',
  SUSPICIOUS_ACTIVITY = 'suspicious_activity',
  RATE_LIMIT_EXCEEDED = 'rate_limit_exceeded',
  MALICIOUS_REQUEST = 'malicious_request',
  SYSTEM_BREACH_ATTEMPT = 'system_breach_attempt'
}

// Security levels
export enum SecurityLevel {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  CRITICAL = 4
}

// Audit log entry interface
export interface AuditLogEntry {
  id: string;
  timestamp: string;
  eventType: SecurityEventType;
  severity: SecurityLevel;
  userId?: string;
  userEmail?: string;
  ipAddress: string;
  userAgent: string;
  resource: string;
  action: string;
  details: Record<string, any>;
  outcome: 'success' | 'failure' | 'blocked';
  sessionId?: string;
  geolocation?: {
    country?: string;
    region?: string;
    city?: string;
  };
}

// Threat detection patterns
export interface ThreatPattern {
  id: string;
  name: string;
  pattern: RegExp | string;
  severity: SecurityLevel;
  action: 'log' | 'block' | 'alert';
  description: string;
}

class EnterpriseSecurityService {
  private auditLogs: AuditLogEntry[] = [];
  private threatPatterns: ThreatPattern[] = [];
  private suspiciousIPs: Set<string> = new Set();
  private blockedIPs: Set<string> = new Set();
  private encryptionKey: Buffer;

  constructor() {
    this.encryptionKey = this.deriveEncryptionKey();
    this.initializeThreatPatterns();
    this.startPeriodicCleanup();
  }

  /**
   * Derive encryption key from environment
   */
  private deriveEncryptionKey(): Buffer {
    const secret = process.env.ENCRYPTION_SECRET || 'default-development-secret-key';
    return crypto.scryptSync(secret, 'salt', 32);
  }

  /**
   * Initialize threat detection patterns
   */
  private initializeThreatPatterns(): void {
    this.threatPatterns = [
      {
        id: 'sql_injection',
        name: 'SQL Injection',
        pattern: /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\b.*\b(from|where|and|or)\b)|(\-\-)|(\#)/i,
        severity: SecurityLevel.CRITICAL,
        action: 'block',
        description: 'Potential SQL injection attempt detected'
      },
      {
        id: 'xss_attempt',
        name: 'Cross-Site Scripting',
        pattern: /<script[^>]*>.*?<\/script>|javascript:|on\w+\s*=/i,
        severity: SecurityLevel.HIGH,
        action: 'block',
        description: 'Potential XSS attack detected'
      },
      {
        id: 'path_traversal',
        name: 'Path Traversal',
        pattern: /(\.\.[\/\\]){2,}|(\.[\/\\]){3,}/,
        severity: SecurityLevel.HIGH,
        action: 'block',
        description: 'Path traversal attempt detected'
      },
      {
        id: 'command_injection',
        name: 'Command Injection',
        pattern: /[;&|`$(){}[\]]/,
        severity: SecurityLevel.CRITICAL,
        action: 'block',
        description: 'Command injection attempt detected'
      },
      {
        id: 'suspicious_user_agent',
        name: 'Suspicious User Agent',
        pattern: /sqlmap|nmap|nikto|burp|w3af|havij/i,
        severity: SecurityLevel.MEDIUM,
        action: 'log',
        description: 'Suspicious user agent detected'
      },
      {
        id: 'rapid_requests',
        name: 'Rapid Requests',
        pattern: 'rate_based', // Special marker for rate-based detection
        severity: SecurityLevel.MEDIUM,
        action: 'alert',
        description: 'Rapid request pattern detected'
      }
    ];
  }

  /**
   * Log security event for audit trail
   */
  async logSecurityEvent(
    eventType: SecurityEventType,
    req: Request,
    details: Record<string, any> = {},
    outcome: 'success' | 'failure' | 'blocked' = 'success'
  ): Promise<void> {
    const auditEntry: AuditLogEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      eventType,
      severity: this.getEventSeverity(eventType),
      userId: (req as any).user?.id,
      userEmail: (req as any).user?.email,
      ipAddress: this.getClientIP(req),
      userAgent: req.get('User-Agent') || 'unknown',
      resource: req.path,
      action: req.method,
      details,
      outcome,
      sessionId: (req as any).sessionID,
      geolocation: await this.getGeolocation(this.getClientIP(req))
    };

    // Store in memory (in production, this would go to a persistent audit log database)
    this.auditLogs.push(auditEntry);

    // Also store in Redis for distributed systems
    await redisService.set(
      `audit:${auditEntry.id}`,
      auditEntry,
      { ttl: 365 * 24 * 60 * 60 } // 1 year retention
    );

    // Log to file for compliance
    logger.info('Security audit event', undefined, auditEntry);

    // Trigger alerts for high-severity events
    if (auditEntry.severity >= SecurityLevel.HIGH) {
      await this.triggerSecurityAlert(auditEntry);
    }
  }

  /**
   * Threat detection middleware
   */
  threatDetectionMiddleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      const clientIP = this.getClientIP(req);

      // Check if IP is blocked
      if (this.blockedIPs.has(clientIP)) {
        this.logSecurityEvent(
          SecurityEventType.MALICIOUS_REQUEST,
          req,
          { reason: 'Blocked IP attempted access' },
          'blocked'
        );
        return res.status(403).json({ error: 'Access denied' });
      }

      // Check for threat patterns in URL, query params, and body
      const requestData = {
        url: req.url,
        query: JSON.stringify(req.query),
        body: JSON.stringify(req.body),
        userAgent: req.get('User-Agent') || ''
      };

      for (const pattern of this.threatPatterns) {
        if (pattern.pattern === 'rate_based') continue; // Skip rate-based patterns

        const regex = pattern.pattern as RegExp;
        const combinedData = Object.values(requestData).join(' ');

        if (regex.test(combinedData)) {
          const details = {
            pattern: pattern.name,
            severity: pattern.severity,
            description: pattern.description,
            matchedData: combinedData.substring(0, 500) // Limit data size
          };

          if (pattern.action === 'block') {
            this.logSecurityEvent(
              SecurityEventType.MALICIOUS_REQUEST,
              req,
              details,
              'blocked'
            );
            this.addSuspiciousIP(clientIP);
            return res.status(400).json({ error: 'Request blocked by security filter' });
          } else {
            this.logSecurityEvent(
              SecurityEventType.SUSPICIOUS_ACTIVITY,
              req,
              details,
              'success'
            );
          }
        }
      }

      next();
    };
  }

  /**
   * Advanced rate limiting with threat detection
   */
  advancedRateLimiting(options: {
    windowMs: number;
    maxRequests: number;
    skipSuccessfulRequests?: boolean;
  }) {
    return async (req: Request, res: Response, next: NextFunction) => {
      const clientIP = this.getClientIP(req);
      const key = `rate_limit:${clientIP}`;
      
      try {
        const current = await redisService.get<number>(key) || 0;
        
        if (current >= options.maxRequests) {
          await this.logSecurityEvent(
            SecurityEventType.RATE_LIMIT_EXCEEDED,
            req,
            { 
              currentRequests: current,
              maxRequests: options.maxRequests,
              windowMs: options.windowMs
            },
            'blocked'
          );
          
          // Add to suspicious IPs after multiple rate limit violations
          if (current > options.maxRequests * 2) {
            this.addSuspiciousIP(clientIP);
          }
          
          return res.status(429).json({
            error: 'Too many requests',
            retryAfter: Math.ceil(options.windowMs / 1000)
          });
        }
        
        // Increment counter
        await redisService.set(key, current + 1, { ttl: Math.ceil(options.windowMs / 1000) });
        
        // Set rate limit headers
        res.set({
          'X-RateLimit-Limit': options.maxRequests.toString(),
          'X-RateLimit-Remaining': (options.maxRequests - current - 1).toString(),
          'X-RateLimit-Reset': new Date(Date.now() + options.windowMs).toISOString()
        });
        
        next();
      } catch (error) {
        logger.error('Rate limiting error', undefined, error instanceof Error ? error.message : String(error));
        next(); // Continue on error
      }
    };
  }

  /**
   * Data encryption for sensitive information
   */
  encryptSensitiveData(data: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', this.encryptionKey, iv);
    cipher.setAAD(Buffer.from('soc2-compliance'));
    
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
  }

  /**
   * Data decryption for sensitive information
   */
  decryptSensitiveData(encryptedData: string): string {
    const parts = encryptedData.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted data format');
    }
    
    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const encrypted = parts[2];
    
    const decipher = crypto.createDecipheriv('aes-256-gcm', this.encryptionKey, iv);
    decipher.setAAD(Buffer.from('soc2-compliance'));
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  /**
   * Generate secure API key
   */
  generateSecureAPIKey(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Hash API key for storage
   */
  hashAPIKey(apiKey: string): string {
    return crypto.createHash('sha256').update(apiKey).digest('hex');
  }

  /**
   * Verify API key
   */
  verifyAPIKey(providedKey: string, storedHash: string): boolean {
    const providedHash = this.hashAPIKey(providedKey);
    return crypto.timingSafeEqual(
      Buffer.from(providedHash, 'hex'),
      Buffer.from(storedHash, 'hex')
    );
  }

  /**
   * Generate secure session token
   */
  generateSessionToken(): string {
    return crypto.randomBytes(64).toString('hex');
  }

  /**
   * Get client IP address
   */
  private getClientIP(req: Request): string {
    return (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
           (req.headers['x-real-ip'] as string) ||
           req.connection.remoteAddress ||
           req.socket.remoteAddress ||
           'unknown';
  }

  /**
   * Get event severity based on type
   */
  private getEventSeverity(eventType: SecurityEventType): SecurityLevel {
    const severityMap: Record<SecurityEventType, SecurityLevel> = {
      [SecurityEventType.LOGIN_SUCCESS]: SecurityLevel.LOW,
      [SecurityEventType.LOGIN_FAILURE]: SecurityLevel.MEDIUM,
      [SecurityEventType.LOGIN_ATTEMPT_BLOCKED]: SecurityLevel.HIGH,
      [SecurityEventType.PASSWORD_CHANGE]: SecurityLevel.MEDIUM,
      [SecurityEventType.PERMISSION_ESCALATION]: SecurityLevel.HIGH,
      [SecurityEventType.PERMISSION_DENIED]: SecurityLevel.MEDIUM,
      [SecurityEventType.DATA_ACCESS]: SecurityLevel.LOW,
      [SecurityEventType.DATA_EXPORT]: SecurityLevel.MEDIUM,
      [SecurityEventType.API_KEY_CREATED]: SecurityLevel.MEDIUM,
      [SecurityEventType.API_KEY_REVOKED]: SecurityLevel.MEDIUM,
      [SecurityEventType.SUSPICIOUS_ACTIVITY]: SecurityLevel.MEDIUM,
      [SecurityEventType.RATE_LIMIT_EXCEEDED]: SecurityLevel.MEDIUM,
      [SecurityEventType.MALICIOUS_REQUEST]: SecurityLevel.HIGH,
      [SecurityEventType.SYSTEM_BREACH_ATTEMPT]: SecurityLevel.CRITICAL
    };

    return severityMap[eventType] || SecurityLevel.MEDIUM;
  }

  /**
   * Get geolocation from IP (mock implementation)
   */
  private async getGeolocation(ip: string): Promise<{ country?: string; region?: string; city?: string } | undefined> {
    // In production, integrate with a geolocation service like MaxMind
    // This is a mock implementation
    if (ip === 'unknown' || ip.startsWith('127.') || ip.startsWith('192.168.')) {
      return undefined;
    }
    
    return {
      country: 'Unknown',
      region: 'Unknown',
      city: 'Unknown'
    };
  }

  /**
   * Trigger security alert
   */
  private async triggerSecurityAlert(auditEntry: AuditLogEntry): Promise<void> {
    // In production, this would send alerts to security team
    // via email, Slack, PagerDuty, etc.
    logger.warn('SECURITY ALERT', undefined, JSON.stringify({
      eventType: auditEntry.eventType,
      severity: auditEntry.severity,
      ipAddress: auditEntry.ipAddress,
      details: auditEntry.details
    }));

    // Store high-severity events in a separate cache for immediate review
    await redisService.set(
      `security_alert:${auditEntry.id}`,
      auditEntry,
      { ttl: 7 * 24 * 60 * 60 } // 7 days
    );
  }

  /**
   * Add IP to suspicious list
   */
  private addSuspiciousIP(ip: string): void {
    this.suspiciousIPs.add(ip);
    
    // Auto-block after multiple suspicious activities
    const suspiciousCount = this.auditLogs.filter(
      entry => entry.ipAddress === ip && 
      entry.eventType === SecurityEventType.SUSPICIOUS_ACTIVITY
    ).length;
    
    if (suspiciousCount >= 5) {
      this.blockedIPs.add(ip);
      logger.warn(`IP ${ip} has been auto-blocked due to suspicious activity`);
    }
  }

  /**
   * Start periodic cleanup of old audit logs
   */
  private startPeriodicCleanup(): void {
    // Clean up old audit logs every hour
    setInterval(() => {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 30); // Keep 30 days
      
      this.auditLogs = this.auditLogs.filter(
        entry => new Date(entry.timestamp) > cutoff
      );
      
      logger.info(`Cleaned up old audit logs, ${this.auditLogs.length} entries remaining`);
    }, 60 * 60 * 1000); // Every hour
  }

  /**
   * Get security dashboard data
   */
  async getSecurityDashboard(): Promise<any> {
    const last24Hours = new Date();
    last24Hours.setHours(last24Hours.getHours() - 24);
    
    const recentEvents = this.auditLogs.filter(
      entry => new Date(entry.timestamp) > last24Hours
    );
    
    const eventsByType = recentEvents.reduce((acc, entry) => {
      acc[entry.eventType] = (acc[entry.eventType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const eventsBySeverity = recentEvents.reduce((acc, entry) => {
      const severity = SecurityLevel[entry.severity];
      acc[severity] = (acc[severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      summary: {
        totalEvents: recentEvents.length,
        blockedRequests: recentEvents.filter(e => e.outcome === 'blocked').length,
        suspiciousIPs: this.suspiciousIPs.size,
        blockedIPs: this.blockedIPs.size
      },
      eventsByType,
      eventsBySeverity,
      topRiskyIPs: this.getTopRiskyIPs(10),
      recentAlerts: recentEvents
        .filter(e => e.severity >= SecurityLevel.HIGH)
        .slice(0, 20)
    };
  }

  /**
   * Get top risky IPs
   */
  private getTopRiskyIPs(limit: number): Array<{ ip: string; count: number; severity: number }> {
    const ipRisks = new Map<string, { count: number; severity: number }>();
    
    this.auditLogs.forEach(entry => {
      const current = ipRisks.get(entry.ipAddress) || { count: 0, severity: 0 };
      current.count++;
      current.severity += entry.severity;
      ipRisks.set(entry.ipAddress, current);
    });
    
    return Array.from(ipRisks.entries())
      .map(([ip, data]) => ({ ip, ...data }))
      .sort((a, b) => b.severity - a.severity)
      .slice(0, limit);
  }

  /**
   * Export audit logs for compliance
   */
  async exportAuditLogs(
    startDate: Date,
    endDate: Date,
    format: 'json' | 'csv' = 'json'
  ): Promise<string> {
    const filteredLogs = this.auditLogs.filter(
      entry => {
        const entryDate = new Date(entry.timestamp);
        return entryDate >= startDate && entryDate <= endDate;
      }
    );
    
    if (format === 'csv') {
      // Convert to CSV format for compliance reporting
      const headers = [
        'id', 'timestamp', 'eventType', 'severity', 'userId', 'userEmail',
        'ipAddress', 'userAgent', 'resource', 'action', 'outcome'
      ];
      
      const csvData = [
        headers.join(','),
        ...filteredLogs.map(entry => 
          headers.map(header => 
            JSON.stringify(entry[header as keyof AuditLogEntry] || '')
          ).join(',')
        )
      ].join('\n');
      
      return csvData;
    }
    
    return JSON.stringify(filteredLogs, null, 2);
  }
}

// Singleton instance
export const enterpriseSecurityService = new EnterpriseSecurityService();