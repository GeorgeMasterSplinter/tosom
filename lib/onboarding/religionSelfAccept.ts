/**
 * ToSom — R-12 UX-hjelp (Phase 1.5)
 *
 * Informasjonshinvisning for når brukeren oppgir en egen religion/livssyn
 * som IKKE inngår i den eksplisitte akseptlisten. Hensikt: hjelpe brukeren
 * å lage bevisste valg — streng R-12-logikk beholdes (akseptlisten er
 * autoritativ; ingen implisitt selv-aksept).
 *
 * Hinde er:
 * - informasjon, IKKE en valideringsfeil — onboarding kan fullføres uansett
 * - ikke obligatorisk, ikke automatisk valgt, ikke manipulerende
 * - ikke vist når OPEN TO ALL er valgt (da er spørsmålet allerede besvart)
 * - ikke vist når akseptlisten mangler (legacy/ikke svart — ingen gjeting)
 *
 * Ren funksjon av profildata — ingen bivirkninger, ingen innvirkning på
 * matchinglogikk (verifisert i tester, R-18–R-20).
 */

import { religionKey } from '@/lib/matching/dealbreaker';

const RELIGION_LABELS: Record<string, string> = {
  kristen: 'kristen',
  katolsk: 'katolsk',
  agnostiker: 'agnostisk',
  ateist: 'ateist',
  muslim: 'muslim',
  'jehovas-vitne': 'jehovas vitne',
  hindu: 'hindu',
  judedom: 'jøde',
  buddhist: 'buddhist',
  spirituell: 'spirituell',
  annet: 'annen tro',
};

function labelFor(v: string): string {
  return RELIGION_LABELS[religionKey(v)] ?? v;
}

export interface ReligionHintInput {
  /** Brukerens egen religion/livssyn (kommaseparert, opptil 4) */
  religion?: string | null;
  /** Eksplisitt akseptliste (kommaseparert, opptil 4) */
  acceptedReligions?: string | null;
  /** OPEN TO ALL (Phase 1.5) */
  religionOpen?: boolean;
}

/**
 * Returnerer hint-tekst når egen religion/livssyn mangler i den eksplisitte
 * akseptlisten, ellers null. Håndterer flere egne verdier (avdekker de som
 * mangler). Versal-/mellomromstolerant via religionKey.
 */
export function getReligionSelfAcceptHint(input: ReligionHintInput): string | null {
  if (input.religionOpen === true) return null; // OPEN TO ALL — spørsmålet er besvart
  const own = (input.religion ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (own.length === 0) return null;
  const accepted = (input.acceptedReligions ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (accepted.length === 0) return null; // ikke svart / legacy — ingen gjeting
  const acceptedKeys = new Set(accepted.map(religionKey));
  const missing = own.filter((r) => !acceptedKeys.has(religionKey(r)));
  if (missing.length === 0) return null;
  const labels = missing.map(labelFor);
  const liste =
    labels.length === 1
      ? labels[0]
      : labels.slice(0, -1).join(', ') + ' og ' + labels[labels.length - 1];
  return (
    `Du har oppgitt ${liste} som religion/livssyn, men du har ikke valgt ` +
    `${liste} blant religionene og livssynene du er åpen for. ` +
    `Vil du også kunne bli koblet med andre med ${liste}? Da kan du enkelt legge det til.`
  );
}