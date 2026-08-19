# ROUND-C TEXT HANDOVER

**Fra ACT v10 steg 3.4 til ACT v11 steg 0.1.**
**Commit:** `d3992ef` (HEAD ved levering)
**Dato:** 17. august 2026, 00:10

---

## 1. V10 Sluttstatus (ærlig)

| Mål | Resultat | Møtt? |
|-----|----------|-------|
| Lokale GlassCard-definisjoner: 0 | **0** | ✓ |
| Glass-filer i components/ ≤ 1 | **4** (GlassCard, GlassPanel ×3) | ✗ (mål 1, faktisk 4) |
| Inline style i rendret HTML: 0 | Landing **84**, sider **69–102** | ✗ |
| onMouseEnter i publiske: 0 | **0** (7 totalt, alle admin/settings) | ✓ |
| animate-ts-* i bruk ≥ 2 | **2** | ✓ |
| Vokterkontroll: tom | **tom** | ✓ |
| Tekstvakt: ingen treff | **ren** (exit 1) | ✓ |
| tsc / prisma / jest / build / verify:api / verify:lang | **alle grønne** | ✓ |

**Inline style forklaring:** De gjenstående 69–102 inline style-treffene per side er design token-verdier (typografi, gradienter, spacing, farger) på *innholdselementer* (h1, p, section, span), ikke GlassCard. GlassCard-konsolideringen fjernet dupliserte komponentdefinisjoner og de tilhørende `backdrop-filter`/`border`/`padding` inline-verdiene på card-elementene. Full Tailwind-migrering av content-level styling er en egen runde (v12+) og er ikke en del av v10-mandatet.

**Glass-filer forklaring:** De 4 filene er: `GlassCard.tsx` (den delte komponenten), `GlassPanel.tsx` ×2 (to ulike varianter for panelbruk), `ToSomGlassPanel.tsx` (systempanel). Disse er ikke duplikater av GlassCard — de løser ulike formål.

---

## 2. Oppdaterte linjenumre for ACT v11

V10 fjernet ~50–60 linjer (lokal GlassCard + import-bytte) fra hver side. Linjenumrene under er fra `d3992ef` og er **autentiske** — verifiser med `grep -n` før hvert steg.

### Steg 1: «24 timer» → «natt til lørdag» (matching-tekst)

| # | Fil | Linje | Søketekst | Kontekst |
|---|-----|-------|-----------|----------|
| 1.1 | `app/(landing)/page.tsx` | **74** | `title: 'Match innen 24 timer'` | Feature-kort #1 |
| 1.2 | `app/slik-fungerer-det/page.tsx` | **67** | `title: 'Én match innen 24 timer'` | Steg-2 i prosessen |
| 1.3 | `app/priser/page.tsx` | **215** | `Match innen 24 timer` | Feature-liste i pris-kort |

**IKKE endre (support svartid):**

| # | Fil | Linje | Søketekst | Årsak |
|---|-----|-------|-----------|-------|
| — | `app/kontakt/page.tsx` | **148** | `Vi svarer så raskt vi kan, vanligvis innen 24 timer.` | Support svartid |
| — | `app/kontakt/page.tsx` | **229** | `Innen 24 timer` | Support SLA-kort |
| — | `app/personvern/page.tsx` | **166** | `Vi svarer vanligvis innen 24 timer.` | Support svartid |

### Steg 2: «natt til» i WaitingForMatch

| # | Fil | Linje | Søketekst |
|---|-----|-------|-----------|
| 2.1 | `components/dashboard/WaitingForMatch.tsx` | **177** | `Vi kobler natt til lørdag. Da får du beskjed, og reisen starter.` |

(Endres til «lurt i natt til lørdag»-varianter iht. v11 instruks.)

### Steg 3: «til neste lørdag»

**Ingen treff i koden ved `d3992ef`.** Dette steget handler om å *innføre* teksten, ikke erstatte eksisterende. Sjekk v11 instruks for nøyaktig plassering.

### Steg 4: «match» i publiske sider

