/* ═══════════════════════════════════════════
   ToSom — Server-Side Analytics Tracker
   Logger analytics events til database/extern tjeneste
   ═══════════════════════════════════════════ */

import { NextRequest, NextResponse } from "next/server";
import { flags, serverFlags } from "@/utils/flags";

export const dynamic = 'force-dynamic';

/* ---------------------------------------------------------- */
/*  Analytics event types                                       */
/* ---------------------------------------------------------- */

interface AnalyticsPayload {
  event:
    | "pageview"
    | "match_card_view"
    | "match_action"
    | "chat_open"
    | "journey_step_open"
    | "onboarding_complete"
    | "profile_edit"
    | "login"
    | "signup"
    | "purchase"
    | "custom";
  properties?: Record<string, string | number | boolean>;
  userId?: string | null;
  sessionId?: string | null;
  ip?: string;
  userAgent?: string;
  referrer?: string;
  url: string;
  timestamp: string;
}

/* ---------------------------------------------------------- */
/*  Validate event type                                         */
/* ---------------------------------------------------------- */

const VALID_EVENTS = [
  "pageview",
  "match_card_view",
  "match_action",
  "chat_open",
  "journey_step_open",
  "onboarding_complete",
  "profile_edit",
  "login",
  "signup",
  "purchase",
  "custom",
] as const;

function isValidEvent(event: string): event is (typeof VALID_EVENTS)[number] {
  return VALID_EVENTS.includes(event as any);
}

/* ---------------------------------------------------------- */
/*  Log event (write to DB / external service)                  */
/* ---------------------------------------------------------- */

async function logEvent(payload: AnalyticsPayload): Promise<void> {
  // Skriv til database — placeholder for actual DB insert
  // Fremtidig: prisma.analyticsEvent.create({ data: payload })

  // Eller send til ekstern analytics tjeneste
  // Fremtidig: fetch(process.env.ANALYTICS_API_URL, { method: "POST", body: ... })

  // For nå: console log (production vil ha proper backend)
  if (serverFlags.enableAiLogging) {
    console.log("[Analytics]", JSON.stringify(payload));
  }
}

/* ---------------------------------------------------------- */
/*  GET — server-side tracking                                  */
/* ---------------------------------------------------------- */

export async function GET(request: NextRequest) {
  // Ikke enabled uten analytics flag
  if (!flags.enableAnalytics) {
    return NextResponse.json({ status: "analytics_disabled" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const event = searchParams.get("event");
  const url = searchParams.get("url") || request.url;

  if (!event || !isValidEvent(event)) {
    return NextResponse.json(
      { error: "Invalid or missing event parameter" },
      { status: 400 },
    );
  }

  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";

  const payload: AnalyticsPayload = {
    event: event as AnalyticsPayload["event"],
    properties: Object.fromEntries(
      Object.fromEntries(searchParams.entries()).event
        ? Object.entries(Object.fromEntries(searchParams.entries()))
            .filter(([key]) => key !== "event" && key !== "url")
        : [],
    ),
    userId: searchParams.get("userId") || null,
    sessionId: searchParams.get("sessionId") || null,
    ip,
    userAgent: request.headers.get("user-agent") || undefined,
    referrer: request.headers.get("referer") || undefined,
    url,
    timestamp: new Date().toISOString(),
  };

  // Async log — don't wait
  void logEvent(payload);

  // Return 1x1 transparent pixel for browser compatibility
  const pixel = Buffer.from(
    "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
    "base64",
  );

  return new NextResponse(pixel, {
    status: 200,
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}

/* ---------------------------------------------------------- */
/*  POST — client-side event sending                            */
/* ---------------------------------------------------------- */

export async function POST(request: NextRequest) {
  if (!flags.enableAnalytics) {
    return NextResponse.json({ status: "analytics_disabled" }, { status: 403 });
  }

  try {
    const body: AnalyticsPayload = await request.json();

    // Validate required fields
    if (!body.event || !isValidEvent(body.event)) {
      return NextResponse.json(
        { error: "Invalid or missing event" },
        { status: 400 },
      );
    }

    if (!body.url) {
      return NextResponse.json(
        { error: "Missing url" },
        { status: 400 },
      );
    }

    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";

    const payload: AnalyticsPayload = {
      event: body.event,
      properties: body.properties || {},
      userId: body.userId || null,
      sessionId: body.sessionId || null,
      ip,
      userAgent: request.headers.get("user-agent") || undefined,
      referrer: request.headers.get("referer") || undefined,
      url: body.url,
      timestamp: body.timestamp || new Date().toISOString(),
    };

    void logEvent(payload);

    return NextResponse.json({ status: "tracked" }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }
}