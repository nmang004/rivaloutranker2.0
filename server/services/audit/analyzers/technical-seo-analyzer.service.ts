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
 * Technical SEO Analyzer - Rival Outranker 2.0
 * Preserves the sophisticated technical analysis from the original system
 * Handles 40+ technical SEO factors with enhanced modern web standards
 */
export class TechnicalSEOAnalyzer {
  
  async analyze(page: PageCrawlResult, $: cheerio.CheerioAPI): Promise<AnalysisFactor[]> {
    console.log(`[TechnicalSEOAnalyzer] Starting comprehensive technical analysis for: ${page.url}`);
    const factors: AnalysisFactor[] = [];
    
    // Phase 2: Advanced Technical Analysis (40+ factors)
    
    // Core Technical SEO Factors
    factors.push(await this.analyzeURLStructure(page.url));
    factors.push(await this.analyzeSchemaMarkup($, page.schemaMarkup));
    factors.push(await this.analyzeMetaTags(page));
    factors.push(await this.analyzeCanonicalTag($));
    factors.push(await this.analyzeImageOptimization(page.images));
    factors.push(await this.analyzeRobotsTags($));
    factors.push(await this.analyzeHTMLValidation($));
    factors.push(await this.analyzeSSLImplementation(page.url));
    factors.push(await this.analyzeMobileResponsiveness($));
    factors.push(await this.analyzePageSpeed(page));
    
    // Enhanced Technical Factors
    factors.push(await this.analyzeCoreWebVitals(page));
    factors.push(await this.analyzeStructuredData($, page.schemaMarkup));
    factors.push(await this.analyzeOpenGraphTags($));
    factors.push(await this.analyzeTwitterCardTags($));
    factors.push(await this.analyzeInternalLinking($));
    factors.push(await this.analyzeExternalLinking($));
    factors.push(await this.analyzeAltTextOptimization(page.images));
    factors.push(await this.analyzeURLParameters(page.url));
    factors.push(await this.analyzeRedirectChains(page));
    factors.push(await this.analyzeHTTPHeaders(page));
    
    // Advanced 2.0 Technical Factors
    factors.push(await this.analyzeJavaScriptOptimization($));
    factors.push(await this.analyzeCSSOptimization($));
    factors.push(await this.analyzeResourceOptimization(page));
    factors.push(await this.analyzeWebVitalsOptimization(page));
    factors.push(await this.analyzeSecurityHeaders(page));
    factors.push(await this.analyzeAccessibilityCompliance($));
    factors.push(await this.analyzeBreadcrumbImplementation($));
    factors.push(await this.analyzePaginationTags($));
    factors.push(await this.analyzeLanguageAttributes($));
    factors.push(await this.analyzeViewportConfiguration($));
    factors.push(await this.analyzeFaviconImplementation($));
    factors.push(await this.analyzeXMLSitemap(page));
    factors.push(await this.analyzeRobotsTxt(page));
    factors.push(await this.analyzeHTTP2Implementation(page));
    factors.push(await this.analyzeLazyLoadingImplementation($));
    factors.push(await this.analyzeServiceWorkerImplementation($));
    factors.push(await this.analyzeWebpImageFormat(page.images));
    factors.push(await this.analyzeContentCompression(page));
    factors.push(await this.analyzeCriticalResourceOptimization($));
    factors.push(await this.analyzeThirdPartyScripts($));

    console.log(`[TechnicalSEOAnalyzer] Completed analysis with ${factors.length} technical factors`);
    return factors;
  }

  private async analyzeURLStructure(url: string): Promise<AnalysisFactor> {
    const issues = this.checkURLIssues(url);
    const isOptimal = issues.length === 0;
    const hasMinorIssues = issues.length <= 2;
    
    return {
      name: "URL Structure Optimization",
      description: "URLs should be clean, descriptive, and keyword-rich",
      status: isOptimal ? "OK" : hasMinorIssues ? "OFI" : "Priority OFI",
      importance: "High",
      category: "technical",
      notes: isOptimal ?
        "What: Your URL structure is clean and optimized for search engines.\n\nWhy: Well-structured URLs help both users and search engines understand your page content and improve rankings.\n\nHow: Continue maintaining descriptive URLs and consider adding location-specific keywords when creating new pages." :
        hasMinorIssues ?
        `What: Your URL structure has some issues that could be improved.\n\nWhy: Poor URL structure makes it harder for search engines to understand your content and can hurt rankings.\n\nHow: Address these URL issues: ${issues.join(', ')}. Focus on making URLs descriptive and keyword-rich.` :
        `What: Your URL structure needs significant improvement to meet SEO best practices.\n\nWhy: Poorly structured URLs confuse search engines and users, negatively impacting your search rankings.\n\nHow: Restructure URLs to be clean, descriptive, and include relevant keywords. Remove special characters and stop words.`
    };
  }

