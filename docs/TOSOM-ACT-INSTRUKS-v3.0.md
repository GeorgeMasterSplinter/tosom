# TOSOM-ACT-INSTRUKS-v3.0 — LAUNCH EDITION

**Kilde:** `docs/TOSOM-MASTERPLAN-v2.0.md`
**Tilstandsfil:** `docs/ACT-STATE-v3.json` (NY fil — ikke gjenbruk `ACT-STATE.json`)
**Omfang:** 30 steg i 7 bølger. Kun lanseringskritiske punkter.
**Mål:** Flytte ToSom fra 31 % til lanseringsklar. Ett atomisk steg om gangen.

> **Hvorfor v3.0 er annerledes enn v2.0:** ACT v2.0 validerte med `tsc` + `grep` + `build` og fikk alle tre grønne — samtidig som cron-jobbene returnerte 401 og sesjonsvernet kunne omgås med én cookie. **Grønn kompilering er ikke bevis på at noe virker.** Derfor krever v3.0 et **funksjonelt ferdigkriterium** (verifisert DB-tilstand eller HTTP-respons) for hvert steg. Et steg er ikke DONE før funksjonen er observert.

---

## 0. IKKE-FORHANDLINGSBARE REGLER (les FØRST, følg ALLTID)

1. **ETT steg per ACT-kommando.** Ett steg = én atomisk endring. Ikke gå videre selv om neste steg ser «enkelt» ut.
2. **VENT på uttrykkelig bekreftelse fra bruker** før neste steg startes.
3. **Etter HVERT steg, kjør i denne rekkefølgen:**
   - Sjekk 1: `npx tsc --noEmit`
   - Sjekk 2: grep-kommandoen angitt i steget
   - Sjekk 3: `npm run build`
   - **Sjekk 4: FUNKSJONELT FERDIGKRITERIUM** (angitt per steg — DB-tilstand eller HTTP-respons)
   - State-oppdatering: skriv `docs/ACT-STATE-v3.json`
4. **Sjekk 4 er obligatorisk.** Et steg der Sjekk 1–3 er grønne, men Sjekk 4 ikke er observert, skal settes til `"functional": "fail"` og IKKE legges i `completedSteps`. Dette er den viktigste regelen i hele instruksen.
5. **Patch-skissene er IKKE ferdig kode.** De beskriver hva som skal endres. Du skriver faktisk kode selv, basert på skissen og gjeldende filinnhold.
6. **Siter filanker (fil:linje) FØR endring**, og bekreft at linjenummeret fortsatt stemmer. Filer forskyver seg — les filen på nytt ved tvil.
7. **ALDRI erstatt en sikkerhetsmekanisme med en svakere.** ACT v2.0 steg 3.3 innførte HMAC-signering; steg 3.4 fjernet den og satte base64 i stedet. Dette skapte hovedsårbarheten i systemet. Hvis en endring fjerner signering, kryptering eller verifisering — STOPP og meld til bruker.
8. **Konfigurasjon og kode endres i SAMME steg.** ACT v2.0 flyttet cron-secret til header i koden, men glemte `vercel.json` → begge cron-jobber døde i produksjon. Hvis du endrer et grensesnitt, endre alle sider av det i samme steg.
9. **ALDRI endringer utenfor det aktuelle steget.** Ser du andre feil → noter i `deviations`, fortsett med planlagt steg.
10. **ETT steg = ETT commit.** Bruk commit-malen i steget. Ingen batching. (ACT v2.0 hadde 8 batch-avvik som gjorde årsaksisolering umulig.)
11. **Avhengighetssperre:** Hvis et steg avhenger av et steg som ikke står i `completedSteps` → IKKE start. Meld avvik.
12. **BØLGE 1 er en sperre.** Ingen steg i bølge 2+ startes før ALLE steg i bølge 1 er `completedSteps` med `functional: "pass"`. Systemet skal være levende før det pyntes.
13. **Rollback ved rødt:** Feiler en sjekk og du ikke kan fikse innenfor SAMME steg → kjør rollback-kommandoen, sett `deviations`, spør bruker. ALDRI la rødt stå udokumentert.
14. **Ingen nye avhengigheter** uten at steget uttrykkelig angir det.

---

## 1. TILSTANDSFIL: `docs/ACT-STATE-v3.json`

Sjekk om filen finnes FØR du gjør noe annet:
- **Finnes ikke** → du er på steg 0.1. Opprett den.
- **Finnes** → les `nextStep`. Fortsett NØYAKTIG derfra. Ikke gjenta steg i `completedSteps`.

### Skjema

```json
{
  "instruks": "v3.0-launch",
  "currentWave": 0,
  "currentStep": "0.1",
  "completedSteps": [],
  "failedSteps": [],
  "nextStep": "0.1",
  "waveGateOpen": false,
  "status": {
    "tsc": "not-run",
    "grep": "not-run",
    "build": "not-run",
    "functional": "not-run"
  },
  "deviations": [],
  "lastCommit": "",
  "updatedAt": ""
}
```

**Feltforklaring:**
- `currentWave` (number) — bølgen du jobber i nå.
- `currentStep` (string) — steget du nettopp fullførte, f.eks. `"2.3"`.
- `completedSteps` (string[]) — steg som er grønne på ALLE FIRE sjekker.
- `failedSteps` (string[]) — steg som feilet, med årsak i `deviations`.
- `nextStep` (string) — steget som skal utføres neste gang.
- `waveGateOpen` (boolean) — settes `true` først når hele bølge 1 er grønn. Regel 12.
- `status.functional` — `"pass"` | `"fail"` | `"not-run"`. **Viktigste feltet.**
- `deviations` (string[]) — fritekst over alt som avvek.
- `lastCommit` (string) — commit-hash for siste fullførte steg.
- `updatedAt` (string, ISO 8601).

---

## 2. STEG-MAL

```
STEG X.Y — <tittel>
Formål: <hvorfor>
Avhengigheter: <steg-ID i completedSteps, eller "Ingen">
Risiko: Lav / Middels / Høy
Filanker: <fil:linje>
Patch-skisse: <beskrivelse — IKKE ferdig kode>
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): <kommando>
Sjekk 3 (build): npm run build
Sjekk 4 (FUNKSJONELT): <observerbar DB-tilstand eller HTTP-respons>
State: currentWave=X, currentStep="X.Y", completedSteps+=["X.Y"], nextStep="X.Z"
Rollback: <git-kommando>
Commit: <melding>
```

**Commit-format (obligatorisk):**
```
<type>(<scope>): <beskrivelse> [ACT3 X.Y]
```
Typer: `fix` | `feat` | `chore` | `test` | `ci` | `refactor` | `docs`
Eksempel: `fix(cron): rett vercel.json til header-basert auth [ACT3 1.1]`

**Generell rollback:** `git checkout -- <fil>` (ukommitert) eller `git revert <lastCommit>` (committet).

**Baseline-forventning ved start:** `tsc` GRØNN (0 feil). `build` GRØNN. `jest` **RØD** (3/4 suiter feiler). `prisma format --check` **RØD**. Dette er kjent og dokumenteres i steg 0.2. Bruk `npm run build` som Sjekk 3 gjennom hele instruksen.

---

# BØLGE 0 — Baseline (2 steg)

