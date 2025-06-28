import * as cheerio from 'cheerio';
import { 
  ContentQualityAnalyzer,
  TechnicalSEOAnalyzer,
  LocalSEOAnalyzer,
  UXPerformanceAnalyzer,
  type AnalysisFactor
} from './analyzers';
import { PagePriorityService, type PagePriority } from './page-priority.service';
import { OFIClassificationService } from './ofi-classification.service';
import { AIContentInsightsEngine } from '../analysis/engines/ai-content-insights.engine';
import { SEOBuddyAssistant } from '../analysis/seo-buddy-assistant.service';
import { enhancedAuditResultSchema, auditStatusSchema, seoImportanceSchema } from '@/shared/schemas';
import type { z } from 'zod';

/**
 * Enhanced Audit Analyzer Service - Rival Outranker 2.0
 * Preserves the sophisticated 140+ factor analysis algorithm from the original system
 * Enhanced with new capabilities while maintaining backward compatibility
 */

export interface PageCrawlResult {
  url: string;
  title?: string;
  metaDescription?: string;
  statusCode: number;
  bodyText: string;
  wordCount: number;
  headings: Record<string, string[]>;
  images: Array<{
    src: string;
    alt: string;
    width?: number;
    height?: number;
  }>;
  links: Array<{
    href: string;
    text: string;
    isExternal: boolean;
  }>;
  scripts: string[];
  stylesheets: string[];
  canonicalUrl?: string;
  schemaMarkup: object[];
  pageType?: string;
  loadTime?: number;
  size?: number;
  // Enhanced metadata from intelligent crawling
  crawlMethod?: 'puppeteer' | 'axios';
  viewport?: string;
  charset?: string;
  lang?: string;
  hasServiceWorker?: boolean;
  isInteractive?: boolean;
  renderMetrics?: {
    clientHeight: number;
    scrollHeight: number;
    isScrollable: boolean;
  };
}

export interface SiteStructure {
  homepage?: PageCrawlResult;
  contactPage?: PageCrawlResult;
  servicePages: PageCrawlResult[];
  locationPages: PageCrawlResult[];
  serviceAreaPages: PageCrawlResult[];
  otherPages: PageCrawlResult[];
  sitemapUrls?: string[];
  robotsTxt?: string;
  // Enhanced metadata from intelligent crawling
  crawlMetadata?: {
    totalPagesDiscovered: number;
    pagesAnalyzed: number;
    isJavaScriptHeavy: boolean;
    siteTechnology: any;
    contentSimilarityAnalyzed: boolean;
    crawlMethod: 'intelligent' | 'traditional';
  };
}

export type EnhancedAuditResult = z.infer<typeof enhancedAuditResultSchema>;

/**
 * Enhanced Audit Analyzer Service
 * Lightweight orchestrator that coordinates specialized analyzers via dependency injection
 * Handles comprehensive analysis of 140+ SEO factors across all categories
 */
export class EnhancedAuditAnalyzer {
  
  // Injected specialized analyzers
  private contentAnalyzer: ContentQualityAnalyzer;
  private technicalAnalyzer: TechnicalSEOAnalyzer;
  private localSeoAnalyzer: LocalSEOAnalyzer;
  private uxAnalyzer: UXPerformanceAnalyzer;
  
  // Page Priority Analysis
  private priorityService = new PagePriorityService();
  private ofiClassificationService = new OFIClassificationService();
  
  // AI-powered analysis services
  private aiInsightsEngine = new AIContentInsightsEngine();
  private seoBuddyAssistant = new SEOBuddyAssistant();

  constructor(
    contentAnalyzer?: ContentQualityAnalyzer,
    technicalAnalyzer?: TechnicalSEOAnalyzer,
    localSeoAnalyzer?: LocalSEOAnalyzer,
    uxAnalyzer?: UXPerformanceAnalyzer
  ) {
    // Use dependency injection with fallback to default instances
    this.contentAnalyzer = contentAnalyzer || new ContentQualityAnalyzer();
    this.technicalAnalyzer = technicalAnalyzer || new TechnicalSEOAnalyzer();
    this.localSeoAnalyzer = localSeoAnalyzer || new LocalSEOAnalyzer();
    this.uxAnalyzer = uxAnalyzer || new UXPerformanceAnalyzer();
  }

