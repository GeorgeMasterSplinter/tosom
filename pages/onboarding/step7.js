

export default function Step7() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-black text-white flex flex-col items-center px-6 py-24">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-center">
          Oppsummering
        </h1>

        <p className="text-gray-400 text-lg mt-4 max-w-xl text-center leading-relaxed">
          Se over informasjonen din før du fullfører profilen.
        </p>

        <div className="mt-12 w-full max-w-md flex flex-col gap-6">

          <div className="border border-gray-800 rounded-lg p-4">
            <h3 className="text-gray-300 text-sm mb-1">Kjønn</h3>
            <p className="text-white font-medium">Valg lagres senere</p>
          </div>

          <div className="border border-gray-800 rounded-lg p-4">
            <h3 className="text-gray-300 text-sm mb-1">Jeg søker</h3>
            <p className="text-white font-medium">Valg lagres senere</p>
          </div>

          <div className="border border-gray-800 rounded-lg p-4">
            <h3 className="text-gray-300 text-sm mb-1">Alder</h3>
            <p className="text-white font-medium">Valg lagres senere</p>
          </div>

          <div className="border border-gray-800 rounded-lg p-4">
            <h3 className="text-gray-300 text-sm mb-1">Relasjonsmål</h3>
            <p className="text-white font-medium">Valg lagres senere</p>
          </div>

          <div className="border border-gray-800 rounded-lg p-4">
            <h3 className="text-gray-300 text-sm mb-1">Livsstil</h3>
            <p className="text-white font-medium">Valg lagres senere</p>
          </div>

          <div className="border border-gray-800 rounded-lg p-4">
            <h3 className="text-gray-300 text-sm mb-1">Verdier</h3>
            <p className="text-white font-medium">Valg lagres senere</p>
          </div>

          <div className="border border-gray-800 rounded-lg p-4">
            <h3 className="text-gray-300 text-sm mb-1">Personlighet</h3>
            <p className="text-white font-medium">Valg lagres senere</p>
          </div>

        </div>

        <a
          href="/onboarding/complete"
          className="mt-12 px-8 py-4 bg-white text-black rounded-md font-medium hover:bg-gray-200 transition"
        >
          Fullfør profil
        </a>
      </main>
    </>
  )
}
