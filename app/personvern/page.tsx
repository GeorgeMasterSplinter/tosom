'use client';

/**
 * Tosom — Personvernerklæring
 *
 * Bygget på faktisk datamodell i prisma/schema.prisma, ikke på antakelser.
 * Versjonert via config/legal.ts.
 *
 * ⚠️ Utkast til advokatgjennomgang. Se docs/JURIDISK-GRUNNLAG-v1.0.md —
 * særlig A-2 (særlige kategorier, art. 9), A-3 (automatisert avgjørelse,
 * art. 22) og A-5 (sletting vs. dokumentasjonsplikt).
 *
 * TODO før publisering: bekreft lokasjon for hver databehandler i §7.
 */

import Link from 'next/link';
import { Footer } from '@/components/ui/layout/Footer';
import { ToSomSection } from '@/components/ui/system';
import { color, typographyToStyle } from '@/config/design-tokens';
import { COMPANY, companyIdentification, companyFooterLine, PRIVACY_VERSION, PRIVACY_UPDATED } from '@/config/legal';

/* ========================
   INNHOLD
   ======================== */

interface Row {
  cells: string[];
}

interface Section {
  id: string;
  title: string;
  paragraphs?: string[];
  list?: string[];
  table?: { headers: string[]; rows: Row[] };
  callout?: string;
}

