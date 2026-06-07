import { NextResponse } from "next/server";
import { requestResetSchema } from "@/lib/validation/auth";
import { checkRateLimit } from "@/lib/rateLimit";
import { prisma } from "@/lib/prisma";
import { storeResetToken, generateResetToken } from "@/lib/auth/reset";
import { randomUUID } from "crypto";

/**
 * POST /api/auth/request-reset
 * Sender ein reset-token til brukaren sin e-post.
 */
export async function POST(request: Request) {
  const body = await request.json();

  // Zod-validering
  const parse = requestResetSchema.safeParse(body);
  if (!parse.success) {
    return NextResponse.json(
      { error: parse.error.errors[0]?.message || "Ugyldig data" },
      { status: 400 }
    );
  }

  const { email } = parse.data;

  // Rate limiting: 3 forsøk per time per e-post
  if (checkRateLimit(`reset:${email}`, 3, 3_600_000)) {
    return NextResponse.json(
      { error: "For mange forsøk. Vent ei time før du prøver igjen." },
      { status: 429 }
    );
  }

  // Finn brukaren
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // Returner alltid same svar for å ikkje avsløre om e-post er registrert
  if (!user) {
    return NextResponse.json({ ok: true, message: "Om e-posten er registrert, vil du motta ein lenkje." });
  }

  // Generer og lagre token
  const token = generateResetToken();
  const expiresAt = new Date(Date.now() + 3600_000); // 1 time

  await storeResetToken(user.id, token, expiresAt);

  // I produksjon: send e-post med token-lenkje
  // t.d. /reset-password?email=${email}&token=${token}
  console.log(`[PASSWORD RESET] Token for ${email}: ${token}`);

  return NextResponse.json({
    ok: true,
    message: "Om e-posten er registrert, vil du motta ein lenkje innan få minutt.",
  });
}
