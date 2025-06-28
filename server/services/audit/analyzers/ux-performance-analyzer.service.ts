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
 * UX & Performance Analyzer - Rival Outranker 2.0
 * Handles 30+ user experience and performance factors
 */
export class UXPerformanceAnalyzer {
  
  async analyze(page: PageCrawlResult, $: cheerio.CheerioAPI): Promise<AnalysisFactor[]> {
    console.log(`[UXPerformanceAnalyzer] Starting UX and performance analysis for: ${page.url}`);
    const factors: AnalysisFactor[] = [];
    
    // Phase 4: UX & Performance Analysis (30+ factors)
    
    // Core Performance Factors
    factors.push(await this.analyzePageLoadSpeed(page));
    factors.push(await this.analyzePageSize(page));
    factors.push(await this.analyzeImageOptimization(page.images));
    factors.push(await this.analyzeResourceCompression(page));
    factors.push(await this.analyzeCriticalRenderingPath($));
    factors.push(await this.analyzeCacheOptimization(page));
    factors.push(await this.analyzeCDNUsage(page));
    factors.push(await this.analyzeMinificationOptimization($));
    
    // Core Web Vitals
    factors.push(await this.analyzeLargestContentfulPaint(page));
    factors.push(await this.analyzeFirstInputDelay(page));
    factors.push(await this.analyzeCumulativeLayoutShift($, page));
    factors.push(await this.analyzeInteractionToNextPaint(page));
    
    // Mobile UX Factors
    factors.push(await this.analyzeMobileResponsiveness($));
    factors.push(await this.analyzeTouchTargetSizing($));
    factors.push(await this.analyzeViewportConfiguration($));
    factors.push(await this.analyzeMobileNavigation($));
    factors.push(await this.analyzeMobilePageSpeed(page));
    
    // User Experience Factors
    factors.push(await this.analyzeNavigationUsability($));
    factors.push(await this.analyzeContentReadability($, page.bodyText));
    factors.push(await this.analyzeVisualHierarchy($));
    factors.push(await this.analyzeCallToActionVisibility($));
    factors.push(await this.analyzeFormUsability($));
    factors.push(await this.analyzeSearchFunctionality($));
    factors.push(await this.analyzeBreadcrumbNavigation($));
    factors.push(await this.analyzeSiteSearchUsability($));
    
    // Accessibility Factors
    factors.push(await this.analyzeColorContrast($));
    factors.push(await this.analyzeKeyboardNavigation($));
    factors.push(await this.analyzeScreenReaderCompatibility($));
    factors.push(await this.analyzeImageAltText(page.images));
    factors.push(await this.analyzeFocusIndicators($));
    factors.push(await this.analyzeSemanticHTML($));

    console.log(`[UXPerformanceAnalyzer] Completed analysis with ${factors.length} UX/performance factors`);
    return factors;
  }

  // Performance Analysis Methods
  private async analyzePageLoadSpeed(page: PageCrawlResult): Promise<AnalysisFactor> {
    const loadTime = page.loadTime || 5000; // Default 5 seconds if not measured
    const status = loadTime < 3000 ? "OK" : loadTime < 5000 ? "OFI" : "Priority OFI";
    
    return {
      name: "Page Load Speed Optimization",
      description: "Page should load in under 3 seconds for optimal user experience",
      status,
      importance: "High",
      category: "ux",
      notes: status === "OK" ?
        `What: Your page loads quickly in ${(loadTime/1000).toFixed(1)} seconds.\n\nWhy: Fast loading pages improve user experience and search rankings.\n\nHow: Continue monitoring and optimizing page speed performance.` :
        status === "OFI" ?
        `What: Your page loads in ${(loadTime/1000).toFixed(1)} seconds, which could be faster.\n\nWhy: Page speed affects user experience and search rankings.\n\nHow: Optimize images, minify CSS/JS, and improve server response time.` :
        `What: Your page loads slowly in ${(loadTime/1000).toFixed(1)} seconds.\n\nWhy: Slow loading severely impacts user experience and rankings.\n\nHow: Urgently optimize images, enable compression, implement CDN, and reduce server response time.`
    };
  }