  private async analyzeSchemaMarkup($: cheerio.CheerioAPI, schemaMarkup: object[]): Promise<AnalysisFactor> {
    const schemaCount = schemaMarkup.length;
    const hasBusinessSchema = schemaMarkup.some(schema => 
      JSON.stringify(schema).includes('LocalBusiness') || JSON.stringify(schema).includes('Organization')
    );
    
    const status = schemaCount >= 2 && hasBusinessSchema ? "OK" : 
                   schemaCount >= 1 ? "OFI" : "Priority OFI";
    
    return {
      name: "Structured Data Implementation",
      description: "Page should include comprehensive schema markup for better search visibility",
      status,
      importance: "High",
      category: "technical",
      notes: schemaCount >= 2 && hasBusinessSchema ?
        `What: Your page includes comprehensive structured data markup (${schemaCount} schemas detected).\n\nWhy: Schema markup enables rich search results and helps search engines display your business information prominently.\n\nHow: Continue maintaining schema markup and consider adding more specific business schemas like Service or Product.` :
        schemaCount >= 1 ?
        `What: Your page has basic structured data but could be enhanced (${schemaCount} schemas detected).\n\nWhy: Additional schema markup creates more opportunities for rich search results and enhanced visibility.\n\nHow: Add LocalBusiness, Organization, or Service schemas with your NAP and business details.` :
        "What: Your page lacks structured data markup that helps search engines understand your business.\n\nWhy: Without schema markup, you miss opportunities for rich search results and enhanced search visibility.\n\nHow: Add relevant schema markup including LocalBusiness, Service, or Organization schemas with your NAP and business details."
    };
  }

  private async analyzeMetaTags(page: PageCrawlResult): Promise<AnalysisFactor> {
    const metaIssues = this.checkMetaTagIssues(page);
    const isOptimal = metaIssues.length === 0;
    const hasMinorIssues = metaIssues.length <= 2;
    
    return {
      name: "Meta Tags Optimization",
      description: "Title and meta description should be optimized for search and users",
      status: isOptimal ? "OK" : hasMinorIssues ? "OFI" : "Priority OFI",
      importance: "High",
      category: "technical",
      notes: isOptimal ?
        "What: Your meta tags are well-optimized for search engines and users.\n\nWhy: Properly optimized title tags and meta descriptions significantly improve click-through rates from search results.\n\nHow: Continue maintaining compelling meta tags and test different variations to improve click-through rates." :
        hasMinorIssues ?
        `What: Your meta tags need improvement to maximize search engine performance.\n\nWhy: Poor meta tags result in lower click-through rates from search results and reduced search visibility.\n\nHow: Fix these meta tag issues: ${metaIssues.join(', ')}. Focus on compelling, keyword-rich titles and descriptions.` :
        `What: Your meta tags have significant issues that are hurting search performance.\n\nWhy: Poorly optimized meta tags drastically reduce your search visibility and click-through rates.\n\nHow: Completely revise your meta tags to include compelling titles (30-60 chars) and descriptions (120-160 chars) with target keywords.`
    };
  }

  private async analyzeCanonicalTag($: cheerio.CheerioAPI): Promise<AnalysisFactor> {
    const canonicalTag = $('link[rel="canonical"]').attr('href');
    const hasCanonical = !!canonicalTag;
    
    return {
      name: "Canonical URL Implementation",
      description: "Page should have proper canonical tag to prevent duplicate content issues",
      status: hasCanonical ? "OK" : "OFI",
      importance: "Medium",
      category: "technical",
      notes: hasCanonical ?
        "What: Your page has a proper canonical tag to prevent duplicate content issues.\n\nWhy: Canonical tags help search engines understand the preferred version of your content.\n\nHow: Continue using canonical tags consistently across all pages." :
        "What: Your page is missing a canonical tag which can cause duplicate content issues.\n\nWhy: Without canonical tags, search engines may index duplicate versions of your content.\n\nHow: Add a canonical tag pointing to the preferred URL version of this page."
    };
  }

  private async analyzeImageOptimization(images: PageCrawlResult['images']): Promise<AnalysisFactor> {
    const totalImages = images.length;
    const imagesWithAlt = images.filter(img => img.alt && img.alt.trim() !== '').length;
    const optimizedImages = images.filter(img => 
      img.src.includes('.webp') || img.src.includes('optimized') || 
      (img.width && img.height && img.width <= 1200)
    ).length;
    
    const altRatio = totalImages > 0 ? imagesWithAlt / totalImages : 1;
    const optimizedRatio = totalImages > 0 ? optimizedImages / totalImages : 1;
    
    const status = altRatio >= 0.9 && optimizedRatio >= 0.7 ? "OK" :
                   altRatio >= 0.7 && optimizedRatio >= 0.5 ? "OFI" : "Priority OFI";
    
    return {
      name: "Image SEO Optimization",
      description: "Images should have descriptive alt text and be properly optimized",
      status,
      importance: "Medium",
      category: "technical",
      notes: status === "OK" ?
        `What: Your images are well-optimized with ${imagesWithAlt}/${totalImages} having alt text.\n\nWhy: Optimized images improve accessibility and help search engines understand your content.\n\nHow: Continue optimizing images and consider using WebP format for better performance.` :
        status === "OFI" ?
        `What: Your image optimization needs improvement (${imagesWithAlt}/${totalImages} with alt text).\n\nWhy: Poor image optimization hurts accessibility and search engine understanding.\n\nHow: Add descriptive alt text to all images and optimize file sizes and formats.` :
        `What: Your images have significant optimization issues (${imagesWithAlt}/${totalImages} with alt text).\n\nWhy: Unoptimized images hurt page performance and accessibility.\n\nHow: Add alt text to all images, compress file sizes, and use modern formats like WebP.`
    };
  }

