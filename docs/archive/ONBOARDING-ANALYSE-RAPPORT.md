# ToSom Onboarding — Analyse & Plan
**Dato:** 30. juni 2026  
**Omfang:** Alle onboarding-filer (app/onboarding/, components/onboarding/, hooks/useOnboarding.ts)  
**Status:** Analyse kun — ingen kodeendringer

---

## 1. TEKSTFEIL, ULOGISKE FORMULERINGER, MANGLENDE GUIDING

### 1.1 Steg 1: Grunnprofil (Step1Profile.tsx)
- **Problem:** Knapper mangler "Tilbake" — man kan ikke gå tilbake
- **Problem:** ingen validering ved "Fortsett" — ingen visuell tilbakemelding ved tomme felt
- **Problem:** Brukeren må fylle ALLE felt manuelt men ingen stjerne (*) eller "påkrevd" markerering synlig (selv om props required eksisterer)
- **Problem:** Label "Alder" → bør være "Hva er du?" eller "Fødselsår"
- **Problem:** Label "Hva søker du?" → mangler kontekst (kjønn? relasjonstype?)
- **Problem:** Slider for "Maks avstand" starter på 50km men initialData distancePref er 50 — inkonsistent med placeholder
- **Problem:** "Minste alder du søker" har default 23 men min-attributt er 18 — brukere kan bli forvirra
- **Språk:** "Livsstil" options er lange — bør forkortes eller ha to linjer
- **Guiding:** Ingen guiding tekst over hele skjermen — bare header + body

### 1.2 Steg 2: Personlighet (Step2Personlighet.tsx)
- **Problem:** Spørsmålene er for korte og flate — mangler veiledning om *hvordan* svare
- **Problem:** Label "Hva er en uvane du ler av deg selv?" → grammatisk feil. Bør være "Hva er en uvane du ler *av* deg selv?"
- **Problem:** Ingenting som forteller brukeren *hvor mye* de bør skrive
- **Problem:** ingen placeholder-eksempler som hjelper

### 1.3 Steg 2 (alternativ): Step2Personality.tsx (veiledet)
- **Problem:** Denne filen eksisterer alongside Step2Personlighet.tsx → forvirring om hvilken som brukes
- **Problem:** Label "Hva er en uvane eller egenskap du ler av hos deg selv?" → for lang
- **Problem:** "Hva gjør deg sliten eller drar deg ned?" → "drar deg ned" er litt negativ formulering

### 1.4 Steg 3: Tilknytning (Step3Tilknytning.tsx)
- **Problem:** Spørsmålene er likevel litt abstrakte — "Hva gjør deg utrygg?" → mange vil vite ikke hva de skal svare
- **Forslag:** Legg til exampleText eller veiledende underskrift
- **Problem:** "Hva trenger du når du er lei deg?" → "Lei deg" er litt barnslig → "Når humøret er lavt" er bedre
- **Problem:** "Hva trenger du når du er stresset?" → repeterer "når du er" strukturen

### 1.5 Steg 4: Kjærlighetsspråk (Step4Kjærlighetsspråk.tsx)
- **Problem:** "Hva får deg til å føle deg nær?" → "nær" er upresist → bør være "nærheten" eller "kjemisk close"
- **Problem:** "Hva skaper avstand?" → for kort → bør ha mer kontekst
- **Problem:** "Hva er en liten ting som betyr mye?" → for vag

### 1.6 Steg 5: Livsstil & verdier (Step5LivsstilVerdier.tsx)
- **Problem:** "Hva prioriterer du høyt?" → "prioriterer du høyt" er lite naturlig norsk
- **Problem:** "Hva prioriterer du lavt?" → samme problem
- **Forslag:** "Hva står øverst påPrioriteringslista di?" (som i placeholder er fint)
- **Problem:** "Hva er en livsstil du ikke ønsker deg?" → "ønsker deg" er rart → bør være "ønsker å unngå"

