# Tosom Final Launch Audit

**Dato:** 2026-10-23
**Kode:** `04de16d` (main, ren, i synk med origin)
**Prod:** https://www.tosom.no (live — health 200, offentlig overflate kun status+timestamp)
**Utført av:** Cline (senior fullstack-utvikler og systemagent i ToSom)
**Arbeidsmetode:** kildekodelese + `verify:lang` (832 filer grønn) + `tsc --noEmit` (0 feil) + `jest --ci` (621 bestått / 1 hoppet, 70/71 suiter) + produksjonshenting (landing + health) + `vercel.json` + CI/CD-workflows.
**Forhistorie:** Dette dokumentet erstatter lanseringssjekklisten fra 05.10/12.10 (bevarer seg i git-historikk). K-1…K-8 fra den runden er rettet og dekket av tester — se Product Decisions og Final Launch Checklist.

**Statuslegender:**

| Merke | Betydning |
|---|---|
| `[x] VERIFIED` | Bekreftet mot kode, test eller prod — med bevis i feltet «Bevis» |
| `[ ] NOT DONE` | Må gjøres |
| `[ ] PRODUCT DECISION` | Venter på avgjørelse (eller: `PRODUCT DECISION: <beslutning>` når avgjort) |
| `[ ] REQUIRES PRODUCTION VERIFICATION` | Kan ikke bekreftes fra repo — krevs fra prod (George) |

---

## Executive Summary

Systemet er i god form. De kritiske funnene fra kvalitetsrunden 05.10 (K-1…K-8) er rettet i kode og dekket av tester: kontosletting, samtykke, bildelås (dag 15), deterministisk reisedag, rate limiting, passordkrav og eksplisitt registrering. 621 tester er grønne, språkvakten er grønn på 832 filer, og produksjonen kjører. Matchingmotoren er dokumentert, logisk konsistent, symmetrisk og observerbar (se Matching Engine Audit).

Det er **ingen P0-blockere** i koden. Det som gjenstår før «ready to fly» er tekst- og påstandsfeller som rammer tilliten (velkomst-e-posten lover noe produktet ikke holder; merkenavnet skrives to ulike steder), én død UploadThing-løsning som dokumentert er ikke-koblet og skal fjernes, synlig 21+-grense ved registrering, Vipps/kvote-blindveien (kjent, i ferd med å ferdigstilles), produktavgjørelsen om religion/livssyn som gjensidig hard kompatibilitetsregel (nå besluttet — implementeringsplan under) og kroppsform som ikke skal samles lenger fra nye brukere. I tillegg står Georges produksjonstsjekker (sekret-rotasjon, e-posttest i prod, DMARC).

## Launch Recommendation

# CONDITIONAL GO

Offentlig lansering er forsvarlig når:

1. P1-tekstfix er inn (velkomst-e-post, merkenavn, 21+-synlighet).
2. UploadThing er fjernet (kartlagt — neste ACT-fase).
3. Religion/livssyn er implementert som gjensidig hard kompatibilitetsregel **eller** George nedgraderer bevisst til P2 og vi stopper innsamlingen i midtløsningen (se PD-3).
4. Kroppsform stilles ikke lenger til nye brukere (minstekrav før lansering).
5. Vipps: avgjørelse om prisloftet på landing (P1-4) — beholde (kvote) eller mynke.
6. Georges G-punkter er verifisert i prod (P1-6).

## P0 Launch Blockers

**Ingen.** (Ikke oppblåst: alle sentrale brukerreiser er verifisert mot kode + grønne tester + levende produksjon.)

## P1 Must Fix Before Launch

### P1-1 · Velkomst-e-posten lover falskt

- **Sted:** `lib/email/index.ts:178-195` (`sendWelcomeEmail`)
- **Nåværende oppførsel:** «Her er det ingen bilder, ingen navn og ingen overflatelighet» og «Når systemet finner en passende person for deg, vil du få en e-post. Da starter reisen.»
- **Faktisk oppførsel:** Bilder i chat åpnes dag 15 (M-6, `isPhotosAllowed` i `lib/journey/engine.ts`; lås testet i `__tests__/chat-image-lock-m6.test.ts`). Kallenavn (`identityName`) vises bevisst i chat-bobler (`app/api/chat/messages/route.ts:63`). Match-e-post bak flagget `BETA_MATCH_EMAIL` (default **av** — invariant I-4, `config/features.ts`).
- **Forventet oppførsel:** E-posten beskriver faktisk produkt: ord først, bilder fra dag 15, varsel primært in-app.
- **Foreslått retting:** Skriv om teksten (forslag i Text and Consistency Audit) + tilføy en test som assert e-postteksten ikke inneholder «ingen bilder»/«ingen navn».
- **Risiko:** Tillit — brukeren møter bilde- og navnvisning som e-posten sa ikke kom.
- **Avhengigheter:** Ingen.
- **Verifisering:** `npx jest welcome-email` grønn + manuell lesing.
- **Status:** [ ] NOT DONE

### P1-2 · Merkenavn: kanonisk «Tosom» (standardisering i neste ACT)

- **Sted:** se PD-1 for full liste.
- **Nåværende oppførsel:** Landing/hero/footer skriver «Tosom»; alle e-poster («Velkommen til ToSom», «— ToSom», «Din ToSom-konto») og 8+ sider/paneler skriver «ToSom» (`lib/email/index.ts`, `app/priser`, `app/vilkar`, `app/faq`, `app/cookies`, `app/trygghet`, `app/tilgjengelighet`, `app/settings`, `app/dashboard/components/DashboardNavBar.tsx`, `app/hvorfor`, `app/chat/components/{BliKjentPanel,MoodsPanel,OppgaverPanel}.tsx`, `app/chat/data/tasks.ts`).
- **PRODUCT DECISION:** **`Tosom`** er kanonisk (besluttet 23.10.2026).
- **Foreslått retting:** Systematisk standardisering i neste ACT-fase (én patch per fil, verifisering mellom hver). Tekniske identifikatorer (pakkenavn `tosom`, `tosom.no`, env-varer, databasenavn, historiske migrasjoner, Sentry-projekt) endres **ikke** utenom bevisst avgjørelse.
- **Risiko:** Merketydelse og profesjonalitet ved offentlig lansering.
- **Verifisering:** `grep -rn "ToSom" app components lib styles` = kun dokumenterte tillatte unntak + ny CI-guard som feiler på ny «ToSom» i brukerrettet tekst.
- **Status:** [ ] NOT DONE (beslutning tatt; implementering i neste ACT)

### P1-3 · UploadThing: død, ikke-koblet opplasting — dokumentert, slettes i neste ACT

- **Sted:** `app/api/uploadthing/core.ts`, `utils/uploadthing.ts`, `components/ImageUpload.tsx`
- **Nåværende oppførsel (full kartlegging):**
  - `core.ts` definerer fileRouter `image` + `chatImage` (uploadthing v6).
  - **Catchall-ruten finnes IKKE:** ingen `app/api/uploadthing/[...uploadthing]/route.ts` — i UploadThing v6 for Next.js kreves denne for at endepunktet skal være live. Ut uten den blir `/api/uploadthing/*` 404. → Endepunktet er **dødt, ikke utnyttbart**.
  - `components/ImageUpload.tsx` (bruker `UploadButton` → UT `chatImage`, uten dag-15-lås) har **null imports** — død komponent. `ChatContainer.tsx:332` har sin egen inline `handleImageUpload` via den aktive veien `/api/chat/image`.
  - Referanser: `utils/uploadthing.ts` (importerer `core.ts`), `ImageUpload.tsx` (importerer `utils`), `app/api/system/health/route.ts:62-78` (leser `UPLOADTHING_TOKEN`, viser status i health-detaljer).
  - Env: `UPLOADTHING_TOKEN` / `NEXT_PUBLIC_UPLOADTHING_TOKEN` / `UPLOADTHING_SECRET` (valgfri i `config/env.ts:45`; konfigurert i prod ifølge GEORGE.md).
  - Dependencies: `uploadthing ^6.13.3`, `@uploadthing/react ^6.8.0`.
  - Tester: ingen referanser i `__tests__`/`e2e`.
- **Forventet oppførsel:** Én bildevei: `POST /api/chat/image` (dag-15-lås 423, 5MB, JPEG/PNG/WEBP, rate-limit 10/min, session-gated lesing via `GET /api/chat/image/[messageId]`).
- **Foreslått retting (neste ACT):** slett `core.ts` + `utils/uploadthing.ts` + `ImageUpload.tsx`, fjern `uploadthing`/`@uploadthing/react` fra dependencies, fjern uploadthing-blokken i health-ruten, fjern env-varer i Vercel (George).
- **Slik verifiseres sletting:** `tsc --noEmit` 0, `jest` grønn, `grep -rn uploadthing app components utils lib` = 0 treff, `next build` 69/69, e2e chat-bilde (M-6) grønn, prod-health uten uploadthing-nøkkel.
- **Risiko:** Død kode + konfigurert tredjepart-tjeneste + health-statuslekkasje. Lav akuttrisiko (ikke koblet), men feil å ha i en offentlig datingplattform.
- **Avhengigheter:** Ingen.
- **Status:** [ ] NOT DONE (kartlagt; sletting i neste ACT) · [ ] REQUIRES PRODUCTION VERIFICATION (at ingen live-deploy har catchall-ruten — bekreftes ved rutesett-inspeksjon eller ved sletting)

### P1-4 · Vipps/kvote: OPEN — PENDING BEFORE PUBLIC LAUNCH

- **Sted:** `app/(landing)/page.tsx` (pris-lovet), `config/features.ts` (`PAYMENTS_ENABLED=true` kaster FATAL bevisst), `app/api/journey/queue/route.ts:119` (402 → `/betaling`)
- **Nåværende oppførsel:** Landing annonserer «Når de 5 000 første er tatt, koster én reise 349 kroner — betalt én gang med Vipps». Betalingsveien finnes ikke (bevisst fatal-guard). Ved uttømt gratis-kvote havner brukeren i blindvei.
- **PRODUCT DECISION:** **OPEN / PENDING BEFORE PUBLIC LAUNCH** — Vipps er under ferdigstilling. Ingen midlertidige betalingsløsninger, ingen redesign av prisflyten, ikke fjernet fra produktplanen.
- **Må verifiseres når Vipps er ferdig:** korrekt pris (349 kr), vellykket betaling, avbrutt betaling, mislykket betaling, dobbeltbetaling, idempotens (`WebhookEvent`-modellen finnes allerede), kvote-klaring, tilgang etter betaling, kvittering, personvern, refusjon/feilhåndtering, produksjonskonfigurasjon. Eksisterende deler: `Order` (34900 NOK, `freeQuota`), `claimFreeQuota`/`releaseFreeQuota` med rullende tilbakegiving ved feil, `vipps/authorize`+`callback`-ruter (døde inntil OAuth er på plass).
- **Kortvarig avgjørelse før lansering:** beholde pris-lovet (kvote 5 000 gir rom) **eller** mynke «betalt med Vipps» — beskjed fra George.
- **Status:** [ ] PRODUCT DECISION: OPEN / PENDING · [ ] REQUIRES PRODUCTION VERIFICATION (kvote-stand i prod)

### P1-5 · 21+-grensen er ikke synlig for besøkende

- **Sted:** `app/(landing)/page.tsx`, `app/register/page.tsx` (ingen alderskrav synlig); `components/AgeRequirement.tsx` er død kode (null referanser); serveren håndhever 21 i `lib/validation/onboarding-setup.ts:50` (`min(21)`); metadata sier «For voksne 21+» (`app/layout.tsx:13`).
- **Nåværende oppførsel:** Konto kan opprettes med kun e-post+passord; alderen spørres først i onboarding steg 1, der <21 avvises. Alderskravet er ikke synlig før da.
- **Forventet oppførsel:** Besøkende ser alderskravet (21+) før/som en del av registreringen — tillit + selvberging av mindreårige.
- **Foreslått retting:** Synlig, rolig 21+-erklæring på landing (hero/sub) + ved registrering (kort bekreftelse i tråd med designet; kan gjenbruke en omarbeidet `AgeRequirement`).
- **Risiko:** Tillit og selvberging; samsvar med «For voksne 21+»-påstanden i metadata.
- **Avhengigheter:** Ingen.
- **Verifisering:** E2E: 21+ synlig i rendret HTML på `/` og `/register`; onboarding-avvising <21 er allerede testet.
- **Status:** [ ] NOT DONE

### P1-6 · Georges produksjonsverifisering (åpne G-punkter)

- **Sted:** `docs/RestSjekkliste.md` §2
- **Punkter:** G-04 rotasjon av `DATABASE_URL` (delt i chat 03.09), G-02 «Glemt passord»-e-posttest i prod (e-posten må lande), G-08 DMARC `p=none`, slette test1/test2 (dry-run klar), bekrefte `BETA_MATCH_EMAIL`-flagg i prod (avgjør om P1-1s e-postlovnader holder i dag).
- **Status:** [ ] REQUIRES PRODUCTION VERIFICATION

### P1-7 · Religion/livssyn: gjensidig hard kompatibilitetsregel — IMPLEMENTATION REQUIRED

- **Sted:** se PD-3 for full plan.
- **Nåværende oppførsel:** `religion` (eget livssyn, opptil 4, «som beskriver deg», 11 alternativer, **uten** «åpen for alle») samles i steg 1 og lagres i `Profile.deepProfileData.religion`; `religionImportance` (slider 1–10, legacy) lagres i samme blokk (`app/api/profile/setup/route.ts:229,231`). **Ingen bruk i matching** — kun en kommentar i `lib/matching/dimensions.ts:358`. Aktiv brukertekst sier i dag: «Ulik tro gjør ikke en match mindre aktuell» (`app/onboarding/steps/Step1Profile.tsx:444`).
- **PRODUCT DECISION (23.10.2026):** Religion/livssyn beholdes og brukes som **gjensidig hard kompatibilitetsregel** før scoring: opptil fire aksepterte alternativer, begge sider må akseptere, høy score overstyrer aldri, «Åpen for alle»-alternativ uten ekskludering, tom/gammel profil = eksplisitt trygg fallback (ingen gjeting).
- **Klassifiseringsbegrunnelse (P1, ikke P2):** brukeren svarer aktivt på spørsmålet i dagens onboarding, og onboardings generelle ramme («dette hjelper oss å finne mennesker som passer deg») skaper med rimelighet forventning om at profilsvarene påvirker matching. Setningen «Ulik tro gjør ikke en match mindre aktuell» er en overgangstekst som blir **falsk** så snart regelen innføres — regel og tekst må leveres sammen. Religion er i tillegg en GDPR-art.-9-kategori: «samle uten å bruke» er det svakeste alternativet; med art.-9-samtykket (`sensitiveConsentAt`, K-2) på plass er implementeringen forsvarlig å gjøre før offentlig skala. (George kan bevisst nedgradere til P2 — i midtløsningen må innsamlingen da stoppes, jf. PD-3.)
- **Status:** [x] DONE (23.10.2026, Phase 1A — implementert og verifisert med tester, se rapport under 3.9) · [x] DONE (23.10.2026, Phase 1.5 — «Åpen for alle» som eksplisitt tilstand, R-12 UX-hint, politicsImportance-opprydding, dataexport-audit; se rapport 3.11)

