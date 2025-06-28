import { competitorAnalysisSchema } from '@/shared/schemas/analysis';
import type { z } from 'zod';

/**
 * Competitor Analysis Engine
 * Compares primary site with competitors across multiple factors
 */
export class CompetitorAnalysisEngine {

  /**
   * Compare primary analysis with competitor analyses
   */
  async compare(
    primaryAnalysis: any,
    competitorAnalyses: any[],
    targetKeyword?: string
  ): Promise<z.infer<typeof competitorAnalysisSchema>> {
    console.log('[CompetitorEngine] Running competitor comparison analysis');
    
    // Process competitor data
    const competitors = this.processCompetitorData(competitorAnalyses, targetKeyword);
    
    // Generate comparison insights
    const comparison = this.generateComparison(primaryAnalysis, competitors, targetKeyword);
    
    return {
      competitors,
      comparison
    };
  }

  /**
   * Process competitor data into standardized format
   */
  private processCompetitorData(competitorAnalyses: any[], targetKeyword?: string): any[] {
    return competitorAnalyses.map(competitor => {
      if (competitor.error) {
        return {
          url: competitor.url,
          title: 'Analysis Failed',
          error: competitor.error,
          analysisAvailable: false
        };
      }

      const contentAnalysis = competitor.contentAnalysis || {};
      const technicalAnalysis = competitor.technicalAnalysis || {};
      const pageData = competitor.pageData || {};

      // Calculate competitor scores
      const contentScore = this.calculateContentScore(contentAnalysis);
      const technicalScore = this.calculateTechnicalScore(technicalAnalysis);
      const overallScore = Math.round((contentScore + technicalScore) / 2);

      // Identify strengths and weaknesses
      const strengths = this.identifyStrengths(contentAnalysis, technicalAnalysis);
      const weaknesses = this.identifyWeaknesses(contentAnalysis, technicalAnalysis);

      return {
        url: competitor.url,
        title: pageData.title || 'Unknown Title',
        metaDescription: pageData.metaDescription || '',
        contentLength: pageData.wordCount || 0,
        keywordDensity: this.extractKeywordDensity(contentAnalysis, targetKeyword),
        pageSpeed: technicalAnalysis.pageSpeed?.desktop || 0,
        backlinks: 0, // Placeholder - would need external API
        domainAuthority: 0, // Placeholder - would need external API
        overallScore,
        contentScore,
        technicalScore,
        strengths,
        weaknesses,
        analysisAvailable: true
      };
    });
  }

  /**
   * Generate comparison insights between primary and competitors
   */
  private generateComparison(primaryAnalysis: any, competitors: any[], targetKeyword?: string): any {
    const availableCompetitors = competitors.filter(c => c.analysisAvailable);
    
    if (availableCompetitors.length === 0) {
      return {
        contentGaps: ['Unable to analyze competitors'],
        keywordOpportunities: [],
        technicalAdvantages: [],
        improvementAreas: ['Competitor analysis unavailable']
      };
    }

    // Content gaps analysis
    const contentGaps = this.identifyContentGaps(primaryAnalysis, availableCompetitors);
    
    // Keyword opportunities
    const keywordOpportunities = this.identifyKeywordOpportunities(primaryAnalysis, availableCompetitors, targetKeyword);
    
    // Technical advantages
    const technicalAdvantages = this.identifyTechnicalAdvantages(primaryAnalysis, availableCompetitors);
    
    // Improvement areas
    const improvementAreas = this.identifyImprovementAreas(primaryAnalysis, availableCompetitors);

    return {
      contentGaps,
      keywordOpportunities,
      technicalAdvantages,
      improvementAreas
    };
  }

  /**
   * Calculate content score for competitor
   */
  private calculateContentScore(contentAnalysis: any): number {
    let score = 70; // Base score
    
    if (contentAnalysis.wordCount > 300) score += 10;
    if (contentAnalysis.wordCount > 1000) score += 10;
    if (contentAnalysis.readabilityScore > 60) score += 5;
    if (contentAnalysis.headingStructure?.h1Count === 1) score += 5;
    
    return Math.min(100, score);
  }

