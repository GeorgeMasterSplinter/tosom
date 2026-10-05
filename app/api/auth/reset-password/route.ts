// Force Next.js to treat this as dynamic (never prerender API routes)
export const dynamic = "force-dynamic";

/**
 * POST /api/auth/reset-password
 *
 * PL-07c (K-6): Ende på «Glemt passord»-flyet.
 *
 * CSRF → Zod (min 10 tegn) → rate-limit (5/time per e-post) →
 * verifyResetToken → sett nytt passord → consumeResetToken (single-use)
 * → slett brukerens Session-rader (alle andre innloggingssteder
 * logges ut — passordet har endret seg).
 *
 * Utløpt eller ugyldig token gir alltid samme svar — avslører aldri
 * om e-posten finnes.
 */

import { NextRequest, NextResponse } from "next/server";
import { resetPasswordSchema } from "@/lib/validation/auth";
import { tryParseJsonBody } from "@/lib/api/validation";
import { pgCheck } from "@/lib/rate-limit-pg";
import { prisma } from "@/lib/prisma";
import { verifyResetToken, consumeResetToken } from "@/lib/auth/reset";
import { hashPassword } from "@/lib/auth/hash";
import { csrfCheck } from "@/lib/auth/csrf";
import { trackError } from "@/lib/errorTracker";

export async function POST(request: NextRequest): Promise<Response> {
  const json = (body: unknown, status?: number) =>
    NextResponse.json(body, { status });

  // L6: CSRF-vern
  const csrf = await csrfCheck(request);
  if (csrf instanceof NextResponse) return csrf;

  try {
    const body = await tryParseJsonBody(request);
    if (!body) return json({ ok: false, error: "Ugyldig body" }, 400);

    const parse = resetPasswordSchema.safeParse(body);
    if (!parse.success) {
      return json({ ok: false, error: parse.error.issues[0]?.message || "Ugyldig data" }, 400);
    }
    const { email, token, password } = parse.data;

    // Rate limiting: 5 forsøk per time per e-post (uavhengig av
    // request-reset sin kvote).
    const rl = await pgCheck(`reset-password:${email}`, 5, 3600);
    if (!rl.ok) {
      return json({ ok: false, error: "For mange forsøk. Vent ei time før du prøver igjen." }, 429);
    }

    // Ugyldig/utløpt/brukt token → 400. Samme svar som ukjent e-post.
    const verified = await verifyResetToken(token);
    if (!verified) {
      return json({ ok: false, error: "Lenken er ikke lenger gyldig. Be om en ny." }, 400);
    }

    // Tokenet binder AUTHORITATIVT til userId — e-postparameteren
    // skal bare stemme med kontoen, den velger ikke brukeren.
    const user = await prisma.user.findUnique({
      where: { id: verified.userId },
      select: { id: true, email: true },
    });
    if (!user || user.email.toLowerCase() !== email.toLowerCase()) {
      // Gyldig token, men e-posten i lenken stemmer ikke med kontoen —
      // likegodt feil lenke. Samme svar.
      return json({ ok: false, error: "Lenken er ikke lenger gyldig. Be om en ny." }, 400);
    }

    const passwordHash = await hashPassword(password);

    // Én transaksjon: nytt passord + single-use-markering + logg ut
    // alle øvrige sesjoner.
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: user.id },
        data: { password: passwordHash },
      });

      // Markér tokenet som brukt — kan ikke brukes to ganger.
      const consumed = await consumeResetToken(user.id);
      if (!consumed) {
        throw new Error("Reset-tokenet ble ikke brukt (allerede konsumert?)");
      }

      // Passordet har endret seg — alle øvrige sesjoner er mistenkelige.
      await tx.session.deleteMany({ where: { userId: user.id } });
    });

    console.log('[PASSWORD RESET] Passord tilbakestillt for brukeren');
    return json({ ok: true });
  } catch (error) {
    await trackError(error, "api/auth/reset-password");
    return json({ ok: false, error: "Noe gikk galt. Prøv igjen." }, 500);
  }
}
