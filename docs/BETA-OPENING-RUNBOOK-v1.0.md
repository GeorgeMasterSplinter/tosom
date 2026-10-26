# ToSom — Beta-Opening Runbook (v1.0)

- **Type:** Operativ gate — limited invite-only free beta (IKKE public/paid/marketing)
- **Dato:** 26.10.2026
- **Production SHA:** `0abac74` (CI `40256930394` + CD `40258679577` grønn; E2E grønn)
- **Verdict (Final Free-Beta Audit):** GO — LIMITED FREE BETA (0 P0)
- **Kodeendring denne ACT-en:** Kun **BetaInvite-gate** i register (§3). Alt annet FROZEN.
- **Reelle brukere invitert:** **NEI** (George tar den eksplisitte beslutningen etter denne rapporten)

---

## 1. Pre-flight (state)

| Sjekk | Verdi |
|---|---|
| Branch / HEAD | `main` @ `0abac74` = `origin/main` |
| Repo status | 3 modifiserte (invite gate: `config/features.ts`, `app/api/auth/register/route.ts`, `login-rate-limit.test.ts`) + 1 ny test (`beta-invite-gate.test.ts`) + nye docs (audit, runbook, legal). Ingen annen kode. |
| Prod health | `https://www.tosom.no/api/system/health` = **200** |
| CI / CD | `40256930394` (CI) + `40258679577` (CD) for `0abac74` — **success** |
| Uptime-monitor | Ping `/api/system/health` hvert 5. min |

## 2. Product freeze (frozen for this ACT)

- **JOURNEY:** FROZEN 7/14 (start-vindu 7, total 14)
- **PHOTO REVEAL:** FROZEN DAY 8 (server-håndhevet)
- **MATCHING:** FROZEN (MIN_SCORE 40, MIN_COHORT 2, 10 hard dealbreakers, deterministisk, ingen AI)
- **PERSONALITY V2:** FROZEN (egne spørsmål, `2026-10-24.v2`)
- **FREE QUOTA:** FROZEN 5 000 persons (atomisk claim/rollback)
- **PAYMENT:** OFF (`PAYMENTS_ENABLED=false` + FATAL-vakt)
- **WEB ANALYTICS:** OFF (ingen pixels/SDK)
- **VIPPS IDENTITY:** DEFERRED (implementeres ikke nå)

## 2b. DO-NOT-BUILD (bekreftet frozen — ikke nødvendig før første limited beta)

Vipps Login · BankID · Vipps payment · refund-automatisering · advanced analytics · Speed Insights · journey v3 · matching v2 · personality v3 · vitenskapelig validering · dead-code cleanup · advanced CRM · ticketing-system · public marketing campaign.

## 3. Invite gate (ENESTE KODEENDRING)

**Status: IMPLEMENTERT + testet (BETA-01…BETA-10 grønn).**

- **Mekanism:** `app/api/auth/register/route.ts` — etter dup-sjekk, før opprettelse:
  `if (isInviteGateEnabled()) { if (!await isInvitedEmail(email)) return 403; await markInviteUsed(email); }`
- **Flagg:** `BETA_INVITE_GATE` (default **PÅ**; leses LIVE fra env → `isInviteGateEnabled()` i `config/features.ts`). Nødsituasjon: sett `BETA_INVITE_GATE=false` i Vercel (ingen deploy).
- **Reuse-eksisterende funksjoner:** `isInvitedEmail` + `markInviteUsed` + `normalizeEmail` i `lib/beta/invites.ts` (lowercase/trim, server-side). Ingen ny arkitektur.
- **Eksisterende kontoer:** Upåvirket — dup-sjekk (`user.findUnique`) går FØR gaten; eksisterende brukere får `ok:true` uansett invite-status.
- **Én konto per adresse:** dup-sjekk blokkerer 2. konto for samme e-post; `usedAt` er admin-bokføring (ikke enforcement).
- **Anti-enumeration:** 403-svaret er generic («Registrering skjer kun via invitasjon.»), ekko IKKE e-posten, og rate-limits (5/IP/time) er fortsatt først. Registrerte e-poster avsløres ikke (uendret `ok:true`).
- **Admin/test:** Eksisterende admin/test-kontoer er uendret. **Nye** admin/test-e-poster må legges i invite-listen (se nedenfor) dersom de skal registrere via ruten.
- **Slik legger du inn inviterte e-poster (admin):** `POST /api/beta/invites` med `{ "emails": ["a@b.no", ...], "note" }` (bak admin-auth; idempotent, lowercases). Se `app/api/beta/invites/route.ts`.

