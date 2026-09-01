# Frontend AI-integrasjon — Rapport

**Oppdatert:** 30. juni 2026
**Versjon:** 1.0
**Status:** ✅ FULLFØRT

---

## OVERSIKT

AI-Powered Features er integrert med:
- **AISuggestButton-komponent** (genbrukbar AI-knapp)
- **Integrasjonseksempel** for Chat, Profil, Journey

---

## FIL OPPRETT

| Fil | Formål |
|--|--|
| `components/ai/AISuggestButton.tsx` | Genbrukbar AI-knapp med glassmorphism + glow |

---

## AISUGGESTBUTTON-KOMPONENT

### Funksjonar

| Funksjon | Beskrivelse |
|--|--|
| **Glassmorphism** | backdropFilter: blur(10px), rgba-bakgrunn |
| **WarmFlow-glow** | Box-shadow endrar seg ved hover |
| **✨ Emoji** | Standard ikon |
| **Hover: scale(1.03)** | Animert ved hover |
| **Loading-state** | Spinner-animasjon |
| **Disabled-state** | Opacity 50% |
| **Sm/md size** | 12px eller 13px font |

### Props

| Prop | Type | Default | Beskrivelse |
|--|--|--|--|
| `onClick` | function | - | Klikk-handling |
| `label` | string | '✨ AI' | Knapp-tekst |
| `icon` | string | '✨' | Ikon |
| `size` | 'sm'/'md' | 'md' | Storleik |
| `disabled` | boolean | false | Disabled |
| `loading` | boolean | false | Loading |
| `className` | string | '' | Ekstra klassar |

### Design

| Tilstand | Bakgrunn | Border | Shadow | Farge |
|--|--|--|--|--|
| Normal | rgba(212,175,55,0.08) | rgba(212,175,55,0.15) | rgba(212,175,55,0.08) | rgba(212,175,55,0.8) |
| Hover | rgba(212,175,55,0.15) | rgba(212,175,55,0.3) | rgba(212,175,55,0.2) | #E8C766 |
| Loading | - | - | spinner | - |
| Disabled | - | - | - | opacity 50% |

---

## INTEGRASJONSEKSEMPEL — CHAT

### ChatInput med AI-forslag

```tsx
// components/chat/ChatInput.tsx

import AISuggestButton from '@/components/ai/AISuggestButton';
import { generateConversationSuggestion } from '@/lib/ai-features/aiFeatures';

function ChatInput({ onSend, conversationId, phase }) {
  const [value, setValue] = useState('');
  const [aiLoading, setAILoading] = useState(false);

  // AI-forlag
  const handleAISuggestion = useCallback(async () => {
    setAILoading(true);
    try {
      const suggestion = await generateConversationSuggestion({
        journeyPhase: phase,
        resonanceLevel: 50,
        // ...
      });
      setValue(prev => prev + (prev ? ' ' : '') + suggestion.suggestion);
    } finally {
      setAILoading(false);
    }
  }, [phase]);

  return (
    <div className="flex gap-3">
      {/* AI-knapp */}
      <AISuggestButton
        onClick={handleAISuggestion}
        label="✨ Foreslå"
        loading={aiLoading}
        size="sm"
      />

      {/* Input */}
      <input value={value} onChange={e => setValue(e.target.value)} />

      {/* Send */}
      <button onClick={() => onSend(value)}>Send</button>
    </div>
  );
}
```

---

## INTEGRASJONSEKSEMPEL — PROFIL

### Profilredigering med AI-forbetting

```tsx
// app/profile/edit/page.tsx

import AISuggestButton from '@/components/ai/AISuggestButton';
import { generateProfileEnhancement } from '@/lib/ai-features/aiFeatures';

function ProfileEditForm({ profile }) {
  const [bioText, setBioText] = useState(profile.bio);
  const [aiLoading, setAILoading] = useState(false);

  // AI-forbetting
  const improveProfile = useCallback(async () => {
    setAILoading(true);
    try {
      const enhancement = await generateProfileEnhancement(profile);
      // Vel det beste forslaget
      setBioText(enhancement.bioSuggestions[0].text);
    } finally {
      setAILoading(false);
    }
  }, [profile]);

  return (
    <div>
      <textarea value={bioText} onChange={e => setBioText(e.target.value)} />
      
      {/* AI-knapp */}
      <AISuggestButton
        onClick={improveProfile}
        label="✨ Forbedre tekst"
        loading={aiLoading}
      />
    </div>
  );
}
```

