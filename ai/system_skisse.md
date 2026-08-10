# TOSOM — PLATTFORMSKISSE (Masterdokument) 🟡⭐

**Versjon:** 1.0 · **Dato:** 8. august 2026  
**Status:** Permanent referanse for ToSom-plattformen

---

## 1. PLATTFORMOVERSIKT

### Konsept
ToSom er en rolig, moden og forskningsbasert relasjonsplattform for voksne (23+). Plattformen hjelper to mennesker å møtes på en trygg, strukturert måte — uten støy, uten jag, uten overflate.

### Kjerneverdier
- Privat · Forskningsbasert · Moden · Rolig · High-tech · Premium
- Ingen støy · Ingen press · Ingen swipe

### Lover
- Én god match — ikke mange dårlige
- En trygg, moden og rolig opplevelse
- En dyp, veiledet profil (13 steg)
- En 30-dagers reise som hjelper deg
- Null stress, null jag, null overfladiskhet

### Språkregel
**All tekst rettet mot brukere skal være på norsk bokmål.**  
Ingen nynorsk. Ingen slang. Ingen teknisk språk mot bruker.

---

## 2. SIDEKART — Alle URL-ruter

### Offentlige sider
| Rute | Navn | Formål |
|------|------|--------|
| `/` | Landing | Første inntrykk, "Bygg forhold", CTA til Register/Login |
| `/login` | Logg inn | Vipps OAuth for eksisterende brukere |
| `/register` | Registrer | Ny bruker, Vipps OAuth |
| `/slik-fungerer-det` | Slik fungerer det | Plattform-forklaring (30 dager, én match, etc.) |
| `/priser` | Priser | Abonnementsinformasjon |
| `/om-oss` | Om oss | ToSom-historikk og team |
| `/personvern` | Personvernerklæring | GDPR-info |
| `/vilkår` | Vilkår | Brukervilkår |
| `/kontakt` | Kontakt | Support |

### Autentiserte sider (må være logget inn)
| Rute | Navn | Formål |
|------|------|--------|
| `/onboarding/start` | Onboarding-start | Redirect → steg 1 eller dashboard avhengig av state |
| `/onboarding/[step]` | Onboarding (1-13 steg) | Bygg dyp profil |
| `/dashboard` | Din oversikt | Sentral hub — vis match, reise, handlinger |
| `/chat` | Chat-oversikt | Liste over aktive samtaler |
| `/chat/[id]` | Chat-rom | Aktiv chat med partner |
| `/profile` | Min profil | Se egen profil (visning) |
| `/profile/edit` | Rediger profil | Endre profil (låst dag 1-29) |
| `/reisen/avslutning` | Avslutning | Dag 30 valg: Ja til tosommhet / Start ny reise |
| `/settings` | Innstillinger | Konto, personvern, varsler |

---

## 3. USER FLOW — State Machine (6 tilstander)

### Tilstandsdiagram

```
┌──────────────┐     ┌──────────────────┐     ┌─────────────┐     ┌──────────────┐
│  ONBOARDING  │────▶│ WAITING_FOR_MATCH│────▶│ACTIVE_JOURNEY│────▶│DAY_30_CHOICE │
│ "Bygg meg"   │     │  "≤24 timer"     │     │  Dag 1-29    │     │ Ja? Nei?      │
└──────────────┘     └──────────────────┘     └─────────────┘     └──────┬───────┘
                                                                          │
                                                                 ┌────────┴────────┐
                                                             "Ja"                  "Nei"
                                                          ┌─────────┐      ┌──────────────┐
                                                          │COMPLETE │      │  LOOP_BACK   │
                                                          │  SLUTT  │      │ "Ny reise"    │
                                                          └─────────┘      └──────┬───────┘
                                                                                   │
                                                                            ┌──────▼────────┐
                                                                            │ONBOARDING eller│
                                                                            │WAITING_FOR_    │
                                                                            │   MATCH       │
                                                                            └───────────────┘
```

### Permissions per tilstand

