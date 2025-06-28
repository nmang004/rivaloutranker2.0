import * as cheerio from 'cheerio';
import { contentAnalysisSchema } from '@/shared/schemas/analysis';
import type { z } from 'zod';

/**
 * Content Analysis Engine - Standard Analysis (20+ factors)
 * Focuses on content quality, keyword optimization, and readability
 */
export class ContentAnalysisEngine {

  /**
   * Analyze content quality and optimization (20+ factors)
   */
  async analyze(pageData: any, targetKeyword?: string): Promise<z.infer<typeof contentAnalysisSchema>> {
    console.log('[ContentEngine] Analyzing content quality and optimization');
    
    const $ = pageData.$;
    const bodyText = pageData.bodyText;
    const wordCount = pageData.wordCount;
    
    // 1. Content Length Analysis
    const hasMinimumContent = wordCount >= 300;
    const hasSubstantialContent = wordCount >= 1000;
    
    // 2. Keyword Density Analysis
    const keywordDensity = this.analyzeKeywordDensity(bodyText, targetKeyword);
    
    // 3. Readability Score
    const readabilityScore = this.calculateFleschReadingEase(bodyText);
    
    // 4. Heading Structure Analysis
    const headingStructure = this.analyzeHeadingStructure($);
    
    // 5. Content Quality Metrics
    const contentQuality = this.assessContentQuality(bodyText, pageData.title);
    
    // 6. Generate AI insights placeholder (will be enhanced with actual AI)
    const aiInsights = await this.generateContentInsights(bodyText, targetKeyword);
    
    return {
      wordCount,
      keywordDensity,
      readabilityScore,
      headingStructure,
      contentQuality,
      aiInsights
    };
  }

