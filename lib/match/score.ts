/**
 * ToSom — Match Score Engine (Produktnivå)
 * 
 * Beregner match-score mellom to brukarar med:
 * - matchScore (0-100)
 * - matchStrength (0-100)
 * - futurePotential (0-100)
 */

export interface MatchScores {
  matchScore: number;      // 0-100 (heile match)
  matchStrength: number;   // 0-100 (styrke i tilkopling)
  futurePotential: number; // 0-100 (framtidig potensial)
  compatibility: number;   // 0-100 (kompatibilitet)
  chemistry: number;       // 0-100 ( kjemi)
}

export interface MatchScoreInput {
  mutualDepth: number;        // 0-100 (profil-kompatibilitet)
  resonanceScore: number;     // 0-100
  warmScore: number;          // 0-100
  phaseOrder: number;         // 1-5
  daysTogether: number;       // dagar saman
  messageCount: number;       // antal meldingar
  sharedValues: number;       // 0-100 (delte verdiar)
  communicationStyle: number; // 0-100 (kommunikasjons-stil match)
  lifeStage: number;          // 0-100 (livsfase-kompatibilitet)
  reflectionMatch: number;    // 0-100 (refleksjons-match)
}

export function calculateMatchScores(input: MatchScoreInput): MatchScores {
  const {
    mutualDepth,
    resonanceScore,
    warmScore,
    phaseOrder,
    daysTogether,
    messageCount,
    sharedValues,
    communicationStyle,
    lifeStage,
    reflectionMatch,
  } = input;

  // --- matchScore (heile match) ---
  // Vektar som viser kva som er viktigast
  const matchScore = Math.round(
    mutualDepth * 0.25 +
    resonanceScore * 0.25 +
    sharedValues * 0.15 +
    communicationStyle * 0.15 +
    lifeStage * 0.10 +
    reflectionMatch * 0.10
  );

  // --- matchStrength (styrke i tilkoppling) ---
  // Avhenger av resonans + varme + streak
  let matchStrength = 0;
  matchStrength += resonanceScore * 0.4;
  matchStrength += warmScore * 0.3;
  matchStrength += Math.min(messageCount * 2, 15);  // max 15%
  matchStrength += Math.min(daysTogether * 3, 10);  // max 10%
  matchStrength = Math.min(Math.max(matchStrength, 0), 100);

  // --- futurePotential (framtidig potensial) ---
  // Avhenger av fase + verdiskompatibilitet + livsfase
  let futurePotential = 0;
  futurePotential += sharedValues * 0.35;
  futurePotential += lifeStage * 0.25;
  futurePotential += phaseOrder * 10;  // 10% per fase (0-50)
  futurePotential += mutualDepth * 0.15;
  futurePotential += communicationStyle * 0.15;
  futurePotential = Math.min(Math.max(futurePotential, 0), 100);

  // --- Compatibility (enkel vektet snitt) ---
  const compatibility = Math.round(
    (mutualDepth + sharedValues + communicationStyle + lifeStage) / 4
  );

  // --- Chemistry (resonans + varme + matchScore) ---
  const chemistry = Math.round(
    resonanceScore * 0.4 +
    warmScore * 0.3 +
    matchScore * 0.3
  );

  return {
    matchScore: Math.min(Math.max(matchScore, 0), 100),
    matchStrength: Math.round(matchStrength),
    futurePotential: Math.round(futurePotential),
    compatibility: Math.min(Math.max(compatibility, 0), 100),
    chemistry: Math.min(Math.max(chemistry, 0), 100),
  };
}

export function calculateMatchStrength(label: number): {
  label: string;
  color: string;
  description: string;
} {
  if (label >= 90) return { label: 'Djuk tilkopling', color: '#FFD700', description: 'Ekstraordinær styrke i tilkoppling.' };
  if (label >= 70) return { label: 'Sterk tilkopling', color: '#D4AF37', description: 'Sterk og autentisk tilkopling.' };
  if (label >= 50) return { label: 'God tilkopling', color: '#FFB86C', description: 'God grunnlag for djup samband.' };
  if (label >= 30) return { label: 'Moder tilkopling', color: '#FF82C8', description: 'Tilkoplinga utviklar seg.' };
  return { label: 'Tidleg tilkopling', color: '#8282FF', description: 'Begynnande tilkopling — det tek tid.' };
}

export function calculateFuturePotential(label: number): {
  label: string;
  color: string;
  description: string;
} {
  if (label >= 85) return { label: 'Høgt potensial', color: '#FFD700', description: 'Maksimalt framtidig potensial.' };
  if (label >= 65) return { label: 'Sterkt potensial', color: '#4DFF88', description: 'Sterk grunnlag for framtidig samband.' };
  if (label >= 45) return { label: 'Godt potensial', color: '#FFB86C', description: 'Godt potensial for vekst.' };
  if (label >= 25) return { label: 'Moder potensial', color: '#FF82C8', description: 'Potensial utviklar seg.' };
  return { label: 'Tidleg potensial', color: '#8282FF', description: 'Enno tidleg — men lovande.' };
}

export function getMatchVisual(score: number): {
  color: string;
  gradient: string;
  label: string;
  glow: string;
} {
  if (score >= 80) {
    return { color: '#FFD700', gradient: 'linear-gradient(135deg, #FFD700, #FF8C42)', label: 'Sterk match', glow: '0 0 28px rgba(255,215,0,0.35)' };
  }
  if (score >= 60) {
    return { color: '#D4AF37', gradient: 'linear-gradient(135deg, #D4AF37, #FFB86C)', label: 'God match', glow: '0 0 24px rgba(212,175,55,0.3)' };
  }
  if (score >= 40) {
    return { color: '#FFB86C', gradient: 'linear-gradient(135deg, #FFB86C, #FF82C8)', label: 'Moder match', glow: '0 0 20px rgba(255,184,108,0.25)' };
  }
  if (score >= 20) {
    return { color: '#FF82C8', gradient: 'linear-gradient(135deg, #FF82C8, #B48CFF)', label: 'Tidleg match', glow: '0 0 16px rgba(255,130,200,0.2)' };
  }
  return { color: '#8282FF', gradient: 'linear-gradient(135deg, #8282FF, #4D8CFF)', label: 'Utviklar seg', glow: '0 0 12px rgba(130,130,255,0.15)' };
}