  /**
   * Perform comprehensive 140+ factor analysis on a website with priority weighting
   */
  async analyzeWebsite(siteStructure: SiteStructure): Promise<EnhancedAuditResult> {
    console.log('[EnhancedAnalyzer] Starting comprehensive 140+ factor analysis');
    
    const results: EnhancedAuditResult = {
      summary: {
        totalFactors: 0,
        priorityOfiCount: 0,
        ofiCount: 0,
        okCount: 0,
        naCount: 0,
        overallScore: 0,
        categoryScores: {
          contentQuality: 0,
          technicalSEO: 0,
          localSEO: 0,
          uxPerformance: 0
        },
        recommendations: [],
        estimatedFixTime: '2-4 weeks'
      },
      onPage: { items: [] },
      structureNavigation: { items: [] },
      contactPage: { items: [] },
      servicePages: { items: [] },
      locationPages: { items: [] },
      serviceAreaPages: { items: [] },
      // Enhanced audit categories with 140+ factors
      contentQuality: { items: [] },
      technicalSEO: { items: [] },
      localSEO: { items: [] },
      uxPerformance: { items: [] },
      pageAnalysis: [],
      competitorComparison: {},
      crawlMetadata: {
        pagesAnalyzed: 0,
        maxPagesReached: false,
        crawlDuration: 0,
        errors: []
      }
    };

    // Analyze homepage with all 140+ factors
    if (siteStructure.homepage) {
      await this.analyzePageComprehensive(siteStructure.homepage, 'homepage', results);
    }

    // Analyze contact page
    if (siteStructure.contactPage) {
      await this.analyzePageComprehensive(siteStructure.contactPage, 'contact', results);
    }

    // Analyze service pages
    for (const servicePage of siteStructure.servicePages) {
      await this.analyzePageComprehensive(servicePage, 'service', results);
    }

    // Analyze location pages
    for (const locationPage of siteStructure.locationPages) {
      await this.analyzePageComprehensive(locationPage, 'location', results);
    }

    // Calculate final scores using sophisticated importance-weighted algorithm
    this.calculateEnhancedScores(results);

    // Generate AI-powered recommendations and insights
    await this.generateSmartRecommendations(results);
    await this.enhanceWithAIInsights(results, siteStructure);

    console.log('[EnhancedAnalyzer] Analysis complete with AI insights', {
      totalFactors: results.summary.totalFactors,
      overallScore: results.summary.overallScore,
      categoryScores: results.summary.categoryScores,
      aiInsightsGenerated: true
    });

    return results;
  }

  /**
   * Analyze a single page with all 140+ factors across all categories
   */
  private async analyzePageComprehensive(
    page: PageCrawlResult, 
    pageType: string, 
    results: EnhancedAuditResult
  ): Promise<void> {
    const $ = cheerio.load(page.bodyText || '');
    
    console.log(`[EnhancedAnalyzer] Analyzing ${pageType} page: ${page.url}`);

    // Phase 1: Content Quality Analysis (35+ factors)
    const contentFactors = await this.contentAnalyzer.analyze(page, $);
    results.contentQuality.items.push(...this.enhanceFactorsWithPageInfo(contentFactors, page, pageType));

    // Phase 2: Technical SEO Analysis (40+ factors)
    const technicalFactors = await this.technicalAnalyzer.analyze(page, $);
    const enhancedTechnicalFactors = technicalFactors.map(factor => ({
      ...factor,
      category: factor.category || 'technical'
    }));
    results.technicalSEO.items.push(...this.enhanceFactorsWithPageInfo(enhancedTechnicalFactors, page, pageType));

    // Phase 3: Local SEO & E-E-A-T Analysis (35+ factors)
    const localFactors = await this.localSeoAnalyzer.analyze(page, $);
    const enhancedLocalFactors = localFactors.map(factor => ({
      ...factor,
      category: factor.category || 'local'
    }));
    results.localSEO.items.push(...this.enhanceFactorsWithPageInfo(enhancedLocalFactors, page, pageType));

    // Phase 4: UX & Performance Analysis (30+ factors)
    const uxFactors = await this.uxAnalyzer.analyze(page, $);
    const enhancedUxFactors = uxFactors.map(factor => ({
      ...factor,
      category: factor.category || 'ux'
    }));
    results.uxPerformance.items.push(...this.enhanceFactorsWithPageInfo(enhancedUxFactors, page, pageType));

    // Update metadata
    results.crawlMetadata!.pagesAnalyzed++;

    // Legacy compatibility - merge into original audit sections
    if (pageType === 'homepage') {
      results.onPage.items.push(...contentFactors.slice(0, 10)); // First 10 content factors
      results.structureNavigation.items.push(...enhancedTechnicalFactors.slice(0, 8)); // First 8 technical factors
    }
  }

