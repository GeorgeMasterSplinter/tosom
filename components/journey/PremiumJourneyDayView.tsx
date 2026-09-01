// components/journey/PremiumJourneyDayView.tsx — Dagvis visning med tema/refleksjon/oppgåve
'use client';

interface DayContentProps {
  day: number;
  phase: string;
  theme: string;
  title: string;
  reflection: string;
  task?: string;
}

const bokmalTexts: Record<number, { theme: string; title: string; reflection: string; task: string }> = {
  1: {
    theme: 'Hvorfor er du her?',
    title: 'Motivasjonen din',
    reflection: 'Den første dagen handler om å forstå hvorfor du valgte å være her. Hva søker du?',
    task: 'Del med partneren din: Hva var det som fikk deg til å opprette en profil?',
  },
  2: {
    theme: 'Hva betyr trygghet for deg?',
    title: 'Trygghet og nærvær',
    reflection: 'Hva trenger du av en partner for å føle deg trygg?',
    task: 'Del med partneren din: Hva er det viktigste for deg å føle trygg i et forhold?',
  },
  3: {
    theme: 'Dine viktigste verdier',
    title: 'Verdiene dine',
    reflection: 'Navn tre verdier som styrer livet ditt — og hvorfor nettopp de.',
    task: 'Del med partneren din: Hva er dine tre viktigste verdier?',
  },
  4: {
    theme: 'Når ble du virkelig glad?',
    title: 'Gladens øyeblikk',
    reflection: 'Hva skapte den følelsen? Hva gjør at det har satt seg i deg?',
    task: 'Del med partneren din: Når var du sist truly glad?',
  },
  5: {
    theme: 'Stille stunder',
    title: 'Deg selv',
    reflection: 'Hvor føler du deg mest deg selv — når er du helt deg sjøl?',
    task: 'Del med partneren din: Hvor føler du deg mest deg selv?',
  },
  6: {
    theme: 'Vaner og rutiner',
    title: 'Hverdagslivet',
    reflection: 'Hva ser en vanlig dag for deg ut? Hva fungerer, hva vil du endre?',
    task: 'Del med partneren din: Hvordan ser din perfekte morgen ut?',
  },
  7: {
    theme: 'Samtaler',
    title: 'Gode samtaler',
    reflection: 'Tenk på en god samtale du har hatt. Hva gjorde den så spesiell?',
    task: 'Del med partneren din: Tenk på en god samtale du har hatt.',
  },
  8: {
    theme: 'Hva gir deg energi?',
    title: 'Energi og driv',
    reflection: 'Er det mennesker, natur, skapende arbeid, eller noe annet? Hva får deg til å lyse opp?',
    task: 'Del med partneren din: Hva gir deg mest energi i hverdagen?',
  },
  9: {
    theme: 'Hvem har formet deg?',
    title: 'Formende krefter',
    reflection: 'Hvem i familien eller livet ditt har hatt størst innflytelse på deg?',
    task: 'Del med partneren din: Hvem har formet deg mest?',
  },
  10: {
    theme: 'Å leve ut',
    title: 'Drømmer du vil leve ut',
    reflection: 'Hva er noe du alltid har villet prøve — men ennå ikke har gjort?',
    task: 'Del med partneren din: Hva er noe du alltid har ønsket å prøve?',
  },
  11: {
    theme: 'Konflikter og forskjeller',
    title: 'Håndtering av uenigheter',
    reflection: 'Hvordan håndterer du det når dere er uenige? Hva trenger du av partneren da?',
    task: 'Del med partneren din: Hvordan håndterer du konflikter?',
  },
  12: {
    theme: 'Å vise følelser',
    title: 'Følelsesuttrykk',
    reflection: 'Hvordan viser du noe du brenner for — eller holder du det inne til først noen stoler på deg?',
    task: 'Del med partneren din: Hvordan viser du dine egne følelser?',
  },
  13: {
    theme: 'Drømmer og visjoner',
    title: 'Framtidas drømmer',
    reflection: 'Hvis alt kunne blitt som du ville — hva hadde da vært annerledes om 5 år?',
    task: 'Del med partneren din: Hva er dine største framtidsdrømmer?',
  },
  14: {
    theme: 'Fysisk tiltrukning',
    title: 'Nærhet og bilder',
    reflection: 'Hva tenker du om fysisk nærhet i et nytt forhold? Dette er et naturlig sted å vise bilder dersom dere ønsker det.',
    task: 'Del med partneren din: Tenk over hva nærhet betyr for deg.',
  },
  15: {
    theme: 'Å stole',
    title: 'Tillit og tillitsbygging',
    reflection: 'Hva trenger du for virkelig å stole på noen? Kan tillit bygges raskt, eller må den vokse?',
    task: 'Del med partneren din: Hva er viktigst for tillit?',
  },
  16: {
    theme: 'Sårbarhet',
    title: 'Å vise seg sårbar',
    reflection: 'Når var du sist sårbar mot noen? Hva skjedde etterpå — godt eller vondt?',
    task: 'Del med partneren din: Når var du sist åpen om dine følelser?',
  },
  17: {
    theme: 'Drømmer sammen',
    title: 'Felles framtidsvisjon',
    reflection: 'Hva ønsker du at dere skal ha bygd sammen om 5 år? Et hjem, reiser, erfaringer?',
    task: 'Del med partneren din: Hva vil du bygge sammen med en partner?',
  },
  18: {
    theme: 'Å gi og ta',
    title: 'Balansen i et forhold',
    reflection: 'Hvordan vet du når du gir for mye — eller tar for lite i et forhold?',
    task: 'Del med partneren din: Hvordan balanserer gi og ta?',
  },
  19: {
    theme: "Livets vanskelige øyeblikk",
    title: 'Å møte det tunge',
    reflection: 'Hva gjør du når ting blir vanskelig? Trekker du deg, åpner du deg, eller stenger du noen ute?',
    task: 'Del med partneren din: Hvordan håndterer du vanskelige perioder?',
  },
  20: {
    theme: 'Framtidsvisjon',
    title: 'Ti år ut i framtida',
    reflection: 'Hvordan forestiller du deg et godt liv om ti år? Hvilken rolle spiller partneren der?',
    task: 'Del med partneren din: Hvordan ser du for deg livet ditt om 10 år?',
  },
  21: {
    theme: 'Å si nei',
    title: 'Grenser og selvrespekt',
    reflection: 'Hva er noen grenser du har lært at det er viktig å sette — og hvorfor?',
    task: 'Del med partneren din: Hva er dine viktigste grenser?',
  },
  22: {
    theme: 'Tåre og latter',
    title: 'De dype følelsene',
    reflection: 'Hva får deg til å grine? Hva får deg til å le så magen gjør vondt?',
    task: 'Del med partneren din: Hva får deg til å grine? Hva får deg til å le?',
  },
  23: {
    theme: 'Å være partner',
    title: 'Deg som partner',
    reflection: 'Hva tror du er det viktigste du bidrar med som partner i et forhold?',
    task: 'Del med partneren din: Hva bidrar du mest med som partner?',
  },
  24: {
    theme: 'Sammen eller hver for seg',
    title: 'Fellesskap og autonomi',
    reflection: 'Hvordan balanserer du fellesskap og egenrom — og hva trenger dere av hverandre?',
    task: 'Del med partneren din: Hvordan finner dere balansen mellom vi og meg?',
  },
  25: {
    theme: 'Å møte framtiden',
    title: 'Utsikter som par',
    reflection: 'Hva er det største dere står over som par? Hva ser dere fram til?',
    task: 'Del med partneren din: Hva ser du mest frem til med dere to?',
  },
  26: {
    theme: 'Grunnlighet',
    title: 'Takk og anerkjennelse',
    reflection: 'Hva ønsker du å si til partneren din som takk for reisen deres så langt?',
    task: 'Del med partneren din: Si takk til partneren din for noe de har gjort.',
  },
  27: {
    theme: 'Å fortsette å vokse',
    title: 'Vekst som par',
    reflection: 'Hvordan vil dere gjøre det godt — selv når hverdagen blir hverdag?',
    task: 'Del med partneren din: Hvordan kan dere holde gnisten i live?',
  },
  28: {
    theme: 'Å gi slipp på frykt',
    title: 'Frykter og utroskap',
    reflection: 'Er det en frykt du har med deg fra tidligere forhold? Har den endret seg her?',
    task: 'Del med partneren din: Hva må dere gjøre for å skape trygghet?',
  },
  29: {
    theme: 'Din mest ærlige refleksjon',
    title: 'Speilet',
    reflection: 'Hva har denne reisen lært deg om deg selv og hva du trenger?',
    task: 'Del med partneren din: Hva har denne reisen lært deg?',
  },
  30: {
    theme: 'Nå videre — sammen?',
    title: 'Veien videre',
    reflection: 'Tre år inn i framtiden — hva ønsker du at dere to har oppnådd?',
    task: 'Del med partneren din: Hva ønsker dere å ha oppnådd om 3 år?',
  },
};