## P2 Should Fix

### P2-1 · Retensjon/anonymisering er effektivt av

- **Sted:** `config/retention.ts:7` (`RETENTION_ENABLED` default `false`), `lib/retention/engine.ts:254` (av = null-op)
- **Nåværende oppførsel:** Ingen reiser anonymiseres; personvern-lovet «12 måneder» holder ikke uten flagget.
- **Foreslått retting:** Slå på flagget i prod (G-punkt) + kjør anonymiseringstest mot test-DB først.
- **Verifisering:** Cron mot test-DB, deretter prod med 24-timers gransje.
- **Status:** [ ] REQUIRES PRODUCTION VERIFICATION

### P2-2 · Informasjonskapsler (Vercel speed insights)

- **Sted:** `config/cookies.ts`, `app/(landing)/page.tsx:25-43`
- **Nåværende oppførsel:** Ingen cookie-banner-komponent funnet i prod-kode (kun konfig + tekst i vilkårene); `page.tsx:38` refererer til speed-insights uten synlig bannertilstand.
- **Forventet oppførsel:** Hvit-liste for strictly necessary + valgfri analyse-kapsel, samtykke før setning.
- **Status:** [ ] NOT DONE (verifisér først nøyaktig hva som settes i prod)

### P2-3 · Tilgjengelighet (a11y)

- **Sted:** `app/(landing)/page.tsx`, `app/hvorfor/page.tsx`
- **Nåværende oppførsel:** `onKeyDown` på `<div>` uten `tabIndex` (uutløselig for tastatur, `page.tsx:158`); manglende `aria-hidden` på dekorative ikoner; manglende `alt`-tekster på hero-bilder.
- **Foreslått retting:** Konverter til `role="button"` + `tabIndex` eller ekte `<button>`; legg på `aria-hidden`/`alt`.
- **Status:** [ ] NOT DONE

### P2-4 · Analytics leser PII

- **Sted:** `app/api/analytics/track/route.ts:29,44,58-60`
- **Nåværende oppførsel:** `session.userId`, `session.user?.name`, `session.user?.email` er tilgjengelig i `session`-typen; `properties`-felter ikke utelukket. `SystemLog` er 180 dager (G-09).
- **Foreslått retting:** Strip `name`/`email` i analytics-ruten (bevisst avgjørelse); vurder kortere logretensjon.
- **Status:** [ ] NOT DONE

### P2-5 · Høyde: PRODUCT DECISION: RETAIN HEIGHT

- **Sted:** `lib/matching/dealbreaker.ts:166-190` (`checkHeightRule`, D-1), `lib/matching/cheapFeatures.ts:62-74`
- **PRODUCT DECISION (23.10.2026):** **Høyde beholdes.** Høydefeltet og D-1-regelen endres ikke i denne fasen; regelen skal ikke endres uten separat produktbeslutning.
- **Krav:** Eksisterende logikk skal testes (dekkes av `__tests__/livsstil2026-dealbreaker.test.ts`), gjensidighet og konsekvenser skal verifiseres (se Matching Engine Audit). Høyde og kroppsform behandles ikke som samme type informasjon — høyde beholdes, kroppsform vurderes fjernet (P2-8).
- **Status:** [x] PRODUCT DECISION: RETAIN HEIGHT (testdekning: [x] VERIFIED)

### P2-6 · `docs/ACT-STATE.json` er forældet

- **Sted:** `docs/ACT-STATE.json` (sidste oppdatering 15.10; kode 23.10)
- **Foreslått retting:** Oppdater per ACT (en del av avleveringsritualet).
- **Status:** [ ] NOT DONE

### P2-7 · Verifisér `tosom.org.no`-eier

- **Sted:** `app/sitemap.ts:15` (host `tosom.org.no` i sitemap/robots/manifest/og:url)
- **Nåværende oppførsel:** Prod kjører `www.tosom.no`. `tosom.org.no` i metadata peker på en domene som kan være feil/ikke eid av oss.
- **Foreslått retting:** Bytt til `www.tosom.no` (eller verifiser eierskap først).
- **Status:** [ ] REQUIRES PRODUCTION VERIFICATION (domeneeierskap)

### P2-8 · Kroppsform: REMOVE CANDIDATE — slutt å samle før lansering

- **Sted:** se PD-4 for full kartlegging.
- **PRODUCT DECISION (23.10.2026):** Kroppsform vurderes fjernet (REMOVE). Minstekrav før offentlig lansering: **samles ikke lenger inn fra nye brukere.** Endelig databaserydding kan kontrolleres etter lansering (migrasjonsrisiko — ingen destruktiv DDL i denne fasen).
- **Status:** [x] DONE (23.10.2026, Phase 1B — fjernet fra aktiv innsamling: Step1Profile-spørsmålet «Kroppstype» og Step9-oppsummeringsfeltet er borte; `basic.bodyType` er fortsatt valgfritt i valideringen og lagres om den sendes, slik at gammel data ikke feiler. Ingen destruktiv DDL/DB-rydding — `lifestyle.bodyType` i eksisterende profiler er urørt.)

### P2-9 · Sitemap-URLer til kanonisk host

- **Sted:** `app/sitemap.ts:23-26`
- **Nåværende oppførsel:** Sitemap innleverer sider med `tosom.org.no`-host (P2-7); ingenting annet mangler.
- **Foreslått retting:** Henger på P2-7 — bytt host, deretter verifisér at alle 11 URL-er 200 i prod.
- **Status:** [ ] NOT DONE

## P3 Post Launch

| ID | Funn | Sted | Foreslått retting | Status |
|---|---|---|---|---|
| P3-1 | `MatchHistory`-modellen skrives aldri (død) | `prisma/schema.prisma` (MatchHistory), `lib/matching/scoreRound.ts` | Fjern modellen eller skriv historikk ved match (observability); beslutning ved admin-panelutvidelse | [ ] NOT DONE |
| P3-2 | Døde filer utenom UploadThing: `AgeRequirement.tsx`, `app/onboarding/data/questions.ts` (legacy `step1Data`/`step9Data`, inkl. `bodyType` og `religionImportance`) | `components/AgeRequirement.tsx`, `app/onboarding/data/questions.ts` | Fjern (eller gjenbruk i P1-5) i ryddingspatch | [ ] NOT DONE |
| P3-3 | «Vent for neste sjekk kl. 04:00» er feil tekst (cron kjører kl. 02:00–17:00) | `app/venterom/page.tsx:135` | Rett tekst til faktisk tidsrom | [ ] NOT DONE |
| P3-4 | Landing: «Vi har valgt å ikke ta inn investorer» — godkjenningspåstand | `app/(landing)/page.tsx` | Verifiser mot virkelighet; mynke om nødvendig | [ ] PRODUCT DECISION |
| P3-5 | Match-e-post (flagg-av): «ders» i stedet for «hvis» | `lib/email/index.ts:251` | Språkfix ved aktivering av flagget | [ ] NOT DONE |
| P3-6 | `photoUrl`-felter i `Profile`/`User` er nådøde etter R2-migrasjon (kun `photoKey` er live) | `prisma/schema.prisma` | Rydd i skjemas kommentarer/typebruk for å unngå forveksling | [ ] NOT DONE |
| P3-7 | `age`-felt: placeholder i onboarding er tom | `app/onboarding/steps/Step1Profile.tsx` | Legg på `placeholder="28"` for tydelighet | [ ] NOT DONE |
| P3-8 | Journey-cron: N+1-henting av par (funksjonelt, effektivitet) | `app/api/cron/journey/route.ts` | Batch-henting med `IN`-liste ved skala | [ ] NOT DONE |
| P3-9 | `lastLoginAt`-presisjon (update ved hver innlogging er kostbar ved skala) | `middleware.ts` | Throttle oppdateringen (t.ex. maks 1×/t) | [ ] NOT DONE |
| P3-10 | «Glemt passord»-rate-limit er i minne per instance (Vercel serverless: ikke globalt) | `app/api/auth/forgot-password/route.ts` | Flytt til `pgCheck` (mønsteret finnes allerede for report/chat) | [ ] NOT DONE |

## Public Website Audit

| # | Punkt | Bevis | Status |
|---|---|---|---|
| 1 | Landing (`/`) renderes i prod med 200 | `fetch https://www.tosom.no` → 200, «Tosom», «Hun og han. 21+. Uten å svine til.», 349-kr-tekst, footer «© 2026 Tosom» | [x] VERIFIED |
| 2 | Subdomene omdirigeres til www | `tosom.no → 308 → www.tosom.no` (Vercel-konfig; verifisert 05.10) | [x] VERIFIED |
| 3 | Helse-endepunkt er offentlig, kun status+timestamp | `GET /api/system/health` → 200 `{status:'ok', timestamp}` (admin-detaljer bak admin-session) | [x] VERIFIED |
| 4 | `robots.txt` tillater alt, peker på `/sitemap.xml` | `app/robots.ts` | [x] VERIFIED |
| 5 | Sitemap med 10 URL-er | `app/sitemap.ts` | [x] VERIFIED |
| 6 | Sitemap-host er `tosom.org.no` (mangler eierskapsbekreftelse) | `app/sitemap.ts:15` | [ ] REQUIRES PRODUCTION VERIFICATION (P2-7) |
| 7 | Alle sitemap-URL-er gir 200 i prod | `curl` per URL (gjøres i Production Verification) | [ ] REQUIRES PRODUCTION VERIFICATION |
| 8 | PWA/manifest eksisterer | `app/manifest.ts`, `app/icon.tsx` | [x] VERIFIED |
| 9 | Vercel `vercel.json` forbyr innlogging via API | `vercel.json` | [x] VERIFIED |
| 10 | Landing-prislovet stemmer ikke med betalingsvirkeligheten (bevisst, P1-4) | `app/(landing)/page.tsx` vs. `config/features.ts` FATAL | [ ] PRODUCT DECISION: OPEN / PENDING |
| 11 | «Vi har valgt å ikke ta inn investorer» — påstand krevs verifisert | `app/(landing)/page.tsx` | [ ] PRODUCT DECISION (P3-4) |
| 12 | «Følg oss på Instagram/TikTok» — knapper uten lenke | `components/ui/layout/Footer.tsx` | [ ] NOT DONE (lav) |

## Text and Consistency Audit

### T-1 · Velkomst-e-post (P1-1)

**Nåværende:** «Her er det ingen bilder, ingen navn og ingen overfatelighet» + «Når systemet finner en passende person for deg, vil du få en e-post. Da starter reisen.»

**Faktisk:** bilder fra dag 15, kallenavn i chat, in-app-varsler primært; match-e-post er flagg-av i dag.

**Forslag (i tråd med ToSom-tonen — rolig, konkret, ingen lover om «destinasjon»):**

> «Her starter reisen med ord. Ingen bilder og ingen overfatelighet — dere kjenner hverandre gjennom de 30 dagene. Når dere er klare, åpnes bildene. De aller fleste varslene du får, kommer rett inn i appen — denne e-posten er kun en bekreftelse på at kontoen din er klar.»

Status: [ ] NOT DONE

### T-2 · Merkenavn (P1-2 / PD-1)

**Funn:** «Tosom» (landing, hero, footer, metadata) mot «ToSom» (alle e-poster, 8+ sider/paneler). Besluttet: **Tosom** er kanonisk. Se PD-1 for filer og unntak.

Status: [ ] NOT DONE

### T-3 · Religionsteksten i onboarding blir usann ved P1-7

**Nåværende (aktiv):** «Velg opptil fire som beskriver deg. Mange har røtter i flere tradisjoner — det er helt naturlig. Ulik tro gjør ikke en match mindre aktuell.» (`Step1Profile.tsx:444`)

**Krav ved P1-7:** setningen «Ulik tro gjør ikke en match mindre aktuell» **må** fjernes/skiftes, da regelen gjør motsatt. Ny tekst for aksept-spørsmålet foreslås i PD-3 (inkl. hjelpetekst om at færre valg = færre matcher, uten press).

**Gjort (23.10.2026, Phase 1E):** «Ulik tro gjør ikke en match mindre aktuell» er fjernet fra «Religion/livssyn»-feltet i steg 1. Det nye aksept-spørsmålet har hjelpeteksten: «Velg opptil fire religioner eller livssyn du er åpen for hos en partner. Det er du — ikke Tosom — som bestemmer hva som passer for deg. Jo færre du velger, desto færre mulige matcher kan vi finne.» Skillet mellom Tosom (avgjør ikke kompatibilitet) og brukeren (avgjør aksept) er eksplicit.

Status: [x] VERIFIED (følger P1-7 — utført i Phase 1E, 23.10.2026)

### T-4 · «Vent for neste sjekk kl. 04:00» (P3-3)

**Nåværende:** `app/venterom/page.tsx:135`. **Faktisk:** cron kjører kl. 02:00–17:00. **Forslag:** «Vi sjekker kontinuerlig mellom kl. 02:00 og 17:00.»

Status: [ ] NOT DONE

### T-5 · «Ders» i match-e-post (P3-5)

`lib/email/index.ts:251`: «ders en av dere starter samtalen» → «hvis». (Kun relevant når `BETA_MATCH_EMAIL` slås på.)

Status: [ ] NOT DONE


### T-6 · «Vi har valgt å ikke ta inn investorer» (P3-4)

Landing `app/(landing)/page.tsx`. [ ] PRODUCT DECISION — George bekrefter påstanden før lansering.

## User Journey Audit

