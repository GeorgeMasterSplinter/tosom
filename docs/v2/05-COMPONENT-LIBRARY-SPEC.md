# ToSom Komponentbibliotek-spec v2

**Versjon:** 2.0 · **Dato:** 11. august 2026
**Status:** Godkjent av George
**Formål:** Spesifikasjon for gjenbrukelige UI-komponenter i ToSam-plattformen

---

## 1. Nåtilstand — Komponent-inventar

### Bestått komponenter (utvalg)

| Komponent | Fil | Status | Notater |
|-----------|-----|--------|---------|
| ToSomButton | `components/ui/ToSomButton.tsx` | ✅ Fungerer | Gull-gradient, radius 12px |
| ToSomCard | `components/ui/ToSomCard.tsx` | ✅ Fungerer | Glassmorphism, radius 20px |
| Glass | `components/ui/Glass.tsx` | ⚠️ Redundant | Overlapper med ToSomCard |
| ToSomInput | `components/ui/ToSomInput.tsx` | ✅ Fungerer | Glass-bg, gull-focus |
| ToSomSelect | `components/ui/ToSomSelect.tsx` | ✅ Fungerer | |
| ChatBubble | `components/chat/MessageBubble.tsx` | ✅ Fungerer | Mood-gradients |
| MatchCard | `components/MatchCard.tsx` | ✅ Fungerer | Profil-kort i dashboard |
| QuickMatchCard | `components/QuickMatchCard.tsx` | ✅ Fungerer | Kompakt match-visning |
| PublicMatchCard | `components/PublicMatchCard.tsx` | ⚠️ Delvis brukt | |
| ImageUpload | `components/ImageUpload.tsx` | ✅ Fungerer | Dag 15+ upload |
| NotificationCenter | `components/NotificationCenter.tsx` | ✅ Fungerer | |
| AdminSidebar | `components/admin/AdminSidebar.tsx` | ⚠️ Må v2-migreres | Flat navigasjon |

### Problemer med nåtilstand
1. **Redundante komponenter:** `Glass.tsx` og `ToSomCard.tsx` gjør det samme
2. **Ingen Modal/Dialog-komponent:** Ulike sider har egne modal-implementasjoner
3. **Ingen Tabs-komponent:** Mangler standardisert tab-system
4. **Ingen Tooltip-komponent:** Hover-info er hardcoded eller mangler
5. **Ingen Skeleton-v2:** `DashboardSkeleton.tsx` eksisterer men er ikke gjenbrukbar for andre sider
6. **Ingen Badge/Tag-komponent:** Status-badges er inline i ulike komponenter
7. **Ingen Pagination-komponent:** Tabeller med mange rader har ingen paginering

---

## 2. Måltilstand — Komponentbibliotek v2

### 2.1 Kjernekompentanter (components/ui/)

#### Button
**Fil:** `components/ui/ToSomButton.tsx` (oppdatere)

```tsx
interface ToSomButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}
```

| Variant | Bakgrunn | Tekst | Bruk |
|---------|----------|-------|------|
| `primary` | `--ts-gold` → hover `--ts-gold-hover` | `#0A1A2A` | CTA, submit |
| `secondary` | `--ts-glass-bg` | `--ts-text-primary` | Sekundær handling |
| `ghost` | transparent | `--ts-text-secondary` | Lenker, discete knapper |
| `danger` | `--ts-error-soft` | `--ts-error` | Slett, avbryt |

#### Card
**Fil:** `components/ui/ToSomCard.tsx` (oppdatere) — konsolider med `Glass.tsx`

```tsx
interface ToSomCardProps {
  variant?: 'default' | 'subtle' | 'strong';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  clickable?: boolean;
  children: React.ReactNode;
}
```

#### Input
**Fil:** `components/ui/ToSomInput.tsx` (oppdatere)

```tsx
interface ToSomInputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  placeholder?: string;
  value: string;
  onChange: (val: string) => void;
  error?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}
```

#### Modal/Dialog 🆕
**Fil:** `components/ui/ToSomModal.tsx` (ny)

```tsx
interface ToSomModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}
```

Design: `ts-glass-strong`, sentrert, backdrop-blur, lukkes med Escape + klikk utenfor.

#### Tabs 🆕
**Fil:** `components/ui/ToSomTabs.tsx` (ny)

```tsx
interface ToSomTabsProps {
  tabs: { id: string; label: string; icon?: React.ReactNode }[];
  activeId: string;
  onChange: (id: string) => void;
  children: React.ReactNode;
}
```

Aktiv tab: gull-underline 2px. Inaktiv: `text-white/60`, hover `text-white/90`.

