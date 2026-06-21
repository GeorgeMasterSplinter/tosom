/**
 * ToSom -- MatchExplanation
 * Genererer forklaringar på kvifor to brukarar matcher,
  samtaletema og potensielle utfordringar.
 */

import { ProfileData } from './MatchScore';

export interface MatchExplanation {
  why: string[];
  talkAbout: string[];
  challenges: string[];
}

/**
 * Generer match-forklaring basert på samanlikning av to profiler.
 */
export function getMatchExplanation(
  a: ProfileData,
  b: ProfileData,
  scores: Record<string, number>
): MatchExplanation {
  const why: string[] = [];
  const talkAbout: string[] = [];
  const challenges: string[] = [];

  // --- WHY: Felles merke ---

  // Livsstil-kompatibilitet
  const lifestyleScore = scores.livsstil ?? 0;
  if (lifestyleScore >= 75) {
    why.push('Dere har svært lik livsstil og dagligrytme.');
  } else if (lifestyleScore >= 55) {
    why.push('Dere deler viktige verdier om dagliv og prioriteringar.');
  } else {
    why.push('Dere har ulike men komplementære livsstilar.');
  }

  // Kommunikasjon
  const commScore = scores.kommunikasjon ?? 0;
  if (commScore >= 75) {
    why.push('Dere kommuniserer på svært like måtar — naturlig flyt.');
  } else if (commScore >= 55) {
    why.push('Kommunikasjonsstilen deres passer godt sammen.');
  } else {
    why.push('Dere har ulike kommunikasjonsstilar som kan utfylle kvarandre.');
  }

  // Fremtidsvisjon
  const futureScore = scores.fremtid ?? 0;
  if (futureScore >= 70) {
    why.push('Dere har svært like ønsker for framtida.');
  } else if (futureScore >= 50) {
    why.push('Dere deler viktige framtidsmål og verdier.');
  }

  // Kjaerlighet/tilknytning
  const intimacyScore = scores.kjaerlighet ?? 0;
  if (intimacyScore >= 70) {
    why.push('Dere har kompatible behov for nærheit og avstand.');
  }

  // Personlighet
  const personalityScore = scores.personlighet ?? 0;
  if (personalityScore >= 70) {
    why.push('Dere deler sentrale personlighetstrekk som skaper trygghet.');
  }

  // Humor
  const humorScore = scores.humor ?? 0;
  if (humorScore >= 70) {
    why.push('Dere har lik sans for humor — viktig for felles glede.');
  }

  // Modenhet
  const maturityDiff = Math.abs((a.maturityLevel ?? 5) - (b.maturityLevel ?? 5));
  if (maturityDiff <= 1) {
    why.push('Dere har nesten sama modenheitsnivå — trygg grunnlag.');
  } else if (maturityDiff <= 3) {
    why.push('Dere har liknande modenheit og relasjonsklarheit.');
  }

  // --- TALK ABOUT: Samtaletema ---
  talkAbout.push('Hva gir dere energi i hverdagen?');
  talkAbout.push('Hvordan liker dere å vise kjærlighet?');
  talkAbout.push('Hva er en drøm dere jobber mot?');

  if (commScore < 70) {
    talkAbout.push('Hvordan kan dere finjustere kommunikasjonen sin?');
  }

  if (lifestyleScore < 70) {
    talkAbout.push('Hvordan kan ulike livsstilar utfylle kvarandre?');
  }

  // --- CHALLENGES: Potensielle utfordringar ---
  if (maturityDiff > 2) {
    challenges.push('Dere har ulikt modenheitsnivå — tålmodighet kan være viktig.');
  }

  if (lifestyleScore < 55) {
    challenges.push('Dere har ulik livsstil — tydelig kommunikasjon kan hjelpe.');
  }

  if (commScore < 55) {
    challenges.push('Dere har ulik kommunikasjonsstil — bevissthet kan forenkle.');
  }

  const aIntimLevel = (a.intimacy as any)?.level ?? 5;
  const bIntimLevel = (b.intimacy as any)?.level ?? 5;
  const intimacyDiff = Math.abs(aIntimLevel - bIntimLevel);
  if (intimacyDiff > 2) {
    challenges.push('Dere har ulik behov for nærhet — rom for forhandling er viktig.');
  }

  // Default challenges if empty
  if (challenges.length === 0) {
    challenges.push('Dere matcher godt, men alltid rom for å lære hverandre å kjenne.');
  }

  return { why, talkAbout, challenges };
}

/**
 * Generer standard-forklaring ved manglande data.
 */
export function getDefaultExplanation(): MatchExplanation {
  return {
    why: [
      'Vi deler grunnleggjande verdier om menneskelege relasjonar.',
      'Vi har liknande syn på viktige tema i livet.',
    ],
    talkAbout: [
      'Hva gir deg mest energi i kvardagen?',
      'Hvordan viser du kjærlighet best?',
      'Hva er en mål du jobbar mot?',
    ],
    challenges: [
      'Vi kan ha ulike måtar å kommunisere på — tydelighet hjelper.',
    ],
  };
}