**Tests:** `__tests__/beta-invite-gate.test.ts` (BETA-01…10). Full suite: verify/lint/build grønn (bekreftet i Final Free-Beta Audit-rapport).

## 4. Test/demo accounts (READ-ONLY inventory)

**Kjente test/demo-kontoer i kode:** `astrid@tosom.no` (Astrid, test-user-1) + `magnus@tosom.no` (Magnus, test-user-2) i `lib/auth/test-users.ts`; demo-modus er client-side. (George-admin regnes som operatør, ikke testreise.)

**Inventar (George kjører READ-ONLY i prod/admin — ingen mutasjon her):**

```sql
-- 1) Test/demo-brukere (kun @tosom.no) — antall + state (ingen PII utover e-post)
SELECT email, "journeyState", "createdAt" FROM "User"
 WHERE email LIKE '%@tosom.no' ORDER BY "createdAt";
-- 2) Aktive testreiser
SELECT "userId", "day", "phase", "startedAt", "endedAt" FROM "JourneyProgress"
 WHERE "userId" IN (SELECT "id" FROM "User" WHERE email LIKE '%@tosom.no');
-- 3) Kø/state for disse
SELECT email, "journeyState" FROM "User" WHERE email LIKE '%@tosom.no';
-- 4) Match-state
SELECT m."status", m."score", m."createdAt" FROM "Match" m
 JOIN "User" ua ON ua."id"=m."userAId" JOIN "User" ub ON ub."id"=m."userBId"
 WHERE ua.email LIKE '%@tosom.no' OR ub.email LIKE '%@tosom.no';
-- 5) Free-quota forbruk (admin overview / Quota-tabell)
SELECT COUNT(*) FROM "Quota";
```
(Alternativt: admin‑panel → overview/users/journeys/matches gir samme tall visuelt.)

**Cleanup-anbefaling: B — behold, men ekskluder fra ekte matching.**
Nullstill testreisene til `IDLE` (eller la dem stå ut av køen) og sikr at de IKKE er `QUEUED`/`ON_JOURNEY` ved den første ekte lørdag, slik at demo-match ikke treff på ekte beta-brukere. Hold `astrid`/`magnus` tilgjengelig som smoke-test. **IKKE** muter prod før George bekrefter innen denne ACT-en. IKKE identifiser testkontoer ved å gjette navn — bruk e-post/`@tosom.no`.
## 5. Backup — status **PARTIAL**

- **Prod‑DB:** Managed PostgreSQL via `DATABASE_URL` (required i prod; app er helse 200 ⇒ til stede).
- **Mekanisme + docs:** `deploy/backup.md` — daglig `pg_dump` 03:00 CET (7 dgr retention), ukentlig full 02:00 søn (30 dgr), restore-prosess (7 steg) + DR-plan. Skripts: `scripts/backup/dbBackup.sh`, `dbRestore.sh`, `scripts/db/backup.ts`.
- **Mangler / å verifiser:** (1) Prod-backup-kavitet er IKKE uavhengig verifisert fra her; (2) **B5.7 gjenopprettingstest (obligatorisk før beta) er IKKE dokumentert som gjennomført**; (3) repo-fil `backups/tosom-backup-2026-08-11...sql` er gammel; (4) `deploy/backup.md` beskriver en VPS/`prod-server`-modell som kan avvike fra den faktiske Vercel+managed-DB-deployen.
- **Alvorlighetsgrad:** P1 før BREDERE beta. For et svært lite invitasjons-beta (håndfull brukere, lite data) er risikoen lav og akseptabel inntil bekreftet.
- **Handling før utvidelse:** Bekreft at managed-DB-leverandørens auto-backup kjører, og gjennomfør + dokumenter en B5.7-gjenopprettingstest (RTO < 30 min).

## 6. Sentry — status **PARTIAL / UNKNOWN (DSN)**

- **SENTRY_DSN:** **UNKNOWN** (valgfri; tom i local env; app kjører likevel). Verifiser at den er satt i Vercel.
- **SENTRY CLIENT:** ACTIVE (kode) — `withSentryConfig` i `next.config.js`; sender kun data hvis DSN satt.
- **SENTRY SERVER:** ACTIVE (kode) — samme wrapper; sender kun data hvis DSN satt.
- **sendDefaultPii:** **false** (`sentryPiiConfig` i `lib/observability/pii`).
- **PII SCRUBBING:** **ACTIVE** — `scrubPiiEvent` fjerner `profile`/`deepProfile`/`content`/`email`/`phone` og redigerer e-post/telefon i meldinger/exceptions/breadcrumbs (test `sentry-pii-scrub-s16` grønn).
- **Handling:** Bekreft DSN satt i Vercel + at Sentry DPA/SCC er på plass (lov, se legal-package).

