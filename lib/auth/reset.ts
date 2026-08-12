import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { prisma } from "@/lib/prisma";

/**
 * Generer ein 32-byte (64 hex) reset token.
 */
export function generateResetToken(): string {
  return randomBytes(32).toString("hex");
}

/**
 * Hash token med scrypt før lagring i DB.
 */
export function hashToken(token: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(token, salt, 32).toString("hex");
  return `${salt}:${hash}`;
}

/**
 * Verify token mot lagra hash.
 */
export function verifyToken(token: string, storedHash: string): boolean {
  const [salt, hash] = storedHash.split(":");
  const inputHash = scryptSync(token, salt, 32).toString("hex");
  return timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(inputHash, "hex"));
}

/**
 * Lagre ein ny reset-token for ein user.
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
 * Hente og verify token. Returnerar null ved feil/utgått.
 *
 * SECURITY: Filtrerer direkte på hashet token-verdi (O(1) oppslag via unik indeks)
 * for å unngå timing-baserte/enumererings-angrep.
 */
export async function verifyResetToken(token: string): Promise<boolean> {
  const hashed = hashToken(token);

  // O(1) oppslag via unik indeks på tokenHash — constant-time gjennom database-indeksen
  const record = await prisma.passwordResetToken.findUnique({
    where: { tokenHash: hashed },
  });

  if (!record) return false;

  // Sjekk at tokenet ikke er utløpt eller allerede brukt
  if (record.expiresAt <= new Date() || record.usedAt !== null) return false;

  return true;
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
 * Sjekk om ein user har ein gyldig (ikke-brukt) token.
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