### 1.7 Steg 6: Framtid & visjon (Step6FramtidVisjon.tsx)
- **Problem:** "Hva vil du oppleve alene?" → "alene" kan føles isolerende → "på egen hånd" er bedre
- **Problem:** "Hva vil du oppleve som par?" → repeterer struktur fra Steg 5
- **Problem:** "Hva drømmer du om å oppnå?" → for generisk

### 1.8 Steg 7: Lek, humor & personlighet (Step7HumorPersonlighet.tsx)
- **Problem:** "Hva er en rar vane du har?" → "rar" kan oppleves som nedsettende → "spesiell" eller "unik" er bedre
- **Problem:** "Hva er et guilty pleasure?" → blandet norsk/engelsk → bør være "Noe du elsker selv om det er litt skammfullt?"
- **Problem:** "Hva ville partneren din le av?" → for spesifikk — man har ikke ennå en partner

### 1.9 Steg 8: Moden nysgjerrighet (Step8ModenNysgjerrighet.tsx)
- **Problem:** Tittel "Moden nysgjerrighet" er uklar — hva betyr det?
- **Problem:** "Hva er en grense du setter?" → repeterer fra Steg 3 (importantBoundary)
- **Problem:** "Hva slags nærhet liker du?" → "nærhet" er for abstrakt
- **Problem:** "Hva trenger du tid for?" → for kort og uklar

### 1.10 Steg 9: Oppsummering (Step9Oppsummering.tsx)
- **Problem:** Viser kun key-value pairs — ingen kategorisering
- **Problem:** Ingen "rediger"-mulighet
- **Problem:** Ingen visuell struktur (gruppering av svar)
- **Problem:** Tittel "Det du har delt" er tørt

### 1.11 Steg 10: Start reisen (Step10StartReisen.tsx)
- **Problem:** Mangler forberedende tekst om hva som skjer videre
- **Problem:** Ingen bekreftelse på "Du vil få én match innen 24 timer"
- **Problem:** Ingen "Lær mer"-lenke om prosessen

---

## 2. KODEFEIL, DUPLICATE KNAPPER, FEIL PROPS, FEIL STATE-FLOW

### 2.1 OnboardingFlow.tsx (app/onboarding/)
- **KRITISK:** `Step2Personlighet` og `Step2Personality` er begge importert — begge gjør nesten det samme
  - Linje 12: `import Step2Personlighet from './steps/Step2Personlighet';`
  - Linje 13: `import Step2Personality from './steps/Step2Personality';`
  - **Brukes begge!** case 1 bruker Step2Personlighet, case 2 bruker Step2Personality
  - Dette er en **duplikat** — en burde fjernes
  
- **KRITISK:** Steg 10 (Step10StartReisen) har `onContinue` som prop men kalles med `handleNext`
  - Linje 166: `<Step10StartReisen data={data} onContinue={handleNext} />`
  - Men `handleNext` er definert for "nest steg", ikke for "start match"
  - **Logikk-feil:** Når step===10 og onContinue→handleNext→setStep(11) → neste rendering gir `null` (ingen case 11)
  - **Korrekt:** Steg 10 bør kalle save-matching-logikken direkte

- **Problem:** `handleNext` på step===9 lagrer ALDRE og navigerer ikke → det lagres i `handleNext` når step===9, men `renderStep` på step===9 returnerer Step9Oppsummering som IKKE har onNext-props
  - Step9Oppsummering mottar kun `data`, ikke `onNext` eller `onBack`

- **Problem:** `onChange` har type `(field: string, value: unknown) => void` — men Step1 bruker `e.target.value` som value, mens Step2 bruker direkte verdier
  - Inkonsekvent interface mellom step-komponenter

