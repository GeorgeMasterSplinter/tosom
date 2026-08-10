import { adminAuthGuard } from "@/lib/auth/adminAuthGuard";
import { getConversationMetadata } from "@/lib/admin/conversation";
export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  // STREG 1 Fix 3: Legg til server-side admin auth
  const auth = await adminAuthGuard();
  if (auth) return auth;

  try {
    const { id } = await context.params;

    const metadata = await getConversationMetadata(id);

    if (!metadata) {
      return new Response(
        JSON.stringify({ error: "Conversation not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    return new Response(
      JSON.stringify({ conversation: metadata }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("[admin conversation GET] Error:", error);

    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}