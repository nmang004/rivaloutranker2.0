import { Router } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { db } from '@/lib/db/connection';
import { users, sessions } from '@/shared/schemas/core';
import { eq, and, gt } from 'drizzle-orm';
import { authMiddleware, type AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Environment variables
const JWT_SECRET: string = process.env.JWT_SECRET || 'your-secret-key';
const JWT_REFRESH_SECRET: string = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '15m';
const JWT_REFRESH_EXPIRES_IN: string = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

/**
 * POST /api/auth/register
 * Register a new user account
 */
router.post('/register', async (req, res) => {
  try {
    const registrationSchema = z.object({
      email: z.string().email(),
      password: z.string().min(8).max(128),
      firstName: z.string().min(1).max(100).optional(),
      lastName: z.string().min(1).max(100).optional(),
      company: z.string().max(255).optional(),
      agreeToTerms: z.boolean().refine(val => val === true, {
        message: 'You must agree to the terms of service'
      })
    });

    const { email, password, firstName, lastName, company } = registrationSchema.parse(req.body);

    console.log(`[Auth] Registration attempt for ${email}`);

    // Check if user already exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'User already exists',
        message: 'An account with this email address already exists'
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        company,
        emailVerificationToken,
        subscription: {
          plan: 'free',
          status: 'active'
        },
        preferences: {
          theme: 'system',
          notifications: true,
          emailReports: true,
          defaultAnalysisDepth: 'standard'
        }
      })
      .returning({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        company: users.company,
        isVerified: users.isVerified,
        role: users.role
      });

    // Generate tokens
    const { accessToken, refreshToken } = await generateTokenPair(newUser.id, email, newUser.role, req);

    console.log(`[Auth] User registered successfully: ${email}`);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      user: newUser,
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: JWT_EXPIRES_IN
      },
      emailVerificationRequired: true
    });

  } catch (error) {
    console.error('[Auth] Registration error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid registration data',
        details: error.errors
      });
    }

    res.status(500).json({
      success: false,
      error: 'Registration failed',
      message: 'An unexpected error occurred during registration'
    });
  }
});

/**
 * POST /api/auth/login
 * Authenticate user and return tokens
 */
router.post('/login', async (req, res) => {
  try {
    const loginSchema = z.object({
      email: z.string().email(),
      password: z.string().min(1),
      rememberMe: z.boolean().optional().default(false)
    });

    const { email, password, rememberMe } = loginSchema.parse(req.body);

    console.log(`[Auth] Login attempt for ${email}`);

    // Find user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    // Check if account is locked
    if (user.lockoutUntil && new Date(user.lockoutUntil) > new Date()) {
      return res.status(423).json({
        success: false,
        error: 'Account locked',
        message: 'Account temporarily locked due to too many failed login attempts',
        lockoutUntil: user.lockoutUntil
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        error: 'Account disabled',
        message: 'Your account has been disabled. Please contact support.'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      // Increment login attempts
      await handleFailedLogin(user.id, user.loginAttempts || 0);
      
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    // Reset login attempts and update last login
    await db
      .update(users)
      .set({
        loginAttempts: 0,
        lockoutUntil: null,
        lastLogin: new Date(),
        updatedAt: new Date()
      })
      .where(eq(users.id, user.id));

    // Generate tokens (longer expiry if remember me)
    const accessTokenExpiry = rememberMe ? '30d' : JWT_EXPIRES_IN;
    const { accessToken, refreshToken } = await generateTokenPair(
      user.id, 
      email, 
      user.role, 
      req,
      accessTokenExpiry
    );

    console.log(`[Auth] User logged in successfully: ${email}`);

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        company: user.company,
        role: user.role,
        isVerified: user.isVerified,
        subscription: user.subscription,
        preferences: user.preferences
      },
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: accessTokenExpiry
      }
    });

  } catch (error) {
    console.error('[Auth] Login error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid login data',
        details: error.errors
      });
    }

    res.status(500).json({
      success: false,
      error: 'Login failed',
      message: 'An unexpected error occurred during login'
    });
  }
});

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 */
router.post('/refresh', async (req, res) => {
  try {
    const refreshSchema = z.object({
      refreshToken: z.string()
    });

    const { refreshToken } = refreshSchema.parse(req.body);

    // Verify refresh token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as any;
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: 'Invalid refresh token',
        message: 'Refresh token is invalid or expired'
      });
    }

    // Find the session
    const [session] = await db
      .select()
      .from(sessions)
      .where(and(
        eq(sessions.refreshToken, refreshToken),
        eq(sessions.isActive, true),
        gt(sessions.expires, new Date())
      ))
      .limit(1);

    if (!session) {
      return res.status(401).json({
        success: false,
        error: 'Invalid session',
        message: 'Session not found or expired'
      });
    }

    // Find user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, decoded.userId))
      .limit(1);

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'User not found',
        message: 'User account not found or disabled'
      });
    }

    // Generate new access token
    const newAccessToken = (jwt as any).sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Update session with new access token
    await db
      .update(sessions)
      .set({
        accessToken: newAccessToken,
        updatedAt: new Date()
      })
      .where(eq(sessions.id, session.id));

    res.json({
      success: true,
      tokens: {
        accessToken: newAccessToken,
        refreshToken, // Keep the same refresh token
        expiresIn: JWT_EXPIRES_IN
      }
    });

  } catch (error) {
    console.error('[Auth] Token refresh error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid refresh request',
        details: error.errors
      });
    }

    res.status(500).json({
      success: false,
      error: 'Token refresh failed',
      message: 'An unexpected error occurred while refreshing tokens'
    });
  }
});

