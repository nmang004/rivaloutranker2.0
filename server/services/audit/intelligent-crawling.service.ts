import { Cluster } from 'puppeteer-cluster';
import puppeteer from 'puppeteer';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { URL } from 'url';
import type { PageCrawlResult, SiteStructure } from './enhanced-analyzer.service';

/**
 * Intelligent Crawling Service with Puppeteer Cluster
 * Phase 3.1: Enhanced crawling for JavaScript-heavy sites with intelligent page classification
 */
export class IntelligentCrawlingService {
  private cluster: Cluster | null = null;
  private isInitialized = false;

  /**
   * Initialize Puppeteer Cluster
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    console.log('[IntelligentCrawling] Initializing Puppeteer Cluster...');
    
    try {
      this.cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: 4,
        puppeteerOptions: {
          headless: true,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
          ]
        },
        timeout: 60000,
        retryLimit: 2,
        retryDelay: 1000,
        skipDuplicateUrls: true
      });

      // Define the crawling task
      await this.cluster.task(async ({ page, data: { url, config } }) => {
        return await this.crawlPageWithPuppeteer(page, url, config);
      });

      this.isInitialized = true;
      console.log('[IntelligentCrawling] Puppeteer Cluster initialized successfully');
      
    } catch (error) {
      console.error('[IntelligentCrawling] Failed to initialize cluster:', error);
      throw new Error(`Failed to initialize Puppeteer Cluster: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Enhanced site crawling with intelligent page detection
   */
  async crawlSiteIntelligently(
    baseUrl: string,
    config: any,
    progressCallback?: (progress: number, message?: string) => void
  ): Promise<SiteStructure> {
    
    await this.initialize();
    
    console.log(`[IntelligentCrawling] Starting intelligent crawl for ${baseUrl}`);
    progressCallback?.(0.05, 'Initializing intelligent crawling...');

    const maxPages = config.maxPages || 25;
    const includeSubdomains = config.includeSubdomains || false;
    const analyzeJavaScript = config.analyzeJavaScript !== false; // Default true

    try {
      // Phase 1: Quick homepage analysis to determine site technology
      progressCallback?.(0.1, 'Analyzing homepage and detecting site technology...');
      const homepageTech = await this.detectSiteTechnology(baseUrl);
      const isJavaScriptHeavy = this.isJavaScriptHeavySite(homepageTech);
      
      console.log(`[IntelligentCrawling] Site technology detected - JS Heavy: ${isJavaScriptHeavy}`);

      // Phase 2: Smart page discovery using multiple methods
      progressCallback?.(0.2, 'Discovering pages using intelligent methods...');
      const discoveredUrls = await this.intelligentPageDiscovery(baseUrl, includeSubdomains, isJavaScriptHeavy);
      
      // Phase 3: Analyze homepage with appropriate method
      progressCallback?.(0.3, 'Analyzing homepage...');
      const homepage = await this.analyzePageIntelligently(
        baseUrl, 
        isJavaScriptHeavy && analyzeJavaScript, 
        homepageTech
      );

      // Phase 4: Classify and prioritize pages for analysis
      progressCallback?.(0.4, 'Classifying and prioritizing pages...');
      const prioritizedPages = await this.classifyAndPrioritizePages(discoveredUrls, baseUrl);
      const pagesToAnalyze = prioritizedPages.slice(0, maxPages - 1); // Reserve one for homepage

      // Phase 5: Parallel analysis of prioritized pages
      progressCallback?.(0.5, 'Analyzing prioritized pages with intelligent crawling...');
      const analysisResults = await this.analyzePagesBatch(
        pagesToAnalyze,
        isJavaScriptHeavy && analyzeJavaScript,
        (progress) => progressCallback?.(0.5 + (progress * 0.35), 'Analyzing pages...')
      );

      // Phase 6: Content similarity analysis and deduplication
      progressCallback?.(0.85, 'Performing content similarity analysis...');
      const deduplicatedResults = await this.performContentSimilarityAnalysis(analysisResults);

      // Phase 7: Extract technical assets
      progressCallback?.(0.9, 'Extracting technical assets...');
      const robotsTxt = await this.fetchRobotsTxt(baseUrl);
      const sitemapUrls = await this.extractSitemapUrls(baseUrl);

      progressCallback?.(1.0, 'Intelligent crawling completed');

      return {
        homepage,
        contactPage: deduplicatedResults.contactPage,
        servicePages: deduplicatedResults.servicePages,
        locationPages: deduplicatedResults.locationPages,
        serviceAreaPages: deduplicatedResults.serviceAreaPages,
        otherPages: deduplicatedResults.otherPages,
        sitemapUrls,
        robotsTxt,
        // Enhanced metadata
        crawlMetadata: {
          totalPagesDiscovered: discoveredUrls.length,
          pagesAnalyzed: pagesToAnalyze.length + 1, // +1 for homepage
          isJavaScriptHeavy,
          siteTechnology: homepageTech,
          contentSimilarityAnalyzed: true,
          crawlMethod: 'intelligent'
        }
      };

    } catch (error) {
      console.error(`[IntelligentCrawling] Error during intelligent crawl of ${baseUrl}:`, error);
      throw error;
    }
  }

