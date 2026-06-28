import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";

/**
 * adminAuthGuard — sjekker om brukaren er innlogga.
 * Bruk: const auth = await adminAuthGuard();
 *       if (auth) return auth; // returnerar 401
 */
export async function adminAuthGuard(): Promise<NextResponse | null> {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Authetisering påkrevd" }, { status: 401 });
  }

  // Returnerer null ved suksess — kalla kode kan fortsetje
  return null;
}
