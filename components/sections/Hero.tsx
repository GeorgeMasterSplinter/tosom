import FadeIn from "@/components/animations/FadeIn"


export default function Hero() {
  return (
    <FadeIn>
      <section
        className="relative px-6 py-32 md:py-0 text-center max-w-4xl mx-auto bg-cover bg-center flex items-center justify-center min-h-[70vh] md:min-h-[85vh]"
        style={{ backgroundImage: "url('/hero.jpg')" }}
      >
        <div className="absolute inset-0 bg-[#1E2A38]/70 md:bg-[#1E2A38]/60 backdrop-blur-sm"></div>

        <div className="relative z-10 px-2 md:px-0">
          <h2 className="text-4xl md:text-7xl font-light mb-6 tracking-wide leading-tight">
            Et rolig sted for voksne som søker noe ekte
          </h2>

          <p className="text-base md:text-xl text-[#C7CED6] mb-10 md:mb-12 leading-relaxed max-w-2xl mx-auto">
            Ingen profiler. Ingen jag. Ingen distraksjoner.
            Bare én match om gangen — i en trygg 30‑dagers reise.
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <a
              href="/signup"
              className="bg-[#CBAA7A] text-black px-10 py-4 rounded-xl text-lg font-medium shadow-lg shadow-black/20 hover:bg-[#d8b887] transition"
            >
              Start reisen
            </a>

            <a
              href="/hvordan-det-fungerer"
              className="text-[#CBAA7A] text-lg underline underline-offset-4 hover:text-[#e3c89a] transition"
            >
              Hvordan ToSom fungerer →
            </a>
          </div>
        </div>
      </section>
    </FadeIn>
  )
}
