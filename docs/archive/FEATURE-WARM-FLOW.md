# Warm Flow — Dokumentasjon

**Oppdatert:** 30. juni 2026
**Versjon:** 1.0
**Status:** 🟡 Backend-logikk ferdig, frontend-komponent mangler

---

## OVERSIKT

Warm Flow gir varme, rolige overgangar mellom skjer i ToSom:
- **Side-transisjon animasjonar** (5 typer)
- **Warm loading states** med tekst
- **Gentle page transitions** per rute
- **Mood-basert fargeendring** (5 moodar)
- **Ambient sound** (valfritt)

---

## ARKITEKTUR

```
lib/warmFlow/
└── warmFlow.ts    # Backend-logikk + mood-fargar + transitions
```

---

## MOODAR (5 stemningar)

| Mood | Hva | Farge | Emoji |
|--|--|--|--|
| **Calm** | Standard | Gull (#D4AF37) | — |
| **Warm** | Match/melding | Gull-lys (#E8C766) | 🔥 |
| **Deep** | Refleksjon | Blå (#A8D8EA) | 🌊 |
| **Gentle** | Onboarding | Grøn (#88D8B0) | 🌱 |
| **Celebratory** | Milestone | Gull-lys (#FFD700) | ✨ |

---

## TRANSISJON-TYPER (5 typer)

| Type | Varighet | Hva |
|--|--|--|
| **fade** | 500ms | Enkel fade |
| **slide-up** | 600ms | Glid opp |
| **warm-breathe** | 800ms | Varm, pustande |
| **soft-reveal** | 900ms | Myk avdekking |
| **gentle-shift** | 700ms | Mild forskyving |

---

## TRANSISJON PER RUTE

| Rute | Type |
|--|--|
| /onboarding | soft-reveal |
| /dashboard | gentle-shift |
| /chat | fade |
| /journey | warm-breathe |
| /matching | warm-breathe |
| /profile | slide-up |
| / (landing) | fade |

---

## WARM LOADING STATES

| Kontekst | Melding |
|--|--|
| Onboarding | "Bygger din profil..." |
| Match | "Finn din match..." |
| Chat | "Lastar samtalen..." |
| Journey | "Startar reisa..." |
| Profile | "Opener profilen..." |

---

## MOOD-DETERMINASJON

```typescript
import { determineMood } from '@/lib/warmFlow/warmFlow'

// Basert på aktivitet og reise-fase
const mood = determineMood('match', 'EARLY') // → 'warm'
const mood2 = determineMood('reflecting', 'DEEPER') // → 'deep'
const mood3 = determineMood('milestone', 'CHECKIN') // → 'celebratory'
```

---

## AMBIENT SOUND (valfritt)

| Type | Beskrivelse |
|--|--|
| Rain | Regn |
| Forest | Skog |
| Waves | Bøljer |
| Silence | Ingen lyd (standard) |

---

## FRAMER-MOTION INTEGRASJON

```tsx
import { motion } from 'framer-motion'
import { getTransitionForRoute, getWarmFlowCSS } from '@/lib/warmFlow/warmFlow'

function AnimatedPage({ children, route }) {
  const transition = getTransitionForRoute(route)
  const css = getWarmFlowCSS(TRANSITION_TEMPLATES[transition])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ css }}
    >
      {children}
    </motion.div>
  )
}
```

---

## DESIGNPRINSIPP

1. **Alltid rolig** — ingen raske eller skarpe overgangar
2. **Alltid varm** — gull- og blåtonar
3. **Alltid myk** — ease-in-out timing
4. **Aldri påtrengjande** — subtile animasjonar

---

## UTVEKKING

### Påkrav for produksjon:
1. Lag `components/warmFlow/WarmTransitionWrapper.tsx`
2. Kople til app/layout.tsx
3. Mood-basert CSS-variable oppdatering
4. Ambient sound komponent (valfritt)

---

## HUSK

- Transisjonar må være **under 1 sekund**
- Mood-endring må **puste** (ikke hoppe)
- Ingen animasjonar på svære apparat
- Alltid fallback til CSS transitions