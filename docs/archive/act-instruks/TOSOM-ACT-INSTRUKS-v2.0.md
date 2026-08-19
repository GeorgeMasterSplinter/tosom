# TOSOM-ACT-INSTRUKS-v2.0

**Kilde:** `docs/TOSOM-PLATTFORMDIAGNOSE-v1.0.md`
**Mål:** Denne instruksen skal brukes av Qwen (eller annen ACT-modell) til å rette ALLE funn fra diagnosen, ett atomisk steg om gangen, uten å tape kontekst — ved hjelp av en persistert tilstandsfil.

---

## 0. IKKE-FORHANDLINGSBARE REGLER (les FØRST, følg ALLTID)

1. **Du skal ALDRI utføre mer enn ETT steg per ACT-kommando.** Ett steg = én atomisk endring i én fil (eller ett skjema-felt). Ikke hopp videre til neste steg selv om løsningen er "enkel".
2. **Du skal ALLTID vente på uttrykkelig bekreftelse fra brukeren** før du starter neste steg.
3. **Etter HVERT steg skal du ALLTID køre, i denne rekkefølgen:**
   - `npx tsc --noEmit` (Sjekk 1)
   - Det konkrete grep-søket angitt i steget (Sjekk 2)
   - `npm run build` (Sjekk 3)
   - Oppdater `/docs/ACT-STATE.json` (State-oppdatering)
4. **Du skal ALLTID arbeide i patch-skisse-format.** Patch-skissene i denne instruksen er IKKE ferdige kodeendringer — de er beskrivelser av hva som skal endres. Du skriver den faktiske koden selv, basert på skissen og gjeldende filinnhold.
5. **Du skal ALLTID sitere filankere (fil:linje)** før du gjør en endring, og bekrefte at linjenummeret fortsatt stemmer i faktisk fil (filer kan ha forskjøvet seg fra forrige steg — les filen på nytt om nødvendig).
6. **Du skal ALLTID rulle tilbake ved feil:** Hvis noen av de tre sjekkene (tsc/grep/build) feiler etter en endring, og du ikke kan fikse det innenfor SAMME steg, skal du køre rollback-kommandoen angitt i steget og sette `deviations` i state-filen, FØR du ber brukeren om veiledning. Du skal ALDRI la et rødt build/tsc-resultat stå ubeskrevet i state-filen.
7. **Du skal ALDRI gjøre endringer som ikke er beskrevet i det aktuelle steget.** Selv om du ser andre feil underveis, noter dem i `deviations` og fortsett kun med det planlagte steget (med mindre bruker uttrykkelig ber om avvik).
8. **Commit ETT steg = ETT commit.** Bruk commit-malen angitt i hvert steg. Ikke slå sammen flere steg i én commit.
9. **Hvis et steg avhenger av et tidligere steg som ikke er merket DONE i state-filen, skal du IKKE starte det steget.** Meld avvik til bruker i stedet.
10. **Du skal ALDRI legge til ekte kode i denne instruksen selv** — instruksen inneholder kun skisser. All faktisk kode skrives av deg, i target-repoet, under gjennomføring av hvert steg.

---

## 1. TILSTANDSFIL: `/docs/ACT-STATE.json`

Dette er hjernen som lar deg fortsette selv etter et kontekst-reset. FØR du gjør noe annet, sjekk om denne filen finnes:

- **Finnes den ikke** → Du er på steg 0.1. Opprett filen (se skjema under).
- **Finnes den** → Les `currentWave`, `currentStep`, `completedSteps` og `nextStep`. Fortsett NØYAKTIG fra `nextStep`. Ikke gjør steg som allerede står i `completedSteps` på nytt.

### Skjema

```json
{
  "currentWave": 0,
  "currentStep": "0.1",
  "completedSteps": [],
  "nextStep": "0.1",
  "status": {
    "tsc": "not-run",
    "grep": "not-run",
    "build": "not-run"
  },
  "deviations": [],
  "lastCommit": "",
  "updatedAt": ""
}
```

**Feltforklaring:**
- `currentWave` (number): Bølgen du jobber i nå.
- `currentStep` (string, f.eks. `"1.3"`): Steget du nettopp fullførte eller er inne i.
- `completedSteps` (string[]): Alle steg-ID-er som er FULLFØRT og bekreftet grønt (tsc/grep/build alle pass).
- `nextStep` (string): Steget som skal utføres NESTE gang.
- `status.tsc` / `status.grep` / `status.build`: `"pass"` | `"fail"` | `"not-run"` — status for SISTE kjørte steg.
- `deviations` (string[]): Fritekst-logg over alt som avvek fra planen (f.eks. "Linje 69 var faktisk linje 74 pga. tidligere endring i fil X").
- `lastCommit` (string): Commit-hash eller commit-melding for siste fullførte steg.
- `updatedAt` (string, ISO 8601): Tidsstempel for siste oppdatering.

**Etter HVERT steg** skal denne filen skrives på nytt med oppdaterte verdier — dette er en obligatorisk del av "State-oppdatering" i steg-malen.

---

## 2. STEG-MAL

Hvert steg i denne instruksen følger nøyaktig denne malen:

```
STEG X.Y — <kort tittel>
Formål: <hvorfor denne endringen gjøres>
Avhengigheter: <steg-ID som må stå i completedSteps FØR dette steget starter, eller "Ingen">
Risiko: Lav / Middels / Høy
Filanker(e): <fil:linje>
Patch-skisse: <beskrivelse av endringen — IKKE ferdig kode>
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): <konkret grep-kommando>
Sjekk 3 (build): npm run build
State-oppdatering: currentWave=X, currentStep="X.Y", completedSteps+=["X.Y"], nextStep="X.(Y+1)", status.tsc/grep/build satt iht. resultat, updatedAt=<nå>
Rollback: <git-kommando>
Commit: <commit-melding-mal>
```

**Generell rollback-kommando** (brukes med mindre annet er angitt): `git checkout -- <fil>` (for ukommiterte endringer) eller `git revert <lastCommit>` (hvis allerede committet).

**Generell build-sjekk-kommentar:** Bygg er i utgangspunktet RØDT ved start (2 kjente ESLint-feil, se Bølge 4). Dette er dokumentert i baseline (Steg 0.4). Forventet grønt bygg gjelder FØRST etter Bølge 4 er fullført. Frem til da: bruk `npm run build -- --no-lint` som Sjekk 3 der det er angitt, ELLER aksepter at build forblir rødt av KJENT årsak (dokumentert i deviations) til Bølge 4.4/4.5/4.1/4.2 er unnagjort — ikke la ukjente nye feil skjule seg i dette.

---

# BØLGE 0 — Oppsett & baseline

## STEG 0.1 — Opprett tilstandsfil
Formål: Etablere `/docs/ACT-STATE.json` som fremdriftsminne for hele instruksen.
Avhengigheter: Ingen
Risiko: Lav
Filanker(e): `docs/ACT-STATE.json` (ny fil)
Patch-skisse: Opprett filen med skjemaet fra kapittel 1, med `currentWave: 0`, `currentStep: "0.1"`, `completedSteps: []`, `nextStep: "0.2"`, alle status-felt `"not-run"`.
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): `test -f docs/ACT-STATE.json && echo "OK: fil finnes"`
Sjekk 3 (build): (Ikke nødvendig for dette steget — hopp over.)
State-oppdatering: currentStep="0.1", completedSteps=["0.1"], nextStep="0.2"
Rollback: `rm docs/ACT-STATE.json`
Commit: `chore(act): opprett ACT-STATE.json for TOSOM-ACT-INSTRUKS-v2.0`

## STEG 0.2 — Baseline tsc
Formål: Dokumentere utgangspunktet for TypeScript-feil før noen endring gjøres.
Avhengigheter: 0.1
Risiko: Lav
Filanker(e): Hele prosjektet (ingen enkeltfil)
Patch-skisse: Ingen kodeendring. Kjør `npx tsc --noEmit`, lagre output (antall feil, filer) i `deviations`-feltet i state-filen som et referansepunkt, f.eks. `"BASELINE tsc: <N> feil, se logg"`.
Sjekk 1 (tsc): npx tsc --noEmit 2>&1 | tee /tmp/baseline-tsc.log
Sjekk 2 (grep): `grep -c "error TS" /tmp/baseline-tsc.log || echo 0`
Sjekk 3 (build): (Hopp over — gjøres i 0.4)
State-oppdatering: currentStep="0.2", completedSteps+=["0.2"], nextStep="0.3", deviations+=["BASELINE tsc: <resultat>"]
Rollback: Ikke relevant (ingen filendring).
Commit: `chore(act): dokumenter baseline tsc-status`

## STEG 0.3 — Baseline grep (kjente ESLint-blokkere)
Formål: Bekrefte de 2 kjente ESLint-feilene som blokkerer build, som referanse for Bølge 4.
Avhengigheter: 0.2
Risiko: Lav
Filanker(e): `components/dashboard/WaitingForMatch.tsx:167`, `components/layout/Header.tsx:72`
Patch-skisse: Ingen kodeendring. Kjør grep for å bekrefte begge rå `<a href=`-forekomstene fortsatt finnes.
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): `grep -n "href=\"/onboarding/\"" components/dashboard/WaitingForMatch.tsx; grep -n "href=\"/\"" components/layout/Header.tsx`
Sjekk 3 (build): (Hopp over — gjøres i 0.4)
State-oppdatering: currentStep="0.3", completedSteps+=["0.3"], nextStep="0.4"
Rollback: Ikke relevant.
Commit: `chore(act): bekreft baseline ESLint-blokkere`

## STEG 0.4 — Baseline build
Formål: Dokumentere at build er RØDT ved start (kjent årsak: 2 ESLint-feil), som nullpunkt for fremdrift.
Avhengigheter: 0.3
Risiko: Lav
Filanker(e): Hele prosjektet
Patch-skisse: Ingen kodeendring. Kjør `npm run build`, forvent feil pga. de 2 kjente ESLint-feilene. Lagre resultat i `deviations`.
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): (Se 0.3)
Sjekk 3 (build): npm run build 2>&1 | tee /tmp/baseline-build.log
State-oppdatering: currentWave=1, currentStep="0.4", completedSteps+=["0.4"], nextStep="1.1", status.build="fail" (kjent/forventet), deviations+=["BASELINE build: rødt pga. 2 kjente ESLint-feil, fikses i Bølge 4"]
Rollback: Ikke relevant.
Commit: `chore(act): fullfør baseline (Bølge 0), klar for Bølge 1`

---

# BØLGE 1 — Sikkerhet, kritiske blokkere

