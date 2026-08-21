/**
 * ToSom — Zod-validation for API-ruter
 *
 * Gir valideringsskjema for alle API-endepunkt.
 */

import { z } from 'zod'

// ─── Felles hjelpefunksjonar ───

/**
 * Valider body med eit Zod-skjema.
 */
export function validateBody<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown
): { success: true; data: z.infer<T> } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, error: result.error }
}

/**
 * Valider query med eit Zod-skjema.
 */
export function validateQuery<T extends z.ZodTypeAny>(
  schema: T,
  query: Record<string, string | string[] | undefined>
): { success: true; data: z.infer<T> } | { success: false; error: z.ZodError } {
  // Konverter til plain object
  const plain: Record<string, string> = {}
  for (const [key, value] of Object.entries(query)) {
    plain[key] = Array.isArray(value) ? value[0] ?? '' : (value ?? '')
  }
  const result = schema.safeParse(plain)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, error: result.error }
}

// ─── Auth-skjema ───

export const MagicLinkSchema = z.object({
  email: z.string().email('Ugyldig e-postadresse'),
})

export const MagicLinkVerifySchema = z.object({
  email: z.string().email('Ugyldig e-postadresse'),
  token: z.string().min(6, 'Token må vere minst 6 teikn'),
})

export const PhoneSendSchema = z.object({
  phone: z.string().min(8, 'Ugyldig telefonnummer'),
})

export const PhoneVerifySchema = z.object({
  phone: z.string().min(8, 'Ugyldig telefonnummer'),
  code: z.string().min(4, 'Kode må vere minst 4 teikn'),
})

export const PasswordResetSchema = z.object({
  email: z.string().email('Ugyldig e-postadresse'),
})

// ─── Profil-skjema ───

export const ProfileSetupSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  age: z.number().min(21).max(99).optional(),

  bio: z.string().max(500).optional(),
  identityName: z.string().optional(),
   lifeSituation: z.record(z.any(), z.any()).optional(),
   lifestyle: z.record(z.any(), z.any()).optional(),
   personality: z.record(z.any(), z.any()).optional(),
   relationshipStyle: z.string().optional(),
   communication: z.record(z.any(), z.any()).optional(),
   intimacy: z.record(z.any(), z.any()).optional(),
   futureVision: z.record(z.any(), z.any()).optional(),
   boundaries: z.record(z.any(), z.any()).optional(),
  interests: z.array(z.string()).optional(),
  deepProfileStep: z.enum([
    'IDENTITY',
    'LIFE_SITUATION',
    'LIFESTYLE',
    'PERSONALITY',
    'RELATIONSHIP_STYLE',
    'COMMUNICATION',
    'INTIMACY',
    'FUTURE_VISION',
    'BOUNDARIES',
    'SUMMARY',
  ]).optional(),
})

// ─── Match-skjema ───

export const MatchAcceptSchema = z.object({
  matchId: z.string().min(1, 'Match-ID er påkrava'),
})

export const MatchInsightSchema = z.object({
  matchId: z.string().min(1, 'Match-ID er påkrava'),
})

// ─── Journey-skjema ───

export const JourneyReflectSchema = z.object({
  conversationId: z.string().min(1, 'Konversasjon-ID er påkrava'),
  reflection: z.string().min(10, 'Refleksjon må vere minst 10 teikn'),
  day: z.number().min(1).max(30).optional(),
})

export const JourneyResonanceSchema = z.object({
  conversationId: z.string().min(1, 'Konversasjon-ID er påkrava'),
  emotionalTone: z.enum(['positive', 'neutral', 'mixed', 'deep']).optional(),
  depthLevel: z.number().min(1).max(10).optional(),
  mutualSharing: z.boolean().optional(),
  vulnerability: z.boolean().optional(),
})

// ─── Chat-skjema ───

export const ChatSendSchema = z.object({
  conversationId: z.string().min(1, 'Konversasjon-ID er påkrava'),
  content: z.string().min(1, 'Melding må vere tom').max(5000),
  type: z.enum(['user', 'system']).optional(),
})

// ─── Onboarding-skjema ───

export const OnboardingCompleteSchema = z.object({
  onboardingComplete: z.boolean().optional(),
  deepProfileComplete: z.boolean().optional(),
})

export const OnboardingSaveSchema = z.object({
  profile: z.record(z.any(), z.any()).optional(),
  deepProfile: z.record(z.any(), z.any()).optional(),
})

export const OnboardingProgressSchema = z.object({
  step: z.number().min(1).optional(),
})

// ─── Admin-skjema ───

export const AdminSetupSchema = z.object({
  password: z.string().min(8, 'Passord må vere minst 8 teikn'),
  email: z.string().email('Ugyldig e-postadresse').optional(),
})

export const AdminConversationFreezeSchema = z.object({
  conversationId: z.string().min(1, 'Konversasjon-ID er påkrava'),
})

export const AdminJourneyCompleteSchema = z.object({
  journeyId: z.string().min(1, 'Reise-ID er påkrava'),
})

export const AdminJourneyResetSchema = z.object({
  journeyId: z.string().min(1, 'Reise-ID er påkrava'),
})

export const AdminMatchResetSchema = z.object({
  matchId: z.string().min(1, 'Match-ID er påkrava'),
})

export const AdminMatchReviewSchema = z.object({
  matchId: z.string().min(1, 'Match-ID er påkrava'),
  approved: z.boolean().optional(),
})

export const AdminMatchUnmatchSchema = z.object({
  matchId: z.string().min(1, 'Match-ID er påkrava'),
})

// ─── System-skjema ───

export const HealthCheckSchema = z.object({
  db: z.boolean().optional(),
})

// ─── AI-skjema ───

export const AIJourneyNextStepSchema = z.object({
  conversationId: z.string().min(1, 'Konversasjon-ID er påkrava'),
  day: z.number().min(1).max(30).optional(),
})

export const AIProfileRewriteSchema = z.object({
  bio: z.string().min(10, 'Bio må vere minst 10 teikn'),
  interests: z.array(z.string()).min(1, 'Minst éin interesse påkrava'),
  name: z.string().optional(),
})

export const AIMessageSuggestionsSchema = z.object({
  conversationId: z.string().min(1, 'Konversasjon-ID er påkrava'),
  context: z.string().max(2000).optional(),
})

export const AIMatchInsightsSchema = z.object({
  matchId: z.string().min(1, 'Match-ID er påkrava'),
})

export const AIJourneyGuidanceSchema = z.object({
  conversationId: z.string().min(1, 'Konversasjon-ID er påkrava'),
  phase: z.enum(['EARLY', 'BUILDING_TRUST', 'DEEPER', 'CHECKIN']).optional(),
})