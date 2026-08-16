# TOSOM-ACT-INSTRUKS-v10.0

**Runde B — visuelt fundament. 10 steg i 4 bølger.**

| | |
|---|---|
| **Dokumentversjon** | 10.0 |
| **Dato** | 16. august 2026 |
| **Utgangscommit** | resultatet av ACT v9 |
| **Grunnlag** | `docs/TOSOM-MASTERPLAN-v8.0.md` del 3 og 5 |
| **State-fil** | `docs/ACT-STATE-v10.json` |
| **Antall steg** | 10 |
| **Antall bølger** | 4 (nummerert 0–3) |
| **Mål** | Én kortkomponent, tokens i stedet for inline stiler, hover i CSS |

> Dette er runden som gir tilbake premium-følelsen. Ingen tekstendring — det er ACT v11.

---

## Innhold

1. [ACT-regler](#1-act-regler)
2. [Beslutningen som styrer hele runden](#2-beslutningen-som-styrer-hele-runden)
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
5. **Ingen nye funksjoner.**
6. **Ingen nye API-ruter.**
7. **Ingen endring i `lib/matching/` eller `lib/journey/`.**
8. **Ingen migrasjoner.**
9. **Ingen tekstendring.** Hvert ord som står i grensesnittet skal stå uendret. Bytter du en komponent, flyttes teksten med uendret.
10. **Ingen endring av `middleware.ts`, `vercel.json` eller `styles/globals.css`.** De er ferdige.

## 1.2 Verifikasjonsregelen fra v9 gjelder

**Hver verifikasjonskommando skal limes inn med faktisk utskrift.**

For hvert steg som endrer en fil:

```bash
git diff --stat <filen>
```

**Er den tom, er steget ikke utført.** Dette er regelen som fanget at ACT v8 steg 3.1 og 3.2 aldri ble gjort.

## 1.3 Områder som er ferdige

| Område | Ikke rør |
|---|---|
| Matchemotoren | `lib/matching/`, `config/matching.ts` |
| Journey-motoren | `lib/journey/` |
| Databaseskjema | `prisma/` |
| Tailwind-oppsettet | `styles/globals.css`, `tailwind.config.js` |
| Kadensen | `vercel.json` |
| Middleware | `middleware.ts` |
| Rapporteringen | `app/api/report/`, rapportdialogen i `ChatHeader.tsx` |
| Alt fra ACT v9 | Venterom, aldersmerke, footer-lenker |

## 1.4 Utenfor v10

| Sak | Runde |
|---|---|
| All tekstendring | ACT v11 |
| «24 timer» og «én gang i døgnet» | ACT v11 |
| Priser og «de første 10 000» | ACT v11 |
| Vilkår med ordensregler | ACT v11 |
| Skrivefeil «Bildefdeling» og «Rapporteer» | ACT v11 |
| 144 spørsmål, DSN, monitor, gjenoppretting | George |

---

# 2. Beslutningen som styrer hele runden

## 2.1 To designsystemer, ett skal velges

Kodebasen har to parallelle systemer:

| System | Hva | Status |
|---|---|---|
| **A** | `config/design-tokens.ts` — 409 linjer hardkodede HEX-verdier i JavaScript, brukt via `style={{}}` | I utstrakt bruk |
| **B** | `tailwind.config.js` + CSS-variabler i `styles/theme.css` — klasser som `ts-gold`, `animate-ts-fade-in` | Nesten ubrukt |

`animate-ts-*` har **null forekomster** i hele kodebasen. Alle animasjonene er definert og aldri brukt.

## 2.2 Beslutningen

**System B — Tailwind-klasser med CSS-variabler — er eneste vei framover.**

Grunnene er tekniske, ikke estetiske:

- Responsive breakpoints (`md:`, `lg:`) virker **bare** i klasser
- `hover:` virker **bare** i klasser
- `prefers-reduced-motion` kan **bare** håndteres i CSS
- Animasjonene finnes allerede definert

`config/design-tokens.ts` **beholdes som verdireferanse** — den dokumenterer hvilke farger og avstander som er riktige. Men den skal ikke brukes til å style via `style={{}}`.

**Dette er ikke til diskusjon underveis.** Møter du en inline stil du ikke vet hvordan du skal oversette, stopp og spør.

## 2.3 Måltilstand

| Måling | I dag | Etter v10 |
|---|---|---|
| Lokale `GlassCard`-definisjoner | 13 | **0** |
| Glass-komponenter i `components/ui/` | 5 | **1** |
| Inline `style="` i rendret HTML, `/` | 91 | **under 20** |
| Inline `style="` , `/hvorfor` | 106 | **under 20** |
| `onMouseEnter`-mutasjon | ja | **0** |
| `animate-ts-*` i bruk | 0 | **minst 2** |

---

# 3. State-fil

`docs/ACT-STATE-v10.json` finnes allerede. **Skal ikke opprettes på nytt.**

```json
{
  "version": "10.0",
  "currentStep": "0.1",
  "completedSteps": [],
  "lockedSteps": [],
  "pendingSteps": ["0.1","1.1","1.2","2.1","2.2","2.3","3.1","3.2","3.3","3.4"],
  "errors": [],
  "observations": [],
  "baseline": {},
  "updatedAt": ""
}
```

Etter hvert steg: oppdater som i tidligere runder, og legg **faktisk verifikasjonsutskrift** i `observations`.

---

# 4. Bølgeoversikt

| Bølge | Navn | Steg | Innhold |
|---|---|---|---|
| **0** | Grunnlinje | 0.1 | Mål inline stiler og komponenttelling |
| **1** | Utvid den delte komponenten | 1.1, 1.2 | `GlassCard` får det de lokale trenger |
| **2** | Bytt sidene i tre puljer | 2.1, 2.2, 2.3 | 13 sider, fire–fem per pulje |
| **3** | Bevegelse og rydding | 3.1, 3.2, 3.3, 3.4 | Hover, fade-in, opprydding, overlevering |

**Puljedelingen i bølge 2 er avgjørende.** Å bytte tretten sider i ett steg gir en diff ingen kan vurdere, og en feil ville rammet alt samtidig.

---

# 5. Stegene

---

## BØLGE 0 — Grunnlinje

---

### STEG 0.1 — Mål utgangspunktet

**Formål:** Fryse den visuelle tilstanden før noe endres, slik at hvert senere steg kan måles.

**Avhengighet:** ACT v9 fullført, rent arbeidstre.

**Risiko:** Lav — ingen kodeendring.

**Filanker:** Kun `docs/ACT-STATE-v10.json`.

**Instruks:**

1. `git status --porcelain` skal være tom. Ellers **stopp.**

2. Start dev-server og mål inline stiler i **rendret HTML**:

```bash
npm run dev > /tmp/dev.log 2>&1 &
sleep 12

for s in / /priser /hvorfor /om-oss /reisen /slik-fungerer-det /kontakt /blogg /cookies /personvern; do
  n=$(curl -s "http://localhost:3000$s" | grep -o 'style="' | wc -l)
  echo "$s → $n"
done
```

3. Tell komponenter:

```bash
grep -rl "const GlassCard\|function GlassCard" app/ | wc -l      # forventet 13
find components -iname "*glass*"                                  # forventet 5
grep -rc "onMouseEnter" app/\(landing\)/page.tsx
grep -rn "animate-ts-" app/ components/ --include=*.tsx | wc -l   # forventet 0
```

4. Tell bruksteder per side — dette er kartet for bølge 2:

```bash
for f in "app/(landing)" app/hvorfor app/slik-fungerer-det app/reisen app/priser \
         app/om-oss app/kontakt app/blogg app/vilkår app/personvern app/cookies \
         app/register app/settings; do
  echo "$f → $(grep -c '<GlassCard' "$f/page.tsx")"
done
```

Kjent fordeling: `reisen` 8, `settings` 7, `priser` 6, `cookies` 6, `hvorfor` 4, `om-oss` 4, `kontakt` 3, `(landing)` 2, `blogg` 2, `slik-fungerer-det` 1, `vilkår` 1, `personvern` 1, `register` 1. **Totalt 46 bruksteder.**

5. Harde prøver: `tsc`, `jest`, `build`, `verify:api`, `verify:lang`.

**Verifikasjon:** *(lim inn faktisk utskrift)*
```bash
jq '.baseline' docs/ACT-STATE-v10.json
```

**State-oppdatering:** `baseline = {…}`, `completedSteps += ["0.1"]`, `lockedSteps += ["0.1"]`, `currentStep = "1.1"`

**Rollback:** `git restore docs/ACT-STATE-v10.json`

**Commit-mal:** `chore(act): grunnlinjemåling før visuell konsolidering`

---

## BØLGE 1 — Utvid den delte komponenten

> Den delte komponenten må kunne alt de tretten lokale kan, **før** noen side byttes. Ellers går atferd tapt.

---

### STEG 1.1 — Utvid `GlassCard`

**Formål:** Gi den delte komponenten de variantene sidene faktisk bruker.

**Avhengighet:** `0.1` locked.

**Risiko:** Middels — komponenten brukes ikke i dag, men skal brukes 46 steder etter bølge 2.

**Filanker:**
```
components/ui/cards/GlassCard.tsx:13-23    GlassCardProps
components/ui/cards/GlassCard.tsx:16       padding?: 'none' | 'sm' | 'md' | 'lg'
components/ui/cards/GlassCard.tsx:25-30    paddingMap
components/ui/cards/GlassCard.tsx:34       padding = 'lg'  → --ts-spacing-xl
components/ui/cards/GlassCard.tsx:41-51    klassene
components/ui/cards/GlassCard.tsx:48       interactive: hover:bg + hover:border
components/ui/cards/GlassCard.tsx:49       glow: hover:shadow-gold
components/ui/cards/GlassCard.tsx:52-53    role="article", no-op aria-label
styles/theme.css:28-31                     --ts-glass-bg, -hover, -border, -border-hover
```

**Dagens tilstand:** komponenten er 61 linjer, bruker **rene Tailwind-klasser med CSS-variabler**, ingen inline stil. Det er riktig utgangspunkt.

**Instruks:**

1. **Les alle tretten lokale definisjonene først** og skriv til `observations` hvilke props og verdier de bruker som den delte mangler. Dette er nødvendig — bytter du sider før komponenten kan nok, går utseende tapt.

2. Utvid `padding` med `'xl'`:
   ```
   xl: 'p-[var(--ts-spacing-2xl)]'
   ```
   Behold `lg` som standard.

3. Legg til de variantene kartleggingen i punkt 1 viser er nødvendige. Sannsynlige kandidater, men **avgjør etter faktisk behov**:
   - En `as`-prop hvis noen lokale rendrer `<section>` eller `<article>` framfor `<div>`
   - En variant for gullkant, siden flere lokale har `rgba(212,175,55,...)` i `border`

4. Rett den meningsløse `aria-label` på `:53` — `aria-label={children ? undefined : undefined}` gir alltid `undefined`. Fjern hele attributtet.

5. Vurder `role="article"` på `:52`. Den er hardkodet på hvert kort. Et kort med to setninger er sjelden en `article` i semantisk forstand, og for skjermlesere gir det unødig støy. **Fjern den, med mindre kartleggingen viser at noen side trenger den.**

6. **Ingen inline `style` i komponenten.** Alt skal være klasser med CSS-variabler.

7. Skriv en test i `__tests__/` som dekker: hver `padding`-verdi gir riktig klasse, `interactive` legger til hover-klasser, `glow` legger til skygge, `className` føyes til. **Sjekk 9: testen skal kunne feile** — vis at den blir rød hvis en `paddingMap`-oppføring fjernes.

**Verifikasjon:** *(lim inn faktisk utskrift for hver)*
```bash
grep -c "xl:" components/ui/cards/GlassCard.tsx           # >= 1
grep -c "style=" components/ui/cards/GlassCard.tsx        # 0
grep -c "aria-label" components/ui/cards/GlassCard.tsx    # 0
npx jest __tests__/glasscard*.test.tsx 2>&1 | tail -3
git diff --stat components/ui/cards/GlassCard.tsx         # SKAL vise endring
npx tsc --noEmit
npm run build
```

**State-oppdatering:** `observations += ["1.1: lokale varianter krevde <liste>; lagt til <hva>"]`, `completedSteps += ["1.1"]`, `lockedSteps += ["1.1"]`, `currentStep = "1.2"`

**Rollback:** `git restore components/ui/cards/GlassCard.tsx`

**Commit-mal:** `feat(ui): utvid delt GlassCard med varianter sidene trenger`

---

### STEG 1.2 — Prøvebytt på én liten side

**Formål:** Bevise at byttet fungerer, på siden med minst risiko, før tolv andre følger.

**Avhengighet:** `1.1` locked.

**Risiko:** Lav — én side, ett brukssted.

**Filanker:**
```
app/personvern/page.tsx     1 brukssted av lokal GlassCard
```

**Hvorfor personvern:** ett brukssted, lav trafikk, og ingen kompleks layout. Er byttet feil, oppdages det her framfor på tretten sider samtidig.

**Instruks:**

1. Fjern den lokale `GlassCard`-definisjonen fra `app/personvern/page.tsx`.

2. Importer den delte:
   ```ts
   import GlassCard from '@/components/ui/cards/GlassCard';
   ```

3. Behold **all tekst uendret.** Ikke ett ord endres.

4. Velg `padding`-verdi som gir nærmest samme avstand som den lokale hadde. Er den lokale `p-8` (32 px), tilsvarer det `padding="lg"`.

5. Har den lokale hover-atferd, bruk `interactive`. Har den gullglød, bruk `glow`.

6. **Ingen inline `style` skal stå igjen** i det du rører. Andre inline stiler på siden som ikke gjelder kortet, lar du stå — de tas i bølge 2.

7. Bygg, og se på siden i tre bredder: 390 px, 820 px, 1440 px.

**Verifikasjon:** *(lim inn faktisk utskrift for hver)*
```bash
grep -c "const GlassCard\|function GlassCard" app/personvern/page.tsx   # 0
grep -c "ui/cards/GlassCard" app/personvern/page.tsx                    # 1
curl -s http://localhost:3000/personvern | grep -o 'style="' | wc -l    # skal ha falt
git diff --stat app/personvern/page.tsx                                 # SKAL vise endring
npm run verify:lang                                                      # exit 0
npx tsc --noEmit
npm run build
```

**Stop-regel:** ser siden annerledes ut på en måte som forringer den — smalere kort, mistet kant, endret avstand — **stopp og rapporter med beskrivelse per bredde.** Ikke juster den delte komponenten for å kompensere; da er det steg 1.1 som var ufullstendig.

**State-oppdatering:** `observations += ["1.2: personvern inline stiler <før> → <etter>; visuelt <vurdering>"]`, `completedSteps += ["1.2"]`, `lockedSteps += ["1.2"]`, `currentStep = "2.1"`

**Rollback:** `git restore app/personvern/page.tsx`

**Commit-mal:** `refactor(personvern): bruk delt GlassCard`

---

## BØLGE 2 — Bytt sidene i tre puljer

> Tolv sider gjenstår, 45 bruksteder. Tre puljer med bygg og visuell kontroll mellom hver.

**Felles instruks for alle tre steg i denne bølgen:**

For hver side: fjern lokal definisjon, importer den delte, velg `padding`/`interactive`/`glow` som gir samme utseende, behold **all tekst uendret**, fjern inline stiler knyttet til kortet.

**Ingen tekstendring. Ingen strukturendring.** Kun kortkomponenten byttes.

Etter hver pulje: bygg, mål inline stiler, se på hver side i tre bredder.

---

### STEG 2.1 — Pulje 1: de enkle

**Formål:** Bytte de fire sidene med færrest bruksteder.

**Avhengighet:** `1.2` locked.

**Risiko:** Lav.

**Filanker:**
```
app/slik-fungerer-det/page.tsx     1 brukssted
app/vilkår/page.tsx                1 brukssted
app/register/page.tsx              1 brukssted
app/blogg/page.tsx                 2 bruksteder
```

**Instruks:** følg fellesinstruksen for bølge 2 på disse fire.

Merk om `app/vilkår/page.tsx`: den ble gjort tilgjengelig i ACT v9. **Kontroller at den fortsatt svarer 200 etter byttet.**

**Verifikasjon:** *(lim inn faktisk utskrift for hver)*
```bash
for f in app/slik-fungerer-det app/vilkår app/register app/blogg; do
  echo "$f lokal: $(grep -c 'const GlassCard' $f/page.tsx)"      # 0
  echo "$f import: $(grep -c 'ui/cards/GlassCard' $f/page.tsx)"  # 1
done
git diff --stat app/slik-fungerer-det app/vilkår app/register app/blogg
curl -s -o /dev/null -w "vilkår: %{http_code}\n" "http://localhost:3000/vilk%C3%A5r"   # 200
npm run verify:lang
npx tsc --noEmit
npm run build
```

**State-oppdatering:** `observations += ["2.1: fire sider byttet, inline stiler <per side>"]`, `completedSteps += ["2.1"]`, `lockedSteps += ["2.1"]`, `currentStep = "2.2"`

**Rollback:** `git restore app/slik-fungerer-det app/vilkår app/register app/blogg`

**Commit-mal:** `refactor(ui): delt GlassCard i fire sider [pulje 1]`

---

### STEG 2.2 — Pulje 2: de midtre

**Formål:** Bytte fire sider med moderat antall bruksteder.

**Avhengighet:** `2.1` locked.

**Risiko:** Middels.

**Filanker:**
```
app/kontakt/page.tsx      3 bruksteder
app/hvorfor/page.tsx      4 bruksteder, 106 inline stiler
app/om-oss/page.tsx       4 bruksteder, 106 inline stiler
app/(landing)/page.tsx    2 bruksteder, 91 inline stiler, JS-hover
```

**Særlig om landingssiden:** dens lokale `GlassCard` håndterer hover ved å mutere `e.currentTarget.style` i `onMouseEnter`/`onMouseLeave`. Ved bytte til den delte skal dette erstattes av `interactive`-propen, som gir CSS-overgang.

**Instruks:**

1. Følg fellesinstruksen på de fire.

2. På landingssiden: **fjern `onMouseEnter` og `onMouseLeave` helt** for kortene. Bruk `interactive`.

3. `app/hvorfor/page.tsx` blander rå `<section>` med `<ToSomSection>`, og har en hardkodet glassboks i heroen. **Rør kun `GlassCard`-bruken.** Heroen og seksjonsstrukturen er ikke del av dette steget.

4. Landingssiden har et aldersmerke lagt inn i ACT v9. **Kontroller at det fortsatt vises** etter byttet.

**Verifikasjon:** *(lim inn faktisk utskrift for hver)*
```bash
for f in app/kontakt app/hvorfor app/om-oss "app/(landing)"; do
  echo "$f lokal: $(grep -c 'const GlassCard' $f/page.tsx)"
done
grep -c "onMouseEnter" "app/(landing)/page.tsx"        # 0
curl -s http://localhost:3000/ | grep -o 'style="' | wc -l        # under 40
curl -s http://localhost:3000/hvorfor | grep -o 'style="' | wc -l # under 40
curl -s http://localhost:3000/ | grep -c "23+"                    # >= 1, uendret fra v9
git diff --stat app/kontakt app/hvorfor app/om-oss "app/(landing)"
npm run verify:lang
npx tsc --noEmit
npm run build
```

**Stop-regel:** faller inline stiler mindre enn ventet, betyr det at kortet ikke var hovedkilden. **Rapporter tallet og fortsett** — resten tas i steg 3.2.

**State-oppdatering:** `observations += ["2.2: <faktiske tall per side>"]`, `completedSteps += ["2.2"]`, `lockedSteps += ["2.2"]`, `currentStep = "2.3"`

**Rollback:** `git restore app/kontakt app/hvorfor app/om-oss "app/(landing)"`

**Commit-mal:** `refactor(ui): delt GlassCard i fire sider [pulje 2]`

---

### STEG 2.3 — Pulje 3: de tunge

**Formål:** Bytte de fire sidene med flest bruksteder.

**Avhengighet:** `2.2` locked.

**Risiko:** Middels — 27 bruksteder samlet.

**Filanker:**
```
app/reisen/page.tsx      8 bruksteder
app/settings/page.tsx    7 bruksteder
app/priser/page.tsx      6 bruksteder, 79 inline stiler
app/cookies/page.tsx     6 bruksteder
```

**Instruks:**

1. Følg fellesinstruksen på de fire.

2. `app/settings/page.tsx` er en **innlogget** side, ikke offentlig. Kontroller at den fortsatt fungerer — den har lagringsknapper og skjemaer som ikke må brytes.

3. `app/priser/page.tsx` har en kjøpsknapp. **Ikke rør den.** Betaling er sperret, og teksten er ACT v11.

4. Ved åtte bruksteder på samme side kan `padding` variere mellom dem. **Bevar hver enkelts avstand** framfor å ensrette dem — ensretting er en visuell beslutning som hører til George.

**Verifikasjon:** *(lim inn faktisk utskrift for hver)*
```bash
for f in app/reisen app/settings app/priser app/cookies; do
  echo "$f lokal: $(grep -c 'const GlassCard' $f/page.tsx)"
done
grep -rl "const GlassCard\|function GlassCard" app/ | wc -l    # 0 — alle tretten borte
curl -s http://localhost:3000/priser | grep -o 'style="' | wc -l
git diff --stat app/reisen app/settings app/priser app/cookies
npm run verify:lang
npx tsc --noEmit
npm run build
npx jest
```

**State-oppdatering:** `observations += ["2.3: <faktiske tall>; lokale GlassCard nå <antall>"]`, `completedSteps += ["2.3"]`, `lockedSteps += ["2.3"]`, `currentStep = "3.1"`

**Rollback:** `git restore app/reisen app/settings app/priser app/cookies`

**Commit-mal:** `refactor(ui): delt GlassCard i fire sider [pulje 3]`

---

## BØLGE 3 — Bevegelse og rydding

---

### STEG 3.1 — Hover og bevegelse i CSS

**Formål:** Flytte all hover-atferd fra JavaScript til CSS, og respektere bevegelsespreferanser.

**Avhengighet:** `2.3` locked.

**Risiko:** Lav.

**Filanker:**
```
hooks/useMotionPreferences.ts     eksisterende, kontroller innhold
tailwind.config.js                animation-blokken med ts-fade-in m.fl.
styles/theme.css                  --ts-transition-fast
```

**Instruks:**

1. Søk etter gjenværende JS-hover i offentlige sider:
   ```bash
   grep -rn "onMouseEnter\|onMouseLeave" app/ --include=*.tsx
   ```

2. For hvert treff på en **offentlig** side: erstatt med `hover:`-klasser. Er det inne i en interaktiv komponent som trenger JS av andre grunner, **la det stå og noter i `observations`.**

3. Kontroller at `prefers-reduced-motion` håndteres. Finnes `hooks/useMotionPreferences.ts`, les den og fastslå om den brukes. Mangler global håndtering, legg til i `styles/globals.css`:

   ```css
   @media (prefers-reduced-motion: reduce) {
     *, *::before, *::after {
       animation-duration: 0.01ms !important;
       transition-duration: 0.01ms !important;
     }
   }
   ```

   **Dette er det eneste tillatte unntaket** fra regelen om at `globals.css` ikke skal endres.

4. **Ingen nye animasjoner i dette steget.** Kun flytting av eksisterende atferd.

**Verifikasjon:** *(lim inn faktisk utskrift for hver)*
```bash
grep -rn "onMouseEnter" app/ --include=*.tsx | wc -l      # 0 på offentlige sider
grep -c "prefers-reduced-motion" styles/globals.css        # >= 1
git diff --stat app/ styles/globals.css
npx tsc --noEmit
npm run build
```

**State-oppdatering:** `observations += ["3.1: JS-hover fjernet <antall>, gjenstår <antall> med begrunnelse"]`, `completedSteps += ["3.1"]`, `lockedSteps += ["3.1"]`, `currentStep = "3.2"`

**Rollback:** `git restore app/ styles/globals.css`

**Commit-mal:** `refactor(ui): hover i CSS og respekt for bevegelsespreferanse`

---

### STEG 3.2 — Logo og «Made in Norway»

**Formål:** Gi logoen og signaturen en rolig fade-in, med tokens framfor hardkodede verdier.

**Avhengighet:** `3.1` locked.

**Risiko:** Lav.

**Filanker:**
```
tailwind.config.js     animation: 'ts-fade-in' — definert, 0 bruksteder
components/branding/   logokomponenter
app/(landing)/page.tsx «Made in Norway»
```

**Bakgrunn:** George rapporterte at logoen «har mistet sin premium look og fade inn». Animasjonen `animate-ts-fade-in` finnes definert i `tailwind.config.js` og brukes **null steder** i hele kodebasen.

**Instruks:**

1. Finn logokomponenten og «Made in Norway»-teksten. Skriv til `observations` hvordan de styles i dag.

2. Legg til `animate-ts-fade-in` på begge. Er en forsinkelse ønskelig for at logoen kommer først, bruk Tailwinds `[animation-delay:...]`-syntaks — **ikke inline `style`.**

3. Erstatt hardkodede gullverdier med tokenklasser: `text-ts-gold`, `border-ts-gold`, eller CSS-variabelen `var(--ts-gold)`.

4. **Rolig, ikke effektfullt.** Fade-in over 150–250 ms. Ingen sprett, ingen skalering, ingen rotasjon. Premium er at ingenting rykker.

5. **Ingen tekstendring.** «Made in Norway» skal stå ordrett som i dag.

**Verifikasjon:** *(lim inn faktisk utskrift for hver)*
```bash
grep -rn "animate-ts-fade-in" app/ components/ --include=*.tsx | wc -l    # >= 2
grep -rn "Made in Norway" app/ components/ --include=*.tsx                 # uendret tekst
curl -s http://localhost:3000/ | grep -c "Made in Norway"                  # >= 1
git diff --stat app/ components/
npm run verify:lang
npx tsc --noEmit
npm run build
```

**Stop-regel:** virker ikke animasjonen i nettleseren selv om klassen er der, **stopp og rapporter.** Det kan bety at `animation`-blokken i konfigurasjonen ikke leses, som ville være et nytt funn.

**State-oppdatering:** `observations += ["3.2: fade-in på <hvilke elementer>, tokens brukt <hvilke>"]`, `completedSteps += ["3.2"]`, `lockedSteps += ["3.2"]`, `currentStep = "3.3"`

**Rollback:** `git restore app/ components/`

**Commit-mal:** `feat(branding): rolig fade-in på logo og signatur`

---

### STEG 3.3 — Rydd de ubrukte glass-komponentene

**Formål:** Fjerne fire konkurrerende komponenter som skaper forvirring.

**Avhengighet:** `3.2` locked.

**Risiko:** Middels — sletting.

**Filanker:**
```
components/ui/cards/GlassCard.tsx        BEHOLDES — den kanoniske
components/ui/panels/GlassPanel.tsx
components/ui/GlassPanel.tsx
components/ui/system/ToSomGlassPanel.tsx
components/ui/base/Glass.tsx
```

**Instruks:**

1. For **hver** av de fire, søk etter bruk i hele kodebasen:
   ```bash
   grep -rn "GlassPanel\|ToSomGlassPanel\|base/Glass" app/ components/ hooks/ lib/ --include=*.tsx --include=*.ts
   ```

2. **Har en komponent én eller flere brukssteder: la den stå.** Noter i `observations` og gå videre. Sletting av kode som er i bruk er en absolutt stop-regel.

3. Kun komponenter med **null** bruksteder slettes.

4. Etter sletting: bygg og kjør alle tester. Feiler noe, gjenopprett umiddelbart.

**Verifikasjon:** *(lim inn faktisk utskrift for hver)*
```bash
find components -iname "*glass*"
grep -rn "GlassPanel\|ToSomGlassPanel" app/ components/ --include=*.tsx | wc -l
npx tsc --noEmit
npm run build
npx jest
```

**State-oppdatering:** `observations += ["3.3: slettet <hvilke>, beholdt <hvilke> fordi <begrunnelse>"]`, `completedSteps += ["3.3"]`, `lockedSteps += ["3.3"]`, `currentStep = "3.4"`

**Rollback:** `git restore components/`

**Commit-mal:** `chore(ui): fjern ubrukte glass-komponenter`

---

### STEG 3.4 — Sluttverifikasjon og overlevering

**Formål:** Bekrefte at måltilstanden er nådd, og overlevere til ACT v11.

**Avhengighet:** `3.3` locked.

**Risiko:** Lav.

**Filanker:** `docs/ACT-STATE-v10.json`, ny fil `docs/ROUND-C-TEXT-HANDOVER.md`

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
   git diff --stat <utgangscommit>..HEAD -- lib/ prisma/ config/matching.ts middleware.ts vercel.json
   ```
   **Krav: tom.**

3. Mål måltilstanden fra del 2.3 og sammenlign med grunnlinjen:

   ```bash
   grep -rl "const GlassCard\|function GlassCard" app/ | wc -l     # 0
   find components -iname "*glass*" | wc -l                         # 1
   for s in / /priser /hvorfor /om-oss; do
     echo "$s → $(curl -s "http://localhost:3000$s" | grep -o 'style="' | wc -l)"
   done
   grep -rn "onMouseEnter" app/ --include=*.tsx | wc -l             # 0
   grep -rn "animate-ts-" app/ components/ --include=*.tsx | wc -l  # >= 2
   ```

4. **Bekreft at ingen tekst er endret:**
   ```bash
   git diff <utgangscommit>..HEAD -- app/ | grep "^[+-]" | grep -iE "match|reise|pris|kr|timer" | head -20
   ```
   Viser dette tekstendringer, **stopp og rapporter.** Tekst er ACT v11.

5. Skriv `docs/ROUND-C-TEXT-HANDOVER.md` som bekrefter at den visuelle rammen er klar, og at ACT v11 kan sette inn tekst. List de faktiske linjenumrene for tekststedene **på nytt** — de kan ha flyttet seg når lokale komponenter ble fjernet.

   Dette er viktig: ACT v11 har filankre med linjenummer, og bølge 2 i denne runden har endret linjetellingen i tolv filer.

6. Sett `currentStep` til `null` og skriv `finalVerification`.

**Verifikasjon:** *(lim inn faktisk utskrift)*
```bash
jq -r '.pendingSteps | length' docs/ACT-STATE-v10.json    # 0
test -f docs/ROUND-C-TEXT-HANDOVER.md && echo OK
```

**State-oppdatering:** `finalVerification = {…}`, `completedSteps += ["3.4"]`, `lockedSteps += ["3.4"]`, `currentStep = null`

**Rollback:** `rm docs/ROUND-C-TEXT-HANDOVER.md`

**Commit-mal:** `docs(act): sluttverifikasjon v10 og oppdaterte tekstankre`

---

# 6. Locking-regler

Skriv nøyaktig:

```
Steg X.Y er nå locked. Ikke endre dette senere.
```

**Og lim inn verifikasjonsutskriften.** Uten den er steget ikke låst.

Et locked steg er ferdig. Ser du et problem i et locked steg: skriv i `errors` og fortsett.

Eneste unntak: ordren `Lås opp steg X.Y` fra George.

---

# 7. Stop-regler

## 7.1 Absolutte stopp

1. **Endring i `lib/matching/` eller `lib/journey/`**
2. **Endring i `prisma/`** eller migrasjon
3. **Endring av `middleware.ts`, `vercel.json`**
4. **Endring av `styles/globals.css`** — unntatt `prefers-reduced-motion` i steg 3.1
5. **Endring av `tailwind.config.js`**
6. **Tekstendring** — ett ord er ett for mye, det er ACT v11
7. **Ny API-rute**
8. **Ny avhengighet**
9. **Sletting av en komponent som har bruksteder**
10. **Strukturendring** av en side — kun kortkomponenten byttes

## 7.2 Alminnelige stopp

11. Filen i filankeret avviker fra beskrivelsen
12. `tsc`, `build`, `jest`, `verify:api` eller `verify:lang` feiler
13. En `grep`-verifikasjon gir uventet resultat
14. `git diff --stat` er tom der steget skulle endre en fil
15. Instruksen er tvetydig
16. **En side ser dårligere ut etter byttet** — smalere kort, mistet kant, endret avstand, brutt layout i én av de tre breddene
17. Inline stiler faller vesentlig mindre enn ventet
18. En animasjon virker ikke selv om klassen er der

## 7.3 Hvordan du stopper

```
STOPP — Steg X.Y

Hva jeg forsøkte:
  <konkret handling>

Hva som skjedde:
  <faktisk utskrift, ordrett>

Ved visuelt avvik, per bredde:
  390 px:  <beskrivelse>
  820 px:  <beskrivelse>
  1440 px: <beskrivelse>

Hvilken stop-regel som utløste:
  <nummer fra del 7>

Løsning 1: <forslag> — Konsekvens: <hva det medfører>
Løsning 2: <forslag> — Konsekvens: <hva det medfører>

Venter på godkjenning.
```

## 7.4 Hva du aldri gjør

- Ikke prøv en tredje variant på egen hånd
- Ikke juster den delte komponenten midt i bølge 2 for å redde én side
- Ikke endre tekst, ikke engang en skrivefeil du ser
- Ikke slett noe som er i bruk
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

## 8.2 Vokterkontroll etter hvert steg

```bash
git diff --stat <utgangscommit>..HEAD -- lib/ prisma/ config/matching.ts middleware.ts vercel.json
```

Krav: **tom** gjennom hele v10.

## 8.3 Visuell kontroll — påkrevd i bølge 1 og 2

Etter hvert steg som bytter en side: bygg, og se på hver berørte side i **390 px, 820 px og 1440 px.**

Dette kan ikke automatiseres. Ser noe dårligere ut, er det en stop-regel — ikke noe å rette på egen hånd.

## 8.4 Tekstvakt

Etter hvert steg i bølge 2:

```bash
git diff HEAD~1 -- app/ | grep "^[+-]" | grep -iE "match|reise|pris|timer|lørdag"
```

**Krav: ingen treff.** Ett treff betyr at tekst er endret, og det er ACT v11s arbeid.

## 8.5 Hva som teller som bestått

| Sjekk | Krav |
|---|---|
| tsc | 0 feil |
| build | Grønn |
| jest | Alle grønne, antall ikke lavere enn før |
| verify:api, verify:lang | exit 0 |
| Vokterkontroll | Tom |
| Tekstvakt | Ingen treff |
| `git diff --stat` per steg | Ikke tom |
| Visuell kontroll | Ingen forringelse i tre bredder |
| Verifikasjonsutskrift | Limt inn |

---

# 9. Avslutning

## 9.1 Måltilstand

| Måling | Grunnlinje | Krav etter v10 |
|---|---|---|
| Lokale `GlassCard` | 13 | **0** |
| Glass-komponenter | 5 | **1** |
| Inline `style` i `/` | 91 | **under 20** |
| Inline `style` i `/hvorfor` | 106 | **under 20** |
| `onMouseEnter` | flere | **0** |
| `animate-ts-*` i bruk | 0 | **minst 2** |

Nås ikke et av kravene, **rapporter det faktiske tallet med begrunnelse.** Et ærlig tall er verdt mer enn et grønt.

## 9.2 Oppdaterte tekstankre

Steg 3.4 skal skrive nye linjenumre for alle tekststedene ACT v11 skal endre. Bølge 2 fjerner lokale komponentdefinisjoner på tolv sider, og det flytter linjetellingen.

**Uten dette vil ACT v11 ha feil filankre.**

## 9.3 Oppdatert lanseringsvurdering

Masterplan v8.0 satte 84 % for lukket beta, der «konsistent visuell ramme» var krav nummer 6.

Rapporter et nytt anslag med begrunnelse. **Rapporter ærlig** — er en side fortsatt visuelt uferdig, skriv det.

## 9.4 Sluttstate

```json
{
  "currentStep": null,
  "completedSteps": ["0.1","1.1","1.2","2.1","2.2","2.3","3.1","3.2","3.3","3.4"],
  "lockedSteps":    ["0.1","1.1","1.2","2.1","2.2","2.3","3.1","3.2","3.3","3.4"],
  "pendingSteps": [],
  "finalVerification": {
    "tsc": "0 feil",
    "jest": "<faktisk>",
    "build": "grønn",
    "lokaleGlassCard": 0,
    "glassKomponenter": 1,
    "inlineStilerForside": "<faktisk>",
    "onMouseEnter": 0,
    "animasjonerIBruk": "<faktisk>",
    "guardCheck": "tom",
    "tekstvakt": "ingen treff"
  },
  "nextRound": "ACT v11 — tekst. Se docs/ROUND-C-TEXT-HANDOVER.md for oppdaterte linjenumre",
  "updatedAt": "<ISO>"
}
```

## 9.5 Hva som kommer etter

ACT v11 setter inn teksten fra masterplan v8.0 del 6, ord for ord — de syv matchingstedene, prisene, «de første 10 000», ordensreglene i vilkårene, og to skrivefeil.

---

*TOSOM-ACT-INSTRUKS-v10.0 — 10 steg, 4 bølger, basert på TOSOM-MASTERPLAN-v8.0.*
