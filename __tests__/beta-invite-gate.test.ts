/**
 * BETA-OPENING — Invite-gate i /api/auth/register (limited invite-only beta)
 *
 * BETA-01..BETA-10 (se docs/BETA-OPENING-RUNBOOK-v1.0.md, seksjon «Invite gate»).
 * Unit-stil (mocks) — kjører i standard-suitten uten DB.
 *
 * Modell: kun e-poster i BetaInvite-tabellen kan opprette NY konto.
 * Eksisterende kontoer påvirkes ikke (dup-sjekk går først). Gate styres av
 * BETA_INVITE_GATE (default PÅ; leses live fra env).
 */

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { isInviteGateEnabled } from "@/config/features";

// ---- Mocks ----------------------------------------------------------------

const pgCheckMock = jest.fn();
jest.mock("@/lib/rate-limit-pg", () => ({
  pgCheck: (...args: unknown[]) => pgCheckMock(...args),
}));

jest.mock("@/lib/prisma", () => {
  const prisma = {
    user: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
    profile: { create: jest.fn() },
    betaInvite: { findUnique: jest.fn(), update: jest.fn() },
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

// Ruten lastes én gang etter at mocks er registrert. isInviteGateEnabled leser
// process.env LIVE, så env-endringer (BETA-10) treffer uten ny load.
const { POST } = require("@/app/api/auth/register/route");

function makeRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost:3000/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": "test-csrf-token",
      "x-forwarded-for": "9.9.9.9",
    },
    body: JSON.stringify(body),
  });
}

const VALID = {
  email: "ny@beta.no",
  password: "passord12345",
  passwordRepeat: "passord12345",
};

let savedGate: string | undefined;

beforeEach(() => {
  savedGate = process.env.BETA_INVITE_GATE;
  delete process.env.BETA_INVITE_GATE; // default: gate PÅ
  pgCheckMock.mockReset().mockResolvedValue({ ok: true, remaining: 10 });
  hashPasswordMock.mockClear();
  verifyPasswordMock.mockReset();
  (prisma.user.findUnique as jest.Mock).mockReset().mockResolvedValue(null);
  (prisma.user.create as jest.Mock).mockReset().mockResolvedValue({ id: "u-new" });
  (prisma.user.update as jest.Mock).mockReset();
  (prisma.profile.create as jest.Mock).mockReset().mockResolvedValue({ id: "profile-1" });
  (prisma.betaInvite.findUnique as jest.Mock).mockReset().mockResolvedValue({ id: "inv-1" });
  (prisma.betaInvite.update as jest.Mock).mockReset().mockResolvedValue({});
  csrfCheckMock.mockReset().mockResolvedValue(true);
});

afterEach(() => {
  if (savedGate === undefined) delete process.env.BETA_INVITE_GATE;
  else process.env.BETA_INVITE_GATE = savedGate;
});

