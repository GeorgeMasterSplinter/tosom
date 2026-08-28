import { z } from "zod";

/**
 * Validering for meldingssending (app/api/conversation/[id]/send/route.ts).
 */
export const messageSendSchema = z.object({
  content: z
    .string()
    .min(1, "Melding kan ikke være tom")
    .max(2000, "Melding kan maksimalt være 2000 tegn"),
  type: z.enum(["user", "system", "system_message", "continue_choice"]).optional().default("user"),
});

/**
 * Validering for continue_choice (app/api/conversation/[id]/send/route.ts).
 */
export const continueChoiceSchema = z.object({
  type: z.literal("continue_choice"),
  choice: z.enum(["yes", "no"], {
    message: "choice må være 'yes' eller 'no'",
  }),
});

export type MessageSendInput = z.infer<typeof messageSendSchema>;
export type ContinueChoiceInput = z.infer<typeof continueChoiceSchema>;
