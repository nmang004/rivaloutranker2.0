/**
 * OFI Classification Service - Rival Outranker 2.0
 * Preserves the sophisticated OFI (Opportunity for Improvement) classification logic
 */

export interface OFIClassification {
  category: 'Priority OFI' | 'OFI' | 'OK' | 'N/A';
  reasoning: string;
  businessImpact: 'high' | 'medium' | 'low';
  technicalComplexity: 'easy' | 'medium' | 'hard';
  estimatedEffort: string;
  quickWins: boolean;
}

export class OFIClassificationService {
  
  /**
   * Classify an audit finding based on multiple factors
   */
  classifyOFI(
    factorName: string,
    currentStatus: string,
    importance: 'High' | 'Medium' | 'Low',
    pageType: string,
    businessContext?: {
      isMainPage?: boolean;
      isConversionPage?: boolean;
      trafficLevel?: 'high' | 'medium' | 'low';
    }
  ): OFIClassification {
    
    console.log(`[OFIClassificationService] Classifying: ${factorName} (${currentStatus}, ${importance})`);
    
    // Critical factors that should always be Priority OFI if failing
    if (this.isCriticalFactor(factorName) && (currentStatus === 'OFI' || currentStatus === 'Priority OFI')) {
      return this.createPriorityOFI(factorName, 'Critical SEO factor requiring immediate attention');
    }
    
    // Business-critical pages get elevated priority
    if (businessContext?.isMainPage && importance === 'High' && currentStatus === 'OFI') {
      return this.createPriorityOFI(factorName, 'High-importance issue on main business page');
    }
    
    // Conversion pages get special treatment
    if (businessContext?.isConversionPage && this.impactsConversion(factorName) && currentStatus === 'OFI') {
      return this.createPriorityOFI(factorName, 'Issue affects conversion on critical page');
    }
    
    // Already identified as Priority OFI
    if (currentStatus === 'Priority OFI') {
      return this.createPriorityOFI(factorName, 'Critical issue requiring immediate action');
    }
    
    // Standard OFI classification
    if (currentStatus === 'OFI') {
      return this.createStandardOFI(factorName, importance, pageType);
    }
    
    // OK or N/A status
    if (currentStatus === 'OK') {
      return {
        category: 'OK',
        reasoning: 'Factor meets SEO best practices',
        businessImpact: 'low',
        technicalComplexity: 'easy',
        estimatedEffort: 'No action needed',
        quickWins: false
      };
    }
    
    return {
      category: 'N/A',
      reasoning: 'Factor not applicable to this page type',
      businessImpact: 'low',
      technicalComplexity: 'easy',
      estimatedEffort: 'No action needed',
      quickWins: false
    };
  }
  
  /**
   * Create Priority OFI classification
   */
  private createPriorityOFI(factorName: string, reasoning: string): OFIClassification {
    return {
      category: 'Priority OFI',
      reasoning,
      businessImpact: this.assessBusinessImpact(factorName, 'Priority OFI'),
      technicalComplexity: this.assessTechnicalComplexity(factorName),
      estimatedEffort: this.estimateEffort(factorName, 'Priority OFI'),
      quickWins: this.isQuickWin(factorName)
    };
  }
  
  /**
   * Create standard OFI classification
   */
  private createStandardOFI(factorName: string, importance: string, pageType: string): OFIClassification {
    return {
      category: 'OFI',
      reasoning: `${importance}-importance factor needs optimization on ${pageType} page`,
      businessImpact: this.assessBusinessImpact(factorName, 'OFI'),
      technicalComplexity: this.assessTechnicalComplexity(factorName),
      estimatedEffort: this.estimateEffort(factorName, 'OFI'),
      quickWins: this.isQuickWin(factorName)
    };
  }
  
  /**
   * Determine if a factor is critical for SEO
   */
  private isCriticalFactor(factorName: string): boolean {
    const criticalFactors = [
      'SSL Certificate Implementation',
      'Meta Tags Optimization',
      'Content Readability Score',
      'Page Loading Speed',
      'Mobile Responsiveness',
      'Robots Meta Tag Configuration',
      'Structured Data Implementation',
      'NAP Consistency',
      'Core Web Vitals Performance',
      'Canonical URL Implementation'
    ];
    
    return criticalFactors.some(critical => 
      factorName.toLowerCase().includes(critical.toLowerCase())
    );
  }
  
  /**
   * Determine if a factor impacts conversion
   */
  private impactsConversion(factorName: string): boolean {
    const conversionFactors = [
      'Call-to-Action',
      'Contact Information',
      'Phone Number',
      'Customer Reviews',
      'Trust Signals',
      'Page Loading Speed',
      'Mobile Responsiveness',
      'Form Usability',
      'Professional Photography'
    ];
    
    return conversionFactors.some(factor => 
      factorName.toLowerCase().includes(factor.toLowerCase())
    );
  }
  
