import * as cheerio from 'cheerio';
import axios from 'axios';
import { db } from '@/lib/db/connection';
import { analyses, analysisHistory } from '@/shared/schemas/analysis';
import { eq, and, desc, count } from 'drizzle-orm';
import type { z } from 'zod';
import { analysisConfigSchema, analysisResultSchema } from '@/shared/schemas/analysis';
import { ContentAnalysisEngine } from './engines/content-analysis.engine';
import { TechnicalAnalysisEngine } from './engines/technical-analysis.engine';
import { LocalSeoAnalysisEngine } from './engines/local-seo-analysis.engine';
import { CompetitorAnalysisEngine } from './engines/competitor-analysis.engine';
import { AIInsightsEngine } from './engines/ai-insights.engine';

/**
 * Standard Analysis Service - Rival Outranker 2.0
 * Handles 50+ factor SEO analysis with AI-powered insights
 * Lighter than the comprehensive audit but still sophisticated
 */

export interface StandardAnalysisRequest {
  url: string;
  targetKeyword?: string;
  config: z.infer<typeof analysisConfigSchema>;
  userId: number;
  teamId?: number;
}

export interface CompetitorComparisonRequest extends StandardAnalysisRequest {
  primaryUrl: string;
  competitorUrls: string[];
}

export class StandardAnalysisService {
  private contentEngine = new ContentAnalysisEngine();
  private technicalEngine = new TechnicalAnalysisEngine();
  private localSeoEngine = new LocalSeoAnalysisEngine();
  private competitorEngine = new CompetitorAnalysisEngine();
  private aiEngine = new AIInsightsEngine();

  /**
   * Start a new standard analysis
   */
  async analyzeUrl(request: StandardAnalysisRequest): Promise<any> {
    console.log(`[StandardAnalysis] Starting analysis for ${request.url}`);
    
    // Create analysis record
    const [analysis] = await db.insert(analyses).values({
      userId: request.userId,
      teamId: request.teamId,
      url: request.url,
      title: `Analysis of ${new URL(request.url).hostname}`,
      type: request.config.analysisDepth || 'standard',
      status: 'pending',
      config: request.config,
      startedAt: new Date()
    }).returning();

    // Start background processing
    this.processAnalysis(analysis.id, request).catch(error => {
      console.error(`[StandardAnalysis] Processing failed for ${analysis.id}:`, error);
      this.updateAnalysisStatus(analysis.id, 'failed', { error: (error as Error).message });
    });

    return analysis;
  }

  /**
   * Compare with competitors
   */
  async compareWithCompetitors(request: CompetitorComparisonRequest): Promise<any> {
    console.log(`[StandardAnalysis] Starting competitor comparison for ${request.primaryUrl}`);
    
    // Create analysis record with competitor configuration
    const [analysis] = await db.insert(analyses).values({
      userId: request.userId,
      teamId: request.teamId,
      url: request.primaryUrl,
      title: `Competitor Analysis of ${new URL(request.primaryUrl).hostname}`,
      type: 'competitor',
      status: 'pending',
      config: {
        ...request.config,
        competitorUrls: request.competitorUrls,
        includeCompetitorAnalysis: true
      },
      startedAt: new Date()
    }).returning();

    // Start background processing
    this.processCompetitorAnalysis(analysis.id, request).catch(error => {
      console.error(`[StandardAnalysis] Competitor analysis failed for ${analysis.id}:`, error);
      this.updateAnalysisStatus(analysis.id, 'failed', { error: (error as Error).message });
    });

    return analysis;
  }

