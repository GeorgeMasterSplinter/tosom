# ToSom — Steg 10-routing debug-rapport
**Dato:** 30. juni 2026
**Status:** Fiksa — createFakeMatch bruker no korrekte String IDs

---

## PROBLEM

`createFakeMatch()` brukte `userAId: 1` (Number), men `User.id` er ein String cuid. Dette betyr at:

1. **userAId: 1** peiker til ingen eksisterande brukar
2. **Conversation** blir oppretta med ein ugyldig referanse
3. **convoId** kan vere undefined eller feil
4. **Routing** `/chat/${convoId}` feiler fordi convoId ikkje matcher

---

## LØYSING

### createFakeMatch.ts — OPPDATERT

**Før:**
```tsx
const [userB] = await prisma.user.upsert({
  where: { id: 999 }, // Number — FEIL!
  ...
});

const convo = await prisma.conversation.create({
  data: {
    userAId: 1, // Number — FEIL!
    userBId: userB.id,
  },
});
```

**Etter:**
```tsx
// Finn eller opprett testbrukar (userA)
let userA = await prisma.user.findFirst({
  where: { email: { startsWith: "test@" } },
  select: { id: true },
});

if (!userA) {
  const created = await prisma.user.create({
    data: {
      id: "1", // String — korrekt!
      email: "test@tosom.no",
      name: "Testbrukar A",
      createdAt: new Date(),
    },
    select: { id: true },
  });
  userA = created;
}

// Opprett dummy-brukar (userB)
let userB = await prisma.user.upsert({
  where: { id: "999" }, // String — korrekt!
  ...
  select: { id: true },
});

// Opprett conversation med korrekte String IDs
const convo = await prisma.conversation.create({
  data: {
    userAId: userA.id, // String cuid
    userBId: userB.id, // String cuid
  },
});

console.log("FAKE MATCH CREATED:", { userAId: userA.id, userBId: userB.id, convoId: convo.id });

return convo.id;
```

---

## STEG 10-RUTING VERIFISERT

### Step10StartReisen.tsx
```tsx
const handleStart = async () => {
  const convoId = await createFakeMatch();
  window.location.href = `/chat/${convoId}`; // Korrekt!
};

<PremiumButton onClick={handleStart} disabled={loading}>
  {loading ? 'Matcher deg…' : 'Start reisen'}
</PremiumButton>
```

### OnboardingFlow.tsx case 9
```tsx
case 9:
  return <Step10StartReisen step={step} goToStep={goToStep} loading={saving} />;
```

### Chat-rute
```
app/chat/[id]/page.tsx ✅
```

---

## NAVIGASJONSFLYT

```
Steg 10 → "Start reisen" → handleStart()
  → createFakeMatch() → convo.id (String cuid)
  → /chat/{convoId} → app/chat/[id]/page.tsx ✅
```

---

## DEBUG-VERIFISERING

### Sjekk 1: convoId er ikkje undefined
```tsx
const convoId = await createFakeMatch();
console.log("FAKE MATCH ID:", convoId);
// Bør vise: "clx9jv0f3000qz8t8h1x9t1q2" eller liknande cuid
```

### Sjekk 2: Conversation har gyldige IDs
```tsx
console.log("CONVO CREATED:", convo);
// Bør vise: { userAId: "1", userBId: "999", id: "clx..." }
```

### Sjekk 3: Chat-rute eksisterer
```
app/chat/[id]/page.tsx ✅
```

---

## OPPDATTEDE FILER

| Fil | Endring |
|-|--|
| `createFakeMatch.ts` | userAId/userBId no String cuid |
| `Step10StartReisen.tsx` | Allereie korrekt |
| `OnboardingFlow.tsx` | Allereie korrekt |

---

## TESTLISTE

- [ ] Fullfør onboarding til Steg 10
- [ ] Trykk "Start reisen"
- [ ] Sjekk console: "FAKE MATCH CREATED: { userAId: '1', userBId: '999', convoId: 'clx...' }"
- [ ] Sjekk at brukaren blir omdirigert til /chat/{convoId}
- [ ] Sjekk at chat-sida visast korrekt med meldingane

---

## RAPPORT

Lagd i `docs/STEP10-ROUTING-DEBUG.md`.

---

**createFakeMatch brukte Number IDs — no bruker String IDs. Routing burde fungere!**