# ToSom — Legal Pages Pre-Lawyer Review (v1.0)

**Dato:** 26.10.2026
**Status:** PREPARED FOR LAWYER REVIEW — ikke «legal approved» / «GDPR compliant».
**Scope:** `/vilkar` og `/personvern` (begge bumpet til v2026-10-26).
**Kilde til sannhet:** faktisk kode i HEAD (prisma/schema.prisma, lib/matching, lib/journey, app/api/settings/delete-account, app/api/report, app/api/consent, config/env.ts, config/legal.ts, docs/legal/DPA.md).
**Regel:** Copy ble endret KUN der status var TRUE / PARTLY TRUE / FALSE / TOO ABSOLUTE. LEGAL INTERPRETATION og UNKNOWN er beholdt som fakta + merket til jurist.

Merkesystem:

- **[L1] LAWYER CONFIRM** — fakta står, men juridisk konklusjon kreves (art. 6/9, profilering, art. 22, digitalytelsesloven).
- **[L2] LAWYER CHOOSE BASIS** — behandlingsgrunnlag skal velges/bekreftes.
- **[L3] LAWYER CHECK WORDING** — formulering har juridisk virkning; vurder ordlyd.
- **[L4] LAWYER CHECK CONTRACT LAW** — avtalerettlig vurdering (ansvar, lisens, klage/tvist).

---

## 1. Claim-tabell (før → etter)

