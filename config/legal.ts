/**
 * Tosom — Juridiske konstanter
 *
 * Eneste kilde for versjon og dato på vilkår og personvernerklæring.
 * Brukes både av de brukervendte sidene og av samtykke-lagringen
 * (User.termsVersion), slik at vi til enhver tid kan dokumentere
 * nøyaktig hvilken tekst en bruker har akseptert.
 *
 * Ved endring i vilkårene: bump TERMS_VERSION og TERMS_UPDATED sammen.
 * Brukere med eldre versjon får en rolig melding ved neste innlogging.
 */

/**
 * Selskapet bak Tosom.
 *
 * `orgNumber` og `address` står som null inntil registreringen i
 * Enhetsregisteret er bekreftet. Så lenge de er null, utelates de
 * fra vilkårene og personvernerklæringen — vi skriver heller mindre
 * enn å vise en plassholder på en juridisk bindende side.
 *
 * Når nummeret foreligger: fyll inn begge feltene. Tekstene tar dem
 * i bruk automatisk gjennom hjelperne nedenfor.
 */
export const COMPANY = {
  name: 'Tosom AS',
  /** Settes inn når registreringen i Enhetsregisteret er bekreftet. */
  orgNumber: null as string | null,
  /** Settes inn sammen med organisasjonsnummeret. */
  address: null as string | null,
  email: 'support@tosom.no',
  country: 'Norge',
};

/** Er selskapsopplysningene bekreftet og klare til å vises? */
export function hasCompanyDetails(): boolean {
  return Boolean(COMPANY.orgNumber && COMPANY.address);
}

/**
 * Identifiserer avtaleparten i løpende tekst.
 *
 * Med opplysninger:  «Tosom AS, organisasjonsnummer 123 456 789,
 *                     med forretningsadresse Storgata 1, Oslo»
 * Uten opplysninger: «Tosom AS»
 */
export function companyIdentification(): string {
  if (hasCompanyDetails()) {
    return `${COMPANY.name}, organisasjonsnummer ${COMPANY.orgNumber}, med forretningsadresse ${COMPANY.address}`;
  }
  return COMPANY.name;
}

/** Bunnlinje på vilkår og personvernerklæring. */
export function companyFooterLine(): string {
  if (hasCompanyDetails()) {
    return `${COMPANY.name} · Organisasjonsnummer ${COMPANY.orgNumber} · ${COMPANY.address}`;
  }
  return `${COMPANY.name} · ${COMPANY.country}`;
}

/** Gjeldende versjon av vilkårene. Lagres på bruker ved aksept. */
export const TERMS_VERSION = '2026-08-21';
export const TERMS_UPDATED = '21. august 2026';

/** Gjeldende versjon av personvernerklæringen. */
export const PRIVACY_VERSION = '2026-08-21';
export const PRIVACY_UPDATED = '21. august 2026';

/**
 * Aldersgrense. Invariant I-14.
 * Endres denne, må også valideringsskjemaene endres:
 *   lib/validation/onboarding-setup.ts
 *   lib/validation/profile.ts
 *   lib/validation/api.ts
 *   lib/api/validation.ts
 */
export const MIN_AGE = 21;

/**
 * Prismodell.
 *
 * Under beta er tjenesten vederlagsfri, og ingen pris vises i grensesnittet.
 * Tallene her beskriver modellen som trer i kraft ved åpen lansering,
 * samtidig som betalingsvei aktiveres.
 */
export const PRICING = {
  /** Er betaling aktiv? Følger config/features.ts — se den for kill switch. */
  active: false,
  /** Pris per reise i kroner, betalt én gang. */
  journeyPrice: 349,
  /** Antall brukere som får reisen gratis ved lansering. */
  freeUserCap: 5000,
  currency: 'NOK',
} as const;

/**
 * Refusjon og angrerett.
 *
 * Grensen går ved koblingen, ikke ved en dato:
 *   – Fram til koblingen natt til lørdag: full refusjon.
 *   – Etter koblingen: ingen refusjon. Tjenesten er levert.
 *
 * Begrunnelsen er at leveransen er koblingen selv, ikke de 30 dagene.
 * Koblingen er ugjenkallelig og båndlegger en annen bruker den uken.
 *
 * ⚠️ Modellen forutsetter at reisen regnes som digitalt innhold etter
 * angrerettloven § 22 n. Ikke juridisk bekreftet — se
 * docs/JURIDISK-GRUNNLAG-v1.0.md spørsmål A-1. Må avklares før betaling
 * aktiveres.
 */
export const REFUND = {
  /** Full refusjon så lenge koblingen ikke er gjennomført. */
  fullBeforeMatch: true,
  /** Ingen refusjon etter at koblingen er gjort. */
  afterMatch: false,
} as const;


/** Når matcherunden kjøres. Invariant I-10. */
export const MATCH_ROUND = {
  /** 6 = lørdag (Date.getDay()). */
  weekday: 6,
  hour: 3,
  label: 'natt til lørdag',
} as const;

/** Reisens lengde og bildesperre. Invariant I-5 og I-6. */
export const JOURNEY = {
  totalDays: 30,
  /** Første dag bilder kan deles. */
  imageUnlockDay: 15,
} as const;
