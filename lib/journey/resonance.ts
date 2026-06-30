/**
 * ToSom — Resonans Motor (Produktnivå)
 * 
 * Beregner resonans mellom to brukarar basert på:
 * - resonans-score (0-100)
 * - trygghet-score (0-100)
 * - dybde-score (0-100)
 * - varme-score (0-100)
 * - samtale-kvalitet (0-100)
 */

// ═══════════════════════════════════════════
// TYPE DEFINISJONAR
// ═══════════════════════════════════════════

export interface ResonanceScores {
  resonance: number;    // 0-100 (heile)
  trygghet: number;     // 0-100 (trygghet i samtale)
  dybde: number;        // 0-100 (dypde i tema)
  varme: number;        // 0-100 (varme i tone)
  samtaleKvalitet: number;  // 0-100 (kvalitet av meldingar)
}

export interface ResonanceInput {
  conversationId: string;
  userId: string;
  partnerId: string;
  messageCount: number;
  responseTimeAvg: number;  // sekunder
  longestStreak: number;   // lengste uavbrotte streak
  phaseOrder: number;       // 1-5
  daysTogether: number;     // dagar saman
  mutualDepth: number;      // 0-100 (dypde i profil-kompatibilitet)
  reflectionCount: number;  // antal refleksjoner gjort
  taskCompletion: number;   // 0-100 (oppgaver fullførte)
}

export interface ResonanceSnapshot {
  conversationId: string;
  scores: ResonanceScores;
  timestamp: string;
  phaseOrder: number;
  messageCount: number;
  daysTogether: number;
}

// ═══════════════════════════════════════════
// RESONANS-BEREKNING
// ═══════════════════════════════════════════

export function calculateResonance(input: ResonanceInput): ResonanceScores {
  const {
    messageCount,
    responseTimeAvg,
    longestStreak,
    phaseOrder,
    daysTogether,
    mutualDepth,
    reflectionCount,
    taskCompletion,
  } = input;

  // --- Trygghet (0-100) ---
  // Høg trygghet når:
  // - Meldingar er rolige, ikkje sprangfulle
  // - Mykje refleksjonar
  // - Høg mutualDepth
  let trygghet = 0;
  trygghet += mutualDepth * 0.4;           // 40% vekt på profil-kompatibilitet
  trygghet += Math.min(reflectionCount * 15, 30);  // 30% på refleksjonar
  trygghet += Math.min(daysTogether * 3, 15);    // 15% på dagar saman
  trygghet += Math.min(taskCompletion * 15, 15); // 15% på oppgaver
  trygghet = Math.min(trygghet, 100);

  // --- Dybde (0-100) ---
  // Høg dybde når:
  // - Meldingslengde er lang
  // - Mykje refleksjonar
  // - Fase 3+ (sårbarheit/fremtid)
  let dybde = 0;
  dybde += Math.min(messageCount * 5, 30);       // 30% på meldingsmengd
  dybde += Math.min(reflectionCount * 10, 25);   // 25% på refleksjonar
  dybde += phaseOrder * 12.5;                    // 12.5% per fase (0-62.5)
  dybde += Math.min(longestStreak * 3, 20);      // 20% på streak
  dybde = Math.min(dybde, 100);

  // --- Varme (0-100) ---
  // Høg varme når:
  // - Response tid er rask (men ikkje for rask — viser at dei bryr seg)
  // - Lange meldingar
  // - Oppgaver fullførde
  let varme = 0;
  // Response tid: 2-10s er optimalt, 10-60s er bra, >60s er roleg
  if (responseTimeAvg <= 10) varme += 40;
  else if (responseTimeAvg <= 60) varme += 30;
  else varme += 20;
  varme += Math.min(taskCompletion * 25, 25);     // 25% på oppgaver
  varme += Math.min(longestStreak * 5, 20);       // 20% på streak
  varme += phaseOrder * 5;                         // 5% per fase
  varme = Math.min(varme, 100);

  // --- Samtale-kvalitet (0-100) ---
  // Høg kvalitet når:
  // - Meldingar er balanserte (ikkje ein som dominerer)
  // - Mykje lengde
  // - Refleksjonar
  let samtaleKvalitet = 0;
  samtaleKvalitet += Math.min(messageCount * 4, 35);  // 35% på mengd
  samtaleKvalitet += Math.min(reflectionCount * 12, 30);  // 30% på refleksjonar
  samtaleKvalitet += Math.min(daysTogether * 2, 15);  // 15% på dagar
  samtaleKvalitet += Math.min(longestStreak * 4, 20); // 20% på streak
  samtaleKvalitet = Math.min(samtaleKvalitet, 100);

  // --- Heil resonans (vega gjennomsnitt) ---
  const resonance = Math.round(
    trygghet * 0.3 +
    dybde * 0.25 +
    varme * 0.25 +
    samtaleKvalitet * 0.2
  );

  return {
    resonance: Math.min(Math.max(resonance, 0), 100),
    trygghet: Math.min(Math.max(Math.round(trygghet), 0), 100),
    dybde: Math.min(Math.max(Math.round(dybde), 0), 100),
    varme: Math.min(Math.max(Math.round(varme), 0), 100),
    samtaleKvalitet: Math.min(Math.max(Math.round(samtaleKvalitet), 0), 100),
  };
}