## STEG 0.1 — Opprett tilstandsfil
Formål: Etablere fremdriftsminne for v3.0 uten å overskrive v2.0-historikk.
Avhengigheter: Ingen
Risiko: Lav
Filanker: `docs/ACT-STATE-v3.json` (ny fil)
Patch-skisse: Opprett filen med skjemaet fra kapittel 1. `currentWave: 0`, `nextStep: "0.2"`, alle status-felt `"not-run"`, `waveGateOpen: false`.
Sjekk 1 (tsc): `npx tsc --noEmit`
Sjekk 2 (grep): `test -f docs/ACT-STATE-v3.json && echo OK`
Sjekk 3 (build): Hopp over (ingen kodeendring).
Sjekk 4 (FUNKSJONELT): `jq .instruks docs/ACT-STATE-v3.json` returnerer `"v3.0-launch"`.
State: currentWave=0, currentStep="0.1", completedSteps=["0.1"], nextStep="0.2"
Rollback: `rm docs/ACT-STATE-v3.json`
Commit: `chore(act): opprett ACT-STATE-v3.json [ACT3 0.1]`

## STEG 0.2 — Baseline-måling
Formål: Dokumentere utgangspunktet slik at fremgang kan måles og regresjon oppdages.
Avhengigheter: 0.1
Risiko: Lav
Filanker: Hele prosjektet
Patch-skisse: Ingen kodeendring. Kjør de fire kommandoene under, og skriv resultatene inn i `deviations` som `"BASELINE: tsc=<N> feil, jest=<X> failed/<Y> passed, prisma-format=<exit>, build=<status>"`.
Sjekk 1 (tsc): `npx tsc --noEmit 2>&1 | tee /tmp/v3-tsc.log`
Sjekk 2 (grep): `npx jest 2>&1 | tail -5; npx prisma format --check; echo "exit=$?"`
Sjekk 3 (build): `npm run build 2>&1 | tail -20`
Sjekk 4 (FUNKSJONELT): `deviations` inneholder én BASELINE-linje med alle fire tall.
State: currentWave=1, currentStep="0.2", completedSteps+=["0.2"], nextStep="1.1"
Rollback: Ikke relevant.
Commit: `chore(act): dokumenter baseline for v3.0 [ACT3 0.2]`

---

# BØLGE 1 — GJENOPPLIV SYSTEMET (4 steg) 🔴 SPERRE

> **Dette er den viktigste bølgen.** Begge cron-jobber returnerer 401 i produksjon. Ingen matcher genereres. Ingen journey ruller. Alt annet arbeid er meningsløst før dette virker.
> **Regel 12 gjelder:** `waveGateOpen` settes `true` først når 1.1–1.4 alle er grønne på Sjekk 4.

## STEG 1.1 — Rett cron-kobling til header-basert auth
Formål: `vercel.json` kaller `?secret=`, men rutene krever `Authorization: Bearer`. Resultat: 401 kl. 05:00 og 07:00 hver natt.
Avhengigheter: 0.2
Risiko: Høy
Filanker: `vercel.json:4-13`, `app/api/cron/matching/route.ts:34-38`, `app/api/cron/journey/route.ts:~34`
Patch-skisse:
- Fjern `?secret=...` fra begge `crons[].path` i `vercel.json`. Stiene skal være rene: `/api/cron/matching` og `/api/cron/journey`.
- Vercel Cron sender automatisk `Authorization: Bearer $CRON_SECRET` når miljøvariabelen `CRON_SECRET` er satt i prosjektet. Rutekoden er allerede korrekt (timing-safe, header-basert) — **ikke endre rutene**.
- Verifiser at `CRON_SECRET` finnes i Vercel-miljøet (Production + Preview). Hvis ikke: meld til bruker, ikke gjett verdi.
- Ikke legg secret i noen versjonert fil.
Sjekk 1 (tsc): `npx tsc --noEmit`
Sjekk 2 (grep): `grep -c "secret=" vercel.json` → **skal returnere 0**
Sjekk 3 (build): `npm run build`
Sjekk 4 (FUNKSJONELT): Lokalt med `CRON_SECRET` satt:
- `curl -s -o /dev/null -w "%{http_code}" localhost:3000/api/cron/matching` → **401**
- `curl -s -o /dev/null -w "%{http_code}" -H "Authorization: Bearer $CRON_SECRET" localhost:3000/api/cron/matching` → **200**
Begge må observeres. 401 uten header beviser at vernet virker; 200 med header beviser at koblingen virker.
State: currentWave=1, currentStep="1.1", completedSteps+=["1.1"], nextStep="1.2"
Rollback: `git checkout -- vercel.json`
Commit: `fix(cron): rett vercel.json til header-basert auth [ACT3 1.1]`

## STEG 1.2 — Roter kompromittert cron-secret
Formål: Secret `627562342a0035f120707dd29b4f82dd` ligger i git-historikken og er permanent kompromittert.
Avhengigheter: 1.1
Risiko: Middels
Filanker: Vercel-miljøvariabler (ingen fil i repo)
Patch-skisse:
- Generer ny secret: `openssl rand -hex 32`.
- **Bruker** setter `CRON_SECRET` i Vercel (Production + Preview). Du skal IKKE skrive den til noen fil.
- Bekreft at ingen versjonert fil inneholder den gamle verdien.
- Noter i `deviations` at rotasjon er utført, uten å gjengi verdien.
Sjekk 1 (tsc): `npx tsc --noEmit`
Sjekk 2 (grep): `grep -rn "627562342a0035f120707dd29b4f82dd" . --exclude-dir=node_modules --exclude-dir=.git` → **0 treff**
Sjekk 3 (build): `npm run build`
Sjekk 4 (FUNKSJONELT): Kall med **gammel** secret → **403**. Kall med **ny** secret → **200**.
State: currentWave=1, currentStep="1.2", completedSteps+=["1.2"], nextStep="1.3"
Rollback: Sett forrige verdi i Vercel (men gammel secret er kompromittert — foretrekk å rulle framover).
Commit: `chore(security): roter cron-secret etter eksponering i git [ACT3 1.2]`

## STEG 1.3 — Cron-heartbeat med observerbar tilstand
Formål: FUNN 2 varte i månedsvis usett fordi ingenting varsler. En død cron ser identisk ut med en cron som ikke finnes.
Avhengigheter: 1.2
Risiko: Middels
Filanker: `app/api/cron/matching/route.ts`, `app/api/cron/journey/route.ts`, `prisma/schema.prisma` (`SystemLog`)
Patch-skisse:
- På slutten av hver cron-rute (både suksess og feil): skriv en rad til `SystemLog` med `module: "cron:matching"` / `"cron:journey"`, `level` iht. resultat, og `metadata` med `{ durationMs, processed, created, errors }`.
- Skrivingen skal ligge i `finally`-blokk slik at også feilede kjøringer logges.
- Bruk eksisterende `SystemLog`-modell. **Ingen ny Prisma-modell, ingen migrasjon.**
- Ny rute `app/api/system/cron-health/route.ts`: returnerer `200` hvis siste `SystemLog` for begge moduler er nyere enn 26 timer, ellers `503` med hvilken cron som er stille. Ruten skal kreve samme `Bearer`-auth som cron-rutene.
Sjekk 1 (tsc): `npx tsc --noEmit`
Sjekk 2 (grep): `grep -rn "cron:matching\|cron:journey" app/api/ | head`
Sjekk 3 (build): `npm run build`
Sjekk 4 (FUNKSJONELT): Kjør matching-cron med gyldig header, deretter:
- `SELECT module, level, "createdAt" FROM "SystemLog" WHERE module LIKE 'cron:%' ORDER BY "createdAt" DESC LIMIT 2;` → **minst én fersk rad**
- `curl -H "Authorization: Bearer $CRON_SECRET" localhost:3000/api/system/cron-health` → **200**
State: currentWave=1, currentStep="1.3", completedSteps+=["1.3"], nextStep="1.4"
Rollback: `git revert <lastCommit>`
Commit: `feat(observability): logg cron-kjøringer til SystemLog + helsesjekk [ACT3 1.3]`

