import prisma from "@/lib/prisma";

export async function getProfileById(id: string) {
  return prisma.profile.findUnique({
    where: { id },
    include: { user: true },
  });
}