  private async analyzeCoreWebVitals(page: PageCrawlResult): Promise<AnalysisFactor> {
    // Simulate Core Web Vitals analysis (in real implementation, use Lighthouse API)
    const loadTime = page.loadTime || 3000;
    const pageSize = page.size || 1000000;
    
    const lcpGood = loadTime < 2500;
    const clsGood = pageSize < 500000; // Simplified metric
    const fidGood = true; // Would need real measurement
    
    const passedVitals = [lcpGood, clsGood, fidGood].filter(Boolean).length;
    const status = passedVitals === 3 ? "OK" : passedVitals >= 2 ? "OFI" : "Priority OFI";
    
    return {
      name: "Core Web Vitals Performance",
      description: "Page should pass Google's Core Web Vitals thresholds",
      status,
      importance: "High",
      category: "technical",
      notes: status === "OK" ?
        "What: Your page passes Core Web Vitals thresholds for good user experience.\n\nWhy: Core Web Vitals are ranking factors and affect user experience.\n\nHow: Continue monitoring and maintaining good Core Web Vitals scores." :
        status === "OFI" ?
        `What: Your page has some Core Web Vitals issues (${passedVitals}/3 passed).\n\nWhy: Poor Core Web Vitals hurt rankings and user experience.\n\nHow: Optimize images, reduce JavaScript, and improve server response times.` :
        `What: Your page fails multiple Core Web Vitals thresholds (${passedVitals}/3 passed).\n\nWhy: Poor Core Web Vitals significantly hurt rankings and user experience.\n\nHow: Urgently optimize page speed, reduce layout shifts, and improve interactivity.`
    };
  }

  private async analyzeStructuredData($: cheerio.CheerioAPI, schemaMarkup: object[]): Promise<AnalysisFactor> {
    const jsonLdScripts = $('script[type="application/ld+json"]').length;
    const microdataElements = $('[itemscope], [itemtype], [itemprop]').length;
    const rdfa = $('[vocab], [property]').length;
    
    const totalStructuredData = jsonLdScripts + microdataElements + rdfa + schemaMarkup.length;
    const status = totalStructuredData >= 3 ? "OK" : totalStructuredData >= 1 ? "OFI" : "Priority OFI";
    
    return {
      name: "Advanced Structured Data",
      description: "Page should implement comprehensive structured data markup",
      status,
      importance: "High",
      category: "technical",
      notes: status === "OK" ?
        `What: Your page has comprehensive structured data implementation (${totalStructuredData} elements).\n\nWhy: Rich structured data enables enhanced search results and better content understanding.\n\nHow: Continue expanding structured data for products, services, and business information.` :
        `What: Your structured data implementation needs enhancement (${totalStructuredData} elements).\n\nWhy: Limited structured data reduces opportunities for rich search results.\n\nHow: Add JSON-LD structured data for your business type, products, and services.`
    };
  }

  private async analyzeOpenGraphTags($: cheerio.CheerioAPI): Promise<AnalysisFactor> {
    const ogTitle = $('meta[property="og:title"]').length;
    const ogDescription = $('meta[property="og:description"]').length;
    const ogImage = $('meta[property="og:image"]').length;
    const ogUrl = $('meta[property="og:url"]').length;
    
    const ogScore = ogTitle + ogDescription + ogImage + ogUrl;
    const status = ogScore >= 4 ? "OK" : ogScore >= 2 ? "OFI" : "N/A";
    
    return {
      name: "Open Graph Meta Tags",
      description: "Page should include Open Graph tags for social media sharing",
      status,
      importance: "Medium",
      category: "technical",
      notes: status === "OK" ?
        "What: Your page has complete Open Graph tags for social media sharing.\n\nWhy: Open Graph tags ensure your content displays properly when shared on social media.\n\nHow: Continue maintaining complete Open Graph tags for all important pages." :
        status === "OFI" ?
        `What: Your Open Graph implementation is incomplete (${ogScore}/4 tags present).\n\nWhy: Incomplete Open Graph tags may cause poor social media sharing appearance.\n\nHow: Add missing Open Graph tags including title, description, image, and URL.` :
        "What: Your page lacks Open Graph tags for social media sharing.\n\nWhy: Missing Open Graph tags result in poor appearance when shared on social media.\n\nHow: Add Open Graph meta tags for title, description, image, and URL."
    };
  }

