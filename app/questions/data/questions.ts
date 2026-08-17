/**
 * Tosom – Spørsmålmodul (Bli Kjent)
 * 8 kategorier med 15–20 spørsmål per kategori.
 * Spørsmålene er designet for voksne (21+) og støtter en dyp, men rolig utforskning.
 */

export const questionCategories = {
  personlighet: [
    "Hva er den ene egenskapen ved deg som andre ofte overraskes over?",
    "Hvordan beskriver du den perfekte dagen uten å tenke på andre?",
    "Hva er noe du har endret syn på de siste årene?",
    "Hva får deg til å føle deg mest som deg selv?",
    "Hva er en overbevisning du har som kanskje er litt uvanlig?",
    "Når føler du deg mest energisk i løpet av en dag?",
    "Hva er noe du aldri vil slutte med, uansett hva?",
    "Hva betyr mest for deg når du skal vurdere om et valg var 'riktig'?",
    "Hvordan har din forståelse av deg selv endret seg det siste året?",
    "Hva er noe du ønsker å bli bedre i med tanke på deg selv?",
    "Hva er din personlige 'superkraft' som kanskje ikke er like åpenbar for andre?",
    "Hva er noe du gjerne ville lært deg å gjøre, men ennå ikke har?",
    "Hva er noe du er stolt av som kanskje få vet om?",
    "Hvordan tar du deg selv videre når du føler deg fastkjørt?",
    "Hva er det som gir deg mest mening i livet akkurat nå?",
    "Hva er noe du ofte hører at 'alle' liker, men som du egentlig ikke gjør?",
    "Hva er noe du aldri har fortalt noen om dine dypeste interesser?",
    "Hva er noe du vet du vil oppnå i livet?",
    "Hva er noe du har gjort og angret på?",
    "Hva er noe du er redd for å innrømme overfor deg selv?",
  ],
  forhold: [
    "Hva trenger du mest av for å føle deg trygg i et forhold?",
    "Hvordan behandler du konflikter når de oppstår?",
    "Hva er den viktigste leksjonen du har lært om kjærlighet?",
    "Hva mener du er forskjellen mellom å elske noen og å trenge noen?",
    "Hvordan viser du kjærlighet mest naturlig?",
    "Hva er noe du aldri vil kompromisse med i et forhold?",
    "Hva gjør du når du føler deg krenket i en relasjon?",
    "Hva er din største frykt når det gjelder nærhet?",
    "Hva betyr «lojalitet» for deg i praksis?",
    "Hvordan vet du at noen virkelig bryr seg om deg?",
    "Hva er noe du ønsker å lære av din partner om relasjoner?",
    "Hvordan opplever du forskjellen mellom å gi og motta kjærlighet?",
    "Hva er noe du trenger å høre oftere fra en partner?",
    "Hvordan påvirker avstand en relasjon for deg?",
    "Hva er noe du ønsker å gjøre annerledes enn det du vokste opp med?",
    "Hva er din største styrke som partner?",
    "Hva er noe du jobber med å bli bedre i som partner?",
    "Hvordan definerer du «trofasthet» utover fysisk trohet?",
    "Hva er noe du trenger tid til i en relasjon?",
    "Hva er noe som får deg til å føle deg mest forent med en partner?",
  ],
  fremtid: [
    "Hva ser du for deg det første året i et nytt kapittel?",
    "Hva er noe du ønsker å ha oppnådd om fem år som du ikke har nådd ennå?",
    "Hvordan vil du at hverdagen din skal se ut om 10 år?",
    "Hva er en drøm du har latt ligge – men som ennå lever?",
    "Hva vil du bli husket for?",
    "Hva er noe du trenger å slippe fra deg for å gå mot neste kapittel?",
    "Hvordan vil du at forholdet ditt skal utvikle seg over tid?",
    "Hva er noe du vil bygge sammen med noen du er glad i?",
    "Hva er noe du vil prøve før du føler deg klar for et seriøst forpliktelser?",
    "Hva er noe du tror vil utfordre deg mest i årene som kommer?",
    "Hva er noe du vil endre på måten verden fungerer?",
    "Hvordan vil du at karrieren din skal se ut om fem år?",
    "Hva er noe du vil oppleve i livet – før det er for sent?",
    "Hva er noe du tror vil forme deg mest som person i årene som kommer?",
    "Hva er noe du vil gi videre til neste generasjon?",
    "Hva er noe du vil at partneren din skal være mest glad i med deg?",
    "Hva er noe du vil reise rundt – alene eller sammen?",
    "Hva er noe du vil skape som varer lenger enn deg selv?",
    "Hva er noe du vil endre på i samfunnet?",
    "Hva er noe du vil lære deg i løpet av livet?",
  ],
  humor: [
    "Hva er den mest absurde tingen du har falt for?",
    "Hva er noe du alltid latterliggjør hos deg selv?",
    "Hva er en spøk du aldri blir lei av?",
    "Hva er noe du alltid har villet prøve, men aldri har samlet mod?",
    "Hva er noe morsomt du tror mange kan relate til?",
    "Hva er den rareste ting du har spist – og likte det?",
    "Hva er noe du alltid griner av, selv om det ikke er morsomt?",
    "Hva er noe du tror alle har tenkt på – men aldri snakker om?",
    "Hva er noe du har gjort og blitt lei av deg selv for?",
    "Hva er noe du håper aldri skjer med deg?",
    "Hva er noe du alltid har villet prøve med en venn?",
    "Hva er noe morsomt du har opplevd på reise?",
    "Hva er noe du tenker på som 'perfekt' for en bestemt anledning?",
    "Hva er noe du alltid har tenkt på, men aldri spurt noen om?",
    "Hva er noe du vil gjort som barn – men aldri fikk lov til?",
    "Hva er noe du vil prøve som du vet du vil være dårlig i?",
    "Hva er noe du alltid vil si ja til, uansett hva?",
    "Hva er noe du alltid vil si nei til – selv om det er morsomt?",
    "Hva er noe som alltid gjør deg glad, uansett hvor dårlig dagen er?",
    "Hva er noe du vil skrive opp på en liste en gang – før det er for sent?",
  ],
  barndom: [
    "Hva er noe fra barndommen som fortsatt preger deg?",
    "Hva var din favorittbeskjeftigelse som barn?",
    "Hva lærte foreldrene dine deg om verden – og hva var de feil i?",
    "Hva er noe du husker fra barndommen som kjentes enormt på den tid?",
    "Hva er noe du ønsker at noen skulle fortalt deg som liten?",
    "Hva er noe fra familien din som du vil beholde – og noe du vil slippe?",
    "Hvem var personen som ga deg mest trygghet som barn?",
    "Hva er noe du føler at arvet fra oppveksten?",
    "Hva er noe du føler at du mistet for tidlig?",
    "Hva var det som kjentes som 'voksen' for deg som barn?",
    "Hva er noe du husker fra barndommen som endret deg?",
    "Hva er noe du aldri glemt har fra skoletiden?",
    "Hva er noe du aldri vil glemt fra barndommen?",
    "Hva er noe du vil gi videre til dine barn (om noen)?",
    "Hva er noe fra barndommen som gjør at du er den du er?",
    "Hva er noe du ønsker du kunne fortalt din yngre jeg?",
    "Hva er noe du ble belønnet for som barn?",
    "Hva er noe du ble straffet for som barn?",
    "Hva er noe fra barndommen som du er glad for nå?",
    "Hva er noe du ville ønsket du hadde fått lov til?",
  ],
  verdier: [
    "Hva er de tre viktigste verdiene dine?",
    "Hva betyr «suksess» for deg?",
    "Hva er noe du alltid vil stå for – uansett konsekvens?",
    "Hva er noe du vil ofre mye for?",
    "Hva er noe du tror er viktigere enn det folk flest innrømmer?",
    "Hva er noe du tror flere bør bry seg mer om?",
    "Hva er noe du har måttet velge mellom som definerte deg?",
    "Hva er noe du vil leve etter – ikke bare si at du tror på?",
    "Hva er noe du mener er 'rett' selv om ingen andre holder med?",
    "Hva er noe du vil prioritere over karriere?",
    "Hva er noe du tror gir livet mest mening?",
    "Hva er noe du vil gjøre annerledes enn det samfunnet forventer?",
    "Hva er noe du vil si fra deg i møte med urettferdighet?",
    "Hva er noe du vil beskytte – uansett kostnad?",
    "Hva er noe du vil bygge i denne verdenen?",
    "Hva er noe du vil at verdenen skal lære av deg?",
    "Hva er noe du vil at skal være grunnen til at folk er glad i deg?",
    "Hva er noe du vil at skal være grunnen til at folk husker deg?",
    "Hva er noe du vil at skal være grunnen til at folk elsker deg?",
    "Hva er noe du vil at skal være grunnen til at folk husker deg?",
    "Hva er noe du vil at skal være grunnen til at folk elsker deg?",
  ],
  følelser: [
    "Hva er noe du trenger å tillate deg selv å føle – men ikke gjør?",
    "Hva er noe du gruer deg mest til å slippe?",
    "Hva er noe du er mest redd for å miste?",
    "Hva er noe du er mest takknemlig for – også om det var vanskelig?",
    "Hva er noe som gjør deg mest sårbar?",
    "Hva er noe du vil tillate deg selv å ønske – uten skyldfølelse?",
    "Hva er noe som gjør deg mest stolt?",
    "Hva er noe du vil tillate deg selv å trenge?",
    "Hva er noe som gjør deg mest takknemlig?",
    "Hva er noe du vil slippe – men ennå ikke har?",
    "Hva er noe som gjør deg mest usikker på deg selv?",
    "Hva er noe som gjør deg mest lykkelig?",
    "Hva er noe som gjør deg mest rolig?",
    "Hva er noe som gjør deg mest engstelig?",
    "Hva er noe som gjør deg mest sint?",
    "Hva er noe som gjør deg mest trist?",
    "Hva er noe som gjør deg mest forelsket?",
    "Hva er noe som gjør deg mest takknemlig?",
    "Hva er noe som gjør deg mest stolt?",
    "Hva er noe som gjør deg mest usikker på deg selv?",
  ],
  moden: [
    "Hva er noe du ønsker å utforske med en partner – på et moden og dypt nivå?",
    "Hva er noe du ønsker å forstå bedre om intimt tilknytningsmønster?",
    "Hva er noe du vil si til din egen sårbarhet – og hvordan du vil tillate deg selv å bli sett i dine mørkeste øyeblikk?",
    "Hva er noe du vil utforske med en partner når dere er helt trygge?",
    "Hva er noe du vil utforske med en partner om dere føler trygghet?",
    "Hva er noe du vil utforske med en partner om intensitet og nærhet?",
    "Hva er noe du vil utforske med en partner om grenser og tillit?",
    "Hva er noe du vil utforske med en partner om sårbarhet?",
    "Hva er noe du vil utforske med en partner om seksualitet og intimitet?",
    "Hva er noe du vil utforske med en partner om kjemi og tilknytning?",
    "Hva er noe du vil utforske med en partner om dype følelser?",
    "Hva er noe du vil utforske med en partner om kropp og sinn?",
    "Hva er noe du vil utforske med en partner om ydmykelse og tillit?",
    "Hva er noe du vil utforske med en partner om sårbarhet og styrke?",
    "Hva er noe du vil utforske med en partner om åpenhet og trygghet?",
    "Hva er noe du vil utforske med en partner om kjærlighet og begjær?",
    "Hva er noe du vil utforske med en partner om intimt liv?",
    "Hva er noe du vil utforske med en partner om nære relasjoner?",
    "Hva er noe du vil utforske med en partner om kjemi?",
    "Hva er noe du vil utforske med en partner om tilknytning?",
  ],
};

