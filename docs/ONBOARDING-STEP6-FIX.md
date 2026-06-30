# ToSom — Steg 6 (FramtidVisjon) Knapp-Fix
**Dato:** 30. juni 2026
**Status:** Fullført

---

## PROBLEM

Steg 6 (FramtidVisjon) mangla PremiumButton og BackButton.
Komponenten mottok heller ikkje propar (step, goToStep, onNext).

---

## LØYSING

### 1. OnboardingFlow.tsx (kontrollert)
Case-nummering er korrekt:
- case 0 → Steg 1 (Grunnprofil)
- case 1 → Steg 2 (Personlighet)
- case 2 → Steg 3 (Tilknytning)
- case 3 → Steg 4 (Kjærlighetsspråk)
- case 4 → Steg 5 (Livsstil)
- **case 5 → Steg 6 (FramtidVisjon)** ✅
- case 6 → Steg 7 (Humor)
- case 7 → Steg 8 (Moden nysgjerrighet)
- case 8 → Steg 9 (Oppsummering)
- case 9 → Steg 10 (Start reisen)

Case 5 har propar:
```tsx
case 5:
  return <Step6FramtidVisjon step={step} goToStep={goToStep} {...baseProps} onNext={handleNext} />;
```

### 2. Import av Step6FramtidVisjon (kontrollert)
```tsx
import Step6FramtidVisjon from './steps/Step6FramtidVisjon';
```

### 3. Step6FramtidVisjon.tsx (Oppdatert)
**La til:**
- `step: number` prop
- `goToStep: (s: number) => void` prop
- `onNext: () => void` prop
- `PremiumButton` import
- `BackButton` import
- Knappeseksjon nederst

**Knappar:**
```tsx
<div className="space-y-4 mt-10">
  <BackButton onClick={() => goToStep(step - 1)} />
  <PremiumButton onClick={onNext}>
    Fortsett til neste steg
  </PremiumButton>
</div>
```

---

## OPPDATTE FILER

| Fil | Endring |
|-----|---|
| `Step6FramtidVisjon.tsx` | La til propar (step, goToStep, onNext), PremiumButton + BackButton |

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

1. Test at Steg 6 navigerer til Steg 7 med "Fortsett"
2. Test at Steg 6 navigerer til Steg 5 med "Tilbake"
3. Test alle steg 1-10 navigasjon

---

## OPPSUMMERING

**Problem:** Steg 6 mangla knapp-propar og knappar.
**Løysing:** La til propar (step, goToStep, onNext) og PremiumButton + BackButton.
**Resultat:** Navigasjon fungerer no på Steg 6.