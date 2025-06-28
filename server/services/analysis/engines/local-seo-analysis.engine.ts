import * as cheerio from 'cheerio';
import { localSeoAnalysisSchema } from '@/shared/schemas/analysis';
import type { z } from 'zod';

/**
 * Local SEO Analysis Engine - Standard Analysis (10+ factors)
 * Focuses on local business optimization, NAP consistency, and local keywords
 */
export class LocalSeoAnalysisEngine {

  /**
   * Analyze local SEO factors (10+ factors)
   */
  async analyze(pageData: any): Promise<z.infer<typeof localSeoAnalysisSchema>> {
    console.log('[LocalSeoEngine] Analyzing local SEO factors');
    
    const $ = pageData.$;
    const bodyText = pageData.bodyText;
    const url = pageData.url;
    
    // 1. Business Information Analysis
    const businessInfo = this.analyzeBusinessInfo($, bodyText);
    
    // 2. Citations Analysis (placeholder)
    const citations = await this.analyzeCitations(url);
    
    // 3. Reviews Analysis (placeholder)
    const reviews = await this.analyzeReviews(url);
    
    return {
      businessInfo,
      citations,
      reviews
    };
  }

  /**
   * Analyze business information and NAP consistency
   */
  private analyzeBusinessInfo($: cheerio.CheerioAPI, bodyText: string): any {
    // 1. NAP (Name, Address, Phone) Detection
    const napInfo = this.extractNapInformation($, bodyText);
    
    // 2. Local Keywords Detection
    const localKeywords = this.extractLocalKeywords(bodyText);
    
    // 3. Google Business Profile Indicators
    const googleBusinessProfile = this.checkGoogleBusinessIndicators($);
    
    // 4. Local Content Assessment
    const localContent = this.assessLocalContent(bodyText);
    
    return {
      napConsistency: napInfo.isConsistent,
      googleBusinessProfile,
      localKeywords,
      localContent,
      businessName: napInfo.name,
      address: napInfo.address,
      phone: napInfo.phone
    };
  }

  /**
   * Extract NAP (Name, Address, Phone) information
   */
  private extractNapInformation($: cheerio.CheerioAPI, bodyText: string): any {
    // Extract business name
    const name = this.extractBusinessName($);
    
    // Extract address
    const address = this.extractAddress($, bodyText);
    
    // Extract phone number
    const phone = this.extractPhoneNumber($, bodyText);
    
    // Check consistency (simplified)
    const isConsistent = !!(name && address && phone);
    
    return {
      name,
      address,
      phone,
      isConsistent
    };
  }

  /**
   * Extract business name from various sources
   */
  private extractBusinessName($: cheerio.CheerioAPI): string | null {
    // Check schema markup first
    let businessName = null;
    
    $('script[type="application/ld+json"]').each((_, element) => {
      try {
        const schema = JSON.parse($(element).html() || '{}');
        if (schema['@type'] === 'LocalBusiness' || schema['@type'] === 'Organization') {
          businessName = schema.name;
          return false; // Break loop
        }
      } catch (error) {
        // Ignore invalid JSON-LD
      }
    });
    
    // Fallback to meta tags or title
    if (!businessName) {
      businessName = $('meta[property="og:site_name"]').attr('content') ||
                   $('meta[name="application-name"]').attr('content') ||
                   $('title').text().split('|')[0].trim();
    }
    
    return businessName;
  }

  /**
   * Extract address information
   */
  private extractAddress($: cheerio.CheerioAPI, bodyText: string): string | null {
    // Check schema markup first
    let address = null;
    
    $('script[type="application/ld+json"]').each((_, element) => {
      try {
        const schema = JSON.parse($(element).html() || '{}');
        if (schema.address) {
          if (typeof schema.address === 'string') {
            address = schema.address;
          } else if (schema.address.streetAddress) {
            address = `${schema.address.streetAddress}, ${schema.address.addressLocality}, ${schema.address.addressRegion} ${schema.address.postalCode}`;
          }
          return false; // Break loop
        }
      } catch (error) {
        // Ignore invalid JSON-LD
      }
    });
    
    // Fallback to text pattern matching
    if (!address) {
      // Look for address patterns in text
      const addressPatterns = [
        /\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Lane|Ln|Boulevard|Blvd|Way|Circle|Cir|Court|Ct|Place|Pl)/i,
        /\d+\s+[A-Za-z\s]+,\s*[A-Za-z\s]+,\s*[A-Z]{2}\s*\d{5}/
      ];
      
      for (const pattern of addressPatterns) {
        const match = bodyText.match(pattern);
        if (match) {
          address = match[0];
          break;
        }
      }
    }
    
