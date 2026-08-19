# TOSOM — MATCHING TUNING PLAN v1.0

**Dato:** 2026-08-19
**Commit:** `bc1ef13`
**Grunnlag:** `TOSOM-PLATTFORMDIAGNOSE-v2.0.md`
**Formål:** Gjøre matching-motoren lanseringsklar for lukket beta.

---

## 0. Utgangspunkt

Motoren er bedre enn den ser ut. Problemet er ikke kvalitet, men **at det finnes fire av dem** og at bare én er koblet til.

| Motor | Status |
|---|---|
| `app/api/cron/matching/route.ts` | ✅ **Eneste levende vei** |
| `lib/matching/engine.ts` | ❌ Død — kun `scripts/verify-matching.ts` |
| `lib/matching/findBestResonance.ts` | ❌ Død — null kallsteder |
| `lib/matchingWorker.ts` | ❌ Død — inneholder `generateFakeMatchId()` |
| `lib/matchHistory.ts` | ❌ Død — ingen importører |

Delt scoringskjerne: `unifiedScore()`, brukt av cron (`:232`) og `/api/match/breakdown` (`:147`).

**Prinsipp for all tuning under:** Vi har **null produksjonsdata**. Å finjustere vekter uten observasjoner er gjetning forkledd som presisjon. Derfor deles planen i to:

- **Del A — retting.** Feil som er feil uavhengig av data. Gjøres nå.
- **Del B — tuning.** Krever observasjon fra beta. Forberedes nå, justeres etterpå.

---

# DEL A — RETTING (før beta)

## 1. M-1 🟠 Én kilde for resonansterskler

**Problem.** `lib/matching/resonanceLevel.ts:7-9` dokumenterer konflikten selv:

```
TERSKLER (B1.5): >=80 DEEP · 65-79 STRONG · 50-64 MODERATE · 40-49 GENTLE
OBS: disse skiller fra unifiedScorer.getMatchLevel (>=80/>=60/>=40).
```

Score 62 → `MODERATE` i én funksjon, `STRONG` i den andre. Begge er i bruk.

**Tiltak.** `toResonanceLevel()` (B1.5-tersklene) er kanonisk — den er nyere, mer bevisst begrunnet, og har fire nivåer som matcher `RESONANCE_LABELS`.

1. Fjern `getMatchLevel()` fra `unifiedScorer.ts`
2. La `unifiedScore()` returnere `level` fra `toResonanceLevel()`
3. Oppdater `MatchLevel`-typen til å bruke Prisma-enumen `ResonanceLevel`
4. Test som fastslår at 62 → `MODERATE`

**Risiko:** Lav. Rent internt.

---

## 2. M-2 🟡 Fjern død kø-ventil

**Problem.** `app/api/cron/matching/route.ts:153-176`:

```ts
if (cohortSize < MIN_COHORT_SIZE && !hasStaleEntries) → defer
```

Med `MIN_COHORT_SIZE = 2` utløses porten kun ved 0 eller 1 i kø — der et par uansett er umulig. **Ventilen kan aldri produsere en match.**

Under ukentlig kadens er den enda mer meningsløs: kjøringene ligger 168 timer fra hverandre, så alle som har ventet én runde er >72 t. `hasStaleEntries` er sann som standard.

**Tiltak.**

```ts
// Kohort-terskel: ett par krever minst to i kø.
// Den som ikke får match, venter til neste lørdag.
if (cohortSize < MIN_COHORT_SIZE) {
  // ... defer
}
```

1. Fjern `hasStaleEntries` og `oldestInQueue` fra portlogikken
2. Fjern `MAX_QUEUE_WAIT_HOURS` fra `config/matching.ts`
3. Oppdater kommentaren `:7` som fortsatt nevner «72h defer-ventil»

**Gjenbruk køalder som observasjon i stedet.** Se M-9.

---

## 3. M-3 🟠 Robust parscoring

**Problem.** `normalizeProfile()` (`unifiedScorer.ts:243`) caster uten validering. Én misdannet `Profile.preferences`-JSON kan kaste midt i den doble løkka og velte **hele lørdagsrunden** — for alle.

Dette er den største enkeltrisikoen i motoren.

**Tiltak.**

```ts
let scored: UnifiedResult;
try {
  scored = unifiedScore(a.profile, b.profile);
} catch (err) {
  await logScoringFailure(a.id, b.id, err);
  continue;   // hopp over paret, ikke runden
}
```

Logg til `SystemLog` med `module: 'cron:matching'` og begge bruker-ID-er, slik at en korrupt profil kan finnes og rettes.

**Akseptanse:** Test som mater inn en korrupt profil og bekrefter at runden fullfører for de øvrige.

---

## 4. M-4 🟠 Tidsvindu på sperrelisten

**Problem.** `:179-182` sperrer alle historiske par **for alltid**.

I en beta med 50–100 brukere er dette alvorlig. Anta 60 aktive: etter noen uker har en aktiv bruker uttømt en stor del av kandidatrommet og kan aldri matches igjen. Køen fylles av mennesker systemet har gjort umatchbare.

