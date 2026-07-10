// lib/matching/explainer.ts — Genererer lesbare forklaringer fra MatchResult
import { MatchResult, MatchTier } from "./types";

/**
 * tierLabel gir et kort, menneskelig lesbar navn på en MatchTier.
 */
function tierLabel(tier: MatchTier): string {
  const labels: Record<MatchTier, string> = {
    deepResonance: "Dyp resonans",
    strongResonance: "Sterk resonans",
    moderateResonance: "Moderat resonans",
    gentleResonance: "Mild resonans",
    weakResonance: "Svake tegn",
  };
  return labels[tier];
}

/**
 * breakdownDescription gir en kort, lesbar beskriving av breakdown.
 */
function breakdownDescription(breakdown: MatchResult["breakdown"]): string {
  const parts: string[] = [];
  
  // Base
  if (breakdown.base > 0.7) parts.push("sterk grunnleggende kompatibilitet");
  else if (breakdown.base > 0.4) parts.push("god grunnleggende kompatibilitet");
  
  // Resonance
  if (breakdown.resonance > 0.7) parts.push("dyp emosjonell resonans");
  else if (breakdown.resonance > 0.4) parts.push("naturlig resonans");
  
  // Semantic
  if (breakdown.semantic > 0.7) parts.push("mye semantisk overlap");
  else if (breakdown.semantic > 0.4) parts.push("noen felles tema");
  
  // Intimacy
  if (breakdown.intimacy > 0.7) parts.push("sterk intimitetskompatibilitet");
  
  // Future
  if (breakdown.future > 0.7) parts.push("god framtidskompatibilitet");
  
  if (parts.length === 0) {
    return "færre felles trekk synlige nå";
  }
  
  return parts.join(", ");
}

/**
 * generateExplanation gir en komplett forklaring for en match.
 * Bruker breakdown, tier, og score for å lage en kort, varm og personlig tekst.
 */
export function generateExplanation(result: MatchResult): string {
  // Hvis avslått pga dealbreaker
  if (result.rejected && result.rejectionReason) {
    return `Dessverre passer ikke denne matchen — ${result.rejectionReason.toLowerCase()}.`;
  }
  
  const tier = tierLabel(result.tier);
  const percentage = Math.round(result.score * 100);
  const desc = breakdownDescription(result.breakdown);
  
  // Generer en kort, varm forklaring basert på hvor høy scoren er
  if (result.tier === "deepResonance") {
    return `Dykk resonans er ekstraordinær — ${desc}. Dette er en av de mest kompatible matchene vi kan finne.`;
  }
  
  if (result.tier === "strongResonance") {
    return `Sterk resonans på mange nivå — ${desc}. Her er det et virkelig potensial.`;
  }
  
  if (result.tier === "moderateResonance") {
    return `God resonans med rom for dypde — ${desc}. Verdifullt å utforske.`;
  }
  
  return `${tier} — ${desc}. En start som kan vokse seg dypere med tid.`;
}

/**
 * generateShortExplanation gir en kort forklaring (under 50 tegn).
 */
export function generateShortExplanation(result: MatchResult): string {
  if (result.rejected && result.rejectionReason) {
    return `Avslått: ${result.rejectionReason}`;
  }
  
  const tier = tierLabel(result.tier);
  const percentage = Math.round(result.score * 100);
  return `${tier} — ${percentage}%`;
}