| # | EXACT CLAIM (før) | STED (før) | IMPLEMENTATION EVIDENCE | STATUS | HVOR DET GÅR (etter) |
|---|---|---|---|---|---|
| C-01 | «Den vises aldri offentlig, og den selges aldri videre» | personvern §1 | Profil privat i matching; ingen offentlig visning; ingen salg/markedsføring i kode | TRUE | Beholdt: «vises ikke offentlig … Vi selger ikke personopplysninger, og vi bruker dem ikke til markedsføring» |
| C-02 | «Konto: E-postadresse, navn, telefonnummer og alder» | personvern §3 tabell | Registrering samler e-post + passord; `User.phone` finnes men fylls ikke av noen flow i dag | PARTLY TRUE | Rettet: «E-postadresse, passord (hash), visningsnavn, innlogging og sesjonsdata». Telefon fjernet |
| C-03 | «Profil: … kommunikasjonsmåte, framtidsønsker» (uten religion) | personvern §3 tabell | `Profile` har religion + religionOpen + akseptlist (≤4) + religionImportance; også kjønn, seekingGender, postalCode + lat/lon | PARTLY TRUE (ufullstendig) | Rettet: fullstendig liste inkl. religion/livssyn, kjønn/hvem du søker, postnummer + valgfri omtrentlig posisjon |
| C-04 | «Vi svarer … senest innen 30 dager» | personvern §2 | Ingen SLA i kode; GDPR: 1 måned | LEGAL INTERPRETATION | Beholdt som forpliktelse — **[L3] REVIEW RESPONSE DEADLINE WORDING** |
| C-05 | «Leses aldri av oss manuelt, deles aldri med andre brukere, og brukes utelukkende av matching-motoren» | personvern §5 | Admin-panelet har chat-visning; rapportbevis leses av saksbehandler | FALSE (absolutt) | Fjernet. Erstattet med nøytral beskrivelse inkl. «ser den som behandler saken på meldingene i samtalen — ikke onboarding-svarene dine» |
| C-06 | «Logger inntil 90 dager» | personvern §3 tabell | Ingen pruning-kode for SystemLog/PerformanceMetric i repo | FALSE (ukontrollert tidsangivelse) | «Inntil de ikke lenger trengs for sikkerhet og feilretting» — **[L2] retensjon for tekniske logger** |
| C-07 | «Matching-motoren er den eneste automatiserte funksjonen i Tosom» | personvern §6 | Reise-progressjon kjører også via cron (daglig) | PARTLY TRUE | Rettet: «den eneste delen av Tosom som tar avgjørelser uten at du gjør noe selv» |
| C-08 | «Vi selger aldri opplysninger … Alle er databehandlere …» | personvern §7 | Ingen salg/markedsføring i kode; DPA.md: DPAs «signeres i dashboard» (ikke bekreftet signert) | PARTLY TRUE (rolle ikke juridisk bekreftet) | Nøytralt: «De skal behandle opplysningene for oss, ikke for egne formål — vi arbeider med databehandleravtaler med alle» — **[L2] databehandlerroller** |
| C-09 | «Neon (EU, Frankfurt)» | personvern §7 tabell | docs/legal/DPA.md: Neon, eu-central-1 (Frankfurt); DATABASE_URL ikke verifisert fra repo | TRUE (per DPA.md) | Beholdt: «Neon (managed Postgres, EU/Frankfurt)» — **[L1] verifiser mot faktisk dashboard** |
| C-10 | «Vipps (ved lansering) — Identitet og alder» i leverandørtabell | personvern §7 | Vipps ikke aktiv (enableVipps default false; PAYMENTS fatal dersom true uten vei) | PARTLY TRUE (ikke aktiv) | Flyttet ut av tabell til footnote: «Vipps er ikke aktiv i dag» |
| C-11 | «Vi tilstreber at data lagres innenfor EU eller EØS. Der … utenfor EØS, skjer det på grunnlag av EU-kommisjonens standard personvernbestemmelser eller …» | personvern §8 | DPA.md: Pusher/Resend/Sentry = US; SCC/DPA **ikke bekreftet på plass** i repo | TOO ABSOLUTE / UNKNOWN | Fjernet. Dokumenterte fakta: Neon+R2 i EU/Frankfurt; Pusher/Resend/Sentry utenfor EØS; «Vi arbeider med databehandleravtaler og overføringsgrunnlag …» — **[L1] DPA/SCC/TRANSFER REVIEW REQUIRED** |
| C-12 | «Tekniske logger: Inntil 90 dager» | personvern §9 tabell | Ingen pruning i kode (se C-06) | FALSE (ukontrollert) | «Inntil de ikke lenger trengs for sikkerhet og feilretting» — **[L2]** |
| C-13 | «Rapporter om alvorlige forhold: Inntil 3 år, i anonymisert form» | personvern §9 tabell | `Report` uten automatisk retensjon i kode; ingen «anonymisering» av Report; bevis prunes ved 90 dager | FALSE (3 år + anonymisert har ingen kodedekning) | «Til saken er behandlet — beholdes også etter kontosletting» — **[L2] retensjon + grunnlag for rapport/blocklist** |
| C-14 | «Bevis … i inntil 90 dager EFTER AT SAKEN ER AVSLUTTET» | personvern §17 | `app/api/report:276`: `evidenceExpiresAt = now + 90 dager` (fast, fra rapporttidspunkt); cron prunes utløpte | PARTLY TRUE | Rettet: «Inntil 90 dager fra rapporten, deretter slettes det automatisk» |
| C-15 | «Vi svarer … Vi tar aldri betalt for at du bruker rettighetene dine» | personvern §11 | Eksport selvbetjent (`app/api/settings/export`); ingen betaling i dag | TRUE | Fordelt på §11 (rettigheter + selvbetjening) og §14 (30 dager + gratis) |
| C-16 | «Tosom er ikke en datingapp» | vilkår §2 | Posisjonering; samsvarer med landing/trygghet | TRUE (produktfakta) | Beholdt |
| C-17 | «Senere er planen 349 kroner … betalt én gang med Vipps» | vilkår §14 | `PRICING.active=false`; betalingsvei ikke implementert (fatal dersom enabled) | TOO ABSOLUTE i CURRENT avtale | Fjernet pris fra vilkårene. «Når betaling innføres, informerer vi om pris og betalingsvilkår» — prisplan ligger på `/priser` — **[L4] PAID V1: SEPARATE PURCHASE TERMS LIKELY** |
| C-18 | Angrerettspunkt med angrerettloven § 22 n + «Grensen går ved koblingen» + egen klausul «Hvorfor grensen går ved koblingen» | vilkår §15–16 | Ingen kjøp i dag; REFUND-modell i config/legal.ts er fremtidig (merket «Ikke juridisk bekreftet — se A-1») | PREMATURE i gratis-beta | Forkortet: gratis i dag (ingenting å angre) + egne kjøpsvilkår ved fremtidig betaling — **[L4] PAID V1: purchase terms / pre-contract info / withdrawal / commencement / credit-refund** |
| C-19 | «Velger dere «vi fant hverandre», slettes begge kontoene og hele samtalen» (uten 24t/PDF) | vilkår §17 | `lib/journey/endJourney.ts`: found_each_other = 24-timers grace, innhold beholdes for PDF, deretter permanent slettet. **RT1-final (27.10.2026, D8): ingen reiseslutt sletter User-kontoer — heller ikke etter grace. Konto-sletting skjer kun eksplisitt (GDPR/admin/blokkering/aldersgrrense).** | PARTLY TRUE (mangler runtime-fakta) | Rettet: «får dere 24 timer til å laste ned samtalen som PDF. Deretter slettes samtalen, bildene og reisen permanent — kontoen deres beholdes» |
| C-20 | «Enkelte opplysninger kan beholdes der loven krever det, eller … rapport om alvorlige forhold» | vilkår §17 | delete-account: MatchHistory, Report, UserBlock overlever (dokumentert i route + kode) | TRUE (vagus) | Presisert: rapporter + blokkeringer beholdes for sikkerhet; henvisning til personvern for nøyaktig liste |
| C-21 | «personvernerklæringen, som er en del av denne avtalen» | vilkår §21 | Personvernerklæringen er informasjonsplikt, ikke avtalebetingelse per seg | LEGAL INTERPRETATION | Fjernet «del av avtalen»-formuleringen — **[L3]** |
| C-22 | «Vi er ikke ansvarlige for indirekte tap … ansvarsbegrensning til det du har betalt» | vilkår §18 (nå §17) | — | LEGAL INTERPRETATION | Beholdt uten endring (har allerede «ingenting begrenser det uløselige») — **[L4]** |
| C-23 | «Vi svarer innen 10 virkedager» (reklamasjon) | vilkår §24 (nå §23) | Ingen SLA i kode | SERVICE COMMITMENT | Beholdt — **[L3]** |
| C-24 | «Oslo tingrett som verneting» | vilkår §24 (nå §23) | Tosom AS, forretningsadresse 0255 Oslo | TRUE (plausibelt) | Beholdt — **[L4] verneting** |
| C-25 | «Alle rapporter blir lest. Vi leser ikke samtaler uten at det foreligger en rapport» | vilkår §12 | Admin-panelet kan lese chat; «leses uten rapport» er operativt løfte, ikke kodedekning | OPERATIONAL COMMITMENT | Beholdt (korresponderer med /trygghet) — **[L3] løfte vs. faktisk kapasitet** |

