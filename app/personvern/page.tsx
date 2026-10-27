'use client';

/**
 * Tosom — Personvernerklæring
 *
 * Bygget på faktisk datamodell i prisma/schema.prisma, ikke på antakelser.
 * Versjonert via config/legal.ts.
 *
 * ⚠️ Pre-lawyer review (26.10.2026): absolutte claims er fjernet, og
 * datakategorier, formål, leverandører, retensjon og sletting er kartlagt
 * mot faktisk kode (HEAD). Åpne juridiske spørsmål — art. 6/9-grunnlag,
 * profilering, art. 22, DPA/SCC/overføring, digitalytelsesloven — er merket
 * i docs/LEGAL-PAGES-PRELAWYER-REVIEW-v1.0.md og docs/LEGAL-REVIEW-PACKAGE-v1.0.md,
 * ikke på denne siden.
 */

import Link from 'next/link';
import { Footer } from '@/components/ui/layout/Footer';
import { ToSomSection } from '@/components/ui/system';
import { color, typographyToStyle } from '@/config/design-tokens';
import { COMPANY, companyIdentification, companyFooterLine, PRIVACY_VERSION, PRIVACY_UPDATED, LEGISLATION } from '@/config/legal';

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
  references?: { label: string; url: string; note?: string }[];
}