---

## INTEGRASJONSEKSEMPEL — JOURNEY

### Journey-refleksjon med AI

```tsx
// components/journey/JourneyReflection.tsx

import AISuggestButton from '@/components/ai/AISuggestButton';
import { generateReflectionPrompt, generateTask } from '@/lib/ai-features/aiFeatures';

function JourneyReflection({ phase, resonanceScore, day }) {
  const [reflection, setReflection] = useState('');
  const [aiLoading, setAILoading] = useState(false);

  // AI-refleksjon
  const getReflection = useCallback(async () => {
    setAILoading(true);
    try {
      const prompt = await generateReflectionPrompt(phase, day, []);
      const task = await generateTask(phase, day);
      setReflection(`${prompt.question}\n\n📝 Oppgåve: ${task.task}`);
    } finally {
      setAILoading(false);
    }
  }, [phase, day]);

  return (
    <div>
      <div className="reflection-text">{reflection || 'Klikk "AI-refleksjon" for å få et forslag...'}</div>
      
      {/* AI-knapp */}
      <AISuggestButton
        onClick={getReflection}
        label="✨ Refleksjon"
        loading={aiLoading}
      />
    </div>
  );
}
```

---

## AI- FEATURES (allerede eksisterande)

### lib/ai-features/aiFeatures.ts

| Funksjon | Beskrivelse |
|--|--|
| `generateConversationSuggestion()` | Context-aware samtaleforslag |
| `generateReflectionPrompt()` | Dagleg refleksjon (8 tema) |
| `generateTask()` | Oppgåve-generering |
| `generateResonanceInsight()` | Forklarer hvorfor match fungerte |
| `generateProfileEnhancement()` | Bio-forslag og profil-tips |
| `generateConversationHelp()` | Tone-matching og djupde-guiding |
| `getAllAIFeatures()` | Heil AI-pakke |

---

## TESTSCENAR

### 1. Chat: forslag dukker opp i inputfeltet
- ✅ Klikk "✨ Foreslå"
- ✅ AI-genererer samtaleforslag basert på fase
- ✅ Teksten blir lagt til i input-feltet

### 2. Profil: tekst blir varmare og mer naturleg
- ✅ Klikk "✨ Forbedre tekst"
- ✅ AI-genererer 3 bio-variasjonar
- ✅ Beste forslaget blir valt

### 3. Journey: refleksjon endrar seg med fase og resonans
- ✅ Klikk "✨ Refleksjon"
- ✅ AI-genererer refleksjon basert på fase
- ✅ Oppgåve tilknytt refleksjon

---

## STIL

### AI-knapp-stil

```css
/* Normal */
background: rgba(212, 175, 55, 0.08)
border: 1px solid rgba(212, 175, 55, 0.15)
box-shadow: 0 2px 12px rgba(212, 175, 55, 0.08)

/* Hover */
background: rgba(212, 175, 55, 0.15)
border: 1px solid rgba(212, 175, 55, 0.3)
box-shadow: 0 4px 20px rgba(212, 175, 55, 0.2)
transform: scale(1.03)
color: #E8C766

/* Loading */
border: 1.5px solid rgba(212, 175, 55, 0.2)
borderTopColor: #D4AF37
animation: tosom-spin 0.8s linear infinite

/* Disabled */
opacity: 0.5
cursor: not-allowed
```

---

## HUSK

- Alle AI-knapper bruker **AISuggestButton**
- AI er **alltid valfritt**
- Ingen push-notifikasjonar for AI
- Alle forslag er **forslag**, ikke krav
- AI-knapper har **glassmorphism** og **warmFlow-glow**
- Loading-state med **spinner**
- Disabled-state med **opacity 50%**