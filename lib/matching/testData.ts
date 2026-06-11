// testData.ts — testdata for matching-systemet
// Kjør med: npx ts-node lib/matching/testData.ts

import { calculateScore, generateExplanation } from "./scorer";

//
// Testprofilar
//

const profileA = {
  userId: "user-test-a",
  firstName: "Eirik",
  lastName: "Hansen",
  age: 28,
  gender: "male",
  bio: "Eg elskar fjellet, natural og gode samtal om livet. Ønskar ein djup relasjon med nokon som delar same verdier. Har jobba som arkitektur i 5 år.",
  interests: ["fjell", "vandring", "fotografi", "litteratur", "matlagning", "arkitektur", "karriere"],
  photos: ["p1.jpg", "p2.jpg", "p3.jpg"],
};

const profileB = {
  userId: "user-test-b",
  firstName: "Ingrid",
  lastName: "Solheim",
  age: 27,
  gender: "female",
  bio: "Kjemiingeniør på dagtid, amatør-fotograf om kvelden. Trur på åpenheit og ærligheit i relasjonar. Ser etter ein som delar livsgleden.",
  interests: ["fotografi", "vandring", "natur", "matlagning", "arkitektur", "litteratur", "reiser"],
  photos: ["b1.jpg", "b2.jpg"],
};

const profileC = {
  userId: "user-test-c",
  firstName: "Magnus",
  lastName: "Berg",
  age: 42,
  gender: "male",
  bio: "Første gong eg er på dating-app. Likar å lese og lytte på musikk.",
  interests: ["musikk"],
  photos: [],
};

//
// Test-køyring
//

function runTest(label: string, a: Record<string, unknown>, b: Record<string, unknown>) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`TEST: ${label}`);
  console.log(`${(a.firstName as string)} (${a.age}) ↔ ${(b.firstName as string)} (${b.age})`);
  console.log(".".repeat(60));

  const scoreResult = calculateScore(a, b);
  const explanation = generateExplanation(scoreResult);

  console.log(`\n📊 TOTAL: ${scoreResult.totalScore}/100 (${scoreResult.matchQuality})`);
  console.log(`\n🏷️ TIER: ${explanation.tierLabel}`);
  console.log(`\n📋 BREAKDOWN:`);
  console.log(`   base: ${scoreResult.breakdown.base}/100`);
  console.log(`   resonance: ${scoreResult.breakdown.resonance}/100`);
  console.log(`   semantic: ${scoreResult.breakdown.semantic}/100`);
  console.log(`   intimacy: ${scoreResult.breakdown.intimacy}/100`);
  console.log(`   future: ${scoreResult.breakdown.future}/100`);

  console.log(`\n💬 SAMMENDRAG:`);
  console.log(`   ${explanation.explanation}`);

  // Verifiser totalen
  const weights = { base: 0.4, resonance: 0.25, semantic: 0.25, intimacy: 0.05, future: 0.05 };
  const recalculated =
    scoreResult.breakdown.base * weights.base +
    scoreResult.breakdown.resonance * weights.resonance +
    scoreResult.breakdown.semantic * weights.semantic +
    scoreResult.breakdown.intimacy * weights.intimacy +
    scoreResult.breakdown.future * weights.future;
  const recalcRounded = Math.round(recalculated);

  console.log("\n" + "─".repeat(60));
  if (recalcRounded === scoreResult.totalScore) {
    console.log("✅ Totalen er korrekt: " + scoreResult.totalScore);
  } else {
    console.log(`❌ Totalen er FEIL: forventet ${scoreResult.totalScore}, fann ${recalcRounded}`);
  }
}

//
// Kjør alle testar
//

console.log("🚀 TOSOM MATCHING TEST SUITE");
console.log("═".repeat(60));

runTest("Høg overlap (sterk match)", profileA, profileB);
runTest("Liten overlap (svak match)", profileA, profileC);

console.log("\n" + "═".repeat(60));
console.log("✅ Testkjøring fullført");
console.log("═".repeat(60) + "\n");