## STEG 1.1 — Fjern/lås admin-bootstrap-bakdør
Formål: Fjerne hardkodet admin-opprettelse som utgjør en sikkerhetsbakdør i produksjon.
Avhengigheter: 0.4
Risiko: Høy
Filanker(e): `app/api/admin/setup/route.ts`
Patch-skisse: Legg til vaktklausul i toppen av handleren: returner 404/403 umiddelbart hvis `process.env.NODE_ENV === 'production'` OG `process.env.ADMIN_SETUP_TOKEN` ikke er satt eller ikke matches med timing-safe sammenligning (`crypto.timingSafeEqual`) mot en header/body-verdi. Legg også til en sjekk: hvis det allerede finnes en bruker med `role === 'ADMIN'` i databasen, avvis kallet (no-op) uansett miljø.
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): `grep -n "ADMIN_SETUP_TOKEN\|timingSafeEqual\|role.*ADMIN" app/api/admin/setup/route.ts`
Sjekk 3 (build): npm run build -- --no-lint
State-oppdatering: currentStep="1.1", completedSteps+=["1.1"], nextStep="1.2"
Rollback: `git checkout -- app/api/admin/setup/route.ts`
Commit: `fix(security): lås admin-bootstrap-bakdør bak token+miljø+no-op-sjekk`

## STEG 1.2 — Admin-autorisasjon på journey next-step
Formål: Hindre uautoriserte brukere fra å manipulere andre brukeres reise-fremdrift.
Avhengigheter: 1.1
Risiko: Høy
Filanker(e): `app/api/admin/journey/[id]/next-step/route.ts`
Patch-skisse: Legg til `requireAuth()`-kall (samme mønster som `app/api/admin/users/[id]/route.ts`) i toppen av handleren, og bekreft `session.user.role === 'ADMIN'` før noe annet gjøres. Returner 401 (uautentisert) / 403 (ikke admin) tilsvarende.
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): `grep -n "requireAuth\|role.*ADMIN\|403\|401" app/api/admin/journey/[id]/next-step/route.ts`
Sjekk 3 (build): npm run build -- --no-lint
State-oppdatering: currentStep="1.2", completedSteps+=["1.2"], nextStep="1.3"
Rollback: `git checkout -- "app/api/admin/journey/[id]/next-step/route.ts"`
Commit: `fix(security): legg til admin-autorisasjon på journey next-step-endepunkt`

## STEG 1.3 — Admin-autorisasjon på journey reset
Formål: Samme sikkerhetshull som 1.2, men for reset-endepunktet.
Avhengigheter: 1.2
Risiko: Høy
Filanker(e): `app/api/admin/journey/[id]/reset/route.ts`
Patch-skisse: Identisk mønster som Steg 1.2 — legg til `requireAuth()` + rolle-sjekk før reset-logikken kjøres.
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): `grep -n "requireAuth\|role.*ADMIN" app/api/admin/journey/[id]/reset/route.ts`
Sjekk 3 (build): npm run build -- --no-lint
State-oppdatering: currentStep="1.3", completedSteps+=["1.3"], nextStep="1.4"
Rollback: `git checkout -- "app/api/admin/journey/[id]/reset/route.ts"`
Commit: `fix(security): legg til admin-autorisasjon på journey reset-endepunkt`

## STEG 1.4 — IDOR-fiks på chat/messages
Formål: Hindre brukere fra å lese/skrive meldinger i konversasjoner de ikke er medlem av.
Avhengigheter: 1.3
Risiko: Høy
Filanker(e): `app/api/chat/messages/route.ts:12-52`
Patch-skisse: Legg til medlemskaps-sjekk mot `conversationId` FØR meldinger returneres/skrives — hent konversasjonen og bekreft at innlogget bruker sin ID finnes blant deltakerne. Speil det korrekte mønsteret i `app/api/chat/conversation/[conversationId]/route.ts`.
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): `grep -n "participant\|memberCheck\|userId ===" app/api/chat/messages/route.ts`
Sjekk 3 (build): npm run build -- --no-lint
State-oppdatering: currentStep="1.4", completedSteps+=["1.4"], nextStep="1.5"
Rollback: `git checkout -- app/api/chat/messages/route.ts`
Commit: `fix(security): fjern IDOR i chat/messages ved å kreve medlemskap i konversasjon`

## STEG 1.5 — IDOR-fiks på journey/[conversationId]
Formål: Samme klasse sikkerhetshull i det utdaterte journey-endepunktet.
Avhengigheter: 1.4
Risiko: Middels
Filanker(e): `app/api/journey/[conversationId]/route.ts`
Patch-skisse: Legg til samme medlemskaps-sjekk som i Steg 1.4, ELLER — hvis dette endepunktet bekreftes å være helt utdatert og erstattet av `/api/journey/progress` — fjern ruten helt og verifiser at ingen frontend-komponent kaller den (grep etter path-referanser i `app/`, `components/`, `hooks/`).
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): `grep -rn "journey/\[conversationId\]\|/api/journey/\${" app hooks components`
Sjekk 3 (build): npm run build -- --no-lint
State-oppdatering: currentStep="1.5", completedSteps+=["1.5"], nextStep="1.6"
Rollback: `git checkout -- "app/api/journey/[conversationId]/route.ts"`
Commit: `fix(security): fjern IDOR / fjern utdatert journey/[conversationId]-endepunkt`

## STEG 1.6 — Fjern fallback-secret i admin-JWT
Formål: Hindre at admin-JWT-signering faller tilbake til et forutsigbart/tomt secret hvis miljøvariabel mangler.
Avhengigheter: 1.5
Risiko: Høy
Filanker(e): `lib/auth/admin-jwt.ts`
Patch-skisse: Fjern fallback-verdien for secret. Legg til en eksplisitt boot-time-sjekk (etter mønster fra `config/env.ts` sin håndtering av `NEXTAUTH_SECRET`) som kaster/krasjer applikasjonen ved oppstart hvis secret-variabelen mangler, i stedet for å stille bruke en fallback i produksjonskode.
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): `grep -n "process.env" lib/auth/admin-jwt.ts | grep -v "||" `
Sjekk 3 (build): npm run build -- --no-lint
State-oppdatering: currentStep="1.6", completedSteps+=["1.6"], nextStep="1.7"
Rollback: `git checkout -- lib/auth/admin-jwt.ts`
Commit: `fix(security): fjern fallback-secret i admin-jwt, krasj ved oppstart hvis mangler`

## STEG 1.7 — Autorisasjon på relationship/timeline
Formål: Hindre uautorisert tilgang til andre brukeres relasjons-tidslinje.
Avhengigheter: 1.6
Risiko: Middels
Filanker(e): `app/api/relationship/timeline/route.ts`
Patch-skisse: Legg til `getServerSession()`-kall, bekreft innlogget bruker er medlem av relasjonen/matchen som forespørres, og legg til et Zod-skjema for eventuelle query/body-parametre.
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): `grep -n "getServerSession\|z.object" app/api/relationship/timeline/route.ts`
Sjekk 3 (build): npm run build -- --no-lint
State-oppdatering: currentStep="1.7", completedSteps+=["1.7"], nextStep="1.8"
Rollback: `git checkout -- app/api/relationship/timeline/route.ts`
Commit: `fix(security): legg til autentisering+medlemskapssjekk på relationship/timeline`

## STEG 1.8 — Autorisasjon på relationship/memories
Formål: Samme hull som 1.7, for memories-endepunktet.
Avhengigheter: 1.7
Risiko: Middels
Filanker(e): `app/api/relationship/memories/route.ts`
Patch-skisse: Identisk mønster som Steg 1.7 — `getServerSession()` + medlemskapssjekk + Zod-validering av input.
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): `grep -n "getServerSession\|z.object" app/api/relationship/memories/route.ts`
Sjekk 3 (build): npm run build -- --no-lint
State-oppdatering: currentStep="1.8", completedSteps+=["1.8"], nextStep="1.9"
Rollback: `git checkout -- app/api/relationship/memories/route.ts`
Commit: `fix(security): legg til autentisering+medlemskapssjekk på relationship/memories`

## STEG 1.9 — Lås test-login bak miljøsjekk
Formål: Hindre at test-innloggingsvei kan misbrukes i produksjon.
Avhengigheter: 1.8
Risiko: Høy
Filanker(e): `app/api/auth/test-login/route.ts`
Patch-skisse: Legg til eksplisitt sjekk FØRST i handleren: `if (process.env.NODE_ENV === 'production') return 404`. Fail closed — ingen fallback som tillater det via annen miljøvariabel uten uttrykkelig, egen flag.
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): `grep -n "NODE_ENV" app/api/auth/test-login/route.ts`
Sjekk 3 (build): npm run build -- --no-lint
State-oppdatering: currentStep="1.9", completedSteps+=["1.9"], nextStep="1.10"
Rollback: `git checkout -- app/api/auth/test-login/route.ts`
Commit: `fix(security): lås test-login-endepunkt bak NODE_ENV-sjekk (fail closed)`

## STEG 1.10 — Lås dev-login-ruter bak miljøsjekk
Formål: Samme klasse sikkerhetshull i dev-login-rutene.
Avhengigheter: 1.9
Risiko: Høy
Filanker(e): `app/api/dev-login/*/route.ts`
Patch-skisse: Legg til samme `NODE_ENV !== 'production'`-vaktklausul i toppen av HVER handler under `app/api/dev-login/`.
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): `grep -rln "NODE_ENV" app/api/dev-login`
Sjekk 3 (build): npm run build -- --no-lint
State-oppdatering: currentStep="1.10", completedSteps+=["1.10"], nextStep="1.11"
Rollback: `git checkout -- app/api/dev-login`
Commit: `fix(security): lås dev-login-ruter bak NODE_ENV-sjekk (fail closed)`

## STEG 1.11 — Fiks token-oppslag ved passordreset
Formål: Hindre timing-baserte/enumererings-angrep på reset-token-oppslag.
Avhengigheter: 1.10
Risiko: Middels
Filanker(e): `lib/auth/reset.ts:48-62`
Patch-skisse: Endre oppslaget til å filtrere direkte på den HASHEDE token-verdien (ikke iterere/sammenligne i minnet), og sikre at det finnes en unik indeks på hash-kolonnen i skjemaet (`prisma/schema.prisma`) slik at oppslaget er O(1) og constant-time via databasens indeks.
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): `grep -n "findUnique\|findFirst\|hashedToken" lib/auth/reset.ts`
Sjekk 3 (build): npm run build -- --no-lint
State-oppdatering: currentStep="1.11", completedSteps+=["1.11"], nextStep="1.12"
Rollback: `git checkout -- lib/auth/reset.ts prisma/schema.prisma`
Commit: `fix(security): filtrer direkte på hashet reset-token + unik indeks`

