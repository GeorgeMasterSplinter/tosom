# TOSOM — Dokumentasjon

Kort inngangsport. Alt som ligger på toppnivå her **gjelder nå**.

---

## 1. Kanonisk

| Dokument | Stikkord |
|----------|----------|
| **[TOSOM-SUPER-MASTERPLAN-v2.0.md](TOSOM-SUPER-MASTERPLAN-v2.0.md)** | **Én sannhet.** Produkt, teknikk, invarianter, vei til beta og lansering. |

## 2. Beta — inneværende periode

| Dokument | Stikkord |
|----------|----------|
| **[BETA-TEST-v1.0.md](BETA-TEST-v1.0.md)** | **Åpen beta med ekte brukere:** fri tilgang (e-post + passord), faser, målinger, sjekkliste. Gjelder til Vipps er på plass. |
| **[TOSOM-BETA-DRIFTSPLAN-v1.1.md](TOSOM-BETA-DRIFTSPLAN-v1.1.md)** | Driften under beta: rytmen, tersklene, suksess- og avbruddskriterier. |
| **[TOSOM-BETA-VURDERING-v1.0.md](TOSOM-BETA-VURDERING-v1.0.md)** | Lanseringsvurdering 2026-08-24: dok-audit, klarhet mot koden, anbefalinger, åpne poster. |
| **[TOSOM-MASTERPLAN-v3.0.md](TOSOM-MASTERPLAN-v3.0.md)** | **Lanseringsvurdering 2026-08-28** (ikke kanonisk): full systemgjennomgang mot koden, score 86/100, risikoanalyse R-1…R-5, «siste ting før feilfri beta» og «før lansering». Erstatter v2.0 (arkivert). |
| **[CLAUDE-MASTERPLAN.md](CLAUDE-MASTERPLAN.md)** | **Lanseringsvurdering 2026-09-03** (ikke kanonisk): måling etter systemauditen. Beta-klarhet 88/100, lanseringsklarhet 77/100, score brutt ned per område, 11 saker vi kan fikse selv med poengeffekt. Etterfølger v3.0. |

## 3. Aktive planer

| Dokument | Stikkord |
|----------|----------|
| **[MATCHING-TUNING-PLAN-v1.0.md](MATCHING-TUNING-PLAN-v1.0.md)** | Motoren: retting før beta (M-1…M-6, ferdig), tuning etter observasjon. |
| **[SECURITY-STABILITY-PLAN-v2.0.md](SECURITY-STABILITY-PLAN-v2.0.md)** | Sikkerhet, auth, rate limiting, GDPR, drift. |
| **[MASTERSPLINTER-SIKKERHET-v1.0.md](MASTERSPLINTER-SIKKERHET-v1.0.md)** | Komplett sikkerhetsguide for maskin og drift. |
| **[OBSERVABILITY-PLAN-v1.0.md](OBSERVABILITY-PLAN-v1.0.md)** | Metrikker, logging, varsling. Steg O-1…O-12. |
| **[FORSKNINGSMOTOR-v1.0.md](FORSKNINGSMOTOR-v1.0.md)** | Validerte instrumenter i motoren: BFI-10, ECR, PVQ-10, ERQ-6. F-9 kalibreres etter beta. |
| **[JURIDISK-GRUNNLAG-v1.0.md](JURIDISK-GRUNNLAG-v1.0.md)** | Vilkår, personvern, trygghet: funn, beslutninger og advokat-brief. |
| **[VIPPS-INTEGRATION-PLAN-v1.0.md](VIPPS-INTEGRATION-PLAN-v1.0.md)** | Lansering: Vipps Login (eneste innlogging) + Vipps Betaling 349 kr. |
| **[HOSTING-MIGRATION-PLAN-v1.0.md](HOSTING-MIGRATION-PLAN-v1.0.md)** | Vercel/Neon/R2-migrering. |
| **[LANDING-SIGNATUR-v1.0.md](LANDING-SIGNATUR-v1.0.md)** | Signatur-laget på landingssiden: resonans-motivet, calm-motion. |

## 4. Prosess

| Dokument | Stikkord |
|----------|----------|
| **[ACT-PIPELINE-v1.0.md](ACT-PIPELINE-v1.0.md)** | Arbeidssyklus, patch-regler, invarianter, verifisering. **Hvordan** vi jobber. |
| **[TOSOM-ACT-INSTRUKS-v3.0.md](TOSOM-ACT-INSTRUKS-v3.0.md)** | Launch Edition: **hva** som gjenstår. Bølge A (utført), B (dag 1–30), C (dag 31–60) med atomiske steg og patch-skisser. |
| **[ACT-STATE.json](ACT-STATE.json)** | **Eneste levende tilstandsfil.** Må oppdateres i samme commit som den siste koden i en oppgave. |
| **[AUDIT-PLAN.md](AUDIT-PLAN.md)** | Arbeidsramme for oppfølgingen etter systemauditen 03.09.2026: lesekilder, patch-sekvenser for de 10 funnene, verifisering, dokumentasjon og overlevering. |

---

## Undermapper

| Mappe | Innhold |
|-------|---------|
| [`reference/`](reference/) | Levende oppslagsverk (API-ruter, matching-dimensjoner, match-status, design tokens, **system-flow-diagram**) |
| [`concepts/`](concepts/) | Skisserte konsepter — **aldri normativ** |
| [`archive/`](archive/) | Historikk: `snapshots/` (punkt-in-tid-diagnoser), `ferdig/` (utførte planer), `erstattet/` (utsatte dokumenter) m.m. **Aldri normativ.** |

---

## Dokumentasjonsregler

1. **Koden vinner alltid over dokumentasjonen.** Finner du avvik: rapporter det.
2. **Én kilde for sannhet.** SUPER-MASTERPLAN er kanonisk.
3. **Skriv i bokmål.** Varmt, modent, trygt, klart. Gjelder kodekommentarer og commit-meldinger med.
4. **Aldri slett uten godkjenning.** Flytt til `archive/` i stedet. Ferdige og erstatte dokumenter forlater toppnivået **innen 24 timer** etter at de er ferdig/erstattet.
5. **Verifiser mot kode.** Dokumentasjon som motsier kildekoden er en feil.
6. **Diagnoser er snapshots.** Dato + commit i tittelen, og de hører i `archive/snapshots/` — aldri på toppnivået.
7. **`ACT-STATE.json` ligger aldri bak.** Den oppdateres i samme commit som den siste koden i oppgaven.

---

*Sist oppdatert: 2026-08-24 (dokumentasjonen konsolidert til én sannhet)*
