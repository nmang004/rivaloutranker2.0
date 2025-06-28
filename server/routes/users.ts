import { Router } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db/connection';
import { users, sessions, apiUsage } from '@/shared/schemas/core';
import { analyses } from '@/shared/schemas/analysis';
import { audits } from '@/shared/schemas/audit';
import { eq, and, desc, count, sum, ne, gte, gt, or, ilike } from 'drizzle-orm';
import { authMiddleware, requireRole, type AuthenticatedRequest } from '../middleware/auth';

const router = Router();

/**
 * GET /api/users/profile
 * Get current user's profile information
 */
router.get('/profile', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;

    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        company: users.company,
        role: users.role,
        isVerified: users.isVerified,
        subscription: users.subscription,
        preferences: users.preferences,
        lastLogin: users.lastLogin,
        createdAt: users.createdAt
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('[Users] Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch profile'
    });
  }
});

/**
 * PUT /api/users/profile
 * Update current user's profile
 */
router.put('/profile', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const updateSchema = z.object({
      firstName: z.string().min(1).max(100).optional(),
      lastName: z.string().min(1).max(100).optional(),
      company: z.string().max(255).optional(),
      preferences: z.object({
        theme: z.enum(['light', 'dark', 'system']).optional(),
        notifications: z.boolean().optional(),
        emailReports: z.boolean().optional(),
        defaultAnalysisDepth: z.enum(['basic', 'standard', 'comprehensive']).optional()
      }).optional()
    });

    const updateData = updateSchema.parse(req.body);
    const userId = req.user!.id;

    console.log(`[Users] Updating profile for user ${userId}`);

    // Get current user data
    const [currentUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Merge preferences with existing ones
    const updatedPreferences = updateData.preferences 
      ? { ...currentUser.preferences, ...updateData.preferences }
      : currentUser.preferences;

    // Update user
    const [updatedUser] = await db
      .update(users)
      .set({
        firstName: updateData.firstName ?? currentUser.firstName,
        lastName: updateData.lastName ?? currentUser.lastName,
        company: updateData.company ?? currentUser.company,
        preferences: updatedPreferences,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        company: users.company,
        role: users.role,
        preferences: users.preferences
      });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('[Users] Update profile error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid profile data',
        details: error.errors
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to update profile'
    });
  }
});

/**
 * PUT /api/users/password
 * Change user password
 */
router.put('/password', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const passwordSchema = z.object({
      currentPassword: z.string().min(1),
      newPassword: z.string().min(8).max(128),
      confirmPassword: z.string()
    }).refine(data => data.newPassword === data.confirmPassword, {
      message: 'New passwords do not match',
      path: ['confirmPassword']
    });

    const { currentPassword, newPassword } = passwordSchema.parse(req.body);
    const userId = req.user!.id;

    console.log(`[Users] Password change request for user ${userId}`);

    // Get current user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        error: 'Current password is incorrect'
      });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await db
      .update(users)
      .set({
        password: hashedNewPassword,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));

    // Invalidate all existing sessions except current one
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const currentToken = authHeader.substring(7);
      await db
        .update(sessions)
        .set({
          isActive: false,
          updatedAt: new Date()
        })
        .where(and(
          eq(sessions.userId, userId),
          ne(sessions.accessToken, currentToken)
        ));
    }

    console.log(`[Users] Password changed successfully for user ${userId}`);

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('[Users] Change password error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid password data',
        details: error.errors
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to change password'
    });
  }
});

/**
 * GET /api/users/dashboard-stats
 * Get user dashboard statistics
 */
router.get('/dashboard-stats', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;

    // Get analyses count
    const [analysesCount] = await db
      .select({ count: count() })
      .from(analyses)
      .where(eq(analyses.userId, userId));

    // Get audits count
    const [auditsCount] = await db
      .select({ count: count() })
      .from(audits)
      .where(eq(audits.userId, userId));

    // Get recent analyses
    const recentAnalyses = await db
      .select({
        id: analyses.id,
        url: analyses.url,
        title: analyses.title,
        type: analyses.type,
        status: analyses.status,
        createdAt: analyses.createdAt
      })
      .from(analyses)
      .where(eq(analyses.userId, userId))
      .orderBy(desc(analyses.createdAt))
      .limit(5);

    // Get recent audits
    const recentAudits = await db
      .select({
        id: audits.id,
        url: audits.url,
        title: audits.title,
        type: audits.type,
        status: audits.status,
        progress: audits.progress,
        createdAt: audits.createdAt
      })
      .from(audits)
      .where(eq(audits.userId, userId))
      .orderBy(desc(audits.createdAt))
      .limit(5);

    // Get API usage stats for current month
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const [apiStats] = await db
      .select({ 
        totalCalls: count(),
        totalCost: sum(apiUsage.costUsd)
      })
      .from(apiUsage)
      .where(and(
        eq(apiUsage.userId, userId),
        gte(apiUsage.createdAt, currentMonth)
      ));

    res.json({
      success: true,
      stats: {
        totalAnalyses: Number(analysesCount.count),
        totalAudits: Number(auditsCount.count),
        apiCallsThisMonth: Number(apiStats.totalCalls || 0),
        apiCostThisMonth: Number(apiStats.totalCost || 0) / 100, // Convert cents to dollars
        recentAnalyses,
        recentAudits
      }
    });

  } catch (error) {
    console.error('[Users] Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard statistics'
    });
  }
});

/**
 * GET /api/users/sessions
 * Get active sessions for user
 */
