import prisma from "@/lib/prisma";

export async function getOnboardingStep(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { onboardingStep: true },
  });

  return user?.onboardingStep || 1;
}

export async function setOnboardingStep(userId: string, step: number) {
  await prisma.user.update({
    where: { id: userId },
    data: { onboardingStep: step },
  });
}

export async function getOnboardingComplete(userId: string): Promise<boolean> {
  const profile = await prisma.profile.findUnique({
    where: { userId },
    select: { onboardingComplete: true },
  });

  return profile?.onboardingComplete || false;
}

export async function setOnboardingComplete(userId: string) {
  await prisma.profile.update({
    where: { userId },
    data: { onboardingComplete: true },
  });
}
