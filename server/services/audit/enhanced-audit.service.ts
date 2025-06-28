import { db } from '@/lib/db/connection';
import { audits, auditHistory, auditComments, crawlJobs } from '@/shared/schemas/audit';
import { eq, and, desc, count } from 'drizzle-orm';
import { EnhancedAuditAnalyzer } from './enhanced-analyzer.service';
import { SiteCrawlingService } from './site-crawling.service';
import { IntelligentCrawlingService } from './intelligent-crawling.service';
import { AuditExportService } from './audit-export.service';
import { WhiteLabelReportingService } from '../reporting/white-label-reporting.service';
import { broadcastAuditProgress } from '../../index';
import type { z } from 'zod';
import { auditTypeSchema } from '@/shared/schemas/audit';

/**
 * Enhanced Audit Service - Rival Outranker 2.0
 * Orchestrates the complete 140+ factor audit process with real-time updates
 * Preserves the sophisticated algorithm while adding modern capabilities
 */

export interface EnhancedAuditRequest {
  url: string;
  title: string;
  type: z.infer<typeof auditTypeSchema>;
  config: {
    maxPages?: number;
    includeSubdomains?: boolean;
    analyzeCompetitors?: boolean;
    competitorUrls?: string[];
    focusAreas?: string[];
    customFactors?: Array<{
      name: string;
      category: string;
      importance: 'High' | 'Medium' | 'Low';
    }>;
  };
  userId: number;
  teamId?: number;
}

export class EnhancedAuditService {
  private crawlingService = new SiteCrawlingService();
  private intelligentCrawlingService = new IntelligentCrawlingService();
  private auditAnalyzer = new EnhancedAuditAnalyzer();
  private exportService = new AuditExportService();
  private whiteLabelReportingService = new WhiteLabelReportingService();

  /**
   * Start a new comprehensive audit
   */
  async startAudit(request: EnhancedAuditRequest): Promise<any> {
    console.log(`[EnhancedAudit] Starting comprehensive audit for ${request.url}`);
    
    // Create audit record
    const [audit] = await db.insert(audits).values({
      userId: request.userId,
      teamId: request.teamId,
      url: request.url,
      title: request.title,
      type: request.type,
      status: 'pending',
      progress: 0,
      config: request.config,
      startedAt: new Date()
    }).returning();

    // Start background processing
    this.processAudit(audit.id, request).catch(error => {
      console.error(`[EnhancedAudit] Processing failed for ${audit.id}:`, error);
      this.updateAuditStatus(audit.id, 'failed', 0, { error: error.message });
    });

    return audit;
  }

