import * as cheerio from 'cheerio';
import type { PageCrawlResult } from '../enhanced-analyzer.service';

export interface AnalysisFactor {
  name: string;
  description: string;
  status: 'OK' | 'OFI' | 'Priority OFI' | 'N/A';
  importance: 'High' | 'Medium' | 'Low';
  notes: string;
  category: string;
}

/**
 * Local SEO & E-E-A-T Analyzer - Rival Outranker 2.0
 * Handles 35+ local SEO and expertise/authority/trust factors
 */
export class LocalSEOAnalyzer {
  
  async analyze(page: PageCrawlResult, $: cheerio.CheerioAPI): Promise<AnalysisFactor[]> {
    console.log(`[LocalSEOAnalyzer] Starting local SEO and E-E-A-T analysis for: ${page.url}`);
    const factors: AnalysisFactor[] = [];
    
    // Phase 3: Local SEO & E-E-A-T Analysis (35+ factors)
    
    // Core Local SEO Factors
    factors.push(await this.analyzeNAPConsistency($, page.bodyText));
    factors.push(await this.analyzeGoogleBusinessProfile($, page.bodyText));
    factors.push(await this.analyzeLocalKeywords(page.bodyText, page.url));
    factors.push(await this.analyzeLocationPages(page.url, page.bodyText));
    factors.push(await this.analyzeLocalSchema($));
    factors.push(await this.analyzeCustomerReviews($));
    factors.push(await this.analyzeLocalCitations($, page.bodyText));
    factors.push(await this.analyzeServiceAreaCoverage(page.bodyText));
    factors.push(await this.analyzeLocalBusinessHours($, page.bodyText));
    factors.push(await this.analyzeDirectionsAndMap($));
    
    // E-E-A-T (Experience, Expertise, Authoritativeness, Trust) Factors
    factors.push(await this.analyzeAuthorExpertise($, page.bodyText));
    factors.push(await this.analyzeBusinessCredentials($, page.bodyText));
    factors.push(await this.analyzeContactInformation($, page.bodyText));
    factors.push(await this.analyzeProfessionalAssociations($, page.bodyText));
    factors.push(await this.analyzeYearsInBusiness($, page.bodyText));
    factors.push(await this.analyzeCertificationsAndLicenses($, page.bodyText));
    factors.push(await this.analyzeTeamExpertise($, page.bodyText));
    factors.push(await this.analyzeClientTestimonials($));
    factors.push(await this.analyzeCaseStudies($, page.bodyText));
    factors.push(await this.analyzeAwardsAndRecognition($, page.bodyText));
    
    // Trust and Authority Signals
    factors.push(await this.analyzePrivacyPolicy($));
    factors.push(await this.analyzeTermsOfService($));
    factors.push(await this.analyzeSocialMediaPresence($));
    factors.push(await this.analyzeBusinessAddress($, page.bodyText));
    factors.push(await this.analyzePhoneNumberVisibility($, page.bodyText));
    factors.push(await this.analyzeEmailContactVisibility($, page.bodyText));
    factors.push(await this.analyzeAboutUsPage(page.url, page.bodyText));
    factors.push(await this.analyzeProfessionalPhotos($));
    factors.push(await this.analyzeInsuranceAndBonding($, page.bodyText));
    factors.push(await this.analyzePaymentOptionsAndPolicies($, page.bodyText));
    
    // Enhanced Local Factors
    factors.push(await this.analyzeLocalContentRelevance(page.bodyText));
    factors.push(await this.analyzeCompetitiveAdvantage($, page.bodyText));
    factors.push(await this.analyzeServiceDifferentiation($, page.bodyText));
    factors.push(await this.analyzeEmergencyServices($, page.bodyText));
    factors.push(await this.analyzeFreeEstimates($, page.bodyText));

    console.log(`[LocalSEOAnalyzer] Completed analysis with ${factors.length} local SEO factors`);
    return factors;
  }

