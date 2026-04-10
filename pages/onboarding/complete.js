
import { useEffect, useState } from 'react'

export default function OnboardingComplete() {
  const [saving, setSaving] = useState(false)

  const handleFinish = async () => {
    setSaving(true)

    const userId = localStorage.getItem('userId') // midlertidig — kobles til auth senere

    const data = {
      age: localStorage.getItem('age'),
      gender: localStorage.getItem('gender'),
      seeking: localStorage.getItem('seeking'),
      values: JSON.parse(localStorage.getItem('values') || '[]'),
      personality: localStorage.getItem('personality'),
      lifestyle: localStorage.getItem('lifestyle'),
      relationshipGoal: localStorage.getItem('relationshipGoal'),
      preferences: JSON.parse(localStorage.getItem('preferences') || '[]'),
    }

    await fetch('/api/onboarding/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, data }),
    })

    // Rydd opp etter onboarding
    localStorage.removeItem('age')
    localStorage.removeItem('gender')
    localStorage.removeItem('seeking')
    localStorage.removeItem('values')
    localStorage.removeItem('personality')
    localStorage.removeItem('lifestyle')
    localStorage.removeItem('relationshipGoal')
    localStorage.removeItem('preferences')

    window.location.href = '/dashboard'
  }

  return (
    <>
      

      <main className="min-h-screen bg-black text-white flex flex-col items-center px-6 py-32">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-center">
          Profilen din er klar
        </h1>

        <p className="text-gray-400 text-lg mt-4 max-w-xl text-center leading-relaxed">
          Takk for at du tok deg tid. Nå kan vi begynne å finne mennesker som faktisk passer deg.
        </p>

        <button
          onClick={handleFinish}
          disabled={saving}
          className="mt-12 px-8 py-4 bg-white text-black rounded-md font-medium hover:bg-gray-200 transition disabled:opacity-50"
        >
          {saving ? 'Lagrer...' : 'Gå til dashboard'}
        </button>

        <p className="text-gray-600 text-sm mt-6">
          Du kan alltid endre informasjonen din senere.
        </p>
      </main>
    </>
  )
}