| Reisesegment | Sted | Vurdering | Status |
|---|---|---|---|
| Landing → «Få 5 000 gratis» → registrering | `app/(landing)/page.tsx`, `app/register/page.tsx` | Flyten er enkel og ærlig; 21+-grensen er ikke synlig før onboarding (P1-5) | [ ] NOT DONE (P1-5) |
| Registrering: e-post + passord (min. 12, 1 spesial, 1 tall) | `lib/validation/onboarding-setup.ts`, `app/api/auth/register/route.ts` | Kravene er rimelige og håndheves server-side; ingen telefon/E164 (bevisst avgjørelse fra 10.10 — e-post + passord er primær) | [x] VERIFIED |
| Onboarding (30+ spørsmål, 13 steg) | `app/onboarding/*` | Langt, men trinnvis med oppsummering; religion (P1-7) og kroppsform (P2-8) ligger her; ingen laging i `localStorage` (V-12) | [x] VERIFIED |
| Samtykkeport før profil-lagring | `app/api/profile/setup/route.ts` (403 uten samtykke) | K-2-leveranse; `termsAcceptedAt`/`sensitiveConsentAt` lagres | [x] VERIFIED (5 tester) |
| Venterom → matching-runde (cron 02:00–17:00) | `app/venterom/page.tsx`, `app/api/cron/matching/route.ts` | Tekst «kl. 04:00» er feil (P3-3); kvote-blindvei uten Vipps (P1-4) | [ ] NOT DONE (P3-3) |
| Reise (30 dager, daglig innhold) | `app/reisen/page.tsx`, `lib/journey/engine.ts` | Deterministisk dagstall (K-5), bilde-lås dag 1–14 (K-8/M-6), 24-t-gransje ved slutt (D), PDF-levering | [x] VERIFIED |
| Chat (CSRF, rate-limit 10/min, bilde 423 før dag 15) | `app/api/chat/*`, `app/chat/*` | Solid; `handleImageUpload` i `ChatContainer` går via den aktive veien | [x] VERIFIED |
| Rapport/blokkering (bevare bevis, rapport etter avsluttet match) | `app/api/report/*`, admin-verktøykasse | V-5-leveranse; behandlingsrutine skriftlig (11.10) | [x] VERIFIED |
| Kontosletting (gransje, full sletting) | `app/api/account/delete/*` | K-1-leveranse inkl. gransje og e-postvarsel | [x] VERIFIED |
| Dataeksport (1/5 min, rate-limit) | `app/api/settings/export/route.ts` | Eksporterer hele `Profile` (inkl. `deepProfileData` og `lifestyle` — religion og kroppsform følger med automatisk) + meldinger/reiser/varsel/rapporter | [x] VERIFIED |

## Matching Engine Audit

| # | Punkt | Bevis | Status |
|---|---|---|---|
| 1 | Symmetrisk: A↔B får samme resultat (kjører begge retninger i `scoreRound`) | `lib/matching/scoreRound.ts`; `__tests__/matching-score-round.test.ts` | [x] VERIFIED |
| 2 | Dealbreakers før scoring: kjønn, alder, distance, røyking, høyde (D-1, kun M↔K), religion (kommentar — ikke aktiv, se P1-7) | `lib/matching/dealbreaker.ts`, `lib/matching/cheapFeatures.ts` | [x] VERIFIED |
| 3 | D-1-høyderegel: kun par med én mann og én kvinne; ukjent høyde blokkerer aldri | `lib/matching/dealbreaker.ts:166-190`; `__tests__/livsstil2026-dealbreaker.test.ts` | [x] VERIFIED (beslutning: RETAIN, P2-5) |
| 4 | Greedy matching med sortering etter parscore; tomme pooler håndteres | `app/api/cron/matching/route.ts`, `scoreRound.ts` | [x] VERIFIED |
| 5 | Blokkering rapporteres: par med `block` hoppes over | `scoreRound.ts` | [x] VERIFIED |
| 6 | Ubesvarte psykometrisk-spørsmål gir ikke høy resonans (K-3 levert: terskler > 3.0, flat×flat = 50, tom×tom → MODERATE) | `lib/matching/unifiedScorer.ts`, `dimensions.ts`; `__tests__/psychometrics-scoring.test.ts` | [x] VERIFIED |
| 7 | `cheapFeatures` = billig forkastning før dyre scoringer (samme avgjørelser som `dealbreaker` — ekvivalens-testet) | `lib/matching/cheapFeatures.ts`; ekvivalens-test | [x] VERIFIED |
| 8 | `rejectReasons` observerbar per par (admin «matching-rounds») | `scoreRound.ts`, `lib/admin/*` | [x] VERIFIED |
| 9 | `MatchHistory` skrives aldri (død modell) | P3-1 | [ ] NOT DONE |
| 10 | Kvote: `claimFreeQuota` med rullende tilbakegiving ved feil; 402 → `/betaling` | `app/api/journey/queue/route.ts:119` | [x] VERIFIED (se P1-4 for blindvei) |

| 11 | Religion: ingen aktiv bruk i dag — kun kommentar «religion ligger i `cheapFeatures`» (falsk i dag) | `lib/matching/dimensions.ts:358` | [ ] NOT DONE (P1-7 tar over) |

## Everyday Compatibility Audit

Hverdagskompatibilitet (livsstil, hverdagsmønster, mat, soving, dyr, reise, alkohol, ambisjon, struktur/spontanitet, intro/ekstrovert, relasjonsstil) samles i onboarding steg 2b/5a/5b og lagres i `lifeSituation`/`lifestyle`/`deepProfileData`-JSON.

| # | Punkt | Bevis | Status |
|---|---|---|---|
| 1 | Hverdagsfeltene er valideres server-side (zod, `onboarding-setup.ts`) og lagres i JSON-kolonner | `app/api/profile/setup/route.ts:138-170,215-240` | [x] VERIFIED |
| 2 | Hverdagsdimensjonene er vektet i scoring (`dimensions.ts`) med klare vekter og dokumenterte gap-regler | `lib/matching/dimensions.ts` | [x] VERIFIED |
| 3 | `desiredLifestyle`/`undesiredLifestyle` brukes i scoring (5a) | `dimensions.ts` | [x] VERIFIED |
| 4 | Relasjonsstil (5b) lagres som `relationshipStyle` (String-kolonne) | `profile/setup/route.ts` | [x] VERIFIED |
| 5 | `religionImportance`/`politicsImportance` (slider) samles men **brukes ikke** i scoring | `onboarding-setup.ts:290-300`, ingen treff i `lib/matching` | [ ] NOT DONE (beslutning: behold/bruk/fjern — P1-7 dekker religion-delens bruk; `politicsImportance` uavklart) |
| 6 | Kroppsform (`bodyType`) samles, lagres, men brukes ingen sted (P2-8) | PD-4 | [ ] NOT DONE |
| 7 | Høyde brukes kun i D-1 (P2-5 RETAIN) | PD-5 | [x] VERIFIED |

## UI and UX Audit

| # | Punkt | Bevis | Status |
|---|---|---|---|
| 1 | Semantisk HTML: landing bruker `<header>/<main>/<footer>/<section>/<h1>` korrekt | `app/(landing)/page.tsx`, `components/ui/layout/*` | [x] VERIFIED |
| 2 | Fokus-tilstand: globale `:focus-visible`-styler eksisterer | `styles/globals.css` | [x] VERIFIED |
| 3 | Touch-targets: primære knapper ≥ 44px (landing/dashboard) | `Hero.tsx`, `DashboardNavBar.tsx` | [x] VERIFIED |
| 4 | Interaktive `<div>`-elementer uten `tabIndex` (landing `page.tsx:158`, `hvorfor`) | P2-3 | [ ] NOT DONE |
| 5 | Venterom viser reell status (kø, siste runde, neste runde) | `app/venterom/page.tsx` | [x] VERIFIED (tekstfeil P3-3) |
| 6 | Chat-bilder låst dag 1–14 med tydelig lås-UI | `app/chat/components/ChatContainer.tsx` | [x] VERIFIED |
| 7 | Onboarding-oppsummering (steg 9) viser alle valg inkl. religion og kroppsform | `Step9Oppsummering.tsx:38,156` | [x] VERIFIED |
| 8 | Ingen døde knapper i dashboard/venterom (kjent: footer-sosiale-medie-knapper uten lenke) | `Footer.tsx` | [ ] NOT DONE (lav) |

## Accessibility Audit

| # | Punkt | Bevis | Status |
|---|---|---|---|
| 1 | `lang="no"` på `<html>` | `app/layout.tsx` | [x] VERIFIED |
| 2 | Kontrast: landing-tekst på mørk bakgrunn (hvitt/grått) — OK i kjernen; dekorative ikoner har lav kontrast (akseptabelt om dekorativt) | `styles/globals.css` | [x] VERIFIED |
| 3 | Skjermleser: dekorative ikoner mangler `aria-hidden` (P2-3) | `Hero.tsx`, `landing/page.tsx` | [ ] NOT DONE |
| 4 | Tastaturnavigasjon: `onKeyDown`-div uten `tabIndex` (P2-3) | P2-3 | [ ] NOT DONE |
| 5 | Alt-tekster på dekorative hero-bilder | `landing/page.tsx` | [ ] NOT DONE |
| 6 | Error-tilstander i onboarding annonses via `aria-live`/role | `OnboardingFlow.tsx` | [ ] NOT DONE (verifisere) |

| 7 | Språk: hele produktet er norsk bokmål (språkvakt 832 filer grønn) | `npm run verify:lang` | [x] VERIFIED |

## Security and Privacy Audit

| # | Punkt | Bevis | Status |
|---|---|---|---|
| 1 | Session-gate: alle brukergatede API-ruter krever gyldig session (401 uten) | `lib/auth/*`, alle `app/api/*`-ruter; `__tests__/` (auth-gate-tester) | [x] VERIFIED |
| 2 | IDOR-vern: chat/profil-ruter henter kun eiers data via session-`userId` | `app/api/chat/messages/route.ts`, `app/api/profile/me/route.ts` | [x] VERIFIED |
| 3 | CSRF: chat `POST/DELETE` krever matchende `x-csrf-token` (double-submit) | `app/api/chat/send/route.ts` m.fl. | [x] VERIFIED |
| 4 | Rate limiting: chat 10/min, sende-melding, rapport (pgCheck, globalt), export 1/5 min, upload 10/min | `lib/rateLimit/*` (`pgCheck`-mønster) | [x] VERIFIED |
| 5 | Bilde-upload: 5MB, kun JPEG/PNG/WEBP, dag-15-lås (423), R2-lagring med `photoKey`, signerte URL-er ved lesing | `app/api/chat/image/*`, `__tests__/image-signed-url-r2.test.ts`, `chat-image-lock-m6.test.ts` | [x] VERIFIED |
| 6 | Partnernavn skjules: chat viser `identityName` (kallenavn) bevisst; e-post skjules i alle API-svar | `chat/messages/route.ts:63`, `partnerProfile.ts` | [x] VERIFIED |
| 7 | `PUT /api/profile` har CSRF+URL-validering (K-8 levert) | `app/api/profile/route.ts` | [x] VERIFIED |
| 8 | Passord: bcrypt (kost 12), min. 12 tegn + spesial + tall | `lib/auth/*`, `onboarding-setup.ts` | [x] VERIFIED |
| 9 | Kontosletting sletter relasjoner (journeys, matches, messages, notifications, reports) — K-1 | `lib/account/deleteAccount.ts`, integrasjonstest | [x] VERIFIED |
| 10 | Samtykke: `termsAcceptedAt`/`sensitiveConsentAt` (art. 9) før profil-lagring; 403 uten — K-2 | `profile/setup/route.ts`, `app/samtykke/page.tsx` | [x] VERIFIED (prod-migrasjon: [ ] REQUIRES PRODUCTION VERIFICATION) |
| 11 | Admin-gate: admin-ruter krever admin-session + CSRF; `vercel.json` blokkerer API-innlogging | `middleware.ts`, `app/api/admin/*`, `vercel.json` | [x] VERIFIED |
| 12 | `uploadthing`-status avsløres i offentlig health (kun «configured/missing») | `app/api/system/health/route.ts:76-78` | [ ] NOT DONE (fjernes med P1-3) |
| 13 | IP-logging i `SystemLog` (180 dager) — dokumentert i FAQ/personvern (K-7) | `lib/logging/*`, FAQ | [x] VERIFIED (retensjon: G-09) |
| 14 | Analytics mottar session med `name`/`email` tilgjengelig (P2-4) | P2-4 | [ ] NOT DONE |
| 15 | DMARC `p=none` (G-08); e-postlevering i prod bekreftet 12.10 | `docs/RestSjekkliste.md` §2 | [ ] REQUIRES PRODUCTION VERIFICATION |
| 16 | Religion er en art.-9-kategori: samtykke dekker «matching» generelt — konkret bruksformål (hard kompatibilitetsregel) skal beskrives i personvern (PD-3) | PD-3 | [ ] NOT DONE (følger P1-7) |
| 17 | Kroppsform samles uten formål (P2-8/PD-4) | PD-4 | [ ] NOT DONE |

## Database and Backend Audit

| # | Punkt | Bevis | Status |
|---|---|---|---|
| 1 | Prisma-skjema: `User`, `Profile` (JSON-kolonner), `Journey`, `Match`, `Message`, `Notification`, `Report`, `Order`, `WebhookEvent`, `SystemLog`, `MatchHistory` (død, P3-1) | `prisma/schema.prisma` | [x] VERIFIED |
| 2 | Migrasjoner er applikert i prod (verifiserte `prisma migrate`-kjøringer) | `prisma/migrations/*` | [ ] REQUIRES PRODUCTION VERIFICATION |
| 3 | Kvote-transaksjoner: `claimFreeQuota`/`releaseFreeQuota` i transaksjon med rullende tilbakegiving | `app/api/journey/queue/route.ts` | [x] VERIFIED |
| 4 | Cron-jobber: matching (02:00–17:00), journey (daglig), retention (av, P2-1) — API-hander med `CRON_SECRET` | `app/api/cron/*`, `vercel.json` | [x] VERIFIED |
| 5 | `RETENTION_ENABLED=false` default → anonymisering kjører ikke (P2-1) | `config/retention.ts:7` | [ ] REQUIRES PRODUCTION VERIFICATION |
| 6 | `PAYMENTS_ENABLED=true` kaster FATAL bevisst (bevisst guard) | `config/features.ts` | [x] VERIFIED |
| 7 | `BETA_MATCH_EMAIL` default av (invariant I-4) | `config/features.ts` | [x] VERIFIED (prod-verdi: [ ] REQUIRES PRODUCTION VERIFICATION) |
| 8 | `DATABASE_URL` rotasjon (G-04) | `docs/RestSjekkliste.md` | [ ] REQUIRES PRODUCTION VERIFICATION |
| 9 | `lastLoginAt` oppdateres ved hver innlogging (skala: P3-9) | `middleware.ts` | [ ] NOT DONE |
| 10 | Journey-cron N+1-henting (P3-8) | P3-8 | [ ] NOT DONE |