  private async analyzeNAPConsistency($: cheerio.CheerioAPI, text: string): Promise<AnalysisFactor> {
    const businessNameFound = this.findBusinessName($, text);
    const addressFound = this.findAddress($, text);
    const phoneFound = this.findPhoneNumber($, text);
    
    const napScore = (businessNameFound ? 1 : 0) + (addressFound ? 1 : 0) + (phoneFound ? 1 : 0);
    const status = napScore === 3 ? "OK" : napScore >= 2 ? "OFI" : "Priority OFI";
    
    return {
      name: "NAP Consistency (Name, Address, Phone)",
      description: "Business name, address, and phone should be consistent and prominent",
      status,
      importance: "High",
      category: "local",
      notes: napScore === 3 ?
        "What: Your business NAP information is complete and prominently displayed.\n\nWhy: Consistent NAP information is crucial for local search rankings and customer trust.\n\nHow: Continue maintaining consistent NAP across all pages and online listings." :
        napScore >= 2 ?
        `What: Your NAP information is partially complete (${napScore}/3 elements found).\n\nWhy: Incomplete NAP information hurts local search visibility and customer trust.\n\nHow: Add missing NAP elements and ensure consistency across all pages.` :
        `What: Your NAP information is missing or incomplete (${napScore}/3 elements found).\n\nWhy: Missing NAP information severely hurts local search rankings and makes it hard for customers to contact you.\n\nHow: Add complete business name, address, and phone number prominently on all pages.`
    };
  }

  private async analyzeGoogleBusinessProfile($: cheerio.CheerioAPI, text: string): Promise<AnalysisFactor> {
    const gmbMentions = text.toLowerCase().includes('google') && 
                      (text.toLowerCase().includes('business') || text.toLowerCase().includes('maps'));
    const reviewLinks = $('a[href*="google.com/maps"], a[href*="business.google.com"]').length > 0;
    
    const status = gmbMentions || reviewLinks ? "OK" : "OFI";
    
    return {
      name: "Google Business Profile Integration",
      description: "Website should integrate with Google Business Profile for local SEO",
      status,
      importance: "High",
      category: "local",
      notes: status === "OK" ?
        "What: Your website shows integration with Google Business Profile.\n\nWhy: Google Business Profile is essential for local search visibility and customer reviews.\n\nHow: Continue optimizing your Google Business Profile and encourage customer reviews." :
        "What: Your website lacks clear Google Business Profile integration.\n\nWhy: Google Business Profile is crucial for local search rankings and customer discovery.\n\nHow: Add links to your Google Business Profile and encourage customers to leave reviews."
    };
  }

  private async analyzeLocalKeywords(text: string, url: string): Promise<AnalysisFactor> {
    const localKeywords = this.extractLocalKeywords(text, url);
    const hasLocalKeywords = localKeywords.length >= 3;
    
    return {
      name: "Local Keyword Optimization",
      description: "Content should include relevant local and geo-targeted keywords",
      status: hasLocalKeywords ? "OK" : "OFI",
      importance: "High",
      category: "local",
      notes: hasLocalKeywords ?
        `What: Your content includes local keywords (found: ${localKeywords.join(', ')}).\n\nWhy: Local keywords help search engines understand your service areas and improve local rankings.\n\nHow: Continue using local keywords naturally and consider adding nearby city names.` :
        "What: Your content lacks local keywords for better geographic targeting.\n\nWhy: Local keywords are essential for ranking in location-based searches.\n\nHow: Include your city, region, and nearby areas naturally throughout your content."
    };
  }

  private async analyzeLocationPages(url: string, text: string): Promise<AnalysisFactor> {
    const isLocationPage = url.includes('/location') || url.includes('/area') || 
                          text.toLowerCase().includes('serving') || text.toLowerCase().includes('service area');
    
    return {
      name: "Location-Specific Pages",
      description: "Business should have dedicated pages for service locations",
      status: isLocationPage ? "OK" : "N/A",
      importance: "Medium",
      category: "local",
      notes: isLocationPage ?
        "What: This appears to be a location-specific page for local targeting.\n\nWhy: Location pages help target specific areas and improve local search visibility.\n\nHow: Continue creating location pages for all major service areas." :
        "What: Consider creating location-specific pages for your service areas.\n\nWhy: Location pages improve local search rankings for specific areas.\n\nHow: Create dedicated pages for each city or region you serve."
    };
  }

