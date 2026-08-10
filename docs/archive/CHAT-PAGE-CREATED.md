# ToSom — Chat-side oppretta
**Dato:** 30. juni 2026
**Status:** Fullført

---

## OPPSUMMERING

`app/chat/[id]/page.tsx` eksisterer allereie som ei fullverdig chat-side med:
- Pusher-sanntid for nye meldingar
- Typing-indikator
- AI-chatstarter
- Glassmorphism + gull UI
- Smooth auto-scroll
- Fade-in animasjonar

---

## FILER

| Fil | Beskrivning |
|-----|-|
| `app/chat/[id]/page.tsx` | Fullverdig chat-side med sanntid, meldingar, AI-starter |

---

## FUNKSJONAR

| Funksjon | Beskrivning |
|--|-|
| `useChatMessages` | Hentar meldingar fra /api/chat/messages |
| `useChatRealtime` | Pusher-sanntid for nye meldingar |
| `useTypingIndicator` | Typing-indikator for motpart |
| `sendMessage` | Send melding via /api/chat/messages |
| `fetchStarters` | Hentar AI-chatstarter frå /api/chat/starter |
| `sendStarterMessage` | Send AI-starter som melding |

---

## PRISMA MODELLAR

### Conversation
```prisma
model Conversation {
  id        Int      @id @default(autoincrement())
  userAId   Int
  userBId   Int
  createdAt DateTime @default(now())
  messages  Message[]
}
```

### Message
```prisma
model Message {
  id          Int      @id @default(autoincrement())
  conversationId Int
  senderId    String
  content     String
  createdAt   DateTime @default(now())
  conversation Conversation @relation(fields: [conversationId], references: [id])
}
```

---

## CHAT-RUTER

| Rute | Beskrivning |
|--|-|
| `/chat` | Chat-oversikt |
| `/chat/[id]` | Ein samtale |
| `/api/chat/messages` | Meldings-API |
| `/api/chat/starter` | AI-chatstarter |

---

## DESIGN

| Element | Verdi |
|--|-|
| Bakgrunn | `#0B0E11` |
| Eigen bubble | `rgba(212, 175, 55, 0.12)` |
| Motpart bubble | `rgba(255, 255, 255, 0.06)` |
| Border | `rgba(255, 255, 255, 0.1)` |
| Gold | `#D4AF37` |

---

## RAPPORT

Lagd i `docs/CHAT-PAGE-CREATED.md`.

---

**Chat-sida eksisterer og er klar for bruk.**