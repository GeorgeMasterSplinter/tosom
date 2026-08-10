/** @deprecated (V2) AI-svar-forslag er fjerna — behalda for bakover-kompatibilitet. */
/**
 * ToSom AI - Message Suggestions Feature
 * 
 * Generer opnarar og svarforslag for chat.
 * KALLAST KUN VIA API-ENDepunkt — aldri automatisk.
 */

import { processPrompt } from '../pipeline'
import { sendPrompt } from '../client'
import { AIResponse } from '../types'

export async function suggestOpeners(
  theirProfile: { firstName: string; bio: string; interests: string[] },
  context: { myInterests: string[]; lastConversation?: string }
): Promise<AIResponse> {
  const input = `Finn ein naturleg, vennleg openingsmelding til denne personen:

Deira profil:
Namn: ${theirProfile.firstName}
Bio: ${theirProfile.bio || '(ingen bio)'}
Interesser: ${theirProfile.interests.join(', ')}

Mine interesser: ${context.myInterests.join(', ')}

Gjekk 3 ulike openingsforslag som:
1. Personlege og relevante
2. Ikkje klisjear
3. Oppmuntrar til svar

Svar på norsk med bokmål.`

  const pipeline = await processPrompt(input, {
    role: 'message',
    language: 'nb',
    tone: 'friendly',
    metadata: { feature: 'messageSuggestions/suggestOpeners' },
  })

  if (!pipeline.validation.valid) {
    throw new Error('Validation failed')
  }

  return sendPrompt({
    systemPrompt: pipeline.system,
    prompt: pipeline.user,
    metadata: { feature: 'messageSuggestions/suggestOpeners' },
  })
}

export async function suggestReplies(
  theirMessage: string,
  context: { conversationHistory: string; theirInterests?: string[] }
): Promise<AIResponse> {
  const input = `Finn eit naturleg svar til denne meldinga:

Derar melding:
${theirMessage}

Tidlegare samtale:
${context.conversationHistory || 'Ingen historie'}

Derar interesser: ${context.theirInterests?.join(', ') || 'Ukjent'}

Gjekk 2 svarforslag som:
1. Viser interesse for det dei sa
2. Still eit oppfølgings-spørsmål
3. Er autentisk og kort

Svar på norsk med bokmål.`

  const pipeline = await processPrompt(input, {
    role: 'message',
    language: 'nb',
    tone: 'friendly',
    metadata: { feature: 'messageSuggestions/suggestReplies' },
  })

  if (!pipeline.validation.valid) {
    throw new Error('Validation failed')
  }

  return sendPrompt({
    systemPrompt: pipeline.system,
    prompt: pipeline.user,
    metadata: { feature: 'messageSuggestions/suggestReplies' },
  })
}
