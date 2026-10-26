# ToSom — Final Free-Beta GO/NO-GO (v1.0)

- **Type:** Read‑only / plan‑only audit (ingen kode endringer)
- **Production checkpoint (SHA):** `0abac74` (local `main` = `origin/main` = `0abac74`; live `tosom.no` serverer kopi fra denne SHA)
- **Dato:** 26.10.2026
- **Domene:** https://www.tosom.no
- **Verdict:** **GO — LIMITED FREE BETA** (0 P0‑blockere)

---

## A. Executive summary

Kjernen er ferdig og sikker nok til et **begrenset, invitasjonsbasert gratis‑beta**:
register → onboarding → kø → 14‑dagers journey → match → chat → foto‑reveal dag 8 → avslutning dag 14.
Server‑siden håndhever journey‑tilstand (foto‑lås) og matching (hard dealbreakers + MIN_SCORE), betalings­stien er av (FATAL‑vakt), ingen AI‑chat, ingen analytics/pixels, og CI/CD er grønn for den live‑SHA.

**Ingen P0‑blockere** funnet for dette begrenste skallet. P1‑punktene (ekte epost‑verifisering, teknisk invite‑gate, Vipps‑alder/identitet, CSRF‑flag, Sentry‑DSN/DPA, lovgrunnlag for livssyn, automatisk backup‑kavitet) er «før bredere beta / før betalt», ikke «før dette lille invitasjons‑beta».

**Neste gate:** LOV‑REVIEW (norsk advokat) for livssyn/special‑category‑data, retention/blocklist og gratis‑beta‑vilkår — før beta utvides.

## B. What exactly is being tested

- **Beta type:** Limited free beta — invitasjonsbasert, kun brukere invitert av George, begrenset skala (praktisk håndfull‑til‑hundredvis).
- **Who:** Kun inviterte e‑postadresser (operasjonelt kontrollert via delt lenke; teknisk invite‑gate via `BetaInvite` er til stede i epost‑verifiseringsstien, men **ikke** koblet inn i `/api/auth/register`).
- **Journey length:** 14 dager, foto‑reveal dag 8 (kanonisk config: `JOURNEY_TOTAL_DAYS=14`, `PHOTO_REVEAL_DAY=8`, `JOURNEY_START_WINDOW_DAYS=7`).
- **Matching:** Satt (lørdag cron), MIN_SCORE=40, MIN_COHORT=2, 10 hard dealbreakers, deterministisk (ingen slump/seed), ingen AI.
- **Chat + image upload:** Ja — kun deltakere, senderId fra sesjon, R2‑lagring, signert lesing, dag‑8‑lås.
- **Photo reveal dag 8:** Ja — server‑siden håndhever (`isPhotosAllowed`, 423 før dag 8).
- **Payment:** Ingen. `PAYMENTS_ENABLED=false` + FATAL‑vakt i `config/payment.ts`; `/betaling` er «start reise» (ingen checkout); 349 NOK presentert som framtidig plan, ikke aktiv.
- **Free quota:** 5 000 (`PRICING.freeUserCap`), person‑basert, atomisk claim/rollback.
- **AI:** Ingen AI i chat, ingen AI i matching.
- **Analytics/retargeting:** Ingen. `NEXT_PUBLIC_ANALYTICS_ENABLED=false`, ingen pixels funnet på live‑side (confirmert).
- **Explicitly out of scope:** Vipps Identity, betalt modus, bredere offentlig beta, AI‑chat, avansert analytics, journey v3, BFI‑10 (bortfalt).

## C. Production checkpoint

| Sjekk | Resultat |
|---|---|
| Branch / HEAD | `main` @ `0abac74` = `origin/main`; clean status (kun untracked `docs/IDENTITY-TRUST-PLAN-v1.0.md`) |
| Live SHA | `0abac74` — live serverer den korrigerte 14‑dagers‑kopi; health 200 |
| CI | `40256930394` (0abac74) **success** — 11 jobber grønn, inkl. unit/integration, **E2E Playwright**, concept‑guards, language guard, prisma validate, health |
| CD | `40258679577` (0abac74) **success** |
| Uptime | `40248258427` success; monitor pinger `/api/system/health` hvert 5. min med HTML‑alert |
| Live‑health | `https://www.tosom.no/api/system/health` = 200 |

**Status: OK — CI/CD grønn for live‑SHA, prod helse 200.**

## D. Core product flow

