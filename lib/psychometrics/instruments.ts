// lib/psychometrics/instruments.ts — FORSKNINGSMOTOR F-1
//
// Alle 44 psykometriske items som data: id, tekst (norsk), trekk, reversert.
//
// Kilder (se FORSKNINGSMOTOR-v1.0.md):
//   BFI-10:      Rammstedt & John (2007) — fritt tilgjengelig
//   PVQ-10:      Schwartz (1992) — fritt, brukt i European Social Survey
//   ERQ-6:       Gross & John (2003) — fritt tilgjengelig
//   COMMUNICATION: Egne items på Gottman-prinsipper (reparasjon, invitasjoner,
//                  konfliktstil) — Gottman Institute lisenserer sine skjemaer,
//                  vi kan kun bygge på prinsippene.
//   ATTACHMENT:  Egne items inspirert av tilknytningsteori (Bowlby 1969,
//                Ainsworth 1978, Hazan & Shaver 1987). ECR-S er lisensert
//                "fritt for ikke-kommersiell forskning" — vi bruker derfor
//                egne items som taper på de to akserne (angst + unnvikelse).
//
// Alle items merket [OVERSETTELSE — bør kvalitetssikres] for BFI-10, PVQ-10
// og ERQ-6 (oversettelsene er våre, ikke de offisielle norske versjonene).
// ATTACHMENT og COMMUNICATION er egne og kan kvalitetssikres som ToSom-tone.

/* ═══════════════════════════════════════════════════════════
   TYPE
   ═══════════════════════════════════════════════════════════ */

export interface Item {
  /** Unik ID, f.eks. 'bfi1', 'att_a1', 'pvq3'. */
  id: string;
  /** Norsk tekst (rolig ToSom-tone). */
  text: string;
  /** Hvilket trekk/skala itemet måler. */
  trait: string;
  /** true = høy score = lav verdier på trekket (reversert). */
  reversed: boolean;
}

/** Versjon av instrumentsettet — for framtidig migrering. */
export const INSTRUMENT_SET_VERSION = '2026-08-22.v1';

/* ═══════════════════════════════════════════════════════════
   BFI-10 — Big Five kortform (Rammstedt & John, 2007)
   [OVERSETTELSE — bør kvalitetssikres]
   ═══════════════════════════════════════════════════════════ */

export const BFI10: Item[] = [
  { id: 'bfi1',  text: 'Jeg er stille og reservert.',                      trait: 'extraversion',      reversed: true },
  { id: 'bfi2',  text: 'Jeg stoler lett på andre.',                        trait: 'agreeableness',     reversed: false },
  { id: 'bfi3',  text: 'Jeg er nysgjerrig på mange ting.',                 trait: 'openness',          reversed: false },
  { id: 'bfi4',  text: 'Jeg har et aktivt fantasi-liv.',                   trait: 'openness',          reversed: false },
  { id: 'bfi5',  text: 'Jeg fullfører alltid det jeg starter.',            trait: 'conscientiousness', reversed: false },
  { id: 'bfi6',  text: 'Jeg er grundig og systematisk i det jeg gjør.',    trait: 'conscientiousness', reversed: false },
  { id: 'bfi7',  text: 'Jeg er den som får folk til å le på en fest.',     trait: 'extraversion',      reversed: false },
  { id: 'bfi8',  text: 'Jeg har en tilgivende natur.',                     trait: 'agreeableness',     reversed: false },
  { id: 'bfi9',  text: 'Jeg blir lett oppbrakt.',                          trait: 'neuroticism',       reversed: false },
  { id: 'bfi10', text: 'Jeg tenner lett på ting.',                         trait: 'neuroticism',       reversed: false },
];

/* ═══════════════════════════════════════════════════════════
   ATTACHMENT — Tilknytning (12 egne items)
   Inspirert av: Bowlby (1969), Ainsworth et al. (1978),
   Hazan & Shaver (1987). EGEN TEKST — ikke ECR-S.
   To akser: anxiety (angst) + avoidance (unnvikelse).
   ═══════════════════════════════════════════════════════════ */

export const ATTACHMENT: Item[] = [
  // Angst (6 items) — høy score = engstelighet
  { id: 'att_a1', text: 'Jeg tenker ofte på om partneren min egentlig liker meg.',          trait: 'attachment_anxiety',  reversed: false },
  { id: 'att_a2', text: 'Jeg trenger ofte å vite at partneren min er der.',                 trait: 'attachment_anxiety',  reversed: false },
  { id: 'att_a3', text: 'Jeg frykter at partneren min ikke er like forelsket i meg.',       trait: 'attachment_anxiety',  reversed: false },
  { id: 'att_a4', text: 'Jeg føler meg usikker når partneren min er opptatt med andre.',   trait: 'attachment_anxiety',  reversed: false },
  { id: 'att_a5', text: 'Jeg trenger mye bekreftelse for å føle meg trygg i et forhold.',  trait: 'attachment_anxiety',  reversed: false },
  { id: 'att_a6', text: 'Jeg tenker mye på hva forholdet vårt betyr for fremtiden.',       trait: 'attachment_anxiety',  reversed: false },

  // Unnvikelse (6 items) — høy score = unnvikende
  { id: 'att_v1', text: 'Jeg tar gjerne tid for meg selv i et forhold.',                    trait: 'attachment_avoidance', reversed: false },
  { id: 'att_v2', text: 'Jeg er ikke så god til å fortelle hva jeg kjenner på.',           trait: 'attachment_avoidance', reversed: false },
  { id: 'att_v3', text: 'Jeg liker å beholde mine egne rom og rutiner.',                    trait: 'attachment_avoidance', reversed: false },
  { id: 'att_v4', text: 'Det er lett for meg å ta avstand når ting blir for nært.',        trait: 'attachment_avoidance', reversed: false },
  { id: 'att_v5', text: 'Jeg foretrekker å løse ting selv fremfor å be om hjelp.',         trait: 'attachment_avoidance', reversed: false },
  { id: 'att_v6', text: 'Jeg er komfortabel med ikke å vite helt hva partneren min tenker.', trait: 'attachment_avoidance', reversed: false },
];

