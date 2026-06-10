/**
 * ToSom AI - Journey Guidance Feature
 * 
 * Generer refleksjonsprompt og støttemeldingar for reise.
 * KALLAST KUN VIA API-ENDepunkt — aldri automatisk.
 */

import { processPrompt } from '../pipeline'
import { sendPrompt } from '../client'
import { AIResponse } from '../types'

export async function generateReflectionPrompt(
  day: number,
  context: { phase: string; recentTopics?: string[] }
): Promise<AIResponse> {
  const input = `Generer ein refleksjonsprompt for dag ${day} i reisa:

Fase: ${context.phase}
Tidligere tema: ${context.recentTopics?.join(', ') || 'Ingen tidlegare tema'}

Gjekk ein djup, personleg refleksjonsprompt som:
1. Er knytt til denne fasen
2. Opner for ærleg sjølvutforsking
3. Ikkje er kjedeleg eller gjentaking

Svar på norsk med bokmål.`

  const pipeline = await processPrompt(input, {
    role: 'journey',
    language: 'nb',
    tone: 'empathetic',
    metadata: { feature: 'journeyGuidance/generateReflectionPrompt' },
  })

  if (!pipeline.validation.valid) {
    throw new Error('Validation failed')
  }

  return sendPrompt({
    systemPrompt: pipeline.system,
    prompt: pipeline.user,
    metadata: { feature: 'journeyGuidance/generateReflectionPrompt' },
  })
}

export async function generateSupportMessage(
  context: { day: number; mood?: string; struggle?: string }
): Promise<AIResponse> {
  const input = `Generer ein støttemelding for reisedag ${context.day}:

Mood: ${context.mood || 'Ukjent'}
Struggling with: ${context.struggle || 'Ingen oppgitt utfordring'}

Gjekk ei kort, ærleg og støttande melding som:
1. Validerer kjensler
2. Gir håp utan å minimere
3. Kjenst personleg

Svar på norsk med bokmål. Aldri bruk klije-språk.`

  const pipeline = await processPrompt(input, {
    role: 'journey',
    language: 'nb',
    tone: 'empathetic',
    metadata: { feature: 'journeyGuidance/generateSupportMessage' },
  })

  if (!pipeline.validation.valid) {
    throw new Error('Validation failed')
  }

  return sendPrompt({
    systemPrompt: pipeline.system,
    prompt: pipeline.user,
    metadata: { feature: 'journeyGuidance/generateSupportMessage' },
  })
}
