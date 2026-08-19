# ToSom — Design Token Migreringsguide (Punkt 6)

## Status: Shim implementert ✅ (2026-08-05)

**Shim:** `config/design-tokens.ts` har nå `@deprecated`-notice som peker på ny kilde. Alle 71 filer fungerer uten endring.

**Problem:** To uavhengige design token-systemer som ikke er synkronisert.

| System | Fil | Linjer | Type | Importer av |
|--------|-----|--------|------|-------------|
| A | `config/design-tokens.ts` | 401 | Hardkodet HEX/RGB (`#0B1520`) | **71 filer** |
| B | `components/ui/tokens.ts` | 584 | CSS custom properties (`var(--ts-*)`) | Få filer |

## Strategi: Hybrid (Shim nå → Gradvis migrering senere)

### Nåværende (gjelder fra 2026-08-05)

1. ✅ `config/design-tokens.ts` har `@deprecated`-notice som peker på ny kilde
2. ✅ `components/ui/tokens.ts` er den nye "source of truth" for fremtidige komponenter
3. ✅ Alle 71 filer fungerer uten endring — null risiko

### Hvorfor ikke full migrering nå?

- **71 filer** importeres fra `@/config/design-tokens` — for mange endringer på en gang
- Mange komponenter bruker tokens i TypeScript-objekter (`color.brand.gold = '#D4AF37'`) som ikke fungerer med `var(--ts-*)`
- Risiko for store visuelle regressioner hvis vi endrer feil

### Migrering (Sprint 2, uke 4+)

Fullfør migreringen gradvis:
1. Oppdater 5-10 høyprioritetsider per uke
2. Erstatt hardkodete HEX-verdier med `var(--ts-*)` referanser
3. Tester visuelt etter hver endring

## Hvorfor ikke migrere nå?

- **71 filer** importeres fra `@/config/design-tokens` — for mange endringer på en gang
- Mange komponenter bruker tokens i TypeScript-objekter (`color.brand.gold = '#D4AF37'`) som ikke fungerer med `var(--ts-*)`
- Risiko for store visuelle regressioner hvis vi endrer feil

## Framtidig arbeid (Punkt 6 — fullført)

For full migrering, følg disse trinnene:
1. Oppdater én komponent av gangen til å importere fra `@/components/ui/tokens.ts`
2. Erstatt hardkodete HEX-verdier med `var(--ts-*)` referanser
3. Tester visuelt etter hver endring

## Referanse

Nye komponenter skal bruke:
```ts
import { tokens } from '@/components/ui/tokens'
// tokens.colors.gold.DEFAULT → var(--ts-gold)
// tokens.spacing.lg → var(--ts-spacing-lg)
```

Gammere komponenter kan fortsatt bruke:
```ts
import { color } from '@/config/design-tokens'
// color.brand.gold → '#D4AF37' (hardkodet, deprecated)