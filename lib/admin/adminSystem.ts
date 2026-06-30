/**
 * ToSom — Admin System
 * 
 * Admin-dashboard for å overvåke og styre ToSom:
 *   - Oversikt over brukarar, matcher, journeys
 *   - System-health og statistikk
 *   - Moderering og brukarhandsaming
 *   - Analytics og innsikt
 * 
 * Dokumentasjon: docs/FEATURE-ADMIN.md
 */

import 'server-only'

// ─── TYPE DEFINISJONAR ─────────────────────────

export interface AdminStats {
  /** Totalt brukarar */
  totalUsers: number
  /** Aktive brukarar (siste 7 dagar) */
  activeUsers: number
  /** Aktive journeys */
  activeJourneys: number
  /** Dagelege match */
  dailyMatches: number
  /** Resonans-snitt */
  averageResonance: number
  /** Konvertering til premium */
  conversionRate: number
}

export interface AdminUser {
  id: string
  email: string
  name: string
  createdAt: Date
  journeyPhase: string
  day: number
  isActive: boolean
  lastLoginAt: Date
  matchCount: number
  premium: boolean
}

export interface AdminJourney {
  id: string
  userA: string
  userB: string
  day: number
  phase: string
  resonance: number
  startedAt: Date
  endedAt: Date | null
}

export interface AdminMatch {
  id: string
  userA: string
  userB: string
  score: number
  resonanceLevel: string
  createdAt: Date
  accepted: boolean
}

export interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical'
  uptime: number
  databaseLatency: number
  apiLatency: number
  errorRate: number
  lastBackup: Date
}

// ─── ADMIN STATS ────────────────────────

export async function getAdminStats(): Promise<AdminStats> {
  // I produksjon: Hent frå DB
  return {
    totalUsers: 0,
    activeUsers: 0,
    activeJourneys: 0,
    dailyMatches: 0,
    averageResonance: 0,
    conversionRate: 0,
  }
}

// ─── ADMIN BRUKARAR ───────────────────

export async function getAdminUsers(
  page: number = 1,
  limit: number = 20,
  filter?: {
    isActive?: boolean
    premium?: boolean
    journeyPhase?: string
  }
): Promise<{
  users: AdminUser[]
  total: number
  page: number
  hasMore: boolean
}> {
  // I produksjon: DB-spørring med paginering
  return {
    users: [],
    total: 0,
    page,
    hasMore: false,
  }
}

export async function getUserDetails(userId: string): Promise<AdminUser | null> {
  // I produksjon: Hent frå DB
  return null
}

// ─── ADMIN JOURNEYS ────────────────

export async function getAdminJourneys(
  page: number = 1,
  limit: number = 20
): Promise<{
  journeys: AdminJourney[]
  total: number
  page: number
  hasMore: boolean
}> {
  // I produksjon: DB-spørring
  return {
    journeys: [],
    total: 0,
    page,
    hasMore: false,
  }
}

// ─── ADMIN MATCHES ─────────────

export async function getAdminMatches(
  page: number = 1,
  limit: number = 20
): Promise<{
  matches: AdminMatch[]
  total: number
  page: number
  hasMore: boolean
}> {
  return {
    matches: [],
    total: 0,
    page,
    hasMore: false,
  }
}

// ─── SYSTEM HEALTH ──────────

export async function getSystemHealth(): Promise<SystemHealth> {
  return {
    status: 'healthy',
    uptime: 99.9,
    databaseLatency: 12,
    apiLatency: 45,
    errorRate: 0.01,
    lastBackup: new Date(),
  }
}

// ─── MODERERING ───────────

export interface ModerationAction {
  userId: string
  action: 'warn' | 'suspend' | 'ban'
  reason: string
  admin: string
  createdAt: Date
}

export async function moderateUser(
  userId: string,
  action: ModerationAction['action'],
  reason: string,
  adminId: string
): Promise<{ success: boolean }> {
  // I produksjon: Oppdater i DB
  return { success: true }
}

// ─── ADMIN DASHBOARD DATA ─────────

export interface AdminDashboardData {
  stats: AdminStats
  health: SystemHealth
  recentUsers: AdminUser[]
  activeJourneys: AdminJourney[]
  systemLogs: {
    level: 'info' | 'warning' | 'error'
    message: string
    timestamp: Date
  }[]
}

export async function getAdminDashboard(): Promise<AdminDashboardData> {
  const [stats, health, recentUsers, activeJourneys] = await Promise.all([
    getAdminStats(),
    getSystemHealth(),
    getAdminUsers(1, 5),
    getAdminJourneys(1, 5),
  ])

  return {
    stats,
    health,
    recentUsers: recentUsers.users,
    activeJourneys: activeJourneys.journeys,
    systemLogs: [],
  }
}

// ─── ADMIN ROUTES ─────────

export const ADMIN_ROUTES = {
  dashboard: '/admin',
  users: '/admin/users',
  journeys: '/admin/journeys',
  matches: '/admin/matches',
  analytics: '/admin/analytics',
  settings: '/admin/settings',
  moderation: '/admin/moderation',
} as const