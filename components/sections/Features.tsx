import FadeIn from "@/components/animations/FadeIn"


export default function Features() {
  return (
    <section className="px-6 py-28 max-w-5xl mx-auto grid md:grid-cols-2 gap-16">
      <FadeIn delay={0.1}>
        {/* Punkt 1 */}
        <div className="flex gap-4 mb-6">
          ...
        </div>
      </FadeIn>

      <FadeIn delay={0.2}>
        {/* Punkt 2 */}
        <div className="flex gap-4">
          ...
        </div>
      </FadeIn>

      <FadeIn delay={0.3}>
        {/* Punkt 3 */}
        <div className="flex gap-4">
          ...
        </div>
      </FadeIn>

      <FadeIn delay={0.4}>
        {/* Punkt 4 */}
        <div className="flex gap-4">
          ...
        </div>
      </FadeIn>

      <FadeIn delay={0.5}>
        {/* Punkt 5 */}
        <div className="flex gap-4">
          ...
        </div>
      </FadeIn>
    </section>
  )
}

{/* 5 PUNKTER */}
<section className="px-6 py-28 max-w-5xl mx-auto grid md:grid-cols-2 gap-16">

  {/* Punkt 1 */}
  <div className="flex gap-4">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#D4AF37" className="w-10 h-10 flex-shrink-0">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.5 12c2.1 4.5 6.3 7.5 10.5 7.5 1.8 0 3.6-.45 5.25-1.35M6.75 6.75A10.45 10.45 0 0112 4.5c4.2 0 8.4 3 10.5 7.5a10.52 10.52 0 01-1.17 2.1M6.75 6.75L3 3m3.75 3.75l3.75 3.75m7.5 7.5L21 21m-3.75-3.75l-3.75-3.75" />
    </svg>

    <div>
      <h3 className="text-2xl font-light mb-3 tracking-wide">Ingen profiler å bla i</h3>
      <p className="text-[#C7CED6] leading-relaxed">
        ToSom viser aldri en katalog av mennesker. Du slipper sammenligning,
        jag og overfladisk scrolling. Her handler det om deg — og én person
        som faktisk passer.
      </p>
    </div>
  </div>

  {/* Punkt 2 */}
  <div className="flex gap-4">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#D4AF37" className="w-10 h-10 flex-shrink-0">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0V10.5m-.75 0h10.5A1.5 1.5 0 0118 12v7.5A1.5 1.5 0 0116.5 21h-9A1.5 1.5 0 016 19.5V12a1.5 1.5 0 011.5-1.5z" />
    </svg>

    <div>
      <h3 className="text-2xl font-light mb-3 tracking-wide">Privat profil + match etter 48 timer</h3>
      <p className="text-[#C7CED6] leading-relaxed">
        Profilen din er privat og vises aldri offentlig. ToSom bruker innsikt
        fra relasjonspsykologi og modenhetsforskning til å finne 1–3 personer
        som passer deg — uten swipe‑kultur eller algoritmisk avhengighet.
      </p>
    </div>
  </div>

  {/* Punkt 3 */}
  <div className="flex gap-4">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#D4AF37" className="w-10 h-10 flex-shrink-0">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0 5.25-9 12-9 12s-9-6.75-9-12a4.5 4.5 0 019 0 4.5 4.5 0 019 0z" />
    </svg>

    <div>
      <h3 className="text-2xl font-light mb-3 tracking-wide">Én match om gangen – 30 dager</h3>
      <p className="text-[#C7CED6] leading-relaxed">
        Når du velger én av matchene, er dere låst i en trygg 1‑til‑1 reise i
        30 dager. De første 14 dagene uten bilder, slik at dere starter med
        ordene og bygger ekte kontakt. Dette reduserer ghosting dramatisk.
      </p>
    </div>
  </div>

  {/* Punkt 4 */}
  <div className="flex gap-4">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#D4AF37" className="w-10 h-10 flex-shrink-0">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3h6m-6 3h3m-6 3.75l3-3H18a1.5 1.5 0 001.5-1.5V6.75A1.5 1.5 0 0018 5.25H6A1.5 1.5 0 004.5 6.75v10.5z" />
    </svg>

    <div>
      <h3 className="text-2xl font-light mb-3 tracking-wide">Bli‑kjent funksjoner</h3>
      <p className="text-[#C7CED6] leading-relaxed">
        ToSom gir dere rolige, gjennomtenkte verktøy som gjør det lettere å
        åpne seg, forstå hverandre og bygge noe ekte — uten press og uten
        hastverk.
      </p>
    </div>
  </div>

  {/* Punkt 5 */}
  <div className="flex gap-4">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#D4AF37" className="w-10 h-10 flex-shrink-0">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>

    <div>
      <h3 className="text-2xl font-light mb-3 tracking-wide">Ingen abonnement</h3>
      <p className="text-[#C7CED6] leading-relaxed">
        Én 30‑dagers reise. Ingen skjulte kostnader. Enkelt, ærlig og
        transparent.
      </p>
    </div>
  </div>

</section>
