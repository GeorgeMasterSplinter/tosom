# EPINNTAK — Epostsystemet: oversikt og vurdering

_Opprettet 10.11.2026. Status: alle brukerrettede eposter verifisert mottatt i prod (Gmail + Yahoo) for velkomst, match og reiseslutt._

## 1. Arkitektur — én kanal, ett sted

Alt e-post sendes via ett punkt: **`lib/email/index.ts`** → `sendEmail()`.

- **Transport:** Resend SMTP (`smtp.resend.com:587`, STARTTLS) via nodemailer. Én delt transporter (singleton via `getTransporter()`).
- **Avsender:** `ToSom <noreplay@tosom.no>`.
- **DNS-autentisering:** SPF (`include:spf.resend.com -all`) + DKIM satt i Cloudflare (verifisert 03.09). **DMARC gjenstår (G-08, start `p=none`)** — inntil da er spamfilter-risikoen (særlig Gmail) reell, men dempet.
- **Feilfilosofi:** `sendEmail` kaster aldri — den logger og returnerer `{ success: false, error }`. Epost er alltid **best-effort**: en feil epost skal aldri blokkere registerings-, match- eller sletteflyet.
- **Serverless-sikkerhet:** der epost skal lande (reise-slutt) venter koden med `await Promise.allSettled(...)` før ruten returnerer — ellers dreper Vercel kjørekonteksten før eposten når frem (lært den hardt måten).
- **Logging:** hver sending logges **per mottaker** i Vercel Functions-loggen, f.eks. `[sendEmail] to a@x.no: sendt` / `FEILET: <årsak>`. Det er diagnostikk-kanalen.
- **Driftsavtaler:** `sendAlert(severity, title, detail)` (`lib/observability/alert.ts`) med prioritering: `ALERT_WEBHOOK_URL` → `ALERT_EMAIL_TO` (via `sendAlertEmail`) → Sentry-fallback. Benyttes av uptime-monitor, cron-watchdog (uteblitt matcherunde), 5xx-terskel og rapporter.

### Alle epost-funksjoner (fulle listen — `lib/email/index.ts`)

| Funksjon | Hvem | Når |
|---|---|---|
| `sendWelcomeEmail` | Ny bruker | Onboarding fullført |
| `sendPasswordResetEmail` | Bruker | Forespørsel om passord-reset (lenke 1 time, single-use) |
| `sendMatchEmail` | Begge matchede | Matcherunde finner et par |
| `sendJourneyEndEmail` | Begge | Reisen er endelig over (found_each_other / no_action) |
| `sendJourneyEndedEmail` | Kun partneren | Reisen tok slutt midt i (early_exit / ny_reise / blocked / expired) |
| `sendDeletionConfirmationEmail` | Bruker som slettet | Etter fullstendig kontosletting |
| `sendAlertEmail` | Operatør (`ALERT_EMAIL_TO`) | Systemvarsel via `sendAlert`-kjeden |
| `sendEmail` | (base-funksjon) | Alt ovenstående går gjennom den |

## 2. Utløsende hendelser — hvor i koden, og hvem får hva

| # | Hendelse | Mottaker(e) | Trigger (fil) | Merknad |
|---|---|---|---|---|
| 1 | **Velkommen** | Ny bruker | `app/api/profile/setup/route.ts` | Kun ved overgang `onboardingComplete: false → true`. **Rotårsaken til manglende velkomst-epost var at koden stod i den døde ruten `/api/onboarding/complete` (null kallere).** Flytta til riktig fullføringspunkt. |
| 2 | **Match** | Begge | `app/api/cron/matching/route.ts` | Sendes i samme prosess som match-laginga; per-mottaker logging. Ingen SMS/push (I-4: kun epost + in-app-notifikasjon). |
| 3 | **Reise slutt — «Vi fant hverandre»** | Begge | `lib/journey/endJourney.ts` (via `/api/journey/exit`) | Gratulerende variant. Fra D (10.11): forteller om **24-timers PDF-grace** i stedet for «slettet alt». |
| 4 | **Reise slutt — dag 30, ingen handling** | Begge | `lib/journey/endJourney.ts` (via `cron/journey` no_action-sveip) | Nøytral variant; alt slettes umiddelbart. |
| 5 | **Reise slutt midt i** | Kun partneren | `lib/journey/endJourney.ts` (early_exit / new_journey / blocked / expired) | **Nøytralt uttrykk — avslører aldri hvem som avsluttet eller blokkerte.** Den som avsluttet får ingen epost (vedkommende valgte selv). |
| 6 | **Kontosletting (GDPR art. 17)** | Bruker som slettet | `app/api/settings/delete-account/route.ts` | Bekreftelse etter vellykket sletting. |
| 7 | **Drift/uptime** | Operatør | `lib/observability/alert.ts` + `.github/workflows/uptime-monitor.yml` | Uteblitt matcherunde, 5xx, health-check-feil. |

## 3. Symmetrivurdering — er alt riktig plassert for begge brukere?

### Livsløpsmatriksen