  private async analyzePageSize(page: PageCrawlResult): Promise<AnalysisFactor> {
    const size = page.size || 1000000; // Default 1MB if not measured
    const sizeInMB = size / (1024 * 1024);
    const status = sizeInMB < 1 ? "OK" : sizeInMB < 3 ? "OFI" : "Priority OFI";
    
    return {
      name: "Page Size Optimization",
      description: "Page size should be under 1MB for fast loading",
      status,
      importance: "Medium",
      category: "ux",
      notes: status === "OK" ?
        `What: Your page size is optimized at ${sizeInMB.toFixed(1)}MB.\n\nWhy: Smaller pages load faster and use less bandwidth.\n\nHow: Continue optimizing images and resources for minimal page size.` :
        status === "OFI" ?
        `What: Your page size is ${sizeInMB.toFixed(1)}MB, which could be smaller.\n\nWhy: Large pages load slowly and consume more bandwidth.\n\nHow: Compress images, minify code, and remove unnecessary resources.` :
        `What: Your page size is large at ${sizeInMB.toFixed(1)}MB.\n\nWhy: Large pages significantly slow loading and hurt user experience.\n\nHow: Urgently compress all images, minify CSS/JS, and remove unnecessary elements.`
    };
  }

  private async analyzeImageOptimization(images: PageCrawlResult['images']): Promise<AnalysisFactor> {
    const totalImages = images.length;
    if (totalImages === 0) {
      return {
        name: "Image Performance Optimization",
        description: "Images should be optimized for web performance",
        status: "N/A",
        importance: "Medium",
      category: "ux",
        notes: "No images found on this page."
      };
    }

    const optimizedImages = images.filter(img => 
      img.src.includes('.webp') || 
      img.src.includes('optimized') ||
      (img.width && img.height && img.width <= 1200)
    ).length;
    
    const optimizedRatio = optimizedImages / totalImages;
    const status = optimizedRatio >= 0.8 ? "OK" : optimizedRatio >= 0.5 ? "OFI" : "Priority OFI";
    
    return {
      name: "Image Performance Optimization",
      description: "Images should be compressed and in modern formats",
      status,
      importance: "Medium",
      category: "ux",
      notes: status === "OK" ?
        `What: Your images are well-optimized (${optimizedImages}/${totalImages} optimized).\n\nWhy: Optimized images load faster and improve page performance.\n\nHow: Continue using compressed images and modern formats like WebP.` :
        status === "OFI" ?
        `What: Some images need optimization (${optimizedImages}/${totalImages} optimized).\n\nWhy: Unoptimized images slow page loading and hurt user experience.\n\nHow: Compress images, use appropriate sizes, and consider WebP format.` :
        `What: Many images need optimization (${optimizedImages}/${totalImages} optimized).\n\nWhy: Large, unoptimized images severely impact page performance.\n\nHow: Compress all images, resize to appropriate dimensions, and use modern formats.`
    };
  }

  private async analyzeResourceCompression(page: PageCrawlResult): Promise<AnalysisFactor> {
    // Simplified compression analysis based on page size
    const size = page.size || 1000000;
    const isCompressed = size < 500000; // Assume compression if under 500KB
    
    return {
      name: "Resource Compression",
      description: "Text resources should be compressed with gzip or brotli",
      status: isCompressed ? "OK" : "OFI",
      importance: "Medium",
      category: "ux",
      notes: isCompressed ?
        "What: Your resources appear to be compressed effectively.\n\nWhy: Compression reduces transfer size and improves loading speed.\n\nHow: Continue using compression and monitor resource sizes." :
        "What: Your resources may not be properly compressed.\n\nWhy: Uncompressed resources increase loading time and bandwidth usage.\n\nHow: Enable gzip or brotli compression on your server for better performance."
    };
  }

  private async analyzeCriticalRenderingPath($: cheerio.CheerioAPI): Promise<AnalysisFactor> {
    const blockingScripts = $('script:not([async]):not([defer])').length;
    const inlineCSS = $('style').length;
    const isOptimized = blockingScripts <= 2 && inlineCSS >= 1;
    
    return {
      name: "Critical Rendering Path Optimization",
      description: "Critical rendering path should be optimized for fast visual rendering",
      status: isOptimized ? "OK" : "OFI",
      importance: "Medium",
      category: "ux",
      notes: isOptimized ?
        "What: Your critical rendering path appears optimized.\n\nWhy: Optimized rendering path reduces time to first paint.\n\nHow: Continue minimizing render-blocking resources." :
        `What: Your critical rendering path needs optimization (${blockingScripts} blocking scripts).\n\nWhy: Render-blocking resources delay page visualization.\n\nHow: Add async/defer attributes to scripts and inline critical CSS.`
    };
  }

