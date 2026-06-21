/**
 * ToSom – Onboarding spørsmål og data for alle 10 steg.
 */

export const step0Data = {
  title: 'Grunnprofil',
  subtitle: 'La oss starte med det grunnleggende. Dette hjelper oss å finne mennesker som passer deg.',
  example: '178 cm, aktiv, liker turer men ikke fanatisk.',
  fields: {
    identityName: { label: 'Hva vil du at vi skal kalle deg?', type: 'input', placeholder: 'Fornavn', example: 'Ane' },
    age: { label: 'Alder', type: 'input', typeSpec: 'number', placeholder: '25', min: 23, max: 99 },
    gender: { label: 'Ditt kjønn', type: 'select', options: [
      { value: 'man', label: 'Man' },
      { value: 'kvinne', label: 'Kvinne' },
      { value: 'non-binær', label: 'Non-binær' },
      { value: 'annen', label: 'Annet' },
      { value: 'prefer ikke å si', label: 'Fører ikke å oppgi' },
    ]},
    seekingGender: { label: 'Hva søker du?', type: 'select', options: [
      { value: 'man', label: 'Man' },
      { value: 'kvinne', label: 'Kvinne' },
      { value: 'både', label: 'Begge deler' },
      { value: 'annen', label: 'Annen' },
    ]},
    height: { label: 'Høyde (cm)', type: 'input', typeSpec: 'number', placeholder: '178', min: 100, max: 250 },
    bodyType: { label: 'Kroppstype', type: 'select', options: [
      { value: 'slank', label: 'Slank' },
      { value: 'normal', label: 'Normal' },
      { value: 'muskelig', label: 'Muskuløs' },
      { value: 'fullscreen', label: 'Fullstendig' },
      { value: 'annen', label: 'Annen' },
    ]},
    lifestyle: { label: 'Livsstil', type: 'select', options: [
      { value: 'aktiv', label: 'Aktiv' },
      { value: 'balanced', label: 'Balansert' },
      { value: 'rolig', label: 'Roj' },
      { value: 'kreativ', label: 'Kreativ' },
      { value: 'uxing', label: 'Uxning' },
    ]},
    smoking: { label: 'Røyking / snus', type: 'select', options: [
      { value: 'nei', label: 'Nei' },
      { value: 'ja-røyker', label: 'Ja, røyker' },
      { value: 'ja-snuser', label: 'Ja, sner' },
      { value: 'bade', label: 'Begge deler' },
    ]},
    religion: { label: 'Religion / livssyn', type: 'select', options: [
      { value: 'christen', label: 'Kristen' },
      { value: 'muslim', label: 'Muslim' },
      { value: 'jøde', label: 'Jode' },
      { value: 'hedning', label: 'Hending' },
      { value: 'ateist', label: 'Ateist' },
      { value: 'agnostiker', label: 'Agnostiker' },
      { value: 'annen', label: 'Annen' },
      { value: 'ingen', label: 'Ingen' },
    ]},
    children: { label: 'Barn?', type: 'select', options: [
      { value: 'nei', label: 'Nei' },
      { value: 'ja', label: 'Ja' },
    ]},
    wantChildren: { label: 'Ønsker du barn?', type: 'select', options: [
      { value: 'nei', label: 'Nei' },
      { value: 'ja', label: 'Ja' },
      { value: 'uke', label: 'Uke' },
    ]},
    city: { label: 'Bosted', type: 'input', placeholder: 'Oslo', example: 'Bergen' },
    distancePref: { label: 'Maks avstand (km)', type: 'slider', min: 5, max: 500, step: 5, labelLeft: '5 km', labelRight: '500 km' },
    agePrefMin: { label: 'Minste alder du søker', type: 'slider', min: 23, max: 60, labelLeft: '23', labelRight: '60' },
    agePrefMax: { label: 'Maks alder du søker', type: 'slider', min: 25, max: 80, labelLeft: '25', labelRight: '80' },
  },
};

export const step1Data = {
  title: 'Personlighet & identitet',
  subtitle: 'Dette hander ikkje om å vere perfekt, men om å bli forstod.',
  example: 'Jeg er rolig, men kan være spontan når jeg føler meg trygg.',
  questions: [
    { name: 'selfDesc', label: 'Hvordan vil du beskrive deg selv når du er på ditt beste?', placeholder: 'Beskriv deg selv...', example: 'Jeg er en blanding av rolig og spontan...' },
    { name: 'energyGiver', label: 'Hva gir deg energi?', placeholder: 'Det som fyller meg med energi...', example: 'Dype samtaler, natur, musikk...' },
    { name: 'energyDrainer', label: 'Hva tapper deg for energi?', placeholder: 'Det som tapper meg...', example: 'Støy, overfladiske samtal...' },
    { name: 'pressureReact', label: 'Hvordan reagerer du under press?', placeholder: 'Når det skjer...', example: 'Jeg blir stille og trenger tid...' },
    { name: 'quirk', label: 'Hva er en uvane du ler av deg selv?', placeholder: 'En rar vane jeg har...', example: 'Jeg snakker med meg selv...' },
  ],
};