  /**
   * Process analysis in background
   */
  private async processAnalysis(analysisId: number, request: StandardAnalysisRequest): Promise<void> {
    const startTime = Date.now();
    
    try {
      await this.updateAnalysisStatus(analysisId, 'running');
      
      // Fetch and parse the page
      console.log(`[StandardAnalysis] Fetching page: ${request.url}`);
      const pageData = await this.fetchPageData(request.url);
      
      // Phase 1: Content Analysis (20+ factors)
      console.log(`[StandardAnalysis] Running content analysis`);
      const contentAnalysis = await this.contentEngine.analyze(pageData, request.targetKeyword);
      
      // Phase 2: Technical SEO Analysis (15+ factors)
      console.log(`[StandardAnalysis] Running technical analysis`);
      const technicalAnalysis = await this.technicalEngine.analyze(pageData, request.config);
      
      // Phase 3: Local SEO Analysis (10+ factors) - if applicable
      let localSeoAnalysis;
      if (request.config.focusAreas?.includes('local')) {
        console.log(`[StandardAnalysis] Running local SEO analysis`);
        localSeoAnalysis = await this.localSeoEngine.analyze(pageData);
      }
      
      // Phase 4: AI-Powered Insights
      let aiInsights;
      if (request.config.runDeepContentAnalysis) {
        console.log(`[StandardAnalysis] Generating AI insights`);
        aiInsights = await this.aiEngine.generateInsights(pageData, contentAnalysis, request.targetKeyword);
      }
      
      // Compile comprehensive results
      const results = this.compileAnalysisResults({
        url: request.url,
        targetKeyword: request.targetKeyword,
        contentAnalysis,
        technicalAnalysis,
        localSeoAnalysis,
        aiInsights,
        config: request.config
      });
      
      const processingTime = Date.now() - startTime;
      
      // Update analysis with results
      await this.updateAnalysisResults(analysisId, results, {
        processingTimeMs: processingTime,
        apiCallsUsed: this.calculateApiCallsUsed(request.config),
        factorsAnalyzed: this.calculateFactorsAnalyzed(request.config),
        errorCount: 0
      });
      
      console.log(`[StandardAnalysis] Analysis ${analysisId} completed in ${processingTime}ms`);
      
    } catch (error) {
      console.error(`[StandardAnalysis] Error processing analysis ${analysisId}:`, error);
      await this.updateAnalysisStatus(analysisId, 'failed', { error: (error as Error).message });
      throw error;
    }
  }

  /**
   * Process competitor analysis in background
   */
  private async processCompetitorAnalysis(analysisId: number, request: CompetitorComparisonRequest): Promise<void> {
    const startTime = Date.now();
    
    try {
      await this.updateAnalysisStatus(analysisId, 'running');
      
      // Analyze primary URL
      console.log(`[StandardAnalysis] Analyzing primary URL: ${request.primaryUrl}`);
      const primaryData = await this.fetchPageData(request.primaryUrl);
      const primaryAnalysis = await this.analyzePageForComparison(primaryData, request.targetKeyword);
      
      // Analyze competitors
      const competitorAnalyses = [];
      for (const competitorUrl of request.competitorUrls) {
        console.log(`[StandardAnalysis] Analyzing competitor: ${competitorUrl}`);
        try {
          const competitorData = await this.fetchPageData(competitorUrl);
          const competitorAnalysis = await this.analyzePageForComparison(competitorData, request.targetKeyword);
          competitorAnalyses.push({
            url: competitorUrl,
            ...competitorAnalysis
          });
        } catch (error) {
          console.warn(`[StandardAnalysis] Failed to analyze competitor ${competitorUrl}:`, (error as Error).message);
          competitorAnalyses.push({
            url: competitorUrl,
            error: (error as Error).message,
            analysisAvailable: false
          });
        }
      }
      
      // Generate competitor comparison
      const competitorComparison = await this.competitorEngine.compare(
        primaryAnalysis,
        competitorAnalyses,
        request.targetKeyword
      );
      
      // Compile results with competitor data
      const results = this.compileAnalysisResults({
        url: request.primaryUrl,
        targetKeyword: request.targetKeyword,
        contentAnalysis: primaryAnalysis.contentAnalysis,
        technicalAnalysis: primaryAnalysis.technicalAnalysis,
        localSeoAnalysis: primaryAnalysis.localSeoAnalysis,
        competitorAnalysis: competitorComparison,
        config: request.config
      });
      
      const processingTime = Date.now() - startTime;
      
      await this.updateAnalysisResults(analysisId, results, {
        processingTimeMs: processingTime,
        apiCallsUsed: this.calculateApiCallsUsed(request.config) * (1 + request.competitorUrls.length),
        factorsAnalyzed: this.calculateFactorsAnalyzed(request.config),
        errorCount: competitorAnalyses.filter(c => c.error).length
      });
      
      console.log(`[StandardAnalysis] Competitor analysis ${analysisId} completed in ${processingTime}ms`);
      
    } catch (error) {
      console.error(`[StandardAnalysis] Error processing competitor analysis ${analysisId}:`, error);
      await this.updateAnalysisStatus(analysisId, 'failed', { error: (error as Error).message });
      throw error;
    }
  }

