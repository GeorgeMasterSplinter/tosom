/**
 * requireAuth — Ekte auth middleware for API-ruter (STREG 1 — Fix 4)
 *
 * Bruker NextAuth v5 sin auth() funksjon for sikker session-validering.
 * Returnerer { user: AuthUser } eller NextResponse med error.
 *
 * SIKKERHET: Admin-token verifiseres nå med KRYPTGRAFISK SIGNATUR (HMAC-SHA256).
 * Gammel naive "cookie === 'valid'" sjekk er FJERNET.
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { isAdminRole, defaultRole } from "@/lib/auth/roles";
import { verifyAdminTokenFromRequest } from "@/lib/auth/admin-jwt";

export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

/**
 * Verifiser admin_token med KRYPTGRAFISK SIGNATUR (HMAC-SHA256).
 * Bruker verifyAdminTokenAsync som sjekker signatur + issuer + role + expiry.
 */
async function verifyAdminAuth(req: NextRequest | undefined): Promise<AuthUser | null> {
  if (!req) return null;
  const payload = await verifyAdminTokenFromRequest(req);
  if (!payload) return null;

  return {
    id: 'admin',
    email: payload.sub,
    role: 'ADMIN',
  };
}

/**
 * Hent user fra NextAuth v5 session ELLOR signert admin_token cookie.
 */
export async function requireAuth(
  req?: NextRequest
): Promise<{ user: AuthUser } | NextResponse> {
  // Først: sjekk om det er en admin-request med KRYPTGRAFISK SIGNERT admin_token
  const adminUser = await verifyAdminAuth(req);
  if (adminUser) {
    return { user: adminUser };
  }

  // Deretter: Bruk NextAuth v5 sin auth() for sikker session-henting
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Uautorisert — logg inn eller oppdater side" },
      { status: 401 }
    );
  }

  const role = ((session.user as any).role ?? 'user') as string;

  return {
    user: {
      id: session.user.id,
      email: session.user.email ?? "",
      role: defaultRole(role),
    },
  };
}

/**
 * requireAdmin — Krever at brukaren har ADMIN rolle
 */
export async function requireAdmin(
  req?: NextRequest
): Promise<{ user: AuthUser } | NextResponse> {
  const result = await requireAuth(req);
  if (result instanceof NextResponse) {
    return result;
  }

  if (!isAdminRole(result.user.role)) {
    return NextResponse.json(
      { error: "Aðgang nei — admin bare" },
      { status: 403 }
    );
  }

  return result;
}