## Performance Audit

| # | Punkt | Bevis | Status |
|---|---|---|---|
| 1 | `next build`: 69/69 sider (11.10, `1102a0c`) | CI/CD-logg | [x] VERIFIED (re-verifisere ved neste build) |
| 2 | Matching-runde: `cheapFeatures`-forkastning før dyre scoringer; `findMany` med `take`-begrensning | `scoreRound.ts` | [x] VERIFIED |
| 3 | Self-hosted fonts (V-7), ingen tredjeparts-font-CDN i produkt | `app/layout.tsx` (`next/font`) | [x] VERIFIED |
| 4 | Landing: server-component, ingen tung JS (hero-bilder er R2/URL-bilder) | `landing/page.tsx` | [x] VERIFIED |
| 5 | `match`-rute henter hele poolen (akseptabelt for kvote 5 000; vurdere paginering ved skala) | `cron/matching/route.ts` | [ ] NOT DONE (P3) |
| 6 | Vercel speed insights (analytics) — verifisere innvirkning (P2-2) | P2-2 | [ ] NOT DONE |

## SEO Audit

| # | Punkt | Bevis | Status |
|---|---|---|---|
| 1 | Metadata: title/description/openGraph med `tosom.org.no`-host (P2-7) | `app/layout.tsx` | [ ] NOT DONE (P2-7) |
| 2 | `robots.ts` + `sitemap.ts` i prod (200) | `app/robots.ts`, `app/sitemap.ts` | [x] VERIFIED |
| 3 | Semantisk HTML + `h1` på landing | `landing/page.tsx` | [x] VERIFIED |
| 4 | «For voksne 21+» i metadata (P1-5: synliggjør også i UI) | `app/layout.tsx:13` | [x] VERIFIED |
| 5 | Subdomene 308 til www (ingen duplicate content) | Vercel-konfig | [x] VERIFIED |
| 6 | Sitemap-host feil (P2-7/P2-9) | P2-7 | [ ] REQUIRES PRODUCTION VERIFICATION |

## Email and Notification Audit

| # | E-post/varsling | Sted | Status |
|---|---|---|---|
| 1 | Velkomst-e-post: lover falskt (P1-1) | `lib/email/index.ts:178-195` | [ ] NOT DONE |
| 2 | Match-e-post bak `BETA_MATCH_EMAIL` (default av, I-4); «ders»-feil (P3-5) | `lib/email/index.ts:251` | [ ] NOT DONE (P3-5; prod-flagg: [ ] REQUIRES PRODUCTION VERIFICATION) |
| 3 | «Reisen er fullført»-e-post med 24-t-varsel (D) — leveranse verifisert i prod 12.10 | `lib/journey/endJourney.ts` | [x] VERIFIED |
| 4 | «Glemt passord»-e-post: kodeferdig; prod-test gjenstår (G-02); rate-limit i minne (P3-10) | `app/api/auth/forgot-password/route.ts` | [ ] REQUIRES PRODUCTION VERIFICATION |
| 5 | Kontosletting-varsel (gransje) — testet | `lib/account/*` | [x] VERIFIED |
| 6 | In-app-varsler (Notification-modellen) er primær kanal — e-post er sekundær | `app/api/notifications/*` | [x] VERIFIED |
| 7 | E-postlevering i prod bekreftet 12.10 (velkomst→match→fullført mottatt) | `docs/LanseringsCheckList.md` (gammel, git-historikk) / RestSjekkliste | [x] VERIFIED |

## Legal and Trust Claims Requiring Verification

| # | Påstand | Sted | Status |
|---|---|---|---|
| 1 | «Når de 5 000 første er tatt, koster én reise 349 kroner — betalt én gang med Vipps» — Vipps finnes ikke (bevisst, P1-4) | landing | [ ] PRODUCT DECISION: OPEN / PENDING |
| 2 | «Vi har valgt å ikke ta inn investorer» | landing | [ ] PRODUCT DECISION (P3-4) |
| 3 | «12 måneder»-retensjon for reiser — `RETENTION_ENABLED=false` i dag (P2-1) | personvern vs. `config/retention.ts` | [ ] REQUIRES PRODUCTION VERIFICATION |
| 4 | Religion/livssyn som art.-9-kategori: samtykketeksten (`/samtykke`) dekker «matching» generelt — den konkrete hardrule-mekanismen skal beskrives i personvern ved P1-7 (PD-3) | `app/samtykke/page.tsx`, `app/personvern/page.tsx` | [ ] NOT DONE (følger P1-7) |
| 5 | DPA/DPIA med advokat (V-9) — signert? | `docs/` | [ ] REQUIRES PRODUCTION VERIFICATION (George/advokat) |
| 6 | Vipps: DPA + vilkårs-dekning av Vipps som behandler (kjent, venter på integrasjon, P1-4) | vilkår | [ ] PRODUCT DECISION: OPEN / PENDING |
| 7 | «Følg oss på Instagram/TikTok» uten lenker (usann/uhensiktsmessig før lansering) | footer | [ ] NOT DONE (lav) |
| 8 | Firmaadresse gjenstår i footer/vilkår (kjent 12.10 — auto-renderes via `COMPANY.address`) | `config/company.ts` | [ ] REQUIRES PRODUCTION VERIFICATION |
| 9 | Org.nr. i metadata (`tosom` org-name i JSON-LD) — verifisere at org.nr. er registrert/korrekt | `app/layout.tsx` | [ ] REQUIRES PRODUCTION VERIFICATION |
| 10 | Ingen juridiske garantier gis i dette dokumentet — punktene ovenfor krevr verifisering fra George/advokat | — | — |

## Test Coverage Gaps

| # | Gap | Foreslått dekning | Status |
|---|---|---|---|
| 1 | Velkomst-e-posttekst (P1-1) | Test som assert e-post ikke inneholder «ingen bilder»/«ingen navn» etter omskriving | [ ] NOT DONE |
| 2 | 21+-synlighet i landing/registrering (P1-5) | E2E: 21+ i rendret HTML på `/` og `/register` | [ ] NOT DONE |
| 3 | Religion gjensidig kompatibilitet (P1-7) | TEST R-01…R-12 (se PD-3/testplan) | [ ] NOT DONE |
| 4 | Kroppsform-fjerning (P2-8) | Onboarding-test uten kroppsform; profil-setup-test uten `bodyType` | [ ] NOT DONE |
| 5 | UploadThing-fjerning (P1-3) | `grep`-guard i CI (0 treff) + eksisterende chat-bilde-tester (M-6) | [ ] NOT DONE |
| 6 | Merkenavn-guard (P1-2) | CI-test: «ToSom» i brukerrettet tekst = feil (unntaksliste) | [ ] NOT DONE |
| 7 | Retensjon-kron med flagg på (P2-1) | Kjør `lib/retention` mot test-DB med flagg på (finnes som test? — verifisere) | [ ] NOT DONE |
| 8 | `politicsImportance`-bruk (ukjent formål) | Avgjøre produktmessig, deretter test | [ ] PRODUCT DECISION |
| 9 | Journey-cron N+1 (P3-8) | Ingen funksjonell gap; effektivitet — ingen test nødvendig nå | [ ] NOT DONE (P3) |
| 10 | MatchHistory (P3-1) | Avgjøre: skriv historikk eller fjern modell | [ ] NOT DONE (P3) |

## Product Decisions

Alle produktavgjørelsene under er besluttet av George (eier) 23.10.2026 og dokumentert her som bindende arbeidsgrunnlag for neste ACT-fase.

### PD-1 · Kanonisk merkenavn: «Tosom»

**Beslutning:** `Tosom` er den kanoniske skrivemåten for merkenavnet i all brukerrettet tekst og metadata.

**Standardiseringsområde (senere, neste ACT — ikke global replace i én patch):**

| Kategori | Filer (kjente treff for «ToSom» i dag) |
|---|---|
| E-poster | `lib/email/index.ts` (alle signaturer + «Velkommen til ToSom» + «Din ToSom-konto») |
| Offentlige sider | `app/priser/page.tsx`, `app/vilkar/page.tsx`, `app/faq/page.tsx`, `app/cookies/page.tsx`, `app/trygghet/page.tsx`, `app/tilgjengelighet/page.tsx`, `app/hvorfor/page.tsx` |
| Innlogging/dashboard | `app/settings/page.tsx`, `app/dashboard/components/DashboardNavBar.tsx` |
| Onboarding | (verifisere treff i `app/onboarding/*` ved implementering) |
| Chat | `app/chat/components/{BliKjentPanel,MoodsPanel,OppgaverPanel}.tsx`, `app/chat/data/tasks.ts` |
| Varslinger | (verifisere treff i `app/api/notifications/*` ved implementering) |
| Metadata | `app/layout.tsx` (verifisere — tittel/metadata kan allerede si «Tosom») |
| Juridiske sider | dekket under «Offentlige sider» |
| Footer | `components/ui/layout/Footer.tsx` (verifisere) |
| Dokumentasjon | kun der dokumentasjonen beskriver merkevaren (ikke der den sitrer historikk) |

**Unntak (endres IKKE automatisk på grunn av merkenavnet):**

- Tekniske navn: pakkenavn `tosom` (`package.json`), databasenavn, env-var-nøkler (t.ex. `DATABASE_URL`, `UPLOADTHING_*`, `CRON_SECRET`), historiske migrasjonsnavn, Sentry-projektnavn, CI/CD-nøkler.
- Domene: `tosom.no` / `www.tosom.no` (teknisk verdi, ikke merkenavn-tekst).
- Sted der store bokstaver er bevisst brukt i en teknisk verdi (t.ex. i kodelogge).
- Historiske dokumenter (git-historikk, gammel sjekkliste) endres ikke.

**Implementeringspunkt neste ACT (konkret):**

1. `grep -rn "ToSom" app components lib styles` → full treffliste (base for patchene).
2. Én patch per fil (max ~5 filer per patch), kun brukerrettet tekst + metadata.
3. Etter hver patch: `tsc --noEmit` + `verify:lang` (merk: språkvakten må oppdateres hvis «ToSom» står på en hvitliste).
4. Ny CI-guard-test: `__tests__/brand-name.test.ts` — feiler på «ToSom» i `app/components/lib` utenom en dokumentert unntaksliste.
5. Sluttkontroll: `grep -rn "ToSom" app components lib styles` = kun unntakslisten; `jest` grønn; build.

**Status:** [ ] NOT DONE (beslutning tatt)

### PD-2 · Samlet beslutningsregister (23.10.2026)

| ID | Område | Beslutning | Prioritet |
|---|---|---|---|
| PD-1 | Merkenavn | Kanonisk: **Tosom** | P1 (P1-2) |
| PD-3 | Religion/livssyn | Beholdes + **gjensidig hard kompatibilitetsregel** (opptil 4 aksepterte + «Åpen for alle»-alternativ) | **P1** (P1-7) |
| PD-4 | Kroppsform | **REMOVE CANDIDATE** — slutt å samle fra nye brukere før lansering; databaserydding eventuelt kontrollert etter lansering | P2 (P2-8) |
| PD-5 | Høyde | **RETAIN** — ingen fjerning, ingen regelendring uten separat produktbeslutning | P2-5 (lukket) |
| PD-6 | Vipps | **OPEN / PENDING BEFORE PUBLIC LAUNCH** — ingen midlertidige løsninger, ingen redesign | P1 (P1-4) |
| PD-7 | UploadThing | P1-3 beholdes; fullt kartlagt i denne fasen; slettes i neste ACT (dødt og ikke-koblet) | P1 (P1-3) |

### PD-3 · Religion og livssyn — gjensidig hard kompatibilitetsregel (P1)

**Beslutning (23.10.2026):** Religion og livssyn beholdes og **skal brukes i kompatibilitetskontrollen**. Dette er et bevisst produktvalg fordi religion/livssyn kan være svært viktig i valg av partner og i et langsiktig forhold. Brukeren kan velge **opptil fire** religioner/livssyn vedkommende er åpen for hos en partner. Alternativ brukeren ikke har valgt skal som hovedregel **ikke** være gyldige matchalternativer. Et enkeltvalg respekteres selv om det reduserer antallet mulige matcher og kan gi lengre ventetid — dette behandles som et bevisst brukerkrav, ikke et svakt poengsignal.

#### 3.1 Eksisterende tilstand (kartlagt, bevis)

| Element | Tilstand i dag | Bevis |
|---|---|---|
| Onboarding-felt | «Religion / livssyn» i steg 1: **egen** religion/livssyn («Velg opptil fire som beskriver deg»), 11 alternativer (Kristen, Katolsk, Agnostiker, Ateist, Muslim, Jehovas-vitne, Hindu, Jødedom, Buddhist, Spirituell, Annet), `maxSelected={4}` | `app/onboarding/steps/Step1Profile.tsx:442-462` |
| «Åpen for alle»-alternativ | **Finnes ikke i dag** — de 11 alternativene er konkrete religioner/livssyn | samme sted |
| Lagring — egen religion | `Profile.deepProfileData.religion` (kommaseparert streng, t.ex. «Kristen,Muslim») | `app/api/profile/setup/route.ts:229` |
| Lagring — aksepterte religioner | **Finnes ikke i dag** | — |
| `religionImportance` | Slider 1–10 (legacy-felt) — samles, lagres i `deepProfileData.religionImportance`, **brukes ikke** i scoring | `onboarding-setup.ts:292`, `profile/setup/route.ts:231` |
| Server-validering | `religion: optStr()` + superRefine: maks 4 kommaseparerte valg (PL-27) | `lib/validation/onboarding-setup.ts:57,68-75` |
| Klient-validering | `OnboardingSelectGrid maxSelected={4}` (blokkerer 5. valg i UI) | `Step1Profile.tsx:460` |
| Bruk i matching | **Ingen** (kun en feilaktig kommentar) | `lib/matching/dimensions.ts:358` |
| Prefill | `toOnboardingData` leser `deepProfileData.religion` tilbake | `lib/profile/toOnboardingData.ts` |
| Oppsummering | Vises i steg 9 med label-mapping | `Step9Oppsummering.tsx:38` |
| Eksport | Følger med automatisk (hele `Profile` eksporteres) | `app/api/settings/export/route.ts:73` |

