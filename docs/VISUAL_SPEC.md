# ToSom UI 4.2 — Visual Spec & Brand Guide

**Versjon:** 4.2  
**Status:** Final  
**Forfatter:** MasterSplinter (arkitekt) + Qwen (tokens) + Cline (implementering)

---

## 1. Brand Principles

ToSom skal føles som:

| Prinsipp | Betydning |
|----------|-----------|
| **Ro** | Ingen stress, ingen jag. Alt puster. |
| **Varme** | Tekster, farger, former — alt er varmt og inviterende. |
| **Ét produkt** | Alt skal se ut som samme firma bygde det — ingen moduler. |
| **Premium** | Dyp, mørk base med gullaksenter og glassmorphism. |
| **Relasjons-først** | Fokus på to mennesker, ikke uendelige valg. |

---

## 2. Fargepalett — Nordic Calm + Gold Noir

### Primary Colors

| Token | Verdi | Bruk |
|-------|-------|------|
| `bg-deep` | `#060A14` | Body bakgrunn (mest dyp) |
| `bg-primary` | `#080C18` | Sekundær bakgrunn |
| `bg-secondary` | `#0C1122` | Seksjon-bakgrunn |
| `bg-surface` | `#111827` | Kort, paneler |
| `bg-surface-elevated` | `#1A2332` | Hover/active flater |
| `bg-calm-warm` | `#12101A` | Varme seksjoner |

### Text Colors

| Token | Verdi | Bruk |
|-------|-------|------|
| `text-primary` | `#F0ECE4` | Hovedtekst, overskrifter |
| `text-secondary` | `#C9C4B8` | Sekundær tekst |
| `text-muted` | `rgba(201,196,184,0.6)` | Muted tekst |
| `text-subtle` | `rgba(201,196,184,0.35)` | Placeholder, labels |
| `text-gold-accent` | `#D4AF37` | Gull-aksent |

### Gold Noir

| Token | Verdi | Bruk |
|-------|-------|------|
| `gold` | `#D4AF37` | Primær knapp, CTA |
| `gold-light` | `#E8C766` | Hover |
| `gold-dark` | `#B8942E` | Disabled, depth |
| `gold-noir` | `#C19A2F` | Sekundær gull |
| `gold-soft` | `rgba(212,175,55,0.08)` | Bakgrunn for gull-seksjoner |
| `gold-glow-strong` | `rgba(212,175,55,0.5)` | Intens glow |

### Nordic Calm Accents

| Token | Verdi | Bruk |
|-------|-------|------|
| `calm-blue` | `#4A7B9F` | Kommunikasjon, trygghet |
| `calm-blue-soft` | `rgba(74,123,159,0.15)` | Bakgrunn for blau-seksjoner |
| `calm-green` | `#6BAF8B` | Suksess, vekst |
| `calm-green-soft` | `rgba(107,175,139,0.15)` | Bakgrunn for grønn-seksjoner |
| `calm-rose` | `#C47DA0` | Kjærlighet, varme |
| `calm-rose-soft` | `rgba(196,125,160,0.15)` | Bakgrunn for rose-seksjoner |
| `calm-violet` | `#8B7BC4` | Innsikt, refleksjon |
| `calm-violet-soft` | `rgba(139,123,196,0.15)` | Bakgrunn for violet-seksjoner |

### Glassmorphism

| Token | Verdi | Bruk |
|-------|-------|------|
| `glass-bg` | `rgba(255,255,255,0.025)` | Standard glass |
| `glass-bg-hover` | `rgba(255,255,255,0.055)` | Hover glass |
| `glass-bg-strong` | `rgba(255,255,255,0.07)` | Sterkt glass |
| `glass-border` | `rgba(255,255,255,0.06)` | Standard border |
| `glass-border-hover` | `rgba(255,255,255,0.12)` | Hover border |
| `glass-border-gold` | `rgba(212,175,55,0.2)` | Gull-border |
| `glass-blur` | `16px` | Standard blur |
| `glass-blur-strong` | `24px` | Sterkt blur |
| `glass-blur-ultra` | `40px` | Ultra blur |

### Shadows

| Token | Verdi | Bruk |
|-------|-------|------|
| `shadow-sm` | `0 1px 3px rgba(0,0,0,0.35)` | Lite kort |
| `shadow-md` | `0 4px 20px rgba(0,0,0,0.3)` | Standard kort |
| `shadow-lg` | `0 8px 32px rgba(0,0,0,0.35)` | Sterkt kort |
| `shadow-xl` | `0 16px 48px rgba(0,0,0,0.4)` | Premium kort |
| `shadow-gold` | `0 0 24px rgba(212,175,55,0.12)` | Gull-shadow |
| `shadow-gold-hover` | `0 0 32px rgba(212,175,55,0.25)` | Gull hover |
| `shadow-gold-soft` | `0 0 16px rgba(212,175,55,0.08)` | Subtil gull |
| `shadow-soft` | `0 2px 12px rgba(0,0,0,0.2)` | Myk shadow |

