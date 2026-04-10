
import { useState } from 'react'

export default function Step2() {
  const [age, setAge] = useState('')

  const isValid = age && Number(age) >= 18 && Number(age) <= 99

  return (
    <>
    

      <main className="min-h-screen bg-black text-white flex flex-col items-center px-6 py-24">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-center">
          Hvor gammel er du?
        </h1>

        <p className="text-gray-400 text-lg mt-4 max-w-xl text-center leading-relaxed">
          Alder hjelper oss å finne bedre matcher for deg.
        </p>

        <div className="mt-12 w-full max-w-md flex flex-col">
          <label className="text-gray-300 mb-1">Alder</label>
          <input
            type="number"
            min="18"
            max="99"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="bg-black border border-gray-700 rounded-md px-4 py-3 text-white focus:outline-none focus:border-gray-400"
            placeholder="Skriv inn alderen din"
          />
          <p className="text-gray-500 text-sm mt-2">
            Du må være minst 18 år.
          </p>
        </div>

        {/* Neste knapp */}
        <a
          href="/onboarding/step3"
          className={`mt-12 px-8 py-4 rounded-md font-medium transition ${
            isValid
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