  private async analyzeLocalSchema($: cheerio.CheerioAPI): Promise<AnalysisFactor> {
    const schemaScripts = $('script[type="application/ld+json"]');
    const hasLocalBusinessSchema = schemaScripts.text().includes('LocalBusiness') ||
                                   schemaScripts.text().includes('Organization') ||
                                   schemaScripts.text().includes('address');
    
    return {
      name: "Local Business Schema Markup",
      description: "Page should include LocalBusiness schema markup",
      status: hasLocalBusinessSchema ? "OK" : "Priority OFI",
      importance: "High",
      category: "local",
      notes: hasLocalBusinessSchema ?
        "What: Your page includes local business schema markup.\n\nWhy: Local business schema helps search engines understand your business details and can enable rich snippets.\n\nHow: Continue maintaining and expanding schema markup with hours, reviews, and services." :
        "What: Your page is missing local business schema markup.\n\nWhy: Schema markup is essential for local search visibility and rich search results.\n\nHow: Add LocalBusiness schema with your NAP, hours, services, and review information."
    };
  }

  private async analyzeCustomerReviews($: cheerio.CheerioAPI): Promise<AnalysisFactor> {
    const reviewElements = $('.review, .testimonial, .rating, .feedback').length;
    const reviewText = $('body').text().toLowerCase();
    const hasReviewMentions = reviewText.includes('review') || reviewText.includes('testimonial') || 
                             reviewText.includes('5 star') || reviewText.includes('customer says');
    
    const status = reviewElements >= 3 || hasReviewMentions ? "OK" : reviewElements >= 1 ? "OFI" : "Priority OFI";
    
    return {
      name: "Customer Reviews and Testimonials",
      description: "Page should showcase customer reviews and testimonials",
      status,
      importance: "High",
      category: "local",
      notes: status === "OK" ?
        "What: Your page prominently displays customer reviews and testimonials.\n\nWhy: Customer reviews build trust and are a strong local SEO ranking factor.\n\nHow: Continue collecting and displaying reviews, and respond to all feedback." :
        status === "OFI" ?
        "What: Your page has some customer feedback but could showcase more.\n\nWhy: More reviews increase trust and improve local search rankings.\n\nHow: Add more testimonials and encourage customers to leave reviews online." :
        "What: Your page lacks customer reviews and testimonials.\n\nWhy: Reviews are crucial for trust and local SEO rankings.\n\nHow: Collect customer testimonials and encourage online reviews on Google and other platforms."
    };
  }

  private async analyzeLocalCitations($: cheerio.CheerioAPI, text: string): Promise<AnalysisFactor> {
    const citationIndicators = text.toLowerCase().includes('better business bureau') ||
                              text.toLowerCase().includes('chamber of commerce') ||
                              text.toLowerCase().includes('yelp') ||
                              text.toLowerCase().includes('angie') ||
                              $('a[href*="bbb.org"], a[href*="yelp.com"], a[href*="angieslist"]').length > 0;
    
    return {
      name: "Local Citation Building",
      description: "Business should maintain consistent citations across local directories",
      status: citationIndicators ? "OK" : "OFI",
      importance: "Medium",
      category: "local",
      notes: citationIndicators ?
        "What: Your website references local directories and citation sources.\n\nWhy: Local citations improve local search authority and help customers find you.\n\nHow: Continue maintaining consistent citations across all local directories." :
        "What: Your website lacks references to local directories and citations.\n\nWhy: Local citations are important for local search authority and discovery.\n\nHow: Build citations on BBB, Yelp, chamber of commerce, and industry directories."
    };
  }

  private async analyzeServiceAreaCoverage(text: string): Promise<AnalysisFactor> {
    const serviceAreaIndicators = text.toLowerCase().includes('service area') ||
                                 text.toLowerCase().includes('serving') ||
                                 text.toLowerCase().includes('coverage area') ||
                                 text.toLowerCase().includes('we serve');
    
    return {
      name: "Service Area Definition",
      description: "Business should clearly define service areas and coverage",
      status: serviceAreaIndicators ? "OK" : "OFI",
      importance: "Medium",
      category: "local",
      notes: serviceAreaIndicators ?
        "What: Your page clearly defines your service areas.\n\nWhy: Clear service area information helps customers and search engines understand your coverage.\n\nHow: Continue highlighting service areas and consider creating location-specific pages." :
        "What: Your page doesn't clearly define your service areas.\n\nWhy: Unclear service areas confuse customers and search engines about your coverage.\n\nHow: Add a clear service area section listing all cities and regions you serve."
    };
  }