## 7. Email — status **READY**

- **Transport:** Resend SMTP (`EMAIL_SERVER_HOST/USER/PASSWORD` required i prod ⇒ til stede); `lib/email/index.ts` (nodemailer, lazy init, kaster aldri).
- **Avsender:** `noreplay@tosom.no` (autosvar oppsat). **Support:** `support@tosom.no`.
- **E-poster:** driftsvarsel (alltid), match (AV via `BETA_MATCH_EMAIL`, invariant I-4), velkomst (fullfør onboarding), reise-slutt (dag 14), passord-reset, sletting-bekreftelse.
- **E-post-verifisering:** IKKE implementert (bevisst) ⇒ **P1 BEFORE WIDER BETA**. For første håndplukkede kohort kontrollerer George adressene i invite-listen.
- **Handling (valgfritt, sikker):** En kontrollert test-e-post til George kan sendes (eksisterende mekanisme) — ikke bulk.

## 8. R2 / image storage — status **READY**

- **Config:** `R2_ACCOUNT_ID/ACCESS_KEY_ID/SECRET_ACCESS_KEY/BUCKET` required i prod ⇒ til stede (app helse 200).
- **Writes:** Kun via authet route (`/api/chat/image`); **reads:** signert URL; **ikke public bucket**; **deletion** + **journey-end cleanup** (GDPR) finnes (bekreftet i audit).
- **Handling:** Ingen. (Ikke upload random prod-bilder uten etablert smoke-prosess.)

## 9. Pusher / realtime — status **READY (CONFIGURED)**

- **Config:** `PUSHER_APP_ID/KEY/SECRET` required i prod ⇒ til stede.
- **Chat realtime:** Forventet via Pusher (private channel, authet).
- **Fallback:** Dersom Pusher er nede degrades chat til manuell refresh (blokkerer ikke sending/lesing utover en kort forsinkelse). Ingen realtime-redesign i denne ACT-en.

## 10. Crons — status **READY**

- **MATCHING:** `0 2,3,4 * * 6` ⇒ natt til lørdag (bekreftet).
- **JOURNEY:** `5 0 * * *` ⇒ daglig (bekreftet; progression + fullføring dag 14).
- Ingen duplicate/obsolete 30-dagers-cron (kun disse to i `vercel.json`). Begge secret-authet + kill-switch (`MATCHING_ENABLED`).
- **Handling:** Ingen. (Ikke trigger cron manuelt.)

## 11. Admin — emergency runbook (eksisterende, ingen ny kode)

**Inngang:** Admin-panel (admin‑auth). Alle handlinger under er eksisterende funksjoner.

| Handle | Admin‑handling (eksisterende endpoint/panel) |
|---|---|
| Se alle brukere/ko | `overview` / `users` (state = `IDLE`/`QUEUED`/`MATCHED`/`ON_JOURNEY`/`COMPLETED`) |
| Se matcher | `matches` (status `active`/`ended`/`expired`) |
| Se reiser | `journeys` / `journey-stats` (day 0–14, fase) |
| Se samtaler | `conversations` / `conversation` |
| Ban/block user | `users/[id]` → set `bannedAt` (stenger innlogging + matching) |
| Stuck journey | `journeys` → reset / next / complete (nullstill `nextDayAt`/`day`) |
| Se reports | `report` (admin review) |
| Kill‑switch matching | `MATCHING_ENABLED=false` (Vercel env) |
| Logg | `system-logs` / `observability` |

**Prinsipp:** Først stopp skade (ban/de‑queue), deretter diagnostikk (logg/observability), deretter kommunikasjon. Ingen DB‑mutasjon utenfor admin‑panel/endpoint.

## 12. Safety runbook (A–G)

For hvert scenario: **HVA / ADMIN‑AKSJON / KOMMUNIKASJON / ESKALERING.**

**A. Voldtak/utnytting/trusler i chatten**
- HVA: Bruker melder om trusler/stalking/utnytting fra en match.
- ADMIN‑AKSJON: Ban senderen (`users/[id]` → `bannedAt`), avbryt match (`matches` → `ended`), bevar samtale‑logg som bevis (IKKE slett).
- KOMMUNIKASJON: Bekreft handling til den som meldte (support@tosom.no), rolig og konkret.
- ESKALERING: Trusler/stalking → **politiet (112/112.no)** dersom akutt, og advokaten.

