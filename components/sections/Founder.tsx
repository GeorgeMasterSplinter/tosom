import FadeIn from "@/components/animations/FadeIn"

export default function Founder() {
  return (
    <section className="px-6 py-28 max-w-3xl mx-auto text-center">
      <FadeIn>
        <h2 className="text-3xl font-light mb-6 tracking-wide leading-tight">
          Om grunnleggeren
        </h2>

        <p className="text-[#1A1A1A] leading-relaxed text-lg mb-6">
          ToSom er utviklet av George, bosatt i Norge, med et ønske om å skape
          et rolig og modent alternativ til dagens hektiske datingkultur. Etter
          å ha sett hvor mye stress, overfladiskhet og jag som preger moderne
          dating, vokste ideen om en plattform der mennesker kan møtes på en
          trygg og ekte måte.
        </p>

        <p className="text-[#1A1A1A] leading-relaxed text-lg mb-6">
          Visjonen er enkel: å gi voksne mennesker et sted der de kan senke
          skuldrene, slippe sammenligning og finne én person som faktisk passer
          dem — uten støy, uten spill og uten press. ToSom er bygget med varme,
          ro og respekt som kjerneverdier.
        </p>
      </FadeIn>
    </section>
  )
}