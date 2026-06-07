/**
 * ToSom AI Pipeline
 * 
 * Bygger og validerer prompt før dei sendst til AI-modellen.
 * Alltid sanitér input før AI-kall.
 */

import { captureError } from '@/lib/system/errors'

/**
 * Sanitér input — fjern potentielt farlege sekvens
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/<script[^>]*>.*?<\/script>/gi, '[SCRIPT REMOVED]')
    .replace(/<[^>]+>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .replace(/;\s*delete\s/gi, '')
    .replace(/`.*?`/g, '')
    .trim()
}

/**
 * Bygg system prompt basert på context
 */
export function buildSystemPrompt(context: {
  role?: 'match' | 'profile' | 'message' | 'journey'
  language?: 'nb' | 'nn' | 'en'
  tone?: 'professional' | 'friendly' | 'empathetic'
}): string {
  const lang = context.language || 'nb'
  const tone = context.tone || 'friendly'
  const role = context.role || 'general'

  const base = `Du er ToSom sin AI-assistent. Du hjelper brukarar med dating, profilforbedring, meldingsforslag og personleg vekst.`

  const rolePrompts: Record<string, string> = {
    match: `Du er ein ekspert på kompatibilitetsanalyse. Gje konstruktive, ærlege og respektfulle svar. Aldri gjer seg opp ei meining om menneske.`,
    profile: `Du er ein profilcoach som hjelper brukarar med å skrive betre profiler. Gje konkrete, personlege og engasjerande forslag.`,
    message: `Du er ein meldingsassistent som hjelper brukarar med å starte og halde samtalar i gang. Gje naturlege, vennlege og relevante svar.`,
    journey: `Du er ein vekstcoach som hjelper brukarar med refleksjonar og personleg utvikling. Gje djupne og empati.`,
  }

  const languageNote = lang === 'en' ? 'Respond in English.' : lang === 'nn' ? 'Svar på nynorsk.' : 'Svar på bokmål.'

  return `${base}\n\n${rolePrompts[role] || ''}\n\n${languageNote}\n\nTone: ${tone}. Aldri bruk emoji. Aldri bruk formelle henvendelsar som "Dei". Bruk "du" og "deg".`
}

/**
 * Bygg user prompt frå input
 */
export function buildUserPrompt(input: string): string {
  return sanitizeInput(input)
}

/**
 * Bygg fullt prompt for AI-kall
 */
export function buildFinalPrompt(
  systemPrompt: string,
  userPrompt: string,
): { system: string; user: string } {
  return {
    system: systemPrompt.replace(/\n+/g, '\n').trim(),
    user: userPrompt.replace(/\n+/g, '\n').trim(),
  }
}

/**
 * Valider AI-input
 */
export function validateAIInput(input: string): { valid: boolean; error?: string } {
  if (!input || input.length === 0) {
    return { valid: false, error: 'Input is empty' }
  }

  if (input.length > 4000) {
    return { valid: false, error: 'Input is too long (max 4000 characters)' }
  }

  // Sjekk for potentielt farlege sekvensar
  if (input.match(/<script|javascript:|on\w+=|;\s*delete\s/)) {
    return { valid: false, error: 'Input contains potentially dangerous content' }
  }

  return { valid: true }
}

/**
 * Full pipeline: validate → sanitize → build → return
 */
export async function processPrompt(
  input: string,
  context: {
    role: 'match' | 'profile' | 'message' | 'journey'
    language?: 'nb' | 'nn' | 'en'
    tone?: 'professional' | 'friendly' | 'empathetic'
    metadata?: Record<string, unknown>
  },
): Promise<{ system: string; user: string; validation: { valid: boolean; error?: string } }> {
  // Valider input
  const validation = validateAIInput(input)
  if (!validation.valid) {
    await captureError(
      new Error(`AI input validation failed: ${validation.error}`),
      {
        module: 'ai/pipeline',
        message: 'AI input validation failed',
        metadata: context.metadata,
      },
    )
    return { system: '', user: '', validation }
  }

  // Bygg prompt
  const system = buildSystemPrompt(context)
  const user = buildUserPrompt(input)
  const final = buildFinalPrompt(system, user)

  return {
    system: final.system,
    user: final.user,
    validation: { valid: true },
  }
}
