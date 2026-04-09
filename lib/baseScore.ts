// lib/baseScore.ts

export function baseCompatibilityScore(a, b) {
  let s = 0;

  const match = (x, y, weight = 5) => {
    if (!x || !y) return 0;
    return x === y ? weight : 0;
  };

  // Livsstil
  s += match(a.dayRhythm, b.dayRhythm);
  s += match(a.weekendStyle, b.weekendStyle);
  s += match(a.activityLevel, b.activityLevel);
  s += match(a.socialLevel, b.socialLevel);
  s += match(a.financialStyle, b.financialStyle);

  // Personlighet
  s += match(a.structureVsSpontaneity, b.structureVsSpontaneity);
  s += match(a.calmVsIntense, b.calmVsIntense);
  s += match(a.emotionalVsLogical, b.emotionalVsLogical);
  s += match(a.conflictStyle, b.conflictStyle);
  s += match(a.planningStyle, b.planningStyle);

  // Relasjonsstil
  s += match(a.loveLanguage, b.loveLanguage, 10);

  // Fremtidsønsker
  s += match(a.wantChildren, b.wantChildren, 5);
  s += match(a.wantCohabitation, b.wantCohabitation, 5);
  s += match(a.wantMarriage, b.wantMarriage, 5);

  return s;
}