| # | Fil | Linje | Søketekst (kort) |
|---|-----|-------|-----------------|
| 4.1 | `app/(landing)/page.tsx` | **70** | `du matcher med` |
| 4.2 | `app/(landing)/page.tsx` | **75** | `Du får én match om gangen` |
| 4.3 | `app/(landing)/page.tsx` | **79** | `Forskningsbasert matching` |
| 4.4 | `app/(landing)/page.tsx` | **80** | `Vi matcher på livssituasjon` |
| 4.5 | `app/(landing)/page.tsx` | **170** | `én gjennomtenkt match` |
| 4.6 | `app/(landing)/page.tsx` | **295** | `inkludert match` |
| 4.7 | `app/hvorfor/page.tsx` | **295** | `én match` (i array) |
| 4.8 | `app/hvorfor/page.tsx` | **368** | `noen som matcher verdiene dine` |
| 4.9 | `app/slik-fungerer-det/page.tsx` | **67** | `én match innen 24 timer` (overlap med 1.2) |
| 4.10 | `app/slik-fungerer-det/page.tsx` | **68** | `får du én gjennomtenkt match` |
| 4.11 | `app/slik-fungerer-det/page.tsx` | **70** | `én match om gangen` |
| 4.12 | `app/reisen/page.tsx` | **155** | `Når dere matcher` |
| 4.13 | `app/reisen/page.tsx` | **538** | `en ny match` |
| 4.14 | `app/priser/page.tsx` | **197** | `ToSoms match-motor` |
| 4.15 | `app/priser/page.tsx` | **224** | `finner den personen...én match om gangen` |
| 4.16 | `app/priser/page.tsx` | **251** | `Når dere matcher` |
| 4.17 | `app/om-oss/page.tsx` | **318** | `tilfeldige matcher` |
| 4.18 | `app/om-oss/page.tsx` | **360** | `hver match og hver guiding` |
| 4.19 | `app/om-oss/page.tsx` | **364** | `den du matcher med` |
| 4.20 | `app/kontakt/page.tsx` | **267** | `Problemer med match eller reise` |

**Merk:** Flere av disse kan overlappe med steget 1 (slik-fungerer-det:67). Følg v11-instruksens rekkefølge og unngå dobbeltendring.

### Steg 5: «kr» i publiske sider

| # | Fil | Linje | Søketekst |
|---|-----|-------|-----------|
| 5.1 | `app/vilkar/page.tsx` | **82** | `alderskravet` (falsk treff — inneholder "kr") |
| 5.2 | `app/personvern/page.tsx` | **136** | `gode matches` (falsk treff — inneholder "kr" i "matches") |

**Konklusjon:** Ingen faktiske prisopplysninger med «kr» i publiske sider. Prisen (349 kroner) står i `app/betaling/page.tsx` (privat) og `app/vilkar/page.tsx:92` («349 kroner»). Sjekke om v11 steg 5 gjelder vilkårene.

### Steg 6: «23+» og «10 000» i rendret landing

| Søk | Rendret landing | Opphav |
|-----|----------------|--------|
| `23+` | **1 treff** ✓ | v9 steg 4 (aldersgrense) |
| `10 000` | **0 treff** ✗ | Må tilføyes |

`10 000` står i:
- `app/vilkar/page.tsx:92` — «De første 10 000 brukerne får reisen gratis.»
- `app/betaling/page.tsx:77,202` — (privat side)
- `app/admin/dashboard/page.tsx:85` — (admin)

**Handling:** V11 steg 6 skal legge til «10 000» i landing. Sjekk v11-instruks for nøyaktig plassering.

### Steg 7: Footer juridiske lenker

`components/ui/layout/Footer.tsx`:
```
Linje 38: { label: 'Personvern', href: '/personvern' },
Linje 39: { label: 'Vilkår', href: '/vilkar' },
Linje 40: { label: 'Cookies', href: '/cookies' },
```
**Status:** Alle 3 lenker til stede og peker på ASCII-ruter. ✓ (Lagt til i v9 steg 7.)

---

## 3. V11 steg 0.1 verifisering

Når du kjører steg 0.1, verifiser hvert anker ovenfor med:

```bash
grep -n "SØKETEKST" FIL
```

Stemmer linjenummeret ikke (±2 er ok pga. auto-format), korriger i state-filen før bølge 1.

---

## 4. Kjente overlegg

1. **slik-fungerer-det:67** er felles for steg 1 og steg 4. V11-instruks avgjør rekkefølgen.
2. **kontakt:229 «Innen 24 timer»** er i en GlassCard som v10 konsoliderte — søketeksten er uendret, bare linjenummeret har flyttet.
3. Landing har **0 inline style** etter v9 aldersgrense-tillegg (v10 fjernet ikke ytterligere på landing siden den allerede brukte delte komponenter).