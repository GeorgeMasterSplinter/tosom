
import { useState } from 'react'

export default function Step5() {
  const [value, setValue] = useState('')

  const options = [
    { id: 'familie', label: 'Familie' },
    { id: 'karriere', label: 'Karriere' },
    { id: 'frihet', label: 'Frihet' },
    { id: 'stabilitet', label: 'Stabilitet' },
    { id: 'åpenhet', label: 'Åpenhet' },
    { id: 'humor', label: 'Humor' },
  ]

  return (
    <>
      

      <main className="min-h-screen bg-black text-white flex flex-col items-center px-6 py-24">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-center">
          Hva er viktigst for deg?
        </h1>

        <p className="text-gray-400 text-lg mt-4 max-w-xl text-center leading-relaxed">
          Verdier sier mye om hvem du er og hvem du passer med.
        </p>

        <div className="mt-12 w-full max-w-md flex flex-col gap-4">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setValue(opt.id)}
              className={`px-4 py-4 rounded-md border text-left ${
                value === opt.id
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
          href="/onboarding/step6"
          className={`mt-12 px-8 py-4 rounded-md font-medium transition ${
            value
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
