/**
 * ToSom — API Valideringshjelpemiddel
 * 
 * Felles Zod-schemas og helper-funksjonar for API-validering.
 * Pakke 5.1 — Kodehvalitet
 */

import { z } from 'zod'
import { NextResponse } from 'next/server'

// ═══════════════════════════════════════════════════════════
// QUERY-PARAM SCHEMAS
// ═══════════════════════════════════════════════════════════

/** Gjeldande pagination-query schema */
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

/** Pagination med optional status-filter */
export const statusFilterSchema = paginationSchema.extend({
  status: z.enum(['active', 'expired', 'ended']).optional(),
})

/** Pagination med optional role-filter (admin users) */
export const adminUsersQuerySchema = paginationSchema.extend({
  role: z.enum(['USER', 'ADMIN']).optional(),
  flaggedOnly: z.enum(['true', 'false']).optional().transform(v => v === 'true'),
  search: z.string().optional(),
})

/** Pagination med optional module/level-filter (system logs) */
export const systemLogsQuerySchema = paginationSchema.extend({
  module: z.string().optional(),
  level: z.enum(['ERROR', 'WARNING', 'INFO']).optional(),
  search: z.string().optional(),
})

/** Pagination med optional frozenOnly-filter (conversations) */
export const adminConversationsQuerySchema = paginationSchema.extend({
  frozenOnly: z.enum(['true', 'false']).optional().transform(v => v === 'true'),
})

// ═══════════════════════════════════════════════════════════
// BODY SCHEMAS
// ═══════════════════════════════════════════════════════════

/** Admin action body (user moderation) */
export const adminUserActionSchema = z.object({
  action: z.enum(['flag', 'unflag', 'reset-onboarding', 'reset-journey', 'force-match-end']),
  reason: z.string().optional(),
})

/** JourneyDayContent update body */
export const journeyDayUpdateSchema = z.object({
  theme: z.string().min(1, 'Tema kan ikke vere tomt'),
  phase: z.enum(['EARLY', 'BUILDING_TRUST', 'DEEPER', 'CHECKIN']).optional(),
  reflectionQuestion: z.string().min(1, 'Refleksjonspørsmål kan ikke vere tomt'),
  conversationPrompt: z.string().min(1, 'Samtaleprompt kan ikke vere tomt'),
  task: z.string().optional(),
  resonanceGoal: z.string().optional(),
})

// ═══════════════════════════════════════════════════════════
// CHAT SCHEMAS (STEG 3)
// ═══════════════════════════════════════════════════════════

/** Chat send message body */
export const chatSendMessageSchema = z
  .object({
    conversationId: z.string().min(1, 'Manglande conversationId'),
    // content kan vere tom når type=image — da bærer bildet seg sjølv, og
    // imageKey setjast seinare av /api/chat/image (to-stegs opplastning).
    content: z.string().trim().max(5000, 'Meldinga er for lang').default(''),
    type: z.enum(['text', 'image', 'user', 'continue_choice']).default('text'),
  })
  .superRefine((data, ctx) => {
    if (data.type !== 'image' && data.content.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['content'],
        message: 'Melding kan ikke vere tom',
      });
    }
  })

/** Chat messages query params */
export const chatMessagesQuerySchema = paginationSchema.extend({
  conversationId: z.string().min(1, 'Manglande conversationId').optional(),
  before: z.coerce.number().int().positive().optional(),
  after: z.coerce.number().int().positive().optional(),
})

// ═══════════════════════════════════════════════════════════
// JOURNEY SCHEMAS (STEG 3)
// ═══════════════════════════════════════════════════════════

/** Journey reflect body */
export const journeyReflectSchema = z.object({
  conversationId: z.string().min(1, 'Manglande conversationId'),
  reflection: z.string().min(1, 'Refleksjon kan ikke vere tom').max(5000, 'Refleksjonen er for lang'),
})

/** Journey progress update body */
export const journeyProgressSchema = z.object({
  completed: z.boolean().optional(),
  day: z.coerce.number().int().min(1).max(30).optional(),
})

// ═══════════════════════════════════════════════════════════
// PRESENCE SCHEMAS (STEG 3)
// ═══════════════════════════════════════════════════════════

/** Presence update body */
export const presenceUpdateSchema = z.object({
  userId: z.string().min(1, 'Manglande userId'),
  isOnline: z.boolean().optional(),
  isTyping: z.boolean().optional(),
})

// ═══════════════════════════════════════════════════════════
// HELPER-FUNKSJONAR
// ═══════════════════════════════════════════════════════════

/**
 * Pars og valider query-params mot eit Zod-schema.
 * Returnerer NextResponse med feilmelding dersom validering feilar.
 */
export function validateQuery<T>(
  schema: z.ZodType<T>,
  searchParams: Record<string, string | null>
): NextResponse | { data: T } {
  const result = schema.safeParse(searchParams)

  if (!result.success) {
    const errors = result.error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join('; ')
    return NextResponse.json(
      { error: `Ugyldige query-params: ${errors}` },
      { status: 400 }
    )
  }

  return { data: result.data as T }
}

/**
 * Pars og valider request body mot eit Zod-schema.
 * Returnerer NextResponse med feilmelding dersom validering feilar.
 */
export async function validateBody<T>(
  schema: z.ZodType<T>,
  request: Request
): Promise<NextResponse | { data: T }> {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'Ugyldig JSON i request body' },
      { status: 400 }
    )
  }

  const result = schema.safeParse(body)

  if (!result.success) {
    const errors = result.error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join('; ')
    return NextResponse.json(
      { error: `Valideringsfeil: ${errors}` },
      { status: 400 }
    )
  }

  return { data: result.data as T }
}

/**
 * Kort error-response helper.
 */
export function errorResponse(message: string, status = 400): NextResponse {
  return NextResponse.json(
    { error: message },
    { status }
  )
}

/**
 * Success-response helper med konsistent format.
 */
export function successResponse(data: Record<string, unknown>, status = 200): Response {
  return new Response(
    JSON.stringify({ success: true, ...data }),
    { status, headers: { 'Content-Type': 'application/json' } }
  )
}

/**
 * Valider at ein ID er eit gyldig MongoDB ObjectId-format (24 hex chars).
 */
export function isValidObjectId(id: string): boolean {
  return /^[a-f0-9]{24}$/.test(id)
}

/**
 * Sanitizer input for å unngå XSS.
 */
export function sanitize(input: string): string {
  return input.replace(/[<>"'&]/g, (match) => {
    const entities: Record<string, string> = {
      '<': '<', '>': '>', '"': '"', "'": '&#x27;', '&': '&',
    }
    return entities[match] || match
  })
}