  /**
   * Fetch and parse page data
   */
  private async fetchPageData(url: string): Promise<any> {
    try {
      const response = await axios.get(url, {
        timeout: 30000,
        headers: {
          'User-Agent': 'RivalOutranker/2.0 SEO Analysis Bot'
        }
      });
      
      const $ = cheerio.load(response.data);
      
      return {
        url,
        statusCode: response.status,
        html: response.data,
        $,
        title: $('title').text().trim(),
        metaDescription: $('meta[name="description"]').attr('content') || '',
        bodyText: $('body').text(),
        wordCount: $('body').text().split(/\s+/).length,
        headings: this.extractHeadings($),
        images: this.extractImages($),
        links: this.extractLinks($),
        scripts: this.extractScripts($),
        stylesheets: this.extractStylesheets($),
        canonicalUrl: $('link[rel="canonical"]').attr('href'),
        schemaMarkup: this.extractSchemaMarkup($),
        loadTime: response.headers['server-timing'] ? this.parseServerTiming(response.headers['server-timing']) : undefined
      };
    } catch (error) {
      console.error(`[StandardAnalysis] Error fetching ${url}:`, (error as Error).message);
      throw new Error(`Failed to fetch page: ${(error as Error).message}`);
    }
  }

  /**
   * Analyze page for competitor comparison
   */
  private async analyzePageForComparison(pageData: any, targetKeyword?: string): Promise<any> {
    const contentAnalysis = await this.contentEngine.analyze(pageData, targetKeyword);
    const technicalAnalysis = await this.technicalEngine.analyze(pageData, { 
      analysisDepth: 'standard',
      runDeepContentAnalysis: false,
      includeCompetitorAnalysis: false
    });
    const localSeoAnalysis = await this.localSeoEngine.analyze(pageData);
    
    return {
      contentAnalysis,
      technicalAnalysis,
      localSeoAnalysis,
      pageData: {
        title: pageData.title,
        metaDescription: pageData.metaDescription,
        wordCount: pageData.wordCount,
        url: pageData.url
      }
    };
  }

  /**
   * Compile analysis results into standard format
   */
  private compileAnalysisResults(data: {
    url: string;
    targetKeyword?: string;
    contentAnalysis: any;
    technicalAnalysis: any;
    localSeoAnalysis?: any;
    aiInsights?: any;
    competitorAnalysis?: any;
    config: any;
  }): z.infer<typeof analysisResultSchema> {
    // Calculate category scores
    const contentScore = this.calculateCategoryScore(data.contentAnalysis);
    const technicalScore = this.calculateCategoryScore(data.technicalAnalysis);
    const localScore = data.localSeoAnalysis ? this.calculateCategoryScore(data.localSeoAnalysis) : null;
    const mobileScore = data.technicalAnalysis.mobileResponsive ? 85 : 45;
    const speedScore = data.technicalAnalysis.pageSpeed?.desktop || 70;
    
    // Calculate overall score (weighted average)
    const scores = [contentScore, technicalScore, mobileScore, speedScore];
    if (localScore) scores.push(localScore);
    const overallScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(data);
    
    return {
      url: data.url,
      targetKeyword: data.targetKeyword,
      overallScore,
      categoryScores: {
        content: contentScore,
        technical: technicalScore,
        local: localScore ?? undefined,
        mobile: mobileScore,
        speed: speedScore
      },
      contentAnalysis: data.contentAnalysis,
      technicalAnalysis: data.technicalAnalysis,
      localSeoAnalysis: data.localSeoAnalysis,
      competitorAnalysis: data.competitorAnalysis,
      recommendations,
      insights: {
        keywordOpportunities: data.aiInsights?.semanticKeywords || [],
        contentSuggestions: data.aiInsights?.improvementSuggestions || [],
        technicalIssues: this.extractTechnicalIssues(data.technicalAnalysis),
        competitiveAdvantages: data.competitorAnalysis?.comparison.technicalAdvantages || []
      },
      metadata: {
        analysisType: data.config.analysisDepth || 'standard',
        processingTime: 0, // Will be set when updating results
        apiCallsUsed: this.calculateApiCallsUsed(data.config),
        factorsAnalyzed: this.calculateFactorsAnalyzed(data.config),
        confidence: this.calculateConfidenceScore(data)
      }
    };
  }

