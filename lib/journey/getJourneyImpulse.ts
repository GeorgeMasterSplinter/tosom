export function getJourneyImpulse({
  day,
  name,
}: {
  day: number;
  name: string;
}) {
  if (day === 1) {
    return `Det er helt fint å ta det rolig. Et enkelt hei til ${name} kan være en god start.`;
  }

  if (day === 2) {
    return `Hvis du føler for det, kan du dele noe lite om deg selv. Det trenger ikke være stort.`;
  }

  if (day === 3) {
    return `Samtaler vokser ofte av små ting. En tanke, en observasjon, noe du liker.`;
  }

  if (day === 4) {
    return `Noen ganger kan det være fint å dele noe du setter pris på i hverdagen. Det kan åpne for en god samtale.`;
  }

  if (day === 5) {
    return `${name} kan være nysgjerrig på hvem du er. En liten historie eller tanke kan være en fin invitasjon.`;
  }

  if (day === 6) {
    return `Samtaler vokser ofte når man deler noe ekte, men lite. Det trenger ikke være personlig – bare ærlig.`;
  }

  if (day === 7) {
    return `Hvis du føler deg komfortabel, kan du spørre ${name} om noe enkelt. Det viser interesse uten press.`;
  }

  if (day === 8) {
    return `Noen ganger kan det være fint å dele noe du ser frem til. Det åpner ofte for gode samtaler.`;
  }

  if (day === 9) {
    return `${name} kan sette pris på å høre om noe som betyr noe for deg – stort eller lite.`;
  }

  if (day === 10) {
    return `Hvis du føler deg komfortabel, kan du dele en liten tanke om hva du liker i mennesker. Det kan skape nærhet.`;
  }

  if (day === 11) {
    return `Samtaler blir ofte dypere når man deler noe ekte, men fortsatt trygt. En liten refleksjon kan være nok.`;
  }

  if (day === 12) {
    return `Du kan spørre ${name} om noe som betyr noe for dem. Det viser interesse uten press.`;
  }

  if (day === 13) {
    return `Det er helt fint å være litt personlig hvis du føler for det. Små ærlige ting bygger tillit.`;
  }

  if (day === 14) {
    return `Hvis du vil, kan du dele noe du setter pris på i relasjoner. Det kan åpne for en fin samtale.`;
  }

  if (day === 15) {
    return `Noen ganger kan det være fint å dele noe som har gjort deg glad i det siste. Det åpner for varme samtaler.`;
  }

  if (day === 16) {
    return `${name} kan sette pris på å høre om noe som inspirerer deg – stort eller lite.`;
  }

  if (day === 17) {
    return `Hvis du føler deg komfortabel, kan du dele en liten tanke om hva som gir deg trygghet i relasjoner.`;
  }

  if (day === 18) {
    return `Samtaler blir ofte dypere når man deler noe som betyr noe for en, uten at det blir for personlig.`;
  }

  if (day === 19) {
    return `Du kan spørre ${name} om noe de setter pris på i hverdagen. Det skaper nærhet uten press.`;
  }

  if (day === 20) {
    return `Hvis du vil, kan du dele noe du verdsetter i mennesker. Det kan åpne for en fin resonans.`;
  }

  if (day === 21) {
    return `Det er helt fint å være litt mer åpen hvis du føler deg trygg. Små ærlige ting bygger ekte kontakt.`;
  }

  if (day === 22) {
    return `Noen ganger kan det være fint å dele noe du har lært om deg selv i det siste. Det åpner for ekte samtaler.`;
  }

  if (day === 23) {
    return `${name} kan sette pris på å høre om hva som gir deg ro eller balanse i hverdagen.`;
  }

  if (day === 24) {
    return `Hvis du føler deg trygg, kan du dele en liten refleksjon om hva som betyr noe for deg i relasjoner.`;
  }

  if (day === 25) {
    return `Samtaler blir ofte dypere når man deler noe som har formet en – uten at det blir for personlig.`;
  }

  if (day === 26) {
    return `Du kan spørre ${name} om noe som inspirerer dem. Det skaper en fin emosjonell resonans.`;
  }

  if (day === 27) {
    return `Hvis du vil, kan du dele noe du setter pris på ved mennesker du føler deg trygg med.`;
  }

  if (day === 28) {
    return `Det er helt fint å være litt mer åpen hvis du føler deg komfortabel. Små refleksjoner bygger ekte kontakt.`;
  }

  if (day === 29) {
    return `Noen ganger kan det være fint å dele noe som gir deg stabilitet i livet. Det åpner for rolige, gode samtaler.`;
  }

  if (day === 30) {
    return `${name} kan sette pris på å høre om hva som gjør at du føler deg trygg i en relasjon.`;
  }

  if (day === 31) {
    return `Hvis du føler deg komfortabel, kan du dele en liten refleksjon om hva du håper en god relasjon kan gi.`;
  }

  if (day === 32) {
    return `Samtaler blir ofte dypere når man deler noe som betyr noe for en – uten at det blir for tungt.`;
  }

  if (day === 33) {
    return `Du kan spørre ${name} om hva som gir dem ro eller trygghet. Det skaper en fin emosjonell resonans.`;
  }

  if (day === 34) {
    return `Hvis du vil, kan du dele noe du setter pris på ved måten samtalen deres har utviklet seg.`;
  }

  if (day === 35) {
    return `Det er helt fint å være litt mer åpen hvis du føler deg trygg. Små refleksjoner bygger ekte kontakt.`;
  }

  return null;
}
