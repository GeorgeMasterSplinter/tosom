# Chat Room Module — Full Mapping Report

**Dato:** 2026-06-30  
**Status:** Full kartlegging ferdig

---

## 1. FILER SOM FINNES

### 1.1 app/chat/*
```
app/chat/
├── page.tsx                    ← Chat List Page (MEGAMODUL)
└── [id]/
    └── page.tsx               ← Chat Detail Page (MEGAMODUL)
        └── components/
            └── QuestionModal.tsx
```

### 1.2 components/chat/*
```
components/chat/
├── ChatBubble.tsx              ← Legacy bubble-komponent
├── ChatHeader.tsx              ← Chat header
├── ChatInputBar.tsx            ← Input bar
├── ChatList.tsx                ← Chat list komponent
├── ChatMessageBubble.tsx       ← Message bubble
├── ChatPanel.tsx               ← Chat panel
├── ChatPanelDemo.tsx           ← Demo-komponent
├── ChatView.tsx                ← Chat view
├── ChatViewDemo.tsx            ← Demo-komponent
└── ChatWindow.tsx              ← Chat window (DEPRECATED i toppen)
```

### 1.3 components/* (rot — chat-relaterte)
```
components/
├── ChatList.tsx                ← ROOT-variant (DEPRECATED)
├── ChatWindow.tsx              ← ROOT-variant (DEPRECATED)
├── DashboardMatchBanner.tsx
├── DashboardMatchStatus.tsx
├── MatchActions.tsx
├── MatchBreakdown.tsx
├── MatchBreakdownItem.tsx
└── NotificationCenter.tsx
```

### 1.4 hooks/*
```
hooks/
├── useChatMessages.ts          ← Meldinger hook (REST + polling)
├── useChatRealtime.ts          ← Pusher sanntid hook
└── useTypingIndicator.ts       ← (eksportert fra useChatRealtime)
```

### 1.5 app/api/chat/*
```
app/api/chat/
├── send/
│   └── route.ts               ← Send melding (POST)
├── image-permission/
│   └── route.ts               ← Bilde-rettigheter
├── messages/
│   └── route.ts               ← Hent meldinger (GET)
├── conversations/
│   └── route.ts               ← Hent konversasjonar (GET)
└── starter/
    └── route.ts               ← AI starter-meldingar
```

### 1.6 app/api/* (chat-relaterte)
```
app/api/conversation/
├── [id]/
│   ├── send/route.ts          ← Alternative send-rute
│   ├── messages/route.ts      ← Alternative messages-rute
│   ├── read/route.ts          ← Read-status
│   └── route.ts              ← Conversation info
└── route.ts                  ← List conversations
```

### 1.7 app/actions/*
```
app/actions/
└── createFakeMatch.ts         ← Server action for test-data
```

### 1.8 app/chat/[id]/components/
```
app/chat/[id]/components/
└── QuestionModal.tsx          ← Modal for samtale-spørsmål
```

### 1.9 Components i rot (ikke chat, men relaterte)
```
components/
├── ChatList.tsx               ← ROOT-ChatList (DEPRECATED)
├── ChatWindow.tsx             ← ROOT-ChatWindow (DEPRECATED)
├── DashboardMatchBanner.tsx
├── DashboardMatchStatus.tsx
├── MatchActions.tsx
├── MatchBreakdown.tsx
├── MatchBreakdownSkeleton.tsx
├── MatchCardSkeleton.tsx
├── MatchPopup.tsx
├── NotificationCenter.tsx
├── PublicMatchCard.tsx
├── Recommendation.tsx
└── ChatPanel.tsx              ← (dersom eksisterer i root)
```

### 1.10 Components i subdirs (relaterte)
```
components/dashboard/           ← Dashboard-skap (eksisterte ikkje)
components/match/               ← Match-komponentar (eksisterte ikkje)
components/conversation/
├── ContinueChoice.tsx
├── ConversationView.tsx
├── JourneyEndNotice.tsx
├── JourneyTimeline.tsx
├── MessageBubble.tsx
├── SystemMessage.tsx
└── TypingIndicator.tsx
```