  /**
   * Calculate technical score for competitor
   */
  private calculateTechnicalScore(technicalAnalysis: any): number {
    let score = 70; // Base score
    
    if (technicalAnalysis.seoTechnicals?.metaTitle?.exists) score += 5;
    if (technicalAnalysis.seoTechnicals?.metaDescription?.exists) score += 5;
    if (technicalAnalysis.seoTechnicals?.canonicalTag) score += 5;
    if (technicalAnalysis.seoTechnicals?.sslCertificate) score += 5;
    if (technicalAnalysis.seoTechnicals?.mobileResponsive) score += 10;
    
    return Math.min(100, score);
  }

  /**
   * Identify competitor strengths
   */
  private identifyStrengths(contentAnalysis: any, technicalAnalysis: any): string[] {
    const strengths = [];
    
    if (contentAnalysis.wordCount > 1000) {
      strengths.push('Comprehensive content length');
    }
    
    if (contentAnalysis.readabilityScore > 70) {
      strengths.push('Excellent readability');
    }
    
    if (technicalAnalysis.pageSpeed?.desktop > 80) {
      strengths.push('Fast page loading');
    }
    
    if (technicalAnalysis.seoTechnicals?.schemaMarkup?.length > 0) {
      strengths.push('Rich schema markup');
    }
    
    if (technicalAnalysis.images?.altTextPercentage > 80) {
      strengths.push('Well-optimized images');
    }
    
    return strengths;
  }

  /**
   * Identify competitor weaknesses
   */
  private identifyWeaknesses(contentAnalysis: any, technicalAnalysis: any): string[] {
    const weaknesses = [];
    
    if (contentAnalysis.wordCount < 300) {
      weaknesses.push('Insufficient content length');
    }
    
    if (contentAnalysis.readabilityScore < 50) {
      weaknesses.push('Poor readability');
    }
    
    if (technicalAnalysis.pageSpeed?.desktop < 60) {
      weaknesses.push('Slow page loading');
    }
    
    if (!technicalAnalysis.seoTechnicals?.metaDescription?.exists) {
      weaknesses.push('Missing meta description');
    }
    
    if (!technicalAnalysis.seoTechnicals?.sslCertificate) {
      weaknesses.push('No SSL certificate');
    }
    
    return weaknesses;
  }

  /**
   * Extract keyword density for comparison
   */
  private extractKeywordDensity(contentAnalysis: any, targetKeyword?: string): Record<string, number> {
    if (!targetKeyword || !contentAnalysis.keywordDensity) {
      return {};
    }
    
    return contentAnalysis.keywordDensity;
  }

  /**
   * Identify content gaps compared to competitors
   */
  private identifyContentGaps(primaryAnalysis: any, competitors: any[]): string[] {
    const gaps = [];
    
    const primaryWordCount = primaryAnalysis.contentAnalysis?.wordCount || 0;
    const avgCompetitorWordCount = competitors.reduce((sum, c) => sum + c.contentLength, 0) / competitors.length;
    
    if (primaryWordCount < avgCompetitorWordCount * 0.8) {
      gaps.push(`Content is shorter than competitors (${primaryWordCount} vs avg ${Math.round(avgCompetitorWordCount)} words)`);
    }
    
    const competitorsWithSchema = competitors.filter(c => c.strengths.includes('Rich schema markup')).length;
    if (competitorsWithSchema > competitors.length / 2) {
      gaps.push('Consider adding more structured data markup');
    }
    
    const competitorsWithGoodReadability = competitors.filter(c => c.strengths.includes('Excellent readability')).length;
    if (competitorsWithGoodReadability > competitors.length / 2) {
      gaps.push('Improve content readability to match competitor standards');
    }
    
    return gaps;
  }

