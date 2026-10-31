/**
 * Tosom — Steg 12: Oppsummering (LANGUAGE & CLARITY ACT O1 — rebuild)
 *
 * Ryddig, ærlig gjennomgang av de viktigste valgene — IKKE en dump av
 * alle svar. Struktur:
 *   A. OM DEG                     B. HVEM DU ØNSKER Å MØTE
 *   C. DET SOM MÅ STEMME          D. LIVSSYN / RELIGION
 *   E. PROFILSTATUS               F. NESTE STEG
 * + organiserte detaljseksjoner med «Endre» (goToStep) for det øvrige.
 *
 * Regler fra ACT:
 * - Aldersspennet leses fra CANONICAL feltene agePrefMin/agePrefMax
 *   (P1-fix: leste tidligere de døde feltene minAge/maxAge → viste alltid 21–40).
 * - Aldersspennet vises via formatAgePrefRange (lib/onboarding/age-label):
 *   99+ (null-maks) renderes «21–99+», endelige verdier som faktiske tall.
 *   REV 1.2: null = åpen øvre grense (produktbeslutning).
 * - Ingen påstand om at siden viser «hele profilen» / at profilen er
 *   «komplett». Skala-svarene (49) vises som fullført seksjon, ikke rause.
 * - Religion/livssyn vises kun som brukerens eget valg + akseptstatus —
 *   ingen sensitiv detalj utover det.
 */

'use client';

import { OnboardingSlide } from '@/app/onboarding/components/OnboardingSlide';
import { OB } from '@/app/onboarding/theme';
import { PremiumCTAButton } from '@/app/onboarding/components/PremiumCTAButton';
import { BackButton } from '@/components/onboarding/BackButton';
import { formatAgePrefRange } from '@/lib/onboarding/age-label';

interface Props {
  data: Record<string, unknown>;
  onNext: () => void;
  step: number;
  goToStep: (s: number) => void;
}

const val = (f: string, fb = '—') => (d: Record<string, unknown>) => {
  const v = d[f];
  return v !== undefined && v !== null ? String(v) : fb;
};

/**
 * Verdi→etikett for flervalgsfelt i oppsummeringen.
 * Data lagrer rå-verdier (ofte kommaseparert ved flervalg);
 * uten kartlegging ville «Roker-av-og-til,Snuser» stått rått.
 */
