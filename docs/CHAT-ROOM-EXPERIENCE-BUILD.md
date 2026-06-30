# ToSom Chat Room — Experience Build Report

**Dato:** 2026-06-30  
**Status:** Mikrointeraksjonar + emosjonelle states + journey-integrasjon fullført  
**Modul:** `app/chat/` + `components/chat/` + `hooks/`

---

## OPPSUMMERING

Chat Room-opplevelsen er no bygd med:

- ✅ mikrointeraksjonar (fade-in, gull-glød, puls, smooth scroll, glassmorphism-pust)
- ✅ emosjonelle states (Trygg-badge, Resonans-indikator, Stille øyeblikk, Fase-badge)
- ✅ journey-integrasjon (fase-basert UI med 5 nivå)
- ✅ error boundary + fallback + loading-state

---

## FASE 7 — MICRO-INTERACTIONS

### 1. Fade-in på partner typing
**Fil:** `components/chat/ChatMessages.tsx`

```
Typing-indikator med fade-in animasjon når partner byrjar å skrive:
- 3 gull-prikkar med staggeret animasjon
- Glassmorphism-bakgrunn med gull-aksent
- 300ms fade-in + 1.2s typingDot-loop
```

### 2. Gull-glød på send-knapp ved hover
**Fil:** `components/chat/ChatInput.tsx`

```
Send-knapp med multi-lags glød-effekt:
- Lag 1: 0 4px 28px rgba(212, 175, 55, 0.5)
- Lag 2: 0 0 40px rgba(212, 175, 55, 0.3)
- Lag 3: 0 0 60px rgba(212, 175, 55, 0.15)
- Radial-gradient pulse bak knappen
- Scale 1 → 1.08 ved hover
```

### 3. Rolig puls på partner-header når aktiv
**Fil:** `components/chat/ChatHeader.tsx`

```
Header-puls når partner er online:
- Radial-gradient ellipse med fase-farge
- 4s infinite ease-in-out
- Opacity 0.3 → 0.6
```

### 4. Smooth scroll ved nye meldingar
**Fil:** `components/chat/ChatMessages.tsx`

```
Avansert scroll med debounce:
- Berre scroll når messages.length endrar seg
- 50ms delay for animasjon
- scrollIntoView({ behavior: 'smooth', block: 'end', force: true })
```

### 5. Glassmorphism-pust på input-felt
**Fil:** `components/chat/ChatInput.tsx`

```
Input-pust ved fokus:
- Border: rgba(212, 175, 55, 0.5)
- Box-shadow: 0 0 0 3px + 0 0 24px
- Background: rgba(255, 255, 255, 0.08)
- Transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1)
```

---

## FASE 8 — EMOSJONELLE STATES

### 1. "Trygg" Badge
**Fil:** `components/chat/ChatHeader.tsx`

```tsx
{isSafe && (
  <div style={{
    background: 'rgba(77, 255, 136, 0.1)',
    border: '1px solid rgba(77, 255, 136, 0.2)',
  }}>
    <svg>checkmark</svg>
    <span>Trygg</span>
  </div>
)}
```

Viser grønt badge med checkmark når samtalen er trygg (fase 2+).

### 2. "Resonans" Indikator
**Fil:** `components/chat/ChatHeader.tsx`

```tsx
{resonanceScore > 0 && (
  <div style={{
    background: `${color}15`,
    border: `1px solid ${color}30`,
  }}>
    <svg>heart</svg>
    <span>{Math.round(resonanceScore)}%</span>
  </div>
)}
```

