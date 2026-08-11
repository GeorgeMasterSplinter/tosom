// scripts/verify-matching.ts — Enkel verifisering av matching-motoren
// Kjør med: npx tsx scripts/verify-matching.ts

import { matchingEngine } from "../lib/matching/engine";
import { unifiedScore } from "../lib/matching/unifiedScorer";
import { sjekkAlleDealbreakers } from "../lib/matching/dealbreaker";
import { ProfileData } from "../lib/matching/types";

// Testprofiler — kompatibele (samme livsrytme, moderat modenhet)
const profileA: ProfileData = {
  userId: "user-a",
  firstName: "Alice",
  lastName: null,
  age: 28,
  bio: "Test profil A",
  interests: ["musikk", "natur"],
  lifeSituation: null,
  lifestyle: null,
  personality: { traits: ["empatisk", "analytisk"] },
  relationshipStyle: "gradual",
  communication: null,
  intimacy: null,
  futureVision: null,
  boundaries: null,
  emotionalNeeds: null,
  lifeRhythm: "morning",
  maturityLevel: 7,
  securityLevel: "secure",
  preferences: null,
  matchTags: [],
};

const profileB: ProfileData = {
  userId: "user-b",
  firstName: "Bob",
  lastName: null,
  age: 30,
  bio: "Test profil B",
  interests: ["musikk", "bøker"],
  lifeSituation: null,
  lifestyle: null,
  personality: { traits: ["empatisk", "praktisk"] },
  relationshipStyle: "direct",
  communication: null,
  intimacy: null,
  futureVision: null,
  boundaries: null,
  emotionalNeeds: null,
  lifeRhythm: "morning", // Samme som Alice = ingen livsrytme-dealbreaker
  maturityLevel: 8, // Gap=1 fra Alice (7) = ingen modenhet-dealbreaker
  securityLevel: "secure", // Samme som Alice = ingen sikkerhets-gap
  preferences: null,
  matchTags: [],
};

// Profil med dealbreaker (stor modenhetsskillnad >4)
const profileC: ProfileData = {
  userId: "user-c",
  firstName: "Carol",
  lastName: null,
  age: 25,
  bio: "Test profil C",
  interests: ["dans"],
  lifeSituation: null,
  lifestyle: null,
  personality: { traits: ["impulsiv"] },
  relationshipStyle: "direct",
  communication: null,
  intimacy: null,
  futureVision: null,
  boundaries: null,
  emotionalNeeds: null,
  lifeRhythm: "fast", // Konflikt med Alice morning (ikke direkte, men modenhet er hoved-problem)
  maturityLevel: 2, // Gap=5 fra Alice sin 7 (>4 = dealbreaker!)
  securityLevel: "secure",
  preferences: null,
  matchTags: [],
};

console.log("=== ToSom Matching-verifisering ===\n");

// Test 1: matchingEngine (kompatibele profiler)
console.log("Test 1: matchingEngine(Alice vs Bob - skal PASSES)");
const result1 = matchingEngine(profileA, profileB);
console.log(`  Score: ${result1.score.toFixed(3)} [0-1]`);
console.log(`  Tier: ${result1.tier}`);
console.log(`  Avvist: ${result1.rejected}`);
console.log(`  Forklaring: ${result1.explanation?.substring(0, 80) || "—"}`);

// Test 2: Dealbreaker (stor modenhetsskillnad >4)
console.log("\nTest 2: matchingEngine(Alice vs Carol - skal AVSLÅS)");
const result2 = matchingEngine(profileA, profileC);
console.log(`  Score: ${result2.score.toFixed(3)} [0-1]`);
console.log(`  Tier: ${result2.tier}`);
console.log(`  Avvist: ${result2.rejected}`);
if (result2.rejectionReason) {
  console.log(`  Årsak: ${result2.rejectionReason}`);
}

// Test 3: unifiedScore direkte
console.log("\nTest 3: unifiedScore(Alice vs Bob)");
const result3 = unifiedScore(profileA, profileB);
console.log(`  Score: ${result3.score}/100`);
console.log(`  Nivå: ${result3.level}`);
console.log(`  Verdier: ${result3.breakdown.values}, Personlighet: ${result3.breakdown.personality}`);

// Test 4: sjekkAlleDealbreakers direkte (Alice vs Bob = ingen dealbreakere)
console.log("\nTest 4: sjekkAlleDealbreakers(Alice vs Bob - ingen dealbreakere forventet)");
const result4 = sjekkAlleDealbreakers(profileA, profileB);
console.log(`  Dealbreaker funnet: ${result4.hasDealbreaker}`);

// Oppsummering
console.log("\n=== Verifisering fullført ===");
const test1Pass = result1.score > 0 && !result1.rejected;
const test2Pass = result2.rejected && result2.score === 0;
const test3Pass = result3.score > 0;
const test4Pass = !result4.hasDealbreaker;

console.log(`Test 1 (normal match): ${test1Pass ? "✅" : "❌"}`);
console.log(`Test 2 (dealbreaker):   ${test2Pass ? "✅" : "❌"}`);
console.log(`Test 3 (unifiedScore):  ${test3Pass ? "✅" : "❌"}`);
console.log(`Test 4 (ingen breaker): ${test4Pass ? "✅" : "❌"}`);

const allPassed = test1Pass && test2Pass && test3Pass && test4Pass;
console.log(`\nResultat: ${allPassed ? "✅ ALLE TESTER BESTÅTT" : "❌ NOEN TESTER MISLYKKET"}`);
process.exit(allPassed ? 0 : 1);