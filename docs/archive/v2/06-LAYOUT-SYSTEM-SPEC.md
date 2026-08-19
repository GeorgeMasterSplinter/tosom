# ToSom Layout-system-spec v2

**Versjon:** 2.0 · **Dato:** 11. august 2026
**Status:** Godkjent av George
**Formål:** Spesifikasjon for layout, grid og responsivitet i ToSam-plattformen

---

## 1. Nåtilstand — Layout-mønstere

### Brukte mønstre i dag
- **Landing:** Single-column, sentrert, max-width begrenset
- **Onboarding:** Single-column, full-viewport-seksjoner med fade-overgang
- **Dashboard:** Single-column på mobil, 2-kolonner på desktop (content + sidebar-widgets)
- **Chat:** Full-height med sticky header + scrollbare meldinger + sticky input
- **Profil:** Single-column sentrert
- **Admin:** Fast sidebar (240px) + scrollbart content-område

### Problemer
1. **Ingen felles PageShell-komponent** — hver side har sin egen wrapper/max-width
2. **Ingen responsiv breakpoint-strategi** — Tailwind-defaults brukes inkonsekvent
3. **Chat-layout hardkodet** — ikke lett å gjenbruke full-height sticky-mønsteret
4. **Dashboard 2-kolonne-braking punkt uklar** — skjer ved ~1024px men er ikke dokumentert
5. **Ingen min-viewport håndtering** — portrait-tablet (768px) har suboptimal layout på flere sider

---

## 2. Måltilstand — Layout v2

### 2.1 Breakpoints

| Navn | Bredde | Enheter hovedsaklig |
|------|--------|---------------------|
| `xs` | 0–479px | Telefon (portrait) |
| `sm` | 480–639px | Telefon (stort portrait) |
| `md` | 640–767px | Tablet (portrait) |
| `lg` | 768–1023px | Tablet (landscape) / liten laptop |
| `xl` | 1024–1279px | Desktop |
| `2xl` | 1280px+ | Stor desktop |

**Primær breakpoint:** `lg` (768px) er skille mellom "mobil" og "desktop"-mønstre.

### 2.2 PageShell — Felles side-wrapper

**Fil:** `components/ui/PageShell.tsx` (ny)

```tsx
interface PageShellProps {
  variant?: 'narrow' | 'standard' | 'wide' | 'full';
  centered?: boolean;
  padded?: boolean;
  children: React.ReactNode;
}
```

| Variant | Max-width | Bruk |
|---------|-----------|------|
| `narrow` | 640px | Onboarding, login, register, profil-redigering |
| `standard` | 896px | Dashboard, chat-oversikt, innstillinger |
| `wide` | 1280px | Admin-sider, analytics-tabeller |
| `full` | 100% | Landing, full-screen modaler |

Default: `padded=true` legger til horizontal padding (`px-4 sm:px-6 lg:px-8`).

### 2.3 Side-layouts per domain

#### A. Onboarding — Single Focus

```
┌─────────────────────┐
│  Progress (top)     │  ← Tynn progresjons-bar fast topp
├─────────────────────┤
│                     │
│    ┌───────────┐    │
│    │           │    │
│    │  Spørsmål │    │  ← Sentret, max-w-narrow
│    │           │    │
│    │           │    │
│    └───────────┘    │
│                     │
│  [Forrige] [Neste]  │  ← Sticky bottom på mobil
└─────────────────────┘
```

#### B. Dashboard — Hub

```
┌──────────────────────────────────┐
│  Header (hilsen + notifikasjon)  │
├──────────────────────────────────┤
│  ┌──────────────┐                │
│  │              │ ┌────────────┐ │  ← Desktop: 2-kolonne (66%/34%)
│  │  Hoved-      │ │ Sidebar    │ │     Mobil: single-column stack
│  │  content     │ │ widgets    │ │
│  │              │ │            │ │
│  └──────────────┘ └────────────┘ │
│                                  │
└──────────────────────────────────┘
```

#### C. Chat — Full-height Room

