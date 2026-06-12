import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { startMatching, getMatchingStatus } from "@/lib/matchingWorker";

/* ------ Match status type ------ */

interface MatchStatus {
  status: "no_match" | "pending" | "matched";
  matchId: string | null;
  updatedAt: string;
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Hent status frå matching-worker
    const status = getMatchingStatus(session.user.id);
    return new Response(
      JSON.stringify(status),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Parsing av kropp (valfritt userId)
    const body = await request.json().catch(() => ({}));
    const userId = body?.userId ?? session.user.id;

    // Start matching-prosess via worker
    startMatching(userId);

    return new Response(
      JSON.stringify({ status: "pending" }),
      { status: 202, headers: { "Content-Type": "application/json" } }
    );
  } catch {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