  /**
   * Detect site technology stack
   */
  private async detectSiteTechnology(url: string): Promise<any> {
    try {
      const response = await axios.get(url, {
        timeout: 15000,
        headers: { 'User-Agent': 'RivalOutranker/2.0 SEO Analysis Bot' }
      });

      const $ = cheerio.load(response.data);
      const headers = response.headers;

      const technology = {
        hasReact: response.data.includes('react') || response.data.includes('React'),
        hasAngular: response.data.includes('angular') || response.data.includes('ng-'),
        hasVue: response.data.includes('vue') || response.data.includes('Vue'),
        hasJQuery: response.data.includes('jquery') || $('script[src*="jquery"]').length > 0,
        hasSPA: $('script[src*="app.js"]').length > 0 || $('script[src*="bundle.js"]').length > 0,
        scriptCount: $('script').length,
        hasAsyncScripts: $('script[async], script[defer]').length > 0,
        server: headers.server || 'unknown',
        powerBy: headers['x-powered-by'] || 'unknown',
        generator: $('meta[name="generator"]').attr('content') || 'unknown',
        hasServiceWorker: response.data.includes('serviceWorker') || response.data.includes('service-worker'),
        hasWebpack: response.data.includes('webpack') || response.data.includes('__webpack'),
        hasAMP: $('html[amp], html[⚡]').length > 0,
        renderBlocking: $('script:not([async]):not([defer])').length,
        dynamicContent: response.data.includes('document.write') || response.data.includes('innerHTML')
      };

      return technology;
    } catch (error) {
      console.warn(`[IntelligentCrawling] Failed to detect technology for ${url}:`, error instanceof Error ? error.message : 'Unknown error');
      return {
        hasReact: false,
        hasAngular: false,
        hasVue: false,
        hasJQuery: false,
        hasSPA: false,
        scriptCount: 0,
        hasAsyncScripts: false,
        server: 'unknown',
        powerBy: 'unknown',
        generator: 'unknown',
        hasServiceWorker: false,
        hasWebpack: false,
        hasAMP: false,
        renderBlocking: 0,
        dynamicContent: false
      };
    }
  }

  /**
   * Determine if site is JavaScript-heavy
   */
  private isJavaScriptHeavySite(tech: any): boolean {
    return tech.hasReact || 
           tech.hasAngular || 
           tech.hasVue || 
           tech.hasSPA || 
           tech.hasServiceWorker ||
           tech.hasWebpack ||
           tech.scriptCount > 10 ||
           tech.renderBlocking > 5 ||
           tech.dynamicContent;
  }

  /**
   * Intelligent page discovery using multiple methods
   */
  private async intelligentPageDiscovery(
    baseUrl: string, 
    includeSubdomains: boolean,
    isJavaScriptHeavy: boolean
  ): Promise<string[]> {
    
    const discoveredUrls = new Set<string>();
    const baseUrlObj = new URL(baseUrl);

    try {
      // Method 1: Traditional crawling for basic sites
      if (!isJavaScriptHeavy) {
        const traditionalUrls = await this.traditionalPageDiscovery(baseUrl, includeSubdomains);
        traditionalUrls.forEach(url => discoveredUrls.add(url));
      }

      // Method 2: JavaScript-rendered page discovery
      if (isJavaScriptHeavy) {
        const jsUrls = await this.javascriptPageDiscovery(baseUrl, includeSubdomains);
        jsUrls.forEach(url => discoveredUrls.add(url));
      }

      // Method 3: Sitemap-based discovery (works for both)
      const sitemapUrls = await this.extractSitemapUrls(baseUrl);
      sitemapUrls.forEach(url => discoveredUrls.add(url));

      // Method 4: Common patterns and educated guessing
      const patternUrls = await this.discoverByPatterns(baseUrl, includeSubdomains);
      patternUrls.forEach(url => discoveredUrls.add(url));

      // Method 5: API endpoint discovery for SPAs
      if (isJavaScriptHeavy) {
        const apiUrls = await this.discoverApiEndpoints(baseUrl);
        apiUrls.forEach(url => discoveredUrls.add(url));
      }

      console.log(`[IntelligentCrawling] Discovered ${discoveredUrls.size} unique URLs`);
      
    } catch (error) {
      console.warn(`[IntelligentCrawling] Page discovery failed for ${baseUrl}:`, error instanceof Error ? error.message : 'Unknown error');
    }

    discoveredUrls.delete(baseUrl); // Remove base URL
    return Array.from(discoveredUrls);
  }

