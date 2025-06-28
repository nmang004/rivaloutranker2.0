import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  isOperational?: boolean;
}

export function createError(message: string, statusCode: number = 500, code?: string): AppError {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  error.code = code;
  error.isOperational = true;
  return error;
}

export function errorHandler(
  err: AppError | ZodError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Log error
  console.error('[Error Handler]', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid request data',
      details: err.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message
      }))
    });
  }

  // Handle operational errors
  if (err instanceof Error && (err as AppError).isOperational) {
    return res.status((err as AppError).statusCode || 500).json({
      error: err.name || 'Application Error',
      message: err.message,
      code: (err as AppError).code
    });
  }

  // Handle known error types
  if (err.message.includes('ENOTFOUND') || err.message.includes('timeout')) {
    return res.status(503).json({
      error: 'Service Unavailable',
      message: 'External service temporarily unavailable',
      code: 'SERVICE_UNAVAILABLE'
    });
  }

  if (err.message.includes('ECONNREFUSED')) {
    return res.status(503).json({
      error: 'Database Connection Error',
      message: 'Unable to connect to database',
      code: 'DB_CONNECTION_ERROR'
    });
  }

  // Default error response
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred' 
      : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
}

export function notFoundHandler(req: Request, res: Response, next: NextFunction) {
  res.status(404).json({
    error: 'Not Found',
    message: `API endpoint ${req.method} ${req.path} not found`,
    availableEndpoints: [
      'GET /api/',
      'POST /api/analysis',
      'POST /api/audit',
      'POST /api/auth/login',
      'POST /api/auth/register'
    ]
  });
}

export function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}