export const step2Data = {
  title: 'Tilknytning & trygghet',
  subtitle: 'Dette hjelper oss å matche deg med noen som møter deg på ein god måte.',
  example: 'Jeg trenger tydelige ord om meg trygg, men også fysiske uttrykk.',
  questions: [
    { name: 'safetyNeed', label: 'Hva får deg til å føle deg trygg i et forhold?', placeholder: 'Det som gjør meg trygg...', example: 'Når noen er ærlige og konsekvente...' },
    { name: 'insecurityTrigger', label: 'Hva gjør deg utrygg?', placeholder: 'Det som gjør meg utrygg...', example: 'Når noe endrer seg plutselig...' },
    { name: 'sadnessNeed', label: 'Hva trenger du når du er lei deg?', placeholder: 'Når jeg er lei meg...', example: 'Når noen bare er der, uten å løse noe...' },
    { name: 'stressNeed', label: 'Hva trenger du når du er stresset?', placeholder: 'Når jeg er stresset...', example: 'Rom for meg selv og tid...' },
    { name: 'importantBoundary', label: 'Hva er en grense som er viktig for deg?', placeholder: 'Min grense...', example: 'Jeg trenger ikke å bli redd hver gang...' },
  ],
};

export const step3Data = {
  title: 'Kommunikasjon & konfliktstil',
  subtitle: 'Vi vil forstå hvordan du kommuniserer – og hvordan vi kan støtte deg.',
  example: 'Jeg liker å lytte først, og så dele når jeg har funnet ord.',
  questions: [
    { name: 'commStyle', label: 'Hvordan liker du å kommunisere?', placeholder: 'Min måte å kommunisere på...', example: 'Jeg er bedre på å skrive enn å snakke...' },
    { name: 'conflictStyle', label: 'Hv håndterer du konflikter?', placeholder: 'Når det blir konflikt...', example: 'Jeg trenger tid før jeg snakker...' },
    { name: 'calmingHelp', label: 'Hva hjelper deg å roe deg ned?', placeholder: 'Det som roer meg...', example: 'Å gå en tur, puste dypt, lytte til musikk...' },
    { name: 'trigger', label: 'Hva trigger deg?', placeholder: 'Det som trigger meg...', example: 'Når jeg føler jeg blir ikke hørt...' },
    { name: 'trustBuilder', label: 'Hva gjør deg trygg i en samtale?', placeholder: 'Det som gjør meg trygg...', example: 'Når noen sier hva de mener, uten skjulte meninger...' },
  ],
};

export const step4Data = {
  title: 'Kjærlighetsspråk & nærhet',
  subtitle: 'Alle gir og mottar kjærlighet på ulike måter. Hva er din måte?',
  example: 'Jeg viser kjærlighet ved å gjøre ting for noen, og jeg vil bli fortalt at jeg blir elsket.',
  questions: [
    { name: 'loveGive', label: 'Hvordan viser du kjærlighet mest naturlig?', placeholder: 'Så viser jeg kjærlighet...', example: 'Jeg lager mat til noen, eller hjelper dem med noe...' },
    { name: 'loveReceive', label: 'Hvordan liker du å motta kjærlighet?', placeholder: 'Så ønsker jeg det...', example: 'Ord om at jeg blir satt pris på...' },
    { name: 'closenessBuilder', label: 'Hva får deg til å føle deg nær noen?', placeholder: 'Det som får meg til å føle nærhet...', example: 'Når vi sitter i stillhet sammen og det er greit...' },
    { name: 'distanceCreator', label: 'Hva skaper avstand?', placeholder: 'Det som skaper avstand...', example: 'Når noen er distant uten å forklare...' },
    { name: 'smallThing', label: 'Hva er en liten ting som betyr mye?', placeholder: 'Den lille ting...', example: 'Når noen husker at jeg tar te svart...' },
  ],
};

