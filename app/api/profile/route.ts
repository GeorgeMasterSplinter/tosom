import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import prisma from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rateLimit";
import { profileUpdateSchema } from "@/lib/validation/profile";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  });

  return NextResponse.json({ profile: profile || null });
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Du må være logget inn" }, { status: 401 });
  }

  // Rate limiting: maks 5 profil-oppdateringar/minutt
  if (checkRateLimit(`profile:${session.user.id}`, 5, 60_000)) {
    return NextResponse.json(
      { error: "For mange forsøk. Vent eit par sekund." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();

    // Zod-validering
    const parse = profileUpdateSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json(
        { error: parse.error.errors[0]?.message || "Ugyldig data" },
        { status: 400 }
      );
    }

    const { firstName, lastName, age, gender, bio, interests, photos } = parse.data;

    await prisma.profile.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        age: age || undefined,
        gender: gender || undefined,
        bio: bio || undefined,
        interests: interests || [],
        photos: photos || [],
      },
      update: {
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        age: age || undefined,
        gender: gender || undefined,
        bio: bio || undefined,
        interests: interests || [],
        photos: photos || [],
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update profile:", error);
    return NextResponse.json({ error: "Kunne ikke oppdatere profilen" }, { status: 500 });
  }
}
