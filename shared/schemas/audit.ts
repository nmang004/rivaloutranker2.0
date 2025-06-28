import { pgTable, text, serial, integer, boolean, jsonb, timestamp, index, varchar, real } from "drizzle-orm/pg-core";
import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { users, teams } from "./core";

/**
 * Enhanced Audit Schemas for Rival Outranker 2.0
 * Preserves the sophisticated 140+ factor analysis system while adding new capabilities
 */

// ==================== AUDIT STATUS & IMPORTANCE ENUMS ====================

export const auditStatusSchema = z.enum([
  'Priority OFI',  // Critical finding, corrective action strongly recommended
  'OFI',           // Opportunity for improvement
  'OK',            // No issues found / Complete
  'N/A'            // Not applicable
]);

export const seoImportanceSchema = z.enum([
  'High',
  'Medium', 
  'Low'
]);

export const auditTypeSchema = z.enum([
  'standard',      // 50+ factor analysis
  'comprehensive', // 140+ factor professional audit
  'technical',     // Technical SEO focus
  'content',       // Content analysis focus
  'local',         // Local SEO focus
  'competitor'     // Competitor comparison
]);

// ==================== ENHANCED AUDIT ITEM SCHEMAS ====================

export const auditItemSchema = z.object({
  name: z.string(),
  description: z.string(),
  status: auditStatusSchema,
  importance: seoImportanceSchema,
  notes: z.string(),
  category: z.string(),
  score: z.number().min(0).max(100).optional(),
  pageUrl: z.string().optional(),
  pageTitle: z.string().optional(),
  pageType: z.string().optional(),
  analysisDetails: z.object({
    actual: z.union([z.string(), z.number(), z.boolean()]).optional(),
    expected: z.union([z.string(), z.number(), z.boolean()]).optional(),
    metrics: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
    recommendations: z.array(z.string()).optional(),
    difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
    estimatedImpact: z.enum(['low', 'medium', 'high']).optional(),
    priority: z.number().min(1).max(10).optional()
  }).optional()
});

// ==================== PAGE ANALYSIS SCHEMAS ====================

export const pageIssueSummarySchema = z.object({
  pageUrl: z.string(),
  pageTitle: z.string(),
  pageType: z.string(),
  priority: z.number().min(1).max(3).optional(),
  priorityWeight: z.number().optional(),
  priorityOfiCount: z.number(),
  ofiCount: z.number(),
  okCount: z.number(),
  naCount: z.number(),
  totalIssues: z.number(),
  score: z.number().min(0).max(100).optional(),
  weightedScore: z.number().min(0).max(100).optional(),
  topIssues: z.array(z.object({
    name: z.string(),
    status: auditStatusSchema,
    importance: seoImportanceSchema,
    category: z.string()
  })).optional()
});

// ==================== COMPREHENSIVE AUDIT RESULT SCHEMAS ====================

export const auditSectionSchema = z.object({
  items: z.array(auditItemSchema),
  score: z.number().min(0).max(100).optional(),
  completionRate: z.number().min(0).max(100).optional(),
  categoryScores: z.record(z.string(), z.number()).optional(),
  insights: z.array(z.string()).optional()
});

// AI Insights Schema
export const aiInsightsSchema = z.object({
  contentAnalysis: z.object({
    contentGaps: z.array(z.string()),
    semanticRecommendations: z.array(z.string()),
    keywordOpportunities: z.array(z.string()),
    readabilityInsights: z.array(z.string()),
    entityAnalysis: z.object({
      entities: z.array(z.string()),
      authorityIndicators: z.array(z.string()),
      eeatScore: z.number()
    }),
    contentScore: z.number()
  }),
  strategicRecommendations: z.object({
    priorityActions: z.array(z.object({
      title: z.string(),
      impact: z.string(),
      difficulty: z.string(),
      timeframe: z.string(),
      category: z.string(),
      description: z.string()
    })),
    quickWins: z.array(z.string()),
    longTermStrategy: z.array(z.string()),
    implementationPlan: z.array(z.object({
      phase: z.string(),
      timeline: z.string(),
      actions: z.array(z.string()),
      expectedOutcome: z.string()
    }))
  }),
  contentStrategy: z.array(z.string()),
  generatedAt: z.string(),
  aiModel: z.string(),
  error: z.string().optional()
}).optional();

