"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface ProfileFormData {
  firstName: string;
  lastName: string;
  gender: string | null;
  age: number | null;
  bio: string | null;
  interests: string;
  photos: string;
}

export async function getProfile() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { profile: null, error: "Du må være logget inn" };
  }

  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });
    if (!profile) return { profile: null };

    const formatted: ProfileFormData = {
      firstName: profile.firstName ?? "",
      lastName: profile.lastName ?? "",
      gender: profile.gender,
      age: profile.age,
      bio: profile.bio,
      interests: (profile.interests ?? []).join(", "),
      photos: (profile.photos ?? []).join(", "),
    };

    return { profile: formatted };
  } catch {
    return { profile: null, error: "Kunne ikke hente profilen" };
  }
}

export async function updateProfile(formData: ProfileFormData): Promise<{ success?: boolean; error?: string }> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { error: "Du må være logget inn" };
  }

  try {
    const parsedAge = formData.age ? parseInt(String(formData.age), 10) : undefined;

    await prisma.profile.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        firstName: formData.firstName || undefined,
        lastName: formData.lastName || undefined,
        gender: formData.gender || undefined,
        age: parsedAge,
        bio: formData.bio || undefined,
        interests: formData.interests
          ? formData.interests.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        photos: formData.photos
          ? formData.photos.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
      },
      update: {
        firstName: formData.firstName || undefined,
        lastName: formData.lastName || undefined,
        gender: formData.gender || undefined,
        age: parsedAge,
        bio: formData.bio || undefined,
        interests: formData.interests
          ? formData.interests.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        photos: formData.photos
          ? formData.photos.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
      },
    });

    revalidatePath("/profile/edit");
    return { success: true };
  } catch (error) {
    console.error("Failed to update profile:", error);
    return { error: "Kunne ikke oppdatere profilen" };
  }
}