describe("BETA invite-gate — /api/auth/register", () => {
  // BETA-01 — uninvited email cannot register.
  test("BETA-01 uninvitert e-post kan ikke registrere (403, ingen konto)", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null); // eksisterer ikke
    (prisma.betaInvite.findUnique as jest.Mock).mockResolvedValue(null); // ikke invitert

    const res = await POST(makeRequest(VALID));
    expect(res.status).toBe(403);
    expect(await res.json()).toMatchObject({ ok: false });
    expect(prisma.user.create).not.toHaveBeenCalled();
    expect(prisma.profile.create).not.toHaveBeenCalled();
  });

  // BETA-02 — invited email can register.
  test("BETA-02 invitert e-post kan registrere (200, konto + invite brukt)", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.betaInvite.findUnique as jest.Mock).mockResolvedValue({ id: "inv-1" });

    const res = await POST(makeRequest(VALID));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(prisma.user.create).toHaveBeenCalledTimes(1);
    expect(prisma.betaInvite.update).toHaveBeenCalledTimes(1); // markInviteUsed
  });

  // BETA-03 — email normalization correct.
  test("BETA-03 invite-oppslaget normaliserer e-post (lowercase)", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.betaInvite.findUnique as jest.Mock).mockResolvedValue({ id: "inv-1" });

    const res = await POST(makeRequest({ ...VALID, email: "Mixed.Case@Beta.NO" }));
    expect(res.status).toBe(200);
    expect(prisma.betaInvite.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { email: "mixed.case@beta.no" } })
    );
  });

  // BETA-04 — response does not enumerate invite status unnecessarily.
  test("BETA-04 403-svaret er generic (ingen echo av e-post / ingen liste)", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.betaInvite.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await POST(makeRequest({ ...VALID, email: "hemmelig.invitert@beta.no" }));
    const body = await res.json();
    expect(res.status).toBe(403);
    expect(body.ok).toBe(false);
    expect(JSON.stringify(body)).not.toContain("hemmelig.invitert@beta.no");
  });

  // BETA-05 — existing user login unaffected.
  test("BETA-05 eksisterende bruker er ikke blokkert (dup-sjekk før gate)", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: "u-existing" });
    (prisma.betaInvite.findUnique as jest.Mock).mockResolvedValue(null); // ikke invitert

    const res = await POST(makeRequest({ ...VALID, email: "eksisterer@beta.no" }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(prisma.user.create).not.toHaveBeenCalled();
    expect(prisma.betaInvite.findUnique).not.toHaveBeenCalled(); // gate aldri nådd
  });

  // BETA-06 — rate limit preserved.
  test("BETA-06 rate-limit beholdes (429 før gate, ingen invite-oppslag)", async () => {
    pgCheckMock.mockResolvedValue({ ok: false, remaining: 0 });
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await POST(makeRequest(VALID));
    expect(res.status).toBe(429);
    expect(prisma.user.create).not.toHaveBeenCalled();
    expect(prisma.betaInvite.findUnique).not.toHaveBeenCalled();
    expect(pgCheckMock).toHaveBeenCalledWith("register:9.9.9.9", 5, 3600);
  });

  // BETA-07 — CSRF preserved.
  test("BETA-07 CSRF beholdes (403 før alt annet, gate ikke nådd)", async () => {
    const { NextResponse } = await import("next/server");
    csrfCheckMock.mockResolvedValue(
      NextResponse.json({ ok: false, error: "Ugyldig CSRF" }, { status: 403 })
    );

    const res = await POST(makeRequest(VALID));
    expect(res.status).toBe(403);
    expect(pgCheckMock).not.toHaveBeenCalled();
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
    expect(prisma.betaInvite.findUnique).not.toHaveBeenCalled();
  });

  // BETA-08 — invite cannot be reused incorrectly (one account per email).
  test("BETA-08 invitert e-post som allerede har konto → ingen 2. konto", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: "u-existing" });
    (prisma.betaInvite.findUnique as jest.Mock).mockResolvedValue({
      id: "inv-1",
      usedAt: new Date(),
    });

    const res = await POST(makeRequest(VALID));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(prisma.user.create).not.toHaveBeenCalled(); // dup-sjekk stopper gjenbruk
  });

  // BETA-09 — admin/test behavior intentional.
  test("BETA-09 eksisterende admin/test er uendret; ny krever invite", async () => {
    // Eksisterende (seedet) admin-konto → uendret (dup-sjekk, gate ikke nådd):
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: "u-admin" });
    (prisma.betaInvite.findUnique as jest.Mock).mockResolvedValue(null);
    const adminRes = await POST(makeRequest({ ...VALID, email: "admin@beta.no" }));
    expect(adminRes.status).toBe(200);
    expect(await adminRes.json()).toEqual({ ok: true });
    expect(prisma.user.create).not.toHaveBeenCalled();

    // Ny (ikke-seedet) admin/test-e-post IKKE i invite-listen → 403:
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    const freshRes = await POST(makeRequest({ ...VALID, email: "ny-admin@beta.no" }));
    expect(freshRes.status).toBe(403); // må legges til i BetaInvite først
  });

  // BETA-10 — production default = invite gate ON for limited beta.
  test("BETA-10 default (uten env) = gate PÅ; 'false' slår den av", async () => {
    // Default: gate PÅ.
    delete process.env.BETA_INVITE_GATE;
    expect(isInviteGateEnabled()).toBe(true);
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.betaInvite.findUnique as jest.Mock).mockResolvedValue(null);
    const resOn = await POST(makeRequest(VALID));
    expect(resOn.status).toBe(403);

    // Nød-avbryter: gate AV.
    process.env.BETA_INVITE_GATE = "false";
    expect(isInviteGateEnabled()).toBe(false);
    const resOff = await POST(makeRequest(VALID));
    expect(resOff.status).toBe(200);
    expect(await resOff.json()).toEqual({ ok: true });
    expect(prisma.user.create).toHaveBeenCalled();
  });
});