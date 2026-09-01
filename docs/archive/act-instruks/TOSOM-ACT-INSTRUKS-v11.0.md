# TOSOM-ACT-INSTRUKS-v11.0

**Runde C — tekst og innhold. 9 steg i 3 bølger.**

| | |
|---|---|
| **Dokumentversjon** | 11.0 |
| **Dato** | 16. august 2026 |
| **Utgangscommit** | resultatet av ACT v10 |
| **Grunnlag** | `docs/TOSOM-MASTERPLAN-v8.0.md` del 6 og 8 |
| **State-fil** | `docs/ACT-STATE-v11.json` |
| **Antall steg** | 9 |
| **Antall bølger** | 3 (nummerert 0–2) |
| **Mål** | Teksten skal si sant om hva systemet gjør |

> **All tekst i dette dokumentet er ferdig formulert.** Den skal settes inn ord for ord, ikke omskrives. Møter du et sted der teksten ikke passer inn grammatisk, stopp og spør.

---

## Innhold

1. [ACT-regler](#1-act-regler)
2. [Filankre må verifiseres først](#2-filankre-må-verifiseres-først)
3. [State-fil](#3-state-fil)
4. [Bølgeoversikt](#4-bølgeoversikt)
5. [Stegene](#5-stegene)
6. [Locking-regler](#6-locking-regler)
7. [Stop-regler](#7-stop-regler)
8. [Verifikasjonsregler](#8-verifikasjonsregler)
9. [Avslutning](#9-avslutning)

---

# 1. ACT-regler

## 1.1 Utførelse

1. **Ett steg per ACT-kommando.**
2. **Ingen parallellitet.**
3. **Ingen hopp fremover.**
4. **Ingen endring av locked steg** uten eksplisitt ordre.
5. **Ingen nye funksjoner, ingen nye ruter, ingen migrasjoner.**
6. **Ingen endring i `lib/matching/` eller `lib/journey/`.**
7. **Ingen visuell endring.** GlassCard, layout og animasjoner er ferdige etter v10.
8. **Ingen omformulering.** Teksten i dette dokumentet er endelig.

## 1.2 Den viktigste regelen

**Du skal ikke skrive tekst. Du skal sette inn tekst.**

Hvert sted har en ferdig formulering i denne instruksen. Kopier den. Endrer du et ord — også et som virker bedre — er det brudd på mandatet, fordi teksten er godkjent av George slik den står.

## 1.3 Verifikasjonsregelen fra v9 gjelder

Hver verifikasjon limes inn med faktisk utskrift. For hvert steg:

```bash
git diff --stat <filen>
```

**Er den tom, er steget ikke utført.**

## 1.4 Utenfor v11

| Sak | Hvem |
|---|---|
| 144 spørsmål i egen stemme | George |
| Sentry-DSN, ekstern monitor, gjenopprettingstest | George |
| Organisasjonsnummer i vilkårene | George, når ToSom AS er registrert |
| Juridisk gjennomgang av vilkårene | George + jurist |
| Vipps-integrasjon | Senere runde |
| Rapportvarsling til admin-panel | Senere runde |

---

# 2. Filankre må verifiseres først

ACT v10 fjernet lokale komponentdefinisjoner fra tretten sider. **Det har flyttet linjenumrene i alle filene denne runden skal endre.**

`docs/ROUND-C-TEXT-HANDOVER.md` fra v10 steg 3.4 skal inneholde oppdaterte linjenumre.

**Steg 0.1 verifiserer hvert eneste anker før noe endres.** Stemmer et anker ikke, skal det korrigeres i state-filen før bølge 1 starter.

Linjenumrene i denne instruksen er fra **før** v10 og er derfor veiledende, ikke absolutte. Søketeksten er det som gjelder.

---

# 3. State-fil

`docs/ACT-STATE-v11.json` finnes allerede.

```json
{
  "version": "11.0",
  "currentStep": "0.1",
  "completedSteps": [],
  "lockedSteps": [],
  "pendingSteps": ["0.1","1.1","1.2","1.3","2.1","2.2","2.3","2.4","2.5"],
  "errors": [],
  "observations": [],
  "verifiedAnchors": {},
  "updatedAt": ""
}
```

`verifiedAnchors` fylles i steg 0.1 med de faktiske linjenumrene.

---

# 4. Bølgeoversikt

| Bølge | Navn | Steg | Innhold |
|---|---|---|---|
| **0** | Verifiser ankre | 0.1 | Bekreft alle 15 tekststeder |
| **1** | Matchekadensen | 1.1, 1.2, 1.3 | Syv steder som lover feil tidspunkt |
| **2** | Pris, vilkår, rettelser | 2.1–2.5 | Pris, ordensregler, skrivefeil, varsling, overlevering |

---

# 5. Stegene

---

## BØLGE 0 — Verifiser ankre

---

### STEG 0.1 — Bekreft hvert tekststed

**Formål:** Fastslå de faktiske linjenumrene etter v10, slik at ingen endring treffer feil sted.

**Avhengighet:** ACT v10 fullført, rent arbeidstre.

**Risiko:** Lav — ingen kodeendring.

**Instruks:**

1. Les `docs/ROUND-C-TEXT-HANDOVER.md` fra v10.

2. For hvert av de femten stedene under, finn det **faktiske** linjenummeret ved å søke på teksten, ikke stole på tallet:

**Matchekadens — skal endres (7 steder):**

```bash
grep -n "Match innen 24 timer" "app/(landing)/page.tsx"
grep -n "Match innen 24 timer" app/slik-fungerer-det/page.tsx
grep -n "Match innen 24 timer" app/priser/page.tsx
grep -n "én gang i døgnet" app/priser/page.tsx
grep -n "24 timer" app/onboarding/steps/Step10StartReisen.tsx
grep -n "24 timer" "app/(auth)/onboarding/payment/page.tsx"
grep -n "Match innen 24 timer" components/ui/layout/Hero.tsx
```

**Support — skal IKKE endres (3 steder):**

```bash
grep -n "innen 24 timer" app/kontakt/page.tsx
grep -n "innen 24 timer" app/personvern/page.tsx
```

**Pris (5 steder):**

```bash
grep -rn "349" app/priser/page.tsx "app/(landing)/page.tsx" app/betaling/page.tsx app/vilkår/page.tsx
```

**Skrivefeil (2 steder):**

```bash
grep -n "Bildefdeling" app/vilkår/page.tsx
grep -n "Rapporteer" components/chat/ChatHeader.tsx
```

3. Skriv alle funnet linjenumre til `verifiedAnchors` i state-filen.

4. **Finner du ikke en tekst, stopp og rapporter.** Det kan bety at v10 endret tekst i strid med sin egen tekstvakt.

5. Bekreft harde prøver: `tsc`, `jest`, `build`, `verify:api`, `verify:lang`.

**Verifikasjon:** *(lim inn faktisk utskrift)*
```bash
jq '.verifiedAnchors' docs/ACT-STATE-v11.json
```

**State-oppdatering:** `verifiedAnchors = {…}`, `completedSteps += ["0.1"]`, `lockedSteps += ["0.1"]`, `currentStep = "1.1"`

**Rollback:** `git restore docs/ACT-STATE-v11.json`

**Commit-mal:** `chore(act): verifiser tekstankre før runde C`

---

## BØLGE 1 — Matchekadensen

> Systemet kobler natt til lørdag. Sju steder i grensesnittet lover fortsatt noe annet.

---

### STEG 1.1 — Landingsside og «slik fungerer det»

**Formål:** Rette de to viktigste stedene — der folk først møter løftet.

**Avhengighet:** `0.1` locked.

**Risiko:** Lav.

**Filanker:** fra `verifiedAnchors`. Veiledende: `app/(landing)/page.tsx:122-123`, `app/slik-fungerer-det/page.tsx:66-67`.

**Instruks:**

**Del A — landingssiden.** I `values`-arrayet, erstatt:

```
title: 'Match innen 24 timer',
content: 'Du får én match om gangen – valgt med omtanke, ikke tilfeldighet. Ingen endeløs sveiping. Ingen overveldende valg.',
```

med:

```
title: 'Én match i uken',
content: 'Vi samler mennesker gjennom uken og kobler natt til lørdag. Du får én match — valgt med omtanke, ikke tilfeldighet. Ingen endeløs sveiping. Ingen overveldende valg.',
```

**Del B — slik fungerer det.** Erstatt:

```
title: 'Én match innen 24 timer',
intro: 'Når profilen din er klar, får du én gjennomtenkt match. Ikke ti. Ikke hundre. Bare én person som faktisk passer deg basert på verdier, livsstil, kommunikasjon og fremtidsønsker.',
```

med:

```
title: 'Én match, hver lørdag',
intro: 'Når profilen din er klar, stiller du deg i kø. Natt til lørdag kobler vi dem som passer best sammen, og reisen starter lørdag morgen. Ikke ti matcher. Ikke hundre. Bare én person som faktisk passer deg basert på verdier, livsstil, kommunikasjon og fremtidsønsker.',
```

**Del C.** `points`-arrayet under intro — behold uendret.

**Verifikasjon:** *(lim inn faktisk utskrift for hver)*
```bash
grep -c "24 timer" "app/(landing)/page.tsx"                    # 0
grep -c "24 timer" app/slik-fungerer-det/page.tsx              # 0
grep -c "Én match i uken" "app/(landing)/page.tsx"             # 1
grep -c "hver lørdag" app/slik-fungerer-det/page.tsx           # 1
git diff --stat "app/(landing)/page.tsx" app/slik-fungerer-det/page.tsx
npm run verify:lang                                             # exit 0
npx tsc --noEmit
npm run build
```

**State-oppdatering:** `completedSteps += ["1.1"]`, `lockedSteps += ["1.1"]`, `currentStep = "1.2"`

**Rollback:** `git restore "app/(landing)/page.tsx" app/slik-fungerer-det/page.tsx`

**Commit-mal:** `fix(copy): ukentlig kadens på landingsside og slik-fungerer-det`

---

### STEG 1.2 — Prissiden, to steder

**Formål:** Rette både overskriften og setningen om at motoren kjører daglig.

**Avhengighet:** `1.1` locked.

**Risiko:** Lav.

**Filanker:** Veiledende `app/priser/page.tsx:263` og `:272`.

**Instruks:**

**Del A.** Erstatt overskriften `Match innen 24 timer` med:

```
Én match hver lørdag
```

**Del B.** Erstatt brødteksten som sier `ToSoms motor kjører én gang i døgnet og finner den personen som passer deg best — basert på kompatibilitet, ikke utseende. Du får kun én match om gangen.` med:

```
ToSoms motor kjører én gang i uken, natt til lørdag, og finner den personen som passer deg best — basert på kompatibilitet, ikke utseende. Du får kun én match om gangen.
```

**Merk:** dette andre stedet sto ikke i masterplanens opprinnelige liste. Det sier «døgnet» framfor «24 timer» og ville sluppet gjennom et enkelt søk. **Begge må rettes.**

**Del C.** Ikke rør kjøpsknappen eller prisen — det er steg 2.1.

**Verifikasjon:** *(lim inn faktisk utskrift for hver)*
```bash
grep -c "24 timer" app/priser/page.tsx           # 0
grep -c "én gang i døgnet" app/priser/page.tsx   # 0
grep -c "hver lørdag" app/priser/page.tsx        # >= 1
grep -c "én gang i uken" app/priser/page.tsx     # >= 1
git diff --stat app/priser/page.tsx
npm run verify:lang
npx tsc --noEmit
npm run build
```

**State-oppdatering:** `completedSteps += ["1.2"]`, `lockedSteps += ["1.2"]`, `currentStep = "1.3"`

**Rollback:** `git restore app/priser/page.tsx`

**Commit-mal:** `fix(copy): prissiden sier ukentlig kadens`

---

### STEG 1.3 — Onboarding og Hero

**Formål:** Rette de tre siste matchingstedene.

**Avhengighet:** `1.2` locked.

**Risiko:** Lav.

**Filanker:** Veiledende `app/onboarding/steps/Step10StartReisen.tsx:49`, `app/(auth)/onboarding/payment/page.tsx:31`, `components/ui/layout/Hero.tsx:46`.

**Instruks:**

**Del A — Step10StartReisen.** Erstatt `En match innen 24 timer. Ingen swiping, ingen press.` med:

```
Én match, hver lørdag. Ingen sveiping, ingen press.
```

Merk at «swiping» også blir «sveiping» — norsk form.

**Del B — onboarding payment.** Erstatt `'Én match per 24 timer'` med:

```
'Én match per reise'
```

**Del C — Hero.** I `keyPoints`-arrayet, erstatt `title: 'Match innen 24 timer'` med:

```
title: 'Én match i uken',
```

`keyPoints` rendres ikke i dagens Hero. **Rett teksten likevel** — den er feil uansett, og kan bli synlig senere.

**Del D — kontroller de tre supportstedene.** Disse skal være **uendret**:

| Fil | Tekst |
|---|---|
| `app/kontakt/page.tsx` | «Vi svarer så raskt vi kan, vanligvis innen 24 timer.» |
| `app/kontakt/page.tsx` | «Innen 24 timer» |
| `app/personvern/page.tsx` | «Vi svarer vanligvis innen 24 timer.» |

De handler om svartid på henvendelser, ikke om matching. **Å endre dem ville gjøre teksten feil.**

**Verifikasjon:** *(lim inn faktisk utskrift for hver)*
```bash
grep -c "24 timer" app/onboarding/steps/Step10StartReisen.tsx        # 0
grep -c "24 timer" "app/(auth)/onboarding/payment/page.tsx"          # 0
grep -c "24 timer" components/ui/layout/Hero.tsx                     # 0
grep -c "swiping" app/onboarding/steps/Step10StartReisen.tsx         # 0

# supportstedene SKAL fortsatt finnes
grep -c "innen 24 timer" app/kontakt/page.tsx                        # 2
grep -c "innen 24 timer" app/personvern/page.tsx                     # 1

# ingen matchingsteder igjen noe sted
grep -rn "Match innen 24 timer\|match innen 24 timer" app/ components/ | wc -l   # 0

git diff --stat app/onboarding "app/(auth)" components/ui/layout/Hero.tsx
npm run verify:lang
npx tsc --noEmit
npm run build
```

**Kritisk:** blir supporttellingen 0, har du endret noe du ikke skulle. **Gjenopprett umiddelbart.**

**State-oppdatering:** `observations += ["1.3: syv matchingsteder rettet, tre supportsteder urørt"]`, `completedSteps += ["1.3"]`, `lockedSteps += ["1.3"]`, `currentStep = "2.1"`

**Rollback:** `git restore app/onboarding "app/(auth)" components/ui/layout/Hero.tsx`

**Commit-mal:** `fix(copy): ukentlig kadens i onboarding og Hero`

---

## BØLGE 2 — Pris, vilkår, rettelser

---

### STEG 2.1 — Pris og gratis tilgang

**Formål:** Vise at de første 10 000 får reisen gratis, der folk ser prisen.

**Avhengighet:** `1.3` locked.

**Risiko:** Lav.

**Filanker:** Veiledende `app/priser/page.tsx:365`, `app/(landing)/page.tsx:299` og `:346`, `app/betaling/page.tsx:5`.

**Instruks:**

1. **Prisen på 349 kr beholdes** overalt den står. Den skal ikke endres.

2. Legg til under prisen på prissiden, og under «Betal med Vipps»-knappen på landingssiden:

```
De første 10 000 får reisen gratis.
```

Kort, faktisk, ingen utropstegn. Dempet skrift, mindre enn prisen.

3. Finn CTA-seksjonen med «start reisen» på landingssiden og legg samme setning der.

4. **Bruk Tailwind-klasser, ikke inline `style`.** v10 fjernet inline stiler; ikke innfør nye.

5. `app/betaling/page.tsx` — kommentaren på linje 5 nevner prisen. Oppdater den hvis den er utdatert, men **rør ikke betalingslogikken.** Betaling er sperret.

**Verifikasjon:** *(lim inn faktisk utskrift for hver)*
```bash
grep -c "10 000" app/priser/page.tsx                    # >= 1
grep -c "10 000" "app/(landing)/page.tsx"               # >= 1
grep -c "349" app/priser/page.tsx                       # uendret antall
curl -s http://localhost:3000/ | grep -c "10 000"       # >= 1 i rendret HTML
grep -c 'style="' "app/(landing)/page.tsx"              # ikke økt fra v10
git diff --stat app/priser "app/(landing)" app/betaling
npm run verify:lang
npx tsc --noEmit
npm run build
```

**State-oppdatering:** `completedSteps += ["2.1"]`, `lockedSteps += ["2.1"]`, `currentStep = "2.2"`

**Rollback:** `git restore app/priser "app/(landing)" app/betaling`

**Commit-mal:** `feat(copy): de første 10 000 får reisen gratis`

---

### STEG 2.2 — Vilkårene: angrerett og ordensregler

**Formål:** Rette en angrerettbestemmelse som motsier den nye modellen, og legge til ordensregler.

**Avhengighet:** `2.1` locked.

**Risiko:** Middels — juridisk tekst.

**Filanker:** `app/vilkår/page.tsx`, `sections`-arrayet. Veiledende `:126-162`.

**Dagens struktur:** syv kort, hvert med `icon`, `title` og `content`.

**Kritisk funn — dagens angrerettkort sier:**

> «Norsk lov gir 14 dagers angrerett på digitale tjenester. Ved betaling ber vi deg samtykke til at reisen starter straks. Gir du dette samtykket, bortfaller angreretten. Uten refusjon etter påbegynt reise.»

Dette stemte da reisen startet umiddelbart. **Med ukentlig kadens finnes det et naturlig vindu** fram til lørdag der ingenting er levert. Å be brukeren frasi seg angreretten er ikke lenger nødvendig — og det er dårlig praksis når man ikke trenger det.

**Instruks:**

**Del A — erstatt angrerettkortets `content` med:**

```
Norsk lov gir 14 dagers angrerett på digitale tjenester. Reisen starter lørdag morgen, når koblingen er gjort. Melder du deg ut før lørdag, refunderer vi hele beløpet uten spørsmål. Etter at reisen har startet, er tjenesten levert, og angreretten bortfaller.
```

**Del B — rett skrivefeilen** i tittelen `Bildefdeling` til:

```
Bildedeling
```

**Del C — oppdater «Én reise — 30 dager»-kortet** slik at det nevner kadensen. Erstatt `content` med:

```
En reise koster 349 kroner og gir deg én match i én 30-dagers reise. De første 10 000 brukerne får reisen gratis. Vi kobler natt til lørdag, og reisen starter lørdag morgen. Du kan bare ha én aktiv reise om gangen.
```

**Del D — legg til to nye kort** etter «Kobling — ikke valg». Bruk samme struktur med `icon`, `title`, `content`. Velg passende ikoner blant dem som allerede er definert i filen.

**Kort 1:**

```
title: 'Hva vi forventer av deg',
content: 'ToSom bygger på respekt. Du snakker med et menneske som har valgt å åpne seg. Ingen trakassering, ingen press, ingen upassende innhold. Du deler ikke andres bilder, meldinger eller opplysninger videre. Du bruker ikke ToSom kommersielt eller til å selge noe.',
```

**Kort 2:**

```
title: 'Hvis noen bryter reglene',
content: 'Opplever du noe ubehagelig, kan du rapportere det direkte i samtalen. Vi leser alle rapporter. Ved brudd gir vi advarsel eller stenger kontoen, avhengig av alvor. Ved grove brudd stenges kontoen umiddelbart og uten refusjon. Du kan også blokkere og avslutte reisen når som helst.',
```

**Del E — legg til et kort om selskapet** til slutt:

```
title: 'Om avtalen',
content: 'ToSom drives av ToSom AS. Disse vilkårene er avtalen mellom deg og oss. Vi kan endre dem, og varsler deg i god tid før endringer trer i kraft. Avtalen følger norsk rett.',
```

**Organisasjonsnummer skal ikke skrives inn nå** — ToSom AS er under registrering. La feltet være ute; George legger det til når nummeret finnes. **Ikke skriv inn et plassholdernummer.**

**Del F.** Ikke rør ikondefinisjonene eller resten av filen. Kun `sections`-arrayet.

**Verifikasjon:** *(lim inn faktisk utskrift for hver)*
```bash
grep -c "Bildefdeling" app/vilkår/page.tsx                      # 0
grep -c "Bildedeling" app/vilkår/page.tsx                       # 1
grep -c "bortfaller angreretten" app/vilkår/page.tsx            # 1 — ny formulering
grep -c "refunderer vi hele beløpet" app/vilkår/page.tsx        # 1
grep -c "Hva vi forventer av deg" app/vilkår/page.tsx           # 1
grep -c "Hvis noen bryter reglene" app/vilkår/page.tsx          # 1
grep -c "ToSom AS" app/vilkår/page.tsx                          # 1
grep -c "natt til lørdag" app/vilkår/page.tsx                   # >= 1
curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:3000/vilk%C3%A5r"   # 200
npm run verify:lang
npx tsc --noEmit
npm run build
```

**Stop-regel:** blir siden 404 eller 500 etter endringen, **stopp og gjenopprett.** Vilkårssiden ble gjort tilgjengelig i v9 og må forbli det.

**State-oppdatering:** `observations += ["2.2: vilkår utvidet fra 7 til 10 kort, angrerett omformulert"]`, `completedSteps += ["2.2"]`, `lockedSteps += ["2.2"]`, `currentStep = "2.3"`

**Rollback:** `git restore app/vilkår/page.tsx`

**Commit-mal:** `feat(vilkår): ordensregler og angrerett tilpasset ukeskadens`

---

### STEG 2.3 — Skrivefeilen i rapportmenyen

**Formål:** Rette en skrivefeil som vises for hver bruker som åpner sikkerhetsmenyen.

**Avhengighet:** `2.2` locked.

**Risiko:** Lav.

**Filanker:** Veiledende `components/chat/ChatHeader.tsx:201`.

**Instruks:**

1. Rett `🚩 Rapporteer brukeren` til:

```
🚩 Rapporter brukeren
```

Dobbel e til enkel.

2. **Rør ingenting annet i filen.** Rapportdialogen, kategoriene, blokkeringen og «avslutt reisen» er ferdige og virker.

3. Kontroller om resten av menyen har skrivefeil. Finner du flere, rett dem — men **kun skrivefeil**, ingen omformulering.

**Verifikasjon:** *(lim inn faktisk utskrift for hver)*
```bash
grep -c "Rapporteer" components/chat/ChatHeader.tsx        # 0
grep -c "Rapporter brukeren" components/chat/ChatHeader.tsx # 1
grep -c "Blokker og avslutt" components/chat/ChatHeader.tsx # 1 — uendret
git diff --stat components/chat/ChatHeader.tsx
npm run verify:lang
npx tsc --noEmit
npm run build
```

**State-oppdatering:** `completedSteps += ["2.3"]`, `lockedSteps += ["2.3"]`, `currentStep = "2.4"`

**Rollback:** `git restore components/chat/ChatHeader.tsx`

**Commit-mal:** `fix(chat): skrivefeil i rapportmenyen`

---

### STEG 2.4 — Varsling når noen rapporterer

**Formål:** Sikre at en rapport faktisk når fram til et menneske.

**Avhengighet:** `2.3` locked.

**Risiko:** Middels — berører en fungerende rute.

**Filanker:**
```
app/api/report/route.ts              6,3 kB — lagrer til databasen
prisma/schema.prisma:595             enum ReportCategory
prisma/schema.prisma:611             model Report
lib/observability/alert.ts:50        sendAlert via nodemailer
.env.example                         ALERT_EMAIL_TO
```

**Funnet:** rapporteringen er komplett — dialog, fem kategorier, API-rute og databasemodell. Men søk i `app/api/report/route.ts` etter `alert`, `email` eller `nodemailer` gir **null treff.**

Rapporter lagres i en tabell. **Ingen får beskjed.** For en plattform der to fremmede snakker fortrolig i tretti dager, er det ikke godt nok.

**Instruks:**

1. Les `app/api/report/route.ts` i sin helhet og bekreft at den lagrer korrekt. Skriv til `observations` hva den gjør i dag.

2. Les `lib/observability/alert.ts` og fastslå signaturen til varslingsfunksjonen.

3. Kall varslingen etter at rapporten er lagret. Innhold: kategori, tidspunkt, og **identifikatorer** — ikke fritekstbeskrivelsen.

   **Begrunnelse:** beskrivelsen kan inneholde sensitive opplysninger om en tredjeperson. Å sende den i klartekst på e-post er ikke forsvarlig personvern. Varselet skal si *at* noe er rapportert og *hvilken kategori*, slik at George kan slå opp detaljene i databasen.

4. **Varslingen må ikke kunne velte lagringen.** Feiler e-posten, skal rapporten fortsatt være lagret og brukeren fortsatt få bekreftelse. Pakk kallet slik at feil logges men ikke kastes videre.

5. **Ingen migrasjon. Ingen endring i `Report`-modellen. Ingen ny rute.**

6. Skriv en test som viser at lagring lykkes selv om varslingen feiler. **Sjekk 9: testen skal kunne feile** — vis at den blir rød hvis feilhåndteringen fjernes.

**Verifikasjon:** *(lim inn faktisk utskrift for hver)*
```bash
grep -c "alert\|sendAlert" app/api/report/route.ts       # >= 1
grep -c "catch" app/api/report/route.ts                  # >= 1 rundt varslingen
grep -c "description" app/api/report/route.ts            # lagres, men ikke i varsel
git diff --stat app/api/report/route.ts prisma/          # prisma/ SKAL være tom
npx jest 2>&1 | tail -3
npm run verify:api                                        # exit 0
npx tsc --noEmit
npm run build
```

**Stop-regel:** er `lib/observability/alert.ts` avhengig av miljøvariabler som ikke finnes, **stopp og rapporter** hvilke som mangler. Ikke legg inn verdier selv.

**State-oppdatering:** `observations += ["2.4: rapportvarsling koblet, beskrivelse utelatt av personvernhensyn"]`, `completedSteps += ["2.4"]`, `lockedSteps += ["2.4"]`, `currentStep = "2.5"`

**Rollback:** `git restore app/api/report/ __tests__/`

**Commit-mal:** `feat(report): varsle ved ny rapport uten å sende sensitiv tekst`

---

### STEG 2.5 — Sluttverifikasjon og betaklarhet

**Formål:** Bekrefte at teksten sier sant, og fastslå hva som gjenstår før beta.

**Avhengighet:** `2.4` locked.

**Risiko:** Lav.

**Filanker:** `docs/ACT-STATE-v11.json`, ny fil `docs/BETA-GO-NOGO.md`

**Instruks:**

1. Full verifikasjon med utskrift limt inn:
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
   git diff --stat <utgangscommit>..HEAD -- lib/matching/ lib/journey/ prisma/ config/matching.ts
   ```
   **Krav: tom.**

3. **Sannhetskontroll** — ingen av disse skal finnes i matchingsammenheng:
   ```bash
   grep -rn "Match innen 24 timer\|match innen 24 timer" app/ components/ | wc -l   # 0
   grep -rn "én gang i døgnet" app/ components/ | wc -l                             # 0
   ```

   Og disse skal fortsatt finnes:
   ```bash
   grep -c "innen 24 timer" app/kontakt/page.tsx        # 2 — svartid
   grep -c "innen 24 timer" app/personvern/page.tsx     # 1 — svartid
   ```

4. Funksjonell kontroll med dev-server:
   ```bash
   curl -s http://localhost:3000/ | grep -c "lørdag\|uken"
   curl -s http://localhost:3000/ | grep -c "10 000"
   curl -s http://localhost:3000/ | grep -c "23+"
   curl -s -o /dev/null -w "vilkår: %{http_code}\n" "http://localhost:3000/vilk%C3%A5r"
   ```

5. Skriv `docs/BETA-GO-NOGO.md`:

   **Ferdig gjennom v9, v10 og v11:**

   | Sak | Runde |
   |---|---|
   | Vilkårssiden tilgjengelig | v9 |
   | Venterom med riktig tidspunkt | v9 |
   | Angrerettlenke | v9 |
   | Aldersgrense synlig | v9 |
   | Én footer med juridiske lenker | v9 |
   | Én kortkomponent, tokens, hover i CSS | v10 |
   | Fade-in på logo og signatur | v10 |
   | Syv matchingsteder rettet | v11 |
   | Pris og gratis tilgang | v11 |
   | Ordensregler i vilkårene | v11 |
   | Angrerett tilpasset ukeskadens | v11 |
   | Rapportvarsling | v11 |

   **Gjenstår før beta — kun menneskeoppgaver:**

   | # | Oppgave | Ferdig når |
   |---|---|---|
   | 1 | 144 spørsmål i egen stemme | `scripts/seed-questions.ts` oppdatert |
   | 2 | Sentry-DSN | Testfeil synlig i Sentry |
   | 3 | Ekstern monitor | Alarm utløst ved 503 |
   | 4 | Gjenopprettingstest | RTO målt og dokumentert |
   | 5 | Mobil-QA | Alle flater kontrollert på telefon |
   | 6 | Juridisk gjennomgang av vilkårene | Jurist har lest |
   | 7 | Organisasjonsnummer | ToSom AS registrert, nummer satt inn |

   **Senere runder:**
   - Vipps innlogging og betaling
   - Rapporter i admin-panelet
   - A3 moodpersistens, A4 PDF
   - Skalering målt ved 500 i kø

6. Sett `currentStep` til `null` og skriv `finalVerification`.

**Verifikasjon:** *(lim inn faktisk utskrift)*
```bash
jq -r '.pendingSteps | length' docs/ACT-STATE-v11.json    # 0
test -f docs/BETA-GO-NOGO.md && echo OK
```

**State-oppdatering:** `finalVerification = {…}`, `completedSteps += ["2.5"]`, `lockedSteps += ["2.5"]`, `currentStep = null`

**Rollback:** `rm docs/BETA-GO-NOGO.md`

**Commit-mal:** `docs(beta): sluttverifikasjon v11 og go-nogo for lukket beta`

---

# 6. Locking-regler

Skriv nøyaktig:

```
Steg X.Y er nå locked. Ikke endre dette senere.
```

**Og lim inn verifikasjonsutskriften.**

Et locked steg er ferdig. Ser du et problem: skriv i `errors` og fortsett.

Eneste unntak: ordren `Lås opp steg X.Y` fra George.

---

# 7. Stop-regler

## 7.1 Absolutte stopp

1. **Omformulering av tekst** som står ferdig i denne instruksen
2. **Endring av de tre supportstedene** om svartid
3. **Endring i `lib/matching/` eller `lib/journey/`**
4. **Endring i `prisma/`** eller migrasjon
5. **Ny rute, ny avhengighet**
6. **Visuell endring** — layout og komponenter er ferdige etter v10
7. **Ny inline `style`** — v10 fjernet dem
8. **Innskriving av organisasjonsnummer** som ikke finnes ennå
9. **Endring av prisen 349 kr**
10. **Sending av rapportbeskrivelse i e-post** — personvern

## 7.2 Alminnelige stopp

11. En tekst i instruksen finnes ikke i filen
12. Linjenummeret avviker og søketeksten gir flere treff
13. `tsc`, `build`, `jest` eller vaktene feiler
14. `git diff --stat` er tom der en fil skulle endres
15. Vilkårssiden svarer annet enn 200
16. Instruksen er tvetydig
17. Teksten passer ikke inn grammatisk der den skal settes

## 7.3 Hvordan du stopper

```
STOPP — Steg X.Y

Hva jeg forsøkte:
  <konkret handling>

Hva som skjedde:
  <faktisk utskrift, ordrett>

Hvilken stop-regel som utløste:
  <nummer fra del 7>

Løsning 1: <forslag> — Konsekvens: <hva det medfører>
Løsning 2: <forslag> — Konsekvens: <hva det medfører>

Venter på godkjenning.
```

## 7.4 Hva du aldri gjør

- Ikke forbedre en formulering du synes kunne vært bedre
- Ikke rett en skrivefeil som ikke står i instruksen, uten å notere den
- Ikke endre tekst om svartid
- Ikke legg til `// @ts-ignore` eller `any`
- Ikke marker et steg locked uten å ha kjørt verifikasjonen

**To forsøk. Deretter stopp.**

---

# 8. Verifikasjonsregler

## 8.1 Fast rekkefølge

```bash
npx tsc --noEmit
npm run build
npm run verify:api
npm run verify:lang
npx jest
```

## 8.2 Vokterkontroll

```bash
git diff --stat <utgangscommit>..HEAD -- lib/matching/ lib/journey/ prisma/ config/matching.ts
```

Krav: **tom** gjennom hele v11.

## 8.3 Sannhetsvakt — etter hvert steg i bølge 1

```bash
grep -rn "24 timer" app/ components/ --include=*.tsx | grep -vi "svarer\|kontakt\|personvern"
```

**Krav: ingen treff** etter steg 1.3. Treff betyr at et matchingsted er glemt.

## 8.4 Supportvakt — etter hvert steg

```bash
grep -c "innen 24 timer" app/kontakt/page.tsx      # skal alltid være 2
grep -c "innen 24 timer" app/personvern/page.tsx   # skal alltid være 1
```

Faller disse, er noe endret som ikke skulle det.

## 8.5 Hva som teller som bestått

| Sjekk | Krav |
|---|---|
| tsc | 0 feil |
| build | Grønn |
| jest | Alle grønne, antall ikke lavere |
| verify:api, verify:lang | exit 0 |
| Vokterkontroll | Tom |
| Sannhetsvakt | Ingen treff etter 1.3 |
| Supportvakt | 2 og 1, uendret |
| `git diff --stat` per steg | Ikke tom |
| Vilkårssiden | 200 |
| Verifikasjonsutskrift | Limt inn |

---

# 9. Avslutning

## 9.1 Full verifikasjon

Kjør del 8.1 til 8.4 i sin helhet. Lim inn all utskrift.

## 9.2 Hva denne runden oppnådde

Teksten sier nå sant om hva systemet gjør. Det er ikke en liten sak: fram til nå har landingssiden lovet en match innen 24 timer, mens motoren kjører natt til lørdag. En bruker som betalte på grunnlag av det løftet, ville hatt rett til å klage.

Vilkårene har fått ordensregler — den viktigste teksten på en plattform der to fremmede snakker fortrolig i tretti dager. Den beskytter brukerne, og den gir ToSom grunnlag for å utestenge noen.

Og angreretten er blitt bedre for brukeren enn den var. Den gamle teksten ba henne frasi seg retten. Den nye gir henne full refusjon fram til lørdag, fordi ukeskadensen skaper et vindu der ingenting er levert ennå.

## 9.3 Oppdatert lanseringsvurdering

Masterplan v8.0 satte 84 % for lukket beta med fjorten blokkerende krav. Etter v9, v10 og v11 skal ni av dem være lukket.

Rapporter et nytt anslag. **Rapporter ærlig** — er en tekst satt inn men leser dårlig i sammenhengen, skriv det.

## 9.4 Sluttstate

```json
{
  "currentStep": null,
  "completedSteps": ["0.1","1.1","1.2","1.3","2.1","2.2","2.3","2.4","2.5"],
  "lockedSteps":    ["0.1","1.1","1.2","1.3","2.1","2.2","2.3","2.4","2.5"],
  "pendingSteps": [],
  "finalVerification": {
    "tsc": "0 feil",
    "jest": "<faktisk>",
    "build": "grønn",
    "matchingsteder24t": 0,
    "supportsteder24t": "2 + 1, uendret",
    "vilkarKort": "<antall>",
    "vilkarStatus": 200,
    "rapportvarsling": "koblet",
    "guardCheck": "tom"
  },
  "nextStep": "Lukket beta. Se docs/BETA-GO-NOGO.md for de syv menneskeoppgavene",
  "updatedAt": "<ISO>"
}
```

## 9.5 Hva som kommer etter

Kodesporet er ferdig for beta. Det som gjenstår er syv menneskeoppgaver i `docs/BETA-GO-NOGO.md`, og den tyngste er de 144 spørsmålene.

Spørsmålene *er* ToSom. Det er dem to mennesker møter hver dag i tretti dager. Ingen ACT-syklus kan skrive dem.

---

*TOSOM-ACT-INSTRUKS-v11.0 — 9 steg, 3 bølger, basert på TOSOM-MASTERPLAN-v8.0 del 6 og 8.*