### Gold Glow

| Token | Verdi | Bruk |
|-------|-------|------|
| `glow-sm` | `0 0 8px rgba(212,175,55,0.15)` | Liten glow |
| `glow-md` | `0 0 16px rgba(212,175,55,0.2)` | Medium glow |
| `glow-lg` | `0 0 32px rgba(212,175,55,0.25)` | Stor glow |
| `glow-xl` | `0 0 64px rgba(212,175,55,0.3)` | Ekstra stor glow |

---

## 3. Typografi-hierarki

### Display (Hero)

| Token | Size | Line-height | Letter-spacing | Bruk |
|-------|------|-------------|----------------|------|
| `display-xl` | 56px | 1.1 | -0.03em | Hoved-hero tittel |
| `display-l` | 44px | 1.15 | -0.025em | Under-hero tittel |
| `display-m` | 36px | 1.2 | -0.02em | Seksjon-hero tittel |

### Headings

| Token | Size | Line-height | Bruk |
|-------|------|-------------|------|
| `heading-2xl` | 48px | 1.2 | Seksjon-tittel |
| `heading-xl` | 36px | 1.2 | Under-seksjon tittel |
| `heading-l` | 28px | 1.25 | Kort-tittel |
| `heading-m` | 22px | 1.3 | Sub-tittel |
| `heading-s` | 18px | 1.35 | Label, tag |

### Body

| Token | Size | Line-height | Bruk |
|-------|------|-------------|------|
| `body` | 16px | 1.65 | Hovedtekst |
| `body-small` | 14px | 1.6 | Liten tekst |
| `caption` | 12px | 1.5 | Caption, metadata |

---

## 4. Spacing-skala

| Token | Verdi | Bruk |
|-------|-------|------|
| `xs` | 4px | Ekstra liten |
| `sm` | 8px | Liten |
| `md` | 16px | Medium |
| `lg` | 24px | Stor |
| `xl` | 32px | Ekstra stor |
| `2xl` | 48px | Seksjon-gap |
| `3xl` | 64px | Seksjon-padding |
| `4xl` | 80px | Stor seksjon |
| `5xl` | 96px | Hero-area |
| `6xl` | 120px | **Hoved-seksjon spacing** |
| `7xl` | 144px | **Ekstra hero/CTA** |

---

## 5. Radius

| Token | Verdi | Bruk |
|-------|-------|------|
| `sm` | 8px | Icons, badges |
| `md` | 12px | Buttons, inputs |
| `lg` | 16px | Kort, paneler |
| `xl` | 20px | Store paneler, modaler |
| `2xl` | 24px | Modaler, dialogs |
| `3xl` | 32px | Hero-cards, feature-cards |

---

## 6. VISUAL REFERENCE — Før/etter

### 6.1 Landing Page

