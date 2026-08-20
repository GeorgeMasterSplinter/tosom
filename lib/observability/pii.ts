// lib/observability/pii.ts — S-16: ÉN kilde for PII-skrubbing i Sentry.
//
// Sentry må aldri motta profilinnhold, meldingsinnhold eller e-post/telefon.
// En stack trace med DeepProfile i konteksten er en lekkasje av det mest
// sensitive vi har. Denne modulen brukes i ALLE Sentry-runtimes (node,
// edge, client) via én `scrubPiiEvent`-funksjon — ingen dupliserte kopier.
//
// Design:
//   1. Fjerner hele felt der nøkkelen er forbudt (profile, deepProfile,
//      content, email, phone, identityName, ...) — uavhengig av verditype.
//   2. Redigerer (regex) alle gjenværende streng-verdier for e-post og telefon.
//   3. Går rekursivt gjennom event.extra, event.contexts, event.request.
//
// Modulen er avhengighet-fri (bare regex + TypeScript) så den kan lastes i
// Edge-runtime uten Node-avhengigheter.

/** Sentry-event-struktur vi opererer på (subset — unngår type-import i edge). */
interface SentryEventLike {
  message?: string;
  exception?: { values?: Array<{ value?: string }> };
  breadcrumbs?: Array<{ message?: string }>;
  extra?: Record<string, unknown>;
  contexts?: Record<string, unknown>;
  request?: Record<string, unknown>;
  [key: string]: unknown;
}

/**
 * Nøkler som ALTID skal ut av eventet (uavhengig av verdi).
 * Sammenlignes lowercasede for å fange deepProfile / DeepProfile / deep_profile.
 */
const FORBIDDEN_KEYS = new Set([
  'profile',
  'deepprofile',
  'deepprofiledata',
  'deepprofiledata',
  'content',
  'message',
  'email',
  'phonenumber',
  'phone',
  'mobile',
  'identityname',
  'identity_name',
  'password',
  'token',
]);

/** Regex for e-post og telefonnummer (best effort — aldri full garanti). */
const PII_PATTERNS: RegExp[] = [
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, // e-post
  /\+?[0-9]{7,15}\b/g, // telefon
];

function redactString(val: string): string {
  let r = val;
  for (const pattern of PII_PATTERNS) {
    r = r.replace(pattern, '[redacted]');
  }
  return r;
}

/**
 * Renser et vilkårlig verditre: fjerner forbudte nøkler, redigerer streng-PII.
 * Returnerer et NYTT objekt (muterer ikke inndata — Sentry-eventet skal
 * returneres som et konsist objekt).
 */
function scrubValue(value: unknown): unknown {
  if (typeof value === 'string') {
    return redactString(value);
  }
  if (Array.isArray(value)) {
    return value.map(scrubValue);
  }
  if (value !== null && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      if (FORBIDDEN_KEYS.has(key.toLowerCase())) {
        // Helt ut — ikke engang nøkkelen skal nå Sentry.
        continue;
      }
      out[key] = scrubValue(val);
    }
    return out;
  }
  // Primitiver (number/boolean/null/undefined) — som de er.
  return value;
}

/**
 * Scrubber et komplett Sentry-event for PII. Returnerer eventet (mutert)
 * slik at det kan returneres fra `beforeSend`.
 *
 * Bruker `any` for eventet: Sentrys `ErrorEvent`/`SentryEvent`-typer er
 * store og runtime-spesifikke (node/edge/client). Skrubberen opererer på
 * et kjent subset av feltene (message, exception, breadcrumbs, extra,
 * contexts, request) og rører ellers ikke eventet.
 */
export function scrubPiiEvent(event: any): any {
  const ev = event as SentryEventLike;

  // Top-nivå-felt som kan bære PII — fjern hele nøkkelen hvis forbudt.
  for (const key of Object.keys(ev)) {
    if (FORBIDDEN_KEYS.has(key.toLowerCase()) && key !== 'message') {
      delete (ev as Record<string, unknown>)[key];
    }
  }

  // Eventets egen melding: rediger (bevar kontekst, fjern PII).
  if (ev.message) ev.message = redactString(ev.message);

  // Unntak-verdier (stack trace / error strings).
  if (ev.exception?.values) {
    for (const exc of ev.exception.values) {
      if (exc.value) exc.value = redactString(exc.value);
    }
  }

  // Breadcrumbs.
  if (ev.breadcrumbs) {
    for (const crumb of ev.breadcrumbs) {
      if (crumb.message) crumb.message = redactString(crumb.message);
    }
  }

  // Strukturerte data-kontekster — rekursivt (der DeepProfile typisk ligger).
  if (ev.extra) ev.extra = scrubValue(ev.extra) as Record<string, unknown>;
  if (ev.contexts) ev.contexts = scrubValue(ev.contexts) as Record<string, unknown>;
  if (ev.request) ev.request = scrubValue(ev.request) as Record<string, unknown>;

  return event;
}

/**
 * Konfigurerbare Sentry-init-verdier for S-16:
 *   - sendDefaultPii: false — aldri send auto-felt (IP, e-post, navn).
 *   - beforeSend: PII-skrubbing via den felles scrubPiiEvent-funksjonen.
 */
export const sentryPiiConfig = {
  sendDefaultPii: false,
  beforeSend: scrubPiiEvent,
};
