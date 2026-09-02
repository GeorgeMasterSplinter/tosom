import { NextResponse } from "next/server";
import { trackError } from "@/lib/errorTracker";

export async function DELETE() {
  try {
    const response = NextResponse.json({ ok: true });

    response.cookies.set("admin_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: "/",
      maxAge: 0, // Umiddelbar utløp
    });

    return response;
  } catch (error) {
    await trackError(error, "api/admin/logout");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}