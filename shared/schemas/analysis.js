import { pgTable, text, serial, integer, boolean, jsonb, timestamp, index, varchar, real } from "drizzle-orm/pg-core";
import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { users, teams } from "./core";
/**
 * Analysis Schemas for Standard SEO Analysis (50+ factors)
 * Preserves the sophisticated analysis engine from the original system
 */
// ==================== ANALYSIS CONFIGURATION SCHEMAS ====================
export const analysisTypeSchema = z.enum([
    'basic', // Basic SEO check (20 factors)
    'standard', // Standard analysis (50+ factors) 
    'deep', // Deep content analysis with AI
    'competitor', // Competitor comparison analysis
    'keyword' // Keyword-focused analysis
]);
export const analysisConfigSchema = z.object({
    targetKeyword: z.string().optional(),
    competitorUrls: z.array(z.string()).optional(),
    runDeepContentAnalysis: z.boolean().default(false),
    includeCompetitorAnalysis: z.boolean().default(false),
    analysisDepth: analysisTypeSchema.default('standard'),
    customFactors: z.array(z.string()).optional(),
    focusAreas: z.array(z.enum(['content', 'technical', 'local', 'mobile', 'speed'])).optional()
});
// ==================== CONTENT ANALYSIS SCHEMAS ====================
export const contentAnalysisSchema = z.object({
    wordCount: z.number(),
    keywordDensity: z.record(z.string(), z.number()),
    readabilityScore: z.number(),
    headingStructure: z.object({
        h1Count: z.number(),
        h2Count: z.number(),
        h3Count: z.number(),
        missingH1: z.boolean(),
        properHierarchy: z.boolean()
    }),
    contentQuality: z.object({
        uniqueness: z.number().min(0).max(100),
        relevance: z.number().min(0).max(100),
        engagement: z.number().min(0).max(100),
        expertise: z.number().min(0).max(100)
    }),
    aiInsights: z.object({
        topicRelevance: z.string(),
        contentGaps: z.array(z.string()),
        improvementSuggestions: z.array(z.string()),
        semanticKeywords: z.array(z.string())
    }).optional()
});
// ==================== TECHNICAL ANALYSIS SCHEMAS ====================
export const technicalAnalysisSchema = z.object({
    pageSpeed: z.object({
        mobile: z.number().optional(),
        desktop: z.number().optional(),
        coreWebVitals: z.object({
            lcp: z.number().optional(),
            fid: z.number().optional(),
            cls: z.number().optional(),
            inp: z.number().optional()
        }).optional()
    }),
    seoTechnicals: z.object({
        metaTitle: z.object({
            exists: z.boolean(),
            length: z.number(),
            keywordPresent: z.boolean(),
            isOptimized: z.boolean()
        }),
        metaDescription: z.object({
            exists: z.boolean(),
            length: z.number(),
            keywordPresent: z.boolean(),
            isOptimized: z.boolean()
        }),
        canonicalTag: z.boolean(),
        schemaMarkup: z.array(z.string()),
        robotsTxt: z.boolean(),
        sitemap: z.boolean(),
        sslCertificate: z.boolean(),
        mobileResponsive: z.boolean()
    }),
    images: z.object({
        total: z.number(),
        withAltText: z.number(),
        optimized: z.number(),
        webpFormat: z.number()
    })
});
// ==================== LOCAL SEO ANALYSIS SCHEMAS ====================
export const localSeoAnalysisSchema = z.object({
    businessInfo: z.object({
        napConsistency: z.boolean(),
        googleBusinessProfile: z.boolean(),
        localKeywords: z.array(z.string()),
        localContent: z.boolean()
    }),
    citations: z.object({
        total: z.number(),
        consistent: z.number(),
        incomplete: z.number()
    }),
    reviews: z.object({
        averageRating: z.number().optional(),
        totalReviews: z.number().optional(),
        recentReviews: z.number().optional(),
        responseRate: z.number().optional()
    })
});
// ==================== COMPETITOR ANALYSIS SCHEMAS ====================
export const competitorAnalysisSchema = z.object({
    competitors: z.array(z.object({
        url: z.string(),
        title: z.string().optional(),
        metaDescription: z.string().optional(),
        contentLength: z.number(),
        keywordDensity: z.record(z.string(), z.number()),
        pageSpeed: z.number().optional(),
        backlinks: z.number().optional(),
        domainAuthority: z.number().optional(),
        strengths: z.array(z.string()),
        weaknesses: z.array(z.string())
    })),
    comparison: z.object({
        contentGaps: z.array(z.string()),
        keywordOpportunities: z.array(z.string()),
        technicalAdvantages: z.array(z.string()),
        improvementAreas: z.array(z.string())
    })
});
// ==================== COMPREHENSIVE ANALYSIS RESULT SCHEMA ====================
export const analysisResultSchema = z.object({
    url: z.string(),
    targetKeyword: z.string().optional(),
    overallScore: z.number().min(0).max(100),
    // Category scores
    categoryScores: z.object({
        content: z.number().min(0).max(100),
        technical: z.number().min(0).max(100),
        local: z.number().min(0).max(100).optional(),
        mobile: z.number().min(0).max(100),
        speed: z.number().min(0).max(100)
    }),
    // Detailed analysis results
    contentAnalysis: contentAnalysisSchema,
    technicalAnalysis: technicalAnalysisSchema,
    localSeoAnalysis: localSeoAnalysisSchema.optional(),
    competitorAnalysis: competitorAnalysisSchema.optional(),
    // Priority recommendations
    recommendations: z.array(z.object({
        category: z.string(),
        priority: z.enum(['high', 'medium', 'low']),
        title: z.string(),
        description: z.string(),
        impact: z.enum(['high', 'medium', 'low']),
        difficulty: z.enum(['easy', 'medium', 'hard']),
        estimatedTime: z.string()
    })),
    // Additional insights
    insights: z.object({
        keywordOpportunities: z.array(z.string()),
        contentSuggestions: z.array(z.string()),
        technicalIssues: z.array(z.string()),
        competitiveAdvantages: z.array(z.string())
    }),
    // Analysis metadata
    metadata: z.object({
        analysisType: analysisTypeSchema,
        processingTime: z.number(),
        apiCallsUsed: z.number(),
        factorsAnalyzed: z.number(),
        confidence: z.number().min(0).max(100)
    })
});
// ==================== DATABASE TABLES ====================
export const analyses = pgTable("analyses", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
    teamId: integer("team_id").references(() => teams.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    title: varchar("title", { length: 255 }),
    type: varchar("type", { length: 50 }).notNull().default("standard"),
    status: varchar("status", { length: 20 }).notNull().default("pending"),
    // Analysis configuration
    config: jsonb("config").$type(),
    // Analysis results
    results: jsonb("results").$type(),
    // Performance tracking
    metrics: jsonb("metrics").$type(),
    // Sharing and collaboration
    isPublic: boolean("is_public").default(false),
    sharedWith: jsonb("shared_with").$type(),
    // Timestamps
    startedAt: timestamp("started_at"),
    completedAt: timestamp("completed_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
    userIdIdx: index("analyses_user_id_idx").on(table.userId),
    teamIdIdx: index("analyses_team_id_idx").on(table.teamId),
    urlIdx: index("analyses_url_idx").on(table.url),
    statusIdx: index("analyses_status_idx").on(table.status),
    typeIdx: index("analyses_type_idx").on(table.type),
    createdAtIdx: index("analyses_created_at_idx").on(table.createdAt),
    publicIdx: index("analyses_public_idx").on(table.isPublic),
}));
export const analysisHistory = pgTable("analysis_history", {
    id: serial("id").primaryKey(),
    analysisId: integer("analysis_id").notNull().references(() => analyses.id, { onDelete: "cascade" }),
    version: integer("version").notNull(),
    results: jsonb("results").$type(),
    scoreChange: real("score_change"),
    keyChanges: jsonb("key_changes").$type(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
    analysisIdIdx: index("analysis_history_analysis_id_idx").on(table.analysisId),
    versionIdx: index("analysis_history_version_idx").on(table.version),
    createdAtIdx: index("analysis_history_created_at_idx").on(table.createdAt),
}));
export const projects = pgTable("projects", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    teamId: integer("team_id").references(() => teams.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    url: text("url").notNull(),
    // Project configuration
    settings: jsonb("settings").$type(),
    // Project status
    isActive: boolean("is_active").default(true),
    lastAnalyzed: timestamp("last_analyzed"),
    nextAnalysis: timestamp("next_analysis"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
    userIdIdx: index("projects_user_id_idx").on(table.userId),
    teamIdIdx: index("projects_team_id_idx").on(table.teamId),
    urlIdx: index("projects_url_idx").on(table.url),
    activeIdx: index("projects_active_idx").on(table.isActive),
}));
// ==================== ZOD VALIDATION SCHEMAS ====================
export const insertAnalysisSchema = createInsertSchema(analyses, {
    url: z.string().url(),
    type: analysisTypeSchema,
    title: z.string().max(255).optional(),
});
export const selectAnalysisSchema = createSelectSchema(analyses);
export const insertProjectSchema = createInsertSchema(projects, {
    name: z.string().min(1).max(255),
    url: z.string().url(),
});
export const selectProjectSchema = createSelectSchema(projects);