---

## 2. Datakategorier (dokumentert mot HEAD)

| Kategori | Faktiske felter (prisma + validation) | Samlet ved |
|---|---|---|
| ACCOUNT | email, password (bcrypt-hash), name (visning), sesjoner, termsVersion/termsAcceptedAt, sensitiveConsentAt, withdrawalWaiverAt, lastSeenAt, journeyState, matchQueuedAt, bannedAt, deletedAt, (TwoFactorSecret — modell, ikke aktiv i flow i dag) | Registrering / innlogging |
| PROFILE / ONBOARDING | age (år, required), gender, seekingGender, postalCode + latitude/longitude (valgfri omtrentlig posisjon), bio, photoUrl, interests, lifeSituation, lifestyle, personality, relationshipStyle, communication, intimacy, futureVision, boundaries, emotionalNeeds, lifeRhythm, securityLevel, maturityLevel, **religion + religionOpen + aksepterte religioner (≤4) + religionImportance (1–10)**, psychometricAnswers (BFI-10, ECR-S, PVQ-10, ERQ-6 + egne kommunikasjons-items), bigFive/attachment/valueProfile/emotionRegulation (deriverte skårer), psychometricVersion, onboardingDraft | Onboarding |
| SPECIAL CATEGORY (art. 9) | religion/livssyn; intimacy (seksualliv); emotionalNeeds/boundaries (kan si noe om psykisk helse / vanskelige hendelser); gender + seekingGender (kan si noe om seksuell orientering) | Onboarding + /samtykke |
| MATCHING | Match: score (0–100), normalizedScore, scoringBreakdown, explanation, resonanceLevel; Profile.matchTags | Matcherunde (cron natt til lørdag) |
| JOURNEY | JourneyProgress (day, phase, dates), JourneyStateLog, JourneyMilestone, ResonanceSession, GameSession, journeyState på User | Under reisen |
| COMMUNICATION | Message (content, type, imageKey, deliveredAt, readAt), SystemMessage, Notification | Chat |
| MEDIA | Message.imageKey → Cloudflare R2 (signerte URL-er, TTL 900 s) | Chat fra dag 8 |
| SAFETY | Report (category, description, status, evidence JSON, evidenceExpiresAt=+90 dager), UserBlock, bannedAt | Rapport/blokkering |
| TECHNICAL | SystemLog, PerformanceMetric, RateLimitCounter (Postgres/Upstash), Sentry (PII-skrubba), Vercel-driftslogger (e-post/IP kan inngå) | Drift |
| FREE BETA | BetaInvite (email), Quota (teller), Order/WebhookEvent (modeller, ikke brukt — betaling av) | Invitasjon/bruk |
| STATISTIKK | JourneyStat: aggregater med bånd (ageBand «23-29», distanceBand «0-25km») — ingen bruker-ID; MatchHistory: orfanerte userAId/userBId + outcome etter sletting | Reiseavslutning |

