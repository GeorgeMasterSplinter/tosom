"use client";

export default function BasicInfo({
  svar,
  oppdaterSvar,
}: {
  svar: Record<string, any>;
  oppdaterSvar: (felt: string, verdi: any) => void;
}) {
  return (
    <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-md shadow-black/20 space-y-4">
      <h2 className="text-xl font-light text-white">Grunnleggende informasjon</h2>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Alder (minst 23)</label>
        <input
          type="number"
          min={23}
          value={svar.alder ?? ""}
          onChange={(e) => oppdaterSvar("alder", e.target.value)}
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20"
          placeholder="f.eks. 28"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Kjønn</label>
        <select
          value={svar.kjonn ?? ""}
          onChange={(e) => oppdaterSvar("kjonn", e.target.value)}
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          <option value="" className="bg-gray-950">Velg kjønn</option>
          <option value="kvinne" className="bg-gray-950">Kvinne</option>
          <option value="mann" className="bg-gray-950">Mann</option>
          <option value="annet" className="bg-gray-950">Annet</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Høyde</label>
        <input
          type="text"
          value={svar.hoyde ?? ""}
          onChange={(e) => oppdaterSvar("hoyde", e.target.value)}
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20"
          placeholder="f.eks. 178 cm"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Kroppsbygning</label>
        <select
          value={svar.kroppsbygning ?? ""}
          onChange={(e) => oppdaterSvar("kroppsbygning", e.target.value)}
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          <option value="" className="bg-gray-950">Velg kroppsbygning</option>
          <option value="slank" className="bg-gray-950">Slank</option>
          <option value="normal" className="bg-gray-950">Normal</option>
          <option value="stor" className="bg-gray-950">Stor</option>
          <option value="muskuløs" className="bg-gray-950">Muskuløs</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Bosted</label>
        <input
          type="text"
          value={svar.bosted ?? ""}
          onChange={(e) => oppdaterSvar("bosted", e.target.value)}
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20"
          placeholder="f.eks. Oslo, Bergen, Tromsø"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Barn</label>
        <select
          value={svar.barn ?? ""}
          onChange={(e) => oppdaterSvar("barn", e.target.value)}
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          <option value="" className="bg-gray-950">Har du barn?</option>
          <option value="nei" className="bg-gray-950">Nei</option>
          <option value="ja" className="bg-gray-950">Ja</option>
          <option value="ønsker" className="bg-gray-950">Ønsker barn</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Røyking</label>
          <select
            value={svar.roking ?? ""}
            onChange={(e) => oppdaterSvar("roking", e.target.value)}
            className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-white/20"
          >
            <option value="" className="bg-gray-950">Velg</option>
            <option value="nei" className="bg-gray-950">Røyker ikke</option>
            <option value="ja" className="bg-gray-950">Røyker</option>
            <option value="av og til" className="bg-gray-950">Av og til</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Alkohol</label>
          <select
            value={svar.alkohol ?? ""}
            onChange={(e) => oppdaterSvar("alkohol", e.target.value)}
            className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-white/20"
          >
            <option value="" className="bg-gray-950">Velg</option>
            <option value="sjelden" className="bg-gray-950">Sjelden</option>
            <option value="noe" className="bg-gray-950">Noe</option>
            <option value="ofte" className="bg-gray-950">Ofte</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Livssituasjon</label>
        <select
          value={svar.livssituasjon ?? ""}
          onChange={(e) => oppdaterSvar("livssituasjon", e.target.value)}
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          <option value="" className="bg-gray-950">Velg livssituasjon</option>
          <option value="jobb" className="bg-gray-950">Jobber</option>
          <option value="student" className="bg-gray-950">Student</option>
          <option value="turnus" className="bg-gray-950">Turnus</option>
          <option value="skift" className="bg-gray-950">Skiftarbeid</option>
          <option value="frilans" className="bg-gray-950">Frilanser</option>
        </select>
      </div>
    </div>
  );
}