## STEG 1.12 — Cron-secret via header (journey)
Formål: Hindre at cron-secret lekker via logger/URL (query-param i dag).
Avhengigheter: 1.11
Risiko: Middels
Filanker(e): `app/api/cron/journey/route.ts`
Patch-skisse: Endre fra å lese secret fra query-parameter til å lese fra `Authorization: Bearer <secret>`-header. Sammenlign med `crypto.timingSafeEqual` (ikke `===`) mot forventet verdi fra miljøvariabel.
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): `grep -n "Authorization\|timingSafeEqual\|searchParams.get" app/api/cron/journey/route.ts`
Sjekk 3 (build): npm run build -- --no-lint
State-oppdatering: currentStep="1.12", completedSteps+=["1.12"], nextStep="1.13"
Rollback: `git checkout -- app/api/cron/journey/route.ts`
Commit: `fix(security): flytt cron-secret fra query-param til Authorization-header (journey)`

## STEG 1.13 — Cron-secret via header (matching)
Formål: Samme fiks som 1.12, for matching-cronen.
Avhengigheter: 1.12
Risiko: Middels
Filanker(e): `app/api/cron/matching/route.ts`
Patch-skisse: Identisk mønster som Steg 1.12.
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): `grep -n "Authorization\|timingSafeEqual\|searchParams.get" app/api/cron/matching/route.ts`
Sjekk 3 (build): npm run build -- --no-lint
State-oppdatering: currentWave=2, currentStep="1.13", completedSteps+=["1.13"], nextStep="2.1"
Rollback: `git checkout -- app/api/cron/matching/route.ts`
Commit: `fix(security): flytt cron-secret fra query-param til Authorization-header (matching), fullfør Bølge 1`

---

# BØLGE 2 — Chat, kritisk funksjonalitet

## STEG 2.1 — Fiks `chatSendMessageSchema` (Toppfunn #1)
Formål: Rette den mest kritiske funksjonelle feilen — ALLE chat-meldinger feiler i dag med HTTP 400 fordi skjemaet kun aksepterer `'user'`/`'continue_choice'`, mens UI alltid sender `'text'`/`'image'`.
Avhengigheter: 1.13
Risiko: Høy
Filanker(e): `lib/api-validator.ts:69-73`
Patch-skisse: Endre `type`-enumet i `chatSendMessageSchema` til å inkludere `'text'` og `'image'` (i tillegg til, eller i stedet for, `'user'`/`'continue_choice'` — avhengig av hva `mapMessageType()` faktisk trenger, se Steg 2.1-avhengig kode). Hvis `type === 'image'`, legg til en `content`-validering som sjekker at verdien er en gyldig URL (f.eks. `z.string().url()`) for å hindre at fritekst/XSS smugles inn via bildefeltet.
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): `grep -n "chatSendMessageSchema\|z.enum" lib/api-validator.ts`
Sjekk 3 (build): npm run build -- --no-lint
State-oppdatering: currentStep="2.1", completedSteps+=["2.1"], nextStep="2.2"
Rollback: `git checkout -- lib/api-validator.ts`
Commit: `fix(chat): rett chatSendMessageSchema til å akseptere text/image (Toppfunn #1)`

## STEG 2.2 — Fiks `mapMessageType()`-kobling
Formål: Sikre at endringen i 2.1 faktisk brukes riktig der meldingstype mappes videre til databasen/UI.
Avhengigheter: 2.1
Risiko: Middels
Filanker(e): (Finn `mapMessageType`-funksjonen via grep — sannsynligvis i `lib/api-validator.ts` eller `app/api/chat/*`.)
Patch-skisse: Oppdater `mapMessageType()` sin logikk slik at den korrekt mapper de nye `'text'`/`'image'`-verdiene til riktig internt/DB-representasjon, konsistent med skjema-endringen i 2.1.
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): `grep -rn "mapMessageType" lib app`
Sjekk 3 (build): npm run build -- --no-lint
State-oppdatering: currentStep="2.2", completedSteps+=["2.2"], nextStep="2.3"
Rollback: `git checkout -- <fil funnet over>`
Commit: `fix(chat): oppdater mapMessageType() til å matche nytt skjema`

## STEG 2.3 — Fiks `senderId={undefined}`-bug i ChatContainer
Formål: Rette dokumentert TODO-bug som gjør at avsender av melding blir udefinert i UI.
Avhengigheter: 2.2
Risiko: Middels
Filanker(e): `app/chat/components/ChatContainer.tsx:654`
Patch-skisse: Erstatt `senderId={undefined}` med korrekt verdi hentet fra sesjon/melding-objektet (se omkringliggende kontekst i filen for riktig variabelnavn — sannsynligvis `session.user.id` eller `message.senderId`).
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): `grep -n "senderId={undefined}\|senderId={" app/chat/components/ChatContainer.tsx`
Sjekk 3 (build): npm run build -- --no-lint
State-oppdatering: currentStep="2.3", completedSteps+=["2.3"], nextStep="2.4"
Rollback: `git checkout -- app/chat/components/ChatContainer.tsx`
Commit: `fix(chat): rett senderId={undefined}-bug i ChatContainer`

## STEG 2.4 — Meldings-ID via `cuid()` + whitespace-validering
Formål: Unngå kollisjonsrisiko i meldings-ID-generering, og hindre tomme/whitespace-only meldinger fra å bli godkjent.
Avhengigheter: 2.3
Risiko: Lav
Filanker(e): `lib/api-validator.ts` (samme skjema-område som 2.1), samt der meldings-ID genereres med `Date.now()+Math.random()` (grep for å lokalisere eksakt linje).
Patch-skisse: (a) Bytt ID-generering fra `Date.now()+Math.random()`-mønsteret til Prisma sin `cuid()` (eller la Prisma generere ID automatisk via skjema-default, hvis det allerede er satt opp). (b) Legg til `.trim().min(1)`-validering (eller en `.refine()`-sjekk) i `content`-feltet i `chatSendMessageSchema` for å avvise meldinger som kun består av whitespace.
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): `grep -rn "Date.now() + Math.random\|Date.now()+Math.random" lib app; grep -n "trim\|refine" lib/api-validator.ts`
Sjekk 3 (build): npm run build -- --no-lint
State-oppdatering: currentWave=3, currentStep="2.4", completedSteps+=["2.4"], nextStep="3.1"
Rollback: `git checkout -- lib/api-validator.ts <fil med ID-generering>`
Commit: `fix(chat): bruk cuid() for meldings-ID + avvis whitespace-only innhold, fullfør Bølge 2`

---

# BØLGE 3 — Auth & Session

## STEG 3.1 — Koble "Logg ut"-knapp til `signOut()`
Formål: Brukere kan i dag ikke logge ut via UI — knappen har ingen funksjon.
Avhengigheter: 2.4
Risiko: Lav
Filanker(e): `app/settings/page.tsx` (~649 linjer — finn "Logg ut"-knappen via grep)
Patch-skisse: Legg til `onClick`-handler på "Logg ut"-knappen som kaller `signOut()` fra `next-auth/react`, med redirect til forsiden/login-siden etter utlogging.
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): `grep -n "Logg ut\|signOut" app/settings/page.tsx`
Sjekk 3 (build): npm run build -- --no-lint
State-oppdatering: currentStep="3.1", completedSteps+=["3.1"], nextStep="3.2"
Rollback: `git checkout -- app/settings/page.tsx`
Commit: `fix(auth): koble Logg ut-knapp til signOut()`

## STEG 3.2 — Ekte sesjons-revokering ved utestengelse
Formål: I dag kan en utestengt bruker (`bannedAt` satt) fortsette å bruke appen inntil JWT utløper, fordi JWT-strategien ikke sjekkes mot DB løpende.
Avhengigheter: 3.1
Risiko: Middels
Filanker(e): Match-/chat-/journey-API-rutene (grep for `bannedAt`-bruk i dag for å finne mønster), evt. `lib/auth/config.ts` for sesjonsstrategi.
Patch-skisse: Legg til en `bannedAt`-sjekk (kort-TTL DB-oppslag eller cache) i de kritiske API-rutene (match, chat, journey) som avviser forespørsler fra utestengte brukere umiddelbart — ELLER, som alternativ (dokumenter valget i `deviations`), bytt sesjonsstrategi fra JWT til database-strategi i `lib/auth/config.ts` for ekte revokering. Velg JWT-sjekk-varianten som standard med mindre bruker sier noe annet, siden det er mindre invasivt.
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): `grep -rn "bannedAt" app/api/match app/api/chat app/api/journey`
Sjekk 3 (build): npm run build -- --no-lint
State-oppdatering: currentStep="3.2", completedSteps+=["3.2"], nextStep="3.3"
Rollback: `git checkout -- <endrede filer>`
Commit: `fix(auth): sjekk bannedAt i kritiske API-ruter for reell sesjonsrevokering`

## STEG 3.3 — Fiks/fjern ugyldig `signIn('credentials', ...)`-kall
Formål: `phone/verify`-ruten kaller `signIn('credentials', ...)` men ingen `CredentialsProvider` er registrert — dette feiler i runtime.
Avhengigheter: 3.2
Risiko: Middels
Filanker(e): `app/api/auth/phone/verify/route.ts`
Patch-skisse: Enten (a) registrer en dedikert `CredentialsProvider` for telefon-verifisering i `lib/auth/config.ts` og oppdater kallet til å matche, ELLER (b) fjern `signIn('credentials', ...)`-kallet og erstatt med korrekt NextAuth-kompatibel sesjonsoppretting (samme mønster som andre fungerende auth-flows i repoet, f.eks. Vipps-flowen etter Steg 3.4 er fikset). Fjern samtidig den usignerte sha256-fallback-cookien hvis den finnes i denne filen.
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): `grep -n "signIn('credentials'\|CredentialsProvider" app/api/auth/phone/verify/route.ts lib/auth/config.ts`
Sjekk 3 (build): npm run build -- --no-lint
State-oppdatering: currentStep="3.3", completedSteps+=["3.3"], nextStep="3.4"
Rollback: `git checkout -- app/api/auth/phone/verify/route.ts lib/auth/config.ts`
Commit: `fix(auth): rett ugyldig CredentialsProvider-kall i phone/verify`

