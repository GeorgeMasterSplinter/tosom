import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "./options";

/**
 * adminAuthGuard — sjekker om brukaren er innlogga.
 * Bruk: const auth = await adminAuthGuard();
 *       if (auth) return auth; // returnerar 401
 */
export async function adminAuthGuard(): Promise<NextResponse | null> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Authetisering påkrevd" }, { status: 401 });
  }

  // Returnerer null ved suksess — kalla kode kan fortsetje
  return null;
}
