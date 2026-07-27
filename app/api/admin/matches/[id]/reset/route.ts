import { prisma } from "@/lib/prisma";

import { adminAuthGuard } from "@/lib/auth/adminAuthGuard";
export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  const auth = await adminAuthGuard();
  if (auth) return auth;

  const { id } = await context.params;

  try {
    const match = await prisma.match.findUnique({
      where: { id }
    });

    if (!match) {
      return new Response(
        JSON.stringify({ error: "Match not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    await prisma.match.update({
      where: { id },
      data: {
        status: "pending",
      }
    });

    return new Response(
      JSON.stringify({ ok: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Error in reset match:", error);

    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}


