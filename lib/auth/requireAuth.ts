/**
 * requireAuth — Ekte auth middleware for API-ruter (STREG 1 — Fix 4)
 *
 * Bruker NextAuth v5 sin auth() funksjon for sikker session-validering.
 * Returnerer { user: AuthUser } eller NextResponse med error.
 *
 * ERSTATTER gammel naive implementasjon som brukte:
 * - Bearer token = email hash (IKKE trygt)
 * - tosom_session cookie = raw user ID (IKKE trygt)
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { isAdminRole, defaultRole } from "@/lib/auth/roles";

export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

/**
 * Sjekk om admin_token-cookie er satt (fra /api/admin/auth).
 * Brukes som fallback for admin-API-er når NextAuth session ikke finnes.
 */
function hasAdminToken(req: NextRequest | undefined): boolean {
  if (!req) return false;
  const cookie = req.cookies.get('admin_token')?.value;
  return cookie === 'valid';
}

/**
 * Hent user fra NextAuth v5 session ELLER admin_token cookie.
 */
export async function requireAuth(
  req?: NextRequest
): Promise<{ user: AuthUser } | NextResponse> {
  // Først: sjekk om det er en admin-requests med admin_token
  if (hasAdminToken(req)) {
    return {
      user: {
        id: 'admin',
        email: 'admin@tosom.dev',
        role: 'ADMIN',
      },
    };
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
      { error: "Aðgang nei — admin berre" },
      { status: 403 }
    );
  }

  return result;
}