| State | Onboarding | Profil-redigering | Dashboard | Chat | Reise/avslutning |
|-------|-----------|-------------------|-----------|------|------------------|
| **ONBOARDING** | ✅ Åpen | ❌ N/A | 🔒 Låst | 🔒 Låst | 🔒 Låst |
| **WAITING_FOR_MATCH** | 🔒 Låst | 🔒 Låst | ✅ "Vent" side | 🔒 Låst | 🔒 Låst |
| **ACTIVE_JOURNEY** (dag 1-29) | 🔒 Låst | 🔒 Låst | ✅ Åpen | ✅ Åpen | ✅ Åpen |
| **DAY_30_CHOICE** | 🔒 Låst | 🔒 Låst | ✅ "Valg" side | ❌ Slettes snart | ✅ Ja/Nei |
| **JOURNEY_COMPLETE** ("Ja") | ❌ N/A | ❌ N/A | ✅ Rolig avskjed | ❌ Slettet | ❌ Ferdig |
| **LOOP_BACK** ("Nei → Ny reise") | ✅ Åpen | ✅ Via onboarding | ✅ "Vent" | 🔒 Låst | 🔒 Låst |

### Hvordan state avgjøres (`lib/user-state.ts`)
1. Er `User.onboardingComplete = false`? → **ONBOARDING**
2. Har bruker aktiv match (`Match.status = 'ACTIVE'`)?
   - Ja + `Journey.currentDay < 30` → **ACTIVE_JOURNEY**
   - Ja + `Journey.currentDay >= 30` + ikke fullført → **DAY_30_CHOICE**
   - Ja + `Journey.completedAt` satt → **JOURNEY_COMPLETE**
   - Nei → **WAITING_FOR_MATCH** eller **LOOP_BACK**

---

## 4. HOVEDLOOP — Fra start til slutt (eller ny start)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        TOSOM HOOPLØP                                    │
└─────────────────────────────────────────────────────────────────────────┘

1. LANDING (/)
   ├── Første gang? → REGISTRER (Vipps OAuth)
   └── Allerede medlem? → LOGG INN (Vipps OAuth)

2. ONBOARDING ("Bygg meg")
   ├── 13 steg: Identitet → Livssituasjon → Personlighet → Tilknytning →
   │   Kjærlighetsspråk → Livsstil/Verdier → Relasjonsstil → Framtidsvisjon →
   │   Humor/Personlighet → Grenser → Moden nysgjerrighet → Oppsummering → Start reisen
   ├── Lagrer som `Profile` i database (JSON for dyp profil)
   └── "Start reisen" → User.onboardingComplete = true

3. VENTER PÅ MATCH ("≤24 timer")
   ├── Dashboard viser: "Din match er på vei, [navn] 💛"
   ├── Pulsring-animasjon + nedtelling
   ├── Alt låst: Onboarding 🔒 Profil 🔒 Chat 🔒
   └── Matching-motor kører i bakgrunnen

4. AKTIV REISE (Dag 1-29)
   ├── DASHBOARD ("Din oversikt"):
   │   ├── Handlinger: "Gå til samtalen" / "Innstillinger"
   │   ├── Profil + Partner-kort
   │   ├── Journey-progresjon (dag-N/30)
   │   └── "Avslutt reisen" knapp (rød)
   ├── CHAT:
   │   ├── ChatHeader: Partner-navn, dag-teller, "Bli kjent"-knapp
   │   ├── Mood-selector: 5 farger (🌊☀️🔮🌿✨), valgfri
   │   ├── Meldingsbobler med animasjon
   │   ├── "Bli kjent" panel: 12 kategorier × ~20 spørsmål = 240+ spørsmål
   │   └── Bilder låst til dag 15
   ├── REISE (i Dashboard):
   │   ├── Daglig tema + refleksjonsprompt (frivillig)
   │   ├── Kalender/tidslinje
   │   └── Progresjonsbar (0-30%)
   ├── PROFIL: Kun visning, 🔒 redigering låst
   └── DAG 15: Bilder åpnes (ImageShareLockBanner)

5. DAG 30 — AVLUTNING ("/reisen/avslutning")
   │ "Reisen din er fullført 🎉"
   │ "30 dagene har gått. Hva vil du gjøre nå?"
   ├── Valg 1: "Ja til tosommhet 💛"
   │   → Chat slettes via POST /api/journey/reset?choice=complete
   │   → Match.status = 'COMPLETED'
   │   → Journey.completedAt = now()
   │   → Dashboard viser: Rolig avskjed, "Lykke til! 🤍"
   │   → SLUTT
   └── Valg 2: "Start ny reise 🔄"
       → Chat slettes via POST /api/journey/reset?choice=loop_back
       → Match.status = 'COMPLETED'
       → User.onboardingComplete = false (åpner onboarding)
       → Redirect til /onboarding/start
       └── ↺ LOOP TILBAKE TIL STEG 2/3

