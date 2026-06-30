# Atmosphere Layer — Dokumentasjon

**Oppdatert:** 30. juni 2026
**Versjon:** 1.0
**Status:** 🟡 Backend-logikk ferdig, frontend-komponent manglar

---

## OVERSIKT

Atmosphere Layer forsterkar kjensla av reisa med:
- **10 ambient preset** (midnight-gold, dawn-blue, etc.)
- **Mood-basert fargepalett** med sesong-overriding
- **Progressiv disclosing** (innhald avsløyst gradvis)
- **Ambient particles** (flytande partiklar i bakgrunn)
- **Gentle haptic feedback** (valfritt)
- **Seasonal theming** (sesong-basert teming)

---

## ATMOSFERE-PRESETAR (10)

| Preset | Tema | Farge | Sesong |
|--|--|--|--|
| **midnight-gold** | Standard gull | Gull | Vinter |
| **dawn-blue** | Morgon-blå | Blå | Vår |
| **twilight-purple** | Skumring-lilla | Lilla | Høst |
| **forest-green** | Skog-grøn | Grøn | Sommar |
| **deep-ocean** | Dyp-hav | Blå-ljos | Vinter |
| **golden-hour** | Gyllen time | Gull-lys | Høst |
| **winter-frost** | Vinter-frost | Ishalla | Vinter |
| **spring-bloom** | Vår-blom | Blom-grøn | Vår |
| **summer-warm** | Sommar-varm | Oransje | Sommar |
| **autumn-fire** | Høst-eld | Eld-raud | Høst |

---

## SESONG-OVERRIDING

Automatisk sesong-override basert på måned:
- **Mars-Mai:** Vår
- **Juni-August:** Sommar
- **September-November:** Høst
- **Desember-Februar:** Vinter

Sesongen override glow-farga automatisk.

---

## FARGEPALLAR (10)

Kvar preset har eigen full fargepalett:
- Bakgrunn (primær + sekundær)
- Overflate (glassmorphism)
- Kantar
- Hovud- og sekundærtekst
- Gull-aksent + hover
- Glowing

---

## AMBIENT PARTICLES

Genererer 30 flytande partiklar med:
- Tilfeldig posisjon (0-100%)
- Tilfeldig storleik (1-4px)
- Tilfeldig opacity (0.05-0.35)
- Tilfeldig fart (0.1-0.6)
- Tilfeldig retning (0-360°)

---

## PROGRESSIV DISCLOSING

Basert på reise-dag (1-30):
- Dag 1-3: intro
- Dag 4-7: values, lifestyle
- Dag 8-12: personality, relationship
- Dag 13-18: communication, intimacy
- Dag 19-24: future, boundaries
- Dag 25-30: summary

10 seksionar totalt, gradvis avsløyst.

---

## BRUK I UI

```tsx
import { getAtmosphereSystem } from '@/lib/atmosphere/atmosphereEngine'

function AmbientBackground({ preset, phase, day }) {
  const { colors, particles } = getAtmosphereSystem(preset, phase, day)

  return (
    <div style={{ background: colors.background }}>
      {/* Ambient particles som animasjon */}
      {/* CSS-variablar med fargar */}
    </div>
  )
}
```

---

## HUSK

- Alle preset er **rolige og varme**
- Sesong-endring skjer **automatisk**
- Progressive disclosing er **alltid mild**
- Ambient particles er **subtile**