const sections: Section[] = [
  {
    id: '1',
    title: 'Hvem er ansvarlig?',
    paragraphs: [
      `${companyIdentification()} er behandlingsansvarlig for personopplysningene dine.`,
      `Spørsmål om personvern rettes til ${COMPANY.email}. Vi svarer normalt raskere, men senest innen 30 dager.`,
    ],
  },
  {
    id: '2',
    title: 'Kort fortalt',
    paragraphs: [
      'Tosom er et sted der to voksne kan møtes — og vi vet at det krever tillit. Profilen din er privat: den vises ikke offentlig, og den personen du kobles med ser bare et lite utvalg av den.',
      'Vi selger ikke personopplysninger, og vi bruker dem ikke til markedsføring. Noen leverandører hjelper oss med å drive tjenesten — hosting, database, bilder, chat, e-post og feilovervåking. De står listet i punkt 7, og de behandler opplysningene for oss, ikke for seg selv.',
      'Tosom er kun for voksne (21+). Vi retter oss ikke mot barn, og oppdager vi at en bruker er under aldersgrensen, slettes kontoen.',
      'Denne erklæringen forteller nøyaktig hva vi lagrer, hvorfor, hvor lenge — og hva du kan kreve av oss.',
    ],
  },
  {
    id: '3',
    title: 'Opplysninger vi behandler',
    paragraphs: [
      'Dette er alt vi kan lagre om deg. Grunnlag-kolonnen viser det behandlingsgrunnlaget vi i dag opererer med; den endelige juridiske vurderingen av grunnlaget er i gang.',
      'I dagens beta bekrefter du alderen selv ved onboarding. Når Vipps-innlogging aktiveres, vil alderen bli verifisert ved innlogging.',
    ],
    table: {
      headers: ['Gruppe', 'Hva det er', 'Grunnlag (i dag)', 'Oppbevaring'],
      rows: [
        {
          cells: [
            'Konto',
            'E-postadresse, passord (lagret som kryptografisk hash, aldri i klartekst), visningsnavn, innlogging og sesjonsdata',
            'Avtale (art. 6.1.b)',
            'Til kontoen slettes',
          ],
        },
        {
          cells: [
            'Profil (onboarding)',
            'Alder, kjønn og hvem du søker, bosted (postnummer — og omtrentlig posisjon dersom du oppgir den), presentasjon, bilde, interesser, livssituasjon, livsstil, personlighet, relasjonsstil, kommunikasjon, verdier, følelsesmessige behov, grenser, religion/livssyn (se punkt 5)',
            'Avtale (art. 6.1.b); særlige kategorier: uttrykkelig samtykke (art. 9.2.a)',
            'Til kontoen slettes',
          ],
        },
        {
          cells: [
            'Matching og reise',
            'Kompatibilitetsvurderinger og score fra matcherunden, reise-status, framdrift, faser og valg, «vi fant hverandre»-status',
            'Avtale (art. 6.1.b)',
            'Til reisen avsluttes — vurderingene slettes med reisen',
          ],
        },
        {
          cells: [
            'Kommunikasjon og bilder',
            'Meldinger i samtalen (tekst og systemmeldinger), bilder du deler fra dag 8, levert- og lest-tidspunkter',
            'Avtale (art. 6.1.b)',
            'Til reisen avsluttes (24 timer etter «vi fant hverandre», deretter permanent slettet)',
          ],
        },
        {
          cells: [
            'Sikkerhet',
            'Rapporter, blokkeringer, øyeblikksbilde av de siste meldingene ved rapport (bevis), stengte kontoer',
            'Berettiget interesse (art. 6.1.f)',
            'Bevis: inntil 90 dager fra rapporten. Rapport og blokkering: til saken er behandlet (se punkt 9 og 10)',
          ],
        },
        {
          cells: [
            'Teknisk',
            'Tekniske logger og feildata (personopplysninger skrives ut automatisk fra feilmeldingene), sikkerhetstall for rate limiting, driftsdata',
            'Berettiget interesse (art. 6.1.f)',
            'Inntil de ikke lenger trengs for sikkerhet og feilretting',
          ],
        },
        {
          cells: [
            'Gratis-beta',
            'Invitasjonsdata (e-postadresse), tellertall for gratisperioden (de første 5 000)',
            'Berettiget interesse (art. 6.1.f)',
            'Invitasjonen: til den brukes. Telleren: så lenge betaen varer',
          ],
        },
        {
          cells: [
            'Onboarding-utkast',
            'Svar du har skrevet i onboarding, inntil du ferdigstiller',
            'Avtale (art. 6.1.b)',
            'Per nettleserøkt (sessionStorage) — forsvinner når fanen stenges, og tømmes ved utlogging. Server-utkastet slettes når profilen lagres.',
          ],
        },
      ],
    },
  },
  {
    id: '4',
    title: 'Hva vi bruker dem til',
    paragraphs: [
      'Hver opplysning er der for én konkret ting — ikke for å «forbedre tjenesten» i alminnelighet:',
    ],
    list: [
      'Konto-data: opprette og sikre kontoen din, håndtere innlogging, og gjennomføre sletting når du ber om det.',
      'Profilsvar: gjennomføre onboarding og bygge profilen du velger å fullføre.',
      'Matching: vurdere mulige koblinger. Noen av grensene dine utelukker kandidater helt (for eksempel alder, avstand og religion/livssyn); de øvrige svarene inngår som signaler i en samlet vurdering. Finnes det ingen egnet kandidat, får du ingen kobling den runden og står i kø til neste lørdag.',
      'Reisen: drive 14-dagersreisen — daglige spørsmål, faser, billeddeling fra dag 8, samtale, og PDF-eksport i enden.',
      'Bilder: vise bildene i samtalen din med personen du er koblet med — og ingen andre.',
      'Sikkerhet: behandle rapporter og blokkeringer, og hindre at kjente farlige situasjoner gjentar seg — også etter at en konto er slettet.',
      'Teknisk: stoppe brute-force og misbruk (rate limiting), finne og rette feil, og holde tjenesten i gang.',
      'Rettigheter: besvare henvendelsene dine — innsyn, kopi, retting og sletting.',
      'Gratis-beta: holde styr på invitasjonene og at de første 5 000 personene får reisen gratis.',
    ],
  },
  {
    id: '5',
    title: 'Særlige kategorier og samtykke',
    callout:
      'Dette er den viktigste delen av erklæringen. Les den før du fullfører onboarding.',
    paragraphs: [
      'For å kunne vurdere mulige koblinger, spør vi om ting som er personlige. Noen av svarene kan regnes som særlige kategorier av personopplysninger etter personvernforordningen artikkel 9. Disse har ekstra sterkt vern.',
      'Vi behandler disse opplysningene bare hvis du gir samtykke. Du får spørsmål om det i en egen samtykkesskjerm, separat fra vilkårene, før du går videre i onboarding. Du kan også velge å hoppe over spørsmålene — da blir grunnlaget for koblingen tynnere, men du kan fortsatt bruke Tosom.',
      'Du kan trekke samtykket tilbake når som helst. I dag gjør du det ved å slette kontoen din (Innstillinger). Da slettes også opplysningene fra særlige kategorier, og de brukes ikke i matcherunden lenger. Det påvirker ikke behandlingen som allerede har skjedd.',
      'Vi bruker svarene ikke til noe annet enn matching og reisen. De vises ikke for andre brukere, selges ikke, og brukes ikke til markedsføring. Dersom du rapporterer en alvorlig situasjon, ser den som behandler saken på meldingene i samtalen — ikke onboarding-svarene dine.',
      'Opplysningene kan si noe om:',
    ],
    list: [
      'Religion og livssyn, dersom du svarer på spørsmålene om det',
      'Synet ditt på intimitet og seksualliv',
      'Følelsesmessige behov, som kan si noe om psykisk helse',
      'Grenser og tidligere erfaringer, som kan berøre vanskelige hendelser',
      'Kjønn og hvem du søker, som kan si noe om seksuell orientering',
    ],
  },
  {
    id: '6',
    title: 'Matching og automatisering',
    paragraphs: [
      'Koblingen skjer fullt automatisk én gang i uken, natt til lørdag. Det er den eneste delen av Tosom som tar avgjørelser uten at du gjør noe selv.',
      'Slik ser vurderingen ut: først sjekker motoren grensene dine — enkelte svar utelukker kandidater helt (for eksempel aldersgrenser, avstand og religion/livssyn). De øvrige svarene inngår deretter som signaler i en samlet vurdering over seks områder: verdier, tilknytning, personlighet, kommunikasjon, emosjonsregulering og livssituasjon. Det er et minimumsnivå for vurderingen; når ingen kandidat når opp, får du ingen kobling den runden, og du står i kø til neste lørdag.',
      'Bilder og utseende inngår aldri i vurderingen. Motoren er regelbasert og kjører likt for alle — det finnes ingen AI som tolker deg, og vi gjør ingen kliniske vurderinger. Du får aldri se et poengtall, og du blir aldri rangert mot andre.',
      'En kobling er ikke en garanti. Den betyr at to profiler nådde minimumsnivået — ikke at dere kommer til å klikke. Er du uenig i en kobling, kan du avslutte reisen og stille deg i kø til neste runde.',
    ],
  },
  {
    id: '7',
    title: 'Leverandører vi bruker',
    paragraphs: [
      'Vi selger ikke opplysningene dine, og vi bruker dem ikke til annonsering. For å drive tjenesten bruker vi en håndfull leverandører. De skal behandle opplysningene for oss, ikke for egne formål — vi arbeider med databehandleravtaler med alle (se også punkt 8).',
    ],
    table: {
      headers: ['Leverandør', 'Hva de behandler', 'Formål'],
      rows: [
        { cells: ['Vercel', 'Drift av nettsiden og API-ene. Leverandørens egne driftslogger kan inneholde e-postadresse og IP-adresse', 'Hosting og serverfunksjoner'] },
        { cells: ['Neon (managed Postgres, EU/Frankfurt)', 'Databasen — opplysningene i punkt 3', 'Drift av databasen'] },
        { cells: ['Cloudflare', 'Nettverkssikkerhet (CDN/WAF) foran nettsiden, og bildene dine i Cloudflare R2 (EU)', 'Nettverksbeskyttelse og bildefillagring'] },
        { cells: ['Pusher', 'Meldingene dine i sanntid under sendingen', 'Chat uten forsinkelse'] },
        { cells: ['Resend (via SMTP)', 'E-postadresse og innhold i transaksjonelle e-poster (passord-reset, varsler)', 'Send e-poster til deg'] },
        { cells: ['Sentry', 'Tekniske feil og driftsdata — personopplysninger skrives ut automatisk før sending', 'Feil- og driftsmonitorering'] },
      ],
    },
    references: [
      {
        label: 'Innlogging og betaling (framtidig)',
        url: '/priser',
        note: 'Når Vipps aktiveres for innlogging og betaling, vil det brukes til akkurat det — ingenting annet. I dag er ingen betalings- eller Vipps-vei aktiv.',
      },
    ],
  },
  {
    id: '8',
    title: 'Overføring og lagring',
    paragraphs: [
      'Databasen (Neon) og bildene (Cloudflare R2) ligger i EU (Frankfurt).',
      'Noen leverandører har base eller datacentre utenfor EØS — blant annet Pusher, Resend og Sentry. Hva som går gjennom dem, står i tabellen i punkt 7: i hovedsak meldinger under sendingen, e-postadresser, og tekniske feildata uten personopplysninger.',
      'Vi arbeider med databehandleravtaler og overføringsgrunnlag (for eksempel EU-kommisjonens standardavtaler) med alle leverandørene. Inntil dette er på plass: opplysningene dine sendes kun til leverandørene i punkt 7, kun for de oppgitte formålene, og aldri til noen andre.',
      `Vil du vite nøyaktig hvor en bestemt tjeneste ligger, spør oss på ${COMPANY.email} — så svarer vi konkret.`,
    ],
  },
  {
    id: '9',
    title: 'Hvor lenge vi beholder opplysninger',
    table: {
      headers: ['Hva', 'Hvor lenge'],
      rows: [
        { cells: ['Konto og profil (inklusive særlige kategorier)', 'Til du sletter kontoen'] },
        { cells: ['Samtaler og bilder', 'Til reisen avsluttes. Velger dere «vi fant hverandre», beholdes de 24 timer (slik at begge kan laste ned minnet som PDF) og slettes deretter permanent'] },
        { cells: ['Reise-data (status, framdrift, valg) og kompatibilitetsvurderinger', 'Til reisen avsluttes'] },
        { cells: ['Bevis ved rapport (øyeblikksbilde av meldingene)', 'Inntil 90 dager fra rapporten, deretter slettes det automatisk'] },
        { cells: ['Rapporter og blokkeringer', 'Til saken er behandlet — beholdes også etter kontosletting, fordi de holder tjenesten trygg (se punkt 10)'] },
        { cells: ['Tekniske logger og feildata', 'Inntil de ikke lenger trengs for sikkerhet og feilretting'] },
        { cells: ['Invitasjoner og kvote for gratisperioden', 'Invitasjonen til den brukes. Kvote-telleren så lenge betaen varer'] },
        { cells: ['Regnskapsopplysninger', 'Gjelder først når betaling innføres — da beholdes betalingsopplysninger så lenge bokføringsloven krever (5 år)'] },
      ],
    },
    paragraphs: [
      'Når du sletter kontoen, eller reisen avsluttes, fjerner vi dataene umiddelbart fra hoveddatabasen. Data som da ligger i tekniske sikkerhetskopier, kan forbli inntil kopien utløper.',
    ],
  },
  {
    id: '10',
    title: 'Når du sletter kontoen',
    paragraphs: [
      'Sletting skjer umiddelbart — ikke etter et varsel. Du sletter kontoen når du vil, under Innstillinger, og du behøver ikke oppgi grunn.',
      'Da slettes: kontoen, profilen og alle svarene (inklusive særlige kategorier), alle samtaler du har vært en del av — både dine meldinger og den andres i de samme samtalen — bildene, reisen, matcher, innlogginger og tekniske nøkler.',
      'Et lite antall poster beholdes, fordi de holder tjenesten trygg — også for deg: rapporter om alvorlige forhold, blokkeringer, og en post om at en kobling fant sted (uten innhold). Disse postene knytter seg ikke lenger til en personprofil, og de vises bare for den som behandler sikkerhetssaker.',
      'Velger dere «vi fant hverandre», er det motsatt: dere får 24 timer til å laste ned samtalen som PDF. Deretter slettes begge kontoer, samtalen og bildene — permanent. Dette kan ikke angres, og begge må bekrefte.',
      'Data som ligger i tekniske sikkerhetskopier, kan forbli inntil kopien utløper.',
    ],
  },
  {
    id: '11',
    title: 'Rettighetene dine',
    paragraphs: [
      'Avhengig av behandlingen kan du ha rett til — og du trenger ikke begrunne hvorfor du bruker dem:',
    ],
    list: [
      'Innsyn — få vite hva vi har lagret om deg',
      'Kopi — få opplysningene tilsendt i et lesbart format',
      'Retting — få rettet noe som er feil',
      'Sletting — få opplysningene dine slettet (i dag: ved å slette kontoen)',
      'Begrensning — be oss stanse bruken midlertidig',
      'Innsigelse — protestere mot behandling vi bygger på berettiget interesse',
      'Dataportabilitet — få opplysningene i et format du kan ta med deg (Innstillinger → Eksport)',
      'Trekke samtykke tilbake — når som helst; i dag ved å slette kontoen',
      'Selvbetjening — det meste ordner du selv under Innstillinger: se og rette profilen, laste ned en kopi av opplysningene dine, eller slette kontoen',
    ],
  },
  {
    id: '12',
    title: 'Cookies',
    paragraphs: [
      'Vi bruker et minimum av informasjonskapsler — og ingen til reklame eller sporing på tvers av nettsteder. De nødvendige cookies brukes til innlogging og sikkerhet (inntil ca. 30 dager). Detaljene står på cookie-siden vår.',
    ],
    references: [
      {
        label: 'Cookie-siden vår',
        url: '/cookies',
        note: 'Hvilke cookies og lokalt lagring Tosom bruker, og hvordan du styrer dem.',
      },
    ],
  },
  {
    id: '13',
    title: 'Sikkerhet',
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
    title: 'Kontakt og klage',
    paragraphs: [
      `Spørsmål om personvern: ${COMPANY.email}. Vi svarer normalt raskere, men senest innen 30 dager — og det koster aldri noe å bruke rettighetene dine.`,
      'Mener du at vi behandler opplysningene dine feil, håper vi du sier fra til oss først — da får vi rettet det. Du har uansett rett til å klage til Datatilsynet: Postboks 458 Sentrum, 0105 Oslo, eller på datatilsynet.no.',
      'Behandlingen av opplysningene dine følger personvernforordningen (GDPR) og den norske personopplysningsloven.',
      'Vi oppdaterer denne erklæringen når tjenesten endres eller regelverket krever det. Ved vesentlige endringer varsler vi deg før de trer i kraft; gjelder endringen særlige kategorier, ber vi om nytt samtykke. Versjon og dato står øverst på siden.',
    ],
    references: [
      {
        label: LEGISLATION.datatilsynet.label,
        url: LEGISLATION.datatilsynet.url,
        note: 'Datatilsynets nettsted — også der du kan søke veiledning om dine rettigheter.',
      },
      {
        label: LEGISLATION.gdpr.label,
        url: LEGISLATION.gdpr.url,
        note: 'Mellom annet art. 6 (lovlighetsgrunnlag), art. 9 (særlige kategorier), art. 13–14 (informasjonsplikt), art. 15–21 (rettighetene dine), art. 22 (automatiserte avgjørelser), art. 28 (databehandlere) og art. 33–34 (varsel ved brudd).',
      },
      { label: LEGISLATION.personvernlov.label, url: LEGISLATION.personvernlov.url },
      {
        label: LEGISLATION.bokforing.label,
        url: LEGISLATION.bokforing.url,
        note: 'Grunnlaget for at regnskapsopplysninger ved betaling beholdes i fem år.',
      },
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
                                color: 'rgba(255,255,255,0.6)',
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

                {section.references && (
                  <ul className="space-y-3 pl-1">
                    {section.references.map((ref, i) => (
                      <li key={i} className="space-y-0.5">
                        <a
                          href={ref.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline underline-offset-4"
                          style={{ ...typographyToStyle('body'), color: color.brand.gold }}
                        >
                          {ref.label}
                        </a>
                        {ref.note && (
                          <p
                            style={{
                              ...typographyToStyle('body-sm'),
                              color: color.text.muted,
                              lineHeight: '1.7',
                            }}
                          >
                            {ref.note}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
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
