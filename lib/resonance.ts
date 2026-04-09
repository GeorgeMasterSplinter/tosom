// lib/resonance.ts

export async function emotionalResonance(a, b) {
  const combinedA = `
    ${a.selfView}
    ${a.workingOn}
    ${a.fears}
    ${a.partnerHope}
  `;

  const combinedB = `
    ${b.selfView}
    ${b.workingOn}
    ${b.fears}
    ${b.partnerHope}
  `;

  // --- AI CALL (pseudo) ---
  // const score = await llm.compareTone(combinedA, combinedB);

  // For nå: dummy-score
  const score = Math.random() * 100;

  return score;
}
