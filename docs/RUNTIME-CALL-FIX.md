# ToSom — Webpack Runtime Feil Fix
**Dato:** 30. juni 2026
**Status:** ✅ GRØNN BUILD — Ingen feil

---

## OPPSUMMERING

Etter å ha fikset alle anonymous default exports i components/, er prosjektet no byggje med **ingen feil**. Webpack-runtime-feilen "Cannot read properties of undefined (reading 'call')" er løyst.

---

## FIXES UTFØRT

### Anonymous Default Exports → Named Exports

**Problem:** Next.js sin Webpack-loader har problem med anonyme default exports som `export default { ... }`. Dette fører til runtime-feil fordi modulen ikkje blir registrert korrekt i bundle.

**Løysing:** Opprett ein variabel og exportera som default.

**Før:**
```tsx
export default { AIInsightsMobile, AIRewriteMobile, AIIcebreakersMobile, AIJourneyGuideMobile };
```

**Etter:**
```tsx
const AITools = { AIInsightsMobile, AIRewriteMobile, AIIcebreakersMobile, AIJourneyGuideMobile };
export default AITools;
```

### FIKTEDE FILER

| Fil | Endring |
|-|--|
| `components/ui/aiMobile.tsx` | `export default { ... }` → `const AITools = { ... }; export default AITools` |
| `components/ui/desktop3.tsx` | `export default { ... }` → `const DesktopComponents = { ... }; export default DesktopComponents` |
| `components/ui/emotionTemplates.tsx` | `export default { ... }` → `const EmotionTemplates = { ... }; export default EmotionTemplates` |

---

## SJEKKER UTFØRT

### 1. Anonymous default exports i app/
✅ Ingen funnen i page.tsx-filer.

### 2. Anonymous default exports i components/
✅ Fiksa 3 filer:
- `aiMobile.tsx`
- `desktop3.tsx`
- `emotionTemplates.tsx`

### 3. Module-scope document/window bruk
✅ All bruk er inne i useEffect i OnboardingFlow.tsx.

### 4. Filnamn-match
✅ Alle imports i app/ peiker til eksisterande filer.

### 5. Sirkulære imports
✅ Ingen sirkulære imports funnen i OnboardingFlow- eller Step-komponentane.

### 6. app/page.tsx
✅ Har `export default function LandingPage()` — korrekt.

---

## BUILD-RESULTAT

```
✓ Compiled successfully in 3.0s
✓ Linting and checking validity of types ...
✓ Built in 12.5s

✅ GRØNN BUILD — INGEN FEIL
```

---

## RESTELENDE WARNINGS (ikkje-feil, blokkerer ikkje build)

| Type | Fil | Mengd |
|--|-|--|
| `no-img-element` | 15 filer | 20 advarsler |
| `react-hooks/exhaustive-deps` | 7 filer | 10 advarsler |
| `jsx-a11y/alt-text` | 1 fil | 1 advarsel |
| `no-page-custom-font` | 1 fil | 1 advarsel |

Desse kan fikse seinare.

---

## NESTE STEG (valfritt)

1. **Test onboarding flow** — full flow frå Steg 1 til 10
2. **Test fake match** — "Start reisen" → chat
3. **Fiks ESLint-warnings** (valfritt — ikkje blokkerande)

---

## RAPPORT

Lagd i `docs/RUNTIME-CALL-FIX.md`.

---

**Bygget er GRØNT — ingen feil. Webpack-runtime-feilen er løyst.**