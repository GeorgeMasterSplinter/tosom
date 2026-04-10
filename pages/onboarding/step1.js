
import { useState } from 'react'

export default function Step1() {
  const [gender, setGender] = useState('')
  const [seeking, setSeeking] = useState('')

  return (
    <>
      <Header />

      <main className="min-h-screen bg-black text-white flex flex-col items-center px-6 py-24">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-center">
          La oss starte
        </h1>

        <p className="text-gray-400 text-lg mt-4 max-w-xl text-center leading-relaxed">
          Først trenger vi å vite litt om deg og hvem du ønsker å møte.
        </p>

        {/* Jeg er */}
        <div className="mt-12 w-full max-w-md">
          <label className="text-gray-300 text-sm">Jeg er</label>
          <div className="flex flex-col gap-3 mt-2">
            <button
              onClick={() => setGender('mann')}
              className={`px-4 py-3 rounded-md border ${
                gender === 'mann'
                  ? 'border-white bg-white text-black'
                  : 'border-gray-700 text-white hover:border-gray-500'
              } transition`}
            >
              Mann
            </button>

            <button
              onClick={() => setGender('kvinne')}
              className={`px-4 py-3 rounded-md border ${
                gender === 'kvinne'
                  ? 'border-white bg-white text-black'
                  : 'border-gray-700 text-white hover:border-gray-500'
              } transition`}
            >
              Kvinne
            </button>

            <button
              onClick={() => setGender('annet')}
              className={`px-4 py-3 rounded-md border ${
                gender === 'annet'
                  ? 'border-white bg-white text-black'
                  : 'border-gray-700 text-white hover:border-gray-500'
              } transition`}
            >
              Annet
            </button>
          </div>
        </div>

        {/* Jeg søker */}
        <div className="mt-10 w-full max-w-md">
          <label className="text-gray-300 text-sm">Jeg søker</label>
          <div className="flex flex-col gap-3 mt-2">
            <button
              onClick={() => setSeeking('menn')}
              className={`px-4 py-3 rounded-md border ${
                seeking === 'menn'
                  ? 'border-white bg-white text-black'
                  : 'border-gray-700 text-white hover:border-gray-500'
              } transition`}
            >
              Menn
            </button>

            <button
              onClick={() => setSeeking('kvinner')}
              className={`px-4 py-3 rounded-md border ${
                seeking === 'kvinner'
                  ? 'border-white bg-white text-black'
                  : 'border-gray-700 text-white hover:border-gray-500'
              } transition`}
            >
              Kvinner
            </button>

            <button
              onClick={() => setSeeking('alle')}
              className={`px-4 py-3 rounded-md border ${
                seeking === 'alle'
                  ? 'border-white bg-white text-black'
                  : 'border-gray-700 text-white hover:border-gray-500'
              } transition`}
            >
              Alle
            </button>
          </div>
        </div>

        {/* Neste knapp */}
        <a
          href="/onboarding/step2"
          className={`mt-12 px-8 py-4 rounded-md font-medium transition ${
            gender && seeking
              ? 'bg-white text-black hover:bg-gray-200'
              : 'bg-gray-800 text-gray-600 pointer-events-none'
          }`}
        >
          Neste
        </a>
      </main>
    </>
  )
}
