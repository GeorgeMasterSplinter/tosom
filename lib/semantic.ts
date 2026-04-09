// lib/semantic.ts

export async function deepSemanticScore(a, b) {
  const fields = [
    "whatIGive",
    "whatINeed",
    "expectations",
    "dealbreakers",
    "dailyLife",
    "relaxStyle",
    "energySources",
    "energyDrainers",
    "futureVision",
    "selfView",
    "workingOn",
    "proudOf",
    "fears",
    "partnerHope",
  ];

  const textA = fields.map((f) => a[f] || "").join("\n");
  const textB = fields.map((f) => b[f] || "").join("\n");

  // --- AI CALL (pseudo) ---
  // const response = await llm.embed([textA, textB]);
  // const similarity = cosine(response[0], response[1]);

  // For nå: dummy-score
  const similarity = Math.random() * 100;

  return similarity;
}
