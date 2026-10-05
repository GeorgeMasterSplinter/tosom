/**
 * PL-05a (K-6) — Credentials-authorize logikk, eksportert for testbarhet.
 *
 * Regler (D-7):
 * 1. Rate limit FØR alt annet: 10 forsøk per e-post per 15 min.
 * 2. Ingen auto-registrering: ukjent e-post → null.
 * 3. Passordløse kontoer kan ikke overtas: user uten passord → null
 *    (de må bruke «Glemt passord», /glemt-passord).
 * 4. Passord verifiseres med bcrypt — feil passord → null.
 *
 * Alle veier returnerer null — ingen timing-lekkasje på «fant brukeren»
 * vs «blokkert» vs «feil passord».
 */

import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/hash";
import { pgCheck } from "@/lib/rate-limit-pg";

export async function authorizeCredentials(credentials?: {
  email?: string;
  password?: string;
}): Promise<{ id: string; email: string; name: string | null } | null> {
  const email = String(credentials?.email ?? "").trim().toLowerCase();
  const password = String(credentials?.password ?? "");

  if (!email || !password) return null;

  // K-6: Rate limiting FØR alt annet — 10 forsøk per e-post per 15 min.
  const rl = await pgCheck(`login:${email}`, 10, 900);
  if (!rl.ok) return null;

  // K-6: Ingen auto-registrering — ukjent e-post = avslag.
  // Konti opprettes eksplisitt via POST /api/auth/register (D-7).
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;

  // K-6: Passordløse kontoer kan ikke overtas — tidligere
  // magic-link-brukere (uten passord) må bruke «Glemt passord»
  // (/glemt-passord) istedenfor å la innloggingen sette nytt passord.
  if (!user.password) return null;

  const valid = await verifyPassword(password, user.password);
  if (!valid) return null;

  return { id: user.id, email: user.email, name: user.name };
}
