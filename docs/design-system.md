# ToSom — Design System

**Oppdatert:** 2026-06-22  
**Versjon:** 5.0 — Nordic Gold Premium

---

## 1. Grunnleggande tokens

### Fargar (Colors)

| Token | Verdi | Bruk |
|-------|-------|------|
| `--ts-bg-primary` | `#0B0E11` | Bakgrunn |
| `--ts-bg-secondary` | `#11151A` | Sekundær bakgrunn |
| `--ts-bg-surface` | `#1A1F26` | Panel-bakgrunn |
| `--ts-text-primary` | `#FFFFFF` | Primær tekst |
| `--ts-text-secondary` | `rgba(255,255,255,0.65)` | Sekundær tekst |
| `--ts-text-muted` | `rgba(255,255,255,0.45)` | Dempa tekst |
| `--ts-gold` | `#D4AF37` | Gull-aksent |
| `--ts-gold-light` | `#E8C766` | Gull hover |
| `--ts-glass-bg` | `rgba(255,255,255,0.04)` | Glass bakgrunn |
| `--ts-glass-border` | `rgba(255,255,255,0.08)` | Glass border |

### Typografi (Typography)

| Token | Verdi | Bruk |
|-------|-------|------|
| `--ts-font-display-xl` | `64px` | Hero overskrift |
| `--ts-font-display-l` | `56px` | Sekundær hero |
| `--ts-font-display-m` | `48px` | Tredje hero |
| `--ts-font-heading-xl` | `32px` | H1 seksjon |
| `--ts-font-heading-l` | `28px` | H2 seksjon |
| `--ts-font-heading-m` | `24px` | H3 seksjon |
| `--ts-font-heading-s` | `20px` | H4/kort-tittel |
| `--ts-font-body` | `16px` | Brødtekst |
| `--ts-font-small` | `14px` | Liten tekst |
| `--ts-font-xs` | `12px` | Ultra liten |

### Spacing (Avstandar)

| Token | Verdi | Bruk |
|-------|-------|------|
| `--ts-spacing-xs` | `4px` | XS gap |
| `--ts-spacing-sm` | `8px` | SM gap |
| `--ts-spacing-md` | `16px` | MD gap |
| `--ts-spacing-lg` | `24px` | LG padding |
| `--ts-spacing-xl` | `32px` | XL gap |
| `--ts-spacing-2xl` | `48px` | 2XL gap |
| `--ts-spacing-3xl` | `64px` | Seksjon-gap |
| `--ts-spacing-4xl` | `80px` | Stor gap |
| `--ts-spacing-5xl` | `96px` | XSL gap |
| `--ts-spacing-6xl` | `120px` | Seksjon padding (vertikal) |
| `--ts-spacing-7xl` | `160px` | Maks padding |

**Standard vertikal spacing:** 24px / 32px / 48px / 64px / 120px

### Border Radius

| Token | Verdi | Bruk |
|-------|-------|------|
| `--ts-radius-sm` | `8px` | Små knappar |
| `--ts-radius-md` | `12px` | Knappar, inputs |
| `--ts-radius-lg` | `16px` | Kort border-radius |
| `--ts-radius-xl` | `20px` | Store kort, panel |
| `--ts-radius-2xl` | `24px` | Modal, glass panel |
| `--ts-radius-3xl` | `32px` | Store overlay |

**Standard kort-radius:** `--ts-radius-lg` (16px) for GlassPanel, `--ts-radius-xl` (20px) for store kort.

---

## 2. Bruk i Tailwind

Tailwind config har mapppa tokenar til utility classes:

```js
fontSize: {
  'heading-xl': ['32px', { lineHeight: '1.2', fontWeight: '600' }],
  'heading-l': ['28px', { lineHeight: '1.25', fontWeight: '600' }],
  'heading-m': ['24px', { lineHeight: '1.3', fontWeight: '600' }],
  'body': ['16px', { lineHeight: '1.65', fontWeight: '400' }],
  'small': ['14px', { lineHeight: '1.6', fontWeight: '400' }],
}
```

Radius:

```js
borderRadius: {
  'ts-lg': '16px',
  'ts-xl': '20px',
}
```

Spacing:

```js
spacing: {
  'lg': '24px',
  'xl': '32px',
  '2xl': '48px',
  '3xl': '64px',
  '4xl': '80px',
}
```

---

## 3. Glassmorphism

```css
background: var(--ts-glass-bg);          /* rgba(255,255,255,0.04) */
border: 1px solid var(--ts-glass-border); /* rgba(255,255,255,0.08) */
backdrop-filter: blur(var(--ts-glass-blur)); /* 14px */
border-radius: var(--ts-radius-lg);
box-shadow: var(--ts-shadow-md);
```

### Glassmorphism-hover

```css
background: var(--ts-glass-bg-hover);     /* rgba(255,255,255,0.07) */
border-color: var(--ts-glass-border-hover);
box-shadow: var(--ts-shadow-lg);
```

---

## 4. Standard komponent-stil

### Knappar (Buttons)

```css
padding: 12px 20px;
border-radius: var(--ts-radius-md);       /* 12px */
font-size: var(--ts-font-body);           /* 16px */
font-weight: 500;
```

**Primær (gold):**
- Background: `var(--ts-gold)` (#D4AF37)
- Hover: `var(--ts-gold-light)` (#E8C766)
- Shadow: `var(--ts-shadow-gold)`

**Sekundær (glass):**
- Background: `var(--ts-glass-bg)`
- Border: `var(--ts-glass-border)`

### Input

```css
padding: 12px 16px;
border-radius: var(--ts-radius-md);       /* 12px */
font-size: var(--ts-font-body);           /* 16px */
border: 1px solid var(--ts-glass-border);
background: var(--ts-glass-bg);
```

**Fokus:**
- Border: `var(--ts-gold)`
- Shadow: `0 0 0 3px rgba(212,175,55,0.2)`

---

## 5. Kva skal unngå

### Inline random px-verdier

Desse skal erstattast med token:

```css
/* IKKJE: */
padding: 17px;
border-radius: 18px;
font-size: 22px;
gap: 14px;

/* GJER: */
padding: var(--ts-spacing-md);    /* 16px */
border-radius: var(--ts-radius-md); /* 12px */
font-size: var(--ts-font-body);   /* 16px */
gap: var(--ts-spacing-sm);        /* 8px */
```

---

## 6. Konsistensreglar

1. **Brukk token for alt** — ingen inline px-verdier i komponentar
2. **Enheitleg font-size:** Brukk `heading-xl`, `heading-l`, `heading-m`, `body`, `small`
3. **Enheitleg spacing:** Brukk `spacing-lg` (24px), `spacing-xl` (32px), `spacing-2xl` (48px)
4. **Enheitleg radius:** Brukk `ts-lg` (16px) for kort, `ts-md` (12px) for knappar
5. **Enheitleg glassmorphism:** Brukk `.ts-glass` eller `.ts-glass-strong`

---

## 7. Filreferanse

| Fil | Innhald |
|-----|---------|
| `styles/globals.css` | CSS-variablar + utility-klassar |
| `tailwind.config.js` | Tailwind-extending med tokens |
| `brand/ui5-tokens.ts` | TypeScript token-exportar |
| `brand/colors.ts` | Farge-definisjonar |
| `brand/glass.ts` | Glassmorphism-variablar |
| `brand/radius.ts` | Border-radius-definisjonar |
| `brand/typography.ts` | Typografi-definisjonar |