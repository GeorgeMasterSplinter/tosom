# TOSOM — ÅPEN BETA-TEST v1.0

**Status:** Plan — godkjent, ikke gjennomført
**Opprettet:** 2026-08-23
**Commit ved skriving:** `1292096`
**Eier:** George
**Gjelder til:** Vipps-innlogging og betaling er på plass

---

## §1 Formål

Slippe ekte mennesker inn på tosom.no for å stresstest hele plattformen — gratis, uten friksjon, uten invitasjonsport.

Testerne skal:

- trykke på alt
- prøve å knekke systemet
- teste rapportering, blokkering og å avslutte reisen tidlig
- sende tilbakemelding til **support@tosom.no**

All data skal være ekte. Ingen mock, ingen seeding i produksjon. Vi vil se hvordan systemet faktisk oppfører seg.

**Rekruttering:** George sier fra til dem han ønsker. De går til tosom.no og lager konto selv.

---

## §2 Nåsituasjon

### Dette virker allerede

| Funksjon | Kilde | Merknad |
|---|---|---|
| E-post + passord med auto-registrering | `lib/auth/config.ts` | Ukjent e-post → konto og profil opprettes automatisk |
| Ingen betalingsgate | `config/features.ts` | `PAYMENTS_ENABLED` er tvunget `false` |
| Admin ser registrerte e-poster | `app/admin/(panel)/users/page.tsx` | Ekte Prisma-data, e-post + dato + slett |
| Ubegrenset antall testkontoer | `lib/auth/config.ts` | Hver ny e-post gir ny konto |
| Rapportere, blokkere, avslutte tidlig | API + UI | Implementert og koblet |

Innloggingen du ber om er med andre ord allerede bygget. `lib/auth/config.ts` sier det selv i filheaderen:

> *Midlertidig auth for beta-test: epost + passord (CredentialsProvider). Auto-registrering: ny epost → konto lages automatisk.*

### Dette blokkerer

| # | Problem | Konsekvens |
|---|---|---|
| 1 | Landingsside og `/register` har hoved-CTA `href="/api/auth/vipps"` — ruten finnes ikke | **404.** Sender vi folk til tosom.no i dag, treffer de en vegg |
| 2 | Matching-cron kjører kun lørdag 02:00 UTC | Kan ikke teste matching før helgen |
| 3 | `vercel.json` har 3 cron-oppføringer, Vercel Hobby tillater 2 | Tredje kan bli avvist ved deploy |
| 4 | Ingen e-post kan sendes (se §6) | Ingen driftsvarsler, ingen match-varsel |

I `app/api/auth/` finnes bare `vipps/authorize/` og `vipps/callback/`. Ruten `/api/auth/vipps` finnes ikke.

---

## §3 Tilgangsmodell

**Ingen beta-koder. Ingen whitelist. Ingen invitasjonsport.**

Én dør: `/login`. Skriv e-post og passord — kontoen lages.

**Begrunnelse:** hele dette laget rives når Vipps-innlogging og betaling kommer. Å bygge en invitasjonsport nå er å bygge noe vi skal slette. Med et titalls inviterte som får lenken direkte, er en kode ren friksjon.

*Til orientering:* det finnes allerede en `BetaInvite`-tabell i `prisma/schema.prisma` og en side på `/admin/invites`. Den er ikke koblet til `User` og brukes ikke. Vi lar den ligge urørt.

---

## §4 Avvik fra invarianter

### I-4 — «Ingen push/e-post/SMS ved match»

Invarianten står i `TOSOM-SUPER-MASTERPLAN-v1.0.md`, `ACT-PIPELINE-v1.0.md` og `BETA-ACCESS-PLAN-v1.0.md`, og er kodet i `app/api/cron/matching/route.ts` linje 9. Tanken er at matchen skal oppdages av eget initiativ — ikke dyttes på folk. Derfor opprettes en `Notification`-rad, men ingenting sendes ut.

**Beta er designet for å teste nettopp denne hypotesen.** Fra `docs/archive/act-instruks`:

> | **Andel som oppdager matchen innen 24 t / 48 t** | **Validerer invariant I-4** |

**Spenningen:** med få testere over 30 dager er risikoen at folk aldri kommer tilbake. Da tester vi ikke reisen i det hele tatt — bare onboarding.

**Beslutning:** match-e-post bygges, men bak flagget `BETA_MATCH_EMAIL`.