  // Core Web Vitals Analysis
  private async analyzeLargestContentfulPaint(page: PageCrawlResult): Promise<AnalysisFactor> {
    // Estimate LCP based on page size and load time
    const loadTime = page.loadTime || 5000;
    const estimatedLCP = loadTime * 0.7; // Rough estimation
    const status = estimatedLCP < 2500 ? "OK" : estimatedLCP < 4000 ? "OFI" : "Priority OFI";
    
    return {
      name: "Largest Contentful Paint (LCP)",
      description: "LCP should occur within 2.5 seconds for good user experience",
      status,
      importance: "High",
      category: "ux",
      notes: status === "OK" ?
        "What: Your LCP appears to be within the good range.\n\nWhy: Good LCP indicates fast loading of main content.\n\nHow: Continue optimizing largest content elements and server response." :
        status === "OFI" ?
        "What: Your LCP may need improvement.\n\nWhy: Slow LCP hurts user experience and Core Web Vitals score.\n\nHow: Optimize images, improve server response time, and preload key resources." :
        "What: Your LCP needs significant improvement.\n\nWhy: Poor LCP severely impacts user experience and search rankings.\n\nHow: Urgently optimize largest content elements, server response, and resource loading."
    };
  }

  private async analyzeFirstInputDelay(page: PageCrawlResult): Promise<AnalysisFactor> {
    // Estimate FID based on JavaScript usage
    const scriptCount = page.scripts.length;
    const estimatedFID = scriptCount * 20; // Rough estimation in ms
    const status = estimatedFID < 100 ? "OK" : estimatedFID < 300 ? "OFI" : "Priority OFI";
    
    return {
      name: "First Input Delay (FID)",
      description: "FID should be less than 100ms for responsive interaction",
      status,
      importance: "High",
      category: "ux",
      notes: status === "OK" ?
        "What: Your page appears responsive to user interactions.\n\nWhy: Low FID ensures users can interact with your page quickly.\n\nHow: Continue optimizing JavaScript execution and main thread work." :
        status === "OFI" ?
        `What: Your page may have some interaction delays (estimated ${estimatedFID}ms).\n\nWhy: High FID frustrates users and hurts Core Web Vitals.\n\nHow: Optimize JavaScript, split long tasks, and use web workers.` :
        `What: Your page may have significant interaction delays (estimated ${estimatedFID}ms).\n\nWhy: Poor FID severely impacts user experience.\n\nHow: Urgently optimize JavaScript execution and reduce main thread blocking.`
    };
  }

  private async analyzeCumulativeLayoutShift($: cheerio.CheerioAPI, page: PageCrawlResult): Promise<AnalysisFactor> {
    // Estimate CLS based on common layout shift causes
    const imagesWithoutDimensions = $('img:not([width]):not([height])').length;
    const dynamicContent = $('.loading, .lazy, [data-src]').length;
    const estimatedCLS = (imagesWithoutDimensions * 0.1) + (dynamicContent * 0.05);
    const status = estimatedCLS < 0.1 ? "OK" : estimatedCLS < 0.25 ? "OFI" : "Priority OFI";
    
    return {
      name: "Cumulative Layout Shift (CLS)",
      description: "CLS should be less than 0.1 to avoid unexpected layout shifts",
      status,
      importance: "High",
      category: "ux",
      notes: status === "OK" ?
        "What: Your page layout appears stable with minimal shifting.\n\nWhy: Low CLS provides a stable visual experience for users.\n\nHow: Continue setting dimensions for images and reserving space for dynamic content." :
        status === "OFI" ?
        `What: Your page may experience some layout shifts (${imagesWithoutDimensions} images without dimensions).\n\nWhy: Layout shifts disrupt user experience and hurt Core Web Vitals.\n\nHow: Set explicit dimensions for images and reserve space for dynamic content.` :
        `What: Your page may experience significant layout shifts.\n\nWhy: Poor CLS seriously disrupts user experience.\n\nHow: Urgently set image dimensions, reserve space for ads/embeds, and avoid inserting content above existing content.`
    };
  }