## STEG 1.4 — CI-guard mot cron-konfigurasjonsdrift
Formål: Hindre at FUNN 2 gjenoppstår. Maskinen skal fange dette, ikke et menneske.
Avhengigheter: 1.3
Risiko: Lav
Filanker: `.github/workflows/ci.yml`
Patch-skisse:
- Ny jobb `cron-guard`: feiler hvis `vercel.json` inneholder `secret=`.
- Samme jobb: feiler hvis `vercel.json` har `crons`-oppføringer uten tilsvarende `app/api/<path>/route.ts`.
- Bruk `grep` med eksplisitt exit-kode. Ingen nye avhengigheter.
Sjekk 1 (tsc): `npx tsc --noEmit`
Sjekk 2 (grep): `grep -n "cron-guard" .github/workflows/ci.yml`
Sjekk 3 (build): `npm run build`
Sjekk 4 (FUNKSJONELT): Kjør guard-kommandoen lokalt → exit 0. Legg midlertidig `?secret=x` i `vercel.json`, kjør igjen → **exit 1**. Tilbakestill filen.
State: currentWave=1, currentStep="1.4", completedSteps+=["1.4"], **waveGateOpen=true**, nextStep="2.1"
Rollback: `git checkout -- .github/workflows/ci.yml`
Commit: `ci: legg til cron-guard mot konfigurasjonsdrift [ACT3 1.4]`

> **SPERRE:** Bekreft at `waveGateOpen: true` og at 1.1–1.4 alle har `functional: "pass"` før bølge 2. Hvis ikke — STOPP og meld til bruker.

---

# BØLGE 2 — AUTH OG SIKKERHET (7 steg) 🔴

## STEG 2.1 — Fjern manuelle base64-sesjonscookies
Formål: ACT v2.0 steg 3.4 innførte `authjs.session-token` som base64-JSON. Base64 er koding, ikke kryptografi. Dette er roten til FUNN 1.
Avhengigheter: 1.4
Risiko: Høy
Filanker: Finn alle skrivesteder først (se Sjekk 2)
Patch-skisse:
- Lokaliser hver kodelinje som setter `authjs.session-token` eller `next-auth.session.token` manuelt (mistenkte: `app/api/auth/phone/verify/*`, `app/api/dev-login/*`, `lib/auth/*`).
- Erstatt manuell cookie-setting med NextAuth sin egen sesjonsutstedelse (`signIn()` fra `lib/auth/config.ts`, som bruker `strategy: "jwt"` og utsteder signert token).
- **Ingen rute skal skrive en sesjonscookie for hånd etter dette steget.**
- Ikke endre `middleware.ts` her — det gjøres i 2.2.
Sjekk 1 (tsc): `npx tsc --noEmit`
Sjekk 2 (grep): `grep -rn "authjs.session-token\|next-auth.session.token" app/ lib/ --include=*.ts | grep -v middleware.ts` → **0 treff for `cookies().set`/`set(`**
Sjekk 3 (build): `npm run build`
Sjekk 4 (FUNKSJONELT): Logg inn via normal flyt. Inspiser sesjonscookien: den skal IKKE kunne dekodes med `Buffer.from(t,'base64')` til lesbar JSON med `role`. Verifiser at den har JWT/JWE-struktur (punkt-separerte segmenter).
State: currentWave=2, currentStep="2.1", completedSteps+=["2.1"], nextStep="2.2"
Rollback: `git revert <lastCommit>`
Commit: `fix(auth): fjern manuelle base64-sesjonscookies [ACT3 2.1]`

## STEG 2.2 — Verifiser sesjonssignatur i middleware
Formål: `middleware.ts:60-64` returnerer `true` for enhver ikke-tom cookie. Total auth-bypass.
Avhengigheter: 2.1
Risiko: Høy
Filanker: `middleware.ts:52-64`
Patch-skisse:
- Erstatt `hasValidSession()` med reell verifisering via `getToken({ req, secret: process.env.NEXTAUTH_SECRET })` fra `next-auth/jwt` — denne fungerer i Edge-runtime, i motsetning til `jsonwebtoken`.
- Middleware-funksjonen må bli `async`.
- Returner `401` for API-prefikser ved ugyldig/manglende token — behold eksisterende feilmelding og statuskode.
- **Ikke** fjern eller svekke noen eksisterende sjekk (regel 7).
Sjekk 1 (tsc): `npx tsc --noEmit`
Sjekk 2 (grep): `grep -n "if (token) return true" middleware.ts` → **0 treff**
Sjekk 3 (build): `npm run build`
Sjekk 4 (FUNKSJONELT):
- `curl -s -o /dev/null -w "%{http_code}" -H "Cookie: authjs.session-token=x" localhost:3000/api/profile/me` → **401**
- Samme kall med cookie fra ekte innlogging → **200**
Begge må observeres.
State: currentWave=2, currentStep="2.2", completedSteps+=["2.2"], nextStep="2.3"
Rollback: `git checkout -- middleware.ts`
Commit: `fix(security): verifiser sesjonssignatur i middleware [ACT3 2.2]`

## STEG 2.3 — Admin-autorisasjon kun via verifisert token
Formål: `middleware.ts:66-75` leser `role` fra usignert base64. `base64('{"role":"admin"}')` gir full admin-tilgang til private samtaler.
Avhengigheter: 2.2
Risiko: Høy
Filanker: `middleware.ts:66-75`, `middleware.ts:118-139`, `lib/auth/roles.ts`
Patch-skisse:
- Slett `getRoleFromSession()` i nåværende form.
- Hent rolle fra det verifiserte tokenet fra 2.2 (`token.role`).
- Rett rollesammenligning: `middleware.ts:134` bruker `'admin'` (små bokstaver), `lib/auth/roles.ts` bruker `'ADMIN'`. Bruk konstanten fra `roles.ts` — ikke en strengliteral.
- Behold `verifyAdminCookie()`-veien for signert `admin_token`.
Sjekk 1 (tsc): `npx tsc --noEmit`
Sjekk 2 (grep): `grep -n "Buffer.from(token, 'base64')" middleware.ts` → **0 treff**
Sjekk 3 (build): `npm run build`
Sjekk 4 (FUNKSJONELT):
- `TOKEN=$(echo -n '{"role":"admin"}' | base64)` → `curl -s -o /dev/null -w "%{http_code}" -H "Cookie: authjs.session-token=$TOKEN" localhost:3000/admin` → **307/302 til `/admin/login`**
- Innlogget ekte admin → `/admin` gir **200**
State: currentWave=2, currentStep="2.3", completedSteps+=["2.3"], nextStep="2.4"
Rollback: `git checkout -- middleware.ts`
Commit: `fix(security): admin-autorisasjon kun via verifisert token [ACT3 2.3]`

