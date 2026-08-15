/**
 * ToSom — Prisma Singleton (B5.5)
 * 
 * Connection pooling for serverless:
 * - connection_limit=1 per instans (unngår connection-utmattelse)
 * - Bruk DATABASE_URL med ?pgbouncer=true&connection_limit=1 for Vercel
 * - DIRECT_URL for migreringer (prisma migrate)
 */

import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error"],
    // B5.5: Begrens forbindelser per serverless-instans
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
