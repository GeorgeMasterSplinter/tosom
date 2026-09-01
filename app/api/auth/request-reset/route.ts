// Force Next.js to treat this as dynamic (never prerender API routes)
export const dynamic = "force-dynamic";

import { requestResetSchema } from "@/lib/validation/auth";
import { pgCheck } from "@/lib/rate-limit-pg";
import { prisma } from "@/lib/prisma";
import { storeResetToken, generateResetToken } from "@/lib/auth/reset";
import { NextRequest, NextResponse } from "next/server";
import { csrfCheck } from "@/lib/auth/csrf";

/**
 * POST /api/auth/request-reset
 * Sender inn reset-token til brukaren sin e-post.
 */
export async function POST(
  request: NextRequest
): Promise<Response> {
  // L6: CSRF-vern
  const csrf = await csrfCheck(request);
  if (csrf instanceof NextResponse) return csrf;

  const body = await request.json();

  // Zod-validering
  const parse = requestResetSchema.safeParse(body);
  if (!parse.success) {
    return new Response(JSON.stringify({ error: parse.error.issues[0]?.message || "Ugyldig data" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  const { email } = parse.data;

  // Rate limiting: 3 forsøk per time per e-post.
  // pgCheck er atomisk og deles mellom serverless-instanser — den gamle
  // in-memory telleren ga hver instans sin egen kvote (reelt: 3 × antall
  // instanser). MERK: pgCheck returnerer ok=true når foresprørselen er
  // innenfor grensen, motsatt av gamle checkRateLimit.
  const rl = await pgCheck(`reset:${email}`, 3, 3600);
  if (!rl.ok) {
    return new Response(JSON.stringify({ error: "For mange forsøk. Vent ei time før du prøver igjen." }), { status: 429, headers: { "Content-Type": "application/json" } });
  }

  // Finn brukaren
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // Returner alltid samme svar for å ikke avsløre om e-post er registrert
  if (!user) {
    return new Response(JSON.stringify({ ok: true, message: "Om e-posten er registrert, vil du motta en lenke." }), { status: 200, headers: { "Content-Type": "application/json" } });
  }

  // Generer og lagre token
  const token = generateResetToken();
  const expiresAt = new Date(Date.now() + 3600_000); // 1 time

  await storeResetToken(user.id, token, expiresAt);

  // I produksjon: send e-post med token-lenkje
  // t.d. /reset-password?email=${email}&token=${token}
  console.log(`[PASSWORD RESET] Token for ${email}: ${token}`);

  return new Response(JSON.stringify({
    ok: true,
    message: "Om e-posten er registrert, vil du motta en lenke innen få minutt.",
  }), { status: 200, headers: { "Content-Type": "application/json" } });
}