Viser resonans-prosent med hjarte-ikon:
- ≥80%: grønt (#4DFF88)
- ≥60%: gull (#D4AF37)
- ≥40%: oransje (#FFB86C)
- <40%': rosa (#FF82C8)

### 3. "Stille Øyeblikk" State
**Fil:** `components/chat/ChatRoom.tsx`

```tsx
function SilentMoment({ phaseOrder }: { phaseOrder: number }) {
  const moments = [
    'Ta deg tid. Det viktigaste kjem ikkje av seg sjølv.',
    'Stille øyeblikk er der vi vokser mest.',
    'I ro finn vi svarene.',
    'Pust. Du er trygg her.',
  ];
  // ...
}
```

Viser meningsfulle quotes etter 30 sekund inaktivitet (fase 3+):
- 8s fade-in/fade-out
- Gull-aksent background
- Rotaterande quotes basert på phaseOrder

### 4. "Fase"-Badge fra Journey
**Fil:** `components/chat/ChatHeader.tsx`

```tsx
// Fase-fargar:
0 → Introduksjon: gull (#D4AF37)
1 → Trygghet: grønt (#4DFF88)
2 → Sårbarhet: fiolett (#B48CFF)
3 → Fremtid: rosa (#FF82C8)
```

Med warm-indikator (fargar som aukar med fase).

---

## FASE 9 — JOURNEY-INTEGRASJON

### Fase-basert UI-endringar

| Fase | Namn | UI-endring |
|------|------|------|
| 1 | Introduksjon | Rogle, gull-aksent, standard bobler |
| 2 | Trygghet | Grønt badge, gull-border, trygghets-indikator |
| 3 | Sårbarhet | Fiolette detaljar, "stille øyeblikk", varmare bobler |
| 4 | Fremtid | Rosa aksentar, større input, val-indikator |
| 5 | Djupne | Full varm palett, meir glow, aktiv resonans |

### ChatRoom Props (journey-integrasjon)
```typescript
interface ChatRoomProps {
  conversationId: string;
  partner: Partner;
  phaseLabel: string;           // "Fase 1 — Introduksjon"
  phaseOrder: number;           // 1-5 (styrer UI)
  currentDay: number;           // 1-30
  daysRemaining: number;        // 30-1
  resonanceScore: number;       // 0-100
  isSafe: boolean;              // trygghets-badge
  showHeader: boolean;
}
```

### Phase-basert bubbel-fargar (fase 3+)
```typescript
const getBubbleWarmth = () => {
  if (phaseOrder >= 4) return 'rgba(255, 130, 200, 0.08)';
  if (phaseOrder >= 3) return 'rgba(180, 140, 255, 0.06)';
  return 'rgba(255, 255, 255, 0.06)';
};
```

### Phase-basert input-størrelse (fase 4+)
```typescript
const getInputSize = () => {
  if (phaseOrder >= 4) return 'px-6 py-4 text-base';
  return 'px-5 py-3.5 text-sm';
};
```

---

## FILSTRUKTUR

```
components/chat/
├── ChatRoom.tsx              ✅ NY — journey-integrasjon + silent moments
├── ChatHeader.tsx            ✅ NY — emosjonelle states + puls
├── ChatMessages.tsx          ✅ NY — micro-interactions
├── ChatInput.tsx             ✅ NY — gull-glød + glassmorphism-pust
├── ChatList.tsx              ← eksisterer
├── ChatView.tsx              ← eksisterer
└── ChatWindow.tsx            ← eksisterer (deprecated)

hooks/
├── useChatMessages.ts        ← eksisterer
├── useChatRealtime.ts        ← eksisterer
└── useSendMessage.ts         ← eksisterer

app/chat/
├── page.tsx                  ← eksisterer
└── [id]/page.tsx            ✅ OPPDATERT — phaseOrder, isSafe
```

---

## MICRO-INTERACTION DETALJAR

### Animasjonar
```css
@keyframes bubbleAppear {
  from { opacity: 0; transform: translateY(8px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes bubblePulse {
  0%, 100% { box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
  50% { box-shadow: 0 2px 16px rgba(212,175,55,0.08); }
}

@keyframes glowPulse {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}

@keyframes headerPulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.6; }
}

@keyframes resonancePulse {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.4); opacity: 0; }
}

@keyframes silentFade {
  0% { opacity: 0; }
  15% { opacity: 0.6; }
  85% { opacity: 0.6; }
  100% { opacity: 0; }
}
```

---

## EMOSJONELL PRIOITERING

1. **Trygghet først** — isSafe badge alltid synleg
2. **Resonans som motivasjon** — prosent alltid tilgjengeleg
3. **Stille øyeblikk** — kun i fase 3+ (ikke stressande)
4. **Fase-badge** — viser progresjon utan press

---

## JOURNEY FLOW

```
/chat                          → ChatList
/chat/[id]                     → ChatDetailPage (hent phaseOrder)
→ <ChatRoom phaseOrder={conv.phaseOrder} />
→ ChatHeader fase-badge        → farge-basert på phaseOrder
→ ChatMessages bobler          → warm-farge basert på phaseOrder
→ ChatInput size               → større input frå fase 4
→ SilentMoment                 → vis frå fase 3+
```

---

## DESIGN-KONSISTENS

| Regel | Status |
|-------|--------|
| Mørk base `#0B0E11` | ✅ |
| Gull-aksent `#D4AF37` | ✅ |
| Glassmorphism | ✅ |
| Rolge animasjonar | ✅ |
| Ingen gamification | ✅ |
| Ingen swipe/feed | ✅ |
| Warm tone | ✅ |
| Fase-basert UI | ✅ |

---

## NESTE STEG

### Høgprioritet
1. Test alle mikro-interaksjonar i browser
2. Test journey-integrasjon med ekte fase-data
3. Test "stille øylik" visning (fase 3+)

### Middelprioritet
4. Legger til "stille øyeblikk" i app/chat/[id]/page.tsx
5. Oppdater `/api/chat/conversations/[id]` med phaseOrder
6. Test resonans-berekning

### Lavprioritet
7. "Mood"-animasjonar basert på resonans-endring
8. Validering av alle fase-data
9. A/B-test av stille moment quotes