**B. Selvskading / krisesignal i meldinger**
- HVA: Bruker uttrykker selvskadende tankelag eller akutt krise.
- ADMIN‑AKSJON: Ingen auto‑handling. Sikre at kontaktinformasjon til **SOS‑barne‑/ung / 116 123** og **113** fremgår.
- KOMMUNIKASJON: Personlig, varmt svar (support@ / tlf 92 64 22 23); formidl 113‑numre; ikke gi helse‑/terapi‑rådgivning.
- ESKALERING: Akutt livsfare → **113** umiddelbart.

**C. Mindreårige / feil alder**
- HVA: Mistanke om at en bruker er under 21 (eller under 18).
- ADMIN‑AKSJON: Stopp matching for kontoen, bevisstgjør sletting (GDPR) dersom bekreftet.
- KOMMUNIKASJON: Bekreft alderskravet (21+); erklær sletting.
- ESKALERING: Mindreårig i en dating‑kontekst → advokat + vurder politianmeldelse.

**D. Datalekk / mistenkt PII‑eksponering**
- HVA: Bruker melder at de ser andres PII, eller Sentry/R2‑feil kan ha lekket data.
- ADMIN‑AKSJON: Stopp den berørte fløten (kill‑switch), verifiser PII‑scrubbing (`scrubPiiEvent`) og signerte R2‑URLs, tilbakekall signerte tokens om nødvendig.
- KOMMUNIKASJON: Internt til George + advokat; utover kun dersom personopplysninger faktisk lekket (pliktig varsling, se legal‑package).
- ESKALERING: Bekreftet personopplysningsinnbrudd → **Dataverntilsynet (varsling)** + advokat.

**E. Stuck journey / teknisk blokkering**
- HVA: Reise står fast (day går ikke frem, `nextDayAt` feil, UI‑feil).
- ADMIN‑AKSJON: `journeys` → reset/next/complete; sjekk `system-logs` + `observability`.
- KOMMUNIKASJON: Informer brukeren om at reisen er satt på rett spor; be om skjermstøtte dersom behov.
- ESKALERING: Repeterende feil → logg som bug (repo), ikke «fix» i prod uten deploy.

**F. Kvote/«betaling»‑misforståelse**
- HVA: Bruker mener de ble belastet eller at kvote er feil.
- ADMIN‑AKSJON: Sjekk `Quota` (free 5 000) + `overview`; betalinger er AV (`PAYMENTS_ENABLED=false`) — ingen fakturering.
- KOMMUNIKASJON: Forklar at beta er gratis og at ingen betaling skjer.
- ESKALERING: Ingen (med mindre faktisk misbruk av kvote).

**G. Utgang / nedetid**
- HVA: Health‑endpoint feiler, uptime‑monitor alert, eller API‑feil.
- ADMIN‑AKSJON: Sjekk `api/system/health`, `system-logs`, Vercel‑dashboard; vurder rollback til sist kjente gode SHA.
- KOMMUNIKASJON: Kun intern til George; ingen publikums‑kommunikasjon før årsak er kjent.
- ESKALERING: Langvarig utgang → dokumenter tidslinje for postmortem.

## 13. Support
- **E‑post:** support@tosom.no · **Telefon:** 92 64 22 23 (direkte, George).
- Brukeren vet hvor de kan henvende seg (avsløring i `config/legal.ts`, COMPANY kontakt).
- For første limited beta: George eier support (e‑post + tlf) direkte.

## 14. Første kohort (ANBEFALING — ikke faktum)

**Anbefalt startstørrelse: 6–10 håndplukkede brukere** (gulv 4, tak ~12).
- **Hvorfor:** Matching krever `MIN_COHORT=2` per kohort og danner par under strenge hard‑dealbreakers (kjønn, alder, radius, livssyn, livsstil). For at RUNDE 1 skal gi minst 1–2 ekte par, trengs en liten gruppe som er **kompatible med hverandre**.
- **Kriterier:** Alle 21+, kjente/anbefalte, bevisst på at det er beta; balansert kjønnsfordeling; innenfor kompatibel radius; kompatible på hard‑dealbreakers (livssyn/barn/livsstil/alder).
- **Merk:** Anbefaling basert på matching‑konfig i repo; faktisk matchkapasitet kan ikke verifiseres fra her. George justerer opp/ned.
- **Tidspunkt:** Alle fullfører onboarding FØR den første lørdag 02:00–04:00 (matching‑cron).

## 15. Invite copy (draft)

