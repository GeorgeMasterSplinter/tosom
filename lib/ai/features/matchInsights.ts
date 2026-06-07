/**
 * ToSom AI - Match Insights Feature
 * 
 * Generer match-samandrag og kompatibilitetsanalyse.
 * KALLAST KUN VIA API-ENDepunkt — aldri automatisk.
 */

import { processPrompt } from '../pipeline'
import { sendPrompt } from '../client'
import { AIResponse } from '../types'

export async function generateMatchSummary(
  profileA: { firstName: string; bio: string; interests: string[] },
  profileB: { firstName: string; bio: string; interests: string[] },
): Promise<AIResponse> {
  const input = `Samanslå profilinfo:
    
Profil A (${profileA.firstName}):
Bio: ${profileA.bio || '(ingen bio)'}
Interesser: ${profileA.interests.join(', ')}

Profil B (${profileB.firstName}):
Bio: ${profileB.bio || '(ingen bio)'}
Interesser: ${profileB.interests.join(', ')}

Generer eit kort, konstruktivt samandrag av kvifor denne matchen kan fungere. Pek på felles interesser og komplementære eigenskapar.`

  const pipeline = await processPrompt(input, {
    role: 'match',
    language: 'nb',
    tone: 'friendly',
    metadata: { feature: 'matchInsights/generateMatchSummary' },
  })

  if (!pipeline.validation.valid) {
    throw new Error('Validation failed')
  }

  return sendPrompt({
    systemPrompt: pipeline.system,
    prompt: pipeline.user,
    metadata: { feature: 'matchInsights/generateMatchSummary' },
  })
}

export async function generateCompatibilityScore(
  profileA: { firstName: string; bio: string; interests: string[] },
  profileB: { firstName: string; bio: string; interests: string[] },
): Promise<AIResponse> {
  const input = `Vurder kompatibilitet mellom to profilar:

Profil A (${profileA.firstName}):
Bio: ${profileA.bio || '(ingen bio)'}
Interesser: ${profileA.interests.join(', ')}

Profil B (${profileB.firstName}):
Bio: ${profileB.bio || '(ingen bio)'}
Interesser: ${profileB.interests.join(', ')}

Gje ein kort, ærleg vurdering basert på:
1. Felles interesser
2. Komplementære eigenskapar
3. Moglege utfordringar

Svar på norsk.`

  const pipeline = await processPrompt(input, {
    role: 'match',
    language: 'nb',
    tone: 'professional',
    metadata: { feature: 'matchInsights/generateCompatibilityScore' },
  })

  if (!pipeline.validation.valid) {
    throw new Error('Validation failed')
  }

  return sendPrompt({
    systemPrompt: pipeline.system,
    prompt: pipeline.user,
    metadata: { feature: 'matchInsights/generateCompatibilityScore' },
  })
}
