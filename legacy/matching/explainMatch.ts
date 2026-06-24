/**
 * explainMatch
 *
 * Tar inn ScoreResult og returnerer en tekstlig forklaring
 * av hvorfor disse to brukerne matcher bra (eller ikke).
 */
interface ScoreResult {
  breakdown: {
    base: number;
    resonance: number;
    semantic: number;
    intimacy: number;
    future: number;
    basic: number;
    lifestyle: number;
    interests: number;
    location: number;
    needs: number;
    boundaries: number;
    intentions: number;
  };
  totalScore: number;
}

export function explainMatch(result: ScoreResult): {
  tierLabel: string;
  explanation: string;
} {
  const breakdown = result.breakdown;
  const parts: string[] = [];

  if (breakdown.base > 20) {
    parts.push(
      "Dere har en sterk grunnleggende kompatibilitet når det gjelder alder og preferanser."
    );
  }

  if (breakdown.resonance > 15) {
    parts.push(
      "Livsstilen deres passer godt sammen, noe som gjør hverdagen lettere å dele."
    );
  }

  if (breakdown.semantic > 10) {
    parts.push(
      "Dere deler flere interesser som kan gi naturlige samtaler og felles opplevelser."
    );
  }

  if (breakdown.intimacy > 10) {
    parts.push(
      "Dere har like behov i relasjoner, noe som øker sjansen for trygghet og forståelse."
    );
  }

  if (breakdown.future > 5) {
    parts.push(
      "Dere har like intensjoner for hva dere ønsker videre i livet."
    );
  }

  let tierLabel: string;
  if (result.totalScore > 85) tierLabel = "Utmerket match";
  else if (result.totalScore > 70) tierLabel = "Sterk match";
  else if (result.totalScore > 55) tierLabel = "Moderat match";
  else tierLabel = "Svak match";

  if (parts.length === 0) {
    return {
      tierLabel,
      explanation:
        "Dere har flere små områder som kan utforskes videre for å se om kjemien utvikler seg.",
    };
  }

  return {
    tierLabel,
    explanation: parts.join(" "),
  };
}
