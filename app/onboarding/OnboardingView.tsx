"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

/* ------ Steg-informasjon ------ */

const STEG = [
  {
    id: 1,
    tittel: "Grunnleggende informasjon",
    undertekst:
      "Dette er ikke for å dømme deg. Dette er for å finne noen som passer inn i livet ditt.",
    komponent: "BasicInfo",
  },
  {
    id: 2,
    tittel: "Hva du søker",
    undertekst:
      "Det er bedre å være ærlig enn å være høflig. Du skal finne noen som passer deg — ikke alle.",
    komponent: "Seeking",
  },
  {
    id: 3,
    tittel: "Personlighet",
    undertekst: "Ver deg selv. Ikke CV-versjonen av deg.",
    komponent: "Personality",
  },
  {
    id: 4,
    tittel: "Livsstil",
    undertekst: "To mennesker møtes i hverdagen — ikke bare i helgene.",
    komponent: "Lifestyle",
  },
  {
    id: 5,
    tittel: "Verdier og emosjonelle behov",
    undertekst: "Dette er ikke for å imponere. Dette er for å bli forstått.",
    komponent: "Values",
  },
  {
    id: 6,
    tittel: "Fremtid og ønsker",
    undertekst: "Du trenger ikke ha alt klart. Del det som betyr noe for deg.",
    komponent: "Future",
  },
  {
    id: 7,
    tittel: "Dine små ting",
    undertekst: "Det er ofte de små tingene som gjør livet stort.",
    komponent: "SmallThings",
  },
  {
    id: 8,
    tittel: "Bilder (valfritt)",
    undertekst: "Du trenger ikke vise alt. Bare det som føles riktig.",
    komponent: "Photos",
  },
  {
    id: 9,
    tittel: "Oppsummering",
    undertekst: "Bekreft at alt stemmer, så er du klar.",
    komponent: "Summary",
  },
];

/* ------ Hovudkomponent ------ */

export default function OnboardingView() {
  const router = useRouter();
  const [steg, setSteg] = useState(1);
  const [svar, setSvar] = useState<Record<string, any>>({});
  const [lagrer, setLagrer] = useState(false);
  const [ferdig, setFerdig] = useState(false);

  useEffect(() => {
    const fullfort = localStorage.getItem("onboardingComplete");
    if (fullfort === "true") {
      router.push("/dashboard");
    }
  }, [router]);

  const nesteSteg = () => {
    if (steg < 9) setSteg(steg + 1);
  };

  const forrigeSteg = () => {
    if (steg > 1) setSteg(steg - 1);
  };

  const oppdaterSvar = (felt: string, verdi: any) => {
    setSvar((forrige) => ({ ...forrige, [felt]: verdi }));
  };

  const fullfor = async () => {
    setLagrer(true);
    await new Promise((r) => setTimeout(r, 800));
    localStorage.setItem("onboardingComplete", "true");
    setFerdig(true);
  };

  if (ferdig) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex items-center justify-center px-4 fade-in">
        <div className="card text-center max-w-md">
          <div className="w-20 h-20 mx-auto rounded-full bg-green-900/20 border border-green-900/40 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-3xl font-semibold mt-[var(--space-md)]">
            Gratulerer
          </h1>

          <div className="text-[var(--color-muted)] leading-[var(--line-relaxed)]">
            Profilen din er nå klar. Du kan redigere henne når du vil.
          </div>

          <button
            onClick={() => router.push("/profile/1")}
            className="btn-primary mt-[var(--space-lg)]"
          >
            Se på profilen din
          </button>
        </div>
      </div>
    );
  }

  const stegInfo = STEG.find((s) => s.id === steg)!;

  const StegKomponenter: Record<
    string,
    React.FC<{ svar: any; oppdaterSvar: (f: string, v: any) => void }>
  > = {
    BasicInfo: require("./steps/BasicInfo").default,
    Seeking: require("./steps/Seeking").default,
    Personality: require("./steps/Personality").default,
    Lifestyle: require("./steps/Lifestyle").default,
    Values: require("./steps/Values").default,
    Future: require("./steps/Future").default,
    SmallThings: require("./steps/SmallThings").default,
    Photos: require("./steps/Photos").default,
    Summary: require("./steps/Summary").default,
  };

  const Steg = StegKomponenter[stegInfo.komponent];

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] fade-in">
      <div className="max-w-2xl mx-auto py-[var(--space-xl)] px-4 space-y-[var(--space-xl)]">

        {/* Sticky header */}
        <div className="sticky top-0 bg-[var(--color-bg)]/80 backdrop-blur-sm py-[var(--space-md)] z-10 border-b border-[var(--color-card-border)] -mx-4 px-4 fade-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-muted)]">
                Steg {steg} av {STEG.length}
              </p>
              <h1 className="text-2xl font-semibold mt-[var(--space-xs)]">
                {stegInfo.tittel}
              </h1>
            </div>

            {steg > 1 && (
              <button onClick={forrigeSteg} className="btn-secondary text-sm px-4 py-2">
                Tilbake
              </button>
            )}
          </div>

          <div className="mt-[var(--space-sm)]">
            <div className="w-full h-1 bg-[var(--color-card-border)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--color-text)] rounded-full transition-all duration-500"
                style={{ width: `${(steg / STEG.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="text-[var(--color-muted)] text-sm mt-[var(--space-sm)] leading-[var(--line-relaxed)]">
            {stegInfo.undertekst}
          </div>
        </div>

        {/* Steg-innhald */}
        <div className="card fade-in">
          <Steg svar={svar} oppdaterSvar={oppdaterSvar} />
        </div>

        {/* Knapper */}
        <div className="sticky bottom-0 bg-[var(--color-bg)]/80 backdrop-blur-sm py-[var(--space-md)] border-t border-[var(--color-card-border)] -mx-4 px-4 flex gap-[var(--space-md)] fade-in">
          {steg > 1 && (
            <button onClick={forrigeSteg} className="btn-secondary flex-1">
              Tilbake
            </button>
          )}

          {steg < 9 ? (
            <button onClick={nesteSteg} className="btn-primary flex-1">
              Neste
            </button>
          ) : (
            <button
              onClick={fullfor}
              disabled={lagrer}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              {lagrer ? "Lagrer..." : "Fullfør"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

