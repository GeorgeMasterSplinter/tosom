# ToSom — Chat & Presence Flow (v2026)

> **DEL 4 av full system audit.**  
> Dokumentasjon av chat-flow, meldingssløyfe, BliKjentPanel og presence/typing.

---

## 1. CHAT-ARKITEKTUR (Høynivå)

ToSom har to parallelle chat-implementeringer:

| Implementering | Sti | Status |
|----------------|-----|--------|
| Legacy/Primary | `components/chat/` | ✅ Aktiv, brukt av ChatRoom.tsx |
| Premium/New | `app/chat/components/` | ✅ Aktiv, brukt av nyere chat-sider med mood engine |

Begge implementeringene deler samme backend (`app/api/chat/**`) og Pusher WebSocket-lag.

### Komponent-hierarki (Premium)

```
ChatContainer.tsx                    ← Høyeste nivå, wrapper
├── ChatHeader.tsx                   ← Header med partner-info, presence-indicator
├── MoodBanner.tsx                   ← Stemnings-bannér (mood engine)
├── MessageList.tsx                  ← Meldingsliste med animasjoner
│   └── MessageBubble.tsx            ← Enkelt melding (avatar, tekst, timestamp)
├── TypingIndicator.tsx              ← "Partneren skriver..."-indikator
├── ChatInput.tsx                    ← Tekstfelt + send-knapp
├── ImageUpload.tsx                  ← Bilde-opplasting (dag ≥ 15)
└── BliKjentPanel.tsx                ← Guided questions-panel
    └── QuestionCategory.tsx         ← Kategorier med guidede spørsmål
```

---

## 2. MELDINGSFLOW — SENDER → MOTTAKER

### 2.1 Sekvensdiagram: Bruker sender melding

```
┌─────────┐     ┌──────────┐     ┌────────────┐     ┌─────────┐
│  Sender │     │ Frontend │     │   Backend  │     │ Mottaker │
│  (A)    │     │ React    │     │  API+Pusher│     │   (B)    │
└────┬────┘     └────┬─────┘     └─────┬──────┘     └────┬────┘
     │               │                 │                  │
     │ Skriver tekst │                 │                  │
     │    i input    │                 │                  │
     │       │       │                 │                  │
     │───────┤       │                 │                  │
     │ Typing starter│                 │                  │
     │ (300ms debounce)                │                  │
     │       │       │                 │                  │
     │───────┤───────┴─────────────────┼──────────────────┤
     │               POST /api/presence/update             │
     │               { typing: true }                      │
     │       │                 │                  │ Typing │
     │       │                 │◄─────────────────│indikator│
     │       │                 │                  │ vises  │
     │       │                 │                  │        │
     │ Trykker Send│                 │                  │        │
     │       │       │                 │                  │        │
     │───────┤───────┴─────────────────┼──────────────────┤
     │               POST /api/chat/send                       │
     │               { conversationId, content }               │
     │       │                 │                  │           │
     │       │    1. getServerSession()                   │
     │       │    2. Sjekk sender ∈ conversation          │
     │       │    3. Prisma: create Message               │
     │       │    4. Pusher: trigger 'message-sent'      │
     │       │                 │                  │           │
     │       │                 │──── Trigger ──────►│         │
     │       │              pusher.trigger(             │
     │       │                `conv-{id}`,               │
     │       │                'message-sent',             │
     │       │                messageData)                │
     │       │                 │                  │           │
     │       │                 │◄─── 200 OK ──────│         │
     │       │                 │                  │           │
     │       │◄──────── refresh() ─────────────────│         │
     │       │    GET /api/chat/messages                │         │
     │       │                 │                  │           │
     │◄── Ny melding vises                     │◄── Pusher event: │
     │    i boble (FadeIn + stagger)          │   'message-sent'  │
     │                                        │◄── Nye meldinger │
     │                                        │    lastes inn    │
```

### 2.2 API: `POST /api/chat/send`

```ts
// Forenklede flow:
export async function POST(req: NextRequest) {
  const session = await getServerSession();       // Auth ✅
  const body = await req.json();                  // content, conversationId
  
  // Sjekk at brukeren er en deltaker i konversasjonen
  const conversation = await prisma.conversation.findUnique();
  if (conversation.userAId !== userId && conversation.userBId !== userId) {
    return errorResponse("Forbidden", 403);       // Ownership ✅
  }
  
  // Opprett melding i DB
  const message = await prisma.message.create({
    data: { conversationId, senderId: userId, content, type: 'user' }
  });
  
  // Send Pusher event til mottaker
  pusher.trigger(`conv-${conversationId}`, 'message-sent', message);
  
  return successResponse(message);
}
```

---

## 3. BLIKJENTPANEL — GUIDED SPØRSMÅL

### 3.1 Arkitektur

