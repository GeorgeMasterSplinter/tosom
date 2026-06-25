/**
 * ToSom useOnboarding — Hook for onboarding flow.
 * 
 * Exposes context state + validation per step.
 */

'use client';

import { useContext } from 'react';
import { OnboardingContext } from '@/providers/OnboardingProvider';

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding must be used within OnboardingProvider');
  return ctx;
}

/* ═══════════════════════════════════════════
   VALIDATION PER STEP
   ═══════════════════════════════════════════ */

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ValidationError {
  field: string;
  message: string;
}

export function validateStep(step: number, data: Record<string, unknown>): ValidationError[] {
  const errors: ValidationError[] = [];

  switch (step) {
    case 1: {
      const name = String(data.name ?? '').trim();
      const age = String(data.age ?? '');
      const email = String(data.email ?? '').trim();
      const gender = String(data.gender ?? '').trim();
      const location = String(data.location ?? '').trim();

      if (!name) errors.push({ field: 'name', message: 'Navn er påkrevd' });
      if (!age || parseInt(age) < 18) errors.push({ field: 'age', message: 'Du må være 18+ for å bruke ToSom' });
      if (!emailRegex.test(email)) errors.push({ field: 'email', message: 'Ugyldig e-post' });
      if (!gender) errors.push({ field: 'gender', message: 'Kjønn er påkrevd' });
      if (!location) errors.push({ field: 'location', message: 'Lokasjon er påkrevd' });
      break;
    }
    case 2: {
      const lookingFor = String(data.lookingFor ?? '').trim();
      const relationshipType = String(data.relationshipType ?? '').trim();
      const educationLevel = String(data.educationLevel ?? '').trim();
      const ambitionLevel = String(data.ambitionLevel ?? '').trim();
      const eliteSinglesType = String(data.eliteSinglesType ?? '').trim();

      if (!lookingFor) errors.push({ field: 'lookingFor', message: 'Hvem du søker etter er påkrevd' });
      if (!relationshipType) errors.push({ field: 'relationshipType', message: 'Relasjonstype er påkrevd' });
      if (!educationLevel) errors.push({ field: 'educationLevel', message: 'Utdanningsnivå er påkrevd' });
      if (!ambitionLevel) errors.push({ field: 'ambitionLevel', message: 'Ambisjonsnivå er påkrevd' });
      if (!eliteSinglesType) errors.push({ field: 'eliteSinglesType', message: 'EliteSingles-type er påkrevd' });
      break;
    }
    case 3: {
      const communicationStyle = String(data.communicationStyle ?? '').trim();
      const loveLanguage = String(data.loveLanguage ?? '').trim();

      if (!communicationStyle) errors.push({ field: 'communicationStyle', message: 'Kommunikasjonsstil er påkrevd' });
      if (!loveLanguage) errors.push({ field: 'loveLanguage', message: 'Kjærlighetsspråk er påkrevd' });
      break;
    }
    case 4: {
      const personalityType = String(data.personalityType ?? '').trim();
      const traits = data.traits;

      if (!personalityType) errors.push({ field: 'personalityType', message: 'Personlighetstype er påkrevd' });
      if (!Array.isArray(traits) || traits.length < 3) {
        errors.push({ field: 'traits', message: 'Velg minst 3 trekk' });
      }
      break;
    }
    case 5: {
      // No validation for summary
      break;
    }
    default:
      break;
  }

  return errors;
}