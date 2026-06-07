import FadeIn from "@/components/animations/FadeIn"

export default function Safety() {
  return (
    <section className="px-6 py-28 max-w-3xl mx-auto text-center">
      <h3 className="text-3xl font-light mb-4 tracking-wide leading-tight text-[#1A1A1A]">
        Trygghet og ro først
      </h3>

      <div className="flex flex-col space-y-6 text-[#4A4A4A] text-lg leading-relaxed">
        <span>Ingen profiler</span>
        <span>Ingen katalog</span>
        <span>Ingen likes</span>
        <span>Ingen algoritmer</span>
        <span>Ingen abonnement</span>
        <span>Ingen skjulte kostnader</span>
      </div>
    </section>
  )
}