  /**
   * Traditional page discovery using Cheerio
   */
  private async traditionalPageDiscovery(baseUrl: string, includeSubdomains: boolean): Promise<string[]> {
    const urls = new Set<string>();
    const baseUrlObj = new URL(baseUrl);

    try {
      const response = await axios.get(baseUrl, { timeout: 10000 });
      const $ = cheerio.load(response.data);

      $('a[href]').each((_, element) => {
        const href = $(element).attr('href');
        if (href) {
          const absoluteUrl = this.resolveUrl(href, baseUrl);
          if (this.isValidUrl(absoluteUrl, baseUrlObj, includeSubdomains)) {
            urls.add(absoluteUrl);
          }
        }
      });
    } catch (error) {
      console.warn(`[IntelligentCrawling] Traditional discovery failed:`, error instanceof Error ? error.message : 'Unknown error');
    }

    return Array.from(urls);
  }

  /**
   * JavaScript-rendered page discovery using Puppeteer
   */
  private async javascriptPageDiscovery(baseUrl: string, includeSubdomains: boolean): Promise<string[]> {
    if (!this.cluster) return [];

    const urls = new Set<string>();
    const baseUrlObj = new URL(baseUrl);

    try {
      const result = await this.cluster.execute({
        url: baseUrl,
        config: { extractLinks: true, includeSubdomains }
      });

      if (result?.links) {
        result.links.forEach((link: any) => {
          if (link.href && this.isValidUrl(link.href, baseUrlObj, includeSubdomains)) {
            urls.add(link.href);
          }
        });
      }
    } catch (error) {
      console.warn(`[IntelligentCrawling] JavaScript discovery failed:`, error instanceof Error ? error.message : 'Unknown error');
    }

    return Array.from(urls);
  }

  /**
   * Discover pages by common patterns
   */
  private async discoverByPatterns(baseUrl: string, includeSubdomains: boolean): Promise<string[]> {
    const urls = new Set<string>();
    
    const commonPaths = [
      '/about', '/about-us', '/about.html', '/company',
      '/contact', '/contact-us', '/contact.html', '/get-in-touch',
      '/services', '/products', '/solutions', '/offerings',
      '/portfolio', '/work', '/case-studies', '/projects',
      '/blog', '/news', '/resources', '/insights', '/articles',
      '/locations', '/offices', '/stores', '/branches',
      '/service-areas', '/coverage', '/areas-served',
      '/team', '/staff', '/leadership', '/management',
      '/careers', '/jobs', '/employment', '/join-us',
      '/faq', '/help', '/support', '/documentation',
      '/privacy', '/privacy-policy', '/terms', '/terms-of-service',
      '/sitemap', '/sitemap.html', '/site-map'
    ];

    // Industry-specific patterns
    const industryPaths = [
      // Professional services
      '/practice-areas', '/specialties', '/expertise',
      // Healthcare
      '/doctors', '/physicians', '/specialists', '/treatments',
      // Retail
      '/products', '/catalog', '/shop', '/store',
      // Real estate
      '/properties', '/listings', '/homes', '/commercial',
      // Restaurant
      '/menu', '/catering', '/reservations', '/hours',
      // Legal
      '/attorneys', '/lawyers', '/legal-services', '/consultation'
    ];

    const allPaths = [...commonPaths, ...industryPaths];

    for (const path of allPaths) {
      const testUrl = new URL(path, baseUrl).toString();
      if (await this.urlExists(testUrl)) {
        urls.add(testUrl);
      }
    }

    return Array.from(urls);
  }

