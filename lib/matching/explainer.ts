// explainer.ts — genererer breakdown + naturleg-språk forklaring + match-tier

import { ScoreResult } from "./scorer";

/**
 * Kart per vekt til kort, menneskeleg lesbare forklaringar.
 */
function explainBase(score: number): string {
  if (score > 80) return "Sterk grunnleggjande kompatibilitet — felles interesser og nær alder.";
  if (score > 60) return "Bra grunnlag for kompatibilitet med fleire felles trekk.";
  if (score > 40) return "Nokre felles interesser og liknande alder.";
  return "Få felles trekk på grunnlaget. Kan vere utfordrande.";
}

function explainResonance(score: number): string {
  if (score > 80) return "Djup emosjonell resonans — deler verdiane og språket.";
  if (score > 60) return "God emosjonell resonans med felles perspektiv.";
  if (score > 40) return "Modest resonans — nokre felles emosjonelle signal.";
  return "Liten emosjonell resonans. Kan krevje meir arbeid.";
}

function explainSemantic(score: number): string {
  if (score > 80) return "Sterk semantisk overlap — deler tema, interesser og ordbruk.";
  if (score > 60) return "Tydeleg semantisk overlap i profil og interesser.";
  if (score > 40) return "Nokre semantiske likskapar, men ulik ordbruk.";
  return "Liten semantisk overlap. Ul like fokusområde.";
}

function explainIntimacy(score: number): string {
  if (score > 80) return "Mykje profil-djupde og åpenheit — indikerer evne til nære band.";
  if (score > 60) return "God profil-djupde med interessante detaljar.";
  if (score > 40) return "Moderat profil-djupde — nokre innsikter.";
  return "Begrensa profil-djupde. Kan trengje meir tid til å kjenne kvarandre.";
}

function explainFuture(score: number): string {
  if (score > 80) return "Sterk framtids-orientert kompatibilitet — liknande livsfase og mål.";
  if (score > 60) return "God framtids-sjans med overlap i livsmål.";
  if (score > 40) return "Nokre framtids-signalar, men ulik livsfase.";
  return "Liten framtids-orientert overlap. Kan vere ulik livsfase.";
}

const explainers = {
  base: explainBase,
  resonance: explainResonance,
  semantic: explainSemantic,
  intimacy: explainIntimacy,
  future: explainFuture,
};

/**
 * Gå ein ScoreResult og returner eit forklaring-objekt.
 */
export function generateExplanation(result: ScoreResult): {
  tier: ScoreResult["matchQuality"];
  tierLabel: string;
  breakdown: Array<{
    key: keyof typeof result.breakdown;
    score: number;
    label: string;
    explanation: string;
  }>;
  summary: string;
} {
  const tierLabels: Record<string, string> = {
    excellent: "Utmerka match",
    strong: "Sterk match",
    moderate: "Moderat match",
    weak: "Svak match",
  };

  const breakdown = (Object.keys(result.breakdown) as Array<keyof typeof result.breakdown>).map(
    (key) => ({
      key,
      score: result.breakdown[key],
      label:
        key === "base"
          ? "Grunnleggjande"
          : key === "resonance"
          ? "Emosjonell resonans"
          : key === "semantic"
          ? "Semantisk"
          : key === "intimacy"
          ? "Intimitet"
          : "Framtid",
      explanation: explainers[key](result.breakdown[key]),
    }),
  );

  // Høgst scorande modul
  let topKey: keyof typeof result.breakdown = "base";
  let topScore = 0;
  for (const [k, v] of Object.entries(result.breakdown)) {
    if (v > topScore) {
      topScore = v;
      topKey = k as keyof typeof result.breakdown;
    }
  }

  const summary =
    `${tierLabels[result.matchQuality]} (${result.totalScore}/100). ` +
    `Sterkaste området: ${breakdown.find((d) => d.key === topKey)?.label ?? "ukjent"} (${Math.round(topScore)}).`;

  return {
    tier: result.matchQuality,
    tierLabel: tierLabels[result.matchQuality],
    breakdown,
    summary,
  };
}
