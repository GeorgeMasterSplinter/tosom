/**
 * POST /api/auth/register
 *
 * PL-05b (D-7, K-6) — Eksplisitt kontoopprettelse.
 *
 * Innlogging oppretter ALDRI konto (auto-registrering fjernet i
 * lib/auth/config.ts). Kun denne ruten lager nye brukere.
 *
 * Rekkefølge: CSRF → Zod → rate-limit (per IP) → eksistenssjekk →
 * beta-invite-gate → opprettelse.
 * Eksisterende e-post får EXAKT samme svar som suksess — vi avslører
 * aldri om en e-post allerede er registrert (V-15/K-6).
 *
 * Klienten logger deretter inn med signIn('credentials').
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { csrfCheck } from "@/lib/auth/csrf";
import { pgCheck } from "@/lib/rate-limit-pg";
import { hashPassword } from "@/lib/auth/hash";
import { registerSchema } from "@/lib/validation/auth";
import { isInvitedEmail, markInviteUsed } from "@/lib/beta/invites";
import { isInviteGateEnabled } from "@/config/features";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  // 1. CSRF øverst — kontoopprettelse er en skrivehandling.
  const csrf = await csrfCheck(req);
  if (csrf instanceof NextResponse) return csrf;

  // 2. Zod-validering: email, passord min 10 tegn, passord gjentatt likt.
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Ugyldig forespørsel" }, { status: 400 });
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Ugyldige data" },
      { status: 400 }
    );
  }
  const { email, password } = parsed.data;

  // 3. Rate-limit per IP: 5 registreringer per time.
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rl = await pgCheck(`register:${ip}`, 5, 3600);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "For mange forsøk. Prøv igjen senere." },
      { status: 429 }
    );
  }

  try {
    // 4. Eksisterende e-post → SAMME svar som suksess (avslør aldri
    // registrerte e-poster). Klienten forsøker å logge inn og får der
    // vanlig innloggingsfeil ved feil passord.
    const existing = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    if (existing) {
      return NextResponse.json({ ok: true });
    }

    // 4b. BETA INVITE GATE (limited invite-only beta).
    // Kun e-poster i BetaInvite-tabellen kan opprette NY konto.
    // Eksisterende brukere (steg 4) er ikke påvirket. Server-side,
    // normalisert oppslag (lowercase/trim) via isInvitedEmail.
    // Ikke-invitert e-post → 403 med GENERIC melding (ingen echo av
    // e-post, ingen liste-lekkasje; rate-limited via pgCheck over).
    // En invitert e-post kan kun opprette ÉN konto — dup-sjekk (steg 4)
    // blokkerer gjenbruk til en 2. konto for samme adresse.
    if (isInviteGateEnabled()) {
      const invited = await isInvitedEmail(email);
      if (!invited) {
        return NextResponse.json(
          { ok: false, error: "Registrering skjer kun via invitasjon." },
          { status: 403 }
        );
      }
      await markInviteUsed(email);
    }

    // 5. Opprett User + minimal Profile (onboarding fyller resten).
    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        password: passwordHash,
        verified: true,
        role: "USER",
      },
    });

    await prisma.profile
      .create({
        data: {
          userId: user.id,
          age: 25,
          deepProfileStep: "IDENTITY",
        },
      })
      .catch(() => {
        // Profil er ikke kritisk for kontoopprettelsen — onboarding
        // oppretter den hvis den mangler.
      });

    console.log(`[register] Ny bruker opprettet: ${email}`);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("POST /api/auth/register error:", error);
    return NextResponse.json({ ok: false, error: "Kunne ikke opprette konto" }, { status: 500 });
  }
}