```
BliKjentPanel.tsx
├── Henter kategorier fra DB (QuestionCategory + GuidedQuestion)
├── Viser kategori-knapper (accordion/tab)
├── Viser spørsmål per kategori (15-20 per kategori)
└── "Send" knap → sender spørsmålet som en vanlig melding
```

### 3.2 Sekvensdiagram: BliKjent-spørsmål

```
┌─────────┐     ┌────────────────┐     ┌────────────┐     ┌─────────┐
│  Bruker │     │ BliKjentPanel  │     │   Database │     │ Mottaker│
└────┬────┘     └────────┬───────┘     └─────┬──────┘     └────┬────┘
     │                   │                   │                  │
     │ Åpner panel       │                   │                  │
     │         │         │                   │                  │
     │─────────┤─────────┼───────────────────┼──────────────────┤
     │         GET /api/chat/conversation/[id]/questions         │
     │                   │      ◄────────────┤                  │
     │                   │ Prisma: findMany QuestionCategory    │
     │                   │   + GuidedQuestion (med order/depth) │
     │                   │─────────────►│                    │
     │◄── Kategorier ────┤                   │                  │
     │   + Spørsmål      │                   │                  │
     │         │         │                   │                  │
     │ Velger spørsmål    │                   │                  │
     │         │         │                   │                  │
     │─────────┤────Send──┼──────────────────┼────────────────►│
     │         │POST /api/chat/send             │               │
     │         │{ content: "spørsmåls-tekst",  │               │
     │         │  type: "user" }                │               │
     │         │                   │                  │◄───────│
     │◄── Spørsmål vises som vanlig melding─────┤                  │
```

### 3.3 Godkjente Kategorier (fra database)

Kategoriene lagres i `QuestionCategory`-tabellen og hentes dynamisk:

| Kategori | Eksempel-spørsmål | depthLevel |
|----------|-------------------|------------|
| Trygghet | "Hva gir deg mest ro i hverdagen?" | 1 |
| Verdier | "Hva er viktigst for deg i et forhold?" | 2 |
| Livsstil | "En ideal-søndag ser du slik ut...?" | 1 |
| Personlighet | "Er du snarere en planlegger eller en improvisator?" | 1 |
| Relasjonsstil | "Hva betyr 'nærhet' for deg?" | 3 |
| Kommunikasjon | "Hvornår trenger du mest ro?" | 2 |
| Fremtid | "Hvor ser du deg om 5 år?" | 3 |
| Sårbarhet | "Når føler du deg mest sårbar?" | 3 |
| Nærhet | "Hva er din favorittmåte å vise kjærlighet på?" | 2 |
| Felles reise | "Hva håper du få ut av denne reisen?" | 2 |

**MERKE:** Ingen AI-genererte spørsmål. Alle spørsmål er statisk definert i database og følger ToSom-språkmanualen.

---

## 4. PRESENCE & TYPING INDICATOR

### 4.1 Arkitektur

Presence bruker **to-lags tilnærming**:
1. **HTTP Polling** — `usePresence`-hook poller `/api/presence/get/[id]` hvert 3. sekund
2. **Pusher WebSocket** — Real-time events for typing indicators og meldingsoppdateringer

### 4.2 Presence State Management

```ts
// lib/presence/presenceState.ts (In-memory Map)
const presenceMap = new Map<string, {
  userId: string;
  isOnline: boolean;
  isTyping: boolean;
  lastSeen: number;       // timestamp
}>();
```

| Funksjon | Formål |
|----------|--------|
| `setOnline(userId)` | Melder brukeren online, nullstiller typing |
| `setOffline(userId)` | Melder brukeren offline, klarer typing |
| `setTyping(userId)` | Setter `isTyping=true`, auto-clear etter 3s |
| `clearTyping(userId)` | Setter `isTyping=false` |
| `getPresence(userId)` | Returnerer PresenceState for en bruker |

**Auto-cleanup:** En `setInterval` (hvert 60s) fjerner inaktive brukere (`lastSeen > 5 min`).

### 4.3 Sekvensdiagram: Presence/Typing