  /**
   * Analyze keyword density and optimization
   */
  private analyzeKeywordDensity(text: string, targetKeyword?: string): Record<string, number> {
    if (!targetKeyword) return {};
    
    const words = text.toLowerCase().split(/\s+/);
    const totalWords = words.length;
    const keyword = targetKeyword.toLowerCase();
    
    // Count exact keyword matches
    const exactMatches = words.filter(word => word.includes(keyword)).length;
    const density = (exactMatches / totalWords) * 100;
    
    // Extract other important keywords (top 10 by frequency)
    const wordFrequency: Record<string, number> = {};
    words.forEach(word => {
      if (word.length > 3 && !this.isStopWord(word)) {
        wordFrequency[word] = (wordFrequency[word] || 0) + 1;
      }
    });
    
    const topKeywords = Object.entries(wordFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .reduce((obj, [word, count]) => {
        obj[word] = (count / totalWords) * 100;
        return obj;
      }, {} as Record<string, number>);
    
    return {
      [keyword]: density,
      ...topKeywords
    };
  }

  /**
   * Calculate Flesch Reading Ease score
   */
  private calculateFleschReadingEase(text: string): number {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const words = text.split(/\s+/).length;
    const syllables = this.countSyllables(text);

    if (sentences === 0 || words === 0) return 0;

    const score = 206.835 - (1.015 * (words / sentences)) - (84.6 * (syllables / words));
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /**
   * Count syllables in text (simplified algorithm)
   */
  private countSyllables(text: string): number {
    const words = text.toLowerCase().split(/\s+/);
    let totalSyllables = 0;

    for (const word of words) {
      const cleaned = word.replace(/[^a-z]/g, '');
      if (cleaned.length === 0) continue;
      
      // Count vowel groups
      const vowelGroups = cleaned.match(/[aeiouy]+/g);
      let syllableCount = vowelGroups ? vowelGroups.length : 0;
      
      // Subtract silent e
      if (cleaned.endsWith('e') && syllableCount > 1) {
        syllableCount--;
      }
      
      // Minimum 1 syllable per word
      syllableCount = Math.max(1, syllableCount);
      totalSyllables += syllableCount;
    }

    return totalSyllables;
  }

  /**
   * Analyze heading structure and hierarchy
   */
  private analyzeHeadingStructure($: cheerio.CheerioAPI): any {
    const h1Count = $('h1').length;
    const h2Count = $('h2').length;
    const h3Count = $('h3').length;
    
    // Check for missing H1
    const missingH1 = h1Count === 0;
    
    // Check for proper hierarchy (simplified)
    const properHierarchy = !missingH1 && h1Count === 1 && h2Count > 0;
    
    return {
      h1Count,
      h2Count,
      h3Count,
      missingH1,
      properHierarchy
    };
  }

  /**
   * Assess content quality metrics
   */
  private assessContentQuality(text: string, title?: string): any {
    // Simplified content quality assessment
    const uniqueness = this.assessUniqueness(text);
    const relevance = this.assessRelevance(text, title);
    const engagement = this.assessEngagement(text);
    const expertise = this.assessExpertise(text);
    
    return {
      uniqueness,
      relevance,
      engagement,
      expertise
    };
  }

  /**
   * Generate AI-powered content insights (placeholder for now)
   */
  private async generateContentInsights(text: string, targetKeyword?: string): Promise<any> {
    // This would integrate with OpenAI API in production
    // For now, return static insights based on analysis
    
    const insights = {
      topicRelevance: this.assessTopicRelevance(text, targetKeyword),
      contentGaps: this.identifyContentGaps(text),
      improvementSuggestions: this.generateImprovementSuggestions(text),
      semanticKeywords: this.extractSemanticKeywords(text)
    };
    
    return insights;
  }

  // Helper methods for content quality assessment
  private assessUniqueness(text: string): number {
    // Simplified uniqueness score based on text patterns
    const words = text.split(/\s+/);
    const uniqueWords = new Set(words.map(w => w.toLowerCase()));
    return Math.round((uniqueWords.size / words.length) * 100);
  }

  private assessRelevance(text: string, title?: string): number {
    // Simplified relevance score
    if (!title) return 70;
    
    const titleWords = title.toLowerCase().split(/\s+/);
    const textWords = text.toLowerCase().split(/\s+/);
    
    const matchingWords = titleWords.filter(word => 
      textWords.some(textWord => textWord.includes(word) || word.includes(textWord))
    );
    
    return Math.round((matchingWords.length / titleWords.length) * 100);
  }

  private assessEngagement(text: string): number {
    // Simplified engagement score based on readability and structure
    const sentences = text.split(/[.!?]+/).length;
    const words = text.split(/\s+/).length;
    const avgSentenceLength = words / sentences;
    
    // Prefer moderate sentence length (10-20 words)
    const sentenceLengthScore = avgSentenceLength > 10 && avgSentenceLength < 20 ? 90 : 60;
    
    // Check for engaging elements
    const hasQuestions = text.includes('?');
    const hasLists = text.includes('•') || /\d+\./.test(text);
    
    let engagementScore = sentenceLengthScore;
    if (hasQuestions) engagementScore += 5;
    if (hasLists) engagementScore += 5;
    
    return Math.min(100, engagementScore);
  }

  private assessExpertise(text: string): number {
    // Simplified expertise assessment
    const expertiseIndicators = [
      /research|study|analysis|data|statistics/i,
      /years of experience|expert|professional|certified/i,
      /according to|based on|studies show/i
    ];
    
    let expertiseScore = 60; // Base score
    
    expertiseIndicators.forEach(pattern => {
      if (pattern.test(text)) expertiseScore += 10;
    });
    
    return Math.min(100, expertiseScore);
  }

  private assessTopicRelevance(text: string, targetKeyword?: string): string {
    if (!targetKeyword) return 'No target keyword specified';
    
    const density = this.analyzeKeywordDensity(text, targetKeyword)[targetKeyword.toLowerCase()] || 0;
    
    if (density > 3) return 'High keyword focus - consider natural variation';
    if (density > 1) return 'Good keyword relevance';
    if (density > 0.5) return 'Moderate keyword presence';
    return 'Low keyword density - consider adding more relevant content';
  }

  private identifyContentGaps(text: string): string[] {
    const gaps = [];
    
    if (text.length < 1000) gaps.push('Consider adding more comprehensive content');
    if (!text.includes('?')) gaps.push('Add engaging questions to improve readability');
    if (!/\d+/.test(text)) gaps.push('Include specific data or statistics');
    
    return gaps;
  }

  private generateImprovementSuggestions(text: string): string[] {
    const suggestions = [];
    
    const words = text.split(/\s+/).length;
    if (words < 300) suggestions.push('Expand content to at least 300 words');
    if (words > 2000) suggestions.push('Consider breaking content into sections');
    
    const readability = this.calculateFleschReadingEase(text);
    if (readability < 30) suggestions.push('Simplify language for better readability');
    
    return suggestions;
  }

  private extractSemanticKeywords(text: string): string[] {
    // Simplified semantic keyword extraction
    const words = text.toLowerCase().split(/\s+/);
    const wordFreq: Record<string, number> = {};
    
    words.forEach(word => {
      if (word.length > 4 && !this.isStopWord(word)) {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    });
    
    return Object.entries(wordFreq)
      .filter(([, count]) => count >= 2)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);
  }

  /**
   * Check if word is a stop word
   */
  private isStopWord(word: string): boolean {
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did',
      'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those'
    ]);
    
    return stopWords.has(word.toLowerCase());
  }
}