| Livshendelse | Bruker A | Bruker B (partner) |
|---|---|---|
| Registrering / onboarding fullført | ✅ velkomst | — |
| Match funnet | ✅ match-epost | ✅ match-epost |
| Reisen pågår (30 dager) | ❌ ingen (in-app varsler kun) | ❌ ingen (in-app varsler kun) |
| Slutt: «Vi fant hverandre» | ✅ gratulerende + 24 t PDF | ✅ gratulerende + 24 t PDF |
| Slutt: dag 30, ingen handlet | ✅ nøytral (alt slettet) | ✅ nøytral (alt slettet) |
| Slutt midt i (A handler) | ❌ (eget valg) | ✅ nøytral partner-epost |
| Kontosletting (A sletter) | ✅ bekreftelse | ✅ partner-epost **hvis reise aktiv**; ❌ under grace (dokumentert beslutning, se under) |
| **PDF-tilgang ved slutt** | ✅ **begge i 24 timer (D, nytt)** | ✅ **begge i 24 timer (D, nytt)** |

### Hva som er RIKTIG (bekreftet)

1. **Alle store livshendelser er symmetriske** — begge parter får epost ved match, og ved begge sluttutfall som gjelder paret.
2. **Triggere står i riktig prosess** — velkomst i det faktiske onboarding-fullføringspunktet, match-epost i matcherunden, reiseslutt-epost i `endJourney` (én funksjon = én kilde for slette- og epost-logikk; ingen rute kan «glemme» eposten).
3. **Epost blokkerer aldri forretningsflyet** — best-effort overalt; selv ved serverless-kontekst-kill venter man på sendingen.
4. **Per-mottaker logging** — en feil epost (feil adresse i DB, Resend-nedstenging, spamfilter) er synlig i Vercel-loggen på under ett minutt.
5. **GDPR-riktighet** — slettebekreftelse sendes; partner-eposter avslører aldri identitet («en reise er avsluttet», uten navn og rolle).
6. **PDF-asymmetrien er løst (D)** — før: kun initiativet kunne laste ned PDF i én gest før umiddelbar sletting, og partneren mistet tilgangen. Nå: begge har 24 timer; venterommet viser fullførts-tilstand med PDF-knapp til begge; `cron/journey` sletter alt (innhold, bilder, match, kontoer) når fristen passerer.

### Kjedebildet for «Vi fant hverandre» (etter D)

```
Bruker A trykker «Vi fant hverandre» + bekrefter + laster ned sin PDF
  → /api/journey/exit (found_each_other)
  → endJourney: match → status 'ended', expiresAt = +24 t
                samtale + meldinger + bilder BEHOLDES
                begge brukere → journeyState COMPLETED
                begge får «Gratulerer — reisen er fullført» (med 24 t-info)
  → A ser takkeside (PDF igjen + «Slett kontoen min»)
  → B logger inn → dashboard → venterommet viser «Reisen er fullført 🎉»
    → B laster ned PDF-en (samme innhold) + kan slette kontoen
  → Etter 24 t: cron/journey sletter innhold, bildeobjekter, match og
    begge kontoer (om de fortsatt finnes)
  → Sletter A kontoen før fristen: det delte innholdet forsvinner (GDPR),
    B resettes til IDLE og kan starte ny reise
```

### Åpne punkter / resterende risiko (ærlig)

| # | Punkt | Vurdering |
|---|---|---|
| R1 | **Ingen epost-verifisering** | En feilstavt adresse under registrering gir en bruker som mister all kontakt (velkomst-eposten går i det tomme). Miltøy i dag: admin kan sjekke i admin-panelet; velkomst-eposten er første signal. Anbefaling: verifiseringslenke (én epost) før lansering. |
| R2 | **DMARC mangler (G-08)** | SPF+DKIM er satt, men uten DMARC kan Gmail fortsatt filtrere aggressivt. Start på `p=none`, oppgrader til `p=quarantine` etter 2 uker rent postvolum. |
| R3 | **Ingen retry / kø** | Resend-tilfelle → eposten er borte (logget). Akseptabelt i beta-skala (Resend har 2 000 epost/dag). Ved skaleringsbehov: resend-queue i DB eller tredjepart (Postmark/SES). |
| R4 | **Død rute: `/api/onboarding/complete`** | Har ingen kallere lenger (velkomst-eposten lever i `profile/setup`). Anbefales slettet for å unngå at noen kobler til den i fremtiden. |
| R5 | **Kontosletting under grace** | Hver part har likt 24-timers vindu, men den som sletter først ødelegger partnerens PDF. Dokumentert beslutning (GDPR krever at delte data går med kontoen). Alternativ «behold partner-kopi» krever databasemessig separasjon av delte data — koster mer enn det verdt i beta. |

## 4. Diagnose-runbook (når en epost ikke kommer)

1. **Vercel → Functions** → finn funksjonen (matching-cron / profile-setup / journey-exit) → søk `[sendEmail] to <adresse>`.
   - `sendt` → levert til Resend. Da er problemet **mottaker-siden**: spam-mappe, feil adresse, eller DMARC/rater.
   - `FEILET: <årsak>` → Resend/SMTP-feil. Årsaken står i loggen (f.eks. `550`, `authentication failed`, `domain not verified`).
   - **Ingen logglinje** → epost-funksjonen ble aldri kalt (logikkfeil i trigger, f.eks. feil flagg-overgang) — se tabellen i §2.
2. **Sjekk adressen i DB** — feilstavt epost under registrering (R1) gir en «sendt»-epost som aldri leveres.
3. **Sjekk Resend-dashboardet** — delivered/bounced/rejected per epost; bounced-adresser bør få kontoen deaktivert.
4. **Testscenario (kjørt 10.11):** to kontoer (Gmail + Yahoo) → velkomst til begge → manuell matching via admin → match-epost til begge → en avslutter → slutt-epost til begge. Alt mottatt.