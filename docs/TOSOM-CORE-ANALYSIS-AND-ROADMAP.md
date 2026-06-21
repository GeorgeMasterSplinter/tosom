# ToSom — Kjerneanalyse og Komplett Roadmap

**Dato:** 2026-06-20  
**Versjon:** 1.0  
**Status:** Analyse + Implementeringsplan  
**Formål:** Analyser tosom-core-definition.md, identifiser gap mot dagens implementering, og lever ein komplett, gjennomførbar plan for å nå definert måltilstand.

---

## INNHOLD

1. [Analyse av kjerekoden (tosom-core-definition.md)](#1-analyse-av-kjerekoden)
2. [Dagens tilstand — Kva som finst i dag](#2-dagens-tilstand)
3. [Gap-analyse — Mål vs. Virkelegheit](#3-gap-analyse)
4. [Roadmap: Frå dagens tilstand til definert måltilstand](#4-roadmap)
5. [Prioritering — Kva som må byggjast først](#5-prioritering)
6. [Oppsummering — Nøkkeltal for implementering](#6-oppsummering)

---

## 1. ANALSE AV KJERKODEN (tosom-core-definition.md)

### 1.1 Kva er ToSom — Definerande eigaskapar

ToSom er **ikkje** ein datingapp. ToSom er ein **relasjonsplattform**. Dette er det avgjerande skiljet.

**Avgjerande trekk:**

| Eigenskap | Definisjon | Prioritet |
|-----------|------------|-----------|
| **Eining** | Plattformen er bygget for TO menneske | Høgast |
| **Privatheit** | Profil som aldri er offentleg | Kritisk |
| **Ein match per 24 timer** | Berre ÉIN match om gongen | Kritisk |
| **Kunnskapsbasert** | Matching basert på djup kunnskap, ikkje foto | Kritisk |
| **30-dagers reise** | Guidet reise mellom to personar | Kritisk |
| **14 dagar utan bilder** | Fase 1 — bygger trygghet | Høg |
| **Ingen swipe** | Aldri, under ingen omstendigheit | Absolutt |
| **Ingen feed** | Ingen uendeleg rullering | Absolutt |
| **Ingen gamification** | Ingen poeng, badges, eller mekanikkar | Absolutt |
| **Rolig og varm tone** | Språk og UX må reflektere dette | Høg |

### 1.2 Dei tre grunnpilarene — Djup analyse

#### Pilare 1: Privat profil

**Kva dokumentet seier:**
- Djup, privat profil som aldri er offentleg
- Berre match-motoren har tilgang
- Inneheld: livssituasjon, verdiar, personlegdom, relasjonsstil, kommunikasjon, framtidønsker, grenser, emosjonelle behov, livsrytme, modenheit

**Kva dette betyr teknisk:**
- Profile må vere **djup** — minst 8-9 steg med faktabasert data
- Profile må vere **privat** — ingen offentlege profil-endepunkt
- Profile-data må vere **maskinlesbar** — match-motoren må kunne analysere kvar enkelt attributt
- Profil må innehalde **relasjonsdata** — ikkje berre "hven er eg" men "kven søkjer eg og korleis"

#### Pilare 2: Kunnskapsbasert matching

**Kva dokumentet seier:**
- Éin match per 24 timer
- Basert på kompatibilitet, verdiar, livssituasjon, emosjonelle mønster, relasjonsstil, kommunikasjon, framtidønsker, modenheit
- Matchen blir låst i 30 dagar etter aksept
- Ingen val mellom fleire, ingen stress, ingen samling

**Kva dette betyr teknisk:**
- Match-motoren må køyre éin gong per dag per brukar (cron/queue)
- Matching-algoritmen må vere **fleirdimensjonal** — vektet kompatibilitet over minst 10 dimensjonar
- Match-systemet må støtte **låsing** — når akseptert, ingen nye matcher til reisa er over
- Match-UIet må vise **berre ÉIN match** — ingen liste, ingen "fleire match"

#### Pilare 3: 30-dagers reise

**Kva dokumentet seier:**
- Fase 1: 14 dagar utan bilder (anbefalt)
- Fase 2: 30 dagar med guiding (spørsmål, tema, oppgåver, resonansmåling, progresjon)
- Tema: introduksjon, trygghet, åpne deg, dypare samtalar, sårbarhet, felles reise
- Etter 30 dagar: fortsetje, avslutte, eller start ny reise

**Kva dette betyr teknisk:**
- Reisestaten må vere **tidsbasert** — kvar dag i 30 dagane har eigne tema og oppgåver
- Guiding-systemet må generere **dagleg innhald** — refleksjonsspørsmål, samtaletema, oppgåver
- Resonansmåling må vere **kontinuerleg** — måle korleis paret "føler" saman over tid
- Bilder må vere **låst i 14 dagar** — deretter valfritt
- Systemet må støtte **reiselivssyklus** — 30 dagar → fortsetje/avslutte/ny

---

### 1.3 Brukarflow — Frå konto til reise

**Steg 1: Opprett konto**
- E-post → magisk lenke → innlogging
- Ingen passord
- Ingen sosiale media-innlogging

**Steg 2: Onboarding (djup profil)**
9 steg:
1. Identitet (fornamn, etternamn, alder, identitetsnamn)
2. Livssituasjon (kvifor er du her, kva type liv lever du)
3. Livsstil (aktivitet, sosialt, økonomi, helg)
4. Personlegdom (energi, kommunikasjon, struktur)
5. Relasjonsstil (kvarleie, gi, treng)
6. Kommunikasjon (korleis snakker du, korleis høyrer du)
7. Intimitet og nærheit (moden — fysisk, emosjonell, tempou)
8. Framtidsønske (kva vil du ha, kva kan du gi)
9. Oppsummering (konfirmering)

**Steg 3: Dashboard**
- Match-status (neste match om X timar)
- Reise-status (kva dag er du i, kva tema)
- Hurtigtilgang (chat, reise, profil)

**Steg 4: Match**
- Éin match per 24 timar
- Berre den beste kompatibiliteten
- Aksept → lås i 30 dagar

**Steg 5: Privat rom (chat)**
- Guiding synleg
- Spørsmål som dukkar opp dagleg
- Refleksjonar du kan dele med partnaren
- Oppgåver som blir tilordna dagleg
- Progresjon synleg

**Steg 6: Reise**
- Daglege tema
- Daglege spørsmål
- Daglege refleksjonar
- Resonansmåling
- Progresjon (visuell, ikkje-gamified)

---

### 1.4 Tone og språk

Alle tekstar må vere:
- Rolige — aldri hastes
- Varme — aldri kalde
- Modne — aldri barnlege
- Trygge — aldri aggressive
- Ikkje pushy — aldri kommanderande
- Ikkje gamified — aldri "du har mista ein dag!"
- Ikkje overflatisk — aldri " finn din soulmate!"

---

## 2. DAGENS TILSTAND — KVA SOM FINST I DAG

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

### 2.2 Kva som finst i dag — Oversikt

#### ✅ Implementert (fungerande)

| Område | Status | Kommentar |
|--------|--------|-----------|
| Landing page | ✅ Eksisterer | `app/(landing)/page.tsx` |
| Innlogging (NextAuth) | ✅ Fungerer | Magisk lenke |
| Admin-panel | ✅ Delvis | Brukarar, konversasjonar, reiser |
| Profile-modell (Prisma) | ✅ Eksisterer | Med mange felt |
| Onboarding (frontend) | ✅ Delvis | Fleire steg eksisterer |
| Match-API (delvis) | ⚠️ Delvis | Finst, men ikje "éin per 24t" |
| Journey-system | ⚠️ Delvis | JourneyStep/JourneyProgress eksisterer |
| Chat (delvis) | ⚠️ Delvis | Meldingar finst, men ikkje guidings-UI |
| Resonansmåling | ✅ Eksisterer | `lib/resonance.ts` |
| Matching-algoritme | ✅ Eksisterer | `lib/matching.ts`, `lib/deepMatch.ts` |
| API-ruter (nye) | ✅ Delvis | `app/api/` har mange ruter |

#### ❌ Manglar eller er ufullstendig

| Område | Status | Kommentar |
|--------|--------|-----------|
| **Éin match per 24t** | ❌ Manglar | Ingen implementasjon |
| **Match-låsing (30 dagar)** | ❌ Manglar | Ingen låsingsmekanisme |
| **14-dags bildeklausur** | ❌ Manglar | Ingen validering |
| **30-dagers guide-innhald** | ❌ Manglar | Ingen dagleg oppgåve-generering |
| **Resonans-UI** | ❌ Manglar | Kun lib, ikkje UI |
| **Djup profil-fullføring** | ❌ Manglar | Onboarding fullfører ikkje |
| **Landing page (rei** | ⚠ | Manglar delar |
| **Fase 1 → Fase 2-overgang** | ❌ Manglar | Ingen tidsbasert overgang |
| **Progresjons-UI (ikkje-gamified)** | ❌ Manglar | |
| **Relasjons-tider** | ❌ Manglar | |
| **Oppgåve-tilordning** | ❌ Manglar | |

---

## 3. GAP-ANALYSE — MÅL vs. VIRKELEGHEIT

### 3.1 Kritiske gap (må løysast umiddelbart)

#### GAP 1: Ingen éin-match-per-24-timer mekanisme

**Dagens tilstand:**
- `app/api/match/route.ts` har ein match-endepunkt
- Ingen dagleg rate limiting på match
- Ingen garanti om "berre den beste"
- Kan gi fleire match samtidig

**Måltilstand:**
- Éin match per brukar per 24 timar
- Den beste kompatibiliteten
- Ingen multiple aktive match

**Gap:** Høg | **Prioritet:** Kritisk

#### GAP 2: Ingen match-låsing

**Dagens tilstand:**
- Ingen mekanisme for å låse match i 30 dagar
- Ingen tilstand for "i reise" vs "tilgjengeleg for match"
- Ingen automatisk slutting etter 30 dagar

**Måltilstand:**
- Match låst i 30 dagar etter aksept
- Ingen nye matcher i perioden
- Automatisk tilstandsovergang etter 30 dagar

**Gap:** Høg | **Prioritet:** Kritisk

#### GAP 3: Ingen bildeklausur i 14 dagar

**Dagens tilstand:**
- Bilder kan lastast opp når som helst
- Ingen låsingsmekanisme for bilder
- Ingen tidsbasert opplåsing

**Måltilstand:**
- Bilder låst dei første 14 dagane
- Automatisk opplåsing etter 14 dagar
- Valfritt å dele etter opplåsing

**Gap:** Medium | **Prioritet:** Høg

#### GAP 4: Ingen guidede dagleg oppgåver

**Dagens tilstand:**
- `lib/journeyTasks.ts` har nokre oppgåver
- Ingen dagleg auto-generering
- Ingen progresjon basert på tema
- `JourneyStep` og `JourneyProgress` eksisterer men er ikkje fullt utnytta

**Måltilstand:**
- Daglege oppgåver basert på reisefase
- Tema-basert innhald (6 tema definert)
- Daglege refleksjonsspørsmål
- Resonansmåling kvar dag

**Gap:** Høg | **Prioritet:** Kritisk

### 3.2 Moderate gap (viktige, men ikkje kritiske)

#### GAP 5: Landing page manglar definert struktur

**Dagens tilstand:**
- Landing page eksisterer
- Manglar den definerte strukturen (A, B, C)

**Måltilstand:**
- A: Kva er ToSom
- B: Korleis fungerer det (8 steg)
- C: Kvifor ToSom (6 punkter)

**Gap:** Medium | **Prioritet:** Medium

#### GAP 6: Onboarding manglar djup profil

**Dagens tilstand:**
- Onboarding har fleire steg
- Manglar nokre av dei djupe dimensjonane
- Fullfører ikkje automatisk `deepProfileComplete`

**Måltilstand:**
- 9-stegs onboarding
- Alle djupe felt fylt
- Automatisk fullføring av `deepProfileComplete`

**Gap:** Medium | **Prioritet:** Høg

#### GAP 7: Dashboard manglar reise-status

**Dagens tilstand:**
- Dashboard viser nokre match-info
- Manglar reise-progresjon
- Manglar neste match-tidspunkt

**Måltilstand:**
- Match-status (neste match om X timar)
- Reise-status (kva dag, kva tema)
- Hurtigtilgang til chat og reise

**Gap:** Medium | **Prioritet:** Høg

#### GAP 8: Ingen tidsbasert Fase 1 → Fase 2-overgang

**Dagens tilstand:**
- Ingen fase-indikator
- Ingen tidsbasert overgang

**Måltilstand:**
- Fase 1: Dagar 1-14, ingen bilder
- Fase 2: Dagar 15-30, bilder valfrie
- Synleg fase-indikator

**Gap:** Medium | **Prioritet:** Høg

### 3.3 Lett gap (kan løysast seinare)

#### GAP 9: UI manglar ToSom-tone

**Dagens tilstand:**
- Nokre tekstar er på engelsk
- Nokre komponentar har "dating-app" känsla
- Gamle komponentar er ikkje oppdaterte

**Måltilstand:**
- Alle tekstar på ToSom-tons (norsk, roleg, varm)
- Ingen dating-app-komponentar
- Hele UIet følger Nordic Gold Premium

**Gap:** Low | **Prioritet:** Medium

#### GAP 10: Administrative verkty manglar funksjonar

**Dagens tilstand:**
- Admin-panel har basis funksjonalitet
- Manglar reise-guidering
- Manglar match-kontroll

**Måltilstand:**
- Full admin-kontroll over reiser
- Manual match-oppdatering
- Brukar-innsyn i full profil

**Gap:** Low | **Prioritet:** Medium

---

## 4. ROADMAP — FRA DAGENS TILSTAND TIL DEFINERT MÅL TILSTAND

### Fase 0: Fundament (Veke 1-2)

**Mål:** Sikre at grunndata-modellen støtter kjernefilosofien

#### Blokk 0.1: Database-skjema oppdatering

```
Mål: Oppdater Prisma-skjema for å støttéin match, låsing, og bildeklausur
```

| Oppgåve | Beskriving | Est. tid |
|---------|------------|----------|
| Legg til `matchLockUntil` på User | Datumsfelt som låser nye match | 30 min |
| Legg til `chatUntilImage` på Conversation | Datumsfelt for bilde-opplåsing | 15 min |
| Legg til `isActive` på Match | Indikator for aktiv reise | 15 min |
| Oppdater JourneyStep med tema | Legg til tema-felt for dagleg innhald | 30 min |
| Oppdater JourneyProgress med fase | Legg til fase-indikator | 15 min |
| Opprett migration | `prisma migrate dev` | 30 min |

**Total tid:** ~2 timar

#### Blokk 0.2: Match-motor oppdatering

```
Mål: Støtte "éin match per 24t"
```

| Oppgåve | Beskriving | Est. tid |
|---------|------------|----------|
| Lag `lib/oneMatchPerDay.ts` | Sjekk om brukar kan få ny match | 1 time |
| Lag `lib/findBestMatch.ts` | Finn beste kompatibilitet, ikkje alle | 2 timar |
| Lag `lib/lockMatch.ts` | Lås match i 30 dagar | 1 time |
| Lag `lib/unlockMatch.ts` | Lås opp etter 30 dagar | 30 min |
| Oppdater `app/api/match/route.ts` | Bruk nye funksjonar | 1 time |

**Total tid:** ~5 timar

---

### Fase 1: Kjernefunksjonar (Veke 2-4)

**Mål:** Bygge dei tre grunnpilarene

#### Blokk 1.1: Privat profil-system

```
Mål: Sikre at profiler aldri er offentlege og at onboarding fullfører djup profil
```

| Oppgåve | Beskriving | Est. tid |
|---------|------------|----------|
| Fjern offentlege profil-endepunkt | Ingen `GET /profile/[id]` utan auth | 30 min |
| Oppdater `getProfileById` | Berre tilgjengeleg for partnar | 30 min |
| Oppdater onboarding-complete | Set `deepProfileComplete: true` automatisk | 30 min |
| Valider onboarding-steg | Kreav minst alle obligatoriske felt | 1 time |

**Total tid:** ~2.5 timar

#### Blokk 1.2: Match-låsing og bildeklausur

```
Mål: Implementere 30-dagers låsing og 14-dagers bildeklausur
```

| Oppgåve | Beskriving | Est. tid |
|---------|------------|----------|
| Lag `lib/checkMatchLock.ts` | Sjekk om brukar er låst | 30 min |
| Lag `lib/checkImageUnlock.ts` | Sjekk om bilder er opplåst | 30 min |
| Oppdater chat-medie-opplastning | Blokker bilder før dag 14 | 1 time |
| Oppdater chat-UI | Vis melding "Bilder låst til dag X" | 30 min |
| Oppdater match-UI | Vis "Reise pågauge" istedenfor "Søk ny" | 1 time |

**Total tid:** ~3.5 timar

#### Blokk 1.3: Guidet 30-dagers reise

```
Mål: Bygge dagleg guide-system med tema og oppgåver
```

| Oppgåve | Beskriving | Est. tid |
|---------|------------|----------|
| Lag `lib/journey/themes.ts` | 6 tema med dagleg innhald (180 oppgåver totalt) | 4 timar |
| Lag `lib/journey/getDailyTask.ts` | Hent dagens oppgåve basert på dag i reisa | 1 time |
| Lag `lib/journey/getDailyQuestion.ts` | Hent dagleg refleksjonsspørsmål | 1 time |
| Lag `lib/journey/getDailyInsight.ts` | Hent dagleg innsikt | 1 time |
| Oppdater Journey UI | Vis dagleg oppgåve, spørsmål, innsikt | 3 timar |
| Lag `lib/journey/resonanceDaily.ts` | Dagleg resonansmåling | 1 time |
| Oppdater progresjons-UI | Ikkje-gamified, visuell progresjonsindikator | 2 timar |

**Total tid:** ~13 timar

---

### Fase 2: Brukaroppleving (Veke 4-6)

**Mål:** Hele brukarflowet frå start til reise

#### Blokk 2.1: Oppdatert landing page

```
Mål: Landing page som følgjer definert struktur (A, B, C)
```

| Oppgåve | Beskriving | Est. tid |
|---------|------------|----------|
| Seksjon A: Kva er ToSom | Kort, varmt, roleg introduksjon | 2 timar |
| Seksjon B: Korleis fungerer det | 8-stegs forklaring | 3 timar |
| Seksjon C: Kvifor ToSom | 6 kontraster (ingen swipe, osv.) | 2 timar |
| Footer: Språk og juridisk | | 1 timar |

**Total tid:** ~8 timar

#### Blokk 2.2: Oppdatert onboarding

```
Mål: 9-stegs djup profil-onboarding
```

| Oppgåve | Beskriving | Est. tid |
|---------|------------|----------|
| Oppdater onboarding steg | Alle 9 steg i definert rekkefølge | 4 timar |
| Oppdater progresjons-indikator | Ro, ikkje-gamified | 1 timar |
| Oppdater samandst-side | Vis samandst av utfylte felt | 1 timar |
| Test full onboarding-flow | Frå start til deepProfileComplete | 1 timar |

**Total tid:** ~7 timar

#### Blokk 2.3: Oppdatert dashboard

```
Mål: Dashboard med match-status, reise-status, og hurtigtilgang
```

| Oppgåve | Beskriving | Est. tid |
|---------|------------|----------|
| Match-status-banner | Neste match om X timar eller "I reise" | 2 timar |
| Reise-status-panel | Kva dag, kva tema, progresjon | 2 timar |
| Hurtigtilgangsmeny | Chat, reise, profil | 1 timar |
| Resonans-oversikt | Dagleg resonans (sist 7 dagar) | 2 timar |

**Total tid:** ~7 timar

#### Blokk 2.4: Oppdatert chat og privat rom

```
Mål: Chat med guiding, spørsmål, og oppgåver
```

| Oppgåve | Beskriving | Est. tid |
|---------|------------|----------|
| Oppdater chat-UI | Vis dagleg guidings-innhald | 2 timar |
| Legg til spørsmåls-kort | Dagleg refleksjonsspørsmål over chatten | 1 timar |
| Legg til oppgåve-kort | Dagleg oppgåve med "utført" knapp | 1 timar |
| Legg til resonans-indikator | Vismellinger | 1 timar |
| Test heile flows | | 1 timar |

**Total tid:** ~6 timar

---

### Fase 3: Sikkerheit og kvalitet (Veke 6-7)

**Mål:** Sikker, roleg, og moden opplevelse

#### Blokk 3.1: Sikkerheit og tilgjengekontroll

```
Mål: Sikre at inga profil-data lekkjer og at match-låsing er robust
```

| Oppgåve | Beskriving | Est. tid |
|---------|------------|----------|
| Audit alle profil-endepunkt | Ingen offentleg tilgang | 1 timar |
| Test match-låsing | Verifiser ingen nye matcher under reise | 1 timar |
| Test bildeklausur | Verifiser bilder ikkje synlege før dag 14 | 1 timar |
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
Mål: Hele flowet frå start til reise
```

| Oppgåve | Beskriving | Est. tid |
|---------|------------|----------|
| Test onboarding → match → reise | Hele flowet | 2 timar |
| Test match-låsing | Ingen nye matcher under reise | 1 timar |
| Test bildeklausur | Bilder låst 14 dagar, opplåst etter | 1 timar |
| Test dagleg guiding | Kvar dag i 30 dagar (simulert) | 2 timar |
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

## 5. PRIORITERING — KVA SOM MÅ BUILDST FØRST

### Prioriteringsmatrise

| Prioritet | Område | Kvifor |
|-----------|--------|--------|
| **P0** | Match-låsing (30 dagar) | Uten dette kan fleire match vere aktive samtidig |
| **P0** | Éin match per 24t | Kritisk for kjernefilosofi |
| **P0** | Dagleg guide-innhald | Uten dette har reisa inga导向 |
| **P1** | Bildeklausur (14 dagar) | Kritisk for trygghet |
| **P1** | Djup profil-onboarding | Uten djup profil, ingen kunnskapsbasert matching |
| **P1** | Dashboard med reise-status | Uten dette veit ikkje brukaren kva som skjer |
| **P2** | Oppdatert landing page | Viktig for korrekt positioning |
| **P2** | Chat med guiding | Viktig for reiseoppleving |
| **P2** | Tone og språk-audit | Viktig for merkeny |
| **P3** | Design-system oppdatering | Viktig, men kan gjerast parallel |
| **P3** | Administrativ verkty | Viktig, men ikkje bruker-critical |

### Rekkefølge — Kva skal byggast først

**Rekkefølje 1: Match-system (Veke 1-2)**
1. Database-skjema oppdatering
2. Éin-match-per-24t
3. Match-låsing (30 dagar)
4. Test match-flow

**Rekkefølje 2: Guide-system (Veke 2-3)**
5. Tema og oppgåver (6 tema, 180 oppgåver)
6. Dagleg innhald-generering
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
| **Kritiske gap** | 4 | Match-låsing, éin match, guide-innhald, djup profil |
| **Moderate gap** | 4 | Landing page, onboarding, dashboard, fase-overgang |
| **Lette gap** | 2 | Tone, admin |
| **Database-endringar** | 4-5 felt | matchLockUntil, chatUntilImage, isActive, tema, fase |
| **Nye API-ruter** | 6-8 | Match-låsing, guide, resonans, bildeklausur |
| **Oppdaterte API-ruter** | 4-5 | Match, onboarding, profile, journey |
| **Nye komponentar** | 5-7 | Reise-status, guidede oppgåver, resonans-UI |
| **Oppdaterte komponentar** | 8-10 | Dashboard, chat, onboarding, match |
| **Test scenario** | 10 | Frå start til måltilstand |

### Det viktigaste å hugse

1. **ToSom er ikkje ein datingapp** — alt må reflektere dette
2. **Éin match per 24t er ikkje valfritt** — det er kjernefilosofien
3. **Match-låsing er ikkje valfritt** — utan dette brot kjernefilosofien
4. **Djup profil er ikkje valfritt** — utan djup profil, ingen kunnskapsbasert matching
5. **30-dagers reise er ikkje valfritt** — utan reise, ingen ToSom
6. **14-dagers bildeklausur er ikkje valfritt** — utan det, brot trygghet

### Oppsummerande uttale

> ToSom er ein roleg, privat, kunnskapsbasert relasjonsplattform for to menneske.
> All utvikling må støtte denne definisjonen.
> Ingen swipe. Ingen feed. Ingen gamification. Ingen uendelege valg.
> Berre to menneske som møtest i ro.

---

**SLUTT PÅ DOKUMENT**

---

# Vedlegg A: Database-endringar

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
  dayNumber         Int?                            // Kva dag i reisa (1-30)
}
```

---

# Vedlegg B: Kritiske API-endepunkt

## Ny API-ruter

```
POST /api/match/findBest       — Finn beste match (én), ikkje alle
POST /api/match/accept          — Aksepter match → lås i 30 dagar
POST /api/match/unlock          — Lås opp match etter 30 dagar
GET  /api/match/checkLock       — Sjekk om brukar er låst
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
GET  /api/profile/[id]          — Berre tilgjengeleg for partnar
POST /api/chat/upload-image     — Blokker before dag 14
```

---

# Vedlegg C: Komplett brukar-flow (måltilstand)

```
1. Bruker opnar tosom.no
   → Landing page (A: Kva er ToSom, B: Korleis, C: Kvifor)

2. Bruker klikkar "Kom i gang"
   → Magisk lenke til innlogging

3. Bruker logger inn
   → Dersom ny: onboarding (9 steg)
   → Dersom eksisterande: dashboard

4. Onboarding (9 steg)
   → Identitet → Livssituasjon → Livsstil → Personlegdom
   → Relasjonsstil → Kommunikasjon → Intimitet → Framtidsønske → Oppsummering
   → deepProfileComplete = true

5. Dashboard
   → "Neste match om 12 timar"
   → Ingen aktive reiser

6. Match kjører (automatisk, dagleg)
   → Finn beste kompatibilitet
   → Berre ÉIN match

7. Brukar får notifikasjon
   → "Du har ein match" (rolig, ikkje pushy)

8. Brukar aksepterer match
   → Reise startar (30 dagar)
   → Match låst i 30 dagar
   → Bilder låst i 14 dagar
   → Fase 1 startar

9. Kvar dag i 30 dagar:
   → Ny oppgåve
   → Ny refleksjonsspørsmål
   → Ny innsikt
   → Resonansmåling
   → Progresjon oppdatert

10. Dag 15:
    → Bilder blir tilgjengelege
    → Brukar kan velje å dele

11. Dag 30:
    → Reise kan avsluttast
    → Eller fortsetje
    → Eller start ny reise med ny match
```

---

# Vedlegg D: 6 Reisetem — Full oversikt

## Tema 1: Introduksjon (Dagar 1-5)
- Kjenne kjennskap: "Hvem er du når du er din best du?"
- Trygg framstilling: "Kva gjer deg spesielt?"
- Liten utfordring: "Del ein dag du var mest deg sjølv"

## Tema 2: Trygghet (Dagar 6-10)
- Trygghet i å opne seg: "Kva er det vanskelegaste ved å kjenne nokon ny?"
- Små steg: "Del ein ting du sjeldan fortel"
- Tryggleik: "Kva gjer deg trygg i ein samtale?"

## Tema 3: Åpne deg (Dagar 11-15)
- Djupare spørsmål: "Kva betyr kjærleik for deg?"
- Sårlegheit: "Når var du sist sårbare?"
- Overgang til bilder (dag 15)

## Tema 4: Dypare samtalar (Dagar 16-21)
- Verdier: "Kva er viktigast for deg i livet?"
- Konflikt: "Kona handterer du uenigheit?"
- Nærhet: "Kva er nærhet for deg?"

## Tema 5: Sårbarhet (Dagar 22-26)
- Sårlegheit: "Når var det vanskeleg å stolle på nokon?"
- Tillit: "Kva treng du for å stolle på nokon?"
- Aksept: "Kva gjer at du kjener deg akseptert?"

## Tema 6: Felles reise (Dagar 27-30)
- Felles framtid: "Kva vil du byggje saman?"
- Refleksjon: "Kva har lært du av denne reisa?"
- Veien framover: "Kva vil du fortsetje med?"
```

</write_to_file>