```
┌─────────────────────┐
│  ChatHeader (sticky) │  ← Partner-info, dag-teller
├─────────────────────┤
│                     │
│  ┌───────────────┐  │
│  │               │  │
│  │  Meldinger    │  │  ← Flex-col, auto-scroll
│  │               │  │     Bottom-aligned content
│  │               │  │
│  └───────────────┘  │
│                     │
│  [Input (sticky)]   │  ← Tekst + send + bilde-knapp
└─────────────────────┘

CSS: flex-col, h-[calc(100vh-header-input)], messages area: flex-1 overflow-y-auto
```

#### D. Profil — Identity Card

```
┌─────────────────────┐
│  Avatar + navn      │  ← Stor avatar (80px), sentrert
│  Fase-badge         │
├─────────────────────┤
│  ┌───────────────┐  │
│  │ Profil-info   │  │  ← Glass-kort med info
│  └───────────────┘  │
│  ┌───────────────┐  │
│  │ Sikkerhet     │  │
│  └───────────────┘  │
│  ┌───────────────┐  │
│  │ Navigasjon    │  │
│  └───────────────┘  │
└─────────────────────┘
```

#### E. Journey/Reisen — Timeline

```
┌──────────────────────────────────┐
│  Fase-banner + dag-teller        │
├──────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐      │
│  │ Dagens   │  │ Sidetopp │ │  ← Desktop: 2-kolonne
│  │ tema     │  │ refleksj.│ │
│  │          │  │          │ │
│  └──────────┘  └──────────┘      │
│                                  │
│  [Timeline: dag 1-30]           │  ← Horisontal tidslinje (scrollbar på mobil)
└──────────────────────────────────┘
```

#### F. Admin — Enterprise Grid

Se `docs/v2/01-ADMIN-V2-DESIGN-SPEC.md` for detaljer.

Kort oppsummering: Fast sidebar (288px) + breadcrumb + metrik-rad + 2-kolonne content.

### 2.4 Navigation

#### Bruker-navigasjon (mobil)
- **Bottom nav-bar** på `xs`–`md`: Dashboard | Chat | Reise | Profil
- **Top nav-bar** på `lg`+: Horisontal lenke-liste i header

#### Admin-navigasjon
- **Sidebar** på alle breakpoints (kan collapse til ikoner på `<lg`)
- Breadcrumbs alltid synlige

### 2.5 Sticky-mønstre

| Element | Når | CSS |
|---------|-----|-----|
| Onboarding-progress | Alltid | `sticky top-0 z-30` |
| Chat-header | I chat-rom | `sticky top-0 z-20` |
| Chat-input | I chat-rom | `mt-auto` (flex-col parent) |
| Admin-sidebar | I admin | `fixed left-0 top-0 h-full` |
| Dashboard-notifikasjon | I header | `sticky top-0 z-20` |

---

## 3. Endringsplan

### Steg 1: Opprett PageShell
- Ny fil `components/ui/PageShell.tsx`
- Erstatt inline `max-w-* mx-auto px-*` i 10+ sider med `<PageShell variant="...">`

### Steg 2: Standardiser Chat-layout
- Sørg for at chat-rom bruker flex-col pattern konsistent
- Document the CSS-structure i en kommentar i layout-filen

### Steg 3: Bottom nav for mobil
- Opprett `components/layout/MobileBottomNav.tsx`
- Vis kun på `<lg` breakpoints
- Skjul desktop-top-nav på `<lg`

### Steg 4: Admin-layout v2
- Se Admin v2 Design-spec (dokument 01)

---

## 4. Qwen ACT-instruks

```
Når du implementerer layout-system v2:

1. Les ALWAYS ai/system_prompt.md før hvert steg
2. START med PageShell — den brukes av ALLE sider
3. Test på 3 breakpoints: 375px (mobil), 768px (tablet), 1280px (desktop)
4. Chat-layout er kritisk — test at meldinger scrollbar riktig og input forblir sticky
5. Mobile bottom-nav skal ha smooth transition ved breakpoint-skift
6. Bruk Tailwind breakpoint prefixes: sm:, md:, lg:, xl:
7. Ikke endre funksjonalitet — kun layout/spacing
```

---

*Slutt på Layout-system-spec v2.*