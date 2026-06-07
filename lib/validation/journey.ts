import { z } from "zod";

/**
 * Validering for journey-aksjonar (app/api/journey/**/*.route.ts).
 */
export const journeyStepSchema = z.object({
  conversationId: z.string().min(1, "conversationId er påkrevd"),
  action: z.enum(["next", "skip", "complete"]),
});

export type JourneyStepInput = z.infer<typeof journeyStepSchema>;

/**
 * Validering for admin-journey-søk.
 */
export const journeyFilterSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  phase: z.enum(["EARLY", "BUILDING_TRUST", "DEEPER", "CHECKIN"]).optional(),
});

export type JourneyFilterInput = z.infer<typeof journeyFilterSchema>;
