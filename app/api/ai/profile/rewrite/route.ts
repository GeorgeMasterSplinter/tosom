/* ═══════════════════════════════════════════
   ToSom — AI Profile Rewrite API
   Genererer forbedrede profiler med 3 toner
   ═══════════════════════════════════════════ */

import { NextRequest, NextResponse } from "next/server";
import { flags } from "@/utils/flags";

export const dynamic = 'force-dynamic';

/* ---------------------------------------------------------- */
/*  Request / Response types                                    */
/* ---------------------------------------------------------- */

interface RewriteRequest {
  bio: string;
  interests: string[];
  name?: string;
}

interface RewriteResponse {
  rolig: string;
  lekende: string;
  moden: string;
}

/* ---------------------------------------------------------- */
/*  POST — Generate profile rewrites                            */
/* ---------------------------------------------------------- */

export async function POST(request: NextRequest) {
  // Feature flag check
  if (!flags.enableAiMatchInsights) {
    return NextResponse.json(
      { error: "AI features disabled" },
      { status: 403 },
    );
  }

  try {
    const body: RewriteRequest = await request.json();

    if (!body.bio || !body.interests?.length) {
      return NextResponse.json(
        { error: "bio and interests are required" },
        { status: 400 },
      );
    }

    const { bio, interests, name } = body;

    // Check for API key
    const apiKey = process.env.AI_API_KEY;
    if (!apiKey) {
      // Fallback: generate template rewrites without AI
      const rolig = generateTemplateRewrite(bio, interests, name, "rolig");
      const lekende = generateTemplateRewrite(bio, interests, name, "lekende");
      const moden = generateTemplateRewrite(bio, interests, name, "moden");

      return NextResponse.json({
        rolig,
        lekende,
        moden,
        fallback: true,
      });
    }

    // AI-powered rewrite (when AI_API_KEY is available)
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
            content: `Du er en profesjonell profilskriver for dating. Gi ${name ? name + " " : ""}tre ulike versjoner av bio-en. Bruk norsk (bokmål/nynorsk blandet, som i originalen). Hold det kort (3–4 setninger per variant).

Toner:
1. "rolig" — rolig, dyp, reflektert
2. "lekende" — lett, humoristisk, eventyrlysten
3. "moden" — seriøs, klar, forpliktet

Interesser: ${interests.join(", ")}
Original bio: "${bio}"`,
          },
        ],
        max_tokens: 500,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      throw new Error("AI API error");
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "";

    // Parse response into 3 variants
    const parsed = parseAiResponse(text);

    const fallbackRolig = generateTemplateRewrite(bio, interests, name, "rolig");
    const fallbackLekende = generateTemplateRewrite(bio, interests, name, "lekende");
    const fallbackModen = generateTemplateRewrite(bio, interests, name, "moden");

    return NextResponse.json({
      rolig: parsed.rolig || fallbackRolig,
      lekende: parsed.lekende || fallbackLekende,
      moden: parsed.moden || fallbackModen,
    });
  } catch (error) {
    // Fallback to templates
    return NextResponse.json({
      rolig: generateTemplateRewrite("", [], undefined, "rolig"),
      lekende: generateTemplateRewrite("", [], undefined, "lekende"),
      moden: generateTemplateRewrite("", [], undefined, "moden"),
      error: "AI fallback to templates",
    });
  }
}

/* ---------------------------------------------------------- */
/*  Helpers                                                     */
/* ---------------------------------------------------------- */

function generateTemplateRewrite(
  bio: string,
  interests: string[],
  name: string | undefined,
  tone: "rolig" | "lekende" | "moden",
): string {
  const templates: Record<string, string> = {
    rolig: `${name ? name + " er " : "Du er "}${
      bio ? "en rolig sjel som setter pris på " + interests.join(", ") + ". " : ""
    }Tror på dypere forbindelser og meningsfulle samtaler. Gjerne en kveld med god mat, en god bok eller et rolig møte ved vannet.`,
    lekende: `${name ? name + " er " : "Du er "}${
      bio ? "alltid i bevegelse og elsker " + interests.join(", ") + ". " : ""
    }Livet skal være en eventyr — lat oss utforske verden sammen, med et smil og en god historie.`,
    moden: `${name ? name + " er " : "Du er "}${
      bio ? "en moden person som vet hva man vil. " + interests.join(", ") + " er viktig for deg. " : ""
    }Søker etter noe ekte og varig — med respekt, ærlighet og felles verdier.`
  };
  return templates[tone];
}

function parseAiResponse(text: string): { rolig?: string; lekende?: string; moden?: string } {
  const parts = text.split(/\d\.\s*/);
  return {
    rolig: parts[1]?.trim?.() || text,
    lekende: parts[2]?.trim?.() || text,
    moden: parts[3]?.trim?.() || text,
  };
}