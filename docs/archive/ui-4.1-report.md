# ToSom UI 4.1 — Visual Identity Pass

**Dato:** 2026-06-20  
**Versjon:** 4.1  
**Status:** Ferdig

---

## 📋 Oppsummering

ToSom UI 4.1 er en **visell identitetsoppdatering** som gjør plattformen dypere, roligere og mer premium.

### Nøkkelendringer:
- **Nordic Calm palette** — ny bakgrunn, tekst og accenter
- **Gold Noir accents** — rikere gulltoner
- **Utvidet spacing** — 6xl (120px) og 7xl (144px)
- **Display typografi** — 3 nye Display-størrelser (56px, 44px, 36px)
- **Heading 2XL** — 48px heading
- **Forbedret glassmorphism** — sterkere blur (16px→24px→40px)
- **Gold Glow** — 4 nivåer av gull-glow
- **Soft Shadows** — mykere skygger
- **Section spacing** — py-section, px-section, gap-section
- **Calm gradients** — blå, gull, rose, violet

---

## 🎨 Fargeendringer

### Før → Etter

| Token | Før | Etter |
|-------|-----|-------|
| `--ts-bg-primary` | `#0A0F1F` | `#080C18` |
| `--ts-bg-secondary` | `#111827` | `#0C1122` |
| `--ts-bg-surface` | `#1A1A1D` | `#111827` |
| `--ts-bg-surface-elevated` | `#222226` | `#1A2332` |
| `--ts-text-primary` | `#F5F5F5` | `#F0ECE4` |
| `--ts-text-secondary` | `#E5E7EB` | `#C9C4B8` |
| `--ts-gold-glow` | `rgba(212,175,55,0.25)` | `rgba(212,175,55,0.3)` |
| `--ts-glass-blur` | `12px` | `16px` |
| `--ts-shadow-lg` | `0 8px 30px rgba(0,0,0,0.3)` | `0 8px 32px rgba(0,0,0,0.35)` |

### Nye farger lagt til:

```
Nordic Calm Deep:     #060A14
Nordic Calm Warm:     #12101A
Gold Noir:            #C1942F
Calm Blue:            #4A7B9F
Calm Blue Soft:       rgba(74,123,159,0.15)
Calm Green:           #6BAF8B
Calm Green Soft:      rgba(107,175,139,0.15)
Calm Rose:            #C47DA0
Calm Rose Soft:       rgba(196,125,160,0.15)
Calm Violet:          #8B7BC4
Calm Violet Soft:     rgba(139,123,196,0.15)
```

---

## 📐 Spacing-endringer

### Utvidet skala:

| Token | Verdi | Beskrivelse |
|-------|-------|-----|
| --ts-spacing-xs | 4px | Ekstra liten |
| --ts-spacing-sm | 8px | Liten |
| --ts-spacing-md | 16px | Medium |
| --ts-spacing-lg | 24px | Stor |
| --ts-spacing-xl | 32px | Ekstra stor |
| --ts-spacing-2xl | 48px | 2x ekstra |
| --ts-spacing-3xl | 64px | 3x ekstra |
| --ts-spacing-4xl | 80px | 4x ekstra |
| --ts-spacing-5xl | 96px | 5x ekstra |
| --ts-spacing-6xl | 120px | **NY** — Section spacing |
| --ts-spacing-7xl | 144px | **NY** — Hero spacing |

### Seksjon-utilityklasser:

```css
.py-section    /* padding-top/bottom: 120px */
.px-section    /* padding-left/right: 32px */
.gap-section   /* gap: 80px */
.section-spacing       /* py + px kombinert */
.section-spacing-sm    /* 80px vertikalt */
.section-spacing-lg    /* 144px vertikalt */
```

---

## 🔤 Typografi-endringer

### Display-typografi (UI 4.1):

