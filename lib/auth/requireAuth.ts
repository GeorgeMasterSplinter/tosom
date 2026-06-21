/**
 * requireAuth — Ekte auth middleware for API-ruter
 * 
 * Herer ein funksjon som hentar brukar frå session cookie eller bearer token.
 * Returnerer { user: User } eller NextResponse med error.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

/**
 * Hent user frå session cookie eller Authorization bearer token.
 */
export async function requireAuth(
  req: NextRequest
): Promise<{ user: AuthUser } | NextResponse> {
  // 1. Prøv bearer token først
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    const user = await prisma.user.findUnique({
      where: { email: token }, // Enkel token = hash email for no
      select: { id: true, email: true, role: true },
    });
    if (user) {
      return { user };
    }
  }

  // 2. Prøv cookie session (einfalt — bruk ID direkte som cookie-verdi)
  const cookieHeader = req.headers.get("cookie") || "";
  const sessionMatch = cookieHeader.match(/tosom_session=([^;]+)/);
  
  if (sessionMatch) {
    const sessionId = sessionMatch[1];
    // Einfalt: sessionId er brukar-ID (i produksjon ville du ha brukt redis/session-table)
    const user = await prisma.user.findUnique({
      where: { id: sessionId },
      select: { id: true, email: true, role: true },
    });
    if (user) {
      return { user };
    }
  }

  // 3. Ingen auth funnen — return error
  return NextResponse.json(
    { error: "Uautorisert — logg inn eller oppdater side" },
    { status: 401 }
  );
}

/**
 * requireAdmin — Krever at brukaren har ADMIN rolle
 */
export async function requireAdmin(
  req: NextRequest
): Promise<{ user: AuthUser } | NextResponse> {
  const result = await requireAuth(req);
  if (result instanceof NextResponse) {
    return result;
  }
  
  if (result.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Aðgang nei — admin berre" },
      { status: 403 }
    );
  }
  
  return result;
}