export const step5Data = {
  title: 'Livsstil & verdier',
  subtitle: 'Hva prioriterer du i livet? Hva slags hverdag drømmer du om?',
  example: 'Jeg prioriterer dype relasjoner høyere enn høy status.',
  questions: [
    { name: 'highPriority', label: 'Hva prioriterer du høyt i livet?', placeholder: 'Det jeg setter først...', example: 'Famili, helse, og personlig vekst...' },
    { name: 'lowPriority', label: 'Hva prioriterer du lavt?', placeholder: 'Det jeg ikke bryr meg så mye om...', example: 'Status, materielle ting, sosiale medier...' },
    { name: 'goodDay', label: 'Hvordan ser en god hverdag ut for deg?', placeholder: 'En perfekt dag...', example: 'Kaffe i solen, jobbe med noe jeg bryr meg om, og tilbringe tid med noen jeg er glad i...' },
    { name: 'desiredLifestyle', label: 'Hva er en livsstil du ønsker deg?', placeholder: 'Drømmelivsstilen min...', example: 'Ro, med rom for kreativitet og reising...' },
    { name: 'undesiredLifestyle', label: 'Hva er en livsstil du IKKE ønsker deg?', placeholder: 'Det jeg vil unngå...', example: 'En hverdag der jeg bare jobber og ikke har tid for meg selv...' },
  ],
};

export const step6Data = {
  title: 'Framtid & visjon',
  subtitle: 'Kor ser du for deg sjølv og livet ditt om nokre år?',
  example: 'Jeg vil bygge noe meningsfullt – med meg selv og med noen jeg er glad i.',
  questions: [
    { name: 'futureVision', label: 'Hvordan ser en god fremtid ut for deg?', placeholder: 'Min framtid...', example: 'En der jeg har vokst som menneske og har dype relasjonar...' },
    { name: 'dreamGoal', label: 'Hva er en drøm du jobber mot?', placeholder: 'Drømmen mi...', example: 'Å skrive ei bok, eller reise Japan...' },
    { name: 'buildTogether', label: 'Hva vil du bygge sammen med noen?', placeholder: 'Det jeg vil bygge med noen...', example: 'En trygg hverdag, med felles minner og felles drømmer...' },
    { name: 'experienceAlone', label: 'Hva vil du oppleve alene?', placeholder: 'Det jeg vil oppleve alene...', example: 'Å meditere i ro, eller kjøre roadtrip uten mål...' },
    { name: 'experienceTogether', label: 'Hva vil du oppleve som par?', placeholder: 'Det jeg vil oppleve med noen...', example: 'Å reise verden rundt, lære av hverandre, bli eldre sammen...' },
  ],
};

export const step7Data = {
  title: 'Lek, humor & personlighet',
  subtitle: 'La oss få litt lett oppi alt det dype. Humor avslører mye.',
  example: 'Jeg har en tendens til å spøke med at jeg er professionell overtenker.',
  questions: [
    { name: 'laughterTrigger', label: 'Hva får deg til å le?', placeholder: 'Det som får meg til å le...', example: 'Dyrevideoar, absurd humor, og overraskande situasjonar...' },
    { name: 'quirkyHabit', label: 'Hva er en rar vane du har?', placeholder: 'En rar vane jeg har...', example: 'Jeg sorterer sukkerbitene etter farge...' },
    { name: 'guiltyPleasure', label: 'Hva er et guilty pleasure?', placeholder: 'Det jeg er litt flau for...', example: 'Jeg elsker reality-TV og spiser is til frokost...' },
    { name: 'totallyYou', label: 'Hva er noe du gjør som er helt deg?', placeholder: 'Det som er helt meg...', example: 'Jeg lager alltid spillelister til alle anledninger...' },
    { name: 'partnerWouldLaugh', label: 'Hva er noe partneren din ville le av?', placeholder: 'Det partneren ville le av...', example: 'Måten jeg danser når ingen ser...' },
  ],
};

export const step8Data = {
  title: 'Moden nysgjerrighet',
  subtitle: 'Trygt, voksen og rolig. Vi stiller dype spørsmål om nærhet og sårbarhet.',
  example: 'Jeg trenger tid for å åpne meg, og jeg setter pris på ærlighet.',
  questions: [
    { name: 'intimacySafety', label: 'Hva får deg til å føle deg trygg i nærhet?', placeholder: 'Det som gjør meg trygg i nærhet...', example: 'Når noen er ærlige og ikke spiller spill...' },
    { name: 'comfortTrigger', label: 'Hva får deg til å føle deg komfortabel?', placeholder: 'Det som gjør meg komfortabel...', example: 'Ro, forutsigbarhet, og rom for egen tempo...' },
    { name: 'intimacyBoundary', label: 'Hva er en grense du setter i intimme situasjoner?', placeholder: 'Min grense...', example: 'Jeg trenger alltid å kunne si nei uten konsekvenser...' },
    { name: 'preferredIntimacy', label: 'Hva er en form for nærhet du liker?', placeholder: 'Den nærhetstypen jeg liker...', example: 'Kroppsnærhet, men bare når jeg er klar...' },
    { name: 'timeNeed', label: 'Hva trenger du tid for?', placeholder: 'Det jeg trenger tid til...', example: 'Å føle meg trygg før jeg gir meg selv...' },
  ],
};