const LABELS: Record<string, Record<string, string>> = {
  lifestyle: { Aktiv: 'Aktiv', Rolig: 'Rolig', Balansert: 'Balansert', Eventyrlysten: 'Eventyrlysten', Hjemmekjær: 'Hjemmekjær' },
  smoking: { 'Roker-snuser-ikke': 'Røyker/Snuser ikke', 'Roker-av-og-til': 'Røyker av og til', Snuser: 'Snuser', Roker: 'Røyker' },
  religion: { Kristen: 'Kristen', Katolsk: 'Katolsk', Agnostiker: 'Agnostiker', Ateist: 'Ateist', Muslim: 'Muslim', 'Jehovas-vitne': 'Jehovas vitne', Hindu: 'Hindu', Judedom: 'Jødedom', Buddhist: 'Buddhist', Spirituell: 'Spirituell', Annet: 'Annet' },
  acceptedReligions: { Kristen: 'Kristen', Katolsk: 'Katolsk', Agnostiker: 'Agnostiker', Ateist: 'Ateist', Muslim: 'Muslim', 'Jehovas-vitne': 'Jehovas vitne', Hindu: 'Hindu', Judedom: 'Jødedom', Buddhist: 'Buddhist', Spirituell: 'Spirituell', Annet: 'Annet' },
  children: { 'Har-små-barn': 'Har små barn', 'Har-barn': 'Har barn', 'Har-vaksen-barn': 'Har voksne barn', 'Har-ikke-barn': 'Har ikke barn' },
  wantChildren: { Ja: 'Ja', Usikker: 'Usikker', Nei: 'Nei', Bonusfamilie: 'Åpen for bonusfamilie' },
  loveGive: { ord: 'Ord og ros', tjenester: 'Gjør ting for andre', tid: 'Kvalitetstid sammen', kjønnlig: 'Fysiske klemmer og berøring', gaver: 'Å gi gaver' },
  loveReceive: { ord: 'Ord og ros', tjenester: 'Gjør ting for meg', tid: 'Kvalitetstid sammen', kjønnlig: 'Fysiske klemmer og berøring', gaver: 'Å få gaver' },
  highPriority: { karriere: 'Karriere og mål', familie: 'Familie og nære relasjoner', venner: 'Venner og fellesskap', 'personlig-vekst': 'Personlig vekst og læring', frihet: 'Frihet og selvstendighet', spirituell: 'Spirituell/religiøst livssyn' },
  lowPriority: { materiell: 'Materielle ting', status: 'Status og anerkjennelse', 'sosial-media': 'Sosialt mediabruk', sport: 'Sport og konkurranse', underholdning: 'Underholdning og kos' },
  // Verdiene er de faktiske alternativ-verdiene fra stegene (ACT O1:
  // «rolig»/«ensom» er de lagrede verdiene — kartleggingen ble feil).
  desiredLifestyle: { roleg: 'Rolig og forutsigbart', eventyr: 'Eventyr og endring', balansert: 'Balansen mellom ro og aktivitet', skapende: 'Skapende og kunstnerisk' },
  undesiredLifestyle: { ensam: 'Alene og isolert', stress: 'Konstant stress', rutine: 'Monoton rutine', 'økonomisk-utrygg': 'Økonomisk utrygghet' },
  closenessNeed: { 'mye tid sammen hver dag': 'Mye samvær', 'balansert samvær': 'Balansert', 'mye egen rom og autonomi': 'Mye egenrom' },
  neverCrossBoundary: { respekt: 'Respekt for meg som person', 'tid-aleine': 'Tid alene hver dag', venner: 'Kontakt med venner/familie', selvstende: 'Eget rom og selvstendighet', sandhet: 'Ærlighet og sannferdighet' },
  relationshipSeeking: { 'dyp vennskap': 'Dyp vennskap', dating: 'Dating', 'langvarig parforhold': 'Langvarig parforhold', 'åpen uforpliktende': 'Åpen & uforpliktende' },
  // LIVSSTIL-2026 (D-5): konverterte fritekstfelt → valg-verdier
  energyGiver: { natur: 'Natur og frisk luft', 'dype-samtaler': 'Dype samtaler', sosialt: 'Sosialt selskap', 'kreativt-arbeid': 'Kreativt arbeid', bevegelse: 'Bevegelse', 'god-musikk': 'God musikk', 'familie-og-venner': 'Familie og venner', 'meningsfullt-arbeid': 'Meningsfullt arbeid' },
  energyDrainer: { støy: 'Støy og trange rom', konflikt: 'Konflikt og skrik', ubestemthet: 'Ubestemthet og venting', 'store-folkmengder': 'Store folkemengder', 'overfladiske-samtaler': 'Overfladiske samtaler', arbeidspress: 'Arbeidspress', 'skjerm-tid': 'For mye skjerm' },
  pressureReact: { 'trekker-meg-tilbake': 'Trekker meg tilbake litt', 'prater-meg-igjennom': 'Prater meg gjennom det', 'blir-irritabel': 'Blir litt irritabel', 'blir-handlingsparat': 'Blir handlingsparat' },
  safetyNeed: { aerlighet: 'Ærlighet', konsekvens: 'Konsekvens', 'rom-for-egen-tempo': 'Rom for eget tempo', 'fysisk-naerhet': 'Fysisk nærhet', 'praktisk-omsorg': 'Praktisk omsorg', humor: 'Humor' },
  insecurityTrigger: { 'endringer-uten-avtale': 'Endringer uten avtale', taushet: 'Taushet og stille', avstand: 'Avstand', ubestemthet: 'Ubestemthet', 'manglende-oppmerksomhet': 'Manglende oppmerksomhet' },
  sadnessNeed: { 'bare-tilstedevaerelse': 'Bare tilstedeværelse', 'trygge-ord': 'Trygge ord', 'praktisk-hjelp': 'Praktisk hjelp', 'tid-aleine': 'Tid alene', humor: 'Humor' },
  stressNeed: { 'rom-til-a-roe-meg': 'Rom til å roe meg', 'praktisk-hjelp': 'Praktisk hjelp', 'a-snakke-det-gjennom': 'Å snakke det gjennom', 'fysisk-naerhet': 'Fysisk nærhet' },
  closenessBuilder: { 'dype-samtaler': 'Dype samtaler', 'felles-aktivitet': 'Felles aktivitet', 'fysisk-naerhet': 'Fysisk nærhet', 'smaa-ritualer': 'Små ritualer' },
  distanceCreator: { stress: 'Stress og press', 'manglende-oppmerksomhet': 'Manglende oppmerksomhet', konflikt: 'Konflikt', 'taushet-eller-avstand': 'Taushet eller avstand' },
  futureVision: { 'ro-og-stabilitet': 'Ro og stabilitet', 'vekst-og-maal': 'Vekst og mål', 'familie-og-hjem': 'Familie og hjem', 'frihet-og-reiser': 'Frihet og reiser' },
  experienceAlone: { reiser: 'Reiser', natur: 'Natur', 'kreativt-arbeid': 'Kreativt arbeid', hobier: 'Hobbyer' },
  experienceTogether: { 'hverdags-ritualer': 'Hverdags-ritualer', 'reiser-sammen': 'Reiser sammen', 'bygge-noe-felles': 'Bygge noe felles', 'kos-og-fellesskap': 'Kos og fellesskap' },
  intimacySafety: { tydelighet: 'Tydelighet', 'langsomt-tempo': 'Langsommere tempo', 'ord-for-naerhet': 'Ord før nærhet', 'trygghet-hjemme': 'Trygghet hjemme' },
  comfortableWith: { 'stille-samtaler': 'Stille samtaler', 'fysisk-naerhet': 'Fysisk nærhet', 'dele-hverdager': 'Dele hverdager', svarbarhet: 'Sårbarhet' },
  nearerType: { 'ro-og-stille': 'Ro og stille', 'fysisk-kontakt': 'Fysisk kontakt', 'dype-samtaler': 'Dype samtaler', 'felles-aktivitet': 'Felles aktivitet' },
  needsTime: { 'lite-tid': 'Lite tid', 'noen-dager': 'Noen dager', 'noen-uker': 'Noen uker', 'eget-tempo': 'Mitt eget tempo' },
  // LIVSSTIL-2026 (D-2): nye hverdagsvalg
  arbeidsrytme: { kontorbundet: 'Kontorbundet', hybrid: 'Hybrid', hjemmearbeid: 'Hjemmearbeid', skift: 'Skiftarbeid' },
  bosted: { sentrum: 'Sentrum', forstad: 'Forstad', land: 'Land', ubestemt: 'Ikke bestemt ennå' },
  reiser: { 'fjell-bobil': 'Fjell og bobil', utlandet: 'Utlandet', 'naturen-naermest': 'Naturen nærmest', 'lite-reising': 'Lite reising' },
  dyr: { hund: 'Hund', katt: 'Katt', 'annet-dyr': 'Annet kjæledyr', ingen: 'Ingen dyr' },
  skjerm: { mye: 'Mye', moderat: 'Moderat', 'vil-skru-ned': 'Vil gjerne skru ned', ubestemt: 'Ikke bestemt ennå' },
  bil: { 'full-el': 'Full lader', phev: 'Plug-in hybrid', bensin: 'Bensin', diesel: 'Diesel', 'esykkel-ingen': 'Elsykkel / kollektiv' },
  kosthold: { 'spiser-koett': 'Spiser det meste', fleksitar: 'Mest plantebasert', vegetar: 'Vegetar', vegan: 'Vegan', fisk: 'Fokus på fisk' },
  klima: { 'veldig-viktig': 'Veldig viktig', viktig: 'Viktig', 'ikke-stor-sak': 'Ikke en stor sak' },
  alkohol: { aldri: 'Aldri', sjelden: 'Sjelden', helligdager: 'Ved helligdager', ofte: 'Ofte' },
  aktivitet: { gym: 'Gym og trening', 'lop-turer': 'Løping og turer', lagidrett: 'Lagidrett', 'natur-fritid': 'Natur og fritid', lite: 'Tar det rolig' },
};

