"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

function toStrArray(v: string | null | undefined): string[] | undefined {
  if (!v) return undefined;
  return v.split(",").map((s) => s.trim()).filter(Boolean);
}

function fromStrArray(arr: string[] | undefined): string {
  if (!arr || arr.length === 0) return "";
  return arr.join(", ");
}

export interface ProfileFormData {
  gender: string | null;
  age: number | null;
  location: string | null;
  bio: string | null;
  interests: string;
  jobStatus: string | null;
  livingSituation: string | null;
  children: string | null;
  lifeRhythm: string | null;
  activityLevel: string | null;
  socialLevel: string | null;
  financialStyle: string | null;
  weekendStyle: string | null;
  travelStyle: string | null;
  structureStyle: string | null;
  energyStyle: string | null;
  communicationStyle: string | null;
  planningStyle: string | null;
  loveLanguage: string | null;
  giveStyle: string | null;
  needStyle: string | null;
  relationshipExpectation: string | null;
  dealbreaker: string | null;
  physicalComfort: string | null;
  emotionalPace: string | null;
  physicalImportance: string | null;
  boundaryStyle: string | null;
  intimacyStyle: string | null;
  futureWish: string | null;
  ambitionLevel: string | null;
  lifePace: string | null;
  longTermExpectation: string | null;
  lifeDirection: string | null;
  needs: string;
  boundaries: string;
  intentions: string;
}

export async function getProfile() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { profile: null, error: "Du må vere logga inn" };
  }

  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });
    if (!profile) return { profile: null };

    const formatted: ProfileFormData = {
      gender: profile.gender,
      age: profile.age,
      location: profile.location,
      bio: profile.bio,
      interests: fromStrArray(profile.interests),
      jobStatus: profile.jobStatus,
      livingSituation: profile.livingSituation,
      children: profile.children,
      lifeRhythm: profile.lifeRhythm,
      activityLevel: profile.activityLevel,
      socialLevel: profile.socialLevel,
      financialStyle: profile.financialStyle,
      weekendStyle: profile.weekendStyle,
      travelStyle: profile.travelStyle,
      structureStyle: profile.structureStyle,
      energyStyle: profile.energyStyle,
      communicationStyle: profile.communicationStyle,
      planningStyle: profile.planningStyle,
      loveLanguage: profile.loveLanguage,
      giveStyle: profile.giveStyle,
      needStyle: profile.needStyle,
      relationshipExpectation: profile.relationshipExpectation,
      dealbreaker: profile.dealbreaker,
      physicalComfort: profile.physicalComfort,
      emotionalPace: profile.emotionalPace,
      physicalImportance: profile.physicalImportance,
      boundaryStyle: profile.boundaryStyle,
      intimacyStyle: profile.intimacyStyle,
      futureWish: profile.futureWish,
      ambitionLevel: profile.ambitionLevel,
      lifePace: profile.lifePace,
      longTermExpectation: profile.longTermExpectation,
      lifeDirection: profile.lifeDirection,
      needs: fromStrArray(profile.needs),
      boundaries: fromStrArray(profile.boundaries),
      intentions: fromStrArray(profile.intentions),
    };

    return { profile: formatted };
  } catch {
    return { profile: null, error: "Kunne ikkje hente profilen" };
  }
}

export async function updateProfile(formData: ProfileFormData): Promise<{ success?: boolean; error?: string }> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { error: "Du må vere logga inn" };
  }

  try {
    const {
      gender, age, location, bio, interests, jobStatus, livingSituation,
      children, lifeRhythm, activityLevel, socialLevel, financialStyle,
      weekendStyle, travelStyle, structureStyle, energyStyle, communicationStyle,
      planningStyle, loveLanguage, giveStyle, needStyle, relationshipExpectation,
      dealbreaker, physicalComfort, emotionalPace, physicalImportance, boundaryStyle,
      intimacyStyle, futureWish, ambitionLevel, lifePace, longTermExpectation,
      lifeDirection, needs, boundaries, intentions,
    } = formData;

    const parsedAge = age ? parseInt(String(age), 10) : undefined;

    await prisma.profile.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        gender: gender || undefined,
        age: parsedAge,
        location: location || undefined,
        bio: bio || undefined,
        interests: toStrArray(interests),
        jobStatus: jobStatus || undefined,
        livingSituation: livingSituation || undefined,
        children: children || undefined,
        lifeRhythm: lifeRhythm || undefined,
        activityLevel: activityLevel || undefined,
        socialLevel: socialLevel || undefined,
        financialStyle: financialStyle || undefined,
        weekendStyle: weekendStyle || undefined,
        travelStyle: travelStyle || undefined,
        structureStyle: structureStyle || undefined,
        energyStyle: energyStyle || undefined,
        communicationStyle: communicationStyle || undefined,
        planningStyle: planningStyle || undefined,
        loveLanguage: loveLanguage || undefined,
        giveStyle: giveStyle || undefined,
        needStyle: needStyle || undefined,
        relationshipExpectation: relationshipExpectation || undefined,
        dealbreaker: dealbreaker || undefined,
        physicalComfort: physicalComfort || undefined,
        emotionalPace: emotionalPace || undefined,
        physicalImportance: physicalImportance || undefined,
        boundaryStyle: boundaryStyle || undefined,
        intimacyStyle: intimacyStyle || undefined,
        futureWish: futureWish || undefined,
        ambitionLevel: ambitionLevel || undefined,
        lifePace: lifePace || undefined,
        longTermExpectation: longTermExpectation || undefined,
        lifeDirection: lifeDirection || undefined,
        needs: toStrArray(needs),
        boundaries: toStrArray(boundaries),
        intentions: toStrArray(intentions),
      },
      update: {
        gender: gender || undefined,
        age: parsedAge,
        location: location || undefined,
        bio: bio || undefined,
        interests: toStrArray(interests),
        jobStatus: jobStatus || undefined,
        livingSituation: livingSituation || undefined,
        children: children || undefined,
        lifeRhythm: lifeRhythm || undefined,
        activityLevel: activityLevel || undefined,
        socialLevel: socialLevel || undefined,
        financialStyle: financialStyle || undefined,
        weekendStyle: weekendStyle || undefined,
        travelStyle: travelStyle || undefined,
        structureStyle: structureStyle || undefined,
        energyStyle: energyStyle || undefined,
        communicationStyle: communicationStyle || undefined,
        planningStyle: planningStyle || undefined,
        loveLanguage: loveLanguage || undefined,
        giveStyle: giveStyle || undefined,
        needStyle: needStyle || undefined,
        relationshipExpectation: relationshipExpectation || undefined,
        dealbreaker: dealbreaker || undefined,
        physicalComfort: physicalComfort || undefined,
        emotionalPace: emotionalPace || undefined,
        physicalImportance: physicalImportance || undefined,
        boundaryStyle: boundaryStyle || undefined,
        intimacyStyle: intimacyStyle || undefined,
        futureWish: futureWish || undefined,
        ambitionLevel: ambitionLevel || undefined,
        lifePace: lifePace || undefined,
        longTermExpectation: longTermExpectation || undefined,
        lifeDirection: lifeDirection || undefined,
        needs: toStrArray(needs),
        boundaries: toStrArray(boundaries),
        intentions: toStrArray(intentions),
      },
    });

    revalidatePath("/profile/edit");
    return { success: true };
  } catch (error) {
    console.error("Failed to update profile:", error);
    return { error: "Kunne ikkje oppdatere profilen" };
  }
}