## STEG 2.4 — ADMIN_JWT_SECRET lazy + fail-fast env
Formål: `lib/auth/admin-jwt.ts:13` kaster på module-scope. Enhver rute eller test som importerer modulen krasjer når variabelen mangler. Dette er årsaken til 2 av 6 feilende tester.
Avhengigheter: 2.3
Risiko: Middels
Filanker: `lib/auth/admin-jwt.ts:1-40`, `config/env.ts`
Patch-skisse:
- Flytt `ADMIN_JWT_SECRET`-lesingen fra module-scope inn i en funksjon som kalles ved bruk (lazy).
- Kast fortsatt tydelig feil ved faktisk bruk uten secret — men ikke ved import.
- Legg `ADMIN_JWT_SECRET` til fail-fast-validering i `config/env.ts` for produksjonsmiljø, slik at feil oppdages ved oppstart, ikke ved første admin-kall.
Sjekk 1 (tsc): `npx tsc --noEmit`
Sjekk 2 (grep): `node -e "require('./lib/auth/admin-jwt.ts')" 2>&1 | head -3` (skal ikke kaste på manglende env) — alternativt `npx jest __tests__/admin-authorization.test.ts 2>&1 | tail -5`
Sjekk 3 (build): `npm run build`
Sjekk 4 (FUNKSJONELT): `unset ADMIN_JWT_SECRET && npx jest __tests__/admin-authorization.test.ts` → suiten **importerer uten å kaste** (tester kan fortsatt feile på assertions; import-krasj skal være borte).
State: currentWave=2, currentStep="2.4", completedSteps+=["2.4"], nextStep="2.5"
Rollback: `git checkout -- lib/auth/admin-jwt.ts config/env.ts`
Commit: `fix(auth): lazy ADMIN_JWT_SECRET + fail-fast env-validering [ACT3 2.4]`

## STEG 2.5 — Distribuert rate limiting på auth-ruter
Formål: Rate limiting er in-memory. På serverless har hver instans egen teller → effektiv grense = N × grensen. Ingen reell beskyttelse mot brute-force eller SMS-bombing.
Avhengigheter: 2.4
Risiko: Middels
Filanker: Finn eksisterende implementasjon via Sjekk 2
Patch-skisse:
- Innfør distribuert teller (Upstash Redis REST — fungerer i Edge/serverless).
- Bruk KUN på auth-ruter i dette steget: innlogging, `phone/send`, `phone/verify`, magic-link. Ikke resten av API-flaten.
- Ved manglende Redis-konfigurasjon i utviklingsmiljø: fall tilbake til in-memory med tydelig `console.warn`. I produksjon skal manglende konfigurasjon feile ved oppstart.
- Dette steget tillater ÉN ny avhengighet: `@upstash/ratelimit` + `@upstash/redis`.
Sjekk 1 (tsc): `npx tsc --noEmit`
Sjekk 2 (grep): `grep -rn "new Map()" lib/ --include=*.ts | grep -i "limit"` → skal ikke lenger være eneste mekanisme på auth-ruter
Sjekk 3 (build): `npm run build`
Sjekk 4 (FUNKSJONELT): Send N+1 forespørsler til `phone/send` med samme nummer → siste gir **429**. Verifiser at telleren finnes i Redis (ikke bare i prosessminne).
State: currentWave=2, currentStep="2.5", completedSteps+=["2.5"], nextStep="2.6"
Rollback: `git revert <lastCommit>`
Commit: `feat(security): distribuert rate limiting på auth-ruter [ACT3 2.5]`

## STEG 2.6 — Lås NextAuth til eksakt versjon
Formål: `^5.0.0-beta.25` — caret på en beta. `npm install` kan bryte hele auth-laget uten varsel.
Avhengigheter: 2.5
Risiko: Lav
Filanker: `package.json`
Patch-skisse:
- Fjern `^` fra `next-auth`-versjonen. Eksakt pinning.
- Kjør `npm install` for å oppdatere lockfilen.
- Ikke oppgrader versjonen — kun lås den som er der.
Sjekk 1 (tsc): `npx tsc --noEmit`
Sjekk 2 (grep): `grep '"next-auth"' package.json` → **ingen `^` eller `~`**
Sjekk 3 (build): `npm run build`
Sjekk 4 (FUNKSJONELT): Full innloggingsflyt fungerer etter `npm ci`: logg inn → `/api/profile/me` gir **200** med korrekt bruker-ID.
State: currentWave=2, currentStep="2.6", completedSteps+=["2.6"], nextStep="2.7"
Rollback: `git checkout -- package.json package-lock.json && npm ci`
Commit: `chore(deps): lås next-auth til eksakt versjon [ACT3 2.6]`

## STEG 2.7 — Aktiver Sentry med verifisert feilrapport
Formål: Sentry er installert men DSN er ikke satt. Ingen produksjonsfeilsporing i dag.
Avhengigheter: 2.6
Risiko: Lav
Filanker: `sentry.client.config.ts`, `sentry.server.config.ts`
Patch-skisse:
- **Bruker** oppretter Sentry-prosjekt og setter `NEXT_PUBLIC_SENTRY_DSN` i Vercel.
- Verifiser at konfigurasjonen no-op'er rent uten DSN (skal ikke kaste i utvikling).
- Legg til `beforeSend` som fjerner PII: e-post, telefonnummer og meldingsinnhold skal ikke sendes til Sentry. ToSom lover at ingen ser samtalene — det løftet gjelder også feilsporing.
- Sett `tracesSampleRate` til en lav verdi i produksjon (f.eks. 0.1).
Sjekk 1 (tsc): `npx tsc --noEmit`
Sjekk 2 (grep): `grep -n "beforeSend" sentry.*.config.ts`
Sjekk 3 (build): `npm run build`
Sjekk 4 (FUNKSJONELT): Utløs en kontrollert testfeil → hendelsen er **synlig i Sentry-dashbordet**, og inneholder **ikke** e-post/telefon/meldingsinnhold.
State: currentWave=3, currentStep="2.7", completedSteps+=["2.7"], nextStep="3.1"
Rollback: `git checkout -- sentry.client.config.ts sentry.server.config.ts`
Commit: `feat(observability): aktiver Sentry med PII-scrubbing [ACT3 2.7]`

---

# BØLGE 3 — GRØNN CI SOM PORTVAKT (5 steg) 🟠

> 4 av 9 CI-jobber er røde. Rød CI som får ligge lærer teamet å ignorere rødt — og da fanger ingenting neste FUNN 2.

## STEG 3.1 — Postgres-service i CI
Formål: E2E-jobben kan strukturelt ikke passere. `DATABASE_URL` peker på `localhost:5432`, men ingen `services:`-blokk finnes i `ci.yml`.
Avhengigheter: 2.7
Risiko: Middels
Filanker: `.github/workflows/ci.yml:12-14`, e2e-jobben
Patch-skisse:
- Legg `services: postgres` (image `postgres:16`) med healthcheck til `test`- og `e2e`-jobbene.
- Kjør `npx prisma migrate deploy` mot testdatabasen før tester.
- Start Next.js-serveren før Playwright kjører (eller bruk `webServer` i `playwright.config.ts`).
Sjekk 1 (tsc): `npx tsc --noEmit`
Sjekk 2 (grep): `grep -n "services:" .github/workflows/ci.yml` → **minst 1 treff**
Sjekk 3 (build): `npm run build`
Sjekk 4 (FUNKSJONELT): CI-kjøring på PR: `e2e`-jobben **starter og kobler til databasen** (ikke «connection refused»). Migrasjonssteget er grønt.
State: currentWave=3, currentStep="3.1", completedSteps+=["3.1"], nextStep="3.2"
Rollback: `git checkout -- .github/workflows/ci.yml`
Commit: `ci: legg til postgres-service for test og e2e [ACT3 3.1]`

