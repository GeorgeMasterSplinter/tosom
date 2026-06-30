# ToSom — Fake Match og Chat-ruting
**Dato:** 30. juni 2026
**Status:** Fullført

---

## OPPSUMMERING

Lagde ein fake match-server action som lager ein dummy-bruker og conversation, så brukaren blir omdirigert til chat-sida etter å ha trykt "Start reisen".

---

## OPPRETTEDE FILER

| Fil | Beskrivning |
|-----|--|
| `app/actions/createFakeMatch.ts` | Server action som lager dummy-bruker + conversation |

## OPPDATTEDE FILER

| Fil | Endring |
|-----|-|
| `Step10StartReisen.tsx` | La til `handleStart` med `createFakeMatch` import |
| `OnboardingFlow.tsx` | Fjerna `onNext` prop frå Steg 10 |

---

## SERVER ACTION: createFakeMatch()

```tsx
"use server";

import prisma from "@/lib/prisma";

export async function createFakeMatch() {
  // Opprett dummy-bruker om ikkje eksisterer
  const [userB] = await prisma.user.upsert({
    where: { id: 999 },
    update: {},
    create: {
      id: 999,
      name: "Testbruker",
      age: 30,
      gender: "Kvinne",
      email: `test999@tosom.no`,
      createdAt: new Date(),
    },
  });

  // Opprett conversation
  const convo = await prisma.conversation.create({
    data: {
      userAId: 1,
      userBId: userB.id,
    },
  });

  return convo.id;
}
```

---

## STEP 10 OPPDATERT

```tsx
import { createFakeMatch } from '@/app/actions/createFakeMatch';

interface Props {
  step: number;
  goToStep: (s: number) => void;
  loading: boolean;
}

export default function Step10StartReisen({ step, goToStep, loading }: Props) {
  const handleStart = async () => {
    try {
      const convoId = await createFakeMatch();
      window.location.href = `/chat/${convoId}`;
    } catch (err) {
      console.error('Fake match failed:', err);
    }
  };

  return (
    ...
    <PremiumButton onClick={handleStart} disabled={loading}>
      {loading ? 'Matcher deg…' : 'Start reisen'}
    </PremiumButton>
    ...
  );
}
```

---

## ONBOARDINGFLOW CASE 9

```tsx
case 9:
  return <Step10StartReisen step={step} goToStep={goToStep} loading={saving} />;
```

---

## CHAT-RUTE

Chat-sida eksisterer:
- `app/chat/page.tsx`
- `app/chat/[id]/page.tsx`

---

## NAVIGASJONSFLYT

```
Steg 10 → "Start reisen" → createFakeMatch() → /chat/{convoId}
```

---

## DUMMY-BRUKER

| Feld | Verdi |
|--|-|
| id | 999 |
| name | Testbruker |
| age | 30 |
| gender | Kvinne |
| email | test999@tosom.no |

---

## TESTLISTE

- [ ] Fullfør onboarding til Steg 10
- [ ] Trykk "Start reisen"
- [ ] Sjekk at fake match blir oppretta i databasen
- [ ] Sjekk at brukaren blir omdirigert til /chat/{convoId}
- [ ] Sjekk at chat-sida visast korrekt

---

## RAPPORT

Lagd i `docs/FAKE-MATCH-CHAT-ROUTING.md`.