**Tiltak — differensiert sperre.** Ikke alle utfall fortjener samme behandling:

| Utfall | Sperre |
|---|---|
| `blocked` (rapport/blokkering) | **Permanent** — ufravikelig |
| `found_each_other` | Irrelevant (kontoer slettet) |
| `early_exit` | **Permanent** — én av dem valgte bort |
| `completed` / `new_journey` | **6 måneder** |
| `expired` | **6 måneder** |

Begrunnelse: to som fullførte 30 dager og valgte hver sin vei bør kunne møtes igjen etter et halvt år — mennesker endrer seg. Men den som aktivt avsluttet tidlig, skal aldri møte den andre igjen. Trygghet veier tyngre enn tilgang på kandidater.

**Implementasjon.**
```ts
const history = await prisma.matchHistory.findMany({
  where: {
    OR: [
      { outcome: { in: ['blocked', 'early_exit'] } },
      { endedAt: { gte: sixMonthsAgo } },
    ],
  },
  select: { userAId: true, userBId: true },
});
```

Løser samtidig minneproblemet (S-11).

**Krever:** `MatchHistory.outcome` og `endedAt` må finnes. Verifiser i schema før implementasjon.

---

## 5. M-5 🟠 Én fasedefinisjon

**Problem.** Tre uenige kilder — se diagnose A-2. `journeySync.ts:9-14` gjør **CHECKIN uoppnåelig**.

**Tiltak.**
1. `lib/journey/engine.ts:191-221` (`PHASE_CONFIGS`) er eneste kilde
2. Slett `phaseForDay()` i `journeySync.ts`; importer fra `engine.ts`
3. Rett `scripts/seed-journey-content.ts` til 1–14 / 15–21 / 22–25 / 26–30
4. Test som bekrefter at dag 26–30 gir `CHECKIN`

---

## 6. M-6 🟠 Håndhev bildesperren

**Problem.** To porter (`day >= 15` og `day >= 13`), ingen håndhevet. `app/api/chat/image/route.ts` har ingen sjekk. `Conversation.imageShareAllowedAt` leses, men skrives aldri.

**Tiltak.**
1. Journey-cron setter `imageShareAllowedAt` når dag 15 nås
2. Bildeopplasting avviser med 403 hvis feltet er null eller i framtiden
3. Fjern `day >= 13` i `journeySync.ts:31,80` — bruk `isPhotosAllowed()`
4. Test som forsøker opplasting på dag 10 og forventer 403

Invariant I-6 skal håndheves i koden.

---

## 7. M-7 🟡 Fjern døde motorer

Fire motorer uten kallsteder gir falsk trygghet: den som leser `findBestResonance.ts` tror den er i bruk.

**Tiltak.**
1. Slett `lib/matchingWorker.ts` (inneholder `generateFakeMatchId()` — farlig i seg selv)
2. Slett `lib/matchHistory.ts`, `lib/resonance.ts`, `lib/semantic.ts`
3. Slett `lib/matching/findBestResonance.ts`
4. `lib/matching/engine.ts`: enten oppdater `scripts/verify-matching.ts` til å bruke cron-veien, eller slett begge
5. Kjør `tsc --noEmit` + full testsuite etter hver sletting

**Rekkefølge:** Én sletting per commit. Lett å reversere.

---

## 8. M-8 🟡 Rett `ai/memory.json`

Minnefilen oppgir de **obsolete** vektene (`base/resonance/semantic/intimacy/future`). Enhver agent som leser den, får feil bilde av motoren.

**Tiltak.** Erstatt `matching.weights` med de ni reelle dimensjonene fra `unifiedScorer.ts:37-47`. Rett også `onboarding.ui_steps` fra 9 til 13.

---

# DEL B — TUNING (under og etter beta)

## 9. M-9 🟢 Observability først

**Uten data er tuning gjetning.** Dette er det viktigste punktet i hele planen.

**Logg per runde** til `SystemLog` (`module: 'cron:matching'`):

| Felt | Formål |
|---|---|
| `queueSize` | Kohortstørrelse |
| `pairsEvaluated` | Kombinasjoner vurdert |
| `pairsRejectedByDealbreaker` | Fordelt på type |
| `pairsBelowMinScore` | Hvor mange falt på 40-grensen |
| `pairsBlockedByHistory` | Sperrelistens effekt |
| `matchesCreated` | Resultat |
| `scoreDistribution` | Min / median / maks |
| `levelDistribution` | Antall per DEEP/STRONG/MODERATE/GENTLE |
| `oldestQueueAgeDays` | **Venter noen forgjeves?** |
| `durationMs` | Mot 50 s-budsjettet |

`mapRejectReason` finnes allerede (`app/api/cron/matching/rejectReason.ts`) og er dekket av `__tests__/sjekk9-reject-counters.test.ts`. Grunnlaget er på plass — det skal utvides og gjøres synlig i admin.

**Uten disse tallene er alt under spekulasjon.**

---

## 10. M-10 🟢 `MIN_SCORE` — la stå på 40