## STEG 3.4 — Fiks Vipps-callback sesjonscookie
Formål: Vipps-innlogging setter i dag en egen `tosom_session`-cookie som `middleware.ts` ikke gjenkjenner — brukere fremstår innlogget rett etter Vipps, men blir avvist på neste API-kall.
Avhengigheter: 3.3
Risiko: Høy
Filanker(e): `app/api/auth/vipps/callback/route.ts`, `middleware.ts`
Patch-skisse: Erstatt den egendefinerte HMAC-cookien (`tosom_session`) med en ekte NextAuth-kompatibel sesjon — bruk NextAuth sin `encode()`/JWT-håndtering (eller kall en intern helper som oppretter en gyldig `authjs.session-token`/`next-auth.session.token`-cookie), slik at `middleware.ts` gjenkjenner brukeren som innlogget umiddelbart etter Vipps-redirect.
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): `grep -n "tosom_session\|authjs.session-token\|next-auth.session.token" app/api/auth/vipps/callback/route.ts middleware.ts`
Sjekk 3 (build): npm run build -- --no-lint
State-oppdatering: currentWave=4, currentStep="3.4", completedSteps+=["3.4"], nextStep="4.1"
Rollback: `git checkout -- app/api/auth/vipps/callback/route.ts`
Commit: `fix(auth): erstatt egendefinert Vipps-sesjonscookie med NextAuth-kompatibel sesjon, fullfør Bølge 3`

---

# BØLGE 4 — Drift/Build

## STEG 4.1 — Fiks rå `<a href>` i WaitingForMatch.tsx
Formål: Dette er én av de 2 ESLint-feilene som blokkerer `npm run build` fullstendig i dag.
Avhengigheter: 3.4
Risiko: Lav
Filanker(e): `components/dashboard/WaitingForMatch.tsx:167`
Patch-skisse: Erstatt `<a href="/onboarding/">...</a>` med Next.js `<Link href="/onboarding/">...</Link>` (importer `Link` fra `next/link` hvis ikke allerede importert).
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): `grep -n "href=\"/onboarding/\"\|import Link" components/dashboard/WaitingForMatch.tsx`
Sjekk 3 (build): npm run build
State-oppdatering: currentStep="4.1", completedSteps+=["4.1"], nextStep="4.2"
Rollback: `git checkout -- components/dashboard/WaitingForMatch.tsx`
Commit: `fix(build): erstatt rå <a> med next/link i WaitingForMatch.tsx`

## STEG 4.2 — Fiks rå `<a href>` i Header.tsx
Formål: Den andre av de 2 kjente ESLint-feilene som blokkerer build.
Avhengigheter: 4.1
Risiko: Lav
Filanker(e): `components/layout/Header.tsx:72`
Patch-skisse: Erstatt `<a href="/">...</a>` med `<Link href="/">...</Link>` (importer `Link` fra `next/link` hvis nødvendig).
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): `grep -n "href=\"/\"\|import Link" components/layout/Header.tsx`
Sjekk 3 (build): npm run build
State-oppdatering: currentStep="4.2", completedSteps+=["4.2"], nextStep="4.3"
Rollback: `git checkout -- components/layout/Header.tsx`
Commit: `fix(build): erstatt rå <a> med next/link i Header.tsx — build skal nå være grønt`

## STEG 4.3 — Legg til `output: 'standalone'`
Formål: `deploy/docker/Dockerfile` forventer `CMD ["node", "server.js"]`, som krever standalone-modus. I dag mangler denne innstillingen fullstendig.
Avhengigheter: 4.2
Risiko: Middels
Filanker(e): `next.config.js`
Patch-skisse: Legg til `output: 'standalone'` i toppnivå-konfigurasjonsobjektet i `next.config.js`.
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): `grep -n "output.*standalone" next.config.js`
Sjekk 3 (build): npm run build
State-oppdatering: currentStep="4.3", completedSteps+=["4.3"], nextStep="4.4"
Rollback: `git checkout -- next.config.js`
Commit: `fix(build): legg til output:standalone for kompatibilitet med deploy/docker/Dockerfile`

## STEG 4.4 — Legg til Content-Security-Policy-header
Formål: Alle andre sikkerhetsheadere finnes allerede (X-Content-Type-Options, X-Frame-Options, HSTS, osv.), men CSP mangler helt.
Avhengigheter: 4.3
Risiko: Middels
Filanker(e): `next.config.js:22-71` (`headers()`-funksjonen)
Patch-skisse: Legg til en `Content-Security-Policy`-header i samme liste som de andre headerne i `headers()`-funksjonen. Start med en rimelig restriktiv policy (`default-src 'self'`, samt nødvendige unntak for Stripe/Vipps/Pusher-domener som allerede er i bruk i appen — grep etter eksterne script-/fetch-URLer i `app/` for å identifisere hvilke domener som må whitelistes).
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): `grep -n "Content-Security-Policy" next.config.js`
Sjekk 3 (build): npm run build
State-oppdatering: currentStep="4.4", completedSteps+=["4.4"], nextStep="4.5"
Rollback: `git checkout -- next.config.js`
Commit: `fix(security): legg til Content-Security-Policy-header i next.config.js`

## STEG 4.5 — Begrens `serverActions.allowedOrigins`
Formål: `allowedOrigins: ['*']` tillater Server Actions fra ALLE origins — en åpen CSRF-lignende risiko.
Avhengigheter: 4.4
Risiko: Middels
Filanker(e): `next.config.js:11-13`
Patch-skisse: Erstatt `['*']` med en eksplisitt liste over faktiske produksjons-/staging-domener (f.eks. hentet fra miljøvariabel `NEXT_PUBLIC_APP_URL` eller hardkodet liste over kjente domener brukt i `vercel.json`/deploy-konfig).
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): `grep -n "allowedOrigins" next.config.js`
Sjekk 3 (build): npm run build
State-oppdatering: currentStep="4.5", completedSteps+=["4.5"], nextStep="4.6"
Rollback: `git checkout -- next.config.js`
Commit: `fix(security): begrens serverActions.allowedOrigins fra wildcard til faktiske domener`

## STEG 4.6 — Fiks Jest/Playwright-kollisjon i CI
Formål: I dag feiler 4 av 5 test-suiter i hver `npm test`-kjøring fordi Jest også prøver å kjøre Playwright-spec-filer i `e2e/`.
Avhengigheter: 4.5
Risiko: Lav
Filanker(e): `jest.config.js`
Patch-skisse: Legg til `testPathIgnorePatterns: ['<rootDir>/e2e/']` (eventuelt sammen med eksisterende ignore-mønstre, som `node_modules`) i konfigurasjonsobjektet.
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): `grep -n "testPathIgnorePatterns" jest.config.js`
Sjekk 3 (build): npm test -- --listTests | grep -c "e2e/" || echo 0
State-oppdatering: currentWave=5, currentStep="4.6", completedSteps+=["4.6"], nextStep="5.1"
Rollback: `git checkout -- jest.config.js`
Commit: `fix(test): ekskluder e2e/ fra Jest via testPathIgnorePatterns, fullfør Bølge 4`

---

# BØLGE 5 — Race conditions & data-integritet

## STEG 5.1 — Transaksjonssikker match/accept
Formål: Uten transaksjon kan to samtidige "accept"-kall skape duplikate konversasjoner for samme match.
Avhengigheter: 4.6
Risiko: Høy
Filanker(e): `app/api/match/accept/route.ts` (referer korrekt mønster allerede i `app/api/match/route.ts:206`, kommentert "FASE 2.3 FIX")
Patch-skisse: Pakk oppdatering-av-status + opprettelse-av-konversasjon inn i én `prisma.$transaction([...])`. Bruk en betinget `updateMany` (f.eks. `where: { id, status: 'PENDING' }`) i stedet for `update`, slik at operasjonen er en no-op hvis en annen forespørsel allerede har endret status — sjekk `count` fra resultatet og avvis (409 Conflict) hvis 0 rader ble oppdatert.
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): `grep -n "\$transaction\|updateMany" app/api/match/accept/route.ts`
Sjekk 3 (build): npm run build
State-oppdatering: currentStep="5.1", completedSteps+=["5.1"], nextStep="5.2"
Rollback: `git checkout -- app/api/match/accept/route.ts`
Commit: `fix(race): gjør match/accept transaksjonssikker med betinget updateMany`

## STEG 5.2 — Transaksjonssikker match/[id]/complete + fiks statusovergang-bypass
Formål: Samme raceklasse i complete-endepunktet, samt en dokumentert bug der `action === "complete"` kan hoppe over statusvakten.
Avhengigheter: 5.1
Risiko: Høy
Filanker(e): `app/api/match/[id]/complete/route.ts:125`
Patch-skisse: Speil transaksjons-mønsteret fra Steg 5.1 (betinget `updateMany` + `$transaction`). Fiks samtidig logikkfeilen der `action === "complete"` bypasser statusovergang-vakten — legg til en eksplisitt `where`-betingelse som krever at gjeldende status er en gyldig forgjenger-status før overgang til "complete" tillates.
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): `grep -n "\$transaction\|updateMany\|action === .complete." "app/api/match/[id]/complete/route.ts"`
Sjekk 3 (build): npm run build
State-oppdatering: currentStep="5.2", completedSteps+=["5.2"], nextStep="5.3"
Rollback: `git checkout -- "app/api/match/[id]/complete/route.ts"`
Commit: `fix(race): gjør match/complete transaksjonssikker og tett statusovergang-bypass`

## STEG 5.3 — Unik constraint på `Conversation.matchId`
Formål: Databasenivå-garanti mot duplikate konversasjoner per match, som ekstra sikkerhetslag utover applikasjonslogikken i 5.1.
Avhengigheter: 5.2
Risiko: Middels
Filanker(e): `prisma/schema.prisma` (`Conversation`-modellen)
Patch-skisse: Legg til `@unique` på `matchId`-feltet i `Conversation`-modellen. Følg opp med `npx prisma migrate dev --name conversation_matchid_unique` (eller motsvarende migrasjonskommando brukt i dette repoet).
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): `grep -n "matchId" prisma/schema.prisma`
Sjekk 3 (build): npm run build
State-oppdatering: currentStep="5.3", completedSteps+=["5.3"], nextStep="5.4"
Rollback: `git checkout -- prisma/schema.prisma` + rull tilbake migrasjonen med `npx prisma migrate resolve --rolled-back <migrasjonsnavn>` om nødvendig
Commit: `fix(race): legg til unik constraint på Conversation.matchId`

