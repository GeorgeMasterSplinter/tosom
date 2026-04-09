export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-center">
        Finn noen som faktisk passer deg
      </h1>

      <p className="text-gray-400 text-lg md:text-xl mt-6 max-w-xl text-center leading-relaxed">
        ToSom er en rolig, moden og målrettet plattform for voksne som ønsker
        ekte relasjoner – ikke endeløs sveiping.
      </p>

      <div className="mt-12 flex gap-4">
        <a
          href="/signup"
          className="px-6 py-3 bg-white text-black rounded-md font-medium hover:bg-gray-200 transition"
        >
          Kom i gang
        </a>

        <a
          href="/about"
          className="px-6 py-3 border border-gray-600 rounded-md font-medium hover:border-gray-400 transition"
        >
          Lær mer
        </a>
      </div>
    </main>
  )
}
