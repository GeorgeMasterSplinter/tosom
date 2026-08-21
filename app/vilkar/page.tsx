'use client';

/**
 * Tosom — Vilkår for bruk
 *
 * Versjonert via config/legal.ts. Ved endring: bump TERMS_VERSION der,
 * slik at User.termsVersion dokumenterer hvilken tekst brukeren aksepterte.
 *
 * ⚠️ Utkast til advokatgjennomgang. Se docs/JURIDISK-GRUNNLAG-v1.0.md
 * for åpne spørsmål — særlig A-1 (angrerett) og A-4 (ansvarsbegrensning).
 */

import Link from 'next/link';
import { Footer } from '@/components/ui/layout/Footer';
import { ToSomSection } from '@/components/ui/system';
import { color, typographyToStyle } from '@/config/design-tokens';
import { COMPANY, companyIdentification, companyFooterLine, TERMS_VERSION, TERMS_UPDATED, MIN_AGE, PRICING, JOURNEY } from '@/config/legal';

/* ========================
   INNHOLD
   ======================== */

interface Clause {
  id: string;
  title: string;
  paragraphs: string[];
  list?: string[];
}

const clauses: Clause[] = [
  {
    id: '1',
    title: 'Avtalen og partene',
    paragraphs: [
      `Disse vilkårene utgjør avtalen mellom deg som bruker og ${companyIdentification()}.`,
      'Ved å opprette konto bekrefter du at du har lest og godtatt vilkårene. Godtar du dem ikke, kan du ikke bruke Tosom.',
      'Avtalen gjelder fra du oppretter konto, og til kontoen er slettet.',
    ],
  },
  {
    id: '2',
    title: 'Hva Tosom er',
    paragraphs: [
      'Tosom er en relasjonsplattform for voksne. Vi kobler to personer og gir dere et privat rom med en guidet reise over 30 dager.',
      'Tosom er ikke en datingapp. Det finnes ingen strøm av profiler, ingen sveiping og ingen mulighet til å velge mellom flere personer. Du får én kobling om gangen.',
    ],
  },
  {
    id: '3',
    title: 'Hva vi leverer',
    paragraphs: [
      'Det du får er én kobling til én person.',
      `Koblingen skjer natt til lørdag. Sammen med den får dere et privat samtalerom og en guidet reise over ${JOURNEY.totalDays} dager. Reisen er rammen koblingen leveres i — det er koblingen som er selve leveransen.`,
      'Konkret betyr det:',
    ],
    list: [
      'Én kobling til én annen bruker, gjort av vår matching-motor',
      'Et privat samtalerom mellom dere to',
      `Daglige tema og spørsmål gjennom ${JOURNEY.totalDays} dager`,
      `Mulighet til å dele bilder fra dag ${JOURNEY.imageUnlockDay}`,
      'Mulighet til å avslutte når du vil',
    ],
  },
  {
    id: '4',
    title: 'Hva vi ikke lover',
    paragraphs: [
      'Dette er viktig, og vi vil være tydelige på det.',
      'Vi lover en kobling og et rom. Vi lover ikke et resultat.',
    ],
    list: [
      'Vi kan ikke garantere at du får en kobling i en bestemt runde. Det avhenger av hvem andre som står i kø.',
      'Vi kan ikke garantere at koblingen fører til kontakt, vennskap eller forhold.',
      'Vi kan ikke garantere at den andre personen svarer, eller at samtalen fortsetter.',
      'Vi gjør ingen bakgrunnssjekk av brukere utover identitet og alder verifisert gjennom Vipps.',
      'Vi kan ikke garantere at plattformen alltid er tilgjengelig uten avbrudd.',
    ],
  },
  {
    id: '5',
    title: `Aldersgrense — ${MIN_AGE} år`,
    paragraphs: [
      `Du må ha fylt ${MIN_AGE} år for å bruke Tosom. Alderen verifiseres gjennom Vipps, som bruker BankID.`,
      `Oppdager vi at en bruker er under ${MIN_AGE} år, stenges kontoen umiddelbart og alle opplysninger slettes.`,
    ],
  },
  {
    id: '6',
    title: 'Konto og innlogging',
    paragraphs: [
      'Du oppretter konto med Vipps. Kontoen er personlig, og du kan bare ha én.',
      'Du er ansvarlig for aktiviteten på kontoen din. Mistenker du at noen andre har fått tilgang, skal du si fra til oss.',
      'Du kan ikke overdra kontoen til andre, og du kan ikke opptre på vegne av noen andre.',
    ],
  },
  {
    id: '7',
    title: 'Profilen din',
    paragraphs: [
      'Profilen du bygger i onboarding er privat. Den vises aldri offentlig, og andre brukere ser den ikke.',
      'Profilen brukes kun av matching-motoren for å finne en kobling. Personen du kobles med ser bare et begrenset utvalg opplysninger.',
      'Du er ansvarlig for at opplysningene du oppgir er riktige. Bevisst uriktige opplysninger er brudd på vilkårene.',
    ],
  },
  {
    id: '8',
    title: 'Koblingen',
    paragraphs: [
      'Matcherunden kjøres én gang i uken, natt til lørdag. Koblingen gjøres automatisk av matching-motoren, basert på det du har oppgitt om verdier, livssituasjon og relasjonsstil.',
      'Du velger ikke hvem du kobles med, og du kan ikke be om en annen. Får du ingen kobling i en runde, står du i kø til neste lørdag.',
      'Motoren bruker aldri bilder eller utseende.',
    ],
  },
  {
    id: '9',
    title: 'Reisen',
    paragraphs: [
      `Reisen varer ${JOURNEY.totalDays} dager og er delt i fire faser. Innholdet er regelstyrt og likt for alle — det finnes ingen AI som skriver meldinger, gir råd eller opptrer som samtalepartner.`,
      `Bilder kan først deles fra dag ${JOURNEY.imageUnlockDay}. Dette er en bevisst begrensning som ikke kan omgås.`,
      'Du kan ha én aktiv reise om gangen.',
    ],
  },
  {
    id: '10',
    title: 'Hva vi forventer av deg',
    paragraphs: [
      'Tosom skal være et rom der voksne kan møtes med ro og respekt. Derfor forventer vi at du:',
    ],
    list: [
      'Er ærlig om hvem du er',
      'Behandler den andre personen med respekt',
      'Respekterer grenser som blir satt',
      'Ikke deler innhold som er støtende, truende eller ulovlig',
      'Ikke bruker plattformen til markedsføring, salg eller innsamling',
      'Ikke forsøker å omgå tekniske begrensninger',
      'Ikke deler andres opplysninger eller bilder utenfor plattformen',
    ],
  },
  {
    id: '11',
    title: 'Forbudt bruk',
    paragraphs: [
      'Følgende fører til umiddelbar stenging av kontoen:',
    ],
    list: [
      'Trakassering, trusler eller hatefulle ytringer',
      'Seksuelt innhold som deles uten samtykke',
      'Innhold som involverer mindreårige',
      'Falsk identitet eller villedende opplysninger om hvem du er',
      'Økonomisk utnyttelse, svindel eller forsøk på dette',
      'Automatisert innhenting av data fra plattformen',
      'Forsøk på å skaffe seg uberettiget tilgang til systemet',
    ],
  },
  {
    id: '12',
    title: 'Rapportering og moderering',
    paragraphs: [
      'Opplever du noe ubehagelig, kan du rapportere det fra samtalen eller under Innstillinger. Alle rapporter blir lest.',
      'Ved brudd på vilkårene kan vi gi advarsel, fryse samtalen, avslutte reisen eller stenge kontoen. Hvilket tiltak vi velger avhenger av alvoret.',
      'Ved grove brudd stenger vi kontoen umiddelbart og uten varsel.',
      'Vi leser ikke samtaler uten at det foreligger en rapport. Dette er en fast regel hos oss.',
      'Du kan når som helst blokkere den du er koblet med, og avslutte reisen.',
    ],
  },
  {
    id: '13',
    title: 'Bilder',
    paragraphs: [
      `Bilder kan deles fra dag ${JOURNEY.imageUnlockDay} av reisen. Du bestemmer selv om du vil dele.`,
      'Du beholder rettighetene til bildene dine. Du gir oss en begrenset rett til å lagre og vise dem i samtalen, kun så lenge det er nødvendig for å levere tjenesten.',
      'Du kan ikke laste opp bilder av andre uten deres samtykke, og ikke bilder du ikke har rett til å dele.',
      'Bilder slettes når reisen avsluttes.',
    ],
  },
  {
    id: '14',
    title: 'Pris og betaling',
    paragraphs: [
      'Tosom er i lukket beta. I denne perioden er tjenesten gratis for inviterte brukere, og det kreves ingen betaling.',
      `Når Tosom åpner for alle, blir reisen gratis for de første ${PRICING.freeUserCap.toLocaleString('nb-NO')} brukerne. Deretter koster én reise ${PRICING.journeyPrice} kroner, betalt én gang. Det er ingen abonnement og ingen løpende kostnader.`,
      'Vi varsler i god tid før prismodellen trer i kraft. Du blir aldri belastet uten at du har godkjent det på forhånd.',
    ],
  },
  {
    id: '15',
    title: 'Angrerett og refusjon',
    paragraphs: [
      'Så lenge tjenesten er gratis, har dette punktet ingen økonomisk betydning. Det gjelder fra betaling innføres.',
      'Norsk lov gir deg som forbruker angrerett på digitale tjenester. Retten faller bort når leveringen har begynt, forutsatt at du på forhånd har samtykket til det og forstått hva det innebærer. Du blir bedt om begge deler før du betaler.',
      'Grensen går ved koblingen:',
    ],
    list: [
      'Fram til koblingen er gjort natt til lørdag, kan du melde deg ut og få hele beløpet tilbake. Uten spørsmål.',
      'Når koblingen er gjort, er tjenesten levert, og angreretten er bortfalt.',
    ],
  },
  {
    id: '16',
    title: 'Hvorfor grensen går ved koblingen',
    paragraphs: [
      'Vi vil at du skal forstå hvorfor, ikke bare at det er slik.',
      `Det du betaler for er koblingen til én bestemt person. I det øyeblikket koblingen skjer, har vi levert det du kjøpte — uavhengig av hva som skjer videre i de ${JOURNEY.totalDays} dagene.`,
      'Koblingen kan heller ikke gjøres om. En annen person er tildelt deg, og den personen er dermed ikke tilgjengelig for noen andre den uken. Leveransen berører et annet menneske, og den kan ikke tas tilbake.',
      'Derfor er refusjonsretten romslig helt fram til koblingen, og opphører idet den er gjort.',
    ],
  },
  {
    id: '17',
    title: 'Avslutning og sletting',
    paragraphs: [
      'Du kan avslutte reisen eller slette kontoen når som helst, uten å oppgi grunn.',
      'Velger dere «vi fant hverandre», slettes begge kontoene og hele samtalen. Dette kan ikke angres, og begge må bekrefte.',
      'Ved sletting fjernes profil, samtaler og bilder. Enkelte opplysninger kan beholdes der loven krever det, eller der de er nødvendige for å håndtere en rapport om alvorlige forhold.',
      'Du kan be om en kopi av opplysningene dine før sletting.',
      'Vi kan avslutte avtalen med deg ved brudd på vilkårene, eller hvis vi legger ned tjenesten. Ved nedleggelse varsler vi i god tid.',
    ],
  },
  {
    id: '18',
    title: 'Vårt ansvar',
    paragraphs: [
      'Tosom formidler kontakt mellom voksne mennesker. Vi er ikke part i det som skjer mellom dere.',
      'Vi er ikke ansvarlige for hva andre brukere gjør, sier eller unnlater å gjøre — verken på plattformen eller utenfor.',
      'Velger dere å møtes fysisk, skjer det på eget ansvar. Vi anbefaler at du leser rådene på trygghetssiden vår først.',
      'Vi er ikke ansvarlige for indirekte tap, tapt fortjeneste eller følgeskader. Vårt samlede ansvar er begrenset til det du har betalt for den aktuelle reisen.',
      'Ingenting i disse vilkårene begrenser ansvar som ikke kan begrenses etter norsk rett, herunder ansvar for forsett eller grov uaktsomhet.',
    ],
  },
  {
    id: '19',
    title: 'Driftsavbrudd',
    paragraphs: [
      'Vi arbeider for at Tosom skal være tilgjengelig, men kan ikke garantere sammenhengende drift.',
      'Ved planlagt vedlikehold varsler vi når det lar seg gjøre. Ved forhold utenfor vår kontroll — som svikt hos underleverandører, strømbrudd eller angrep mot systemet — er vi ikke ansvarlige for avbruddet.',
      'Blir en reise vesentlig forstyrret av forhold på vår side, kan du kontakte oss, så finner vi en løsning.',
    ],
  },
  {
    id: '20',
    title: 'Immaterielle rettigheter',
    paragraphs: [
      `Tosom, med navn, logo, design, tekster og programvare, tilhører ${COMPANY.name}.`,
      'Du får en personlig, ikke-overførbar rett til å bruke tjenesten så lenge avtalen løper. Du kan ikke kopiere, endre eller gjenbruke innholdet vårt uten skriftlig samtykke.',
      'Det du selv skriver, eier du.',
    ],
  },
  {
    id: '21',
    title: 'Personvern',
    paragraphs: [
      'Hvordan vi behandler personopplysningene dine står i personvernerklæringen, som er en del av denne avtalen.',
      'Enkelte av opplysningene du deler i onboarding er særlig sensitive. Disse behandles kun med ditt uttrykkelige samtykke, og brukes utelukkende av matching-motoren.',
    ],
  },
  {
    id: '22',
    title: 'Endringer i vilkårene',
    paragraphs: [
      'Vi kan endre vilkårene, for eksempel når tjenesten utvikles eller regelverket endres.',
      'Ved vesentlige endringer varsler vi deg i god tid før de trer i kraft, og du må godta den nye versjonen for å fortsette å bruke Tosom.',
      'Godtar du ikke endringene, kan du slette kontoen. Har du en pågående reise, kan du fullføre den på de vilkårene du opprinnelig godtok.',
    ],
  },
  {
    id: '23',
    title: 'Lovvalg og tvister',

    paragraphs: [
      'Avtalen er underlagt norsk rett.',
      'Er du uenig i noe, håper vi du tar kontakt med oss først. De fleste ting løser seg i en samtale.',
      'Kommer vi ikke til enighet, kan du bringe saken inn for Forbrukertilsynet eller Forbrukerklageutvalget. Tvister kan også bringes inn for de alminnelige domstolene, med Oslo tingrett som verneting.',
    ],
  },
];

