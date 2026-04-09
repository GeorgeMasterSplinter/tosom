import Header from '../components/Header'

export default function Matches() {
  // Midlertidige dummy-data
  const matches = [
    {
      id: 1,
      name: 'Maria, 32',
      value: 'Familie',
      personality: 'Ambivert',
      lifestyle: 'Balansert',
    },
    {
      id: 2,
      name: 'Thomas, 29',
      value: 'Stabilitet',
      personality: 'Introvert',
      lifestyle: 'Rolig',
    },
    {
      id: 3,
      name: 'Elise, 35',
      value: 'Åpenhet',
      personality: 'Ekstrovert',
      lifestyle: 'Aktiv',
    },
  ]

  return (
    <>
      <Header />

      <main className="min-h-screen bg-black text-white px-6 py-24 flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-center">
          Dine matcher
        </h1>

        <p className="text-gray-400 text-lg mt-4 max-w-xl text-center leading-relaxed">
          Basert på informasjonen du ga oss, har vi funnet noen mennesker som kan passe deg.
        </p>

        <div className="mt-16 w-full max-w-2xl flex flex-col gap-6">
          {matches.map((match) => (
            <div
              key={match.id}
              className="border border-gray-800 rounded-lg p-6 flex flex-col gap-2 hover:border-gray-600 transition"
            >
              <h2 className="text-2xl font-semibold">{match.name}</h2>

              <p className="text-gray-400">
                <span className="text-gray-300">Verdi:</span> {match.value}
              </p>

              <p className="text-gray-400">
                <span className="text-gray-300">Personlighet:</span> {match.personality}
              </p>

              <p className="text-gray-400">
                <span className="text-gray-300">Livsstil:</span> {match.lifestyle}
              </p>

              <a
                href={`/profile/${match.id}`}
                className="mt-4 px-6 py-3 bg-white text-black rounded-md font-medium hover:bg-gray-200 transition w-fit"
              >
                Se profil
              </a>
            </div>
          ))}
        </div>

        <p className="text-gray-600 text-sm mt-10">
          Flere matcher kommer etter hvert.
        </p>
      </main>
    </>
  )
}
