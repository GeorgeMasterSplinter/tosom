# ToSom UI 4.2 — Full Rapport

**Versjon:** 4.2  
**Status:** Ferdig  
**Dato:** 2026-06-20  
**Arkitekt:** MasterSplinter  
**Tokens:** Qwen  
**Implementering:** Cline

---

## 📋 Sammendrag

UI 4.2 er en komplett visuell oppgradering av hele ToSom plattformen. Den introduserer:

- **Nordic Calm + Gold Noir** fargepalett
- **Calm Gradients** (blue, gold, rose, violet)
- **Gold Glow** system
- **Display Typography** hierarki (display-xl, display-l, display-m)
- **Spacing Tokens** (xs→7xl)
- **Glassmorphism** system (standard, strong, ultra)
- **Animation Tokens** (duration, easing, stagger)
- **6 seksjoner oppgradert** med visuell hierarki og premium-følelse

---

## 🎨 Fargepalett

### Primary Colors
| Token | Verdi | Bruk |
|-------|-------|------|
| `bg-deep` | `#060A14` | Body bakgrunn |
| `bg-primary` | `#080C18` | Sekundær bakgrunn |
| `bg-surface` | `#111827` | Kort, paneler |
| `bg-surface-elevated` | `#1A2332` | Hover flater |

### Text Colors
| Token | Verdi | Bruk |
|-------|-------|------|
| `text-primary` | `#F0ECE4` | Overskrifter |
| `text-secondary` | `#C9C4B8` | Hovedtekst |
| `text-muted` | `rgba(201,196,184,0.6)` | Muted |
| `text-subtle` | `rgba(201,196,184,0.35)` | Placeholder |

### Gold Noir
| Token | Verdi | Bruk |
|-------|-------|------|
| `gold` | `#D4AF37` | Primær knapp, CTA |
| `gold-light` | `#E8C766` | Hover |
| `gold-soft` | `rgba(212,175,55,0.08)` | Bakgrunn |

### Nordic Calm Accents
| Token | Verdi | Bruk |
|-------|-------|------|
| `calm-blue` | `#4A7B9F` | Trygghet |
| `calm-rose` | `#C47DA0` | Kjærlighet |
| `calm-violet` | `#8B7BC4` | Refleksjon |
| `calm-green` | `#6BAF8B` | Suksess |

---

## 📄 Seksjoner Oppgradert

### 1. Landing Page (`app/(landing)/LandingView.tsx`)

