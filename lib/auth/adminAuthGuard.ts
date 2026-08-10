import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { isAdminRole } from "@/lib/auth/roles";

/**
 * adminAuthGuard — STREG 1 Fix 3: sjekker session OG admin role.
 * Bruk: const auth = await adminAuthGuard();
 *       if (auth) return auth; // returnerar 401 eller 403
 */
export async function adminAuthGuard(): Promise<NextResponse | null> {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Authetisering påkrevd" }, { status: 401 });
  }

  // STREG 1 Fix 3: Sjekk admin role
  const role = (session.user as any).role;
  if (!isAdminRole(role)) {
    return NextResponse.json(
      { error: "Forbidden: Admin access required" },
      { status: 403 }
    );
  }

  // Returnerer null ved suksess — kalla kode kan fortsetje
  return null;
}
