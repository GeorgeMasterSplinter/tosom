// feedback.ts — stub for framtidig feedback-loop
// (ingen logikk ennå)

/**
 * Lagre brukar-feedback på eit match.
 * Framtid: vil justere vekter basert på korleis brukaren svarar.
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
 * Hent accumulated feedback for ein bruker.
 */
export async function getFeedbackProfile(userId: string): Promise<{
  likeRate: number;
  topCategories: string[];
  avgScore: number;
}> {
  // TODO: hent frå DB
  return { likeRate: 0, topCategories: [], avgScore: 0 };
}
