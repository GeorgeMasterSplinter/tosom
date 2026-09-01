# ToSom — Smart Header Premium Final
**Dato:** 30. juni 2026
**Status:** Fullført — Adaptive Presence, Soft Shadow Fade, Dynamic Blur Strength

---

## OPPSUMMERING

Smart Header er no oppdatert med **premium-effekter** som gjer han mindre forstyrjande på heile plattformen:
- **Adaptive Presence** — opacity og blur endrar seg ved scroll
- **Soft Shadow Fade** — shadow bare i Normal Mode, ingen i Focus Mode
- **Dynamic Blur Strength** — blur endrar seg basert på scroll-positur

---

## OPPDATTE FILER

| Fil | Endring |
|-----|---|
| `components/layout/Header.tsx` | **Full oppdatering** med adaptive presence, shadow fade, blur strength |

---

## ADAPTIVE PRESENCE SPECS

### Normal Mode (scroll < 40px)
| Element | Verdi |
|---------|--|
| Bakgrunn | `bg-black/80` |
| Backdrop blur | `blur-lg` |
| Opacity | `40%` |
| Shadow | `shadow-[0_4px_20px_rgba(0,0,0,0.25)]` |

### Normal Mode (scroll > 40px)
| Element | Verdi |
|---------|--|
| Bakgrunn | `bg-black/80` |
| Backdrop blur | `blur-xl` |
| Opacity | `25%` |
| Shadow | `shadow-[0_4px_20px_rgba(0,0,0,0.25)]` |

### Focus Mode (scroll < 40px)
| Element | Verdi |
|---------|--|
| Bakgrunn | `bg-black/40` |
| Backdrop blur | `blur-lg` |
| Opacity | `40%` |
| Shadow | `shadow-none` |

### Focus Mode (scroll > 40px)
| Element | Verdi |
|---------|--|
| Bakgrunn | `bg-black/40` |
| Backdrop blur | `blur-xl` |
| Opacity | `25%` |
| Shadow | `shadow-none` |

---

## DYNAMISK CLASSA

```tsx
const headerClass = `
  fixed top-0 left-0 w-full z-50 transition-all duration-500
  ${isFocusMode
    ? 'bg-black/40 backdrop-blur-xl border-b border-white/10 h-14 shadow-none'
    : 'bg-black/80 backdrop-blur-lg border-b border-white/20 h-20 shadow-[0_4px_20px_rgba(0,0,0,0.25)]'
  }
  ${scrolled ? 'opacity-25 backdrop-blur-xl' : 'opacity-40 backdrop-blur-lg'}
  hover:opacity-100
`.trim();
```

---

## EFFECT-OVERSIKT

### Adaptive Presence
| Tilstand | Opacity | Blur |
|------|-----|----|
| Normal, scroll < 40px | 40% | blur-lg |
| Normal, scroll > 40px | 25% | blur-xl |
| Focus, scroll < 40px | 40% | blur-lg |
| Focus, scroll > 40px | 25% | blur-xl |
| Hover (alle) | 100% | — |

### Soft Shadow Fade
| Tilstand | Shadow |
|------|-----|
| Normal Mode | `shadow-[0_4px_20px_rgba(0,0,0,0.25)]` |
| Focus Mode | `shadow-none` |

### Dynamic Blur Strength
| Tilstand | Blur |
|------|----|
| scroll < 40px | blur-lg |
| scroll > 40px | blur-xl |

---

## SHRINK-MODE (fra før)

| Element | Normal Mode | Focus Mode |
|---------|-----|----|
| Header height | h-20 (80px) | h-14 (56px) |
| Logo size | text-2xl | text-lg |
| Padding | py-5 | py-2 |
| Border | white/20 | white/10 |

---

## NAVIGASJON

Uendra — vissame lenker som før:
- "Hvordan det fungerer"
- "Om ToSom"
- "Dashboard" (ved innlogging)
- "Logg inn" / "Logg ut"
- "Start reisen" (CTA)

---

## NESTE STEG (valfritt)

1. Test adaptive presence i browser
2. Test at shadow bare visast i Normal Mode
3. Test at blur endrar seg korrekt ved scroll
4. Vurder om opacity-verdier treng justering