## STEG 3.2 — Testmiljøvariabler
Formål: `ADMIN_JWT_SECRET` og `CRON_SECRET` mangler i CI. Tester krasjer ved import.
Avhengigheter: 3.1
Risiko: Lav
Filanker: `.github/workflows/ci.yml`, `.env.test` (ny), `jest.setup.ts`
Patch-skisse:
- Opprett `.env.test` med testverdier for `ADMIN_JWT_SECRET`, `CRON_SECRET`, `NEXTAUTH_SECRET`, `DATABASE_URL`. **Kun testverdier — aldri produksjonsverdier.**
- Last `.env.test` i `jest.setup.ts`.
- Sett samme variabler i `env:`-blokken for `test`-, `build`- og `e2e`-jobbene i CI.
Sjekk 1 (tsc): `npx tsc --noEmit`
Sjekk 2 (grep): `grep -c "ADMIN_JWT_SECRET" .github/workflows/ci.yml` → **≥ 2**
Sjekk 3 (build): `npm run build`
Sjekk 4 (FUNKSJONELT): `npx jest __tests__/admin-authorization.test.ts` og `__tests__/cron-auth.test.ts` → **ingen import-krasj**.
State: currentWave=3, currentStep="3.2", completedSteps+=["3.2"], nextStep="3.3"
Rollback: `git checkout -- .github/workflows/ci.yml jest.setup.ts && rm .env.test`
Commit: `test: legg til .env.test og CI-miljøvariabler [ACT3 3.2]`

## STEG 3.3 — Fiks de 6 feilende testene
Formål: `Tests: 6 failed, 72 passed`. Særlig alvorlig: `cron-auth.test.ts` tester en lokal kopi (`simulateCronAuth`), ikke den faktiske ruten — og ville derfor aldri fanget FUNN 2.
Avhengigheter: 3.2
Risiko: Middels
Filanker: `__tests__/cron-auth.test.ts`, `__tests__/admin-authorization.test.ts`, `__tests__/chat-send.test.ts`
Patch-skisse:
- `cron-auth.test.ts`: **slett `simulateCronAuth`-helperen**. Importer og kall de faktiske rute-handlerne. Testen skal verifisere: manglende header → 401, feil secret → 403, korrekt secret → 200, query-param → 401.
- `admin-authorization.test.ts`: rett assertions etter 2.4.
- `chat-send.test.ts`: forventningen om lowercasing stemmer ikke med implementasjonen. Avgjør hvilken som er riktig — rett **enten** test **eller** kode, og dokumenter valget i `deviations`.
- Ingen conditional asserts. Ingen `expect(true).toBe(true)`.
Sjekk 1 (tsc): `npx tsc --noEmit`
Sjekk 2 (grep): `grep -c "simulateCronAuth" __tests__/cron-auth.test.ts` → **0**
Sjekk 3 (build): `npm run build`
Sjekk 4 (FUNKSJONELT): `npx jest` → **4 passed, 0 failed**.
State: currentWave=3, currentStep="3.3", completedSteps+=["3.3"], nextStep="3.4"
Rollback: `git checkout -- __tests__/`
Commit: `test: fiks 6 feilende tester, test faktiske ruter [ACT3 3.3]`

## STEG 3.4 — Prisma-formatering
Formål: `prisma format --check` returnerer exit 1. CI-jobben `prisma` er rød.
Avhengigheter: 3.3
Risiko: Lav
Filanker: `prisma/schema.prisma`
Patch-skisse: Kjør `npx prisma format`. Kun formatering — **ingen modell-, felt- eller indeksendringer**. Verifiser med `git diff` at kun whitespace/justering er endret.
Sjekk 1 (tsc): `npx tsc --noEmit`
Sjekk 2 (grep): `npx prisma format --check; echo "exit=$?"` → **exit=0**
Sjekk 3 (build): `npm run build`
Sjekk 4 (FUNKSJONELT): `npx prisma validate` → grønn. `git diff --stat prisma/schema.prisma` viser kun formatering.
State: currentWave=3, currentStep="3.4", completedSteps+=["3.4"], nextStep="3.5"
Rollback: `git checkout -- prisma/schema.prisma`
Commit: `chore(prisma): formater schema [ACT3 3.4]`

## STEG 3.5 — Fiks guards (lang-guard og ai-guard)
Formål: `lang-guard` er rød (1 treff). `ai-guard` har hull: mønsteret er `components/ai`, så `components/ui/ai/` med 4 filer fanges ikke — falsk trygghet på en av ToSoms viktigste produktregler.
Avhengigheter: 3.4
Risiko: Lav
Filanker: `.github/workflows/ci.yml`
Patch-skisse:
- Finn og rett `lang-guard`-treffet (språkblanding).
- Utvid `ai-guard`-mønsteret til å dekke `components/**/ai/`. Undersøk hva `components/ui/ai/` faktisk inneholder — hvis det er brukerrettet AI, meld til bruker FØR sletting (regel 9).
Sjekk 1 (tsc): `npx tsc --noEmit`
Sjekk 2 (grep): Kjør begge guard-kommandoene lokalt → **exit 0**
Sjekk 3 (build): `npm run build`
Sjekk 4 (FUNKSJONELT): CI-kjøring: **9/9 jobber grønne**. Dette er ferdigkriteriet for hele bølge 3.
State: currentWave=4, currentStep="3.5", completedSteps+=["3.5"], nextStep="4.1"
Rollback: `git checkout -- .github/workflows/ci.yml`
Commit: `ci: fiks lang-guard og utvid ai-guard [ACT3 3.5]`

---

# BØLGE 4 — MATCHING OG JOURNEY (5 steg) 🟠

## STEG 4.1 — Håndhev dealbreakere i cron-veien
Formål: `dealbreaker.ts` brukes kun i den manuelle veien. Automatisk genererte matcher — altså tilnærmet alle matcher — går ikke gjennom dealbreaker-filtrene.
Avhengigheter: 3.5
Risiko: Høy
Filanker: `lib/matching/findBestResonance.ts`, `lib/matching/dealbreaker.ts`
Patch-skisse:
- Importer og anvend dealbreaker-sjekken på hver kandidat i `findBestResonance.ts` **før** scoring.
- Kandidater med `hasDealbreaker: true` skal filtreres bort, ikke bare scores lavere.
- Logg antall filtrerte kandidater i cron-metadata (fra 1.3) slik at effekten er observerbar.
Sjekk 1 (tsc): `npx tsc --noEmit`
Sjekk 2 (grep): `grep -n "dealbreaker" lib/matching/findBestResonance.ts` → **≥ 1 treff**
Sjekk 3 (build): `npm run build`
Sjekk 4 (FUNKSJONELT): Seed to brukere med kjent dealbreaker-konflikt. Kjør matching-cron. Verifiser i DB: `SELECT * FROM "Match" WHERE ("userAId"=<A> AND "userBId"=<B>) OR ("userAId"=<B> AND "userBId"=<A>);` → **0 rader**. Cron-metadata viser `filtered > 0`.
State: currentWave=4, currentStep="4.1", completedSteps+=["4.1"], nextStep="4.2"
Rollback: `git checkout -- lib/matching/findBestResonance.ts`
Commit: `fix(matching): håndhev dealbreakere i cron-veien [ACT3 4.1]`

