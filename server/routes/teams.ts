import { Router } from 'express';
import { z } from 'zod';
import { db } from '@/lib/db/connection';
import { teams, teamMembers, users } from '@/shared/schemas/core';
import { eq, and, desc, count, ne } from 'drizzle-orm';
import { authMiddleware, type AuthenticatedRequest } from '../middleware/auth';
import crypto from 'crypto';

const router = Router();

/**
 * POST /api/teams
 * Create a new team workspace
 */
router.post('/', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const teamSchema = z.object({
      name: z.string().min(1).max(255),
      description: z.string().max(1000).optional(),
      slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
      plan: z.enum(['team', 'agency', 'enterprise']).optional().default('team'),
      settings: z.object({
        allowGuestAccess: z.boolean().optional().default(false),
        defaultReportBranding: z.object({
          logo: z.string().optional(),
          colors: z.object({
            primary: z.string().optional(),
            secondary: z.string().optional()
          }).optional()
        }).optional(),
        auditRetentionDays: z.number().min(30).max(365).optional().default(90),
        collaborationFeatures: z.array(z.string()).optional().default(['comments', 'sharing', 'export'])
      }).optional()
    });

    const teamData = teamSchema.parse(req.body);
    const userId = req.user!.id;

    console.log(`[Teams] Creating team ${teamData.name} for user ${userId}`);

    // Check if slug is already taken
    const [existingTeam] = await db
      .select()
      .from(teams)
      .where(eq(teams.slug, teamData.slug))
      .limit(1);

    if (existingTeam) {
      return res.status(409).json({
        success: false,
        error: 'Slug already taken',
        message: 'A team with this slug already exists'
      });
    }

    // Create team
    const [newTeam] = await db
      .insert(teams)
      .values({
        name: teamData.name,
        slug: teamData.slug,
        description: teamData.description,
        ownerId: userId,
        plan: teamData.plan || 'team',
        settings: teamData.settings || {}
      })
      .returning();

    // Add creator as team owner
    await db
      .insert(teamMembers)
      .values({
        teamId: newTeam.id,
        userId,
        role: 'owner',
        permissions: {
          canCreateAudits: true,
          canExportReports: true,
          canManageTeam: true,
          canViewAllProjects: true
        },
        joinedAt: new Date()
      });

    res.status(201).json({
      success: true,
      message: 'Team created successfully',
      team: newTeam
    });

  } catch (error) {
    console.error('[Teams] Create team error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid team data',
        details: error.errors
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to create team'
    });
  }
});

/**
 * GET /api/teams
 * Get user's teams
 */
router.get('/', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;

    // Get teams where user is a member
    const userTeams = await db
      .select({
        teamId: teamMembers.teamId,
        teamName: teams.name,
        teamSlug: teams.slug,
        teamDescription: teams.description,
        teamPlan: teams.plan,
        teamSettings: teams.settings,
        teamCreatedAt: teams.createdAt,
        memberRole: teamMembers.role,
        memberPermissions: teamMembers.permissions,
        memberJoinedAt: teamMembers.joinedAt,
        ownerEmail: users.email,
        ownerName: users.firstName
      })
      .from(teamMembers)
      .innerJoin(teams, eq(teamMembers.teamId, teams.id))
      .innerJoin(users, eq(teams.ownerId, users.id))
      .where(and(
        eq(teamMembers.userId, userId),
        eq(teamMembers.isActive, true),
        eq(teams.isActive, true)
      ))
      .orderBy(desc(teamMembers.joinedAt));

    // Get member counts for each team
    const teamsWithStats = await Promise.all(
      userTeams.map(async (team) => {
        const [memberCount] = await db
          .select({ count: count() })
          .from(teamMembers)
          .where(and(
            eq(teamMembers.teamId, team.teamId),
            eq(teamMembers.isActive, true)
          ));

        return {
          id: team.teamId,
          name: team.teamName,
          slug: team.teamSlug,
          description: team.teamDescription,
          plan: team.teamPlan,
          settings: team.teamSettings,
          createdAt: team.teamCreatedAt,
          owner: {
            email: team.ownerEmail,
            name: team.ownerName
          },
          userRole: team.memberRole,
          userPermissions: team.memberPermissions,
          joinedAt: team.memberJoinedAt,
          memberCount: Number(memberCount.count)
        };
      })
    );

    res.json({
      success: true,
      teams: teamsWithStats
    });

  } catch (error) {
    console.error('[Teams] Get teams error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch teams'
    });
  }
});