/**
 * POST /api/auth/logout
 * Logout user and invalidate session
 */
router.post('/logout', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const logoutSchema = z.object({
      refreshToken: z.string().optional()
    });

    const { refreshToken } = logoutSchema.parse(req.body);
    const userId = req.user!.id;

    console.log(`[Auth] Logout for user ${userId}`);

    // Invalidate specific session if refresh token provided
    if (refreshToken) {
      await db
        .update(sessions)
        .set({
          isActive: false,
          updatedAt: new Date()
        })
        .where(and(
          eq(sessions.userId, userId),
          eq(sessions.refreshToken, refreshToken)
        ));
    } else {
      // Invalidate all sessions for user
      await db
        .update(sessions)
        .set({
          isActive: false,
          updatedAt: new Date()
        })
        .where(eq(sessions.userId, userId));
    }

    res.json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('[Auth] Logout error:', error);
    res.status(500).json({
      success: false,
      error: 'Logout failed',
      message: 'An unexpected error occurred during logout'
    });
  }
});

/**
 * GET /api/auth/me
 * Get current user information
 */
router.get('/me', authMiddleware, async (req: AuthenticatedRequest, res) => {
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
    console.error('[Auth] Get user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user information'
    });
  }
});

/**
 * POST /api/auth/forgot-password
 * Request password reset
 */
