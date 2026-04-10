
import { useEffect, useState } from 'react'

export default function Matches() {
  const [matches, setMatches] = useState([])

  useEffect(() => {
    const userId = localStorage.getItem('userId')

    if (!userId) return

    fetch(`/api/matches/list?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.matches) setMatches(data.matches)
      })
  }, [])

  return (
    <>
    

      <main className="min-h-screen bg-black text-white px-6 py-20">
        <h1 className="text-3xl font-semibold mb-8">Dine matcher</h1>

        <div className="flex flex-col gap-4">
          {matches.map((m) => (
            <a
              key={m.id}
              href={`/messages/${m.id}`}
              className="border border-gray-800 rounded-lg p-4 hover:bg-gray-900 transition"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xl font-medium">{m.name}</p>
                  <p className="text-gray-400 text-sm">{m.age} år</p>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-semibold">{m.score}</p>
                  <p className="text-gray-500 text-xs">match score</p>
                </div>
              </div>
            </a>
          ))}

          {matches.length === 0 && (
            <p className="text-gray-500 text-center mt-10">
              Ingen matcher ennå. Fullfør onboarding eller prøv igjen senere.
            </p>
          )}
        </div>
      </main>
    </>
  )
}
