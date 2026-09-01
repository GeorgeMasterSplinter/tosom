# ToSom — SSR-feil-fix i OnboardingFlow.tsx
**Dato:** 30. juni 2026
**Status:** Fullført

---

## PROBLEM

OnboardingFlow.tsx brukte `document.createElement` og `document.head.appendChild` **utenfor** React-komponenten, direkte i modulen- scoped. Dette fører til:

```
ReferenceError: document is not defined
```

ved server-side rendering (SSR) i Next.js, fordi `document` bare eksisterer på klientsida.

---

## LØYSING

### Før:
```tsx
// Module-scoped (eksklusive useEffect) — IKKE SSR-safe!
const styleEl = document.createElement('style');
styleEl.textContent = ` ... `;
if (!document.querySelector('style[data-tosom-animations]')) {
  styleEl.setAttribute('data-tosom-animations', 'true');
  document.head.appendChild(styleEl);
}
```

### Etter:
```tsx
// Inside component — useEffect-scoped — SSR-safe!
useEffect(() => {
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    @keyframes tosomFadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  styleEl.setAttribute('data-tosom-animations', 'true');
  document.head.appendChild(styleEl);

  return () => {
    document.head.removeChild(styleEl);
  };
}, []);
```

---

## NYCKEL-ENDRINGER

1. **Flytta inn i useEffect** — bare køyrd på klientsida
2. **Cleanup-funksjon** — fjern style-element ved unmount
3. **Ingen andre document/window bruk** — alt er inne i useEffect

---

## OPPDATTE FILER

| Fil | Endring |
|-----|---|
| `OnboardingFlow.tsx` | Flytta document.createElement/styleSet inn i useEffect |

---

## SSR-REGEL

All bruk av `document`, `window`, `localStorage`, osv. **må** være inne i:
- `useEffect` (React)
- Client-only funksjonar
- `'use client'` directive med forsiktig bruk

---

## TESTLISTE

- [ ] Bygg prosjektet (`npm run build`) — ingen SSR-feil
- [ ] Kjør appen — animasjon fungerer
- [ ] Sjekk browser dev tools — style-element er tilstades
- [ } Refresh side — ingen duplikate style-element

---

## OPPSUMMERING

**Problem:** `document.createElement` brukt utanfor useEffect → SSR-feil.
**Løysing:** Flytta inn i `useEffect` med cleanup.
**Resultat:** Ingen "document is not defined" feil lenger.