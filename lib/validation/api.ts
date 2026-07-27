/**
 * ToSom API Zod Schemas
 * 
 * Sentralt plasserte Zod-schemas for alle POST/PUT API-ruter.
 * Bruk: const parsed = schema.safeParse(await request.json());
 *       if (!parsed.success) return NextResponse.json({ error: '...', code: 'INVALID_INPUT' }, { status: 400 });
 */

import { z } from 'zod';

/* ============================================================
   AUTH SCHEMAS
   ============================================================ */

export const magicLinkSchema = z.object({
  email: z.string().email('Ugyldig e-postadresse').min(1, 'E-post er påkrevd'),
});

export type MagicLinkInput = z.infer<typeof magicLinkSchema>;

export const phoneSendSchema = z.object({
  phone: z.string().min(8, 'Telefonnummer er for kort').max(20, 'Telefonnummer er for langt'),
});

export type PhoneSendInput = z.infer<typeof phoneSendSchema>;

export const phoneVerifySchema = z.object({
  phone: z.string().min(8, 'Telefonnummer er påkrevd'),
  code: z.string().min(4, 'Kode må vere minst 4 teikn').max(10, 'Kode er for lang'),
});

export type PhoneVerifyInput = z.infer<typeof phoneVerifySchema>;

export const requestResetSchema = z.object({
  email: z.string().email('Ugyldig e-postadresse').min(1, 'E-post er påkrevd'),
});

export type RequestResetInput = z.infer<typeof requestResetSchema>;

/* ============================================================
   MATCH SCHEMAS
   ============================================================ */

export const matchScoreSchema = z.object({
  mutualDepth: z.number().min(0).max(100).default(50),
  resonanceScore: z.number().min(0).max(100).default(0),
  warmScore: z.number().min(0).max(100).default(0),
  phaseOrder: z.number().min(1).default(1),
  daysTogether: z.number().min(1).default(1),
  messageCount: z.number().min(0).default(0),
  sharedValues: z.number().min(0).max(100).default(50),
  communicationStyle: z.number().min(0).max(100).default(50),
  lifeStage: z.number().min(0).max(100).default(50),
  reflectionMatch: z.number().min(0).max(100).default(50),
});

export type MatchScoreInput = z.infer<typeof matchScoreSchema>;

export const matchAcceptSchema = z.object({
  matchId: z.string().min(1, 'matchId er påkrevd'),
});

export type MatchAcceptInput = z.infer<typeof matchAcceptSchema>;

export const matchInsightSchema = z.object({
  matchId: z.string().min(1, 'matchId er påkrevd'),
});

export type MatchInsightInput = z.infer<typeof matchInsightSchema>;

/* ============================================================
   JOURNEY SCHEMAS
   ============================================================ */

export const journeyReflectSchema = z.object({
  reflection: z.string().min(10, 'Refleksjon må vere minst 10 teikn').optional(),
  conversationResponse: z.string().min(10, 'Samtalesvar må vere minst 10 teikn').optional(),
}).refine(data => data.reflection || data.conversationResponse, {
  message: 'Antingen reflection eller conversationResponse er påkrevd',
});

export type JourneyReflectInput = z.infer<typeof journeyReflectSchema>;

export const journeyResonanceSchema = z.object({
  conversationId: z.string().min(1, 'conversationId er påkrevd'),
  userId: z.string().optional(),
  partnerId: z.string().optional(),
  messageCount: z.number().min(0).default(0),
  responseTimeAvg: z.number().min(0).default(30),
  longestStreak: z.number().min(0).default(0),
  phaseOrder: z.number().min(1).default(1),
  daysTogether: z.number().min(1).default(1),
  mutualDepth: z.number().min(0).max(100).default(50),
  reflectionCount: z.number().min(0).default(0),
  taskCompletion: z.number().min(0).max(100).default(0),
});

export type JourneyResonanceInput = z.infer<typeof journeyResonanceSchema>;

export const journeyAdvanceSchema = z.object({
  conversationId: z.string().min(1, 'conversationId er påkrevd'),
});

export type JourneyAdvanceInput = z.infer<typeof journeyAdvanceSchema>;

/* ============================================================
   PROFILE SCHEMAS
   ============================================================ */

export const profileSetupSchema = z.object({
  basic: z.object({
    identityName: z.string().min(1, 'identityName er påkrevd').max(50),
    age: z.number().min(23).max(100).optional(),
    gender: z.string().optional(),
    seekingGender: z.string().optional(),
    city: z.string().optional(),
  }).refine(data => data.identityName, { message: 'identityName er påkrevd' }),
  personlighet: z.object({
    selfDesc: z.string().optional(),
    energyGiver: z.string().optional(),
    energyDrainer: z.string().optional(),
    pressureReact: z.string().optional(),
    quirk: z.string().optional(),
  }).optional(),
  tilknytning: z.object({
    safetyNeed: z.string().optional(),
    insecurityTrigger: z.string().optional(),
    sadnessNeed: z.string().optional(),
    stressNeed: z.string().optional(),
    importantBoundary: z.string().optional(),
  }).optional(),
});

export type ProfileSetupInput = z.infer<typeof profileSetupSchema>;

/* ============================================================
   ONBOARDING SCHEMAS
   ============================================================ */

