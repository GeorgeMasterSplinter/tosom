'use client';

export default function ReisenPage() {
  return (
    <main className="relative min-h-screen overflow-hidden" style={{ background: '#0B0F14' }}>
      {/* Hero */}
      <section className="pt-32 pb-20 text-center">
        <h1 className="text-4xl md:text-6xl font-semibold text-white tracking-[-0.02em] mb-8">
          30-dagers reise
        </h1>
        <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto px-6 leading-[1.7] mb-6">
          Når to menneske matcher, startar ein guidet 30-dagers reise saman. Den første delen er utan bilder — for å bygge ekte forbindelse først.
        </p>
        <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto px-6 leading-[1.7]">
          Kvar dag får dere oppgåver, refleksjonar og samtaletema som hjelper dere å bli kjent på ei djup og meiningfull måte.
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