/**
 * Barrel export for all shared types
 * Provides clean imports throughout the application
 */

// Common types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  offset?: number;
}

export interface PaginationResult<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// User types
export interface User {
  id: number;
  email: string;
  name: string;
  teamId?: number;
  role: 'admin' | 'user' | 'viewer';
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  id: string;
  userId: number;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

// Audit & Analysis types
export interface AuditProgress {
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  message?: string;
  data?: any;
}

export interface AnalysisProgress {
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  message?: string;
  data?: any;
}

// WebSocket message types
export interface WebSocketMessage {
  type: string;
  payload?: any;
}

export interface AuditProgressMessage extends WebSocketMessage {
  type: 'audit_progress';
  auditId: string;
  progress: AuditProgress;
}

export interface AnalysisProgressMessage extends WebSocketMessage {
  type: 'analysis_progress';
  analysisId: string;
  progress: AnalysisProgress;
}