/** Viser (fler)val med lesbare etiketter: «Roker-av-og-til,Snuser» → «Røyker av og til, Snuser». */
const fmt = (f: string) => (d: Record<string, unknown>) => {
  const v = d[f];
  if (v === undefined || v === null || String(v).trim() === '') return '—';
  const map = LABELS[f];
  return String(v)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => (map ? map[s] ?? s : s))
    .join(', ');
};

// LIVSSTIL-2026 (D-4): viktighetsnivået for vektmodell-feltene.
const viktSuffix = (f: string) => (d: Record<string, unknown>) => {
  const v = d[f];
  if (v === 'ma-stemme') return ' — må stemme';
  if (v === 'bor-stemme') return ' — bør stemme';
  return '';
};

/** Verdi + vekt-suffiks for D-4-feltene; '—' hvis selve feltet er tomt. */
const gatedVal = (f: string, vf: string) => (d: Record<string, unknown>) =>
  d[f] ? `${fmt(f)(d)}${viktSuffix(vf)(d)}` : '—';

/**
 * D-4: de feltene der «Må stemme» faktisk blokkerer i matchingmotoren
 * (lib/matching/dealbreaker.ts → checkLifestyle2026). Kun disse hører
 * hjemme i «Det som må stemme».
 */
const MA_STEMME_FIELDS: Array<{ key: string; label: string }> = [
  { key: 'arbeidsrytme', label: 'Arbeidsrytme' },
  { key: 'bosted', label: 'Bosted' },
  { key: 'reiser', label: 'Reiser' },
  { key: 'dyr', label: 'Dyr' },
  { key: 'skjerm', label: 'Skjerm' },
  { key: 'bil', label: 'Bil' },
  { key: 'kosthold', label: 'Kosthold' },
  { key: 'alkohol', label: 'Alkohol' },
  { key: 'aktivitet', label: 'Aktivitet' },
];