/**
 * Henter et tilfeldig spørsmål fra en gitt kategori.
 * Bruker MemoryEngine for anti-duplikat – ekskluder spørsmål i questionHistory.
 * @param category Kategori-nøkkel (f.eks. "personlighet", "forhold", etc.)
 * @returns Et tilfeldig spørsmål, eller null hvis kategorien ikke finnes
 */
export function getRandomQuestion(category: string): string | null {
  const list = questionCategories[category as keyof typeof questionCategories];
  if (!list || list.length === 0) return null;

  // Hent spørsmåls-historikk fra MemoryEngine
  let history: string[] = [];
  if (typeof window !== 'undefined') {
    const { memoryEngine } = require('@/app/dashboard/core/MemoryEngine');
    history = memoryEngine.getQuestionHistory();
  }

  // Filtrer bort allerede spurte spørsmål
  const filtered = list.filter(q => !history.includes(q));

  // Hvis alle spørsmål er brukt, fallback til hele lista
  const source = filtered.length > 0 ? filtered : list;

  return source[Math.floor(Math.random() * source.length)];
}

/**
 * Henter alle kategorier med antall spørsmål.
 */
export function getCategoriesWithCounts(): Array<{ key: string; label: string; count: number }> {
  const categoryLabels: Record<string, string> = {
    personlighet: "Personlighet & identitet",
    forhold: "Forhold & tilknytning",
    fremtid: "Fremtid & livsvisjon",
    humor: "Lek & humor",
    barndom: "Barndom & røtter",
    verdier: "Verdier & livsstil",
    følelser: "Følelser & emosjonell dybde",
    moden: "Moden nysgjerrighet (21+)",
  };

  return Object.entries(questionCategories).map(([key, questions]) => ({
    key,
    label: categoryLabels[key] || key,
    count: questions.length,
  }));
}