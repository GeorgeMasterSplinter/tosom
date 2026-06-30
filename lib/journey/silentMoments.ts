/**
 * ToSom — Silent Moments Engine (Produktnivå)
 */

export interface SilentMomentConfig {
  inactivityThreshold: number;
  displayDuration: number;
  minMessages: number;
  minPhaseOrder: number;
  cooldownMs: number;
}

export interface SilentMoment {
  id: string;
  conversationId: string;
  text: string;
  timestamp: string;
  phaseOrder: number;
  displayed: boolean;
}

export interface SilenceDetection {
  isSilent: boolean;
  elapsedMs: number;
  nextMomentInMs: number;
  shouldTrigger: boolean;
}

export const SILENT_MOMENT_CONFIG: SilentMomentConfig = {
  inactivityThreshold: 30000,
  displayDuration: 8000,
  minMessages: 3,
  minPhaseOrder: 3,
  cooldownMs: 300000,
};

const SILENT_MOMENTS_BY_PHASE: Record<number, string[]> = {
  3: ['Ta deg tid. Det viktigaste kjem ikkje av seg sjølv.', 'Stille øyeblikk er der vi vokser mest.', 'I ro finn vi svarene.'],
  4: ['Fremtid blir bygd i stille augneblink.', 'Når vi er stille saman, høyrer vi kvarandre best.'],
  5: ['Maksimal resonans finst i stillheten.', 'Her er du tryg. Her er du deg sjølv.'],
};

const DEFAULT_MOMENTS = ['Ta deg tid. Det viktigaste kjem ikkje av seg sjølv.', 'I ro finn vi svarene.'];

export function getRandomSilentMoment(phaseOrder: number): string {
  const moments = SILENT_MOMENTS_BY_PHASE[phaseOrder] || DEFAULT_MOMENTS;
  return moments[Math.floor(Math.random() * moments.length)];
}

export function detectSilence(lastActivity: number, config: SilentMomentConfig = SILENT_MOMENT_CONFIG): SilenceDetection {
  const now = Date.now();
  const elapsed = now - lastActivity;
  const isSilent = elapsed >= config.inactivityThreshold;
  return { isSilent, elapsedMs: elapsed, nextMomentInMs: isSilent ? 0 : config.inactivityThreshold - elapsed, shouldTrigger: isSilent && elapsed < config.cooldownMs };
}

export function getSilentMomentUI(moment: string, phaseOrder: number) {
  const colors = {
    3: { bg: 'rgba(180,140,255,0.05)', border: 'rgba(180,140,255,0.12)', text: 'rgba(180,140,255,0.5)' },
    4: { bg: 'rgba(255,130,200,0.05)', border: 'rgba(255,130,200,0.12)', text: 'rgba(255,130,200,0.5)' },
    5: { bg: 'rgba(255,215,0,0.05)', border: 'rgba(255,215,0,0.12)', text: 'rgba(255,215,0,0.5)' },
  };
  const fallback = { bg: 'rgba(212,175,55,0.03)', border: 'rgba(212,175,55,0.08)', text: 'rgba(212,175,55,0.4)' };
  const c = colors[phaseOrder] || fallback;
  return { text: moment, style: { background: c.bg, border: `1px solid ${c.border}`, animation: 'silentFade 8s infinite ease-in-out' }, textStyle: { color: c.text, fontSize: '13px', fontStyle: 'italic' } };
}

export interface SilentMomentHistory { conversationId: string; moments: SilentMoment[]; lastTrigger: string | null; }

export function shouldTriggerSilentMoment(history: SilentMomentHistory | null, phaseOrder: number, messageCount: number): boolean {
  if (phaseOrder < SILENT_MOMENT_CONFIG.minPhaseOrder) return false;
  if (messageCount < SILENT_MOMENT_CONFIG.minMessages) return false;
  if (history?.lastTrigger) { const elapsed = Date.now() - new Date(history.lastTrigger).getTime(); if (elapsed < SILENT_MOMENT_CONFIG.cooldownMs) return false; }
  return true;
}

export const SILENT_MOMENT_STYLES = `@keyframes silentFade { 0% { opacity: 0; transform: translateY(4px); } 15% { opacity: 0.6; } 85% { opacity: 0.6; } 100% { opacity: 0; transform: translateY(-4px); } }`;