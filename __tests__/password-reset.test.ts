/**
 * K-6 — «Glemt passord» ende-til-ende (PL-07)
 *
 * 1. Ukjent e-post på request-reset gir samme svar som kjent e-post
 *    (avslører aldri om e-posten finnes)
 * 2. Utløpt token på reset-password → 400, ingen passordendring
 * 3. Gyldig token setter passord, bruker tokenet (single-use) og
 *    sletter sesjonene — samme token kan ikke brukes to ganger
 *
 * Unit-stil: prisma er mocket med et in-memory PasswordResetToken-lager,
 * men selve token-logikken (lib/auth/reset.ts) kjører ekte.
 */

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateResetToken, hashToken } from "@/lib/auth/reset";
import { POST as requestResetPost } from "@/app/api/auth/request-reset/route";
import { POST as resetPasswordPost } from "@/app/api/auth/reset-password/route";

// ---- Mocks ---------------------------------------------------------------

interface MockTokenRecord {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  usedAt: Date | null;
}

const mockTokenStore: MockTokenRecord[] = [];

const pgCheckMock = jest.fn().mockResolvedValue({ ok: true, remaining: 10 });
jest.mock("@/lib/rate-limit-pg", () => ({
  pgCheck: (...args: unknown[]) => pgCheckMock(...args),
}));

const csrfCheckMock = jest.fn().mockResolvedValue(true);
jest.mock("@/lib/auth/csrf", () => ({
  csrfCheck: (...args: unknown[]) => csrfCheckMock(...args),
}));

const hashPasswordMock = jest.fn().mockResolvedValue("mock-hash");
jest.mock("@/lib/auth/hash", () => ({
  hashPassword: (...args: unknown[]) => hashPasswordMock(...args),
  verifyPassword: jest.fn(),
}));

const sendPasswordResetEmailMock = jest.fn().mockResolvedValue({ success: true });
jest.mock("@/lib/email", () => ({
  sendPasswordResetEmail: (...args: unknown[]) => sendPasswordResetEmailMock(...args),
}));

jest.mock("@/lib/errorTracker", () => ({
  trackError: jest.fn(),
}));

jest.mock("@/lib/prisma", () => {
  const prisma = {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    session: {
      deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
    },
    passwordResetToken: {
      deleteMany: jest.fn(async ({ where }: { where: { userId: string } }) => {
        for (let i = mockTokenStore.length - 1; i >= 0; i--) {
          if (mockTokenStore[i].userId === where.userId) mockTokenStore.splice(i, 1);
        }
        return { count: 0 };
      }),
      create: jest.fn(async ({ data }: { data: MockTokenRecord }) => {
        const rec: MockTokenRecord = {
          userId: data.userId,
          tokenHash: data.tokenHash,
          expiresAt: data.expiresAt,
          usedAt: null,
        };
        mockTokenStore.push(rec);
        return rec;
      }),
      findUnique: jest.fn(
        async ({ where }: { where: { tokenHash: string } }) =>
          mockTokenStore.find((t) => t.tokenHash === where.tokenHash) ?? null
      ),
      updateMany: jest.fn(
        async ({ where, data }: { where: Partial<MockTokenRecord>; data: Partial<MockTokenRecord> }) => {
          let count = 0;
          for (const t of mockTokenStore) {
            if (where.userId && t.userId !== where.userId) continue;
            if (t.expiresAt <= new Date()) continue;
            if (where.usedAt === null && t.usedAt !== null) continue;
            Object.assign(t, data);
            count++;
          }
          return { count };
        }
      ),
    },
    $transaction: jest.fn(),
  };
  return { __esModule: true, default: prisma, prisma };
});

// ---- Helpers -------------------------------------------------------------

