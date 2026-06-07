/**
 * explainMatch
 *
 * Tar inn score‑blokkene og returnerer en tekstlig forklaring
 * av hvorfor disse to brukerne matcher bra (eller ikke).
 *
 * Blokkene må komme fra calculateMatchScore med `{ returnBlocks: true }`.
 */
export function explainMatch(blocks: {
  basic: number;
  lifestyle: number;
  interests: number;
  location: number;
  needs: number;
  boundaries: number;
  intentions: number;
}): string {
  const parts: string[] = [];

  if (blocks.basic > 20) {
    parts.push(
      "Dere har en sterk grunnleggende kompatibilitet når det gjelder alder og preferanser."
    );
  }

  if (blocks.lifestyle > 15) {
    parts.push(
      "Livsstilen deres passer godt sammen, noe som gjør hverdagen lettere å dele."
    );
  }

  if (blocks.interests > 10) {
    parts.push(
      "Dere deler flere interesser som kan gi naturlige samtaler og felles opplevelser."
    );
  }

  if (blocks.needs > 10) {
    parts.push(
      "Dere har like behov i relasjoner, noe som øker sjansen for trygghet og forståelse."
    );
  }

  if (blocks.boundaries > 5) {
    parts.push(
      "Dere har like grenser, noe som skaper et stabilt og respektfullt grunnlag."
    );
  }

  if (blocks.intentions > 5) {
    parts.push(
      "Dere har like intensjoner for hva dere ønsker videre i livet."
    );
  }

  if (parts.length === 0) {
    return "Dere har flere små områder som kan utforskes videre for å se om kjemien utvikler seg.";
  }

  return parts.join(" ");
}
