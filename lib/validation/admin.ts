import { z } from "zod";

/**
 * Validering for admin-aksjonar (app/api/admin/**/*.route.ts).
 */
export const adminActionSchema = z.object({
  action: z.enum([
    "ban",
    "unban",
    "verify",
    "deactivate",
    "activate",
    "delete",
    "reset_journey",
    "freeze",
    "alert",
    "settings_change",
  ]),
  targetId: z.string().min(1, "targetId er påkrevd"),
  reason: z.string().max(500).optional(),
});

export type AdminActionInput = z.infer<typeof adminActionSchema>;

/**
 * Validering for admin-søk/filter.
 */
export const adminFilterSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  role: z.enum(["user", "admin"]).optional(),
  verified: z.coerce.boolean().optional(),
  banned: z.coerce.boolean().optional(),
});

export type AdminFilterInput = z.infer<typeof adminFilterSchema>;