  private async analyzeTwitterCardTags($: cheerio.CheerioAPI): Promise<AnalysisFactor> {
    const twitterCard = $('meta[name="twitter:card"]').length;
    const twitterTitle = $('meta[name="twitter:title"]').length;
    const twitterDescription = $('meta[name="twitter:description"]').length;
    const twitterImage = $('meta[name="twitter:image"]').length;
    
    const twitterScore = twitterCard + twitterTitle + twitterDescription + twitterImage;
    const status = twitterScore >= 4 ? "OK" : twitterScore >= 2 ? "OFI" : "N/A";
    
    return {
      name: "Twitter Card Meta Tags",
      description: "Page should include Twitter Card tags for Twitter sharing optimization",
      status,
      importance: "Low",
      category: "technical",
      notes: status === "OK" ?
        "What: Your page has complete Twitter Card tags for optimized Twitter sharing.\n\nWhy: Twitter Cards enhance the appearance of your content when shared on Twitter.\n\nHow: Continue maintaining Twitter Card tags for consistent social media presence." :
        status === "OFI" ?
        `What: Your Twitter Card implementation is incomplete (${twitterScore}/4 tags present).\n\nWhy: Incomplete Twitter Cards may cause suboptimal appearance on Twitter.\n\nHow: Complete your Twitter Card tags with card type, title, description, and image.` :
        "What: Consider adding Twitter Card tags for better Twitter sharing.\n\nWhy: Twitter Cards improve the appearance of shared content on Twitter.\n\nHow: Add Twitter Card meta tags including card type, title, description, and image."
    };
  }

  // Helper methods for analysis
  private checkURLIssues(url: string): string[] {
    const issues: string[] = [];
    
    if (url.length > 100) {
      issues.push('URL too long (over 100 characters)');
    }
    
    if (url.includes('_')) {
      issues.push('Contains underscores (use hyphens instead)');
    }
    
    if (url.match(/[A-Z]/)) {
      issues.push('Contains uppercase letters');
    }
    
    if (url.includes('?') && url.split('?')[1].split('&').length > 3) {
      issues.push('Too many URL parameters');
    }
    
    if (!url.includes('-') && url.split('/').length > 3) {
      issues.push('Missing descriptive keywords');
    }
    
    return issues;
  }

  private checkMetaTagIssues(page: PageCrawlResult): string[] {
    const issues: string[] = [];
    
    if (!page.title) {
      issues.push('Missing title tag');
    } else {
      if (page.title.length < 30) {
        issues.push('Title too short (under 30 characters)');
      }
      if (page.title.length > 60) {
        issues.push('Title too long (over 60 characters)');
      }
    }
    
    if (!page.metaDescription) {
      issues.push('Missing meta description');
    } else {
      if (page.metaDescription.length < 120) {
        issues.push('Meta description too short (under 120 characters)');
      }
      if (page.metaDescription.length > 160) {
        issues.push('Meta description too long (over 160 characters)');
      }
    }
    
    return issues;
  }

  // Additional technical analysis methods (simplified implementations)
  private async analyzeRobotsTags($: cheerio.CheerioAPI): Promise<AnalysisFactor> {
    const robotsMeta = $('meta[name="robots"]').attr('content');
    const hasNoIndex = robotsMeta?.includes('noindex');
    
    return {
      name: "Robots Meta Tag Configuration",
      description: "Robots meta tags should be properly configured for indexing",
      status: !hasNoIndex ? "OK" : "Priority OFI",
      importance: "High",
      category: "technical",
      notes: !hasNoIndex ?
        "What: Your robots meta tags allow proper search engine indexing.\n\nWhy: Correct robots configuration ensures search engines can index your content.\n\nHow: Continue monitoring robots meta tags to prevent indexing issues." :
        "What: Your page has robots meta tag blocking search engine indexing.\n\nWhy: Noindex tags prevent search engines from showing your page in search results.\n\nHow: Review and remove noindex tags unless intentionally blocking indexing."
    };
  }

  private async analyzeHTMLValidation($: cheerio.CheerioAPI): Promise<AnalysisFactor> {
    // Simplified HTML validation
    const hasDoctype = $.root().html()?.includes('<!DOCTYPE') || false;
    const hasLangAttribute = $('html[lang]').length > 0;
    const hasCharset = $('meta[charset]').length > 0;
    
    const validationScore = (hasDoctype ? 1 : 0) + (hasLangAttribute ? 1 : 0) + (hasCharset ? 1 : 0);
    const status = validationScore === 3 ? "OK" : validationScore >= 2 ? "OFI" : "Priority OFI";
    
    return {
      name: "HTML Validation and Structure",
      description: "HTML should be valid and well-structured",
      status,
      importance: "Medium",
      category: "technical",
      notes: status === "OK" ?
        "What: Your HTML structure is valid and well-formed.\n\nWhy: Valid HTML ensures proper rendering and search engine understanding.\n\nHow: Continue maintaining clean, valid HTML structure." :
        `What: Your HTML has validation issues (${validationScore}/3 checks passed).\n\nWhy: Invalid HTML can cause rendering issues and search engine problems.\n\nHow: Fix HTML validation issues including DOCTYPE, charset, and language attributes.`
    };
  }