  /**
   * Enhance factors with page-specific information for better tracking
   */
  private enhanceFactorsWithPageInfo(
    factors: AnalysisFactor[], 
    page: PageCrawlResult, 
    pageType: string
  ): any[] {
    return factors.map(factor => ({
      ...factor,
      pageUrl: page.url,
      pageTitle: page.title || `${pageType} page`,
      pageType: pageType,
      score: this.calculateFactorScore(factor.status, factor.importance),
      analysisDetails: {
        actual: this.extractActualValue(factor, page),
        expected: this.getExpectedValue(factor),
        metrics: this.gatherMetrics(factor, page),
        recommendations: this.generateFactorRecommendations(factor),
        difficulty: this.assessFixDifficulty(factor),
        estimatedImpact: this.assessImpact(factor),
        priority: this.calculatePriority(factor)
      }
    }));
  }

  /**
   * Calculate sophisticated importance-weighted scores preserving original algorithm
   */
  private calculateEnhancedScores(results: EnhancedAuditResult): void {
    console.log('[EnhancedAnalyzer] Calculating sophisticated importance-weighted scores');

    // Calculate category scores using preserved algorithm
    const categoryData = [
      { key: 'contentQuality', items: results.contentQuality.items, weight: 0.25 },
      { key: 'technicalSEO', items: results.technicalSEO.items, weight: 0.30 },
      { key: 'localSEO', items: results.localSEO.items, weight: 0.25 },
      { key: 'uxPerformance', items: results.uxPerformance.items, weight: 0.20 }
    ];

    let totalWeightedScore = 0;
    let totalFactors = 0;
    let priorityOfiCount = 0;
    let ofiCount = 0;
    let okCount = 0;
    let naCount = 0;

    for (const category of categoryData) {
      let categoryScore = 0;
      let categoryFactors = 0;

      for (const item of category.items) {
        const score = this.calculateFactorScore(item.status, item.importance);
        categoryScore += score;
        categoryFactors++;
        totalFactors++;

        // Count by status
        switch (item.status) {
          case 'Priority OFI': priorityOfiCount++; break;
          case 'OFI': ofiCount++; break;
          case 'OK': okCount++; break;
          case 'N/A': naCount++; break;
        }
      }

      const avgCategoryScore = categoryFactors > 0 ? categoryScore / categoryFactors : 0;
      (results.summary.categoryScores as any)[category.key] = Math.round(avgCategoryScore);
      totalWeightedScore += avgCategoryScore * category.weight;

      // Update category section scores
      const categorySection = (results as any)[category.key];
      if (categorySection) {
        categorySection.score = Math.round(avgCategoryScore);
        categorySection.completionRate = 100; // All factors analyzed
      }
    }

    // Update summary
    results.summary.totalFactors = totalFactors;
    results.summary.priorityOfiCount = priorityOfiCount;
    results.summary.ofiCount = ofiCount;
    results.summary.okCount = okCount;
    results.summary.naCount = naCount;
    results.summary.overallScore = Math.round(totalWeightedScore);

    console.log('[EnhancedAnalyzer] SOPHISTICATED IMPORTANCE-WEIGHTED SCORES:', {
      contentQuality: results.summary.categoryScores?.contentQuality,
      technicalSEO: results.summary.categoryScores?.technicalSEO,
      localSEO: results.summary.categoryScores?.localSEO,
      uxPerformance: results.summary.categoryScores?.uxPerformance,
      overallScore: results.summary.overallScore,
      totalFactors,
      scoringMethod: 'Sophisticated Importance-weighted (Enhanced Algorithm)'
    });
  }

  /**
   * Calculate factor score using preserved sophisticated algorithm
   */
  private calculateFactorScore(status: string, importance: string): number {
    const importancePenalty = {
      'High': 15,
      'Medium': 10,
      'Low': 5
    }[importance] || 10;

    switch (status) {
      case 'OK':
      case 'N/A':
        return 100; // Always perfect regardless of importance
      case 'OFI':
        return 60 - importancePenalty; // Base score minus importance penalty
      case 'Priority OFI':
        return 30 - importancePenalty; // Lower base minus importance penalty
      default:
        return 0;
    }
  }