| Fase | Flagg | Hva vi får |
|---|---|---|
| Første matcherunde | `false` (standard) | Måler hvor mange som oppdager matchen selv innen 24/48 t. Dette er I-4-dataen — den kan ikke hentes inn igjen senere |
| Resten av testen | `true` | Reisen blir faktisk gjennomført, så vi får data på dag 7/15/30 |

Invarianten står urørt i koden. Avviket er eksplisitt, flagget, og har en av-bryter. Ett miljøvariabel-bytte, ingen ny deploy.

---

## §5 Faser

### B-1 — Åpne døra

**Formål:** fjerne 404-veggen. Én vei inn.

**Filer:**
- `app/(landing)/page.tsx` — CTA `/api/auth/vipps` → `/login`
- `app/register/page.tsx` — redirect til `/login` (siden selger Vipps som ikke finnes)
- `app/(auth)/onboarding/start/page.tsx` — redirect til `/login` i stedet for `/register`
- `app/login/page.tsx` — legg til kort infotekst

**Infotekst på `/login`** — kort og rolig, i ToSom-tone:
- Tosom er i åpen test. Gratis.
- Vi stresstester systemet. Trykk på alt, prøv å knekke det.
- Test gjerne å rapportere, blokkere og avslutte reisen tidlig.
- Tilbakemelding: **support@tosom.no**
- Tosom er for voksne over 21 år.

**Verifisering:** gå til tosom.no, trykk hoved-CTA, kom til `/login`, lag konto med ny e-post, havn i onboarding.

---

### B-2 — E-post virker

**Formål:** rette rørleggingen (se §6) og gjøre match-varsel mulig.

**Filer:**
- `lib/email/` — ny modul som leser `EMAIL_SERVER_*` og sender via Resend
- `lib/observability/alert.ts` — koble til modulen så driftsvarsler faktisk kommer fram
- `app/api/cron/matching/route.ts` — match-e-post bak `BETA_MATCH_EMAIL`
- `.env.example` og `.env.prod` — rette avsenderadresse

**Avsender:** `noreplay@tosom.no` (autosvar er satt opp på denne).

**Verifisering:** trigg en alert, se at e-post kommer fram. Sett `BETA_MATCH_EMAIL=true`, kjør matching manuelt, se at begge parter får varsel.

---

### B-3 — Manuell matching

**Formål:** kunne trigge matching når som helst, i stedet for å vente til lørdag natt.

**Filer:**
- `app/admin/(panel)/tools/page.tsx` — aktivere knappen «Kjør cron manuelt», som allerede står klar men deaktivert
- ny admin-API-rute som trigger matching
- `vercel.json` — fjerne tredje cron-oppføring (Hobby tåler 2)

**Verifisering:** to testkontoer i kø → trykk knappen → begge blir `MATCHED` og får conversation.

---

### B-4 — Admin som SaaS-flate

**Formål:** se hvor folk faller av.

`/admin/users` viser i dag kun e-post og dato. Men `app/api/admin/users/route.ts` returnerer allerede `verified`, `onboardingStep`, `onboardingComplete`, `journeyState`, `bannedAt` og `deletedAt` — uten at UI bruker dem.

**Filer:**
- `app/admin/(panel)/users/page.tsx` — ta i bruk feltene API-et allerede sender

**Verifisering:** siden viser e-post, registreringsdato, onboarding-steg og journey-status per bruker.

---

### B-5 — Rette dokumentene

**Formål:** `ACT-STATE.json` skal speile virkeligheten.

Den peker i dag på commit `d1cae09` (HEAD er `1292096`), sier `"currentPhaseId": "beta-klar-alle-runder-ferdig"`, og nevner ikke at innloggingen er byttet til e-post + passord. Blokkeren «B-2 Vipps død kode» står som `closed`, men de døde CTA-ene lever fortsatt.

**Filer:**
- `docs/ACT-STATE.json` — oppdatere commit, fase, blokkere
- `docs/README.md` — lenke til dette dokumentet

---

## §6 E-postoppsett

### Feilen som må rettes

To usammenhengende sett med miljøvariabler:

| Sted | Variabelnavn | Lest av kode? |
|---|---|---|
| `.env.prod`, `.env.example` | `EMAIL_SERVER_HOST/PORT/USER/PASSWORD`, `EMAIL_FROM` | **Nei — leses aldri** |
| `lib/observability/alert.ts` | `SMTP_HOST/PORT/USER/PASS`, `ALERT_EMAIL_TO` | Ja, men finnes ikke i noen env-fil |

**Konsekvens:** `sendEmail()` returnerer alltid `false`, og `sendAlert()` faller gjennom til Sentry. Ingen e-post har noen gang blitt sendt fra Tosom.