**Ikke samlet i dag** (fjernet fra copy eller ikke listet): telefonnummer (felt finnes, fylls ikke), IP-adresse i vår DB (`lib/auth/security.ts`: «IP-logging som ikke er implementert»), fødselsdato (kun alder i år), analytikere/cookies utover sesjon/CSRF.

---

## 3. Formål (dokumentert)

Konto: opprette/sikre konto, innlogging, sletting · Profil: onboarding · Matching: vurdere koblinger (hard exclusions + signaler), kø, én kobling om gangen · Reise: 14 dager, faser, dag-8-bilder, chat, PDF · Bilder: vises kun til partner i samtalen · Sikkerhet: rapport/blokkering/moderering, forhindre gjentakelse også etter sletting · Teknisk: rate limiting, feilretting, drift · Rettigheter: innsyn/eksport/sletting · Beta: invitasjon + kvote 5 000.

---

## 4. BEHANDLINGSGRUNNLAG — matrise til jurist

> CURRENTLY DOCUMENTED BASIS (står i tabellen på /personvern, «Grunnlag (i dag)»). **Juristen skal bekrefte endelig.**

| PURPOSE | DATA | CURRENTLY CLAIMED BASIS | IMPLEMENTATION | LAWYER REVIEW REQUIRED |
|---|---|---|---|---|
| Konto + innlogging | email, passord-hash, sesjoner | Avtale (art. 6.1.b) | Registrering krever vilkårsaksept | **[L2]** 6.1.b vs 6.1.f for sikkerhet/brute-force |
| Onboarding/profil | alle profilsvar (inkl. art. 9-deler) | Avtale (6.1.b) + samtykke (9.2.a) for særlige kategorier | /samtykke: separat, uttrykkelig; `sensitiveConsentAt` | **[L2]** 6.1.b for avtalens utførelse; **[L1]** 9.2.a — see §5 |
| Matching | profil + psychometrics | Avtale (6.1.b) (særlige kategorier: 9.2.a) | Cron natt til lørdag, deterministisk | **[L1]** see §6/§7 |
| Reise/chat/bilder | meldinger, bilder, progress | Avtale (6.1.b) | 14 dager | **[L2]** |
| Rapport/blokkering/bevis | Report, UserBlock, evidence | Berettiget interesse (6.1.f) | Automatisk bevis ved rapport | **[L2]** 6.1.f + **[L1]** oppbevaring etter sletting (sikkerhetsgrunnlag) |
| Teknisk sikkerhet/logger | SystemLog, rate-limit, Sentry | Berettiget interesse (6.1.f) | PII-skrubbing aktiv | **[L2]** |
| Beta-kvote/invitasjon | BetaInvite, Quota | Berettiget interesse (6.1.f) | isInvitedEmail, Quota-teller | **[L2]** |
| Statistikk (JourneyStat/MatchHistory) | bånd-aggregater / orfanerte ID-er + outcome | (ikke erklært i public copy i dag) | JourneyStat ved reiseslutt; MatchHistory ved sletting | **[L1]/[L2]** re-identifierbarhet av MatchHistory-ID + grunnlag |

---

## 5. ARTIKKEL 9 / RELIGION

**Fakta (dokumentert):**

- Religion/livssyn samles faktisk: `religion` (≤4 valg), `religionOpen`, aksepterte religioner (≤4, hard kompatibilitet i matching: `lib/matching/cheapFeatures.ts` + `scoreRound.ts` «gjensidig hard kompatibilitet»), `religionImportance` (1–10).
- Samtykkeflyt (faktisk): `/samtykke`-skjerm → POST `/api/consent` → `sensitiveConsentAt` lagres separat fra `termsVersion`. Onboarding (`app/api/profile/setup`) nekter å fullføre uten samtykke. Samtykket er altså **betingelse for å fullføre onboarding i dag**.
- Mekanisme for uttak i dag: slette konto (sletter også art. 9-data).

