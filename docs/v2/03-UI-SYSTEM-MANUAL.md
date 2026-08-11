# ToSom UI-system Manual v2

**Versjon:** 2.0 · **Dato:** 11. august 2026  
**Status:** Godkjent av George  
**Formål:** Enten kilde for UI-tokens, spacing, typografi, farger og glassmorphism

---

## 1. Nåtilstand — Problem med konkurrerende token-systemer

ToSom har **6 uavhengige token-definisjoner** som overlapper delvis eller fullstendig:

| # | Fil | Format | Importeres av | Status |
|---|-----|--------|---------------|--------|
| A | `config/design-tokens.ts` (410 linjer) | HEX/RGB i TS-objekter | **67 filer** | Markert `@deprecated` men fortsatt primær |
| B | `components/ui/tokens.ts` (584 linjer) | CSS-var referanser (`var(--ts-*)`) | 5 filer | Deklarert "ny sannhetskilde" i migration guide |
| C | `brand/ui5-tokens.ts` | Re-export fra A + legacy aliases | 0 direkte importører | Shim-lag, redundant |
| D | `themePresets.ts` (rot) | Next.js theme vars | `app/globals.css` | CSS-custom properties definisjon |
| E | `tailwind.config.js` | Tailwind extend.theme | Global via PostCSS | Delvis overlapping med A |
| F | Hardcoded values i komponenter | Inline Tailwind classes | Spredt utover 40+ filer | Technical debt |

**Konsekvens:** Ulike komponenter bruker ulike farger/spacing/radius, som gir inkonsistent visuell opplevelse.

---

## 2. Måltilstand — Én sannhetskilde

### 2.1 Token-hierarki v2

```
CSS Custom Properties (i :root)
        ↑
  themePresets.ts → app/globals.css
        ↑
  components/ui/tokens.ts (leser CSS-vars)
        ↑
  Alle komponenter (importerer kun fra tokens.ts)
```

**Regel:** Ingen komponent skal importere fra `config/design-tokens.ts`, `brand/ui5-tokens.ts` eller ha hardcoded farger.

### 2.2 Fargepalett v2 — ToSom Blue + Nordic Gold (optimalisert)

#### Base-farger (CSS Custom Properties)

```css
:root {
  /* PRIMARY — ToSom Blue */
  --ts-bg-primary: #0A1A2A;
  --ts-bg-secondary: #0F2233;
  --ts-bg-elevated: #132A3D;

  /* GLASS — Translucent surfaces */
  --ts-glass-bg: rgba(255, 255, 255, 0.04);
  --ts-glass-bg-hover: rgba(255, 255, 255, 0.06);
  --ts-glass-border: rgba(255, 255, 255, 0.08);
  --ts-glass-border-hover: rgba(255, 255, 255, 0.12);

  /* GOLD — Accent */
  --ts-gold: #D4AF37;
  --ts-gold-hover: #E8C766;
  --ts-gold-soft: rgba(212, 175, 55, 0.12);
  --ts-gold-border: rgba(212, 175, 55, 0.25);
  --ts-glow-gold: rgba(212, 175, 55, 0.40);

  /* TEXT — White scale */
  --ts-text-primary: rgba(255, 255, 255, 0.95);
  --ts-text-secondary: rgba(255, 255, 255, 0.70);
  --ts-text-muted: rgba(255, 255, 255, 0.45);
  --ts-text-disabled: rgba(255, 255, 255, 0.25);

  /* SEMANTIC — Status */
  --ts-success: #34D399;
  --ts-success-soft: rgba(52, 211, 153, 0.12);
  --ts-warning: #FBBF24;
  --ts-warning-soft: rgba(251, 191, 36, 0.12);
  --ts-error: #F87171;
  --ts-error-soft: rgba(248, 113, 113, 0.12);
  --ts-info: #60A5FA;
  --ts-info-soft: rgba(96, 165, 250, 0.12);

  /* CHAT — Special */
  --ts-chat-bg: #0A1A2A;
  --ts-chat-bubble-received: rgba(255, 255, 255, 0.06);
  --ts-chat-bubble-sent: rgba(212, 175, 55, 0.15);
  --ts-chat-bubble-border-received: rgba(255, 255, 255, 0.08);
  --ts-chat-bubble-border-sent: rgba(212, 175, 55, 0.25);

  /* JOURNEY — Special */
  --ts-journey-highlight: rgba(212, 175, 55, 0.20);
}
```

#### Mood-farger (Chat)

