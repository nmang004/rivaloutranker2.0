import { z } from "zod";
/**
 * Analysis Schemas for Standard SEO Analysis (50+ factors)
 * Preserves the sophisticated analysis engine from the original system
 */
export declare const analysisTypeSchema: z.ZodEnum<["basic", "standard", "deep", "competitor", "keyword"]>;
export declare const analysisConfigSchema: z.ZodObject<{
    targetKeyword: z.ZodOptional<z.ZodString>;
    competitorUrls: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    runDeepContentAnalysis: z.ZodDefault<z.ZodBoolean>;
    includeCompetitorAnalysis: z.ZodDefault<z.ZodBoolean>;
    analysisDepth: z.ZodDefault<z.ZodEnum<["basic", "standard", "deep", "competitor", "keyword"]>>;
    customFactors: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    focusAreas: z.ZodOptional<z.ZodArray<z.ZodEnum<["content", "technical", "local", "mobile", "speed"]>, "many">>;
}, "strip", z.ZodTypeAny, {
    runDeepContentAnalysis: boolean;
    includeCompetitorAnalysis: boolean;
    analysisDepth: "standard" | "basic" | "deep" | "competitor" | "keyword";
    targetKeyword?: string | undefined;
    competitorUrls?: string[] | undefined;
    customFactors?: string[] | undefined;
    focusAreas?: ("content" | "technical" | "local" | "mobile" | "speed")[] | undefined;
}, {
    targetKeyword?: string | undefined;
    competitorUrls?: string[] | undefined;
    runDeepContentAnalysis?: boolean | undefined;
    includeCompetitorAnalysis?: boolean | undefined;
    analysisDepth?: "standard" | "basic" | "deep" | "competitor" | "keyword" | undefined;
    customFactors?: string[] | undefined;
    focusAreas?: ("content" | "technical" | "local" | "mobile" | "speed")[] | undefined;
}>;
export declare const contentAnalysisSchema: z.ZodObject<{
    wordCount: z.ZodNumber;
    keywordDensity: z.ZodRecord<z.ZodString, z.ZodNumber>;
    readabilityScore: z.ZodNumber;
    headingStructure: z.ZodObject<{
        h1Count: z.ZodNumber;
        h2Count: z.ZodNumber;
        h3Count: z.ZodNumber;
        missingH1: z.ZodBoolean;
        properHierarchy: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        h1Count: number;
        h2Count: number;
        h3Count: number;
        missingH1: boolean;
        properHierarchy: boolean;
    }, {
        h1Count: number;
        h2Count: number;
        h3Count: number;
        missingH1: boolean;
        properHierarchy: boolean;
    }>;
    contentQuality: z.ZodObject<{
        uniqueness: z.ZodNumber;
        relevance: z.ZodNumber;
        engagement: z.ZodNumber;
        expertise: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        uniqueness: number;
        relevance: number;
        engagement: number;
        expertise: number;
    }, {
        uniqueness: number;
        relevance: number;
        engagement: number;
        expertise: number;
    }>;
    aiInsights: z.ZodOptional<z.ZodObject<{
        topicRelevance: z.ZodString;
        contentGaps: z.ZodArray<z.ZodString, "many">;
        improvementSuggestions: z.ZodArray<z.ZodString, "many">;
        semanticKeywords: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        topicRelevance: string;
        contentGaps: string[];
        improvementSuggestions: string[];
        semanticKeywords: string[];
    }, {
        topicRelevance: string;
        contentGaps: string[];
        improvementSuggestions: string[];
        semanticKeywords: string[];
    }>>;
}, "strip", z.ZodTypeAny, {
    wordCount: number;
    keywordDensity: Record<string, number>;
    readabilityScore: number;
    headingStructure: {
        h1Count: number;
        h2Count: number;
        h3Count: number;
        missingH1: boolean;
        properHierarchy: boolean;
    };
    contentQuality: {
        uniqueness: number;
        relevance: number;
        engagement: number;
        expertise: number;
    };
    aiInsights?: {
        topicRelevance: string;
        contentGaps: string[];
        improvementSuggestions: string[];
        semanticKeywords: string[];
    } | undefined;
}, {
    wordCount: number;
    keywordDensity: Record<string, number>;
    readabilityScore: number;
    headingStructure: {
        h1Count: number;
        h2Count: number;
        h3Count: number;
        missingH1: boolean;
        properHierarchy: boolean;
    };
    contentQuality: {
        uniqueness: number;
        relevance: number;
        engagement: number;
        expertise: number;
    };
    aiInsights?: {
        topicRelevance: string;
        contentGaps: string[];
        improvementSuggestions: string[];
        semanticKeywords: string[];
    } | undefined;
}>;
export declare const technicalAnalysisSchema: z.ZodObject<{
    pageSpeed: z.ZodObject<{
        mobile: z.ZodOptional<z.ZodNumber>;
        desktop: z.ZodOptional<z.ZodNumber>;
        coreWebVitals: z.ZodOptional<z.ZodObject<{
            lcp: z.ZodOptional<z.ZodNumber>;
            fid: z.ZodOptional<z.ZodNumber>;
            cls: z.ZodOptional<z.ZodNumber>;
            inp: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            lcp?: number | undefined;
            fid?: number | undefined;
            cls?: number | undefined;
            inp?: number | undefined;
        }, {
            lcp?: number | undefined;
            fid?: number | undefined;
            cls?: number | undefined;
            inp?: number | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        mobile?: number | undefined;
        desktop?: number | undefined;
        coreWebVitals?: {
            lcp?: number | undefined;
            fid?: number | undefined;
            cls?: number | undefined;
            inp?: number | undefined;
        } | undefined;
    }, {
        mobile?: number | undefined;
        desktop?: number | undefined;
        coreWebVitals?: {
            lcp?: number | undefined;
            fid?: number | undefined;
            cls?: number | undefined;
            inp?: number | undefined;
        } | undefined;
    }>;
    seoTechnicals: z.ZodObject<{
        metaTitle: z.ZodObject<{
            exists: z.ZodBoolean;
            length: z.ZodNumber;
            keywordPresent: z.ZodBoolean;
            isOptimized: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            length: number;
            exists: boolean;
            keywordPresent: boolean;
            isOptimized: boolean;
        }, {
            length: number;
            exists: boolean;
            keywordPresent: boolean;
            isOptimized: boolean;
        }>;
        metaDescription: z.ZodObject<{
            exists: z.ZodBoolean;
            length: z.ZodNumber;
            keywordPresent: z.ZodBoolean;
            isOptimized: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            length: number;
            exists: boolean;
            keywordPresent: boolean;
            isOptimized: boolean;
        }, {
            length: number;
            exists: boolean;
            keywordPresent: boolean;
            isOptimized: boolean;
        }>;
        canonicalTag: z.ZodBoolean;
        schemaMarkup: z.ZodArray<z.ZodString, "many">;
        robotsTxt: z.ZodBoolean;
        sitemap: z.ZodBoolean;
        sslCertificate: z.ZodBoolean;
        mobileResponsive: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        metaTitle: {
            length: number;
            exists: boolean;
            keywordPresent: boolean;
            isOptimized: boolean;
        };
        metaDescription: {
            length: number;
            exists: boolean;
            keywordPresent: boolean;
            isOptimized: boolean;
        };
        canonicalTag: boolean;
        schemaMarkup: string[];
        robotsTxt: boolean;
        sitemap: boolean;
        sslCertificate: boolean;
        mobileResponsive: boolean;
    }, {
        metaTitle: {
            length: number;
            exists: boolean;
            keywordPresent: boolean;
            isOptimized: boolean;
        };
        metaDescription: {
            length: number;
            exists: boolean;
            keywordPresent: boolean;
            isOptimized: boolean;
        };
        canonicalTag: boolean;
        schemaMarkup: string[];
        robotsTxt: boolean;
        sitemap: boolean;
        sslCertificate: boolean;
        mobileResponsive: boolean;
    }>;
    images: z.ZodObject<{
        total: z.ZodNumber;
        withAltText: z.ZodNumber;
        optimized: z.ZodNumber;
        webpFormat: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        total: number;
        withAltText: number;
        optimized: number;
        webpFormat: number;
    }, {
        total: number;
        withAltText: number;
        optimized: number;
        webpFormat: number;
    }>;
}, "strip", z.ZodTypeAny, {
    pageSpeed: {
        mobile?: number | undefined;
        desktop?: number | undefined;
        coreWebVitals?: {
            lcp?: number | undefined;
            fid?: number | undefined;
            cls?: number | undefined;
            inp?: number | undefined;
        } | undefined;
    };
    seoTechnicals: {
        metaTitle: {
            length: number;
            exists: boolean;
            keywordPresent: boolean;
            isOptimized: boolean;
        };
        metaDescription: {
            length: number;
            exists: boolean;
            keywordPresent: boolean;
            isOptimized: boolean;
        };
        canonicalTag: boolean;
        schemaMarkup: string[];
        robotsTxt: boolean;
        sitemap: boolean;
        sslCertificate: boolean;
        mobileResponsive: boolean;
    };
    images: {
        total: number;
        withAltText: number;
        optimized: number;
        webpFormat: number;
    };
}, {
    pageSpeed: {
        mobile?: number | undefined;
        desktop?: number | undefined;
        coreWebVitals?: {
            lcp?: number | undefined;
            fid?: number | undefined;
            cls?: number | undefined;
            inp?: number | undefined;
        } | undefined;
    };
    seoTechnicals: {
        metaTitle: {
            length: number;
            exists: boolean;
            keywordPresent: boolean;
            isOptimized: boolean;
        };
        metaDescription: {
            length: number;
            exists: boolean;
            keywordPresent: boolean;
            isOptimized: boolean;
        };
        canonicalTag: boolean;
        schemaMarkup: string[];
        robotsTxt: boolean;
        sitemap: boolean;
        sslCertificate: boolean;
        mobileResponsive: boolean;
    };
    images: {
        total: number;
        withAltText: number;
        optimized: number;
        webpFormat: number;
    };
}>;
export declare const localSeoAnalysisSchema: z.ZodObject<{
    businessInfo: z.ZodObject<{
        napConsistency: z.ZodBoolean;
        googleBusinessProfile: z.ZodBoolean;
        localKeywords: z.ZodArray<z.ZodString, "many">;
        localContent: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        napConsistency: boolean;
        googleBusinessProfile: boolean;
        localKeywords: string[];
        localContent: boolean;
    }, {
        napConsistency: boolean;
        googleBusinessProfile: boolean;
        localKeywords: string[];
        localContent: boolean;
    }>;
    citations: z.ZodObject<{
        total: z.ZodNumber;
        consistent: z.ZodNumber;
        incomplete: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        total: number;
        consistent: number;
        incomplete: number;
    }, {
        total: number;
        consistent: number;
        incomplete: number;
    }>;
    reviews: z.ZodObject<{
        averageRating: z.ZodOptional<z.ZodNumber>;
        totalReviews: z.ZodOptional<z.ZodNumber>;
        recentReviews: z.ZodOptional<z.ZodNumber>;
        responseRate: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        averageRating?: number | undefined;
        totalReviews?: number | undefined;
        recentReviews?: number | undefined;
        responseRate?: number | undefined;
    }, {
        averageRating?: number | undefined;
        totalReviews?: number | undefined;
        recentReviews?: number | undefined;
        responseRate?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    businessInfo: {
        napConsistency: boolean;
        googleBusinessProfile: boolean;
        localKeywords: string[];
        localContent: boolean;
    };
    citations: {
        total: number;
        consistent: number;
        incomplete: number;
    };
    reviews: {
        averageRating?: number | undefined;
        totalReviews?: number | undefined;
        recentReviews?: number | undefined;
        responseRate?: number | undefined;
    };
}, {
    businessInfo: {
        napConsistency: boolean;
        googleBusinessProfile: boolean;
        localKeywords: string[];
        localContent: boolean;
    };
    citations: {
        total: number;
        consistent: number;
        incomplete: number;
    };
    reviews: {
        averageRating?: number | undefined;
        totalReviews?: number | undefined;
        recentReviews?: number | undefined;
        responseRate?: number | undefined;
    };
}>;
export declare const competitorAnalysisSchema: z.ZodObject<{
    competitors: z.ZodArray<z.ZodObject<{
        url: z.ZodString;
        title: z.ZodOptional<z.ZodString>;
        metaDescription: z.ZodOptional<z.ZodString>;
        contentLength: z.ZodNumber;
        keywordDensity: z.ZodRecord<z.ZodString, z.ZodNumber>;
        pageSpeed: z.ZodOptional<z.ZodNumber>;
        backlinks: z.ZodOptional<z.ZodNumber>;
        domainAuthority: z.ZodOptional<z.ZodNumber>;
        strengths: z.ZodArray<z.ZodString, "many">;
        weaknesses: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        url: string;
        keywordDensity: Record<string, number>;
        contentLength: number;
        strengths: string[];
        weaknesses: string[];
        pageSpeed?: number | undefined;
        metaDescription?: string | undefined;
        title?: string | undefined;
        backlinks?: number | undefined;
        domainAuthority?: number | undefined;
    }, {
        url: string;
        keywordDensity: Record<string, number>;
        contentLength: number;
        strengths: string[];
        weaknesses: string[];
        pageSpeed?: number | undefined;
        metaDescription?: string | undefined;
        title?: string | undefined;
        backlinks?: number | undefined;
        domainAuthority?: number | undefined;
    }>, "many">;
    comparison: z.ZodObject<{
        contentGaps: z.ZodArray<z.ZodString, "many">;
        keywordOpportunities: z.ZodArray<z.ZodString, "many">;
        technicalAdvantages: z.ZodArray<z.ZodString, "many">;
        improvementAreas: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        contentGaps: string[];
        keywordOpportunities: string[];
        technicalAdvantages: string[];
        improvementAreas: string[];
    }, {
        contentGaps: string[];
        keywordOpportunities: string[];
        technicalAdvantages: string[];
        improvementAreas: string[];
    }>;
}, "strip", z.ZodTypeAny, {
    competitors: {
        url: string;
        keywordDensity: Record<string, number>;
        contentLength: number;
        strengths: string[];
        weaknesses: string[];
        pageSpeed?: number | undefined;
        metaDescription?: string | undefined;
        title?: string | undefined;
        backlinks?: number | undefined;
        domainAuthority?: number | undefined;
    }[];
    comparison: {
        contentGaps: string[];
        keywordOpportunities: string[];
        technicalAdvantages: string[];
        improvementAreas: string[];
    };
}, {
    competitors: {
        url: string;
        keywordDensity: Record<string, number>;
        contentLength: number;
        strengths: string[];
        weaknesses: string[];
        pageSpeed?: number | undefined;
        metaDescription?: string | undefined;
        title?: string | undefined;
        backlinks?: number | undefined;
        domainAuthority?: number | undefined;
    }[];
    comparison: {
        contentGaps: string[];
        keywordOpportunities: string[];
        technicalAdvantages: string[];
        improvementAreas: string[];
    };
}>;
export declare const analysisResultSchema: z.ZodObject<{
    url: z.ZodString;
    targetKeyword: z.ZodOptional<z.ZodString>;
    overallScore: z.ZodNumber;
    categoryScores: z.ZodObject<{
        content: z.ZodNumber;
        technical: z.ZodNumber;
        local: z.ZodOptional<z.ZodNumber>;
        mobile: z.ZodNumber;
        speed: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        content: number;
        technical: number;
        mobile: number;
        speed: number;
        local?: number | undefined;
    }, {
        content: number;
        technical: number;
        mobile: number;
        speed: number;
        local?: number | undefined;
    }>;
    contentAnalysis: z.ZodObject<{
        wordCount: z.ZodNumber;
        keywordDensity: z.ZodRecord<z.ZodString, z.ZodNumber>;
        readabilityScore: z.ZodNumber;
        headingStructure: z.ZodObject<{
            h1Count: z.ZodNumber;
            h2Count: z.ZodNumber;
            h3Count: z.ZodNumber;
            missingH1: z.ZodBoolean;
            properHierarchy: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            h1Count: number;
            h2Count: number;
            h3Count: number;
            missingH1: boolean;
            properHierarchy: boolean;
        }, {
            h1Count: number;
            h2Count: number;
            h3Count: number;
            missingH1: boolean;
            properHierarchy: boolean;
        }>;
        contentQuality: z.ZodObject<{
            uniqueness: z.ZodNumber;
            relevance: z.ZodNumber;
            engagement: z.ZodNumber;
            expertise: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            uniqueness: number;
            relevance: number;
            engagement: number;
            expertise: number;
        }, {
            uniqueness: number;
            relevance: number;
            engagement: number;
            expertise: number;
        }>;
        aiInsights: z.ZodOptional<z.ZodObject<{
            topicRelevance: z.ZodString;
            contentGaps: z.ZodArray<z.ZodString, "many">;
            improvementSuggestions: z.ZodArray<z.ZodString, "many">;
            semanticKeywords: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            topicRelevance: string;
            contentGaps: string[];
            improvementSuggestions: string[];
            semanticKeywords: string[];
        }, {
            topicRelevance: string;
            contentGaps: string[];
            improvementSuggestions: string[];
            semanticKeywords: string[];
        }>>;
    }, "strip", z.ZodTypeAny, {
        wordCount: number;
        keywordDensity: Record<string, number>;
        readabilityScore: number;
        headingStructure: {
            h1Count: number;
            h2Count: number;
            h3Count: number;
            missingH1: boolean;
            properHierarchy: boolean;
        };
        contentQuality: {
            uniqueness: number;
            relevance: number;
            engagement: number;
            expertise: number;
        };
        aiInsights?: {
            topicRelevance: string;
            contentGaps: string[];
            improvementSuggestions: string[];
            semanticKeywords: string[];
        } | undefined;
    }, {
        wordCount: number;
        keywordDensity: Record<string, number>;
        readabilityScore: number;
        headingStructure: {
            h1Count: number;
            h2Count: number;
            h3Count: number;
            missingH1: boolean;
            properHierarchy: boolean;
        };
        contentQuality: {
            uniqueness: number;
            relevance: number;
            engagement: number;
            expertise: number;
        };
        aiInsights?: {
            topicRelevance: string;
            contentGaps: string[];
            improvementSuggestions: string[];
            semanticKeywords: string[];
        } | undefined;
    }>;
    technicalAnalysis: z.ZodObject<{
        pageSpeed: z.ZodObject<{
            mobile: z.ZodOptional<z.ZodNumber>;
            desktop: z.ZodOptional<z.ZodNumber>;
            coreWebVitals: z.ZodOptional<z.ZodObject<{
                lcp: z.ZodOptional<z.ZodNumber>;
                fid: z.ZodOptional<z.ZodNumber>;
                cls: z.ZodOptional<z.ZodNumber>;
                inp: z.ZodOptional<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                lcp?: number | undefined;
                fid?: number | undefined;
                cls?: number | undefined;
                inp?: number | undefined;
            }, {
                lcp?: number | undefined;
                fid?: number | undefined;
                cls?: number | undefined;
                inp?: number | undefined;
            }>>;
        }, "strip", z.ZodTypeAny, {
            mobile?: number | undefined;
            desktop?: number | undefined;
            coreWebVitals?: {
                lcp?: number | undefined;
                fid?: number | undefined;
                cls?: number | undefined;
                inp?: number | undefined;
            } | undefined;
        }, {
            mobile?: number | undefined;
            desktop?: number | undefined;
            coreWebVitals?: {
                lcp?: number | undefined;
                fid?: number | undefined;
                cls?: number | undefined;
                inp?: number | undefined;
            } | undefined;
        }>;
        seoTechnicals: z.ZodObject<{
            metaTitle: z.ZodObject<{
                exists: z.ZodBoolean;
                length: z.ZodNumber;
                keywordPresent: z.ZodBoolean;
                isOptimized: z.ZodBoolean;
            }, "strip", z.ZodTypeAny, {
                length: number;
                exists: boolean;
                keywordPresent: boolean;
                isOptimized: boolean;
            }, {
                length: number;
                exists: boolean;
                keywordPresent: boolean;
                isOptimized: boolean;
            }>;
            metaDescription: z.ZodObject<{
                exists: z.ZodBoolean;
                length: z.ZodNumber;
                keywordPresent: z.ZodBoolean;
                isOptimized: z.ZodBoolean;
            }, "strip", z.ZodTypeAny, {
                length: number;
                exists: boolean;
                keywordPresent: boolean;
                isOptimized: boolean;
            }, {
                length: number;
                exists: boolean;
                keywordPresent: boolean;
                isOptimized: boolean;
            }>;
            canonicalTag: z.ZodBoolean;
            schemaMarkup: z.ZodArray<z.ZodString, "many">;
            robotsTxt: z.ZodBoolean;
            sitemap: z.ZodBoolean;
            sslCertificate: z.ZodBoolean;
            mobileResponsive: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            metaTitle: {
                length: number;
                exists: boolean;
                keywordPresent: boolean;
                isOptimized: boolean;
            };
            metaDescription: {
                length: number;
                exists: boolean;
                keywordPresent: boolean;
                isOptimized: boolean;
            };
            canonicalTag: boolean;
            schemaMarkup: string[];
            robotsTxt: boolean;
            sitemap: boolean;
            sslCertificate: boolean;
            mobileResponsive: boolean;
        }, {
            metaTitle: {
                length: number;
                exists: boolean;
                keywordPresent: boolean;
                isOptimized: boolean;
            };
            metaDescription: {
                length: number;
                exists: boolean;
                keywordPresent: boolean;
                isOptimized: boolean;
            };
            canonicalTag: boolean;
            schemaMarkup: string[];
            robotsTxt: boolean;
            sitemap: boolean;
            sslCertificate: boolean;
            mobileResponsive: boolean;
        }>;
        images: z.ZodObject<{
            total: z.ZodNumber;
            withAltText: z.ZodNumber;
            optimized: z.ZodNumber;
            webpFormat: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            total: number;
            withAltText: number;
            optimized: number;
            webpFormat: number;
        }, {
            total: number;
            withAltText: number;
            optimized: number;
            webpFormat: number;
        }>;
    }, "strip", z.ZodTypeAny, {
        pageSpeed: {
            mobile?: number | undefined;
            desktop?: number | undefined;
            coreWebVitals?: {
                lcp?: number | undefined;
                fid?: number | undefined;
                cls?: number | undefined;
                inp?: number | undefined;
            } | undefined;
        };
        seoTechnicals: {
            metaTitle: {
                length: number;
                exists: boolean;
                keywordPresent: boolean;
                isOptimized: boolean;
            };
            metaDescription: {
                length: number;
                exists: boolean;
                keywordPresent: boolean;
                isOptimized: boolean;
            };
            canonicalTag: boolean;
            schemaMarkup: string[];
            robotsTxt: boolean;
            sitemap: boolean;
            sslCertificate: boolean;
            mobileResponsive: boolean;
        };
        images: {
            total: number;
            withAltText: number;
            optimized: number;
            webpFormat: number;
        };
    }, {
        pageSpeed: {
            mobile?: number | undefined;
            desktop?: number | undefined;
            coreWebVitals?: {
                lcp?: number | undefined;
                fid?: number | undefined;
                cls?: number | undefined;
                inp?: number | undefined;
            } | undefined;
        };
        seoTechnicals: {
            metaTitle: {
                length: number;
                exists: boolean;
                keywordPresent: boolean;
                isOptimized: boolean;
            };
            metaDescription: {
                length: number;
                exists: boolean;
                keywordPresent: boolean;
                isOptimized: boolean;
            };
            canonicalTag: boolean;
            schemaMarkup: string[];
            robotsTxt: boolean;
            sitemap: boolean;
            sslCertificate: boolean;
            mobileResponsive: boolean;
        };
        images: {
            total: number;
            withAltText: number;
            optimized: number;
            webpFormat: number;
        };
    }>;
    localSeoAnalysis: z.ZodOptional<z.ZodObject<{
        businessInfo: z.ZodObject<{
            napConsistency: z.ZodBoolean;
            googleBusinessProfile: z.ZodBoolean;
            localKeywords: z.ZodArray<z.ZodString, "many">;
            localContent: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            napConsistency: boolean;
            googleBusinessProfile: boolean;
            localKeywords: string[];
            localContent: boolean;
        }, {
            napConsistency: boolean;
            googleBusinessProfile: boolean;
            localKeywords: string[];
            localContent: boolean;
        }>;
        citations: z.ZodObject<{
            total: z.ZodNumber;
            consistent: z.ZodNumber;
            incomplete: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            total: number;
            consistent: number;
            incomplete: number;
        }, {
            total: number;
            consistent: number;
            incomplete: number;
        }>;
        reviews: z.ZodObject<{
            averageRating: z.ZodOptional<z.ZodNumber>;
            totalReviews: z.ZodOptional<z.ZodNumber>;
            recentReviews: z.ZodOptional<z.ZodNumber>;
            responseRate: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            averageRating?: number | undefined;
            totalReviews?: number | undefined;
            recentReviews?: number | undefined;
            responseRate?: number | undefined;
        }, {
            averageRating?: number | undefined;
            totalReviews?: number | undefined;
            recentReviews?: number | undefined;
            responseRate?: number | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        businessInfo: {
            napConsistency: boolean;
            googleBusinessProfile: boolean;
            localKeywords: string[];
            localContent: boolean;
        };
        citations: {
            total: number;
            consistent: number;
            incomplete: number;
        };
        reviews: {
            averageRating?: number | undefined;
            totalReviews?: number | undefined;
            recentReviews?: number | undefined;
            responseRate?: number | undefined;
        };
    }, {
        businessInfo: {
            napConsistency: boolean;
            googleBusinessProfile: boolean;
            localKeywords: string[];
            localContent: boolean;
        };
        citations: {
            total: number;
            consistent: number;
            incomplete: number;
        };
        reviews: {
            averageRating?: number | undefined;
            totalReviews?: number | undefined;
            recentReviews?: number | undefined;
            responseRate?: number | undefined;
        };
    }>>;
    competitorAnalysis: z.ZodOptional<z.ZodObject<{
        competitors: z.ZodArray<z.ZodObject<{
            url: z.ZodString;
            title: z.ZodOptional<z.ZodString>;
            metaDescription: z.ZodOptional<z.ZodString>;
            contentLength: z.ZodNumber;
            keywordDensity: z.ZodRecord<z.ZodString, z.ZodNumber>;
            pageSpeed: z.ZodOptional<z.ZodNumber>;
            backlinks: z.ZodOptional<z.ZodNumber>;
            domainAuthority: z.ZodOptional<z.ZodNumber>;
            strengths: z.ZodArray<z.ZodString, "many">;
            weaknesses: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            url: string;
            keywordDensity: Record<string, number>;
            contentLength: number;
            strengths: string[];
            weaknesses: string[];
            pageSpeed?: number | undefined;
            metaDescription?: string | undefined;
            title?: string | undefined;
            backlinks?: number | undefined;
            domainAuthority?: number | undefined;
        }, {
            url: string;
            keywordDensity: Record<string, number>;
            contentLength: number;
            strengths: string[];
            weaknesses: string[];
            pageSpeed?: number | undefined;
            metaDescription?: string | undefined;
            title?: string | undefined;
            backlinks?: number | undefined;
            domainAuthority?: number | undefined;
        }>, "many">;
        comparison: z.ZodObject<{
            contentGaps: z.ZodArray<z.ZodString, "many">;
            keywordOpportunities: z.ZodArray<z.ZodString, "many">;
            technicalAdvantages: z.ZodArray<z.ZodString, "many">;
            improvementAreas: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            contentGaps: string[];
            keywordOpportunities: string[];
            technicalAdvantages: string[];
            improvementAreas: string[];
        }, {
            contentGaps: string[];
            keywordOpportunities: string[];
            technicalAdvantages: string[];
            improvementAreas: string[];
        }>;
    }, "strip", z.ZodTypeAny, {
        competitors: {
            url: string;
            keywordDensity: Record<string, number>;
            contentLength: number;
            strengths: string[];
            weaknesses: string[];
            pageSpeed?: number | undefined;
            metaDescription?: string | undefined;
            title?: string | undefined;
            backlinks?: number | undefined;
            domainAuthority?: number | undefined;
        }[];
        comparison: {
            contentGaps: string[];
            keywordOpportunities: string[];
            technicalAdvantages: string[];
            improvementAreas: string[];
        };
    }, {
        competitors: {
            url: string;
            keywordDensity: Record<string, number>;
            contentLength: number;
            strengths: string[];
            weaknesses: string[];
            pageSpeed?: number | undefined;
            metaDescription?: string | undefined;
            title?: string | undefined;
            backlinks?: number | undefined;
            domainAuthority?: number | undefined;
        }[];
        comparison: {
            contentGaps: string[];
            keywordOpportunities: string[];
            technicalAdvantages: string[];
            improvementAreas: string[];
        };
    }>>;
    recommendations: z.ZodArray<z.ZodObject<{
        category: z.ZodString;
        priority: z.ZodEnum<["high", "medium", "low"]>;
        title: z.ZodString;
        description: z.ZodString;
        impact: z.ZodEnum<["high", "medium", "low"]>;
        difficulty: z.ZodEnum<["easy", "medium", "hard"]>;
        estimatedTime: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        priority: "high" | "medium" | "low";
        description: string;
        title: string;
        category: string;
        impact: "high" | "medium" | "low";
        difficulty: "medium" | "easy" | "hard";
        estimatedTime: string;
    }, {
        priority: "high" | "medium" | "low";
        description: string;
        title: string;
        category: string;
        impact: "high" | "medium" | "low";
        difficulty: "medium" | "easy" | "hard";
        estimatedTime: string;
    }>, "many">;
    insights: z.ZodObject<{
        keywordOpportunities: z.ZodArray<z.ZodString, "many">;
        contentSuggestions: z.ZodArray<z.ZodString, "many">;
        technicalIssues: z.ZodArray<z.ZodString, "many">;
        competitiveAdvantages: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        keywordOpportunities: string[];
        contentSuggestions: string[];
        technicalIssues: string[];
        competitiveAdvantages: string[];
    }, {
        keywordOpportunities: string[];
        contentSuggestions: string[];
        technicalIssues: string[];
        competitiveAdvantages: string[];
    }>;
    metadata: z.ZodObject<{
        analysisType: z.ZodEnum<["basic", "standard", "deep", "competitor", "keyword"]>;
        processingTime: z.ZodNumber;
        apiCallsUsed: z.ZodNumber;
        factorsAnalyzed: z.ZodNumber;
        confidence: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        analysisType: "standard" | "basic" | "deep" | "competitor" | "keyword";
        processingTime: number;
        apiCallsUsed: number;
        factorsAnalyzed: number;
        confidence: number;
    }, {
        analysisType: "standard" | "basic" | "deep" | "competitor" | "keyword";
        processingTime: number;
        apiCallsUsed: number;
        factorsAnalyzed: number;
        confidence: number;
    }>;
}, "strip", z.ZodTypeAny, {
    url: string;
    overallScore: number;
    categoryScores: {
        content: number;
        technical: number;
        mobile: number;
        speed: number;
        local?: number | undefined;
    };
    contentAnalysis: {
        wordCount: number;
        keywordDensity: Record<string, number>;
        readabilityScore: number;
        headingStructure: {
            h1Count: number;
            h2Count: number;
            h3Count: number;
            missingH1: boolean;
            properHierarchy: boolean;
        };
        contentQuality: {
            uniqueness: number;
            relevance: number;
            engagement: number;
            expertise: number;
        };
        aiInsights?: {
            topicRelevance: string;
            contentGaps: string[];
            improvementSuggestions: string[];
            semanticKeywords: string[];
        } | undefined;
    };
    technicalAnalysis: {
        pageSpeed: {
            mobile?: number | undefined;
            desktop?: number | undefined;
            coreWebVitals?: {
                lcp?: number | undefined;
                fid?: number | undefined;
                cls?: number | undefined;
                inp?: number | undefined;
            } | undefined;
        };
        seoTechnicals: {
            metaTitle: {
                length: number;
                exists: boolean;
                keywordPresent: boolean;
                isOptimized: boolean;
            };
            metaDescription: {
                length: number;
                exists: boolean;
                keywordPresent: boolean;
                isOptimized: boolean;
            };
            canonicalTag: boolean;
            schemaMarkup: string[];
            robotsTxt: boolean;
            sitemap: boolean;
            sslCertificate: boolean;
            mobileResponsive: boolean;
        };
        images: {
            total: number;
            withAltText: number;
            optimized: number;
            webpFormat: number;
        };
    };
    recommendations: {
        priority: "high" | "medium" | "low";
        description: string;
        title: string;
        category: string;
        impact: "high" | "medium" | "low";
        difficulty: "medium" | "easy" | "hard";
        estimatedTime: string;
    }[];
    insights: {
        keywordOpportunities: string[];
        contentSuggestions: string[];
        technicalIssues: string[];
        competitiveAdvantages: string[];
    };
    metadata: {
        analysisType: "standard" | "basic" | "deep" | "competitor" | "keyword";
        processingTime: number;
        apiCallsUsed: number;
        factorsAnalyzed: number;
        confidence: number;
    };
    targetKeyword?: string | undefined;
    localSeoAnalysis?: {
        businessInfo: {
            napConsistency: boolean;
            googleBusinessProfile: boolean;
            localKeywords: string[];
            localContent: boolean;
        };
        citations: {
            total: number;
            consistent: number;
            incomplete: number;
        };
        reviews: {
            averageRating?: number | undefined;
            totalReviews?: number | undefined;
            recentReviews?: number | undefined;
            responseRate?: number | undefined;
        };
    } | undefined;
    competitorAnalysis?: {
        competitors: {
            url: string;
            keywordDensity: Record<string, number>;
            contentLength: number;
            strengths: string[];
            weaknesses: string[];
            pageSpeed?: number | undefined;
            metaDescription?: string | undefined;
            title?: string | undefined;
            backlinks?: number | undefined;
            domainAuthority?: number | undefined;
        }[];
        comparison: {
            contentGaps: string[];
            keywordOpportunities: string[];
            technicalAdvantages: string[];
            improvementAreas: string[];
        };
    } | undefined;
}, {
    url: string;
    overallScore: number;
    categoryScores: {
        content: number;
        technical: number;
        mobile: number;
        speed: number;
        local?: number | undefined;
    };
    contentAnalysis: {
        wordCount: number;
        keywordDensity: Record<string, number>;
        readabilityScore: number;
        headingStructure: {
            h1Count: number;
            h2Count: number;
            h3Count: number;
            missingH1: boolean;
            properHierarchy: boolean;
        };
        contentQuality: {
            uniqueness: number;
            relevance: number;
            engagement: number;
            expertise: number;
        };
        aiInsights?: {
            topicRelevance: string;
            contentGaps: string[];
            improvementSuggestions: string[];
            semanticKeywords: string[];
        } | undefined;
    };
    technicalAnalysis: {
        pageSpeed: {
            mobile?: number | undefined;
            desktop?: number | undefined;
            coreWebVitals?: {
                lcp?: number | undefined;
                fid?: number | undefined;
                cls?: number | undefined;
                inp?: number | undefined;
            } | undefined;
        };
        seoTechnicals: {
            metaTitle: {
                length: number;
                exists: boolean;
                keywordPresent: boolean;
                isOptimized: boolean;
            };
            metaDescription: {
                length: number;
                exists: boolean;
                keywordPresent: boolean;
                isOptimized: boolean;
            };
            canonicalTag: boolean;
            schemaMarkup: string[];
            robotsTxt: boolean;
            sitemap: boolean;
            sslCertificate: boolean;
            mobileResponsive: boolean;
        };
        images: {
            total: number;
            withAltText: number;
            optimized: number;
            webpFormat: number;
        };
    };
    recommendations: {
        priority: "high" | "medium" | "low";
        description: string;
        title: string;
        category: string;
        impact: "high" | "medium" | "low";
        difficulty: "medium" | "easy" | "hard";
        estimatedTime: string;
    }[];
    insights: {
        keywordOpportunities: string[];
        contentSuggestions: string[];
        technicalIssues: string[];
        competitiveAdvantages: string[];
    };
    metadata: {
        analysisType: "standard" | "basic" | "deep" | "competitor" | "keyword";
        processingTime: number;
        apiCallsUsed: number;
        factorsAnalyzed: number;
        confidence: number;
    };
    targetKeyword?: string | undefined;
    localSeoAnalysis?: {
        businessInfo: {
            napConsistency: boolean;
            googleBusinessProfile: boolean;
            localKeywords: string[];
            localContent: boolean;
        };
        citations: {
            total: number;
            consistent: number;
            incomplete: number;
        };
        reviews: {
            averageRating?: number | undefined;
            totalReviews?: number | undefined;
            recentReviews?: number | undefined;
            responseRate?: number | undefined;
        };
    } | undefined;
    competitorAnalysis?: {
        competitors: {
            url: string;
            keywordDensity: Record<string, number>;
            contentLength: number;
            strengths: string[];
            weaknesses: string[];
            pageSpeed?: number | undefined;
            metaDescription?: string | undefined;
            title?: string | undefined;
            backlinks?: number | undefined;
            domainAuthority?: number | undefined;
        }[];
        comparison: {
            contentGaps: string[];
            keywordOpportunities: string[];
            technicalAdvantages: string[];
            improvementAreas: string[];
        };
    } | undefined;
}>;
export declare const analyses: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "analyses";
    schema: undefined;
    columns: {
        id: import("drizzle-orm/pg-core").PgColumn<{
            name: "id";
            tableName: "analyses";
            dataType: "number";
            columnType: "PgSerial";
            data: number;
            driverParam: number;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: true;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        userId: import("drizzle-orm/pg-core").PgColumn<{
            name: "user_id";
            tableName: "analyses";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        teamId: import("drizzle-orm/pg-core").PgColumn<{
            name: "team_id";
            tableName: "analyses";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        url: import("drizzle-orm/pg-core").PgColumn<{
            name: "url";
            tableName: "analyses";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        title: import("drizzle-orm/pg-core").PgColumn<{
            name: "title";
            tableName: "analyses";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {
            length: 255;
        }>;
        type: import("drizzle-orm/pg-core").PgColumn<{
            name: "type";
            tableName: "analyses";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {
            length: 50;
        }>;
        status: import("drizzle-orm/pg-core").PgColumn<{
            name: "status";
            tableName: "analyses";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {
            length: 20;
        }>;
        config: import("drizzle-orm/pg-core").PgColumn<{
            name: "config";
            tableName: "analyses";
            dataType: "json";
            columnType: "PgJsonb";
            data: {
                runDeepContentAnalysis: boolean;
                includeCompetitorAnalysis: boolean;
                analysisDepth: "standard" | "basic" | "deep" | "competitor" | "keyword";
                targetKeyword?: string | undefined;
                competitorUrls?: string[] | undefined;
                customFactors?: string[] | undefined;
                focusAreas?: ("content" | "technical" | "local" | "mobile" | "speed")[] | undefined;
            };
            driverParam: unknown;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {
            $type: {
                runDeepContentAnalysis: boolean;
                includeCompetitorAnalysis: boolean;
                analysisDepth: "standard" | "basic" | "deep" | "competitor" | "keyword";
                targetKeyword?: string | undefined;
                competitorUrls?: string[] | undefined;
                customFactors?: string[] | undefined;
                focusAreas?: ("content" | "technical" | "local" | "mobile" | "speed")[] | undefined;
            };
        }>;
        results: import("drizzle-orm/pg-core").PgColumn<{
            name: "results";
            tableName: "analyses";
            dataType: "json";
            columnType: "PgJsonb";
            data: {
                url: string;
                overallScore: number;
                categoryScores: {
                    content: number;
                    technical: number;
                    mobile: number;
                    speed: number;
                    local?: number | undefined;
                };
                contentAnalysis: {
                    wordCount: number;
                    keywordDensity: Record<string, number>;
                    readabilityScore: number;
                    headingStructure: {
                        h1Count: number;
                        h2Count: number;
                        h3Count: number;
                        missingH1: boolean;
                        properHierarchy: boolean;
                    };
                    contentQuality: {
                        uniqueness: number;
                        relevance: number;
                        engagement: number;
                        expertise: number;
                    };
                    aiInsights?: {
                        topicRelevance: string;
                        contentGaps: string[];
                        improvementSuggestions: string[];
                        semanticKeywords: string[];
                    } | undefined;
                };
                technicalAnalysis: {
                    pageSpeed: {
                        mobile?: number | undefined;
                        desktop?: number | undefined;
                        coreWebVitals?: {
                            lcp?: number | undefined;
                            fid?: number | undefined;
                            cls?: number | undefined;
                            inp?: number | undefined;
                        } | undefined;
                    };
                    seoTechnicals: {
                        metaTitle: {
                            length: number;
                            exists: boolean;
                            keywordPresent: boolean;
                            isOptimized: boolean;
                        };
                        metaDescription: {
                            length: number;
                            exists: boolean;
                            keywordPresent: boolean;
                            isOptimized: boolean;
                        };
                        canonicalTag: boolean;
                        schemaMarkup: string[];
                        robotsTxt: boolean;
                        sitemap: boolean;
                        sslCertificate: boolean;
                        mobileResponsive: boolean;
                    };
                    images: {
                        total: number;
                        withAltText: number;
                        optimized: number;
                        webpFormat: number;
                    };
                };
                recommendations: {
                    priority: "high" | "medium" | "low";
                    description: string;
                    title: string;
                    category: string;
                    impact: "high" | "medium" | "low";
                    difficulty: "medium" | "easy" | "hard";
                    estimatedTime: string;
                }[];
                insights: {
                    keywordOpportunities: string[];
                    contentSuggestions: string[];
                    technicalIssues: string[];
                    competitiveAdvantages: string[];
                };
                metadata: {
                    analysisType: "standard" | "basic" | "deep" | "competitor" | "keyword";
                    processingTime: number;
                    apiCallsUsed: number;
                    factorsAnalyzed: number;
                    confidence: number;
                };
                targetKeyword?: string | undefined;
                localSeoAnalysis?: {
                    businessInfo: {
                        napConsistency: boolean;
                        googleBusinessProfile: boolean;
                        localKeywords: string[];
                        localContent: boolean;
                    };
                    citations: {
                        total: number;
                        consistent: number;
                        incomplete: number;
                    };
                    reviews: {
                        averageRating?: number | undefined;
                        totalReviews?: number | undefined;
                        recentReviews?: number | undefined;
                        responseRate?: number | undefined;
                    };
                } | undefined;
                competitorAnalysis?: {
                    competitors: {
                        url: string;
                        keywordDensity: Record<string, number>;
                        contentLength: number;
                        strengths: string[];
                        weaknesses: string[];
                        pageSpeed?: number | undefined;
                        metaDescription?: string | undefined;
                        title?: string | undefined;
                        backlinks?: number | undefined;
                        domainAuthority?: number | undefined;
                    }[];
                    comparison: {
                        contentGaps: string[];
                        keywordOpportunities: string[];
                        technicalAdvantages: string[];
                        improvementAreas: string[];
                    };
                } | undefined;
            };
            driverParam: unknown;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {
            $type: {
                url: string;
                overallScore: number;
                categoryScores: {
                    content: number;
                    technical: number;
                    mobile: number;
                    speed: number;
                    local?: number | undefined;
                };
                contentAnalysis: {
                    wordCount: number;
                    keywordDensity: Record<string, number>;
                    readabilityScore: number;
                    headingStructure: {
                        h1Count: number;
                        h2Count: number;
                        h3Count: number;
                        missingH1: boolean;
                        properHierarchy: boolean;
                    };
                    contentQuality: {
                        uniqueness: number;
                        relevance: number;
                        engagement: number;
                        expertise: number;
                    };
                    aiInsights?: {
                        topicRelevance: string;
                        contentGaps: string[];
                        improvementSuggestions: string[];
                        semanticKeywords: string[];
                    } | undefined;
                };
                technicalAnalysis: {
                    pageSpeed: {
                        mobile?: number | undefined;
                        desktop?: number | undefined;
                        coreWebVitals?: {
                            lcp?: number | undefined;
                            fid?: number | undefined;
                            cls?: number | undefined;
                            inp?: number | undefined;
                        } | undefined;
                    };
                    seoTechnicals: {
                        metaTitle: {
                            length: number;
                            exists: boolean;
                            keywordPresent: boolean;
                            isOptimized: boolean;
                        };
                        metaDescription: {
                            length: number;
                            exists: boolean;
                            keywordPresent: boolean;
                            isOptimized: boolean;
                        };
                        canonicalTag: boolean;
                        schemaMarkup: string[];
                        robotsTxt: boolean;
                        sitemap: boolean;
                        sslCertificate: boolean;
                        mobileResponsive: boolean;
                    };
                    images: {
                        total: number;
                        withAltText: number;
                        optimized: number;
                        webpFormat: number;
                    };
                };
                recommendations: {
                    priority: "high" | "medium" | "low";
                    description: string;
                    title: string;
                    category: string;
                    impact: "high" | "medium" | "low";
                    difficulty: "medium" | "easy" | "hard";
                    estimatedTime: string;
                }[];
                insights: {
                    keywordOpportunities: string[];
                    contentSuggestions: string[];
                    technicalIssues: string[];
                    competitiveAdvantages: string[];
                };
                metadata: {
                    analysisType: "standard" | "basic" | "deep" | "competitor" | "keyword";
                    processingTime: number;
                    apiCallsUsed: number;
                    factorsAnalyzed: number;
                    confidence: number;
                };
                targetKeyword?: string | undefined;
                localSeoAnalysis?: {
                    businessInfo: {
                        napConsistency: boolean;
                        googleBusinessProfile: boolean;
                        localKeywords: string[];
                        localContent: boolean;
                    };
                    citations: {
                        total: number;
                        consistent: number;
                        incomplete: number;
                    };
                    reviews: {
                        averageRating?: number | undefined;
                        totalReviews?: number | undefined;
                        recentReviews?: number | undefined;
                        responseRate?: number | undefined;
                    };
                } | undefined;
                competitorAnalysis?: {
                    competitors: {
                        url: string;
                        keywordDensity: Record<string, number>;
                        contentLength: number;
                        strengths: string[];
                        weaknesses: string[];
                        pageSpeed?: number | undefined;
                        metaDescription?: string | undefined;
                        title?: string | undefined;
                        backlinks?: number | undefined;
                        domainAuthority?: number | undefined;
                    }[];
                    comparison: {
                        contentGaps: string[];
                        keywordOpportunities: string[];
                        technicalAdvantages: string[];
                        improvementAreas: string[];
                    };
                } | undefined;
            };
        }>;
        metrics: import("drizzle-orm/pg-core").PgColumn<{
            name: "metrics";
            tableName: "analyses";
            dataType: "json";
            columnType: "PgJsonb";
            data: {
                processingTimeMs: number;
                apiCallsUsed: number;
                costUsd?: number;
                factorsAnalyzed: number;
                errorCount: number;
            };
            driverParam: unknown;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {
            $type: {
                processingTimeMs: number;
                apiCallsUsed: number;
                costUsd?: number;
                factorsAnalyzed: number;
                errorCount: number;
            };
        }>;
        isPublic: import("drizzle-orm/pg-core").PgColumn<{
            name: "is_public";
            tableName: "analyses";
            dataType: "boolean";
            columnType: "PgBoolean";
            data: boolean;
            driverParam: boolean;
            notNull: false;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        sharedWith: import("drizzle-orm/pg-core").PgColumn<{
            name: "shared_with";
            tableName: "analyses";
            dataType: "json";
            columnType: "PgJsonb";
            data: {
                users?: number[];
                publicToken?: string;
                expiresAt?: string;
            };
            driverParam: unknown;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {
            $type: {
                users?: number[];
                publicToken?: string;
                expiresAt?: string;
            };
        }>;
        startedAt: import("drizzle-orm/pg-core").PgColumn<{
            name: "started_at";
            tableName: "analyses";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        completedAt: import("drizzle-orm/pg-core").PgColumn<{
            name: "completed_at";
            tableName: "analyses";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        createdAt: import("drizzle-orm/pg-core").PgColumn<{
            name: "created_at";
            tableName: "analyses";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        updatedAt: import("drizzle-orm/pg-core").PgColumn<{
            name: "updated_at";
            tableName: "analyses";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
export declare const analysisHistory: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "analysis_history";
    schema: undefined;
    columns: {
        id: import("drizzle-orm/pg-core").PgColumn<{
            name: "id";
            tableName: "analysis_history";
            dataType: "number";
            columnType: "PgSerial";
            data: number;
            driverParam: number;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: true;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        analysisId: import("drizzle-orm/pg-core").PgColumn<{
            name: "analysis_id";
            tableName: "analysis_history";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        version: import("drizzle-orm/pg-core").PgColumn<{
            name: "version";
            tableName: "analysis_history";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        results: import("drizzle-orm/pg-core").PgColumn<{
            name: "results";
            tableName: "analysis_history";
            dataType: "json";
            columnType: "PgJsonb";
            data: {
                url: string;
                overallScore: number;
                categoryScores: {
                    content: number;
                    technical: number;
                    mobile: number;
                    speed: number;
                    local?: number | undefined;
                };
                contentAnalysis: {
                    wordCount: number;
                    keywordDensity: Record<string, number>;
                    readabilityScore: number;
                    headingStructure: {
                        h1Count: number;
                        h2Count: number;
                        h3Count: number;
                        missingH1: boolean;
                        properHierarchy: boolean;
                    };
                    contentQuality: {
                        uniqueness: number;
                        relevance: number;
                        engagement: number;
                        expertise: number;
                    };
                    aiInsights?: {
                        topicRelevance: string;
                        contentGaps: string[];
                        improvementSuggestions: string[];
                        semanticKeywords: string[];
                    } | undefined;
                };
                technicalAnalysis: {
                    pageSpeed: {
                        mobile?: number | undefined;
                        desktop?: number | undefined;
                        coreWebVitals?: {
                            lcp?: number | undefined;
                            fid?: number | undefined;
                            cls?: number | undefined;
                            inp?: number | undefined;
                        } | undefined;
                    };
                    seoTechnicals: {
                        metaTitle: {
                            length: number;
                            exists: boolean;
                            keywordPresent: boolean;
                            isOptimized: boolean;
                        };
                        metaDescription: {
                            length: number;
                            exists: boolean;
                            keywordPresent: boolean;
                            isOptimized: boolean;
                        };
                        canonicalTag: boolean;
                        schemaMarkup: string[];
                        robotsTxt: boolean;
                        sitemap: boolean;
                        sslCertificate: boolean;
                        mobileResponsive: boolean;
                    };
                    images: {
                        total: number;
                        withAltText: number;
                        optimized: number;
                        webpFormat: number;
                    };
                };
                recommendations: {
                    priority: "high" | "medium" | "low";
                    description: string;
                    title: string;
                    category: string;
                    impact: "high" | "medium" | "low";
                    difficulty: "medium" | "easy" | "hard";
                    estimatedTime: string;
                }[];
                insights: {
                    keywordOpportunities: string[];
                    contentSuggestions: string[];
                    technicalIssues: string[];
                    competitiveAdvantages: string[];
                };
                metadata: {
                    analysisType: "standard" | "basic" | "deep" | "competitor" | "keyword";
                    processingTime: number;
                    apiCallsUsed: number;
                    factorsAnalyzed: number;
                    confidence: number;
                };
                targetKeyword?: string | undefined;
                localSeoAnalysis?: {
                    businessInfo: {
                        napConsistency: boolean;
                        googleBusinessProfile: boolean;
                        localKeywords: string[];
                        localContent: boolean;
                    };
                    citations: {
                        total: number;
                        consistent: number;
                        incomplete: number;
                    };
                    reviews: {
                        averageRating?: number | undefined;
                        totalReviews?: number | undefined;
                        recentReviews?: number | undefined;
                        responseRate?: number | undefined;
                    };
                } | undefined;
                competitorAnalysis?: {
                    competitors: {
                        url: string;
                        keywordDensity: Record<string, number>;
                        contentLength: number;
                        strengths: string[];
                        weaknesses: string[];
                        pageSpeed?: number | undefined;
                        metaDescription?: string | undefined;
                        title?: string | undefined;
                        backlinks?: number | undefined;
                        domainAuthority?: number | undefined;
                    }[];
                    comparison: {
                        contentGaps: string[];
                        keywordOpportunities: string[];
                        technicalAdvantages: string[];
                        improvementAreas: string[];
                    };
                } | undefined;
            };
            driverParam: unknown;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {
            $type: {
                url: string;
                overallScore: number;
                categoryScores: {
                    content: number;
                    technical: number;
                    mobile: number;
                    speed: number;
                    local?: number | undefined;
                };
                contentAnalysis: {
                    wordCount: number;
                    keywordDensity: Record<string, number>;
                    readabilityScore: number;
                    headingStructure: {
                        h1Count: number;
                        h2Count: number;
                        h3Count: number;
                        missingH1: boolean;
                        properHierarchy: boolean;
                    };
                    contentQuality: {
                        uniqueness: number;
                        relevance: number;
                        engagement: number;
                        expertise: number;
                    };
                    aiInsights?: {
                        topicRelevance: string;
                        contentGaps: string[];
                        improvementSuggestions: string[];
                        semanticKeywords: string[];
                    } | undefined;
                };
                technicalAnalysis: {
                    pageSpeed: {
                        mobile?: number | undefined;
                        desktop?: number | undefined;
                        coreWebVitals?: {
                            lcp?: number | undefined;
                            fid?: number | undefined;
                            cls?: number | undefined;
                            inp?: number | undefined;
                        } | undefined;
                    };
                    seoTechnicals: {
                        metaTitle: {
                            length: number;
                            exists: boolean;
                            keywordPresent: boolean;
                            isOptimized: boolean;
                        };
                        metaDescription: {
                            length: number;
                            exists: boolean;
                            keywordPresent: boolean;
                            isOptimized: boolean;
                        };
                        canonicalTag: boolean;
                        schemaMarkup: string[];
                        robotsTxt: boolean;
                        sitemap: boolean;
                        sslCertificate: boolean;
                        mobileResponsive: boolean;
                    };
                    images: {
                        total: number;
                        withAltText: number;
                        optimized: number;
                        webpFormat: number;
                    };
                };
                recommendations: {
                    priority: "high" | "medium" | "low";
                    description: string;
                    title: string;
                    category: string;
                    impact: "high" | "medium" | "low";
                    difficulty: "medium" | "easy" | "hard";
                    estimatedTime: string;
                }[];
                insights: {
                    keywordOpportunities: string[];
                    contentSuggestions: string[];
                    technicalIssues: string[];
                    competitiveAdvantages: string[];
                };
                metadata: {
                    analysisType: "standard" | "basic" | "deep" | "competitor" | "keyword";
                    processingTime: number;
                    apiCallsUsed: number;
                    factorsAnalyzed: number;
                    confidence: number;
                };
                targetKeyword?: string | undefined;
                localSeoAnalysis?: {
                    businessInfo: {
                        napConsistency: boolean;
                        googleBusinessProfile: boolean;
                        localKeywords: string[];
                        localContent: boolean;
                    };
                    citations: {
                        total: number;
                        consistent: number;
                        incomplete: number;
                    };
                    reviews: {
                        averageRating?: number | undefined;
                        totalReviews?: number | undefined;
                        recentReviews?: number | undefined;
                        responseRate?: number | undefined;
                    };
                } | undefined;
                competitorAnalysis?: {
                    competitors: {
                        url: string;
                        keywordDensity: Record<string, number>;
                        contentLength: number;
                        strengths: string[];
                        weaknesses: string[];
                        pageSpeed?: number | undefined;
                        metaDescription?: string | undefined;
                        title?: string | undefined;
                        backlinks?: number | undefined;
                        domainAuthority?: number | undefined;
                    }[];
                    comparison: {
                        contentGaps: string[];
                        keywordOpportunities: string[];
                        technicalAdvantages: string[];
                        improvementAreas: string[];
                    };
                } | undefined;
            };
        }>;
        scoreChange: import("drizzle-orm/pg-core").PgColumn<{
            name: "score_change";
            tableName: "analysis_history";
            dataType: "number";
            columnType: "PgReal";
            data: number;
            driverParam: string | number;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        keyChanges: import("drizzle-orm/pg-core").PgColumn<{
            name: "key_changes";
            tableName: "analysis_history";
            dataType: "json";
            columnType: "PgJsonb";
            data: {
                improved: string[];
                declined: string[];
                new: string[];
            };
            driverParam: unknown;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {
            $type: {
                improved: string[];
                declined: string[];
                new: string[];
            };
        }>;
        createdAt: import("drizzle-orm/pg-core").PgColumn<{
            name: "created_at";
            tableName: "analysis_history";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
export declare const projects: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "projects";
    schema: undefined;
    columns: {
        id: import("drizzle-orm/pg-core").PgColumn<{
            name: "id";
            tableName: "projects";
            dataType: "number";
            columnType: "PgSerial";
            data: number;
            driverParam: number;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: true;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        userId: import("drizzle-orm/pg-core").PgColumn<{
            name: "user_id";
            tableName: "projects";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        teamId: import("drizzle-orm/pg-core").PgColumn<{
            name: "team_id";
            tableName: "projects";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        name: import("drizzle-orm/pg-core").PgColumn<{
            name: "name";
            tableName: "projects";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {
            length: 255;
        }>;
        description: import("drizzle-orm/pg-core").PgColumn<{
            name: "description";
            tableName: "projects";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        url: import("drizzle-orm/pg-core").PgColumn<{
            name: "url";
            tableName: "projects";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        settings: import("drizzle-orm/pg-core").PgColumn<{
            name: "settings";
            tableName: "projects";
            dataType: "json";
            columnType: "PgJsonb";
            data: {
                trackingKeywords?: string[];
                competitors?: string[];
                analysisFrequency?: "daily" | "weekly" | "monthly";
                alertThresholds?: {
                    scoreDrops?: number;
                    newIssues?: boolean;
                    competitorChanges?: boolean;
                };
            };
            driverParam: unknown;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {
            $type: {
                trackingKeywords?: string[];
                competitors?: string[];
                analysisFrequency?: "daily" | "weekly" | "monthly";
                alertThresholds?: {
                    scoreDrops?: number;
                    newIssues?: boolean;
                    competitorChanges?: boolean;
                };
            };
        }>;
        isActive: import("drizzle-orm/pg-core").PgColumn<{
            name: "is_active";
            tableName: "projects";
            dataType: "boolean";
            columnType: "PgBoolean";
            data: boolean;
            driverParam: boolean;
            notNull: false;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        lastAnalyzed: import("drizzle-orm/pg-core").PgColumn<{
            name: "last_analyzed";
            tableName: "projects";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        nextAnalysis: import("drizzle-orm/pg-core").PgColumn<{
            name: "next_analysis";
            tableName: "projects";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        createdAt: import("drizzle-orm/pg-core").PgColumn<{
            name: "created_at";
            tableName: "projects";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        updatedAt: import("drizzle-orm/pg-core").PgColumn<{
            name: "updated_at";
            tableName: "projects";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
export declare const insertAnalysisSchema: import("drizzle-zod").BuildSchema<"insert", {
    id: import("drizzle-orm/pg-core").PgColumn<{
        name: "id";
        tableName: "analyses";
        dataType: "number";
        columnType: "PgSerial";
        data: number;
        driverParam: number;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: true;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    userId: import("drizzle-orm/pg-core").PgColumn<{
        name: "user_id";
        tableName: "analyses";
        dataType: "number";
        columnType: "PgInteger";
        data: number;
        driverParam: string | number;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    teamId: import("drizzle-orm/pg-core").PgColumn<{
        name: "team_id";
        tableName: "analyses";
        dataType: "number";
        columnType: "PgInteger";
        data: number;
        driverParam: string | number;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    url: import("drizzle-orm/pg-core").PgColumn<{
        name: "url";
        tableName: "analyses";
        dataType: "string";
        columnType: "PgText";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    title: import("drizzle-orm/pg-core").PgColumn<{
        name: "title";
        tableName: "analyses";
        dataType: "string";
        columnType: "PgVarchar";
        data: string;
        driverParam: string;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {
        length: 255;
    }>;
    type: import("drizzle-orm/pg-core").PgColumn<{
        name: "type";
        tableName: "analyses";
        dataType: "string";
        columnType: "PgVarchar";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {
        length: 50;
    }>;
    status: import("drizzle-orm/pg-core").PgColumn<{
        name: "status";
        tableName: "analyses";
        dataType: "string";
        columnType: "PgVarchar";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {
        length: 20;
    }>;
    config: import("drizzle-orm/pg-core").PgColumn<{
        name: "config";
        tableName: "analyses";
        dataType: "json";
        columnType: "PgJsonb";
        data: {
            runDeepContentAnalysis: boolean;
            includeCompetitorAnalysis: boolean;
            analysisDepth: "standard" | "basic" | "deep" | "competitor" | "keyword";
            targetKeyword?: string | undefined;
            competitorUrls?: string[] | undefined;
            customFactors?: string[] | undefined;
            focusAreas?: ("content" | "technical" | "local" | "mobile" | "speed")[] | undefined;
        };
        driverParam: unknown;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {
        $type: {
            runDeepContentAnalysis: boolean;
            includeCompetitorAnalysis: boolean;
            analysisDepth: "standard" | "basic" | "deep" | "competitor" | "keyword";
            targetKeyword?: string | undefined;
            competitorUrls?: string[] | undefined;
            customFactors?: string[] | undefined;
            focusAreas?: ("content" | "technical" | "local" | "mobile" | "speed")[] | undefined;
        };
    }>;
    results: import("drizzle-orm/pg-core").PgColumn<{
        name: "results";
        tableName: "analyses";
        dataType: "json";
        columnType: "PgJsonb";
        data: {
            url: string;
            overallScore: number;
            categoryScores: {
                content: number;
                technical: number;
                mobile: number;
                speed: number;
                local?: number | undefined;
            };
            contentAnalysis: {
                wordCount: number;
                keywordDensity: Record<string, number>;
                readabilityScore: number;
                headingStructure: {
                    h1Count: number;
                    h2Count: number;
                    h3Count: number;
                    missingH1: boolean;
                    properHierarchy: boolean;
                };
                contentQuality: {
                    uniqueness: number;
                    relevance: number;
                    engagement: number;
                    expertise: number;
                };
                aiInsights?: {
                    topicRelevance: string;
                    contentGaps: string[];
                    improvementSuggestions: string[];
                    semanticKeywords: string[];
                } | undefined;
            };
            technicalAnalysis: {
                pageSpeed: {
                    mobile?: number | undefined;
                    desktop?: number | undefined;
                    coreWebVitals?: {
                        lcp?: number | undefined;
                        fid?: number | undefined;
                        cls?: number | undefined;
                        inp?: number | undefined;
                    } | undefined;
                };
                seoTechnicals: {
                    metaTitle: {
                        length: number;
                        exists: boolean;
                        keywordPresent: boolean;
                        isOptimized: boolean;
                    };
                    metaDescription: {
                        length: number;
                        exists: boolean;
                        keywordPresent: boolean;
                        isOptimized: boolean;
                    };
                    canonicalTag: boolean;
                    schemaMarkup: string[];
                    robotsTxt: boolean;
                    sitemap: boolean;
                    sslCertificate: boolean;
                    mobileResponsive: boolean;
                };
                images: {
                    total: number;
                    withAltText: number;
                    optimized: number;
                    webpFormat: number;
                };
            };
            recommendations: {
                priority: "high" | "medium" | "low";
                description: string;
                title: string;
                category: string;
                impact: "high" | "medium" | "low";
                difficulty: "medium" | "easy" | "hard";
                estimatedTime: string;
            }[];
            insights: {
                keywordOpportunities: string[];
                contentSuggestions: string[];
                technicalIssues: string[];
                competitiveAdvantages: string[];
            };
            metadata: {
                analysisType: "standard" | "basic" | "deep" | "competitor" | "keyword";
                processingTime: number;
                apiCallsUsed: number;
                factorsAnalyzed: number;
                confidence: number;
            };
            targetKeyword?: string | undefined;
            localSeoAnalysis?: {
                businessInfo: {
                    napConsistency: boolean;
                    googleBusinessProfile: boolean;
                    localKeywords: string[];
                    localContent: boolean;
                };
                citations: {
                    total: number;
                    consistent: number;
                    incomplete: number;
                };
                reviews: {
                    averageRating?: number | undefined;
                    totalReviews?: number | undefined;
                    recentReviews?: number | undefined;
                    responseRate?: number | undefined;
                };
            } | undefined;
            competitorAnalysis?: {
                competitors: {
                    url: string;
                    keywordDensity: Record<string, number>;
                    contentLength: number;
                    strengths: string[];
                    weaknesses: string[];
                    pageSpeed?: number | undefined;
                    metaDescription?: string | undefined;
                    title?: string | undefined;
                    backlinks?: number | undefined;
                    domainAuthority?: number | undefined;
                }[];
                comparison: {
                    contentGaps: string[];
                    keywordOpportunities: string[];
                    technicalAdvantages: string[];
                    improvementAreas: string[];
                };
            } | undefined;
        };
        driverParam: unknown;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {
        $type: {
            url: string;
            overallScore: number;
            categoryScores: {
                content: number;
                technical: number;
                mobile: number;
                speed: number;
                local?: number | undefined;
            };
            contentAnalysis: {
                wordCount: number;
                keywordDensity: Record<string, number>;
                readabilityScore: number;
                headingStructure: {
                    h1Count: number;
                    h2Count: number;
                    h3Count: number;
                    missingH1: boolean;
                    properHierarchy: boolean;
                };
                contentQuality: {
                    uniqueness: number;
                    relevance: number;
                    engagement: number;
                    expertise: number;
                };
                aiInsights?: {
                    topicRelevance: string;
                    contentGaps: string[];
                    improvementSuggestions: string[];
                    semanticKeywords: string[];
                } | undefined;
            };
            technicalAnalysis: {
                pageSpeed: {
                    mobile?: number | undefined;
                    desktop?: number | undefined;
                    coreWebVitals?: {
                        lcp?: number | undefined;
                        fid?: number | undefined;
                        cls?: number | undefined;
                        inp?: number | undefined;
                    } | undefined;
                };
                seoTechnicals: {
                    metaTitle: {
                        length: number;
                        exists: boolean;
                        keywordPresent: boolean;
                        isOptimized: boolean;
                    };
                    metaDescription: {
                        length: number;
                        exists: boolean;
                        keywordPresent: boolean;
                        isOptimized: boolean;
                    };
                    canonicalTag: boolean;
                    schemaMarkup: string[];
                    robotsTxt: boolean;
                    sitemap: boolean;
                    sslCertificate: boolean;
                    mobileResponsive: boolean;
                };
                images: {
                    total: number;
                    withAltText: number;
                    optimized: number;
                    webpFormat: number;
                };
            };
            recommendations: {
                priority: "high" | "medium" | "low";
                description: string;
                title: string;
                category: string;
                impact: "high" | "medium" | "low";
                difficulty: "medium" | "easy" | "hard";
                estimatedTime: string;
            }[];
            insights: {
                keywordOpportunities: string[];
                contentSuggestions: string[];
                technicalIssues: string[];
                competitiveAdvantages: string[];
            };
            metadata: {
                analysisType: "standard" | "basic" | "deep" | "competitor" | "keyword";
                processingTime: number;
                apiCallsUsed: number;
                factorsAnalyzed: number;
                confidence: number;
            };
            targetKeyword?: string | undefined;
            localSeoAnalysis?: {
                businessInfo: {
                    napConsistency: boolean;
                    googleBusinessProfile: boolean;
                    localKeywords: string[];
                    localContent: boolean;
                };
                citations: {
                    total: number;
                    consistent: number;
                    incomplete: number;
                };
                reviews: {
                    averageRating?: number | undefined;
                    totalReviews?: number | undefined;
                    recentReviews?: number | undefined;
                    responseRate?: number | undefined;
                };
            } | undefined;
            competitorAnalysis?: {
                competitors: {
                    url: string;
                    keywordDensity: Record<string, number>;
                    contentLength: number;
                    strengths: string[];
                    weaknesses: string[];
                    pageSpeed?: number | undefined;
                    metaDescription?: string | undefined;
                    title?: string | undefined;
                    backlinks?: number | undefined;
                    domainAuthority?: number | undefined;
                }[];
                comparison: {
                    contentGaps: string[];
                    keywordOpportunities: string[];
                    technicalAdvantages: string[];
                    improvementAreas: string[];
                };
            } | undefined;
        };
    }>;
    metrics: import("drizzle-orm/pg-core").PgColumn<{
        name: "metrics";
        tableName: "analyses";
        dataType: "json";
        columnType: "PgJsonb";
        data: {
            processingTimeMs: number;
            apiCallsUsed: number;
            costUsd?: number;
            factorsAnalyzed: number;
            errorCount: number;
        };
        driverParam: unknown;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {
        $type: {
            processingTimeMs: number;
            apiCallsUsed: number;
            costUsd?: number;
            factorsAnalyzed: number;
            errorCount: number;
        };
    }>;
    isPublic: import("drizzle-orm/pg-core").PgColumn<{
        name: "is_public";
        tableName: "analyses";
        dataType: "boolean";
        columnType: "PgBoolean";
        data: boolean;
        driverParam: boolean;
        notNull: false;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    sharedWith: import("drizzle-orm/pg-core").PgColumn<{
        name: "shared_with";
        tableName: "analyses";
        dataType: "json";
        columnType: "PgJsonb";
        data: {
            users?: number[];
            publicToken?: string;
            expiresAt?: string;
        };
        driverParam: unknown;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {
        $type: {
            users?: number[];
            publicToken?: string;
            expiresAt?: string;
        };
    }>;
    startedAt: import("drizzle-orm/pg-core").PgColumn<{
        name: "started_at";
        tableName: "analyses";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    completedAt: import("drizzle-orm/pg-core").PgColumn<{
        name: "completed_at";
        tableName: "analyses";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    createdAt: import("drizzle-orm/pg-core").PgColumn<{
        name: "created_at";
        tableName: "analyses";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    updatedAt: import("drizzle-orm/pg-core").PgColumn<{
        name: "updated_at";
        tableName: "analyses";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
}, {
    url: z.ZodString;
    type: z.ZodEnum<["basic", "standard", "deep", "competitor", "keyword"]>;
    title: z.ZodOptional<z.ZodString>;
}>;
export declare const selectAnalysisSchema: import("drizzle-zod").BuildSchema<"select", {
    id: import("drizzle-orm/pg-core").PgColumn<{
        name: "id";
        tableName: "analyses";
        dataType: "number";
        columnType: "PgSerial";
        data: number;
        driverParam: number;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: true;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    userId: import("drizzle-orm/pg-core").PgColumn<{
        name: "user_id";
        tableName: "analyses";
        dataType: "number";
        columnType: "PgInteger";
        data: number;
        driverParam: string | number;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    teamId: import("drizzle-orm/pg-core").PgColumn<{
        name: "team_id";
        tableName: "analyses";
        dataType: "number";
        columnType: "PgInteger";
        data: number;
        driverParam: string | number;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    url: import("drizzle-orm/pg-core").PgColumn<{
        name: "url";
        tableName: "analyses";
        dataType: "string";
        columnType: "PgText";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    title: import("drizzle-orm/pg-core").PgColumn<{
        name: "title";
        tableName: "analyses";
        dataType: "string";
        columnType: "PgVarchar";
        data: string;
        driverParam: string;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {
        length: 255;
    }>;
    type: import("drizzle-orm/pg-core").PgColumn<{
        name: "type";
        tableName: "analyses";
        dataType: "string";
        columnType: "PgVarchar";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {
        length: 50;
    }>;
    status: import("drizzle-orm/pg-core").PgColumn<{
        name: "status";
        tableName: "analyses";
        dataType: "string";
        columnType: "PgVarchar";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {
        length: 20;
    }>;
    config: import("drizzle-orm/pg-core").PgColumn<{
        name: "config";
        tableName: "analyses";
        dataType: "json";
        columnType: "PgJsonb";
        data: {
            runDeepContentAnalysis: boolean;
            includeCompetitorAnalysis: boolean;
            analysisDepth: "standard" | "basic" | "deep" | "competitor" | "keyword";
            targetKeyword?: string | undefined;
            competitorUrls?: string[] | undefined;
            customFactors?: string[] | undefined;
            focusAreas?: ("content" | "technical" | "local" | "mobile" | "speed")[] | undefined;
        };
        driverParam: unknown;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {
        $type: {
            runDeepContentAnalysis: boolean;
            includeCompetitorAnalysis: boolean;
            analysisDepth: "standard" | "basic" | "deep" | "competitor" | "keyword";
            targetKeyword?: string | undefined;
            competitorUrls?: string[] | undefined;
            customFactors?: string[] | undefined;
            focusAreas?: ("content" | "technical" | "local" | "mobile" | "speed")[] | undefined;
        };
    }>;
    results: import("drizzle-orm/pg-core").PgColumn<{
        name: "results";
        tableName: "analyses";
        dataType: "json";
        columnType: "PgJsonb";
        data: {
            url: string;
            overallScore: number;
            categoryScores: {
                content: number;
                technical: number;
                mobile: number;
                speed: number;
                local?: number | undefined;
            };
            contentAnalysis: {
                wordCount: number;
                keywordDensity: Record<string, number>;
                readabilityScore: number;
                headingStructure: {
                    h1Count: number;
                    h2Count: number;
                    h3Count: number;
                    missingH1: boolean;
                    properHierarchy: boolean;
                };
                contentQuality: {
                    uniqueness: number;
                    relevance: number;
                    engagement: number;
                    expertise: number;
                };
                aiInsights?: {
                    topicRelevance: string;
                    contentGaps: string[];
                    improvementSuggestions: string[];
                    semanticKeywords: string[];
                } | undefined;
            };
            technicalAnalysis: {
                pageSpeed: {
                    mobile?: number | undefined;
                    desktop?: number | undefined;
                    coreWebVitals?: {
                        lcp?: number | undefined;
                        fid?: number | undefined;
                        cls?: number | undefined;
                        inp?: number | undefined;
                    } | undefined;
                };
                seoTechnicals: {
                    metaTitle: {
                        length: number;
                        exists: boolean;
                        keywordPresent: boolean;
                        isOptimized: boolean;
                    };
                    metaDescription: {
                        length: number;
                        exists: boolean;
                        keywordPresent: boolean;
                        isOptimized: boolean;
                    };
                    canonicalTag: boolean;
                    schemaMarkup: string[];
                    robotsTxt: boolean;
                    sitemap: boolean;
                    sslCertificate: boolean;
                    mobileResponsive: boolean;
                };
                images: {
                    total: number;
                    withAltText: number;
                    optimized: number;
                    webpFormat: number;
                };
            };
            recommendations: {
                priority: "high" | "medium" | "low";
                description: string;
                title: string;
                category: string;
                impact: "high" | "medium" | "low";
                difficulty: "medium" | "easy" | "hard";
                estimatedTime: string;
            }[];
            insights: {
                keywordOpportunities: string[];
                contentSuggestions: string[];
                technicalIssues: string[];
                competitiveAdvantages: string[];
            };
            metadata: {
                analysisType: "standard" | "basic" | "deep" | "competitor" | "keyword";
                processingTime: number;
                apiCallsUsed: number;
                factorsAnalyzed: number;
                confidence: number;
            };
            targetKeyword?: string | undefined;
            localSeoAnalysis?: {
                businessInfo: {
                    napConsistency: boolean;
                    googleBusinessProfile: boolean;
                    localKeywords: string[];
                    localContent: boolean;
                };
                citations: {
                    total: number;
                    consistent: number;
                    incomplete: number;
                };
                reviews: {
                    averageRating?: number | undefined;
                    totalReviews?: number | undefined;
                    recentReviews?: number | undefined;
                    responseRate?: number | undefined;
                };
            } | undefined;
            competitorAnalysis?: {
                competitors: {
                    url: string;
                    keywordDensity: Record<string, number>;
                    contentLength: number;
                    strengths: string[];
                    weaknesses: string[];
                    pageSpeed?: number | undefined;
                    metaDescription?: string | undefined;
                    title?: string | undefined;
                    backlinks?: number | undefined;
                    domainAuthority?: number | undefined;
                }[];
                comparison: {
                    contentGaps: string[];
                    keywordOpportunities: string[];
                    technicalAdvantages: string[];
                    improvementAreas: string[];
                };
            } | undefined;
        };
        driverParam: unknown;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {
        $type: {
            url: string;
            overallScore: number;
            categoryScores: {
                content: number;
                technical: number;
                mobile: number;
                speed: number;
                local?: number | undefined;
            };
            contentAnalysis: {
                wordCount: number;
                keywordDensity: Record<string, number>;
                readabilityScore: number;
                headingStructure: {
                    h1Count: number;
                    h2Count: number;
                    h3Count: number;
                    missingH1: boolean;
                    properHierarchy: boolean;
                };
                contentQuality: {
                    uniqueness: number;
                    relevance: number;
                    engagement: number;
                    expertise: number;
                };
                aiInsights?: {
                    topicRelevance: string;
                    contentGaps: string[];
                    improvementSuggestions: string[];
                    semanticKeywords: string[];
                } | undefined;
            };
            technicalAnalysis: {
                pageSpeed: {
                    mobile?: number | undefined;
                    desktop?: number | undefined;
                    coreWebVitals?: {
                        lcp?: number | undefined;
                        fid?: number | undefined;
                        cls?: number | undefined;
                        inp?: number | undefined;
                    } | undefined;
                };
                seoTechnicals: {
                    metaTitle: {
                        length: number;
                        exists: boolean;
                        keywordPresent: boolean;
                        isOptimized: boolean;
                    };
                    metaDescription: {
                        length: number;
                        exists: boolean;
                        keywordPresent: boolean;
                        isOptimized: boolean;
                    };
                    canonicalTag: boolean;
                    schemaMarkup: string[];
                    robotsTxt: boolean;
                    sitemap: boolean;
                    sslCertificate: boolean;
                    mobileResponsive: boolean;
                };
                images: {
                    total: number;
                    withAltText: number;
                    optimized: number;
                    webpFormat: number;
                };
            };
            recommendations: {
                priority: "high" | "medium" | "low";
                description: string;
                title: string;
                category: string;
                impact: "high" | "medium" | "low";
                difficulty: "medium" | "easy" | "hard";
                estimatedTime: string;
            }[];
            insights: {
                keywordOpportunities: string[];
                contentSuggestions: string[];
                technicalIssues: string[];
                competitiveAdvantages: string[];
            };
            metadata: {
                analysisType: "standard" | "basic" | "deep" | "competitor" | "keyword";
                processingTime: number;
                apiCallsUsed: number;
                factorsAnalyzed: number;
                confidence: number;
            };
            targetKeyword?: string | undefined;
            localSeoAnalysis?: {
                businessInfo: {
                    napConsistency: boolean;
                    googleBusinessProfile: boolean;
                    localKeywords: string[];
                    localContent: boolean;
                };
                citations: {
                    total: number;
                    consistent: number;
                    incomplete: number;
                };
                reviews: {
                    averageRating?: number | undefined;
                    totalReviews?: number | undefined;
                    recentReviews?: number | undefined;
                    responseRate?: number | undefined;
                };
            } | undefined;
            competitorAnalysis?: {
                competitors: {
                    url: string;
                    keywordDensity: Record<string, number>;
                    contentLength: number;
                    strengths: string[];
                    weaknesses: string[];
                    pageSpeed?: number | undefined;
                    metaDescription?: string | undefined;
                    title?: string | undefined;
                    backlinks?: number | undefined;
                    domainAuthority?: number | undefined;
                }[];
                comparison: {
                    contentGaps: string[];
                    keywordOpportunities: string[];
                    technicalAdvantages: string[];
                    improvementAreas: string[];
                };
            } | undefined;
        };
    }>;
    metrics: import("drizzle-orm/pg-core").PgColumn<{
        name: "metrics";
        tableName: "analyses";
        dataType: "json";
        columnType: "PgJsonb";
        data: {
            processingTimeMs: number;
            apiCallsUsed: number;
            costUsd?: number;
            factorsAnalyzed: number;
            errorCount: number;
        };
        driverParam: unknown;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {
        $type: {
            processingTimeMs: number;
            apiCallsUsed: number;
            costUsd?: number;
            factorsAnalyzed: number;
            errorCount: number;
        };
    }>;
    isPublic: import("drizzle-orm/pg-core").PgColumn<{
        name: "is_public";
        tableName: "analyses";
        dataType: "boolean";
        columnType: "PgBoolean";
        data: boolean;
        driverParam: boolean;
        notNull: false;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    sharedWith: import("drizzle-orm/pg-core").PgColumn<{
        name: "shared_with";
        tableName: "analyses";
        dataType: "json";
        columnType: "PgJsonb";
        data: {
            users?: number[];
            publicToken?: string;
            expiresAt?: string;
        };
        driverParam: unknown;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {
        $type: {
            users?: number[];
            publicToken?: string;
            expiresAt?: string;
        };
    }>;
    startedAt: import("drizzle-orm/pg-core").PgColumn<{
        name: "started_at";
        tableName: "analyses";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    completedAt: import("drizzle-orm/pg-core").PgColumn<{
        name: "completed_at";
        tableName: "analyses";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    createdAt: import("drizzle-orm/pg-core").PgColumn<{
        name: "created_at";
        tableName: "analyses";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    updatedAt: import("drizzle-orm/pg-core").PgColumn<{
        name: "updated_at";
        tableName: "analyses";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
}, undefined>;
export declare const insertProjectSchema: import("drizzle-zod").BuildSchema<"insert", {
    id: import("drizzle-orm/pg-core").PgColumn<{
        name: "id";
        tableName: "projects";
        dataType: "number";
        columnType: "PgSerial";
        data: number;
        driverParam: number;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: true;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    userId: import("drizzle-orm/pg-core").PgColumn<{
        name: "user_id";
        tableName: "projects";
        dataType: "number";
        columnType: "PgInteger";
        data: number;
        driverParam: string | number;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    teamId: import("drizzle-orm/pg-core").PgColumn<{
        name: "team_id";
        tableName: "projects";
        dataType: "number";
        columnType: "PgInteger";
        data: number;
        driverParam: string | number;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    name: import("drizzle-orm/pg-core").PgColumn<{
        name: "name";
        tableName: "projects";
        dataType: "string";
        columnType: "PgVarchar";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {
        length: 255;
    }>;
    description: import("drizzle-orm/pg-core").PgColumn<{
        name: "description";
        tableName: "projects";
        dataType: "string";
        columnType: "PgText";
        data: string;
        driverParam: string;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    url: import("drizzle-orm/pg-core").PgColumn<{
        name: "url";
        tableName: "projects";
        dataType: "string";
        columnType: "PgText";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    settings: import("drizzle-orm/pg-core").PgColumn<{
        name: "settings";
        tableName: "projects";
        dataType: "json";
        columnType: "PgJsonb";
        data: {
            trackingKeywords?: string[];
            competitors?: string[];
            analysisFrequency?: "daily" | "weekly" | "monthly";
            alertThresholds?: {
                scoreDrops?: number;
                newIssues?: boolean;
                competitorChanges?: boolean;
            };
        };
        driverParam: unknown;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {
        $type: {
            trackingKeywords?: string[];
            competitors?: string[];
            analysisFrequency?: "daily" | "weekly" | "monthly";
            alertThresholds?: {
                scoreDrops?: number;
                newIssues?: boolean;
                competitorChanges?: boolean;
            };
        };
    }>;
    isActive: import("drizzle-orm/pg-core").PgColumn<{
        name: "is_active";
        tableName: "projects";
        dataType: "boolean";
        columnType: "PgBoolean";
        data: boolean;
        driverParam: boolean;
        notNull: false;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    lastAnalyzed: import("drizzle-orm/pg-core").PgColumn<{
        name: "last_analyzed";
        tableName: "projects";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    nextAnalysis: import("drizzle-orm/pg-core").PgColumn<{
        name: "next_analysis";
        tableName: "projects";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    createdAt: import("drizzle-orm/pg-core").PgColumn<{
        name: "created_at";
        tableName: "projects";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    updatedAt: import("drizzle-orm/pg-core").PgColumn<{
        name: "updated_at";
        tableName: "projects";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
}, {
    name: z.ZodString;
    url: z.ZodString;
}>;
export declare const selectProjectSchema: import("drizzle-zod").BuildSchema<"select", {
    id: import("drizzle-orm/pg-core").PgColumn<{
        name: "id";
        tableName: "projects";
        dataType: "number";
        columnType: "PgSerial";
        data: number;
        driverParam: number;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: true;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    userId: import("drizzle-orm/pg-core").PgColumn<{
        name: "user_id";
        tableName: "projects";
        dataType: "number";
        columnType: "PgInteger";
        data: number;
        driverParam: string | number;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    teamId: import("drizzle-orm/pg-core").PgColumn<{
        name: "team_id";
        tableName: "projects";
        dataType: "number";
        columnType: "PgInteger";
        data: number;
        driverParam: string | number;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    name: import("drizzle-orm/pg-core").PgColumn<{
        name: "name";
        tableName: "projects";
        dataType: "string";
        columnType: "PgVarchar";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {
        length: 255;
    }>;
    description: import("drizzle-orm/pg-core").PgColumn<{
        name: "description";
        tableName: "projects";
        dataType: "string";
        columnType: "PgText";
        data: string;
        driverParam: string;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    url: import("drizzle-orm/pg-core").PgColumn<{
        name: "url";
        tableName: "projects";
        dataType: "string";
        columnType: "PgText";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    settings: import("drizzle-orm/pg-core").PgColumn<{
        name: "settings";
        tableName: "projects";
        dataType: "json";
        columnType: "PgJsonb";
        data: {
            trackingKeywords?: string[];
            competitors?: string[];
            analysisFrequency?: "daily" | "weekly" | "monthly";
            alertThresholds?: {
                scoreDrops?: number;
                newIssues?: boolean;
                competitorChanges?: boolean;
            };
        };
        driverParam: unknown;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {
        $type: {
            trackingKeywords?: string[];
            competitors?: string[];
            analysisFrequency?: "daily" | "weekly" | "monthly";
            alertThresholds?: {
                scoreDrops?: number;
                newIssues?: boolean;
                competitorChanges?: boolean;
            };
        };
    }>;
    isActive: import("drizzle-orm/pg-core").PgColumn<{
        name: "is_active";
        tableName: "projects";
        dataType: "boolean";
        columnType: "PgBoolean";
        data: boolean;
        driverParam: boolean;
        notNull: false;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    lastAnalyzed: import("drizzle-orm/pg-core").PgColumn<{
        name: "last_analyzed";
        tableName: "projects";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    nextAnalysis: import("drizzle-orm/pg-core").PgColumn<{
        name: "next_analysis";
        tableName: "projects";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    createdAt: import("drizzle-orm/pg-core").PgColumn<{
        name: "created_at";
        tableName: "projects";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    updatedAt: import("drizzle-orm/pg-core").PgColumn<{
        name: "updated_at";
        tableName: "projects";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
}, undefined>;
export type Analysis = typeof analyses.$inferSelect;
export type NewAnalysis = typeof analyses.$inferInsert;
export type AnalysisHistory = typeof analysisHistory.$inferSelect;
export type NewAnalysisHistory = typeof analysisHistory.$inferInsert;
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
