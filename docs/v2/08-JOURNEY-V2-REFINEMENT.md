# ToSom Journey v2 — Forbedringsplan

**Versjon:** 2.0 · **Dato:** 11. august 2026
**Status:** Godkjent av George
**Formål:** Finjustering av 30-dagers reisen uten å endre grunnstruktur, database eller API

---

## 1. Nåtilstand — Journey-system

### Arkitektur (beholdes)
- `lib/journey/` — journey-konfigurasjon og dag-innhold
- `lib/journeyStore.ts` — state-håndtering for journey-progresjon
- `lib/journeyEvents.ts` — hendelsessystem for fase-overganger
- `prisma/schema.prisma` — `JourneyProgress` modell (currentDay, phase)
- 30 dager, 3 faser: EARLY (1-14), BUILDING_TRUST (15-21), DEEPER (22-30)

### Nåværende fase-struktur

| Fase | Dager | Bilder | Fokus |
|------|-------|--------|-------|
| EARLY | 1-14 | ❌ Låst | Trygghet, grunnleggende bekjentskap, verdier |
| BUILDING_TRUST | 15-21 | ✅ Tillatt | Dypere samtaler, sårbarhet, bilde-delings |
| DEEPER | 22-30 | ✅ Tillatt | Fremtid, forpliktelse, avslutningsvalg |

### Dag-innhold per dag
Hver dag har:
- `theme` — dagens tema (f.eks. "Trygghet", "Verdier")
- `title` — kort overskrift
- `description` — intro-tekst til brukeren
- `reflection` — frivillig refleksjonsprompt
- `question` — guidede spørsmål for chat
- `task` — liten oppgave (valgfritt)

### Hva fungerer bra
- **3-fase-modellen** er velbalansert og psykologisk fornuftig
- **14 dager uten bilder** skaper trygghet og fokus på personlighet
- **Frivillige refleksjoner** presser ikke — inviterer
- **Dag 30-valg** ("Ja til tosommhet" / "Start ny reise") er klart og fint

---

## 2. Forbedringsmuligheter (uten rewrite)

### 2.1 Dagtekst — Språklig polering

**Problem:** Noen dag-tekster er funksjonelle men mangler den varme, rolige ToSom-tonen. Tekst varier i kvalitet og lengde.

**Forslag:** Gjennomgå alle 30 dags-objekter med følgende sjekkliste:
- [ ] Tema er klart og relevans for fasen er tydelig
- [ ] Intro-tekst er varm, ikke klinisk
- [ ] Refleksjonsprompt inviterer uten å presse
- [ ] Chat-spørsmål er naturlige og åpne
- [ ] Alle tekster følger språkmanualen (§2 i system_prompt.md)
- [ ] Ingen tekniske begrep ("resonans", "score") i brukertilrettet tekst

**Implementering:** Rediger JSON/TS-filene i `lib/journey/days/` (eller der dag-innhold er definert). Én dag om gangen.

### 2.2 Fase-overganger — Bedre bruker-opplevelse

**Problem:** Overgangen fra EARLY→BUILDING_TRUST (dag 15) og BUILDING_TRUST→DEEPER (dag 22) skjer uten tydlig kommunikasjon til brukeren.

**Forslag — Phase-transition banners:**

#### Dag 15 (EARLY → BUILDING_TRUST)
```
┌─────────────────────────────────────┐
│  🌿 Reis din tar en ny vending      │
│                                     │
│  14 dager har gått siden dere       │
│  begynte denne reisen. Dere har     │
│  blitt kjent uten bilder — og nå    │
│  er det tid for neste steg.         │
│                                     │
│  Fra i dag kan dere dele bilder     │
│  med hverandre. Det er helt frivillig│
│  — дел bare når du føler deg trygg. │
│                                     │
│  [Jeg forstår]                      │
└─────────────────────────────────────┘
```

#### Dag 22 (BUILDING_TRUST → DEEPER)
```
┌─────────────────────────────────────┐
│  💛 Dere nærmer dere målstreken     │
│                                     │
│  22 dager sammen. Dere har bygd     │
│  tillit, delt erfaringer og kanskje  │
│  også bilder. Nå er det tid for     │
│  dypere samtaler.                   │
│                                     │
│  De siste 8 dagene handler om       │
│  fremtid, forpliktelse og hva dere  │
│  virkelig vil med hverandre.        │
│                                     │
│  [Jeg er klar]                      │
└─────────────────────────────────────┘
```

**Implementering:** Ny komponent `components/journey/PhaseTransitionBanner.tsx` som vises én gang per fase-overgang (lagre vist-status i localStorage eller JourneyProgress).

### 2.3 Dag-oppsummering — "I dag har du..."

**Problem:** Når brukeren åpner reisen, ser de dagens tema men får ikke en kort oppsummering av hva de allerede har gjort denne dagen.

**Forslag — Daily progress-indikator øverst i DayCard:**

