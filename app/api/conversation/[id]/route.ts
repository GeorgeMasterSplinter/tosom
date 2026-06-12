import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { getConversation, addMessage } from "@/lib/conversationStore";

/* ------ Data-types ------ */

interface Message {
  senderId: string;
  content: string;
  createdAt: Date;
}

interface ConversationData {
  id: string;
  userAId: string;
  userBId: string;
  messages: Message[];
  createdAt: Date;
}

/* ------ GET: hent conversation ------ */

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const conversation = getConversation(params.id);

    if (!conversation) {
      return new Response(
        JSON.stringify({ error: "Conversation not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Sjekk at brukaren er ein del av conversationen
    if (conversation.userAId !== session.user.id && conversation.userBId !== session.user.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        id: conversation.id,
        userAId: conversation.userAId,
        userBId: conversation.userBId,
        messages: conversation.messages,
        createdAt: conversation.createdAt,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

/* ------ POST: send melding ------ */

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const content = body?.content as string;

    if (!content || typeof content !== "string" || content.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Content is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const success = addMessage(params.id, session.user.id, content);

    if (!success) {
      return new Response(
        JSON.stringify({ error: "Conversation not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ status: "sent" }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
