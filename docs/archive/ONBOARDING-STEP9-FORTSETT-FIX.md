# ToSom — Steg 9 "Fortsett" knapp-fix
**Dato:** 30. juni 2026
**Status:** Fullført

---

## PROBLEM

"Fortsett til neste steg"-knappen på Steg 9 (Oppsummering) fungerte ikke fordi:
1. `PremiumButton` brukte `onClick={() => {}}` (tom callback)
2. OnboardingFlow.tsx case 8 brukte `onNext={() => goToStep(9)}` i staden for `onNext={handleNext}`

---

## LØYSING

### 1. OnboardingFlow.tsx (case 8)

**Før:**
```tsx
case 8:
  return <Step9Oppsummering step={step} goToStep={goToStep} data={data} onNext={() => goToStep(9)} onBack={() => goToStep(7)} />;
```

**Etter:**
```tsx
case 8:
  return <Step9Oppsummering step={step} goToStep={goToStep} data={data} onNext={handleNext} onBack={() => goToStep(7)} />;
```

### 2. Step9Oppsummering.tsx (PremiumButton onClick)

**Før:**
```tsx
<PremiumButton onClick={() => {}}>
  Fortsett til neste steg
</PremiumButton>
```

**Etter:**
```tsx
<PremiumButton onClick={onNext}>
  Fortsett til neste steg
</PremiumButton>
```

### 3. handleNext (OnboardingFlow.tsx)

Sikra at `handleNext` gjer berre:
```tsx
const handleNext = () => goToStep(step + 1);
```

Dette betyr:
- Steg 9 (step=8) → `handleNext` → `goToStep(8 + 1)` → `goToStep(9)` → Steg 10

---

## NESTE STEG EKSTERN

**Sjekk at case 9 eksisterer:**
```tsx
case 9:
  return <Step10StartReisen data={data} onStart={handleStartReisen} saving={saving} />;
```

---

## OPPDATTE FILER

| Fil | Endring |
|-----|---|
| `OnboardingFlow.tsx` | Endra `onNext={() => goToStep(9)}` → `onNext={handleNext}` |
| `Step9Oppsummering.tsx` | Endra `onClick={() => {}}` → `onClick={onNext}` |

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

1. Test at "Fortsett" på Steg 9 går til Steg 10
2. Test at "Tilbake" på Steg 9 går til Steg 8
3. Test alle steg 1-10 navigasjon

---

## OPPSUMMERING

**Problem:** "Fortsett til neste steg"-knappen på Steg 9 hadde `onClick={() => {}}` (tom callback).
**Løysing:** Endra til `onClick={onNext}` og `onNext={handleNext}` i OnboardingFlow.
**Resultat:** Navigasjon fungerer no på Steg 9.