Registrering (CSRF + Zod + rate‑limit 5/IP/time + duplikat‑svar likt) → onboarding/verifisering (`verified:true` ved opprettelse — ingen bekreftelsesmail, se E) → onboarding‑profiler → `queue` (atomisk `claimFreeQuota`, ingen betaling) → `journey` (server‑siden låser foto til dag 8) → lørdag‑matching (advisory lock, MIN_SCORE, hard constraints) → `chat` (kun deltakere) → `journey end` (dag 14) → `endJourney`.

**Status: OK — kjernen er end‑to‑end funksjonell og idempotent. Ingen P0.**

## E. Authentication and Identity

- **Password (Credentials):** bcrypt, rate‑limit 10/email/15 min (første i login), ingen auto‑reg, ingen timing‑leak, ingen passwordless‑overtakelse.
- **Session:** JWT via NextAuth; `trustHost` + secure cookies i prod; `requireNotBanned` → 403 for bannlyste.
- **Password reset:** `/api/auth/request-reset` + `/api/auth/reset-password` til stede.
- **Test/dev login:** `/api/auth/test-login` **blokkert i prod** (NODE_ENV‑sjekk); `/dev-login` redirectet bort i middleware (prod).
- **Vipps Identity:** Implementeres **ikke** nå (dead code, `NEXT_PUBLIC_VIPPS_ENABLED=false`, `/register/vipps`=404). Selv‑rapportert 21+ + passord for begrenste beta = akseptert produkt‑risiko (dokumentert i kopi: «sjekkes senere med Vipps»).
- **CSRF:** `csrfCheck` er **no‑op** når `ENABLE_CSRF_PROTECTION` er av (repo‑default `false`). Basal vern: per‑endepunkt `pgCheck` (alltid på, ikke flagg‑styrt) + SameSite‑cookie.
- **Epost‑verifisering:** **Ikke håndhevet** (auto‑verified; ingen bekreftelsesmail). `BetaInvite`‑gate bor i epost‑verifiseringsstien, ikke i register.

**Status: OK for begrenste beta; P1: ekte epost‑verifisering + teknisk invite‑gate + `ENABLE_CSRF_PROTECTION` før bredere beta. P2: Vipps (før betalt/bredere).**

## F. Matching

- **Pipeline:** mangler‑profil → sperreliste (UserBlock) → 10 hard dealbreakers → `unifiedScore` → MIN_SCORE(40).
- **Hard constraints (10):** gender, alder, barn, høyde, livsstil, rytmik, preferanser, grenser, radius, **religion/livssyn** — religion kjøres **før** scoring og kan ikke overrides.
- **Deterministisk:** ingen shuffle/seed/random pairing (kun median‑sortering for scoring, ikke paring).
- **Ingen fysisk attraksjon / bodyType.** Personality V2 = 15 egne Tosom‑spørsmål (`INSTRUMENT_SET_VERSION 2026-10-24.v2`), ingen BFI‑10 (bortfalt).
- **Cron:** advisory lock, tidsbudsjett, kill‑switch (`MATCHING_ENABLED`), observability, ingen push/mails (I‑4).
- **Mangler‑data:** graceful (blokkerer ikke, unngår feilmatch).

**Status: OK — robust, deterministisk, server‑siden håndhever. Ingen P0.**

## G. Journey 7/14

- **Config (kanonisk):** `JOURNEY_TOTAL_DAYS=14`, `PHOTO_REVEAL_DAY=8`, `JOURNEY_START_WINDOW_DAYS=7`; 4 faser; start‑vindu 7 dager.
- **Server‑siden:** foto‑lås håndhevet server‑siden (423 før dag 8); daglig progression (cron `5 0 * * *`); lørdag‑matching (cron `0 2,3,4 * * 6`); fullføring dag 14 (`endJourney`).
- **Kopi:** konsistent «14 dager / dag 8» på alle live‑sider (14dag/dag8 > 0 på reisen, slik‑fungerer‑det, motpol, priser, faq, vilkår, trygghet); **ingen «30 dag» på journeysider** (eneste treff: GDPR‑frist på personvern + sessjonsvarighet på cookies — uavhengig).
- **Framing:** journey‑lengden er **produkt­design, ikke «vitenskapelig optimalt»** — korrekt omtalt som en testbar versjon.

**Status: OK — 14‑dagers / dag‑8‑design er implementert, server‑håndhevet og konsistent i kopi. Klar.**

## H. Chat and Photos