// ═══════════════════════════════════════════
// SNAPSHOT-HISTORIKK
// ═══════════════════════════════════════════

export function createResonanceSnapshot(
  input: ResonanceInput,
  scores: ResonanceScores
): ResonanceSnapshot {
  return {
    conversationId: input.conversationId,
    scores,
    timestamp: new Date().toISOString(),
    phaseOrder: input.phaseOrder,
    messageCount: input.messageCount,
    daysTogether: input.daysTogether,
  };
}

// ═══════════════════════════════════════════
// FASE-GUIDED RESONANS
// ═══════════════════════════════════════════

export function getPhaseResonanceBias(phaseOrder: number): {
  modifier: number;
  focus: string;
  description: string;
} {
  const phases = [
    {
      modifier: 0.8,
      focus: 'Introduksjon — bygger grunnlag',
      description: 'Resonans er lågare i starten — det er normalt.',
    },
    {
      modifier: 0.9,
      focus: 'Trygghet — dypnar sambandet',
      description: 'Resonans aukar når trygghet kjem.',
    },
    {
      modifier: 1.0,
      focus: 'Sårbarhet — mest autentisk resonans',
      description: 'Dette er kjernen i resonans — sårlegskap skapar ekte resonans.',
    },
    {
      modifier: 1.1,
      focus: 'Fremtid — resonans mognar',
      description: 'Resonans er høg når framtidsteam kjem.',
    },
    {
      modifier: 1.15,
      focus: 'Djupne — full resonans',
      description: 'Maksimal resonans — begge er heilt til stades.',
    },
  ];

  const idx = Math.min(Math.max(phaseOrder - 1, 0), phases.length - 1);
  return phases[idx];
}

// ═══════════════════════════════════════════
// VISUELLE TILBAKEFORSSEL
// ═══════════════════════════════════════════

export function getResonanceVisual(score: number): {
  color: string;
  label: string;
  glow: string;
  intensity: number;
} {
  if (score >= 80) {
    return {
      color: '#4DFF88',
      label: 'Djuk resonans',
      glow: '0 0 24px rgba(77, 255, 136, 0.3)',
      intensity: 1.0,
    };
  }
  if (score >= 60) {
    return {
      color: '#D4AF37',
      label: 'Sterk resonans',
      glow: '0 0 20px rgba(212, 175, 55, 0.25)',
      intensity: 0.8,
    };
  }
  if (score >= 40) {
    return {
      color: '#FFB86C',
      label: 'God resonans',
      glow: '0 0 16px rgba(255, 184, 108, 0.2)',
      intensity: 0.6,
    };
  }
  if (score >= 20) {
    return {
      color: '#FF82C8',
      label: 'Moder resonans',
      glow: '0 0 12px rgba(255, 130, 200, 0.15)',
      intensity: 0.4,
    };
  }
  return {
    color: '#8282FF',
    label: 'Tidleg resonans',
    glow: '0 0 8px rgba(130, 130, 255, 0.1)',
    intensity: 0.2,
  };
}