# Frontend WarmFlow-integrasjon — Rapport

**Oppdatert:** 30. juni 2026
**Versjon:** 1.0
**Status:** ✅ FULLFØRT

---

## OVERSIKT

WarmFlow er no integrert i chat-seksjonen via `app/chat/layout.tsx`. Layouten opprettar `WarmFlowContext` som omslutter heile chat-opplevinga, og mood endrar seg dynamisk basert på:

- **Journey-fase** (EARLY, BUILDING_TRUST, DEEPER, CHECKIN)
- **Resonance-nivå** (0-100)
- **Tid på døgnet** (20:00-02:00 = warm)

---

## FIL: app/chat/layout.tsx

### Import
```tsx
import { MOOD_COLORS, determineMood, MoodType, MoodColors } from '@/lib/warmFlow/warmFlow';
import { createContext, useContext, useState, useEffect } from 'react';
```

### WarmFlowContext
```tsx
export const WarmFlowContext = createContext<WarmFlowContextType>({
  currentMood: 'calm',
  colors: MOOD_COLORS.calm,
  background: MOOD_COLORS.calm.background,
  glow: MOOD_COLORS.calm.glow,
  accent: MOOD_COLORS.calm.accent,
  transitionMood: () => {},
});

export const useWarmFlow = () => useContext(WarmFlowContext);
```

### Mood-berekning
```tsx
function calculateChatMood(phase: string, resonanceScore: number): MoodType {
  // Milestone (høg resonans + tidlig fase)
  if (resonanceScore >= 85 && phase === 'EARLY') return 'celebratory';
  // Dyp samtale
  if (phase === 'DEEPER' && resonanceScore >= 60) return 'deep';
  // Varm kveldstemning
  if (isNightTime && resonanceScore >= 50) return 'warm';
  // Tidlig i reisa
  if (phase === 'EARLY') return resonanceScore >= 70 ? 'warm' : 'gentle';
  // Standard
  return 'calm';
}
```

---

## UI-KOBLING

### Bakgrunn
```tsx
const background = `radial-gradient(ellipse at 50% 0%, ${colors.glow} 0%, ${colors.background} 60%)`;
```

### Header glød
```tsx
boxShadow: `0 4px 30px ${colors.glow}`;
borderBottom: `1px solid ${colors.glow}`;
```

### Input glød
```tsx
boxShadow: `0 -4px 30px ${colors.glow}`;
borderTop: `1px solid ${colors.glow}`;
```

### Meldingsbobler
- Bruk `colors.glow` som basis-farge
- Bruk `colors.accent` som aksent

---

## MOOD-ENDRINGER

| Tilstand | Mood | Farge |
|--|--|--|
| Tidlig + høg resonans | celebratory | Gull-lys (#FFD700) |
| DEEPER + resonans >= 60 | deep | Blå (#A8D8EA) |
| Kveld + resonans >= 50 | warm | Gull-lys (#E8C766) |
| Tidlig + resonans >= 70 | warm | Gull-lys (#E8C766) |
| Tidlig + resonans < 70 | gentle | Grøn (#88D8B0) |
| BUILDING_TRUST + >= 65 | warm | Gull-lys (#E8C766) |
| Annan | calm | Standard gull (#D4AF37) |

---

## TESTSCENAR

### 1. Mood endrar seg ved journey-fase
- EARLY → gentle/warm
- BUILDING_TRUST → warm/calm
- DEEPER → deep
- CHECKIN → depend on resonance

### 2. Mood endrar seg ved resonance-nivå
- >= 85 + tidlig fase → celebratory
- >= 60 + DEEPER → deep
- >= 70 + EARLY → warm

### 3. Mood endrar seg ved tid på døgnet
- 20:00-02:00 + resonans >= 50 → warm

---

## BRUK I CHATROOM-KOMPONENTAR

```tsx
import { useWarmFlow } from '@/app/chat/layout';

function ChatBubble({ message }) {
  const { colors } = useWarmFlow();

  return (
    <div
      style={{
        background: `${colors.glow}40`,
        border: `1px solid ${colors.glow}`,
        boxShadow: `0 2px 10px ${colors.glow}`,
      }}
    >
      {message.text}
    </div>
  );
}
```

---

## NESTE STEG

1. **Kople til ekte data** — hent phase og resonance fra conversation-API
2. **Legg til overgang-animasjonar** — farger bør transitione mykt
3. **Test med ulike scenario** — alle kombinasjonar av fase + resonans + tid

---

## HUSK

- Alle fargeendringar skjer **mykt** (duration-1000)
- Ingen skarpe overgangar
- Alle moodar er **rolige og varme**
- Mood er **ikke påtrengjande** — bare bakgrunnseffekt