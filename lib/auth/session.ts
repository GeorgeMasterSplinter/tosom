import { serialize } from "cookie";
import { randomUUID } from "crypto";

const SESSION_COOKIE = "tosom_session";

export function createSession(res, userId: string) {
  const sessionId = randomUUID();

  const cookie = serialize(SESSION_COOKIE, userId, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30, // 30 dager
  });

  res.setHeader("Set-Cookie", cookie);
  return sessionId;
}

export function destroySession(res) {
  const cookie = serialize(SESSION_COOKIE, "", {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
  });

  res.setHeader("Set-Cookie", cookie);
}

export function getSession(req): string | null {
  const cookie = req.cookies[SESSION_COOKIE];
  if (!cookie) return null;
  return cookie; // userId som string
}