  /**
   * Generate AI-powered smart recommendations based on analysis results
   */
  private async generateSmartRecommendations(results: EnhancedAuditResult): Promise<void> {
    const recommendations: string[] = [];

    // Analyze priority issues across all categories
    const allItems = [
      ...results.contentQuality.items,
      ...results.technicalSEO.items,
      ...results.localSEO.items,
      ...results.uxPerformance.items
    ];

    const priorityOFIs = allItems.filter(item => item.status === 'Priority OFI');
    const highImportanceOFIs = allItems.filter(item => 
      item.status === 'OFI' && item.importance === 'High'
    );

    // Generate category-specific recommendations
    if (results.summary.categoryScores?.technicalSEO && results.summary.categoryScores.technicalSEO < 70) {
      recommendations.push('Focus on technical SEO improvements for maximum impact on search rankings');
    }

    if (results.summary.categoryScores?.contentQuality && results.summary.categoryScores.contentQuality < 70) {
      recommendations.push('Enhance content quality and keyword optimization to improve user engagement');
    }

    if (priorityOFIs.length > 0) {
      recommendations.push(`Address ${priorityOFIs.length} critical issues immediately for best results`);
    }

    if (highImportanceOFIs.length > 0) {
      recommendations.push(`Prioritize ${highImportanceOFIs.length} high-impact opportunities for improvement`);
    }

    results.summary.recommendations = recommendations;
  }

  /**
   * Enhance results with AI-powered insights and strategic recommendations
   */
  private async enhanceWithAIInsights(results: EnhancedAuditResult, siteStructure: SiteStructure): Promise<void> {
    console.log('[EnhancedAnalyzer] Generating AI-powered insights...');

    try {
      // Collect all pages for AI analysis
      const allPages = [
        siteStructure.homepage,
        siteStructure.contactPage,
        ...siteStructure.servicePages,
        ...siteStructure.locationPages,
        ...siteStructure.otherPages.slice(0, 3) // Limit other pages
      ].filter(Boolean) as PageCrawlResult[];

      // Generate comprehensive AI content insights
      const contentInsights = await this.aiInsightsEngine.generateContentInsights(
        allPages,
        undefined, // TODO: Extract target keyword from audit config
        results.competitorComparison?.competitors
      );

      // Generate strategic SEO recommendations
      const strategicRecommendations = await this.seoBuddyAssistant.generateStrategicRecommendations(
        siteStructure,
        results,
        undefined, // TODO: Extract target keyword
        undefined  // TODO: Extract industry from analysis
      );

      // Enhance results with AI insights
      results.aiInsights = {
        contentAnalysis: {
          contentGaps: contentInsights.contentGaps,
          semanticRecommendations: contentInsights.semanticRecommendations,
          keywordOpportunities: contentInsights.keywordOpportunities,
          readabilityInsights: contentInsights.readabilityInsights,
          entityAnalysis: contentInsights.entityAnalysis,
          contentScore: contentInsights.contentScore
        },
        strategicRecommendations: {
          priorityActions: strategicRecommendations.priorityActions,
          quickWins: strategicRecommendations.quickWins,
          longTermStrategy: strategicRecommendations.longTermStrategy,
          implementationPlan: strategicRecommendations.implementationPlan
        },
        contentStrategy: contentInsights.contentStrategy,
        generatedAt: new Date().toISOString(),
        aiModel: 'gpt-4o-mini'
      };

      // Enhance critical factors with AI recommendations
      await this.enhanceFactorsWithAI(results, allPages);

      console.log('[EnhancedAnalyzer] AI insights generated successfully');

    } catch (error) {
      console.warn('[EnhancedAnalyzer] AI insights generation failed:', error);
      
      // Add basic AI insights structure even if AI fails
      results.aiInsights = {
        contentAnalysis: {
          contentGaps: ['Conduct comprehensive content analysis'],
          semanticRecommendations: ['Improve semantic keyword usage'],
          keywordOpportunities: ['Research additional keyword targets'],
          readabilityInsights: ['Review content readability'],
          entityAnalysis: { entities: [], authorityIndicators: [], eeatScore: 60 },
          contentScore: 70
        },
        strategicRecommendations: {
          priorityActions: [],
          quickWins: ['Update meta tags', 'Optimize images'],
          longTermStrategy: ['Develop content strategy'],
          implementationPlan: []
        },
        contentStrategy: ['Create comprehensive content plan'],
        generatedAt: new Date().toISOString(),
        aiModel: 'fallback',
        error: 'AI insights limited - manual review recommended'
      };
    }
  }

