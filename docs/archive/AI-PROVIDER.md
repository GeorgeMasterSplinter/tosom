# AI Provider — Dokumentasjon

**Oppdatert:** 30. juni 2026
**Versjon:** 1.0

---

## OVERSIKT

ToSom har en AI-provider-abstraksjon i `lib/ai/provider` som gir:

- **Einhetlig interface** for AI-operasjonar
- **OpenAI-integrasjon** som primary provider
- **Graceful degradation** til fallback-verdier når API-nøkle mangler
- **Match insights**, **journey context**, og **profil-forslag**

---

## ARKITEKTUR

```
lib/ai/
├── provider/          # AI Provider-abstraksjon
│   └── (file)        # OpenAIProvider + default export
├── features/
│   ├── journeyGuidance.ts
│   ├── matchInsights.ts
│   ├── messageSuggestions.ts
│   └── profileRewrite.ts
├── pipeline.ts       # AI pipeline
├── types.ts          # Typedefinisjonar
├── config.ts         # Konfigurasjon
├── client.ts         # Client-hjelp
└── security.ts       # Sikkerheit
```

---

## BRUK

### Import default provider
```typescript
import { defaultAIProvider } from '@/lib/ai/provider'

const insights = await defaultAIProvider.generateMatchInsights(profileA, profileB)
```

### Direkte import
```typescript
import { OpenAIProvider } from '@/lib/ai/provider'

const provider = new OpenAIProvider('din-api-nokkel')
```

---

## KONFIGURASJON

```bash
# AI-leverandør (openai, anthropic, azure, test)
AI_PROVIDER=openai

# AI API-nøkle
AI_API_KEY=sk-proj-...

# OpenAI base URL (valgfritt)
OPENAI_BASE_URL=https://api.openai.com/v1
```

---

## FALLBACK-MEKANISME

Når AI_API_KEY mangler eller API feilar:
- Returnerer **håndskrivne fallback-verdier**
- Ingen feil kastas
- Brukere ser aldri AI-feil

---

## AI-FEATURES

### 1. Journey Guidance
- Daglege refleksjonsspørsmål
- Emosjonell tilstand-analyse
- Gentle prompts

### 2. Match Insights
- Resonans-analyse
- Styrke-punkter
- Samtale-startar

### 3. Message Suggestions
- Kontekst-baserte forslag
- Tone-matching
- Depth-preserving

### 4. Profile Rewrite
- Bio-varianter
- Interest-forslag
- Improvement-tips

---

## FEILFINDING

### "AI not configured"
Set AI_API_KEY i miljøvariablane

### API-feil
Provider fell automatisk tilbake til håndskrivne verdier

---

## HUSK

- AI-bruk er **alltid valfritt** for sluttbrukar
- Fallback-verdier er **alltid kvalifiserte**
- Ingen AI-feil nå brukere