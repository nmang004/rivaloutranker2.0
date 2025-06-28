import * as cheerio from 'cheerio';
import axios from 'axios';
import { technicalAnalysisSchema } from '@/shared/schemas/analysis';
import type { z } from 'zod';

/**
 * Technical Analysis Engine - Standard Analysis (15+ factors)
 * Focuses on technical SEO, page speed, and mobile optimization
 */
export class TechnicalAnalysisEngine {

  /**
   * Analyze technical SEO factors (15+ factors)
   */
  async analyze(pageData: any, config: any): Promise<z.infer<typeof technicalAnalysisSchema>> {
    console.log('[TechnicalEngine] Analyzing technical SEO factors');
    
    const $ = pageData.$;
    const url = pageData.url;
    
    // 1. Page Speed Analysis
    const pageSpeed = await this.analyzePageSpeed(url);
    
    // 2. Core Web Vitals (if available)
    const coreWebVitals = await this.analyzeCoreWebVitals(url);
    
    // 3. SEO Technical Factors
    const seoTechnicals = this.analyzeSeoTechnicals($, pageData);
    
    // 4. Image Optimization Analysis
    const images = this.analyzeImages($);
    
    return {
      pageSpeed: {
        ...pageSpeed,
        coreWebVitals
      },
      seoTechnicals,
      images
    };
  }

