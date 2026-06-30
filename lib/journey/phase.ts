/**
 * ToSom — Journey Phase System (Produktnivå)
 */

export interface JourneyPhase {
  order: number;
  name: string;
  label: string;
  startDay: number;
  endDay: number;
  description: string;
  warmth: number;
  color: string;
  borderColor: string;
  icon: string;
}

export interface JourneyState {
  currentPhase: number;
  currentDay: number;
  daysRemaining: number;
  phase: JourneyPhase;
  progress: number;
  phaseProgress: number;
}

export const JOURNEY_PHASES: JourneyPhase[] = [
  { order: 1, name: 'Introduksjon', label: 'Fase 1 — Introduksjon', startDay: 1, endDay: 6, description: 'Bygger grunnlag for djup samband.', warmth: 1, color: '#D4AF37', borderColor: 'rgba(212, 175, 55, 0.25)', icon: '🌱' },
  { order: 2, name: 'Trygghet', label: 'Fase 2 — Trygghet', startDay: 7, endDay: 12, description: 'Dypnar sambandet. Meir sårlegskap.', warmth: 2, color: '#4DFF88', borderColor: 'rgba(77, 255, 136, 0.2)', icon: '🛡️' },
  { order: 3, name: 'Sårbarhet', label: 'Fase 3 — Sårbarhet', startDay: 13, endDay: 20, description: 'Mest autentisk resonans.', warmth: 3, color: '#B48CFF', borderColor: 'rgba(180, 140, 255, 0.2)', icon: '💜' },
  { order: 4, name: 'Fremtid', label: 'Fase 4 — Fremtid', startDay: 21, endDay: 27, description: 'Resonans mognar.', warmth: 4, color: '#FF82C8', borderColor: 'rgba(255, 130, 200, 0.2)', icon: '🌟' },
  { order: 5, name: 'Djupne', label: 'Fase 5 — Djupne', startDay: 28, endDay: 30, description: 'Maksimal resonans.', warmth: 5, color: '#FFD700', borderColor: 'rgba(255, 215, 0, 0.25)', icon: '✨' },
];

export function getCurrentPhase(day: number): JourneyPhase {
  for (const phase of JOURNEY_PHASES) {
    if (day >= phase.startDay && day <= phase.endDay) return phase;
  }
  return JOURNEY_PHASES[JOURNEY_PHASES.length - 1];
}

export function calculateJourneyState(currentDay: number, totalDays: number = 30): JourneyState {
  const phase = getCurrentPhase(currentDay);
  const progress = Math.round((currentDay / totalDays) * 100);
  const phaseProgress = Math.round(((currentDay - phase.startDay) / (phase.endDay - phase.startDay)) * 100);
  return {
    currentPhase: phase.order,
    currentDay,
    daysRemaining: Math.max(0, totalDays - currentDay),
    phase,
    progress: Math.min(progress, 100),
    phaseProgress: Math.min(Math.max(phaseProgress, 0), 100),
  };
}

export function getNextPhase(currentDay: number): JourneyPhase | null {
  const current = getCurrentPhase(currentDay);
  return JOURNEY_PHASES.find(p => p.order === current.order + 1) || null;
}

export function canProgressPhase(currentDay: number): boolean {
  return currentDay >= getCurrentPhase(currentDay).endDay;
}

export function getPhaseVisual(phaseOrder: number): { badgeBg: string; badgeBorder: string; badgeColor: string; lineGradient: string; glowColor: string } {
  const phase = JOURNEY_PHASES.find(p => p.order === phaseOrder);
  if (!phase) return { badgeBg: 'rgba(212,175,55,0.1)', badgeBorder: 'rgba(212,175,55,0.2)', badgeColor: '#D4AF37', lineGradient: 'linear-gradient(90deg, #D4AF37, #E8C766)', glowColor: 'rgba(212,175,55,0.15)' };
  return { badgeBg: `${phase.borderColor.replace(')', ', 0.1)')}`, badgeBorder: phase.borderColor, badgeColor: phase.color, lineGradient: `linear-gradient(90deg, ${phase.color}, ${phase.color}80)`, glowColor: `${phase.color}25` };
}

export function getPhaseWarmthIndicator(warmth: number): string {
  return '● '.repeat(warmth) + '○ '.repeat(5 - warmth);
}