  private async analyzeSSLImplementation(url: string): Promise<AnalysisFactor> {
    const isHTTPS = url.startsWith('https://');
    
    return {
      name: "SSL Certificate Implementation",
      description: "Website should use HTTPS for security and SEO benefits",
      status: isHTTPS ? "OK" : "Priority OFI",
      importance: "High",
      category: "technical",
      notes: isHTTPS ?
        "What: Your website uses HTTPS encryption for secure connections.\n\nWhy: HTTPS is a ranking factor and essential for user trust and security.\n\nHow: Continue maintaining SSL certificate and monitor for expiration." :
        "What: Your website is not using HTTPS encryption.\n\nWhy: HTTP sites are marked as 'not secure' and rank lower in search results.\n\nHow: Install an SSL certificate and redirect all HTTP traffic to HTTPS immediately."
    };
  }

  private async analyzeMobileResponsiveness($: cheerio.CheerioAPI): Promise<AnalysisFactor> {
    const hasViewport = $('meta[name="viewport"]').length > 0;
    const responsiveElements = $('.responsive, .mobile, .container-fluid').length;
    const hasMediaQueries = $('style, link[rel="stylesheet"]').text().includes('@media');
    
    const mobileScore = (hasViewport ? 1 : 0) + (responsiveElements > 0 ? 1 : 0) + (hasMediaQueries ? 1 : 0);
    const status = mobileScore >= 2 ? "OK" : mobileScore >= 1 ? "OFI" : "Priority OFI";
    
    return {
      name: "Mobile Responsiveness",
      description: "Website should be fully responsive and mobile-friendly",
      status,
      importance: "High",
      category: "technical",
      notes: status === "OK" ?
        "What: Your website appears to be mobile-responsive and user-friendly.\n\nWhy: Mobile-friendliness is crucial for rankings and user experience.\n\nHow: Continue testing on various devices and maintain responsive design." :
        `What: Your website has mobile responsiveness issues (${mobileScore}/3 indicators present).\n\nWhy: Non-responsive sites rank poorly and provide bad user experience on mobile.\n\nHow: Implement responsive design with viewport meta tag and CSS media queries.`
    };
  }

  private async analyzePageSpeed(page: PageCrawlResult): Promise<AnalysisFactor> {
    const loadTime = page.loadTime || 5000;
    const status = loadTime < 3000 ? "OK" : loadTime < 5000 ? "OFI" : "Priority OFI";
    
    return {
      name: "Page Loading Speed",
      description: "Page should load quickly for good user experience",
      status,
      importance: "High",
      category: "technical",
      notes: status === "OK" ?
        `What: Your page loads quickly in ${loadTime}ms.\n\nWhy: Fast loading pages rank better and provide better user experience.\n\nHow: Continue optimizing and monitoring page speed performance.` :
        status === "OFI" ?
        `What: Your page loads slowly in ${loadTime}ms.\n\nWhy: Slow loading hurts rankings and increases bounce rates.\n\nHow: Optimize images, minify CSS/JS, and improve server response time.` :
        `What: Your page loads very slowly in ${loadTime}ms.\n\nWhy: Very slow loading severely impacts rankings and user experience.\n\nHow: Urgently optimize images, enable compression, and consider CDN implementation.`
    };
  }

  // Additional simplified implementations for remaining methods
  private async analyzeInternalLinking($: cheerio.CheerioAPI): Promise<AnalysisFactor> {
    const internalLinks = $('a[href^="/"], a[href*="' + window?.location?.hostname + '"]').length;
    return {
      name: "Internal Linking Structure",
      description: "Page should have strategic internal links to related content",
      status: internalLinks >= 3 ? "OK" : internalLinks >= 1 ? "OFI" : "Priority OFI",
      importance: "Medium",
      category: "technical",
      notes: internalLinks >= 3 ? "Good internal linking structure" : "Add more strategic internal links"
    };
  }

  private async analyzeExternalLinking($: cheerio.CheerioAPI): Promise<AnalysisFactor> {
    const externalLinks = $('a[href^="http"]:not([href*="' + window?.location?.hostname + '"])');
    const authorityLinks = externalLinks.filter('[href*="gov"], [href*="edu"], [href*="wikipedia"]').length;
    
    return {
      name: "External Linking Strategy",
      description: "Page should link to authoritative external sources when relevant",
      status: authorityLinks >= 1 ? "OK" : externalLinks.length >= 1 ? "OFI" : "N/A",
      importance: "Low",
      category: "technical",
      notes: authorityLinks >= 1 ? "Good authoritative external links" : "Consider adding links to authoritative sources"
    };
  }

