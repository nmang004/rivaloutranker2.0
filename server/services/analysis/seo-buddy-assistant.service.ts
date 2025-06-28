import OpenAI from 'openai';
import type { PageCrawlResult, SiteStructure } from '../audit/enhanced-analyzer.service';
import type { AnalysisFactor } from '../audit/analyzers/index';

/**
 * Enhanced SEO Buddy Assistant - Phase 3.2
 * Context-aware AI assistant that provides personalized SEO recommendations
 * based on comprehensive site analysis and industry best practices
 */
export class SEOBuddyAssistant {
  private openai: OpenAI | null = null;
  private isConfigured: boolean = false;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      this.openai = new OpenAI({ apiKey });
      this.isConfigured = true;
    } else {
      console.warn('[SEOBuddy] OpenAI API key not configured. AI recommendations will be limited.');
      this.isConfigured = false;
    }
  }

  /**
   * Generate comprehensive SEO strategy recommendations
   */
  async generateStrategicRecommendations(
    siteStructure: SiteStructure,
    auditResults: any,
    targetKeyword?: string,
    industry?: string
  ): Promise<{
    priorityActions: Array<{
      title: string;
      description: string;
      impact: 'high' | 'medium' | 'low';
      difficulty: 'easy' | 'medium' | 'hard';
      timeframe: string;
      category: string;
    }>;
    quickWins: string[];
    longTermStrategy: string[];
    industrySpecificTips: string[];
    implementationPlan: Array<{
      phase: string;
      actions: string[];
      timeline: string;
      expectedOutcome: string;
    }>;
  }> {

    if (!this.isConfigured) {
      return this.getFallbackRecommendations(auditResults, targetKeyword);
    }

    try {
      console.log('[SEOBuddy] Generating strategic SEO recommendations...');

      // Prepare comprehensive context
      const siteAnalysis = this.prepareSiteAnalysisContext(siteStructure, auditResults);
      const competitiveLandscape = this.analyzeCompetitiveLandscape(auditResults);
      
      // Generate strategic recommendations
      const [
        priorityActions,
        quickWins,
        longTermStrategy,
        industryTips,
        implementationPlan
      ] = await Promise.all([
        this.generatePriorityActions(siteAnalysis, targetKeyword, industry),
        this.generateQuickWins(siteAnalysis),
        this.generateLongTermStrategy(siteAnalysis, targetKeyword, industry),
        this.generateIndustrySpecificTips(siteAnalysis, industry),
        this.generateImplementationPlan(siteAnalysis, targetKeyword)
      ]);

      return {
        priorityActions,
        quickWins,
        longTermStrategy,
        industrySpecificTips: industryTips,
        implementationPlan
      };

    } catch (error) {
      console.error('[SEOBuddy] Error generating recommendations:', error);
      return this.getFallbackRecommendations(auditResults, targetKeyword);
    }
  }

  /**
   * Generate priority actions with impact assessment
   */
  private async generatePriorityActions(
    siteAnalysis: string,
    targetKeyword?: string,
    industry?: string
  ): Promise<Array<{
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    difficulty: 'easy' | 'medium' | 'hard';
    timeframe: string;
    category: string;
  }>> {

    const prompt = `Based on this comprehensive SEO analysis, identify the top priority actions:

${siteAnalysis}

${targetKeyword ? `Target Keyword: ${targetKeyword}` : ''}
${industry ? `Industry: ${industry}` : ''}

Identify 5-7 priority actions with the highest impact/effort ratio. For each action, provide:
- Clear, actionable title
- Detailed description of what needs to be done
- Impact level (high/medium/low)
- Difficulty level (easy/medium/hard)
- Estimated timeframe
- SEO category

Respond in JSON format:
{
  "actions": [
    {
      "title": "Action title",
      "description": "Detailed description",
      "impact": "high",
      "difficulty": "medium",
      "timeframe": "2-4 weeks",
      "category": "Technical SEO"
    }
  ]
}`;

    try {
      if (!this.openai) {
        throw new Error('OpenAI client not configured');
      }
      
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a senior SEO consultant with 10+ years of experience. Provide strategic, prioritized recommendations based on comprehensive site analysis.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 1500
      });

      const result = JSON.parse(response.choices[0].message.content || '{"actions": []}');
      return result.actions || [];

    } catch (error) {
      console.warn('[SEOBuddy] Priority actions generation failed:', error);
      return [
        {
          title: 'Optimize Critical Pages',
          description: 'Focus on optimizing homepage and key service pages for target keywords',
          impact: 'high' as const,
          difficulty: 'medium' as const,
          timeframe: '2-3 weeks',
          category: 'Content Optimization'
        },
        {
          title: 'Fix Technical SEO Issues',
          description: 'Address critical technical issues affecting crawlability and indexing',
          impact: 'high' as const,
          difficulty: 'medium' as const,
          timeframe: '1-2 weeks',
          category: 'Technical SEO'
        }
      ];
    }
  }

  /**
   * Generate quick wins for immediate impact
   */
  private async generateQuickWins(siteAnalysis: string): Promise<string[]> {
    const prompt = `Based on this SEO analysis, identify quick wins that can be implemented immediately for fast results:

${siteAnalysis}

List 5-7 specific quick wins that:
- Can be implemented within 1-2 days
- Require minimal technical expertise
- Provide noticeable SEO improvement

Focus on actionable items like title tag optimization, meta descriptions, content updates, etc.

Respond as a JSON array of strings:
["Quick win 1", "Quick win 2", ...]`;

    try {
      if (!this.openai) {
        throw new Error('OpenAI client not configured');
      }
      
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an SEO expert focused on identifying quick, high-impact optimizations that can be implemented immediately.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 800
      });

      const quickWins = JSON.parse(response.choices[0].message.content || '[]');
      return Array.isArray(quickWins) ? quickWins : [];

    } catch (error) {
      console.warn('[SEOBuddy] Quick wins generation failed:', error);
      return [
        'Optimize page titles with target keywords',
        'Write compelling meta descriptions for all pages',
        'Add alt text to all images',
        'Update content with relevant keywords',
        'Fix broken internal links'
      ];
    }
  }

  /**
   * Generate long-term SEO strategy
   */
  private async generateLongTermStrategy(
    siteAnalysis: string,
    targetKeyword?: string,
    industry?: string
  ): Promise<string[]> {

    const prompt = `Develop a comprehensive long-term SEO strategy based on this analysis:

${siteAnalysis}

${targetKeyword ? `Primary Target: ${targetKeyword}` : ''}
${industry ? `Industry Context: ${industry}` : ''}

Create a 6-12 month strategic plan including:
- Content strategy initiatives
- Technical improvements
- Authority building
- Competitive positioning
- Performance goals

Respond as a JSON array of strategic initiatives:
["Strategy 1", "Strategy 2", ...]`;

    try {
      if (!this.openai) {
        throw new Error('OpenAI client not configured');
      }
      
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a strategic SEO consultant creating comprehensive long-term SEO strategies for sustainable growth.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.4,
        max_tokens: 1000
      });

      const strategy = JSON.parse(response.choices[0].message.content || '[]');
      return Array.isArray(strategy) ? strategy : [];

    } catch (error) {
      console.warn('[SEOBuddy] Long-term strategy generation failed:', error);
      return [
        'Develop comprehensive content strategy around target keywords',
        'Build authoritative backlink profile through outreach',
        'Create industry-specific resource pages',
        'Implement advanced technical SEO optimizations',
        'Establish thought leadership through content marketing'
      ];
    }
  }

  /**
   * Generate industry-specific SEO tips
   */
  private async generateIndustrySpecificTips(
    siteAnalysis: string,
    industry?: string
  ): Promise<string[]> {

    if (!industry) {
      return [
        'Identify and target industry-specific keywords',
        'Create content that addresses industry pain points',
        'Optimize for local search if applicable'
      ];
    }

    const prompt = `Provide industry-specific SEO recommendations for a ${industry} business:

Site Analysis Context:
${siteAnalysis.substring(0, 1000)}

Generate 5-7 SEO tips specifically tailored to the ${industry} industry, including:
- Industry-specific keyword opportunities
- Content types that perform well in this sector
- Technical considerations for this industry
- Local SEO tactics if relevant
- Industry-specific ranking factors

Respond as a JSON array of strings:
["Industry tip 1", "Industry tip 2", ...]`;

    try {
      if (!this.openai) {
        throw new Error('OpenAI client not configured');
      }
      
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an SEO expert with deep knowledge of the ${industry} industry. Provide specific, actionable recommendations tailored to this sector.`
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 800
      });

      const tips = JSON.parse(response.choices[0].message.content || '[]');
      return Array.isArray(tips) ? tips : [];

    } catch (error) {
      console.warn('[SEOBuddy] Industry tips generation failed:', error);
      return [
        `Target ${industry}-specific long-tail keywords`,
        'Create comprehensive service/product category pages',
        'Optimize for local search with location-based content',
        'Build industry authority through expert content'
      ];
    }
  }

  /**
   * Generate detailed implementation plan
   */
  private async generateImplementationPlan(
    siteAnalysis: string,
    targetKeyword?: string
  ): Promise<Array<{
    phase: string;
    actions: string[];
    timeline: string;
    expectedOutcome: string;
  }>> {

    const prompt = `Create a detailed implementation plan based on this SEO analysis:

${siteAnalysis}

${targetKeyword ? `Target Focus: ${targetKeyword}` : ''}

Structure as 3-4 implementation phases over 3-6 months:
- Phase 1: Immediate fixes (Month 1)
- Phase 2: Content & optimization (Month 2-3)
- Phase 3: Authority building (Month 4-6)
- Phase 4: Advanced optimizations (Ongoing)

For each phase include:
- Specific actions to take
- Timeline for completion
- Expected outcomes

Respond in JSON format:
{
  "phases": [
    {
      "phase": "Phase 1: Foundation",
      "actions": ["action1", "action2"],
      "timeline": "Month 1",
      "expectedOutcome": "Expected results"
    }
  ]
}`;

    try {
      if (!this.openai) {
        throw new Error('OpenAI client not configured');
      }
      
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an SEO project manager creating detailed implementation roadmaps for sustainable SEO improvement.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 1200
      });

      const result = JSON.parse(response.choices[0].message.content || '{"phases": []}');
      return result.phases || [];

    } catch (error) {
      console.warn('[SEOBuddy] Implementation plan generation failed:', error);
      return [
        {
          phase: 'Phase 1: Foundation',
          actions: ['Fix critical technical issues', 'Optimize core pages', 'Update meta tags'],
          timeline: 'Month 1',
          expectedOutcome: 'Improved crawlability and basic optimization'
        },
        {
          phase: 'Phase 2: Content Enhancement',
          actions: ['Expand content depth', 'Add target keywords', 'Create supporting pages'],
          timeline: 'Month 2-3',
          expectedOutcome: 'Better keyword rankings and user engagement'
        }
      ];
    }
  }

  /**
   * Provide contextual factor recommendations
   */
  async provideFactorGuidance(
    factor: AnalysisFactor,
    pageContext: PageCrawlResult,
    siteContext?: SiteStructure
  ): Promise<{
    explanation: string;
    stepByStepFix: string[];
    impact: string;
    difficulty: string;
    resources: string[];
  }> {

    if (!this.isConfigured) {
      return this.getFallbackFactorGuidance(factor);
    }

    const prompt = `Provide detailed guidance for this SEO factor:

Factor: ${factor.name}
Status: ${factor.status}
Importance: ${factor.importance}
Current Analysis: ${factor.notes}

Page Context:
- URL: ${pageContext.url}
- Title: ${pageContext.title}
- Page Type: ${pageContext.pageType}
- Word Count: ${pageContext.wordCount}

Provide:
1. Clear explanation of why this factor matters
2. Step-by-step instructions to fix it
3. Expected impact of the fix
4. Difficulty assessment
5. Helpful resources or tools

Respond in JSON format:
{
  "explanation": "Why this matters...",
  "stepByStepFix": ["Step 1", "Step 2", "Step 3"],
  "impact": "Expected impact description",
  "difficulty": "easy/medium/hard",
  "resources": ["Resource 1", "Resource 2"]
}`;

    try {
      if (!this.openai) {
        throw new Error('OpenAI client not configured');
      }
      
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an SEO expert providing detailed, actionable guidance for specific SEO factors. Be practical and specific.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 800
      });

      const guidance = JSON.parse(response.choices[0].message.content || '{}');
      return {
        explanation: guidance.explanation || 'Factor guidance not available',
        stepByStepFix: guidance.stepByStepFix || [],
        impact: guidance.impact || 'Positive impact on SEO performance',
        difficulty: guidance.difficulty || 'medium',
        resources: guidance.resources || []
      };

    } catch (error) {
      console.warn('[SEOBuddy] Factor guidance generation failed:', error);
      return this.getFallbackFactorGuidance(factor);
    }
  }

  /**
   * Generate competitive insights and recommendations
   */
  async generateCompetitiveInsights(
    siteStructure: SiteStructure,
    competitorData?: any[]
  ): Promise<{
    competitiveGaps: string[];
    opportunities: string[];
    benchmarkAnalysis: string;
    actionableInsights: string[];
  }> {

    if (!this.isConfigured || !competitorData?.length) {
      return {
        competitiveGaps: ['Conduct comprehensive competitor analysis'],
        opportunities: ['Identify competitor keyword gaps', 'Analyze competitor content strategies'],
        benchmarkAnalysis: 'Manual competitor research recommended',
        actionableInsights: ['Research top-ranking competitors in your industry']
      };
    }

    const siteAnalysis = this.prepareSiteAnalysisContext(siteStructure, {});
    const competitorSummary = competitorData.map(c => 
      `${c.url}: Strengths - ${c.strengths?.join(', ')}, Weaknesses - ${c.weaknesses?.join(', ')}`
    ).join('\n');

    const prompt = `Analyze competitive landscape and provide strategic insights:

Your Site Analysis:
${siteAnalysis.substring(0, 1500)}

Competitor Analysis:
${competitorSummary}

Provide:
1. Key competitive gaps to address
2. Opportunities to outrank competitors
3. Benchmark analysis summary
4. Actionable competitive insights

Respond in JSON format:
{
  "competitiveGaps": ["gap1", "gap2"],
  "opportunities": ["opportunity1", "opportunity2"],
  "benchmarkAnalysis": "Analysis summary",
  "actionableInsights": ["insight1", "insight2"]
}`;

    try {
      if (!this.openai) {
        throw new Error('OpenAI client not configured');
      }
      
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a competitive SEO analyst providing strategic insights for outranking competitors.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 1000
      });

      const insights = JSON.parse(response.choices[0].message.content || '{}');
      return {
        competitiveGaps: insights.competitiveGaps || [],
        opportunities: insights.opportunities || [],
        benchmarkAnalysis: insights.benchmarkAnalysis || 'Competitive analysis not available',
        actionableInsights: insights.actionableInsights || []
      };

    } catch (error) {
      console.warn('[SEOBuddy] Competitive insights generation failed:', error);
      return {
        competitiveGaps: ['Content depth compared to competitors', 'Technical SEO implementation'],
        opportunities: ['Target competitor gap keywords', 'Improve content comprehensiveness'],
        benchmarkAnalysis: 'Manual competitive research recommended',
        actionableInsights: ['Focus on competitor content weaknesses', 'Leverage technical advantages']
      };
    }
  }

  // Helper methods

  private prepareSiteAnalysisContext(siteStructure: SiteStructure, auditResults: any): string {
    let context = '';
    
    // Site structure summary
    context += `Site Structure Analysis:\n`;
    context += `- Homepage: ${siteStructure.homepage ? 'Present' : 'Missing'}\n`;
    context += `- Contact Page: ${siteStructure.contactPage ? 'Present' : 'Missing'}\n`;
    context += `- Service Pages: ${siteStructure.servicePages.length}\n`;
    context += `- Location Pages: ${siteStructure.locationPages.length}\n`;
    context += `- Other Pages: ${siteStructure.otherPages.length}\n`;

    // Crawl metadata
    if (siteStructure.crawlMetadata) {
      context += `\nCrawl Information:\n`;
      context += `- Technology: ${siteStructure.crawlMetadata.isJavaScriptHeavy ? 'JavaScript-heavy' : 'Traditional'}\n`;
      context += `- Pages Analyzed: ${siteStructure.crawlMetadata.pagesAnalyzed}\n`;
      context += `- Crawl Method: ${siteStructure.crawlMetadata.crawlMethod}\n`;
    }

    // Audit results summary
    if (auditResults.summary) {
      context += `\nAudit Results:\n`;
      context += `- Overall Score: ${auditResults.summary.overallScore || 'N/A'}\n`;
      context += `- Priority Issues: ${auditResults.summary.priorityOfiCount || 0}\n`;
      context += `- Total Factors: ${auditResults.summary.totalFactors || 0}\n`;
      
      if (auditResults.summary.categoryScores) {
        context += `- Category Scores: Content(${auditResults.summary.categoryScores.contentQuality}), Technical(${auditResults.summary.categoryScores.technicalSEO}), Local(${auditResults.summary.categoryScores.localSEO}), UX(${auditResults.summary.categoryScores.uxPerformance})\n`;
      }
    }

    return context;
  }

  private analyzeCompetitiveLandscape(auditResults: any): string {
    if (auditResults.competitorComparison?.competitors) {
      return `Competitor Analysis:\n${auditResults.competitorComparison.competitors.map((c: any) => 
        `- ${c.url}: Score ${c.score}, Strengths: ${c.strengths.join(', ')}`
      ).join('\n')}`;
    }
    return 'No competitive data available';
  }

  private getFallbackRecommendations(auditResults: any, targetKeyword?: string): any {
    const score = auditResults.summary?.overallScore || 70;
    
    return {
      priorityActions: [
        {
          title: 'Optimize Core Pages',
          description: 'Focus on homepage and key service pages optimization',
          impact: 'high' as const,
          difficulty: 'medium' as const,
          timeframe: '2-3 weeks',
          category: 'Content Optimization'
        },
        {
          title: 'Fix Technical Issues',
          description: 'Address critical technical SEO problems',
          impact: 'high' as const,
          difficulty: 'medium' as const,
          timeframe: '1-2 weeks',
          category: 'Technical SEO'
        }
      ],
      quickWins: [
        'Update page titles and meta descriptions',
        'Add alt text to images',
        'Fix broken internal links',
        'Optimize headings structure'
      ],
      longTermStrategy: [
        'Develop comprehensive content strategy',
        'Build authoritative backlink profile',
        'Implement advanced technical optimizations',
        'Create industry-specific content'
      ],
      industrySpecificTips: [
        'Research industry-specific keywords',
        'Create content for target audience',
        'Optimize for local search if applicable'
      ],
      implementationPlan: [
        {
          phase: 'Phase 1: Foundation',
          actions: ['Fix critical issues', 'Optimize core pages'],
          timeline: 'Month 1',
          expectedOutcome: 'Improved basic SEO metrics'
        }
      ]
    };
  }

  private getFallbackFactorGuidance(factor: AnalysisFactor): any {
    return {
      explanation: `${factor.name} is important for SEO performance and should be optimized according to best practices.`,
      stepByStepFix: [
        'Review current implementation',
        'Follow SEO best practices for this factor',
        'Test and validate changes',
        'Monitor performance improvements'
      ],
      impact: 'Optimizing this factor will contribute to better search engine rankings and user experience.',
      difficulty: factor.importance === 'High' ? 'medium' : 'easy',
      resources: [
        'Google Search Console Help',
        'SEO best practices guides',
        'Industry-specific optimization resources'
      ]
    };
  }
}