**[L1] LAWYER CONFIRM:**

1. Er art. 9.2.a (explicit consent) riktig unntak — og holder det gitt at samtykket innhentes i en kombinert skjerm (vilkår + samtykke på samme side, to avkrysningsbokser)?
2. «Explicit consent»-kvalitet: er innhentingsmåten (checkbox i onboarding-flow, som forutsetning for å fortsette) tilstrekkelig spesifikk, informert, og uten tvetydighet — spesielt gitt at uttak i dag KUN skjer ved kontosletting?
3. **Trekke tilbake samtykke uten å slette konto:** hva skal skje med matching/profildata etter uttak (fjerne fra matcherunden? beholde «religion-agnostisk» profil?). Copy i dag sier at uttak = sletting. Er det forsvarlig, eller må mekanismen byttes ut?
4. DPIA: `docs/legal/DPIA.md` v1.0 eksisterer (utfylt, trenger advokatsignatur). Produktbeskrivelsen er rettet 30→14 dager (2026-10-26, produktfaktisk retting kun). Fremdeles utdaterte produktfakta i DPIA for juristens vurdering: «telefon (valgfritt)» (§1.2 — samles ikke i dag) og UploadThing som mottaker (§1.4 — ikke aktiv).
5. **Utbred av art. 9:** Spørsmål til juristen: «Hvilke av Tosoms konkrete opplysninger omfattes etter deres vurdering av GDPR artikkel 9? Tosom behandler religion/livssyn eksplisitt. Vurder også om andre profil-, preferanse- eller relasjonsopplysninger direkte eller indirekte kan innebære behandling av særlige kategorier.» (Dokumentert særlig kategori i dag: religion/livssyn. Andre konkrete data vurderes separat — ingen auto-klassifisering av f.eks. «personlighet» er tatt.)

---

## 6. PROFILERING / MATCHING — fakta

Dokumentert teknisk beskrivelse (står nå i /personvern §6 og vilkår §8):

- Ukelig cron-runde (natt til lørdag, `MATCH_ROUND`), deterministisk, ingen AI.
- Pipeline (per `scoreRound.ts`): manglende profil → sperreliste (UserBlock) → dealbreakers (hårde utelukkelsener: bl.a. religion/livssyn-gjensidig aksept, avstand/radius; delvis inaktive filtre: livsrytme, eksplisitte preferanser/matchTags) → unifiedScore (6 dimensjoner, 0–100: values, attachment, personality, communication, emotionRegulation, lifeSituation; psykometriske skårer hvor begge har, ellers ordoverlapp) → **MIN_SCORE 40** → MIN_COHORT 2 → queue-limit.
- Ingen egnet kandidat → ingen kobling → brukeren står i kø til neste runde.
- Bilder/utseende inngår aldri; ingen klinisk vurdering; score vises aldri for brukeren.

**[L1] LAWYER DECISION: DOES THIS CONSTITUTE GDPR PROFILING (art. 4(4))?**
Automatisert behandling av personopplysninger med formål å vurdere personlige aspekter (kompatibilitet, tilknytning, verdier) — virker å dekke definisjonens kjernen, men endelig klassifisering er juristens. Copy er skrevet som FAKTA (ikke som konklusjon) og unngår ordet «profilering» helt.

## 7. AUTOMATISERTE AVGJØRELSER (ART. 22) — fakta

- Matching er fullt algoritme-drevet: hard constraints + scoring + minimumsscore + kø. Ingen «mann i loop» i den ordinære runden (admin kan se/review matcher i panelet; `Match.reviewed`-felt eksisterer).
- Effekt på brukeren: brukeren får én person eller ingen; ingen negativ «avvisning» i tradisjonell forstand, men ingen kobling = ingen tjeneste den uken.
- **[L1] LAWYER DECISION: ARTICLE 22 APPLICABILITY** — «rettslig eller lignende vesentlig effekt»? Trengs motforetellingsrett / menneskelig inngripen / art. 22.3-unntak?

---

## 8. MOTTAKERE / DATABEHANDLERE (kun aktive, verifisert mot env + DPA.md)