export default function Step9Oppsummering({ data, onNext, goToStep }: Props) {
  // Én kilde for aldersspennet: CANONICAL feltene agePrefMin/agePrefMax.
  const ageRange = formatAgePrefRange(data['agePrefMin'], data['agePrefMax']);

  const religionOpen = val('religionOpen', '')(data) === '1';
  const acceptedLabel = religionOpen
    ? 'Åpen for alle religioner og livssyn'
    : fmt('acceptedReligions')(data);

  const hardL2026 = MA_STEMME_FIELDS.filter(
    (f) => data[f.key] && data[`${f.key}Viktig`] === 'ma-stemme',
  );

  const Field = ({
    label,
    value,
    showIf,
    testId,
  }: {
    label: string;
    value: string;
    showIf?: boolean;
    testId?: string;
  }) => {
    if (showIf && !value) return null;
    return (
      <div className="flex justify-between gap-4" data-testid={testId}>
        <span className="text-left" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>{label}</span>
        <span className="text-right" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>{value || '—'}</span>
      </div>
    );
  };

  const Section = ({
    title,
    editStep,
    children,
  }: {
    title: string;
    editStep?: number;
    children: React.ReactNode;
  }) => (
    <section
      className="rounded-2xl p-6 border"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,175,55,0.2)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold" style={{ color: '#D4AF37' }}>{title}</h2>
        {editStep !== undefined && (
          <button
            type="button"
            onClick={() => goToStep(editStep)}
            data-testid={`ob-summary-edit-${editStep}`}
            className="text-[13px] font-medium"
            style={{ color: OB.gold }}
          >
            Endre
          </button>
        )}
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );

  const name = val('identityName', '')(data);
  const age = val('age', '')(data);
  const height = val('height', '')(data);
  const city = val('city', '')(data);
  const distance = val('distancePref', '')(data);

  return (
    <OnboardingSlide
      title="Se over før du går videre"
      subtitle="Her ser du de viktigste valgene dine. Gå tilbake hvis du vil endre noe før profilen fullføres."
      slideIndex={11}
      totalSlides={13}
      accentColor={OB.section.summary}
    >
      <div className="space-y-6">
        {/* A. OM DEG */}
        <Section title="Om deg" editStep={0}>
          <Field label="Navn" value={name} testId="ob-summary-name" />
          <Field label="Alder" value={age ? `${age} år` : '—'} />
          <Field label="Kjønn" value={val('gender')(data)} />
          <Field label="Bosted" value={city} showIf />
          <Field label="Type relasjon" value={fmt('relationshipSeeking')(data)} showIf />
          <Field label="Barn" value={fmt('children')(data)} showIf />
          <Field label="Røyking/snus" value={fmt('smoking')(data)} showIf />
          <Field label="Høyde" value={height ? `${height} cm` : '—'} showIf />
        </Section>

        {/* B. HVEM DU ØNSKER Å MØTE */}
        <Section title="Hvem du ønsker å møte" editStep={0}>
          <Field label="Hvem du søker" value={val('seekingGender')(data)} />
          <Field label="Aldersspenn" value={ageRange} testId="ob-summary-age" />
          <Field label="Maks avstand" value={distance ? `${distance} km` : '—'} showIf />
        </Section>

        {/* C. DET SOM MÅ STEMME — kun aktive hard boundaries */}
        <Section title="Det som må stemme">
          <Field label="Alder, avstand og kjønnsvalg" value="Gjelder alltid" />
          <Field
            label="Religion/livssyn"
            value={religionOpen ? 'Ikke en grense — du er åpen for alle' : 'Din akseptliste gjelder'}
          />
          <Field label="Barn" value={fmt('wantChildren')(data)} showIf />
          {hardL2026.map((f) => (
            <Field
              key={f.key}
              label={f.label}
              value={`${fmt(f.key)(data)} — må stemme`}
            />
          ))}
        </Section>

        {/* D. LIVSSYN / RELIGION — kun brukerens eget valg + status */}
        <Section title="Livssyn og religion" editStep={0}>
          <Field label="Religion/livssyn" value={fmt('religion')(data)} showIf />
          <Field label="Åpen for" value={acceptedLabel} showIf />
        </Section>

        {/* E. PROFILSTATUS — ærlig: ikke alle svar vises */}
        <Section title="Profilstatus">
          <Field label="Obligatoriske deler" value="Fullført" />
          <Field label="Personlighet og samspill (49 spørsmål)" value="Fullført" />
          <Field label="Valgfrie deler" value="Kan være utelatt" />
          <p className="text-[12px] leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
            Denne siden viser de viktigste valgene dine — ikke samtlige svar.
            Du kan endre profilen din senere fra venterommet.
          </p>
        </Section>

        {/* F. NESTE STEG */}
        <Section title="Neste steg">
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
            Når du fullfører, settes du i kø. Vi kobler natt til lørdag.
            Finner vi ingen som passer godt nok, venter du til neste runde.
          </p>
        </Section>

        {/* ── Detaljer — resten av svarene, organisert ── */}

        {/* Personlighet */}
        <Section title="Personlighet" editStep={1}>
          <Field label="Gir deg energi" value={fmt('energyGiver')(data)} showIf />
          <Field label="Tappar energi" value={fmt('energyDrainer')(data)} showIf />
          <Field label="Under press" value={fmt('pressureReact')(data)} showIf />
        </Section>

        {/* Hverdagsvalg (LIVSSTIL-2026) — steg 3 og steg 6 */}
        <Section title="Hverdagsvalg — livssituasjon" editStep={2}>
          <Field label="Arbeidsrytme" value={gatedVal('arbeidsrytme', 'arbeidsrytmeViktig')(data)} showIf />
          <Field label="Bostedstype" value={gatedVal('bosted', 'bostedViktig')(data)} showIf />
          <Field label="Reiser" value={gatedVal('reiser', 'reiserViktig')(data)} showIf />
          <Field label="Dyr" value={gatedVal('dyr', 'dyrViktig')(data)} showIf />
          <Field label="Skjerm" value={gatedVal('skjerm', 'skjermViktig')(data)} showIf />
        </Section>

        <Section title="Hverdagsvalg — livsstil" editStep={5}>
          <Field label="Bil" value={gatedVal('bil', 'bilViktig')(data)} showIf />
          <Field label="Kosthold" value={gatedVal('kosthold', 'kostholdViktig')(data)} showIf />
          <Field label="Klima" value={fmt('klima')(data)} showIf />
          <Field label="Alkohol" value={gatedVal('alkohol', 'alkoholViktig')(data)} showIf />
          <Field label="Aktivitet" value={gatedVal('aktivitet', 'aktivitetViktig')(data)} showIf />
        </Section>

        {/* Tilknytning */}
        <Section title="Tilknytning og trygghet" editStep={3}>
          <Field label="Trygghet" value={fmt('safetyNeed')(data)} showIf />
          <Field label="Usikkerhetsutløser" value={fmt('insecurityTrigger')(data)} showIf />
          <Field label="Når du er lei" value={fmt('sadnessNeed')(data)} showIf />
          <Field label="Når du er stresset" value={fmt('stressNeed')(data)} showIf />
        </Section>

        {/* Kjærlighetsspråk */}
        <Section title="Kjærlighetsspråk og nærhet" editStep={4}>
          <Field label="Viser kjærlighet" value={fmt('loveGive')(data)} showIf />
          <Field label="Mottar kjærlighet" value={fmt('loveReceive')(data)} showIf />
          <Field label="Bygger nærhet" value={fmt('closenessBuilder')(data)} showIf />
          <Field label="Skaper avstand" value={fmt('distanceCreator')(data)} showIf />
        </Section>

        {/* Livsstil & verdier */}
        <Section title="Livsstil og verdier" editStep={5}>
          <Field label="Høyeste prioritet" value={fmt('highPriority')(data)} showIf />
        </Section>

        {/* Relasjonsstil */}
        <Section title="Relasjonsstil" editStep={6}>
          <Field label="Søker" value={fmt('relationshipSeeking')(data)} showIf />
          <Field label="Nærhetsbehov" value={fmt('closenessNeed')(data)} showIf />
        </Section>

        {/* Framtid */}
        <Section title="Fremtid og visjon" editStep={7}>
          <Field label="Din fremtidsvisjon" value={fmt('futureVision')(data)} showIf />
          <Field label="Oppleve alene" value={fmt('experienceAlone')(data)} showIf />
          <Field label="Oppleve sammen" value={fmt('experienceTogether')(data)} showIf />
        </Section>

        {/* Grenser */}
        <Section title="Grenser og behov" editStep={9}>
          <Field label="Grenser" value={fmt('neverCrossBoundary')(data)} showIf />
          <Field label="Forstå partnerens grenser" value={val('understandPartnersBoundaries')(data)} showIf />
        </Section>

        {/* CTA */}
        <div className="mt-8 space-y-4">
          <BackButton onClick={() => goToStep(10)} />
          <PremiumCTAButton onClick={onNext} label="Fortsett" fullWidth />
        </div>
      </div>
    </OnboardingSlide>
  );
}