router.post('/forgot-password', async (req, res) => {
  try {
    const forgotSchema = z.object({
      email: z.string().email()
    });

    const { email } = forgotSchema.parse(req.body);

    console.log(`[Auth] Password reset request for ${email}`);

    // Find user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    // Always return success to prevent email enumeration
    if (!user) {
      return res.json({
        success: true,
        message: 'If an account with this email exists, a password reset link has been sent'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour

    // Save reset token
    await db
      .update(users)
      .set({
        passwordResetToken: resetToken,
        passwordResetExpires: resetExpires,
        updatedAt: new Date()
      })
      .where(eq(users.id, user.id));

    // TODO: Send email with reset link
    // await sendPasswordResetEmail(email, resetToken);

    res.json({
      success: true,
      message: 'If an account with this email exists, a password reset link has been sent'
    });

  } catch (error) {
    console.error('[Auth] Forgot password error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format',
        details: error.errors
      });
    }

    res.status(500).json({
      success: false,
      error: 'Password reset request failed'
    });
  }
});

/**
 * POST /api/auth/reset-password
 * Reset password with token
 */
router.post('/reset-password', async (req, res) => {
  try {
    const resetSchema = z.object({
      token: z.string(),
      password: z.string().min(8).max(128)
    });

    const { token, password } = resetSchema.parse(req.body);

    console.log(`[Auth] Password reset attempt with token`);

    // Find user with valid reset token
    const [user] = await db
      .select()
      .from(users)
      .where(and(
        eq(users.passwordResetToken, token),
        gt(users.passwordResetExpires, new Date())
      ))
      .limit(1);

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired reset token',
        message: 'The password reset link is invalid or has expired'
      });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Update password and clear reset token
    await db
      .update(users)
      .set({
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
        loginAttempts: 0,
        lockoutUntil: null,
        updatedAt: new Date()
      })
      .where(eq(users.id, user.id));

    // Invalidate all existing sessions
    await db
      .update(sessions)
      .set({
        isActive: false,
        updatedAt: new Date()
      })
      .where(eq(sessions.userId, user.id));

    console.log(`[Auth] Password reset successful for user ${user.id}`);

    res.json({
      success: true,
      message: 'Password reset successful. Please log in with your new password.'
    });

  } catch (error) {
    console.error('[Auth] Reset password error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid reset data',
        details: error.errors
      });
    }

    res.status(500).json({
      success: false,
      error: 'Password reset failed'
    });
  }
});

/**
 * Helper function to generate JWT token pair
 */
async function generateTokenPair(
  userId: number, 
  email: string, 
  role: string, 
  req: any,
  accessTokenExpiry: string = JWT_EXPIRES_IN
) {
  const accessToken = (jwt as any).sign(
    {
      userId,
      email,
      role
    },
    JWT_SECRET,
    { expiresIn: accessTokenExpiry }
  );

  const refreshToken = (jwt as any).sign(
    {
      userId,
      email,
      type: 'refresh'
    },
    JWT_REFRESH_SECRET,
    { expiresIn: JWT_REFRESH_EXPIRES_IN }
  );

  // Calculate session expiry (refresh token expiry)
  const refreshExpiryMs = parseExpiry(JWT_REFRESH_EXPIRES_IN);
  const sessionExpires = new Date(Date.now() + refreshExpiryMs);

  // Create session record
  const sessionId = crypto.randomUUID();
  await db.insert(sessions).values({
    id: sessionId,
    userId,
    sessionToken: sessionId,
    accessToken,
    refreshToken,
    expires: sessionExpires,
    userAgent: req.get('User-Agent') || null,
    ipAddress: req.ip || req.connection.remoteAddress || null
  });

  return { accessToken, refreshToken };
}

/**
 * Helper function to handle failed login attempts
 */
async function handleFailedLogin(userId: number, currentAttempts: number) {
  const maxAttempts = 5;
  const lockoutDuration = 30 * 60 * 1000; // 30 minutes
  
  const newAttempts = currentAttempts + 1;
  let lockoutUntil = null;
  
  if (newAttempts >= maxAttempts) {
    lockoutUntil = new Date(Date.now() + lockoutDuration);
  }
  
  await db
    .update(users)
    .set({
      loginAttempts: newAttempts,
      lockoutUntil,
      updatedAt: new Date()
    })
    .where(eq(users.id, userId));
}

/**
 * Helper function to parse JWT expiry string to milliseconds
 */
function parseExpiry(expiryString: string): number {
  const match = expiryString.match(/^(\d+)([smhd])$/);
  if (!match) return 7 * 24 * 60 * 60 * 1000; // Default 7 days
  
  const value = parseInt(match[1]);
  const unit = match[2];
  
  switch (unit) {
    case 's': return value * 1000;
    case 'm': return value * 60 * 1000;
    case 'h': return value * 60 * 60 * 1000;
    case 'd': return value * 24 * 60 * 60 * 1000;
    default: return 7 * 24 * 60 * 60 * 1000;
  }
}

export default router;