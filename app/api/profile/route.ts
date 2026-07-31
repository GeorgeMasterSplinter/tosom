
import { getServerSession } from "@/lib/auth/session";
import prisma from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rateLimit";
import { profileUpdateSchema } from "@/lib/validation/profile";
export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  });

  return Response.json({ profile: profile || null });
}

export async function PUT(request: Request) {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return Response.json({ error: "Du må være logget inn" }, { status: 401 });
  }

  // Rate limiting: maks 5 profil-oppdateringar/minutt
  if (checkRateLimit(`profile:${session.user.id}`, 5, 60_000)) {
    return Response.json(
      { error: "For mange forsøk. Vent eit par sekund." },
      { status: 429 }
    );
  }

  // Sjekk om brukaren har ein aktiv journey — blokker profil-endring
  const journey = await prisma.journeyProgress.findUnique({
    where: { userId: session.user.id },
  });

  if (journey && journey.phase !== null) {
    return Response.json(
      { error: "Profilen er låst under reise. Du kan ikkje endre profilen medan du er i en aktiv 30-dagers reise." },
      { status: 409 }
    );
  }

  try {
    const body = await request.json();

    // Zod-validering
    const parse = profileUpdateSchema.safeParse(body);
    if (!parse.success) {
      return Response.json(
        { error: parse.error.issues[0]?.message || "Ugyldig data" },
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
        age: (age as number) || 25,
        gender: gender || undefined,
        bio: bio || undefined,
        interests: interests || [],
        photos: photos || [],
      },
      update: {
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        age: (age as number) || 25,
        gender: gender || undefined,
        bio: bio || undefined,
        interests: interests || [],
        photos: photos || [],
      },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Failed to update profile:", error);
    return Response.json({ error: "Kunne ikke oppdatere profilen" }, { status: 500 });
  }
}