    return address;
  }

  /**
   * Extract phone number
   */
  private extractPhoneNumber($: cheerio.CheerioAPI, bodyText: string): string | null {
    // Check schema markup first
    let phone = null;
    
    $('script[type="application/ld+json"]').each((_, element) => {
      try {
        const schema = JSON.parse($(element).html() || '{}');
        if (schema.telephone) {
          phone = schema.telephone;
          return false; // Break loop
        }
      } catch (error) {
        // Ignore invalid JSON-LD
      }
    });
    
    // Check for tel: links
    if (!phone) {
      const telLink = $('a[href^="tel:"]').attr('href');
      if (telLink) {
        phone = telLink.replace('tel:', '');
      }
    }
    
    // Fallback to text pattern matching
    if (!phone) {
      const phonePatterns = [
        /\(\d{3}\)\s*\d{3}-\d{4}/,
        /\d{3}-\d{3}-\d{4}/,
        /\d{3}\.\d{3}\.\d{4}/,
        /\d{10}/
      ];
      
      for (const pattern of phonePatterns) {
        const match = bodyText.match(pattern);
        if (match) {
          phone = match[0];
          break;
        }
      }
    }
    
    return phone;
  }

  /**
   * Extract local keywords and location terms
   */
  private extractLocalKeywords(bodyText: string): string[] {
    const localKeywords: string[] = [];
    
    // Location indicators
    const locationWords = [
      'near me', 'local', 'nearby', 'in [city]', '[city] area',
      'downtown', 'neighborhood', 'community', 'region'
    ];
    
    // Service area indicators
    const serviceWords = [
      'serving', 'service area', 'we serve', 'covering',
      'available in', 'located in', 'based in'
    ];
    
    const words = bodyText.toLowerCase();
    
    locationWords.forEach(keyword => {
      if (words.includes(keyword.toLowerCase())) {
        localKeywords.push(keyword);
      }
    });
    
    serviceWords.forEach(keyword => {
      if (words.includes(keyword.toLowerCase())) {
        localKeywords.push(keyword);
      }
    });
    
    return localKeywords;
  }

  /**
   * Check for Google Business Profile indicators
   */
  private checkGoogleBusinessIndicators($: cheerio.CheerioAPI): boolean {
    // Check for Google My Business links or widgets
    const googleLinks = $('a[href*="google.com/maps"], a[href*="business.google.com"]');
    
    // Check for Google reviews widgets
    const googleWidgets = $('[data-google-review], [class*="google"], [id*="google"]');
    
    // Check for schema markup indicating local business
    let hasLocalBusinessSchema = false;
    $('script[type="application/ld+json"]').each((_, element) => {
      try {
        const schema = JSON.parse($(element).html() || '{}');
        if (schema['@type'] === 'LocalBusiness') {
          hasLocalBusinessSchema = true;
          return false;
        }
      } catch (error) {
        // Ignore invalid JSON-LD
      }
    });
    
    return googleLinks.length > 0 || googleWidgets.length > 0 || hasLocalBusinessSchema;
  }

  /**
   * Assess local content quality and relevance
   */
  private assessLocalContent(bodyText: string): boolean {
    const localContentIndicators = [
      /community|neighborhood|local|area|region/i,
      /address|location|directions|hours/i,
      /serving|service area|coverage area/i,
      /testimonials|reviews|customers/i
    ];
    
    return localContentIndicators.some(pattern => pattern.test(bodyText));
  }

  /**
   * Analyze citations (placeholder for external API integration)
   */
  private async analyzeCitations(url: string): Promise<any> {
    // In production, this would integrate with citation tracking APIs
    // For now, return placeholder data
    
    return {
      total: 15,
      consistent: 12,
      incomplete: 3,
      accuracy: 80
    };
  }

  /**
   * Analyze reviews (placeholder for external API integration)
   */
  private async analyzeReviews(url: string): Promise<any> {
    // In production, this would integrate with review tracking APIs
    // For now, return placeholder data
    
    return {
      averageRating: 4.2,
      totalReviews: 85,
      recentReviews: 12,
      responseRate: 75
    };
  }

  /**
   * Extract city/state information from content
   */
  private extractLocationInfo(bodyText: string): any {
    // US State patterns
    const statePatterns = /\b(AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY)\b/g;
    
    // City patterns (simplified)
    const cityPatterns = /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*(?=,\s*[A-Z]{2})/g;
    
    const states = bodyText.match(statePatterns) || [];
    const cities = bodyText.match(cityPatterns) || [];
    
    return {
      states: [...new Set(states)],
      cities: [...new Set(cities)],
      hasLocationInfo: states.length > 0 || cities.length > 0
    };
  }
}