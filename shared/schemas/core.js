import { pgTable, text, serial, integer, boolean, jsonb, timestamp, index, unique, varchar } from "drizzle-orm/pg-core";
import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
/**
 * Enhanced Core Schemas for Rival Outranker 2.0
 * Preserves all sophisticated functionality while adding new capabilities
 */
// ==================== USERS & AUTHENTICATION ====================
export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    username: varchar("username", { length: 100 }),
    password: text("password").notNull(),
    firstName: varchar("first_name", { length: 100 }),
    lastName: varchar("last_name", { length: 100 }),
    company: varchar("company", { length: 255 }),
    role: varchar("role", { length: 50 }).notNull().default("user"), // user, admin, agency
    isVerified: boolean("is_verified").notNull().default(false),
    isActive: boolean("is_active").notNull().default(true),
    loginAttempts: integer("login_attempts").default(0),
    lockoutUntil: timestamp("lockout_until"),
    lastLogin: timestamp("last_login"),
    emailVerificationToken: text("email_verification_token"),
    passwordResetToken: text("password_reset_token"),
    passwordResetExpires: timestamp("password_reset_expires"),
    preferences: jsonb("preferences").$type(),
    subscription: jsonb("subscription").$type(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
    emailIdx: index("users_email_idx").on(table.email),
    roleIdx: index("users_role_idx").on(table.role),
    createdAtIdx: index("users_created_at_idx").on(table.createdAt),
}));
export const sessions = pgTable("sessions", {
    id: text("id").primaryKey(),
    userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    sessionToken: text("session_token").notNull().unique(),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    expires: timestamp("expires").notNull(),
    userAgent: text("user_agent"),
    ipAddress: varchar("ip_address", { length: 45 }),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
    userIdIdx: index("sessions_user_id_idx").on(table.userId),
    sessionTokenIdx: index("sessions_session_token_idx").on(table.sessionToken),
    expiresIdx: index("sessions_expires_idx").on(table.expires),
}));
// ==================== API USAGE & MONITORING ====================
export const apiUsage = pgTable("api_usage", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
    service: varchar("service", { length: 100 }).notNull(), // openai, dataforseo, google, etc.
    endpoint: varchar("endpoint", { length: 255 }).notNull(),
    requestType: varchar("request_type", { length: 50 }).notNull(), // analysis, audit, keyword_research, etc.
    tokensUsed: integer("tokens_used").default(0),
    costUsd: integer("cost_usd").default(0), // stored as cents
    requestData: jsonb("request_data"),
    responseData: jsonb("response_data"),
    processingTimeMs: integer("processing_time_ms"),
    status: varchar("status", { length: 20 }).notNull().default("success"), // success, error, timeout
    errorMessage: text("error_message"),
    ipAddress: varchar("ip_address", { length: 45 }),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
    userIdIdx: index("api_usage_user_id_idx").on(table.userId),
    serviceIdx: index("api_usage_service_idx").on(table.service),
    requestTypeIdx: index("api_usage_request_type_idx").on(table.requestType),
    createdAtIdx: index("api_usage_created_at_idx").on(table.createdAt),
    statusIdx: index("api_usage_status_idx").on(table.status),
}));
export const rateLimits = pgTable("rate_limits", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
    ipAddress: varchar("ip_address", { length: 45 }),
    endpoint: varchar("endpoint", { length: 255 }).notNull(),
    requestCount: integer("request_count").notNull().default(1),
    windowStart: timestamp("window_start").notNull().defaultNow(),
    windowEnd: timestamp("window_end").notNull(),
    isBlocked: boolean("is_blocked").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
    userIdIdx: index("rate_limits_user_id_idx").on(table.userId),
    ipAddressIdx: index("rate_limits_ip_address_idx").on(table.ipAddress),
    endpointIdx: index("rate_limits_endpoint_idx").on(table.endpoint),
    windowEndIdx: index("rate_limits_window_end_idx").on(table.windowEnd),
}));
// ==================== ENHANCED TEAMS & COLLABORATION ====================
export const teams = pgTable("teams", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 100 }).notNull().unique(),
    description: text("description"),
    ownerId: integer("owner_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    plan: varchar("plan", { length: 50 }).notNull().default("team"), // team, agency, enterprise
    settings: jsonb("settings").$type(),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
    slugIdx: index("teams_slug_idx").on(table.slug),
    ownerIdIdx: index("teams_owner_id_idx").on(table.ownerId),
}));
export const teamMembers = pgTable("team_members", {
    id: serial("id").primaryKey(),
    teamId: integer("team_id").notNull().references(() => teams.id, { onDelete: "cascade" }),
    userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    role: varchar("role", { length: 50 }).notNull().default("member"), // owner, admin, member, viewer
    permissions: jsonb("permissions").$type(),
    invitedBy: integer("invited_by").references(() => users.id),
    invitedAt: timestamp("invited_at"),
    joinedAt: timestamp("joined_at"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
    teamUserIdx: unique("team_members_team_user_unique").on(table.teamId, table.userId),
    teamIdIdx: index("team_members_team_id_idx").on(table.teamId),
    userIdIdx: index("team_members_user_id_idx").on(table.userId),
    roleIdx: index("team_members_role_idx").on(table.role),
}));
// ==================== ZOD VALIDATION SCHEMAS ====================
export const insertUserSchema = createInsertSchema(users, {
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum(["user", "admin", "agency"]),
});
export const selectUserSchema = createSelectSchema(users);
export const insertSessionSchema = createInsertSchema(sessions);
export const selectSessionSchema = createSelectSchema(sessions);
export const insertApiUsageSchema = createInsertSchema(apiUsage);
export const selectApiUsageSchema = createSelectSchema(apiUsage);
export const insertTeamSchema = createInsertSchema(teams, {
    name: z.string().min(1).max(255),
    slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
});
export const selectTeamSchema = createSelectSchema(teams);
export const insertTeamMemberSchema = createInsertSchema(teamMembers, {
    role: z.enum(["owner", "admin", "member", "viewer"]),
});
export const selectTeamMemberSchema = createSelectSchema(teamMembers);
