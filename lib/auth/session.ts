/**
 * Session cookie utilities
 * Simple cookie-based session management.
 */

import { serialize } from "cookie";
import { randomUUID } from "crypto";

const SESSION_COOKIE = "tosom_session";

export function createSession(res: any, userId: string): string {
  const sessionId = randomUUID();
  const cookie = serialize(SESSION_COOKIE, userId, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
  });
  res.setHeader("Set-Cookie", cookie);
  return sessionId;
}

export function destroySession(res: any): void {
  const cookie = serialize(SESSION_COOKIE, "", {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
  });
  res.setHeader("Set-Cookie", cookie);
}

export function getSession(req: any): string | null {
  const cookie = req.cookies?.[SESSION_COOKIE];
  if (!cookie) return null;
  return cookie;
}

// Alias for backward compatibility — imported as requireAuth in some routes.
// This module provides session cookie helpers; requireAuth is in lib/admin/requireAuth.
export { requireAuth } from '@/lib/admin/requireAuth';