function makeRequest(path: string, body: unknown): NextRequest {
  return new NextRequest(`http://localhost:3000${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": "test-csrf-token",
    },
    body: JSON.stringify(body),
  });
}

/** Legg inn et token i det in-memory-lageret (ekte hash). */
function seedToken(userId: string, expiresAt: Date): string {
  const token = generateResetToken();
  mockTokenStore.push({ userId, tokenHash: hashToken(token), expiresAt, usedAt: null });
  return token;
}

beforeEach(() => {
  mockTokenStore.length = 0;
  pgCheckMock.mockReset().mockResolvedValue({ ok: true, remaining: 10 });
  csrfCheckMock.mockReset().mockResolvedValue(true);
  hashPasswordMock.mockClear();
  sendPasswordResetEmailMock.mockClear().mockResolvedValue({ success: true });
  (prisma.user.findUnique as jest.Mock).mockReset();
  (prisma.user.update as jest.Mock).mockReset().mockResolvedValue({ id: "u-1" });
  (prisma.session.deleteMany as jest.Mock).mockReset().mockResolvedValue({ count: 0 });
  (prisma.$transaction as jest.Mock).mockReset();
  (prisma.$transaction as jest.Mock).mockImplementation(async (cb: (tx: unknown) => Promise<unknown>) => cb(prisma));
});

// ---- 1. request-reset: avslører aldri registrerte e-poster ----------------

describe("POST /api/auth/request-reset", () => {
  test("ukjent e-post og kjent e-post gir begge 200 + ok:true (ingen avsløring)", async () => {
    // Ukjent:
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    const unknownRes = await requestResetPost(
      makeRequest("/api/auth/request-reset", { email: "ukjent@epost.no" })
    );
    const unknownBody = await unknownRes.json();

    // Kjent:
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: "u-1", email: "kjent@epost.no" });
    const knownRes = await requestResetPost(
      makeRequest("/api/auth/request-reset", { email: "kjent@epost.no" })
    );
    const knownBody = await knownRes.json();

    expect(unknownRes.status).toBe(200);
    expect(knownRes.status).toBe(200);
    expect(unknownBody.ok).toBe(true);
    expect(knownBody.ok).toBe(true);
    expect(typeof unknownBody.message).toBe("string");
    expect(typeof knownBody.message).toBe("string");
  });

  test("kjent e-post: token lagres og e-post sendes med /nytt-passord-lenke", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: "u-1", email: "kjent@epost.no" });
    const res = await requestResetPost(
      makeRequest("/api/auth/request-reset", { email: "kjent@epost.no" })
    );
    expect(res.status).toBe(200);
    expect(mockTokenStore).toHaveLength(1);
    expect(mockTokenStore[0].userId).toBe("u-1");
    expect(sendPasswordResetEmailMock).toHaveBeenCalledTimes(1);
    const [to, link] = sendPasswordResetEmailMock.mock.calls[0];
    expect(to).toBe("kjent@epost.no");
    expect(link).toContain("/nytt-passord?email=");
    expect(link).toContain("token=");
  });
});

// ---- 2-3. reset-password --------------------------------------------------

describe("POST /api/auth/reset-password", () => {
  test("utløpt token → 400, ingen passordendring", async () => {
    const token = seedToken("u-1", new Date(Date.now() - 60_000)); // utløpt for 1 min siden
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: "u-1" });

    const res = await resetPasswordPost(
      makeRequest("/api/auth/reset-password", {
        email: "bruker@epost.no",
        token,
        password: "nytt-passord-123",
      })
    );

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect((prisma.user.update as jest.Mock)).not.toHaveBeenCalled();
  });

  test("ukjent e-post med gyldig token → 400 (samme svar som utløpt token)", async () => {
    const token = seedToken("u-1", new Date(Date.now() + 3600_000));
    // Kontoen bak tokenet har EN ANDEN e-post enn den i lenken:
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: "u-1", email: "annen@epost.no" });

    const res = await resetPasswordPost(
      makeRequest("/api/auth/reset-password", {
        email: "feil@epost.no",
        token,
        password: "nytt-passord-123",
      })
    );

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect((prisma.user.update as jest.Mock)).not.toHaveBeenCalled();
    expect((prisma.session.deleteMany as jest.Mock)).not.toHaveBeenCalled();
  });

  test("gyldig token → passord settes, token brukt, sesjoner slettet", async () => {
    const token = seedToken("u-1", new Date(Date.now() + 3600_000));
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: "u-1", email: "bruker@epost.no" });

    const res = await resetPasswordPost(
      makeRequest("/api/auth/reset-password", {
        email: "bruker@epost.no",
        token,
        password: "nytt-passord-123",
      })
    );

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    // Passordet er hashed og satt:
    expect(hashPasswordMock).toHaveBeenCalledWith("nytt-passord-123");
    expect((prisma.user.update as jest.Mock)).toHaveBeenCalledWith({
      where: { id: "u-1" },
      data: { password: "mock-hash" },
    });
    // Tokenet er nå brukt (single-use):
    expect(mockTokenStore[0].usedAt).not.toBeNull();
    // Alle øvrige sesjoner er slettet:
    expect((prisma.session.deleteMany as jest.Mock)).toHaveBeenCalledWith({
      where: { userId: "u-1" },
    });
  });

  test("brukt token kan ikke brukes to ganger", async () => {
    const token = seedToken("u-1", new Date(Date.now() + 3600_000));
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: "u-1", email: "bruker@epost.no" });
    const payload = { email: "bruker@epost.no", token, password: "nytt-passord-123" };

    const first = await resetPasswordPost(makeRequest("/api/auth/reset-password", payload));
    expect(first.status).toBe(200);

    // Samme token, andre gang:
    const second = await resetPasswordPost(makeRequest("/api/auth/reset-password", payload));
    expect(second.status).toBe(400);
    expect(await second.json()).toEqual(expect.objectContaining({ ok: false }));
    // Passordet settes kun ÉN gang:
    expect((prisma.user.update as jest.Mock)).toHaveBeenCalledTimes(1);
  });

  test("passord på 9 tegn → 400 (Zod, min 10)", async () => {
    const res = await resetPasswordPost(
      makeRequest("/api/auth/reset-password", {
        email: "bruker@epost.no",
        token: "x".repeat(64),
        password: "123456789", // 9 tegn
      })
    );
    expect(res.status).toBe(400);
    expect((prisma.user.update as jest.Mock)).not.toHaveBeenCalled();
  });
});