/**
 * GET /api/teams/:id
 * Get team details with members
 */
router.get('/:id', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const teamId = parseInt(req.params.id);
    const userId = req.user!.id;

    // Verify user is a team member
    const [membership] = await db
      .select()
      .from(teamMembers)
      .where(and(
        eq(teamMembers.teamId, teamId),
        eq(teamMembers.userId, userId),
        eq(teamMembers.isActive, true)
      ))
      .limit(1);

    if (!membership) {
      return res.status(403).json({
        success: false,
        error: 'Access denied',
        message: 'You are not a member of this team'
      });
    }

    // Get team details
    const [team] = await db
      .select()
      .from(teams)
      .where(eq(teams.id, teamId))
      .limit(1);

    if (!team) {
      return res.status(404).json({
        success: false,
        error: 'Team not found'
      });
    }

    // Get team members
    const members = await db
      .select({
        id: teamMembers.id,
        userId: teamMembers.userId,
        role: teamMembers.role,
        permissions: teamMembers.permissions,
        joinedAt: teamMembers.joinedAt,
        userEmail: users.email,
        userFirstName: users.firstName,
        userLastName: users.lastName,
        userCompany: users.company
      })
      .from(teamMembers)
      .innerJoin(users, eq(teamMembers.userId, users.id))
      .where(and(
        eq(teamMembers.teamId, teamId),
        eq(teamMembers.isActive, true)
      ))
      .orderBy(desc(teamMembers.joinedAt));

    res.json({
      success: true,
      team: {
        ...team,
        members,
        userRole: membership.role,
        userPermissions: membership.permissions
      }
    });

  } catch (error) {
    console.error('[Teams] Get team error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch team details'
    });
  }
});

/**
 * PUT /api/teams/:id
 * Update team settings (owners and admins only)
 */
router.put('/:id', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const updateSchema = z.object({
      name: z.string().min(1).max(255).optional(),
      description: z.string().max(1000).optional(),
      settings: z.object({
        allowGuestAccess: z.boolean().optional(),
        defaultReportBranding: z.object({
          logo: z.string().optional(),
          colors: z.object({
            primary: z.string().optional(),
            secondary: z.string().optional()
          }).optional()
        }).optional(),
        auditRetentionDays: z.number().min(30).max(365).optional(),
        collaborationFeatures: z.array(z.string()).optional()
      }).optional()
    });

    const updateData = updateSchema.parse(req.body);
    const teamId = parseInt(req.params.id);
    const userId = req.user!.id;

    // Verify user has management permissions
    const [membership] = await db
      .select()
      .from(teamMembers)
      .where(and(
        eq(teamMembers.teamId, teamId),
        eq(teamMembers.userId, userId),
        eq(teamMembers.isActive, true)
      ))
      .limit(1);

    if (!membership || !['owner', 'admin'].includes(membership.role)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied',
        message: 'Only team owners and admins can update team settings'
      });
    }

    // Get current team
    const [currentTeam] = await db
      .select()
      .from(teams)
      .where(eq(teams.id, teamId))
      .limit(1);

    if (!currentTeam) {
      return res.status(404).json({
        success: false,
        error: 'Team not found'
      });
    }

    // Merge settings
    const updatedSettings = updateData.settings
      ? { ...currentTeam.settings, ...updateData.settings }
      : currentTeam.settings;

    const [updatedTeam] = await db
      .update(teams)
      .set({
        name: updateData.name ?? currentTeam.name,
        description: updateData.description ?? currentTeam.description,
        settings: updatedSettings,
        updatedAt: new Date()
      })
      .where(eq(teams.id, teamId))
      .returning();

    res.json({
      success: true,
      message: 'Team updated successfully',
      team: updatedTeam
    });

  } catch (error) {
    console.error('[Teams] Update team error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid update data',
        details: error.errors
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to update team'
    });
  }
});

