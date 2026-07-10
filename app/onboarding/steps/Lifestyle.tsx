"use client";

export default function Lifestyle({
  svar,
  oppdaterSvar,
}: {
  svar: Record<string, any>;
  oppdaterSvar: (felt: string, verdi: any) => void;
}) {
  return (
    <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-md shadow-black/20 space-y-4">
      <h2 className="text-xl font-light text-white">Livsstil</h2>
      <p className="text-gray-400 text-sm leading-relaxed">
        To mennesker møtes i hverdagen — ikke i helgene.
      </p>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Døgnrytme</label>
        <select
          value={svar.dognrytme ?? ""}
          onChange={(e) => oppdaterSvar("dognrytme", e.target.value)}
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          <option value="" className="bg-gray-950">Velg døgnrytme</option>
          <option value="morgenmenneske" className="bg-gray-950">Morgenmenneske</option>
          <option value="kveldsmenneske" className="bg-gray-950">Kveldsmenneske</option>
          <option value="uavhengig" className="bg-gray-950">Uavhengig</option>
          <option value="vilIkkeSi" className="bg-gray-950">Vil ikke si</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Arbeidsrytme</label>
        <select
          value={svar.arbeidsrytme ?? ""}
          onChange={(e) => oppdaterSvar("arbeidsrytme", e.target.value)}
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          <option value="" className="bg-gray-950">Velg arbeidsrytme</option>
          <option value="kontortid" className="bg-gray-950">Kontortid (9–17)</option>
          <option value="fleksibelt" className="bg-gray-950">Fleksibelt</option>
          <option value="skift" className="bg-gray-950">Skift</option>
          <option value="fri" className="bg-gray-950">Egen arbeidshverdag</option>
          <option value="vilIkkeSi" className="bg-gray-950">Vil ikke si</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Fritidsvaner</label>
        <textarea
          value={svar.fritidsvaner ?? ""}
          onChange={(e) => oppdaterSvar("fritidsvaner", e.target.value)}
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-gray-200 placeholder-gray-500 h-24 resize-none leading-relaxed focus:outline-none focus:ring-2 focus:ring-white/20"
          placeholder="f.eks. lesing, turer, hage, håndverk"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Trening</label>
        <select
          value={svar.trening ?? ""}
          onChange={(e) => oppdaterSvar("trening", e.target.value)}
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          <option value="" className="bg-gray-950">Velg treningsnivå</option>
          <option value="ingen" className="bg-gray-950">Ingen trening</option>
          <option value="lett" className="bg-gray-950">Lett, av og til</option>
          <option value="regelbundet" className="bg-gray-950">Regelmessig</option>
          <option value="aktiv" className="bg-gray-950">Veldig aktiv</option>
          <option value="vilIkkeSi" className="bg-gray-950">Vil ikke si</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Matvaner</label>
        <select
          value={svar.matvaner ?? ""}
          onChange={(e) => oppdaterSvar("matvaner", e.target.value)}
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          <option value="" className="bg-gray-950">Velg matvaner</option>
          <option value="ingen" className="bg-gray-950">Ingen særlige vaner</option>
          <option value="vegetar" className="bg-gray-950">Vegetar</option>
          <option value="veganer" className="bg-gray-950">Veganer</option>
          <option value="sunt" className="bg-gray-950">Spiser sunt</option>
          <option value="annet" className="bg-gray-950">Annet</option>
          <option value="vilIkkeSi" className="bg-gray-950">Vil ikke si</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Reising</label>
        <select
          value={svar.reising ?? ""}
          onChange={(e) => oppdaterSvar("reising", e.target.value)}
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          <option value="" className="bg-gray-950">Velg reisevaner</option>
          <option value="sjelden" className="bg-gray-950">Sjelden</option>
          <option value="noe" className="bg-gray-950">Noe, av og til</option>
          <option value="ofte" className="bg-gray-950">Ofte</option>
          <option value="mye" className="bg-gray-950">Mye</option>
          <option value="vilIkkeSi" className="bg-gray-950">Vil ikke si</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Sosialt nivå</label>
        <select
          value={svar.sosialtNiva ?? ""}
          onChange={(e) => oppdaterSvar("sosialtNiva", e.target.value)}
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          <option value="" className="bg-gray-950">Velg sosialt nivå</option>
          <option value="rolig" className="bg-gray-950">Rolig, få venner</option>
          <option value="normal" className="bg-gray-950">Normal</option>
          <option value="mye" className="bg-gray-950">Mye sosialt</option>
          <option value="vilIkkeSi" className="bg-gray-950">Vil ikke si</option>
        </select>
      </div>
    </div>
  );
}