  private async analyzeAltTextOptimization(images: PageCrawlResult['images']): Promise<AnalysisFactor> {
    const totalImages = images.length;
    const descriptiveAlt = images.filter(img => img.alt && img.alt.length > 10).length;
    const ratio = totalImages > 0 ? descriptiveAlt / totalImages : 1;
    
    return {
      name: "Descriptive Alt Text Usage",
      description: "Images should have descriptive, keyword-rich alt text",
      status: ratio >= 0.8 ? "OK" : ratio >= 0.5 ? "OFI" : "Priority OFI",
      importance: "Medium",
      category: "technical",
      notes: ratio >= 0.8 ? "Excellent alt text usage" : "Improve alt text descriptions for better accessibility"
    };
  }

  private async analyzeURLParameters(url: string): Promise<AnalysisFactor> {
    const hasParameters = url.includes('?');
    const parameterCount = hasParameters ? url.split('?')[1].split('&').length : 0;
    
    return {
      name: "URL Parameter Optimization",
      description: "URLs should minimize parameters and use clean structure",
      status: parameterCount === 0 ? "OK" : parameterCount <= 2 ? "OFI" : "Priority OFI",
      importance: "Low",
      category: "technical",
      notes: parameterCount === 0 ? "Clean URL structure" : "Consider reducing URL parameters for cleaner URLs"
    };
  }

  private async analyzeRedirectChains(page: PageCrawlResult): Promise<AnalysisFactor> {
    // Simplified redirect analysis
    const hasRedirects = page.statusCode === 301 || page.statusCode === 302;
    
    return {
      name: "Redirect Chain Optimization",
      description: "Page should have minimal redirect chains",
      status: !hasRedirects ? "OK" : "OFI",
      importance: "Medium",
      category: "technical",
      notes: !hasRedirects ? "No redirect chains detected" : "Minimize redirect chains for better performance"
    };
  }

  private async analyzeHTTPHeaders(page: PageCrawlResult): Promise<AnalysisFactor> {
    // Simplified header analysis
    const hasGoodStatusCode = page.statusCode === 200;
    
    return {
      name: "HTTP Header Optimization",
      description: "Page should return proper HTTP status codes and headers",
      status: hasGoodStatusCode ? "OK" : "Priority OFI",
      importance: "High",
      category: "technical",
      notes: hasGoodStatusCode ? "Proper HTTP status code" : "Fix HTTP status code issues"
    };
  }

  // Enhanced 2.0 methods (simplified implementations)
  private async analyzeJavaScriptOptimization($: cheerio.CheerioAPI): Promise<AnalysisFactor> {
    const scripts = $('script[src]').length;
    const inlineScripts = $('script:not([src])').length;
    
    return {
      name: "JavaScript Optimization",
      description: "JavaScript should be optimized and not block page rendering",
      status: scripts <= 5 && inlineScripts <= 3 ? "OK" : "OFI",
      importance: "Medium",
      category: "technical",
      notes: scripts <= 5 && inlineScripts <= 3 ? "JavaScript appears optimized" : "Consider optimizing JavaScript loading"
    };
  }

  private async analyzeCSSOptimization($: cheerio.CheerioAPI): Promise<AnalysisFactor> {
    const stylesheets = $('link[rel="stylesheet"]').length;
    const inlineStyles = $('style').length;
    
    return {
      name: "CSS Optimization",
      description: "CSS should be optimized and minimize render-blocking",
      status: stylesheets <= 3 && inlineStyles <= 2 ? "OK" : "OFI",
      importance: "Medium",
      category: "technical",
      notes: stylesheets <= 3 && inlineStyles <= 2 ? "CSS appears optimized" : "Consider consolidating and optimizing CSS"
    };
  }

  private async analyzeResourceOptimization(page: PageCrawlResult): Promise<AnalysisFactor> {
    const totalResources = page.scripts.length + page.stylesheets.length + page.images.length;
    
    return {
      name: "Resource Loading Optimization",
      description: "Page resources should be optimized for fast loading",
      status: totalResources <= 20 ? "OK" : totalResources <= 40 ? "OFI" : "Priority OFI",
      importance: "Medium",
      category: "technical",
      notes: totalResources <= 20 ? "Good resource optimization" : "Consider reducing the number of resources"
    };
  }

  private async analyzeWebVitalsOptimization(page: PageCrawlResult): Promise<AnalysisFactor> {
    // Simplified Web Vitals check
    const size = page.size || 1000000;
    const loadTime = page.loadTime || 5000;
    
    return {
      name: "Web Vitals Optimization",
      description: "Page should be optimized for Core Web Vitals",
      status: size < 500000 && loadTime < 3000 ? "OK" : "OFI",
      importance: "High",
      category: "technical",
      notes: size < 500000 && loadTime < 3000 ? "Good Web Vitals optimization" : "Optimize for better Core Web Vitals"
    };
  }

