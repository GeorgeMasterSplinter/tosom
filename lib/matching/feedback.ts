// feedback.ts — stub for fremtidig feedback-loop
// (Fase A2: MatchFeedback-modell fjernet fra schema — ikke i ToSom-konseptet)

/**
 * Lagre bruker-feedback på et match.
 * Fremtid: vil justere vekter basert på hvordan brukeren svarer.
 */
export async function recordMatchFeedback(
  userId: string,
  targetUserId: string,
  score: number,
  decision: "like" | "dislike" | "super" | "skip",
): Promise<void> {
  // TODO: implementer lagring av feedback til DB
  console.log(`[feedback-stub] ${userId} → ${targetUserId}, score=${score}, decision=${decision}`);
}

/**
 * Hent accumulated feedback for en bruker.
 */
export async function getFeedbackProfile(userId: string): Promise<{
  likeRate: number;
  topCategories: string[];
  avgScore: number;
}> {
  // TODO: hent fra DB
  return { likeRate: 0, topCategories: [], avgScore: 0 };
}