| PROVIDER | PURPOSE | DATA CATEGORY | CLIENT/SERVER | ACTIVE? | ROLE CLAIMED? | REGION/TRANSFER DOCUMENTED? |
|---|---|---|---|---|---|---|
| Vercel | Hosting, Next.js API + cron | Alt som går gjennom API; driftslogger kan inneholde e-post + IP | SERVER | **Ja** (VERCEL_URL, required) | Databehandler (DPA.md: «signeres i dashboard») | US (default IAD per DPA.md) — ⚠️ region verifiseres — **[L1]** |
| Neon (managed Postgres) | Databasen | Alt i §2 | SERVER | **Ja** (DATABASE_URL required) | Databehandler | eu-central-1 (Frankfurt) per DPA.md — **[L1] verifiser** |
| Cloudflare (CDN/WAF + R2) | Nettverksbeskyttelse; bildefillagring | R2: bilder; WAF/CDN: IP i logs | SERVER | **Ja** (R2_* required) | Databehandler | R2: eu-central-1 per DPA.md — **[L1]** |
| Pusher | Sanntids-chat | Meldingsinnhold i transit, kanal-ID | SERVER | **Ja** (PUSHER_* required) | Databehandler | US (AWS us-east-1 per DPA.md) — **[L1] SCC** |
| Resend (via SMTP) | Transaksjonell e-post | E-postadresse, epost-innhold i transit | SERVER | **Ja** (EMAIL_SERVER_* required; modul dokumenterer smtp.resend.com) | Databehandler | US per DPA.md — **[L1] SCC** — verifiser at EMAIL_SERVER_HOST faktisk er Resend |
| Sentry | Feilmonitorering | Stack traces, feildata — PII-skrubbing aktiv (`lib/observability/pii.ts`, sendDefaultPii:false) | CLIENT+SERVER | **Ja** (withSentryConfig + instrumentation.ts) | Databehandler | US per DPA.md — **[L1] SCC** |
| Upstash Redis | Rate limiting + kortlevede cache (journey-content 24t, aktiv match 5 min, kvote 60 s) | Teller-verdier/caches (kan knyttes til e-post/userId) | SERVER | **Kun via Vercel-dashboard — IKKE verifiserbar fra repo** (CA-08-guarden krever derfor at den ikke listes på /personvern) | Databehandler (hvis aktiv) | US (typisk) — **[L1]** verifiser i dashboard, deretter liste opp |
| Vipps | — | — | — | **NEI** (enableVipps default false; PAYMENTS fatal dersom true uten vei) | — | — |
| UploadThing | (var bilde-upload-mellomledd) | — | — | **NEI** (fjernet fra kode; kun oppryddingstest) | — | — |

**[L1] LAWYER REVIEW:** DPA-signaturstatus for alle; SCC/transfer basis for US-leverandører (Pusher, Resend, Sentry, Upstash, Vercel-deler); underbehandling (subprocessors) hos hver. **DPA/SCC/TRANSFER REVIEW REQUIRED.**

---

## 9. DATA UTENFOR EØS

Dokumentert i dag: Pusher, Resend, Sentry (og sannsynlig Upstash/Vercel-deler) har US-presens per DPA.md. Ingen SCC/DPA bekreftet signert i repo.
Public copy (/personvern §8) er nå nøytral: EU-lagring for DB+R2, US-leverandører nevnt, DPA/SCC-arbeidet nevnt som pågående, ingen «alle data i EU/EØS»-claim.
**[L1] DPA/SCC/TRANSFER REVIEW REQUIRED — juristen konkluderer.**

---

## 10. RETENTION — matrise (CODE vs PUBLIC CLAIM)

