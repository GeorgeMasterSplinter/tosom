import Header from '../../components/Header'
import { useState } from 'react'

export default function Step3() {
  const [goal, setGoal] = useState('')

  return (
    <>
      <Header />

      <main className="min-h-screen bg-black text-white flex flex-col items-center px-6 py-24">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-center">
          Hva ser du etter?
        </h1>

        <p className="text-gray-400 text-lg mt-4 max-w-xl text-center leading-relaxed">
          Dette hjelper oss å finne mennesker som ønsker det samme som deg.
        </p>

        <div className="mt-12 w-full max-w-md flex flex-col gap-4">

          <button
            onClick={() => setGoal('forhold')}
            className={`px-4 py-4 rounded-md border text-left ${
              goal === 'forhold'
                ? 'border-white bg-white text-black'
                : 'border-gray-700 text-white hover:border-gray-500'
            } transition`}
          >
            Et seriøst forhold
          </button>

          <button
            onClick={() => setGoal('bli_kjent')}
            className={`px-4 py-4 rounded-md border text-left ${
              goal === 'bli_kjent'
                ? 'border-white bg-white text-black'
                : 'border-gray-700 text-white hover:border-gray-500'
            } transition`}
          >
            Bli kjent og se hva som skjer
          </button>

          <button
            onClick={() => setGoal('uforpliktende')}
            className={`px-4 py-4 rounded-md border text-left ${
              goal === 'uforpliktende'
                ? 'border-white bg-white text-black'
                : 'border-gray-700 text-white hover:border-gray-500'
            } transition`}
          >
            Noe uforpliktende
          </button>

          <button
            onClick={() => setGoal('ikke_sikker')}
            className={`px-4 py-4 rounded-md border text-left ${
              goal === 'ikke_sikker'
                ? 'border-white bg-white text-black'
                : 'border-gray-700 text-white hover:border-gray-500'
            } transition`}
          >
            Jeg er ikke sikker ennå
          </button>

        </div>

        {/* Neste knapp */}
        <a
          href="/onboarding/step4"
          className={`mt-12 px-8 py-4 rounded-md font-medium transition ${
            goal
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