export function getDayContent(day: number) {
  return bokmalTexts[day] || {
    theme: 'Refleksjon',
    title: 'Tenk over dagen',
    reflection: 'Hva har den dagen betydning for deg? Del gjerne med partneren din.',
    task: 'Del med partneren din: Hva tenker du om denne dagen?',
  };
}

export function PremiumJourneyDayView({ content }: { content: DayContentProps }) {
  const dayContent = getDayContent(content.day);

  return (
    <div style={{
      maxWidth: '700px',
      margin: '0 auto',
      animation: 'fadeIn 500ms ease-out',
    }}>
      {/* Dag-hoved */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{
          fontSize: '60px',
          fontWeight: '600',
          background: 'linear-gradient(90deg, #D4AF37, #E8C766)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: '1.2',
        }}>
          Dag {content.day}
        </div>
        <div style={{ fontSize: '20px', color: '#D4AF37', fontWeight: '500', marginTop: '8px' }}>
          {dayContent.title}
        </div>
        <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.5)', marginTop: '4px' }}>
          {dayContent.theme} · {content.phase}
        </div>
      </div>

      {/* Refleksjon — glass-panel med gull-left-border */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.04)',
        backdropFilter: 'blur(12px)',
        borderLeft: '4px solid #D4AF37',
        borderRadius: '0 20px 20px 20px',
        padding: '32px',
      }}>
        <div style={{ fontSize: '14px', color: '#D4AF37', fontWeight: '500', marginBottom: '12px' }}>
          Refleksjon for dagen
        </div>
        <div style={{ fontSize: '18px', color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.7', fontStyle: 'italic' }}>
          {content.reflection}
        </div>
      </div>

    </div>
  );
}