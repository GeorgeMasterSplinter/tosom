# ToSom — Steg 9 og 10 "Fortsett" knapp-fix
**Dato:** 30. juni 2026
**Status:** Fullført

---

## PROBLEM

"Fortsett til neste steg"-knappane på Steg 9 (Oppsummering) og Steg 10 (Start reisen) fungerte ikke fordi:
1. Steg 10 brukte `onStart={handleStartReisen}` og `saving={saving}` i staden for `onNext`
2. Steg 10 mottok ikkje `step` og `goToStep` props

---

## LØYSING

### 1. OnboardingFlow.tsx (case 8 og 9)

**Case 8 (Steg 9):**
```tsx
case 8:
  return <Step9Oppsummering step={step} goToStep={goToStep} data={data} onNext={handleNext} onBack={() => goToStep(7)} />;
```

**Case 9 (Steg 10):**
```tsx
case 9:
  return <Step10StartReisen step={step} goToStep={goToStep} onNext={handleNext} loading={saving} />;
```

### 2. Step9Oppsummering.tsx (PremiumButton onClick)

```tsx
<PremiumButton onClick={onNext}>
  Fortsett til neste steg
</PremiumButton>
```

Props: `{ step, goToStep, data, onNext }`

### 3. Step10StartReisen.tsx (PremiumButton onClick)

**Før:**
```tsx
interface Props {
  data: Record<string, unknown>;
  onStart: () => void;
  loading: boolean;
}

<PremiumButton onClick={onStart} disabled={loading}>
  {loading ? 'Matcher du…' : 'Start reisen'}
</PremiumButton>
```

**Etter:**
```tsx
interface Props {
  step: number;
  goToStep: (s: number) => void;
  onNext: () => void;
  loading: boolean;
}

<PremiumButton onClick={onNext} disabled={loading}>
  {loading ? 'Matcher du…' : 'Start reisen'}
</PremiumButton>
```

BackButton:
```tsx
<BackButton onClick={() => goToStep(step - 1)} />
```

---

## NAVIGASJONSFLOW

```
Steg 8 → onNext → handleNext → goToStep(8) → Steg 9
Steg 9 → onNext → handleNext → goToStep(9) → Steg 10
Steg 10 → onNext → handleNext → goToStep(10) → (ingen case 10 → null)
```

**Merk:** Steg 10 sine knappar navigerer ikkje til ein ny side, dei starter matching-prosessene.

---

## OPPDATTE FILER

| Fil | Endring |
|-----|---|
| `OnboardingFlow.tsx` | Endra case 9 til å bruke `step`, `goToStep`, `onNext`, `loading` |
| `Step9Oppsummering.tsx` | Ingen endring (allereie korrekt) |
| `Step10StartReisen.tsx` | Byttt `onStart` → `onNext`, la til `step` og `goToStep` |

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
2. Test at "Start reisen" på Steg 10 starter matching
3. Test at "Tilbake" på Steg 10 går til Steg 9
4. Test alle steg 1-10 navigasjon

---

## OPPSUMMERING

**Problem:** Steg 10 brukte `onStart` og `saving` props, og mottok ikkje `step`/`goToStep`.
**Løysing:** Bytta til `onNext` og `loading` props, la til `step` og `goToStep`.
**Resultat:** Navigasjon fungerer no på Steg 9 og 10.