| Data | CODE/CONFIG VALUE | PUBLIC CLAIM (etter) | MATCH? |
|---|---|---|---|
| Aktiv konto/profil | slettes ved delete-account (øyeblikkelig) | «Til du sletter kontoen» | ✅ |
| Chat/bilder (ordinært) | endJourney: øyeblikkelig (R2 + DB) | «Til reisen avsluttes» | ✅ |
| Chat/bilder (found_each_other) | 24-timers grace, deretter permanent (cron) | «24 timer … deretter permanent» | ✅ |
| Særlige kategorier | slettes med kontoen | «Til kontoen slettes» | ✅ |
| Rapportbevis (evidence) | +90 dager fra rapport (fast), cron-prune | «Inntil 90 dager fra rapporten» | ✅ (rettet fra «etter saken er avsluttet») |
| Rapporter selv | Ingen automatisk retensjon i kode | «Til saken er behandlet» | ⚠️ **[L2]** — ingen kodeverdi; operativ beslutning + juridisk grunnlag til jurist |
| Blocklist (UserBlock) | Overlever sletting (ingen FK) | «Beholdes … holder tjenesten trygg» | ⚠️ **[L2]** retensjon + grunnlag |
| MatchHistory | Overlever sletting (orfanerte ID + outcome) | «En post om at en kobling fant sted (uten innhold)» | ✅ (beskrivelse) — **[L1] re-identifierbarhet** |
| JourneyStat | Aggregater (bånd), ingen ID | Ikke nevnt eksplicit | ✅ (dekket under statistikk) |
| Tekniske logger | Ingen pruning i kode | «Inntil de ikke lenger trengs» | ⚠️ **[L2]** — fastsett faktisk levetid (Vercel-logpolicy + egen DB) |
| Inaktiv-konto-anonymisering (12 mnd) | Eksisterer (`lib/privacy/retention.ts`) men **RETENTION_ENABLED default OFF** | Ikke nevnt (ikke aktiv) | ✅ bevisst utelatt — **[L3]** ved aktivering |
| Backups | deploy/backup.md: daglig pg_dump (7 dgr) / ukentlig full (30 dgr) — B5.7 gjenopprettingstest IKKE dokumentert; managed-DB auto-backups ikke uavhengig verifisert | «Data i tekniske sikkerhetskopier kan forbli inntil kopien utløper» | ⚠️ **[L1]** verifiser faktisk backup-retensjon i prod |
| Regnskap | Ingen betaling i dag | «Gjelder først når betaling innføres … 5 år (bokføringsloven)» | ✅ kondisjonert |

---

## 11. ACCOUNT DELETION — faktisk oppførsel (dokumentert)

- **PRIMARY DATA DELETION: øyeblikkelig** (transaksjon i `app/api/settings/delete-account/route.ts`): User-rad, Profile, alle Conversation + Message (begge parters), JourneyStateLog, ResonanceSession, GameSession, Notification, JourneyProgress, Match, Session, Account, TwoFactorSecret, PasswordResetToken + R2-bildefiler (via endJourney for aktiv match).
- **BEHOLDTES:** Report (+evidence, prunes ved 90 dgr), UserBlock, MatchHistory (orfanerte ID + outcome), AuditLog (adminId nulls ut), JourneyStat-aggregater, Quota/BetaInvite.
- **BACKUPS:** kan beholde sletta data inntil backup utløper (se §10).
- **found_each_other:** motsatt retning — 24t beholdelse (PDF), deretter permanent sletting av begge.
- Public copy samsvarer nå med dette (personvern §10, vilkår §16).

---

## 12. RETTIGHETER

Implementert selvbetjent: innsyn/se profil (Innstillinger), eksport/dataportabilitet (`app/api/settings/export` — JSON inkl. consent-metadata), retting (profil-edit), sletting (delete-account). Begrensning/innsigelse: ingen selvbetjening → henvendelse til support (copy bruker «Avhengig av behandlingen kan du ha rett til …»). Klage: Datatilsynet (Postboks 458 Sentrum, 0105 Oslo) + datatilsynet.no.
**[L3] LAWYER CHECK WORDING** for «senest innen 30 dager» (GDPR: 1 måned) og «10 virkedager» (reklamasjon, vilkår §23).

---

## 13. DIGITALYTELSESLOVEN

**QUESTION (til juristen): Does the Norwegian Digital Services Act / digitalytelsesloven apply to Tosom's free beta where users provide personal data?**

Fakta juristen trenger:

- Digital tjeneste (web/app), forbrukerrettet, 21+.
- Gratis beta: ingen betaling i dag (de første 5 000), ingen abonnement.
- Persondata påkrevd/brukt: ja — utstrakt (inkl. særlige kategorier, art. 9).
- Matching-tjeneste (automatisert vurdering av personlige aspekter).
- Invite-gate i dag (midlertidig).

Copy på /vilkar nevner i dag ikke digitalytelsesloven. Ingen konklusjon tatt. **[L1]**

---

## 14. PAID V1 / KJØPSVILKÅR

**CURRENT:** Avtalevilkår for bruk av Tosom (gratis beta).
**FUTURE PAID V1:** Separat kjøpsvilkår vurderes — **[L4] LAWYER DECISION**:

