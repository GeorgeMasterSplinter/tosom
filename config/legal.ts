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
 * `orgNumber` er bekreftet fra Enhetsregisteret. `address` står som
 * null inntil forretningsadressen er bekreftet; så lenge den er null,
 * utelates den fra vilkårene og personvernerklæringen. Hjelperne
 * nedenfor tar begge feltene i bruk automatisk når de er fylt.
 */
export const COMPANY = {
  name: 'Tosom AS',
  /** Bekreftet fra Enhetsregisteret. */
  orgNumber: '938 413 231',
  /** Settes inn når forretningsadressen er bekreftet. */
  address: null as string | null,
  email: 'support@tosom.no',
  country: 'Norge',
};

/** Er selskapsopplysningene bekreftet og klare til å vises? */
export function hasCompanyDetails(): boolean {
  return Boolean(COMPANY.orgNumber);
}

/**
 * Identifiserer avtaleparten i løpende tekst.
 *
 * Med opplysninger:  «Tosom AS, organisasjonsnummer 938 413 231,
 *                     med forretningsadresse Storgata 1, Oslo»
 * Uten opplysninger: «Tosom AS, organisasjonsnummer 938 413 231»
 */
export function companyIdentification(): string {
  const org = COMPANY.orgNumber ? `, organisasjonsnummer ${COMPANY.orgNumber}` : '';
  const address = COMPANY.address ? `, med forretningsadresse ${COMPANY.address}` : '';
  return `${COMPANY.name}${org}${address}`;
}

/** Bunnlinje på vilkår og personvernerklæring. */
export function companyFooterLine(): string {
  const org = COMPANY.orgNumber ? ` · Organisasjonsnummer ${COMPANY.orgNumber}` : '';
  const address = COMPANY.address ? ` · ${COMPANY.address}` : '';
  return `${COMPANY.name}${org}${address || ` · ${COMPANY.country}`}`;
}

/** Gjeldende versjon av vilkårene. Lagres på bruker ved aksept. */
export const TERMS_VERSION = '2026-10-05';
export const TERMS_UPDATED = '5. oktober 2026';

/** Gjeldende versjon av personvernerklæringen. */
export const PRIVACY_VERSION = '2026-10-05';
export const PRIVACY_UPDATED = '5. oktober 2026';

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
 * De første 5 000 reisene er gratis, deretter én gangssum per reise via Vipps.
 * Betalingsveien aktiveres via config/features.ts (PAYMENTS_ENABLED).
 */
export const PRICING = {
  /** Er betaling aktiv? Følger config/features.ts — se den for kill switch. */
  active: false,
  /** Pris per reise i kroner, betalt én gang. */
  journeyPrice: 349,
  /** Antall reiser som er gratis. */
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

/**
 * Gjeldende lovverk.
 *
 * Én kilde for lovens navn og den offisielle lovdata.no-lenken, slik at
 * vilkår og personvernerklæringen henviser konsistent og alltid peker på
 * den gyldige teksten. Det er teksten på lovdata.no — ikke disse sidene —
 * som er juridisk bindende. Advokatgjennomgang kreves før lansering
 * (se docs/JURIDISK-GRUNNLAG-v1.0.md, åpne spørsmål A-1/A-2/A-4).
 */
export const LEGISLATION = {
  gdpr: {
    label: 'Dataverneforordningen (GDPR) — Forordning (EU) 2016/679',
    url: 'https://lovdata.no/dokument/EU/forordning/2016-06-27/2016-679',
  },
  personvernlov: {
    label: 'Personvernloven (lov 30. juni 2018 nr. 30)',
    url: 'https://lovdata.no/dokument/NL/lov/2018-06-30-30',
  },
  forbrukerkjop: {
    label: 'Forbrukerkjøpsloven (lov 27. mars 2009 nr. 14)',
    url: 'https://lovdata.no/dokument/NL/lov/2009-03-27-14',
  },
  markedsforing: {
    label: 'Markedsføringsloven (lov 18. desember 2003 nr. 92)',
    url: 'https://lovdata.no/dokument/NL/lov/2003-12-18-92',
  },
  avtalelov: {
    label: 'Avtaleloven (lov 13. juni 1918 nr. 3)',
    url: 'https://lovdata.no/dokument/NL/lov/1918-06-13-3',
  },
  bokforing: {
    label: 'Bokføringsloven (lov 12. juni 1998 nr. 13)',
    url: 'https://lovdata.no/dokument/NL/lov/1998-06-12-13',
  },
  datatilsynet: {
    label: 'Datatilsynet',
    url: 'https://www.datatilsynet.no/',
  },
} as const;
