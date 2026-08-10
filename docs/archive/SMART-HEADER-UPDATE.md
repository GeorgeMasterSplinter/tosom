# ToSom — Smart Header Oppdatering
**Dato:** 30. juni 2026
**Status:** Fullført

---

## OPPSUMMERING

Header-komponenten er oppdatert til å støtte **to modes**:
- **Normal Mode** — dashboard, feed, matcher, profil
- **Focus Mode** — onboarding, profilredigering, skrivefelt

I tillegg er det lagt til **shrink-mode** og **auto-fade ved scroll**.

---

## OPPDATERTE FILER

| Fil | Endring |
|-----|---|
| `components/layout/Header.tsx` | **Full oppdatering** — Smart Header med mode-detektering |

---

## MODE-DETEKTERING

```tsx
const isFocusMode =
  pathname.startsWith('/onboarding') ||
  pathname.startsWith('/profile/edit') ||
  pathname.startsWith('/messages/write');
```

---

## SMART HEADER SPECS

### Normal Mode (dashboard/matcher/profil)
```tsx
bg-black/80 backdrop-blur-md border-b border-white/20 h-20
```
- **bakgrunn:** mørk glassmorphism
- **høyde:** 80px (h-20)
- **logo:** text-2xl
- **padding:** py-5

### Focus Mode (onboarding/redigering/skriving)
```tsx
bg-black/40 backdrop-blur-xl border-b border-white/10 h-14
```
- **bakgrunn:** lysare glassmorphism
- **høyde:** 56px (h-14)
- **logo:** text-lg
- **padding:** py-2

---

## SHRINK-MODE

| Element | Normal Mode | Focus Mode |
|---------|---------|---------|
| Header height | h-20 (80px) | h-14 (56px) |
| Logo size | text-2xl | text-lg |
| Padding | py-5 | py-2 |
| Backdrop blur | blur-md | blur-xl |
| Bakgrunn | black/80 | black/40 |
| Border | white/20 | white/10 |

---

## AUTO-FADE VED SCROLL

```tsx
const [scrolled, setScrolled] = useState(false);

// Scroll-lyttar
useEffect(() => {
  const handleScroll = () => {
    setScrolled(window.scrollY > 40);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => window.removeEventListener('scroll', handleScroll);
}, []);

// Fade-effekt
${scrolled ? 'opacity-30 hover:opacity-100' : 'opacity-40'}
hover:opacity-100
```

- **scroll < 40px:** opacity 40% (altid)
- **scroll > 40px:** opacity 30%, men 100% ved hover
- **hover alltid:** opacity 100%

---

## DYNAMISKE CLASSAR

```tsx
const headerClass = `
  fixed top-0 left-0 w-full z-50 transition-all duration-500
  ${focused
    ? 'bg-black/40 backdrop-blur-xl border-b border-white/10 h-14'
    : 'bg-black/80 backdrop-blur-md border-b border-white/20 h-20'
  }
  ${scrolled ? 'opacity-30 hover:opacity-100' : 'opacity-40'}
  hover:opacity-100
`.trim();

const logoClass = `
  transition-all duration-500 text-[#CBAA7A] hover:text-[#CBAA7A]
  ${focused ? 'text-lg' : 'text-2xl'} font-light tracking-wide
`.trim();
```

---

## NAVIGASJON

Navigasjonen er uendra — vissame lenker som før:
- "Hvordan det fungerer"
- "Om ToSom"
- "Dashboard" (ved innlogging)
- "Logg inn" / "Logg ut"
- "Start reisen" (CTA)

---

## BILDE

| Element | Verdi |
|---------|------|
| Logo farge | `#CBAA7A` (gull) |
| Nav tekst | `#EDEDED` (80% opacity) |
| Hover farge | `#CBAA7A` |
| Backdrop blur | `blur-xl` (focus) / `blur-md` (normal) |
| Transition | `duration-500` |

---

## NESTE STEG (valfritt)

1. Test at Header bytter mode korrekt
2. Test at scroll-basert fade fungerer
3. Vurder om logo-størrelse er optimal i begge modes
4. Vurder om nav-lengker bør endres i Focus Mode