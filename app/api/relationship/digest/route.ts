/* ═══════════════════════════════════════════
   Tosom — Weekly Digest API
   Genererer ukentlig oppsummering av relasjonsfremskritt
   ═══════════════════════════════════════════ */

import { NextRequest, NextResponse } from "next/server";
import { flags } from "@/utils/flags";

export const dynamic = 'force-dynamic';

interface DigestResponse {
  period: string;
  messageCount: number;
  previousMessageCount: number;
  journeyStepsCompleted: number;
  previousJourneySteps: number;
  memoriesCreated: number;
  previousMemories: number;
  resonanceStart: number;
  resonanceEnd: number;
  newMilestones: Array<{ id: string; title: string }>;
  topTopics: string[];
  suggestedNextStep: { title: string; description: string };
}

/* ---------------------------------------------------------- */
/*  GET — Generate weekly digest                              */
/* ---------------------------------------------------------- */

export async function GET(request: NextRequest) {
  if (!flags.enableWeeklyDigest) {
    return NextResponse.json(
      { error: "Weekly digest disabled" },
      { status: 403 },
    );
  }

  const { searchParams } = new URL(request.url);
  const conversationId = searchParams.get("conversationId");

  if (!conversationId) {
    return NextResponse.json(
      { error: "conversationId required" },
      { status: 400 },
    );
  }

  // Get current week dates
  const now = new Date();
  const dayOfWeek = now.getDay();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - dayOfWeek);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const period = `${startOfWeek.toLocaleDateString("no-NO", { day: "numeric", month: "short" })} – ${endOfWeek.toLocaleDateString("no-NO", { day: "numeric", month: "short" })}`;

  // Generate digest (demo data — replace with real aggregation)
  const digest: DigestResponse = {
    period,
    messageCount: 47,
    previousMessageCount: 38,
    journeyStepsCompleted: 3,
    previousJourneySteps: 2,
    memoriesCreated: 2,
    previousMemories: 1,
    resonanceStart: 72,
    resonanceEnd: 78,
    newMilestones: [
      { id: "first_memories", title: "Første felles minne" },
    ],
    topTopics: ["natur", "fremtidsplaner", "musikk"],
    suggestedNextStep: {
      title: "Utforsk emosjonell nærhet",
      description: "Dere er klare for å gå dypere inn i samtaler om følelser og verdier.",
    },
   };

  return NextResponse.json(digest);
}
