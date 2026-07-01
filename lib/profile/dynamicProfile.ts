/**
 * ToSom — Dynamic Profile Engine (Produktnivå)
 */

export interface DynamicProfileData {
  identityName: string;
  bio: string;
  tags: string[];
  resonanceHighlight: string;
  journeyPhase: string;
  warmthLevel: string;
  matchScore: number;
  lastUpdated: string;
}

export function updateProfileFromJourney(profile: Partial<DynamicProfileData>, phaseOrder: number, currentDay: number, daysRemaining: number): Partial<DynamicProfileData> {
  const phaseNames = ['', 'Introduksjon', 'Trygghet', 'Sårbarhet', 'Fremtid', 'Djupne'];
  const phaseLabels = ['', 'Fase 1', 'Fase 2', 'Fase 3', 'Fase 4', 'Fase 5'];
  return {
    ...profile,
    bio: profile.bio ? `${profile.bio}\nPå reise: ${phaseLabels[phaseOrder] || 'Ukjent'} — Dag ${currentDay}/30` : `På reise: ${phaseLabels[phaseOrder] || 'Ukjent'} — Dag ${currentDay}/30`,
    tags: [...(profile.tags || []), phaseNames[phaseOrder] || 'Introduksjon'],
    journeyPhase: phaseNames[phaseOrder] || 'Introduksjon',
    lastUpdated: new Date().toISOString(),
  };
}

export function updateProfileFromResonance(profile: Partial<DynamicProfileData>, resonanceScore: number): Partial<DynamicProfileData> {
  let resonanceHighlight = '';
  let tags: string[] = [];
  if (resonanceScore >= 80) { resonanceHighlight = 'Djuk resonans'; tags = ['Djuk resonans', 'Høg trygghet']; }
  else if (resonanceScore >= 60) { resonanceHighlight = 'Sterk resonans'; tags = ['Sterk resonans', 'God trygghet']; }
  else if (resonanceScore >= 40) { resonanceHighlight = 'Moder resonans'; tags = ['Moder resonans']; }
  else { resonanceHighlight = 'Tidleg resonans'; tags = ['Tidleg resonans']; }
  return { ...profile, resonanceHighlight, tags: [...(profile.tags || []), ...tags], matchScore: resonanceScore, lastUpdated: new Date().toISOString() };
}

export function updateProfileFromWarm(profile: Partial<DynamicProfileData>, warmScore: number, warmLevel: string): Partial<DynamicProfileData> {
  const warmthLabels: Record<string, string> = { 'Kald': 'Enno kjølig', 'Lukten': 'Ein svak lukte', 'Varm': 'Varmen kjem', 'Glødande': 'Gløden aukar', 'Ekko': 'Varmen ekkoer' };
  return { ...profile, warmthLevel: warmLevel, resonanceHighlight: warmthLabels[warmLevel] || 'Utviklar seg', lastUpdated: new Date().toISOString() };
}

export function getDynamicProfileDisplay(profile: DynamicProfileData): { displayName: string; displayBio: string; displayTags: string[]; progressBadge: string; } {
  return { displayName: profile.identityName || 'Din match', displayBio: profile.bio || 'Ingen bio enno.', displayTags: [...new Set(profile.tags || [])], progressBadge: profile.resonanceHighlight || 'Utviklar seg' };
}