import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/requireAuth';
export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    // Admin-autorisasjon (same mønster som app/api/admin/users/[id]/route.ts)
    const result = await requireAuth(request);
    if (result instanceof NextResponse) return result;

    // Krever ADMIN-rolle
    if (result.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden — kun admin kan utføre denne handlingen' },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    // JourneyProgress is managed via the JourneyProgress model, not User.journeyStatus
    // This endpoint is legacy and kept for compatibility
    return new Response(JSON.stringify({ ok: true, message: "Legacy endpoint - no action taken" }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Error in next journey step:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}


