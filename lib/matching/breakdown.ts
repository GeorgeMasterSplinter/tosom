export function generateBreakdown(a, b) {
  const eq = (x, y) => x && y && x === y;

  function matchFields(fields) {
    return fields.filter(f => eq(a[f], b[f]));
  }

  // 1. Livsstil
  const lifestyleFields = [
    "activityLevel",
    "socialLevel",
    "financialStyle",
    "weekendStyle",
    "travelStyle",
  ];
  const lifestyleMatches = matchFields(lifestyleFields);
  const lifestyleScore = lifestyleMatches.length * 4;

  // 2. Personlighet
  const personalityFields = [
    "structureStyle",
    "energyStyle",
    "communicationStyle",
    "conflictStyle",
    "planningStyle",
  ];
  const personalityMatches = matchFields(personalityFields);
  const personalityScore = personalityMatches.length * 5;

  // 3. Relasjonsstil
  const relationFields = [
    "loveLanguage",
    "giveStyle",
    "needStyle",
    "relationshipExpectation",
    "dealbreaker",
  ];
  const relationMatches = matchFields(relationFields);
  const relationScore = relationMatches.length * 4;

  // 4. Intimitet
  const intimacyFields = [
    "physicalComfort",
    "emotionalPace",
    "physicalImportance",
    "boundaryStyle",
    "intimacyStyle",
  ];
  const intimacyMatches = matchFields(intimacyFields);
  const intimacyScore = intimacyMatches.length * 3;

  // 5. Fremtid
  const futureFields = [
    "futureWish",
    "ambitionLevel",
    "lifePace",
    "longTermExpectation",
    "lifeDirection",
  ];
  const futureMatches = matchFields(futureFields);
  const futureScore = futureMatches.length * 4;

  return {
    lifestyle: {
      score: lifestyleScore,
      matches: lifestyleMatches,
      explanation:
        lifestyleScore > 10
          ? "Dere har en naturlig lik rytme i hverdagen og liker lignende måter å leve på."
          : "Dere har noen forskjeller i livsstil, men det kan skape balanse."
    },
    personality: {
      score: personalityScore,
      matches: personalityMatches,
      explanation:
        personalityScore > 12
          ? "Personlighetene deres utfyller hverandre på en trygg og naturlig måte."
          : "Dere har ulike personlighetstrekk, noe som kan gi dynamikk."
    },
    relation: {
      score: relationScore,
      matches: relationMatches,
      explanation:
        relationScore > 10
          ? "Dere ønsker lignende ting i en relasjon og gir trygghet på samme måte."
          : "Dere har ulike relasjonsbehov, men det kan være lærerikt."
    },
    intimacy: {
      score: intimacyScore,
      matches: intimacyMatches,
      explanation:
        intimacyScore > 7
          ? "Dere bygger nærhet i et tempo og en stil som passer godt sammen."
          : "Dere har ulike preferanser for nærhet, men det kan utvikles naturlig."
    },
    future: {
      score: futureScore,
      matches: futureMatches,
      explanation:
        futureScore > 10
          ? "Dere ser ut til å ønske en lignende retning i livet."
          : "Dere har ulike fremtidsønsker, men det betyr ikke at dere ikke kan møtes."
    },
  };
}