- **Chat:** kun deltakere (eierskap‑sjekk → 403), `senderId` fra sesjon (ikke klient), rate‑limit, ingen AI; samtale avsluttet ved dag 14.
- **Image upload:** sesjon + rate‑limit + type/størrelse‑valid + dag‑8‑lås; lagret i **R2** (aldri public); **signert URL** for lesing; **GDPR‑sletting** ved journey‑slutt.

**Status: OK — deltakerkun, R2 + signert lesing + dag‑8‑lås + GDPR‑sletting. Ingen P0.**

## I. Safety, reports, deletion, admin

- **Report:** validerer ekte match, overlever `endJourney`, rate‑limit (3/min), 90‑dagers bevis, admin‑gjenntag.
- **Block:** `UserBlock`; `journey/exit` blocked → sperreliste + reset til IDLE.
- **Ban:** admin kan bannlyse/løfte (`bannedAt`); `requireNotBanned` 403.
- **Deletion:** GDPR‑sletting; bevarer `UserBlock`/`MatchHistory`/`Report` (overlevelse).
- **Admin‑panel:** full (brukere, matches, samtaler, journeys, verktøy, metrics, inspector) bak JWT+RBAC.

**Spørre: «Finnes det noe som gjør det uforsvarlig å invitere ekte mennesker?»** → **Nei.** For et lite, invitasjonsbasert beta med admin‑overvåking og report/block/ban er sikkerheten tilstrekkelig.

**Status: OK — tilstrekkelig for begrenste beta. P2: bedre support‑verktøy.**

## J. Privacy

- **Ingen** Speed Insights / Web Analytics / markedsførings‑pixels (confirmert på live‑home + personvern).
- **Nødvendige cookies kun** — live `/cookies` sier eksplisitt «ingen analyse‑ eller markedsføringscookies i dag»; `/personvern` = nødvendige + samtykke.
- **Sentry:** aktiv i kode (`withSentryConfig`), CSP tillater sentry; **DSN usikkert** i prod (repo‑default tomt, kom «sett i Vercel før beta») → verifiser.
- **Retention:** opt‑in (`RETENTION_ENABLED` default av); anonymisering etter 12 mnd.

**Status: OK — privacy er rent; P1: verifiser Sentry DSN + DPA/SCC (lov).**

## K. Scientific / method claims

- **Egne spørsmål** (TOSOM_PERSONALITY V2); **ingen BFI‑10** i aktiv bruk (bortfalt, kun kommentar).
- **Ikke klinisk**; «resonans» = Tosom‑term (ikke klinisk).
- **Ingen fysisk attraksjon** beregnes.
- **Journey** omtalt som produ­ktdesign/testbar versjon, ikke optimalt.
- **Kopi:** konsistent, ingen overpraising, ingen falske vitenskapelige/identitets­påstander.

**Status: OK — method‑claims er defensible. Klar til «CLOSE» (ingen aktiv feil).**

## L. Payment, pricing, free beta

- `PAYMENTS_ENABLED=false` + **FATAL‑vakt** (refuser å starte hvis på).
- **Ingen betalings­krav** i kø; `claimFreeQuota` er person‑basert, atomisk (`UPDATE ... WHERE used < cap`), med **rollback** ved feil.
- `/betaling` = «start reise» (ingen live‑checkout); Vipps‑betaling **ikke aktiv**.
- **Kopi:** «Gratis for de første 5 000», 349 NOK som framtidig plan, ingen abonnement.

**Status: OK — ingen betaling, kvote kontrollert, kopi ærlig. Klar. (Betalt V1 = egen gate, se N.)**

## M. Public site truth

Alle offentlige sider (home, reisen, slik‑fungerer‑det, motpol, metoder, priser, faq, trygghet, vilkår, personvern, cookies) er **konsistente**: 14 dager, dag‑8‑reveal, gratis beta, ingen betaling, ingen overpraising, ingen falske identitets/verifiserings­påstander, ingen 30‑dagers‑rester, ingen analytics. «30 dag» forekommer kun som GDPR‑frist (personvern) og sessjonsvarighet (cookies) — uavhengig av journey.

**Status: OK — publikum‑kopi er sann og konsistent.**

## N. Legal (send til norsk advokat — maks 8 spørsmål)