## STEG 4.2 — Kanonisk fasemodell
Formål: Tre kodesteder er uenige om fasegrenser. `CHECKIN` har labels og fallback-logikk men ingen dager — den kan aldri nås.
Avhengigheter: 4.1
Risiko: Middels
Filanker: `lib/journey/engine.ts` (`PHASE_CONFIGS`), `app/api/journey/today/route.ts:73-76`, `ai/system_prompt.md`
Patch-skisse:
- Sett kanonisk mapping: `EARLY` 1–14, `BUILDING_TRUST` 15–21, `DEEPER` 22–25, `CHECKIN` 26–30.
- Oppdater `PHASE_CONFIGS` slik at `CHECKIN` faktisk får dager 26–30 og `DEEPER` avgrenses til 22–25.
- Fjern fallback-indeksen `dag−26` i `today/route.ts` — den skal bruke `getPhaseForDay()`.
- Oppdater `ai/system_prompt.md` og `docs/match-status-lifecycle.md` til samme mapping.
- Verifiser at dag 15 fortsatt er grensen for bildedeling.
Sjekk 1 (tsc): `npx tsc --noEmit`
Sjekk 2 (grep): `grep -rn "26" app/api/journey/today/route.ts` → ingen hardkodet fallback-indeks
Sjekk 3 (build): `npm run build`
Sjekk 4 (FUNKSJONELT): For dag 1, 14, 15, 21, 22, 25, 26, 30 returnerer `getPhaseForDay()` henholdsvis EARLY, EARLY, BUILDING_TRUST, BUILDING_TRUST, DEEPER, DEEPER, CHECKIN, CHECKIN. **CHECKIN er nåbar.** Verifiser via unit-test eller `/api/journey/today`.
State: currentWave=4, currentStep="4.2", completedSteps+=["4.2"], nextStep="4.3"
Rollback: `git checkout -- lib/journey/engine.ts app/api/journey/today/route.ts`
Commit: `fix(journey): kanonisk fasemodell, gjør CHECKIN nåbar [ACT3 4.2]`

## STEG 4.3 — Fjern matching-taket
Formål: `take: 50` på to nivåer gir tak på ~50 matcher/døgn uansett brukerbase. Kjernefunksjonen «én match per 24 timer» er ikke levert.
Avhengigheter: 4.2
Risiko: Høy
Filanker: `lib/matching/findBestResonance.ts`, `app/api/cron/matching/route.ts`
Patch-skisse:
- Erstatt hardkodet `take: 50` med batching: hent matchbare brukere i porsjoner (f.eks. 200) via cursor-paginering, og loop til alle er behandlet eller tidsbudsjettet er brukt opp.
- Legg inn tidsbudsjett (f.eks. 240 s) med ren avslutning før Vercels funksjonsgrense — logg hvor mange som gjenstår.
- Legg til `select` på kandidatspørringene så Json-kolonner (`explanation`, `scoringBreakdown`) ikke hentes unødig (`findBestResonance.ts:99-106`).
- **Ikke** bygg kø eller worker i dette steget — det er post-launch (Masterplan §4.3).
Sjekk 1 (tsc): `npx tsc --noEmit`
Sjekk 2 (grep): `grep -n "take: 50" lib/matching/findBestResonance.ts` → **0 treff**
Sjekk 3 (build): `npm run build`
Sjekk 4 (FUNKSJONELT): Seed 300 matchbare brukere. Kjør matching-cron én gang. `SELECT COUNT(*) FROM "Match" WHERE "createdAt" > now() - interval '10 minutes';` → **> 50**. Cron-metadata viser `processed >= 300`.
State: currentWave=4, currentStep="4.3", completedSteps+=["4.3"], nextStep="4.4"
Rollback: `git revert <lastCommit>`
Commit: `fix(matching): fjern 50-taket, innfør batching med tidsbudsjett [ACT3 4.3]`

## STEG 4.4 — Kritiske databaseindekser
Formål: `Message` har kun `@@index([createdAt])` — **ingen indeks på `conversationId`**. Hver chat-innlasting er full table scan på den raskest voksende tabellen.
Avhengigheter: 4.3
Risiko: Middels
Filanker: `prisma/schema.prisma` (`Message:149-167`, `Match:84-117`, `Notification:278-291`)
Patch-skisse:
- `Message`: legg `@@index([conversationId, createdAt])`.
- `Match`: legg `@@index([userAId, status])` og `@@index([userBId, status])`.
- `Notification`: legg `@@index([userId, readAt, createdAt])`.
- Opprett migrasjon: `npx prisma migrate dev --name add_critical_indexes`.
- **Kun indekser.** Ingen felt- eller modellendringer i dette steget.
Sjekk 1 (tsc): `npx tsc --noEmit`
Sjekk 2 (grep): `grep -n "conversationId, createdAt" prisma/schema.prisma` → **1 treff**
Sjekk 3 (build): `npm run build`
Sjekk 4 (FUNKSJONELT): `EXPLAIN ANALYZE SELECT * FROM "Message" WHERE "conversationId"='<id>' ORDER BY "createdAt" DESC LIMIT 50;` → planen viser **Index Scan**, ikke Seq Scan. Migrasjonsfil finnes i `prisma/migrations/`.
State: currentWave=4, currentStep="4.4", completedSteps+=["4.4"], nextStep="4.5"
Rollback: `npx prisma migrate resolve --rolled-back <navn>` + `git checkout -- prisma/schema.prisma`
Commit: `perf(db): legg til kritiske indekser for meldinger, matcher og varsler [ACT3 4.4]`

## STEG 4.5 — Rydd statusenum og Prisma-default
Formål: Prisma-default er `active`, ikke `pending` — motsier dokumentert statusflyt. `unmarked` er en stavefeil for `unmatched`.
Avhengigheter: 4.4
Risiko: Middels
Filanker: `prisma/schema.prisma:88`, `prisma/schema.prisma:484-492`, `app/api/admin/matches/route.ts`
Patch-skisse:
- Rett `unmarked` → `unmatched` i `app/api/admin/matches/route.ts`.
- Endre `Match.status`-default fra `active` til `pending` i tråd med `docs/match-status-lifecycle.md`.
- **Verifiser først** at ingen kodesti er avhengig av `active` som default. Finn alle `prisma.match.create`-kall og bekreft at de setter status eksplisitt. Hvis noen er avhengig — meld til bruker før endring.
- Migrasjon kreves for default-endringen.
Sjekk 1 (tsc): `npx tsc --noEmit`
Sjekk 2 (grep): `grep -rn "unmarked" app/ lib/` → **0 treff**
Sjekk 3 (build): `npm run build`
Sjekk 4 (FUNKSJONELT): Opprett en `Match` uten eksplisitt status → `SELECT status FROM "Match" ORDER BY "createdAt" DESC LIMIT 1;` → **`pending`**. Full match-flyt (opprett → aksepter → matched) fungerer fortsatt.
State: currentWave=5, currentStep="4.5", completedSteps+=["4.5"], nextStep="5.1"
Rollback: `git revert <lastCommit>` + rull tilbake migrasjon
Commit: `fix(match): rett unmatched-stavefeil og statusdefault [ACT3 4.5]`

