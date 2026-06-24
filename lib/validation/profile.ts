import { z } from "zod";

/**
 * Validering for onboarding (app/api/profile/route.ts).
 */
export const profileCreateSchema = z.object({
  firstName: z.string().min(1, "Fornamn er påkrevd"),
  lastName: z.string().min(1, "Etternamn er påkrevd"),
  age: z.coerce.number().min(23).max(100),
  gender: z.string().min(1, "Kjønn er påkrevd"),
  bio: z.string().max(1000).optional(),
  interests: z.array(z.string()).min(1, "Minst éin interesse er påkrevd"),
  photos: z.array(z.string()).optional(),
});

export type ProfileCreateInput = z.infer<typeof profileCreateSchema>;

/**
 * Validering for profil-oppdatering.
 */
export const profileUpdateSchema = profileCreateSchema.partial();

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