/**
 * POST /api/teams/:id/invite
 * Invite user to team
 */
router.post('/:id/invite', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const inviteSchema = z.object({
      email: z.string().email(),
      role: z.enum(['admin', 'member', 'viewer']).default('member'),
      permissions: z.object({
        canCreateAudits: z.boolean().optional(),
        canExportReports: z.boolean().optional(),
        canManageTeam: z.boolean().optional(),
        canViewAllProjects: z.boolean().optional()
      }).optional()
    });

    const { email, role, permissions } = inviteSchema.parse(req.body);
    const teamId = parseInt(req.params.id);
    const userId = req.user!.id;

    // Verify user has management permissions
    const [membership] = await db
      .select()
      .from(teamMembers)
      .where(and(
        eq(teamMembers.teamId, teamId),
        eq(teamMembers.userId, userId),
        eq(teamMembers.isActive, true)
      ))
      .limit(1);

    if (!membership || !['owner', 'admin'].includes(membership.role)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied',
        message: 'Only team owners and admins can invite members'
      });
    }

    // Find user by email
    const [invitedUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!invitedUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        message: 'No user found with this email address'
      });
    }

    // Check if user is already a team member
    const [existingMember] = await db
      .select()
      .from(teamMembers)
      .where(and(
        eq(teamMembers.teamId, teamId),
        eq(teamMembers.userId, invitedUser.id)
      ))
      .limit(1);

    if (existingMember) {
      return res.status(409).json({
        success: false,
        error: 'User already a member',
        message: 'This user is already a member of the team'
      });
    }

    // Set default permissions based on role
    const defaultPermissions = {
      admin: {
        canCreateAudits: true,
        canExportReports: true,
        canManageTeam: true,
        canViewAllProjects: true
      },
      member: {
        canCreateAudits: true,
        canExportReports: true,
        canManageTeam: false,
        canViewAllProjects: false
      },
      viewer: {
        canCreateAudits: false,
        canExportReports: false,
        canManageTeam: false,
        canViewAllProjects: false
      }
    };

    const finalPermissions = permissions || defaultPermissions[role];

    // Add team member
    const [newMember] = await db
      .insert(teamMembers)
      .values({
        teamId,
        userId: invitedUser.id,
        role,
        permissions: finalPermissions,
        invitedBy: userId,
        invitedAt: new Date(),
        joinedAt: new Date() // Auto-accept for now
      })
      .returning();

    console.log(`[Teams] User ${invitedUser.email} added to team ${teamId}`);

    res.json({
      success: true,
      message: 'User added to team successfully',
      member: {
        id: newMember.id,
        user: {
          id: invitedUser.id,
          email: invitedUser.email,
          firstName: invitedUser.firstName,
          lastName: invitedUser.lastName
        },
        role: newMember.role,
        permissions: newMember.permissions,
        joinedAt: newMember.joinedAt
      }
    });

  } catch (error) {
    console.error('[Teams] Invite user error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid invite data',
        details: error.errors
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to invite user to team'
    });
  }
});

/**
 * PUT /api/teams/:id/members/:memberId
 * Update team member role and permissions
 */