---

# BØLGE 5 — RYDDING OG UX (4 steg) 🟠

## STEG 5.1 — Fjern Stripe fullstendig
Formål: Beslutning: **Vipps only**. Stripe-webhooken gjør kun `console.log` + TODO. Halvferdig betalingskode er angrepsflate uten funksjon.
Avhengigheter: 4.5
Risiko: Middels
Filanker: `app/api/payment/webhook/route.ts`, `app/api/payment/create-checkout-session/route.ts`, `lib/payment/stripe.ts`, `app/betaling/page.tsx`, `app/priser/page.tsx`, `package.json`
Patch-skisse:
- Slett `app/api/payment/*` og `lib/payment/stripe.ts`.
- Fjern `stripe`-avhengigheten fra `package.json`.
- `app/priser/page.tsx` og `app/betaling/page.tsx`: behold sidene, men fjern Stripe-checkout-koblingen. Erstatt med tekst som reflekterer gratis lansering.
- Flytt `docs/PAYMENT-STRATEGY-DECISION.md` til `docs/archive/` (opphevet).
- Ikke bygg Vipps ePayment nå — det er v2.1.
Sjekk 1 (tsc): `npx tsc --noEmit`
Sjekk 2 (grep): `grep -rn "stripe" app/ lib/ --include=*.ts --include=*.tsx -i` → **0 treff**
Sjekk 3 (build): `npm run build`
Sjekk 4 (FUNKSJONELT): `curl -s -o /dev/null -w "%{http_code}" localhost:3000/api/payment/webhook` → **404**. `/priser` gir **200** uten Stripe-referanser.
State: currentWave=5, currentStep="5.1", completedSteps+=["5.1"], nextStep="5.2"
Rollback: `git revert <lastCommit>`
Commit: `refactor(payment): fjern Stripe, Vipps only [ACT3 5.1]`

## STEG 5.2 — Slett dødkode i matching
Formål: ~609 linjer dødkode. `resonanceScore.ts` (344 linjer) har **0 importer** — dokumentasjonen omtaler den fortsatt som årsak til «to motorer», et problem som ikke lenger finnes.
Avhengigheter: 5.1
Risiko: Middels
Filanker: `lib/matching/resonanceScore.ts`, `breakdown.ts`, `ranking.ts`, `normalizer.ts`, `feedback.ts`, `index.ts`, `weightConfig.ts`
Patch-skisse:
- **Bekreft med grep at hver fil har 0 levende importer FØR sletting.** ACT v2.0 steg 11.1 feilet fordi dette ikke ble gjort.
- Slett bekreftet døde filer: `resonanceScore.ts`, `breakdown.ts`, `ranking.ts`, `normalizer.ts`, `feedback.ts`, og `index.ts` hvis ingen importerer `@/lib/matching`.
- `weightConfig.ts`: `getWeights` importeres i `findBestMatchFor.ts:7` men kalles aldri. Fjern den ubrukte importen; behold filen hvis annet innhold er i bruk.
- Oppdater `docs/SECURITY-STABILITY-PLAN-v1.md` punkt 4: duplikatproblemet er løst.
Sjekk 1 (tsc): `npx tsc --noEmit`
Sjekk 2 (grep): `grep -rn "resonanceScore\|matching/breakdown\|matching/ranking" app/ lib/ components/` → **0 treff**
Sjekk 3 (build): `npm run build`
Sjekk 4 (FUNKSJONELT): Matching-cron kjører og produserer matcher etter sletting (samme kriterium som 4.3, redusert: `COUNT(*) > 0`).
State: currentWave=5, currentStep="5.2", completedSteps+=["5.2"], nextStep="5.3"
Rollback: `git revert <lastCommit>`
Commit: `refactor(matching): slett bekreftet dødkode [ACT3 5.2]`

## STEG 5.3 — Serverside onboarding-autosave
Formål: 13 steg, ~75 felt, ~15 minutter — lagret **kun i localStorage**. Enhetsbytte eller tømt nettleserdata = alt tapt. Dyreste frafallspunkt i traktet.
Avhengigheter: 5.2
Risiko: Middels
Filanker: `app/onboarding/OnboardingFlow.tsx:~227-241`, `hooks/useAutoSave.ts`, `app/api/profile/*`
Patch-skisse:
- Ved hvert stegskifte: lagre besvarelser og gjeldende stegindeks til server via eksisterende profil-API (`Profile.deepProfileData` / `deepProfileStep` finnes allerede i skjemaet).
- Ved innlasting: hent serverside-tilstand og gjenopprett posisjon. Server er sannhet; localStorage blir kun hurtigbuffer.
- Gjenbruk `hooks/useAutoSave.ts`. Ingen ny state-bibliotek (Zustand er post-launch).
- Feilet lagring skal vises for brukeren, ikke svelges stille.
Sjekk 1 (tsc): `npx tsc --noEmit`
Sjekk 2 (grep): `grep -n "useAutoSave\|deepProfileStep" app/onboarding/OnboardingFlow.tsx` → **≥ 1 treff**
Sjekk 3 (build): `npm run build`
Sjekk 4 (FUNKSJONELT): Fyll ut steg 1–4. Tøm localStorage. Last siden på nytt → **brukeren er på steg 4 med data intakt**. `SELECT "deepProfileStep" FROM "Profile" WHERE "userId"='<id>';` viser korrekt steg.
State: currentWave=5, currentStep="5.3", completedSteps+=["5.3"], nextStep="5.4"
Rollback: `git revert <lastCommit>`
Commit: `feat(onboarding): serverside autosave av steg og svar [ACT3 5.3]`

## STEG 5.4 — Designet ventetilstand
Formål: ToSom har innebygd ventetid som filosofi (én match per 24 timer). Da må ventingen designes, ikke behandles som tomhet. I dag ser brukeren en dødtilstand.
Avhengigheter: 5.3
Risiko: Lav
Filanker: `components/dashboard/WaitingForMatch.tsx`, `app/dashboard/page.tsx`
Patch-skisse:
- Erstatt tom/generisk tilstand med rolig, ærlig tekst som forklarer hva som skjer og når: at matchen beregnes om natten, og at det kommer én — ikke en liste.
- Vis konkret neste tidspunkt basert på cron-planen (05:00).
- Bokmål. ToSom Blue + Nordic Gold. Ingen gamification, ingen nedtelling som skaper press, ingen «X personer venter».
- Skill tydelig mellom «profil ikke ferdig» og «venter på match» — to ulike tilstander med ulike neste-steg.
Sjekk 1 (tsc): `npx tsc --noEmit`
Sjekk 2 (grep): `grep -rn "TODO\|kommer snart\|placeholder" components/dashboard/WaitingForMatch.tsx` → **0 treff**
Sjekk 3 (build): `npm run build`
Sjekk 4 (FUNKSJONELT): Bruker med fullført profil og ingen match ser ventetilstanden med forklarende tekst og tidspunkt. Bruker med ufullstendig profil ser i stedet oppfordring om å fullføre. Verifisert manuelt i nettleser på mobil og desktop.
State: currentWave=6, currentStep="5.4", completedSteps+=["5.4"], nextStep="6.1"
Rollback: `git checkout -- components/dashboard/WaitingForMatch.tsx`
Commit: `feat(ux): designet ventetilstand for dashboard [ACT3 5.4]`