```css
/* MOOD — Chat bubble gradients */
--ts-mood-calm: linear-gradient(135deg, #3B82F6, #1D4ED8);
--ts-mood-warm: linear-gradient(135deg, #D4AF37, #B8942E);
--ts-mood-deep: linear-gradient(135deg, #8B5CF6, #6D28D9);
--ts-mood-gentle: linear-gradient(135deg, #10B981, #059669);
--ts-mood-joyful: linear-gradient(135deg, #F59E0B, #D97706);
```

### 2.3 Spacing-system v2 — Konsistent 4px-grid

| Token | Verdi | Bruk |
|-------|-------|------|
| `--ts-space-2xs` | `4px` | Icon margins, tag padding |
| `--ts-space-xs` | `8px` | Intra-card gaps, inline spacing |
| `--ts-space-sm` | `12px` | Button padding, input padding |
| `--ts-space-md` | `16px` | Card padding, section gaps |
| `--ts-space-lg` | `24px` | Page margins, column gaps |
| `--ts-space-xl` | `32px` | Large section breaks |
| `--ts-space-2xl` | `48px` | Hero spacing, major dividers |
| `--ts-space-3xl` | `64px` | Page-level spacing |

**Regel:** Alle marginer og padding i komponenter må bruke én av disse 8 verdiene. Ingen mellomverdier (f.eks. ikke 10px eller 14px).

### 2.4 Typografi-system v2

Font: **Inter** med system fallback (`-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`)

| Token | Size | Weight | Line-height | Letter-spacing | Bruk |
|-------|------|--------|-------------|----------------|------|
| `display-xl` | 40px | 300 | 48px | -0.02em | Hero headlines (landing) |
| `display-lg` | 32px | 300 | 40px | -0.01em | Side-titler (onboarding) |
| `heading-xl` | 28px | 600 | 36px | 0 | Seksjon-overskrifter |
| `heading-lg` | 24px | 600 | 32px | 0 | Kart-titler, modaler |
| `heading-md` | 20px | 600 | 28px | 0 | Underoverskrifter |
| `heading-sm` | 16px | 600 | 24px | 0.02em | Seksjon-labels, table headers (uppercase) |
| `body-lg` | 18px | 400 | 28px | 0 | Onboarding-spørsmål, intro-tekst |
| `body-md` | 16px | 400 | 24px | 0 | Standard body-text |
| `body-sm` | 14px | 400 | 20px | 0 | Captions, hjelpetekst |
| `body-xs` | 12px | 400 | 16px | 0.02em | Timestamps, badges, metadata |
| `button-md` | 16px | 600 | 24px | 0.01em | Knapper |
| `button-sm` | 14px | 600 | 20px | 0.01em | Små knapper, lenker |

### 2.5 Border-radius v2

| Token | Verdi | Bruk |
|-------|-------|------|
| `--ts-radius-sm` | `8px` | Tags, badges, chip |
| `--ts-radius-md` | `12px` | Buttons, inputs |
| `--ts-radius-lg` | `16px` | Glass-kort, modaler |
| `--ts-radius-xl` | `20px` | Store kort, hero-seksjoner |
| `--ts-radius-2xl` | `24px` | Landing-hero, feature-cards |
| `--ts-radius-full` | `9999px` | Avatars, pills, badges |

### 2.6 Skygger v2

| Token | Verdi | Bruk |
|-------|-------|------|
| `--ts-shadow-sm` | `0 2px 8px rgba(0,0,0,0.3)` | Inputs, små kort |
| `--ts-shadow-md` | `0 4px 20px rgba(0,0,0,0.45)` | Glass-kort, standard |
| `--ts-shadow-lg` | `0 8px 40px rgba(0,0,0,0.5)` | Modaler, dropdowns |
| `--ts-shadow-glow-gold` | `0 0 20px rgba(212,175,55,0.3)` | CTA-knapper, featured elements |

### 2.7 Glassmorphism v2 — Standardisert

Alle glass-komponenter bruker samme oppskrift:

```css
.ts-glass {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  background: var(--ts-glass-bg);
  border: 1px solid var(--ts-glass-border);
  border-radius: var(--ts-radius-lg);
  box-shadow: var(--ts-shadow-md);
}

.ts-glass-hover:hover {
  background: var(--ts-glass-bg-hover);
  border-color: var(--ts-glass-border-hover);
}
```

**Varianter:**
- `ts-glass-subtle` — `blur(8px)`, `bg rgba(255,255,255,0.02)` for mindre fremtredende overflater
- `ts-glass-strong` — `blur(16px)`, `bg rgba(255,255,255,0.06)` for modaler og overlays