export const enhancedAuditResultSchema = z.object({
  summary: z.object({
    totalFactors: z.number(),
    priorityOfiCount: z.number(),
    ofiCount: z.number(),
    okCount: z.number(),
    naCount: z.number(),
    overallScore: z.number().min(0).max(100).optional(),
    categoryScores: z.object({
      contentQuality: z.number().min(0).max(100).optional(),
      technicalSEO: z.number().min(0).max(100).optional(),
      localSEO: z.number().min(0).max(100).optional(),
      uxPerformance: z.number().min(0).max(100).optional()
    }).optional(),
    recommendations: z.array(z.string()).optional(),
    estimatedFixTime: z.string().optional()
  }),
  // Legacy audit sections (preserved for compatibility)
  onPage: auditSectionSchema,
  structureNavigation: auditSectionSchema,
  contactPage: auditSectionSchema,
  servicePages: auditSectionSchema,
  locationPages: auditSectionSchema,
  serviceAreaPages: auditSectionSchema.optional(),
  // Enhanced audit sections (140+ factors)
  contentQuality: auditSectionSchema,
  technicalSEO: auditSectionSchema,
  localSEO: auditSectionSchema,
  uxPerformance: auditSectionSchema,
  // Page-specific analysis
  pageAnalysis: z.array(pageIssueSummarySchema).optional(),
  // Competitive analysis
  competitorComparison: z.object({
    competitors: z.array(z.object({
      url: z.string(),
      score: z.number(),
      strengths: z.array(z.string()),
      weaknesses: z.array(z.string())
    })).optional(),
    gaps: z.array(z.string()).optional(),
    opportunities: z.array(z.string()).optional()
  }).optional(),
  // Additional metadata
  crawlMetadata: z.object({
    pagesAnalyzed: z.number(),
    maxPagesReached: z.boolean().optional(),
    crawlDuration: z.number().optional(),
    errors: z.array(z.string()).optional()
  }).optional(),
  // AI-powered insights
  aiInsights: aiInsightsSchema
});

// ==================== DATABASE TABLES ====================

export const audits = pgTable("audits", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  teamId: integer("team_id").references(() => teams.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  title: varchar("title", { length: 255 }),
  type: varchar("type", { length: 50 }).notNull().default("comprehensive"),
  status: varchar("status", { length: 20 }).notNull().default("pending"), // pending, running, completed, failed
  progress: integer("progress").default(0), // 0-100
  
  // Core audit results (preserving sophisticated algorithm)
  results: jsonb("results").$type<z.infer<typeof enhancedAuditResultSchema>>(),
  
  // Analysis configuration
  config: jsonb("config").$type<{
    maxPages?: number;
    includeSubdomains?: boolean;
    analyzeCompetitors?: boolean;
    competitorUrls?: string[];
    focusAreas?: string[];
    customFactors?: object[];
  }>(),
  
  // Performance metrics
  metrics: jsonb("metrics").$type<{
    analysisTimeMs: number;
    pagesAnalyzed: number;
    factorsAnalyzed: number;
    apiCallsUsed: number;
    costUsd?: number;
  }>(),
  
  // Export tracking
  exports: jsonb("exports").$type<{
    excel?: { generatedAt: string; downloadCount: number; };
    pdf?: { generatedAt: string; downloadCount: number; };
    csv?: { generatedAt: string; downloadCount: number; };
  }>(),
  
  // Scheduling and automation
  isScheduled: boolean("is_scheduled").default(false),
  scheduleConfig: jsonb("schedule_config").$type<{
    frequency?: 'daily' | 'weekly' | 'monthly';
    dayOfWeek?: number;
    dayOfMonth?: number;
    time?: string;
    timezone?: string;
    nextRun?: string;
  }>(),
  
  // Collaboration features
  sharedWith: jsonb("shared_with").$type<{
    users?: number[];
    teams?: number[];
    publicLink?: { enabled: boolean; token: string; expiresAt?: string; };
  }>(),
  
  // Timestamps
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index("audits_user_id_idx").on(table.userId),
  teamIdIdx: index("audits_team_id_idx").on(table.teamId),
  urlIdx: index("audits_url_idx").on(table.url),
  statusIdx: index("audits_status_idx").on(table.status),
  typeIdx: index("audits_type_idx").on(table.type),
  createdAtIdx: index("audits_created_at_idx").on(table.createdAt),
  scheduledIdx: index("audits_scheduled_idx").on(table.isScheduled),
}));