  /**
   * Process comprehensive audit in background with real-time updates
   */
  private async processAudit(auditId: number, request: EnhancedAuditRequest): Promise<void> {
    const startTime = Date.now();
    
    try {
      await this.updateAuditStatus(auditId, 'running', 5);
      
      // Phase 1: Intelligent Site Discovery and Crawling (5-25%)
      console.log(`[EnhancedAudit] Phase 1: Intelligent site discovery for ${request.url}`);
      this.broadcastProgress(auditId, 'running', 10, 'Analyzing site technology and starting intelligent crawling...');
      
      // Use intelligent crawling for better JavaScript support and content analysis
      const siteStructure = await this.intelligentCrawlingService.crawlSiteIntelligently(
        request.url,
        {
          ...request.config,
          analyzeJavaScript: true, // Enable JavaScript rendering for modern sites
          contentSimilarityAnalysis: true // Enable advanced content deduplication
        },
        (progress, message) => this.broadcastProgress(auditId, 'running', 10 + (progress * 0.15), message || 'Intelligent crawling in progress...')
      );
      
      const crawlInfo = siteStructure.crawlMetadata || {};
      this.broadcastProgress(auditId, 'running', 25, 
        `Intelligent crawl complete: ${(crawlInfo as any).pagesAnalyzed || 0} pages analyzed, ` +
        `${(crawlInfo as any).isJavaScriptHeavy ? 'JS-heavy' : 'traditional'} site detected`
      );
      
      // Phase 2: Comprehensive Analysis (25-85%)
      console.log(`[EnhancedAudit] Phase 2: Running 140+ factor analysis`);
      this.broadcastProgress(auditId, 'running', 30, 'Running comprehensive 140+ factor analysis...');
      
      const analysisResults = await this.auditAnalyzer.analyzeWebsite(siteStructure);
      
      this.broadcastProgress(auditId, 'running', 85, `Analysis complete: ${analysisResults.summary.totalFactors} factors analyzed`);
      
      // Phase 3: Report Generation and Finalization (85-100%)
      console.log(`[EnhancedAudit] Phase 3: Generating comprehensive report`);
      this.broadcastProgress(auditId, 'running', 90, 'Generating comprehensive report...');
      
      const finalResults = await this.finalizeResults(analysisResults, request);
      
      const processingTime = Date.now() - startTime;
      
      // Update audit with results
      await this.updateAuditResults(auditId, finalResults, {
        analysisTimeMs: processingTime,
        pagesAnalyzed: analysisResults.crawlMetadata?.pagesAnalyzed || 0,
        factorsAnalyzed: analysisResults.summary.totalFactors,
        apiCallsUsed: this.calculateApiCallsUsed(request.config),
        costUsd: this.calculateCost(request.config)
      });
      
      this.broadcastProgress(auditId, 'completed', 100, `Audit completed successfully in ${Math.round(processingTime / 1000)}s`);
      
      console.log(`[EnhancedAudit] Audit ${auditId} completed in ${processingTime}ms`);
      
    } catch (error) {
      console.error(`[EnhancedAudit] Error processing audit ${auditId}:`, error);
      await this.updateAuditStatus(auditId, 'failed', 0, { error: (error as Error).message });
      this.broadcastProgress(auditId, 'failed', 0, `Audit failed: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Finalize results with additional processing
   */
  private async finalizeResults(analysisResults: any, request: EnhancedAuditRequest): Promise<any> {
    // Add competitor analysis if requested
    if (request.config.analyzeCompetitors && request.config.competitorUrls?.length) {
      console.log(`[EnhancedAudit] Running competitor analysis for ${request.config.competitorUrls.length} competitors`);
      
      // This would integrate with competitor analysis
      analysisResults.competitorComparison = {
        competitors: request.config.competitorUrls.map(url => ({
          url,
          score: Math.floor(Math.random() * 40) + 60, // Placeholder
          strengths: ['Strong technical SEO', 'Good content length'],
          weaknesses: ['Poor mobile experience', 'Slow loading speed']
        })),
        gaps: ['Competitor content is more comprehensive', 'Missing structured data'],
        opportunities: ['Target competitor keywords', 'Improve page speed performance']
      };
    }
    
    // Add custom factor analysis if specified
    if (request.config.customFactors?.length) {
      console.log(`[EnhancedAudit] Processing ${request.config.customFactors.length} custom factors`);
      
      // Process custom factors and add to appropriate categories
      for (const customFactor of request.config.customFactors) {
        const categoryKey = this.mapCategoryToSection(customFactor.category);
        if (analysisResults[categoryKey]) {
          analysisResults[categoryKey].items.push({
            name: customFactor.name,
            description: `Custom factor: ${customFactor.name}`,
            status: 'N/A',
            importance: customFactor.importance,
            notes: 'Custom factor analysis would be implemented based on specific requirements',
            category: customFactor.category
          });
        }
      }
    }
    
    return analysisResults;
  }

  /**
   * Get audit by ID with access control
   */
  async getAudit(auditId: number, userId: number): Promise<any> {
    const [audit] = await db
      .select()
      .from(audits)
      .where(and(eq(audits.id, auditId), eq(audits.userId, userId)))
      .limit(1);

    return audit;
  }

  /**
   * Get audit status and progress
   */
  async getAuditStatus(auditId: number, userId: number): Promise<any> {
    const [audit] = await db
      .select({
        id: audits.id,
        status: audits.status,
        progress: audits.progress,
        startedAt: audits.startedAt,
        completedAt: audits.completedAt,
        url: audits.url,
        title: audits.title
      })
      .from(audits)
      .where(and(eq(audits.id, auditId), eq(audits.userId, userId)))
      .limit(1);

    if (!audit) return null;

    return {
      id: audit.id,
      status: audit.status,
      progress: audit.progress || 0,
      startedAt: audit.startedAt,
      completedAt: audit.completedAt,
      url: audit.url,
      title: audit.title,
      isComplete: audit.status === 'completed',
      hasError: audit.status === 'failed',
      estimatedTimeRemaining: this.calculateEstimatedTime(audit.progress || 0, audit.startedAt)
    };
  }

  /**
   * Get user's audits with pagination
   */
  async getUserAudits(userId: number, options: {
    page: number;
    limit: number;
    type?: string;
    status?: string;
    url?: string;
  }): Promise<any> {
    const offset = (options.page - 1) * options.limit;
    
    let whereConditions = [eq(audits.userId, userId)];
    
    if (options.type) {
      whereConditions.push(eq(audits.type, options.type));
    }
    
    if (options.status) {
      whereConditions.push(eq(audits.status, options.status));
    }
    
    if (options.url) {
      whereConditions.push(eq(audits.url, options.url));
    }

    const results = await db
      .select({
        id: audits.id,
        url: audits.url,
        title: audits.title,
        type: audits.type,
        status: audits.status,
        progress: audits.progress,
        startedAt: audits.startedAt,
        completedAt: audits.completedAt,
        createdAt: audits.createdAt
      })
      .from(audits)
      .where(and(...whereConditions))
      .orderBy(desc(audits.createdAt))
      .limit(options.limit)
      .offset(offset);
    
    // Get total count for pagination
    const [{ totalCount }] = await db
      .select({ totalCount: count() })
      .from(audits)
      .where(and(...whereConditions));

    return {
      audits: results,
      pagination: {
        page: options.page,
        limit: options.limit,
        total: Number(totalCount),
        pages: Math.ceil(Number(totalCount) / options.limit)
      }
    };
  }

  /**
   * Delete audit
   */
  async deleteAudit(auditId: number, userId: number): Promise<void> {
    await db
      .delete(audits)
      .where(and(eq(audits.id, auditId), eq(audits.userId, userId)));
  }

  /**
   * Cancel running audit
   */
  async cancelAudit(auditId: number, userId: number): Promise<void> {
    await db
      .update(audits)
      .set({
        status: 'cancelled',
        progress: 0,
        updatedAt: new Date()
      })
      .where(and(eq(audits.id, auditId), eq(audits.userId, userId)));
  }

  /**
   * Regenerate audit with same configuration
   */
  async regenerateAudit(auditId: number, userId: number): Promise<any> {
    const [existingAudit] = await db
      .select()
      .from(audits)
      .where(and(eq(audits.id, auditId), eq(audits.userId, userId)))
      .limit(1);

    if (!existingAudit) {
      throw new Error('Audit not found');
    }

    // Create new audit with same configuration
    return this.startAudit({
      url: existingAudit.url,
      title: `${existingAudit.title} (Regenerated)`,
      type: existingAudit.type as any,
      config: existingAudit.config as any || {},
      userId,
      teamId: existingAudit.teamId ?? undefined
    });
  }

  /**
   * Export audit in various formats
   */
  async exportAudit(auditId: number, userId: number, format: 'excel' | 'pdf' | 'csv'): Promise<any> {
    const audit = await this.getAudit(auditId, userId);
    
    if (!audit || !audit.results) {
      throw new Error('Audit not found or not completed');
    }

    return this.exportService.exportAudit(audit, format);
  }

  /**
   * Generate white-label report for agencies
   */
  async generateWhiteLabelReport(
    auditId: number,
    userId: number,
    reportConfig: {
      agencyName: string;
      agencyLogo?: string;
      clientName: string;
      reportTitle?: string;
      brandColors?: {
        primary: string;
        secondary: string;
        accent: string;
      };
      includeExecutiveSummary?: boolean;
      includeTechnicalDetails?: boolean;
      includeImplementationGuide?: boolean;
      customSections?: Array<{
        title: string;
        content: string;
        order: number;
      }>;
    },
    format: 'excel' | 'pdf' | 'html' = 'excel'
  ): Promise<{
    buffer: Buffer;
    filename: string;
    mimeType: string;
  }> {
    
    console.log(`[EnhancedAudit] Generating white-label report for audit ${auditId}`);
    
    // Get audit results
    const audit = await this.getAudit(auditId, userId);
    if (!audit) {
      throw new Error('Audit not found');
    }

    if (!audit.results) {
      throw new Error('Audit not completed yet');
    }

    // Enhance report config with audit data
    const enhancedConfig = {
      ...reportConfig,
      websiteUrl: audit.url,
      reportTitle: reportConfig.reportTitle || `SEO Audit Report - ${audit.title}`,
      // Set default brand colors if not provided
      brandColors: reportConfig.brandColors || {
        primary: '#2563EB',
        secondary: '#1E40AF', 
        accent: '#3B82F6'
      }
    };

    // Generate the white-label report
    return await this.whiteLabelReportingService.generateWhiteLabelReport(
      audit.results,
      enhancedConfig,
      format
    );
  }

  /**
   * Get audit history
   */
  async getAuditHistory(auditId: number, userId: number): Promise<any> {
    // Verify access
    const audit = await this.getAudit(auditId, userId);
    if (!audit) {
      throw new Error('Audit not found');
    }

    return db
      .select()
      .from(auditHistory)
      .where(eq(auditHistory.auditId, auditId))
      .orderBy(desc(auditHistory.createdAt));
  }

  /**
   * Add comment to audit
   */
  async addComment(auditId: number, userId: number, commentData: {
    content: string;
    factorName?: string;
  }): Promise<any> {
    // Verify access
    const audit = await this.getAudit(auditId, userId);
    if (!audit) {
      throw new Error('Audit not found');
    }

    const [comment] = await db
      .insert(auditComments)
      .values({
        auditId,
        userId,
        factorName: commentData.factorName,
        content: commentData.content
      })
      .returning();

    return comment;
  }

  /**
   * Get comments for audit
   */
  async getComments(auditId: number, userId: number): Promise<any> {
    // Verify access
    const audit = await this.getAudit(auditId, userId);
    if (!audit) {
      throw new Error('Audit not found');
    }

    return db
      .select()
      .from(auditComments)
      .where(eq(auditComments.auditId, auditId))
      .orderBy(desc(auditComments.createdAt));
  }

  // Helper methods
  private async updateAuditStatus(auditId: number, status: string, progress: number, additionalData?: any): Promise<void> {
    const updateData: any = { 
      status, 
      progress,
      updatedAt: new Date() 
    };
    
    if (status === 'completed') {
      updateData.completedAt = new Date();
    }
    
    if (additionalData) {
      Object.assign(updateData, additionalData);
    }

    await db
      .update(audits)
      .set(updateData)
      .where(eq(audits.id, auditId));
  }

  private async updateAuditResults(auditId: number, results: any, metrics: any): Promise<void> {
    await db
      .update(audits)
      .set({
        status: 'completed',
        progress: 100,
        results,
        metrics,
        completedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(audits.id, auditId));
  }

  private broadcastProgress(auditId: number, status: string, progress: number, message?: string): void {
    broadcastAuditProgress(auditId.toString(), {
      status,
      progress: Math.round(progress),
      message,
      data: { timestamp: new Date().toISOString() }
    });
  }

  private calculateApiCallsUsed(config: any): number {
    let calls = 5; // Base comprehensive analysis
    if (config.analyzeCompetitors) calls += (config.competitorUrls?.length || 0) * 2;
    if (config.maxPages > 10) calls += Math.floor(config.maxPages / 10);
    return calls;
  }

  private calculateCost(config: any): number {
    // Simplified cost calculation
    const baseCost = 0.10; // $0.10 base
    let additionalCost = 0;
    
    if (config.analyzeCompetitors) additionalCost += 0.05;
    if (config.maxPages > 20) additionalCost += 0.02 * (config.maxPages - 20);
    
    return baseCost + additionalCost;
  }

  private calculateEstimatedTime(progress: number, startedAt: Date | null): string {
    if (!startedAt || progress <= 0) return 'Unknown';
    
    const elapsed = Date.now() - startedAt.getTime();
    const estimatedTotal = (elapsed / progress) * 100;
    const remaining = estimatedTotal - elapsed;
    
    if (remaining <= 0) return 'Almost done';
    
    const minutes = Math.ceil(remaining / (1000 * 60));
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }

  private mapCategoryToSection(category: string): string {
    const categoryMap: Record<string, string> = {
      'content': 'contentQuality',
      'technical': 'technicalSEO',
      'local': 'localSEO',
      'ux': 'uxPerformance',
      'performance': 'uxPerformance'
    };
    
    return categoryMap[category.toLowerCase()] || 'onPage';
  }
}