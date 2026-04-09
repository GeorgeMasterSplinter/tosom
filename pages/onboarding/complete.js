import Header from '../../components/Header'

export default function OnboardingComplete() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-black text-white flex flex-col items-center px-6 py-32">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-center">
          Profilen din er klar
        </h1>

        <p className="text-gray-400 text-lg mt-4 max-w-xl text-center leading-relaxed">
          Takk for at du tok deg tid. Nå kan vi begynne å finne mennesker som faktisk passer deg.
        </p>

        <a
          href="/dashboard"
          className="mt-12 px-8 py-4 bg-white text-black rounded-md font-medium hover:bg-gray-200 transition"
        >
          Gå til dashboard
        </a>

        <p className="text-gray-600 text-sm mt-6">
          Du kan alltid endre informasjonen din senere.
        </p>
      </main>
    </>
  )
}