1. **Livssyn/religion som matching‑parameter = special‑category (GDPR art. 9)?** Bør det være **eksplisitt samtykke** for nettopp dette formålet, og er ordlyden på `/samtykke` («Jeg samtykker til at Tosom bruker svarene mine om religion …») tilstrekkelig?
2. **Lovgrunnlag + DPA/SCC for Sentry** (mottar data; eventuell USA‑overføring): finnes DPA og er standardcontract clauses nødvendige?
3. **Retention + blocklist**: er det lovlig å beholde `UserBlock`/`MatchHistory`/`Report` for en slettet bruker (overlevelse), og hva er minstevarighet?
4. **21+ selv‑rapportering**: er «selv­rapportert nå, Vipps‑sjekkes senere» tilstrekkelig for begrenste beta, og hva kreves før offentlig/betalt?
5. **Gratis‑beta‑vilkår**: mangler det noe i villkårene for en gratis, invitasjonsbasert beta (ansvar, avbrytelse, endringer)?
6. **Angrerett §22 / digital innhold**: (før betalt) forutsetningen for angre‑rettsunntak for digital innhold — bekreft ordlyd før Vipps‑betaling.
7. **Vipps‑identitet framtidig plan**: er rammverket for å koble Vipps‑verifisering til alder/identitet juridisk korrekt satt opp?
8. **Overlevering**: hva bør vedlegges (personvern, villkår, samtykke‑tekst, datagrunnlag) for rask og komplett vurdering?

**Klassifisering:**
- **FØR LIMITED FREE BETA:** #1 (livssyn‑samtykke) — bør bekreftes.
- **FØR BREDERE OFFENTLIG BETA:** #2 (Sentry DPA/SCC), #4 (21+ → Vipps), #6–#7 (Vipps).
- **FØR BETALT MODUS:** #6 (angrerett), #7 (Vipps), #5.

## O. Operations

- **Health:** `/api/system/health` = 200; uptime‑monitor hvert 5. min med alert.
- **Prod‑DB:** Postgres (`DATABASE_URL` kreves i prod); 32 migrations.
- **Cron:** matching (lørdag) + journey (daglig) — begge secret‑authet + observability + kill‑switch.
- **Email:** Resend SMTP (`EMAIL_SERVER_*` kreves i prod), lazy init.
- **Images:** R2 (kreves i prod); Pusher/realtime (kreves i prod).
- **Backups:** scripts + dok (`deploy/backup.md`, `dbBackup.sh`/`dbRestore.sh`) — **verifiser at automatisk kavitet kjører i prod** (repo‑fila er gammel: 2026‑08‑11).
- **Admin:** full panel bak JWT+RBAC; **emergency**: `MAINTENANCE_MODE`, `MATCHING_ENABLED`, `REGISTRATION_ENABLED`, `PAYMENTS_ENABLED` (fatal).
- **Logs/alerter:** SystemLog + `recordMetric`/`sendAlert` + Sentry.

**Status: OK — drift velfungerende; P1: verifiser Sentry DSN + backup‑kavitet i prod.**

## P. Tests and CI

- **74 testfiler** i `__tests__` + lib‑tester; **E2E Playwright** (auth, onboarding, setup).
- **CI 40256930394** (0abac74): 11 jobber **grønn** (verify, lint, build, unit, integration, **E2E**, concept‑guards, language guard, prisma validate, health).
- **CD 40258679577** (0abac74): success. Local verify/lint/build: grønn.

**Status: OK — CI/CD grønn for live‑SHA.**

## Q. Test accounts

- **George TEST/DEMO‑journey** i prod (demo‑modus er client‑siden; `test-user-1/2` finnes).
- **Anbefaling:** **B** — nullstill/rydd George‑journey til IDLE/ekskludert fra matching **før** ekte inviter, slik at demo‑match ikke treff på ekte beta‑brukere; behold et rent smoke‑test‑konto.

## R. Support during beta

- **Støtte:** support@tosom.no + telefon (config); `/api/report`.
- **Stuck journey:** admin ser journeys + `journey reset/complete/next-step`.
- **Abusive user:** admin ban (`bannedAt`).
- **Queue/journey‑feil:** admin‑verktøy; cron‑observability + SystemLog.
- **Mangler:** ingen dedikert ticketing — akseptert for lite beta (admin + e‑post).

**Status: OK — tilstrekkelig for begrenste beta.**

## S. GO/NO‑GO matrix

