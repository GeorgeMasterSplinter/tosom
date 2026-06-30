# AI-Powered Features — Dokumentasjon

**Oppdatert:** 30. juni 2026
**Versjon:** 1.0
**Status:** 🟡 Backend-logikk ferdig, frontend-komponent manglar

---

## OVERSIKT

AI-Powered Features gir AI-støtte som forsterkar opplevelsen — aldri erstatter menneskeleg kontakt:
- **Samtaleforslag** (context-aware, fase-spesifikk)
- **Refleksjonsgenerering** (dagleg, 8 tema)
- **Oppgåve-generering** (tilpassa reise-fase)
- **Resonance-insight** (forklarar kvifor match fungerte)
- **Profil-forbetting** (AI-genererte forslag)
- **Samtalehjælp** (tone-matching, djupde-guiding)

---

## SAMTALEFORSKL (phase-spesifikk)

### EARLY-fase
| Forslag | Type | Djupde | Varmee |
|--|--|--|--|
| "Kva er noko du aldri har fortald nokon?" | vulnerability | 6 | 8 |
| "Korleis ser du din beste versjon om 5 år?" | future-vision | 7 | 7 |
| "Kva var det første du la merke til om meg?" | open-ended | 4 | 9 |

### BUILDING_TRUST-fase
| Forslag | Type | Djupde | Varmee |
|--|--|--|--|
| "Kva har overraska deg mest om deg sjølv?" | reflection | 8 | 8 |
| "Kva har du lært gjennom samtalen?" | growth | 7 | 8 |

### DEEPER-fase
| Forslag | Type | Djupde | Varmee |
|--|--|--|--|
| "Kva fryktar du å miste?" | fear | 9 | 7 |
| "Korleis har oppveksta di forma kjærlighet?" | connection | 9 | 7 |

### CHECKIN-fase
| Forslag | Type | Djupde | Varmee |
|--|--|--|--|
| "Kva har lært deg om kva du treng?" | purpose | 8 | 8 |
| "Kva vil du ta med og kva vil du endre?" | growth | 8 | 8 |

---

## REFLEKSJON-THEMA (8)

| Tema | Beskrivelse | Eksempel |
|--|--|--|
| **gratitude** | Takksemd | "Kva er tre ting du er takksam for?" |
| **growth** | Vekst | "Korleis har du endra deg?" |
| **connection** | Kopling | "Korleis kjenner du at du er sett?" |
| **trust** | Tillit | "Kvordan byggjer du tillit?" |
| **hope** | Håp | "Kva drøm har du gjeve opp?" |
| **intimacy** | Intimitet | "Korleis definerer du intimitet?" |
| **fear** | Frykt | "Kva fryktar du å miste?" |
| **purpose** | Meining | "Kvifor er du her?" |

---

## OPPGAVE-TYPAR (fase-spesifikk)

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
- **Ut:** Meir samtykke, bygge forståing
- **Framtid:** Potensial for meiningfulle opplevingar

### Score < 60 (Moderate)
- **Faktor:** Komplementær men ulik, moglegheit for vekst
- **Styrke:** Ulike perspektiv kan berike
- **Ut:** Krev meir arbeid og tålmod

---

## PROFIL-FORBOTTING

### Bio-forslag (3 tone)
| Tone | Forslag |
|--|--|
| **rolig** | "Ein roleg sjel som set pris på rolege øyeblikk." |
| **lekende** | "Alltid klar for ny oppleving — men villig til å sitje stille." |
| **moden** | "Søker noko ekte og varig. Triv i ro og dybde." |

### Styrke-analyse
- Djup profil
- Autentisk stemme
- Tydeleg verdigrunnlag

---

## SAMTALEHJÆLP

### Tone Advice (basert på resonans)
- **>= 70:** "Energien er høg — held fram med varme og sårbarheit."
- **>= 50:** "Energien er stabil — prøv å dypp djuare."
- **< 50:** "Energien er låg — start med lettkje oppning."

### Power Phrases
- "Eg har tenkt på det du sa..."
- "Det du nemnde, fekk meg til å sjå..."
- "Eg er usikker på, men eg vil prøve..."
- "Kva trur du om...?"

### Dødarar (kva ikkje seie)
- Ikkje start med eks-partnarar
- Ikkje fokuser berre på deg sjølv
- Ikkje bruk for mange ja/spørsmål-knappar

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
2. **Aldri pressande** — brukaren vel kva dei ser
3. **Aldri dømande** — alt er forslag, ikkje krav
4. **Alltid varm** — tone og djupde er alltid roleg

---

## HUSK

- AI-forslag er **alltid valfritt**
- Ingen push-notifikasjonar for AI-forslag
- Alltid **menneskeleg først**
- AI er ein **verktøy**, ikkje ein løysing