```
Hei [Første-navn]!

Jeg åpner nå en svært begrenset, gratis beta av ToSom. Det er kun en håndfull plasser, og jeg sender invitasjonen til noen jeg kjenner og stoler på.

Hva ToSom er: en 14-dagers "reise" der du gradvis blir kjent med én person – med fokus på god samtale og trygghet, ikke raskt "swiping". Kun invitasjonskoder, så det er trygt og begrenset.

Hva jeg trenger av deg:
- Være 21+ og ærlig i profilene
- Fullføre onboarding (ca. 15–20 min)
- Prøve kjernen: matching → reise → chat
- Gi ærlig tilbakemelding (jeg sender et kort spørreskjema)
- Være tålmodig: dette er en beta – det kan være bugs

Ingen betaling, ingen VIPPS, ingen public lansering. Alt er fortrolig.

Invitasjonskoden din: [KODE]
Tilbake: support@tosom.no / 92 64 22 23

– George
```

## 16. Feedback (10 spørsmål)

1. Hva var det første du syntes var morsomt/positivt?
2. Hva var det vanskeligste/mest irriterende?
3. Følte du at matchingen passet det du ville? (match-kvalitet)
4. Hvordan var tempoet på reisen (7/14 dager)? For raskt/langsommelt?
5. Var dag 8 (bilde-avsløring) spennende eller overraskende?
6. Følte du at chatten var trygg? (plaging/rapport?)
7. Ville du anbefale ToSom til en venn? (0–10)
8. Hva manglet du som du forventet?
9. Er det noe du følte var personlig/krenkende (livssyn/bilde)?
10. Vil du bli med videre (og gjerne ha en betalingsplan når den kommer)?

## 17. Daglig observasjon (checklist)

- [ ] Health endpoint 200 (uptime-monitor ingen red)
- [ ] Sentry: nye error/alert (DSN må være satt)
- [ ] Matching-cron: kjørte lørdag 02–04 (logg/observability), ingen feil
- [ ] Journey-cron: kjørte daglig 00:05, nextDayAt oppdatert
- [ ] Stuck journeys: ingen reiser fast > 24h (journeys panel)
- [ ] Queue state: QUEUED/MATCHED/ON_JOURNEY tall rimelige
- [ ] Match quality: nye matcher ser ut som gode match (score, dealbreakers)
- [ ] Free quota: forbruk innenfor 5000/bruker, ingen negative/feil
- [ ] Complaints/reports: nye reports? Håndterte?
- [ ] Support: alle support-meldinger besvart (support@/tlf)
- [ ] Ingen nye brukere uten invite-kode (gate holdt)

## 18. Første lørdag (checklist)

**FØR (fredag kveld):**
- [ ] Alle inviterte har fullført onboarding (state != IDLE)
- [ ] Test/demo (astrid/magnus) er IDLE / ut av køen
- [ ] BETA_INVITE_GATE = ON (bekreft)
- [ ] MATCHING_ENABLED = true
- [ ] Sentry DSN satt (om mulig)
- [ ] Backup: siste daglig backup OK (dersom verifisert)

**ETTER (søndag formiddag):**
- [ ] Matching-cron kjørte (logg 02–04)
- [ ] Nye matcher dannet (matches panel, status active)
- [ ] Ingen 4xx/5xx-spike (Sentry/observability)
- [ ] Match-email: IKKE sendt (BETA_MATCH_EMAIL off) – bekreft ingen uønskede emails
- [ ] Dokumentér antall matcher + kvalitet

## 19. Day 8 (foto-avsløring)

- [ ] Reise går frem (day 8 nådd, fase riktig)
- [ ] Foto-avsløring server-håndhevet (bilde vises dag 8, ikke før)
- [ ] R2 signert URL fungerer (bilde lastes)
- [ ] Ingen PII-lekk i feil/Sentry

## 20. Day 14 (fullføring)

- [ ] Reise fullføres dag 14 (endedAt satt, state COMPLETED)
- [ ] Reise-slutt-email sendt (dag 14)
- [ ] Match → ended, cleanup (GDPR) kjører
- [ ] Ingen stuck/expire feil
- [ ] Samle tilbakemelding fra par

## 21. Verdict / neste steg

- **REELLE BRUKERE INVITERTE: NEI** (George tar den eksplisitte beslutningen etter denne rapporten).
- **Gates før utvidelse** (fra audit): backup B5.7 recovery-test; e-post-verifisering (P1); Sentry DSN bekreftet; art. 9 / DPIA (legal); test-account cleanup.
- Den eneste kodeendringen (invite gate) er klar + testet; alt annet frozen.
