# AI-Powered Features — Dokumentasjon

**Oppdatert:** 30. juni 2026
**Versjon:** 1.0
**Status:** 🟡 Backend-logikk ferdig, frontend-komponent mangler

---

## OVERSIKT

AI-Powered Features gir AI-støtte som forsterkar opplevelsen — aldri erstatter menneskeleg kontakt:
- **Samtaleforslag** (context-aware, fase-spesifikk)
- **Refleksjonsgenerering** (dagleg, 8 tema)
- **Oppgåve-generering** (tilpassa reise-fase)
- **Resonance-insight** (forklarar hvorfor match fungerte)
- **Profil-forbetting** (AI-genererte forslag)
- **Samtalehjælp** (tone-matching, djupde-guiding)

---

## SAMTALEFORSKL (phase-spesifikk)

### EARLY-fase
| Forslag | Type | Djupde | Varmee |
|--|--|--|--|
| "Hva er noe du aldri har fortald noen?" | vulnerability | 6 | 8 |
| "Hvordan ser du din beste versjon om 5 år?" | future-vision | 7 | 7 |
| "Hva var det første du la merke til om meg?" | open-ended | 4 | 9 |

### BUILDING_TRUST-fase
| Forslag | Type | Djupde | Varmee |
|--|--|--|--|
| "Hva har overraska deg mest om deg selv?" | reflection | 8 | 8 |
| "Hva har du lært gjennom samtalen?" | growth | 7 | 8 |

### DEEPER-fase
| Forslag | Type | Djupde | Varmee |
|--|--|--|--|
| "Hva fryktar du å miste?" | fear | 9 | 7 |
| "Hvordan har oppveksta di forma kjærlighet?" | connection | 9 | 7 |

### CHECKIN-fase
| Forslag | Type | Djupde | Varmee |
|--|--|--|--|
| "Hva har lært deg om hva du treng?" | purpose | 8 | 8 |
| "Hva vil du ta med og hva vil du endre?" | growth | 8 | 8 |

---

## REFLEKSJON-THEMA (8)

| Tema | Beskrivelse | Eksempel |
|--|--|--|
| **gratitude** | Takksemd | "Hva er tre ting du er takksam for?" |
| **growth** | Vekst | "Hvordan har du endra deg?" |
| **connection** | Kopling | "Hvordan kjenner du at du er sett?" |
| **trust** | Tillit | "Kvordan byggjer du tillit?" |
| **hope** | Håp | "Hva drøm har du gjeve opp?" |
| **intimacy** | Intimitet | "Hvordan definerer du intimitet?" |
| **fear** | Frykt | "Hva fryktar du å miste?" |
| **purpose** | Meining | "Hvorfor er du her?" |

---

## OPPGAVE-TYPER (fase-spesifikk)

### EARLY
- **appreciation** (5 min) - Verdsettingsmelding
- **question** (10 min) - Grunnspørsmål

### BUILDING_TRUST
- **letter** (15 min) - Barndomshistorie
- **shared-activity** (60 min) - Felles oppleving

### DEEPER
- **letter** (20 min) - Djup sårbarheit
- **vulnerability** (15 min) - Direkte spørsmål

### CHECKIN
- **reflection** (20 min) - Samantrekking
- **question** (30 min) - Framtidsperspektiv

---

## RESONANS-INSIGHT

### Score >= 80 (Excellent)
- **Faktor:** Verdi-kompatibilitet, kommunikasjonsstil, livssyn
- **Styrke:** Djup samforståing, naturlig flyt, same mål
- **Ut:** Utforsk ulike perspektiv
- **Framtid:** Sterkt potensial for varig kopling

### Score >= 60 (Good)
- **Faktor:** God grunnlag, komplementære eigenskapar, delte interesse
- **Styrke:** Komplementær dynamikk, læringspotensial
- **Ut:** Mer samtykke, bygge forståelse
- **Framtid:** Potensial for meiningfulle opplevingar

### Score < 60 (Moderate)
- **Faktor:** Komplementær men ulik, mulighet for vekst
- **Styrke:** Ulike perspektiv kan berike
- **Ut:** Krev mer arbeid og tålmod

---

## PROFIL-FORBOTTING

### Bio-forslag (3 tone)
| Tone | Forslag |
|--|--|
| **rolig** | "En rolig sjel som set pris på rolege øyeblikk." |
| **lekende** | "Alltid klar for ny oppleving — men villig til å sitje stille." |
| **moden** | "Søker noe ekte og varig. Triv i ro og dybde." |

### Styrke-analyse
- Djup profil
- Autentisk stemme
- Tydeleg verdigrunnlag

---

## SAMTALEHJÆLP

### Tone Advice (basert på resonans)
- **>= 70:** "Energien er høg — holder fram med varme og sårbarheit."
- **>= 50:** "Energien er stabil — prøv å dypp djuare."
- **< 50:** "Energien er låg — start med lettkje oppning."

### Power Phrases
- "Eg har tenkt på det du sa..."
- "Det du nemnde, fekk meg til å se..."
- "Eg er usikker på, men eg vil prøve..."
- "Hva trur du om...?"

### Dødarar (hva ikke seie)
- Ikke start med eks-partnarar
- Ikke fokuser bare på deg selv
- Ikke bruk for mange ja/spørsmål-knapper

---

## BRUK I UI

```tsx
import {
  generateConversationSuggestion,
  generateReflectionPrompt,
  generateTask,
  generateResonanceInsight,
  generateConversationHelp,
} from '@/lib/ai-features/aiFeatures'

function AIHelpPanel({ phase, resonance, profile }) {
  const suggestion = generateConversationSuggestion({
    journeyPhase: phase,
    resonanceLevel: resonance,
    // ...
  })

  const reflection = generateReflectionPrompt(phase, 10, [])
  const task = generateTask(phase, 10)
  const insight = generateResonanceInsight(78, profile, profile)
  const help = generateConversationHelp({ resonanceLevel: resonance, phase })

  return (
    <div>
      {/* Forslag */}
      {/* Refleksjon */}
      {/* Oppgåve */}
      {/* Insight */}
      {/* Hjælp */}
    </div>
  )
}
```

---

## DESIGNPRINSIPP

1. **Aldri erstatte** — AI hjelper, aldri erstatter
2. **Aldri pressande** — brukeren vel hva de ser
3. **Aldri dømande** — alt er forslag, ikke krav
4. **Alltid varm** — tone og djupde er alltid rolig

---

## HUSK

- AI-forslag er **alltid valfritt**
- Ingen push-notifikasjonar for AI-forslag
- Alltid **menneskeleg først**
- AI er en **verktøy**, ikke en løysing