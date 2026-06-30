# ToSom Onboarding — Fase 5 Rapport: Full knapp-konsolidering
**Dato:** 30. juni 2026
**Status:** Infrastruktur ferdig — steg må oppdaterast

---

## OPPSUMMERING

Fase 5 introduserer **ein felles premium-knappestil** for heile onboarding-flowen.
Ingen grå knappar, ingen duplikat-stilar, ingen inline-knappestilar i stega.

---

## OPPRETTEDE KOMPONENTAR

### 1. PremiumButton (`components/onboarding/PremiumButton.tsx`)
**Formål:** Ein gull-gradient-knapp for alle "Fortsett"/"Start reisen"-handlinger.

**Props:**
- `onClick?: () => void`
- `disabled?: boolean`
- `loading?: boolean`
- `children: React.ReactNode`
- `variant?: 'primary' | 'secondary'`
- `full?: boolean` (for full-width)
- `className?: string`

**Utsegn:**
- Gull-gradient med hover-glød (primary)
- Mørk glassmorphism (secondary)
- Loading-state med spinner
- Disabled-state med dempa fargar
- Hover: translateY(-1px) + scale(1.005) + box-shadow

### 2. BackButton (`components/onboarding/BackButton.tsx`)
**Formål:** Ein tydeleg "Tilbake"-knapp med gull-outline.

**Props:**
- `onClick: () => void`
- `disabled?: boolean`
- `children?: React.ReactNode` (default: "Tilbake")
- `className?: string`

**Utsegn:**
- Mørk glassmorphism bakgrunn
- Gull-outline (rgba(212, 175, 55, 0.3))
- Gull-text farge (rgba(212, 175, 55, 0.7))
- Hover: gull-opplyst bakgrunn + sterkare outline
- Pile-ikon (←) for visuell klarskjering

---

## OPPDATTE FILER

### 1. OnboardingLayout.tsx
- **Fjerna:** Alle interne knappar
- **Legt til:** `renderButtons?: () => ReactNode` prop
- **Endra:** Knappar no rendera av kvart steg komponent

### 2. OnboardingFlow.tsx
- **Legg til:** Import av PremiumButton og BackButton
- **Endra:** Knapp-struktur no delegert til stega

---

## STEG MÅ OPPDATERAST

Følgjande steg må oppdaterast til å bruke PremiumButton og BackButton:

### Steg 1 (Step1Profile.tsx)
```tsx
import { PremiumButton, BackButton } from '@/components/onboarding';

// I render:
<div className="pt-6 flex gap-3">
  {showBack && <BackButton onClick={onBack} />}
  <PremiumButton full onClick={onNext}>Fortsett til neste steg</PremiumButton>
</div>
```

### Steg 2 (Step2Personlighet.tsx)
```tsx
<div className="pt-6 flex gap-3">
  <BackButton onClick={onBack} />
  <PremiumButton full onClick={() => onChange('next', true)}>
    Fortsett til neste steg
  </PremiumButton>
</div>
```

### Steg 3-8
Ingen knappar no — desse stega arvar navigasjon frå OnboardingLayout.

### Steg 9 (Step9Oppsummering.tsx)
```tsx
<div className="flex gap-3">
  <BackButton onClick={onBack} />
  <PremiumButton full onClick={onNext}>Fortsett til neste steg</PremiumButton>
</div>
```

### Steg 10 (Step10StartReisen.tsx)
```tsx
<PremiumButton full loading={saving} onClick={onStart}>
  {saving ? 'Mapper...' : 'Start reisen'}
</PremiumButton>
```

---

## OPPDATERING PÅKREVDE

For å fullføre Fase 5 må desse filene oppdaterast:

| Fil | Endring |
|-----|---|
| `Step1Profile.tsx` | Fjern inline-knapp, bruk PremiumButton + BackButton |
| `Step2Personlighet.tsx` | Fjern inline-knappar, bruk PremiumButton + BackButton |
| `Step9Oppsummering.tsx` | Fjern inline-knappar, bruk PremiumButton + BackButton |
| `Step10StartReisen.tsx` | Fjern inline-knapp, bruk PremiumButton |

---

## IKKE ENDRA

- OnboardingLayout sin container-struktur
- Progress-bar
- Header-struktur
- Ingen nye features

---

## NESTE STEG

1. Oppdater Step1Profile.tsx
2. Oppdater Step2Personlighet.tsx
3. Oppdater Step9Oppsummering.tsx
4. Oppdater Step10StartReisen.tsx
5. Test at alle knappar ser like ut

---

## KOMPONENT-SPECS

### PremiumButton (primary)
```tsx
// Default state
background: linear-gradient(135deg, rgba(212,175,55,0.92), rgba(232,194,122,0.92))
color: #0B0E11
boxShadow: 0 4px 12px rgba(212,175,55,0.20)

// Hover
background: linear-gradient(135deg, #D4AF37, #E8C766)
transform: translateY(-1px) scale(1.005)
boxShadow: 0 6px 16px rgba(212,175,55,0.25)

// Disabled
background: rgba(212,175,55,0.25)
color: rgba(255,255,255,0.4)
cursor: not-allowed
```

### BackButton
```tsx
// Default state
background: rgba(255,255,255,0.04)
border: 1px solid rgba(212,175,55,0.3)
color: rgba(212,175,55,0.7)

// Hover
background: rgba(212,175,55,0.08)
border: 1px solid rgba(212,175,55,0.5)
color: #D4AF37
transform: translateY(-1px)
boxShadow: 0 4px 12px rgba(212,175,55,0.15)
```

---

## OPPSUMMERING

Fase 5 har oppretta:
1. **PremiumButton** — gull-gradient med loading/disabled
2. **BackButton** — mørk glassmorphism med gull-outline
3. **OnboardingLayout** med `renderButtons` — knappar rendera av stega

Infrastrukturen er **ferdig**. Stega må no oppdaterast til å bruke desse komponentane.