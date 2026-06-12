import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { initJourney, getJourney, advanceJourney } from "@/lib/journeyStore";

interface JourneyResponse { steps: { id: string; title: string; description: string }[]; currentStep: number; current: { id: string; title: string; description: string }; updatedAt: string; }

export async function GET(
  _req: Request,
  { params }: { params: { conversationId: string } }
)
{
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
  try {
    let journey = getJourney(params.conversationId);
    if (!journey) journey = initJourney(params.conversationId);
    const current = journey.steps[journey.currentStep] || journey.steps[journey.steps.length - 1];
    return new Response(JSON.stringify({ steps: journey.steps, currentStep: journey.currentStep, current, updatedAt: journey.updatedAt }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch {
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

export async function POST(
  _req: Request,
  { params }: { params: { conversationId: string } }
)
{
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
  try {
    let journey = getJourney(params.conversationId);
    if (!journey) journey = initJourney(params.conversationId);
    const advanced = advanceJourney(params.conversationId);
    if (!advanced) return new Response(JSON.stringify({ error: "Journey not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
    const current = advanced.steps[advanced.currentStep] || advanced.steps[advanced.steps.length - 1];
    return new Response(JSON.stringify({ steps: advanced.steps, currentStep: advanced.currentStep, current, updatedAt: advanced.updatedAt }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch {
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