const sections: Section[] = [
  {
    id: '1',
    title: 'Kort fortalt',
    paragraphs: [
      'Tosom er bygget rundt et enkelt prinsipp: profilen din er privat. Den vises aldri offentlig, og den selges aldri videre.',
      'Vi samler inn en god del om deg — fordi matching krever det. Til gjengjeld bruker vi det bare til å finne én person å koble deg med, og vi sletter det når du er ferdig.',
      'Denne erklæringen forteller nøyaktig hva vi lagrer, hvorfor, hvor lenge, og hva du kan kreve av oss.',
    ],
  },
  {
    id: '2',
    title: 'Hvem er behandlingsansvarlig',
    paragraphs: [
      `${companyIdentification()} er behandlingsansvarlig for personopplysningene dine.`,
      `Har du spørsmål om personvern, kan du kontakte oss på ${COMPANY.email}. Vi svarer så raskt vi kan, og senest innen 30 dager.`,
    ],
  },
  {
    id: '3',
    title: 'Hva vi samler inn',
    paragraphs: [
      'Vi deler opplysningene i fire grupper.',
    ],
    table: {
      headers: ['Gruppe', 'Hva det er', 'Grunnlag', 'Oppbevaring'],
      rows: [
        {
          cells: [
            'Konto',
            'E-postadresse, navn, telefonnummer, alder og identitet verifisert gjennom Vipps',
            'Avtale (art. 6.1.b)',
            'Til kontoen slettes',
          ],
        },
        {
          cells: [
            'Profil',
            'Alder, bosted, bilde, presentasjon, interesser, livssituasjon, livsstil, personlighet, relasjonsstil, kommunikasjonsmåte, framtidsønsker',
            'Avtale (art. 6.1.b)',
            'Til kontoen slettes',
          ],
        },
        {
          cells: [
            'Sensitive opplysninger',
            'Se punkt 4 nedenfor',
            'Uttrykkelig samtykke (art. 9.2.a)',
            'Til kontoen slettes eller samtykket trekkes',
          ],
        },
        {
          cells: [
            'Bruk',
            'Meldinger, bilder du deler, framdrift i reisen, innlogginger, tekniske logger',
            'Avtale og berettiget interesse (art. 6.1.b og f)',
            'Til reisen avsluttes. Logger inntil 90 dager.',
          ],
        },
      ],
    },
  },
  {
    id: '4',
    title: 'Sensitive opplysninger',
    callout:
      'Dette er den viktigste delen av erklæringen. Les den før du fullfører onboarding.',
    paragraphs: [
      'For å kunne koble deg med noen som passer, spør vi om ting som er personlige. Noen av dem regnes som særlige kategorier av personopplysninger etter personvernforordningen artikkel 9, og har ekstra sterkt vern.',
      'Dette gjelder opplysninger som kan si noe om:',
    ],
    list: [
      'Synet ditt på nærhet og intimitet',
      'Følelsesmessige behov, som kan si noe om psykisk helse',
      'Grenser og tidligere erfaringer, som kan berøre vanskelige hendelser',
      'Trygghetsnivå og livssituasjon',
      'Religiøs overbevisning, dersom du velger å oppgi det',
      'Kjønn og hvem du søker, som kan si noe om seksuell orientering',
    ],
  },
  {
    id: '5',
    title: 'Om samtykket ditt',
    paragraphs: [
      'Sensitive opplysninger behandles kun hvis du gir uttrykkelig samtykke. Du får spørsmål om dette særskilt, ikke som en del av vilkårene.',
      'Du kan la være å svare på disse spørsmålene. Da blir grunnlaget for koblingen tynnere, men du kan fortsatt bruke Tosom.',
      'Du kan trekke samtykket når som helst under Innstillinger. Vi sletter da opplysningene, og de brukes ikke i framtidige koblinger. Det påvirker ikke lovligheten av behandlingen fram til du trakk det.',
      'Opplysningene leses aldri av oss manuelt, deles aldri med andre brukere, og brukes utelukkende av matching-motoren.',
    ],
  },
  {
    id: '6',
    title: 'Hvordan koblingen skjer',
    paragraphs: [
      'Matching-motoren er den eneste automatiserte funksjonen i Tosom. Den leser profilen din og finner én person å koble deg med.',
      'Vurderingen bygger på verdier, livssituasjon, relasjonsstil og de opplysningene du har delt. Bilder og utseende brukes aldri.',
      'Du får aldri en tallskår, og du blir aldri rangert mot andre. Du får heller ikke valget mellom flere personer — du får én kobling om gangen.',
      'Er du uenig i en kobling, kan du avslutte reisen og stille deg i kø til neste runde. Du kan også kontakte oss, så ser vi på saken manuelt.',
    ],
  },
  {
    id: '7',
    title: 'Hvem vi deler med',
    paragraphs: [
      'Vi selger aldri opplysninger, og vi bruker dem ikke til reklame.',
      'For å drive tjenesten bruker vi noen underleverandører. Alle er databehandlere for oss, og de har ikke lov til å bruke opplysningene til egne formål.',
    ],
    table: {
      headers: ['Leverandør', 'Hva de behandler', 'Formål'],
      rows: [
        { cells: ['Vipps', 'Identitet og alder', 'Innlogging og aldersverifisering'] },
        { cells: ['Databaseleverandør', 'All lagret data', 'Drift av databasen'] },
        { cells: ['Pusher', 'Meldinger i sanntid', 'Levere chat uten forsinkelse'] },
        { cells: ['Cloudflare R2', 'Bilder du deler', 'Sikker lagring av bilder'] },
        { cells: ['Sentry', 'Tekniske feilmeldinger', 'Finne og rette feil'] },
        { cells: ['Upstash', 'IP-adresse midlertidig', 'Hindre misbruk og overbelastning'] },
        { cells: ['E-postleverandør', 'E-postadresse', 'Sende innloggingslenker og varsler'] },
      ],
    },
  },
  {
    id: '8',
    title: 'Hvor opplysningene lagres',
    paragraphs: [
      'Vi tilstreber at data lagres innenfor EU eller EØS.',
      'Der en leverandør behandler opplysninger utenfor EØS, skjer det på grunnlag av EU-kommisjonens standard personvernbestemmelser eller en gyldig beslutning om tilstrekkelig beskyttelsesnivå.',
      `Vil du vite nøyaktig hvor en bestemt tjeneste lagrer data, spør oss på ${COMPANY.email}, så svarer vi konkret.`,
    ],
  },
  {
    id: '9',
    title: 'Hvor lenge vi lagrer',
    table: {
      headers: ['Hva', 'Hvor lenge'],
      rows: [
        { cells: ['Konto og profil', 'Til du sletter kontoen'] },
        { cells: ['Samtaler og bilder', 'Til reisen avsluttes, deretter slettet'] },
        { cells: ['Sensitive opplysninger', 'Til kontoen slettes eller samtykket trekkes'] },
        { cells: ['Tekniske logger', 'Inntil 90 dager'] },
        { cells: ['Rapporter om alvorlige forhold', 'Inntil 3 år, i anonymisert form'] },
        { cells: ['Regnskapsopplysninger ved betaling', '5 år, som bokføringsloven krever'] },
      ],
    },
    paragraphs: [
      'Velger dere «vi fant hverandre», slettes begge kontoene og hele samtalen umiddelbart.',
      'Ett unntak: har noen rapportert et alvorlig forhold, beholder vi rapporten selv om kontoen slettes. Det er nødvendig for å kunne håndtere saken og beskytte andre brukere. Rapporten inneholder da ikke mer enn det som trengs.',
    ],
  },
  {
    id: '10',
    title: 'Rettighetene dine',
    paragraphs: [
      'Du har disse rettighetene, og du trenger ikke begrunne hvorfor du bruker dem:',
    ],
    list: [
      'Innsyn — få vite hva vi har lagret om deg',
      'Kopi — få opplysningene tilsendt i et lesbart format',
      'Retting — få rettet noe som er feil',
      'Sletting — få alt slettet',
      'Begrensning — be oss stanse bruken midlertidig',
      'Innsigelse — protestere mot behandling basert på berettiget interesse',
      'Dataportabilitet — få opplysningene i et format du kan ta med deg',
      'Trekke samtykke — når som helst, uten at det får følger for deg',
    ],
  },
  {
    id: '11',
    title: 'Slik bruker du rettighetene',
    paragraphs: [
      'Det meste ordner du selv under Innstillinger: se profilen, laste ned en kopi, rette opplysninger, trekke samtykke eller slette kontoen.',
      `Trenger du hjelp, skriv til ${COMPANY.email}. Vi svarer innen 30 dager. Er saken omfattende, sier vi fra underveis.`,
      'Vi tar aldri betalt for at du bruker rettighetene dine.',
    ],
  },
  {
    id: '12',
    title: 'Klage til Datatilsynet',
    paragraphs: [
      'Mener du at vi behandler opplysningene dine feil, håper vi du sier fra til oss først. Da får vi rettet det.',
      'Du har uansett rett til å klage til Datatilsynet. De kan kontaktes på datatilsynet.no, eller på Postboks 458 Sentrum, 0105 Oslo.',
    ],
  },
  {
    id: '13',
    title: 'Slik sikrer vi opplysningene',
    list: [
      'All trafikk er kryptert med TLS',
      'Passord lagres aldri i klartekst, kun som kryptografisk hash',
      'Bilder ligger bak signerte lenker med begrenset levetid',
      'Tilgang til produksjonsdata er begrenset og logges',
      'Personopplysninger fjernes automatisk fra tekniske feilmeldinger',
      'Vi tester sikkerheten automatisk ved hver endring i koden',
    ],
    paragraphs: [
      'Skulle det likevel skje et brudd som utgjør en risiko for deg, varsler vi Datatilsynet innen 72 timer og deg direkte når loven krever det.',
    ],
  },
  {
    id: '14',
    title: 'Informasjonskapsler',
    paragraphs: [
      'Vi bruker et minimum av informasjonskapsler, og ingen til reklame eller sporing på tvers av nettsteder.',
    ],
  },
  {
    id: '15',
    title: 'Barn',
    paragraphs: [
      'Tosom er kun for voksne. Vi retter oss ikke mot barn, og vi samler bevisst aldri inn opplysninger om personer under aldersgrensen.',
      'Oppdager vi at en bruker er under aldersgrensen, slettes kontoen og alle opplysninger umiddelbart.',
    ],
  },
  {
    id: '16',
    title: 'Endringer i erklæringen',
    paragraphs: [
      'Vi oppdaterer denne erklæringen når tjenesten endres eller regelverket krever det.',
      'Ved vesentlige endringer varsler vi deg før de trer i kraft. Gjelder endringen sensitive opplysninger, ber vi om nytt samtykke.',
      'Versjon og dato står øverst på siden.',
    ],
  },
];

