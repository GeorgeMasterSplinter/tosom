export function calculateProfileCompletion(profile) {
  if (!profile) return 0;

  const fields = [
    profile.name,
    profile.age,
    profile.location,
    profile.gender,
    profile.seeking,
    profile.bio,
    profile.jobStatus,
    profile.dayRhythm,
    profile.children,
    profile.expectations,
    profile.whatIGive,
    profile.whatINeed,
    profile.loveLanguage,
    profile.structureVsSpontaneity,
    profile.calmVsIntense,
    profile.emotionalVsLogical,
  ];

  const filled = fields.filter((f) => f && f !== "").length;
  const total = fields.length;

  return Math.round((filled / total) * 100);
}
