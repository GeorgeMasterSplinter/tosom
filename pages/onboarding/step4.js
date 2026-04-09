import Header from '../../components/Header'
import { useState } from 'react'

export default function Step4() {
  const [smoking, setSmoking] = useState('')
  const [alcohol, setAlcohol] = useState('')
  const [kids, setKids] = useState('')
  const [activity, setActivity] = useState('')

  const isValid = smoking && alcohol && kids && activity

  return (
    <>
      <Header />

      <main className="min-h-screen bg-black text-white flex flex-col items-center px-6 py-24">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-center">
          Livsstil
        </h1>

        <p className="text-gray-400 text-lg mt-4 max-w-xl text-center leading-relaxed">
          Dette hjelper oss å finne mennesker som lever på en måte som passer deg.
        </p>

        {/* Røyking */}
        <div className="mt-12 w-full max-w-md">
          <label className="text-gray-300 text-sm">Røyker du?</label>
          <div className="flex flex-col gap-3 mt-2">
            {['ja', 'nei', 'av og til'].map((option) => (
              <button
                key={option}
                onClick={() => setSmoking(option)}
                className={`px-4 py-3 rounded-md border ${
                  smoking === option
                    ? 'border-white bg-white text-black'
                    : 'border-gray-700 text-white hover:border-gray-500'
                } transition`}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Alkohol */}
        <div className="mt-10 w-full max-w-md">
          <label className="text-gray-300 text-sm">Drikker du alkohol?</label>
          <div className="flex flex-col gap-3 mt-2">
            {['ja', 'nei', 'sjelden'].map((option) => (
              <button
                key={option}
                onClick={() => setAlcohol(option)}
                className={`px-4 py-3 rounded-md border ${
                  alcohol === option
                    ? 'border-white bg-white text-black'
                    : 'border-gray-700 text-white hover:border-gray-500'
                } transition`}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Barn */}
        <div className="mt-10 w-full max-w-md">
          <label className="text-gray-300 text-sm">Har du barn?</label>
          <div className="flex flex-col gap-3 mt-2">
            {['ja', 'nei', 'ønsker barn', 'usikker'].map((option) => (
              <button
                key={option}
                onClick={() => setKids(option)}
                className={`px-4 py-3 rounded-md border ${
                  kids === option
                    ? 'border-white bg-white text-black'
                    : 'border-gray-700 text-white hover:border-gray-500'
                } transition`}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Aktivitetsnivå */}
        <div className="mt-10 w-full max-w-md">
          <label className="text-gray-300 text-sm">Aktivitetsnivå</label>
          <div className="flex flex-col gap-3 mt-2">
            {['rolig', 'balansert', 'aktiv'].map((option) => (
              <button
                key={option}
                onClick={() => setActivity(option)}
                className={`px-4 py-3 rounded-md border ${
                  activity === option
                    ? 'border-white bg-white text-black'
                    : 'border-gray-700 text-white hover:border-gray-500'
                } transition`}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Neste knapp */}
        <a
          href="/onboarding/step5"
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