```
┌─────────┐     ┌──────────┐     ┌────────────┐     ┌─────────┐
│ Bruker A │     │ Frontend │     │   Backend  │     │ Bruker B│
└────┬────┘     └────┬─────┘     └─────┬──────┘     └────┬────┘
     │               │                  │                 │
     │Åpner chat     │                  │                 │
     │    │          │                  │                 │
     │────┤──────────┴──────────────────┼─────────────────┤
     │          PATCH /api/presence/update                       │
     │          { userId: A, online: true }                      │
     │                   │                                       │
     │                   ├── setOnline(A) i presenceMap          │
     │                   │                  │                 │
     │   ┌──── usePresence hook (polling 3s)             │
     │   │    GET /api/presence/get/[userId]         │
     │   │                   │                                       │
     │   │◄── { isOnline: true, isTyping: false }                           │
     │   │                                    │                 │
     │ A skriver ...              │                  │                 │
     │   │──── (300ms debounce) ──────────────────┼─────────────────┤
     │   │    POST /api/presence/update                       │
     │   │    { userId: A, typing: true }                      │
     │   │                   ├── setTyping(A)                  │
     │   │                   │  (auto-clear etter 3s)          │
     │   │                                    │                 │
     │   │                                    │◄── Poll oppdateres    │
     │   │                                    │   { isTyping: true } │
     │   │                                    │"A skriver..."vises!│
     │   │                                    │                 │
     │ A sender melding             │                  │                 │
     │   │──── clearTyping() ──────────────────┼─────────────────┤
     │   │    (se Sekvens 2.1)                               │
     │   │                                    │                 │
     │ A lukker chat              │                  │                 │
     │   │──── PATCH /api/presence/update                      │
     │   │    { userId: A, online: false }                     │
     │   │                   ├── setOffline(A)                 │
     │   │                                    │                 │
     │   │                                    │◄── "A offline"   │
```

### 4.4 Disconnect-håndtering

| Scenario | Håndtering |
|----------|-----------|
| Bruker lukker browser | `setOffline()` kalles via `useEffect cleanup`. Auto-cleanup (60s) fjerer inaktive. |
| Pusher-disconnect | Frontend re-kobler automatisk. Ingen data taper. |
| Server-restart | In-memory presenceMap mistes. Nye tilstander settes ved neste polling/update. |
| Network-flakiness | Polling (3s) fungerer selv om Pusher er nede. |

**⚠️ MERKE:** Presence-state er **ikke-persistent**. Ved server-restart mister alle tilstander. For produksjon bør Redis/DB brukes.

---

## 5. SYSTEMMEDLINGER

### 5.1 Filtrering av systemmeldinger

Systemmeldinger (`type: 'system'`) lagres i database men **vises ikke** til sluttbrukeren:

```tsx
// I MessageList.tsx / ChatMessages.tsx:
{messages.filter(m => m.type !== 'system').map(msg => (
  <MessageBubble key={msg.id} message={msg} />
))}
```

| Kategori | Lagres i DB? | Vises til bruker? | Formål |
|----------|-------------|-------------------|--------|
| `user` | ✅ | ✅ | Vanlige brukermeldinger |
| `system` | ✅ | ❌ | Interne events (reise-start, etc.) |
| `continue_choice` | ✅ | ❌ | Fortsett-valg internt |
| `image` | ✅ | ✅ (dag ≥ 15) | Bilmelding |

---

## 6. PUSHER-KONFIGURASJON

### 6.1 Kanaler og Events

| Kanal-type | Kanal-navn | Events | Formål |
|------------|-----------|--------|--------|
| Private | `conv-{conversationId}` | `message-sent` | Ny melding til mottaker |
| Private | `conv-{conversationId}` | `message-updated` | Redigert melding |
| Private | `conv-{conversationId}` | `typing-start` | Typing starter |
| Private | `conv-{conversationId}` | `typing-stop` | Typing stopper |

### 6.2 Frontend-kobling (hooks/useChatRealtime.ts)

```ts
useEffect(() => {
  if (!pusher || !conversationId) return;
  
  const channelName = `conv-${conversationId}`;
  const channel = pusher.subscribe(channelName);
  
  channel.bind('message-sent', (data) => {
    addMessage(data);              // Legg til i local state
  });
  
  channel.bind('typing-start', () => {
    setPartnerTyping(true);        // Vis typing-indikator
  });
  
  channel.bind('typing-stop', () => {
    setPartnerTyping(false);       // Skjul typing-indikator
  });
  
  return () => pusher.unsubscribe(channelName);
}, [conversationId]);
```

---

## 7. ANIMASJONER (FadeIn + Stagger)

| Komponent | Animasjon | Bibliotek |
|-----------|-----------|-----------|
| `MessageBubble` | FadeIn (oppe → ned) | Framer Motion |
| `MessageList` | staggerChildren (0.05s delay per child) | Framer Motion |
| `ChatContainer` | Layout-animation ved resize | Framer Motion |
| Typing-indikator | Pulsating dots | CSS animasjon |

---

## 8. SIKKERHETSMERKNADER

| Sjekk | Status | Detaljer |
|-------|--------|----------|
| Auth på send | ✅ | `getServerSession()` + ownership-sjekk |
| Auth på henting av meldinger | ⚠️ | Har auth, men **ingen ownership-sjekk** — kan hente vilkårlig conversationId |
| Systemmeldinger filtreres | ✅ | `type !== 'system'` i frontend |
| BliKjentPanel bruker kun DB-data | ✅ | Ingen AI-generering |
| Bilder låst opp dag ≥ 15 | ✅ | `isPhotosAllowed(day)` sjekk i backend og frontend |

---

*Dokument generert som del av full system audit & hardening plan (DEL 4).*