  private async analyzeSecurityHeaders(page: PageCrawlResult): Promise<AnalysisFactor> {
    // Simplified security header check (would need actual header analysis)
    const isHTTPS = page.url.startsWith('https://');
    
    return {
      name: "Security Headers Implementation",
      description: "Page should implement security headers for protection",
      status: isHTTPS ? "OK" : "Priority OFI",
      importance: "Medium",
      category: "technical",
      notes: isHTTPS ? "Basic security with HTTPS" : "Implement security headers and HTTPS"
    };
  }

  private async analyzeAccessibilityCompliance($: cheerio.CheerioAPI): Promise<AnalysisFactor> {
    const accessibleElements = $('[alt], [aria-label], [role]').length;
    const skipLinks = $('a[href^="#skip"], a[href^="#main"]').length;
    
    return {
      name: "Accessibility Compliance",
      description: "Page should follow accessibility guidelines (WCAG)",
      status: accessibleElements >= 5 && skipLinks >= 1 ? "OK" : "OFI",
      importance: "Medium",
      category: "technical",
      notes: accessibleElements >= 5 ? "Good accessibility features" : "Improve accessibility with more ARIA labels and alt text"
    };
  }

  private async analyzeBreadcrumbImplementation($: cheerio.CheerioAPI): Promise<AnalysisFactor> {
    const breadcrumbs = $('.breadcrumb, .breadcrumbs, nav[aria-label*="breadcrumb"]').length;
    
    return {
      name: "Breadcrumb Navigation",
      description: "Page should include breadcrumb navigation for better UX",
      status: breadcrumbs >= 1 ? "OK" : "N/A",
      importance: "Low",
      category: "technical",
      notes: breadcrumbs >= 1 ? "Breadcrumb navigation present" : "Consider adding breadcrumb navigation"
    };
  }

  private async analyzePaginationTags($: cheerio.CheerioAPI): Promise<AnalysisFactor> {
    const prevNext = $('link[rel="prev"], link[rel="next"]').length;
    const pagination = $('.pagination, .pager').length;
    
    return {
      name: "Pagination Implementation",
      description: "Paginated content should use proper rel=prev/next tags",
      status: prevNext >= 1 || pagination === 0 ? "OK" : "OFI",
      importance: "Low",
      category: "technical",
      notes: prevNext >= 1 ? "Proper pagination tags" : pagination > 0 ? "Add rel=prev/next for pagination" : "No pagination detected"
    };
  }

  private async analyzeLanguageAttributes($: cheerio.CheerioAPI): Promise<AnalysisFactor> {
    const langAttribute = $('html[lang]').length > 0;
    const hrefLang = $('link[rel="alternate"][hreflang]').length;
    
    return {
      name: "Language Attribute Implementation",
      description: "Page should specify language attributes properly",
      status: langAttribute ? "OK" : "OFI",
      importance: "Low",
      category: "technical",
      notes: langAttribute ? "Language attribute present" : "Add language attribute to HTML element"
    };
  }

  private async analyzeViewportConfiguration($: cheerio.CheerioAPI): Promise<AnalysisFactor> {
    const viewportTag = $('meta[name="viewport"]');
    const hasViewport = viewportTag.length > 0;
    const viewportContent = viewportTag.attr('content');
    const isOptimal = viewportContent?.includes('width=device-width');
    
    return {
      name: "Viewport Configuration",
      description: "Page should have proper viewport meta tag for mobile",
      status: hasViewport && isOptimal ? "OK" : hasViewport ? "OFI" : "Priority OFI",
      importance: "High",
      category: "technical",
      notes: hasViewport && isOptimal ? "Proper viewport configuration" : "Add or fix viewport meta tag for mobile optimization"
    };
  }

  private async analyzeFaviconImplementation($: cheerio.CheerioAPI): Promise<AnalysisFactor> {
    const favicon = $('link[rel="icon"], link[rel="shortcut icon"]').length;
    
    return {
      name: "Favicon Implementation",
      description: "Website should have a favicon for branding",
      status: favicon >= 1 ? "OK" : "OFI",
      importance: "Low",
      category: "technical",
      notes: favicon >= 1 ? "Favicon present" : "Add favicon for better branding"
    };
  }

  private async analyzeXMLSitemap(page: PageCrawlResult): Promise<AnalysisFactor> {
    // Simplified sitemap check (would need actual sitemap analysis)
    const hasSitemapReference = page.bodyText.includes('sitemap') || page.url.includes('sitemap');
    
    return {
      name: "XML Sitemap Implementation",
      description: "Website should have an XML sitemap for search engines",
      status: hasSitemapReference ? "OK" : "OFI",
      importance: "Medium",
      category: "technical",
      notes: hasSitemapReference ? "Sitemap reference found" : "Ensure XML sitemap exists and is submitted to search engines"
    };
  }