┌─────────────────────────────────────────────────────────────────────────┐
│                       ◀──── LOOP ↺ ────▶                                │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 5. SIDE-DETALJER — Hva som står på hver side

### LANDING (`/`)
- Hero: "Bygg forhold" eller liknende hovedmelding
- CTA-knapper: "Registrer deg" → `/register`, "Allerede medlem?" → `/login`
- Verdi-proposisjon: Én match, 30 dager, trygg og rolig

### REGISTRER (`/register`)
- Vipps OAuth som eneste login-metode
- Ingen telefonverifikasjon (kjørt via Vipps)
- Redirect til `/onboarding/start` etter registrering

### LOGG INN (`/login`)
- Vipps OAuth
- Sjekk User State → redirect riktig side basert på state

### ONBOARDING (`/onboarding/[step]`)
**13 steg:**
1. Identitet (navn, alder, foto)
2. Livssituasjon
3. Personlighet
4. Tilknytning
5. Kjærlighetsspråk
6. Livsstil og verdier
7. Relasjonsstil
8. Framtidsvisjon
9. Humor og personlighet
10. Grenser
11. Moden nysgjerrighet
12. Oppsummering
13. Start reisen (CTA → setter `onboardingComplete = true`)

### DASHBOARD (`/dashboard`) — "Din oversikt"
**Header:** Hilsen + navn ("God morgen, Astrid")
**Når WAITING_FOR_MATCH:** WaitingForMatch-komponent med pulsring
**Når ACTIVE_JOURNEY:**
- Handlinger-grid: "Gå til samtalen" / "Innstillinger"
- Profil-kort: Navn, "Profil fullført ✓"
- Partner-kort: Navn, "Dag X av 30"
- ProfileLockBanner (dag 1-29)
- Journey-seksjon: TodayCard, JourneyTimeline, Progresjonsbar
- "Avslutt reisen" knapp (rød, med bekreftelsesmodal)

### CHAT-OVERSIKT (`/chat`)
**Med samtaler:**
- Header: "DINE SAMTALES · Chat"
- Liste over aktive samtaler med: Avatar, navn, dag-teller, mood-emoji, siste melding, unread-badge
**Uten samtaler:**
- Empty state: "Ingen aktive samtaler" + "Gå til oversikt"-knapp

### CHAT-ROM (`/chat/[id]`)
**Header:** `ChatHeader` med partner-avatar, navn, dag-teller, "Bli kjent"-knapp
**Mood-selector:** 5 alternativer (🌊☀️🔮🌿✨), valgfri knapp per bruker
**Meldinger:** `MessageBubble` komponenter med animasjon
**"Bli kjent":** Panel med 12 kategorier, velg → velg spørsmål → send i chat
**Input:** Tekstfelt + bilde-knapp (dag ≥ 15) + send-knapp

### MIN PROFIL (`/profile`)
- Foto/avatar med fase-farge border
- Identitetsnavn + fase-badge ("Introduksjon · Dag X/30")
- Varme-score (%)
- Profil-tags (gull-stil)
- ProfileSecurityCard (lås-ikon, "Profilen din er privat")
- Navigasjon: "Journey Dashboard" / "Til Chat"

### REDIGER PROFIL (`/profile/edit`)
**Når ACTIVE_JOURNEY (dag 1-29):** Låse-banner med 🔒 + "← Tilbake til profil"
**Når ÅPEN:** Full redigeringsformular med alle onboarding-felter

### AVLUTNING (`/reisen/avslutning`)
- H1: "Reisen din er fullført 🎉"
- Tekst: "30 dagene har gått. Hva vil du gjøre nå?"
- Valg 1: "Ja til tosommhet 💛" — "Dere fant hverandre. Møtes utenom ToSom, og lykke til! 🤍"
- Valg 2: "Start ny reise 🔄" — "Ble ikke match. Prøv igjen med ny partner."
- Begge valger sletter chat via API

---

## 6. API-RUTER

### `POST /api/journey/reset`
**Formål:** Slett chat og fullfør/restart journey ved dag 30
**Body:** `{ "choice": "complete" | "loop_back" }`
**Gjør:**
1. Finn aktiv match for bruker
2. Slett alle meldinger i konversasjonen
3. Slett konversasjonen
4. Set `Match.status = 'COMPLETED'`
5. Set `Journey.completedAt = now()`
6. Hvis `loop_back`: Set `User.onboardingComplete = false`
**Svar:** `{ "success": true, "redirect": "/dashboard?journey=complete" | "/onboarding/start" }`