---

## 2. FILER SOM MANGELER

### 2.1 Manglande hooks
- `hooks/useSendMessage.ts` — Skal ha send-logikk (fra spesifikasjonen)
- `hooks/useChatRoom.ts` — Sentral chat room state management
- `hooks/useChatTyping.ts` — typing-logikk separat

### 2.2 Manglande API-ruter
- `app/api/chat/typing/route.ts` — Typing-indikator endpoint
- `app/api/chat/accept/route.ts` — Accept match endpoint

### 2.3 Manglande komponentar
- `components/chat/ChatRoom.tsx` — Hoved chat room container
- `components/chat/ChatMessages.tsx` — Meldings-liste
- `components/chat/ChatInput.tsx` — Input komponent
- `components/chat/PartnerInfo.tsx` — Partner-info panel

### 2.4 Manglande database
- `prisma/schema.prisma` — Schema manglar (verifisert)

---

## 3. DUPLIKATER

### 3.1 ChatList-dublikatar
| Fil | Status |
|-----|--------|
| `components/ChatList.tsx` | DEPRECATED (rot) |
| `components/chat/ChatList.tsx` | Aktiv |
| `app/chat/page.tsx` | Aktiv (egen implementasjon) |

### 3.2 ChatWindow-dublikatar
| Fil | Status |
|-----|--------|
| `components/ChatWindow.tsx` | DEPRECATED (rot, har header om root) |
| `components/chat/ChatWindow.tsx` | Aktiv (har deprecated-merkning i toppen) |

### 3.3 Messages-ruter
| Rut | Status |
|-----|--------|
| `app/api/chat/messages/route.ts` | Aktiv (primary) |
| `app/api/conversation/[id]/messages/route.ts` | Legacy (alternative) |

### 3.4 Send-ruter
| Rut | Status |
|-----|--------|
| `app/api/chat/send/route.ts` | Aktiv (primary) |
| `app/api/conversation/[id]/send/route.ts` | Legacy (alternative) |

---

## 4. LEGACY-FILER

### 4.1 Legacy komponentar (kan fjernast)
- `components/ChatBubble.tsx` — Aldri brukt i production
- `components/chat/ChatBubble.tsx` — Aldri brukt
- `components/chat/ChatPanelDemo.tsx` — Demo
- `components/chat/ChatViewDemo.tsx` — Demo
- `components/chat/ChatMessageBubble.tsx` — Aldri brukt
- `components/chat/ChatPanel.tsx` — Aldri brukt
- `components/ChatList.tsx` — ROOT-variant (deprecated)

### 4.2 Legacy API-ruter
- `app/api/conversation/` — Heile mappan er legacy (erstattet av `app/api/chat/`)

---

## 5. FEILPLASSERTE FILER

| Fil | Burde flyttast til |
|-----|-------------------|
| `app/chat/[id]/components/QuestionModal.tsx` | `components/chat/QuestionModal.tsx` |
| `components/ChatList.tsx` (rot) | Fjern (deprecated) |
| `components/ChatWindow.tsx` (rot) | Fjern (deprecated) |

---

## 6. RUTER SOM PEKER TIL FILER

### 6.1 Navigasjon
| rute | Peikar til | Eksisterer? |
|------|-----------|-------------|
| `/chat` | `app/chat/page.tsx` | ✅ |
| `/chat/[id]` | `app/chat/[id]/page.tsx` | ✅ |
| `/dashboard` | (eksisterer ikkje i app/) | ❌ |
| `/conversation/[id]` | `app/api/conversation/[id]/route.ts` | Legacy |

