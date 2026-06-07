export function generateFirstMessage({
  name,
  score,
  explanation,
}: {
  name: string;
  score: number;
  explanation: string;
}) {
  return `Dere er matchet med ${name}.

Matchscore: ${score}/100

${explanation}

Ta det i deres eget tempo. En enkel hei er alltid en fin start.`;
}