export const auditHistory = pgTable("audit_history", {
  id: serial("id").primaryKey(),
  auditId: integer("audit_id").notNull().references(() => audits.id, { onDelete: "cascade" }),
  version: integer("version").notNull(),
  results: jsonb("results").$type<z.infer<typeof enhancedAuditResultSchema>>(),
  changes: jsonb("changes").$type<{
    added: string[];
    removed: string[];
    modified: string[];
    scoreChange: number;
  }>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  auditIdIdx: index("audit_history_audit_id_idx").on(table.auditId),
  versionIdx: index("audit_history_version_idx").on(table.version),
  createdAtIdx: index("audit_history_created_at_idx").on(table.createdAt),
}));

export const auditComments = pgTable("audit_comments", {
  id: serial("id").primaryKey(),
  auditId: integer("audit_id").notNull().references(() => audits.id, { onDelete: "cascade" }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  factorName: varchar("factor_name", { length: 255 }), // Optional: comment on specific factor
  content: text("content").notNull(),
  isResolved: boolean("is_resolved").default(false),
  resolvedBy: integer("resolved_by").references(() => users.id),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  auditIdIdx: index("audit_comments_audit_id_idx").on(table.auditId),
  userIdIdx: index("audit_comments_user_id_idx").on(table.userId),
  factorNameIdx: index("audit_comments_factor_name_idx").on(table.factorName),
}));

// ==================== CRAWL JOBS & SITE STRUCTURE ====================

export const crawlJobs = pgTable("crawl_jobs", {
  id: serial("id").primaryKey(),
  auditId: integer("audit_id").references(() => audits.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  progress: integer("progress").default(0),
  pagesFound: integer("pages_found").default(0),
  pagesAnalyzed: integer("pages_analyzed").default(0),
  errors: jsonb("errors").$type<string[]>(),
  siteStructure: jsonb("site_structure").$type<{
    homepage?: object;
    contactPage?: object;
    servicePages?: object[];
    locationPages?: object[];
    otherPages?: object[];
    sitemapUrls?: string[];
    robotsTxt?: string;
  }>(),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  auditIdIdx: index("crawl_jobs_audit_id_idx").on(table.auditId),
  urlIdx: index("crawl_jobs_url_idx").on(table.url),
  statusIdx: index("crawl_jobs_status_idx").on(table.status),
}));

// ==================== ZOD VALIDATION SCHEMAS ====================

export const insertAuditSchema = createInsertSchema(audits, {
  url: z.string().url(),
  type: auditTypeSchema,
  title: z.string().max(255).optional(),
});

export const selectAuditSchema = createSelectSchema(audits);

export const insertAuditHistorySchema = createInsertSchema(auditHistory);
export const selectAuditHistorySchema = createSelectSchema(auditHistory);

export const insertAuditCommentSchema = createInsertSchema(auditComments, {
  content: z.string().min(1),
});
export const selectAuditCommentSchema = createSelectSchema(auditComments);

export const insertCrawlJobSchema = createInsertSchema(crawlJobs, {
  url: z.string().url(),
});
export const selectCrawlJobSchema = createSelectSchema(crawlJobs);

// ==================== TYPE EXPORTS ====================

export type Audit = typeof audits.$inferSelect;
export type NewAudit = typeof audits.$inferInsert;
export type AuditHistory = typeof auditHistory.$inferSelect;
export type NewAuditHistory = typeof auditHistory.$inferInsert;
export type AuditComment = typeof auditComments.$inferSelect;
export type NewAuditComment = typeof auditComments.$inferInsert;
export type CrawlJob = typeof crawlJobs.$inferSelect;
export type NewCrawlJob = typeof crawlJobs.$inferInsert;

