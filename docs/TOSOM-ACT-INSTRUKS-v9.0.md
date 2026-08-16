# TOSOM-ACT-INSTRUKS-v9.0

**Runde A — sikre og rette. 8 steg i 3 bølger.**

| | |
|---|---|
| **Dokumentversjon** | 9.0 |
| **Dato** | 16. august 2026 |
| **Utgangscommit** | `b07e2cf` |
| **Grunnlag** | `docs/TOSOM-MASTERPLAN-v8.0.md` |
| **State-fil** | `docs/ACT-STATE-v9.json` |
| **Antall steg** | 8 |
| **Antall bølger** | 3 (nummerert 0–2) |
| **Mål** | Gjøre vilkårssiden tilgjengelig, fullføre venterommet, koble aldersgrense og footer |

> Dette er en kort, mekanisk runde. Ingen visuell omlegging — det er ACT v10. Ingen tekstomskriving på offentlige sider — det er ACT v11.

---

## Innhold

1. [ACT-regler](#1-act-regler)
2. [State-fil](#2-state-fil)
3. [Bølgeoversikt](#3-bølgeoversikt)
4. [Stegene](#4-stegene)
5. [Locking-regler](#5-locking-regler)
6. [Stop-regler](#6-stop-regler)
7. [Verifikasjonsregler](#7-verifikasjonsregler)
8. [Avslutning](#8-avslutning)

---

# 1. ACT-regler

## 1.1 Utførelse

1. **Ett steg per ACT-kommando.**
2. **Ingen parallellitet.**
3. **Ingen hopp fremover.**
4. **Ingen endring av locked steg** uten eksplisitt ordre.
5. **Ingen nye funksjoner.** Alt skal ha belegg i masterplan v8.0.
6. **Ingen nye API-ruter.**
7. **Ingen endring i `lib/matching/` eller `lib/journey/`.**
8. **Ingen migrasjoner.** `prisma/schema.prisma` uendret.
9. **Ingen endring av scoring eller terskler.**
10. **Ingen visuell omlegging.** GlassCard, inline stiler og glass-komponenter er ACT v10.
11. **Ingen tekstendring på offentlige sider.** «24 timer» og priser er ACT v11.

## 1.2 Den nye verifikasjonsregelen

ACT v8 markerte steg 3.1 og 3.2 som locked uten at filen var endret. Alle fire `grep`-verifikasjoner ville feilet, men ingen ble kjørt.

**Fra og med v9: hver verifikasjonskommando skal limes inn med faktisk utskrift.**

Ikke «grep OK». Ikke «verifisert». Den konkrete linjen kommandoen skrev, kopiert inn i rapporten.

En verifikasjon som ikke kjøres, ser identisk ut som en som består. Dette er den eneste måten å skille dem.

## 1.3 Områder som er ferdige

| Område | Ikke rør |
|---|---|
| Matchemotoren | `lib/matching/`, `config/matching.ts` |
| Journey-motoren | `lib/journey/` |
| Databaseskjema | `prisma/` |
| Radius-utpakkingen fra v8 | `app/api/cron/matching/route.ts:193-195` |
| Tailwind-konfigurasjonen fra v8 | `styles/globals.css:1-2` |
| Kadensen fra v8 | `vercel.json` |
| Sentry | `next.config.js`, `instrumentation*.ts` |

## 1.4 Utenfor v9

| Sak | Runde |
|---|---|
| Samle tretten GlassCard | ACT v10 |
| Fjerne inline stiler | ACT v10 |
| Hover via CSS | ACT v10 |
| Fade-in på logo og «Made in Norway» | ACT v10 |
| «24 timer» → ukentlig kadens på offentlige sider | ACT v11 |
| Priser og «de første 10 000» | ACT v11 |
| Vilkår med ordensregler | ACT v11 |
| Rapporteringsfunksjon | ACT v11 |
| 144 spørsmål, DSN, monitor, gjenoppretting | George |

---

# 2. State-fil

## 2.1 Format

`docs/ACT-STATE-v9.json` finnes allerede. **Skal ikke opprettes på nytt.**

```json
{
  "version": "9.0",
  "baseCommit": "b07e2cf",
  "currentStep": "0.1",
  "completedSteps": [],
  "lockedSteps": [],
  "pendingSteps": ["0.1","0.2","1.1","1.2","1.3","1.4","2.1","2.2"],
  "errors": [],
  "observations": [],
  "baseline": {},
  "updatedAt": ""
}
```

## 2.2 Oppdateringsregler

Etter hvert steg: fjern fra `pendingSteps`, legg i `completedSteps` og `lockedSteps`, sett `currentStep`, sett `updatedAt`. Ved feil: objekt i `errors`. `baseline` fylles kun i 0.2.

**I tillegg fra v9:** hvert steg skal legge sin faktiske verifikasjonsutskrift i `observations`.

---

# 3. Bølgeoversikt

| Bølge | Navn | Steg | Løser |
|---|---|---|---|
| **0** | Grunnlinje | 0.1, 0.2 | — |
| **1** | Tilgjengelighet og løfter | 1.1, 1.2, 1.3, 1.4 | Vilkår, venterom, angrerett, alder |
| **2** | Footer og avslutning | 2.1, 2.2 | Footer, overlevering |

---

# 4. Stegene

---

## BØLGE 0 — Grunnlinje

---

### STEG 0.1 — Verifiser utgangspunktet

**Formål:** Bekrefte rent tre og at v8 er sikret i git.

**Avhengighet:** Ingen.

**Risiko:** Lav.

**Filanker:** `docs/ACT-STATE-v8.json`, `docs/ACT-STATE-v9.json`

**Instruks:**

1. `git status --porcelain` skal være tom. Ellers **stopp.**
2. Bekreft at v8-arbeidet er commitet:
   ```bash
   git --no-pager log --oneline -6 --no-decorate
   ```
   Skal vise `b07e2cf` og de fire foregående ACT8-commitene.
3. Oppdater `docs/ACT-STATE-v9.json`: flytt `0.1` til `completedSteps` og `lockedSteps`, sett `currentStep` til `"0.2"`.

**Verifikasjon:** *(lim inn faktisk utskrift)*
```bash
git status --porcelain
git rev-parse --short HEAD
jq -r '.currentStep' docs/ACT-STATE-v9.json
```

**State-oppdatering:** `completedSteps += ["0.1"]`, `lockedSteps += ["0.1"]`, `currentStep = "0.2"`

**Rollback:** `git restore docs/ACT-STATE-v9.json`

**Commit-mal:** `chore(act): verifiser v8-tilstand før ACT v9`

---

### STEG 0.2 — Mål grunnlinjen

**Formål:** Fryse målt tilstand av de fire feilene som skal rettes.

**Avhengighet:** `0.1` locked.

**Risiko:** Lav.

**Filanker:** Kun `docs/ACT-STATE-v9.json`.

**Instruks:**

Start en dev-server, kjør hver kommando, skriv **faktisk resultat** til `baseline`.

```bash
npm run dev > /tmp/dev.log 2>&1 &
sleep 12

# Vilkårssiden — forventet redirect-løkke
curl -s -o /dev/null -w "vilkår: %{http_code} → %{redirect_url}\n" "http://localhost:3000/vilk%C3%A5r"
curl -s -o /dev/null -w "vilkar: %{http_code}\n" "http://localhost:3000/vilkar"

# Venterommet
grep -c "lørdag" components/dashboard/WaitingForMatch.tsx
grep -c "melde deg ut\|pengene tilbake" components/dashboard/WaitingForMatch.tsx
grep -rn "journey/exit" components/dashboard/WaitingForMatch.tsx | wc -l

# Aldersgrense
grep -rl "AgeRequirement" app/ components/ --include=*.tsx | grep -v "components/AgeRequirement.tsx" | wc -l

# Footer
find components -iname "*footer*"
grep -rn "components/layout/Footer" app/ components/ --include=*.tsx | wc -l

# Harde prøver
npx tsc --noEmit 2>&1 | grep -c "error TS"
npx jest 2>&1 | tail -3
```

Skriv som:

```json
"baseline": {
  "vilkarStatus": "301 løkke",
  "vilkarUtenAa": 404,
  "venteromLordag": 0,
  "venteromAngrerett": 0,
  "venteromExitLenke": 0,
  "ageRequirementBrukt": 0,
  "footerKomponenter": 2,
  "gammelFooterBrukt": 0,
  "tscErrors": 0,
  "jest": "140/140"
}
```

**Verifikasjon:** *(lim inn faktisk utskrift)*
```bash
jq '.baseline' docs/ACT-STATE-v9.json
```

**State-oppdatering:** `baseline = {…}`, `completedSteps += ["0.2"]`, `lockedSteps += ["0.2"]`, `currentStep = "1.1"`

**Rollback:** `git restore docs/ACT-STATE-v9.json`

**Commit-mal:** `chore(act): grunnlinjemåling før runde A`

---

## BØLGE 1 — Tilgjengelighet og løfter

---

### STEG 1.1 — Gjør vilkårssiden tilgjengelig

**Formål:** Rette redirect-løkken som gjør en juridisk påkrevd side uleselig.

**Avhengighet:** `0.2` locked.

**Risiko:** Middels — berører middleware som all trafikk går gjennom.

**Filanker:**
```
middleware.ts:60-63     LEGACY_REDIRECTS
middleware.ts:62        '/vilk%C3%A5r': '/vilkår',
middleware.ts:72-78     redirect-logikken
app/vilkår/page.tsx     328 linjer, siden som ikke kan nås
```

**Diagnosen:** `middleware.ts:62` sender `/vilk%C3%A5r` til `/vilkår`. Next.js koder målet tilbake til `/vilk%C3%A5r` i `Location`-headeren, som treffer samme regel på nytt. Uendelig løkke.

Målt: `/vilkår` → 301 med `Location: /vilk%C3%A5r` → 301 → 301.

**Instruks:**

**Del A — velg løsning.**

To veier:

1. **Fjern regelen** fra `LEGACY_REDIRECTS`. Da svarer `/vilkår` direkte med 200, siden Next.js håndterer æøå i katalognavn selv.
2. **Bytt til `/vilkar`** som kanonisk rute: gi katalogen nytt navn, og redirect fra den kodede varianten.

**Anbefaling: alternativ 1 i dette steget.** Det er minst inngripende og løser problemet umiddelbart. Å gi katalogen nytt navn berører alle lenker og hører i en egen oppgave.

**Del B — utfør.**

Fjern linjen `'/vilk%C3%A5r': '/vilkår',` fra `middleware.ts:62`.

Er `LEGACY_REDIRECTS` da tomt, la objektet stå tomt med en kommentar om at det er tilgjengelig for framtidige omdirigeringer. **Ikke fjern hele mekanismen** — den kan trengs senere.

**Del C — verifiser at siden faktisk laster.**

Ikke bare statuskode. Bekreft at innholdet kommer:

```bash
curl -s "http://localhost:3000/vilk%C3%A5r" | grep -c "Aldersgrense"
```

**Del D — kontroller at ingenting annet brøt.**

Middleware håndterer også maintenance-modus, admin-stier og autentisering. Kontroller at forsiden, `/priser` og en beskyttet rute oppfører seg som før.

**Verifikasjon:** *(lim inn faktisk utskrift for hver)*
```bash
grep -c "vilk%C3%A5r" middleware.ts                                        # 0
curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:3000/vilk%C3%A5r"   # 200
curl -s "http://localhost:3000/vilk%C3%A5r" | grep -c "Aldersgrense"       # >= 1
curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:3000/"          # 200
curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:3000/priser"    # 200
npx tsc --noEmit
npm run build
```

**Stop-regel:** gir `/vilkår` fortsatt annet enn 200, **stopp og rapporter hele `curl -I`-utskriften.** Ikke prøv en tredje variant.

**State-oppdatering:** `observations += ["1.1: vilkår <faktisk statuskode>, innhold <treff>"]`, `completedSteps += ["1.1"]`, `lockedSteps += ["1.1"]`, `currentStep = "1.2"`

**Rollback:** `git restore middleware.ts`

**Commit-mal:** `fix(middleware): fjern redirect-løkke som gjorde vilkår utilgjengelig`

---

### STEG 1.2 — Venterommet sier riktig tidspunkt

**Formål:** Fullføre det ACT v8 steg 3.1 ikke gjorde.

**Avhengighet:** `1.1` locked.

**Risiko:** Lav.

**Filanker:**
```
components/dashboard/WaitingForMatch.tsx:1      'use client'
components/dashboard/WaitingForMatch.tsx:82     export function WaitingForMatch({ userName })
components/dashboard/WaitingForMatch.tsx:140    «Din match er på vei, {userName}»
components/dashboard/WaitingForMatch.tsx        234 linjer
```

**Bakgrunn:** filen er byte-identisk med commit `e23ef45` fra ACT v5. Steg 3.1 i v8 ble markert locked uten at noe ble endret.

**Instruks:**

1. **Les hele komponenten først** og skriv til `observations` hva den viser i dag. Dette er nødvendig for å unngå å ødelegge noe som virker.

2. Erstatt teksten på `:140` og omkringliggende brødtekst med **denne ordlyden fra masterplan v8.0 del 6.4:**

   > **Du står i kø**
   >
   > Vi kobler natt til lørdag. Da får du beskjed, og reisen starter.

   Brukernavnet kan beholdes hvis det passer inn, for eksempel «Du står i kø, {userName}».

3. **Ingen nedtelling.** Finnes det timer, minutter eller «snart» i komponenten, fjern det.

4. Tonen: rolig og voksen. Ingen utropstegn. **Bokmål** — språkvakten kjøres etterpå.

5. **Ikke** legg inn angrerettlenken her. Det er steg 1.3.

6. **Ingen ny komponent, ingen ny rute.** Endre den som finnes.

7. Behold emoji-orben på `:55` hvis den finnes — den er del av det visuelle og hører til ACT v10.

**Verifikasjon:** *(lim inn faktisk utskrift for hver)*
```bash
grep -c "lørdag" components/dashboard/WaitingForMatch.tsx        # >= 1
grep -c "står i kø" components/dashboard/WaitingForMatch.tsx     # >= 1
grep -c "på vei" components/dashboard/WaitingForMatch.tsx        # 0
grep -c "timer igjen\|minutter igjen" components/dashboard/WaitingForMatch.tsx   # 0
git diff --stat components/dashboard/WaitingForMatch.tsx         # SKAL vise endring
npm run verify:lang                                              # exit 0
npx tsc --noEmit
npm run build
```

**Kritisk:** `git diff --stat` skal vise at filen er endret. Er den tom, er steget ikke utført — det var nøyaktig feilen i v8.

**State-oppdatering:** `observations += ["1.2: venterommet viste <før> → viser nå <etter>"]`, `completedSteps += ["1.2"]`, `lockedSteps += ["1.2"]`, `currentStep = "1.3"`

**Rollback:** `git restore components/dashboard/WaitingForMatch.tsx`

**Commit-mal:** `feat(dashboard): venterommet sier natt til lørdag`

---

### STEG 1.3 — Angrerettlenken

**Formål:** Fullføre det ACT v8 steg 3.2 ikke gjorde. Angreretten er et lovkrav.

**Avhengighet:** `1.2` locked.

**Risiko:** Lav.

**Filanker:**
```
components/dashboard/WaitingForMatch.tsx    fra steg 1.2
app/api/journey/exit/                       eksisterende utmeldingsrute
app/vilkår/page.tsx:159                     angrerett i vilkårene
```

**Utformingen er bestemt** i masterplan v8.0 del 9.3: ikke en knapp, men en **nedtonet lenke** nederst i venterommet. Der for den som leter, usynlig for den som ikke gjør det.

**Instruks:**

1. Les `app/api/journey/exit/route.ts` og fastslå hvilken metode og hvilket kall som forventes.

2. Legg inn nederst i venterommet, i mindre og dempet skrift:

   > Ombestemmer du deg før lørdag, kan du melde deg ut og få pengene tilbake.

3. Legg til en rolig setning om levering:

   > Fra lørdag er dere to i gang.

4. Lenken bruker eksisterende utmeldingsflyt. **Ingen ny rute.**

5. Ingen bekreftelsesdialog med skremmende språk. Melder hun seg ut, skal det være enkelt.

6. Ikke en knapp med ramme eller farge. En tekstlenke.

**Verifikasjon:** *(lim inn faktisk utskrift for hver)*
```bash
grep -c "melde deg ut" components/dashboard/WaitingForMatch.tsx      # >= 1
grep -c "pengene tilbake" components/dashboard/WaitingForMatch.tsx   # >= 1
grep -c "i gang" components/dashboard/WaitingForMatch.tsx            # >= 1
grep -rn "journey/exit" components/dashboard/WaitingForMatch.tsx     # >= 1 treff
npm run verify:api                                                   # exit 0
npm run verify:lang                                                  # exit 0
npx tsc --noEmit
npm run build
```

**State-oppdatering:** `observations += ["1.3: angrerettlenke lagt inn, peker på <rute>"]`, `completedSteps += ["1.3"]`, `lockedSteps += ["1.3"]`, `currentStep = "1.4"`

**Rollback:** `git restore components/dashboard/WaitingForMatch.tsx`

**Commit-mal:** `feat(dashboard): angrerett som nedtonet lenke i venterommet`

---

### STEG 1.4 — Aldersgrensen synlig

**Formål:** Vise 23+ tydelig på landingssiden.

**Avhengighet:** `1.3` locked.

**Risiko:** Lav.

**Filanker:**
```
components/AgeRequirement.tsx           7 linjer, brukes 0 steder
app/(landing)/page.tsx                  393 linjer, 'use client'
app/(landing)/page.tsx:143-155           rot og ambient glød
```

**Viktig funn:** `components/AgeRequirement.tsx` er ikke et merke — den er en enkel `<span>` med teksten «23 år eller eldre»:

```tsx
export function AgeRequirement() {
  return (
    <span className="text-white/95 font-semibold">
      23 år eller eldre
    </span>
  );
}
```

Den er altså tenkt brukt **inne i en setning**, ikke som et frittstående merke øverst.

**Instruks:**

1. **Ikke bygg om `AgeRequirement`.** Den er 7 linjer og gjør én ting.

2. Legg inn et **dempet aldersmerke** øverst på landingssiden — over eller ved hovedoverskriften — med teksten `23+`.

   Utforming: liten, rolig, med gullaksent fra tokens. Ikke en stor farget knapp. Bruk Tailwind-klasser, ikke inline `style` — Tailwind virker nå.

3. I nærheten, en forklarende linje:

   > ToSom er for deg som har fylt 23.

   Her **kan** `<AgeRequirement />` brukes hvis det passer grammatisk. Passer det ikke, skriv teksten direkte og la komponenten stå ubrukt — noter det i `observations`.

4. **Ingen omlegging av landingssidens struktur.** Kun dette ene tillegget. Resten er ACT v10.

5. **Ingen inline `style`** i det du legger til. Bruk klasser.

**Verifikasjon:** *(lim inn faktisk utskrift for hver)*
```bash
grep -c "23+" app/\(landing\)/page.tsx                    # >= 1
grep -c "fylt 23" app/\(landing\)/page.tsx                # >= 1
curl -s http://localhost:3000/ | grep -o "23+" | head -2  # >= 1 i rendret HTML
grep -c 'style="' app/\(landing\)/page.tsx                # skal ikke ha økt
npm run verify:lang                                        # exit 0
npx tsc --noEmit
npm run build
```

**Stop-regel:** ser merket rart ut i forhold til resten av siden, **stopp og rapporter.** Det er en visuell vurdering, og ACT v10 kommer rett etter.

**State-oppdatering:** `observations += ["1.4: 23+ plassert <hvor>, AgeRequirement brukt: ja/nei"]`, `completedSteps += ["1.4"]`, `lockedSteps += ["1.4"]`, `currentStep = "2.1"`

**Rollback:** `git restore "app/(landing)/page.tsx"`

**Commit-mal:** `feat(landing): synlig aldersgrense 23+`

---

## BØLGE 2 — Footer og avslutning

---

### STEG 2.1 — Én footer med juridiske lenker

**Formål:** Fjerne den døde footeren og sikre at vilkår og personvern er lenket.

**Avhengighet:** `1.4` locked.

**Risiko:** Lav.

**Filanker:**
```
components/ui/layout/Footer.tsx      250 linjer — KANONISK, importeres av 6+ sider
components/layout/Footer.tsx         34 linjer — DØD, 0 importer
components/ui/layout/Footer.tsx:115  href={link.href}
components/ui/layout/Footer.tsx:147  href={link.href}
components/ui/layout/Footer.tsx:179  href={link.href}
```

**Målt:** `components/layout/Footer.tsx` har **null** importer noe sted. `components/ui/layout/Footer.tsx` brukes av `priser`, `vilkår`, `hvorfor`, `cookies`, `om-oss`, `personvern` og flere.

**Instruks:**

1. Bekreft først at den korte footeren er død:
   ```bash
   grep -rn "components/layout/Footer" app/ components/ --include=*.tsx
   ```
   Gir dette treff, **stopp og rapporter.** Ellers slett `components/layout/Footer.tsx`.

2. Les `components/ui/layout/Footer.tsx` og finn lenkegruppene som rendres på `:115`, `:147` og `:179`.

3. Kontroller om `/vilkår`, `/personvern` og `/cookies` finnes blant lenkene. Mangler noen, legg dem inn i den gruppen som passer — sannsynligvis en «juridisk»-kolonne.

4. **Ingen visuell omlegging av footeren.** Kun lenker. Utseende er ACT v10.

**Verifikasjon:** *(lim inn faktisk utskrift for hver)*
```bash
test -f components/layout/Footer.tsx && echo "FEIL: finnes" || echo "OK: slettet"
find components -iname "*footer*"                            # 1 fil
grep -c "vilkår" components/ui/layout/Footer.tsx             # >= 1
grep -c "personvern" components/ui/layout/Footer.tsx         # >= 1
curl -s http://localhost:3000/ | grep -c "vilk"              # >= 1 i rendret HTML
npm run verify:api                                            # exit 0
npx tsc --noEmit
npm run build
```

**State-oppdatering:** `observations += ["2.1: footer-lenker <faktisk liste>"]`, `completedSteps += ["2.1"]`, `lockedSteps += ["2.1"]`, `currentStep = "2.2"`

**Rollback:** `git restore components/`

**Commit-mal:** `fix(footer): én footer med juridiske lenker`

---

### STEG 2.2 — Sluttverifikasjon og overlevering

**Formål:** Bekrefte at runde A er ferdig, og overlevere til ACT v10.

**Avhengighet:** `2.1` locked.

**Risiko:** Lav.

**Filanker:** `docs/ACT-STATE-v9.json`, ny fil `docs/ROUND-B-HANDOVER.md`

**Instruks:**

1. Full verifikasjon, med **faktisk utskrift limt inn for hver**:
   ```bash
   npx tsc --noEmit
   npx prisma format --check
   npx jest
   npm run build
   npm run verify:api
   npm run verify:lang
   ```

2. Vokterkontroll:
   ```bash
   git diff --stat b07e2cf..HEAD -- lib/ prisma/ config/matching.ts
   ```
   **Krav: tom.**

3. Funksjonell kontroll med dev-server:
   ```bash
   curl -s -o /dev/null -w "vilkår: %{http_code}\n" "http://localhost:3000/vilk%C3%A5r"
   curl -s http://localhost:3000/ | grep -c "23+"
   curl -s http://localhost:3000/ | grep -c "vilk"
   ```

4. Bekreft at Tailwind fortsatt virker. **Merk: det finnes to CSS-filer** — les alle:
   ```bash
   cat .next/static/css/*.css > /tmp/all.css
   grep -o 'md\\:' /tmp/all.css | wc -l
   ```
   Krav: over 0. Måler man bare den nyeste filen, får man 0 og feil konklusjon.

5. Skriv `docs/ROUND-B-HANDOVER.md`:

   **Ferdig i v9:**

   | Sak | Steg |
   |---|---|
   | Vilkårssiden tilgjengelig | 1.1 |
   | Venterom med riktig tidspunkt | 1.2 |
   | Angrerettlenke | 1.3 |
   | Aldersgrense synlig | 1.4 |
   | Én footer med juridiske lenker | 2.1 |

   **Til ACT v10 — visuelt fundament:**

   | Sak | Målt tilstand |
   |---|---|
   | Tretten lokale GlassCard | `grep -rl "const GlassCard" app/` = 13 |
   | Inline stiler | `/` 91, `/priser` 79, `/hvorfor` 106, `/om-oss` 106 |
   | JS-hover | `onMouseEnter` muterer `currentTarget.style` |
   | Fem glass-komponenter | `components/ui/` |
   | Fade-in på logo og «Made in Norway» | `ts-fade-in` finnes i tokens |
   | Delt komponent som ikke brukes | `components/ui/cards/GlassCard.tsx` |

   **Til ACT v11 — tekst.** Vis til masterplan v8.0 del 6, og gjenta skillet: seks matchingsteder skal endres, tre supportsteder skal **ikke** endres.

6. Sett `currentStep` til `null` og skriv `finalVerification`.

**Verifikasjon:** *(lim inn faktisk utskrift)*
```bash
git diff --stat b07e2cf..HEAD -- lib/ prisma/     # tom
jq -r '.pendingSteps | length' docs/ACT-STATE-v9.json   # 0
test -f docs/ROUND-B-HANDOVER.md && echo OK
```

**State-oppdatering:** `finalVerification = {…}`, `completedSteps += ["2.2"]`, `lockedSteps += ["2.2"]`, `currentStep = null`

**Rollback:** `rm docs/ROUND-B-HANDOVER.md`

**Commit-mal:** `docs(act): sluttverifikasjon v9 og overlevering til runde B`

---

# 5. Locking-regler

## 5.1 Når et steg er ferdig

Skriv nøyaktig:

```
Steg X.Y er nå locked. Ikke endre dette senere.
```

**Og lim inn verifikasjonsutskriften.** Uten den er steget ikke låst.

## 5.2 Hva locking betyr

Et locked steg er ferdig. Ikke endre filene det berørte, ikke «forbedre», ikke rett stil i etterkant.

Ser du et problem i et locked steg: **skriv det i `errors` og fortsett.**

## 5.3 Eneste unntak

Ordren `Lås opp steg X.Y` fra George.

---

# 6. Stop-regler

## 6.1 Absolutte stopp

1. **Endring i `lib/matching/` eller `lib/journey/`**
2. **Endring i `prisma/` eller migrasjon**
3. **Endring av `MIN_SCORE`, vekter eller terskler**
4. **Ny API-rute**
5. **Ny avhengighet** i `package.json`
6. **Visuell omlegging** — GlassCard, inline stiler, glass-komponenter er ACT v10
7. **Tekstendring om «24 timer» eller pris på offentlige sider** — ACT v11
8. **Endring av `styles/globals.css`** — Tailwind-oppsettet er ferdig
9. **Endring av `vercel.json`** — kadensen er ferdig
10. **Endring av radius-utpakkingen** i cron-ruten

## 6.2 Alminnelige stopp

11. Filen i filankeret avviker fra beskrivelsen
12. `npx tsc --noEmit` gir feil
13. `npm run build` feiler
14. `verify:api` eller `verify:lang` gir exit 1
15. En test som var grønn blir rød
16. En `grep`-verifikasjon gir uventet resultat
17. `git diff --stat` er tom der steget skulle endre en fil
18. Instruksen er tvetydig og du må gjette
19. Noe ser visuelt brutt ut

## 6.3 Hvordan du stopper

```
STOPP — Steg X.Y

Hva jeg forsøkte:
  <konkret handling>

Hva som skjedde:
  <faktisk utskrift, ordrett>

Hvilken stop-regel som utløste:
  <nummer fra del 6>

Løsning 1: <forslag>
  Konsekvens: <hva det medfører>

Løsning 2: <forslag>
  Konsekvens: <hva det medfører>

Venter på godkjenning.
```

## 6.4 Hva du aldri gjør

- Ikke prøv en tredje variant på egen hånd
- Ikke deaktiver en test
- Ikke legg til `// @ts-ignore` eller `any`
- Ikke utvid omfanget
- Ikke rett visuelle ting du synes ser rart ut
- **Ikke marker et steg som locked uten å ha kjørt verifikasjonen**

**To forsøk. Deretter stopp.**

---

# 7. Verifikasjonsregler

## 7.1 Fast rekkefølge

```bash
npx tsc --noEmit
npm run build
npm run verify:api
npm run verify:lang
npx jest
```

## 7.2 Vokterkontroll

```bash
git diff --stat b07e2cf..HEAD -- lib/ prisma/ config/matching.ts
```

Krav: **tom** gjennom hele v9.

## 7.3 Hva som teller som bestått

| Sjekk | Krav |
|---|---|
| tsc | 0 feil |
| build | Grønn |
| jest | ≥ 140, alle grønne |
| verify:api | exit 0 |
| verify:lang | exit 0 |
| Vokterkontroll | Tom |
| `git diff --stat` per steg | **Ikke tom** der filen skal endres |
| Verifikasjonsutskrift | Limt inn, ikke bare bekreftet |

## 7.4 Sjekk 10 — verifikasjonen må vises

Sjekk 9 fra v7 krevde at en måling skal kunne gi et annet svar. Den fanget ikke at steg 3.1 og 3.2 i v8 aldri ble utført — fordi verifikasjonen ikke ble kjørt i det hele tatt.

**Sjekk 10: hver verifikasjon skal limes inn med faktisk utskrift.**

For hvert steg som endrer en fil, gjelder i tillegg:

```bash
git diff --stat <filen>
```

**Er den tom, er steget ikke utført.** Uansett hva som ellers står i rapporten.

| Steg | Fil som SKAL være endret |
|---|---|
| 1.1 | `middleware.ts` |
| 1.2 | `components/dashboard/WaitingForMatch.tsx` |
| 1.3 | `components/dashboard/WaitingForMatch.tsx` |
| 1.4 | `app/(landing)/page.tsx` |
| 2.1 | `components/ui/layout/Footer.tsx`, sletting av `components/layout/Footer.tsx` |

---

# 8. Avslutning

## 8.1 Full verifikasjon

Kjør del 7.1 og 7.2 i sin helhet. Lim inn all utskrift.

## 8.2 Funksjonell kontroll

Med kjørende dev-server: vilkårssiden svarer 200 og viser innhold, `23+` finnes i rendret HTML fra forsiden, footeren lenker til vilkår og personvern.

## 8.3 Oppdatert lanseringsvurdering

Masterplan v8.0 satte 84 % for lukket beta. Tre av de fire tingene som holdt tallet nede lukkes i denne runden.

Rapporter et nytt anslag med begrunnelse. **Rapporter ærlig** — er et steg delvis gjennomført, skriv det.

## 8.4 Sluttstate

```json
{
  "currentStep": null,
  "completedSteps": ["0.1","0.2","1.1","1.2","1.3","1.4","2.1","2.2"],
  "lockedSteps":    ["0.1","0.2","1.1","1.2","1.3","1.4","2.1","2.2"],
  "pendingSteps": [],
  "finalVerification": {
    "tsc": "0 feil",
    "jest": "<faktisk>",
    "build": "grønn",
    "verifyApi": "exit 0",
    "verifyLang": "exit 0",
    "vilkarStatus": "<faktisk statuskode>",
    "aldersmerke": "<funnet i rendret HTML: ja/nei>",
    "footerKomponenter": 1,
    "guardCheck": "tom"
  },
  "nextRound": "Runde B — visuelt fundament. Se docs/ROUND-B-HANDOVER.md",
  "updatedAt": "<ISO>"
}
```

## 8.5 Hva som kommer etter

ACT v10 samler tretten GlassCard til én, fjerner inline stiler, og flytter hover fra JavaScript til CSS. Det er runden som gir tilbake premium-følelsen.

ACT v11 setter inn teksten fra masterplan v8.0 del 6, ord for ord.

---

*TOSOM-ACT-INSTRUKS-v9.0 — 8 steg, 3 bølger, basert på TOSOM-MASTERPLAN-v8.0 ved commit `b07e2cf`.*
