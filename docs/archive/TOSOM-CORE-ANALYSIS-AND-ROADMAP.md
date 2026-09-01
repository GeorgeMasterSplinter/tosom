# ToSom — Kjerneanalyse og Komplett Roadmap

**Dato:** 2026-06-20  
**Versjon:** 1.0  
**Status:** Analyse + Implementeringsplan  
**Formål:** Analyser tosom-core-definition.md, identifiser gap mot dagens implementering, og lever en komplett, gjennomførbar plan for å nå definert måltilstand.

---

## INNHOLD

1. [Analyse av kjerekoden (tosom-core-definition.md)](#1-analyse-av-kjerekoden)
2. [Dagens tilstand — Hva som finnes i dag](#2-dagens-tilstand)
3. [Gap-analyse — Mål vs. Virkelegheit](#3-gap-analyse)
4. [Roadmap: Fra dagens tilstand til definert måltilstand](#4-roadmap)
5. [Prioritering — Hva som må byggjast først](#5-prioritering)
6. [Oppsummering — Nøkkeltal for implementering](#6-oppsummering)

---

## 1. ANALSE AV KJERKODEN (tosom-core-definition.md)

### 1.1 Hva er ToSom — Definerande eigaskapar

ToSom er **ikke** en datingapp. ToSom er en **relasjonsplattform**. Dette er det avgjerande skiljet.

**Avgjerande trekk:**

| Eigenskap | Definisjon | Prioritet |
|-----------|------------|-----------|
| **Eining** | Plattformen er bygget for TO menneske | Høgast |
| **Privatheit** | Profil som aldri er offentleg | Kritisk |
| **En match per 24 timer** | Bare ÉIN match om gongen | Kritisk |
| **Kunnskapsbasert** | Matching basert på djup kunnskap, ikke foto | Kritisk |
| **30-dagers reise** | Guidet reise mellom to personar | Kritisk |
| **14 dager uten bilder** | Fase 1 — bygger trygghet | Høg |
| **Ingen swipe** | Aldri, under ingen omstendigheit | Absolutt |
| **Ingen feed** | Ingen uendeleg rullering | Absolutt |
| **Ingen gamification** | Ingen poeng, badges, eller mekanikkar | Absolutt |
| **Rolig og varm tone** | Språk og UX må reflektere dette | Høg |

### 1.2 De tre grunnpilarene — Djup analyse

#### Pilare 1: Privat profil

**Hva dokumentet seier:**
- Djup, privat profil som aldri er offentleg
- Bare match-motoren har tilgang
- Inneholder: livssituasjon, verdier, personlighet, relasjonsstil, kommunikasjon, framtidønsker, grenser, emosjonelle behov, livsrytme, modenheit

**Hva dette betyr teknisk:**
- Profile må være **djup** — minst 8-9 steg med faktabasert data
- Profile må være **privat** — ingen offentlege profil-endepunkt
- Profile-data må være **maskinlesbar** — match-motoren må kunne analysere hver enkelt attributt
- Profil må innehalde **relasjonsdata** — ikke bare "hven er eg" men "hvem søkjer eg og hvordan"

#### Pilare 2: Kunnskapsbasert matching

**Hva dokumentet seier:**
- Éin match per 24 timer
- Basert på kompatibilitet, verdier, livssituasjon, emosjonelle mønster, relasjonsstil, kommunikasjon, framtidønsker, modenheit
- Matchen blir låst i 30 dager etter aksept
- Ingen val mellom flere, ingen stress, ingen samling

**Hva dette betyr teknisk:**
- Match-motoren må køyre én gong per dag per bruker (cron/queue)
- Matching-algoritmen må være **fleirdimensjonal** — vektet kompatibilitet over minst 10 dimensjonar
- Match-systemet må støtte **låsing** — når akseptert, ingen nye matcher til reisa er over
- Match-UIet må vise **bare ÉIN match** — ingen liste, ingen "flere match"

#### Pilare 3: 30-dagers reise

**Hva dokumentet seier:**
- Fase 1: 14 dager uten bilder (anbefalt)
- Fase 2: 30 dager med guiding (spørsmål, tema, oppgaver, resonansmåling, progresjon)
- Tema: introduksjon, trygghet, åpne deg, dypere samtaler, sårbarhet, felles reise
- Etter 30 dager: fortsetje, avslutte, eller start ny reise

**Hva dette betyr teknisk:**
- Reisestaten må være **tidsbasert** — hver dag i 30 dagane har egne tema og oppgaver
- Guiding-systemet må generere **dagleg innhold** — refleksjonsspørsmål, samtaletema, oppgaver
- Resonansmåling må være **kontinuerleg** — måle hvordan paret "føler" sammen over tid
- Bilder må være **låst i 14 dager** — deretter valfritt
- Systemet må støtte **reiselivssyklus** — 30 dager → fortsetje/avslutte/ny

---

### 1.3 Brukarflow — Fra konto til reise

**Steg 1: Opprett konto**
- E-post → magisk lenke → innlogging
- Ingen passord
- Ingen sosiale media-innlogging

**Steg 2: Onboarding (djup profil)**
9 steg:
1. Identitet (fornamn, etternamn, alder, identitetsnamn)
2. Livssituasjon (hvorfor er du her, hva type liv lever du)
3. Livsstil (aktivitet, sosialt, økonomi, helg)
4. Personlighet (energi, kommunikasjon, struktur)
5. Relasjonsstil (kvarleie, gi, treng)
6. Kommunikasjon (hvordan snakker du, hvordan høyrer du)
7. Intimitet og nærhet (moden — fysisk, emosjonell, tempou)
8. Framtidsønske (hva vil du ha, hva kan du gi)
9. Oppsummering (konfirmering)

**Steg 3: Dashboard**
- Match-status (neste match om X timar)
- Reise-status (hva dag er du i, hva tema)
- Hurtigtilgang (chat, reise, profil)

**Steg 4: Match**
- Éin match per 24 timar
- Bare den beste kompatibiliteten
- Aksept → lås i 30 dager

**Steg 5: Privat rom (chat)**
- Guiding synleg
- Spørsmål som dukker opp dagleg
- Refleksjoner du kan dele med partnaren
- Oppgaver som blir tilordna dagleg
- Progresjon synleg

**Steg 6: Reise**
- Daglege tema
- Daglege spørsmål
- Daglege refleksjoner
- Resonansmåling
- Progresjon (visuell, ikke-gamified)

---

### 1.4 Tone og språk

Alle tekstar må være:
- Rolige — aldri hastes
- Varme — aldri kalde
- Modne — aldri barnlege
- Trygge — aldri aggressive
- Ikke pushy — aldri kommanderande
- Ikke gamified — aldri "du har mista en dag!"
- Ikke overflatisk — aldri " finn din soulmate!"

---

## 2. DAGENS TILSTAND — HVA SOM FINNES I DAG

### 2.1 Arkitekture oversikt

```
tosom/
├── app/                    # Next.js App Router (ny)
│   ├── (landing)/          # Landing page
│   ├── admin/              # Admin-panel
│   ├── api/                # API-ruter (ny)
│   ├── chat/               # Chat-side (delvis)
│   ├── conversation/       # Samtale-visning
│   ├── dashboard/          # Dashboard
│   ├── journey/            # Reise-visning
│   ├── login/              # Innlogging
│   ├── match/              # Match-visning
│   ├── onboarding/         # Onboarding
│   └── profile/            # Profil-redigering
├── pages/                  # Next.js Pages Router (gammal)
│   ├── api/                # Gamle API-ruter
│   ├── chat/               # Gamle chat-sider
│   ├── dashboard.tsx       # Dashboard-side
│   ├── journey/            # Gamle journey-sider
│   ├── match/              # Gamle match-sider
│   ├── onboarding/         # Gamle onboarding-sider
│   ├── profile/            # Gamle profil-sider
│   └── index.tsx           # Landing page
├── components/             # Reakt-komponentar
├── lib/                    # Bibliotek og utility-funksjonar
├── prisma/                 # Database-skjema
├── config/                 # Konfigurasjon
└── styles/                 # CSS/stilar
```

### 2.2 Hva som finnes i dag — Oversikt

#### ✅ Implementert (fungerande)

| Område | Status | Kommentar |
|--------|--------|-----------|
| Landing page | ✅ Eksisterer | `app/(landing)/page.tsx` |
| Innlogging (NextAuth) | ✅ Fungerer | Magisk lenke |
| Admin-panel | ✅ Delvis | Brukere, konversasjonar, reiser |
| Profile-modell (Prisma) | ✅ Eksisterer | Med mange felt |
| Onboarding (frontend) | ✅ Delvis | Flere steg eksisterer |
| Match-API (delvis) | ⚠️ Delvis | Finnes, men ikje "én per 24t" |
| Journey-system | ⚠️ Delvis | JourneyStep/JourneyProgress eksisterer |
| Chat (delvis) | ⚠️ Delvis | Meldinger finnes, men ikke guidings-UI |
| Resonansmåling | ✅ Eksisterer | `lib/resonance.ts` |
| Matching-algoritme | ✅ Eksisterer | `lib/matching.ts`, `lib/deepMatch.ts` |
| API-ruter (nye) | ✅ Delvis | `app/api/` har mange ruter |

#### ❌ Mangler eller er ufullstendig

| Område | Status | Kommentar |
|--------|--------|-----------|
| **Éin match per 24t** | ❌ Mangler | Ingen implementasjon |
| **Match-låsing (30 dager)** | ❌ Mangler | Ingen låsingsmekanisme |
| **14-dags bildeklausur** | ❌ Mangler | Ingen validering |
| **30-dagers guide-innhold** | ❌ Mangler | Ingen dagleg oppgåve-generering |
| **Resonans-UI** | ❌ Mangler | Kun lib, ikke UI |
| **Djup profil-fullføring** | ❌ Mangler | Onboarding fullfører ikke |
| **Landing page (rei** | ⚠ | Mangler delar |
| **Fase 1 → Fase 2-overgang** | ❌ Mangler | Ingen tidsbasert overgang |
| **Progresjons-UI (ikke-gamified)** | ❌ Mangler | |
| **Relasjons-tider** | ❌ Mangler | |
| **Oppgåve-tilordning** | ❌ Mangler | |

---

## 3. GAP-ANALYSE — MÅL vs. VIRKELEGHEIT

### 3.1 Kritiske gap (må løysast umiddelbart)

#### GAP 1: Ingen én-match-per-24-timer mekanisme

**Dagens tilstand:**
- `app/api/match/route.ts` har en match-endepunkt
- Ingen dagleg rate limiting på match
- Ingen garanti om "bare den beste"
- Kan gi flere match samtidig

**Måltilstand:**
- Éin match per bruker per 24 timar
- Den beste kompatibiliteten
- Ingen multiple aktive match

**Gap:** Høg | **Prioritet:** Kritisk

#### GAP 2: Ingen match-låsing

**Dagens tilstand:**
- Ingen mekanisme for å låse match i 30 dager
- Ingen tilstand for "i reise" vs "tilgjengeleg for match"
- Ingen automatisk slutting etter 30 dager

**Måltilstand:**
- Match låst i 30 dager etter aksept
- Ingen nye matcher i perioden
- Automatisk tilstandsovergang etter 30 dager

**Gap:** Høg | **Prioritet:** Kritisk

#### GAP 3: Ingen bildeklausur i 14 dager

**Dagens tilstand:**
- Bilder kan lastast opp når som helst
- Ingen låsingsmekanisme for bilder
- Ingen tidsbasert opplåsing

**Måltilstand:**
- Bilder låst de første 14 dagane
- Automatisk opplåsing etter 14 dager
- Valfritt å dele etter opplåsing

**Gap:** Medium | **Prioritet:** Høg

#### GAP 4: Ingen guidede dagleg oppgaver

**Dagens tilstand:**
- `lib/journeyTasks.ts` har noen oppgaver
- Ingen dagleg auto-generering
- Ingen progresjon basert på tema
- `JourneyStep` og `JourneyProgress` eksisterer men er ikke fullt utnytta

**Måltilstand:**
- Daglege oppgaver basert på reisefase
- Tema-basert innhold (6 tema definert)
- Daglege refleksjonsspørsmål
- Resonansmåling hver dag

**Gap:** Høg | **Prioritet:** Kritisk

### 3.2 Moderate gap (viktige, men ikke kritiske)

#### GAP 5: Landing page mangler definert struktur

**Dagens tilstand:**
- Landing page eksisterer
- Mangler den definerte strukturen (A, B, C)

**Måltilstand:**
- A: Hva er ToSom
- B: Hvordan fungerer det (8 steg)
- C: Hvorfor ToSom (6 punkter)

**Gap:** Medium | **Prioritet:** Medium

#### GAP 6: Onboarding mangler djup profil

**Dagens tilstand:**
- Onboarding har flere steg
- Mangler noen av de dype dimensjonane
- Fullfører ikke automatisk `deepProfileComplete`

**Måltilstand:**
- 9-stegs onboarding
- Alle dype felt fylt
- Automatisk fullføring av `deepProfileComplete`

**Gap:** Medium | **Prioritet:** Høg

#### GAP 7: Dashboard mangler reise-status

**Dagens tilstand:**
- Dashboard viser noen match-info
- Mangler reise-progresjon
- Mangler neste match-tidspunkt

**Måltilstand:**
- Match-status (neste match om X timar)
- Reise-status (hva dag, hva tema)
- Hurtigtilgang til chat og reise

**Gap:** Medium | **Prioritet:** Høg

#### GAP 8: Ingen tidsbasert Fase 1 → Fase 2-overgang

**Dagens tilstand:**
- Ingen fase-indikator
- Ingen tidsbasert overgang

**Måltilstand:**
- Fase 1: Dager 1-14, ingen bilder
- Fase 2: Dager 15-30, bilder valfrie
- Synleg fase-indikator

**Gap:** Medium | **Prioritet:** Høg

### 3.3 Lett gap (kan løysast senere)

#### GAP 9: UI mangler ToSom-tone

**Dagens tilstand:**
- Noen tekstar er på engelsk
- Noen komponentar har "dating-app" känsla
- Gamle komponentar er ikke oppdaterte

**Måltilstand:**
- Alle tekstar på ToSom-tons (norsk, rolig, varm)
- Ingen dating-app-komponentar
- Hele UIet følger Nordic Gold Premium

**Gap:** Low | **Prioritet:** Medium

#### GAP 10: Administrative verkty mangler funksjonar

**Dagens tilstand:**
- Admin-panel har basis funksjonalitet
- Mangler reise-guidering
- Mangler match-kontroll

**Måltilstand:**
- Full admin-kontroll over reiser
- Manual match-oppdatering
- Bruker-innsyn i full profil

**Gap:** Low | **Prioritet:** Medium

---

## 4. ROADMAP — FRA DAGENS TILSTAND TIL DEFINERT MÅL TILSTAND

### Fase 0: Fundament (Veke 1-2)

**Mål:** Sikre at grunndata-modellen støtter kjernefilosofien

#### Blokk 0.1: Database-skjema oppdatering

```
Mål: Oppdater Prisma-skjema for å støtte én match, låsing, og bildeklausur
```

| Oppgåve | Beskriving | Est. tid |
|---------|------------|----------|
| Legg til `matchLockUntil` på User | Datumsfelt som låser nye match | 30 min |
| Legg til `chatUntilImage` på Conversation | Datumsfelt for bilde-opplåsing | 15 min |
| Legg til `isActive` på Match | Indikator for aktiv reise | 15 min |
| Oppdater JourneyStep med tema | Legg til tema-felt for dagleg innhold | 30 min |
| Oppdater JourneyProgress med fase | Legg til fase-indikator | 15 min |
| Opprett migration | `prisma migrate dev` | 30 min |

**Total tid:** ~2 timar

#### Blokk 0.2: Match-motor oppdatering

```
Mål: Støtte "én match per 24t"
```

| Oppgåve | Beskriving | Est. tid |
|---------|------------|----------|
| Lag `lib/oneMatchPerDay.ts` | Sjekk om bruker kan få ny match | 1 time |
| Lag `lib/findBestMatch.ts` | Finn beste kompatibilitet, ikke alle | 2 timar |
| Lag `lib/lockMatch.ts` | Lås match i 30 dager | 1 time |
| Lag `lib/unlockMatch.ts` | Lås opp etter 30 dager | 30 min |
| Oppdater `app/api/match/route.ts` | Bruk nye funksjonar | 1 time |

**Total tid:** ~5 timar

---

### Fase 1: Kjernefunksjonar (Veke 2-4)

**Mål:** Bygge de tre grunnpilarene

#### Blokk 1.1: Privat profil-system

```
Mål: Sikre at profiler aldri er offentlege og at onboarding fullfører djup profil
```

| Oppgåve | Beskriving | Est. tid |
|---------|------------|----------|
| Fjern offentlege profil-endepunkt | Ingen `GET /profile/[id]` uten auth | 30 min |
| Oppdater `getProfileById` | Bare tilgjengeleg for partnar | 30 min |
| Oppdater onboarding-complete | Set `deepProfileComplete: true` automatisk | 30 min |
| Valider onboarding-steg | Kreav minst alle obligatoriske felt | 1 time |

**Total tid:** ~2.5 timar

#### Blokk 1.2: Match-låsing og bildeklausur

```
Mål: Implementere 30-dagers låsing og 14-dagers bildeklausur
```

| Oppgåve | Beskriving | Est. tid |
|---------|------------|----------|
| Lag `lib/checkMatchLock.ts` | Sjekk om bruker er låst | 30 min |
| Lag `lib/checkImageUnlock.ts` | Sjekk om bilder er opplåst | 30 min |
| Oppdater chat-medie-opplastning | Blokker bilder før dag 14 | 1 time |
| Oppdater chat-UI | Vis melding "Bilder låst til dag X" | 30 min |
| Oppdater match-UI | Vis "Reise pågauge" istedenfor "Søk ny" | 1 time |

**Total tid:** ~3.5 timar

#### Blokk 1.3: Guidet 30-dagers reise

```
Mål: Bygge dagleg guide-system med tema og oppgaver
```

| Oppgåve | Beskriving | Est. tid |
|---------|------------|----------|
| Lag `lib/journey/themes.ts` | 6 tema med dagleg innhold (180 oppgaver totalt) | 4 timar |
| Lag `lib/journey/getDailyTask.ts` | Hent dagens oppgåve basert på dag i reisa | 1 time |
| Lag `lib/journey/getDailyQuestion.ts` | Hent dagleg refleksjonsspørsmål | 1 time |
| Lag `lib/journey/getDailyInsight.ts` | Hent dagleg innsikt | 1 time |
| Oppdater Journey UI | Vis dagleg oppgåve, spørsmål, innsikt | 3 timar |
| Lag `lib/journey/resonanceDaily.ts` | Dagleg resonansmåling | 1 time |
| Oppdater progresjons-UI | Ikke-gamified, visuell progresjonsindikator | 2 timar |

**Total tid:** ~13 timar

---

### Fase 2: Brukaroppleving (Veke 4-6)

**Mål:** Hele brukarflowet fra start til reise

#### Blokk 2.1: Oppdatert landing page

```
Mål: Landing page som følgjer definert struktur (A, B, C)
```

| Oppgåve | Beskriving | Est. tid |
|---------|------------|----------|
| Seksjon A: Hva er ToSom | Kort, varmt, rolig introduksjon | 2 timar |
| Seksjon B: Hvordan fungerer det | 8-stegs forklaring | 3 timar |
| Seksjon C: Hvorfor ToSom | 6 kontraster (ingen swipe, osv.) | 2 timar |
| Footer: Språk og juridisk | | 1 timar |

**Total tid:** ~8 timar

#### Blokk 2.2: Oppdatert onboarding

```
Mål: 9-stegs djup profil-onboarding
```

| Oppgåve | Beskriving | Est. tid |
|---------|------------|----------|
| Oppdater onboarding steg | Alle 9 steg i definert rekkefølge | 4 timar |
| Oppdater progresjons-indikator | Ro, ikke-gamified | 1 timar |
| Oppdater samandst-side | Vis samandst av utfylte felt | 1 timar |
| Test full onboarding-flow | Fra start til deepProfileComplete | 1 timar |

**Total tid:** ~7 timar

#### Blokk 2.3: Oppdatert dashboard

```
Mål: Dashboard med match-status, reise-status, og hurtigtilgang
```

| Oppgåve | Beskriving | Est. tid |
|---------|------------|----------|
| Match-status-banner | Neste match om X timar eller "I reise" | 2 timar |
| Reise-status-panel | Hva dag, hva tema, progresjon | 2 timar |
| Hurtigtilgangsmeny | Chat, reise, profil | 1 timar |
| Resonans-oversikt | Dagleg resonans (sist 7 dager) | 2 timar |

**Total tid:** ~7 timar

#### Blokk 2.4: Oppdatert chat og privat rom

```
Mål: Chat med guiding, spørsmål, og oppgaver
```

| Oppgåve | Beskriving | Est. tid |
|---------|------------|----------|
| Oppdater chat-UI | Vis dagleg guidings-innhold | 2 timar |
| Legg til spørsmåls-kort | Dagleg refleksjonsspørsmål over chatten | 1 timar |
| Legg til oppgåve-kort | Dagleg oppgåve med "utført" knapp | 1 timar |
| Legg til resonans-indikator | Vismellinger | 1 timar |
| Test heile flows | | 1 timar |

**Total tid:** ~6 timar

---

### Fase 3: Sikkerheit og kvalitet (Veke 6-7)

**Mål:** Sikker, rolig, og moden opplevelse

#### Blokk 3.1: Sikkerheit og tilgjengekontroll

```
Mål: Sikre at inga profil-data lekkjer og at match-låsing er robust
```

| Oppgåve | Beskriving | Est. tid |
|---------|------------|----------|
| Audit alle profil-endepunkt | Ingen offentleg tilgang | 1 timar |
| Test match-låsing | Verifiser ingen nye matcher under reise | 1 timar |
| Test bildeklausur | Verifiser bilder ikke synlege før dag 14 | 1 timar |
| Tilføy server-side validering | Alle valideringar på serveren | 1 timar |

**Total tid:** ~4 timar

#### Blokk 3.2: Tone og språk-audit

```
Mål: Alle tekstar følgjer ToSom-tone
```

| Oppgåve | Beskriving | Est. tid |
|---------|------------|----------|
| Alle API-feilmeldingar | Til ToSom-tons | 2 timar |
| Alle UI-tekstar | Til ToSom-tons | 3 timar |
| Alle onboarding-tekstar | Til ToSom-tons | 2 timar |
| Alle e-postar (dersom) | Til ToSom-tons | 1 timar |

**Total tid:** ~8 timar

#### Blokk 3.3: Design-system oppdatering

```
Mål: Hele UIet følger Nordic Gold Premium
```

| Oppgåve | Beskriving | Est. tid |
|---------|------------|----------|
| Fargepalett | Verifiser alle fargar | 30 min |
| Glassmorphism | Verifiser på alle komponentar | 1 timar |
| Typografi | Verifiser font-størrelser | 30 min |
| Animasjonar | Myke, langsame, bevisste | 2 timar |
| Radius og spacing | Konsistente | 1 timar |

**Total tid:** ~5.5 timar

---

### Fase 4: Validering og lansering (Veke 7-8)

**Mål: Full funksjonell test og lansering

#### Blokk 4.1: Integrasjonstest

```
Mål: Hele flowet fra start til reise
```

| Oppgåve | Beskriving | Est. tid |
|---------|------------|----------|
| Test onboarding → match → reise | Hele flowet | 2 timar |
| Test match-låsing | Ingen nye matcher under reise | 1 timar |
| Test bildeklausur | Bilder låst 14 dager, opplåst etter | 1 timar |
| Test dagleg guiding | Hver dag i 30 dager (simulert) | 2 timar |
| Test resonansmåling | Dagleg måling og visning | 1 timar |
| Test dashboard | All korrekt info | 1 timar |

**Total tid:** ~8 timar

#### Blokk 4.2: Dokumentasjon

```
Mål: Dokumentasjon for vidare utvikling
```

| Oppgåve | Beskriving | Est. tid |
|---------|------------|----------|
| Oppdater README.md | Ny struktur, ny dokumentasjon | 1 timar |
| API-dokumentasjon | Alle nye API-ruter | 2 timar |
| Database-skjema-dokumentasjon | Oppdatert schema.prisma + dokumentasjon | 1 timar |
| Oppdater tosom-blueprint.md | Samsvar med ny implementering | 2 timar |

**Total tid:** ~6 timar

---

## 5. PRIORITERING — HVA SOM MÅ BUILDST FØRST

### Prioriteringsmatrise

| Prioritet | Område | Hvorfor |
|-----------|--------|--------|
| **P0** | Match-låsing (30 dager) | Uten dette kan flere match være aktive samtidig |
| **P0** | Éin match per 24t | Kritisk for kjernefilosofi |
| **P0** | Dagleg guide-innhold | Uten dette har reisa inga导向 |
| **P1** | Bildeklausur (14 dager) | Kritisk for trygghet |
| **P1** | Djup profil-onboarding | Uten djup profil, ingen kunnskapsbasert matching |
| **P1** | Dashboard med reise-status | Uten dette veit ikke brukeren hva som skjer |
| **P2** | Oppdatert landing page | Viktig for korrekt positioning |
| **P2** | Chat med guiding | Viktig for reiseoppleving |
| **P2** | Tone og språk-audit | Viktig for merkeny |
| **P3** | Design-system oppdatering | Viktig, men kan gjerast parallel |
| **P3** | Administrativ verkty | Viktig, men ikke bruker-critical |

### Rekkefølge — Hva skal byggast først

**Rekkefølje 1: Match-system (Veke 1-2)**
1. Database-skjema oppdatering
2. Éin-match-per-24t
3. Match-låsing (30 dager)
4. Test match-flow

**Rekkefølje 2: Guide-system (Veke 2-3)**
5. Tema og oppgaver (6 tema, 180 oppgaver)
6. Dagleg innhold-generering
7. Resonansmåling
8. Test guide-flow

**Rekkefølje 3: Profil og onboarding (Veke 3-4)**
9. Djup profil-validering
10. Oppdater onboarding
11. Test onboarding → match-flow

**Rekkefølje 4: UI og opplevelving (Veke 4-6)**
12. Dashboard med reise-status
13. Chat med guiding
14. Bildeklausur-UI
15. Test heile flowet

**Rekkefølje 5: Sikkerheit og kvalitet (Veke 6-7)**
16. Sikkerheit-audit
17. Tone og språk-audit
18. Design-system oppdatering

**Rekkefølje 6: Lansering (Veke 7-8)**
19. Integrasjonstest
20. Dokumentasjon
21. Lansering

---

## 6. OPPSUMMERING — NØKKELTA TAL FOR IMPLEMENTERING

### Heile oversikt

| Kategori | Tal | Kommentar |
|----------|-----|-----------|
| **Faser** | 6 | Fundament → Kjerne → UX → Kvalitet → Validering → Lansering |
| **Arbeidsblokkar** | 21 | Spesifikke, gjennomførte blokk |
| **Estimert tid** | ~70 timar | Ca. 2 veker med full tid |
| **Kritiske gap** | 4 | Match-låsing, én match, guide-innhold, djup profil |
| **Moderate gap** | 4 | Landing page, onboarding, dashboard, fase-overgang |
| **Lette gap** | 2 | Tone, admin |
| **Database-endringer** | 4-5 felt | matchLockUntil, chatUntilImage, isActive, tema, fase |
| **Nye API-ruter** | 6-8 | Match-låsing, guide, resonans, bildeklausur |
| **Oppdaterte API-ruter** | 4-5 | Match, onboarding, profile, journey |
| **Nye komponentar** | 5-7 | Reise-status, guidede oppgaver, resonans-UI |
| **Oppdaterte komponentar** | 8-10 | Dashboard, chat, onboarding, match |
| **Test scenario** | 10 | Fra start til måltilstand |

### Det viktigaste å hugse

1. **ToSom er ikke en datingapp** — alt må reflektere dette
2. **Éin match per 24t er ikke valfritt** — det er kjernefilosofien
3. **Match-låsing er ikke valfritt** — uten dette brot kjernefilosofien
4. **Djup profil er ikke valfritt** — uten djup profil, ingen kunnskapsbasert matching
5. **30-dagers reise er ikke valfritt** — uten reise, ingen ToSom
6. **14-dagers bildeklausur er ikke valfritt** — uten det, brot trygghet

### Oppsummerande uttale

> ToSom er en rolig, privat, kunnskapsbasert relasjonsplattform for to menneske.
> All utvikling må støtte denne definisjonen.
> Ingen swipe. Ingen feed. Ingen gamification. Ingen uendelege valg.
> Bare to menneske som møtest i ro.

---

**SLUTT PÅ DOKUMENT**

---

# Vedlegg A: Database-endringer

```prisma
// P0: Match-låsing
model User {
  matchLockUntil    DateTime?   @db.DateTime
  deepProfileComplete Boolean   @default(false)
}

// P0: Aktiv reise
model Match {
  isActive          Boolean     @default(true)
}

// P1: Bilede-opplåsing
model Conversation {
  chatUntilImage    DateTime?   @db.DateTime
}

// P2: Tema-indikator
model JourneyStep {
  theme             String?     @db.VarChar(100)  // "introduksjon", "trygghet", osv.
  dayNumber         Int?                            // Hva dag i reisa (1-30)
}
```

---

# Vedlegg B: Kritiske API-endepunkt

## Ny API-ruter

```
POST /api/match/findBest       — Finn beste match (én), ikke alle
POST /api/match/accept          — Aksepter match → lås i 30 dager
POST /api/match/unlock          — Lås opp match etter 30 dager
GET  /api/match/checkLock       — Sjekk om bruker er låst
GET  /api/journey/daily-task    — Hent dagens oppgåve
GET  /api/journey/daily-question — Hent dagleg spørsmål
GET  /api/journey/daily-insight — Hent dagleg innsikt
GET  /api/journey/resonance     — Dagleg resonans
POST /api/journey/reflect       — Lagrefleksjon
GET  /api/image/unlock-status   — Sjekk om bilder er opplåst
```

## Oppdaterte API-ruter

```
POST /api/match/route           — Legg til låsing-sjekk
POST /api/onboarding/complete   — Set deepProfileComplete: true
GET  /api/profile/[id]          — Bare tilgjengeleg for partnar
POST /api/chat/upload-image     — Blokker before dag 14
```

---

# Vedlegg C: Komplett bruker-flow (måltilstand)

```
1. Bruker opnar tosom.no
   → Landing page (A: Hva er ToSom, B: Hvordan, C: Hvorfor)

2. Bruker klikkar "Kom i gang"
   → Magisk lenke til innlogging

3. Bruker logger inn
   → Dersom ny: onboarding (9 steg)
   → Dersom eksisterande: dashboard

4. Onboarding (9 steg)
   → Identitet → Livssituasjon → Livsstil → Personlighet
   → Relasjonsstil → Kommunikasjon → Intimitet → Framtidsønske → Oppsummering
   → deepProfileComplete = true

5. Dashboard
   → "Neste match om 12 timar"
   → Ingen aktive reiser

6. Match kjører (automatisk, dagleg)
   → Finn beste kompatibilitet
   → Bare ÉIN match

7. Bruker får notifikasjon
   → "Du har en match" (rolig, ikke pushy)

8. Bruker aksepterer match
   → Reise startar (30 dager)
   → Match låst i 30 dager
   → Bilder låst i 14 dager
   → Fase 1 startar

9. Hver dag i 30 dager:
   → Ny oppgåve
   → Ny refleksjonsspørsmål
   → Ny innsikt
   → Resonansmåling
   → Progresjon oppdatert

10. Dag 15:
    → Bilder blir tilgjengelege
    → Bruker kan velge å dele

11. Dag 30:
    → Reise kan avsluttast
    → Eller fortsetje
    → Eller start ny reise med ny match
```

---

# Vedlegg D: 6 Reisetem — Full oversikt

## Tema 1: Introduksjon (Dager 1-5)
- Kjenne kjennskap: "Hvem er du når du er din best du?"
- Trygg framstilling: "Hva gjer deg spesielt?"
- Liten utfordring: "Del en dag du var mest deg selv"

## Tema 2: Trygghet (Dager 6-10)
- Trygghet i å opne seg: "Hva er det vanskelegaste ved å kjenne noen ny?"
- Små steg: "Del en ting du sjeldan fortell"
- Tryggleik: "Hva gjer deg trygg i en samtale?"

## Tema 3: Åpne deg (Dager 11-15)
- Dypere spørsmål: "Hva betyr kjærlighet for deg?"
- Sårlegheit: "Når var du sist sårbare?"
- Overgang til bilder (dag 15)

## Tema 4: Dypere samtaler (Dager 16-21)
- Verdier: "Hva er viktigast for deg i livet?"
- Konflikt: "Kona handterer du uenigheit?"
- Nærhet: "Hva er nærhet for deg?"

## Tema 5: Sårbarhet (Dager 22-26)
- Sårlegheit: "Når var det vanskeleg å stolle på noen?"
- Tillit: "Hva treng du for å stolle på noen?"
- Aksept: "Hva gjer at du kjener deg akseptert?"

## Tema 6: Felles reise (Dager 27-30)
- Felles framtid: "Hva vil du byggje sammen?"
- Refleksjon: "Hva har lært du av denne reisa?"
- Veien framover: "Hva vil du fortsetje med?"
```

</write_to_file>