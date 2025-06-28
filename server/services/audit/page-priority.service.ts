/**
 * Page Priority Service - Rival Outranker 2.0
 * Preserves the sophisticated page priority weighting system from the original
 */

export interface PagePriority {
  tier: 1 | 2 | 3; // 1=high, 2=medium, 3=low
  weight: number; // Weight multiplier for scoring
  businessImpact: 'high' | 'medium' | 'low';
  description: string;
}

export class PagePriorityService {
  
  /**
   * Determine page priority based on URL patterns and content analysis
   */
  calculatePagePriority(url: string, pageType: string, content?: string): PagePriority {
    console.log(`[PagePriorityService] Calculating priority for ${pageType} page: ${url}`);
    
    // Priority Tier 1 (High Priority) - Weight: 3.0
    if (this.isHighPriorityPage(url, pageType)) {
      return {
        tier: 1,
        weight: 3.0,
        businessImpact: 'high',
        description: 'High-priority page with direct business impact'
      };
    }
    
    // Priority Tier 2 (Medium Priority) - Weight: 2.0
    if (this.isMediumPriorityPage(url, pageType)) {
      return {
        tier: 2,
        weight: 2.0,
        businessImpact: 'medium',
        description: 'Medium-priority page supporting business goals'
      };
    }
    
    // Priority Tier 3 (Low Priority) - Weight: 1.0
    return {
      tier: 3,
      weight: 1.0,
      businessImpact: 'low',
      description: 'Standard priority page with general importance'
    };
  }
  
  /**
   * Apply priority weighting to audit scores
   */
  applyPriorityWeighting(score: number, priority: PagePriority): number {
    // Higher priority pages have more impact on overall scores
    const weightedScore = score * priority.weight;
    
    console.log(`[PagePriorityService] Applied priority weighting:`, {
      originalScore: score,
      priorityTier: priority.tier,
      weight: priority.weight,
      weightedScore: Math.round(weightedScore)
    });
    
    return Math.round(weightedScore);
  }
  
  /**
   * Determine if a page is high priority (Tier 1)
   */
  private isHighPriorityPage(url: string, pageType: string): boolean {
    const highPriorityPatterns = [
      // Homepage and main landing pages
      /^\/$|^\/index|^\/home$/i,
      // Main service pages
      /\/services?\/?$/i,
      // Contact and conversion pages
      /\/contact|\/quote|\/estimate|\/booking/i,
      // Main business location pages
      /\/locations?\/?$/i,
    ];
    
    const highPriorityTypes = ['homepage', 'main-service', 'contact', 'primary-location'];
    
    return highPriorityPatterns.some(pattern => pattern.test(url)) ||
           highPriorityTypes.includes(pageType);
  }
  
  /**
   * Determine if a page is medium priority (Tier 2)
   */
  private isMediumPriorityPage(url: string, pageType: string): boolean {
    const mediumPriorityPatterns = [
      // Individual service pages
      /\/service\//i,
      // Individual location pages
      /\/location\//i,
      // Service area pages
      /\/area\//i,
      // About us and company info
      /\/about|\/company|\/team/i,
      // Gallery and portfolio
      /\/gallery|\/portfolio|\/work/i,
    ];
    
    const mediumPriorityTypes = ['service', 'location', 'service-area', 'about', 'gallery'];
    
    return mediumPriorityPatterns.some(pattern => pattern.test(url)) ||
           mediumPriorityTypes.includes(pageType);
  }
  
  /**
   * Get priority explanation for reporting
   */
  getPriorityExplanation(priority: PagePriority): string {
    switch (priority.tier) {
      case 1:
        return "High Priority: This page directly impacts business conversion and should be optimized first.";
      case 2:
        return "Medium Priority: This page supports business goals and should be optimized after high-priority pages.";
      case 3:
        return "Standard Priority: This page provides general value and can be optimized as resources allow.";
      default:
        return "Priority assessment needed.";
    }
  }
  
  /**
   * Calculate overall priority distribution for reporting
   */
  calculatePriorityDistribution(priorities: PagePriority[]): {
    highPriority: number;
    mediumPriority: number;
    lowPriority: number;
    totalWeightedScore: number;
  } {
    const distribution = {
      highPriority: priorities.filter(p => p.tier === 1).length,
      mediumPriority: priorities.filter(p => p.tier === 2).length,
      lowPriority: priorities.filter(p => p.tier === 3).length,
      totalWeightedScore: priorities.reduce((sum, p) => sum + p.weight, 0)
    };
    
    console.log('[PagePriorityService] Priority distribution:', distribution);
    
    return distribution;
  }
}