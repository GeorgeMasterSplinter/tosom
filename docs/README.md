# TOSOM — Dokumentasjon

Kort inngangsport. Alle referanser peker på filer som finnes i repoet per 2026-08-21.


---

## Kanonisk systembeskrivelse

| Dokument | Stikkord |
|----------|----------|
| **[TOSOM-SUPER-MASTERPLAN-v1.0.md](TOSOM-SUPER-MASTERPLAN-v1.0.md)** | **Kanonisk.** Produkt, teknikk, invarianter, vei til beta. Erstatter MASTERPLAN v2–v8. |

## Spesialplaner

| Dokument | Stikkord |
|----------|----------|
| **[TOSOM-PLATTFORMDIAGNOSE-v2.0.md](TOSOM-PLATTFORMDIAGNOSE-v2.0.md)** | As-is tilstand, blokkere, avvik, teknisk gjeld. |
| **[SECURITY-STABILITY-PLAN-v2.0.md](SECURITY-STABILITY-PLAN-v2.0.md)** | Sikkerhet, auth, rate limiting, GDPR, drift. |
| **[MATCHING-TUNING-PLAN-v1.0.md](MATCHING-TUNING-PLAN-v1.0.md)** | Motoren: retting før beta, tuning etter observasjon. |
| **[BETA-ACCESS-PLAN-v1.0.md](BETA-ACCESS-PLAN-v1.0.md)** | Lukket beta: invitasjonsport, rekruttering, observasjon, testmatrise. |
| **[TOSOM-BETA-DRIFTSPLAN-v1.0.md](TOSOM-BETA-DRIFTSPLAN-v1.0.md)** | Hvor vi står, hva som gjenstår før invitasjon, driftsrutinen under beta. |
| **[ADMIN-KOMMANDOPANEL-v1.0.md](ADMIN-KOMMANDOPANEL-v1.0.md)** | Ombygging av admin til kommandopanel. Steg K-1…K-9 med kode. |
| **[LANDING-SIGNATUR-v1.0.md](LANDING-SIGNATUR-v1.0.md)** | Signatur-laget på landingssiden: resonans-motivet, calm-motion. Steg S-1…S-10 med kode. |
| **[JURIDISK-GRUNNLAG-v1.0.md](JURIDISK-GRUNNLAG-v1.0.md)** | Vilkår, personvern, trygghet: funn, beslutninger og advokat-brief (A-1…A-7). |
| **[ACT-PIPELINE-v1.0.md](ACT-PIPELINE-v1.0.md)** | Arbeidssyklus, patch-regler, invarianter, verifisering. Erstatter ACT-INSTRUKS v2–v11. |
| **[DOCS-RESTRUCTURE-v1.0.md](DOCS-RESTRUCTURE-v1.0.md)** | Denne restruktureringen: plan + gjennomførte valg. |


## Levende tilstand

| Fil | Stikkord |
|-----|----------|
| **[ACT-STATE.json](ACT-STATE.json)** | Eneste levende tilstandsfil. Oppdateres etter hver fullførte oppgave. |

---

## Undermapper

| Mappe | Innhold |
|-------|---------|
| [`reference/`](reference/) | Levende oppslagsverk (API-ruter, match-status, design tokens) |
| [`core/`](core/) | Kernedokumentasjon (blueprint, matching, journey, security, roadmap) |
| [`archive/`](archive/) | Historikk. **Aldri normativ.** |

---

## Dokumentasjonsregler

1. **Koden vinner alltid over dokumentasjonen.** Finner du avvik: rapporter det.
2. **Én kilde for sannhet.** SUPER-MASTERPLAN er kanonisk.
3. **Skriv i bokmål.** Varmt, modent, trygt, klart.
4. **Aldri slett uten godkjenning.** Flytt til `archive/` i stedet.
5. **Verifiser mot kode.** Dokumentasjon som motsier kildekoden er en feil.

---

*Sist oppdatert: 2026-08-21 (JURIDISK-GRUNNLAG v1.0)*



