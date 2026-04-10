
import { useState } from 'react'

export default function Step6() {
  const [personality, setPersonality] = useState('')

  const options = [
    { id: 'introvert', label: 'Introvert' },
    { id: 'ambivert', label: 'Ambivert' },
    { id: 'ekstrovert', label: 'Ekstrovert' },
  ]

  return (
    <>
      
      <main className="min-h-screen bg-black text-white flex flex-col items-center px-6 py-24">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-center">
          Hvordan vil du beskrive deg selv?
        </h1>

        <p className="text-gray-400 text-lg mt-4 max-w-xl text-center leading-relaxed">
          Dette hjelper oss å finne mennesker som matcher energien din.
        </p>

        <div className="mt-12 w-full max-w-md flex flex-col gap-4">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setPersonality(opt.id)}
              className={`px-4 py-4 rounded-md border text-left ${
                personality === opt.id
                  ? 'border-white bg-white text-black'
                  : 'border-gray-700 text-white hover:border-gray-500'
              } transition`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Neste knapp */}
        <a
          href="/onboarding/step7"
          className={`mt-12 px-8 py-4 rounded-md font-medium transition ${
            personality
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