## STEG 5.4 — Unik constraint på `JourneyMilestone(progressId, day)`
Formål: Hindre duplikate milepæler for samme dag i samme reise ved samtidige cron-/manuelle kall.
Avhengigheter: 5.3
Risiko: Middels
Filanker(e): `prisma/schema.prisma` (`JourneyMilestone`-modellen)
Patch-skisse: Legg til en sammensatt unik constraint: `@@unique([progressId, day])` på `JourneyMilestone`-modellen. Følg opp med tilhørende migrasjon.
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): `grep -n "JourneyMilestone\|@@unique" prisma/schema.prisma`
Sjekk 3 (build): npm run build
State-oppdatering: currentWave=6, currentStep="5.4", completedSteps+=["5.4"], nextStep="6.1"
Rollback: `git checkout -- prisma/schema.prisma` + rull tilbake migrasjon
Commit: `fix(race): legg til unik constraint på JourneyMilestone(progressId, day), fullfør Bølge 5`

---

# BØLGE 6 — Cron

## STEG 6.1 — Fiks OR→AND-bug i matching-cron eligibility
Formål: Dagens `where`-klausul bruker feilaktig OR i stedet for AND, noe som gjør at ikke-kvalifiserte brukere kan bli matchet.
Avhengigheter: 5.4
Risiko: Høy
Filanker(e): `app/api/cron/matching/route.ts:36-53`
Patch-skisse: Gå gjennom `where`-objektet linje for linje og bekreft hvilke betingelser SKAL være AND (alle må være sanne for kvalifisering) versus faktiske OR-tilfeller. Rett strukturen (bruk `AND: [...]` eksplisitt i Prisma-klausulen der nødvendig) slik at alle kvalifiseringskrav faktisk må oppfylles samtidig.
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): `grep -n "AND:\|OR:" app/api/cron/matching/route.ts`
Sjekk 3 (build): npm run build
State-oppdatering: currentStep="6.1", completedSteps+=["6.1"], nextStep="6.2"
Rollback: `git checkout -- app/api/cron/matching/route.ts`
Commit: `fix(cron): rett OR->AND-bug i matching-eligibility where-klausul`

## STEG 6.2 — Legg til `take`-grense på sekvensiell await-i-loop
Formål: Uten grense kan cronen prosessere et ubegrenset antall kandidater sekvensielt, med risiko for timeout/ressursbruk.
Avhengigheter: 6.1
Risiko: Middels
Filanker(e): `app/api/cron/matching/route.ts:62`
Patch-skisse: Legg til `take: <N>` (f.eks. 50 eller en konfigurerbar verdi) på Prisma-spørringen som henter kandidater før løkken som `await`-er sekvensielt.
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): `grep -n "take:" app/api/cron/matching/route.ts`
Sjekk 3 (build): npm run build
State-oppdatering: currentStep="6.2", completedSteps+=["6.2"], nextStep="6.3"
Rollback: `git checkout -- app/api/cron/matching/route.ts`
Commit: `fix(cron): legg til take-grense for å begrense sekvensiell matching-loop`

## STEG 6.3 — Advisory lock / CronRun-tabell for journey-cron
Formål: Hindre at overlappende cron-kjøringer (f.eks. ved retry/timeout) prosesserer samme data dobbelt.
Avhengigheter: 6.2
Risiko: Middels
Filanker(e): `app/api/cron/journey/route.ts`, `prisma/schema.prisma` (evt. ny `CronRun`-modell)
Patch-skisse: Legg til en enkel låsemekanisme: enten en Postgres advisory lock (`pg_try_advisory_lock`) i starten av handleren, ELLER en `CronRun`-tabell med et unikt "running"-flagg per cron-navn som settes ved start og ryddes ved slutt/feil (med timeout-basert opprydding for hengende låser). Returner tidlig (uten feil) hvis lås allerede er tatt.
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): `grep -n "advisory_lock\|CronRun" app/api/cron/journey/route.ts prisma/schema.prisma`
Sjekk 3 (build): npm run build
State-oppdatering: currentStep="6.3", completedSteps+=["6.3"], nextStep="6.4"
Rollback: `git checkout -- app/api/cron/journey/route.ts prisma/schema.prisma`
Commit: `fix(cron): legg til overlapp-beskyttelse (advisory lock/CronRun) for journey-cron`

## STEG 6.4 — Advisory lock / CronRun-tabell for matching-cron
Formål: Samme beskyttelse som 6.3, for matching-cronen.
Avhengigheter: 6.3
Risiko: Middels
Filanker(e): `app/api/cron/matching/route.ts`
Patch-skisse: Identisk mønster som Steg 6.3, med eget lås-navn/rad for "matching" (ikke gjenbruk samme lås-nøkkel som journey-cronen).
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): `grep -n "advisory_lock\|CronRun" app/api/cron/matching/route.ts`
Sjekk 3 (build): npm run build
State-oppdatering: currentStep="6.4", completedSteps+=["6.4"], nextStep="6.5"
Rollback: `git checkout -- app/api/cron/matching/route.ts`
Commit: `fix(cron): legg til overlapp-beskyttelse (advisory lock/CronRun) for matching-cron`

## STEG 6.5 — Ekskluder `rejected`-status fra re-matching-pool
Formål: Brukere som har avvist hverandre kan i dag bli foreslått på nytt av både cron og manuell match-flow.
Avhengigheter: 6.4
Risiko: Middels
Filanker(e): `lib/matching/findBestResonance.ts`, manuell match-vei (grep i `app/api/match/route.ts` for kandidat-spørring)
Patch-skisse: Legg til en `NOT`/eksklusjons-betingelse i kandidat-spørringen i BÅDE `findBestResonance.ts` og den manuelle match-spørringen, som filtrerer ut par som allerede har en match med status `rejected` mellom dem.
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): `grep -n "rejected" lib/matching/findBestResonance.ts app/api/match/route.ts`
Sjekk 3 (build): npm run build
State-oppdatering: currentStep="6.5", completedSteps+=["6.5"], nextStep="6.6"
Rollback: `git checkout -- lib/matching/findBestResonance.ts app/api/match/route.ts`
Commit: `fix(matching): ekskluder rejected-status fra re-matching-kandidatpool (cron + manuell)`

## STEG 6.6 — Transaksjonswrap på cron match-opprettelse
Formål: I dag brukes `.catch()`-basert varsling som svelger feil samtidig som `created++` telles opp uansett — dette gir falske suksess-tall og potensielt halvferdige data.
Avhengigheter: 6.5
Risiko: Middels
Filanker(e): `app/api/cron/matching/route.ts` (match-opprettelses-blokken, grep for `.catch(` nær `created++`)
Patch-skisse: Pakk match-opprettelsen inn i en `try/catch` PER kandidat der `created++` KUN økes ved bekreftet suksess (inne i try-blokken, etter vellykket `await`). Logg feilen eksplisitt i catch-blokken uten å telle den som opprettet. Vurder `$transaction` for selve opprettelsen hvis den involverer flere skriveoperasjoner (match + samtale).
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): `grep -n "created++\|catch(" app/api/cron/matching/route.ts`
Sjekk 3 (build): npm run build
State-oppdatering: currentWave=7, currentStep="6.6", completedSteps+=["6.6"], nextStep="7.1"
Rollback: `git checkout -- app/api/cron/matching/route.ts`
Commit: `fix(cron): tell kun bekreftet opprettede matcher, unngå at swallowed feil telles som suksess, fullfør Bølge 6`

---

# BØLGE 7 — Onboarding

## STEG 7.1 — Håndhev alle 12 dybdeprofil-seksjoner server-side
Formål: Kjernedokumentasjonen krever 12 dybdeprofil-seksjoner, men Zod-skjemaet krever i dag KUN Steg 1 ("basic") — resten er `.optional()`. `app/api/onboarding/complete/route.ts` har korrekt håndheving, men den ruten kalles aldri fra frontend.
Avhengigheter: 6.6
Risiko: Middels
Filanker(e): `app/api/profile/setup/route.ts`, `app/api/onboarding/complete/route.ts` (referanse for korrekt logikk), `components/onboarding/OnboardingFlow.tsx` (bekreft hvilken rute som faktisk kalles)
Patch-skisse: Bekreft først (via grep i `OnboardingFlow.tsx`) hvilken av de to rutene som faktisk er i bruk. Deretter: fjern `.optional()` fra de 11 gjenstående seksjonene i skjemaet som brukes AKTIVT (sannsynligvis `profile/setup`), speil valideringsmønsteret som allerede finnes korrekt i `onboarding/complete`. Hvis beslutningen i stedet blir å BEVISST tillate delvis utfylling, skal dette dokumenteres eksplisitt i `deviations` som et bevisst avvik fra kjernedokumentasjonen — ikke som en stille utelatelse.
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): `grep -n ".optional()" app/api/profile/setup/route.ts`
Sjekk 3 (build): npm run build
State-oppdatering: currentStep="7.1", completedSteps+=["7.1"], nextStep="7.2"
Rollback: `git checkout -- app/api/profile/setup/route.ts`
Commit: `fix(onboarding): håndhev alle profilseksjoner server-side (eller dokumenter bevisst avvik)`

## STEG 7.2 — Fiks duplisert felt-lagring
Formål: Feltene `structureSpontaneity`/`introExtrovert` lagres i dag under to forskjellige logiske nøkler, noe som kan gi inkonsistente data.
Avhengigheter: 7.1
Risiko: Lav
Filanker(e): `app/api/profile/setup/route.ts` (grep for begge feltnavn)
Patch-skisse: Identifiser de to lagringsstedene via grep, velg ÉN kanonisk nøkkel per felt, og oppdater skrivelogikken til kun å skrive dit. Verifiser at ingen lesekode fortsatt forventer den andre (utdaterte) nøkkelen.
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): `grep -rn "structureSpontaneity\|introExtrovert" app lib`
Sjekk 3 (build): npm run build
State-oppdatering: currentStep="7.2", completedSteps+=["7.2"], nextStep="7.3"
Rollback: `git checkout -- app/api/profile/setup/route.ts`
Commit: `fix(onboarding): fjern duplisert lagring av structureSpontaneity/introExtrovert`

## STEG 7.3 — Fiks stille omdirigering ved innsendingsfeil
Formål: Ved feil under onboarding-innsending redirectes brukeren i dag stille videre, uten feilmelding — brukeren tror onboarding er fullført når den ikke er det.
Avhengigheter: 7.2
Risiko: Lav
Filanker(e): `components/onboarding/OnboardingFlow.tsx` (grep for redirect-logikk nær feilhåndtering)
Patch-skisse: Legg til feilhåndtering som viser en synlig feilmelding til brukeren og AVBRYTER omdirigeringen hvis API-kallet returnerer en feilstatus, i stedet for å navigere videre uansett resultat.
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): `grep -n "router.push\|redirect" components/onboarding/OnboardingFlow.tsx`
Sjekk 3 (build): npm run build
State-oppdatering: currentWave=8, currentStep="7.3", completedSteps+=["7.3"], nextStep="8.1"
Rollback: `git checkout -- components/onboarding/OnboardingFlow.tsx`
Commit: `fix(onboarding): vis feilmelding og avbryt redirect ved innsendingsfeil, fullfør Bølge 7`