  private async analyzeLocalBusinessHours($: cheerio.CheerioAPI, text: string): Promise<AnalysisFactor> {
    const hoursIndicators = text.toLowerCase().includes('hours') ||
                           text.toLowerCase().includes('open') ||
                           text.toLowerCase().includes('monday') ||
                           text.toLowerCase().includes('24/7') ||
                           $('.hours, .business-hours, .schedule').length > 0;
    
    return {
      name: "Business Hours Display",
      description: "Page should clearly display business hours",
      status: hoursIndicators ? "OK" : "OFI",
      importance: "Medium",
      category: "local",
      notes: hoursIndicators ?
        "What: Your page displays business hours information.\n\nWhy: Clear business hours help customers know when to contact you and improve local SEO.\n\nHow: Ensure hours are accurate and consider adding holiday hours." :
        "What: Your page doesn't clearly display business hours.\n\nWhy: Missing hours information frustrates customers and hurts local search visibility.\n\nHow: Add clear business hours, including emergency or after-hours availability."
    };
  }

  private async analyzeDirectionsAndMap($: cheerio.CheerioAPI): Promise<AnalysisFactor> {
    const mapElements = $('iframe[src*="maps"], iframe[src*="google"], .map, #map').length;
    const directionLinks = $('a[href*="maps.google"], a[href*="directions"]').length;
    
    const status = mapElements > 0 || directionLinks > 0 ? "OK" : "OFI";
    
    return {
      name: "Map and Directions Integration",
      description: "Page should include map and directions for easy customer access",
      status,
      importance: "Medium",
      category: "local",
      notes: status === "OK" ?
        "What: Your page includes map or direction links for customer convenience.\n\nWhy: Maps and directions help customers find your location easily.\n\nHow: Ensure map is mobile-friendly and consider adding parking information." :
        "What: Your page lacks map integration or direction links.\n\nWhy: Missing location information makes it harder for customers to find you.\n\nHow: Add an embedded Google Map and clear direction links to your location."
    };
  }

  // E-E-A-T Analysis Methods
  private async analyzeAuthorExpertise($: cheerio.CheerioAPI, text: string): Promise<AnalysisFactor> {
    const expertiseIndicators = text.toLowerCase().includes('expert') ||
                               text.toLowerCase().includes('specialist') ||
                               text.toLowerCase().includes('professional') ||
                               text.toLowerCase().includes('certified') ||
                               $('[rel="author"], .author, .expert').length > 0;
    
    return {
      name: "Author and Expert Credentials",
      description: "Content should demonstrate author expertise and qualifications",
      status: expertiseIndicators ? "OK" : "OFI",
      importance: "High",
      category: "local",
      notes: expertiseIndicators ?
        "What: Your content demonstrates expertise and professional credentials.\n\nWhy: Expertise signals are crucial for E-A-T and search engine trust.\n\nHow: Continue highlighting qualifications and consider adding author bios." :
        "What: Your content lacks clear expertise and credential indicators.\n\nWhy: Missing expertise signals hurt E-A-T scores and search engine trust.\n\nHow: Add author credentials, certifications, and expertise indicators throughout content."
    };
  }

  private async analyzeBusinessCredentials($: cheerio.CheerioAPI, text: string): Promise<AnalysisFactor> {
    const credentialIndicators = text.toLowerCase().includes('licensed') ||
                                text.toLowerCase().includes('insured') ||
                                text.toLowerCase().includes('bonded') ||
                                text.toLowerCase().includes('certified') ||
                                text.toLowerCase().includes('accredited');
    
    return {
      name: "Business Licensing and Credentials",
      description: "Business should display relevant licenses and certifications",
      status: credentialIndicators ? "OK" : "OFI",
      importance: "High",
      category: "local",
      notes: credentialIndicators ?
        "What: Your business displays licensing and credential information.\n\nWhy: Credentials build trust and are important for regulated industries.\n\nHow: Continue prominently displaying all relevant licenses and certifications." :
        "What: Your business credentials and licensing information isn't clearly displayed.\n\nWhy: Missing credentials hurt customer trust and regulatory compliance.\n\nHow: Add license numbers, certifications, and accreditation information prominently."
    };
  }