  private async analyzeInteractionToNextPaint(page: PageCrawlResult): Promise<AnalysisFactor> {
    // Estimate INP based on JavaScript complexity
    const scriptCount = page.scripts.length;
    const estimatedINP = scriptCount * 15; // Rough estimation
    const status = estimatedINP < 200 ? "OK" : estimatedINP < 500 ? "OFI" : "Priority OFI";
    
    return {
      name: "Interaction to Next Paint (INP)",
      description: "INP should be less than 200ms for responsive interactions",
      status,
      importance: "Medium",
      category: "ux",
      notes: status === "OK" ?
        "What: Your page interactions appear responsive.\n\nWhy: Good INP ensures smooth user interactions throughout the session.\n\nHow: Continue optimizing event handlers and rendering performance." :
        `What: Your page interactions may be slow (estimated ${estimatedINP}ms).\n\nWhy: Poor INP makes the page feel unresponsive to user actions.\n\nHow: Optimize event handlers, reduce rendering work, and improve JavaScript performance.`
    };
  }

  // Mobile UX Analysis
  private async analyzeMobileResponsiveness($: cheerio.CheerioAPI): Promise<AnalysisFactor> {
    const hasViewport = $('meta[name="viewport"]').length > 0;
    const viewportContent = $('meta[name="viewport"]').attr('content');
    const isResponsive = hasViewport && viewportContent?.includes('width=device-width');
    const hasMediaQueries = $('style, link[rel="stylesheet"]').text().includes('@media');
    
    const mobileScore = (isResponsive ? 2 : 0) + (hasMediaQueries ? 1 : 0);
    const status = mobileScore >= 2 ? "OK" : mobileScore >= 1 ? "OFI" : "Priority OFI";
    
    return {
      name: "Mobile Responsiveness",
      description: "Website should be fully responsive and mobile-optimized",
      status,
      importance: "High",
      category: "ux",
      notes: status === "OK" ?
        "What: Your website appears fully responsive and mobile-optimized.\n\nWhy: Mobile responsiveness is crucial for user experience and search rankings.\n\nHow: Continue testing on various devices and maintain responsive design." :
        status === "OFI" ?
        `What: Your website has some mobile responsiveness (${mobileScore}/3 indicators).\n\nWhy: Poor mobile experience hurts user engagement and search rankings.\n\nHow: Improve viewport configuration and add responsive CSS media queries.` :
        `What: Your website lacks mobile responsiveness (${mobileScore}/3 indicators).\n\nWhy: Non-responsive sites provide poor mobile experience and rank lower.\n\nHow: Implement responsive design with proper viewport meta tag and CSS media queries.`
    };
  }

  private async analyzeTouchTargetSizing($: cheerio.CheerioAPI): Promise<AnalysisFactor> {
    const touchTargets = $('button, a, input[type="submit"], input[type="button"], .button').length;
    const smallTargets = $('button, a').filter(function() {
      const text = $(this).text();
      return text.length < 3; // Likely small targets
    }).length;
    
    const ratio = touchTargets > 0 ? (touchTargets - smallTargets) / touchTargets : 1;
    const status = ratio >= 0.8 ? "OK" : ratio >= 0.6 ? "OFI" : "Priority OFI";
    
    return {
      name: "Touch Target Sizing",
      description: "Touch targets should be at least 44x44 pixels for mobile usability",
      status,
      importance: "Medium",
      category: "ux",
      notes: status === "OK" ?
        "What: Your touch targets appear appropriately sized for mobile interaction.\n\nWhy: Properly sized touch targets improve mobile usability and accessibility.\n\nHow: Continue ensuring all clickable elements are at least 44x44 pixels." :
        `What: Some touch targets may be too small for mobile use (${Math.round(ratio * 100)}% appropriate size).\n\nWhy: Small touch targets frustrate mobile users and hurt accessibility.\n\nHow: Increase padding and size of buttons, links, and interactive elements.`
    };
  }

