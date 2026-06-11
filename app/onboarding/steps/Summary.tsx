"use client";

import { useRouter } from "next/navigation";

export default function Summary({
  svar,
  oppdaterSvar,
}: {
  svar: Record<string, any>;
  oppdaterSvar: (felt: string, verdi: any) => void;
}) {
  const router = useRouter();

  const grupper = [
    {
      navn: "Grunnleggende",
      felter: [
        { key: "alder", label: "Alder" },
        { key: "kjonn", label: "Kjønn" },
        { key: "hoyde", label: "Høyde" },
        { key: "kroppsbygning", label: "Kroppsbygning" },
        { key: "bosted", label: "Bosted" },
        { key: "barn", label: "Barn" },
        { key: "roking", label: "Røyking" },
        { key: "alkohol", label: "Alkohol" },
        { key: "livssituasjon", label: "Livssituasjon" },
      ],
    },
    {
      navn: "Søker",
      felter: [
        { key: "ønsketAlder", label: "Ønsket alder" },
        { key: "ønsketLivssituasjon", label: "Livssituasjon" },
        { key: "relasjonstype", label: "Relasjonstype" },
        { key: "ønskerBarn", label: "Ønsker barn" },
        { key: "fysiskNaerhet", label: "Fysisk nærhet" },
        { key: "kommunikasjon", label: "Kommunikasjon" },
      ],
    },
    {
      navn: "Personlighet",
      felter: [
        { key: "vennskapsbeskrivelse", label: "Venn beskriver deg" },
        { key: "stressReaksjon", label: "Stressreaksjon" },
        { key: "omsoerg", label: "Omsorg" },
        { key: "ønsketMoete", label: "Ønsket møte" },
      ],
    },
    {
      navn: "Livsstil",
      felter: [
        { key: "domnrytme", label: "Døgnrytme" },
        { key: "arbeidsrytme", label: "Arbeidsrytme" },
        { key: "fritidsvaner", label: "Fritidsvaner" },
        { key: "trening", label: "Trening" },
        { key: "matvaner", label: "Matvaner" },
        { key: "reising", label: "Reising" },
        { key: "sosialtNiva", label: "Sosialt nivå" },
      ],
    },
    {
      navn: "Verdier",
      felter: [
        { key: "verdi", label: "Viktig i forhold" },
        { key: "trygghet", label: "Gjør deg trygg" },
        { key: "utrygghet", label: "Gjør deg utrygg" },
        { key: "konflikt", label: "Konfliktløsning" },
        { key: "kaerlighet", label: "Kjærlighet" },
      ],
    },
    {
      navn: "Fremtid",
      felter: [
        { key: "femAar", label: "Om 5 år" },
        { key: "partnerSoek", label: "I partner" },
        { key: "byggeSammen", label: "Bygge sammen" },
        { key: "drommer", label: "Drømmer" },
      ],
    },
    {
      navn: "Små ting",
      felter: [
        { key: "gjorDegGlad", label: "Gjør deg glad" },
        { key: "gjorDegRolig", label: "Gjør deg rolig" },
        { key: "gjorDegTrygg", label: "Gjør deg trygg" },
        { key: "alene", label: "Alene" },
        { key: "sammen", label: "Sammen" },
      ],
    },
  ];

  const getVerdi = (key: string) => {
    const val = svar[key];
    return val ? String(val) : "Ikke oppgitt";
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-3">
        <h2 className="text-xl font-light text-white">Oppsummering</h2>
        <p className="text-gray-400 text-sm leading-relaxed">
          Bekreft at alt stemmer, så er du klar.
        </p>
      </div>

      {grupper.map((gruppe) => (
        <div
          key={gruppe.navn}
          className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-md shadow-black/20 space-y-3"
        >
          <h3 className="text-lg font-medium text-white">{gruppe.navn}</h3>
          {gruppe.felter.map((felt) => (
            <div key={felt.key} className="flex justify-between items-start">
              <span className="text-gray-400 text-sm">{felt.label}</span>
              <span className="text-gray-200 text-sm text-right max-w-[60%] truncate">
                {getVerdi(felt.key)}
              </span>
            </div>
          ))}
        </div>
      ))}

      <button
        onClick={() => router.push("/profile/1")}
        className="w-full rounded-xl bg-white text-gray-900 font-medium px-6 py-3 hover:bg-gray-200 transition"
      >
        Se profilen din
      </button>
    </div>
  );
}
