import { NextResponse } from "next/server";

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  
  response.cookies.set("admin_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: "/",
    maxAge: 0, // Umiddelbar utløp
  });

  return response;
}