  private async analyzeContactInformation($: cheerio.CheerioAPI, text: string): Promise<AnalysisFactor> {
    const contactMethods = [
      this.findPhoneNumber($, text),
      this.findEmailAddress($, text),
      this.findAddress($, text),
      $('.contact, .contact-us, .get-in-touch').length > 0
    ].filter(Boolean).length;
    
    return {
      name: "Comprehensive Contact Information",
      description: "Multiple contact methods should be easily accessible",
      status: contactMethods >= 3 ? "OK" : contactMethods >= 2 ? "OFI" : "Priority OFI",
      importance: "High",
      category: "local",
      notes: contactMethods >= 3 ?
        "What: Your page provides comprehensive contact information.\n\nWhy: Multiple contact methods build trust and improve customer accessibility.\n\nHow: Continue making contact information prominent and consider adding contact forms." :
        `What: Your contact information could be more comprehensive (${contactMethods} methods found).\n\nWhy: Limited contact options reduce customer trust and accessibility.\n\nHow: Add multiple contact methods including phone, email, address, and contact forms.`
    };
  }

  // Helper methods for analysis
  private findBusinessName($: cheerio.CheerioAPI, text: string): boolean {
    const titleTag = $('title').text();
    const h1Tag = $('h1').first().text();
    const logoAlt = $('img[alt*="logo"], .logo img').attr('alt') || '';
    
    return titleTag.length > 5 || h1Tag.length > 5 || logoAlt.length > 5;
  }

  private findAddress($: cheerio.CheerioAPI, text: string): boolean {
    const addressPattern = /\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln)/i;
    const hasAddressMarkup = $('.address, .location, [itemprop="address"]').length > 0;
    
