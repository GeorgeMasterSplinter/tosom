import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/requireAuth';
export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    // STEG 9.1 FIX: Bruk konsolidert requireAdmin() i stedet for inline requireAuth()+role-sjekk
    const result = await requireAdmin(request);
    if (result instanceof NextResponse) return result;

    const { id } = await context.params;

    // JourneyProgress is managed via the JourneyProgress model, not User.journeyStatus
    // This endpoint is legacy and kept for compatibility
    return new Response(JSON.stringify({ ok: true, message: "Legacy endpoint - no action taken" }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Error in next journey step:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}