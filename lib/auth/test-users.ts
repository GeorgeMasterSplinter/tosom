// lib/auth/test-users.ts — Ekte test-brukarar for platform-testing
// Test-brukarane er fullverdig brukarar utan betalingskrav

export interface TestUser {
  id: string;
  email: string;
  name: string;
  password: string; // I plaintext for dev/test — ikke i produksjon!
}

export const TEST_USERS: TestUser[] = [
  {
    id: 'test-user-1',
    email: 'astrid@tosom.no',
    name: 'Astrid',
    password: 'SauLasa26',
  },
  {
    id: 'test-user-2',
    email: 'magnus@tosom.no',
    name: 'Magnus',
    password: 'Madaleine',
  },
];

export function isTestUser(userId: string): boolean {
  return TEST_USERS.some(u => u.id === userId);
}

export function getTestUserById(userId: string): TestUser | undefined {
  return TEST_USERS.find(u => u.id === userId);
}

export function getTestUserByEmail(email: string): TestUser | undefined {
  return TEST_USERS.find(u => u.email === email);
}

// Oppskrift på fake profil-data for test-brukarane
// Desse blir genererte automatisk når brukaren fullfører onboarding
export const TEST_PROFILE_OVERRIDES = {
  'test-user-1': {
    firstName: 'Astrid',
    lastName: '',
    age: 28,
    identityName: 'Astrid',
    // Verdier
    futureVision: ['familie', 'kreativitet', 'natur', 'personleg vekst'],
    // Personlighet
    personalityTraits: ['rolig', 'dyp', 'empatisk', 'tenkjeom'],
    // Relasjonsstil
    relationshipStyle: { type: 'secure', pace: 'steady' },
    // Kommunikasjon
    communicationPreferences: ['direkte', 'ærlig', 'lyttar aktivt'],
    // Intimitet
    intimacyPreferences: { pace: 'gradual', expression: 'verbalt og handling' },
    // Framtidsønsker
    futureGoals: ['bygge heim', 'reise', 'personleg utvikling'],
    // Grenser
    boundaries: ['treng tid å seg sjølv', 'verdsætter ærlighet'],
    // Emosjonelle behov
    emotionalNeeds: ['bli sett og høyrt', 'trygghet', 'dype samtaler'],
    // Livsstil
    lifeRhythm: 'calm',
    // Modenhet
    maturityLevel: 7,
    securityLevel: 'high',
    // Bio
    bio: 'Eg er ein roleg og dyp person som verdier ekte forbindelse. Natur og kreativitet gir meg energi.',
    // Interesser
    interests: ['natur', 'litteratur', 'kreativitet', 'refleksjon', 'reising'],
    // Match-tags
    matchTags: ['rolig', 'dyp', 'familienær', 'kreativ', 'trygg'],
  },
  'test-user-2': {
    firstName: 'Magnus',
    lastName: '',
    age: 31,
    identityName: 'Magnus',
    // Verdier — overlap med Astrid for å gi god match
    futureVision: ['familie', 'personleg vekst', 'natur', 'meningsfullt arbeid'],
    // Personlighet
    personalityTraits: ['tenkande', 'ærlig', 'rolig', 'reflekterande'],
    // Relasjonsstil
    relationshipStyle: { type: 'secure', pace: 'gradual' },
    // Kommunikasjon
    communicationPreferences: ['direkte', 'åpen', 'nysgjerrig'],
    // Intimitet
    intimacyPreferences: { pace: 'gradual', expression: 'verbalt og nærvær' },
    // Framtidsønsker
    futureGoals: ['bygge stable liv', 'reise verda rundt', 'personleg utvikling'],
    // Grenser
    boundaries: ['treng rom for tenking', 'verdsætter ærlighet'],
    // Emosjonelle behov
    emotionalNeeds: ['dype samtaler', 'respekt for alenetid', 'trygghet'],
    // Livsstil
    lifeRhythm: 'calm',
    // Modenhet
    maturityLevel: 8,
    securityLevel: 'high',
    // Bio
    bio: 'Eg er ein tenkande og reflektert mann som verdier ærlighet og vekst. Familiefamilie og natur betyr mye for meg.',
    // Interesser
    interests: ['natur', 'filosofi', 'reising', 'bøker', 'refleksjon'],
    // Match-tags
    matchTags: ['tenkande', 'rolig', 'familiefamilie', 'vekstorientert', 'trygg'],
  },
};