**Konklusjon om «åpen»-alternativ (spørsmål 5):** Eksisterende datamodell dekker **ikke** behovet for «alle / ingen preferanse / åpen for alle». Det må derfor etableres et tydelig alternativ: **«Åpen for alle religioner og livssyn»**. Dette alternativet må **ikke** behandles som en bestemt religion — det betyr at brukeren ikke vil ekskludere noen på dette grunnlaget.

#### 3.2 Datamodell (forslag — ikke implementert)

| Felt | Type | Semantik |
|---|---|---|
| `deepProfileData.religion` (eksisterende) | kommaseparert streng, maks 4 | **Egen** religion/livssyn (behoves for at andre skal kunne akseptere deg). Uendret. |
| `deepProfileData.acceptedReligions` (ny) | kommaseparert streng, maks 4, eller tom | Religioner/livssyn brukeren **aksepterer hos partner**. |
| «Åpen for alle» | Eget boolesk flagg `religionOpen` i `deepProfileData` | Eksklusivt med de 11 konkrete alternativene i `acceptedReligions`. Valg: `religionOpen: boolean` + eksklusiv valg-logikk i UI (tydeligst, unngår verdi-kollisjon i JSON). |

**Migrasjonsbehov:** **Ingen DDL-migrasjon nødvendig** — begge feltene ligger i den eksisterende `deepProfileData`-Json-kolonnen (additive JSON-nøkler, som mønsteret `workType`/`housingType`/`highPriority` allerede bruker). Valg av typet felt med egen kolonne kan vurderes post-launch (da med migrasjon + rollback).

#### 3.3 Kompatibilitetsregel (produktlogikk)

En match er gyldig kun dersom **begge**:

1. **A aksepterer B:** alle B-s egen-valg (`religion`) finnes i A sin `acceptedReligions`. Omvendt: hvis A har valgt «åpen for alle» (`religionOpen`), aksepterer A uansett B sin religion.
2. **B aksepterer A:** symmetrisk — alle A-s egen-valg finnes i B sin `acceptedReligions`, eller B er «åpen for alle».

Regelen kjører som **hard kompatibilitetskontroll før scoring** (dealbreaker-laget). En høy matchscore kan aldri overstyre manglende gjensidig aksept. Dersom begge retninger passerer, betyr det bare at religion/livssyn **ikke diskvalifiserer** paret — paret skal fortsatt gjennom resten av kompatibilitetskontrollen og scoring, og matches ikke automatisk.

**Eksempel fra beslutningen:** A: egen=muslim, aksepterer=[muslim, kristen]. B: egen=kristen, aksepterer=[kristen]. → A godtar B (kristen ∈ A), B godtar ikke A (muslim ∉ B) → **ingen match** (avvises før scoring).

**Kontrollspørsmål (Q-1):** En bruker kan ha opptil fire *egen*-religioner («røtter i flere tradisjoner»). Forkastes paret dersom bare **én** av B-s egen-valg mangler i A sin akseptliste? **Forslag:** ja — alle B-s egen-valg må være aksepterte av A (eller A er åpen). Årsak: brukeren har selv markert disse som sine; å gjette at «den viktigste» er den første, er ikke forsvarlig. **Må bekreftes av George før implementering.**

#### 3.4 Tomt valg og gamle profiler (trygg fallback, R-09)

- `acceptedReligions` er **tom** og `religionOpen` er false/avst (t.ex. gammel profil fra før funksjonen, eller bruker som ikke har besvart det nye spørsmålet): **religion diskvalifiserer ingen** for denne brukeren («ingen preferanse satt» — systemet gjetter ikke ønsker).
- Dersom kun **én side** har akseptvalg: kun den siden kan forkaste paret på religion; den andre siden (tom) forkaster aldri.
- Fallbacken må være **eksplisitt kodet og testet** (R-09), ikke en implisitt «empty array = true».

#### 3.5 Brukertekster (forslag, tone i tråd med ToSom)

- Nytt spørsmål (steg 1, etter «Religion / livssyn» som beskriver deg):
  > **Hvilke religioner eller livssyn er du åpen for hos en partner?**
  > [De 11 alternativene + «Åpen for alle religioner og livssyn» (eksklusivt valg)]
- Hjelpetekst (kort og respektfull — konsekvens uten press; utgangspunktet er Georges tekst, tilpasset):
  > «Du kan velge opptil fire religioner eller livssyn du er åpen for hos en partner. Jo færre alternativer du velger, desto færre mulige matcher kan vi finne. Vi respekterer valgene dine og kobler deg ikke med noen utenfor dem.»
- Teksten presenterer **ett valg ikke som feil** — brukeren har rett til å være tydelig selv om det gjør matching vanskeligere.
- **Må gjøres i samme patch:** fjern/erstatt «Ulik tro gjør ikke en match mindre aktuell» (T-3) — setningen blir falsk ved innføringen.
- Verifisere at hjelpeteksten passer med eksisterende `mikroguiding`-mønster i `OnboardingSelectGrid` (designkonsistens).

#### 3.6 Implementeringsplan — filer som antakelig må endres (ikke endret i denne fasen)

| # | Fil | Endring |
|---|---|---|
| 1 | `app/onboarding/steps/Step1Profile.tsx` | Nytt `OnboardingSelectGrid`-spørsmål (aksepterte religioner, `maxSelected={4}`, eksklusivt «Åpen for alle»-valg), ny hjelpetekst, oppdatering av eksisterende religionstekst (T-3) |
| 2 | `app/onboarding/OnboardingFlow.tsx` | Type/initial state/payload for `acceptedReligions` + `religionOpen` |
| 3 | `app/onboarding/steps/Step9Oppsummering.tsx` | Vis aksepterte religioner i oppsummering (ny label-mapping inkl. «Åpen for alle») |
| 4 | `lib/validation/onboarding-setup.ts` | Server-validering: maks 4 i `acceptedReligions`; eksklusivitet mellom `religionOpen` og konkrete valg; kun kjente verdier |
| 5 | `app/api/profile/setup/route.ts` | Lagre `acceptedReligions` + `religionOpen` i `deepProfileData` (additive nøkler) |
| 6 | `lib/profile/toOnboardingData.ts` | Prefill av nye felt |
| 7 | `lib/matching/dealbreaker.ts` | Ny `checkReligionCompat(a, b)` (gjensidig, hard); kobles inn i `sjekkAlleDealbreakers` |
| 8 | `lib/matching/cheapFeatures.ts` | Precompute av religion-data + kobling i `cheapSjekkAll` (mål: identisk avgjørelse som `dealbreaker` — ekvivalens-test) |
| 9 | `lib/matching/scoreRound.ts` | Ny `REJECT_REASON_KEYS`-nøkkel `religion` |
| 10 | `lib/matching/dimensions.ts` | Fjern/rett den feilaktige kommentaren (linje 358) |
| 11 | `app/samtykke/page.tsx` | Verifisere/utvide art.-9-samtykkes tekst: religion/livssyn brukes i matching (hard kompatibilitetsregel) |
| 12 | `app/personvern/page.tsx` | Beskriv religion/livssyn i formålstabellen (matching, art. 9, eksplisitt samtykke) |
| 13 | `app/api/cron/matching/route.ts` | Ingen endring nødvendig (kjører `scoreRound`) — verifisere i test |
| 14 | Admin | `rejectReasons` vises allerede i matching-rounds-panelet; ny nøkkel `religion` vises automatisk (verifisere i `lib/admin/*`) |
| 15 | `e2e/onboarding.spec.ts` (mønster) | E2E: nytt spørsmål i onboarding-flyten |
| 16 | Ny `__tests__/religion-compat.test.ts` | TEST R-01…R-12 (se testplan) |
| 17 | Eksisterende tester | `matching-score-round.test.ts` (ekvivalens), `onboarding-religion-barn-pl27.test.ts` (maks 4), `prod-smoke-profile-save.test.ts`, `profile-setup-save.test.ts` (nye payload-nøkler) |
| 18 | `docs/ACT-STATE.json`, dette dokumentet | Oppdater status etter leveranse |

**Koblingsrekkefølge (neste ACT):**
1. Onboarding + validering + lagring (brukere kan svare; matching endres ikke ennå — trygg del 1).
2. `checkReligionCompat` i `dealbreaker`/`cheapFeatures` + `scoreRound`-nøkkel + tester (del 2).
3. Tekster (samtykke + personvern) + admin-verifisering + E2E (del 3).

**Håndtering av endring i køen (R-11):** Matching-runden leser levende `Profile`-data hver runde — en bruker som endrer preferanser via profil/opprettelsesflyten før neste runde, brukes i neste runde automatisk. Krever at profil-endringsruten (profile/setup) tillater endring av `acceptedReligions` for eksisterende brukere (verifisere at ruten håndterer det; i dag er den «first-write» — avgjørelse: tillater re-svar).

#### 3.7 Personvernkonsekvenser (ingen juridiske garantier — krevr verifisering)

- Religion/livssyn er en **sensitiv personopplysning** (GDPR art. 9). Eksisterende basis: uttrykkelig samtykke via `sensitiveConsentAt` (K-2) — verifisere at samtykkesiden dekker religion i matching før lansering.
- **Databehandling:** samles i onboarding, lagres i `deepProfileData` (Neon), brukes i matching (dealbreaker), vises **ikke** i partnerprofil/chat (kun interne avgjørelser), eksporteres i dataeksporten, slettes med konto.
- **Tilgang:** kun matching-kron + admin-panelet ser avvisningsnøkkel `religion` (aggreget, uten verdier). **Religionsverdier skal ikke logges i `SystemLog`** (PII-vern) — kun nøkkel + antall.
- **Sletting:** kontosletting (K-1) sletter profilen; retensjon/anonymisering (P2-1) gjelder reiser; religion ligger i profilen — slettes kun ved kontosletting (dokumentere i personvern).
- **Avklaring (G-11, ny):** verifisere med advokat at art.-9-samtykketeksten dekker «bruk i matching som hard kompatibilitetsregel» + at personvernsiden oppdateres (PRIVACY_VERSION-bump) før lansering.

#### 3.8 Testplan for religion/livssyn (minstekrav)