    return addressPattern.test(text) || hasAddressMarkup;
  }

  private findPhoneNumber($: cheerio.CheerioAPI, text: string): boolean {
    const phonePattern = /(\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/;
    const hasPhoneMarkup = $('a[href^="tel:"], [itemprop="telephone"]').length > 0;
    
    return phonePattern.test(text) || hasPhoneMarkup;
  }

  private findEmailAddress($: cheerio.CheerioAPI, text: string): boolean {
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const hasEmailMarkup = $('a[href^="mailto:"], [itemprop="email"]').length > 0;
    
    return emailPattern.test(text) || hasEmailMarkup;
  }

  private extractLocalKeywords(text: string, url: string): string[] {
    const localTerms = ['city', 'town', 'area', 'local', 'near', 'serving', 'county', 'region'];
    const urlParts = url.split('/').join(' ').split('-').join(' ').toLowerCase();
    const foundKeywords: string[] = [];
    
    localTerms.forEach(term => {
      if (text.toLowerCase().includes(term) || urlParts.includes(term)) {
        foundKeywords.push(term);
      }
    });
    
    // Extract potential city names (simplified)
    const cityPattern = /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?\s+(?:city|town|area)\b/g;
    const cityMatches = text.match(cityPattern) || [];
    foundKeywords.push(...cityMatches.slice(0, 3));
    
    return [...new Set(foundKeywords)];
  }

  // Additional placeholder methods (simplified implementations)
  private async analyzeProfessionalAssociations($: cheerio.CheerioAPI, text: string): Promise<AnalysisFactor> {
    const associationTerms = ['association', 'member', 'affiliate', 'certified by', 'accredited'];
    const hasAssociations = associationTerms.some(term => text.toLowerCase().includes(term));
    
    return {
      name: "Professional Associations",
      description: "Business should mention relevant professional associations",
      status: hasAssociations ? "OK" : "N/A",
      importance: "Medium",
      category: "local",
      notes: hasAssociations ? "Professional associations mentioned" : "Consider adding professional association memberships"
    };
  }

  private async analyzeYearsInBusiness($: cheerio.CheerioAPI, text: string): Promise<AnalysisFactor> {
    const yearPattern = /(?:since|established|founded)\s*(?:in\s*)?(\d{4})|(\d+)\s*years?\s*(?:in\s*business|experience)/i;
    const hasYearsInfo = yearPattern.test(text);
    
    return {
      name: "Years in Business",
      description: "Business should highlight years of experience",
      status: hasYearsInfo ? "OK" : "OFI",
      importance: "Medium",
      category: "local",
      notes: hasYearsInfo ? "Years in business clearly stated" : "Consider adding years in business for credibility"
    };
  }

  private async analyzeCertificationsAndLicenses($: cheerio.CheerioAPI, text: string): Promise<AnalysisFactor> {
    const certificationTerms = ['certified', 'licensed', 'qualification', 'credential', 'certificate'];
    const hasCertifications = certificationTerms.some(term => text.toLowerCase().includes(term));
    
    return {
      name: "Professional Certifications",
      description: "Business should display relevant certifications and licenses",
      status: hasCertifications ? "OK" : "OFI",
      importance: "High",
      category: "local",
      notes: hasCertifications ? "Professional certifications displayed" : "Add relevant certifications and licenses"
    };
  }

  private async analyzeTeamExpertise($: cheerio.CheerioAPI, text: string): Promise<AnalysisFactor> {
    const teamTerms = ['team', 'staff', 'employees', 'experts', 'specialists'];
    const hasTeamInfo = teamTerms.some(term => text.toLowerCase().includes(term)) || 
                       $('.team, .staff, .employee').length > 0;
    
    return {
      name: "Team Expertise Showcase",
      description: "Business should highlight team qualifications and expertise",
      status: hasTeamInfo ? "OK" : "OFI",
      importance: "Medium",
      category: "local",
      notes: hasTeamInfo ? "Team expertise highlighted" : "Consider adding team member qualifications"
    };
  }

  private async analyzeClientTestimonials($: cheerio.CheerioAPI): Promise<AnalysisFactor> {
    const testimonialElements = $('.testimonial, .client-review, .customer-feedback').length;
    const quoteElements = $('.quote, blockquote').length;
    
    return {
      name: "Client Testimonials",
      description: "Page should include specific client testimonials",
      status: testimonialElements >= 2 || quoteElements >= 2 ? "OK" : "OFI",
      importance: "High",
      category: "local",
      notes: testimonialElements >= 2 ? "Client testimonials present" : "Add more specific client testimonials"
    };
  }

  private async analyzeCaseStudies($: cheerio.CheerioAPI, text: string): Promise<AnalysisFactor> {
    const caseStudyTerms = ['case study', 'project', 'success story', 'results', 'before and after'];
    const hasCaseStudies = caseStudyTerms.some(term => text.toLowerCase().includes(term));
    
    return {
      name: "Case Studies and Success Stories",
      description: "Consider including case studies to demonstrate expertise",
      status: hasCaseStudies ? "OK" : "N/A",
      importance: "Low",
      category: "local",
      notes: hasCaseStudies ? "Case studies or success stories present" : "Consider adding case studies"
    };
  }

  private async analyzeAwardsAndRecognition($: cheerio.CheerioAPI, text: string): Promise<AnalysisFactor> {
    const awardTerms = ['award', 'recognition', 'honor', 'winner', 'best of', 'top rated'];
    const hasAwards = awardTerms.some(term => text.toLowerCase().includes(term));
    
    return {
      name: "Awards and Recognition",
      description: "Business should highlight any awards or recognition received",
      status: hasAwards ? "OK" : "N/A",
      importance: "Low",
      category: "local",
      notes: hasAwards ? "Awards and recognition displayed" : "Consider adding any awards or recognition"
    };
  }

  private async analyzePrivacyPolicy($: cheerio.CheerioAPI): Promise<AnalysisFactor> {
    const privacyLinks = $('a[href*="privacy"], a:contains("Privacy Policy")').length;
    
    return {
      name: "Privacy Policy",
      description: "Website should have an accessible privacy policy",
      status: privacyLinks > 0 ? "OK" : "OFI",
      importance: "Medium",
      category: "local",
      notes: privacyLinks > 0 ? "Privacy policy link found" : "Add privacy policy for legal compliance and trust"
    };
  }

  private async analyzeTermsOfService($: cheerio.CheerioAPI): Promise<AnalysisFactor> {
    const termsLinks = $('a[href*="terms"], a:contains("Terms"), a:contains("Terms of Service")').length;
    
    return {
      name: "Terms of Service",
      description: "Website should have accessible terms of service",
      status: termsLinks > 0 ? "OK" : "OFI",
      importance: "Low",
      category: "local",
      notes: termsLinks > 0 ? "Terms of service link found" : "Consider adding terms of service for legal protection"
    };
  }

  private async analyzeSocialMediaPresence($: cheerio.CheerioAPI): Promise<AnalysisFactor> {
    const socialLinks = $('a[href*="facebook"], a[href*="twitter"], a[href*="linkedin"], a[href*="instagram"]').length;
    
    return {
      name: "Social Media Integration",
      description: "Business should link to active social media profiles",
      status: socialLinks >= 2 ? "OK" : socialLinks >= 1 ? "OFI" : "N/A",
      importance: "Low",
      category: "local",
      notes: socialLinks >= 2 ? "Good social media presence" : "Consider adding more social media links"
    };
  }

  private async analyzeBusinessAddress($: cheerio.CheerioAPI, text: string): Promise<AnalysisFactor> {
    const hasAddress = this.findAddress($, text);
    
    return {
      name: "Physical Business Address",
      description: "Business address should be clearly displayed",
      status: hasAddress ? "OK" : "Priority OFI",
      importance: "High",
      category: "local",
      notes: hasAddress ? "Business address clearly displayed" : "Add complete business address prominently"
    };
  }

  private async analyzePhoneNumberVisibility($: cheerio.CheerioAPI, text: string): Promise<AnalysisFactor> {
    const hasPhone = this.findPhoneNumber($, text);
    
    return {
      name: "Phone Number Visibility",
      description: "Phone number should be prominently displayed",
      status: hasPhone ? "OK" : "Priority OFI",
      importance: "High",
      category: "local",
      notes: hasPhone ? "Phone number prominently displayed" : "Add phone number prominently for customer contact"
    };
  }

  private async analyzeEmailContactVisibility($: cheerio.CheerioAPI, text: string): Promise<AnalysisFactor> {
    const hasEmail = this.findEmailAddress($, text);
    
    return {
      name: "Email Contact Visibility",
      description: "Email contact should be easily accessible",
      status: hasEmail ? "OK" : "OFI",
      importance: "Medium",
      category: "local",
      notes: hasEmail ? "Email contact accessible" : "Add email contact for customer communication"
    };
  }

  private async analyzeAboutUsPage(url: string, text: string): Promise<AnalysisFactor> {
    const isAboutPage = url.includes('/about') || text.toLowerCase().includes('about us') ||
                       text.toLowerCase().includes('our story') || text.toLowerCase().includes('our company');
    
    return {
      name: "About Us Page Content",
      description: "Business should have comprehensive about us information",
      status: isAboutPage ? "OK" : "N/A",
      importance: "Medium",
      category: "local",
      notes: isAboutPage ? "About us information present" : "Consider creating detailed about us page"
    };
  }

  private async analyzeProfessionalPhotos($: cheerio.CheerioAPI): Promise<AnalysisFactor> {
    const images = $('img').length;
    const professionalImages = $('img[alt*="team"], img[alt*="staff"], img[alt*="office"], img[alt*="work"]').length;
    
    return {
      name: "Professional Photography",
      description: "Website should include professional photos of team and work",
      status: professionalImages >= 2 ? "OK" : professionalImages >= 1 ? "OFI" : "N/A",
      importance: "Low",
      category: "local",
      notes: professionalImages >= 2 ? "Professional photos present" : "Consider adding professional team/work photos"
    };
  }

  private async analyzeInsuranceAndBonding($: cheerio.CheerioAPI, text: string): Promise<AnalysisFactor> {
    const insuranceTerms = ['insured', 'bonded', 'insurance', 'liability', 'covered'];
    const hasInsuranceInfo = insuranceTerms.some(term => text.toLowerCase().includes(term));
    
    return {
      name: "Insurance and Bonding Information",
      description: "Service businesses should mention insurance and bonding",
      status: hasInsuranceInfo ? "OK" : "N/A",
      importance: "Medium",
      category: "local",
      notes: hasInsuranceInfo ? "Insurance information mentioned" : "Consider adding insurance and bonding information"
    };
  }

  private async analyzePaymentOptionsAndPolicies($: cheerio.CheerioAPI, text: string): Promise<AnalysisFactor> {
    const paymentTerms = ['payment', 'credit card', 'financing', 'payment plans', 'accepted'];
    const hasPaymentInfo = paymentTerms.some(term => text.toLowerCase().includes(term));
    
    return {
      name: "Payment Options and Policies",
      description: "Business should clearly state payment options and policies",
      status: hasPaymentInfo ? "OK" : "OFI",
      importance: "Low",
      category: "local",
      notes: hasPaymentInfo ? "Payment information provided" : "Consider adding payment options and policies"
    };
  }

  private async analyzeLocalContentRelevance(text: string): Promise<AnalysisFactor> {
    const localContentTerms = ['local', 'community', 'neighborhood', 'area residents', 'local customers'];
    const hasLocalContent = localContentTerms.some(term => text.toLowerCase().includes(term));
    
    return {
      name: "Local Content Relevance",
      description: "Content should be relevant to local community and customers",
      status: hasLocalContent ? "OK" : "OFI",
      importance: "Medium",
      category: "local",
      notes: hasLocalContent ? "Local content relevance good" : "Add more local community-focused content"
    };
  }

  private async analyzeCompetitiveAdvantage($: cheerio.CheerioAPI, text: string): Promise<AnalysisFactor> {
    const advantageTerms = ['advantage', 'unique', 'different', 'better', 'superior', 'exclusive'];
    const hasAdvantage = advantageTerms.some(term => text.toLowerCase().includes(term));
    
    return {
      name: "Competitive Advantage Messaging",
      description: "Business should clearly communicate competitive advantages",
      status: hasAdvantage ? "OK" : "OFI",
      importance: "Medium",
      category: "local",
      notes: hasAdvantage ? "Competitive advantages communicated" : "Better highlight what makes you unique"
    };
  }

  private async analyzeServiceDifferentiation($: cheerio.CheerioAPI, text: string): Promise<AnalysisFactor> {
    const differentiationTerms = ['specialized', 'expert', 'custom', 'personalized', 'tailored'];
    const hasDifferentiation = differentiationTerms.some(term => text.toLowerCase().includes(term));
    
    return {
      name: "Service Differentiation",
      description: "Services should be clearly differentiated from competitors",
      status: hasDifferentiation ? "OK" : "OFI",
      importance: "Medium",
      category: "local",
      notes: hasDifferentiation ? "Service differentiation clear" : "Better explain what makes your services unique"
    };
  }

  private async analyzeEmergencyServices($: cheerio.CheerioAPI, text: string): Promise<AnalysisFactor> {
    const emergencyTerms = ['emergency', '24/7', 'urgent', 'immediate', 'same day'];
    const hasEmergencyServices = emergencyTerms.some(term => text.toLowerCase().includes(term));
    
    return {
      name: "Emergency Service Availability",
      description: "Consider highlighting emergency or urgent service availability",
      status: hasEmergencyServices ? "OK" : "N/A",
      importance: "Low",
      category: "local",
      notes: hasEmergencyServices ? "Emergency services highlighted" : "Consider adding emergency service information if applicable"
    };
  }

  private async analyzeFreeEstimates($: cheerio.CheerioAPI, text: string): Promise<AnalysisFactor> {
    const estimateTerms = ['free estimate', 'free quote', 'free consultation', 'no obligation'];
    const hasFreeEstimates = estimateTerms.some(term => text.toLowerCase().includes(term));
    
    return {
      name: "Free Estimates and Consultations",
      description: "Consider offering free estimates to attract customers",
      status: hasFreeEstimates ? "OK" : "N/A",
      importance: "Low",
      category: "local",
      notes: hasFreeEstimates ? "Free estimates offered" : "Consider offering free estimates to attract customers"
    };
  }
}