/**
 * ToSom — AI Match Insight Generator
 * 
 * Genererer rolig, moden, forskningsbasert innsikt om ein match.
 * Basert på profiler, score og resonans.
 * 
 * Output:
 *   - summary: "Slik kan denne matchen føles i praksis"
 *   - strengths: "Styrker dere har saman"
 *   - clarity: "Dette kan vera fint å vera tydeleg på"
 *   - starter: "Eit godt måte å starte samtalen på"
 */

import { createAIClient } from './client';
import { aiConfig } from './config';

export interface MatchInsightInput {
  profileA: {
    identityName?: string | null;
    age?: number | null;
    relationshipStyle?: string | null;
    communication: Record<string, unknown>;
    personality: Record<string, unknown>;
    values: { futureVision: Record<string, unknown>; emotionalNeeds: Record<string, unknown> };
    lifestyle: Record<string, unknown>;
    boundaries: Record<string, unknown>;
    maturityLevel?: number | null;
    intimacy: Record<string, unknown>;
  };
  profileB: {
    identityName?: string | null;
    age?: number | null;
    relationshipStyle?: string | null;
    communication: Record<string, unknown>;
    personality: Record<string, unknown>;
    values: { futureVision: Record<string, unknown>; emotionalNeeds: Record<string, unknown> };
    lifestyle: Record<string, unknown>;
    boundaries: Record<string, unknown>;
    maturityLevel?: number | null;
    intimacy: Record<string, unknown>;
  };
  score: number;
  resonanceLevel: string;
  explanationScores: Record<string, number>;
}

export interface MatchInsightOutput {
  summary: string;
  strengths: string;
  clarity: string;
  starter: string;
}

const SYSTEM_PROMPT = `Du er ein rolig, moden og trygg innsikts-gjevar for ToSom — ein relasjonsplattform for vaksne (23+).

Du skal generere 4 sektar av innsikt om ein match mellom to menneske.

Tone:
- rolig
- moden
- trygg
- varm
- konkret
- kortfatta, men innsiktsfull
- aldri pushy
- aldri overfladisk

Struktur:
1. summary: "Slik kan denne matchen føles i praksis" — éin kort avsnitt (2-3 setningar). Beskriv kva det kan kjennest som å bygga ein forbindelse med denne personen.
2. strengths: "Styrker dere har saman" — éin kort avsnitt (2-3 setningar). Beskriv kva som er sterkt ved kombinasjonen deira.
3. clarity: "Dette kan vera fint å vera tydeleg på" — éin kort avsnitt (2 setningar). Eit roleg, modent forslag til kor dei bør vera tydelege.
4. starter: "Eit godt måte å starte samtalen på" — éin konkret, varm og meningsfull åpning. Skal følast som noko éin kunne sendt til den andre.

Svar berre med JSON — ingen forklaringar, ingen markdow. Format:
{
  "summary": "...",
  "strengths": "...",
  "clarity": "...",
  "starter": "..."
}`;

/**
 * Trekk ut nøkkelord frå ein Json-felt.
 */
function extractKeys(obj: Record<string, unknown>, top = 3): string[] {
  const keys = Object.keys(obj).filter(k => {
    const val = obj[k];
    return val !== null && val !== undefined && val !== '' && val !== false && (typeof val === 'string' || (Array.isArray(val) && val.length > 0));
  });
  return keys.slice(0, top);
}

/**
 * Lag strukturer payload frå input.
 */
function buildPayload(input: MatchInsightInput): string {
  const a = input.profileA;
  const b = input.profileB;

  const aName = a.identityName || 'Brukar A';
  const bName = b.identityName || 'Brukar B';
  const aAge = a.age || '?';
  const bAge = b.age || '?';

  const aComm = extractKeys(a.communication);
  const bComm = extractKeys(b.communication);
  const aPerson = extractKeys(a.personality);
  const bPerson = extractKeys(b.personality);
  const aValues = extractKeys(a.values.futureVision);
  const bValues = extractKeys(b.values.futureVision);
  const aLife = extractKeys(a.lifestyle);
  const bLife = extractKeys(b.lifestyle);
  const aBound = extractKeys(a.boundaries);
  const bBound = extractKeys(b.boundaries);
  const aIntim = extractKeys(a.intimacy);
  const bIntim = extractKeys(b.intimacy);

  const strongest = Object.entries(input.explanationScores)
    .sort((x, y) => y[1] - x[1])
    .slice(0, 3)
    .map(([k]) => k);

  const labels: Record<string, string> = {
    verdier: 'Verdier',
    kommunikasjon: 'Kommunikasjon',
    trygghet: 'Trygghet',
    fremtid: 'Fremtidsvisjon',
    leik: 'Leik og humor',
    livsstil: 'Livsstil',
    tilknytning: 'Tilknyting',
    kjaerlighet: 'Kjærligheit',
    humor: 'Humor',
    personlighet: 'Personlegheit',
    grenser: 'Grenser',
    emosjonelle: 'Emosjonelle behov',
  };

  const strongLabels = strongest.map(k => labels[k] || k);

  return `MATCH-SAMMENLIGNING

Brukarar: ${aName} (${aAge}) og ${bName} (${bAge})

Match-score: ${input.score}/100
Resonans: ${input.resonanceLevel}

Sterkaste områda: ${strongLabels.join(', ')}

--- ${aName} ---
Livsstil: ${aLife.join(', ')}
Personlegheit: ${aPerson.join(', ')}
Verdier: ${aValues.join(', ')}
Kommunikasjon: ${aComm.join(', ')}
Tilknyting/intimitet: ${aIntim.join(', ')}
Grenser: ${aBound.join(', ')}
Modenheitsnivå: ${a.maturityLevel || 'ukjent'}

--- ${bName} ---
Livsstil: ${bLife.join(', ')}
Personlegheit: ${bPerson.join(', ')}
Verdier: ${bValues.join(', ')}
Kommunikasjon: ${bComm.join(', ')}
Tilknyting/intimitet: ${bIntim.join(', ')}
Grenser: ${bBound.join(', ')}
Modenheitsnivå: ${b.maturityLevel || 'ukjent'}

Kommunikasjons-stil:
${a.relationshipStyle || 'Ukjent'} vs ${b.relationshipStyle || 'Ukjent'}

Emosjonelle behov:
A: ${extractKeys(a.values.emotionalNeeds).join(', ')}
B: ${extractKeys(b.values.emotionalNeeds).join(', ')}`;
}