  /**
   * Get analysis by ID
   */
  async getAnalysis(analysisId: number, userId: number): Promise<any> {
    const [analysis] = await db
      .select()
      .from(analyses)
      .where(and(eq(analyses.id, analysisId), eq(analyses.userId, userId)))
      .limit(1);

    return analysis;
  }

  /**
   * Get analysis status
   */
  async getAnalysisStatus(analysisId: number, userId: number): Promise<any> {
    const [analysis] = await db
      .select({
        id: analyses.id,
        status: analyses.status,
        startedAt: analyses.startedAt,
        completedAt: analyses.completedAt
      })
      .from(analyses)
      .where(and(eq(analyses.id, analysisId), eq(analyses.userId, userId)))
      .limit(1);

    if (!analysis) return null;

    return {
      id: analysis.id,
      status: analysis.status,
      startedAt: analysis.startedAt,
      completedAt: analysis.completedAt,
      isComplete: analysis.status === 'completed',
      hasError: analysis.status === 'failed'
    };
  }

  /**
   * Get user's analyses with pagination
   */
  async getUserAnalyses(userId: number, options: {
    page: number;
    limit: number;
    type?: string;
    status?: string;
  }): Promise<any> {
    const offset = (options.page - 1) * options.limit;
    
    const whereConditions = [eq(analyses.userId, userId)];
    
    if (options.type) {
      whereConditions.push(eq(analyses.type, options.type));
    }

    if (options.status) {
      whereConditions.push(eq(analyses.status, options.status));
    }
    
    const query = db
      .select()
      .from(analyses)
      .where(and(...whereConditions))
      .orderBy(desc(analyses.createdAt))
      .limit(options.limit)
      .offset(offset);

    const results = await query;
    
    // Get total count for pagination
    const countWhereConditions = [eq(analyses.userId, userId)];
    
    if (options.type) {
      countWhereConditions.push(eq(analyses.type, options.type));
    }

    if (options.status) {
      countWhereConditions.push(eq(analyses.status, options.status));
    }
    
    const [{ count: totalCount }] = await db
      .select({ count: count() })
      .from(analyses)
      .where(and(...countWhereConditions));

    return {
      analyses: results,
      pagination: {
        page: options.page,
        limit: options.limit,
        total: Number(totalCount),
        pages: Math.ceil(Number(totalCount) / options.limit)
      }
    };
  }

  /**
   * Delete analysis
   */
  async deleteAnalysis(analysisId: number, userId: number): Promise<void> {
    await db
      .delete(analyses)
      .where(and(eq(analyses.id, analysisId), eq(analyses.userId, userId)));
  }

  /**
   * Regenerate analysis
   */
  async regenerateAnalysis(analysisId: number, userId: number): Promise<any> {
    const [existingAnalysis] = await db
      .select()
      .from(analyses)
      .where(and(eq(analyses.id, analysisId), eq(analyses.userId, userId)))
      .limit(1);

    if (!existingAnalysis) {
      throw new Error('Analysis not found');
    }

    // Create new analysis with same configuration
    return this.analyzeUrl({
      url: existingAnalysis.url,
      targetKeyword: existingAnalysis.config?.targetKeyword,
      config: existingAnalysis.config || { 
        analysisDepth: 'standard',
        runDeepContentAnalysis: false,
        includeCompetitorAnalysis: false
      },
      userId,
      teamId: existingAnalysis.teamId ?? undefined
    });
  }

  // Helper methods
  private async updateAnalysisStatus(analysisId: number, status: string, additionalData?: any): Promise<void> {
    const updateData: any = { status, updatedAt: new Date() };
    
    if (status === 'completed') {
      updateData.completedAt = new Date();
    }
    
    if (additionalData) {
      Object.assign(updateData, additionalData);
    }

    await db
      .update(analyses)
      .set(updateData)
      .where(eq(analyses.id, analysisId));
  }