---

# BØLGE 8 — Dashboard & Settings

## STEG 8.1 — Fjern døde ruter fra MobileNavMenu
Formål: `MobileNavMenu.tsx` lenker i dag til 7 ruter som ikke finnes (`/dashboard/reflections`, `/dashboard/insights`, `/dashboard/heatmap`, `/dashboard/safety`, `/dashboard/summary`, `/dashboard/analytics`, `/dashboard/profile`). Dette MÅ fikses FØR menyen kobles inn i layout (Steg 8.2), for å unngå å eksponere 404-lenker til brukere.
Avhengigheter: 7.3
Risiko: Lav
Filanker(e): `app/dashboard/components/MobileNavMenu.tsx`
Patch-skisse: Fjern (eller kommenter ut med en TODO om fremtidig implementasjon) de 7 lenkene som peker til ikke-eksisterende ruter. Behold kun lenker til ruter som faktisk finnes i `app/dashboard/`.
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): `grep -n "/dashboard/reflections\|/dashboard/insights\|/dashboard/heatmap\|/dashboard/safety\|/dashboard/summary\|/dashboard/analytics\|/dashboard/profile" app/dashboard/components/MobileNavMenu.tsx`
Sjekk 3 (build): npm run build
State-oppdatering: currentStep="8.1", completedSteps+=["8.1"], nextStep="8.2"
Rollback: `git checkout -- app/dashboard/components/MobileNavMenu.tsx`
Commit: `fix(dashboard): fjern 7 lenker til ikke-eksisterende ruter i MobileNavMenu`

## STEG 8.2 — Koble inn DashboardNavBar/MobileNavMenu i layout
Formål: `app/dashboard/layout.tsx` rendrer i dag ingen navigasjon overhodet, selv om komponentene finnes ferdig bygget.
Avhengigheter: 8.1
Risiko: Middels
Filanker(e): `app/dashboard/layout.tsx`, `app/dashboard/components/DashboardNavBar.tsx`
Patch-skisse: Importer `DashboardNavBar` i `app/dashboard/layout.tsx` og rendre den (f.eks. over eller rundt `{children}`, inne i eksisterende `NotificationProvider`/`DashboardProvider`-struktur). `DashboardNavBar` importerer allerede `MobileNavMenu` internt, så ingen separat import av denne er nødvendig i layout.
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): `grep -n "DashboardNavBar" app/dashboard/layout.tsx`
Sjekk 3 (build): npm run build
State-oppdatering: currentStep="8.2", completedSteps+=["8.2"], nextStep="8.3"
Rollback: `git checkout -- app/dashboard/layout.tsx`
Commit: `fix(dashboard): koble inn DashboardNavBar i dashboard-layout`

## STEG 8.3 — Koble GDPR-eksport til backend
Formål: Eksportknappen i settings er ikke koblet til faktisk databehandling.
Avhengigheter: 8.2
Risiko: Middels
Filanker(e): `app/settings/page.tsx` (grep for eksport-knapp/seksjon)
Patch-skisse: Opprett (om den ikke finnes) et API-endepunkt for GDPR-dataeksport (f.eks. `app/api/settings/export/route.ts`) som samler brukerens data og returnerer som nedlastbar JSON. Koble knappen i `app/settings/page.tsx` til dette endepunktet.
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): `grep -n "export\|GDPR" app/settings/page.tsx`
Sjekk 3 (build): npm run build
State-oppdatering: currentStep="8.3", completedSteps+=["8.3"], nextStep="8.4"
Rollback: `git checkout -- app/settings/page.tsx app/api/settings/export/route.ts`
Commit: `feat(settings): koble GDPR-dataeksport til reelt backend-endepunkt`

## STEG 8.4 — Koble kontosletting til backend
Formål: Slett-konto-funksjonen i settings er ikke koblet til faktisk sletting/anonymisering.
Avhengigheter: 8.3
Risiko: Høy
Filanker(e): `app/settings/page.tsx`
Patch-skisse: Opprett/koble til et API-endepunkt (f.eks. `app/api/settings/delete-account/route.ts`) som utfører sletting eller GDPR-kompatibel anonymisering av brukerens data, med bekreftelses-dialog i UI før kallet utføres.
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): `grep -n "delete-account\|Slett konto" app/settings/page.tsx`
Sjekk 3 (build): npm run build
State-oppdatering: currentStep="8.4", completedSteps+=["8.4"], nextStep="8.5"
Rollback: `git checkout -- app/settings/page.tsx app/api/settings/delete-account/route.ts`
Commit: `feat(settings): koble kontosletting til reelt backend-endepunkt`

## STEG 8.5 — Koble notifikasjon/språk/tema-innstillinger til persistens
Formål: Disse innstillingene er i dag kun UI-state uten lagring.
Avhengigheter: 8.4
Risiko: Lav
Filanker(e): `app/settings/page.tsx`
Patch-skisse: Koble hver innstilling til et eksisterende eller nytt API-endepunkt som persisterer verdien på brukerens profil i databasen, og last inn lagret verdi ved sidevisning i stedet for kun lokal state.
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): `grep -n "useState.*notification\|useState.*theme\|useState.*language" app/settings/page.tsx`
Sjekk 3 (build): npm run build
State-oppdatering: currentStep="8.5", completedSteps+=["8.5"], nextStep="8.6"
Rollback: `git checkout -- app/settings/page.tsx`
Commit: `feat(settings): persister notifikasjon/språk/tema-innstillinger til backend`

## STEG 8.6 — Fjern hardkodet e-postadresse
Formål: `innlogga@eksempel.no` vises i dag hardkodet i stedet for faktisk brukerens e-post.
Avhengigheter: 8.5
Risiko: Lav
Filanker(e): `app/settings/page.tsx` (grep for eksakt streng)
Patch-skisse: Erstatt den hardkodede strengen med faktisk verdi fra `session.user.email` (eller motsvarende sesjonsdata).
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): `grep -n "innlogga@eksempel.no" app/settings/page.tsx`
Sjekk 3 (build): npm run build
State-oppdatering: currentWave=9, currentStep="8.6", completedSteps+=["8.6"], nextStep="9.1"
Rollback: `git checkout -- app/settings/page.tsx`
Commit: `fix(settings): vis faktisk brukerens e-post i stedet for hardkodet placeholder, fullfør Bølge 8`

---

# BØLGE 9 — Admin

## STEG 9.1 — Konsolider admin-autorisasjon til `requireAdmin()`
Formål: I dag finnes 4 parallelle admin-autorisasjonsmekanismer, noe som gir inkonsistent sikkerhetsnivå og duplisert kode.
Avhengigheter: 8.6
Risiko: Middels
Filanker(e): (Kartlegg alle 4 mekanismene via grep i `app/api/admin/**/route.ts` og evt. `lib/auth/*` — sannsynlige kandidater: `requireAuth()+role-sjekk` inline, en egen `isAdmin()`-helper, sesjons-sjekk direkte, og JWT-basert admin-token fra `lib/auth/admin-jwt.ts`)
Patch-skisse: Opprett én samlet `requireAdmin()`-helper (f.eks. i `lib/auth/requireAdmin.ts`) som innkapsler den STRENGESTE av de eksisterende sjekkene. Erstatt bruken i ALLE admin-ruter gradvis — i DETTE steget: opprett helperen og migrer KUN de rutene som allerede ble endret i Bølge 1 (Steg 1.2, 1.3) til å bruke den nye helperen konsekvent, for å holde steget atomisk. Øvrige ruter migreres i påfølgende commits innenfor samme steg-ID hvis nødvendig, eller del opp i 9.1a/9.1b ved behov.
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): `grep -rln "requireAdmin" app/api/admin`
Sjekk 3 (build): npm run build
State-oppdatering: currentStep="9.1", completedSteps+=["9.1"], nextStep="9.2"
Rollback: `git checkout -- lib/auth/requireAdmin.ts app/api/admin`
Commit: `refactor(admin): konsolider admin-autorisasjon til én requireAdmin()-helper`

## STEG 9.2 — Koble inn `recordAdminAction()` i destruktive admin-ruter
Formål: Funksjonen er definert i `lib/admin/audit.ts` men kalles i dag ALDRI — ingen admin-handlinger logges/revideres.
Avhengigheter: 9.1
Risiko: Middels
Filanker(e): `lib/admin/audit.ts`, destruktive admin-ruter (unmatch, reset, flag, force-match-end — finn eksakte filer via grep i `app/api/admin/`)
Patch-skisse: Legg til et `recordAdminAction(...)`-kall i HVER destruktiv admin-rute, umiddelbart etter en vellykket destruktiv operasjon, med relevante metadata (admin-ID, mål-ID, handlingstype, tidspunkt).
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): `grep -rln "recordAdminAction" app/api/admin`
Sjekk 3 (build): npm run build
State-oppdatering: currentStep="9.2", completedSteps+=["9.2"], nextStep="9.3"
Rollback: `git checkout -- app/api/admin`
Commit: `feat(admin): koble inn recordAdminAction i alle destruktive admin-ruter`

## STEG 9.3 — Fiks match-telling og `conversationCount` i `getAllUsers()`
Formål: Admin-oversikten viser i dag feil (undertelte) match-tall og en hardkodet `conversationCount: 0` for alle brukere.
Avhengigheter: 9.2
Risiko: Lav
Filanker(e): `lib/admin/data.ts` (`getAllUsers()`-funksjonen)
Patch-skisse: Rett spørringen som teller matcher (sannsynlig årsak: teller kun der bruker er `userAId`, ikke `userBId`, eller omvendt — bruk en OR-betingelse på begge felt). Erstatt hardkodet `conversationCount: 0` med en faktisk telling via Prisma `_count` eller separat aggregert spørring.
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): `grep -n "conversationCount\|_count" lib/admin/data.ts`
Sjekk 3 (build): npm run build
State-oppdatering: currentWave=10, currentStep="9.3", completedSteps+=["9.3"], nextStep="10.1"
Rollback: `git checkout -- lib/admin/data.ts`
Commit: `fix(admin): rett match-undertelling og hardkodet conversationCount i getAllUsers(), fullfør Bølge 9`

---

# BØLGE 10 — Premium/Payment/Vipps