**Før:**
- Flat bakgrunn (#0A0F1F)
- Cards med hard glass (bg 0.04)
- Standard spacing (3xl = 64px mellom seksjoner)
- Teksten er for liten for hero

**Etter:**
- Gradient-bakgrunn fra `#080C18` til `#0C1122`
- Dyp glass (bg 0.025, blur 16px→40px)
- Seksjon spacing: 6xl = 120px vertikal luft
- Hero: display-xl (56px) med gold-glow-text
- Feature-cards: hover med gold-border-glow
- Section gradient-bg (calm-gradient-blue/gold)

### 6.2 Login Page

**Før:**
- Simple glass-kort på flat bakgrunn
- Gull-knapp uten glow
- Minimal animasjon

**Etter:**
- Bakgrunn med subtil `calm-gradient-gold`
- Login-kort med `ts-glass-strong` (24px blur)
- Knapp med `gold-glow-md` på hover
- Subtil pulse-animasjon på CTA
- Label med `text-gold-accent` highlight

### 6.3 Dashboard

**Før:**
- Grid av kort med samme størrelse
- Ingen hierarki
- Flatt og anonymt

**Etter:**
- Hero-card for "neste match" med gold border
- Sekundære kort med `ts-shadow-soft`
- Grid gap `4xl` (80px) for luft
- Stagger-animasjon på kort-innlastning
- Profilbilde med gold ring + glow

### 6.4 Match Page

**Før:**
- Match-cards i feed-lignende layout
- Ingen varme eller intimitet
- For teknisk

**Etter:**
- Én match per visning (focus-mode)
- Match-kort med `calm-gradient-rose` bg
- Navn med `text-gold-accent` + `gold-glow-text`
- Resonans-indikator med gold-bar (animert)
- "Start reisen" med `gold-glow-lg` på hover

### 6.5 Chat Page

**För:**
- Standard chat-bubbles
- Ingen varme
- Kalde grå farger

**Etter:**
- Bakgrunn med subtil `calm-gradient-blue` (trygghet)
- Mottatte bubbles: `glass-bg` med gold-border-left
- Egne bubbles: `gold-soft` bg + gold-border-right
- Chat-input med `gold-glow-sm` på focus
- Typing-indikator med `gold-glow-text`

### 6.6 Journey Page

**För:**
- Lineær timeline med points
- Ingen emotion
- For strukturelt

**Etter:**
- Timeline med `gold-glow-md` på aktive milestones
- Segmenter med `calm-gradient-*` bakgrunner
- Milestone-cards med `ts-glass-strong`
- Progress-bar med gull-gradient
- Animert connective-line (gold-glow)

### 6.7 Couples Mode

**För:**
- Liste av features
- Ingen følelse av "sammen"
- Ingen visualisering

**Etter:**
- Shared-home med `calm-gradient-rose` hero
- Shared-goals med gold-progress-rings
- Shared-calendar med gold-dots for felles-dager
- Memory-lane med glass-gallery + gold-borders
- "Together-stats" med gold-glow-cards

---

## 7. Gradient Recipes

### Calm Gradients

```css
/* Blue (trygghet) */
.calm-gradient-blue {
  background: linear-gradient(135deg, var(--ts-bg-primary), var(--ts-calm-blue-soft));
}

/* Gold (premium) */
.calm-gradient-gold {
  background: linear-gradient(135deg, var(--ts-bg-primary), var(--ts-gold-soft));
}

/* Rose (kjærlighet) */
.calm-gradient-rose {
  background: linear-gradient(135deg, var(--ts-bg-primary), var(--ts-calm-rose-soft));
}

/* Violet (refleksjon) */
.calm-gradient-violet {
  background: linear-gradient(135deg, var(--ts-bg-primary), var(--ts-calm-violet-soft));
}
```

### Gold Button Gradient

```css
.btn-gold-premium {
  background: linear-gradient(135deg, #D4AF37, #E8C766);
  box-shadow: 0 0 24px rgba(212,175,55,0.12);
}
.btn-gold-premium:hover {
  background: linear-gradient(135deg, #E8C766, #F0D578);
  box-shadow: 0 0 32px rgba(212,175,55,0.25);
  transform: translateY(-1px);
}
```

---

## 8. Animation Tokens

| Kategori | Token | Verdi | Bruk |
|----------|-------|-------|------|
| **Duration** | instant | 80ms | Micro-interaksjoner |
| | faster | 120ms | Hover states |
| | fast | 150ms | Standard transition |
| | normal | 250ms | Side-transition |
| | slow | 350ms | Hero animation |
| | slower | 500ms | Stagger items |
| **Easing** | smooth | cubic-bezier(0.25,0.1,0.25,1) | Standard |
| | spring | cubic-bezier(0.34,1.56,0.64,1) | Bounce |
| | subtleBounce | cubic-bezier(0.175,0.885,0.32,1.275) | Gentle |
| **Stagger** | fast | 50ms | Tett liste |
| | normal | 80ms | Standard liste |
| | slow | 120ms | Hero items |

---

## 9. Layout Rules

### Grid System

| Breakpoint | Grid cols | Gap |
|------------|-----------|-----|
| Mobile | 1 col | — |
| sm (640px) | 2 cols | 2xl (48px) |
| md (768px) | 2 cols | 2xl (48px) |
| lg (1024px) | 3 cols | 3xl (64px) |
| xl (1280px) | 4 cols | 4xl (80px) |

### Container Rules

| Type | Max-width | Padding |
|------|-----------|---------|
| Hero | full | py-7xl px-xl |
| Section | 80rem | py-6xl px-xl |
| Card | auto | p-xl |
| Modal | 560px | py-xl px-xl |

---

## 10. Component Standards

### Glass Card

```tsx
<div className="ts-glass rounded-[var(--ts-radius-xl)] p-[var(--ts-spacing-xl)]">
  {/* content */}
</div>
```

### Gold Button

```tsx
<button className="btn-primary gold-glow-md hover:gold-glow-lg transition-all var(--ts-transition-normal)">
  CTA
</button>
```

### Section Wrapper

```tsx
<div className="section-spacing py-section px-section">
  {/* content */}
</div>
```

### Hero Display

```tsx
<h1 className="ts-display-xl text-gold-glow-text">
  Tittel
</h1>
```

---

## 11. Quality Gates

Alt UI må passere disse:

- [ ] **Ro:** Er det for mye som skjer samtidig? ( Nei )
- [ ] **Varme:** Føles det varmt og inviterende? ( Ja )
- [ ] **Hierarki:** Er det én klar fokuspunkt? ( Ja )
- [ ] **Luft:** Trenger det mer padding/margin? ( Sjekk )
- [ ] **Premium:** Ser det ut som et betalt produkt? ( Ja )
- [ ] **Ét produkt:** Ser alt ut som fra samme firma? ( Ja )
- [ ] **Mobile:** Fungerer alt på 375px+? ( Ja )
- [ ] **Reduced Motion:** Fungerer for folks som vil unngå animasjon? ( Ja )

---

*ToSom UI 4.2 — Visual Spec & Brand Guide — Ferdig*