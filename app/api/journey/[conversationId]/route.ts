import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { initJourney, getJourney, advanceJourney } from "@/lib/journeyStore";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  const session = await getServerSession(authOptions);
  const { conversationId } = await params;

  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    let journey = getJourney(conversationId);
    if (!journey) journey = initJourney(conversationId);

    return new Response(
      JSON.stringify({
        steps: journey.steps,
        index: journey.index,
        current: journey.current
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch {
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  const session = await getServerSession(authOptions);
  const { conversationId } = await params;

  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    let journey = getJourney(conversationId);
    if (!journey) journey = initJourney(conversationId);

    const advanced = advanceJourney(conversationId);
    if (!advanced) {
      return new Response(JSON.stringify({ error: "Journey not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(
      JSON.stringify({
        steps: advanced.steps,
        index: advanced.index,
        current: advanced.current
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch {
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}
