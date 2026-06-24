"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

/* ------ Steg-informasjon ------ */

const STEG = [
  {
    id: 1,
    tittel: "Grunnleggende informasjon",
    undertekst: "Dette er ikke for å dømme deg. Dette er for å finne noen som passer inn i livet ditt.",
    guidingText: "Vi starter med det grunnleggende, slik at vi kan bli litt kjent med deg.",
    trustText: "Svarene dine brukes kun til å bygge profilen din og finne en god match.",
    knytt: "Fortsett til neste steg",
    komponent: "BasicInfo",
  },
  {
    id: 2,
    tittel: "Hva du søker",
    undertekst: "Det er bedre å være ærlig enn å være høflig. Du skal finne noen som passer deg — ikke alle.",
    guidingText: "Dette hjelper oss å forstå hva du trives med i en relasjon.",
    trustText: "Du kan endre preferansene dine senere hvis noe føles annerledes.",
    knytt: "Gå videre",
    komponent: "Seeking",
  },
  {
    id: 3,
    tittel: "Personlighet",
    undertekst: "Ver deg selv. Ikke CV-versjonen av deg.",
    guidingText: "Personligheten din er det som gjør deg til deg. Vi vil gjerne kjenne den virkelige deg.",
    trustText: "Del det du er komfortabel med – det er nok.",
    knytt: "Fortsett til neste steg",
    komponent: "Personality",
  },
  {
    id: 4,
    tittel: "Livsstil",
    undertekst: "To mennesker møtes i hverdagen — ikke bare i helgene.",
    guidingText: "Hvordan du lever dagen, sier mye om hvem du er som partner.",
    trustText: "Du kan alltid justere livsstilssvarene dine seinare.",
    knytt: "Gå videre",
    komponent: "Lifestyle",
  },
  {
    id: 5,
    tittel: "Verdier og emosjonelle behov",
    undertekst: "Dette er ikke for å imponere. Dette er for å bli forstått.",
    guidingText: "Verdier sier mye om hva som er viktig for deg i lengden.",
    trustText: "Vi deler aldri dette med andre – det brukes kun til å finne en god match.",
    knytt: "Fortsett til neste steg",
    komponent: "Values",
  },
  {
    id: 6,
    tittel: "Fremtid og ønsker",
    undertekst: "Du trenger ikke ha alt klart. Del det som betyr noe for deg.",
    guidingText: "Fremtidsønsker viser veien for hva dere kan bygge sammen.",
    trustText: "Del bare det du ønsker – ingen dømmer for det du drømmer om.",
    knytt: "Gå videre",
    komponent: "Future",
  },
  {
    id: 7,
    tittel: "Dine små ting",
    undertekst: "Det er ofte de små tingene som gjør livet stort.",
    guidingText: "De små detaljene forteller hvem du er i hverdagen.",
    trustText: "Disse gjøres private – bare synlige for din match.",
    knytt: "Fortsett til neste steg",
    komponent: "SmallThings",
  },
  {
    id: 8,
    tittel: "Bilder (valfritt)",
    undertekst: "Du trenger ikke vise alt. Bare det som føles riktig.",
    guidingText: "Bilder er fint, men vi vil først kjenne deg på tekst.",
    trustText: "Du kan alltid legge til bilder seinare – eller ikke ha noen i det hele tatt.",
    knytt: "Gå videre",
    komponent: "Photos",
  },
  {
    id: 9,
    tittel: "Oppsummering",
    undertekst: "Bekreft at alt stemmer, så er du klar.",
    guidingText: "Nå har vi det vi trenger for å gi deg en gjennomtenkt start.",
    trustText: "Du kan alltid komme tilbake og justere svarene dine seinare.",
    knytt: "Start reisen",
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
            Du er klar
          </h1>

          <div className="text-[var(--color-muted)] leading-[var(--line-relaxed)]">
            Du er klar – nå begynner det som betyr noe. Du kan redigere profilen din når som helst.
          </div>

          <button
            onClick={() => router.push("/match")}
            className="btn-primary mt-[var(--space-lg)]"
          >
            Se din match
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
                className="h-full"
                style={{
                  width: `${(steg / STEG.length) * 100}%`,
                  background: 'linear-gradient(90deg, #D4AF37, #E8C766)',
                  boxShadow: '0 0 12px rgba(212, 175, 55, 0.3)',
                }}
              />
            </div>
          </div>

          {stegInfo.guidingText && (
            <div className="text-base mt-[var(--space-sm)] leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.55)' }}>
              {stegInfo.guidingText}
            </div>
          )}

          <div className="text-sm mt-[var(--space-xs)] italic leading-[var(--line-relaxed)]" style={{ color: 'rgba(212, 175, 55, 0.55)' }}>
            {stegInfo.undertekst}
          </div>

          {stegInfo.trustText && (
            <div className="text-xs mt-[var(--space-sm)]" style={{ color: 'rgba(255, 255, 255, 0.35)' }}>
              {stegInfo.trustText}
            </div>
          )}
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
              {stegInfo.knytt}
            </button>
          ) : (
            <button
              onClick={fullfor}
              disabled={lagrer}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              {lagrer ? "Lagrer..." : stegInfo.knytt}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

