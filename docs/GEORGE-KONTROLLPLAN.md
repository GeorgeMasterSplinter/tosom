# GEORGE — DIT KONTROLLPLAN (enkelt versjon)

**Sist oppdatert: 15.10.2026 · Commit: `2c71372`**
**For:** Kun George. Dette er alt som er *ditt* — agentene (Cline/Qwen) gjør sin egen del.
Én post om gangen, i rekkefølgen her. Uten stress.

---

## Slik bruker du dette dokumentet

1. Gjør postene i rekkefølgen. Hopp over det du allerede har gjort.
2. Ferdig = kryss av **her** og i `LanseringsCheckList.md` §6 (samme punkt).
3. Si så «ferdig — [nummer]» til Cline, så verifiserer og krysser av Cline.
4. Forstår du ikke en post: spør. Cline forklarer uten fagstoff.

**Live status:** `/admin` → **Systemstatus** — grønt/gult/rødt for DB, Pusher m.m.
Daglig 2–5 min: se `GEORGE.md` §8 «Daglig drift».

---

## A. Gjør disse først (de låser opp resten)

### 1. Push til GitHub (G-01)
- **Hva:** Koden skal ut på GitHub — da deployes samtykke-migrasjonen automatisk mot prod.
- **Ferdig når:** `prisma migrate status` mot prod viser alle migrasjoner applied.

### 2. Test «Glemt passord» i prod (G-02)
- **Hva:** På tosom.no: Glemt passord → e-posten kommer → sett nytt passord.
- **Ferdig når:** Du har logget deg inn med det nye passordet.

### 3. Roter `DATABASE_URL` + `NEXTAUTH_SECRET` (G-04)
- **Hva:** Begge regnes som lekket: database-URLen ble delt i chat 03.09, og begge
  verdiene ligger også i ren tekst i filen `.env.prod` **på PC-en** (filen er ikke
  på GitHub — bekreftet — men en styrt/tappet PC gir tilgang).
- **Hvordan:**
  1. Neon: ny connection string → sett i Vercel **og** GitHub Secrets → redeploy.
  2. Generer nytt `NEXTAUTH_SECRET` (f.eks. `openssl rand -hex 32`) → sett i Vercel → redeploy.
     Merk: alle blir logget ut én gang — det er ment (beta, få brukere).
  3. Slett `.env.prod` og `.env` fra PC-en (eller skriv over verdiene med tomme).
- **Ferdig når:** Nye verdiene virker, gamle er deaktivert, og filene på PC-en er borte.

### 4. Sjekk reisedagene i databasen (G-03)
- **Hva:** At aktive reiser har riktig dag, og begge partnere er i synk.
- **Ferdig når:** Du har sjekket 2–3 reiser i admin-panelet og de stemmer.
  *(Koden er rettet (PL-06) — du verifiserer i prod.)*

## B. Vercel — alt på én gang

### 5. Samlet Vercel-kontrollpunkt (G-12 + flere)
- **Hva:** Vercel → Settings → Environment Variables (Production). Gå gjennom
  **10-posters-listen** i `RestSjekkliste.md` §2.6: admin-hemmeligheter satt,
  `DEV_LOGIN_ENABLED` false, `PAYMENTS_ENABLED` false, `ENABLE_CSRF_PROTECTION` true,
  `BETA_MATCH_EMAIL` true, e-post-verdier, `DATABASE_URL` rotert, migrate status, cron.
- **Ferdig når:** Alle 10 radene stemmer.

### 6. DMARC (G-08)
- **Hva:** Legg til DMARC i Cloudflare DNS — start med `p=none` (observerer, blokkerer ikke).
- **Ferdig når:** TXT-posten ligger i Cloudflare.

### 7. Test support@ (G-09)
- **Hva:** Send en test-e-post til support@tosom.no og svar på den.
- **Ferdig når:** Den lander og du kan svare.

## C. Juridisk og adresse

### 8. Advokat (G-07)
- **Hva:** Tekstene i `docs/legal/` (DPA, DPIA, vilkår, personvern) skal gjennom
  advokat + signatur.
- **Ferdig når:** Advokaten har levert dokumentene tilbake.

### 9. Forretningsadresse (G-07) — ✅ FERDIG 15.10
- **Status:** Forretningsadressen (TOSOM AS, Henrik Ibsens gate 90, 0255 Oslo) er
  **registrert i Foretaksregisteret 15.10** (ref. 2026 0075 4800 82) og **publisert**
  i vilkår, footer og kontakt-siden (etter din ordre). Privat adresse er og blir
  ikke publisert. Advokaten (post 8) bekrefter kun utformingen.
- **Merk:** Vilkårene er bumpet til versjon 2026-10-15 — eksisterende brukere får
  en rolig om-aksept ved neste innlogging (systemets normale mekanisme).

## D. Manuell testing (noen timer totalt)

### 10. Telefoner og nettlesere (G-17 + G-18)
- **Hva:** Gå gjennom innlogging, onboarding og chat på iPhone + Android + desktop.
- **Ferdig når:** Ingen konsollfeil, ingenting er ødelagt, Lighthouse ≥ 95 på
  `/`, `/login`, `/onboarding`.

### 11. CI grønn (G-23)
- **Hva:** Etter siste push: GitHub Actions — lint, tsc, lang, jest, e2e, build.
- **Ferdig når:** Siste kjøring er grønn.

## E. Sikkerhet og backup

### 12. Sentry (G-14)
- **Hva:** Se feil de siste 14 dagene.
- **Ferdig når:** Ingen uløste kritiske feil — eller de er sendt til Cline som oppgaver.

### 13. Gjenopprett en backup én gang (G-13)
- **Hva:** En backup som aldri er prøvd gjenopprettet, er ikke en backup.
  Ny automatisk backup + ny runbook er på vei (agentsak). Da blir dette en øvelse
  på ~10 minutter.
- **Ferdig når:** Du har gjenopprettet en backup til en testdatabase og den ser rett ut.

### 14. Slett testbrukerne (G-11)
- **Hva:** Rett før Vipps: dry-run først, deretter `--apply` (kommandoene står i
  `RestSjekkliste.md` §2.5).
- **Ferdig når:** Ny dry-run finner 0 brukere.

### 15. `Vary: Accept-Encoding` (G-26, nytt 13.10)
- **Hva:** Én curl-kommando (står i `RestSjekkliste.md` §2.5) — bekreft at
  headeren er på plass hos Vercel/Cloudflare.
- **Ferdig når:** Headeren står i responsen.

## F. Etter første lørdag

### 16. Score- og nivåfordeling (G-19)
- **Hva:** Etter første ekte matcherunde: gå gjennom score- og nivåfordelingen i
  admin-panelet.
- **Beslutning:** Kun analyse — **ingen justering** av motoren (DI-2).

---

## hva agentene gjør nå (du trenger ikke gjøre noe med dette)

- Fikse «Matcherunde uteble»-varslet (feil terskel — varslene har vært falske,
  matcherunden har kjørt lørdag som den skal).
- Utvide «Systemstatus» i admin: bilder (R2), ekte chat-kontroll (Pusher),
  e-post, live-brytere og siste backup.
- Backup: automatisk daglig database- + ukentlig bildebackup + ny runbook
  (gamle `deploy/backup.md` beskriver en gammel server og skal skrives om).
- Oversikt over matchmotoren: kvalitet på paring, vurdering og nivå — før lørdag.

**Tempoet er ditt.** Ta den posten som er enklest i dag.
