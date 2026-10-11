# Epostkartlegging — når sender ToSom epost?

Status per 10.11.2026. Alle eposter sendes fra `noreply@tosom.no` (Resend/SMTP,
konfigurert i `lib/email` + Vercel-env `EMAIL_SERVER_*`).

**Nye detaljer:** Arkitektur, symmetrivurdering (begge brukere), kjedebilde for
grace-perioden og diagnose-runbook: `docs/EPINNTAK-EPPOSTSYSTEM-OVERSIKT.md`.

## Prinsipp

- Epost sendes kun ved **store livshendelser** og **admin-informasjon**.
- Brukeren er aktiv i appen → ingen epost (ingen påminnelser, ingen kø-varsler).
- Alt er **best-effort**: epostfeil skal aldri velte en ellers vellykket handling.
- Alt **awaits fullstendig** før ruten returnerer (Vercel drepes ellers
  uferdige sends — fire-and-forget bug fixet 10.11).

## Utfall som sender epost

| # | Utfall | Hvem får | Epost | Kilde i koden |
|---|--------|----------|-------|---------------|
| 1 | Onboarding fullført (faktisk sluttsteg — profil lagret, bruker i venterom) | Brukeren | «Velkommen til ToSom» (med navn) — kun ved overgang `onboardingComplete: false→true` (ny omgang etter «start ny reise» gir ny velkomst-epost) | `app/api/profile/setup/route.ts` (10.11: flyttet fra `app/api/onboarding/complete/route.ts` som har null kallere — død rute) |
| 2 | Match funnet (matcherunde) | Begge i paret | «Du har fått en kobling» — bak flagget `BETA_MATCH_EMAIL=true` (leses live fra Vercel-env, ingen redeploy) | `app/api/cron/matching/route.ts` |
| 3 | Reisen avsluttet tidlig (tidlig avslutning / «start ny reise» / blokkering / kontosletting med aktiv match) | **Partneren** (den som avsluttet får ingen — den valgte selv) | «Reisen er avsluttet» — nøytral, konkret, empatisk; avslører aldri hvem | `lib/journey/endJourney.ts` (via `initiatorId`) |
| 4 | Reisen fullført (dag 30, `no_action`) | Begge | «Reisen er fullført» — takk + bekrefter at alt er slettet | `lib/journey/endJourney.ts` |
| 5 | De fant hverandre (`found_each_other`) | Begge | «Gratulerer — reisen er fullført» — **D (10.11): 24-timers grace**; innholdet beholdes slik at begge kan laste ned PDF før `cron/journey` sletter alt | `lib/journey/endJourney.ts` |
| 6 | Admin løyser kobling (unmatch) | Begge i paret | «Reisen er avsluttet» (nøytral) | `app/api/admin/matches/[id]/unmatch/route.ts` |
| 7 | Passord-nullstilling | Brukeren | «Tilbakestill passordet ditt» (link, 1 time) | `app/api/auth/request-reset/route.ts` |
| 8 | Konto slettet | Brukeren | «Din ToSom-konto er slettet» (siste ord) | `app/api/settings/delete-account/route.ts` |
| 9 | Admin sender felles epost | Alle aktive brukere (max 500/send) | Fri tekst: emne + melding | `app/api/admin/broadcast/route.ts` + verktøy i `/admin/tools` |

## Utfall som IKKE sender epost (bevisst)

| Utfall | Begrunnelse |
|--------|-------------|
| Registrering | Brukeren er aktiv — velkommen-eposten kommer når onboarding er ferdig (én epost, ikke to). |
| Still i køen / venterom | Lav verdi; brukeren sitter nettopp i appen. |
| Dag-teller i reisen | Varslingflom; appen er stedet. |
| Blokkert (til den som blokkerte) | Den blokkerte selv — ingen epost. Partneren får den nøytrale «reisen er avsluttet» (#3). |
| Rapportert | Operasjonelt — admin får alert via `sendAlert` (ALERT_EMAIL), ikke brukeren. |

## Operasjonelt (ikke bruker-eposter)

- `sendAlert` → `ALERT_EMAIL` (Vercel-env) ved systemfeil, matcherunde-utfall,
  reise-kron-alerts. `lib/observability/alert.ts`.

## Verktøy i admin-panelet

- **Send test epost** — velkommen-epost til én valgt bruker (SMTP-verifisering).
- **Send epost til alle brukere** — felles kunngjøring (emne + melding), max 500/send,
  logges i SystemLog (`admin:broadcast`).
- **Kjør matching manuelt** — trigg matcherunden (match-eposter følger flagget #2).

## Flag og env (Vercel, prod)

| Variabel | Formål |
|----------|--------|
| `EMAIL_SERVER_HOST/PORT/USER/PASSWORD` | SMTP (Resend). `PASSWORD` = API-nøkkel. |
| `EMAIL_FROM` | Valgfri override for avsender. |
| `BETA_MATCH_EMAIL` | `'true'` = match-eposter på. Leses **live** (ingen redeploy). |
| `ALERT_EMAIL` | Mottaker for operasjonelle alerts. |

## Fremtidige kandidater (ikke implementert — vurdere før lansering)

- Kvittering ved betaling (når betalingsflyen er klar).
- Reisemilepeler (f.eks. dag 10) — vurdere: kan bli støy.
- Epost ved «reise fullført med ny reise-CTA» når brukeren har stått inne i lengre tid.