| # | Area | Status | Sev. | Action | Beta blocker? |
|---|---|---|---|---|---|
| 1 | Auth (password) | OK | P1 | Epost‑verif + invite‑gate + CSRF‑flag før bredere | Nei |
| 2 | Identity (Vipps) | Out of scope | P1 | Vipps alder/identitet før bredere/betalt | Nei |
| 3 | 21+ | Self‑report | P1 | Vipps‑verif + lov før offentlig | Nei |
| 4 | Matching | OK | — | Ingen | Nei |
| 5 | Journey 14/dag‑8 | OK | — | Ingen | Nei |
| 6 | Chat + images | OK | — | Ingen | Nei |
| 7 | Safety/admin | OK | P2 | Bedre support‑verktøy | Nei |
| 8 | Privacy | OK | P1 | Sentry DSN + DPA/SCC | Nei |
| 9 | Methods/claims | OK | — | Ingen | Nei |
| 10 | Payment (off) | OK | — | Ingen (betal V1 = egen gate) | Nei |
| 11 | Free quota | OK | — | Ingen | Nei |
| 12 | Public truth | OK | — | Ingen | Nei |
| 13 | Legal | Needs review | P1 | Advokat‑review (art. 9, Sentry, retention, 21+) | Nei (men før utvidelse) |
| 14 | Operations | OK | P1 | Verifiser Sentry DSN + backup‑kavitet | Nei |
| 15 | Tests/CI | OK | — | Ingen | Nei |
| 16 | Test accounts | Action | P2 | Rydd George‑demo før inviter | Nei |
| 17 | Support | OK | P2 | On‑call/verktøy | Nei |
| 18 | Observability | OK | P1 | Bekreft Sentry aktiv + alerter | Nei |

## T. Top 10 remaining items (prioritert)

1. **Lov‑review** (art. 9 livssyn, Sentry DPA/SCC, retention/blocklist, 21+, gratis‑beta‑vilkår) — før utvidelse.
2. **Ekte epost‑verifisering** (i dag auto‑verified).
3. **Koble `BetaInvite` inn i `/api/auth/register`** (teknisk invite‑gate) — i dag er «invite‑only» kun operasjonelt.
4. **Verifiser Sentry DSN satt i Vercel** + DPA/SCC.
5. **Verifiser automatisk backup‑kavitet kjører i prod.**
6. **Slå på `ENABLE_CSRF_PROTECTION`** i prod (basal vern holder i mellomtid).
7. **Rydd George TEST/DEMO‑journey** til IDLE/ekskludert før ekte inviter.
8. **Vipps alder/identitets­verifisering** før bred offentlig beta/betalt.
9. **Angrerett §22 / digital innhold** bekreftet (før betalt).
10. **On‑call/support‑rutine** + bedre verktøy for beta‑periode.

## U. Explicit non‑blockers (ikke launch blockers)

- **Vipps Identity** — ikke nødvendig for begrenste, invitasjonsbasert gratis beta (framtidig plan).
- **Avansert analytics / retargeting** — medholdt av (bevisst ingen), ikke en blocker.
- **Journey v3 / lengdeoptimalisering** — 14‑dager er et validert produ­ktdesign for beta; ikke en blocker.
- **BFI‑10** — bortfalt; egne spørsmål brukes. Ikke en blocker.
- **Dedikert ticketing** — P2, admin+e‑post holder for lite beta.
- **Perfect 21+ / perfect CSRF** — selv‑rapport + basal vern holder for ikke‑markedsført skall; Vipps/flag før utvidelse.

## V. Final verdict

**STATUS: GO — LIMITED FREE BETA.**

**P0 blockers: 0. P1 blockers: 0** (P1‑punktene er «før bredere beta / før betalt», ikke «før dette lille invitasjons‑beta»). **P2 items:** flere, ikke blokkerende.

**Næste gate:** LOV‑REVIEW (norsk advokat) for art. 9 (livssyn), Sentry DPA/SCC, retention/blocklist og gratis‑beta‑vilkår — **før beta utvides** utover det inviterte skallet.

**Invitasjonskriterier (rekommenderes):** (1) lov‑spørsmål #1 (livssyn‑samtykke) bekreftet, (2) Sentry DSN verifisert, (3) backup‑kavitet bekreftet, (4) George‑demo ryddet, (5) invite‑gate (teknisk eller strengt privat lenke) sikret. Deretter: inviter et første, lite sett, overvåk uptime/Sentry/SystemLog, utfør daglig rapport.

**Endringer: Ingen kode endret (read‑only audit). Kun denne rapporten opprettet.**