export const onboardingSaveSchema = z.object({
  step: z.enum(['IDENTITY','LIFE_SITUATION','LIFESTYLE','PERSONALITY','RELATIONSHIP_STYLE','COMMUNICATION','INTIMACY','FUTURE_VISION','BOUNDARIES','SUMMARY']),
  data: z.record(z.string(), z.unknown()),
});

export type OnboardingSaveInput = z.infer<typeof onboardingSaveSchema>;

export const onboardingCompleteSchema = z.object({});

export type OnboardingCompleteInput = z.infer<typeof onboardingCompleteSchema>;

/* ============================================================
   CONVERSATION SCHEMAS
   ============================================================ */

export const conversationCreateSchema = z.object({
  matchId: z.string().min(1, 'matchId er påkrevd'),
});

export type ConversationCreateInput = z.infer<typeof conversationCreateSchema>;

/* ============================================================
   PAYMENT SCHEMAS
   ============================================================ */

export const createCheckoutSessionSchema = z.object({
  plan: z.enum(['premium']).optional(),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
});

export type CreateCheckoutSessionInput = z.infer<typeof createCheckoutSessionSchema>;

/* ============================================================
   QUESTIONS SCHEMAS
   ============================================================ */

export const questionsQuerySchema = z.object({
  categoryId: z.string().optional(),
  depth: z.coerce.number().min(1).max(3).optional(),
  random: z.coerce.boolean().optional(),
});

export type QuestionsQueryInput = z.infer<typeof questionsQuerySchema>;

/* ============================================================
   RELATIONSHIP SCHEMAS
   ============================================================ */

export const relationshipMemoriesSchema = z.object({
  conversationId: z.string().min(1, 'conversationId er påkrevd'),
  date: z.string().min(1, 'date er påkrevd'),
  tags: z.array(z.string()).optional(),
  note: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
});

export type RelationshipMemoriesInput = z.infer<typeof relationshipMemoriesSchema>;

export const relationshipMilestonesSchema = z.object({
  conversationId: z.string().min(1, 'conversationId er påkrevd'),
  type: z.enum([
    'first_message',
    'first_match',
    'first_meeting',
    'first_memories',
    'one_month',
    'six_months',
    'one_year',
    'journey_complete',
    'timeline_event',
    'custom',
  ], { message: 'Ugyldig milestone type' }),
});

export type RelationshipMilestonesInput = z.infer<typeof relationshipMilestonesSchema>;

export const relationshipTimelineSchema = z.object({
  conversationId: z.string().min(1, 'conversationId er påkrevd'),
  date: z.string().min(1, 'date er påkrevd'),
  type: z.enum(['match', 'first_message', 'first_meeting', 'milestone', 'journey_complete', 'custom']),
  title: z.string().min(1, 'title er påkrevd'),
  description: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
});

export type RelationshipTimelineInput = z.infer<typeof relationshipTimelineSchema>;

/* ============================================================
   ADMIN SCHEMAS
   ============================================================ */

export const adminJourneyCompleteSchema = z.object({
  id: z.string().min(1, 'User ID er påkrevd'),
});

export type AdminJourneyCompleteInput = z.infer<typeof adminJourneyCompleteSchema>;

export const adminJourneyNextStepSchema = z.object({
  id: z.string().min(1, 'User ID er påkrevd'),
});

export type AdminJourneyNextStepInput = z.infer<typeof adminJourneyNextStepSchema>;

export const adminJourneyResetSchema = z.object({
  id: z.string().min(1, 'User ID er påkrevd'),
});

export type AdminJourneyResetInput = z.infer<typeof adminJourneyResetSchema>;

export const adminMatchResetSchema = z.object({
  id: z.string().min(1, 'Match ID er påkrevd'),
});

export type AdminMatchResetInput = z.infer<typeof adminMatchResetSchema>;

export const adminMatchReviewSchema = z.object({
  id: z.string().min(1, 'Match ID er påkrevd'),
  reviewNotes: z.string().optional(),
});

export type AdminMatchReviewInput = z.infer<typeof adminMatchReviewSchema>;

export const adminMatchUnmatchSchema = z.object({
  id: z.string().min(1, 'Match ID er påkrevd'),
  reason: z.string().optional(),
});

export type AdminMatchUnmatchInput = z.infer<typeof adminMatchUnmatchSchema>;

export const adminConversationFreezeSchema = z.object({
  id: z.string().min(1, 'Conversation ID er påkrevd'),
});

export type AdminConversationFreezeInput = z.infer<typeof adminConversationFreezeSchema>;

/* ============================================================
   HELPER — Bruk i API-ruter
   ============================================================ */

/**
 * Valider request body med Zod-schema.
 * Returnerer NextResponse dersom validering feilar.
 * Returnerer parsed.data dersom validering suklar.
 */
export function validateWithZod<T extends z.ZodType>(
  schema: T,
  body: unknown,
): { data: z.infer<T> } | { error: string; code: string } {
  const parsed = schema.safeParse(body);
  
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return {
      error: firstIssue?.message || 'Ugyldig input',
      code: 'INVALID_INPUT',
    };
  }
  
  return { data: parsed.data };
}

/* ============================================================
   EXPORTS — alt på éin stad
   ============================================================ */

export { matchCreateSchema, matchDecisionSchema } from './match';
export { journeyStepSchema, journeyFilterSchema } from './journey';
