# ToSom — Konsept V2 (Forenkla og Fokusert)

**Dato:** 2026-08-05
**Versjon:** 2.0 (Skisse — under diskusjon)

---

## Hva er ToSom

ToSom er ein roleg, privat og kunnskapsbasert relasjonsplattform for vaksne som ønskjer ekte forbindelse. Ingen swipe. Opne profiler. Ingen jag. Ingen overflatefokus. Berre to menneske som møtest på ein trygg, moden måte.

Plattformen bygger på tre grunnpilar:
1. Privat profil
2. Kunnskapsbasert matching
3. Ein guidet 30-dagers reise mellom to personar

---

## Full User-Loop — Fra Start til Slutt

### STEG 1: Opprett konto (2 sekund)
- **Vipps OAuth-login** (einaste metode)
- Ingen passord, ingen komplisert setup
- Når platformen er klar for lansering → første 5000 brukarar får gratis innlogging
- Deretter Vipps betaling (349 NOK per periode)

### STEG 2: Dyp profilbygging (~15 minutt)
Brukar fyller ut ~75 felt i 13 steg (alt privat, ingen andre ser profilen):
Identitet → Livssituasjon → Personlighet → Tilknytning → Kjærlighetsspråk → Livsstil+Verdier → Framtidsvisjon → Humor → Grenser → Modenhet → Oppsummering

### STEG 3: Vent på match (≤24 timar)
- **Éin match per 24 timar** — den beste basert på profil-data
- Ingen valg, ingen swipe, ingen liste
- Ved aksept → **låst i 30 dager**, ingen nye matcher

### STEG 4: Privat chat-rom (30 dagar)
- Åpen fri chat mellom to personar
- Mood-farger (ChatMoodBadge) — finnest allereie!
- Blikjent-spørsmål som tips når samtalen er stille >10 min (finntst allereie!)
- Ingen AI-svar, ingen GuidedQuestions-tvinging, ingen resonansmåling

### STEG 5: Journey — Daglege tema (30 dagar)
- Dagleg tema + refleksjonsprompt (FRIVILLIG, ikkje pliktige svar)
- Milepæler som feiringer (dag 3/7/10/14/21/28/30), ikkje obligatoriske oppgåver
- Bilder tillat frå dag 15

### STEG 6: Etter 30 dagar
- Paret kan velje å fortsetje eller avslutte
- Frivillig avslutning, ingen tvang
- Ved ønske om ny match → tilbake til steg 3

---

## Funksjoner vi BEHOLDER (eksisterer allereie)

| Funksjon | Fil/sted | Status |
|----------|---------|--------|
| **Vipps OAuth** | `app/api/auth/vipps/*` (authorize + callback) | ✅ Bruk som login og betaling |
| **Mood-farger** | `components/ui/moodTag.tsx` (ChatMoodBadge, MoodGrid, MoodHistory) | ✅ Bruk som den er — endre ikkje! |
| **GuidedQuestions/Blikjent-spørsmål** | `scripts/seed-questions.ts` (150 spørsmål, 10 kategorier) + API-ruter | ✅ Vis som stil-tips når samtalen er stille — bruk som den er! |
| **Match-motor** | `lib/matching/unifiedScorer.ts` (9 dimensjoner, éin motor) | ✅ Fikses (sikkerhet/stabilitet ferdig) |
| **Journey 30 dager** | `lib/journey/engine.ts` (3 faser: EARLY, BUILDING_TRUST, DEEPER) | ✅ Forenkle til frivillige oppgåver |

---

## Funksjoner vi FJERNER (enkelhet)

| Funksjon | Hvorfor fjernes |
|----------|----------------|
| **Magic Link** | Skal berre vere Vipps OAuth (både login + betaling) |
| **Stripe-integrasjon** | Skal berre vere Vipps betalinger seinare |
| **Resonansmåling i chat** | Falsk presisjon — når paret matcher godt → er dei kompatibele. Resten er kommunikasjon mellom to folk. |
| **AI-svar-forslag** | Bryter den menneskelige kontakten. ToSom skal føles ekte, ikkje AI-støttet. |
| **MatchInsight AI** | Ikkje nødvendig — brukarane ser profil-data direkte |
| **JourneyCoach AI-prompt** | Ikkje nødvendig |

---

## Hovudprinsipp for V2

1. **Enkelheit over kompleksitet** — færre funksjoner, betre oppleving
2. **Menneske før teknologi** — ingen AI-chat, ingen AI-coach, ingen AI-partner
3. **Privat og trygg** — djup profil, éin match, 30-dagers reise
4. **La folk finne ut av det selv** — matching er nok. Resten er kommunikasjon mellom to personar.

---

## Nøkkelforskel — V1 vs V2

| Område | V1 (noverande) | V2 (forenkla) |
|--------|----------------|---------------|
| **Login** | Magic Link + Vipps | Berre Vipps OAuth |
| **Betaling** | Stripe | Berre Vipps (349 NOK, kjem seinare) |
| **Chat** | Åpen + AI-forslag + GuidedQuestions | Åpen + Mood-farger (eksisterer) + Blikjent-tips (eksisterer) |
| **Resonansmåling** | Per melding i chat | Fjerna — ikkje nødvendig |
| **Journey** | Daglege pliktige oppgåver | Dagleg tema + refleksjon (frivillig) |

---

## Arbeidsplan for V2-utvikling

1. [ ] Fjerne Magic Link login-ruter (`/api/auth/magic-link/*`)
2. [ ] Fjerne Stripe-integrasjon
3. [ ] Fjerne Resonansmåling frå message-handling
4. [ ] Fjerne AI-svar-forslag i chat (`/api/ai/message-suggestions/`)
5. [ ] Forenkle Journey til frivillige oppgåver
6. [ ] Verifisere at Mood + Blikjent fungerer korrekt i chat

---

## Verifikasjon (Punkt 6)

### ✅ Mood-komponenter
| Komponent | Status | Sted |
|-----------|--------|------|
| ChatMoodBadge | ✅ Finnes | `components/ui/moodTag.tsx` |
| MoodGrid | ✅ Finnes | `components/ui/moodTag.tsx` |
| MoodHistory | ✅ Finnes | `components/ui/moodTag.tsx` |
| Export i ui/index.tsx | ✅ Finnes (1 match) | `components/ui/index.tsx` |

### ✅ GuidedQuestions/BliKjent
| Element | Status | Detaljer |
|---------|--------|----------|
| API: /api/questions/route.ts | ✅ Finnes | Tilfeldig spørsmål (GET) |
| API: /api/questions/[category]/route.ts | ✅ Finnes | Spørsmål per kategori |
| API: /api/questions/categories/route.ts | ✅ Finnes | Alle kategorier |
| Seed-data (scripts/seed-questions.ts) | ✅ 329 linjer | ~150 spørsmål i 10 kategorier |

---

*V2-skisse — oppdatert 2026-08-05. Dokumentasjonen er under diskusjon og kan endrast.*