#### Badge 🆕
**Fil:** `components/ui/ToSomBadge.tsx` (ny)

```tsx
interface ToSomBadgeProps {
  status?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  children: React.ReactNode;
}
```

Design: `--ts-radius-full`, small padding, soft-bg + border per status.

#### Tooltip 🆕
**Fil:** `components/ui/ToSomTooltip.tsx` (ny)

```tsx
interface ToSomTooltipProps {
  content: string;
  children: React.ReactNode;
}
```

Design: Glass-bg, `--ts-space-xs` padding, vises på hover/focus.

#### Skeleton 🆕
**Fil:** `components/ui/ToSomSkeleton.tsx` (ny — erstatter hardkodede skeletoner)

```tsx
interface ToSomSkeletonProps {
  type?: 'text' | 'circle' | 'rect' | 'card';
  width?: string;
  height?: string;
}
```

Bruk animert pulse-efekt med `--ts-glass-bg` som blinker subtilt.

### 2.2 Domain-komponenter

#### Chat (components/chat/)
| Komponent | Formål | Endring v2 |
|-----------|--------|------------|
| MessageBubble | Meldingsbobl | Oppdater til nye chat-tokens |
| ChatHeader | Partner-info i chat | Konsistent med layout-v2 |
| GuidedQuestionsPanel | "Bli kjent"-panel | Ingen funksjonsendring |

#### Dashboard (components/dashboard/)
| Komponent | Formål | Endring v2 |
|-----------|--------|------------|
| TodayCard | Dagens journey-tema | Oppdater spacing/tokens |
| JourneyTimeline | Progresjon-tidslinje | Ingen funksjonsendring |
| ActionButtonGrid | Dashboard-handlinger | Oppdater til Button-v2 |

#### Journey (components/journey/)
| Komponent | Formål | Endring v2 |
|-----------|--------|------------|
| DayCard | Enkeltdag i reisen | Oppdater spacing/tokens |
| PhaseBanner | Fase-overgang-banner | Ingen funksjonsendring |
| ImageShareLockBanner | Dag 15-låsing | Ingen funksjonsendring |

---

## 3. Konsolideringsplan

### Hva skal merges/slettes

| Handling | Fil | Erstattes av |
|----------|-----|-------------|
| MERGE | `components/ui/Glass.tsx` → inn i ToSomCard | `ToSomCard.tsx` med variant-prop |
| REPLACE | Inline skeletoner i ulike sider | `ToSomSkeleton.tsx` |
| REPLACE | Inline modaler i admin-sider | `ToSomModal.tsx` |
| REPLACE | Inline badges/spreadt utover | `ToSomBadge.tsx` |

### Hva beholdes uendret
- `ToSomButton.tsx` (men oppdatere tokens)
- `ToSomInput.tsx` (men oppdatere tokens)
- `MessageBubble.tsx` (men oppdatere tokens)
- `MatchCard.tsx` (men oppdatere spacing)

---

## 4. Komponent-API-regler

Alle komponenter i v2 følger disse reglene:

1. **Props-interface eksplisitt** — alltid definert som TypeScript-interface over komponenten
2. **Barn-pattern** — `children` foretrekkes fremfor template-props
3. **Variant-prop** — visuelle variasjoner via `variant` string, ikke separate komponenter
4. **Size-prop** — størrelses-variasjoner via `size` string ('sm'/'md'/'lg')
5. **Disabled-state** — alle interaktive komponenter har `disabled` prop
6. **No hardcoding** — ingen hardcoded farger/spacing i komponenten (kun tokens)
7. **A11y-minimum** — `role`, `aria-*` attributter på interaktive elementer
8. **Keyboard-nav** — alle knapper og clickable-elementer må være tabbare og enter-bare

---

## 5. Qwen ACT-instruks

```
Når du implementerer komponentbibliotek v2:

1. Les ALWAYS ai/system_prompt.md før hvert steg
2. Opprett ÉN ny komponent om gangen (Modal → Tabs → Badge → Tooltip → Skeleton)
3. Test hver komponent i en enkel demo-side før videre arbeid
4. Når Glass.tsx merges inn i ToSomCard, oppdater alle 15+ importører
5. Alle nye komponenter får prefiks "ToSom" (f.eks. ToSomModal, ToSomTabs)
6. Bruk tokens fra components/ui/tokens.ts — aldri hardcoded verdier
7. Dokumenter props-interface med JSDoc i hver komponent
8. Behold bakover-kompatibilitet inntil alle importører er migrert
```

---

*Slutt på Komponentbibliotek-spec v2.*