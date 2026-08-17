/* ═══════════════════════════════════════════
   Tosom — Milestone System API
   Administrerer relasjons-milepæler
   ═══════════════════════════════════════════ */

import { NextRequest, NextResponse } from "next/server";
import { flags } from "@/utils/flags";

export const dynamic = 'force-dynamic';

interface Milestone {
  id?: string;
  conversationId: string;
  type: MilestoneType;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  requirement: string;
}

type MilestoneType =
  | "first_message"
  | "first_match"
  | "first_meeting"
  | "first_memories"
  | "one_month"
  | "six_months"
  | "one_year"
  | "journey_complete"
  | "timeline_event"
  | "custom";

const PREDEFINED_MILESTONES: Omit<Milestone, "id" | "conversationId" | "unlocked" | "unlockedAt">[] = [
  {
    type: "first_match",
    title: "Første Match",
    description: "Dere fikk deres første match sammen.",
    icon: "💛",
    requirement: "1 match",
  },
  {
    type: "first_message",
    title: "Første Melding",
    description: "Den første meldingen mellom dere ble sendt.",
    icon: "💬",
    requirement: "1 melding sendt",
  },
  {
    type: "first_memories",
    title: "Første Minne",
    description: "Dere lagret deres første felles minne.",
    icon: "📸",
    requirement: "1 minne lagret",
  },
  {
    type: "journey_complete",
    title: "Journey Fullført",
    description: "Dere fullførte deres første journey step.",
    icon: "✨",
    requirement: "1 journey step fullført",
  },
  {
    type: "timeline_event",
    title: "Timeline Milepæl",
    description: "Dere la til en milepæl i timeline.",
    icon: "🏆",
    requirement: "1 timeline event lagt til",
  },
  {
    type: "one_month",
    title: "1 Måned Samen",
    description: "Dere har vært sammen i en måned!",
    icon: "🌙",
    requirement: "30 dager sammen",
  },
  {
    type: "six_months",
    title: "6 Måneder Samen",
    description: "Ett halvt år sammen — stort bragd!",
    icon: "⭐",
    requirement: "180 dager sammen",
  },
  {
    type: "one_year",
    title: "1 År Samen",
    description: "Et fullt år sammen — ufattelig!",
    icon: "👑",
    requirement: "365 dager sammen",
  },
];

/* ---------------------------------------------------------- */
/*  GET — Fetch milestones                                    */
/* ---------------------------------------------------------- */

export async function GET(request: NextRequest) {
  if (!flags.enableMilestones) {
    return NextResponse.json(
      { error: "Milestones disabled" },
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

  // Fetch from DB (placeholder)
  // Fremtidig: const milestones = await prisma.milestone.findMany({ where: { conversationId } });

  // Return predefined milestones with unlocked status (placeholder logic)
  const unlockedMilestones: Milestone[] = PREDEFINED_MILESTONES.map((m, i) => ({
    ...m,
    id: `milestone-${i}`,
    conversationId,
    unlocked: i < 3, // First 3 unlocked for demo
    unlockedAt: i < 3 ? new Date(Date.now() - (3 - i) * 24 * 60 * 60 * 1000).toISOString() : undefined,
  }));

  return NextResponse.json({ milestones: unlockedMilestones, conversationId });
}

/* ---------------------------------------------------------- */
/*  POST — Unlock milestone                                   */
/* ---------------------------------------------------------- */

export async function POST(request: NextRequest) {
  if (!flags.enableMilestones) {
    return NextResponse.json(
      { error: "Milestones disabled" },
      { status: 403 },
    );
  }

  try {
    const body: { conversationId: string; type: MilestoneType } = await request.json();

    if (!body.conversationId || !body.type) {
      return NextResponse.json(
        { error: "conversationId and type required" },
        { status: 400 },
      );
    }

    const milestone = PREDEFINED_MILESTONES.find((m) => m.type === body.type);

    if (!milestone) {
      return NextResponse.json(
        { error: "Invalid milestone type" },
        { status: 400 },
      );
    }

    // Unlock (placeholder — save to DB)
     // Fremtidig: await prisma.milestone.create({ data: { ...milestone, conversationId, unlocked: true, unlockedAt: new Date().toISOString() } });

    return NextResponse.json({
      milestone: { ...milestone, conversationId: body.conversationId, unlocked: true, unlockedAt: new Date().toISOString() },
      status: "unlocked",
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }
}