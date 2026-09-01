
import { getServerSession } from "@/lib/auth/session";
import prisma from "@/lib/prisma";
import { pgCheck } from "@/lib/rate-limit-pg";
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

  // Rate limiting: maks 5 profiloppdateringer per minutt.
  // pgCheck er atomisk og delt mellom instanser (in-memory-telleren ga
  // hver serverless-instans sin egen kvote). ok=true = innenfor grensen.
  const rl = await pgCheck(`profile:${session.user.id}`, 5, 60);
  if (!rl.ok) {
    return Response.json(
      { error: "For mange forsøk. Vent et par sekunder." },
      { status: 429 }
    );
  }

  // Sjekk om brukeren har en aktiv journey — blokker profil-endring
  const journey = await prisma.journeyProgress.findFirst({
    where: { userId: session.user.id },
  });

  if (journey && journey.phase !== null) {
    return Response.json(
      { error: "Profilen er låst under reise. Du kan ikke endre profilen mens du er i en aktiv 30-dagers reise." },
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
        bio: bio || undefined,
        interests: interests || [],
        photoUrl: photos && photos.length > 0 ? photos[0] : undefined,
      },
      update: {
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        age: (age as number) || 25,
        bio: bio || undefined,
        interests: interests || [],
        photoUrl: photos && photos.length > 0 ? photos[0] : undefined,
      },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Failed to update profile:", error);
    return Response.json({ error: "Kunne ikke oppdatere profilen" }, { status: 500 });
  }
}


