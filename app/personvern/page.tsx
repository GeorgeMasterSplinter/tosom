'use client';

export default function PersonvernPage() {
  return (
    <main className="relative min-h-screen overflow-hidden" style={{ background: '#0B0F14' }}>
      {/* Hero */}
      <section className="pt-32 pb-20 text-center">
        <h1 className="text-4xl md:text-6xl font-semibold text-white tracking-[-0.02em] mb-8">
          Personvern
        </h1>
        <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto px-6 leading-[1.7] mb-6">
          Vi tek personvern svært alvorleg. Din profildata blir berre brukt til matching og blir aldri delt med tredjepart.
        </p>
        <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto px-6 leading-[1.7]">
          Du har alltid rett til å slette din profildata. Kontakt oss for spørsmål om datahandsaming.
        </p>
      </section>

      {/* Innhald */}
      <section className="pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-base text-white/60 leading-[1.8]">
            [Innhald kjem]
          </p>
        </div>
      </section>
    </main>
  );
}