## STEG 10.1 — Fiks `planId`/`plan`-feltnavn-mismatch
Formål: Checkout-opprettelse feiler pga. inkonsistent feltnavn mellom frontend og backend.
Avhengigheter: 9.3
Risiko: Middels
Filanker(e): `app/api/payment/create-checkout-session/route.ts` (og kallende frontend-kode — grep for begge navn)
Patch-skisse: Bekreft hvilket navn frontend faktisk sender (grep i `app/betaling/` og `components/`), og oppdater backend-skjemaet/-lesingen i `create-checkout-session/route.ts` til å bruke SAMME feltnavn — velg ett kanonisk navn og fiks avviket der det er, i stedet for å endre begge sider tilfeldig.
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): `grep -rn "planId\|plan:" app/api/payment/create-checkout-session/route.ts app/betaling`
Sjekk 3 (build): npm run build
State-oppdatering: currentStep="10.1", completedSteps+=["10.1"], nextStep="10.2"
Rollback: `git checkout -- app/api/payment/create-checkout-session/route.ts`
Commit: `fix(payment): rett planId/plan-feltnavn-mismatch mellom frontend og backend`

## STEG 10.2 — Idempotens på Stripe-webhook
Formål: Uten dedup på `event.id` kan Stripe-retries forårsake duplikate DB-skriv (f.eks. dobbel premium-aktivering).
Avhengigheter: 10.1
Risiko: Middels
Filanker(e): `app/api/payment/webhook/route.ts:44`
Patch-skisse: Legg til en sjekk FØR databehandling: har `event.id` allerede blitt behandlet (f.eks. via en `ProcessedWebhookEvent`-tabell med unik constraint på `eventId`, eller et enkelt oppslag mot en eksisterende tabell som allerede lagrer betalingshendelser)? Hvis ja, returner 200 uten å gjøre noe. Dette gjøres SAMTIDIG med at den eksisterende DB-write-TODO fylles inn (siden begge endringene berører samme kodeblokk) — men fokuser primært på idempotens-logikken i dette steget; selve forretningslogikken for DB-skrivingen skisseres, men detaljert implementasjon kan bli et eget oppfølgingssteg hvis den er stor.
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): `grep -n "event.id\|ProcessedWebhookEvent" app/api/payment/webhook/route.ts`
Sjekk 3 (build): npm run build
State-oppdatering: currentStep="10.2", completedSteps+=["10.2"], nextStep="10.3"
Rollback: `git checkout -- app/api/payment/webhook/route.ts prisma/schema.prisma`
Commit: `fix(payment): legg til idempotens-sjekk på event.id i Stripe-webhook`

## STEG 10.3 — Dokumenter Stripe/Vipps ePayment-retning
Formål: Diagnosen konkluderer at dette kan vente til etter lansering (ingen reell betalingsgating eksisterer i dag uansett), men beslutningen må dokumenteres formelt for å unngå fremtidig forvirring.
Avhengigheter: 10.2
Risiko: Lav
Filanker(e): `docs/` (ny fil, f.eks. `docs/PAYMENT-STRATEGY-DECISION.md`)
Patch-skisse: Opprett et kort beslutningsdokument som slår fast: Stripe er primær betalingsvei for lansering; Vipps forblir kun OAuth-innlogging (ikke ePayment) til videre; ingen kodeendring kreves i dette steget utover selve dokumentet.
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): `test -f docs/PAYMENT-STRATEGY-DECISION.md && echo OK`
Sjekk 3 (build): npm run build
State-oppdatering: currentWave=11, currentStep="10.3", completedSteps+=["10.3"], nextStep="11.1"
Rollback: `rm docs/PAYMENT-STRATEGY-DECISION.md`
Commit: `docs(payment): dokumenter Stripe-som-primær / Vipps-kun-login-beslutning, fullfør Bølge 10`

---

# BØLGE 11 — Kodehelse & dødkode

**Viktig for hele Bølge 11:** FØR hver slettesteg, kjør en bekreftende grep i HELE repoet (ikke bare den mistenkte mappen) for å bekrefte at ingen levende kode importerer fra filene som skal slettes. Hvis grep finner EN levende referanse, STOPP og meld avvik — slett IKKE filen, og vent på brukerens vurdering.

## STEG 11.1 — Slett `components/ui/*`-laget ("UI 4.0/5.0")
Formål: ~90 filer, inkludert `microcopy.ts` (1703 linjer, 100% dødt) og `tokens.ts` (584 linjer), er ubrukt dødkode som øker vedlikeholdsbyrde og bygge-tid.
Avhengigheter: 10.3
Risiko: Høy
Filanker(e): `components/ui/*`
Patch-skisse: Kjør `grep -rln "from '@/components/ui\|from '../ui\|from './ui" app components lib hooks` (juster relative paths etter faktisk mappestruktur) for å bekrefte NULL levende importer utenfor `components/ui/` selv. Hvis bekreftet: slett hele `components/ui/`-mappen.
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): `grep -rln "components/ui" app components lib hooks | grep -v "^components/ui/"`
Sjekk 3 (build): npm run build
State-oppdatering: currentStep="11.1", completedSteps+=["11.1"], nextStep="11.2"
Rollback: `git checkout -- components/ui` (eller `git revert <commit>` hvis allerede committet/slettet)
Commit: `chore(cleanup): fjern ubrukt components/ui/* UI 4.0/5.0-lag (~90 filer)`

## STEG 11.2 — Slett `lib/chat/*`-servicelaget
Formål: 16 filer utgjør et ubrukt service-lag — reell chat-kode kaller Prisma direkte fra `app/api/chat/*` i stedet.
Avhengigheter: 11.1
Risiko: Høy
Filanker(e): `lib/chat/*`
Patch-skisse: Kjør `grep -rln "from '@/lib/chat\|from '../../lib/chat" app components hooks` for å bekrefte null levende importer. Hvis bekreftet: slett `lib/chat/`-mappen.
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): `grep -rln "lib/chat" app components hooks | grep -v "^lib/chat/"`
Sjekk 3 (build): npm run build
State-oppdatering: currentStep="11.2", completedSteps+=["11.2"], nextStep="11.3"
Rollback: `git checkout -- lib/chat`
Commit: `chore(cleanup): fjern ubrukt lib/chat/* servicelag (16 filer)`

## STEG 11.3 — Fjern ELLER koble til `lib/admin/*`-rapporteringslaget
Formål: ~1600 linjer (7 filer) rapporteringskode må enten fjernes eller kobles til faktiske admin-ruter — IKKE forbli i limbo.
Avhengigheter: 11.2
Risiko: Middels
Filanker(e): `lib/admin/*` (utenom `lib/admin/audit.ts` og `lib/admin/data.ts` som allerede er i aktiv bruk fra Bølge 9)
Patch-skisse: Kjør grep for å identifisere HVILKE av de 7 filene faktisk ikke importeres noe sted. For hver ubrukt fil: bekreft med bruker/kontekst om intensjonen var å bygge en admin-rapport-side (i så fall, skisser et minimalt koblingspunkt — en enkel admin-rute som bruker funksjonen) ELLER slett filen hvis funksjonaliteten er overflødig. Standardvalg i dette steget (med mindre annet fremkommer): slett filer som ikke har noen tilhørende UI-rute i det hele tatt.
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): `grep -rln "lib/admin/" app components hooks | grep -v "^lib/admin/"`
Sjekk 3 (build): npm run build
State-oppdatering: currentStep="11.3", completedSteps+=["11.3"], nextStep="11.4"
Rollback: `git checkout -- lib/admin`
Commit: `chore(cleanup): fjern eller koble til ubrukte lib/admin/*-rapporteringsfiler`

## STEG 11.4 — Konsolider matching-scoring til `unifiedScorer.ts`
Formål: Flere parallelle scoring-implementasjoner (med en dobbelttellings-bug i `calculateTotalScore()`) gir inkonsistente matchresultater.
Avhengigheter: 11.3
Risiko: Høy
Filanker(e): `lib/matching/unifiedScorer.ts` (mål), `lib/matching/resonanceScore.ts`, `lib/presence/presenceEngine.ts` (duplikat resonansfunksjon), `lib/match/score.ts` (alle skal fjernes/migreres)
Patch-skisse: (a) Fiks dobbelttellings-bugen i `calculateTotalScore()` i `unifiedScorer.ts` først (identifiser via grep hvor en faktor legges til to ganger). (b) Finn alle kallesteder for de tre andre filene og migrer dem til å kalle `unifiedScorer.ts` sin funksjon i stedet. (c) Slett de tre gamle filene KUN etter at ALLE kallesteder er migrert og bekreftet med grep.
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): `grep -rln "resonanceScore\|lib/match/score\|presenceEngine.*[Rr]esonance" app components lib hooks`
Sjekk 3 (build): npm run build
State-oppdatering: currentStep="11.4", completedSteps+=["11.4"], nextStep="11.5"
Rollback: `git checkout -- lib/matching lib/presence lib/match`
Commit: `refactor(matching): konsolider all scoring til unifiedScorer.ts, fiks dobbelttelling, fjern duplikater`

## STEG 11.5 — Konsolider design-tokens til `config/design-tokens.ts`
Formål: Duplikate token-definisjoner (`components/ui/tokens.ts` — allerede fjernet i 11.1 — og `styles/tokens.ts`) gir risiko for visuell inkonsistens.
Avhengigheter: 11.4
Risiko: Middels
Filanker(e): `config/design-tokens.ts` (mål), `styles/tokens.ts` (skal fjernes/migreres)
Patch-skisse: Finn alle kallesteder for `styles/tokens.ts` via grep, migrer dem til å importere fra `config/design-tokens.ts` i stedet (bekreft at samme verdier finnes der, legg til eventuelle manglende tokens FØRST). Slett `styles/tokens.ts` KUN etter bekreftet migrering.
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): `grep -rln "styles/tokens" app components lib hooks`
Sjekk 3 (build): npm run build
State-oppdatering: currentStep="11.5", completedSteps+=["11.5"], nextStep="11.6"
Rollback: `git checkout -- styles config/design-tokens.ts`
Commit: `refactor(design): konsolider design-tokens til config/design-tokens.ts, fjern styles/tokens.ts`

## STEG 11.6 — Rydd opp lint-blindsoner i `.eslintrc.json`
Formål: Etter dødkode-fjerning i Steg 11.1-11.5 kan mange av unntakene i `.eslintrc.json` (`lib/matching/*`, `lib/system/*`, `lib/notifications/*`, `lib/release/*`) fjernes, slik at ESLint igjen sjekker disse mappene fullt ut.
Avhengigheter: 11.5
Risiko: Lav
Filanker(e): `.eslintrc.json`
Patch-skisse: Gå gjennom hver overrides/ignore-oppføring for de 4 mappene. For hver: kjør `npx eslint <mappe>` med unntaket temporært fjernet, og bekreft om det gir NYE feil utover det som allerede er akseptert i resten av koden. Fjern unntaket kun der resultatet er rent (eller der gjenstående feil rettes i samme steg, hvis trivielt).
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): `grep -n "lib/matching\|lib/system\|lib/notifications\|lib/release" .eslintrc.json`
Sjekk 3 (build): npm run build
State-oppdatering: currentWave=12, currentStep="11.6", completedSteps+=["11.6"], nextStep="12.1"
Rollback: `git checkout -- .eslintrc.json`
Commit: `chore(lint): fjern overflødige lint-blindsoner etter dødkode-opprydding, fullfør Bølge 11`

