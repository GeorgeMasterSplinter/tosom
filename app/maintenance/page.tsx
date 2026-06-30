export default function Maintenance() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1520] text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.08),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.06] bg-cover bg-center pointer-events-none" style={{ backgroundImage: "url('/textures/glass-wave.svg')" }} />
      <div className="text-center space-y-6 px-6">
        <h1 className="text-5xl font-semibold tracking-wide text-[#D4AF37]/90 drop-shadow-[0_0_15px_rgba(255,215,0,0.25)]">
          ToSom
        </h1>
        <p className="text-2xl font-light text-white/90">
          Under arbeid
        </p>
        <p className="text-white/60 max-w-xl mx-auto leading-relaxed text-lg">
          Vi bygger noe rolig. Noe ekte. Noe som ikke haster.
          <br />
          ToSom åpner dørene snart — i stillhet, med omtanke.
        </p>
        <div className="mx-auto w-4 h-4 rounded-full bg-[#D4AF37]/40 animate-ping" />
      </div>
    </div>
  );
}