- **Problem:** `onBack` er ikke propagert til noen step-komponenter
  - Step1, Step2, Step3 osv har ingen back-mulighet inne i selve skjemaet
  - Bare OnboardingLayout har Tilbake-knapp, men Step1 og Step2 har sine EGEN Tilbake-knapp (hvit/grey)

### 2.2 Step1Profile.tsx
- **Problem:** Bruker `InputField` og `SelectField` fra `../components/` men disse komponentene refererer til path som ikke eksisterer for Steg 2+
- **Problem:** Knapp er en ren `<button>` med inline-stil — bryter mot ui-spec
- **Problem:** Ingen validering — ingen feilmelding ved tomme felt
- **Problem:** `onChange('next', true)` er en hack — ingen leser denne verdien

### 2.3 Step2Personality.tsx
- **Problem:** Har egen Tilbake-knapp som kaller `onBack` MEN OnboardingLayout har også Tilbake-knapp
- **Problem:** Knapper bruker hardkodet farge `bg-gray-700` og `bg-yellow-300` — ikke glassmorphism
- **Problem:** Ingenting som hindrer dobbel-navigasjon

### 2.4 Step9Oppsummering.tsx
- **Problem:** Viser ALLE keys i data-objektet — også `firstName`, `seeking`, `maxDistance` etc som er legacy
- **Problem:** Ingen kategorisering av svar
- **Problem:** Ingen "rediger dette steget"-lenke

### 2.5 useOnboarding.ts
- **Problem:** Validation refererer til OnboardingProvider som ikke eksisterer i app/onboarding/
- **Problem:** Validation for step 2 har felt som `eliteSinglesType` — dette har ingenting å gjøre med ToSom
- **Problem:** Validation for step 1 har `email` men påboarding page bruker ikke email

### 2.6 components/onboarding/OnboardingFlow.tsx (alternativ)
- **Problem:** Denne importere `UserProfile` og `OnboardingState` fra lib/ — men disse har et helt annet schema
- **Problem:** Brukes IKKE av app/onboarding/ — er en **død komponent**
- **Problem:** Bruker `var(--color-gold)` CSS tokens som ikke eksisterer i Tailwind

---

## 3. VISUELLE AVVIK FRA PREMIUM-STILEN

### 3.1 Steg 1 (Step1Profile.tsx)
- **Avvik:** Header har `text-yellow-300` → bør være `#D4AF37` eller inline style
- **Avvik:** Knapp bruker `bg-yellow-300` → bør være `#D4AF37` med gradient
- **Avvik:** Ingen glassmorphism på feltene — bruker hardkodet background
- **Avvik:** Ingen `backdrop-filter: blur` på noe
- **Avvik:** Grid-gap er `gap-10` → bør være `gap-8` (16px)
- **Avvik:** Padding er `px-6 py-12` → bør være `px-8 py-10`

### 3.2 Steg 2 (Step2Personality.tsx)
- **Avvik:** Tilbake-knapp bruker `bg-gray-700` → bør bruke glassmorphism
- **Avvik:** Fortsett-knapp bruker `bg-yellow-300` → bør være gull-gradient
- **Avvik:** Ingen `hover`-effekter som OnboardingLayout har

### 3.3 Steg 3-8
- **Avvik:** Alle disse bruker `space-y-6` → bør være `space-y-8` for bedre luft
- **Avvik:** Ingen header eller tittel i disse stegene — alt er bare spørsmål uten kontekst
- **Avvik:** Ingenting fra OnboardingLayout brukes i disse stegene
- **Avvik:** Konsistensproblemer — noen har `px-6`, andre har ingen padding

### 3.4 Steg 9 (Oppsummering)
- **Avvik:** Mangler premium-knapper — bruker bare data-visning
- **Avvik:** Ingenting som forteller at man kan redigere

### 3.5 Steg 10 (Start reisen)
- **Avvik:** Knapp har bare `#D4AF37` → bør ha gull-gradient med hover
- **Avvik:** Mangler "Du vil få én match innen 24 timer"-tekst