/* ========================
   SIDE
   ======================== */

export default function PersonvernPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, #0B1520 0%, #121E2E 50%, #0B1520 100%)',
        }}
      />

      <div className="relative z-10">
        {/* ===== HERO ===== */}
        <ToSomSection spotlight="blue" className="px-6 text-center space-y-6">
          <h1 style={{ ...typographyToStyle('hero'), color: color.text.primary }}>
            Personvern
          </h1>

          <p
            className="max-w-2xl mx-auto"
            style={{ ...typographyToStyle('body-lg'), color: color.text.secondary }}
          >
            Profilen din er privat. Her står nøyaktig hva vi lagrer, hvorfor, hvor lenge — og hva du
            kan kreve av oss.
          </p>

          <p style={{ ...typographyToStyle('body-sm'), color: color.text.muted }}>
            Versjon {PRIVACY_VERSION} · Sist oppdatert {PRIVACY_UPDATED}
          </p>
        </ToSomSection>

        {/* ===== SEKSJONER ===== */}
        <ToSomSection spotlight="none" className="px-6">
          <div className="mx-auto max-w-[760px] space-y-12">
            {sections.map((section) => (
              <section key={section.id} id={`punkt-${section.id}`} className="space-y-4">
                <h2
                  className="flex gap-3"
                  style={{ ...typographyToStyle('heading-md'), color: color.text.primary }}
                >
                  <span style={{ color: color.brand.gold }}>{section.id}.</span>
                  <span>{section.title}</span>
                </h2>

                {section.callout && (
                  <div
                    className="rounded-2xl px-5 py-4"
                    style={{
                      background: 'rgba(212,175,55,0.06)',
                      border: '1px solid rgba(212,175,55,0.22)',
                    }}
                  >
                    <p
                      style={{
                        ...typographyToStyle('body'),
                        color: 'rgba(255,255,255,0.82)',
                        lineHeight: '1.7',
                      }}
                    >
                      {section.callout}
                    </p>
                  </div>
                )}

                {section.paragraphs?.map((text, i) => (
                  <p
                    key={i}
                    style={{
                      ...typographyToStyle('body'),
                      color: color.text.secondary,
                      lineHeight: '1.85',
                    }}
                  >
                    {text}
                  </p>
                ))}

                {section.list && (
                  <ul className="space-y-2.5 pl-1">
                    {section.list.map((item, i) => (
                      <li key={i} className="flex gap-3">
                        <span
                          className="flex-shrink-0 mt-[11px] w-1 h-1 rounded-full"
                          style={{ background: color.brand.gold }}
                        />
                        <span
                          style={{
                            ...typographyToStyle('body'),
                            color: color.text.secondary,
                            lineHeight: '1.85',
                          }}
                        >
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.table && (
                  <div
                    className="overflow-x-auto rounded-2xl"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr>
                          {section.table.headers.map((header) => (
                            <th
                              key={header}
                              className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em]"
                              style={{
                                color: 'rgba(255,255,255,0.45)',
                                borderBottom: '1px solid rgba(255,255,255,0.08)',
                              }}
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {section.table.rows.map((row, i) => (
                          <tr key={i}>
                            {row.cells.map((cell, j) => (
                              <td
                                key={j}
                                className="px-4 py-3 align-top text-sm"
                                style={{
                                  color:
                                    j === 0
                                      ? 'rgba(255,255,255,0.82)'
                                      : 'rgba(255,255,255,0.62)',
                                  borderTop:
                                    i === 0 ? 'none' : '1px solid rgba(255,255,255,0.05)',
                                  lineHeight: '1.65',
                                }}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            ))}
          </div>
        </ToSomSection>

        {/* ===== KONTAKT ===== */}
        <ToSomSection spotlight="soft" className="px-6">
          <div className="mx-auto max-w-[760px] space-y-4">
            <h2 style={{ ...typographyToStyle('heading-md'), color: color.text.primary }}>
              Spørsmål om personvern?
            </h2>

            <p
              style={{
                ...typographyToStyle('body'),
                color: color.text.secondary,
                lineHeight: '1.85',
              }}
            >
              Skriv til{' '}
              <a
                href={`mailto:${COMPANY.email}`}
                className="underline underline-offset-4"
                style={{ color: color.brand.gold }}
              >
                {COMPANY.email}
              </a>
              . Se også{' '}
              <Link
                href="/vilkar"
                className="underline underline-offset-4"
                style={{ color: color.brand.gold }}
              >
                vilkårene
              </Link>{' '}
              og{' '}
              <Link
                href="/trygghet"
                className="underline underline-offset-4"
                style={{ color: color.brand.gold }}
              >
                trygghetssiden
              </Link>
              .
            </p>

            <p
              style={{
                ...typographyToStyle('body-sm'),
                color: color.text.muted,
                lineHeight: '1.7',
              }}
            >
              {companyFooterLine()}
            </p>
          </div>
        </ToSomSection>

        <Footer />
      </div>
    </main>
  );
}
