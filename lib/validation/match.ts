import { z } from "zod";

/**
 * Validering for match-oppsett (app/api/match/route.ts).
 */
export const matchCreateSchema = z.object({
  targetUserId: z.string().min(1, "targetUserId er påkrevd"),
});

export type MatchCreateInput = z.infer<typeof matchCreateSchema>;

/**
 * Validering for match-desisjon (like/dislike/skip).
 */
export const matchDecisionSchema = z.object({
  matchId: z.string().min(1, "matchId er påkrevd"),
  decision: z.enum(["like", "dislike", "skip", "super"], {
    message: "decision må vere 'like', 'dislike', 'skip' eller 'super'",
  }),
});

export type MatchDecisionInput = z.infer<typeof matchDecisionSchema>;
