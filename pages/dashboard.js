

export default function Dashboard() {
  return (
    <>
  

      <main className="min-h-screen bg-black text-white px-6 py-24 flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-center">
          Velkommen tilbake
        </h1>

        <p className="text-gray-400 text-lg mt-4 max-w-xl text-center leading-relaxed">
          Profilen din er komplett. Vi jobber med å finne mennesker som faktisk passer deg.
        </p>

        <div className="mt-16 w-full max-w-md flex flex-col gap-6">

          <a
            href="/matches"
            className="px-6 py-4 bg-white text-black rounded-md font-medium hover:bg-gray-200 transition text-center"
          >
            Se matcher
          </a>

          <a
            href="/profile"
            className="px-6 py-4 border border-gray-700 rounded-md font-medium hover:border-gray-500 transition text-center"
          >
            Rediger profil
          </a>

          <a
            href="/messages"
            className="px-6 py-4 border border-gray-700 rounded-md font-medium hover:border-gray-500 transition text-center"
          >
            Meldinger
          </a>

        </div>

        <p className="text-gray-600 text-sm mt-10">
          Flere funksjoner kommer snart.
        </p>
      </main>
    </>
  )
}
