import OpenAI from 'openai';
import type { PageCrawlResult } from '../../audit/enhanced-analyzer.service';
import type { AnalysisFactor } from '../../audit/analyzers/index';

/**
 * AI Content Insights Engine - Phase 3.2
 * Advanced AI-powered content analysis using GPT-4 for semantic understanding,
 * content gaps, optimization opportunities, and strategic recommendations
 */
export class AIContentInsightsEngine {
  private openai: OpenAI | null = null;
  private isConfigured: boolean = false;

  constructor() {
    // Initialize OpenAI client if API key is available
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      this.openai = new OpenAI({ apiKey });
      this.isConfigured = true;
    } else {
      console.warn('[AIContentInsights] OpenAI API key not configured. AI insights will be limited.');
      this.isConfigured = false;
    }
  }

  /**
   * Generate comprehensive AI-powered content insights
   */
  async generateContentInsights(
    pages: PageCrawlResult[],
    targetKeyword?: string,
    competitorData?: any[]
  ): Promise<{
    contentGaps: string[];
    semanticRecommendations: string[];
    keywordOpportunities: string[];
    contentStrategy: string[];
    readabilityInsights: string[];
    entityAnalysis: any;
    contentScore: number;
  }> {

    if (!this.isConfigured) {
      return this.getFallbackInsights(pages, targetKeyword);
    }

    try {
      console.log('[AIContentInsights] Generating AI-powered content insights...');

      // Prepare content for analysis
      const contentSummary = this.prepareContentForAnalysis(pages);
      
      // Run parallel AI analyses
      const [
        contentGapAnalysis,
        semanticAnalysis,
        keywordAnalysis,
        strategicAnalysis,
        readabilityAnalysis,
        entityAnalysis
      ] = await Promise.all([
        this.analyzeContentGaps(contentSummary, targetKeyword),
        this.analyzeSemanticContent(contentSummary, targetKeyword),
        this.analyzeKeywordOpportunities(contentSummary, targetKeyword, competitorData),
        this.generateContentStrategy(contentSummary, targetKeyword),
        this.analyzeReadability(contentSummary),
        this.performEntityAnalysis(contentSummary)
      ]);

      // Calculate overall content score
      const contentScore = this.calculateAIContentScore({
        contentGapAnalysis,
        semanticAnalysis,
        keywordAnalysis,
        readabilityAnalysis,
        pages
      });

      return {
        contentGaps: contentGapAnalysis.gaps,
        semanticRecommendations: semanticAnalysis.recommendations,
        keywordOpportunities: keywordAnalysis.opportunities,
        contentStrategy: strategicAnalysis.strategies,
        readabilityInsights: readabilityAnalysis.insights,
        entityAnalysis,
        contentScore
      };

    } catch (error) {
      console.error('[AIContentInsights] Error generating insights:', error);
      return this.getFallbackInsights(pages, targetKeyword);
    }
  }

  /**
   * Analyze content gaps using AI
   */
  private async analyzeContentGaps(contentSummary: string, targetKeyword?: string): Promise<{
    gaps: string[];
    missingTopics: string[];
    depthAnalysis: string;
  }> {
    
    const prompt = `Analyze the following website content for content gaps and missing opportunities:

Content Summary:
${contentSummary}

${targetKeyword ? `Target Keyword: ${targetKeyword}` : ''}

Please provide:
1. Content gaps that should be addressed
2. Missing topics that would improve topical authority
3. Analysis of content depth and comprehensiveness

Respond in JSON format:
{
  "gaps": ["gap1", "gap2", ...],
  "missingTopics": ["topic1", "topic2", ...],
  "depthAnalysis": "detailed analysis of content depth"
}`;

    try {
      if (!this.openai) {
        throw new Error('OpenAI client not initialized');
      }
      
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert SEO content strategist. Analyze content comprehensively and provide actionable insights in valid JSON format.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 1000
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      return {
        gaps: result.gaps || [],
        missingTopics: result.missingTopics || [],
        depthAnalysis: result.depthAnalysis || 'Content depth analysis not available'
      };

    } catch (error) {
      console.warn('[AIContentInsights] Content gap analysis failed:', error);
      return {
        gaps: ['Conduct thorough content audit', 'Expand topic coverage', 'Add supporting content'],
        missingTopics: ['Industry trends', 'FAQ content', 'Case studies'],
        depthAnalysis: 'Manual content review recommended'
      };
    }
  }

  /**
   * Analyze semantic content and context
   */
  private async analyzeSemanticContent(contentSummary: string, targetKeyword?: string): Promise<{
    recommendations: string[];
    semanticKeywords: string[];
    contextAnalysis: string;
  }> {

    const prompt = `Perform semantic analysis of this website content:

Content Summary:
${contentSummary}

${targetKeyword ? `Primary Target: ${targetKeyword}` : ''}

Analyze:
1. Semantic richness and context
2. Related terms and concepts that should be included
3. Semantic SEO recommendations

Respond in JSON format:
{
  "recommendations": ["recommendation1", "recommendation2", ...],
  "semanticKeywords": ["term1", "term2", ...],
  "contextAnalysis": "detailed semantic analysis"
}`;

    try {
      if (!this.openai) {
        throw new Error('OpenAI client not initialized');
      }
      
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert in semantic SEO and natural language processing. Provide detailed semantic analysis for content optimization.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 1000
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      return {
        recommendations: result.recommendations || [],
        semanticKeywords: result.semanticKeywords || [],
        contextAnalysis: result.contextAnalysis || 'Semantic analysis not available'
      };

    } catch (error) {
      console.warn('[AIContentInsights] Semantic analysis failed:', error);
      return {
        recommendations: ['Improve semantic keyword usage', 'Add contextual terms', 'Enhance topical relevance'],
        semanticKeywords: ['related terms', 'contextual keywords', 'semantic variations'],
        contextAnalysis: 'Manual semantic review recommended'
      };
    }
  }

  /**
   * Analyze keyword opportunities with competitor context
   */
  private async analyzeKeywordOpportunities(
    contentSummary: string, 
    targetKeyword?: string,
    competitorData?: any[]
  ): Promise<{
    opportunities: string[];
    gapKeywords: string[];
    difficultyAssessment: string;
  }> {

    const competitorContext = competitorData?.length 
      ? `\n\nCompetitor Analysis:\n${competitorData.map(c => `- ${c.url}: ${c.strengths?.join(', ')}`).join('\n')}`
      : '';

    const prompt = `Identify keyword opportunities for this website:

Content Summary:
${contentSummary}

${targetKeyword ? `Current Target: ${targetKeyword}` : ''}${competitorContext}

Identify:
1. Keyword opportunities that are currently missed
2. Gap keywords not adequately covered
3. Difficulty assessment for ranking improvements

Respond in JSON format:
{
  "opportunities": ["opportunity1", "opportunity2", ...],
  "gapKeywords": ["keyword1", "keyword2", ...],
  "difficultyAssessment": "assessment of ranking difficulty"
}`;

    try {
      if (!this.openai) {
        throw new Error('OpenAI client not initialized');
      }
      
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert keyword researcher and SEO strategist. Provide actionable keyword opportunities based on content analysis.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 1000
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      return {
        opportunities: result.opportunities || [],
        gapKeywords: result.gapKeywords || [],
        difficultyAssessment: result.difficultyAssessment || 'Keyword difficulty assessment not available'
      };

    } catch (error) {
      console.warn('[AIContentInsights] Keyword analysis failed:', error);
      return {
        opportunities: ['Target long-tail variations', 'Add location-based keywords', 'Include industry-specific terms'],
        gapKeywords: ['service + location', 'industry terms', 'solution keywords'],
        difficultyAssessment: 'Manual keyword research recommended'
      };
    }
  }

  /**
   * Generate comprehensive content strategy
   */
  private async generateContentStrategy(contentSummary: string, targetKeyword?: string): Promise<{
    strategies: string[];
    contentTypes: string[];
    priorityActions: string[];
  }> {

    const prompt = `Create a comprehensive content strategy based on this analysis:

Content Summary:
${contentSummary}

${targetKeyword ? `Primary Focus: ${targetKeyword}` : ''}

Develop:
1. Strategic content recommendations
2. Content types that would improve performance
3. Priority actions for immediate impact

Respond in JSON format:
{
  "strategies": ["strategy1", "strategy2", ...],
  "contentTypes": ["type1", "type2", ...],
  "priorityActions": ["action1", "action2", ...]
}`;

    try {
      if (!this.openai) {
        throw new Error('OpenAI client not initialized');
      }
      
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a senior content strategist with expertise in SEO content planning. Provide comprehensive, actionable content strategies.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.4,
        max_tokens: 1000
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      return {
        strategies: result.strategies || [],
        contentTypes: result.contentTypes || [],
        priorityActions: result.priorityActions || []
      };

    } catch (error) {
      console.warn('[AIContentInsights] Strategy generation failed:', error);
      return {
        strategies: ['Create comprehensive service pages', 'Develop FAQ content', 'Add case studies'],
        contentTypes: ['Service descriptions', 'How-to guides', 'Industry insights'],
        priorityActions: ['Optimize existing content', 'Create missing pages', 'Improve content depth']
      };
    }
  }

  /**
   * Analyze content readability and user experience
   */
  private async analyzeReadability(contentSummary: string): Promise<{
    insights: string[];
    readabilityScore: number;
    improvements: string[];
  }> {

    const prompt = `Analyze the readability and user experience of this content:

Content Sample:
${contentSummary.substring(0, 1500)}

Evaluate:
1. Readability and clarity
2. User experience factors
3. Specific improvements needed

Respond in JSON format:
{
  "insights": ["insight1", "insight2", ...],
  "readabilityScore": 75,
  "improvements": ["improvement1", "improvement2", ...]
}`;

    try {
      if (!this.openai) {
        throw new Error('OpenAI client not initialized');
      }
      
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert in content readability and user experience. Analyze content for clarity and accessibility.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 800
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      return {
        insights: result.insights || [],
        readabilityScore: result.readabilityScore || 70,
        improvements: result.improvements || []
      };

    } catch (error) {
      console.warn('[AIContentInsights] Readability analysis failed:', error);
      return {
        insights: ['Content readability needs assessment', 'Consider user experience improvements'],
        readabilityScore: 70,
        improvements: ['Use shorter sentences', 'Add subheadings', 'Improve paragraph structure']
      };
    }
  }

  /**
   * Perform entity analysis for E-E-A-T
   */
  private async performEntityAnalysis(contentSummary: string): Promise<{
    entities: string[];
    authorityIndicators: string[];
    eeatScore: number;
  }> {

    const prompt = `Analyze entities and E-E-A-T signals in this content:

Content Summary:
${contentSummary}

Identify:
1. Key entities mentioned
2. Authority and expertise indicators
3. E-E-A-T score assessment (0-100)

Respond in JSON format:
{
  "entities": ["entity1", "entity2", ...],
  "authorityIndicators": ["indicator1", "indicator2", ...],
  "eeatScore": 75
}`;

    try {
      if (!this.openai) {
        throw new Error('OpenAI client not initialized');
      }
      
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert in entity analysis and E-E-A-T evaluation for SEO. Analyze content for authority signals and entity relationships.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
        max_tokens: 600
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      return {
        entities: result.entities || [],
        authorityIndicators: result.authorityIndicators || [],
        eeatScore: result.eeatScore || 60
      };

    } catch (error) {
      console.warn('[AIContentInsights] Entity analysis failed:', error);
      return {
        entities: ['business name', 'industry terms', 'location entities'],
        authorityIndicators: ['professional credentials', 'experience indicators', 'trust signals'],
        eeatScore: 60
      };
    }
  }

  /**
   * Prepare content summary for AI analysis
   */
  private prepareContentForAnalysis(pages: PageCrawlResult[]): string {
    let summary = '';
    
    for (const page of pages.slice(0, 5)) { // Limit to first 5 pages for token management
      summary += `\n\nPage: ${page.url}\n`;
      summary += `Title: ${page.title || 'No title'}\n`;
      summary += `Meta Description: ${page.metaDescription || 'No description'}\n`;
      
      // Add headings structure
      if (page.headings) {
        const allHeadings = Object.entries(page.headings)
          .flatMap(([tag, texts]) => texts.map(text => `${tag.toUpperCase()}: ${text}`))
          .slice(0, 10); // Limit headings
        summary += `Headings: ${allHeadings.join(', ')}\n`;
      }
      
      // Add content sample (first 300 characters)
      summary += `Content Sample: ${page.bodyText.substring(0, 300)}...\n`;
      summary += `Word Count: ${page.wordCount}\n`;
    }
    
    return summary.substring(0, 4000); // Limit total summary length
  }

  /**
   * Calculate AI-powered content score
   */
  private calculateAIContentScore(analysisResults: any): number {
    let score = 70; // Base score

    // Adjust based on analysis results
    if (analysisResults.contentGapAnalysis?.gaps?.length < 3) score += 10;
    if (analysisResults.semanticAnalysis?.semanticKeywords?.length > 5) score += 5;
    if (analysisResults.keywordAnalysis?.opportunities?.length > 3) score += 5;
    if (analysisResults.readabilityAnalysis?.readabilityScore > 80) score += 10;

    // Adjust based on page count and content depth
    const avgWordCount = analysisResults.pages?.reduce((sum: number, page: PageCrawlResult) => 
      sum + page.wordCount, 0) / (analysisResults.pages?.length || 1);
    
    if (avgWordCount > 500) score += 5;
    if (avgWordCount > 1000) score += 5;

    return Math.min(100, Math.max(0, score));
  }

  /**
   * Fallback insights when AI is not available
   */
  private getFallbackInsights(pages: PageCrawlResult[], targetKeyword?: string): any {
    console.log('[AIContentInsights] Using fallback insights (AI not configured)');
    
    const avgWordCount = pages.reduce((sum, page) => sum + page.wordCount, 0) / pages.length;
    
    return {
      contentGaps: [
        'Expand content depth and comprehensiveness',
        'Add more supporting details and examples',
        'Include industry-specific information'
      ],
      semanticRecommendations: [
        'Use related keywords and synonyms naturally',
        'Add contextual terms around main topics',
        'Improve semantic keyword density'
      ],
      keywordOpportunities: [
        targetKeyword ? `Optimize for variations of "${targetKeyword}"` : 'Research target keywords',
        'Add long-tail keyword variations',
        'Include location-based keywords if applicable'
      ],
      contentStrategy: [
        'Create comprehensive service/product pages',
        'Develop FAQ and help content',
        'Add case studies or examples'
      ],
      readabilityInsights: [
        avgWordCount < 300 ? 'Increase content length for better depth' : 'Content length is adequate',
        'Use clear headings and subheadings',
        'Improve paragraph structure and readability'
      ],
      entityAnalysis: {
        entities: ['business name', 'industry terms', 'service areas'],
        authorityIndicators: ['professional experience', 'credentials', 'testimonials'],
        eeatScore: 65
      },
      contentScore: avgWordCount > 500 ? 75 : 60
    };
  }

  /**
   * Generate AI-powered SEO factor analysis
   */
  async enhanceFactorWithAI(factor: AnalysisFactor, page: PageCrawlResult): Promise<AnalysisFactor> {
    if (!this.isConfigured || factor.status === 'OK') {
      return factor; // Don't enhance if AI not available or factor is already OK
    }

    try {
      const enhancedNotes = await this.generateEnhancedFactorNotes(factor, page);
      
      return {
        ...factor,
        notes: enhancedNotes
      };

    } catch (error) {
      console.warn(`[AIContentInsights] Failed to enhance factor ${factor.name}:`, error);
      return factor;
    }
  }

  /**
   * Generate enhanced factor notes using AI
   */
  private async generateEnhancedFactorNotes(factor: AnalysisFactor, page: PageCrawlResult): Promise<string> {
    const prompt = `Enhance this SEO factor analysis with specific, actionable recommendations:

Factor: ${factor.name}
Status: ${factor.status}
Importance: ${factor.importance}
Current Notes: ${factor.notes}

Page Context:
- URL: ${page.url}
- Title: ${page.title}
- Word Count: ${page.wordCount}
- Page Type: ${page.pageType}

Provide enhanced analysis with:
1. Specific issues found
2. Step-by-step fix instructions
3. Expected impact of fixing this issue
4. Priority level for implementation

Keep response concise but actionable (max 300 words).`;

    try {
      if (!this.openai) {
        throw new Error('OpenAI client not initialized');
      }
      
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert SEO consultant. Provide specific, actionable recommendations for SEO factor improvements.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 400
      });

      return response.choices[0].message.content || factor.notes;

    } catch (error) {
      console.warn('[AIContentInsights] Enhanced notes generation failed:', error);
      return factor.notes;
    }
  }
}