### 6.2 API-kallar frå frontend
| Endpoint | Metoder | Brukt av | Status |
|----------|---------|----------|--------|
| `/api/chat/conversations` | GET | `app/chat/page.tsx` | ✅ |
| `/api/chat/messages?conversationId=X` | GET | `hooks/useChatMessages.ts` | ✅ |
| `/api/chat/messages` | POST | `app/chat/[id]/page.tsx` | ✅ |
| `/api/chat/starter` | POST | `app/chat/[id]/page.tsx` | ✅ |
| `/api/chat/image-permission` | GET | (ukjent) | ✅ |
| `/api/chat/send` | POST | (ukjent) | ✅ |
| `/api/auth/signin?json=true` | GET | begge chat-pages | ✅ (next-auth) |
| `/api/conversation/[id]/messages` | GET | legacy | ⚠️ |
| `/api/conversation/[id]/send` | POST | legacy | ⚠️ |
| `/api/conversation/route.ts` | GET | legacy | ⚠️ |

---

## 7. SERVER ACTIONS

| Action | Fil | Brukt av | Status |
|--------|-----|----------|--------|
| `createFakeMatch` | `app/actions/createFakeMatch.ts` | Dev/testing | ✅ |

---

## 8. PRISMA MODELER (estimert basert på kodebruk)

Basert på kode-analyse:

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  createdAt DateTime @default(now())
  profile   Profile?
  sessions  Session?
  messages  Message[]
  convosA   Conversation[] @relation("UserA")
  convosB   Conversation[] @relation("UserB")
}

model Profile {
  id           String   @id @default(uuid())
  userId       String   @unique
  user         User     @relation(fields: [userId], references: [id])
  identityName String?
  age          Int?
  bio          String?
  interests    String[]
  matchTags    String[]
  // ...onboarding fields
}

model Conversation {
  id           String    @id @default(uuid())
  userAId      String
  userBId      String
  userA        User      @relation("UserA", fields: [userAId], references: [id])
  userB        User      @relation("UserB", fields: [userBId], references: [id])
  messages     Message[]
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}

model Message {
  id           String    @id @default(uuid())
  conversationId String
  conversation  Conversation @relation(fields: [conversationId], references: [id])
  senderId     String
  sender       User      @relation(fields: [senderId], references: [id])
  content      String
  type         String?   // "user" | "system" | "ai"
  createdAt    DateTime  @default(now())
}
```

---

## 9. HOOKS ANALYSE

### useChatMessages.ts
- **Hva:** Henter meldingar for ei conversation via REST
- **Hvordan:** GET `/api/chat/messages?conversationId=X`
- **Polling:** Kvart 5. sekund
- **Status:** ✅ Brukt i `app/chat/[id]/page.tsx`

### useChatRealtime.ts
- **Hva:** Pusher-sanntid for nye meldingar, conversation updates, typing
- **Kanalar:** `conversation-{id}`, `user-{userId}`
- **Event:** `new-message`, `conversation-updated`, `typing`
- **Status:** ✅ Brukt i begge chat-pages

### useTypingIndicator
- **Hva:** Eksportert fra useChatRealtime
- **Status:** ✅ Brukt i `app/chat/[id]/page.tsx`

---

## 10. SAMMENDRAG

### Finner (eksisterende)
- 2 chat-pages (`/chat`, `/chat/[id]`)
- 10+ chat-komponentar (mange deprecated/ugbrukte)
- 5 chat-API-ruter (`/api/chat/*`)
- 5 conversation-API-ruter (legacy)
- 2 hooks (useChatMessages, useChatRealtime)
- 1 server action (createFakeMatch)

### Manglar
- Clean ChatRoom-komponentar (ChatRoom, ChatHeader, ChatMessages, ChatInput)
- useSendMessage hook
- Typing API-rute
- prisma/schema.prisma
- middleware.ts (bekreftet ikkje eksisterer)

### Treng rydding
- Dublikate ChatList, ChatWindow i rot
- Legacy conversation/ API-ruter
- Demo-komponentar
- Ubbrukte bubble/komponentar