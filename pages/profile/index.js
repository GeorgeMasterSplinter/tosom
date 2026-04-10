
import { useEffect, useState } from 'react'

export default function MyProfile() {
  const [profile, setProfile] = useState(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({})

  useEffect(() => {
    const userId = localStorage.getItem('userId')
    if (!userId) return

    fetch(`/api/profile/get?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setProfile(data.user.profile)
        setForm(data.user.profile || {})
      })
  }, [])

  const save = async () => {
    const userId = localStorage.getItem('userId')

    const res = await fetch('/api/profile/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, data: form }),
    })

    const data = await res.json()
    setProfile(data.user.profile)
    setEditing(false)
  }

  if (!profile) {
    return (
      <>
      
        <main className="min-h-screen bg-black text-white px-6 py-20">
          Laster profil…
        </main>
      </>
    )
  }

  return (
    <>
      

      <main className="min-h-screen bg-black text-white px-6 py-20">
        <h1 className="text-3xl font-semibold mb-6">Min profil</h1>

        {!editing ? (
          <>
            <div className="space-y-4">
              <p><span className="text-gray-400">Alder:</span> {profile.age}</p>
              <p><span className="text-gray-400">Kjønn:</span> {profile.gender}</p>
              <p><span className="text-gray-400">Søker:</span> {profile.seeking}</p>
              <p><span className="text-gray-400">Personlighet:</span> {profile.personality}</p>
              <p><span className="text-gray-400">Livsstil:</span> {profile.lifestyle}</p>
              <p><span className="text-gray-400">Relasjonsmål:</span> {profile.relationshipGoal}</p>
              <p><span className="text-gray-400">Verdier:</span> {profile.values?.join(', ')}</p>
              <p><span className="text-gray-400">Preferanser:</span> {profile.preferences?.join(', ')}</p>
            </div>

            <button
              onClick={() => setEditing(true)}
              className="mt-10 px-6 py-3 bg-white text-black rounded-md"
            >
              Rediger profil
            </button>
          </>
        ) : (
          <>
            <div className="space-y-4">
              <input
                className="w-full bg-gray-900 p-3 rounded"
                value={form.age || ''}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
                placeholder="Alder"
              />

              <input
                className="w-full bg-gray-900 p-3 rounded"
                value={form.gender || ''}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                placeholder="Kjønn"
              />

              <input
                className="w-full bg-gray-900 p-3 rounded"
                value={form.seeking || ''}
                onChange={(e) => setForm({ ...form, seeking: e.target.value })}
                placeholder="Søker"
              />

              <input
                className="w-full bg-gray-900 p-3 rounded"
                value={form.personality || ''}
                onChange={(e) => setForm({ ...form, personality: e.target.value })}
                placeholder="Personlighet"
              />

              <input
                className="w-full bg-gray-900 p-3 rounded"
                value={form.lifestyle || ''}
                onChange={(e) => setForm({ ...form, lifestyle: e.target.value })}
                placeholder="Livsstil"
              />

              <input
                className="w-full bg-gray-900 p-3 rounded"
                value={form.relationshipGoal || ''}
                onChange={(e) => setForm({ ...form, relationshipGoal: e.target.value })}
                placeholder="Relasjonsmål"
              />
            </div>

            <button
              onClick={save}
              className="mt-10 px-6 py-3 bg-white text-black rounded-md"
            >
              Lagre
            </button>

            <button
              onClick={() => setEditing(false)}
              className="mt-4 px-6 py-3 bg-gray-800 text-white rounded-md"
            >
              Avbryt
            </button>
          </>
        )}
      </main>
    </>
  )
}