---

# BØLGE 12 — Testdekning & E2E-fundament

## STEG 12.1 — Bekreft Jest-fiksen fra Bølge 4 fortsatt holder
Formål: Sikre at ingen senere endring har reintrodusert Jest/Playwright-kollisjonen.
Avhengigheter: 11.6
Risiko: Lav
Filanker(e): `jest.config.js`
Patch-skisse: Ingen kodeendring forventet — kun verifisering. Kjør `npm test` i sin helhet og bekreft at ingen `e2e/`-filer plukkes opp av Jest.
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): `grep -n "testPathIgnorePatterns" jest.config.js`
Sjekk 3 (build): npm test 2>&1 | tee /tmp/jest-verify.log
State-oppdatering: currentStep="12.1", completedSteps+=["12.1"], nextStep="12.2"
Rollback: Ikke relevant (ingen endring forventet). Hvis kollisjon likevel oppdages: `git log -- jest.config.js` for å finne regresjonen, meld avvik.
Commit: `test: bekreft jest.config.js-fiks fortsatt holder`

## STEG 12.2 — Enhetstest for `/api/chat/send`
Formål: Fange opp fremtidige regresjoner på Bølge 2-fiksen (chat-meldinger som feiler).
Avhengigheter: 12.1
Risiko: Lav
Filanker(e): `__tests__/` (ny fil, f.eks. `__tests__/chat-send.test.ts`)
Patch-skisse: Skriv en enhetstest som poster en gyldig `'text'`-melding og en gyldig `'image'`-melding mot `chatSendMessageSchema` (fra Steg 2.1) og bekrefter at begge parses uten feil, samt at en whitespace-only melding og en ugyldig image-URL AVVISES.
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): `grep -n "chatSendMessageSchema" __tests__/chat-send.test.ts`
Sjekk 3 (build): npm test -- chat-send
State-oppdatering: currentStep="12.2", completedSteps+=["12.2"], nextStep="12.3"
Rollback: `rm __tests__/chat-send.test.ts`
Commit: `test(chat): legg til enhetstest for chatSendMessageSchema (text/image/whitespace/url)`

## STEG 12.3 — Fjern skip på onboarding.spec.ts + koble global setup
Formål: E2E-testen for onboarding er i dag hoppet over (`.skip`), og auth-setup-filen er ikke koblet inn i `globalSetup`.
Avhengigheter: 12.2
Risiko: Middels
Filanker(e): `e2e/tests/onboarding.spec.ts`, `e2e/auth-onboarding-setup.ts`, `playwright.config.ts`
Patch-skisse: Fjern `.skip`/`test.skip` fra `onboarding.spec.ts`. Legg til referanse til `e2e/auth-onboarding-setup.ts` i `globalSetup`-feltet i `playwright.config.ts` (følg samme mønster som eksisterende `e2e/auth-setup.ts`/`e2e/auth-dashboard-setup.ts` hvis de allerede er koblet inn der).
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): `grep -n "skip" e2e/tests/onboarding.spec.ts; grep -n "auth-onboarding-setup" playwright.config.ts`
Sjekk 3 (build): npx playwright test onboarding --list
State-oppdatering: currentStep="12.3", completedSteps+=["12.3"], nextStep="12.4"
Rollback: `git checkout -- e2e/tests/onboarding.spec.ts playwright.config.ts`
Commit: `test(e2e): aktiver onboarding.spec.ts og koble inn auth-onboarding-setup i globalSetup`

## STEG 12.4 — Admin-autorisasjonsgrense-tester
Formål: Bekrefte at Bølge 1/9-fiksene (admin-autorisasjon) faktisk holder, med tester som feiler hvis noen fjerner sjekken senere.
Avhengigheter: 12.3
Risiko: Lav
Filanker(e): `e2e/tests/` eller `__tests__/` (ny fil, f.eks. `__tests__/admin-authorization.test.ts`)
Patch-skisse: Skriv tester for MINST 10 av de mest destruktive admin-rutene (unmatch, reset, flag, force-match-end, setup, journey next-step/reset, osv.) som bekrefter 401 for uautentisert og 403 for autentisert-men-ikke-admin-bruker.
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): `grep -c "expect(res.status).toBe(401)\|expect(res.status).toBe(403)" __tests__/admin-authorization.test.ts`
Sjekk 3 (build): npm test -- admin-authorization
State-oppdatering: currentStep="12.4", completedSteps+=["12.4"], nextStep="12.5"
Rollback: `rm __tests__/admin-authorization.test.ts`
Commit: `test(admin): legg til autorisasjonsgrense-tester for 10+ destruktive admin-ruter`

## STEG 12.5 — Cron-autentiseringstester
Formål: Bekrefte at Bølge 1/6-fiksene (cron-secret via header) faktisk holder.
Avhengigheter: 12.4
Risiko: Lav
Filanker(e): `__tests__/` (ny fil, f.eks. `__tests__/cron-auth.test.ts`)
Patch-skisse: Skriv tester for `/api/cron/journey` og `/api/cron/matching` som bekrefter: (a) kall uten `Authorization`-header avvises, (b) kall med feil secret avvises, (c) kall med korrekt secret i header godtas.
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): `grep -n "Authorization" __tests__/cron-auth.test.ts`
Sjekk 3 (build): npm test -- cron-auth
State-oppdatering: currentStep="12.5", completedSteps+=["12.5"], nextStep="12.6"
Rollback: `rm __tests__/cron-auth.test.ts`
Commit: `test(cron): legg til autentiseringstester for journey- og matching-cron`

## STEG 12.6 — Erstatt svake conditional asserts med harde asserts
Formål: `if (count>0) assert`-mønsteret i eksisterende E2E-tester kan skjule reelle regresjoner ved å hoppe over assertion når count er 0.
Avhengigheter: 12.5
Risiko: Lav
Filanker(e): `e2e/tests/chat.spec.ts`, `e2e/tests/match.spec.ts`, `e2e/tests/matching-journey.spec.ts`
Patch-skisse: Gå gjennom hver `if (count > 0) { expect(...) }`-forekomst (eller lignende betinget assert-mønster) og erstatt med et deterministisk oppsett (seed data på forhånd slik at count ALLTID er kjent) + hard `expect(...)` uten `if`-vakt.
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): `grep -n "if.*count.*>.*0" e2e/tests/chat.spec.ts e2e/tests/match.spec.ts e2e/tests/matching-journey.spec.ts`
Sjekk 3 (build): npx playwright test chat match matching-journey --list
State-oppdatering: currentStep="12.6", completedSteps+=["12.6"], nextStep="12.7"
Rollback: `git checkout -- e2e/tests/chat.spec.ts e2e/tests/match.spec.ts e2e/tests/matching-journey.spec.ts`
Commit: `test(e2e): erstatt svake conditional asserts med deterministiske harde asserts`

## STEG 12.7 — Legg til Playwright-jobb i CI
Formål: E2E-tester kjøres i dag IKKE i CI overhodet (kun `ci.yml` og `cd.yml` finnes, ingen kjører Playwright).
Avhengigheter: 12.6
Risiko: Middels
Filanker(e): `.github/workflows/ci.yml` (eller ny fil `.github/workflows/e2e.yml`)
Patch-skisse: Legg til en ny jobb (eller ny workflow-fil) som installerer Playwright-browsere (`npx playwright install --with-deps`), starter appen (evt. mot en test-DB), og kjører `npx playwright test`. Kjør denne jobben på pull request, parallelt med eksisterende Jest-jobb.
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): `grep -n "playwright" .github/workflows/ci.yml`
Sjekk 3 (build): npm run build
State-oppdatering: currentStep="12.7", completedSteps+=["12.7"], nextStep="12.8"
Rollback: `git checkout -- .github/workflows/ci.yml`
Commit: `ci: legg til Playwright E2E-jobb i CI-workflow`

## STEG 12.8 — Installer og koble inn Sentry
Formål: `components/system/SentryErrorBoundary.tsx` finnes allerede men er kommentert ut/scaffoldet, og `@sentry/nextjs` er ikke installert — ingen produksjonsfeil fanges opp automatisk.
Avhengigheter: 12.7
Risiko: Lav
Filanker(e): `components/system/SentryErrorBoundary.tsx`, `package.json`
Patch-skisse: Installer `@sentry/nextjs` (`npm install @sentry/nextjs`). Kjør Sentry sin standard init-prosess (eller manuelt legg til `sentry.client.config.ts`/`sentry.server.config.ts` med DSN fra miljøvariabel). Fjern kommentering i `SentryErrorBoundary.tsx` og koble den inn i `app/layout.tsx` rundt appens rot.
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): `grep -n "@sentry/nextjs" package.json; grep -n "SentryErrorBoundary" app/layout.tsx`
Sjekk 3 (build): npm run build
State-oppdatering: currentWave=13, currentStep="12.8", completedSteps+=["12.8"], nextStep="FULLFØRT", status.tsc="pass", status.grep="pass", status.build="pass"
Rollback: `npm uninstall @sentry/nextjs && git checkout -- components/system/SentryErrorBoundary.tsx app/layout.tsx package.json package-lock.json`
Commit: `feat(observability): installer og koble inn Sentry for produksjonsfeilsporing, fullfør Bølge 12 — ALLE BØLGER FULLFØRT`

---

# AVSLUTNING

Når Steg 12.8 er fullført og bekreftet grønt (tsc/grep/build alle "pass"), er ALLE funn fra `docs/TOSOM-PLATTFORMDIAGNOSE-v1.0.md` adressert. `nextStep` i `/docs/ACT-STATE.json` skal da settes til `"FULLFØRT"`, og ingen videre ACT-kommandoer skal utføres fra denne instruksen uten ny brukerforespørsel.

**Siste handling:** Skriv en kort oppsummering (i `deviations`-feltet eller som eget felt `summary`) i `/docs/ACT-STATE.json` som lister alle avvik som ble gjort underveis (steg som ble endret, hoppet over, eller utført annerledes enn skissert), slik at bruker kan gjøre en siste manuell gjennomgang.
