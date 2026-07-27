import { NextRequest, NextResponse } from "next/server";
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { username, password } = body;

  if (username === "admin" && password === process.env.ADMIN_PASSWORD) {
    const response = NextResponse.json({ ok: true });
    response.cookies.set("admin_token", "valid", {
      httpOnly: true,
      path: "/",
      maxAge: 604800, // 1 week
    });
    return response;
  }

  return NextResponse.json({ ok: false }, { status: 401 });
}


