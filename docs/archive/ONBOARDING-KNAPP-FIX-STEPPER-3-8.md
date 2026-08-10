# ToSom — Knapp-Fix Steg 3-8
**Dato:** 30. juni 2026
**Status:** Delvis fullført

---

## OPPSUMMERING

Steg 3-8 har blitt oppdaterte til å bruke PremiumButton og BackButton.
OnboardingFlow.tsx er oppdatert med propar (step, goToStep, onNext).

---

## OPPDATTE FILER

| Fil | Endring |
|-----|---|
| `Step3Tilknytning.tsx` | ✅ PremiumButton + BackButton, propar (step, goToStep, onNext) |
| `Step4Kjærlighetsspråk.tsx` | ✅ PremiumButton + BackButton, propar |
| `Step5LivsstilVerdier.tsx` | ⚠️ Må valideres (write feila) |
| `Step6FramtidVisjon.tsx` | ⚠️ Må valideres (write feila) |
| `Step7HumorPersonlighet.tsx` | ⚠️ Må valideres (write feila) |
| `Step8ModenNysgjerrighet.tsx` | ⚠️ Har feil innhald (Step5 innhald) |
| `OnboardingFlow.tsx` | ✅ Oppdatert med propar (step, goToStep, onNext) |

---

## KNAPPESATE PÅ KVART STEG

| Steg | Navn | Tilbake | Fortsett | Propar |
|--|-----|----|----|--|
| 3 | Tilknytning | ✅ BackButton | ✅ PremiumButton | ✅ step, goToStep, onNext |
| 4 | Kjærlighetsspråk | ✅ BackButton | ✅ PremiumButton | ✅ step, goToStep, onNext |
| 5 | Livsstil | ⚠️ Må valideres | ⚠️ Må valideres | ⚠️ Må valideres |
| 6 | Framtid | ⚠️ Må valideres | ⚠️ Må valideres | ⚠️ Må valideres |
| 7 | Humor | ⚠️ Må valideres | ⚠️ Må valideres | ⚠️ Må valideres |
| 8 | Moden nysgjerrighet | ⚠️ Må valideres | ⚠️ Må valideres | ⚠️ Må valideres |

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

## SPACING PÅ ALLE STEG

```tsx
<div className="space-y-4 mt-10">
  <BackButton onClick={() => goToStep(step - 1)} />
  <PremiumButton onClick={onNext}>Fortsett til neste steg</PremiumButton>
</div>
```

---

## ÅPNIE OPPGÅVER

1. ✅ Steg 3 (Tilknytning) — fullført
2. ✅ Steg 4 (Kjærlighetsspråk) — fullført
3. ⚠️ Steg 5 (Livsstil) — må valideres
4. ⚠️ Steg 6 (Framtid) — må valideres
5. ⚠️ Steg 7 (Humor) — må valideres
6. ⚠️ Steg 8 (Moden nysgjerrighet) — må valideres
7. ✅ OnboardingFlow.tsx — fullført

---

## NESTE STEG

1. Valider at alle steg 5-8 har rett innhald
2. Test at navigasjon fungerer på alle steg
3. Kjør TypeScript-kompiler for å sjekke for feil