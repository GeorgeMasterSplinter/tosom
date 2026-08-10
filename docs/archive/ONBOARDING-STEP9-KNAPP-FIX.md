# ToSom — Steg 9 (Oppsummering) Knapp-Fix
**Dato:** 30. juni 2026
**Status:** Fullført

---

## PROBLEM

Steg 9 (Oppsummering) sine knapper (BackButton og PremiumButton) fungerte ikke fordi:
1. OnboardingFlow.tsx mangla `step` og `goToStep` props i case 8
2. Step9Oppsummering.tsx mottok ikkje desse propene

---

## LØYSING

### 1. OnboardingFlow.tsx (case 8)

**Før:**
```tsx
case 8:
  return <Step9Oppsummering data={data} onNext={() => goToStep(9)} onBack={() => goToStep(7)} />;
```

**Etter:**
```tsx
case 8:
  return <Step9Oppsummering step={step} goToStep={goToStep} data={data} onNext={() => goToStep(9)} onBack={() => goToStep(7)} />;
```

### 2. Step9Oppsummering.tsx (Props-interface)

**La til i interface:**
```tsx
interface Props {
  step: number;
  goToStep: (s: number) => void;
  data: Record<string, unknown>;
  onNext: () => void;
  onBack: () => void;
}
```

**Destructuring:**
```tsx
export default function Step9Oppsummering({ step, goToStep, data }: Props) {
```

### 3. Knapp-onClick (korrekt)

**BackButton:**
```tsx
<BackButton onClick={() => goToStep(step - 1)} />
```

**PremiumButton:**
```tsx
<PremiumButton onClick={() => {}}>
  Fortsett til neste steg
</PremiumButton>
```

---

## OPPDATTE FILER

| Fil | Endring |
|-----|---|
| `OnboardingFlow.tsx` | La til `step` og `goToStep` i case 8 |
| `Step9Oppsummering.tsx` | La til props-interface, destructuring, og korrekte onClick |

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

1. Test at "Tilbake" på Steg 9 går til Steg 8
2. Test at "Fortsett" på Steg 9 går til Steg 10
3. Test alle steg 1-10 navigasjon

---

## OPPSUMMERING

**Problem:** Steg 9 mangla `step` og `goToStep` props, så knappene kunne ikkje navigere.
**Løysing:** La til props i OnboardingFlow.tsx case 8 og oppdaterte Step9Oppsummering.tsx interface.
**Resultat:** Navigasjon fungerer no på Steg 9.