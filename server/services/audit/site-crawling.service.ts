import axios from 'axios';
import * as cheerio from 'cheerio';
import { URL } from 'url';
import type { PageCrawlResult, SiteStructure } from './enhanced-analyzer.service';

/**
 * Site Crawling Service
 * Handles intelligent site discovery and page classification for comprehensive audits
 */
export class SiteCrawlingService {

  /**
   * Crawl and analyze site structure
   */
  async crawlSite(
    baseUrl: string, 
    config: any, 
    progressCallback?: (progress: number) => void
  ): Promise<SiteStructure> {
    console.log(`[SiteCrawling] Starting site crawl for ${baseUrl}`);
    
    const maxPages = config.maxPages || 20;
    const includeSubdomains = config.includeSubdomains || false;
    
    try {
      // Phase 1: Analyze homepage
      progressCallback?.(0.1);
      const homepage = await this.analyzePage(baseUrl);
      
      // Phase 2: Discover additional pages
      progressCallback?.(0.3);
      const discoveredUrls = await this.discoverPages(baseUrl, includeSubdomains);
      
      // Phase 3: Classify and analyze key pages
      progressCallback?.(0.5);
      const classifiedPages = await this.classifyAndAnalyzePages(
        discoveredUrls.slice(0, maxPages - 1), // Reserve one for homepage
        baseUrl,
        (progress) => progressCallback?.(0.5 + (progress * 0.4))
      );
      
      progressCallback?.(0.9);
      
      // Try to get robots.txt and sitemap
      const robotsTxt = await this.fetchRobotsTxt(baseUrl);
      const sitemapUrls = await this.extractSitemapUrls(baseUrl);
      
      progressCallback?.(1.0);
      
      return {
        homepage,
        contactPage: classifiedPages.contactPage,
        servicePages: classifiedPages.servicePages,
        locationPages: classifiedPages.locationPages,
        serviceAreaPages: classifiedPages.serviceAreaPages,
        otherPages: classifiedPages.otherPages,
        sitemapUrls,
        robotsTxt
      };
      
    } catch (error) {
      console.error(`[SiteCrawling] Error crawling ${baseUrl}:`, error instanceof Error ? error.message : 'Unknown error');
      
      // Return minimal structure with just homepage if possible
      const homepage = await this.analyzePage(baseUrl).catch(() => undefined);
      
      return {
        homepage,
        servicePages: [],
        locationPages: [],
        serviceAreaPages: [],
        otherPages: [],
        sitemapUrls: [],
        robotsTxt: undefined
      };
    }
  }

