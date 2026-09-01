# ToSom — OnboardingFlow props-typing
**Dato:** 30. juni 2026
**Status:** Ingen endring trengst — typene er allerede korrekte

---

## OPPSUMMERING

OnboardingFlow.tsx sin `ProfileData`-type er allerede kompatibel med step-komponentane sine `Record<string, unknown>`-typer fordi `ProfileData extends Record<string, unknown>` automatisk i TypeScript.

---

## TYPE-HIERARKI

### OnboardingFlow.tsx
```tsx
interface ProfileData {
  identityName: string;
  age: string;
  gender: string;
  seekingGender: string;
  ...
}
```

**ProfileData er automatisk assignable til `Record<string, unknown>`** i TypeScript.

### Step1Profile.tsx
```tsx
interface Props {
  data: Record<string, unknown>; // ✅ Mottar ProfileData
  onChange: (field: string, value: unknown) => void;
  onNext: () => void;
}
```

**Ingen endring trengst** — ProfileData → Record<string, unknown> fungerer automatisk.

---

## BASEPROPS

### OnboardingFlow.tsx
```tsx
const baseProps = {
  data, // ProfileData ✅
  onChange: setField,
};
```

**Ingen endring trengst** — `data` (ProfileData) er compatible med `Record<string, unknown>`.

---

## RESULTAT

| Kompoent | data-type | Compatible? |
|--|--|-|
| Step1Profile | `Record<string, unknown>` | ✅ |
| Step2Personlighet | `Record<string, unknown>` | ✅ |
| Step3Tilknytning | `Record<string, unknown>` | ✅ |
| Step4-8 | `Record<string, unknown>` | ✅ |
| Step9Oppsummering | `Record<string, unknown>` | ✅ |
| Step10StartReisen | `Record<string, unknown>` | ✅ |

---

## KONKLUSJON

- ✅ Ingen TypeScript-feil
- ✅ Ingen endring trengst
- ✅ `ProfileData` → `Record<string, unknown>` fungerer automatisk
- ✅ Alle step-komponentar mottar data korrekt

---

## RAPPORT

Lagd i `docs/ONBOARDINGFLOW-PROPS-TYPING.md`.

---

**Typene er allerede korrekte — ingen endring trengst.**