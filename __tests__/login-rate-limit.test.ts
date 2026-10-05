/**
 * K-6 / V-8 / V-15 — Innlogging og registrering (PL-05)
 *
 * D-7: Eksplisitt registrering — innlogging oppretter aldri konto,
 * og passordløse kontoer kan ikke overtas via innlogging.
 *
 * 1. 11. innloggsforsøk innen 15 min → null UTEN passordsjekk (rate limit først)
 * 2. Ukjent e-post → null, ingen user.create (ingen auto-registrering)
 * 3. Bruker uten passord → null, ingen user.update (ingen overtakelse)
 * 4. POST /api/auth/register med passord på 9 tegn → 400
 * 5. Eksisterende e-post → samme svar som suksess, ingen ny bruker
 *
 * Unit-stil (mocks) — kjører i standard-suitten uten DB.
 */

import { NextRequest } from "next/server";
import { authorizeCredentials } from "@/lib/auth/authorize";
import { prisma } from "@/lib/prisma";

// ---- Mocks ---------------------------------------------------------------

const pgCheckMock = jest.fn();
jest.mock("@/lib/rate-limit-pg", () => ({
  pgCheck: (...args: unknown[]) => pgCheckMock(...args),
}));

jest.mock("@/lib/prisma", () => {
  const prisma = {
    user: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
    profile: { create: jest.fn() },
    $queryRaw: jest.fn(),
  };
  return { __esModule: true, default: prisma, prisma };
});

const hashPasswordMock = jest.fn().mockResolvedValue("mock-hash");
const verifyPasswordMock = jest.fn();
jest.mock("@/lib/auth/hash", () => ({
  hashPassword: (...args: unknown[]) => hashPasswordMock(...args),
  verifyPassword: (...args: unknown[]) => verifyPasswordMock(...args),
}));

const csrfCheckMock = jest.fn().mockResolvedValue(true);
jest.mock("@/lib/auth/csrf", () => ({
  csrfCheck: (...args: unknown[]) => csrfCheckMock(...args),
}));

// ---- Helpers -------------------------------------------------------------

function makeRegisterRequest(body: unknown): NextRequest {
  const req = new NextRequest("http://localhost:3000/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": "test-csrf-token",
      "x-forwarded-for": "1.2.3.4",
    },
    body: JSON.stringify(body),
  });
  return req;
}

beforeEach(() => {
  pgCheckMock.mockReset().mockResolvedValue({ ok: true, remaining: 10 });
  verifyPasswordMock.mockReset();
  hashPasswordMock.mockClear();
  (prisma.user.findUnique as jest.Mock).mockReset();
  (prisma.user.create as jest.Mock).mockReset();
  (prisma.user.update as jest.Mock).mockReset();
  (prisma.profile.create as jest.Mock).mockReset().mockResolvedValue({ id: "profile-1" });
  csrfCheckMock.mockReset().mockResolvedValue(true);
});

// ---- 1. Rate limit på innlogging (K-6) ------------------------------------

describe("authorize — rate limit (K-6)", () => {
  test("blokkert forsøk (11. innen 15 min) → null uten passordsjekk", async () => {
    // 10 forsøk er brukt opp — neste (11.) er blokkert av pgCheck:
    pgCheckMock.mockResolvedValue({ ok: false, remaining: 0 });

    const result = await authorizeCredentials({ email: "bruker@epost.no", password: "secret123" });

    expect(result).toBeNull();
    expect(pgCheckMock).toHaveBeenCalledWith("login:bruker@epost.no", 10, 900);
    // Rate limit slo inn FØR passordsjekk:
    expect(verifyPasswordMock).not.toHaveBeenCalled();
  });
});

// ---- 2. Ingen auto-registrering (K-6 / V-8) --------------------------------

describe("authorize — ingen auto-registrering (D-7)", () => {
  test("ukjent e-post → null, ingen user.create", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    const result = await authorizeCredentials({ email: "ny@epost.no", password: "secret123" });

    expect(result).toBeNull();
    expect(prisma.user.create).not.toHaveBeenCalled();
    expect(prisma.profile.create).not.toHaveBeenCalled();
  });

  test("kjent e-post med riktig passord → inneholder brukeren", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: "u-1",
      email: "bruker@epost.no",
      name: "B",
      password: "hash-123",
    });
    verifyPasswordMock.mockResolvedValue(true);

    const result: any = await authorizeCredentials({ email: "bruker@epost.no", password: "secret123" });

    expect(result).toEqual({ id: "u-1", email: "bruker@epost.no", name: "B" });
  });
});