### `GET /api/journey/status`
**Formål:** Hent nåværende journey-status (dag, faser, fullført?)
**Svar:** `{ "success": true, "data": { "day": N, "completedAt": null|date, ... } }`

### `GET /api/chat/conversations`
**Formål:** Liste over aktive samtaler for chat-oversikt
**Svar:** Array med `{ id, partnerName, partnerAge, journeyDay, mood, unreadCount, lastMessage }`

### `GET /api/questions?categoryId=[id]`
**Formål:** Hent guidede spørsmål per kategori ("Bli kjent")
**Svar:** `{ "success": true, "categories": [...] | "questions": [...] }`

### `PATCH /api/presence/update`
**Formål:** Oppdater presence-status (online/typing)
**Body:** `{ "isTyping": boolean }`

---

## 7. DATABASE-MODELLER (Kort)

| Modell | Viktigste felter |
|--------|-----------------|
| **User** | id, email, name, password, onboardingStep, onboardingComplete, deepProfileComplete |
| **Profile** | userId (1:1), firstName, lastName, age, bio, interests[], lifeSituation(JSON), personality(JSON), relationshipStyle(JSON), communication(JSON), intimacy(JSON), futureVision(JSON), boundaries(JSON), deepProfileData(JSON) |
| **Match** | id, userIdA, userIdB, status (ACTIVE/COMPLETED/PENDING), score |
| **Journey** | userId, currentDay (1-30), completedAt (null = pågår), phase |
| **Conversation** | id, matchId, created_at |
| **Message** | id, conversationId, senderId, content, type (text/image), created_at |
| **QuestionCategory** | id, name, color, description, order |
| **GuidedQuestion** | id, categoryId, content, depthLevel (1-3), order |

---

## 8. DESIGN TOKENS

### Farger
```
ToSom Blue:    #0A1A2A / #0B1520 (bakgrunn)
Nordic Gold:   #D4AF37 (primary)
Gold Light:    #E8C766
Blue Chat:     #0F1A26
Text Primary:  rgba(255,255,255,0.95)
Text Secondary:rgba(255,255,255,0.6)
Text Muted:    rgba(255,255,255,0.4)
```

### Komponent-stil
- **Buttons:** Gull-gradient, radius 12px, font-weight 600
- **Cards:** Glassmorphism (backdrop-filter: blur), radius 20px
- **Inputs:** Glass-bg, gull-focus border
- **Chat-bobler:** Gradient basert på mood, max-width 85%

### Typografi
- Font: Inter
- H1: 36px font-light
- H2: 24px font-semibold
- Body: 15px leading-relaxed
- Small: 12px

### Mood-farger (5 alternativer)
| Mood | Emoji | Gradient |
|------|-------|----------|
| Calm | 🌊 | blå |
| Warm | ☀️ | gull |
| Deep | 🔮 | fiolett |
| Gentle | 🌿 | grønn |
| Joyful | ✨ | oransje |

---

## 9. REGLER

### Låse-logikk
- Under ONBOARDING: Alt annet låst
- WAITING_FOR_MATCH: Onboarding 🔒 Profil 🔒 Chat 🔒 — kun Dashboard "Vent"
- ACTIVE_JOURNEY (dag 1-29): Onboarding 🔒 Profil-redigering 🔒 — Chat ✅ Reise ✅
- DAY_30: Avslutning vises, chat slettes etter valg
- LOOP_BACK: Onboarding åpnes igjen

### Språkmanual
- Bokmål alltid
- Varmt, modent, trygt, klart
- Korte setninger, aktiv form, direkte tiltale
- Ingen slang, ingen nynorsk, ingen teknisk språk mot bruker
- Tone per kontekst: Onboarding (varm), Journey (rolig), Chat (naturlig), Admin (nøytral)

### Forbudt
- ❌ AI-chat / AI-coach / AI-partner
- ❌ Feed / Swipe / Gamification
- ❌ Resonans-score etter matching
- ❌ Telefonverifikasjon (kun Vipps OAuth)
- ❌ Se andres profiler (`/profile/[id]`)

### Tillatt
- ✅ Én match per 24 timer
- ✅ Guided spørsmål ("Bli kjent" — 12 kategorier × ~20 spørsmål)
- ✅ Valgfri mood-farger i chat (5 alternativer)
- ✅ Bilder fra dag 15
- ✅ Refleksjonsprompts (frivillige, i journey)

---

## SLUTT PÅ SYSTEMSKISSE

*Dette dokumentet er permanent referanse. Oppdater det når plattformen endres.*