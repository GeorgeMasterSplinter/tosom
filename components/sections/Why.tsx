import FadeIn from "@/components/animations/FadeIn"

export default function Why() {
  return (
    <FadeIn>
      <section className="px-6 py-28 max-w-3xl mx-auto text-center">
        <h3 className="text-3xl font-light mb-6 tracking-wide leading-tight">Hvorfor ToSom?</h3>

        <p className="text-[#1A1A1A] mb-6 leading-relaxed">
          ToSom er laget for voksne som ønsker noe ekte — uten jag, uten spill,
          uten overfladiskhet.
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-10 text-[#CBAA7A] text-lg tracking-wide">
          <span>Mindre ghosting</span>
          <span>Mindre stress</span>
          <span>Mer modenhet</span>
        </div>
      </section>
    </FadeIn>
  )
}