| Test | Scenario | Forventet |
|---|---|---|
| **R-01** | Begge godtar hverandres religion (A: egen=kristen, aksepterer=[kristen, muslim]; B: egen=muslim, aksepterer=[muslim, kristen]) | Paret går videre til scoring (religion forkaster ikke) | [x] PASS — `__tests__/religion-compat-dealbreaker.test.ts` R-01 |
| **R-02** | A godtar B, men B godtar ikke A (A: egen=muslim, aksepterer=[muslim, kristen]; B: egen=kristen, aksepterer=[kristen]) | Paret avvises før scoring (`rejectReasons` inneholder `religion`) | [x] PASS — EKSEMPEL 1 (ingen match) + R-02 (reason-retning) |
| **R-03** | B godtar A, men A godtar ikke B (speglet R-02) | Paret avvises før scoring | [x] PASS — `cheapSjekkAll`/`sjekkAlleDealbreakers` er byttsymmetriske (ekvivalens-testen kjører begge retninger på alle tilfeller) |
| **R-04** | Ingen av dem godtar den andres religion | Paret avvises før scoring | [x] PASS — R-03 |
| **R-05** | Bruker velger bare én akseptert religion | Kun denne religionen aksepteres (andre forkastes) | [x] PASS — R-04 (én valg i begge lister) |
| **R-06** | Bruker velger fire aksepterte religioner | Alle fire aksepteres | [x] PASS — R-05 (fire i begge lister, én snittverdi avgjør) |
| **R-07** | Bruker forsøker å velge fem religioner | Klient (`maxSelected`) og server (zod-superRefine) avviser valget på en tydelig måte; test på begge nivåer | [x] PASS — klient: `OnboardingSelectGrid maxSelected=4` (eksisterende komponentatferd); server: valideringstest «avviser fem» |
| **R-08** | Bruker velger «Åpen for alle religioner og livssyn» (eksisterer etter PD-3) | Religion diskvalifiserer ingen kandidater for denne brukeren (i begge matching-retninger der denne er den aksepterende siden) | [x] PASS (Phase 1.5, 23.10.2026) — implementert som eksplisitt `deepProfileData.religionOpen: true` (UI: 12. eksklusivt alternativ i aksept-grid; teknisk distinkt fra MISSING — tom liste blokkerer fortsatt aldri, R-09). Tester R-13–R-17 |
| **R-09** | Gammel profil mangler religionspreferanser (tom `acceptedReligions`, ingen `religionOpen`) | Systemet bruker den eksplisitt definerte trygge fallbacken: religion forkaster ikke for denne brukeren. Ikke gjette ønsker | [x] PASS — R-07 + R-08 (mangler akseptliste, mangler begge felt) |
| **R-10** | Høy score, men inkompatibel religionspreferanse | Paret avvises — scoring kan ikke overstyre regelen (test med maksimal psykoscore + religion-avvisning) | [x] PASS — R-09 (scoreRound med minScore=0: 0 par, `rejectReasons.religion === 1`) |
| **R-11** | Bruker endrer religionspreferansene etter å ha gått inn i køen | Neste matchingrunde bruker de oppdaterte og validerte valgene (test: lagre profil, kjør runde, bekrefte nytt resultat) | [x] PASS (logisk) — R-10: samme egen religion, endret akseptliste før/desetter runde gir motsatt avgjørelse; cron leser levende `Profile`-data hver runde (`prisma.user.findMany include profile`) |
| **R-12** | Begge har samme religion, men den ene har ikke inkludert denne religionen blant aksepterte alternativer (t.ex. begge muslim; B aksepterer kun [kristen]) | **MÅ AVKLARES** — dagens onboarding gjør scenarioet mulig (aksept-spørsmålet er uavhengig av «egen»-spørsmålet). Definer eksplicit produktlogikk og dekk med test. **Forslag:** streng regel (akseptlisten er autoritativ — ingen implisitt selv-aksept) + ei ikke-preserende UI-hinvisning dersom egen religion mangler i akseptlisten; «Åpen for alle» er utveien. Alternativ: implisitt selv-aksept (egen religion legges automatisk til akseptlisten ved lagring). **Status: [ ] PRODUCT DECISION** | [x] AVKLART 23.10.2026: **streng regel** (låsavgjørelse #5: akseptlisten er autoritativ; samme religion ≠ automatisk aksept). Implementert og testet: R-11 (avvises). UI-hinvisning: [x] IMPLEMENTERT (Phase 1.5 — `getReligionSelfAcceptHint`, rolig info-tekst under aksept-grid; ikke feil, ikke obligatorisk, ikke auto-valgt; skjules når «Åpen for alle» er valgt eller akseptlisten ikke er svart; håndterer flere egne verdier. Testet R-18–R-20) |

**Ekstra tester (kvalitet):**
- Ekvivalens: `cheapSjekkAll` og `sjekkAlleDealbreakers` gir identisk religion-avgjørelse (mønsteret fra eksisterende ekvivalens-tester).
- `scoreRound`-ekvivalens: par som forkastes på religion, opptrer aldri som match (uansett score).
- E2E onboarding: nytt spørsmål, maks 4, eksklusivt «Åpen for alle», oppsummering viser valgene.

#### 3.9 Åpne avklaringer før implementering

| ID | Spørsmål | Forslag | Status |
|---|---|---|---|
| Q-1 | Partner med flere egen-religioner (opptil 4 «røtter»): må aksepterende side godta **alle** eller kun **én**? | Alle (3.3) | [x] BESLUTTET 23.10.2026: **kun én** — låsavgjørelse #4 (låsavgjørelse #3 definerer regelen som snitt ≠ ∅) |
| Q-2 | R-12: streng akseptregel vs. implisitt selv-aksept | Streng + UI-hinvisning (3.8) | [x] BESLUTTET 23.10.2026: **streng regel** (låsavgjørelse #5). UI-hinvisning: [x] IMPLEMENTERT (Phase 1.5 — `getReligionSelfAcceptHint` i `lib/onboarding/religionSelfAccept.ts`, testet R-18–R-20) |
| Q-3 | Skal `religionImportance` (legacy-slider) beholdes, fjernes, eller gis en rolle? | Fjerne fra innsamling i samme patch som religion-regelen (brukes i dag; slideren er misvisende når hardregel finnes) | [x] BESLUTTET + GJORT 23.10.2026 (låsavgjørelse #8): fjernet fra aktiv innsamling (Phase 1C — feltet ble aldri samlet inn: ingen slider renderes; onboarding-payload, prefill og valideringsdefault er nå rene; `deepProfileData.religionImportance` i DB urørt). Kartlegging: ingen bruk i matching (`lib/matching`), ingen annen aktiv produktlogikk |
| Q-4 | Kan `politicsImportance` (samme legacy-mønster) behandles likt? | Avgjørelse i tråd med Q-3 | [x] BESLUTTET + GJORT 23.10.2026 (Phase 1.5): bekreftet dødt felt (spørres ikke, vises ikke, brukes ikke i matching) — fjernet fra AKTIV onboarding-datastrøm (type/initialData/payload i `OnboardingFlow.tsx`, prefill i `toOnboardingData.ts`, skriving i setup-ruten begge grener). Valideringsskjemaet beholder feltet som valgfritt slik at gamle payloads/profiler håndteres uten runtime-feil. Ingen DB-rydding, ingen migrasjon, ingen endring av politikk-kompatibilitet (det finnes ingen slik i dag; ikke konkludert med at politikk skal til/fjernes) |

#### 3.10 Implementeringsrapport — Phase 1 (23.10.2026)

**Datastruktur (endelig):**
- `Profile.deepProfileData.religion` (kommaseparert, opptil 4) — brukerens EGEN religion/livssyn (uforandret).
- `Profile.deepProfileData.acceptedReligions` (kommaseparert, opptil 4, VALGFRI) — religioner/livssyn brukeren er åpen for. Ny, additiv nøkkel — ingen Prisma-DSL-/DDL-endring.

**Matching-logikk (endelig):** Religion kjører som **dealbreaker (hard filter) FØR scoring** i både `sjekkAlleDealbreakers` (full) og `cheapSjekkAll` (prekalkulert), med byte-identiske reason-strenger (ekvivalens verifisert). Én retning: `accepter` blokkeres dersom `acceptedReligions ∩ target.religion = ∅`. Paret er kompatibel bare hvis begge retninger passerer. Avvisningsnøkkel: `religion` (M-12-teller i `scoreRound`, observert via `rejectReasons`/metrikker).

**Avvik mot PD-3-planen (dokumentert):**
1. **Ingen `religionOpen`-verdi** — låsavgjørelse #7: eksisterende modell har ingen «åpen for alle»-semantikk; ny datamodell krevde STOPP. Feltet `acceptedReligions` er i stedet valgfritt; tom/manglende akseptliste betyr «ingen religion-begrensning» (trygg fallback, ingen gjeting). Et eksplisitt «Åpen for alle»-UI-alternativ (R-08) krever egen avgjørelse.
2. **R-12 avgjort streng** (låsavgjørelse #5) — samme religion uten eksplisitt aksept = inkompatibel. UI-hinvisning om egen religion i akseptlisten implementeres IKKE i denne fasen (ikke-preserende tekst — kan vurderes som lav prioritet; ingen logikk-avhengighet).

**Legacy/profiler med manglende data:** Accepter uten `acceptedReligions` (alle eksisterende brukere) → religion blokkerer IKKE for denne siden. Target uten `religion` → kan ikke evalueres → blokkerer IKKE. Ingen eksisterende bruker blir plutselig utestengt fra matching av regelen, og ingen preferanse gjettes. Nye brukere får spørsmålet i onboarding (valgfritt); ved re-inngang pre-fylles akseptlisten.

**Personvern (kartlagt, endret minimalt):**
- Samtykke (`/samtykke`, art. 9): dekker ALLEREDE religion uttrykkelig — «Jeg samtykker til at Tosom bruker svarene mine om religion, hvem jeg søker, nærhet og trygghet — kun for å finne én match til meg.» Ingen endring nødvendig.
- Personvernerklæring: religion er ALLEREDE listet under sensitive opplysninger (pkt. 4). Ingen endring nødvendig.
- Logging: avvisningsnøkkelen `religion` logges kun som nøkkel + antall (SystemLog/metrikk) — religionsVERDIER havner aldri i `SystemLog`. Den transiente reason-strengen (som inneholder religioner) finnes kun i minne i match-runden, samme som alle andre dealbreakers. Verifisert i `app/api/cron/matching/route.ts`.
- Admin: `lib/admin/data.ts` eksponerer IKKE `deepProfileData` — religion er ikke synlig. Uforandret.
- Eksport: `/api/settings/export` eksporterer `profile` via `findUnique` MEN kun utvalgte felt — `deepProfileData` ble IKKE inkludert. **FIXET I PHASE 1.5** (se 3.11): eksporten inneholder nå brukerens egen `deepProfileData` som «Dypprofil» + `sensitiveConsentAt`/`withdrawalWaiverAt` under «Konto» (samme klasse teknisk utelatelse — eksporten eksporterte allerede `termsAcceptedAt`). Verifisert med integrasjonstest (egen data eksporteres, andres ikke, 401 uten innlogging, legacy uten dypprofil → null).
- Sletting: kontosletting sletter profilen inkl. `deepProfileData` — uforandret.

**Kvalitetssjekk (23.10.2026):** `tsc --noEmit` OK · `next lint` (rørte mapper) OK · `verify:lang` OK (833 filer) · full jest-suite: **649 passed, 1 skipped (prod-smoke, avventer miljø), 0 failed** — inkl. 28 nye religion-tester (R-01–R-12 + 2 produkt-eksempler + ekvivalens + validering).

#### 3.11 Implementasjonsrapport — Phase 1.5 (23.10.2026)

**Mandater (låste produktavgjørelser):** «Åpen for alle» som eksplisitt tilstand (R-08), R-12 UX-hjelp, legacy-fallback ubehandlet, `politicsImportance`-rydding (dødt felt), dataexport-audit, verifisering av `bodyType`/`religionImportance`-endringene fra Phase 1, R-13–R-20-tester.

**1) «Åpen for alle» — teknisk representasjon (endelig):**
- `Profile.deepProfileData.religionOpen` — **boolean `true`** (additiv JSON-nøkkel, ingen Prisma-/DDL-endring; i tråd med PD-3-vals #5).
- UI: 12. alternativ «Åpen for alle religioner og livssyn» (🌍, hjelpetekst «Religion eller livssyn avgjør ikke hvem jeg er åpen for.») i aksept-grid i steg 1. Eksklusivt: å velge det fjerner konkrete valg, og omvendt. UI-sentinel `OPEN_TO_ALL` mappes til `religionOpen: true` + tom `acceptedReligions` i `OnboardingFlow`-payload; setup-ruten har forsvar i dybden (normaliserer sentinel dersom en gammel klient likevel sender den).
- Server-validering: `religionOpen: z.boolean().optional()`; `OPEN_TO_ALL` i `acceptedReligions` avvises dersom det er kombinert med andre verdier.
- Prefill: `toOnboardingData` pre-fyller `religionOpen: '1'` kun når flagget er `true` i DB; ellers pre-fylleres det IKKE (put hopper over undefined).

**2) MISSING vs. OPEN TO ALL (teknisk distinkte tre tilstander):**

| Tilstand | Representering | Matching (aksepterende side) |
|---|---|---|
| A. MISSING (legacy/ikke svart) | verken `religionOpen` eller `acceptedReligions` (eller tom) | ingen religion-begrensning (trygg fallback — ingen gjeting; **ikke** «åpen for alle» semantisk) |
| B. OPEN TO ALL | `religionOpen === true` | aksepterer uansett religion (Bs preferanser gjelder fortsatt) |
| C. VALG | `acceptedReligions` 1–4 verdier | snitt med target sin egen religion (minst én verdi) |

Tom streng/kun manglende felt tolkes aldri som OPEN TO ALL — distinksjonen er om `religionOpen`-feltet er tilstede og `true` (R-17, testet i matching + prefill-serialisering).

**3) Matching-adferd:** `checkReligionOneWay` (dealbreaker.ts) og `religionOneWay` (cheapFeatures, pre-beregnet `religionOpen`) har identisk semantik: `religionOpen === true` → aksepterer uansett; ellers som før. Kjører som hard dealbreaker FØR scoring; begge retninger må passere. Ekvivalens testet med 4 nye par (R-13/14/15/OPEN+legacy).

**4) R-12 UX-hint:** `lib/onboarding/religionSelfAccept.ts` (`getReligionSelfAcceptHint`) — ren funksjon, renderes som rolig info-tekst (muted, ℹ️) under aksept-grid i steg 1 når egen religion/livssyn mangler i den eksplisitte akseptlisten. Informasjon — ikke feil, ikke obligatorisk, ikke auto-valgt, ikke manipulerende; håndterer flere egne verdier (avdekker kun de som mangler); skjules ved OPEN TO ALL og ved manglende akseptliste. Onboarding kan fullføres uansett; matchinglogikken er uavhengig (R-19).

**5) R-13–R-20 — resultater:** R-13 PASS (A open aksepterer B) · R-14 PASS (FAIL på lukket B-side, reason peker på B) · R-15 PASS (begge open) · R-16 PASS (legacy-missing blokkerer aldri) · R-17 PASS (MISSING ≠ OPEN, matching + serialisering) · R-18 PASS (hint vises; flere-egne-verdier-variant; versal/mellomrom-robust) · R-19 PASS (hint er ren — identisk avgjørelse før/etter) · R-20 PASS (ingen hint ved OPEN TO ALL). Edge cases: OPEN+legacy begge sider, OPEN over liste (forsvar i dybden), maks 4 + eksklusivitet i validering, versaler/mellomrom, tom/manglende data. Ekvivalens: 4 nye par.

**6) politicsImportance:** Bekreftet dødt felt (grep: ingen render, ingen matching-bruk, kun defaults/payload/prefill/lagring). Fjernet fra aktiv strøm: `OnboardingFlow.tsx` (type, initialData, payload), `toOnboardingData.ts` (prefill), setup-ruten (skriving begge grener). Valideringsskjemaet beholder feltet som valgfritt (gamle payloads/profiler håndteres uten runtime-feil). Ingen DB-rydding, ingen migrasjon, ingen endring av politikk-kompatibilitet (det finnes ingen slik i dag; ikke konkludert med at politikk som kompatibilitetsområde skal til eller fjernes).

**7) bodyType (verifisert, Phase 1B intakt):** Spørsmålet og oppsummeringsfeltet er borte; payload krever ikke bodyType; valideringen holder `optStr()` slik at eldre payloads lagres uten feil. Ingen destruktiv DB-endring. Dekket av eksisterende tester (`profile-setup-save`, `toOnboardingData` med `bodyType` i fixture).

**8) religionImportance (verifisert, Phase 1C intakt):** Ingen slider renderes; ikke i aktiv payload/prefill; ingen matching-avhengighet (kun døde referanser i legacy `questions.ts` + testfixtures); gamle profiler håndteres. Ingenting endret i Phase 1.5.

**9) Legacy-profiler:** Sikre fallback videreført og ubehandlet: manglende `acceptedReligions`/`religionOpen` blokkerer ikke, tolkes ikke som OPEN TO ALL, fylles ikke automatisk, gjettes ikke (R-16, R-17). **Åpent forbedringspunkt (etter lansering, ikke i denne fasen):** re-consent/re-onboarding for eksisterende brukere slik at de eksplisitt besvarer religion/livssyn — produktavgjørelse.

**10) Dataexport-audit (`/api/settings/export`):**