| Token | Size | Line-height | Letter-spacing | Bruk |
|-------|------|-------------|----------------|------|
| --ts-font-display-xl | 56px | 1.1 | -0.03em | **Hoved-hero overskrift** |
| --ts-font-display-l | 44px | 1.15 | -0.025em | **Under-hero overskrift** |
| --ts-font-display-m | 36px | 1.2 | -0.02em | **Seksjon-hero overskrift** |

### Heading-oppdateringer:

| Token | Før | Etter |
|-------|-----|-------|
| --ts-font-heading-2xl | (ny) | **48px** / 1.2 |
| --ts-font-heading-xl | 32px | **36px** / 1.2 |
| --ts-font-heading-l | 24px | **28px** / 1.25 |
| --ts-font-heading-m | 20px | **22px** / 1.3 |
| --ts-font-heading-s | 18px | **18px** / 1.35 |

### CSS-utilityklasser:

```css
.ts-display-xl    /* Hero XL — 56px */
.ts-display-l     /* Hero L — 44px */
.ts-display-m     /* Hero M — 36px */
.ts-font-heading-2xl   /* 48px */
.ts-font-heading-xl    /* 36px */
.ts-font-heading-l     /* 28px */
.ts-font-heading-m     /* 22px */
.ts-font-heading-s     /* 18px */
```

---

## 🪟 Glassmorphism-endringer

### Before → After:

| Token | Før | Etter |
|-------|-----|-------|
| --ts-glass-bg | `rgba(255,255,255,0.04)` | `rgba(255,255,255,0.025)` |
| --ts-glass-bg-hover | `rgba(255,255,255,0.08)` | `rgba(255,255,255,0.055)` |
| --ts-glass-border | `rgba(255,255,255,0.08)` | `rgba(255,255,255,0.06)` |
| --ts-glass-blur | `12px` | `16px` |

### Nye glass-verdier:

```
--ts-glass-bg-strong:       rgba(255,255,255,0.07)  ← Sterkere glass
--ts-glass-border-gold:     rgba(212,175,55,0.2)    ← Gull border
--ts-glass-blur-strong:     24px                     ← Sterkere blur
--ts-glass-blur-ultra:      40px                     ← Ultra blur
```

### Nye glass-utilityklasser:

```css
.ts-glass       /* Standard glass (16px blur) */
.ts-glass-strong   /* Sterkt glass (24px blur) */
.ts-glass-ultra    /* Ultra glass (40px blur) */
```

---

## ✨ Gold Glow (nytt i UI 4.1)

### CSS Variables:

```
--ts-glow-sm:      0 0 8px rgba(212,175,55,0.15)
--ts-glow-md:      0 0 16px rgba(212,175,55,0.2)
--ts-glow-lg:      0 0 32px rgba(212,175,55,0.25)
--ts-glow-xl:      0 0 64px rgba(212,175,55,0.3)
--ts-glow-text:    text-shadow: 0 0 12px rgba(212,175,55,0.2)
```

### Utilityklasser:

```css
.gold-glow-sm    /* Små glow-effekter */
.gold-glow-md    /* Medium glow */
.gold-glow-lg    /* Stor glow */
.gold-glow-xl    /* Ekstra stor glow */
.gold-glow-text  /* Tekst-glow */
```

---

## 🌑 Soft Shadows (nytt i UI 4.1)

### CSS Variables:

```
--ts-shadow-sm:    0 1px 3px rgba(0,0,0,0.35)   ← Tynnere
--ts-shadow-md:    0 4px 20px rgba(0,0,0,0.3)   ← Mykere
--ts-shadow-lg:    0 8px 32px rgba(0,0,0,0.35)  ← Større spread
--ts-shadow-xl:    0 16px 48px rgba(0,0,0,0.4)  ← Ekstra myk
--ts-shadow-gold:  0 0 24px rgba(212,175,55,0.12)  ← Gull glow
--ts-shadow-gold-hover:  0 0 32px rgba(212,175,55,0.25)
--ts-shadow-gold-soft: 0 0 16px rgba(212,175,55,0.08)
--ts-shadow-soft:  0 2px 12px rgba(0,0,0,0.2)  ← Ekstra myk
```

### Utilityklasser:

