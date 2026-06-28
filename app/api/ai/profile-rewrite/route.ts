// ═════════════════════════════════════════════════════
// ⚠️  DEPRECATED — DO NOT USE
// Duplicate of /api/ai/profile/rewrite/
//
// All imports should use: POST /api/ai/profile/rewrite
//
// TODO: Remove after Fase 2 cleanup.
// ═══════════════════════════════════════════════════

import { NextResponse } from "next/server";

export async function POST(_request: Request) {
  // Deprecated endpoint — redirect to canonical route
  return NextResponse.json(
    { error: "Deprecated. Use POST /api/ai/profile/rewrite instead.", redirect: "/api/ai/profile/rewrite" },
    { status: 410 }, // Gone
  );
}