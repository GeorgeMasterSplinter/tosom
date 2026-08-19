# ROUND B HANDOVER — fra ACT v9 (runde A) til ACT v10 (visuelt fundament)

**Dato:** 16. august 2026
**Fra:** ACT v9 (runde A — sikre og rette)
**Til:** ACT v10 (visuelt fundament)
**Utgangspunkt:** `b07e2cf`
**Sluttkommit (runde A):** `2418920`

---

## 1. Ferdig i ACT v9

| Sak | Steg | Belegg |
|---|---|---|
| Vilkårssiden tilgjengelig | 1.1 | `/vilk%C3%A5r` → 301 → `/vilkar` → 200 (før: uendelig 301-løkke) |
| Venterom med riktig tidspunkt | 1.2 | `WaitingForMatch.tsx` oppdatert (ikke lenger byte-identisk med v5 `e23ef45`) |
| Angrerettlenke | 1.3 | Angrerett har nå en utgang i venterommet |
| Aldersgrense synlig | 1.4 | «23+» og «har fylt 23» i rendret HTML på `/` (grep -oF = 1) |
| Én footer med juridiske lenker | 2.1 | `components/layout/Footer.tsx` slettet; kanonisk footer lenker til `/personvern`, `/vilkar`, `/cookies` |

### Full verifikasjon (faktisk utskrift)

| Kommando | Resultat | Exit |
|---|---|---|
| `npx tsc --noEmit` | *(tom)* | 0 |
| `npx prisma format --check` | `All files are formatted correctly!` | 0 |
| `npx jest` | `Test Suites: 14 passed / Tests: 140 passed` | 0 |
| `npm run build` | build fullført, `(Static)` / `(Dynamic)` | 0 |
| `npm run verify:api` | `✓ Alle API-kall matcher eksisterende ruter.` | 0 |
| `npm run verify:lang` | `✓ Ingen nynorsk-treff i .tsx-filer.` | 0 |

### Vokterkontroll

```
git --no-pager diff --stat b07e2cf..HEAD -- lib/ prisma/ config/matching.ts
# (tom — ingen endring i vokterfilene)
```

### Funksjonell kontroll

```
curl -s -o /dev/null -w "vilkår: %{http_code}\n" "http://localhost:3000/vilk%C3%A5r"
# vilkår: 301 → /vilkar
curl -s http://localhost:3000/vilkar | head        # 200, vilkårssiden render
curl -s http://localhost:3000/ | grep -oF "23+" | wc -l   # 1
curl -s http://localhost:3000/ | grep -c "vilk"           # 1
```

### Tailwind-kontroll (to CSS-filer)

```
cat .next/static/css/*.css > /tmp/all.css
grep -o 'md\:' /tmp/all.css | wc -l
# 50  (krav: over 0)
```

---

## 2. Til ACT v10 — visuelt fundament

### 2.1 Tretten lokale GlassCard-definisjoner

```
grep -rlE "(const|function) GlassCard" app/ | wc -l
# 13
```

Filer (alle definerer hver sin GlassCard):
`priser`, `vilkar`, `settings`, `hvorfor`, `cookies`, `om-oss`, `personvern`,
`(landing)`, `slik-fungerer-det`, `kontakt`, `blogg`, `register`, `reisen`

> **Merk om mønsteret:** masterplan v8.0 brukte `grep -rl "const GlassCard"`, som gir 0
> fordi alle definisjonene er `function GlassCard(...)`. Det korrekte mønsteret er
> `(const|function) GlassCard`. Antallet er likevel 13.

### 2.2 Inline stiler (målt i rendret HTML — metodik fra masterplan)

| Rute | `style="` i rendret HTML |
|---|---|
| `/` | 91 |
| `/priser` | 79 |
| `/hvorfor` | 106 |
| `/om-oss` | 106 |

> Måles i **rendret HTML**, ikke kilde. I kilde er tallet lavere fordi JSX bruker
> `style={{ ... }}` og en linje kan inneholde flere `style`-attributter.

### 2.3 JS-hover som muterer `currentTarget.style`

```
grep -rl "onMouseEnter" app/ | wc -l
# 18
```

Mønsteret muterer `currentTarget.style` (background, border, boxShadow, transform,
color, textDecoration) og omgår hele designtokensystemet.

### 2.4 Fem glass-komponenter i `components/ui/`

- `components/ui/cards/GlassCard.tsx` — **delt, men ubrukt** (ingen importører)
- `components/ui/GlassPanel.tsx`
- `components/ui/panels/GlassPanel.tsx`
- `components/ui/system/ToSomGlassPanel.tsx`
- `components/ui/base/Glass.tsx`

### 2.5 Fade-in på logo og «Made in Norway»

```
grep -rln "ts-fade-in" styles/
# styles/theme.css
# styles/globals.css
```

`ts-fade-in`-tokenet finnes i CSS-filene, ikke i `config/design-tokens.ts`.

### 2.6 Delt komponent som ikke brukes

`components/ui/cards/GlassCard.tsx` — finnes, men ingen av de tretten sidene importerer den.
Dette er kjernefeilen i runde B: siden hver side definerer sin egen GlassCard, faller den
delt komponenten til.

---

## 3. Til ACT v11 — tekst (vis til masterplan v8.0 del 6)

Målstedene er fastlagt i `docs/TOSOM-MASTERPLAN-v8.0.md` del 6. **Skillet er avgjørende:**

### Skal endres (matching — seks steder, masterplan 6.1)

| Fil | Tekst i dag |
|---|---|
| `app/(landing)/page.tsx:122` | `title: 'Match innen 24 timer'` |
| `app/slik-fungerer-det/page.tsx:66` | `title: 'Én match innen 24 timer'` |
| `app/priser/page.tsx:263` | `Match innen 24 timer` |
| `app/onboarding/steps/Step10StartReisen.tsx:49` | `En match innen 24 timer. Ingen swiping, ingen press.` |
| `app/(auth)/onboarding/payment/page.tsx:31` | `'Én match per 24 timer'` |
| `components/ui/layout/Hero.tsx:46` | `title: 'Match innen 24 timer'` (i ubrukt `keyPoints`) |

### Skal **ikke** endres (svartid på support — tre steder, masterplan 6.2)

| Fil | Tekst |
|---|---|
| `app/kontakt/page.tsx:196` | «Vi svarer så raskt vi kan, vanligvis innen 24 timer.» |
| `app/kontakt/page.tsx:277` | «Innen 24 timer» |
| `app/personvern/page.tsx:214` | «Vi svarer vanligvis innen 24 timer.» |

**Skillet:** Seks «24 timer»-steder handler om *matching* og skal endres til ukentlig
kadens. Tre steder handler om *svartid på support* og skal stå uendret.

Den ferdigskrevne teksten om ukentlig kadens ligger i masterplan v8.0 del 6.3.

---

## 4. Overlevering

```
jq -r '.pendingSteps | length' docs/ACT-STATE-v9.json   # 0
test -f docs/ROUND-B-HANDOVER.md && echo OK              # OK
```

Runde A er låst. Videre arbeid skjer i ACT v10 (visuelt fundament), deretter ACT v11 (tekst).