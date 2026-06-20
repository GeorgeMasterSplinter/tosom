/* ═══════════════════════════════════════════
   ToSom — AI Journey Next Step API
   Anbefaler neste journey-step basert på fremgang
   ═══════════════════════════════════════════ */

import { NextRequest, NextResponse } from "next/server";
import { flags } from "@/utils/flags";

interface JourneyRequest {
  completedSteps: Array<{ id: string; title: string; category: string }>;
  resonanceScore: number;
  chatFrequency: number; // messages per day
  userId?: string;
}

interface JourneyResponse {
  recommendedStep: {
    id: string;
    title: string;
    description: string;
    reason: string;
  };
  alternatives: Array<{ id: string; title: string }>;
}

/* ---------------------------------------------------------- */
/*  POST — Get next journey step recommendation                 */
/* ---------------------------------------------------------- */

export async function POST(request: NextRequest) {
  if (!flags.enableJourneyV2) {
    return NextResponse.json(
      { error: "Journey V2 disabled" },
      { status: 403 },
    );
  }

  try {
    const body: JourneyRequest = await request.json();
    const { completedSteps, resonanceScore, chatFrequency } = body;

    const allSteps = getAvailableSteps();
    const completedIds = new Set(completedSteps.map((s) => s.id));
    const available = allSteps.filter((s) => !completedIds.has(s.id));

    if (available.length === 0) {
      return NextResponse.json({
        recommendedStep: {
          id: "complete",
          title: "Reisen er fullført!",
          description: "Du har fullført alle journey-steg. Fortsett å bygge på relasjonen din.",
          reason: "Alle steg fullført",
        },
        alternatives: [],
      });
    }

    // AI-powered recommendation (if API_KEY available)
    const apiKey = process.env.AI_API_KEY;
    if (apiKey) {
      try {
        const aiRecommendation = await getAiRecommendation(body);
        if (aiRecommendation) {
          return NextResponse.json(aiRecommendation);
        }
      } catch {
        // Fall through to rule-based
      }
    }

    // Rule-based recommendation
    const recommended = recommendByRules(available, completedSteps, resonanceScore, chatFrequency);

    return NextResponse.json({
      recommendedStep: recommended,
      alternatives: available
        .filter((s) => s.id !== recommended.id)
        .slice(0, 2)
        .map((s) => ({ id: s.id, title: s.title })),
    });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

/* ---------------------------------------------------------- */
/*  Rule-based recommendation                                     */
/* ---------------------------------------------------------- */

function recommendByRules(
  available: Array<{ id: string; title: string; description: string; category: string; order: number }>,
  completed: Array<{ id: string; category: string }>,
  resonanceScore: number,
  chatFrequency: number,
): JourneyResponse["recommendedStep"] {
  // Prioritize based on user state
  let scored = available.map((step) => {
    let score = step.order; // default order

    // If low resonance, prioritize connection-building steps
    if (resonanceScore < 50 && step.category === "connection") score -= 10;

    // If low chat frequency, prioritize communication steps
    if (chatFrequency < 3 && step.category === "communication") score -= 8;

    // If recent steps in category, alternate categories
    const recentCategory = completed[completed.length - 1]?.category;
    if (step.category === recentCategory) score += 2;

    return { ...step, score };
  });

  scored.sort((a, b) => a.score - b.score);
  const best = scored[0];

  return {
    id: best.id,
    title: best.title,
    description: best.description,
    reason: generateReason(best.category, resonanceScore),
  };
}

function generateReason(category: string, resonanceScore: number): string {
  const reasons: Record<string, string> = {
    connection: "Dette steget hjelper deg med å bygge dypere forbindelse.",
    communication: "Dette steget fokuserer på bedre kommunikasjon.",
    vulnerability: "Dette steget utfordrer deg til å være mer sårbar.",
    trust: "Dette steget bygger tillit mellom dere.",
    intimacy: "Dette steget utforsker nærhet på et dypere nivå.",
    growth: "Dette steget fokuserer på felles vekst.",
  };
  return reasons[category] || "Et naturlig neste steg i reisen deres.";
}

/* ---------------------------------------------------------- */
/*  AI recommendation via OpenAI                                  */
/* ---------------------------------------------------------- */

async function getAiRecommendation(
  body: JourneyRequest,
): Promise<JourneyResponse | null> {
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `Du er en relasjons-coach. Basert på brukerens fremgang, anbefal neste journey-steg.

Fullførte steg: ${body.completedSteps.map((s) => s.title).join(", ") || "Ingen"}
Resonansscore: ${body.resonanceScore}/100
Snakket per dag: ~${body.chatFrequency} meldinger

Gi kun et JSON-svar med denne struktur:
{
  "recommendedStep": { "id": "...", "title": "...", "description": "...", "reason": "..." },
  "alternatives": [{ "id": "...", "title": "..." }, { "id": "...", "title": "..." }]
}`,
          },
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "";

    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  } catch {
    return null;
  }
}

/* ---------------------------------------------------------- */
/*  Available journey steps (data)                                */
/* ---------------------------------------------------------- */

function getAvailableSteps(): Array<{
  id: string;
  title: string;
  description: string;
  category: string;
  order: number;
}> {
  return [
    { id: "intro", title: "Hvorfor er du her?", description: "Reflekter over hva som fikk deg til å starte denne reisen.", category: "awareness", order: 1 },
    { id: "values", title: "Dine kjerneverdier", description: "Identifiser de 3 viktigste verdiene dine.", category: "awareness", order: 2 },
    { id: "vulnerability-1", title: "Liten sårbarhet", description: "Del noe personlig med din match.", category: "vulnerability", order: 3 },
    { id: "connection-1", title: "Felles øyeblikk", description: "Planlegg et meningsfullt felles øyeblikk.", category: "connection", order: 4 },
    { id: "communication-1", title: "Dypere samtale", description: "Prøv en samtale som går dypere enn hverdagsprat.", category: "communication", order: 5 },
    { id: "trust-1", title: "Lit på prosessen", description: "Gi deg selv og relasjonen tid til å vokse.", category: "trust", order: 6 },
    { id: "intimacy-1", title: "Emosjonell nærhet", description: "Utforsk hva emosjonell nærhet betyr for deg.", category: "intimacy", order: 7 },
    { id: "growth-1", title: "Felles mål", description: "Definer et felles mål dere kan jobbe mot.", category: "growth", order: 8 },
    { id: "vulnerability-2", title: "Større sårbarhet", description: "Del noe du aldri har delt med noen før.", category: "vulnerability", order: 9 },
    { id: "connection-2", title: "Sår og trygghet", description: "Skap et rom der begge kan være seg selv.", category: "connection", order: 10 },
  ];
}