"use server";

import { getServerSession } from "@/lib/auth/session";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface ProfileFormData {
  firstName: string;
  lastName: string;
  age: number | null;
  bio: string | null;
  interests: string;
  photoUrl: string;
  identityName: string | null;
  lifeRhythm: string | null;
  maturityLevel: number | null;
}

export async function getProfile() {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return { profile: null, error: "Du må vere logga inn" };
  }

  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });
    if (!profile) return { profile: null };

    const formatted: ProfileFormData = {
      firstName: profile.firstName ?? "",
      lastName: profile.lastName ?? "",
      age: profile.age,
      bio: profile.bio,
      interests: (profile.interests ?? []).join(", "),
      photoUrl: profile.photoUrl ?? "",
      identityName: profile.identityName ?? null,
      lifeRhythm: profile.lifeRhythm ?? null,
      maturityLevel: profile.maturityLevel ?? null,
    };

    return { profile: formatted };
  } catch {
    return { profile: null, error: "Kunne ikkje hente profilen" };
  }
}

export async function updateProfile(formData: ProfileFormData): Promise<{ success?: boolean; error?: string }> {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return { error: "Du må vere logga inn" };
  }

  try {
    const parsedAge = formData.age ? parseInt(String(formData.age), 10) : 25;

    await prisma.profile.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        firstName: formData.firstName || undefined,
        lastName: formData.lastName || undefined,
        age: parsedAge,
        bio: formData.bio || undefined,
        photoUrl: formData.photoUrl || undefined,
        identityName: formData.identityName || undefined,
        lifeRhythm: formData.lifeRhythm || undefined,
        maturityLevel: formData.maturityLevel || parsedAge,
        interests: formData.interests
          ? formData.interests.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
      },
      update: {
        firstName: formData.firstName || undefined,
        lastName: formData.lastName || undefined,
        age: parsedAge,
        bio: formData.bio || undefined,
        photoUrl: formData.photoUrl || undefined,
        identityName: formData.identityName || undefined,
        lifeRhythm: formData.lifeRhythm || undefined,
        maturityLevel: formData.maturityLevel || parsedAge,
        interests: formData.interests
          ? formData.interests.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
      },
    });

    revalidatePath("/profile/edit");
    return { success: true };
  } catch (error) {
    console.error("Failed to update profile:", error);
    return { error: "Kunne ikkje oppdatere profilen" };
  }
}