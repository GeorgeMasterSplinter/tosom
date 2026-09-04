# TOSOM — AUDIT-PLAN

**Dato:** 2026-09-03
**Commit:** `47e5d11`
**Grunnlag:** Systemaudit 03.09.2026 (10 funn)
**For:** Claude Opus 5 — styring av oppfølgingsfasen etter auditen
**Utfører:** Qwen i ACT-modus

> Dette er en arbeidsramme, ikke en rapport. Rapporten er allerede skrevet.
> Her står det hvordan vi går fra funn til lukket sak.

---

## 1. Formål

Claude skal bruke audit-rapporten til å lage én helhetlig plan for hva som
må gjøres videre — i riktig rekkefølge, med tydelig ansvar.

Claude planlegger. Qwen utfører. George godkjenner.

Dokumentet er rammen rundt arbeidet. Det inneholder ingen kode og ingen
patcher — kun struktur, steg og ansvar.

---

## 2. Hva Claude skal lese

Les i denne rekkefølgen, før planen skrives:

| # | Kilde | Hvorfor |
|---|-------|---------|
| 1 | Hele repoet (`main`) | Koden vinner alltid |
| 2 | `docs/ACT-PIPELINE-v1.0.md` | Arbeidsmetoden — hvordan vi jobber |
| 3 | `docs/ACT-STATE.json` | Levende tilstand — hva som er gjort |
| 4 | Audit-rapporten (10 funn) | Hva som er galt |

Lesing skjer parallelt og i én runde. Rene leseoperasjoner krever ingen
godkjenning.

---

## 3. Hva Claude skal gjøre

Seks leveranser, i rekkefølge.

### 3.1 Konsistenssjekk

Sammenlign `ACT-PIPELINE-v1.0.md` og `ACT-STATE.json` mot koden.

- Finn påstander som ikke stemmer med kildekoden
- Finn funn som er rettet, men står som åpne
- Finn funn som står som rettet, men fortsatt lever
- Rapporter avvik — skjul ingenting

**Leveranse:** kort liste over avvik, med kilde og status.

### 3.2 Patch-sekvens for funn 1–3 (kritiske)

De tre som må lukkes før flere brukere slippes inn.

| Funn | Sak | Risiko |
|------|-----|--------|
| 1 | Admin-token verifiseres uten signatur | Høy |
| 2 | Reset-token og SMS-kode logges i klartekst | Høy |
| 3 | Invitasjonsporten håndheves ikke — fri auto-registrering | Høy |

For hvert funn skal sekvensen si:

- Hvilken fil som endres
- Hvilken invariant som berøres, om noen
- Hvordan det verifiseres
- Hva som **ikke** endres
- Hvilke funn som må vente på George sin beslutning

Én fil per patch. Ett steg om gangen. Ingen sammenslåing.

### 3.3 Patch-sekvens for funn 4–10 (post-beta)

De sju som kan vente, men ikke glemmes.

| Funn | Sak | Risiko |
|------|-----|--------|
| 4 | Helse-endepunktet lekker systemdetaljer offentlig | Medium |
| 5 | CSRF dekker et fåtall av skriverutene | Medium |
| 6 | Død chat-komponent kaller CSRF-rute uten token | Medium |
| 7 | Varselkanalen er offentlig, ikke privat | Medium |
| 8 | Deploy-porten kan omgås manuelt | Medium |
| 9 | CSP tillater inline og eval | Medium |
| 10 | Foreldet refleksjonsrute treffer kun halve paret | Lav |

Grupper dem i bølger etter risiko og berørt område. Marker tydelig hva som
er **må rettes** og hva som er **kan vente**.

### 3.4 Verifiseringsplan

Fastsett hva som kjøres, og når.

- Etter hver patch: typesjekk og tester
- Før hver push: språkvakt
- Samlet: `npm run verify` (språk + typer + tester i én)
- Ved endring i auth, matching, journey eller kvote: relevant domenetest
- Nye tester som dekker blindsonene auditen fant

Grønt hele veien. Ett rødt steg stopper sekvensen.

### 3.5 Dokumentasjonsplan

Ingen sak er lukket før den er skrevet ned.

- `GEORGE.md` — driftsstatus og hva George selv må gjøre
- `docs/ACT-STATE.json` — oppdateres i **samme commit** som siste kode
- `docs/README.md` — registrer dette dokumentet under «Prosess»
- Denne planen — oppdater status etter hver bølge

### 3.6 Overleveringsplan til Qwen

Qwen skal kunne begynne uten å gjette.

For hver patch i sekvensen:

- Én tydelig oppgave, én fil
- Forventet resultat
- Verifiseringskommando
- Stoppkriterium — når Qwen skal spørre i stedet for å gjette

Qwen utfører kun det Claude har beskrevet. Ingen improvisasjon.

---

## 4. Format på Claudes leveranse

- Kort, presist, ren PLAN-stil
- Ingen kode, ingen patcher, ingen lange forklaringer
- Kun struktur, steg og ansvar
- Norsk bokmål — overalt
- Rolig tone. Ingen selvros, ingen gjentakelse

---

## 5. Sluttrapport

Når planen er ferdig, skriver Claude en kort oppsummering:

- Hva planen dekker
- Hva som må gjøres først
- Hva som venter på George
- Hva Qwen kan begynne på med en gang

Kort. Skarp. Nyttig.

---

## 6. Ansvar

| Rolle | Ansvar |
|-------|--------|
| **Claude** | Leser, planlegger, beskriver patcher, verifiserer plan mot regler |
| **Qwen** | Utfører patchene Claude beskriver — én fil, ett steg om gangen |
| **George** | Godkjenner, tar beslutninger, håndterer leverandører og secrets |

---

*Hver patch berører noe som betyr noe for noen. Jobb rolig. Jobb presist.*
