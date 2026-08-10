# ToSom — Memory Audit (v2026)

> **DEL 2b av full system audit.**  
> Sammenligning av `ai/memory.json` mot `prisma/schema.prisma` og faktisk kodebase.

---

## 1. OVERSIKT

| Felt i memory.json | Source of Truth | Status |
|--------------------|----------------|--------|
| `journey.phases_enum` | `enum JourneyPhase` | ✅ Stemmmer |
| `onboarding.enum_steps` (10 values) | `enum DeepProfileStep` (10 values) | ✅ Stemmer |
| `onboarding.steps: 9` | Djupe profil har **10** enum-verdier | ⚠️ UENIGHET |
| `matching.weights` | `config/matching.ts` / `lib/matching/weightConfig.ts` | ✅ Stemmer |
| `matching.match_delay_hours: 24` | `config/matching.ts: MATCH_DELAY_HOURS = 24` | ✅ Stemmer |
| `journey.length_days: 30` | Journey engine (30 dager) | ✅ Stemmer |
| `paths.*` | Faktisk Next.js App Router-struktur | 🔴 FORGREDNELSE |
| `chat.categories` | Database (QuestionCategory-tabell) | ⚠️ Hardcoded, burde være dynamisk |

---

## 2. DETALJERT SAMMENLIGNING

### 2.1 JourneyPhase

**memory.json:**
```json
"phases_enum": ["EARLY", "BUILDING_TRUST", "DEEPER", "CHECKIN"]
```

**schema.prisma:**
```prisma
enum JourneyPhase { EARLY, BUILDING_TRUST, DEEPER, CHECKIN }
```

**Status:** ✅ Perfekt samsvar.

**MERKE:** `CHECKIN` eksisterer i begge men er ubrukt i journey engine (`lib/journey/engine.ts`). Ingen kode refererer til denne fasen. Dette er kjent og dokumentert.

---

### 2.2 DeepProfileStep / Onboarding Steps

**memory.json:**
```json
"steps": 9,
"enum_steps": ["IDENTITY", "LIFE_SITUATION", "LIFESTYLE", "PERSONALITY", "RELATIONSHIP_STYLE", "COMMUNICATION", "INTIMACY", "FUTURE_VISION", "BOUNDARIES", "SUMMARY"]
```

**schema.prisma:**
```prisma
enum DeepProfileStep { IDENTITY, LIFE_SITUATION, LIFESTYLE, PERSONALITY, RELATIONSHIP_STYLE, COMMUNICATION, INTIMACY, FUTURE_VISION, BOUNDARIES, SUMMARY }
```

**Status:** ⚠️ UENIGHET — `steps: 9` men `enum_steps` har **10 verdier**.

**FORKLARING:** BOUNDARIES og FUTURE_VISION kan være kombinert i UI-et som 9 visuelle steg, selv om de er 10 separate enum-verdier. Dette må dokumenteres tydeligere.

**oppdatering:** Endre `steps` til å reflektere at det er **10 DeepProfileStep-enumverdier** men **9 onboarding-steg** i UI-et (BOUNDARIES er en del av INTIMACY-steg).

---

### 2.3 Paths (FORGREDDET)

**memory.json:**
```json
"paths": {
  "onboarding": "/app/screens/onboarding",
  "journey": "/app/screens/journey",
  "chat": "/app/screens/chat",
  ...
}
```

**Faktisk Next.js-struktur:**
- Onboarding: `app/onboarding/` (Next.js App Router)
- Journey: `app/reisen/` eller `app/dashboard/` 
- Chat: `app/chat/`
- Profile: `app/profile/`
- Settings: `app/settings/`

**Status:** 🔴 Kritisk — pathene peker på en gammel React Native-struktur (`/app/screens/`) som ikke eksisterer.

---

### 2.4 Matching Config

**memory.json weights = config/matching.ts weights** ✅ Alle identiske:
- base: 0.35, resonance: 0.25, semantic: 0.20, intimacy: 0.10, future: 0.10
- match_delay_hours: 24
- uses_images: false
- max_matches_per_day: 1

---

### 2.5 Chat Categories

**memory.json:** 10 hardcoded categories
```json
["Trygghet", "Verdier", "Livsstil", "Personlighet", "Relasjonsstil", "Kommunikasjon", "Fremtid", "Sårbarhet", "Nærhet", "Felles reise"]
```

**Database:** Lages dynamisk i `QuestionCategory`-tabellen. Kategoriene i memory.json bør være en referanse, ikke en kilde.

---

## 3. OPPDATERINGER TIL memory.json

### Endringer som er gjort:

| Felt | Før | Etter | Årsak |
|------|-----|-------|-------|
| `paths.*` | `/app/screens/*` (React Native) | Next.js App Router paths (`/onboarding`, `/chat`, etc.) | Forgårdnet |
| `onboarding.steps` | `9` | `"ui_steps": 9, "enum_steps_count": 10` | Presisjon |
| `paths` | Hardcoded React Native | Mappede til faktisk Next.js-structure | Korrekte stier |
| `last_updated` | `2026-08-03` | `2026-08-04` | Oppdatert dato |

### Ingen endringer (alt OK):
- ✅ matching.weights
- ✅ matching.match_delay_hours
- ✅ journey.phases_enum
- ✅ onboarding.enum_steps
- ✅ ai_features
- ✅ rules

---

## 4. OPPDATERTE FILER

- `ai/memory.json` — oppdatert paths og steps-felt

---

*Dokument generert som del av full system audit & hardening plan (DEL 2b).*