  private async analyzeViewportConfiguration($: cheerio.CheerioAPI): Promise<AnalysisFactor> {
    const viewportTag = $('meta[name="viewport"]');
    const hasViewport = viewportTag.length > 0;
    const viewportContent = viewportTag.attr('content') || '';
    
    const hasWidthDevice = viewportContent.includes('width=device-width');
    const hasInitialScale = viewportContent.includes('initial-scale=1');
    const noUserScalable = viewportContent.includes('user-scalable=no');
    
    const configScore = (hasWidthDevice ? 1 : 0) + (hasInitialScale ? 1 : 0) - (noUserScalable ? 1 : 0);
    const status = hasViewport && configScore >= 1 ? "OK" : hasViewport ? "OFI" : "Priority OFI";
    
    return {
      name: "Mobile Viewport Configuration",
      description: "Viewport should be properly configured for mobile devices",
      status,
      importance: "High",
      category: "ux",
      notes: status === "OK" ?
        "What: Your viewport is properly configured for mobile devices.\n\nWhy: Correct viewport configuration ensures proper mobile rendering.\n\nHow: Continue maintaining proper viewport settings." :
        status === "OFI" ?
        "What: Your viewport configuration needs improvement.\n\nWhy: Poor viewport configuration causes mobile rendering issues.\n\nHow: Update viewport meta tag with width=device-width and initial-scale=1." :
        "What: Your page is missing viewport configuration.\n\nWhy: Missing viewport meta tag causes poor mobile experience.\n\nHow: Add viewport meta tag: <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">."
    };
  }

  // User Experience Analysis
  private async analyzeNavigationUsability($: cheerio.CheerioAPI): Promise<AnalysisFactor> {
    const navElements = $('nav, .navigation, .menu, .navbar').length;
    const navLinks = $('nav a, .navigation a, .menu a').length;
    const hasMobileMenu = $('.mobile-menu, .hamburger, .menu-toggle').length > 0;
    
    const navScore = (navElements > 0 ? 1 : 0) + (navLinks >= 3 ? 1 : 0) + (hasMobileMenu ? 1 : 0);
    const status = navScore >= 2 ? "OK" : navScore >= 1 ? "OFI" : "Priority OFI";
    
    return {
      name: "Navigation Usability",
      description: "Website should have clear, accessible navigation",
      status,
      importance: "High",
      category: "ux",
      notes: status === "OK" ?
        `What: Your navigation is well-structured with ${navLinks} navigation links.\n\nWhy: Clear navigation helps users find information and improves user experience.\n\nHow: Continue maintaining intuitive navigation and consider user testing.` :
        status === "OFI" ?
        `What: Your navigation could be improved (${navScore}/3 usability indicators).\n\nWhy: Poor navigation frustrates users and increases bounce rates.\n\nHow: Add clear navigation menu and consider mobile-friendly navigation options.` :
        `What: Your navigation needs significant improvement (${navScore}/3 indicators).\n\nWhy: Missing or poor navigation severely hurts user experience.\n\nHow: Add clear navigation menu with logical structure and mobile support.`
    };
  }

  private async analyzeContentReadability($: cheerio.CheerioAPI, text: string): Promise<AnalysisFactor> {
    const textLength = text.length;
    const paragraphs = $('p').length;
    const headings = $('h1, h2, h3, h4, h5, h6').length;
    const lists = $('ul, ol').length;
    
    const readabilityScore = (paragraphs >= 3 ? 1 : 0) + (headings >= 2 ? 1 : 0) + (lists >= 1 ? 1 : 0);
    const status = readabilityScore >= 2 ? "OK" : readabilityScore >= 1 ? "OFI" : "Priority OFI";
    
    return {
      name: "Content Readability and Structure",
      description: "Content should be well-structured and easy to read",
      status,
      importance: "Medium",
      category: "ux",
      notes: status === "OK" ?
        `What: Your content is well-structured with ${paragraphs} paragraphs and ${headings} headings.\n\nWhy: Good content structure improves readability and user engagement.\n\nHow: Continue using headings, short paragraphs, and lists for scannable content.` :
        status === "OFI" ?
        `What: Your content structure could be improved (${readabilityScore}/3 structure elements).\n\nWhy: Poor content structure makes it harder for users to read and understand.\n\nHow: Add more headings, break up long paragraphs, and use lists for better structure.` :
        `What: Your content needs better structure (${readabilityScore}/3 elements).\n\nWhy: Poorly structured content frustrates users and increases bounce rates.\n\nHow: Add headings, break content into paragraphs, and use lists for better readability.`
    };
  }

