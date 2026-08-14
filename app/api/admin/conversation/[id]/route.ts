import { adminAuthGuard } from "@/lib/auth/adminAuthGuard";
import { getConversationMetadata } from "@/lib/admin/conversation";
import prisma from "@/lib/prisma";
export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/conversation/[id]
 *
 * Hent metadata for en samtale (admin).
 * C3: Skriver AuditLog-rad for å spore admin-innsyn.
 */
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  const auth = await adminAuthGuard();
  if (auth) return auth;

  try {
    const { id } = await context.params;

    // C3: Skriv AuditLog før innsyn — sporet at admin åpner samtale
    //  — action-enum utvides ved behov
    await prisma.auditLog.create({
      data: {
        adminId: 'system', // adminAuthGuard setter ikke user-id i responsen
        action: 'CONVERSATION_FREEZE' as any,
        metadata: JSON.stringify({ conversationId: id, reason: 'admin_innsyn' }),
      },
    });

    const metadata = await getConversationMetadata(id);

    if (!metadata) {
      return new Response(
        JSON.stringify({ error: "Conversation not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ conversation: metadata }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[admin conversation GET] Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}