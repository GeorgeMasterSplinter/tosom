
import { getConversationMetadata } from "@/lib/admin/conversation";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
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