  private async analyzeVisualHierarchy($: cheerio.CheerioAPI): Promise<AnalysisFactor> {
    const h1Count = $('h1').length;
    const headingHierarchy = $('h1, h2, h3').length;
    const emphasizedText = $('strong, em, b, i').length;
    
    const hierarchyScore = (h1Count === 1 ? 1 : 0) + (headingHierarchy >= 3 ? 1 : 0) + (emphasizedText >= 2 ? 1 : 0);
    const status = hierarchyScore >= 2 ? "OK" : hierarchyScore >= 1 ? "OFI" : "Priority OFI";
    
    return {
      name: "Visual Hierarchy and Typography",
      description: "Page should have clear visual hierarchy with proper heading structure",
      status,
      importance: "Medium",
      category: "ux",
      notes: status === "OK" ?
        "What: Your page has good visual hierarchy with proper heading structure.\n\nWhy: Clear visual hierarchy guides users through content and improves comprehension.\n\nHow: Continue using consistent heading hierarchy and text emphasis." :
        status === "OFI" ?
        `What: Your visual hierarchy could be improved (${hierarchyScore}/3 hierarchy elements).\n\nWhy: Poor visual hierarchy makes content harder to scan and understand.\n\nHow: Use proper heading order (H1, H2, H3) and emphasize important text.` :
        `What: Your page lacks clear visual hierarchy (${hierarchyScore}/3 elements).\n\nWhy: Missing visual hierarchy confuses users and reduces content effectiveness.\n\nHow: Add proper heading structure and use text emphasis to guide reader attention.`
    };
  }

  private async analyzeCallToActionVisibility($: cheerio.CheerioAPI): Promise<AnalysisFactor> {
    const ctaElements = $('button, .cta, .call-to-action, input[type="submit"], .button').length;
    const ctaText = $('body').text().toLowerCase();
    const hasActionWords = ctaText.includes('contact') || ctaText.includes('call') || 
                          ctaText.includes('get quote') || ctaText.includes('book') ||
                          ctaText.includes('schedule');
    
    const ctaScore = (ctaElements >= 2 ? 1 : 0) + (hasActionWords ? 1 : 0);
    const status = ctaScore >= 2 ? "OK" : ctaScore >= 1 ? "OFI" : "Priority OFI";
    
    return {
      name: "Call-to-Action Visibility",
      description: "Page should have clear, prominent calls-to-action",
      status,
      importance: "High",
      category: "ux",
      notes: status === "OK" ?
        `What: Your page has clear calls-to-action (${ctaElements} CTA elements).\n\nWhy: Prominent CTAs guide users toward desired actions and improve conversions.\n\nHow: Continue testing CTA placement and wording for optimal results.` :
        status === "OFI" ?
        `What: Your calls-to-action could be more prominent (${ctaElements} CTA elements).\n\nWhy: Weak CTAs reduce conversion rates and user engagement.\n\nHow: Add more prominent buttons with action-oriented text like 'Get Quote' or 'Contact Us'.` :
        `What: Your page lacks clear calls-to-action (${ctaElements} CTA elements).\n\nWhy: Missing CTAs prevent users from taking desired actions.\n\nHow: Add prominent buttons or links with clear action words to guide user behavior.`
    };
  }

  // Additional analysis methods (simplified implementations)
  private async analyzeMobileNavigation($: cheerio.CheerioAPI): Promise<AnalysisFactor> {
    const mobileMenu = $('.mobile-menu, .hamburger, .menu-toggle, .nav-toggle').length;
    const hasCollapsibleNav = $('nav').attr('class')?.includes('collapse') || false;
    
    return {
      name: "Mobile Navigation Design",
      description: "Website should have mobile-optimized navigation",
      status: mobileMenu > 0 || hasCollapsibleNav ? "OK" : "OFI",
      importance: "Medium",
      category: "ux",
      notes: mobileMenu > 0 ? "Mobile navigation present" : "Consider adding mobile-friendly navigation menu"
    };
  }

  private async analyzeMobilePageSpeed(page: PageCrawlResult): Promise<AnalysisFactor> {
    // Mobile typically 20% slower than desktop
    const mobileLoadTime = (page.loadTime || 5000) * 1.2;
    const status = mobileLoadTime < 3000 ? "OK" : mobileLoadTime < 5000 ? "OFI" : "Priority OFI";
    
    return {
      name: "Mobile Page Speed",
      description: "Page should load quickly on mobile devices",
      status,
      importance: "High",
      category: "ux",
      notes: status === "OK" ? "Mobile page speed appears good" : "Optimize for better mobile performance"
    };
  }

