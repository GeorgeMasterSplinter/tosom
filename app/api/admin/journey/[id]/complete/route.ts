import { prisma } from "@/lib/prisma";


export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  const { id } = await context.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
    }

    await prisma.user.update({
      where: { id },
      data: {
        onboardingStep: 999,
      }
    });

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Error in mark journey as completed:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