```
┌─────────────────────────────────────┐
│  Dag 7 av 30 · Introduksjons-fasen │
│                                     │
│  ✓ Tema lest                        │
│  ○ Refleksjon svart                 │
│  ○ Chat-spørsmål brukt              │
│                                     │
│  ──────────────────────── 33%       │
└─────────────────────────────────────┘
```

**Implementering:** Oppdater `components/journey/DayCard.tsx` med checklist-visning basert på brukerens aktiviteter dagen.

### 2.4 Refleksjonssystem — Bedre oppfølging

**Problem:** Refleksjoner er frivillige, men det finnes ingen "sammenheng" mellom dager. Hvis brukeren svarte på refleksjon dag 5 om "trygghet", kan dag 12 referere tilbake til det for å bygge kontinuitet.

**Forslag — Refleksjons-koblinger:**
- I journey-dataen, legg til `referencesDay: number | null` på hver dags refleksjon
- Når brukeren åpner dagens refleksjon, vis en kort referanse:
  *"Forrige uke skrev du om trygghet. Hvordan føles det nå?"*

**Implementering:** Legg til `referencesDay`-felt i journey-dataen per dag. Oppdater refleksjons-komponenten for å hente og vise referanser.

### 2.5 Dag 30 — Avslutningssiden polering

**Nåtilstand:** `/reisen/avslutning` med to knapper ("Ja til tosommhet" / "Start ny reise")

**Forslag — Forbedret avslutningsolevelse:**

1. **Reise-oppsумering:** Vis en kort oppsummering av reisen før valget:
   - "30 dager sammen med [navn]"
   - "[X] meldinger sendt"
   - "[Y] refleksjoner svart"
   - "[Z] guidede spørsmål brukt"

2. **Varmere tekst:** Gjør begge valgene føles positive:
   - "Ja til tosommhet 💛" → "Dere fant hverandre. Lykke til! 🤍"
   - "Start ny reise 🔄" → "Denne reisen endte her, men din reise fortsetter."

3. **Overgangs-animasjon:** Når brukeren velger, vis en kort (800ms) fade-out med en varm melding før redirect.

**Implementering:** Oppdater `app/reisen/avslutning/page.tsx` og relevant API (`POST /api/journey/reset`).

### 2.6 Journey-admin-insights

Se Admin v2 Features-spec (dokument 02) for detaljer om `/admin/operations/journeys/[id]/timeline`.

Kort oppsummering:
- Dag-per-dag tidslinje med aktiviteter
- Meldingsaktivitet per dag (graf)
- Refleksjoner svart? (ja/nei per dag)
- Fase-overganger med tidsstempler

---

## 3. Hva vi IKKE endrer

| Element | Status | Grunn |
|---------|--------|-------|
| 30-dagers-lengde | **Uendret** | Korrekt psykologisk rammeverk |
| 3-fase-modell | **Uendret** | EARLY/BUILDING_TRUST/DEEPER fungerer godt |
| DATABASE-modeller | **Uendret** | JourneyProgress er tilstrekkelig |
| API-ruter | **Uendret** | Eksisterende journey-API beholdes |
| Chat-integrasjon | **Uendret** | Guided questions systemet fungerer |
| Krønjob for dag-avansering | **Uendret** | Dag-by-dag fremgang er korrekt |

---

## 4. Endringsplan — Inkrementelle steg

### Steg 1: Språklig polering av alle 30 dager
- Gjennomgå én dag om gangen
- Sjekk mot språkmanualen
- Test at teksten føles varm, rolig og inviterende

### Steg 2: Fase-overgang-bannerer
- Opprett `PhaseTransitionBanner.tsx`
- Implementer dag 15 og dag 22-bannere
- Lagre vist-status for å ikke vise samme banner gjentatte ganger

### Steg 3: Daglig progresjons-indikator
- Oppdater DayCard med checklist-visning
- Koble opp mot eksisterende aktiviteter (refleksjon, chat-spørsmål)

### Steg 4: Refleksjons-koblinger mellom dager
- Legg til `referencesDay` i journey-dataen
- Implementer referanse-visning i refleksjons-komponenten

### Steg 5: Avslutningsside-polering
- Legg til reise-oppsumming
- Oppdater tekst for begge valg
- Legg til overgangs-animasjon

---

## 5. Qwen ACT-instruks

```
Når du implementerer Journey v2 forbedringer:

1. Les ALWAYS ai/system_prompt.md før hvert steg
2. START med språklig polering — det er høy verdi og lav risiko
3. Hver dagtekst skal leses høyt for å sjekke at den lyder naturlig på norsk bokmål
4. Fase-overgang-bannerer skal vises én gang kun (localStorage flag)
5. Refleksjons-koblinger skal være valgfrie — ikke tving bruker til å se referanser
6. Avslutningssiden skal føles positiv uansett valg brukeren gjør
7. Ikke endre journey-strukturen (30 dager, 3 faser) — kun tekst og opplevelse
8. Test på mobil at dag-per-dag navigasjon fungerer smooth
```

---

*Slutt på Journey v2 Forbedringsplan.*