  private async analyzeCacheOptimization(page: PageCrawlResult): Promise<AnalysisFactor> {
    // Simplified cache analysis
    const hasCachingIndicators = page.url.includes('cdn') || (page.size != null && page.size < 500000);
    
    return {
      name: "Browser Caching Optimization",
      description: "Resources should be optimized for browser caching",
      status: hasCachingIndicators ? "OK" : "OFI",
      importance: "Medium",
      category: "ux",
      notes: hasCachingIndicators ? "Caching appears optimized" : "Implement browser caching for better performance"
    };
  }

  private async analyzeCDNUsage(page: PageCrawlResult): Promise<AnalysisFactor> {
    const usesCDN = page.url.includes('cdn') || page.url.includes('cloudflare') || page.url.includes('amazonaws');
    
    return {
      name: "Content Delivery Network Usage",
      description: "Consider using CDN for improved global performance",
      status: usesCDN ? "OK" : "N/A",
      importance: "Low",
      category: "ux",
      notes: usesCDN ? "CDN usage detected" : "Consider implementing CDN for better global performance"
    };
  }

  private async analyzeMinificationOptimization($: cheerio.CheerioAPI): Promise<AnalysisFactor> {
    const inlineCSS = $('style').text();
    const inlineJS = $('script:not([src])').text();
    const appearsMinified = inlineCSS.includes(';') && !inlineCSS.includes('\n') ||
                           inlineJS.includes(';') && !inlineJS.includes('\n');
    
    return {
      name: "Code Minification",
      description: "CSS and JavaScript should be minified for better performance",
      status: appearsMinified ? "OK" : "OFI",
      importance: "Low",
      category: "ux",
      notes: appearsMinified ? "Code appears minified" : "Consider minifying CSS and JavaScript"
    };
  }

  private async analyzeFormUsability($: cheerio.CheerioAPI): Promise<AnalysisFactor> {
    const forms = $('form').length;
    const labeledInputs = $('label').length;
    const requiredFields = $('input[required], select[required], textarea[required]').length;
    
    return {
      name: "Form Usability and Design",
      description: "Forms should be user-friendly with proper labels and validation",
      status: forms === 0 ? "N/A" : labeledInputs >= forms ? "OK" : "OFI",
      importance: "Medium",
      category: "ux",
      notes: forms === 0 ? "No forms detected" : 
             labeledInputs >= forms ? "Forms appear well-labeled" : "Improve form labeling and usability"
    };
  }

  private async analyzeSearchFunctionality($: cheerio.CheerioAPI): Promise<AnalysisFactor> {
    const searchElements = $('input[type="search"], .search, #search, .search-box').length;
    
    return {
      name: "Site Search Functionality",
      description: "Consider adding site search for better user experience",
      status: searchElements > 0 ? "OK" : "N/A",
      importance: "Low",
      category: "ux",
      notes: searchElements > 0 ? "Search functionality present" : "Consider adding site search feature"
    };
  }

  private async analyzeBreadcrumbNavigation($: cheerio.CheerioAPI): Promise<AnalysisFactor> {
    const breadcrumbs = $('.breadcrumb, .breadcrumbs, nav[aria-label*="breadcrumb"]').length;
    
    return {
      name: "Breadcrumb Navigation",
      description: "Consider adding breadcrumb navigation for better UX",
      status: breadcrumbs > 0 ? "OK" : "N/A",
      importance: "Low",
      category: "ux",
      notes: breadcrumbs > 0 ? "Breadcrumb navigation present" : "Consider adding breadcrumb navigation"
    };
  }

  private async analyzeSiteSearchUsability($: cheerio.CheerioAPI): Promise<AnalysisFactor> {
    const searchBox = $('input[type="search"], .search-input').length;
    const searchButton = $('button[type="submit"], .search-button').length;
    
    return {
      name: "Search Interface Usability",
      description: "Search interface should be user-friendly and accessible",
      status: searchBox === 0 ? "N/A" : searchBox > 0 && searchButton > 0 ? "OK" : "OFI",
      importance: "Low",
      category: "ux",
      notes: searchBox === 0 ? "No search interface" : 
             searchBox > 0 && searchButton > 0 ? "Search interface complete" : "Improve search interface design"
    };
  }

