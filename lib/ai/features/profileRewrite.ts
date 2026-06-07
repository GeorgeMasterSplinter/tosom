/**
 * ToSom AI - Profile Rewrite Feature
 * 
 * Forbetra profiltekst, bio og prompt-svar.
 * KALLAST KUN VIA API-ENDepunkt — aldri automatisk.
 */

import { processPrompt } from '../pipeline'
import { sendPrompt } from '../client'
import { AIResponse } from '../types'

export async function rewriteBio(bio: string): Promise<AIResponse> {
  const input = `Forbetra denne profilen. Gje eit konkret forslag som er meir engasjerande og personleg:

Original bio:
${bio}

Gje eit oppdatert forslag på 2-4 setningar. Bruk "jeg" og vera autentisk. Svar på norsk.`

  const pipeline = await processPrompt(input, {
    role: 'profile',
    language: 'nb',
    tone: 'friendly',
    metadata: { feature: 'profileRewrite/rewriteBio' },
  })

  if (!pipeline.validation.valid) {
    throw new Error('Validation failed')
  }

  return sendPrompt({
    systemPrompt: pipeline.system,
    prompt: pipeline.user,
    metadata: { feature: 'profileRewrite/rewriteBio' },
  })
}

export async function rewritePrompt(promptAnswer: string): Promise<AIResponse> {
  const input = `Forbetra dette svaret på ein profil-prompt:

Original svar:
${promptAnswer}

Gje eit oppdatert, meir engasjerande forslag som viser personlegdom. Svar på norsk.`

  const pipeline = await processPrompt(input, {
    role: 'profile',
    language: 'nb',
    tone: 'friendly',
    metadata: { feature: 'profileRewrite/rewritePrompt' },
  })

  if (!pipeline.validation.valid) {
    throw new Error('Validation failed')
  }

  return sendPrompt({
    systemPrompt: pipeline.system,
    prompt: pipeline.user,
    metadata: { feature: 'profileRewrite/rewritePrompt' },
  })
}
