import FadeIn from "@/components/animations/FadeIn"

export default function Process() {
  return (
    <section className="px-6 py-28 max-w-5xl mx-auto">
      <h3 className="text-3xl font-light text-center mb-16 tracking-wide">
        Slik fungerer ToSom
      </h3>

        <div className="space-y-6 text-center">

        <div>
          <h4 className="text-xl font-light mb-2 tracking-wide">1. Lag profil</h4>
          <p className="text-[#C7CED6] leading-relaxed">
            Rolig onboarding. Profilen er privat.
          </p>
        </div>

        <div>
          <h4 className="text-xl font-light mb-2 tracking-wide">2. Vent 48 timer</h4>
          <p className="text-[#C7CED6] leading-relaxed">
            Vi matcher deg med 1–3 personer.
          </p>
        </div>

        <div>
          <h4 className="text-xl font-light mb-2 tracking-wide">3. Velg én</h4>
          <p className="text-[#C7CED6] leading-relaxed">
            Dere går inn i en 30‑dagers reise.
          </p>
        </div>

        <div>
          <h4 className="text-xl font-light mb-2 tracking-wide">4. Bli kjent</h4>
          <p className="text-[#C7CED6] leading-relaxed">
            14 dager uten bilder + rolige verktøy.
          </p>
        </div>

      </div>
    </section>
  )
}
