/**
 * Tosom — Steg 9: Oppsummering (Premium rebuild 2026 — Fase 4)
 * 
 * Menneskeleselig oppsummering av hele profilen, gruppert i seksjoner med gull-rammer.
 */

'use client';

import { OnboardingSlide } from '@/app/onboarding/components/OnboardingSlide';
import { OB } from '@/app/onboarding/theme';
import { PremiumCTAButton } from '@/app/onboarding/components/PremiumCTAButton';
import { BackButton } from '@/components/onboarding/BackButton';

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
const num = (f: string, fb = 0) => (d: Record<string, unknown>) => {
  const v = d[f];
  return v !== undefined && v !== null ? Number(v) : fb;
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
  children: { 'Har-små-barn': 'Har små barn', 'Har-barn': 'Har barn', 'Har-vaksen-barn': 'Har voksne barn', 'Har-ikke-barn': 'Har ikke barn' },
  wantChildren: { Ja: 'Ja', Usikker: 'Usikker', Nei: 'Nei' },
  workType: { 'anstatt-fulltid': 'Ansett på fulltid', 'anstatt-deltid': 'Ansett på deltid', 'egen-næring': 'Egen næringsdrivende', studier: 'Studier', frivillig: 'Frivillig arbeid', 'husmor-husmann': 'Husmor / Husmann', pensjonist: 'Pensjonist', permisjon: 'Permisjon', nav: 'Ungdomskontakt / NAV', annet: 'Annet' },
  housingType: { leilighet: 'Leilighet', hus: 'Hus (eiendom)', 'delt-bo': 'Delt bo', kollektiv: 'Kollektiv', studentbolig: 'Studentbolig', 'foreldres-bo': 'Foreldres bo', annet: 'Annet' },
  economicStability: { stabil: 'Stabil økonomi', dekker: 'Nøye penninger dekker utgifter', varierer: 'Varierer fra måned til måned', sparing: 'Prioriterer sparing aktivt', stabilitet: 'Fokus på stabilitet, ikke overskudd' },
  loveGive: { ord: 'Ord og ros', tjenester: 'Gjør ting for andre', tid: 'Kvalitetstid sammen', kjønnlig: 'Fysiske klemmer og berøring', gaver: 'Å gi gaver' },
  loveReceive: { ord: 'Ord og ros', tjenester: 'Gjør ting for meg', tid: 'Kvalitetstid sammen', kjønnlig: 'Fysiske klemmer og berøring', gaver: 'Å få gaver' },
  highPriority: { karriere: 'Karriere og mål', familie: 'Familie og nære relasjoner', venner: 'Venner og fellesskap', 'personlig-vekst': 'Personlig vekst og læring', frihet: 'Frihet og selvstendighet', spirituell: 'Spirituell/religiøst livssyn' },
  lowPriority: { materiell: 'Materielle ting', status: 'Status og anerkjennelse', 'sosial-media': 'Sosialt mediabruk', sport: 'Sport og konkurranse', underholdning: 'Underholdning og kos' },
  desiredLifestyle: { roleg: 'Rolig og forutsigbart', eventyr: 'Eventyr og endring', balansert: 'Balansen mellom ro og aktivitet', skapende: 'Skapende og kunstnerisk' },
  undesiredLifestyle: { ensam: 'Alene og isolert', stress: 'Konstant stress', rutine: 'Monoton rutine', 'økonomisk-utrygg': 'Økonomisk utrygghet' },
  closenessNeed: { 'mye tid sammen hver dag': 'Mye samvær', 'balansert samvær': 'Balansert', 'mye egen rom og autonomi': 'Mye egenrom' },
  neverCrossBoundary: { respekt: 'Respekt for meg som person', 'tid-aleine': 'Tid alene hver dag', venner: 'Kontakt med venner/familie', selvstende: 'Eget rom og selvstendighet', sandhet: 'Ærlighet og sannferdighet' },
  relationshipSeeking: { 'dyp vennskap': 'Dyp vennskap', dating: 'Dating', 'langvarig parforhold': 'Langvarig parforhold', 'åpen uforpliktende': 'Åpen & uforpliktende' },
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

export default function Step9Oppsummering({ data, onNext, goToStep }: Props) {
  // Helper-funksjon for å gjere felt synlege bare dersom dei har verdi
  const Field = ({ label, value, showIf }: { label: string; value: string; showIf?: boolean }) => {
    if (showIf && !value) return null;
    return (
      <div className="flex justify-between">
        <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>{label}</span>
        <span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>{value || '—'}</span>
      </div>
    );
  };

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="rounded-2xl p-6 border" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,175,55,0.2)' }}>
      <h2 className="text-xl font-semibold mb-4" style={{ color: '#D4AF37' }}>{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );

  const getName = val('identityName');
  const getAge = val('age');
  const getHeight = val('height');
  const getDistance = num('distancePref', 50);
  const getMinAge = num('minAge', 21);

  const getMaxAge = num('maxAge', 40);

  return (
    <OnboardingSlide
      title="Oppsummering"
      subtitle="Se over det du har delt. Du kan endre alt senere."
       guidingText="Dette er hele profilen din — rolig, trygg og komplett."
      slideIndex={11}
      totalSlides={13}
      accentColor={OB.section.summary}
    >
      <div className="space-y-6">
        {/* Grunnprofil */}
        <Section title="Grunnprofil">
          <Field label="Navn" value={getName(data)} />
          <Field label="Alder" value={getAge(data) !== '—' ? `${getAge(data)} år` : '—'} />
          <Field label="Kjønn" value={val('gender')(data)} />
          <Field label="Søker" value={val('seekingGender')(data)} />
          <Field label="Bosted" value={val('city')(data)} />
          <Field label="Høyde" value={getHeight(data) !== '—' ? `${getHeight(data)} cm` : '—'} showIf />
          <Field label="Kroppstype" value={val('bodyType')(data)} showIf />
          <Field label="Livsstil" value={fmt('lifestyle')(data)} showIf />
          <Field label="Røyking/snus" value={fmt('smoking')(data)} showIf />
          <Field label="Barn" value={fmt('children')(data)} showIf />
          <Field label="Ønsker barn" value={fmt('wantChildren')(data)} showIf />
        </Section>

        {/* Livsstil & verdier */}
        <Section title="Livsstil & verdier">
          <Field label="Høyeste prioritet" value={fmt('highPriority')(data)} showIf />
          <Field label="God hverdag" value={val('goodEveryday')(data)} showIf />
           <Field label="Ønsket livsstil" value={fmt('desiredLifestyle')(data)} showIf />
        </Section>

        {/* Avstand & alder */}
        <Section title="Avstand & alderspref">
          <Field label="Maks avstand" value={`${getDistance(data)} km`} />
          <Field label="Aldersintervall" value={`${getMinAge(data)}–${getMaxAge(data)} år`} />
        </Section>

        {/* Personlighet */}
        <Section title="Personlighet">
          <Field label="Om deg" value={val('selfDesc')(data)} showIf />
          <Field label="Gir deg energi" value={val('energyGiver')(data)} showIf />
          <Field label="Tappar energi" value={val('energyDrainer')(data)} showIf />
          <Field label="Under press" value={val('pressureReact')(data)} showIf />
          <Field label="Quirk" value={val('quirk')(data)} showIf />
        </Section>

        {/* Livssituasjon */}
        <Section title="Livssituasjon">
          <Field label="Arbeid" value={fmt('workType')(data)} showIf />
          <Field label="Boetype" value={fmt('housingType')(data)} showIf />
          <Field label="Husholdning" value={val('householdSize')(data)} showIf />
          <Field label="Økonomi" value={fmt('economicStability')(data)} showIf />
          <Field label="Ansvar" value={val('responsibilities')(data)} showIf />
           <Field label="Hverdagsrutine" value={val('dailyRoutine')(data)} showIf />
        </Section>

        {/* Tilknytning */}
        <Section title="Tilknytning & trygghet">
          <Field label="Trygghet" value={val('safetyNeed')(data)} showIf />
           <Field label="Usikkerhetsutløser" value={val('insecurityTrigger')(data)} showIf />
           <Field label="Når du er lei" value={val('sadnessNeed')(data)} showIf />
           <Field label="Når du er stresset" value={val('stressNeed')(data)} showIf />
          <Field label="Viktig grense" value={val('importantBoundary')(data)} showIf />
        </Section>

        {/* Kjærlighetsspråk */}
        <Section title="Kjærlighetsspråk & nærhet">
          <Field label="Viser kjærlighet" value={fmt('loveGive')(data)} showIf />
          <Field label="Mottar kjærlighet" value={fmt('loveReceive')(data)} showIf />
          <Field label="Bygger nærhet" value={val('closenessBuilder')(data)} showIf />
          <Field label="Skaper avstand" value={val('distanceCreator')(data)} showIf />
           <Field label="Liten ting som betyr mye" value={val('smallThing')(data)} showIf />
        </Section>

        {/* Relasjonsstil */}
        <Section title="Relasjonsstil">
          <Field label="Søker" value={fmt('relationshipSeeking')(data)} showIf />
          <Field label="Nærhetsbehov" value={fmt('closenessNeed')(data)} showIf />
           <Field label="Selvstendighet vs fellesskap" value={val('independenceBalance')(data)} showIf />
        </Section>

        {/* Framtid */}
        <Section title="Fremtid og visjon">
          <Field label="Din fremtidsvisjon" value={val('futureVision')(data)} showIf />
          <Field label="Din største drøm" value={val('dreamGoal')(data)} showIf />
          <Field label="Bygge sammen" value={val('buildTogether')(data)} showIf />
          <Field label="Oppleve alene" value={val('experienceAlone')(data)} showIf />
          <Field label="Oppleve sammen" value={val('experienceTogether')(data)} showIf />
        </Section>

        {/* Humor */}
        <Section title="Humor & personlighet">
          <Field label="Får deg til å le" value={val('laughterTrigger')(data)} showIf />
          <Field label="Quirky vane" value={val('quirkyHabit')(data)} showIf />
          <Field label="Guilty pleasure" value={val('guiltyPleasure')(data)} showIf />
          <Field label="Helt deg" value={val('totallyYou')(data)} showIf />
          <Field label="Partneren ville le av" value={val('partnerWouldLaugh')(data)} showIf />
        </Section>

        {/* Grenser */}
        <Section title="Grenser & behov">
          <Field label="Aldri krysse" value={fmt('neverCrossBoundary')(data)} showIf />
           <Field label="Forstå partnerens grenser" value={val('understandPartnersBoundaries')(data)} showIf />
           <Field label="Dine avgrensninger" value={val('limitations')(data)} showIf />
          <Field label="Partner må forstå" value={val('partnerMustUnderstand')(data)} showIf />
        </Section>

        {/* Moden nysgjerrighet */}
        <Section title="Moden nysgjerrighet">
          <Field label="Intimitet trygg" value={val('intimacySafety')(data)} showIf />
          <Field label="Komfortabel med" value={val('comfortableWith')(data)} showIf />
          <Field label="Personlig grense" value={val('boundary')(data)} showIf />
          <Field label="Nærhetstype" value={val('nearerType')(data)} showIf />
          <Field label="Treng tid til" value={val('needsTime')(data)} showIf />
        </Section>

        {/* CTA */}
        <div className="mt-8 space-y-4">
           <p className="text-center text-xs" style={{ color: 'rgba(255, 255, 255, 0.3)' }}>
            Du har fullført hele profilen din! Nå er det klart for matching.
          </p>
          <BackButton onClick={() => goToStep(10)} />
          <PremiumCTAButton onClick={onNext} label="Fortsett" fullWidth />
        </div>
      </div>
    </OnboardingSlide>
  );
}