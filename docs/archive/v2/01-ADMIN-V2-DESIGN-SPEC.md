# ToSom Admin v2 — Design-spesifikasjon

**Versjon:** 2.0 · **Dato:** 11. august 2026  
**Status:** Godkjent av George  
**Formål:** Design-spec for admin-panelet v2 (premium nordisk UI, enterprise-layout)

---

## 1. Nåtilstand

### Eksisterende ruter
| Rute | Status | Notater |
|------|--------|---------|
| `/admin` | Redirect → `/admin/login` | OK |
| `/admin/login` | Fungerer | Glass-kort, ambient glow — bra visuelt |
| `/admin/dashboard` | Fungerer | 6 metrikkkart, SystemStatus, JourneyPhaseMonitor |
| `/admin/analytics` | Fungerer | Real Prisma-data via `/api/admin/metrics` |
| `/admin/users` | Fungerer | Brukerliste med søk/filter |
| `/admin/moderation` | Delvis | Basisk rapport-håndtering |
| `/admin/observability` | Mangler/prioritere | Ingen dedikert side i dag |
| `/admin/matches` | Delvis | Basic oversikt |
| `/admin/journeys` | Delvis | Basic oversikt |
| `/admin/language-review` | Fungerer | Språk-review verktøy |

### Nåværende layout
- `AdminSidebar` i `components/admin/AdminSidebar.tsx` — fast venstrenavigasjon (`w-240px`, `ml-240px` content)
- Mørk bakgrunn `#0B1520`
- Glass-komponenter med varierende grad av konsistens
- Sidebarbruker gull-farge for aktivt element

### Ulemper ved nåtilstand
1. **Ingen hierarki i navigasjonen** — alle sider flatt-listet uten gruppering
2. **Ingen breadcrumb-system** — vanskelig å orientere seg på undersider
3. **Inkonsistent spacing** — ulike marginer/padding per side
4. **Ingen responsiv admin-design** — bare desktop
5. **Dashboard-kort for tunge** — for mye visuell støy per kart
6. **Ingen loading/skeleton states i admin** — blank skjermer ved langsom API
7. **SystemStatus-widget hardkodede terskeler** — bør være konfigurerbar

---

## 2. Måltilstand — Admin v2 Design

### 2.1 Navigasjon v2 — Hierarkisk sidebar

Ny navigasjonsstruktur med 5 hovedgrupper:

```
┌─────────────────────────────────┐
│  TOsom ADMIN                     │
├─────────────────────────────────┤
│                                 │
│  OVERSIKT                       │
│    ◆ Dashboard                   │
│    ◆ Systemstatus                │
│                                 │
│  ANALYTICS                      │
│    ◆ Brukere                     │
│    ◆ Engasjement                 │
│    ◆ Konvertering                │
│    ◆ Trends                      │
│                                 │
│  OPERASJONER                    │
│    ✓ Matches                     │
│    ✓ Journeys                    │
│    ✓ Moderasjon                  │
│                                 │
│  OBSERVABILITY                  │
│    ◆ Helse                       │
│    ◆ Logging                     │
│    ◆ Feil                        │
│                                 │
│  SYSTEM                         │
│    ◆ Språk-review                │
│    ◆ Innstillinger               │
│                                 │
└─────────────────────────────────┘
```

**Designvalg:**
- Sidebar: `w-72` (288px), fast venstre, glassmorphism
- Hovedgrupper med småbokstav heading + 4px avstand
- Aktiv element: gull-bg `rgba(212,175,55,0.12)` + gull-text `#D4AF37` + 3px gull-bar venstre
- Inaktiv element: `text-white/60`, hover → `text-white/90` bg `rgba(255,255,255,0.04)`
- Ikoner: 20px lucide-ikoner (eller tilsvarende), konsistent 20px grid

### 2.2 Breadcrumb-system

Hver admin-side viser breadcrumb i toppen av content-området:

```
Dashboard > Analytics > Brukere
```

- Font: 13px, `text-white/40`, separator `›` i gull
- Hvert segment er klikkbart → navigerer til foreldreside

### 2.3 Dashboard v2 Layout

Ny dashboard-struktur med 3-soner:

```
┌─────────────────────────────────────────────────────┐
│  Breadcrumb + Page Title + Last Updated timestamp   │
├─────────────────────────────────────────────────────┤
│  METRIKK-RAD (8 kompakt-kart i 4×2 grid)           │
│  [Brukere] [Aktive] [Matches] [Journeys]           │
│  [Meldinger] [Konvers.] [Rapporter] [DriftScore]   │
├─────────────────────────────────────────────────────┤
│  HOVED-KOLONNE (66%)   |  SIDE-KOLONNE (34%)       │
│                       |                           │
│  [Graf: Bruker-       |  [Systemstatus]           │
│   trends 30 dager]    |  [Journey Phase Monitor]  │
│                       |  [Nyhetsfeed]             │
│  [Tabel: Nylige       |                           │
│   events]             |                           │
└─────────────────────────────────────────────────────┘
```