| Datasett | Status |
|---|---|
| Konto (navn, e-post, telefon, telefon/identitet verifisert, medlemskap, vilkår) | [x] EXPORTED (eksisterende) |
| Samtykker: `termsAcceptedAt` | [x] EXPORTED (eksisterende) |
| Samtykker: `sensitiveConsentAt` (art. 9), `withdrawalWaiverAt` | [x] EXPORTED (FIXET i Phase 1.5 — teknisk utelatelse, samme klasse som `termsAcceptedAt`) |
| Profil: navn, alder, kallenavn, bio, interesser, postnummer/posisjon, bilde, relasjonsstil, lifeSituation/lifestyle/personality/communication/intimacy/futureVision/boundaries/emotionalNeeds | [x] EXPORTED (eksisterende) |
| `deepProfileData` (religion, akseptliste, OPEN TO ALL, alders-/avstandspreferanser, relasjonsstil, kommunikasjonskår) | [x] EXPORTED (FIXET i Phase 1.5 som «Dypprofil» — funksjonen deklarerer «alle personopplysninger» og henter hele profilen; feltet ble utelatt ved teknisk utelatelse. Kun brukerens EGEN data via `findUnique({ where: { userId } })` — ingen andres data, ingen secrets, ingen interne ID-er) |
| `preferences` (livsstil 2026-velger) | [x] EXPORTED (eksisterende) |
| Journey-data (fase, dag, milepæler) | [x] EXPORTED (eksisterende) |
| Egne meldinger (senderId = brukeren) | [x] EXPORTED (eksisterende) |
| Varsler (notifikasjoner) | [x] EXPORTED (eksisterende) |
| Egne rapporter | [x] EXPORTED (eksisterende) |
| Matches/matchhistorikk (egen del: score, status) | [ ] REQUIRES DECISION — ikke eksportert. Innholder egne matching-resultater, men også referanser til andre brukere; omfanget (egen score/status vs. full historikk) er en juridisk/produktavgjørelse. Dokumentert, ikke improvisert |
| Blokkeringer (egne UserBlock-poster) | [ ] REQUIRES DECISION — brukerens egne blokkeringer finnes i DB; ikke eksportert. Krever avgjørelse (refererer til andre brukere) |
| Konversations-metadata (partnere) | REQUIRES DECISION — eksporten holder bevisst partner-PII ute i tråd med prinsippet om at interne ID-er ikke inkluderes; juridisk avgjørelse om det skal mer |
| Onboarding-utkast (`onboardingDraft`) | NOT APPLICABLE — transient underveis, ryddet ved fullføring |
| 2FA-sekret, passord-hash, sessions | NOT APPLICABLE — tekniske sikkerhetsverdier hører ikke i art. 20-uttrekk (bevisst utelatt) |

**Export-fiks (utført):** `app/api/settings/export/route.ts` — `sensitiveConsentAt` + `withdrawalWaiverAt` i user-select + «Konto»; nytt «Dypprofil»-felt med brukerens egen `deepProfileData` (null hvis mangler). Formatet forblir forståelig/stabilt (norske nøkkelord, JSON-attachment). **Testet** (`__tests__/integration/export-deepprofile.test.ts`, ekte test-DB): 401 uten innlogging; egen dypprofil eksporteres komplett; andres dypprofil/PII finnes ikke i uttrekket; interne ID-er ikke inkludert; art. 9-samtykke eksportert; legacy uten dypprofil → null. **Ikke-juridisk konklusjon:** hva som *skal* eksporteres (matches, blokkeringer, conversations) krever fortsatt juridisk vurdering — de punktene står åpne.

**11) Kvalitetssjekk (23.10.2026):** `tsc --noEmit` = 0 feil · `next lint` OK (ingen warnings) · `verify:lang` OK (835 filer) · full jest-suite: **672 passed, 1 skipped (prod-smoke, avventer miljø — pre-eksisterende), 0 failed** (73 suiter, 1 skippet) — inkl. 23 nye/utvidede tester (R-13–R-20, ekvivalens +4 par, prefill/serialisering, export-integrasjon ×3, validering).

### PD-4 · Kroppsform — REMOVE CANDIDATE (P2-8)

**Beslutning (23.10.2026):** Kroppsform vurderes fjernet. Begrunnelse: Tosom skal ikke samle inn kroppsform uten et tydelig og nødvendig produktformål.

**Full kartlegging (bevis):**

| Spørsmål | Svar | Bevis |
|---|---|---|
| Hvor spørres den om? | Onboarding steg 1, «Kroppstype», 5 alternativer (Slank, Gjennomsnittlig, Atletisk, Kraftig, Myk) | `app/onboarding/steps/Step1Profile.tsx:389-402` |
| Hvor lagres? | `Profile.lifestyle.bodyType` (JSON-nøkkel i `lifestyle`-kolonnen) | `app/api/profile/setup/route.ts:151,271` |
| Brukes i matching? | **Nei** — ingen referanser i `lib/matching/*`, `lib/match/*`, psykoskoring | grep (0 treff) |
| Vises til andre brukere? | **Nei** — ikke i `partnerProfile.ts`, ikke i chat/match-API-svar | grep (0 treff) |
| Brukes i admin? | **Nei** | grep (0 treff) |
| Brukes i analytics? | **Nei** | grep (0 treff) |
| Finnes i eksport? | **Ja** — dataeksporten henter hele `Profile` (inkl. `lifestyle`-JSON) | `app/api/settings/export/route.ts:73` |
| Finnes i testdata? | **Ja** — 4 tester med `bodyType` i fixtures | `__tests__/{psychometrics-scoring,prod-smoke-profile-save,profile-setup-save,toOnboardingData}.test.ts` |
| Aktive valideringsschema? | **Ja** — `bodyType: optStr()` i profile-setup-schemat | `lib/validation/onboarding-setup.ts:54` |
| Prefill/oppsummering? | Ja — `toOnboardingData.ts:85` + `Step9Oppsummering.tsx:156` | — |
| Død kode? | `app/onboarding/data/questions.ts:26` (legacy `step1Data`) | — |
| Krever fjerning migrasjon? | **Nei** for «slutt å samle» (JSON-nøkkel, ingen DDL). Eksisterende data ligger i `lifestyle`-JSON hos eksisterende brukere | — |
| Skal gamle data slettes? | Anbefaling: **slutt å samle inn + slutte å skrive**; eventuell rydding av eksisterende JSON-verdier post-launch som kontrollert, bakoverkompatibel JSON-opdatering (ingen destruktiv DDL) | — |

**Anbefaling:** **REMOVE** — feltet samles inn uten bruk og uten tydelig formål. Minstekrav før offentlig lansering: slutt å samle fra nye brukere.

**Sikker fjerningsrekkefølge (neste/etterfølgende ACT, ikke i denne fasen):**
1. Onboarding: fjern «Kroppstype» fra `Step1Profile.tsx` (og `OnboardingFlow.tsx` type/state/payload) + `Step9Oppsummering.tsx`.
2. Validering: fjern `bodyType` fra `onboarding-setup.ts`.
3. Lagring: fjern `bodyType` fra `profile/setup/route.ts` (skriv ikke lenger JSON-nøkkelen).
4. Prefill: fjern fra `toOnboardingData.ts`.
5. Tekster: oppdater personvern/FAQ dersom kroppsform nevnes (verifisere treff).
6. Tester: oppdater de 4 fixture-testene (fjern `bodyType`).
7. Død kode: `questions.ts` (P3-2) — fjernes med i ryddingspatch.
8. **Valgfritt post-launch:** kontrollert rydding av eksisterende `lifestyle.bodyType`-verdier (JSON-opdatering, dry-run først, rollback = ingen DDL å rulle tilbake — verdier er irreversibelt slettet, derfor post-launch og kun etter at ny innsamling er avskåret).

**Rollback (trinns 1–7):** éen git-revert av patchen; ingen datatap (eksisterende verdier røres ikke i trinn 1–7).

**Status:** [ ] NOT DONE (kartlagt; implementering i neste ACT, trinn 1–7; trinn 8 post-launch)

### PD-5 · Høyde — RETAIN (P2-5)

**Beslutning (23.10.2026):** Høyde **beholdes**. Ikke fjern høydefeltet. Ikke fjern høyderegelen i denne fasen.

**Dokumentasjon:**
- Høydefelt: onboarding steg 1 «Høyde (cm)» (`Step1Profile.tsx:380-387`), lagres i `lifestyle.height`, valideres som tall.
- Høyderegel (D-1): `lib/matching/dealbreaker.ts:166-190` (`checkHeightRule`) — kun par med én mann og én kvinne; ukjent høyde blokkerer aldri; regel er dokumentert i `docs/ACT-PIPELINE-v1.0.md` (beslutning D-1).
- Test: `__tests__/livsstil2026-dealbreaker.test.ts` (gjensidighet, kjønnsbetingelse, ukjent høyde).
- **Gjensidighet og konsekvenser skal verifiseres ved neste matching-tilnærming:** regelen er symmetrisk (kjører på paret, ikke per bruker), og konsekvensen er at par som ikke oppgir høyde aldri blokkeres — verifiser at dette fortsatt er ønskelig atferd (ingen endring foreslått).
- **Regelen skal ikke endres uten en separat produktbeslutning.**
- Høyde og kroppsform er **ikke** samme type informasjon: høyde beholdes (PD-5), kroppsform vurderes fjernet (PD-4).

**Status:** [x] PRODUCT DECISION: RETAIN HEIGHT (verifisering av konsekvenser: [ ] NOT DONE — ingen kodeendring)

### PD-6 · Vipps — OPEN / PENDING BEFORE PUBLIC LAUNCH (P1-4)

**Beslutning (23.10.2026):** Vipps er under ferdigstilling. Status: **OPEN / PENDING BEFORE PUBLIC LAUNCH**.

**Restriksjoner for denne fasen:**
- Bygg **ikke** midlertidige betalingsløsninger.
- Redesign **ikke** prisflyten.
- Fjern **ikke** Vipps permanent fra produktplanen.

**Når Vipps-integrasjonen er ferdig, skal følgende verifiseres (ikke implementert i denne fasen):**

| # | Verifiseringspunkt |
|---|---|
| 1 | Korrekt pris (349 kr / 34900 NOK) — samsvar mellom landing, `Order`-modellen og Vipps-sesjon |
| 2 | Vellykket betaling → kvote/tilgang gis, bestilling registreres |
| 3 | Avbrutt betaling → ingen tilgang, ingen kvotetap (rullende tilbakegiving) |
| 4 | Mislykket betaling → ingen tilgang, feilmelding, kvote gis tilbake |
| 5 | Dobbeltbetaling → avvises/håndteres (idempotens) |
| 6 | Idempotens → `WebhookEvent`-modellen (eksisterer) håndterer dupliserte webhook-kall |
| 7 | Kvote → betalende bruker slipper gratis-kvote-grensen (5 000) |
| 8 | Tilgang etter betaling → reise kan startes, dashboard oppdatert |
| 9 | Kvittering → e-post/belegg |
| 10 | Personvern → hvilke data deles med Vipps, DPA signert, vilkår oppdatert |
| 11 | Refusjon / feilhåndtering → dokumentert prosedyre |
| 12 | Produksjonskonfigurasjon → Vipps env-varer, `PAYMENTS_ENABLED`-guarden i `config/features.ts` heves kun etter verifisert produksjonsbetaling |

**Status:** [ ] PRODUCT DECISION: OPEN / PENDING · [ ] REQUIRES PRODUCTION VERIFICATION (alt ovenfor, når integrasjonen er klar)

### PD-7 · UploadThing — P1-3, fullt kartlagt, slettes i neste ACT (P1-3)

**Beslutning (23.10.2026):** P1-3 beholdes som P1. I denne fasen: dokumentasjon kun. I neste ACT-fase: fjerne løsningen — forutsetningen er at det er bevist at den ikke brukes av aktiv kode (bevist i kartleggingen under).

**Kartlegging (full, bevis):**

| Element | Detail | Bevis |
|---|---|---|
| Rute | `app/api/uploadthing/core.ts` — fileRouter `image` + `chatImage` (uploadthing v6, `createUploadthing` fra `uploadthing/next`) | filen, linje 1 |
| Rute koblet? | **Nei** — ingen `app/api/uploadthing/[...uploadthing]/route.ts` (catchall) finnes. Uten denne er ikke endepunktet live i Next.js (404) | `find app/api/uploadthing -type f` → kun `core.ts` |
| Komponent | `components/ImageUpload.tsx` — bruker `UploadButton` (fra `utils/uploadthing.ts`) mot `chatImage`, **uten** dag-15-lås, med ugyldig send-body | filen |
| Komponent i bruk? | **Nei** — null imports av `ImageUpload` noe sted i `app/` eller `components/`. `ChatContainer.tsx:332` har sin egen inline `handleImageUpload` (går via `/api/chat/image` — den aktive, låsfedde veien) | grep |
| Utility | `utils/uploadthing.ts` — `generateUploadButton<OurFileRouter>()` (importerer `core.ts`) | filen |
| Health | `app/api/system/health/route.ts:62-78` — leser `UPLOADTHING_TOKEN` og eksponerer «configured/missing» i health-detaljer | filen |
| Env-varer | `UPLOADTHING_TOKEN` / `NEXT_PUBLIC_UPLOADTHING_TOKEN` / `UPLOADTHING_SECRET` (valgfri i `config/env.ts:45`; konfigurert i prod ifølge GEORGE.md) | `config/env.ts`, GEORGE.md |
| Dependencies | `uploadthing ^6.13.3`, `@uploadthing/react ^6.8.0` i `package.json` | `package.json` |
| Tester | Ingen referanser i `__tests__`/`e2e` | grep |

**Hva som kan slettes (neste ACT):**
1. `app/api/uploadthing/core.ts`
2. `utils/uploadthing.ts`
3. `components/ImageUpload.tsx`
4. Dependencies: `uploadthing`, `@uploadthing/react`
5. UploadThing-blokk i `app/api/system/health/route.ts` (linjene 62, 76-78)
6. Env-varer i Vercel (George, etter deploy av 1–5)

**Slik verifiseres sletting:**
- `tsc --noEmit` = 0 feil (fanger manglende imports)
- `jest --ci` grønn (chat-bilde-tester M-6/R2 uendret)
- `grep -rn "uploadthing" app components utils lib config` = 0 treff
- `next build` = 69/69 sider
- Prod: `/api/system/health` uten uploadthing-nøkkel; `/api/uploadthing/*` = 404 (både før og etter — bekrefter at intet gikk tapt)

**Status:** [ ] NOT DONE (sletting i neste ACT) · [ ] REQUIRES PRODUCTION VERIFICATION (at live-deploy mangler catchall — bekreftes ved sletting eller rutesett-inspeksjon)