---

# BØLGE 6 — LANSERINGSVERIFISERING (3 steg) 🔴

## STEG 6.1 — E2E for hele verdikjeden
Formål: Ingen test dekker den fulle kjeden i dag. FUNN 2 ville blitt fanget av én slik test.
Avhengigheter: 5.4
Risiko: Middels
Filanker: `e2e/tests/` (ny spec), `playwright.config.ts`
Patch-skisse:
- Ny spec som dekker: registrer → fullfør onboarding → kjør matching-cron → match finnes → aksepter → chat sender melding → journey viser dag 1.
- Cron trigges i testen via HTTP-kall med testsecret — ikke via ventetid.
- Harde asserts. Ingen conditional asserts (ACT v2.0 steg 12.6 fjernet disse — ikke innfør dem igjen).
- Koble spec'en til `e2e`-jobben i CI.
Sjekk 1 (tsc): `npx tsc --noEmit`
Sjekk 2 (grep): `grep -rn "if (.*) await expect" e2e/tests/` → **0 treff**
Sjekk 3 (build): `npm run build`
Sjekk 4 (FUNKSJONELT): `npx playwright test` → hele kjeden **grønn** lokalt mot faktisk database. Samme spec grønn i CI.
State: currentWave=6, currentStep="6.1", completedSteps+=["6.1"], nextStep="6.2"
Rollback: `git revert <lastCommit>`
Commit: `test(e2e): dekk hele verdikjeden fra registrering til journey [ACT3 6.1]`

## STEG 6.2 — Verifisert backup og gjenoppretting
Formål: En backup som ikke er gjenopprettet er en antakelse, ikke en backup.
Avhengigheter: 6.1
Risiko: Høy
Filanker: `scripts/db/backup.ts`, `deploy/backup.md`
Patch-skisse:
- Kjør faktisk backup av produksjonslik database.
- **Gjenopprett den til en ny, tom database** og verifiser radantall i `User`, `Profile`, `Match`, `Message`.
- Dokumenter tidsbruk og eksakte kommandoer i `deploy/backup.md`.
- Ingen kodeendring hvis skriptet virker — dette er en verifiseringsøvelse.
Sjekk 1 (tsc): `npx tsc --noEmit`
Sjekk 2 (grep): `grep -n "gjenoppretting\|restore" deploy/backup.md` → **≥ 1 treff**
Sjekk 3 (build): `npm run build`
Sjekk 4 (FUNKSJONELT): Radantall i gjenopprettet database **stemmer med kilden** for alle fire tabeller. Tidsbruk dokumentert.
State: currentWave=6, currentStep="6.2", completedSteps+=["6.2"], nextStep="6.3"
Rollback: Ikke relevant (ingen produksjonsendring).
Commit: `docs(deploy): verifiser backup og gjenoppretting [ACT3 6.2]`

## STEG 6.3 — Produksjonssmoke-test
Formål: Siste port før lansering. Alt skal verifiseres i faktisk produksjonsmiljø, ikke lokalt.
Avhengigheter: 6.2
Risiko: Høy
Filanker: `LAUNCH-CHECKLIST.md`
Patch-skisse:
- Verifiser i produksjon: registrering, innlogging, onboarding lagres serverside, cron kjører (sjekk `SystemLog`), match opprettes, chat sender, journey viser riktig dag/fase.
- Verifiser at auth-bypassene er lukket: `Cookie: authjs.session-token=x` → 401; `base64('{"role":"admin"}')` → redirect.
- Verifiser at Sentry mottar hendelser og at `/api/system/cron-health` gir 200.
- Verifiser at `dev-login` og `test-login` er blokkert i produksjon.
- Kryss av i `LAUNCH-CHECKLIST.md` med dato og resultat per punkt.
Sjekk 1 (tsc): `npx tsc --noEmit`
Sjekk 2 (grep): `grep -c "\[ \]" LAUNCH-CHECKLIST.md` → **0 uavklarte punkter**
Sjekk 3 (build): `npm run build`
Sjekk 4 (FUNKSJONELT): Alle punkter over observert i produksjon. Minst én match generert av faktisk nattlig cron-kjøring, bekreftet i database — **ikke i logg**.
State: currentWave=7, currentStep="6.3", completedSteps+=["6.3"], nextStep="FULLFØRT"
Rollback: Følg rollback-prosedyren i `POST-LAUNCH-HARDENING.md`.
Commit: `docs(launch): fullfør produksjonssmoke-test [ACT3 6.3]`

---

# AVSLUTNING

Når `nextStep` er `"FULLFØRT"`:

1. Skriv `docs/TOSOM-ACT-v3-FINAL-REPORT.md` med:
   - Antall steg fullført / feilet, med årsak per feilet steg
   - Alle `deviations` i tabellform
   - **Sjekk 4-resultat per steg** (dette er hovedpoenget med v3.0 — vis at funksjonen faktisk er observert, ikke bare kompilert)
   - Oppdatert lanseringsscore målt mot Masterplan v2.0 §6.1
   - Hva som gjenstår fra «kan vente»-listen (Masterplan §6.6)
2. Ikke hev lanseringsscore i rapporten uten at Sjekk 4 er `pass` for de aktuelle stegene. ACT v2.0-rapporten anslo 90–95 % mens tre kjernefunksjoner var brutt. **Ikke gjenta det.**

---

# HURTIGREFERANSE

**Bølgeoversikt**

| Bølge | Tema | Steg | Prioritet |
|---|---|---|---|
| 0 | Baseline | 2 | — |
| 1 | Gjenoppliv systemet (cron) | 4 | 🔴 SPERRE |
| 2 | Auth og sikkerhet | 7 | 🔴 |
| 3 | Grønn CI | 5 | 🟠 |
| 4 | Matching og journey | 5 | 🟠 |
| 5 | Rydding og UX | 4 | 🟠 |
| 6 | Lanseringsverifisering | 3 | 🔴 |
| **Sum** | | **30** | |

**De fire sjekkene, hver gang**
```bash
npx tsc --noEmit          # Sjekk 1
<grep fra steget>          # Sjekk 2
npm run build              # Sjekk 3
<DB-tilstand / HTTP-kode>  # Sjekk 4 ← avgjør DONE
```

**Utenfor omfang (post-launch, Masterplan §6.6)**
Journey-motor → 7 moduler · `components/ui/*`-audit · design-token-konsolidering · `microcopy.ts`-oppdeling · én auth-inngang på alle 98 ruter · CSRF overalt · Vipps ePayment · denormalisering av Json-felt · blocking/bucketing · worker-kø · read replicas · sharding.

**Ved tvil:** spør bruker. Ikke improviser. Ikke utvid omfanget.

---

*TOSOM-ACT-INSTRUKS-v3.0 — Launch Edition. 13. august 2026.*
*Basert på `docs/TOSOM-MASTERPLAN-v2.0.md`, verifisert mot commit `7f2d269`.*