  /**
   * Assess business impact of a factor
   */
  private assessBusinessImpact(factorName: string, category: string): 'high' | 'medium' | 'low' {
    const highImpactFactors = [
      'ssl', 'https', 'mobile', 'speed', 'contact', 'phone', 'nap', 
      'meta', 'title', 'description', 'reviews', 'testimonials'
    ];
    
    const mediumImpactFactors = [
      'schema', 'structured data', 'alt text', 'headings', 'content',
      'navigation', 'sitemap', 'robots'
    ];
    
    const factorLower = factorName.toLowerCase();
    
    if (category === 'Priority OFI') {
      return 'high';
    }
    
    if (highImpactFactors.some(factor => factorLower.includes(factor))) {
      return 'high';
    }
    
    if (mediumImpactFactors.some(factor => factorLower.includes(factor))) {
      return 'medium';
    }
    
    return 'low';
  }
  
  /**
   * Assess technical complexity of fixing a factor
   */
  private assessTechnicalComplexity(factorName: string): 'easy' | 'medium' | 'hard' {
    const easyFixes = [
      'meta', 'title', 'description', 'alt text', 'contact information',
      'phone number', 'business hours', 'nap'
    ];
    
    const hardFixes = [
      'ssl', 'https', 'mobile responsive', 'page speed', 'core web vitals',
      'schema markup', 'structured data', 'cdn'
    ];
    
    const factorLower = factorName.toLowerCase();
    
    if (easyFixes.some(easy => factorLower.includes(easy))) {
      return 'easy';
    }
    
    if (hardFixes.some(hard => factorLower.includes(hard))) {
      return 'hard';
    }
    
    return 'medium';
  }
  
  /**
   * Estimate effort required to fix a factor
   */
  private estimateEffort(factorName: string, category: string): string {
    const complexity = this.assessTechnicalComplexity(factorName);
    const impact = this.assessBusinessImpact(factorName, category);
    
    if (complexity === 'easy') {
      return '1-2 hours';
    }
    
    if (complexity === 'medium') {
      return impact === 'high' ? '4-8 hours' : '2-4 hours';
    }
    
    if (complexity === 'hard') {
      return impact === 'high' ? '1-2 weeks' : '2-5 days';
    }
    
    return '2-4 hours';
  }
  
  /**
   * Determine if a factor is a quick win
   */
  private isQuickWin(factorName: string): boolean {
    const quickWinFactors = [
      'meta title', 'meta description', 'alt text', 'contact information',
      'phone number', 'business hours', 'favicon', 'robots.txt'
    ];
    
    const factorLower = factorName.toLowerCase();
    return quickWinFactors.some(quickWin => factorLower.includes(quickWin));
  }
  
  /**
   * Generate prioritized action plan based on classifications
   */
  generateActionPlan(classifications: OFIClassification[]): {
    quickWins: OFIClassification[];
    priorityOFIs: OFIClassification[];
    highImpactOFIs: OFIClassification[];
    mediumImpactOFIs: OFIClassification[];
    longTermImprovements: OFIClassification[];
  } {
    const actionPlan = {
      quickWins: classifications.filter(c => c.quickWins && c.category !== 'OK'),
      priorityOFIs: classifications.filter(c => c.category === 'Priority OFI'),
      highImpactOFIs: classifications.filter(c => 
        c.category === 'OFI' && c.businessImpact === 'high'
      ),
      mediumImpactOFIs: classifications.filter(c => 
        c.category === 'OFI' && c.businessImpact === 'medium'
      ),
      longTermImprovements: classifications.filter(c => 
        c.category === 'OFI' && c.technicalComplexity === 'hard'
      )
    };
    
    console.log('[OFIClassificationService] Generated action plan:', {
      quickWins: actionPlan.quickWins.length,
      priorityOFIs: actionPlan.priorityOFIs.length,
      highImpactOFIs: actionPlan.highImpactOFIs.length,
      mediumImpactOFIs: actionPlan.mediumImpactOFIs.length,
      longTermImprovements: actionPlan.longTermImprovements.length
    });
    
    return actionPlan;
  }
  
  /**
   * Calculate overall OFI severity score
   */
  calculateSeverityScore(classifications: OFIClassification[]): {
    score: number;
    severity: 'low' | 'medium' | 'high' | 'critical';
    breakdown: {
      priorityOFIs: number;
      highImpactOFIs: number;
      totalOFIs: number;
    };
  } {
    const priorityOFIs = classifications.filter(c => c.category === 'Priority OFI').length;
    const highImpactOFIs = classifications.filter(c => 
      c.category === 'OFI' && c.businessImpact === 'high'
    ).length;
    const totalOFIs = classifications.filter(c => 
      c.category === 'OFI' || c.category === 'Priority OFI'
    ).length;
    
    // Calculate severity score (0-100)
    const score = Math.max(0, 100 - (priorityOFIs * 15) - (highImpactOFIs * 8) - (totalOFIs * 3));
    
    let severity: 'low' | 'medium' | 'high' | 'critical';
    if (priorityOFIs >= 5 || score < 40) {
      severity = 'critical';
    } else if (priorityOFIs >= 2 || score < 60) {
      severity = 'high';
    } else if (totalOFIs >= 5 || score < 80) {
      severity = 'medium';
    } else {
      severity = 'low';
    }
    
    return {
      score: Math.round(score),
      severity,
      breakdown: {
        priorityOFIs,
        highImpactOFIs,
        totalOFIs
      }
    };
  }
}