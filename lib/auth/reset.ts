import { randomBytes, createHmac, timingSafeEqual } from "crypto";
import { prisma } from "@/lib/prisma";

/**
 * Generer en 32-byte (64 hex) reset token.
 */
export function generateResetToken(): string {
  return randomBytes(32).toString("hex");
}

/**
 * Deterministisk token-hash (HMAC-SHA256 nøkklet med AUTH_SECRET).
 *
 * PL-07-avvik: tidligere ble tokenet haset med scrypt + TILFELDIG salt
 * pr. kall — da kunne findUnique({ tokenHash }) ALDRI treffe den lagrede
 * raden, og verifyResetToken returnerte alltid false («Glemt passord»
 * fungerte ikke). HMAC er deterministisk, så O(1)-oppslaget via unik
 * indeks fungerer, og uten hemmelig nøkkel kan angriper ikke gjette
 * en hash (tokenet har i så fall 256 bit tilfells-entropi).
 */
export function hashToken(token: string): string {
  const key =
    process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "tosom-dev-secret";
  return createHmac("sha256", key).update(token).digest("hex");
}

/**
 * Verify token mot lagra hash (constant-time).
 */
export function verifyToken(token: string, storedHash: string): boolean {
  const inputHash = hashToken(token);
  if (inputHash.length !== storedHash.length) return false;
  return timingSafeEqual(Buffer.from(storedHash, "hex"), Buffer.from(inputHash, "hex"));
}

/**
 * Lagre en ny reset-token for en user.
 * Fjernar gamle tokens først.
 */
export async function storeResetToken(userId: string, token: string, expiresAt: Date) {
  // Fjern gamle tokens
  await prisma.passwordResetToken.deleteMany({
    where: { userId },
  });

  return prisma.passwordResetToken.create({
    data: {
      userId,
      tokenHash: hashToken(token),
      expiresAt,
    },
  });
}

/**
 * Hente og verify token. Returnerer den tilknyttede brukeren (userId)
 * ved gyldig token, ellers null ved feil/utgått/allerede brukt.
 *
 * userId er AUTHORITATIVT bundet til tokenet — kalleren kan ikke
 * kombinere et gyldig token med en annen e-post.
 *
 * SECURITY: Filtrerer direkte på hashet token-verdi (O(1) oppslag via
 * unik indeks) for å unngå timing-baserte/enumererings-angrep.
 */
export async function verifyResetToken(
  token: string
): Promise<{ userId: string } | null> {
  const hashed = hashToken(token);

  // O(1) oppslag via unik indeks på tokenHash — constant-time gjennom database-indeksen
  const record = await prisma.passwordResetToken.findUnique({
    where: { tokenHash: hashed },
  });

  if (!record) return null;

  // Sjekk at tokenet ikke er utløpt eller allerede brukt
  if (record.expiresAt <= new Date() || record.usedAt !== null) return null;

  return { userId: record.userId };
}

/**
 * Markere token som brukt (single-use).
 */
export async function consumeResetToken(userId: string): Promise<boolean> {
  const result = await prisma.passwordResetToken.updateMany({
    where: {
      userId,
      expiresAt: { gt: new Date() },
      usedAt: null,
    },
    data: { usedAt: new Date() },
  });

  return result.count > 0;
}

/**
 * Sjekk om en user har en gyldig (ikke-brukt) token.
 */
export async function hasValidResetToken(userId: string): Promise<boolean> {
  const count = await prisma.passwordResetToken.count({
    where: {
      userId,
      expiresAt: { gt: new Date() },
      usedAt: null,
    },
  });
  return count > 0;
}