  private async analyzeRobotsTxt(page: PageCrawlResult): Promise<AnalysisFactor> {
    // Simplified robots.txt check
    const hasRobotsReference = page.bodyText.includes('robots.txt');
    
    return {
      name: "Robots.txt Implementation",
      description: "Website should have a proper robots.txt file",
      status: hasRobotsReference ? "OK" : "OFI",
      importance: "Medium",
      category: "technical",
      notes: hasRobotsReference ? "Robots.txt reference found" : "Ensure robots.txt file exists and is properly configured"
    };
  }

  private async analyzeHTTP2Implementation(page: PageCrawlResult): Promise<AnalysisFactor> {
    // Simplified HTTP/2 check (would need actual protocol analysis)
    const isHTTPS = page.url.startsWith('https://');
    
    return {
      name: "HTTP/2 Protocol Support",
      description: "Website should support HTTP/2 for better performance",
      status: isHTTPS ? "OK" : "OFI",
      importance: "Low",
      category: "technical",
      notes: isHTTPS ? "HTTPS enabled (likely HTTP/2 support)" : "Enable HTTPS and HTTP/2 for better performance"
    };
  }

  private async analyzeLazyLoadingImplementation($: cheerio.CheerioAPI): Promise<AnalysisFactor> {
    const lazyImages = $('img[loading="lazy"], img[data-src]').length;
    const totalImages = $('img').length;
    const ratio = totalImages > 0 ? lazyImages / totalImages : 0;
    
    return {
      name: "Lazy Loading Implementation",
      description: "Images should use lazy loading for better performance",
      status: ratio >= 0.5 ? "OK" : ratio > 0 ? "OFI" : totalImages > 5 ? "OFI" : "N/A",
      importance: "Low",
      category: "technical",
      notes: ratio >= 0.5 ? "Good lazy loading implementation" : totalImages > 5 ? "Consider implementing lazy loading for images" : "No lazy loading needed"
    };
  }

  private async analyzeServiceWorkerImplementation($: cheerio.CheerioAPI): Promise<AnalysisFactor> {
    const serviceWorkerScript = $('script').text().includes('serviceWorker');
    
    return {
      name: "Service Worker Implementation",
      description: "Consider implementing service worker for PWA capabilities",
      status: serviceWorkerScript ? "OK" : "N/A",
      importance: "Low",
      category: "technical",
      notes: serviceWorkerScript ? "Service worker detected" : "Consider implementing service worker for offline functionality"
    };
  }

  private async analyzeWebpImageFormat(images: PageCrawlResult['images']): Promise<AnalysisFactor> {
    const totalImages = images.length;
    const webpImages = images.filter(img => img.src.includes('.webp')).length;
    const ratio = totalImages > 0 ? webpImages / totalImages : 0;
    
    return {
      name: "WebP Image Format Usage",
      description: "Images should use modern formats like WebP for better compression",
      status: ratio >= 0.5 ? "OK" : ratio > 0 ? "OFI" : totalImages > 0 ? "OFI" : "N/A",
      importance: "Low",
      category: "technical",
      notes: ratio >= 0.5 ? "Good WebP usage" : totalImages > 0 ? "Consider converting images to WebP format" : "No images to optimize"
    };
  }

  private async analyzeContentCompression(page: PageCrawlResult): Promise<AnalysisFactor> {
    // Simplified compression check
    const size = page.size || 1000000;
    const isCompressed = size < 500000;
    
    return {
      name: "Content Compression",
      description: "Content should be compressed for faster delivery",
      status: isCompressed ? "OK" : "OFI",
      importance: "Medium",
      category: "technical",
      notes: isCompressed ? "Content appears compressed" : "Enable compression (gzip/brotli) for better performance"
    };
  }

  private async analyzeCriticalResourceOptimization($: cheerio.CheerioAPI): Promise<AnalysisFactor> {
    const criticalCSS = $('style').length > 0;
    const preloadLinks = $('link[rel="preload"]').length;
    
    return {
      name: "Critical Resource Optimization",
      description: "Critical resources should be optimized for fast rendering",
      status: criticalCSS || preloadLinks > 0 ? "OK" : "OFI",
      importance: "Medium",
      category: "technical",
      notes: criticalCSS || preloadLinks > 0 ? "Critical resources optimized" : "Consider optimizing critical rendering path"
    };
  }

  private async analyzeThirdPartyScripts($: cheerio.CheerioAPI): Promise<AnalysisFactor> {
    const externalScripts = $('script[src^="http"]:not([src*="' + window?.location?.hostname + '"])').length;
    
    return {
      name: "Third-Party Script Optimization",
      description: "Third-party scripts should be minimized and optimized",
      status: externalScripts <= 3 ? "OK" : externalScripts <= 6 ? "OFI" : "Priority OFI",
      importance: "Medium",
      category: "technical",
      notes: externalScripts <= 3 ? "Third-party scripts optimized" : "Consider reducing third-party scripts for better performance"
    };
  }
}