  /**
   * Enhance critical factors with AI-powered recommendations
   */
  private async enhanceFactorsWithAI(results: EnhancedAuditResult, pages: PageCrawlResult[]): Promise<void> {
    const criticalFactors = [
      ...results.contentQuality.items,
      ...results.technicalSEO.items,
      ...results.localSEO.items,
      ...results.uxPerformance.items
    ].filter(factor => 
      factor.status === 'Priority OFI' || 
      (factor.status === 'OFI' && factor.importance === 'High')
    ).slice(0, 5); // Limit to top 5 critical factors

    for (const factor of criticalFactors) {
      try {
        // Find the relevant page for this factor
        const relevantPage = pages.find(page => 
          page.url === factor.pageUrl || 
          factor.pageType === 'homepage' && page.url === pages[0]?.url
        ) || pages[0];

        if (relevantPage) {
          const enhancedFactor = await this.aiInsightsEngine.enhanceFactorWithAI(factor, relevantPage);
          
          // Update the factor in results
          Object.assign(factor, enhancedFactor);
        }
      } catch (error) {
        console.warn(`[EnhancedAnalyzer] Failed to enhance factor ${factor.name}:`, error);
      }
    }
  }

  // Helper methods for enhanced factor analysis
  private extractActualValue(factor: AnalysisFactor, page: PageCrawlResult): any {
    // Extract actual values based on factor type
    switch (factor.name) {
      case 'Content Readability Score':
        return this.calculateFleschReadingEase(page.bodyText);
      case 'Sufficient Content Length':
        return page.wordCount;
      default:
        return 'Analyzed';
    }
  }

  private getExpectedValue(factor: AnalysisFactor): any {
    // Return expected values based on factor type
    switch (factor.name) {
      case 'Content Readability Score':
        return '60+';
      case 'Sufficient Content Length':
        return '300+ words';
      default:
        return 'Optimized';
    }
  }

  private gatherMetrics(factor: AnalysisFactor, page: PageCrawlResult): Record<string, any> {
    return {
      pageUrl: page.url,
      pageTitle: page.title,
      wordCount: page.wordCount,
      analysisTimestamp: new Date().toISOString()
    };
  }

  private generateFactorRecommendations(factor: AnalysisFactor): string[] {
    // Extract recommendations from factor notes
    const lines = factor.notes.split('\n\n');
    const howSection = lines.find(line => line.startsWith('How:'));
    if (howSection) {
      return [howSection.replace('How: ', '')];
    }
    return ['Follow SEO best practices for this factor'];
  }

  private assessFixDifficulty(factor: AnalysisFactor): 'easy' | 'medium' | 'hard' {
    // Assess difficulty based on factor type and importance
    if (factor.importance === 'High' && factor.status === 'Priority OFI') {
      return 'hard';
    }
    if (factor.importance === 'Medium') {
      return 'medium';
    }
    return 'easy';
  }

  private assessImpact(factor: AnalysisFactor): 'low' | 'medium' | 'high' {
    return factor.importance.toLowerCase() as 'low' | 'medium' | 'high';
  }

  private calculatePriority(factor: AnalysisFactor): number {
    // Calculate priority score 1-10 based on status and importance
    const statusWeight = {
      'Priority OFI': 3,
      'OFI': 2,
      'OK': 1,
      'N/A': 0
    }[factor.status] || 0;

    const importanceWeight = {
      'High': 3,
      'Medium': 2,
      'Low': 1
    }[factor.importance] || 1;

    return Math.min(10, statusWeight * importanceWeight);
  }

  private calculateFleschReadingEase(text: string): number {
    // Simplified Flesch Reading Ease calculation
    const sentences = text.split(/[.!?]+/).length - 1;
    const words = text.split(/\s+/).length;
    const syllables = this.countSyllables(text);

    if (sentences === 0 || words === 0) return 0;

    return Math.round(206.835 - (1.015 * (words / sentences)) - (84.6 * (syllables / words)));
  }

  private countSyllables(text: string): number {
    // Simplified syllable counting
    const words = text.toLowerCase().split(/\s+/);
    let totalSyllables = 0;

    for (const word of words) {
      const syllables = word.match(/[aeiouy]+/g);
      totalSyllables += syllables ? syllables.length : 1;
    }

    return totalSyllables;
  }
}