- purchase terms structure (separat side / i vilkårene / i checkout)
- pre-contract information (hvem, hva, pris, varighet, identitet)
- withdrawal right (angrerett) — gjelder § 22 n (digitalt innhold) for reisen? (JURIDISK-GRUNNLAG A-1)
- service commencement (når regnes leveringen som begynt — ved kobling?)
- replacement journey / credit / refund ved brudd
- PRICING i config (349 NOK én gang) + REFUND-modell er allerede kodet som fremtidig model, men IKKE juridisk bekreftet.

---

## 15. CROSS-DOCUMENT CONSISTENCY

| Delt claim | Sider sjekket | RESULTAT |
|---|---|---|
| Sletting øyeblikkelig + 24t-PDF | /vilkar, /personvern | ✅ rett i begge (var inkonsistent før: vilkår manglet 24t/PDF) |
| 21+ aldersgrense | /vilkar, /personvern, /trygghet, landing | ✅ samlet (MIN_AGE=21 kanonisk) |
| Matching (én kobling, ingen garanti, natt til lørdag, ingen bilder) | /vilkar, /personvern, /trygghet, /slik-fungerer-det, /reisen | ✅ samlet; personvern §6 tilføyer teknisk beskrivelse uten juridisk konklusjon |
| Religion/særlige kategorier | /vilkar, /personvern, /samtykke | ✅ samlet (art. 9 nevnt konsistent) |
| Profiling | /personvern, /metoder | ✅ /metoder sier «egen modell» uten juridisk claim; personvern unngår ordet «profilering» |
| Betaling | /vilkar, /personvern, /priser, landing | ✅ rettet: vilkår sier ikke lenger 349 kr (var «too absolute for current avtale»); prisplan står bare på /priser |
| Cookies | /personvern, /cookies | ✅ personvern §12 peker på /cookies; samsvar (sesjon ca. 30 dgr, ingen analytics) |
| Identitet/Vipps | /vilkar, /personvern, /trygghet, landing | ✅ alle sier «når Vipps aktiveres» (betinget), ingen påstår verifisert identitet i dag |
| Processors | /personvern, docs/legal/DPA.md, docs/LEGAL-REVIEW-PACKAGE | ✅ samlet (Upstash tilføyd; UploadThing fjernet; Vipps flyttet til footnote) |
| Retensjon | /personvern, kode | ✅ rettet (90 dgr-bevis, 3 år-rapport fjernet, logger nøytralt) — se §10 |
| **ÅPENT:** «Vi svarer innen 30 dager» vs GDPR 1 mnd | /personvern | ⚠️ [L3] |
| DPIA produktfakta (14 dager) | docs/legal/DPIA.md | ✅ rettet 2026-10-26 (30→14, produktfakta kun — risiko/konklusjoner uendret) · signatur: PENDING LAWYER REVIEW |
| **ÅPENT:** .env.example har legacy «Supabase»-blokk | .env.example | ⚠️ rydd opp for å unngå forvirring om DB-leverandør |

---

## 16. ÅPNE JURIDISKE SPØRSMÅL (samlet, til advokaten)

1. **[L2]** Art. 6-bokstav per formål (se §4-matrisen).
2. **[L1]** Art. 9: unntak 9.2.a + explicit consent-kvalitet + uttaks-mekanisme (se §5).
3. **[L1]** Samtykke: gyldighet + konsekvens av uttak for matching/profildata.
4. **[L1]** Profiling-klassifisering (art. 4(4)) (se §6).
5. **[L1]** Art. 22-tilbørlighet (se §7).
6. **[L1]** DPIA: signeres (docs/legal/DPIA.md) — produktfakta rettet til 14 dager (2026-10-26); «telefon (valgfritt)»/UploadThing fortsatt utdaterte produktfakta (se §5 pkt 4).
7. **[L1]** Processors: DPA-signatur + SCC/transfer (se §8/§9).
8. **[L2]** Retensjon: rapporter/blocklist/logger + grunnlag (se §10).
9. **[L1]** digitalytelsesloven / gratis beta (se §13).
10. **[L4]** Paid V1: kjøpsvilkår + angrerett (se §14).
11. **[L3]** Responsfrister (30 dager / 10 virkedager) (se §12).
12. **[L4]** Ansvarsbegrensning + verneting + content-lisens (vilkår §13/§17/§19/§23).
13. **[L1]** Backups: faktisk retensjon + gjenopprettingstest (B5.7) — se §10/§11.

---

*Prepared 26.10.2026 · HEAD-kartlegging · PREPARED FOR LAWYER REVIEW — ingen juridisk konklusjon er tatt i dette dokumentet utover de merkede spørsmålene.*