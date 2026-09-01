# Premium Chat Animations — Dokumentasjon

**Oppdatert:** 30. juni 2026
**Versjon:** 1.0
**Status:** 🟡 Backend-logikk ferdig, frontend-komponent mangler

---

## OVERSIKT

Premium Chat Animations gir chat følelsel levande og varm med:
- **5 bubble-animasjonar** (pop-in, slide-fade, warm-glow, soft-land, breathe-in)
- **Resonance-glow** på meldinger basert på resonans-nivå
- **Typing-indikator** med pulserande partiklar
- **Progressiv tekst-avdekking** (tegn-for-tegn)
- **Mood-basert chat-miljø** (5 moodar)

---

## BUBBLE-ANIMASJONAR (5 typer)

| Type | Varighet | Easing | Hva |
|--|--|--|--|
| **pop-in** | 400ms | Spring (1.56) | Rask, energisk |
| **slide-fade** | 500ms | Smooth | Glid + fade |
| **warm-glow** ⭐ | 600ms | Ease-in-out | Varm, gjeldande |
| **soft-land** | 450ms | Ease-out | Milt land |
| **breathe-in** | 800ms | Ease-in-out | Puste inn |

---

## MOODAR (5 stemningar)

| Mood | Hva | Glow |
|--|--|--|
| **calm** | Standard | Gull (15%) |
| **warm** | Intim samtale | Gull-lys (25%) |
| **deep** | Refleksjon | Blå (20%) |
| **gentle** | Opptakt | Grøn (20%) |
| **joyful** | Milestone | Gull-lys (30%) |

---

## RESONANCE GLOW

Basert på resonans-nivå (0-100):
- Intensitet skalerer med nivå
- Box-shadow og border endrar seg
- Maks 20px shadow ved 100% resonans

---

## TYPING INDICATOR

3 pulserande partiklar med:
- Tilfeldig storleik (4-8px)
- Tilfeldig opacity (0.4-0.8)
- Fase-forskyving mellom partiklar
- 1200ms puls-varighet

---

## PROGRESSIV AVDEKKING

- 15ms per tegn
- Simulert skriving
- Kan slåast av

---

## MOOD-DETERMINASJON

Automatisk mood basert på:
- **Message depth** (shallow/deep)
- **Message count** (>20 = joyful)
- **Tid** (20:00-02:00 = warm)
- **Journey phase** (DEEPER = deep)

---

## BRUK I UI

```tsx
import { getPremiumChatConfig } from '@/lib/chatAnimations/chatAnimations'

function ChatRoom({ resonanceLevel, mood }) {
  const config = getPremiumChatConfig(mood, resonanceLevel)

  return (
    <div style={{ background: config.environment.background }}>
      {/* Meldinger med resonance-glow */}
      {/* Bubble-animasjonar */}
      {/* Typing-indikator */}
    </div>
  )
}
```

---

## HUSK

- Alle animasjonar **rolige og varme**
- Resonance-glow **subtil**
- Typing-indikator **ikke-påkrevjande**
- Progressiv avdekking **valfritt**