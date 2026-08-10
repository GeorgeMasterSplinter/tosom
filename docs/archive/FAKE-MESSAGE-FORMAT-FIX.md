# Fake Message Format Fix

**Dato:** 30. juni 2026  
**Status:** ✅ Løyst

---

## Problem

Fake match oppretta ingen startmelding i samtalen. Chat-samtalen blei tom, og brukaren kunne ikkje sjå nokon meldingar.

## Rotårsak

`createFakeMatch.ts` oppretta berre ein `conversation`-post, men ingen `message`-post. Utan meldingar i databasen viser chat UI tom state med "Det er tomt her — men det blir ikkje det."

## Løysing

Laegde til ein startmelding i `createFakeMatch.ts` rett etter oppretting av conversation:

```typescript
// Opprett første melding frå userA
await prisma.message.create({
  data: {
    conversationId: convo.id,
    senderId: userA.id,
    content: "Hei! Dette er ein test-samtale 😊",
    type: "user",
  },
});
```

### Viktig: Schema-korrekt feltnamn

Prisma schema (line 353-371) definerer Message-modellen med:

- `content` — ikkje `text` (skilnad! Schemaet bruker `content`)
- `type` — MessageCategory enum (`user`, `system`, `continue_choice`, `image`)
- `state` — MessageState enum (`SENT`, `DELIVERED`, `READ`, `DELETED`)
- `senderId` — referanse til User
- `conversationId` — referanse til Conversation

---

## Filendringar

| Fil | Endring |
|-----|---|
| `app/actions/createFakeMatch.ts` | +første melding med `content` og `type: "user"` |

---

## Teststeg

1. Gå til `/api/dev-login?userId=test-user-1` (slett cookies først)
2. Fullfør onboarding til steg 10
3. Klikk "Start reisen"
4. Bekreft at chat viser startmeldinga "Hei! Dette er ein test-samtale 😊"
5. Bekreft at ingen spinner er synleg