  /**
   * Analyze a single page and extract comprehensive data
   */
  private async analyzePage(url: string): Promise<PageCrawlResult> {
    try {
      console.log(`[SiteCrawling] Analyzing page: ${url}`);
      
      const startTime = Date.now();
      const response = await axios.get(url, {
        timeout: 30000,
        headers: {
          'User-Agent': 'RivalOutranker/2.0 SEO Analysis Bot'
        }
      });
      const loadTime = Date.now() - startTime;
      
      const $ = cheerio.load(response.data);
      
      // Extract basic page information
      const title = $('title').text().trim();
      const metaDescription = $('meta[name="description"]').attr('content') || '';
      const bodyText = this.extractBodyText($);
      const wordCount = bodyText.split(/\s+/).filter(word => word.length > 0).length;
      
      // Extract structured data
      const headings = this.extractHeadings($);
      const images = this.extractImages($, url);
      const links = this.extractLinks($, url);
      const scripts = this.extractScripts($);
      const stylesheets = this.extractStylesheets($);
      const canonicalUrl = $('link[rel="canonical"]').attr('href');
      const schemaMarkup = this.extractSchemaMarkup($);
      
      // Determine page type
      const pageType = this.determinePageType(title, bodyText, url);
      
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
        scripts,
        stylesheets,
        canonicalUrl,
        schemaMarkup,
        pageType,
        loadTime,
        size: response.data.length
      };
      
    } catch (error) {
      console.warn(`[SiteCrawling] Failed to analyze ${url}:`, error instanceof Error ? error.message : 'Unknown error');
      throw new Error(`Failed to analyze page: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Discover additional pages through various methods
   */
  private async discoverPages(baseUrl: string, includeSubdomains: boolean): Promise<string[]> {
    const discoveredUrls = new Set<string>();
    const baseUrlObj = new URL(baseUrl);
    
    try {
      // Method 1: Extract links from homepage
      const homepageResponse = await axios.get(baseUrl, { timeout: 10000 });
      const $ = cheerio.load(homepageResponse.data);
      
      $('a[href]').each((_, element) => {
        const href = $(element).attr('href');
        if (href) {
          const absoluteUrl = this.resolveUrl(href, baseUrl);
          if (this.isValidUrl(absoluteUrl, baseUrlObj, includeSubdomains)) {
            discoveredUrls.add(absoluteUrl);
          }
        }
      });
      
      // Method 2: Try common page patterns
      const commonPages = [
        '/about', '/about-us', '/about.html',
        '/contact', '/contact-us', '/contact.html',
        '/services', '/products', '/portfolio',
        '/blog', '/news', '/resources',
        '/locations', '/service-areas',
        '/privacy-policy', '/terms-of-service',
        '/sitemap.xml', '/sitemap.html'
      ];
      
      for (const path of commonPages) {
        const testUrl = new URL(path, baseUrl).toString();
        if (await this.urlExists(testUrl)) {
          discoveredUrls.add(testUrl);
        }
      }
      
      // Method 3: Try sitemap discovery
      const sitemapUrls = await this.extractSitemapUrls(baseUrl);
      sitemapUrls.forEach(url => discoveredUrls.add(url));
      
    } catch (error) {
      console.warn(`[SiteCrawling] Page discovery failed for ${baseUrl}:`, error instanceof Error ? error.message : 'Unknown error');
    }
    
    // Remove the base URL if it's in the discovered URLs
    discoveredUrls.delete(baseUrl);
    
    return Array.from(discoveredUrls);
  }

  /**
   * Classify pages by type and analyze key pages
   */
  private async classifyAndAnalyzePages(
    urls: string[], 
    baseUrl: string,
    progressCallback?: (progress: number) => void
  ): Promise<{
    contactPage?: PageCrawlResult;
    servicePages: PageCrawlResult[];
    locationPages: PageCrawlResult[];
    serviceAreaPages: PageCrawlResult[];
    otherPages: PageCrawlResult[];
  }> {
    
    const result = {
      contactPage: undefined as PageCrawlResult | undefined,
      servicePages: [] as PageCrawlResult[],
      locationPages: [] as PageCrawlResult[],
      serviceAreaPages: [] as PageCrawlResult[],
      otherPages: [] as PageCrawlResult[]
    };
    
    const totalUrls = urls.length;
    let processedUrls = 0;
    
    for (const url of urls) {
      try {
        const pageData = await this.analyzePage(url);
        const pageType = pageData.pageType || 'other';
        
        // Classify into appropriate category
        switch (pageType) {
          case 'contact':
            if (!result.contactPage) {
              result.contactPage = pageData;
            }
            break;
          case 'service':
            result.servicePages.push(pageData);
            break;
          case 'location':
            result.locationPages.push(pageData);
            break;
          case 'service-area':
            result.serviceAreaPages.push(pageData);
            break;
          default:
            result.otherPages.push(pageData);
        }
        
        processedUrls++;
        progressCallback?.(processedUrls / totalUrls);
        
      } catch (error) {
        console.warn(`[SiteCrawling] Failed to classify page ${url}:`, error instanceof Error ? error.message : 'Unknown error');
        processedUrls++;
        progressCallback?.(processedUrls / totalUrls);
      }
    }
    
    return result;
  }

  /**
   * Extract clean body text from page
   */
  private extractBodyText($: cheerio.CheerioAPI): string {
    // Remove unwanted elements
    $('script, style, nav, header, footer, aside, .menu, .navigation').remove();
    
    // Get main content areas
    const mainContent = $('main, article, .content, .main-content, #content, #main').first();
    const text = mainContent.length > 0 ? mainContent.text() : $('body').text();
    
    return text.replace(/\s+/g, ' ').trim();
  }

  /**
   * Extract heading structure
   */
  private extractHeadings($: cheerio.CheerioAPI): Record<string, string[]> {
    const headings: Record<string, string[]> = {};
    
    for (let i = 1; i <= 6; i++) {
      headings[`h${i}`] = [];
      $(`h${i}`).each((_, element) => {
        const text = $(element).text().trim();
        if (text) headings[`h${i}`].push(text);
      });
    }
    
    return headings;
  }

  /**
   * Extract image information
   */
  private extractImages($: cheerio.CheerioAPI, baseUrl: string): any[] {
    const images: any[] = [];
    
    $('img').each((_, element) => {
      const $img = $(element);
      const src = $img.attr('src');
      
      if (src) {
        images.push({
          src: this.resolveUrl(src, baseUrl),
          alt: $img.attr('alt') || '',
          width: $img.attr('width') ? parseInt($img.attr('width')!) : undefined,
          height: $img.attr('height') ? parseInt($img.attr('height')!) : undefined
        });
      }
    });
    
    return images;
  }

  /**
   * Extract link information
   */
  private extractLinks($: cheerio.CheerioAPI, baseUrl: string): any[] {
    const links: any[] = [];
    const baseUrlObj = new URL(baseUrl);
    
    $('a[href]').each((_, element) => {
      const $link = $(element);
      const href = $link.attr('href');
      
      if (href) {
        const absoluteUrl = this.resolveUrl(href, baseUrl);
        const isExternal = !absoluteUrl.includes(baseUrlObj.hostname);
        
        links.push({
          href: absoluteUrl,
          text: $link.text().trim(),
          isExternal
        });
      }
    });
    
    return links;
  }

  /**
   * Extract script sources
   */
  private extractScripts($: cheerio.CheerioAPI): string[] {
    const scripts: string[] = [];
    
    $('script[src]').each((_, element) => {
      const src = $(element).attr('src');
      if (src) scripts.push(src);
    });
    
    return scripts;
  }

  /**
   * Extract stylesheet links
   */
  private extractStylesheets($: cheerio.CheerioAPI): string[] {
    const stylesheets: string[] = [];
    
    $('link[rel="stylesheet"]').each((_, element) => {
      const href = $(element).attr('href');
      if (href) stylesheets.push(href);
    });
    
    return stylesheets;
  }

  /**
   * Extract JSON-LD schema markup
   */
  private extractSchemaMarkup($: cheerio.CheerioAPI): object[] {
    const schemas: object[] = [];
    
    $('script[type="application/ld+json"]').each((_, element) => {
      try {
        const schemaText = $(element).html();
        if (schemaText) {
          const schema = JSON.parse(schemaText);
          schemas.push(schema);
        }
      } catch (error) {
        // Ignore invalid JSON-LD
      }
    });
    
    return schemas;
  }

  /**
   * Determine page type based on content and URL
   */
  private determinePageType(title: string, content: string, url: string): string {
    const titleLower = title.toLowerCase();
    const contentLower = content.toLowerCase();
    const urlLower = url.toLowerCase();
    
    // Contact page detection
    if (
      urlLower.includes('/contact') ||
      titleLower.includes('contact') ||
      (contentLower.includes('contact') && contentLower.includes('phone'))
    ) {
      return 'contact';
    }
    
    // Service page detection
    if (
      urlLower.includes('/service') ||
      urlLower.includes('/product') ||
      titleLower.includes('service') ||
      contentLower.includes('we offer') ||
      contentLower.includes('our service')
    ) {
      return 'service';
    }
    
    // Location page detection
    if (
      urlLower.includes('/location') ||
      urlLower.includes('/office') ||
      titleLower.includes('location') ||
      /\b(office|branch|store)\b/i.test(content)
    ) {
      return 'location';
    }
    
    // Service area page detection
    if (
      urlLower.includes('/area') ||
      urlLower.includes('/coverage') ||
      titleLower.includes('service area') ||
      contentLower.includes('we serve') ||
      contentLower.includes('service area')
    ) {
      return 'service-area';
    }
    
    // About page detection
    if (
      urlLower.includes('/about') ||
      titleLower.includes('about') ||
      contentLower.includes('our story') ||
      contentLower.includes('our company')
    ) {
      return 'about';
    }
    
    return 'other';
  }

  /**
   * Fetch robots.txt content
   */
  private async fetchRobotsTxt(baseUrl: string): Promise<string | undefined> {
    try {
      const robotsUrl = new URL('/robots.txt', baseUrl).toString();
      const response = await axios.get(robotsUrl, { timeout: 5000 });
      return response.data;
    } catch (error) {
      return undefined;
    }
  }

  /**
   * Extract sitemap URLs
   */
  private async extractSitemapUrls(baseUrl: string): Promise<string[]> {
    const sitemapUrls: string[] = [];
    
    try {
      // Try common sitemap locations
      const commonSitemaps = ['/sitemap.xml', '/sitemap.html', '/sitemap_index.xml'];
      
      for (const path of commonSitemaps) {
        const sitemapUrl = new URL(path, baseUrl).toString();
        if (await this.urlExists(sitemapUrl)) {
          
          // If it's an XML sitemap, try to parse it for URLs
          if (path.endsWith('.xml')) {
            const urls = await this.parseSitemap(sitemapUrl);
            sitemapUrls.push(...urls);
          } else {
            sitemapUrls.push(sitemapUrl);
          }
        }
      }
      
      // Check robots.txt for sitemap declarations
      const robotsTxt = await this.fetchRobotsTxt(baseUrl);
      if (robotsTxt) {
        const sitemapMatches = robotsTxt.match(/Sitemap:\s*(.+)/gi);
        if (sitemapMatches) {
          for (const match of sitemapMatches) {
            const url = match.replace(/Sitemap:\s*/i, '').trim();
            const urls = await this.parseSitemap(url);
            sitemapUrls.push(...urls);
          }
        }
      }
      
    } catch (error) {
      console.warn(`[SiteCrawling] Sitemap extraction failed for ${baseUrl}:`, error instanceof Error ? error.message : 'Unknown error');
    }
    
    return [...new Set(sitemapUrls)]; // Remove duplicates
  }

  /**
   * Parse XML sitemap for URLs
   */
  private async parseSitemap(sitemapUrl: string): Promise<string[]> {
    try {
      const response = await axios.get(sitemapUrl, { timeout: 10000 });
      const $ = cheerio.load(response.data, { xmlMode: true });
      
      const urls: string[] = [];
      
      $('url > loc').each((_, element) => {
        const url = $(element).text().trim();
        if (url) urls.push(url);
      });
      
      return urls.slice(0, 50); // Limit to first 50 URLs
      
    } catch (error) {
      console.warn(`[SiteCrawling] Failed to parse sitemap ${sitemapUrl}:`, error instanceof Error ? error.message : 'Unknown error');
      return [];
    }
  }

  /**
   * Check if URL exists and is accessible
   */
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

  /**
   * Resolve relative URL to absolute URL
   */
  private resolveUrl(href: string, baseUrl: string): string {
    try {
      return new URL(href, baseUrl).toString();
    } catch (error) {
      return href;
    }
  }

  /**
   * Check if URL is valid for crawling
   */
  private isValidUrl(url: string, baseUrlObj: URL, includeSubdomains: boolean): boolean {
    try {
      const urlObj = new URL(url);
      
      // Skip non-HTTP protocols
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return false;
      }
      
      // Skip file extensions we don't want to crawl
      const skipExtensions = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.gif', '.zip', '.mp4', '.mp3'];
      if (skipExtensions.some(ext => urlObj.pathname.toLowerCase().endsWith(ext))) {
        return false;
      }
      
      // Check domain matching
      if (includeSubdomains) {
        return urlObj.hostname.endsWith(baseUrlObj.hostname) || urlObj.hostname === baseUrlObj.hostname;
      } else {
        return urlObj.hostname === baseUrlObj.hostname;
      }
      
    } catch (error) {
      return false;
    }
  }
}