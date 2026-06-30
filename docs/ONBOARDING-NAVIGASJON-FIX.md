# ToSom — Onboarding Navigasjonsfix
**Dato:** 30. juni 2026
**Status:** Fullført

---

## PROBLEM

“Fortsett til neste steg”-knappen på Steg 2 (Personlighet) navigerte ikkje vidare.

### Rotårsak

I `Step2Personlighet.tsx` hadde PremiumButton knappen:

```tsx
<PremiumButton onClick={() => onChange('next', true)}>
  Fortsett til neste steg
</PremiumButton>
```

Dette berre lagrar data, men kallar **ikkje** `onNext` som går til neste steg.

I tillegg mottok Steg 2 **ingen `onNext` prop** frå OnboardingFlow.

---

## LØYSING

### 1. Oppdatert Step2Personlighet.tsx

**La til `onNext` prop:**
```tsx
interface Props {
  data: Record<string, unknown>;
  onChange: (field: string, value: unknown) => void;
  onBack: () => void;
  onNext: () => void;  // NY
}
```

**Oppdatert PremiumButton onClick:**
```tsx
<PremiumButton onClick={onNext}>  <!-- Ikkje lenger onChange('next', true) -->
  Fortsett til neste steg
</PremiumButton>
```

### 2. Oppdatert OnboardingFlow.tsx

**La til `onNext={handleNext}` prop:**
```tsx
case 1:
  return <Step2Personlighet {...baseProps} onBack={() => goToStep(0)} onNext={handleNext} />;
```

---

## VERIFIKASJON

### Steg-nummerering

| Steg (index) | Navn | case-nummer |
|--|-----|---------|
| 0 | Grunnprofil | case 0 |
| 1 | Personlighet | case 1 |
| 2 | Tilknytning | case 2 |
| 3 | Kjærlighetsspråk | case 3 |
| 4 | Livsstil & verdier | case 4 |
| 5 | Framtid & visjon | case 5 |
| 6 | Lek, humor & personlighet | case 6 |
| 7 | Moden nysgjerrighet | case 7 |
| 8 | Oppsummering | case 8 |
| 9 | Start reisen | case 9 |

### Navigasjonsflyt

```
Steg 0 → onNext → goToStep(1) → Step 1
Steg 1 → onNext → handleNext → goToStep(2) → Step 2
Steg 2 → onNext → handleNext → goToStep(3) → Step 3
...
Steg 8 → onNext → goToStep(9) → Step 9
Steg 9 → onStart → handleStartReisen → matching
```

---

## OPPDATTE FILER

| Fil | Endring |
|-----|---|
| `Step2Personlighet.tsx` | La til `onNext` prop, endra PremiumButton onClick |
| `OnboardingFlow.tsx` | La til `onNext={handleNext}` prop i case 1 |

---

## TESTLISTE

- [ ] Trykk "Fortsett" på Steg 1 → går til Steg 2
- [ ] Trykk "Fortsett" på Steg 2 → går til Steg 3
- [ ] Trykk "Tilbake" på Steg 2 → går til Steg 1
- [ ] Navigasjon fungerer på alle steg

---

## OPPSUMMERING

**Problem:** onClick brukte `onChange('next', true)` i staden for `onNext`.
**Løysing:** La til `onNext` prop og bruk det i PremiumButton.
**Resultat:** Navigasjon fungerer no korrekt på Steg 2.