// ---- 3. Passordløse kontoer overtas ikke (K-6) ------------------------------

describe("authorize — passordløs konto", () => {
  test("bruker uten passord → null, ingen user.update", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: "u-2",
      email: "magic@epost.no",
      name: "M",
      password: null,
    });

    const result = await authorizeCredentials({ email: "magic@epost.no", password: "nytt-passord-123" });

    expect(result).toBeNull();
    expect(prisma.user.update).not.toHaveBeenCalled();
    expect(verifyPasswordMock).not.toHaveBeenCalled();
  });
});

// ---- 4-5. POST /api/auth/register (PL-05b) ---------------------------------

describe("POST /api/auth/register", () => {
  test("passord på 9 tegn → 400 (min 10)", async () => {
    const { POST } = require("@/app/api/auth/register/route");
    const res = await POST(
      makeRegisterRequest({
        email: "ny@epost.no",
        password: "123456789", // 9 tegn
        passwordRepeat: "123456789",
      })
    );
    expect(res.status).toBe(400);
    expect(prisma.user.create).not.toHaveBeenCalled();
    // Validering skjer før rate-limit og DB:
    expect(pgCheckMock).not.toHaveBeenCalled();
  });

  test("passordene er ikke like → 400", async () => {
    const { POST } = require("@/app/api/auth/register/route");
    const res = await POST(
      makeRegisterRequest({
        email: "ny@epost.no",
        password: "passord12345",
        passwordRepeat: "passord12346",
      })
    );
    expect(res.status).toBe(400);
  });

  test("eksisterende e-post → samme svar som suksess, ingen ny bruker", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: "u-existing" });
    const { POST } = require("@/app/api/auth/register/route");

    const res = await POST(
      makeRegisterRequest({
        email: "eksisterer@epost.no",
        password: "passord12345",
        passwordRepeat: "passord12345",
      })
    );

    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body).toEqual({ ok: true });
    expect(prisma.user.create).not.toHaveBeenCalled();
    expect(prisma.profile.create).not.toHaveBeenCalled();
  });

  test("ny e-post → { ok: true } og User + Profile opprettes", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.user.create as jest.Mock).mockResolvedValue({ id: "u-new", email: "ny@epost.no" });
    const { POST } = require("@/app/api/auth/register/route");

    const res = await POST(
      makeRegisterRequest({
        email: "ny@epost.no",
        password: "passord12345",
        passwordRepeat: "passord12345",
      })
    );

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(prisma.user.create).toHaveBeenCalledTimes(1);
    const created = (prisma.user.create as jest.Mock).mock.calls[0][0].data;
    expect(created.email).toBe("ny@epost.no");
    expect(created.password).toBe("mock-hash");
    expect(prisma.profile.create).toHaveBeenCalledTimes(1);
    // Rate-limit per IP:
    expect(pgCheckMock).toHaveBeenCalledWith("register:1.2.3.4", 5, 3600);
  });

  test("rate limit utløpt → 429", async () => {
    pgCheckMock.mockResolvedValue({ ok: false, remaining: 0 });
    const { POST } = require("@/app/api/auth/register/route");

    const res = await POST(
      makeRegisterRequest({
        email: "ny@epost.no",
        password: "passord12345",
        passwordRepeat: "passord12345",
      })
    );

    expect(res.status).toBe(429);
    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  test("CSRF feiler → 403 før alt annet", async () => {
    const { NextResponse } = await import("next/server");
    csrfCheckMock.mockResolvedValue(
      NextResponse.json({ ok: false, error: "Ugyldig CSRF" }, { status: 403 })
    );
    const { POST } = require("@/app/api/auth/register/route");

    const res = await POST(
      makeRegisterRequest({
        email: "ny@epost.no",
        password: "passord12345",
        passwordRepeat: "passord12345",
      })
    );

    expect(res.status).toBe(403);
    expect(pgCheckMock).not.toHaveBeenCalled();
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
  });
});
