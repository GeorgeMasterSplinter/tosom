"use client";

export default function Seeking({
  svar,
  oppdaterSvar,
}: {
  svar: Record<string, any>;
  oppdaterSvar: (felt: string, verdi: any) => void;
}) {
  return (
    <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-md shadow-black/20 space-y-4">
      <h2 className="text-xl font-light text-white">Hva du søker</h2>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Ønsket alder på partner</label>
        <input
          type="text"
          value={svar.ønsketAlder ?? ""}
          onChange={(e) => oppdaterSvar("ønsketAlder", e.target.value)}
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20"
          placeholder="f.eks. 25–35"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Ønsket livssituasjon</label>
        <select
          value={svar.ønsketLivssituasjon ?? ""}
          onChange={(e) => oppdaterSvar("ønsketLivssituasjon", e.target.value)}
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          <option value="" className="bg-gray-950">Velg livssituasjon</option>
          <option value="jobb" className="bg-gray-950">Jobber</option>
          <option value="student" className="bg-gray-950">Student</option>
          <option value="turnus" className="bg-gray-950">Turnus</option>
          <option value="fri" className="bg-gray-950">Fri</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Relasjonstype</label>
        <select
          value={svar.relasjonstype ?? ""}
          onChange={(e) => oppdaterSvar("relasjonstype", e.target.value)}
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          <option value="" className="bg-gray-950">Velg relasjonstype</option>
          <option value="langvarig" className="bg-gray-950">Langvarig forhold</option>
          <option value="kaerlighet" className="bg-gray-950">Kjærlighet</option>
          <option value="dyp forbindelse" className="bg-gray-950">Dyp forbindelse</option>
          <option value="åpen" className="bg-gray-950">Åpen</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Ønsker du barn?</label>
        <select
          value={svar.ønskerBarn ?? ""}
          onChange={(e) => oppdaterSvar("ønskerBarn", e.target.value)}
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          <option value="" className="bg-gray-950">Velg</option>
          <option value="ja" className="bg-gray-950">Ja</option>
          <option value="nei" className="bg-gray-950">Nei</option>
          <option value="usikker" className="bg-gray-950">Usikker</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Hvor viktig er fysisk nærhet?</label>
        <select
          value={svar.fysiskNaerhet ?? ""}
          onChange={(e) => oppdaterSvar("fysiskNaerhet", e.target.value)}
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          <option value="" className="bg-gray-950">Velg viktighet</option>
          <option value="veldig viktig" className="bg-gray-950">Veldig viktig</option>
          <option value="viktig" className="bg-gray-950">Viktig</option>
          <option value="noe viktig" className="bg-gray-950">Noe viktig</option>
          <option value="ikke viktig" className="bg-gray-950">Ikke viktig</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Hvor viktig er kommunikasjon?</label>
        <select
          value={svar.kommunikasjon ?? ""}
          onChange={(e) => oppdaterSvar("kommunikasjon", e.target.value)}
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          <option value="" className="bg-gray-950">Velg viktighet</option>
          <option value="veldig viktig" className="bg-gray-950">Veldig viktig</option>
          <option value="viktig" className="bg-gray-950">Viktig</option>
          <option value="noe viktig" className="bg-gray-950">Noe viktig</option>
          <option value="ikke viktig" className="bg-gray-950">Ikke viktig</option>
        </select>
      </div>
    </div>
  );
}
