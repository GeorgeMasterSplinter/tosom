"use client";

export default function LandingPage() {
  return (
    <main className="fade-in flex flex-col gap-[var(--space-2xl)]">

      {/* HERO */}
      <section className="section text-center fade-in">
        <h1 className="text-4xl font-semibold text-[var(--color-text)] max-w-3xl mx-auto">
          Velkommen til ToSom
        </h1>

        <p className="text-[var(--color-muted)] text-lg leading-[var(--line-relaxed)] max-w-2xl mx-auto">
          En rolig, trygg og moderne plass for refleksjon, innsikt og utvikling.
        </p>

        <div className="flex justify-center gap-[var(--space-md)] mt-[var(--space-lg)]">
          <a href="/onboarding" className="btn-primary">
            Kom i gang
          </a>
          <a href="#hvordan" className="btn-secondary">
            Les mer
          </a>
        </div>
      </section>

      {/* HVORDAN DET FUNGERER */}
      <section id="hvordan" className="section fade-in">
        <h2 className="text-3xl font-semibold text-center text-[var(--color-text)] mb-[var(--space-xl)]">
          Hvordan ToSom fungerer
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--space-xl)]">
          
          <div className="card">
            <h3 className="text-xl font-semibold text-[var(--color-text)]">
              1. Lag profilen din
            </h3>
            <div className="text-[var(--color-muted)] leading-[var(--line-relaxed)]">
              Fortell litt om deg selv, verdiene dine og hva du ser etter.
            </div>
          </div>

          <div className="card">
            <h3 className="text-xl font-semibold text-[var(--color-text)]">
              2. Match med kvalitet
            </h3>
            <div className="text-[var(--color-muted)] leading-[var(--line-relaxed)]">
              Vi bruker en rolig og trygg matchingsprosess som prioriterer kompatibilitet.
            </div>
          </div>

          <div className="card">
            <h3 className="text-xl font-semibold text-[var(--color-text)]">
              3. Start reisen
            </h3>
            <div className="text-[var(--color-muted)] leading-[var(--line-relaxed)]">
              Gode samtaler, ekte møter og en reise som utvikler seg naturlig.
            </div>
          </div>

        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="section text-center fade-in">
        <h2 className="text-3xl font-semibold text-[var(--color-text)] max-w-2xl mx-auto">
          Klar for å møte noen som passer deg?
        </h2>

        <a href="/onboarding" className="btn-primary mt-[var(--space-md)]">
          Start reisen
        </a>
      </section>

    </main>
  );
}