  /**
   * Identify keyword opportunities from competitor analysis
   */
  private identifyKeywordOpportunities(primaryAnalysis: any, competitors: any[], targetKeyword?: string): string[] {
    const opportunities = [];
    
    if (!targetKeyword) {
      opportunities.push('Define target keywords for better optimization');
      return opportunities;
    }
    
    // Analyze keyword density compared to competitors
    const primaryDensity = primaryAnalysis.contentAnalysis?.keywordDensity?.[targetKeyword.toLowerCase()] || 0;
    const competitorDensities = competitors
      .map(c => c.keywordDensity[targetKeyword.toLowerCase()] || 0)
      .filter(d => d > 0);
    
    if (competitorDensities.length > 0) {
      const avgCompetitorDensity = competitorDensities.reduce((sum, d) => sum + d, 0) / competitorDensities.length;
      
      if (primaryDensity < avgCompetitorDensity * 0.7) {
        opportunities.push(`Increase "${targetKeyword}" density (currently ${primaryDensity.toFixed(2)}%, competitors avg ${avgCompetitorDensity.toFixed(2)}%)`);
      }
    }
    
    return opportunities;
  }

  /**
   * Identify technical advantages over competitors
   */
  private identifyTechnicalAdvantages(primaryAnalysis: any, competitors: any[]): string[] {
    const advantages = [];
    
    const primaryTechnical = primaryAnalysis.technicalAnalysis || {};
    
    // Page speed advantage
    const primarySpeed = primaryTechnical.pageSpeed?.desktop || 0;
    const competitorSpeeds = competitors.map(c => c.pageSpeed).filter(s => s > 0);
    
    if (competitorSpeeds.length > 0) {
      const avgCompetitorSpeed = competitorSpeeds.reduce((sum, s) => sum + s, 0) / competitorSpeeds.length;
      if (primarySpeed > avgCompetitorSpeed * 1.1) {
        advantages.push('Faster page loading than competitors');
      }
    }
    
    // SSL advantage
    if (primaryTechnical.seoTechnicals?.sslCertificate) {
      const competitorsWithoutSSL = competitors.filter(c => 
        c.weaknesses.includes('No SSL certificate')
      ).length;
      
      if (competitorsWithoutSSL > 0) {
        advantages.push('SSL certificate provides security advantage');
      }
    }
    
    // Mobile responsive advantage
    if (primaryTechnical.seoTechnicals?.mobileResponsive) {
      const competitorsNotMobile = competitors.filter(c => 
        !c.strengths.includes('Mobile responsive')
      ).length;
      
      if (competitorsNotMobile > competitors.length / 2) {
        advantages.push('Mobile optimization advantage over competitors');
      }
    }
    
    return advantages;
  }

  /**
   * Identify areas for improvement based on competitor analysis
   */
  private identifyImprovementAreas(primaryAnalysis: any, competitors: any[]): string[] {
    const improvementAreas = [];
    
    // Find areas where competitors consistently outperform
    const competitorStrengths = competitors.reduce((strengths, competitor) => {
      competitor.strengths.forEach((strength: string) => {
        strengths[strength] = (strengths[strength] || 0) + 1;
      });
      return strengths;
    }, {} as Record<string, number>);
    
    // Identify common competitor strengths
    Object.entries(competitorStrengths).forEach(([strength, count]) => {
      if ((count as number) > competitors.length / 2) {
        improvementAreas.push(`Consider focusing on: ${strength.toLowerCase()}`);
      }
    });
    
    // Content length improvement
    const avgCompetitorLength = competitors.reduce((sum, c) => sum + c.contentLength, 0) / competitors.length;
    const primaryLength = primaryAnalysis.contentAnalysis?.wordCount || 0;
    
    if (primaryLength < avgCompetitorLength * 0.8) {
      improvementAreas.push('Expand content to match competitor depth');
    }
    
    // Technical improvements
    const primaryTechnical = primaryAnalysis.technicalAnalysis || {};
    
    if (!primaryTechnical.seoTechnicals?.metaDescription?.exists) {
      const competitorsWithMeta = competitors.filter(c => 
        !c.weaknesses.includes('Missing meta description')
      ).length;
      
      if (competitorsWithMeta > competitors.length / 2) {
        improvementAreas.push('Add meta description to match competitor standards');
      }
    }
    
    return improvementAreas;
  }
}