**Før:**
- Flat bakgrunn (#0A0F1F)
- Cards med hard glass (bg 0.04)
- Standard spacing (3xl = 64px mellom seksjoner)
- Teksten er for liten for hero

**Etter:**
- Gradient-bakgrunn med `calm-gradient-gold` opacity 60%
- `ts-display-xl` (56px) med `gold-glow-text`
- Seksjon spacing: `space-y-2xl`, `py-6xl`
- Feature-cards: `ts-glass` + hover gold-border-glow
- Under utvikling seksjon: `calm-gradient-violet` bg
- Alle cards: `ts-glass` + `shadow-soft` + `gold-glow-sm` på hover

---

### 2. Login Page (`app/login/page.tsx`)

**Før:**
- Simple glass-kort på flat bakgrunn
- Gull-knapp uten glow
- Minimal animasjon

**Etter:**
- Bakgrunn med `calm-gradient-gold` opacity 50%
- Login-kort med `ts-glass-strong` (24px blur)
- `ts-display-m` (36px) for "Logg inn" med `gold-glow-text`
- Knapp med `gold-glow-md hover:gold-glow-lg`
- Input med `focus:shadow-[0_0_0_3px_rgba(212,175,55,0.2)]`

---

### 3. Dashboard (`app/dashboard/DashboardView.tsx`)

**Før:**
- Grid av kort med samme størrelse
- Ingen hierarki
- Flatt og anonymt

**Etter:**
- `ts-display-m` med `gold-glow-text` for "Velkommen tilbake"
- Hero-card for "neste match" med `ts-glass-strong` + gold border
- Sekundære kort med `shadow-soft`
- Grid gap `2xl` (48px) for luft
- Match profile med gold ring + glow
- Resonans tags med `bg-ts-gold-soft`
- Samtale seksjon: `calm-gradient-blue` subtil bg
- Reise seksjon: `calm-gradient-gold` subtil bg

---

### 4. Match Page (`app/match/page.tsx`)

**Før:**
- Match-cards i feed-lignende layout
- Ingen varme eller intimitet
- For teknisk

**Etter:**
- Bakgrunn med `calm-gradient-rose` opacity 40%
- Én match per visning (focus-mode) med 2-col grid
- Match-kort med `ts-glass-strong` + `calm-gradient-rose` overlay
- Navn med `group-hover:text-ts-gold` transition
- Resonans-indikator med animert gold bar
- Avatar med gold ring + `gold-glow-sm`
- "Start reisen →" CTA med gold hover

---

### 5. Journey Page (`app/journey/page.tsx`)

**Før:**
- Lineær timeline med points
- Ingen emotion
- For strukturelt

**Etter:**
- Bakgrunn med `calm-gradient-gold` opacity 30%
- JourneyMap med `ts-glass-strong` + `gold-glow-md`
- ResonanceMeter sentral med gold glow
- Dagens oppgave med `calm-gradient-rose` overlay
- Refleksjon-kort med `ts-glass` + gold-border
- Navigasjon med gold-glow buttons
- Alle seksjoner: `space-y-lg`, `p-xl` for luft

---

### 6. Profile Page (`app/profile/[id]/ProfileView.tsx`)

**Før:**
- Standard profilvisning
- Ingen varme eller gold accents
- Gray-950 bakgrunn

**Etter:**
- Bakgrunn med `calm-gradient-violet` opacity 30%
- Profilbilde med gold ring + `gold-glow-md`
- Alle kort med `ts-glass-strong` + hover gold-border
- Interesser med `bg-ts-gold-soft` tags
- Bilder med `ring-ts-gold/20` + hover gold-glow
- Handlinger med gold-glow buttons
- Skeleton med token-baserte farger

---

## 🎨 Gradient Recipes

```css
/* Blue (trygghet) - brukt i Samtale */
.calm-gradient-blue {
  background: linear-gradient(135deg, var(--ts-bg-primary), rgba(74,123,159,0.15));
}

/* Gold (premium) - brukt i Landing, Journey */
.calm-gradient-gold {
  background: linear-gradient(135deg, var(--ts-bg-primary), rgba(212,175,55,0.08));
}

/* Rose (kjærlighet) - brukt i Match, Oppgave */
.calm-gradient-rose {
  background: linear-gradient(135deg, var(--ts-bg-primary), rgba(196,125,160,0.15));
}

/* Violet (refleksjon) - brukt i Profile */
.calm-gradient-violet {
  background: linear-gradient(135deg, var(--ts-bg-primary), rgba(139,123,196,0.15));
}
```

---

## ✨ Glow Classes

| Class | Verdi | Bruk |
|-------|-------|------|
| `glow-sm` | `0 0 8px rgba(212,175,55,0.15)` | Micro |
| `glow-md` | `0 0 16px rgba(212,175,55,0.2)` | Standard |
| `glow-lg` | `0 0 32px rgba(212,175,55,0.25)` | Sterk |
| `glow-xl` | `0 0 64px rgba(212,175,55,0.3)` | Ekstra |
| `glow-text` | `text-shadow` gold | Tekst |

---

## 📐 Typography Tokens

| Token | Size | Line-height | Bruk |
|-------|------|-|------|
| `ts-display-xl` | 56px | 1.1 | Hero-tittel |
| `ts-display-m` | 36px | 1.2 | Seksjon-hero |
| `ts-font-heading-2xl` | 48px | 1.2 | Seksjon |
| `ts-font-heading-xl` | 36px | 1.2 | Under-seksjon |
| `ts-font-heading-l` | 28px | 1.25 | Kort-tittel |
| `ts-font-heading-m` | 22px | 1.3 | Sub-tittel |
| `ts-font-heading-s` | 18px | 1.35 | Label |

---

## 📐 Spacing Tokens

| Token | Verdi | Bruk |
|-------|-------|------|
| `xs` | 4px | Minste |
| `sm` | 8px | Liten |
| `md` | 16px | Standard |
| `lg` | 24px | Stor |
| `xl` | 32px | Ekstra |
| `2xl` | 48px | Seksjon-gap |
| `3xl` | 64px | Seksjon |
| `4xl` | 80px | Stor seksjon |
| `6xl` | 120px | **Hoved-seksjon** |
| `7xl` | 144px | Hero |

---

## 🪟 Glassmorphism Tokens

| Class | Verdi | Bruk |
|-------|-------|------|
| `ts-glass` | `bg-white/2.5 border-white/6 blur` | Standard |
| `ts-glass-strong` | `bg-white/7 border-white/12 blur-24` | Kort |
| `ts-glass-ultra` | `bg-white/10 border-white/16 blur-40` | Modaler |

---

## 🎭 Animation Tokens

| Kategori | Token | Verdi |
|------|-------|-------|
| Duration | `fast` | 150ms |
| | `normal` | 250ms |
| | `slow` | 350ms |
| Easing | `smooth` | `cubic-bezier(0.25,0.1,0.25,1)` |
| Stagger | `normal` | 80ms |

---

## 🏗️ Visual Hierarchy

For hver side er hierarkiet nå:

1. **Fokuspunkt** — ét klart hovedelement (hero-tittel eller match-card)
2. **Sekundær** — under-tittel eller info
3. **Tertiær** — body-tekst, metadata
4. **Subtil** — captions, labels

Alle seksjoner har:
- `calm-gradient` bakgrunn
- `ts-glass-strong` kort
- `gold-glow` hover states
- `space-xl` padding for luft

---

## ✅ Quality Gates

### Ro ✅
- Ingen stressende elementer
- Alt puster med `space-xl` padding
- Én fokuspunkt per seksjon

### Varme ✅
- Alle navn i gull-aksenter
- `calm-gradient-*` bakgrunner
- `gold-glow` hover states

### Hierarki ✅
- `ts-display-xl` for hoved-tittel
- `ts-font-heading-*` for seksjon
- `text-ts-gold` for aksenter

### Luft ✅
- Seksjon spacing: `py-6xl`
- Card padding: `p-xl`
- Gap: `gap-2xl`

### Premium ✅
- `ts-glass-strong` på alle kort
- `gold-glow-md` på CTA
- Gradient-bakgrunner på alle sider

### Ét Produkt ✅
- Samme tokens på alle sider
- Samme spacing-system
- Samme glassmorphism
- Samme gold-accent

### Mobile ✅
- Grid: 1 col → 2 cols → 3 cols
- `px-section` padding
- `space-*` responsive

### Reduced Motion ✅
- `transition-all duration-[var(--ts-transition-normal)]`
- Ingen autoplay animations
- Ingen store bevegelser

---

## 📊 Files Changed

| File | Type | Lines |
|------|------|-------|
| `docs/VISUAL_SPEC.md` | Ny | 420+ |
| `app/(landing)/LandingView.tsx` | Oppdatert | ~150 |
| `app/login/page.tsx` | Oppdatert | ~100 |
| `app/dashboard/DashboardView.tsx` | Oppdatert | ~380 |
| `app/match/page.tsx` | Oppdatert | ~170 |
| `app/journey/page.tsx` | Oppdatert | ~160 |
| `app/profile/[id]/ProfileView.tsx` | Oppdatert | ~250 |
| `app/conversation/[id]/ConversationView.tsx` | Oppdatert | ~350 |

**Totalt:** 8 filer, ~2000+ linjer endret

---

## 🎯 Resultat

ToSom UI 4.2 gir en **komplett visuell transformasjon**:

| Aspekt | Før | Etter |
|--------|-----|-------|
| Bakgrunn | Flat | Gradient med dybde |
| Kort | Standard glass | Strong glass + glow |
| Typografi | Standard | Display + heading tokens |
| Knapper | Flat gold | Gold glow + gradient |
| Seksjoner | 64px gap | 120px gap + gradient |
| Feel | Teknisk | Premium, varm, rolig |

---

*ToSom UI 4.2 — Ferdig — 2026-06-20*