router.get('/sessions', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;

    const activeSessions = await db
      .select({
        id: sessions.id,
        userAgent: sessions.userAgent,
        ipAddress: sessions.ipAddress,
        createdAt: sessions.createdAt,
        expires: sessions.expires
      })
      .from(sessions)
      .where(and(
        eq(sessions.userId, userId),
        eq(sessions.isActive, true),
        gt(sessions.expires, new Date())
      ))
      .orderBy(desc(sessions.createdAt));

    res.json({
      success: true,
      sessions: activeSessions
    });

  } catch (error) {
    console.error('[Users] Get sessions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch sessions'
    });
  }
});

/**
 * DELETE /api/users/sessions/:sessionId
 * Revoke a specific session
 */
router.delete('/sessions/:sessionId', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const sessionId = req.params.sessionId;
    const userId = req.user!.id;

    await db
      .update(sessions)
      .set({
        isActive: false,
        updatedAt: new Date()
      })
      .where(and(
        eq(sessions.id, sessionId),
        eq(sessions.userId, userId)
      ));

    res.json({
      success: true,
      message: 'Session revoked successfully'
    });

  } catch (error) {
    console.error('[Users] Revoke session error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to revoke session'
    });
  }
});

/**
 * DELETE /api/users/sessions
 * Revoke all sessions except current
 */
router.delete('/sessions', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;
    
    // Get current session token to exclude from revocation
    const authHeader = req.headers.authorization;
    let currentToken = '';
    if (authHeader) {
      currentToken = authHeader.substring(7);
    }

    await db
      .update(sessions)
      .set({
        isActive: false,
        updatedAt: new Date()
      })
      .where(and(
        eq(sessions.userId, userId),
        ne(sessions.accessToken, currentToken)
      ));

    res.json({
      success: true,
      message: 'All other sessions revoked successfully'
    });

  } catch (error) {
    console.error('[Users] Revoke all sessions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to revoke sessions'
    });
  }
});

/**
 * DELETE /api/users/account
 * Delete user account (soft delete)
 */
router.delete('/account', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const confirmationSchema = z.object({
      password: z.string().min(1),
      confirmation: z.literal('DELETE_MY_ACCOUNT')
    });

    const { password, confirmation } = confirmationSchema.parse(req.body);
    const userId = req.user!.id;

    console.log(`[Users] Account deletion request for user ${userId}`);

    // Get user to verify password
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        error: 'Incorrect password'
      });
    }

    // Soft delete - deactivate account and anonymize data
    await db
      .update(users)
      .set({
        isActive: false,
        email: `deleted_${userId}@example.com`,
        firstName: 'Deleted',
        lastName: 'User',
        company: null,
        preferences: null,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));

    // Invalidate all sessions
    await db
      .update(sessions)
      .set({
        isActive: false,
        updatedAt: new Date()
      })
      .where(eq(sessions.userId, userId));

    console.log(`[Users] Account deleted for user ${userId}`);

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });

  } catch (error) {
    console.error('[Users] Delete account error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid confirmation data',
        details: error.errors
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to delete account'
    });
  }
});

/**
 * GET /api/users (Admin only)
 * List all users with pagination
 */
router.get('/', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const querySchema = z.object({
      page: z.string().transform(Number).pipe(z.number().int().min(1)).optional().default('1'),
      limit: z.string().transform(Number).pipe(z.number().int().min(1).max(100)).optional().default('20'),
      search: z.string().optional(),
      role: z.enum(['user', 'admin', 'agency']).optional(),
      isActive: z.enum(['true', 'false']).optional()
    });

    const { page, limit, search, role, isActive } = querySchema.parse(req.query);
    const offset = (Number(page) - 1) * Number(limit);

    let whereConditions = [];
    
    if (search) {
      whereConditions.push(
        or(
          ilike(users.email, `%${search}%`),
          ilike(users.firstName, `%${search}%`),
          ilike(users.lastName, `%${search}%`),
          ilike(users.company, `%${search}%`)
        )
      );
    }

    if (role) {
      whereConditions.push(eq(users.role, role));
    }

    if (isActive !== undefined) {
      whereConditions.push(eq(users.isActive, isActive === 'true'));
    }

    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

    const allUsers = await db
      .select({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        company: users.company,
        role: users.role,
        isVerified: users.isVerified,
        isActive: users.isActive,
        subscription: users.subscription,
        lastLogin: users.lastLogin,
        createdAt: users.createdAt
      })
      .from(users)
      .where(whereClause)
      .orderBy(desc(users.createdAt))
      .limit(Number(limit))
      .offset(offset);

    // Get total count
    const [{ count: totalCount }] = await db
      .select({ count: count() })
      .from(users)
      .where(whereClause);

    res.json({
      success: true,
      users: allUsers,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: Number(totalCount),
        pages: Math.ceil(Number(totalCount) / Number(limit))
      }
    });

  } catch (error) {
    console.error('[Users] List users error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid query parameters',
        details: error.errors
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to fetch users'
    });
  }
});

/**
 * PUT /api/users/:userId/role (Admin only)
 * Update user role
 */
router.put('/:userId/role', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const roleSchema = z.object({
      role: z.enum(['user', 'admin', 'agency'])
    });

    const { role } = roleSchema.parse(req.body);
    const userId = parseInt(req.params.userId);

    console.log(`[Users] Role update request for user ${userId} to ${role}`);

    const [updatedUser] = await db
      .update(users)
      .set({
        role,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        email: users.email,
        role: users.role
      });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User role updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('[Users] Update role error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid role data',
        details: error.errors
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to update user role'
    });
  }
});

export default router;