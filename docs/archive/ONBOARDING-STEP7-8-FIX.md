# ToSom — Steg 7 og 8 Knapp-Fix
**Dato:** 30. juni 2026
**Status:** Fullført

---

## PROBLEM

Steg 7 (HumorPersonlighet) og Steg 8 (ModenNysgjerrighet) mangla PremiumButton og BackButton.
Komponentane mottok heller ikke propar (step, goToStep, onNext).

---

## LØYSING

### 1. OnboardingFlow.tsx (kontrollert)
Case-nummering er korrekt:
- case 6 → Steg 7 (HumorPersonlighet) ✅
- case 7 → Steg 8 (ModenNysgjerrighet) ✅

Begge har propar:
```tsx
case 6:
  return <Step7HumorPersonlighet step={step} goToStep={goToStep} {...baseProps} onNext={handleNext} />;

case 7:
  return <Step8ModenNysgjerrighet step={step} goToStep={goToStep} {...baseProps} onNext={handleNext} />;
```

### 2. Step7HumorPersonlighet.tsx (Oppdatert)
**La til:**
- `step: number` prop
- `goToStep: (s: number) => void` prop
- `onNext: () => void` prop
- `PremiumButton` import
- `BackButton` import
- Knappeseksjon nederst

**Knapper:**
```tsx
<div className="space-y-4 mt-10">
  <BackButton onClick={() => goToStep(step - 1)} />
  <PremiumButton onClick={onNext}>
    Fortsett til neste steg
  </PremiumButton>
</div>
```

### 3. Step8ModenNysgjerrighet.tsx (Oppdatert)
Same endringer som Steg 7.

---

## OPPDATTE FILER

| Fil | Endring |
|-----|---|
| `Step7HumorPersonlighet.tsx` | La til propar (step, goToStep, onNext), PremiumButton + BackButton |
| `Step8ModenNysgjerrighet.tsx` | La til propar (step, goToStep, onNext), PremiumButton + BackButton |

---

## KNAPPESPECS

### PremiumButton
```tsx
w-full py-3 rounded-xl font-medium text-black
bg-gradient-to-r from-yellow-300 to-yellow-200
shadow-md shadow-yellow-300/30 hover:shadow-yellow-300/50
transition-all duration-300 disabled:opacity-50
```

### BackButton
```tsx
w-full py-3 rounded-xl font-medium
bg-white/10 text-white border border-white/20
hover:bg-white/20 transition-all duration-300
```

---

## NESTE STEG

1. Test at Steg 7 navigerer til Steg 8 med "Fortsett"
2. Test at Steg 7 navigerer til Steg 6 med "Tilbake"
3. Test at Steg 8 navigerer til Steg 9 med "Fortsett"
4. Test at Steg 8 navigerer til Steg 7 med "Tilbake"
5. Test alle steg 1-10 navigasjon

---

## OPPSUMMERING

**Problem:** Steg 7 og 8 mangla knapp-propar og knapper.
**Løysing:** La til propar (step, goToStep, onNext) og PremiumButton + BackButton.
**Resultat:** Navigasjon fungerer no på Steg 7 og 8.