---

## 4. FORSLAG TIL PREMIUM-KNAPPER (spesielt "Tilbake")

### 4.1 Eksisterende Tilbake-knapp (i OnboardingLayout)
Den eksisterende Tilbake-knappen er **bra** men kan forbedres:
- Har glassmorphism-stil ✓
- Har hover-effekter ✓
- Mangler `transition` med timing — bør ha `ease-out`

### 4.2 Forslag til forbedret Tilbake-knapp
```tsx
// Stil som skal anvendes gjennom hele onboarding
<button
  onClick={onBack}
  className="
    px-6 py-3 rounded-xl text-sm font-medium
    transition-all duration-300 ease-out
    border
    hover:scale-[1.02]
  "
  style={{
    background: 'rgba(255, 255, 255, 0.03)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    color: 'rgba(255, 255, 255, 0.5)',
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
    e.currentTarget.style.color = 'rgba(212, 175, 55, 0.8)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)';
  }}
>
  ← Tilbake
</button>
```

### 4.3 Forslag til forbedret "Fortsett"-knapp
Bruk eksisterende fra OnboardingLayout — den er **bra**:
- Gull-gradient ✓
- Hover med scale ✓
- Loading-state ✓
- Focus-visible ✓

---

## 5. FORSLAG TIL FORBEDRET FLYT MELLOM STEG

### 5.1 Nåværende flyt
```
Step1 → Step2(Personlighet) → Step2(Personality) → Step3 → Step4 → Step5 → Step6 → Step7 → Step8 → Step9 → Step10 → [save+match]
```

### 5.2 Identifiserte problemer med nåværende flyt
1. **Trinn 1 og 2 er begge "Steg 2"** — Step2Personlighet og Step2Personality er en duplikat
2. **Ingen steg har intern navigasjon** — man må stole på OnboardingLayouts Tilbake-knapp
3. **Steg 9 (Oppsummering) har ingen Tilbake-knapp** — man blir låst
4. **Steg 10 har feil navigasjonslogikk** — kaller handleNext som går til step=11 som returnerer null
5. **Ingen autosave** — man taper data ved refresh

### 5.3 Forslag til forbedret flyt
```
Steg 1: Grunnprofil (Stabilt)
  → [Tilbake: til dashboard] [Fortsett: stege 2]

Steg 2: Personlighet & identitet (EN komponent, ikke to)
  → [Tilbake: steg 1] [Fortsett: steg 3]

Steg 3-8: Dypdespørsmål (konsistent layout)
  → [Tilbake: forrige steg] [Fortsett: neste steg]

Steg 9: Oppsummering (med kategorisering og rediger-lenker)
  → [Tilbake: steg 8] [Fortsett: steg 10]

Steg 10: Start reisen (med forberedende info)
  → [Start reisen: save + matching → redirect til /matching]
```

---

## 6. KONKRET PLAN FOR VIDERE UTWIKLING

### STEG 1: Fjern duplikate Steg 2-komponenter
**Hva:** Fjern `Step2Personality.tsx` (den veiledede) eller `Step2Personlighet.tsx` (den enkle)
**Hvorfor:** Begge gjør det samme, forvirrer
**Hvordan:** Behold `Step2Personlighet.tsx` (enkelt) og fjern import av `Step2Personality` fra OnboardingFlow.tsx
**Risiko:** Lav — ingen andre importerer Step2Personality

### STEG 2: Konsolidér navigasjon
**Hva:** Fjern alle interne Tilbake-knapper fra step-komponenter
**Hvorfor:** OnboardingLayout har allerede Tilbake — dobbelt navigasjon er forvirrende
**Hvordan:** 
- Fjern Tilbake-knapper fra Step1Profile, Step2Personality
- Bruk kun OnboardingLayouts Tilbake
- Oppdater `showBack` i OnboardingFlow.tsx

