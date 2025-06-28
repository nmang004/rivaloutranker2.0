import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { createError } from './error-handler';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
    teamId?: number;
  };
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    // Demo account bypass - allow requests with demo user in development/Railway
    const isDemoMode = process.env.NODE_ENV === 'development' || process.env.RAILWAY_ENVIRONMENT;
    const userAgent = req.headers['user-agent'] || '';
    const isDemo = req.headers['x-demo-user'] === 'true' || 
                   req.query.demo === 'true' ||
                   userAgent.includes('Demo') ||
                   req.headers.authorization === 'Bearer demo-token';

    if (isDemoMode && isDemo) {
      req.user = {
        id: 999999, // Demo user ID
        email: 'demo@rivaloutranker.com',
        role: 'admin', // Give admin permissions for demo
        teamId: 1
      };
      console.log('[Auth] Demo user bypass activated');
      return next();
    }

    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // In demo mode, create a temporary demo user if no auth provided
      if (isDemoMode) {
        req.user = {
          id: 999999,
          email: 'demo@rivaloutranker.com', 
          role: 'admin',
          teamId: 1
        };
        console.log('[Auth] Auto-created demo user for unauthenticated request');
        return next();
      }
      throw createError('Authentication required', 401, 'AUTH_REQUIRED');
    }
    
    const token = authHeader.substring(7);
    
    if (!process.env.JWT_SECRET) {
      throw createError('JWT secret not configured', 500, 'CONFIG_ERROR');
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
    
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role || 'user',
      teamId: decoded.teamId
    };
    
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(createError('Invalid authentication token', 401, 'INVALID_TOKEN'));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(createError('Authentication token expired', 401, 'TOKEN_EXPIRED'));
    } else {
      next(error);
    }
  }
}

export function optionalAuthMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(); // Continue without authentication
    }
    
    const token = authHeader.substring(7);
    
    if (!process.env.JWT_SECRET) {
      return next(); // Continue without authentication if not configured
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
    
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role || 'user',
      teamId: decoded.teamId
    };
    
    next();
  } catch (error) {
    // If token is invalid, continue without authentication
    next();
  }
}

export function requireRole(role: string) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(createError('Authentication required', 401, 'AUTH_REQUIRED'));
    }
    
    if (req.user.role !== role && req.user.role !== 'admin') {
      return next(createError('Insufficient permissions', 403, 'INSUFFICIENT_PERMISSIONS'));
    }
    
    next();
  };
}