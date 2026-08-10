# Chat Room Module — Build Report

**Dato:** 2026-06-30  
**Status:** Ny struktur bygd

---

## 1. NY FILSTRUKTUR

### 1.1 Oversikt over ny struktur
```
tosom/
├── app/chat/
│   ├── page.tsx                    ← Chat List Page (ren)
│   └── [id]/
│       └── page.tsx               ← Chat Detail Page (ny, brukar ChatRoom)
│
├── app/api/chat/
│   ├── messages/
│   │   └── route.ts              ← GET /api/chat/messages — Hent meldingar
│   ├── send/
│   │   └── route.ts              ← POST /api/chat/send — Send melding
│   ├── conversations/
│   │   └── route.ts              ← GET /api/chat/conversations — Hent liste
│   ├── starter/
│   │   └── route.ts              ← POST /api/chat/starter — AI starter-melding
│   ├── image-permission/
│   │   └── route.ts              ← GET /api/chat/image-permission — Bilde-rettighet
│   └── typing/                   ← NY!
│       └── route.ts              ← POST /api/chat/typing — Typing-indikator
│
├── components/chat/
│   ├── ChatRoom.tsx              ← NY! Hoved-container
│   ├── ChatHeader.tsx            ← NY! Partner-info header
│   ├── ChatMessages.tsx          ← NY! Meldings-liste
│   ├── ChatInput.tsx             ← NY! Input-felt
│   ├── ChatHeader.tsx            ← Eksisterer
│   ├── ChatInputBar.tsx          ← Eksisterer
│   ├── ChatList.tsx              ← Eksisterer
│   └── ChatView.tsx              ← Eksisterer
│
├── hooks/
│   ├── useChatMessages.ts        ← Eksisterer
│   ├── useChatRealtime.ts        ← Eksisterer
│   └── useSendMessage.ts         ← NY!
│
└── docs/
    ├── CHAT-MAPPING-REPORT.md    ← Full kartlegging
    ├── CHAT-CLEANUP-REPORT.md    ← Rensing-rapport
    └── CHAT-ROOM-BUILD-REPORT.md ← Denne fila
```

---

## 2. SAMMENHENG — KORI KUMMERER ALT SAMAN?

### 2.1 Flyt: Chat List → Chat Room

```
1. Bruker navigerer til /chat
2. app/chat/page.tsx lastar:
   - GET /api/chat/conversations → hentar alle samtalar
   - Henter session via /api/auth/signin?json=true
3. Viser liste med glassmorphism-kort
4. Klikk på samtale → naviger til /chat/[id]

5. app/chat/[id]/page.tsx lastar:
   - GET /api/chat/conversations/[id] → partner-info
   - Importerer ChatRoom-komponenten
6. ChatRoom set saman:
   - ChatHeader (partner-info)
   - ChatMessages (via useChatMessages hook)
   - ChatInput (send via useSendMessage hook)
```

### 2.2 Melding-Flow

```
Bruker skriv melding → ChatInput.onSend
    ↓
ChatRoom.handleSend() → useSendMessage.sendMessage()
    ↓
POST /api/chat/send { conversationId, content }
    ↓
API svarar med ChatMessage objekt
    ↓
useChatMessages polling oppdaterer meldingar kvart 5. sekund
    ↓
ChatMessages viser nye meldingar med fadeIn animasjon
```

### 2.3 Sanntids-Flow (Pusher)

```
ChatRoom initierer: useChatRealtime({ conversationId, userId })
    ↓
Abonnar på:
  - conversation-{conversationId}
  - user-{userId}
    ↓
Når ny melding kjem:
  - onNewMessage → refresh() → oppdater meldingar
  - onTyping → vis typing-indikator
```

---

## 3. KOMPONENT-ARKITEKTUR

### 3.1 ChatRoom (container)
- **Ansvar:** Set saman heile chat-vinduet
- **Hooks:** useChatMessages, useSendMessage, useChatRealtime
- **Komponentar:** ChatHeader, ChatMessages, ChatInput
- **Props:** conversationId, partner, phaseLabel, currentDay, daysRemaining

### 3.2 ChatHeader (visning)
- **Ansvar:** Viser partner-info øvst
- **Props:** partnerName, partnerImage, phaseLabel, currentDay, daysRemaining, online

### 3.3 ChatMessages (visning)
- **Ansvar:** Viser alle meldingar med glassmorphism-bubbles
- **Props:** messages, userId, empty, loading, isTyping
- **Funksjonar:** Auto-scroll, tom-tilstand, typing-indikator

