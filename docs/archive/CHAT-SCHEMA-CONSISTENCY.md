# ToSom — Chat schema-konsistensrapport
**Dato:** 30. juni 2026
**Status:** Schema er konsistent — ingen endring trengst

---

## OPPSUMMERING

Schemaet er allereie perfekt konsistent. Ein har analysert alle relaterte modellar og felter, og det finst ingen datatypemismatch mellom Message.senderId, Conversation.userAId, og User.id.

---

## ANALYSEDE MODELLAR

### User-modell
```prisma
model User {
  id   String @id @default(cuid())
  ...
}
```
- **User.id:** `String` (cuid)

### Conversation-modell
```prisma
model Conversation {
  id       String @id @default(cuid())
  userAId  String
  userBId  String
  ...
  messages Message[]
}
```
- **Conversation.id:** `String` (cuid)
- **Conversation.userAId:** `String`
- **Conversation.userBId:** `String`

### Message-modell
```prisma
model Message {
  id           String @id @default(cuid())
  conversationId String
  senderId     String
  content      String
  ...
}
```
- **Message.id:** `String` (cuid)
- **Message.conversationId:** `String`
- **Message.senderId:** `String`
- **Message.sender (relation):** `User @relation(fields: [senderId], references: [id])`

---

## RELASJONAR

| Relasjon | Type | Konsistent? |
|--|--|--|
| Message.sender → User.id | String → String | ✅ |
| Message.conversation → Conversation.id | String → String | ✅ |
| Conversation.userA → User.id | String → String | ✅ |
| Conversation.userB → User.id | String → String | ✅ |

---

## RESULTAT

| Modell | id type | sender/userA/userB |
|-|--|-|
| User | String | N/A |
| Conversation | String | String |
| Message | String | String |

**Alle felter er String — ingen datatypemismatch.**

---

## KONKLUSJON

- ✅ Ingen mismatch mellom Message.senderId og Conversation.userAId/userBId
- ✅ Ingen migrering trengst
- ✅ Ingen endring i Prisma-modellar er nødvendig
- ✅ Chat-routing-feilen du opplevde ikkje skyldes datatypar

---

## NESTE STEG

Sidan schema er konsistent og fake match fungerer, bør neste sjekk vere:

1. **Step10StartReisen → handleStart → window.location.href** (verifiser routing)
2. **Konverter fake match til riktig userId** (i staden for hardcoded userAId=1)
3. **Test full onboarding → Start reisen → chat**

---

## RAPPORT

Lagd i `docs/CHAT-SCHEMA-CONSISTENCY.md`.

---

**Schema er konsistent — ingen endring trengst. Feilen ligg truleg i routing-loget mellom Steg 10 og chat-sida.**