/* ========================
   SIDE
   ======================== */

export default function VilkarPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Bakgrunn */}
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
            Vilkår for bruk
          </h1>

          <p
            className="max-w-2xl mx-auto"
            style={{ ...typographyToStyle('body-lg'), color: color.text.secondary }}
          >
            Tosom er laget for voksne som ønsker en rolig og ekte forbindelse. Her står hva du kan
            forvente av oss, og hva vi forventer av deg.
          </p>

          <p
            style={{ ...typographyToStyle('body-sm'), color: color.text.muted }}
          >
            Versjon {TERMS_VERSION} · Sist oppdatert {TERMS_UPDATED}
          </p>
        </ToSomSection>

        {/* ===== PARAGRAFER ===== */}
        <ToSomSection spotlight="none" className="px-6">
          <div className="mx-auto max-w-[760px] space-y-12">
            {clauses.map((clause) => (
              <section key={clause.id} id={`punkt-${clause.id}`} className="space-y-4">
                <h2
                  className="flex gap-3"
                  style={{ ...typographyToStyle('heading-md'), color: color.text.primary }}
                >
                  <span style={{ color: color.brand.gold }}>{clause.id}.</span>
                  <span>{clause.title}</span>
                </h2>

                {clause.paragraphs.map((text, i) => (
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

                {clause.list && (
                  <ul className="space-y-2.5 pl-1">
                    {clause.list.map((item, i) => (
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
              </section>
            ))}
          </div>
        </ToSomSection>

        {/* ===== KONTAKT ===== */}
        <ToSomSection spotlight="soft" className="px-6">
          <div className="mx-auto max-w-[760px] space-y-4">
            <h2 style={{ ...typographyToStyle('heading-md'), color: color.text.primary }}>
              Spørsmål om vilkårene?
            </h2>

            <p
              style={{
                ...typographyToStyle('body'),
                color: color.text.secondary,
                lineHeight: '1.85',
              }}
            >
              Ta kontakt på{' '}
              <a
                href={`mailto:${COMPANY.email}`}
                className="underline underline-offset-4"
                style={{ color: color.brand.gold }}
              >
                {COMPANY.email}
              </a>
              . Du finner også{' '}
              <Link
                href="/personvern"
                className="underline underline-offset-4"
                style={{ color: color.brand.gold }}
              >
                personvernerklæringen
              </Link>{' '}
              og{' '}
              <Link
                href="/trygghet"
                className="underline underline-offset-4"
                style={{ color: color.brand.gold }}
              >
                trygghetssiden
              </Link>{' '}
              vår.
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
