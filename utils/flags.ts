/* ═══════════════════════════════════════════
   ToSom — Feature Flags (Post-launch)
   Enkel boolean-basert toggling med miljøvariabler
   ═══════════════════════════════════════════ */

/* ---------------------------------------------------------- */
/*  Client-facing flags (read from NEXT_PUBLIC_)              */
/* ---------------------------------------------------------- */

export const flags = {
  /** Nye match-kort komponent (MatchCardV2) */
  enableNewMatchCard: process.env.NEXT_PUBLIC_ENABLE_NEW_MATCH_CARD === "true",

  /** Ny versjon av journey flows (JourneyV2) */
  enableJourneyV2: process.env.NEXT_PUBLIC_ENABLE_JOURNEY_V2 === "true",

  /** Viser typing-indikator i chat */
  enableChatTypingIndicator: process.env.NEXT_PUBLIC_ENABLE_CHAT_TYPING_INDICATOR === "true",

  /** Aktivere AI-genererte match insight tips */
  enableAiMatchInsights: process.env.NEXT_PUBLIC_ENABLE_AI_MATCH_INSIGHTS === "true",

  /** Aktivere dark-gold accent variant */
  enableDarkGoldTheme: process.env.NEXT_PUBLIC_ENABLE_DARK_GOLD_THEME === "true",

  /** Aktivere referral/invitations system */
  enableReferral: process.env.NEXT_PUBLIC_ENABLE_REFERRAL === "true",

  /** Aktivere admin-only experimental sider */
  enableAdminExperiments: process.env.NEXT_PUBLIC_ENABLE_ADMIN_EXPERIMENTS === "true",

  /** Aktiver Sentry error reporting */
  enableSentry: process.env.NEXT_PUBLIC_SENTRY_DSN !== "",

  /** Aktiver analytics */
  enableAnalytics: process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true",

  /** Aktiver new onboarding flow */
  enableNewOnboarding: process.env.NEXT_PUBLIC_ENABLE_NEW_ONBOARDING === "true",

  /** Aktiver SMS notifications */
  enableSmsNotifications: process.env.NEXT_PUBLIC_ENABLE_SMS_NOTIFICATIONS === "true",

  /** Aktiver push notifications */
  enablePushNotifications: process.env.NEXT_PUBLIC_ENABLE_PUSH_NOTIFICATIONS === "true",

  /** Aktivere relasjons-timeline med milepæler */
  enableRelationshipTimeline: process.env.NEXT_PUBLIC_ENABLE_RELATIONSHIP_TIMELINE === "true",

  /** Aktivere felles minner (shared memories) */
  enableSharedMemories: process.env.NEXT_PUBLIC_ENABLE_SHARED_MEMORIES === "true",

  /** Aktivere milepael-system */
  enableMilestones: process.env.NEXT_PUBLIC_ENABLE_MILESTONES === "true",

  /** Aktivere sosial graf visualisering */
  enableSocialGraph: process.env.NEXT_PUBLIC_ENABLE_SOCIAL_GRAPH === "true",

  /** Aktivere ukentlig digest oppsummering */
  enableWeeklyDigest: process.env.NEXT_PUBLIC_ENABLE_WEEKLY_DIGEST === "true",
} as const;

/* ---------------------------------------------------------- */
/*  Server-side flags (kun miljøvariabler)                    */
/* ---------------------------------------------------------- */

export const serverFlags = {
  /** Aktiver rate limiting på API */
  enableRateLimiting: process.env.ENABLE_RATE_LIMITING === "true",

  /** Aktiver audit logging */
  enableAuditLog: process.env.ENABLE_AUDIT_LOG === "true",

  /** Aktiver AI logging */
  enableAiLogging: process.env.ENABLE_AI_LOGGING === "true",

  /** Aktiver CORS whitelist */
  enableCorsWhitelist: process.env.ENABLE_CORS_WHITELIST === "true",

  /** Aktiver CSRF protection */
  enableCsrfProtection: process.env.ENABLE_CSRF_PROTECTION === "true",
} as const;

/* ---------------------------------------------------------- */
/*  Helper funksjoner                                           */
/* ---------------------------------------------------------- */

/**
 * Sjekk om en client flag er aktiv
 * 
 * Eksempel:
 *   if (isFlagEnabled("enableNewMatchCard")) { ... }
 */
export function isFlagEnabled(flagName: keyof typeof flags): boolean {
  return flags[flagName] || false;
}

/**
 * Sjekk om en server flag er aktiv
 */
export function isServerFlagEnabled(flagName: keyof typeof serverFlags): boolean {
  return serverFlags[flagName] || false;
}

/* ---------------------------------------------------------- */
/*  Default export: alle flags som kan leses av client         */
/* ---------------------------------------------------------- */

export default flags;