`config/matching.ts:18`. Kommentaren er god:
> «to som scorer 22 skal ikke kobles bare fordi de er de eneste»

40 er nedre grense for `GENTLE` — konsistent med resonansnivåene.

**Beslutning:** Ikke rør før vi har fordelingsdata.

**Etter 3–4 runder, vurder:**
- Median under 45 → dimensjonene diskriminerer for hardt, ikke senk terskelen
- Median over 70 → for lite spredning, dimensjonene er for snille
- Mange forkastes på 38–39 → vurder 35 **kun** hvis brukerne rapporterer god opplevelse

**Aldri senk `MIN_SCORE` for å øke matcheraten.** En dårlig match er verre enn ingen match. Det er hele produktet.

---

## 11. M-11 🟢 Vektene — la stå

`unifiedScorer.ts:37-47`. Summerer til 1,00. Fordelingen er godt begrunnet: verdier (0,25) og personlighet (0,20) veier tyngst; livsrytme (0,03) og modenhet (0,02) er finjustering.

**Merk en spenning:** `maturity` har lavest vekt (0,02), men maturity-gap > 4 er en **hard dealbreaker**. Det er faktisk konsistent — modenhet er et *filter*, ikke en *gradient*. Verdt å være bevisst på.

**Beslutning:** Ingen endring før beta. Etterpå: se etter dimensjoner som alltid gir ~50 (manglende data) eller alltid ~100 (for grov måling).

**Forbered:** Flytt `W` til `lib/matching/weightConfig.ts` slik at vektene kan justeres uten å røre scoringslogikken. Ren refaktorering, ingen atferdsendring.

---

## 12. M-12 🟢 Dealbreakere — observer avvisningsrater

Alle fem er harde. Det er riktig for trygghet, men i en liten kohort kan de tømme rommet.

**Særlig `checkLifeRhythmConflict`:** morgen↔kveld er en hard avvisning. Er det egentlig et dealbreaker på linje med et trygghetsgap? Mange fungerende par har ulik døgnrytme.

**Tiltak.** Ikke endre nå. Logg avvisningsrate per type. Hvis livsrytme alene forkaster >15 % av par, vurder å gjøre den til en scoringsstraff (den finnes allerede som dimensjon med vekt 0,03) i stedet for hard avvisning.

Trygghetsgap og modenhetsgap forblir **alltid** harde. De handler om reell risiko for utrygghet.

---

## 13. M-13 🟢 Radius

Distanse via `haversineKm()` mot `distancePref`, postnummer fra onboarding steg 0. Dekket av `__tests__/radius-dealbreaker-b14.test.ts` og `geo-lookup-b11.test.ts`.

**Beta-risiko:** Med 50–100 brukere spredt i Norge kan radius bli den dominerende avvisningsårsaken.

**Tiltak.**
1. Logg avvisninger på radius separat
2. Ved rekruttering: **konsentrer geografisk** — Oslo/Akershus først. Dette løser problemet i rekrutteringen i stedet for i koden.
3. Ingen kodeendring nå

Verifiser hva som skjer ved manglende postnummer: motoren skal ikke avvise på fravær av data.

---

## 14. M-14 🟢 `MIN_COHORT_SIZE` — la stå på 2

Senket fra 20 til 2 i v8 fordi ukentlig kadens krever at runden faktisk kjører.

Riktig for beta: med få brukere er 2 den eneste verdien som gir bevegelse. Etter M-2 er logikken ren: *to i kø = mulig par.*

---

## 15. M-15 🟢 Kohortstruktur — ikke nå

Kandidattanken om aldersbaserte eller geografiske kohorter er fristende, men fragmenterer et allerede lite rom.

**Beslutning:** Behold én kohort gjennom beta. Vurder først over ~500 aktive.

---

## 16. Rekkefølge

### Før beta

| ID | Tiltak | Innsats |
|---|---|---|
| M-3 | try/catch rundt parscoring | S |
| M-5 | Én fasedefinisjon | S |
| M-6 | Håndhev bildesperre | S |
| M-1 | Én resonansterskel | S |
| M-2 | Fjern død kø-ventil | S |
| M-8 | Rett `ai/memory.json` | S |
| M-9 | Utvid rundelogging | M |

### Beta-uke 1

M-4 (tidsvindu på sperreliste) · M-13 (observer radius)

### Etter beta — datadrevet

M-10 · M-11 · M-12 · M-15

### Opprydding

M-7 (slett døde motorer) — når som helst, én per commit

---

## 17. Prinsipper

1. **Ingen tuning uten data.** Del A retter feil. Del B venter på observasjon.
2. **En dårlig match er verre enn ingen.** `MIN_SCORE` senkes aldri for volum.
3. **Trygghet slår tilgjengelighet.** Trygghets- og modenhetsgap forblir harde.
4. **Én korrupt profil rammer bare seg selv.**
5. **Runden må aldri feile stille.** Alt logges, avvik varsles.
6. **Brukeren ser ord, aldri tall.** Invariant I-12 gjelder all tuning.
7. **Den som ikke får match, venter til neste lørdag.** Ingen hastevei.