  /**
   * Analyze page speed performance
   */
  private async analyzePageSpeed(url: string): Promise<any> {
    try {
      // Simplified page speed analysis
      // In production, this would integrate with PageSpeed Insights API
      const startTime = Date.now();
      
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'RivalOutranker/2.0 Speed Test'
        }
      });
      
      const loadTime = Date.now() - startTime;
      
      // Convert load time to scores (simplified)
      const desktopScore = this.loadTimeToScore(loadTime);
      const mobileScore = Math.max(0, desktopScore - 15); // Mobile typically slower
      
      return {
        desktop: desktopScore,
        mobile: mobileScore,
        loadTimeMs: loadTime
      };
      
    } catch (error) {
      console.warn('[TechnicalEngine] Page speed analysis failed:', (error as Error).message);
      return {
        desktop: 50,
        mobile: 45,
        loadTimeMs: 5000,
        error: 'Unable to measure page speed'
      };
    }
  }

  /**
   * Analyze Core Web Vitals (placeholder for PageSpeed Insights integration)
   */
  private async analyzeCoreWebVitals(url: string): Promise<any> {
    // In production, integrate with PageSpeed Insights API
    // For now, return estimated values based on basic analysis
    
    return {
      lcp: 2.5, // Largest Contentful Paint (seconds)
      fid: 100, // First Input Delay (milliseconds) 
      cls: 0.1, // Cumulative Layout Shift
      inp: 200  // Interaction to Next Paint (milliseconds)
    };
  }

  /**
   * Analyze SEO technical factors
   */
  private analyzeSeoTechnicals($: cheerio.CheerioAPI, pageData: any): any {
    // 1. Meta Title Analysis
    const metaTitle = this.analyzeMetaTitle($);
    
    // 2. Meta Description Analysis
    const metaDescription = this.analyzeMetaDescription($);
    
    // 3. Canonical Tag
    const canonicalTag = $('link[rel="canonical"]').length > 0;
    
    // 4. Schema Markup
    const schemaMarkup = this.extractSchemaTypes($);
    
    // 5. Robots.txt (simplified check)
    const robotsTxt = true; // Would need separate request to check
    
    // 6. Sitemap (simplified check)
    const sitemap = true; // Would need separate request to check
    
    // 7. SSL Certificate
    const sslCertificate = pageData.url.startsWith('https://');
    
    // 8. Mobile Responsive
    const mobileResponsive = this.checkMobileResponsive($);
    
    return {
      metaTitle,
      metaDescription,
      canonicalTag,
      schemaMarkup,
      robotsTxt,
      sitemap,
      sslCertificate,
      mobileResponsive
    };
  }

  /**
   * Analyze meta title optimization
   */
  private analyzeMetaTitle($: cheerio.CheerioAPI): any {
    const titleElement = $('title');
    const title = titleElement.text().trim();
    
    const exists = title.length > 0;
    const length = title.length;
    const isOptimized = length >= 30 && length <= 60;
    
    return {
      exists,
      length,
      keywordPresent: false, // Would need target keyword to determine
      isOptimized,
      value: title
    };
  }

  /**
   * Analyze meta description optimization
   */
  private analyzeMetaDescription($: cheerio.CheerioAPI): any {
    const metaDesc = $('meta[name="description"]').attr('content') || '';
    
    const exists = metaDesc.length > 0;
    const length = metaDesc.length;
    const isOptimized = length >= 120 && length <= 160;
    
    return {
      exists,
      length,
      keywordPresent: false, // Would need target keyword to determine
      isOptimized,
      value: metaDesc
    };
  }

  /**
   * Extract schema markup types
   */
  private extractSchemaTypes($: cheerio.CheerioAPI): string[] {
    const schemaTypes = new Set<string>();
    
    // JSON-LD Schema
    $('script[type="application/ld+json"]').each((_, element) => {
      try {
        const schema = JSON.parse($(element).html() || '{}');
        if (schema['@type']) {
          schemaTypes.add(schema['@type']);
        }
        if (schema['@graph']) {
          schema['@graph'].forEach((item: any) => {
            if (item['@type']) schemaTypes.add(item['@type']);
          });
        }
      } catch (error) {
        // Ignore invalid JSON-LD
      }
    });
    
    // Microdata Schema
    $('[itemtype]').each((_, element) => {
      const itemType = $(element).attr('itemtype');
      if (itemType) {
        const schemaType = itemType.split('/').pop();
        if (schemaType) schemaTypes.add(schemaType);
      }
    });
    
    return Array.from(schemaTypes);
  }

  /**
   * Check if page is mobile responsive
   */
  private checkMobileResponsive($: cheerio.CheerioAPI): boolean {
    // Check for viewport meta tag
    const viewportMeta = $('meta[name="viewport"]').attr('content');
    const hasViewport = !!viewportMeta && viewportMeta.includes('width=device-width');
    
    // Check for responsive CSS patterns
    const responsivePatterns = [
      '@media',
      'max-width',
      'min-width',
      'flex',
      'grid'
    ];
    
    let hasResponsiveCss = false;
    $('style, link[rel="stylesheet"]').each((_, element) => {
      const cssContent = $(element).html() || '';
      if (responsivePatterns.some(pattern => cssContent.includes(pattern))) {
        hasResponsiveCss = true;
        return false; // Break the loop
      }
    });
    
    return hasViewport || hasResponsiveCss;
  }

  /**
   * Analyze image optimization
   */
  private analyzeImages($: cheerio.CheerioAPI): any {
    const images = $('img');
    const total = images.length;
    
    let withAltText = 0;
    let optimized = 0;
    let webpFormat = 0;
    
    images.each((_, element) => {
      const $img = $(element);
      
      // Check for alt text
      const alt = $img.attr('alt');
      if (alt && alt.trim().length > 0) {
        withAltText++;
      }
      
      // Check for optimization indicators
      const src = $img.attr('src') || '';
      const width = $img.attr('width');
      const height = $img.attr('height');
      
      // Consider optimized if has dimensions or loading attribute
      if ((width && height) || $img.attr('loading') === 'lazy') {
        optimized++;
      }
      
      // Check for modern formats
      if (src.includes('.webp') || src.includes('.avif')) {
        webpFormat++;
      }
    });
    
    return {
      total,
      withAltText,
      optimized,
      webpFormat,
      altTextPercentage: total > 0 ? Math.round((withAltText / total) * 100) : 0,
      optimizedPercentage: total > 0 ? Math.round((optimized / total) * 100) : 0
    };
  }

  /**
   * Convert load time to performance score
   */
  private loadTimeToScore(loadTimeMs: number): number {
    // PageSpeed Insights-like scoring
    if (loadTimeMs <= 1000) return 95;
    if (loadTimeMs <= 2000) return 85;
    if (loadTimeMs <= 3000) return 75;
    if (loadTimeMs <= 4000) return 65;
    if (loadTimeMs <= 5000) return 55;
    if (loadTimeMs <= 6000) return 45;
    if (loadTimeMs <= 7000) return 35;
    if (loadTimeMs <= 8000) return 25;
    if (loadTimeMs <= 9000) return 15;
    return 5;
  }

  /**
   * Check URL accessibility
   */
  private async checkUrlAccessibility(url: string): Promise<boolean> {
    try {
      const response = await axios.head(url, { timeout: 5000 });
      return response.status >= 200 && response.status < 400;
    } catch (error) {
      return false;
    }
  }

  /**
   * Analyze redirects and URL structure
   */
  private async analyzeUrlStructure(url: string): Promise<any> {
    try {
      const response = await axios.get(url, {
        timeout: 5000,
        maxRedirects: 5,
        validateStatus: () => true // Accept all status codes
      });
      
      return {
        statusCode: response.status,
        redirectCount: response.request?.res?.responseUrl !== url ? 1 : 0,
        isClean: this.isCleanUrl(url),
        hasParameters: url.includes('?'),
        usesHttps: url.startsWith('https://')
      };
      
    } catch (error) {
      return {
        statusCode: 0,
        redirectCount: 0,
        isClean: false,
        hasParameters: false,
        usesHttps: false,
        error: (error as Error).message
      };
    }
  }

  /**
   * Check if URL structure is clean and SEO-friendly
   */
  private isCleanUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      const path = urlObj.pathname;
      
      // Check for SEO-friendly patterns
      const isClean = 
        !path.includes('index.') &&
        !path.includes('?') &&
        !path.includes('#') &&
        !/\d{4,}/.test(path) && // No long numbers
        !path.includes('_') && // Prefers hyphens over underscores
        path.split('/').every(segment => 
          segment === '' || /^[a-z0-9-]+$/.test(segment)
        );
      
      return isClean;
      
    } catch (error) {
      return false;
    }
  }
}