  private async updateAnalysisResults(analysisId: number, results: any, metrics: any): Promise<void> {
    await db
      .update(analyses)
      .set({
        status: 'completed',
        results,
        metrics,
        completedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(analyses.id, analysisId));
  }

  private calculateCategoryScore(analysisData: any): number {
    // Simple scoring algorithm - can be made more sophisticated
    const issues = analysisData.issues || [];
    const total = analysisData.total || 1;
    return Math.round(((total - issues.length) / total) * 100);
  }

  private calculateApiCallsUsed(config: any): number {
    let calls = 1; // Base analysis
    if (config.runDeepContentAnalysis) calls += 2;
    if (config.includeCompetitorAnalysis) calls += 1;
    return calls;
  }

  private calculateFactorsAnalyzed(config: any): number {
    let factors = 50; // Standard analysis
    if (config.analysisDepth === 'deep') factors += 20;
    if (config.focusAreas?.includes('local')) factors += 10;
    return factors;
  }

  private calculateConfidenceScore(data: any): number {
    // Calculate confidence based on data availability and quality
    let confidence = 80; // Base confidence
    
    if (data.contentAnalysis && data.technicalAnalysis) confidence += 10;
    if (data.aiInsights) confidence += 5;
    if (data.competitorAnalysis) confidence += 5;
    
    return Math.min(100, confidence);
  }

  private generateRecommendations(data: any): any[] {
    const recommendations = [];
    
    // Content recommendations
    if (data.contentAnalysis.wordCount < 300) {
      recommendations.push({
        category: 'content',
        priority: 'high',
        title: 'Increase Content Length',
        description: 'Add more comprehensive content to improve SEO value',
        impact: 'high',
        difficulty: 'medium',
        estimatedTime: '2-4 hours'
      });
    }
    
    // Technical recommendations
    if (!data.technicalAnalysis.seoTechnicals.metaDescription.exists) {
      recommendations.push({
        category: 'technical',
        priority: 'high',
        title: 'Add Meta Description',
        description: 'Create compelling meta description to improve click-through rates',
        impact: 'medium',
        difficulty: 'easy',
        estimatedTime: '15 minutes'
      });
    }
    
    return recommendations;
  }

  private extractTechnicalIssues(technicalAnalysis: any): string[] {
    const issues = [];
    
    if (!technicalAnalysis.seoTechnicals.sslCertificate) {
      issues.push('Missing SSL certificate');
    }
    
    if (!technicalAnalysis.seoTechnicals.mobileResponsive) {
      issues.push('Not mobile responsive');
    }
    
    return issues;
  }

  // Page parsing helper methods
  private extractHeadings($: cheerio.CheerioAPI): Record<string, string[]> {
    const headings: Record<string, string[]> = {};
    
    for (let i = 1; i <= 6; i++) {
      headings[`h${i}`] = [];
      $(`h${i}`).each((_, el) => {
        headings[`h${i}`].push($(el).text().trim());
      });
    }
    
    return headings;
  }

  private extractImages($: cheerio.CheerioAPI): any[] {
    const images: any[] = [];
    
    $('img').each((_, el) => {
      images.push({
        src: $(el).attr('src') || '',
        alt: $(el).attr('alt') || '',
        width: $(el).attr('width'),
        height: $(el).attr('height')
      });
    });
    
    return images;
  }

  private extractLinks($: cheerio.CheerioAPI): any[] {
    const links: any[] = [];
    
    $('a[href]').each((_, el) => {
      const href = $(el).attr('href') || '';
      links.push({
        href,
        text: $(el).text().trim(),
        isExternal: href.startsWith('http') && !href.includes(new URL($('link[rel="canonical"]').attr('href') || '').hostname)
      });
    });
    
    return links;
  }

  private extractScripts($: cheerio.CheerioAPI): string[] {
    const scripts: string[] = [];
    
    $('script[src]').each((_, el) => {
      const src = $(el).attr('src');
      if (src) scripts.push(src);
    });
    
    return scripts;
  }

  private extractStylesheets($: cheerio.CheerioAPI): string[] {
    const stylesheets: string[] = [];
    
    $('link[rel="stylesheet"]').each((_, el) => {
      const href = $(el).attr('href');
      if (href) stylesheets.push(href);
    });
    
    return stylesheets;
  }

  private extractSchemaMarkup($: cheerio.CheerioAPI): object[] {
    const schemas: object[] = [];
    
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const schema = JSON.parse($(el).html() || '{}');
        schemas.push(schema);
      } catch (error) {
        // Ignore invalid JSON-LD
      }
    });
    
    return schemas;
  }

  private parseServerTiming(serverTiming: string): number {
    // Parse server-timing header to extract load time
    const match = serverTiming.match(/total;dur=(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : 0;
  }
}