## Implementation Plan

Neste ACT-fase (etter godkjenning av dette dokumentet og avklaring av Q-1…Q-4). **Ikke i denne fasen.**

### Phase 1 — Tillitstekster og merkenavn (lavest risiko, først)

| # | Task | Punkter | Verifisering |
|---|---|---|---|
| 1.1 | Omskriv velkomst-e-post (fjern «ingen bilder»/«ingen navn»-lovnader, beskriv faktisk produkt) | P1-1, T-1 | Ny test (e-posttekst) + lesing |
| 1.2 | Synlig 21+-erklæring på landing + registrering | P1-5 | E2E: 21+ i rendret HTML |
| 1.3 | Standardiser merkenavn «Tosom» (én patch per fil, maks ~5 filer/patch) | P1-2, PD-1, T-2 | grep-guard-test + `verify:lang` |
| 1.4 | Rett venteromstekst «kl. 04:00» → faktisk tidsrom | P3-3, T-4 | Lesing |
| 1.5 | (Valgfritt her) «ders»→«hvis» i match-e-post | P3-5, T-5 | Lesing |

### Phase 2 — Data-hygiene (kroppsform + UploadThing)

| # | Task | Punkter | Verifisering |
|---|---|---|---|
| 2.1 | Fjern kroppsform fra innsamling (trinn 1–7 i PD-4) | P2-8, PD-4 | Onboarding-test uten `bodyType`; profil-setup-test |
| 2.2 | Slett UploadThing (PD-7-listen) | P1-3, PD-7 | grep 0 treff + tsc + jest + build |
| 2.3 | Fjern død kode: `AgeRequirement.tsx` (om ikke gjenbrukt i 1.2), `app/onboarding/data/questions.ts` | P3-2 | tsc + jest |
| 2.4 | Sitemap/robots/metadata til kanonisk host `www.tosom.no` | P2-7, P2-9, SEO | curl alle URL-er i prod |

### Phase 3 — Religion/livssyn (P1-7, PD-3) — kun etter Q-1…Q-4

| # | Task | Punkter | Verifisering |
|---|---|---|---|
| 3.1 | Onboarding: nytt aksept-spørsmål + «Åpen for alle» + hjelpetekst + rett T-3 (del 1 av PD-3.6) | P1-7 | E2E onboarding |
| 3.2 | Validering (klient + server) + lagring + prefill (del 1) | P1-7 | R-07 (server), R-05/R-06 (klient) |
| 3.3 | `checkReligionCompat` i `dealbreaker`/`cheapFeatures` + `scoreRound`-nøkkel (del 2) | P1-7 | R-01…R-12, R-10, ekvivalens |
| 3.4 | Samtykke- + personverntekster (PRIVACY_VERSION-bump) + admin-verifisering (del 3) | P1-7, G-11 | Lesing + admin-panel |
| 3.5 | (Avhenger Q-3/Q-4) Fjern/behold `religionImportance`/`politicsImportance` | Q-3, Q-4 | Tester |

### Phase 4 — Prod-ops (George)

| # | Task | Punkter |
|---|---|---|
| 4.1 | Rotér `DATABASE_URL` | P1-6 (G-04) |
| 4.2 | «Glemt passord»-e-posttest i prod | P1-6 (G-02) |
| 4.3 | DMARC `p=none` → vurder oppgradering; verifiser DKIM/SPF | P1-6 (G-08) |
| 4.4 | Slett test1/test2-kontoer (dry-run klar) | P1-6 |
| 4.5 | Slå på `RETENTION_ENABLED` (etter test-DB-verifisering) | P2-1 |
| 4.6 | Bekrefte `BETA_MATCH_EMAIL`-flagg i prod | P1-6 |
| 4.7 | Fjern `UPLOADTHING_*` env-varer i Vercel (etter 2.2) | PD-7 |
| 4.8 | Vipps: avgjøre prislovet på landing (beholde/mynke) | P1-4 |

**Rekkefølgerasjonalitet:** Phase 1 (tekst/tillit) → Phase 2 (hygiene, lite risiko) → Phase 3 (matching-berørende, trenger avklaringer) → Phase 4 (prod, parallelt med 1–3).

## Regression Test Plan

| # | Område | Tester | Status |
|---|---|---|---|
| 1 | Baseline (før første endring) | `tsc --noEmit` (0), `jest --ci` (621), `verify:lang` (832 filer) | [x] VERIFIED (23.10) |
| 2 | Velkomst-e-post | Ny test: e-post inneholder ikke «ingen bilder»/«ingen navn»; inneholder «dag 15»/faktisk lovnader | [ ] NOT DONE |
| 3 | 21+-synlighet | E2E: `/` og `/register` renderer «21+» | [ ] NOT DONE |
| 4 | Merkenavn | `__tests__/brand-name.test.ts` (guard) + grep-manuelt | [ ] NOT DONE |
| 5 | Kroppsform | Onboarding-flow-test uten `bodyType`; `profile-setup-save`-test uten felt; eksport-test uten `bodyType` for nye profiler | [ ] NOT DONE |
| 6 | UploadThing | grep-guard (0 treff); eksisterende M-6/R2-tester uendret og grønn | [ ] NOT DONE |
| 7 | Religion | R-01…R-12 + ekvivalens + E2E (PD-3.8) | [ ] NOT DONE |
| 8 | Matching-regressjon (generelt) | Eksisterende `matching-score-round.test.ts`, `livsstil2026-dealbreaker.test.ts`, `psychometrics-scoring.test.ts` grønn etter alle endringer | [ ] NOT DONE (kjøres per patch) |
| 9 | Journey/chat-regressjon | `chat-image-lock-m6`, `photo-lock-before-day15`, journey-tester grønn (berøres ikke direkte, men kjøres per patch) | [ ] NOT DONE (kjøres per patch) |
| 10 | Full regression før lansering | `tsc` + `jest` + `verify:lang` + `next build` + manuell E2E (2 kontoer) i prod-tilnærming | [ ] NOT DONE |

## Production Verification

Kun read-only-verifisering fra prod (ingen skrive-handlinger mot prod i denne fasen). Alle punkter under er for George / neste kontrollerte fase.

| # | Sjekk | Metode | Status |
|---|---|---|---|
| 1 | Prod er live og frisk | `GET https://www.tosom.no` = 200; `GET /api/system/health` = 200 `{status:'ok'}` | [x] VERIFIED (23.10) |
| 2 | Landing-rendering | Visuell + HTML: hero, pris-tekst, footer «© 2026 Tosom» | [x] VERIFIED (23.10) |
| 3 | Sitemap-URL-er gir 200 | `curl -I` per URL i `app/sitemap.ts` | [ ] REQUIRES PRODUCTION VERIFICATION |
| 4 | `tosom.org.no` vs. `www.tosom.no` — hvilket eies, hvilket er kanonisk | Domene-inspeksjon (George) | [ ] REQUIRES PRODUCTION VERIFICATION |
| 5 | `DATABASE_URL` rotert | George, etter rotasjon | [ ] REQUIRES PRODUCTION VERIFICATION |
| 6 | «Glemt passord»-e-post lander i prod | Registrer testkonto, forespør reset, bekreft mottak | [ ] REQUIRES PRODUCTION VERIFICATION |
| 7 | DMARC `p=none` — status + plan | DNS-inspeksjon (George) | [ ] REQUIRES PRODUCTION VERIFICATION |
| 8 | `BETA_MATCH_EMAIL`-verdi i prod | Vercel env-inspeksjon (George) | [ ] REQUIRES PRODUCTION VERIFICATION |
| 9 | `RETENTION_ENABLED`-verdi i prod + dry-run av anonymisering mot test-DB | Vercel env + test-DB-kjøring | [ ] REQUIRES PRODUCTION VERIFICATION |
| 10 | Kvote-stand (5 000) i prod | Admin-panel (George) | [ ] REQUIRES PRODUCTION VERIFICATION |
| 11 | Migrasjoner applikert i prod (inkl. `20261005212832_add_sensitive_consent`) | `prisma migrate status` mot prod | [ ] REQUIRES PRODUCTION VERIFICATION |
| 12 | test1/test2-kontoer slettet | Admin-panel (George) | [ ] REQUIRES PRODUCTION VERIFICATION |
| 13 | Vipps-integrasjon status | George (PENDING) | [ ] PRODUCT DECISION: OPEN / PENDING |
| 14 | DPA/DPIA signert (V-9) | George/advokat | [ ] REQUIRES PRODUCTION VERIFICATION |
| 15 | Org.nr./firmaadresse i metadata/footer | George (P2-7, Legal #8/#9) | [ ] REQUIRES PRODUCTION VERIFICATION |
| 16 | UploadThing-catchall finnes ikke i live-deploy | Rutesett-inspeksjon eller bekreftes ved sletting (PD-7) | [ ] REQUIRES PRODUCTION VERIFICATION |

## Final Launch Checklist

**Regel:** «Før lansering» = blokkerer offentlig lansering. «Kan utsettes» = krever Georges eksplisitte godkjenning for å utsettes.

### F1 · Tillit og tekst

| | Punkt | Ref | Prioritet |
|---|---|---|---|
| [ ] | Velkomst-e-post beskriver faktisk produkt (P1-1-tekst inn + test) | P1-1, T-1 | **Før lansering** |
| [ ] | Merkenavn «Tosom» standardisert + CI-guard (P1-2) | P1-2, PD-1 | **Før lansering** |
| [ ] | 21+-grense synlig på landing + registrering (P1-5) | P1-5 | **Før lansering** |
| [ ] | Venteromstekst rett (P3-3) | P3-3 | Kan utsettes (lav) |
| [ ] | «Investorer»-påstand verifisert eller myket (P3-4) | P3-4 | **Før lansering** (påstand) |
| [ ] | Sosiale-medie-knapper: lenker eller fjernet | Public #12 | Kan utsettes |

### F2 · Data-hygiene

| | Punkt | Ref | Prioritet |
|---|---|---|---|
| [x] | Kroppsform samles ikke lenger inn fra nye brukere (PD-4 trinn 1–7) | P2-8 | **Før lansering** (minstekrav) |
| [x] | Dataexport dekker `deepProfileData` + art. 9-samtykke (teknisk utelatelse fixet, testet mot test-DB) | 3.11 | **Før lansering** (matches/blokkeringer/konversjoner: [ ] REQUIRES DECISION — juridisk) |
| [ ] | UploadThing fjernet (PD-7) | P1-3 | **Før lansering** |
| [ ] | Død kode fjernet (`AgeRequirement`, `questions.ts`) | P3-2 | Kan utsettes |
| [ ] | Sitemap/metadata til kanonisk host | P2-7, P2-9 | **Før lansering** (SEO+tro) |
| [ ] | Analytics-strip av PII (P2-4) | P2-4 | **Før lansering** |

### F3 · Religion/livssyn

| | Punkt | Ref | Prioritet |
|---|---|---|---|
| [x] | Q-1…Q-4 avklart (alle fire besluttet 23.10.2026 — se PD-3.9) | PD-3.9 | **Før implementering** (ferdig) |
| [ ] | Religion: gjensidig hard kompatibilitetsregel levert (Phase 3) | P1-7 | **Før lansering** (eller bevisst nedgradering til P2 + stopp av innsamling) |
| [x] | R-01…R-20 grønne (inkl. Phase 1.5: OPEN TO ALL R-13–R-17, R-12 UX-hint R-18–R-20) | PD-3.8, 3.11 | **Før lansering** |
| [ ] | Samtykke-/personverntekst oppdatert (art. 9, religion i matching) | P1-7, G-11 | **Før lansering** |
| [ ] | «Ulik tro gjør ikke en match mindre aktuell» fjernet (T-3) | P1-7 | **Før lansering** (følger regel) |

### F4 · Betalinger

| | Punkt | Ref | Prioritet |
|---|---|---|---|
| [ ] | Vipps: avgjørelse om prislovet på landing (beholde/mynke) | P1-4 | **Før lansering** |
| [ ] | Vipps-integrasjon verifisert (PD-6-liste, 12 punkter) | P1-4 | **Før betalingsstart** (kan lanseres med kvote først) |

### F5 · Prod-ops (George)

| | Punkt | Ref | Prioritet |
|---|---|---|---|
| [ ] | `DATABASE_URL` rotert | P1-6 | **Før lansering** |
| [ ] | «Glemt passord» e-posttest i prod | P1-6 | **Før lansering** |
| [ ] | DMARC verifisert | P1-6 | **Før lansering** |
| [ ] | `RETENTION_ENABLED` på (P2-1) | P2-1 | **Før lansering** (personvern-lovnader) |
| [ ] | `BETA_MATCH_EMAIL` avgjort | P1-6 | Kan utsettes (flagg er av) |
| [ ] | test1/test2 slettet | P1-6 | Kan utsettes |
| [ ] | DPA/DPIA signert | Legal #5 | **Før lansering** |
| [ ] | Org.nr. + firmaadresse på plass | Legal #8/#9 | **Før lansering** |
| [ ] | Migrasjoner applikert i prod | Production #11 | **Før lansering** |

### F6 · Full regression

| | Punkt | Ref | Prioritet |
|---|---|---|---|
| [ ] | `tsc --noEmit` = 0 | Regression #10 | **Før lansering** |
| [ ] | `jest --ci` grønn (alle suiter) | Regression #10 | **Før lansering** |
| [ ] | `verify:lang` grønn | Regression #10 | **Før lansering** |
| [ ] | `next build` grønn (alle sider) | Regression #10 | **Før lansering** |
| [ ] | Manuell E2E i prod: 2 kontoer → onboarding → match → reise → chat (dag 1 + dag 15-lås) | Regression #10 | **Før lansering** |
| [ ] | Helse-endepunkt + sitemap 200 i prod | Production #3 | **Før lansering** |

---

**Sluttbegrunnelse:** Med Phase 1–3 levert, F1–F6 avkrysset og Georges prod-sjekk (P1-6) gjennomført, er Tosom i stand til å fly. Tilstanden i dag (23.10) er **CONDITIONAL GO** — ingen P0, men P1-punktene (P1-1…P1-7) må lukkes eller bevisst nedgraderes før offentlig lansering.

*Dokumentet er avsluttet. Neste steg: Georges godkjenning av Q-1…Q-4 + eksplisitt godkjenning til å starte Phase 1.*