```css
.ts-shadow-sm          /* Standard */
.ts-shadow-md          /* Medium */
.ts-shadow-lg          /* Stor */
.ts-shadow-xl          /* Ekstra stor */
.ts-shadow-gold        /* Gull */
.ts-shadow-gold-hover  /* Gull hover */
.ts-shadow-gold-soft   /* Gull soft */
.ts-shadow-soft        /* Ekstra myk */
.soft-shadow-sm        /* Myk sm */
.soft-shadow-md        /* Myk md */
.soft-shadow-lg        /* Myk lg */
```

---

## 🎨 Calm Gradient Backgrounds (nytt i UI 4.1)

```css
.calm-gradient-blue   /* Primary → Calm Blue Soft */
.calm-gradient-gold   /* Primary → Gold Soft */
.calm-gradient-rose   /* Primary → Calm Rose Soft */
.calm-gradient-violet /* Primary → Calm Violet Soft */
```

---

## 🔤 Calm Accent Colors (nytt i UI 4.1)

### Farger:

| Navn | Verdi | Bruk |
|------|-------|------|
| Calm Blue | #4A7B9F | Kommunikasjon, trygghet |
| Calm Green | #6BAF8B | Vekst, suksess |
| Calm Rose | #C47DA0 | Kjærlighet, varme |
| Calm Violet | #8B7BC4 | Innsikt, refleksjon |

### Utilityklasser:

```css
/* Tekst-farger */
.text-ts-calm-blue
.text-ts-calm-green
.text-ts-calm-rose
.text-ts-calm-violet

/* Bakgrunn-farger */
.bg-ts-calm-blue
.bg-ts-calm-green
.bg-ts-calm-rose
.bg-ts-calm-violet

/* Border */
.border-ts-calm-blue
.border-ts-calm-green
```

---

## 📝 Tokens.ts — TypeScript-endringer

### colors (UI 4.1):

```typescript
// Nye eksporterte farger:
colors.bg.calmDeep       // var(--ts-bg-calm-deep)
colors.bg.calmWarm       // var(--ts-bg-calm-warm)
colors.text.goldAccent   // var(--ts-text-gold-accent)
colors.gold.noir         // var(--ts-gold-noir)
colors.gold.glowStrong   // var(--ts-gold-glow-strong)
colors.calm.blue         // var(--ts-calm-blue)
colors.calm.blueSoft     // var(--ts-calm-blue-soft)
colors.calm.green        // var(--ts-calm-green)
colors.calm.greenSoft    // var(--ts-calm-green-soft)
colors.calm.rose         // var(--ts-calm-rose)
colors.calm.roseSoft     // var(--ts-calm-rose-soft)
colors.calm.violet       // var(--ts-calm-violet)
colors.calm.violetSoft   // var(--ts-calm-violet-soft)
colors.glass.bgStrong    // var(--ts-glass-bg-strong)
colors.glass.borderGold  // var(--ts-glass-border-gold)
colors.glass.blurStrong  // var(--ts-glass-blur-strong)
colors.glass.blurUltra   // var(--ts-glass-blur-ultra)
colors.border.subtle     // var(--ts-border-subtle)
```

### spacing (UI 4.1):

```typescript
// Nye størrelser:
spacing['6xl']   // 120px
spacing['7xl']   // 144px
```

### typography (UI 4.1):

```typescript
// Nye typografi-objekter:
typography.displayXL   // 56px, line-height 1.1, letter-spacing -0.03em
typography.displayL    // 44px, line-height 1.15, letter-spacing -0.025em
typography.displayM    // 36px, line-height 1.2, letter-spacing -0.02em
typography.heading2XL  // 48px, line-height 1.2
```

### shadows (UI 4.1):

```typescript
// Nye skygger:
shadows.goldSoft   // 0 0 16px rgba(212,175,55,0.08)
shadows.soft       // 0 2px 12px rgba(0,0,0,0.2)
```

### cssVarNames (UI 4.1):