  /**
   * Discover API endpoints for SPAs
   */
  private async discoverApiEndpoints(baseUrl: string): Promise<string[]> {
    const urls = new Set<string>();

    try {
      const response = await axios.get(baseUrl, { timeout: 10000 });
      const $ = cheerio.load(response.data);

      // Look for API endpoints in script tags
      $('script').each((_, element) => {
        const scriptContent = $(element).html() || '';
        
        // Common API patterns
        const apiPatterns = [
          /\/api\/[^"'\s]+/g,
          /\/graphql[^"'\s]*/g,
          /\/rest\/[^"'\s]+/g,
          /\/v\d+\/[^"'\s]+/g
        ];

        apiPatterns.forEach(pattern => {
          const matches = scriptContent.match(pattern);
          if (matches) {
            matches.forEach(match => {
              const apiUrl = this.resolveUrl(match, baseUrl);
              urls.add(apiUrl);
            });
          }
        });
      });
    } catch (error) {
      console.warn(`[IntelligentCrawling] API endpoint discovery failed:`, error instanceof Error ? error.message : 'Unknown error');
    }

    return Array.from(urls);
  }

  /**
   * Classify and prioritize pages for analysis
   */
  private async classifyAndPrioritizePages(urls: string[], baseUrl: string): Promise<string[]> {
    const classified = urls.map(url => ({
      url,
      priority: this.calculatePagePriority(url, baseUrl),
      estimatedType: this.estimatePageType(url)
    }));

    // Sort by priority (higher first)
    classified.sort((a, b) => b.priority - a.priority);

    return classified.map(item => item.url);
  }

  /**
   * Calculate page priority for analysis
   */
  private calculatePagePriority(url: string, baseUrl: string): number {
    const urlLower = url.toLowerCase();
    const urlObj = new URL(url);
    const pathDepth = urlObj.pathname.split('/').filter(p => p).length;
    
    let priority = 50; // Base priority

    // High priority pages
    if (urlLower.includes('/contact')) priority += 40;
    if (urlLower.includes('/about')) priority += 35;
    if (urlLower.includes('/service')) priority += 30;
    if (urlLower.includes('/product')) priority += 30;
    if (urlLower.includes('/location')) priority += 25;
    if (urlLower.includes('/team')) priority += 20;
    if (urlLower.includes('/portfolio')) priority += 20;

    // Medium priority pages  
    if (urlLower.includes('/blog')) priority += 15;
    if (urlLower.includes('/news')) priority += 15;
    if (urlLower.includes('/faq')) priority += 10;
    if (urlLower.includes('/help')) priority += 10;

    // Reduce priority for deep pages
    priority -= pathDepth * 5;

    // Reduce priority for certain patterns
    if (urlLower.includes('/tag/')) priority -= 20;
    if (urlLower.includes('/category/')) priority -= 15;
    if (urlLower.includes('/archive/')) priority -= 25;
    if (urlLower.includes('/page/')) priority -= 10;

    return Math.max(priority, 0);
  }

  /**
   * Estimate page type from URL
   */
  private estimatePageType(url: string): string {
    const urlLower = url.toLowerCase();
    
    if (urlLower.includes('/contact')) return 'contact';
    if (urlLower.includes('/about')) return 'about';
    if (urlLower.includes('/service')) return 'service';
    if (urlLower.includes('/product')) return 'product';
    if (urlLower.includes('/location')) return 'location';
    if (urlLower.includes('/team')) return 'team';
    if (urlLower.includes('/portfolio')) return 'portfolio';
    if (urlLower.includes('/blog')) return 'blog';
    if (urlLower.includes('/news')) return 'news';
    
    return 'other';
  }

  /**
   * Analyze page using the appropriate method
   */
  private async analyzePageIntelligently(
    url: string, 
    useJavaScript: boolean, 
    siteTech?: any
  ): Promise<PageCrawlResult> {
    
    if (useJavaScript && this.cluster) {
      return await this.analyzePageWithCluster(url, { siteTechnology: siteTech });
    } else {
      return await this.analyzePageWithAxios(url);
    }
  }

  /**
   * Analyze multiple pages in batch
   */
  private async analyzePagesBatch(
    urls: string[],
    useJavaScript: boolean,
    progressCallback?: (progress: number) => void
  ): Promise<PageCrawlResult[]> {
    
    const results: PageCrawlResult[] = [];
    const totalUrls = urls.length;
    let processed = 0;

    if (useJavaScript && this.cluster) {
      // Use cluster for parallel processing
      const promises = urls.map(url => 
        this.cluster!.execute({ url, config: {} })
          .then(result => {
            processed++;
            progressCallback?.(processed / totalUrls);
            return result;
          })
          .catch(error => {
            console.warn(`[IntelligentCrawling] Failed to analyze ${url}:`, error instanceof Error ? error.message : 'Unknown error');
            processed++;
            progressCallback?.(processed / totalUrls);
            return null;
          })
      );

      const clusterResults = await Promise.all(promises);
      results.push(...clusterResults.filter(Boolean));
      
    } else {
      // Sequential analysis for non-JS sites
      for (const url of urls) {
        try {
          const result = await this.analyzePageWithAxios(url);
          results.push(result);
        } catch (error) {
          console.warn(`[IntelligentCrawling] Failed to analyze ${url}:`, error instanceof Error ? error.message : 'Unknown error');
        }
        
        processed++;
        progressCallback?.(processed / totalUrls);
      }
    }

    return results;
  }

  /**
   * Analyze page with Puppeteer cluster
   */
  private async analyzePageWithCluster(url: string, config: any = {}): Promise<PageCrawlResult> {
    if (!this.cluster) {
      throw new Error('Puppeteer cluster not initialized');
    }

    return await this.cluster.execute({ url, config });
  }

  /**
   * Crawl page with Puppeteer (cluster task function)
   */
  private async crawlPageWithPuppeteer(page: any, url: string, config: any): Promise<PageCrawlResult> {
    const startTime = Date.now();
    
    try {
      // Navigate with enhanced options
      await page.goto(url, { 
        waitUntil: ['domcontentloaded', 'networkidle0'],
        timeout: 30000 
      });

      // Wait for potential dynamic content
      await page.waitForTimeout(2000);

      // Extract page data using JavaScript
      const pageData = await page.evaluate(() => {
        const getTextContent = (selector: string): string => {
          const element = document.querySelector(selector);
          return element ? element.textContent?.trim() || '' : '';
        };

        const getMetaContent = (name: string): string => {
          const meta = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
          return meta ? meta.getAttribute('content') || '' : '';
        };

        const extractHeadings = (): Record<string, string[]> => {
          const headings: Record<string, string[]> = {};
          for (let i = 1; i <= 6; i++) {
            const elements = Array.from(document.querySelectorAll(`h${i}`));
            headings[`h${i}`] = elements.map(el => el.textContent?.trim() || '').filter(Boolean);
          }
          return headings;
        };

        const extractImages = (): any[] => {
          return Array.from(document.querySelectorAll('img')).map(img => ({
            src: img.src,
            alt: img.alt || '',
            width: img.width || undefined,
            height: img.height || undefined
          }));
        };

        const extractLinks = (): any[] => {
          return Array.from(document.querySelectorAll('a[href]')).map(link => ({
            href: (link as HTMLAnchorElement).href,
            text: link.textContent?.trim() || '',
            isExternal: !(link as HTMLAnchorElement).href.includes(window.location.hostname)
          }));
        };

        const extractSchemaMarkup = (): any[] => {
          const schemas: any[] = [];
          document.querySelectorAll('script[type="application/ld+json"]').forEach(script => {
            try {
              if (script.textContent) {
                schemas.push(JSON.parse(script.textContent));
              }
            } catch (e) {
              // Ignore invalid JSON-LD
            }
          });
          return schemas;
        };

        // Clean body text extraction
        const bodyElement = document.querySelector('main, article, .content, .main-content, #content, #main') || document.body;
        const clonedBody = bodyElement.cloneNode(true) as Element;
        
        // Remove unwanted elements
        clonedBody.querySelectorAll('script, style, nav, header, footer, aside, .menu, .navigation').forEach(el => el.remove());
        const bodyText = clonedBody.textContent?.replace(/\s+/g, ' ').trim() || '';
        
        return {
          title: document.title || '',
          metaDescription: getMetaContent('description') || getMetaContent('og:description'),
          bodyText,
          wordCount: bodyText.split(/\s+/).filter(word => word.length > 0).length,
          headings: extractHeadings(),
          images: extractImages(),
          links: extractLinks(),
          scripts: Array.from(document.querySelectorAll('script[src]')).map(s => s.getAttribute('src')).filter(Boolean),
          stylesheets: Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map(l => l.getAttribute('href')).filter(Boolean),
          canonicalUrl: document.querySelector('link[rel="canonical"]')?.getAttribute('href') || '',
          schemaMarkup: extractSchemaMarkup(),
          viewport: getMetaContent('viewport'),
          charset: document.characterSet,
          lang: document.documentElement.lang,
          // JavaScript-specific data
          hasServiceWorker: 'serviceWorker' in navigator,
          clientHeight: document.documentElement.clientHeight,
          scrollHeight: document.documentElement.scrollHeight,
          isInteractive: document.readyState === 'complete'
        };
      });

      const loadTime = Date.now() - startTime;
      
      // Get page size
      const content = await page.content();
      
      return {
        url,
        title: pageData.title,
        metaDescription: pageData.metaDescription,
        statusCode: 200, // If we got here, it's successful
        bodyText: pageData.bodyText,
        wordCount: pageData.wordCount,
        headings: pageData.headings,
        images: pageData.images,
        links: pageData.links,
        scripts: pageData.scripts,
        stylesheets: pageData.stylesheets,
        canonicalUrl: pageData.canonicalUrl,
        schemaMarkup: pageData.schemaMarkup,
        pageType: this.determineAdvancedPageType(pageData.title, pageData.bodyText, url, pageData),
        loadTime,
        size: content.length,
        // Enhanced metadata
        crawlMethod: 'puppeteer',
        viewport: pageData.viewport,
        charset: pageData.charset,
        lang: pageData.lang,
        hasServiceWorker: pageData.hasServiceWorker,
        isInteractive: pageData.isInteractive,
        renderMetrics: {
          clientHeight: pageData.clientHeight,
          scrollHeight: pageData.scrollHeight,
          isScrollable: pageData.scrollHeight > pageData.clientHeight
        }
      };

    } catch (error) {
      console.warn(`[IntelligentCrawling] Puppeteer analysis failed for ${url}:`, error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  /**
   * Analyze page with Axios (fallback method)
   */
  private async analyzePageWithAxios(url: string): Promise<PageCrawlResult> {
    const startTime = Date.now();
    
    try {
      const response = await axios.get(url, {
        timeout: 30000,
        headers: { 'User-Agent': 'RivalOutranker/2.0 SEO Analysis Bot' }
      });
      
      const loadTime = Date.now() - startTime;
      const $ = cheerio.load(response.data);

      // Extract data using Cheerio
      const title = $('title').text().trim();
      const metaDescription = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || '';
      
      // Clean body text
      $('script, style, nav, header, footer, aside, .menu, .navigation').remove();
      const mainContent = $('main, article, .content, .main-content, #content, #main').first();
      const bodyText = (mainContent.length > 0 ? mainContent.text() : $('body').text()).replace(/\s+/g, ' ').trim();
      const wordCount = bodyText.split(/\s+/).filter(word => word.length > 0).length;

      const headings: Record<string, string[]> = {};
      for (let i = 1; i <= 6; i++) {
        headings[`h${i}`] = [];
        $(`h${i}`).each((_, element) => {
          const text = $(element).text().trim();
          if (text) headings[`h${i}`].push(text);
        });
      }

      const images = Array.from($('img')).map(img => ({
        src: this.resolveUrl($(img).attr('src') || '', url),
        alt: $(img).attr('alt') || '',
        width: $(img).attr('width') ? parseInt($(img).attr('width')!) : undefined,
        height: $(img).attr('height') ? parseInt($(img).attr('height')!) : undefined
      }));

      const links = Array.from($('a[href]')).map(link => {
        const href = this.resolveUrl($(link).attr('href') || '', url);
        return {
          href,
          text: $(link).text().trim(),
          isExternal: !href.includes(new URL(url).hostname)
        };
      });

      const schemaMarkup: any[] = [];
      $('script[type="application/ld+json"]').each((_, element) => {
        try {
          const schemaText = $(element).html();
          if (schemaText) schemaMarkup.push(JSON.parse(schemaText));
        } catch (e) {
          // Ignore invalid JSON-LD
        }
      });

      return {
        url,
        title,
        metaDescription,
        statusCode: response.status,
        bodyText,
        wordCount,
        headings,
        images,
        links,
        scripts: Array.from($('script[src]')).map(s => $(s).attr('src')).filter(Boolean) as string[],
        stylesheets: Array.from($('link[rel="stylesheet"]')).map(l => $(l).attr('href')).filter(Boolean) as string[],
        canonicalUrl: $('link[rel="canonical"]').attr('href') || '',
        schemaMarkup,
        pageType: this.determineAdvancedPageType(title, bodyText, url),
        loadTime,
        size: response.data.length,
        crawlMethod: 'axios'
      };

    } catch (error) {
      console.warn(`[IntelligentCrawling] Axios analysis failed for ${url}:`, error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  /**
   * Advanced page type determination with ML-like classification
   */
  private determineAdvancedPageType(title: string, content: string, url: string, extraData?: any): string {
    const titleLower = title.toLowerCase();
    const contentLower = content.toLowerCase();
    const urlLower = url.toLowerCase();

    // Contact page detection with higher accuracy
    const contactIndicators = [
      urlLower.includes('/contact'),
      titleLower.includes('contact'),
      /\b(phone|email|address|location)\b/.test(contentLower),
      /\b(call|reach|touch|get in touch)\b/.test(contentLower),
      /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(content), // Phone pattern
      /@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(content) // Email pattern
    ];
    
    if (contactIndicators.filter(Boolean).length >= 3) return 'contact';

    // Service page detection
    const serviceIndicators = [
      urlLower.includes('/service'),
      urlLower.includes('/product'),
      titleLower.includes('service'),
      /\b(we offer|our service|we provide|solutions)\b/.test(contentLower),
      /\b(pricing|packages|plans)\b/.test(contentLower)
    ];
    
    if (serviceIndicators.filter(Boolean).length >= 2) return 'service';

    // About page detection  
    const aboutIndicators = [
      urlLower.includes('/about'),
      titleLower.includes('about'),
      /\b(our story|our company|who we are|our team|our mission)\b/.test(contentLower),
      /\b(founded|established|years of experience)\b/.test(contentLower)
    ];
    
    if (aboutIndicators.filter(Boolean).length >= 2) return 'about';

    // Location page detection
    const locationIndicators = [
      urlLower.includes('/location'),
      urlLower.includes('/office'),
      titleLower.includes('location'),
      /\b(address|directions|hours|visit us)\b/.test(contentLower),
      /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/.test(contentLower)
    ];
    
    if (locationIndicators.filter(Boolean).length >= 2) return 'location';

    // Blog/News page detection
    const blogIndicators = [
      urlLower.includes('/blog'),
      urlLower.includes('/news'),
      urlLower.includes('/article'),
      titleLower.includes('blog'),
      /\b(posted|published|read more|continue reading)\b/.test(contentLower)
    ];
    
    if (blogIndicators.filter(Boolean).length >= 2) return 'blog';

    // Product page detection
    const productIndicators = [
      urlLower.includes('/product'),
      titleLower.includes('product'),
      /\b(price|cost|buy now|purchase|add to cart)\b/.test(contentLower),
      /\$\d+/.test(content) // Price pattern
    ];
    
    if (productIndicators.filter(Boolean).length >= 2) return 'product';

    return 'other';
  }

  /**
   * Content similarity analysis and deduplication
   */
  private async performContentSimilarityAnalysis(pages: PageCrawlResult[]): Promise<any> {
    console.log(`[IntelligentCrawling] Analyzing content similarity for ${pages.length} pages`);

    const result = {
      contactPage: undefined as PageCrawlResult | undefined,
      servicePages: [] as PageCrawlResult[],
      locationPages: [] as PageCrawlResult[],
      serviceAreaPages: [] as PageCrawlResult[],
      otherPages: [] as PageCrawlResult[]
    };

    // Group pages by type
    const groupedPages: Record<string, PageCrawlResult[]> = {};
    pages.forEach(page => {
      const type = page.pageType || 'other';
      if (!groupedPages[type]) groupedPages[type] = [];
      groupedPages[type].push(page);
    });

    // Deduplicate within each group
    for (const [type, typePages] of Object.entries(groupedPages)) {
      const deduplicatedPages = this.deduplicateByContent(typePages);
      
      switch (type) {
        case 'contact':
          if (deduplicatedPages.length > 0) {
            result.contactPage = deduplicatedPages[0]; // Take the best contact page
          }
          break;
        case 'service':
          result.servicePages = deduplicatedPages;
          break;
        case 'location':
          result.locationPages = deduplicatedPages;
          break;
        case 'service-area':
          result.serviceAreaPages = deduplicatedPages;
          break;
        default:
          result.otherPages.push(...deduplicatedPages);
      }
    }

    return result;
  }

  /**
   * Deduplicate pages by content similarity
   */
  private deduplicateByContent(pages: PageCrawlResult[]): PageCrawlResult[] {
    if (pages.length <= 1) return pages;

    const deduplicatedPages: PageCrawlResult[] = [];
    const similarityThreshold = 0.85;

    for (const currentPage of pages) {
      let isDuplicate = false;
      
      for (const existingPage of deduplicatedPages) {
        const similarity = this.calculateContentSimilarity(currentPage.bodyText, existingPage.bodyText);
        
        if (similarity > similarityThreshold) {
          isDuplicate = true;
          // Keep the page with more content
          if (currentPage.wordCount > existingPage.wordCount) {
            const index = deduplicatedPages.indexOf(existingPage);
            deduplicatedPages[index] = currentPage;
          }
          break;
        }
      }
      
      if (!isDuplicate) {
        deduplicatedPages.push(currentPage);
      }
    }

    return deduplicatedPages;
  }

  /**
   * Calculate content similarity between two text strings
   */
  private calculateContentSimilarity(text1: string, text2: string): number {
    if (!text1 || !text2) return 0;
    
    // Simple word-based similarity calculation
    const words1 = new Set(text1.toLowerCase().split(/\s+/).filter(word => word.length > 3));
    const words2 = new Set(text2.toLowerCase().split(/\s+/).filter(word => word.length > 3));
    
    const intersection = new Set([...words1].filter(word => words2.has(word)));
    const union = new Set([...words1, ...words2]);
    
    return union.size > 0 ? intersection.size / union.size : 0;
  }

  // Helper methods (reused from existing service)
  private async fetchRobotsTxt(baseUrl: string): Promise<string | undefined> {
    try {
      const robotsUrl = new URL('/robots.txt', baseUrl).toString();
      const response = await axios.get(robotsUrl, { timeout: 5000 });
      return response.data;
    } catch (error) {
      return undefined;
    }
  }

  private async extractSitemapUrls(baseUrl: string): Promise<string[]> {
    const sitemapUrls: string[] = [];
    
    try {
      const commonSitemaps = ['/sitemap.xml', '/sitemap_index.xml'];
      
      for (const path of commonSitemaps) {
        const sitemapUrl = new URL(path, baseUrl).toString();
        if (await this.urlExists(sitemapUrl)) {
          const urls = await this.parseSitemap(sitemapUrl);
          sitemapUrls.push(...urls);
        }
      }
    } catch (error) {
      console.warn(`[IntelligentCrawling] Sitemap extraction failed:`, error instanceof Error ? error.message : 'Unknown error');
    }
    
    return [...new Set(sitemapUrls)];
  }

  private async parseSitemap(sitemapUrl: string): Promise<string[]> {
    try {
      const response = await axios.get(sitemapUrl, { timeout: 10000 });
      const $ = cheerio.load(response.data, { xmlMode: true });
      
      const urls: string[] = [];
      $('url > loc').each((_, element) => {
        const url = $(element).text().trim();
        if (url) urls.push(url);
      });
      
      return urls.slice(0, 50);
    } catch (error) {
      return [];
    }
  }

  private async urlExists(url: string): Promise<boolean> {
    try {
      const response = await axios.head(url, { 
        timeout: 5000,
        validateStatus: (status) => status < 400
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  private resolveUrl(href: string, baseUrl: string): string {
    try {
      return new URL(href, baseUrl).toString();
    } catch (error) {
      return href;
    }
  }

  private isValidUrl(url: string, baseUrlObj: URL, includeSubdomains: boolean): boolean {
    try {
      const urlObj = new URL(url);
      
      if (!['http:', 'https:'].includes(urlObj.protocol)) return false;
      
      const skipExtensions = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.gif', '.zip', '.mp4', '.mp3'];
      if (skipExtensions.some(ext => urlObj.pathname.toLowerCase().endsWith(ext))) return false;
      
      if (includeSubdomains) {
        return urlObj.hostname.endsWith(baseUrlObj.hostname) || urlObj.hostname === baseUrlObj.hostname;
      } else {
        return urlObj.hostname === baseUrlObj.hostname;
      }
    } catch (error) {
      return false;
    }
  }

  /**
   * Cleanup resources
   */
  async cleanup(): Promise<void> {
    if (this.cluster) {
      await this.cluster.idle();
      await this.cluster.close();
      this.cluster = null;
      this.isInitialized = false;
      console.log('[IntelligentCrawling] Puppeteer Cluster closed');
    }
  }
}