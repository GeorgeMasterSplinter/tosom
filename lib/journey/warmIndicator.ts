/**
 * ToSom — Warm Indicator Engine (Produktnivå)
 */

export interface WarmScore { score: number; level: string; description: string; color: string; glow: string; }
export interface WarmHistoryEntry { conversationId: string; score: number; timestamp: string; messageCount: number; phaseOrder: number; }
export interface WarmTrend { direction: 'opp' | 'ned' | 'flat'; change: number; history: WarmHistoryEntry[]; }

export function calculateWarmScore(inputs: { messageCount: number; responseTimeAvg: number; phaseOrder: number; taskCompletion: number; reflectionCount: number; longestStreak: number }): WarmScore {
  const { messageCount, responseTimeAvg, phaseOrder, taskCompletion, reflectionCount, longestStreak } = inputs;
  let warmth = 0;
  warmth += Math.min(messageCount * 3, 25);
  if (responseTimeAvg <= 5) warmth += 25; else if (responseTimeAvg <= 15) warmth += 20; else if (responseTimeAvg <= 60) warmth += 15; else warmth += 10;
  warmth += Math.min(taskCompletion * 0.2, 20);
  warmth += Math.min(reflectionCount * 5, 15);
  warmth += Math.min(longestStreak * 2, 10);
  warmth += phaseOrder;
  warmth = Math.min(Math.max(warmth, 0), 100);

  let level = 'Kald', description = 'Enno kjølig.', color = '#8282FF', glow = '0 0 12px rgba(130,130,255,0.15)';
  if (warmth >= 80) { level = 'Ekko'; description = 'Dykk varme ekkoer — begge er heilt til stades.'; color = '#FFD700'; glow = '0 0 28px rgba(255,215,0,0.35)'; }
  else if (warmth >= 60) { level = 'Glødande'; description = 'Gløden i samtalen aukar.'; color = '#FF8C42'; glow = '0 0 24px rgba(255,140,66,0.3)'; }
  else if (warmth >= 40) { level = 'Varm'; description = 'Varmen kjem sakt og støtt.'; color = '#FFB86C'; glow = '0 0 20px rgba(255,184,108,0.25)'; }
  else if (warmth >= 20) { level = 'Lukten'; description = 'Ein svak lukte — det tek tid.'; color = '#FF82C8'; glow = '0 0 16px rgba(255,130,200,0.2)'; }

  return { score: Math.round(warmth), level, description, color, glow };
}

export function addWarmHistoryEntry(conversationId: string, score: number, history: WarmHistoryEntry[], messageCount: number, phaseOrder: number): WarmHistoryEntry {
  const entry = { conversationId, score, timestamp: new Date().toISOString(), messageCount, phaseOrder };
  return [...history, entry].slice(-30)[29];
}

export function calculateWarmTrend(history: WarmHistoryEntry[]): WarmTrend {
  if (history.length < 3) return { direction: 'flat', change: 0, history };
  const recent = history.slice(-5);
  const change = recent[recent.length - 1].score - recent[Math.floor(recent.length / 2)].score;
  return { direction: change > 5 ? 'opp' : change < -5 ? 'ned' : 'flat', change, history };
}

export function getWarmUI(score: number) {
  if (score >= 80) return { bg: 'rgba(255,215,0,0.08)', border: 'rgba(255,215,0,0.2)', icon: '🔥', label: 'Ekko', gradient: 'linear-gradient(135deg, #FFD700, #FF8C42)' };
  if (score >= 60) return { bg: 'rgba(255,140,66,0.08)', border: 'rgba(255,140,66,0.2)', icon: '☀️', label: 'Glødande', gradient: 'linear-gradient(135deg, #FF8C42, #FFB86C)' };
  if (score >= 40) return { bg: 'rgba(255,184,108,0.08)', border: 'rgba(255,184,108,0.2)', icon: '🌅', label: 'Varm', gradient: 'linear-gradient(135deg, #FFB86C, #D4AF37)' };
  if (score >= 20) return { bg: 'rgba(255,130,200,0.06)', border: 'rgba(255,130,200,0.15)', icon: '🌸', label: 'Lukten', gradient: 'linear-gradient(135deg, #FF82C8, #B48CFF)' };
  return { bg: 'rgba(130,130,255,0.05)', border: 'rgba(130,130,255,0.12)', icon: '🌙', label: 'Kald', gradient: 'linear-gradient(135deg, #8282FF, #4D8CFF)' };
}

export const WARM_INDICATOR_STYLES = '@keyframes warmPulse { 0%, 100% { opacity: 0.4; transform: scale(1); } 50% { opacity: 0.7; transform: scale(1.1); } }';