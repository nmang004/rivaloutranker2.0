/**
 * Barrel export for all database schemas
 * Provides clean imports throughout the application
 */

// Core schemas
export * from './core';
export * from './audit';
export * from './analysis';

// Re-export commonly used types
export type {
  User,
  NewUser,
  Session,
  Team,
  TeamMember,
} from './core';

export type {
  Audit,
  NewAudit,
  AuditHistory,
  AuditComment,
  CrawlJob,
} from './audit';

export type {
  Analysis,
  NewAnalysis,
  Project,
  NewProject,
  AnalysisHistory,
} from './analysis';

// Re-export validation schemas
export {
  auditStatusSchema,
  seoImportanceSchema,
  auditTypeSchema,
  auditItemSchema,
  enhancedAuditResultSchema,
} from './audit';

export {
  analysisTypeSchema,
  analysisConfigSchema,
  analysisResultSchema,
  contentAnalysisSchema,
  technicalAnalysisSchema,
  localSeoAnalysisSchema,
  competitorAnalysisSchema,
} from './analysis';