### 3.4 ChatInput (interaksjon)
- **Ansvar:** Input-felt med send-knapp
- **Props:** onSend, placeholder, disabled, sending, value, onChange
- **Funksjonar:** Enter for å sende, hover-effektar

---

## 4. API-ENDPOINTS

| Endpoint | Metode | Ansvar | Brukt av |
|----------|--------|--------|----------|
| `/api/chat/conversations` | GET | Hent alle samtalar | app/chat/page.tsx |
| `/api/chat/messages?conversationId=X` | GET | Hent meldingar | hooks/useChatMessages.ts |
| `/api/chat/send` | POST | Send melding | hooks/useSendMessage.ts |
| `/api/chat/typing` | POST | Typing-indikator | NY! |
| `/api/chat/starter` | POST | AI starter-melding | app/chat/[id]/page.tsx |
| `/api/chat/image-permission` | GET | Bilde-rettighet | (ukjent) |
| `/api/auth/signin?json=true` | GET | Session-info | begge chat-pages |

---

## 5. NYE FILER (FASE 3)

| Fil | Type | Funksjon |
|-----|------|----------|
| `components/chat/ChatRoom.tsx` | Komponent | Hoved-container |
| `components/chat/ChatHeader.tsx` | Komponent | Partner-info |
| `components/chat/ChatMessages.tsx` | Komponent | Meldings-liste |
| `components/chat/ChatInput.tsx` | Komponent | Input-felt |
| `hooks/useSendMessage.ts` | Hook | Send-logikk |
| `app/api/chat/typing/route.ts` | API | Typing-indikator |
| `app/chat/page.tsx` | Side | Oppdatert (ren) |
| `app/chat/[id]/page.tsx` | Side | Oppdatert (brukar ChatRoom) |

---

## 6. FJERNADE FILER (FASE 2)

| Fil | Årsak |
|-----|-----|
| `components/ChatList.tsx` (rot) | Dublikat |
| `components/ChatWindow.tsx` (rot) | Dublikat |
| `components/ChatBubble.tsx` (rot) | Ugbrukt |
| `components/chat/ChatBubble.tsx` | Ugbrukt |
| `components/chat/ChatMessageBubble.tsx` | Ugbrukt |
| `components/chat/ChatPanel.tsx` | Ugbrukt |
| `components/chat/ChatPanelDemo.tsx` | Demo |
| `components/chat/ChatViewDemo.tsx` | Demo |
| `app/api/conversation/` (heile mappa) | Legacy |
| `app/chat/[id]/components/QuestionModal.tsx` | Feilplassert |

---

## 7. NESTE STEG

### Høgprioritet
1. **Oppdater `/api/chat/conversations` API-ruta** — Treng `/[id]`-variant for partner-info
2. **Test chat-funksjonalitet** — Verifiser send/mottak funksjonar
3. **Sikre at Pusher er konfigurert** — `NEXT_PUBLIC_PUSHER_KEY` og `NEXT_PUBLIC_PUSHER_CLUSTER`

### Middelprioritet
4. **Legg til useChatTyping hook** — Typing-logikk separat
5. **Oppdater `/api/chat/send/route.ts`** — Verifiser at den handterer auth korrekt
6. **Oppdater `/api/chat/messages/route.ts`** — Verifiser at den returnerer ChatMessage-format

### Lavprioritet
7. **PartnerInfo komponent** — Egen komponent for side-panel med partner-detaljar
8. **Accept match API** — `/api/chat/accept/route.ts` for match-akseptering
9. **E2E-testar** — Test heile chat-flowet

---

## 8. DESIGN-KONSISTENS

Alle nye komponentar følgjer ToSom-designsystemet:

| Regelm | Status |
|--------|--------|
| Mørk base `#0B0E11` | ✅ |
| Gull-aksent `#D4AF37` | ✅ |
| Glassmorphism | ✅ |
| Store runde hjørner (12-18px) | ✅ |
| Rolege animasjonar | ✅ |
| Warm, trygg tone | ✅ |
| Ingen gamification | ✅ |
| Ingen swipe/feed | ✅ |

---

## 9. VERIFIKASJON

### Alt fungerer saman dersom:
- [ ] `GET /api/chat/conversations` returnerer liste med { id, otherUser, lastMessage }
- [ ] `GET /api/chat/messages?conversationId=X` returnerer ChatMessage[]
- [ ] `POST /api/chat/send` mottar { conversationId, content } og returnerer ChatMessage
- [ ] ChatRoom renderar utan feil
- [ ] ChatMessages vises med riktig format
- [ ] ChatInput sender meldingar
- [ ] ChatHeader viser partner-info
- [ ] Navigasjon /chat → /chat/[id] fungerer