### 2.4 Fargepalett — Admin v2

| Token | Verdi | Bruk |
|-------|-------|------|
| `admin-bg` | `#0A1220` | Side-bakgrunn (dyper enn main) |
| `admin-surface` | `rgba(255,255,255,0.03)` | Glass-kort |
| `admin-border` | `rgba(255,255,255,0.06)` | Kort-rand |
| `admin-text` | `rgba(255,255,255,0.90)` | Primær tekst |
| `admin-text-secondary` | `rgba(255,255,255,0.55)` | Sekundær tekst |
| `admin-text-muted` | `rgba(255,255,255,0.35)` | Tredjeprioritet |
| `admin-gold` | `#D4AF37` | Aksent/aktiv |
| `admin-gold-soft` | `rgba(212,175,55,0.12)` | Aktiv-bg |
| `admin-success` | `#34D399` | OK-status |
| `admin-warning` | `#FBBF24` | Advarsel |
| `admin-error` | `#F87171` | Feil/kritisk |
| `admin-info` | `#60A5FA` | Info |

### 2.5 Typografi — Admin v2

| Element | Font-size | Weight | Line-height |
|---------|-----------|--------|-------------|
| Page Title | 24px | 600 | 32px |
| Section Header | 16px | 600 | 24px |
| Card Metric Value | 28px | 600 | 36px |
| Card Metric Label | 12px | 500 | 16px |
| Body Text | 14px | 400 | 20px |
| Table Header | 11px | 600 | uppercase, tracking 0.05em |
| Table Cell | 13px | 400 | 20px |
| Breadcrumb | 13px | 400 | 20px |
| Timestamp | 11px | 400 | 16px, muted |

### 2.6 Spacing-system — Admin v2

| Token | Verdi | Bruk |
|-------|-------|------|
| `space-2xs` | 4px | Icon margins |
| `space-xs` | 8px | Intra-card spacing |
| `space-sm` | 12px | Button padding |
| `space-md` | 16px | Card padding, section gaps |
| `space-lg` | 24px | Page margins, column gaps |
| `space-xl` | 32px | Large section breaks |

### 2.7 Status-indikatorer

Konsistent status-badge-system for alle admin-tabeller:

```
● Online      (grønn prikk + tekst)
● Ventende    (gul prikk + tekst)
● Fullført    (grå prikk + tekst)
● Kritisk     (rød prikk + tekst)
● Advarsel    (oransje prikk + tekst)
```

- Prikker: `w-2 h-2 rounded-full` med status-farge
- Tekst: 12px, same color as dot
- Badge-bg: `rgba(status-color, 0.1)` with `border: 1px solid rgba(status-color, 0.2)`

---

## 3. Endringsplan — Inkrementelle steg

### Steg 1: Ny AdminSidebar v2 (høyeste prioritet)
**Filer:**
- Opprett `components/admin/AdminSidebarV2.tsx`
- Oppdater `app/admin/layout.tsx` → bruk `AdminSidebarV2`
- Behold gammel sidebar som fallback (`AdminSidebar.tsx`) inntil full migrering er gjort

**Endringer:**
- Hierarkisk gruppestuktur (5 grupper)
- Konsistent 20px ikoner per gruppe
- Aktiv/inaktiv state med gull-systemet over
- Smooth transition på hover/active

### Steg 2: Breadcrumb-komponent
**Filer:**
- Opprett `components/admin/AdminBreadcrumb.tsx`
- Legg inn i hver admin-side (`page.tsx`)

### Steg 3: Dashboard v2 Layout
**Filer:**
- Oppdater `app/admin/dashboard/page.tsx`
- Opprett `components/admin/MetricCardV2.tsx` (kompakt, konsisten design)
- Opprett `components/admin/TwoColumnLayout.tsx`

### Steg 4: Admin Token-oppdatering
**Filer:**
- Oppdater `config/design-tokens.ts` med admin-tokener
- Eller opprett `config/admin-tokens.ts` (anbefalt — holder admin og user-ui adskilt)

---

## 4. Qwen ACT-instruks

```
Når du implementerer Admin v2 Design:

1. Les ALWAYS ai/system_prompt.md før hvert steg
2. Lag EN komponent per commit (ingen store merge-commits)
3. Test hver komponent i browseren før neste steg
4. Bruk eksisterende glassmorphism-mønster fra config/design-tokens.ts
5. Hold old components tilgjengelig inntil full migrering er gjort
6. Alle nye admin-komponenter får suffix "V2" (f.eks. MetricCardV2)
7. Når alle V2-komponenter er på plass, erstatt gammel layout i app/admin/layout.tsx
8. Ikke endre API-ruter — bare UI
9. All tekst i bokmål
10. Følg spacing/typografi-tabeller over eksakt
```

---

*Slutt på Admin v2 Design-spec.*