```typescript
// Nye CSS-var navn:
cssVarNames.bgCalmDeep
cssVarNames.bgCalmWarm
cssVarNames.textGoldAccent
cssVarNames.goldNoir
cssVarNames.goldGlowStrong
cssVarNames.calmBlue ... (alle calmer)
cssVarNames.glassBgStrong
cssVarNames.glassBorderGold
cssVarNames.glassBlurStrong
cssVarNames.glassBlurUltra
cssVarNames.borderSubtle
cssVarNames.spacings['6xl']
cssVarNames.spacings['7xl']
cssVarNames.radius['3xl']
cssVarNames.shadows.goldSoft
cssVarNames.shadows.soft
cssVarNames.typography.displayXL ... (alle display/headings)
```

---

## 🏗️ Platform-endringer

```typescript
// glassIntensity oppdatert:
platform.tokens.glassIntensity.web: '16px'  // var fra 12px
```

---

## 📊 Før → Etter Visuell Beskrivelse

### Bakgrunn
**Før:** Mørk blå-sort (#0A0F1F)  
**Etter:** Dypere, kaldere nordisk blå (#080C18) — mer rolig, mer premium

### Tekst
**Før:** Ren hvit (#F5F5F5)  
**Etter:** Varm off-white (#F0ECE4) — mykere, mer intim

### Gull
**Før:** Standard gull (#D4AF37)  
**Etter:** Samme base, men med Gold Noir (#C19A2F) og Gold Glow Strong (0.5)

### Glass
**Før:** Lett glass (bg 0.04, blur 12px)  
**Etter:** Dypere glass (bg 0.025, blur 16px→24px→40px)

### Skygger
**Før:** Harte, tunge skygger  
**Etter:** Myke, utbredte skygger (spread 32px→48px)

### Seksjoner
**Før:** 64px vertikalt (3xl)  
**Etter:** 120px vertikalt (6xl) — mer luft, mer ro

### Display Typografi
**Før:** Maksimal 32px (heading-xl)  
**Etter:** 56px (display-xl) — stor hero, sterk visuell hierarki

---

## 🚀 Forslag til UI 4.2

### 1. Animated Gold Gradients
```css
.gold-gradient-animated {
  background: linear-gradient(135deg, #D4AF37, #E8C766, #D4AF37);
  background-size: 200% 200%;
  animation: goldShift 6s ease infinite;
}
```

### 2. Parallax Hero Sections
- Scroll-basert parallax for hero-seksjoner
- Bruk `--ts-motion-stagger-slow` for delay

### 3. Mood-baserte Temaer
- Dynamisk fargepalett basert på stemning
- `calm-gradient-blue` → `calm-gradient-rose` overgang

### 4. AI-genererte Bakgrunner
- Subtile, genererte mønstre per relasjonstype
- Kun som `body::before` overlay

### 5. Micro-interaksjoner
- Knapp-trykk med gold-glow respons
- Hover med gold-border overgang

---

## ✅ Checklist

- [x] Nordic Calm palette (bg-primary, bg-secondary, bg-surface)
- [x] Gold Noir accents (gold-noir, glow-strong)
- [x] Nye CSS-variabler (16 tokens)
- [x] Nye glassmorphism-stiler (3 nivåer: standard, strong, ultra)
- [x] Display typografi (3 størrelser: 56, 44, 36)
- [x] Heading 2XL (48px)
- [x] Utvidet spacing (6xl: 120px, 7xl: 144px)
- [x] Gold Glow (4 nivåer: sm, md, lg, xl)
- [x] Soft Shadows (sm, md, lg, xl + gold + gold-soft)
- [x] Section spacing (py-section, px-section, gap-section)
- [x] Calm gradients (blue, gold, rose, violet)
- [x] Calm accent farger (blue, green, rose, violet)
- [x] TypeScript tokens oppdatert (colors, spacing, typography, shadows)
- [x] CSS utility classes oppdatert
- [x] Platform tokens oppdatert (glassIntensity)

---

*ToSom UI 4.1 — Visual Identity Pass*