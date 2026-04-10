

export default function Home() {
  return (
    <>

      {/* HERO */}
      <section className="w-full bg-black text-white py-32 px-6 flex flex-col items-center">
        <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-center max-w-3xl">
          Et roligere sted å møte noen
        </h1>

        <p className="text-gray-400 text-lg md:text-xl mt-6 max-w-2xl text-center leading-relaxed">
          ToSom er for voksne som ønsker ekte relasjoner. Ingen jag. Ingen sveiping.
          Bare mennesker som faktisk passer deg.
        </p>

        <div className="mt-10 flex gap-4">
          <a
            href="/signup"
            className="px-8 py-4 bg-white text-black rounded-md font-medium hover:bg-gray-200 transition"
          >
            Kom i gang
          </a>

          <a
            href="/about"
            className="px-8 py-4 border border-gray-700 rounded-md font-medium hover:border-gray-500 transition"
          >
            Lær mer
          </a>
        </div>
      </section>

      {/* MIDLOERTIDIG UNDER CONSTRUCTION */}
      <main className="min-h-[40vh] bg-black text-white flex flex-col items-center justify-center px-6">
        <p className="text-gray-500 text-lg mt-6 text-center">
          UNDER CONSTRUCTION
        </p>
      </main>

      {/* FOOTER – flyttet inn i return */}
      <footer className="w-full bg-black border-t border-gray-800 py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">

          <div className="text-gray-400 text-sm">
            © {new Date().getFullYear()} ToSom. Alle rettigheter forbeholdt.
          </div>

          <nav className="flex gap-6 text-gray-400 text-sm">
            <a href="/privacy" className="hover:text-white transition">Personvern</a>
            <a href="/terms" className="hover:text-white transition">Vilkår</a>
            <a href="/contact" className="hover:text-white transition">Kontakt</a>
          </nav>

        </div>
      </footer>
    </>
  )
}