/* ═══════════════════════════════════════════════════════════
   PVQ-10 — Verdier (Schwartz, 1992)
   [OVERSETTELSE — bør kvalitetssikres]
   ═══════════════════════════════════════════════════════════ */

export const PVQ10: Item[] = [
  { id: 'pvq1',  text: 'Å hjelpe og stå ved siden av de jeg kan stole på.',    trait: 'benevolence',   reversed: false },
  { id: 'pvq2',  text: 'Å være kreativ og finne egne løsninger.',              trait: 'self_direction', reversed: false },
  { id: 'pvq3',  text: 'Å være åpen for nye opplevelser.',                     trait: 'stimulation',   reversed: false },
  { id: 'pvq4',  text: 'Trygghet for meg selv og dem jeg holder av.',          trait: 'security',      reversed: false },
  { id: 'pvq5',  text: 'God helse og velvære.',                                trait: 'hedonism',      reversed: false },
  { id: 'pvq6',  text: 'En god og trygg familie.',                             trait: 'security',      reversed: false },
  { id: 'pvq7',  text: 'Å gjøre det som kjennes rett.',                        trait: 'conformity',    reversed: false },
  { id: 'pvq8',  text: 'Å ha kontroll over livet mitt.',                       trait: 'power',         reversed: false },
  { id: 'pvq9',  text: 'At ting gjøres på en ordentlig måte.',                 trait: 'conformity',    reversed: false },
  { id: 'pvq10', text: 'Å være nyttig for andre.',                             trait: 'benevolence',   reversed: false },
];

/* ═══════════════════════════════════════════════════════════
   ERQ-6 — Emosjonsregulering (Gross & John, 2003, kortform)
   [OVERSETTELSE — bør kvalitetssikres]
   To akser: reappraisal (kognitiv omtydning) + suppression (undertrykking)
   ═══════════════════════════════════════════════════════════ */

export const ERQ6: Item[] = [
  // Reappraisal (3 items)
  { id: 'erq_r1', text: 'Jeg prøver å se ting fra en ny vinkel når jeg er oppbrakt.',      trait: 'reappraisal', reversed: false },
  { id: 'erq_r2', text: 'Jeg endrer synet mitt på ting for å roe meg ned.',                trait: 'reappraisal', reversed: false },
  { id: 'erq_r3', text: 'Jeg lager en ny betydning av ting for å håndtere følelsene mine.', trait: 'reappraisal', reversed: false },

  // Suppression (3 items)
  { id: 'erq_s1', text: 'Jeg holder tilbake reaksjonene mine når jeg er sint.',           trait: 'suppression', reversed: false },
  { id: 'erq_s2', text: 'Jeg lar ikke andre se hva jeg egentlig kjenner på.',             trait: 'suppression', reversed: false },
  { id: 'erq_s3', text: 'Jeg skjuler hva jeg føler, selv når jeg kjenner det sterkt.',    trait: 'suppression', reversed: false },
];

/* ═══════════════════════════════════════════════════════════
   COMMUNICATION — Kommunikasjon (6 egne items)
   Bygget på prinsipper fra Gottman & Levenson (1992):
   reparasjonsforsøk, respons på invitasjoner til kontakt,
   konfliktstil. EGEN TEKST — ikke Gottman Institute.
   ═══════════════════════════════════════════════════════════ */

export const COMMUNICATION: Item[] = [
  { id: 'comm1', text: 'Når vi krangler, prøver jeg å få ting til å bli bedre selv om jeg er irritert.', trait: 'repair',        reversed: false },
  { id: 'comm2', text: 'Jeg svarer på små invitasjoner til kontakt (en kommentar, et blikk) med varme.', trait: 'bids',          reversed: false },
  { id: 'comm3', text: 'Jeg kan si nei uten at det ødelegger forholdet.',                                              trait: 'conflict',      reversed: false },
  { id: 'comm4', text: 'Jeg lytter for å forstå, ikke for å svare.',                                                   trait: 'listening',     reversed: false },
  { id: 'comm5', text: 'Når jeg er fornærmet, forteller jeg det rolig i stedet for å la det bygge seg.',              trait: 'expressing',    reversed: false },
  { id: 'comm6', text: 'Jeg kan be om noe jeg trenger uten å kjenne meg klumsete.',                                    trait: 'requesting',    reversed: false },
];

/* ═══════════════════════════════════════════════════════════
   SAMLET SETT
   ═══════════════════════════════════════════════════════════ */

/** Alle 44 items i ett array. Brukes av onboarding for sekvensiell presentasjon. */
export const ALL_ITEMS: Item[] = [
  ...BFI10,
  ...ATTACHMENT,
  ...PVQ10,
  ...ERQ6,
  ...COMMUNICATION,
];

/** Totalt antall items (må være 44). */
export const TOTAL_ITEMS = ALL_ITEMS.length; // 10+12+10+6+6 = 44