router.put('/:id/members/:memberId', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const updateSchema = z.object({
      role: z.enum(['admin', 'member', 'viewer']).optional(),
      permissions: z.object({
        canCreateAudits: z.boolean().optional(),
        canExportReports: z.boolean().optional(),
        canManageTeam: z.boolean().optional(),
        canViewAllProjects: z.boolean().optional()
      }).optional()
    });

    const updateData = updateSchema.parse(req.body);
    const teamId = parseInt(req.params.id);
    const memberId = parseInt(req.params.memberId);
    const userId = req.user!.id;

    // Verify user has management permissions
    const [userMembership] = await db
      .select()
      .from(teamMembers)
      .where(and(
        eq(teamMembers.teamId, teamId),
        eq(teamMembers.userId, userId),
        eq(teamMembers.isActive, true)
      ))
      .limit(1);

    if (!userMembership || !['owner', 'admin'].includes(userMembership.role)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied',
        message: 'Only team owners and admins can update member roles'
      });
    }

    // Get current member
    const [currentMember] = await db
      .select()
      .from(teamMembers)
      .where(and(
        eq(teamMembers.id, memberId),
        eq(teamMembers.teamId, teamId)
      ))
      .limit(1);

    if (!currentMember) {
      return res.status(404).json({
        success: false,
        error: 'Team member not found'
      });
    }

    // Prevent changing owner role
    if (currentMember.role === 'owner') {
      return res.status(400).json({
        success: false,
        error: 'Cannot modify owner role',
        message: 'The team owner role cannot be changed'
      });
    }

    // Merge permissions
    const updatedPermissions = updateData.permissions
      ? { ...currentMember.permissions, ...updateData.permissions }
      : currentMember.permissions;

    const [updatedMember] = await db
      .update(teamMembers)
      .set({
        role: updateData.role ?? currentMember.role,
        permissions: updatedPermissions,
        updatedAt: new Date()
      })
      .where(eq(teamMembers.id, memberId))
      .returning();

    res.json({
      success: true,
      message: 'Team member updated successfully',
      member: updatedMember
    });

  } catch (error) {
    console.error('[Teams] Update member error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid update data',
        details: error.errors
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to update team member'
    });
  }
});

/**
 * DELETE /api/teams/:id/members/:memberId
 * Remove team member
 */
router.delete('/:id/members/:memberId', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const teamId = parseInt(req.params.id);
    const memberId = parseInt(req.params.memberId);
    const userId = req.user!.id;

    // Get current member to check if it's the owner
    const [memberToRemove] = await db
      .select()
      .from(teamMembers)
      .where(and(
        eq(teamMembers.id, memberId),
        eq(teamMembers.teamId, teamId)
      ))
      .limit(1);

    if (!memberToRemove) {
      return res.status(404).json({
        success: false,
        error: 'Team member not found'
      });
    }

    // Prevent removing owner
    if (memberToRemove.role === 'owner') {
      return res.status(400).json({
        success: false,
        error: 'Cannot remove owner',
        message: 'The team owner cannot be removed'
      });
    }

    // Check if user is removing themselves or has management permissions
    if (memberToRemove.userId !== userId) {
      const [userMembership] = await db
        .select()
        .from(teamMembers)
        .where(and(
          eq(teamMembers.teamId, teamId),
          eq(teamMembers.userId, userId),
          eq(teamMembers.isActive, true)
        ))
        .limit(1);

      if (!userMembership || !['owner', 'admin'].includes(userMembership.role)) {
        return res.status(403).json({
          success: false,
          error: 'Access denied',
          message: 'Only team owners and admins can remove members'
        });
      }
    }

    // Remove team member (soft delete)
    await db
      .update(teamMembers)
      .set({
        isActive: false,
        updatedAt: new Date()
      })
      .where(eq(teamMembers.id, memberId));

    res.json({
      success: true,
      message: 'Team member removed successfully'
    });

  } catch (error) {
    console.error('[Teams] Remove member error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove team member'
    });
  }
});

/**
 * POST /api/teams/:id/leave
 * Leave team (cannot leave if owner)
 */
router.post('/:id/leave', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const teamId = parseInt(req.params.id);
    const userId = req.user!.id;

    // Get user's membership
    const [membership] = await db
      .select()
      .from(teamMembers)
      .where(and(
        eq(teamMembers.teamId, teamId),
        eq(teamMembers.userId, userId),
        eq(teamMembers.isActive, true)
      ))
      .limit(1);

    if (!membership) {
      return res.status(404).json({
        success: false,
        error: 'Not a team member',
        message: 'You are not a member of this team'
      });
    }

    if (membership.role === 'owner') {
      return res.status(400).json({
        success: false,
        error: 'Cannot leave as owner',
        message: 'Team owners cannot leave the team. Transfer ownership first.'
      });
    }

    // Remove membership
    await db
      .update(teamMembers)
      .set({
        isActive: false,
        updatedAt: new Date()
      })
      .where(eq(teamMembers.id, membership.id));

    res.json({
      success: true,
      message: 'Successfully left the team'
    });

  } catch (error) {
    console.error('[Teams] Leave team error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to leave team'
    });
  }
});

export default router;