Resend-oppsettet er riktig konfigurert i `.env.prod` — det er bare ikke koblet til noe.

### Målbilde

- Én modul: `lib/email/`
- Leser `EMAIL_SERVER_*` (de som allerede står i env-filene)
- Avsender: `noreplay@tosom.no`
- Support: `support@tosom.no` med videresending til privat

### E-poster i beta

| E-post | Når | Flagg |
|---|---|---|
| Driftsvarsel til operatør | `sendAlert()` ved kritiske hendelser | Alltid på |
| «Du har fått en kobling» | Etter matcherunde | `BETA_MATCH_EMAIL` |

Ingen velkomst-e-post. Ingen e-postverifisering. Bevisst.

### Sikkerhet

`.env.prod` er **ikke** sporet i git — verifisert. Resend-nøkkelen ligger kun lokalt og i Vercel.

---

## §7 Slik tester du

**Lag alltid partall brukere.** `MIN_COHORT_SIZE = 2` i `config/matching.ts`. Med én i kø utsettes runden.

**Onboarding er ikke nok.** Brukeren må aktivt stille seg i kø via `/api/journey/queue`, som krever `onboardingComplete: true`.

**Krav for å komme i kø:**
- `onboardingComplete === true`
- `journeyState === 'IDLE'`
- ikke banned, ikke slettet

**Krav for å faktisk bli matchet:**
- minst 2 i kø
- ingen dealbreakers mellom paret
- score over `MIN_SCORE` (40 av 100)
- ikke på sperreliste fra tidligere match eller blokkering

**Trigge matching:** `/admin/tools` → «Kjør cron manuelt» (etter B-3).

---

## §8 Hva vi måler

| Metrikk | Hvorfor |
|---|---|
| Onboarding-frafall per steg | Hvor mister vi folk? |
| **Oppdaget match innen 24 t / 48 t** | **Validerer invariant I-4** |
| Tid fra kobling til dag 1 | Måler «begge har vært innom» |
| Nådd dag 7 / 15 / 30 | Holder reisen folk engasjert? |
| Antall rapporter og blokkeringer | Virker trygghetsmekanismene? |
| Antall som avslutter tidlig | Og hvorfor |
| Feil i `SystemLog` | Hva knekker under ekte bruk? |

Kilder: `/admin/users`, `/admin/analytics`, `/admin/logs`, `SystemLog`, og tilbakemeldinger til support@tosom.no.

---

## §9 Bevisst utsatt

Dette bygger vi **ikke** nå:

- **Vipps-innlogging** — kommer, erstatter e-post + passord helt
- **Betaling** — `PAYMENTS_ENABLED` forblir `false`
- **E-postverifisering** — friksjon uten verdi i en stresstest
- **Beta-koder, whitelist, invitasjonsport** — rives uansett
- **Velkomst-e-post** — ikke nødvendig
- **Passord-gjenoppretting** — testerne kan lage ny konto

---

## §10 Før første tester slippes inn

Manuell sjekkliste — ingen kode:

- [ ] `AUTH_SECRET` / `NEXTAUTH_SECRET` satt i Vercel
- [ ] `DATABASE_URL` peker på riktig produksjonsdatabase
- [ ] `CRON_SECRET` satt
- [ ] `EMAIL_SERVER_*` satt i Vercel med Resend-nøkkel
- [ ] `BETA_MATCH_EMAIL` **ikke satt** (av som standard første runde)
- [ ] `MAINTENANCE_MODE` er **av** — ellers redirecter middleware alt til `/maintenance`
- [ ] `DEV_LOGIN_ENABLED` er **ikke** `true` i produksjon
- [ ] Admin-passord satt, og `/admin/login` fungerer
- [ ] support@tosom.no videresender til privat
- [ ] noreplay@tosom.no har autosvar

---

## §11 Invarianter som fortsatt gjelder

Alt annet i `ACT-PIPELINE-v1.0.md` står urørt:

- Én match per bruker, ingen valg mellom flere
- Ingen feed, ingen swipe, ingen gamification
- Ingen AI-chat, AI-coach eller AI-partner
- Reisen er 30 dager, fire faser
- Ingen bilder før dag 15
- Dag 1 starter når begge har vært innom

**Eneste dokumenterte avvik i denne planen er I-4, og det er flagget.**

---

*Dette dokumentet er normativt for beta-perioden. Koden vinner alltid over dokumentasjonen — finner du avvik, rapporter det.*