### STEG 3: Fix Steg 9 (Oppsummering) — mangler navigasjon
**Hva:** Legg til "Fortsett"-knapp i Step9Oppsummering
**Hvorfor:** Steg 9 har ingen måte å komme videre
**Hvordan:** 
- Oppdater interface med `onNext` og `onBack` props
- Legg til premium-knapper
- Legg til "Rediger dette steget"-lenke

### STEG 4: Fix Steg 10 (Start reisen) — feil navigasjonslogikk
**Hva:** Steg 10 skal kalle save-matching direkte, ikke handleNext
**Hvorfor:** handleNext → setStep(11) → null rendering
**Hvordan:**
- Lag ny `handleStartReisen` som kaller `/api/profile/setup` → `/api/matching`
- Vis loading-state under knappen
- Vis bekreftelsestekst om "én match innen 24 timer"

### STEG 5: Tilføy veiledende tekst til alle steget
**Hva:** Legg til `exampleText` eller `guidingText` på alle TextAreaField-komponenter
**Hvorfor:** Brukere vet ikke hvordan de skal svare
**Hvordan:**
- Legg til 1-2 setning veiledning under hvert spørsmål
- Eksempler: "Skriv 2-3 setninger", "Tenk på en spesifikk situasjon"

### STEG 6: Tilbake-knapp konsistens
**Hva:** Standardiser Tilbake-knapp overalt
**Hvorfor:** UI-spec krever konsistens
**Hvordan:** Bruk samme glassmorphism-stil som OnboardingLayout

### STEG 7: Premium-knapper til alle step-komponenter
**Hva:** Bytt ut alle `bg-yellow-300` knapper med gull-gradient
**Hvorfor:** Bryter mot ui-spec
**Hvordan:** Lag `PremiumButton` komponent eller bruk inline style

### STEG 8: Fix Step1Profile validering
**Hva:** Legg til validering og feilmeldinger
**Hvorfor:** Ingen hindrer submit med tomme felt
**Hvordan:**
- Tilføy `errors` state
- Marker påkrevde felt med rød border
- Vis feilmelding under felt

### STEG 9: Autosave
**Hva:** Lagre data til localStorage etter hvert steg
**Hvorfor:** Brukere taper data ved refresh
**Hvordan:**
- Bruk `useEffect` som lagrer til localStorage
- Les fra localStorage ved mounting

### STEG 10: Konsistent padding og spacing
**Hva:** Alle step-komponenter skal bruke samme spacing
**Hvorfor:** Visuell konsistens
**Hvordan:** `px-8 py-10 space-y-8` overalt

---

## OPPSUMMERING AV KRITISKE PROBLEM

| Prioritet | Problem | Fil(er) |
|-----------|---------|---------|
| KRITISK | Duplikat Steg 2 (Personlighet + Personality) | OnboardingFlow.tsx |
| KRITISK | Steg 10 navigerer til null (case 11) | OnboardingFlow.tsx |
| KRITISK | Steg 9 mangler "Fortsett"-knapp | Step9Oppsummering.tsx |
| Høy | Ingen validering på Steg 1 | Step1Profile.tsx |
| Høy | Alle step mangler veiledende tekst | Steg 2-8 |
| Høy | Inkonsekvente knapper bryter ui-spec | Alle step-komponenter |
| Middels | Død komponent: components/onboarding/OnboardingFlow.tsx | — |
| Middels | useOnboarding.ts har feil validation | useOnboarding.ts |
| Lav | Steg 8 tittel er uklar | Step8ModenNysgjerrighet.tsx |
| Lav | Legacy-felter vises i oppsummering | Step9Oppsummering.tsx |

---

## ANBEFALING

Start med **STEG 1-4** før videre utvikling. Disse fikser de kritiske problemene som gjør onboarding usikker å bruke.

Deretter **STEG 5-8** for å oppnå premium-kvalitet.

Til slutt **STEG 9-10** for polering.