/**
 * Pars eit JSON-streng-svar frå AI-en.
 */
function parseResponse(text: string): MatchInsightOutput | null {
  try {
    // Finn JSON-del (kan ha markdown-fok)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    const parsed = JSON.parse(jsonMatch[0]) as MatchInsightOutput;

    // Valider felt
    if (!parsed.summary || !parsed.strengths || !parsed.clarity || !parsed.starter) return null;

    return parsed;
  } catch {
    return null;
  }
}

/**
 * Generer innsikt ved bruk av AI (OpenAI-compatible API).
 */
export async function generateMatchInsightAI(
  input: MatchInsightInput,
): Promise<MatchInsightOutput> {
  const client = createAIClient();
  const payload = buildPayload(input);

  const response = await client.prompt({
    systemPrompt: SYSTEM_PROMPT,
    prompt: payload,
    model: aiConfig.model,
    temperature: 0.7,
    maxTokens: 600,
    metadata: { feature: 'matchInsights' as any },
  });

  // Forklaring på AI-en, returner
  const parsed = parseResponse(response.content);
  if (parsed) return parsed;

  // Fallback til generiske tekstar
  return getFallbackInsight(input);
}

/**
 * Generer innsikt utan AI (fallback).
 */
export async function generateMatchInsight(
  input: MatchInsightInput,
): Promise<MatchInsightOutput> {
  // Sjekk om AI-API-key er tilgjengeleg
  if (!aiConfig.apiKey) {
    return getFallbackInsight(input);
  }

  try {
    return await generateMatchInsightAI(input);
  } catch (err) {
    console.error('[MatchInsight] AI-fallthrough:', err);
    return getFallbackInsight(input);
  }
}

/**
 * Fallback innsikt — rolig, varm, forskningsbasert.
 */
function getFallbackInsight(input: MatchInsightInput): MatchInsightOutput {
  const score = input.score;
  const resonance = input.resonanceLevel;

  // Resonans-følelse
  const resonanceTexts: Record<string, string> = {
    GENTLE: 'Ein roleg, forsiktig start. Kanskje som å merka at noko byrjar å stemme, sjølv om det enno er tidleg.',
    MODERATE: 'Ein varmare, trygglare kjensle. Dere finn felles tonar og opplever at samtalen flyt naturlig.',
    STRONG: 'Dette kjennest djupt — som om dere har funne kvarandre på ein måte som følast ekte.',
    DEEP: 'Ei særs djup resonans. Dere har eit felles språk som mange leitar livet igjennom.',
  };

  // Styrker basert på scores
  const strongest = Object.entries(input.explanationScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2);

  const strengthLabels: Record<string, string> = {
    verdier: 'verdier',
    kommunikasjon: 'kommunikasjon',
    trygghet: 'trygghet',
    fremtid: 'fremtidsvisjon',
    leik: 'leik og humor',
    livsstil: 'livsstil',
    tilknytning: 'tilknyting',
    kjaerlighet: 'kjærligheit',
  };

  let strengthText = '';
  if (strongest.length > 0) {
    const labels = strongest.map(([key]) => strengthLabels[key] || key);
    strengthText = `Ein av styrkane dykkar er at dere deler ${labels.join(' og ')}. Dette skaper ein grunnlag for ekte forbindelse.`;
  } else {
    strengthText = 'Dere har felles interesser og verdier som gjer at dere kan finn fram til kvarandre på ein naturlig måte.';
  }

  // Klarheit
  const clarityText = `Ta deg tid til å vera nysgjerrig. Dei beste sambanda byggst sakte — med tålmod og oppriktig interesse for kvarandre.`;

  // Starter
  const starterTexts = [
    `Kva gir deg mest energi i kvardagen?`,
    `Kva er noko du aldri har fortald nokon om før?`,
    `Kva er ein drøm du jobbar mot — uansett om det høver inn i samanhengen?`,
  ];
  const starter = starterTexts[Math.floor(Math.random() * starterTexts.length)];

  return {
    summary: resonanceTexts[resonance] || resonanceTexts.GENTLE,
    strengths: strengthText,
    clarity: clarityText,
    starter: starter,
  };
}