### 2.8 Animasjon og motion v2

| Token | Verdi | Bruk |
|-------|-------|------|
| `--ts-motion-fast` | `150ms ease-out` | Hover-states, focus-rings |
| `--ts-motion-normal` | `250ms ease-out` | Standard transitions |
| `--ts-motion-slow` | `400ms ease-out` | Page-entrances, modals |
| `--ts-motion-delayed` | `600ms ease-out` | Staggered animations |

**Regler:**
- Alle animasjoner skal være rolige og bevisste
- Ingen bounce, ingen elastic, ingen flashy-effekter
- Respektere `prefers-reduced-motion` (huk på `hooks/useMotionPreferences.ts`)
- Haptisk tilbakemelding kun på mobile (`hooks/useHaptics.ts`)

---

## 3. Migrasjonsplan — Fra 6 systemer til 1

### Steg 1: Konsolider CSS Custom Properties
**Fil:** `app/globals.css`
- Legg inn alle tokens fra tabellen over som `--ts-*` custom properties
- Behold eksisterende `--ts-*` vars som allerede er i `themePresets.ts` (merging)

### Steg 2: Oppdater components/ui/tokens.ts
**Fil:** `components/ui/tokens.ts`
- Les alle tokens fra CSS-vars (`getComputedStyle(document.documentElement)`)
- Eksporter TS-interface med type-safety
- Legg til JSDoc som markerer dette som enkelt sannhetskilde

### Steg 3: Migrere importører (67 filer)
**Prioritering:**
1. Høyest brukt komponenter først (Button, Card, Input, Glass)
2. Deretter onboarding-komponenter
3. Deretter dashboard/reise/chat
4. Til slutt admin

**Måte:** Erstatt `import { colors } from 'config/design-tokens'` med `import { tokens } from 'components/ui/tokens'`

### Steg 4: Fjern hardcoded verdier
**Søk etter:** `#D4AF37`, `#0A1A2A`, `#0F2233`, `rgba(255,255,255,`, `blur(` i `.tsx`-filer
**Erstatt med:** Token-referanser

### Steg 5: Fjern deprecated filer (når alle importører er migrert)
- `config/design-tokens.ts` → slett eller merk ARCHIVED
- `brand/ui5-tokens.ts` → slett
- Oppdater `docs/design-token-migration-guide.md` med fullført status

---

## 4. Tailwind v4 Integrering

Tailwind-klassenavn skal mape til tokens:

```js
// i tailwind.config.js — extend.theme
{
  colors: {
    'tosom': {
      bg: 'var(--ts-bg-primary)',
      'bg-secondary': 'var(--ts-bg-secondary)',
      gold: 'var(--ts-gold)',
      'gold-hover': 'var(--ts-gold-hover)',
      'gold-soft': 'var(--ts-gold-soft)',
      text: 'var(--ts-text-primary)',
      'text-secondary': 'var(--ts-text-secondary)',
      'text-muted': 'var(--ts-text-muted)',
    }
  },
  borderRadius: {
    'tosom-sm': 'var(--ts-radius-sm)',
    'tosom-md': 'var(--ts-radius-md)',
    'tosom-lg': 'var(--ts-radius-lg)',
    'tosom-xl': 'var(--ts-radius-xl)',
  },
  boxShadow: {
    'tosom-sm': 'var(--ts-shadow-sm)',
    'tosom-md': 'var(--ts-shadow-md)',
    'tosom-glow': 'var(--ts-shadow-glow-gold)',
  },
  backdropBlur: {
    'tosom': '12px',
    'tosom-subtle': '8px',
    'tosom-strong': '16px',
  }
}
```

---

## 5. Qwen ACT-instruks

```
Når du implementerer UI-system v2:

1. Les ALWAYS ai/system_prompt.md før hvert steg
2. START med globals.css — legg til alle --ts-* tokens der
3. Oppdater components/ui/tokens.ts til å lese fra CSS-vars
4. Migrér EN komponentgruppe om gangen (Button → Card → Input → Glass → ...)
5. Test hver migrerte komponent i browseren før neste steg
6. Bruk search_files for å finne alle hardcoded farger som skal erstatte med tokens
7. Når alle 67 importører av config/design-tokens.ts er migrert, merk filen ARCHIVED
8. Ikke endre visuelle verdier — kun konsolider kilde
9. Bevar eksisterende utseende 1:1 — dette er refaktorering ikke redesign
```

---

*Slutt på UI-system Manual v2.*