export const step9Data = {
  title: 'Matching-preferanser',
  subtitle: 'Hva er viktig for deg når du skal matche med noen? Du kan alltid justere senere.',
  example: 'Jeg setter ærlighet høyt, men la ikke alt bestemme.',
  questions: [
    { name: 'politicsImportance', label: 'Hvor viktig er politikk for deg i en match?', placeholder: '', type: 'slider', min: 0, max: 10 },
    { name: 'religionImportance', label: 'Hvor viktig er religion for deg i en match?', placeholder: '', type: 'slider', min: 0, max: 10 },
    { name: 'dietPreference', label: 'Kostholdpreferanse', placeholder: '', type: 'select', options: [
      { value: 'ingen', label: 'Ingen' },
      { value: 'vegetar', label: 'Vegetar' },
      { value: 'vegan', label: 'Vegansk' },
      { value: 'fisket', label: 'Fisket' },
      { value: 'ingen preferanse', label: 'Ingen preferanse' },
    ]},
    { name: 'sleepSchedule', label: 'Søvnrytme', placeholder: '', type: 'select', options: [
      { value: 'tidlig', label: 'Tidlig opp, tidlig opp' },
      { value: 'normal', label: 'Normal' },
      { value: 'nattemann', label: 'Nattemann' },
      { value: 'uke', label: 'Uke' },
    ]},
    { name: 'pets', label: 'Husdyr', placeholder: '', type: 'select', options: [
      { value: 'ingen', label: 'Ingen' },
      { value: 'ja', label: 'Ja' },
      { value: 'uke', label: 'Uke' },
    ]},
    { name: 'travelFreq', label: 'Reising', placeholder: '', type: 'select', options: [
      { value: 'mye', label: 'Mye' },
      { value: 'noe', label: 'Noe' },
      { value: 'lite', label: 'Lite' },
      { value: 'ingen', label: 'Ingen' },
    ]},
    { name: 'alcoholFreq', label: 'Alkohol / festing', placeholder: '', type: 'select', options: [
      { value: 'daglig', label: 'Daglig' },
      { value: 'ukentlig', label: 'Ukentlig' },
      { value: 'sjeldent', label: 'Sjelden' },
      { value: 'aldri', label: 'Aldri' },
    ]},
    { name: 'ambitionLevel', label: 'Ambisjonsnivå', placeholder: '', type: 'select', options: [
      { value: 'hoy', label: 'Høy' },
      { value: 'middels', label: 'Middels' },
      { value: 'lav', label: 'Lav' },
      { value: 'uke', label: 'Uke' },
    ]},
    { name: 'structureSpontaneity', label: 'Struktur vs spontanitet', placeholder: '', type: 'select', options: [
      { value: 'struktur', label: 'Jeg er mer struktur' },
      { value: 'balanse', label: 'Balanse' },
      { value: 'spontan', label: 'Jeg er mer spontan' },
      { value: 'uke', label: 'Uke' },
    ]},
    { name: 'introExtrovert', label: 'Introvert / Ekstrovert', placeholder: '', type: 'select', options: [
      { value: 'introvert', label: 'Introvert' },
      { value: 'ambivert', label: 'Ambivert' },
      { value: 'ekstrovert', label: 'Ekstrovert' },
      { value: 'uke', label: 'Uke' },
    ]},
    { name: 'attachmentStyle', label: 'Tilknytningsstil (selvrapportert)', placeholder: '', type: 'select', options: [
      { value: 'trygg', label: 'Trygg' },
      { value: 'ukomfortabel', label: 'Ukomfortabel' },
      { value: 'ambivalent', label: 'Ambivalent' },
      { value: 'uke', label: 'Uke' },
    ]},
  ],
};

export const allSteps = [
  step0Data,
  step1Data,
  step2Data,
  step3Data,
  step4Data,
  step5Data,
  step6Data,
  step7Data,
  step8Data,
  step9Data,
];