  // Accessibility Analysis
  private async analyzeColorContrast($: cheerio.CheerioAPI): Promise<AnalysisFactor> {
    // Simplified contrast analysis
    const hasContrastStyles = $('style, link[rel="stylesheet"]').text().includes('color');
    
    return {
      name: "Color Contrast Accessibility",
      description: "Text should have sufficient color contrast for accessibility",
      status: hasContrastStyles ? "OK" : "OFI",
      importance: "Medium",
      category: "ux",
      notes: hasContrastStyles ? "Color styles present" : "Ensure sufficient color contrast for accessibility"
    };
  }

  private async analyzeKeyboardNavigation($: cheerio.CheerioAPI): Promise<AnalysisFactor> {
    const tabIndexElements = $('[tabindex]').length;
    const focusableElements = $('a, button, input, select, textarea').length;
    
    return {
      name: "Keyboard Navigation Support",
      description: "Website should be fully navigable via keyboard",
      status: focusableElements >= 3 ? "OK" : "OFI",
      importance: "Medium",
      category: "ux",
      notes: focusableElements >= 3 ? "Focusable elements present" : "Ensure all interactive elements are keyboard accessible"
    };
  }

  private async analyzeScreenReaderCompatibility($: cheerio.CheerioAPI): Promise<AnalysisFactor> {
    const ariaLabels = $('[aria-label], [aria-labelledby], [aria-describedby]').length;
    const headingStructure = $('h1, h2, h3, h4, h5, h6').length;
    
    return {
      name: "Screen Reader Compatibility",
      description: "Website should be compatible with screen readers",
      status: ariaLabels >= 2 && headingStructure >= 2 ? "OK" : "OFI",
      importance: "Medium",
      category: "ux",
      notes: ariaLabels >= 2 && headingStructure >= 2 ? "Good screen reader support" : "Improve ARIA labels and heading structure"
    };
  }

  private async analyzeImageAltText(images: PageCrawlResult['images']): Promise<AnalysisFactor> {
    const totalImages = images.length;
    if (totalImages === 0) {
      return {
        name: "Image Alt Text Accessibility",
        description: "All images should have descriptive alt text",
        status: "N/A",
        importance: "Medium",
      category: "ux",
        notes: "No images found on this page."
      };
    }

    const imagesWithAlt = images.filter(img => img.alt && img.alt.trim() !== '').length;
    const ratio = imagesWithAlt / totalImages;
    
    return {
      name: "Image Alt Text Accessibility",
      description: "All images should have descriptive alt text for accessibility",
      status: ratio >= 0.9 ? "OK" : ratio >= 0.7 ? "OFI" : "Priority OFI",
      importance: "Medium",
      category: "ux",
      notes: ratio >= 0.9 ? 
        `Excellent alt text coverage (${imagesWithAlt}/${totalImages} images)` :
        `Improve alt text coverage (${imagesWithAlt}/${totalImages} images have alt text)`
    };
  }

  private async analyzeFocusIndicators($: cheerio.CheerioAPI): Promise<AnalysisFactor> {
    const focusStyles = $('style, link[rel="stylesheet"]').text().includes(':focus');
    
    return {
      name: "Focus Indicators",
      description: "Interactive elements should have visible focus indicators",
      status: focusStyles ? "OK" : "OFI",
      importance: "Medium",
      category: "ux",
      notes: focusStyles ? "Focus styles present" : "Add visible focus indicators for better accessibility"
    };
  }

  private async analyzeSemanticHTML($: cheerio.CheerioAPI): Promise<AnalysisFactor> {
    const semanticElements = $('nav, main, section, article, aside, header, footer').length;
    const totalElements = $('div, span').length + semanticElements;
    const semanticRatio = totalElements > 0 ? semanticElements / totalElements : 0;
    
    return {
      name: "Semantic HTML Usage",
      description: "HTML should use semantic elements for better accessibility",
      status: semanticRatio >= 0.3 ? "OK" : semanticRatio >= 0.1 ? "OFI" : "Priority OFI",
      importance: "Medium",
      category: "ux",
      notes: semanticRatio >= 0.3 ? 
        "Good use of semantic HTML elements" :
        "Use more semantic HTML elements (nav, main, section, etc.)"
    };
  }
}