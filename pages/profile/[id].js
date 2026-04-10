
import { useRouter } from 'next/router'

export default function ProfilePage() {
  const router = useRouter()
  const { id } = router.query

  // Midlertidige dummy-data
  const profiles = {
    1: {
      name: 'Maria, 32',
      value: 'Familie',
      personality: 'Ambivert',
      lifestyle: 'Balansert',
      bio: 'Jeg er en varm og rolig person som liker turer, matlaging og gode samtaler. Ser etter noen som ønsker noe ekte.',
    },
    2: {
      name: 'Thomas, 29',
      value: 'Stabilitet',
      personality: 'Introvert',
      lifestyle: 'Rolig',
      bio: 'Jobber innen IT, liker roligere kvelder, spill, film og dype samtaler. Ser etter trygghet og stabilitet.',
    },
    3: {
      name: 'Elise, 35',
      value: 'Åpenhet',
      personality: 'Ekstrovert',
      lifestyle: 'Aktiv',
      bio: 'Elsker å reise, trene og møte nye mennesker. Ser etter noen som er nysgjerrig og åpen.',
    },
  }

  const profile = profiles[id] || null

  return (
    <>
      <Header />

      <main className="min-h-screen bg-black text-white px-6 py-24 flex flex-col items-center">
        {!profile ? (
          <p className="text-gray-400">Laster profil...</p>
        ) : (
          <>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-center">
              {profile.name}
            </h1>

            <div className="mt-12 w-full max-w-xl flex flex-col gap-6">

              <div className="border border-gray-800 rounded-lg p-6">
                <h3 className="text-gray-300 text-sm mb-1">Verdi</h3>
                <p className="text-white font-medium">{profile.value}</p>
              </div>

              <div className="border border-gray-800 rounded-lg p-6">
                <h3 className="text-gray-300 text-sm mb-1">Personlighet</h3>
                <p className="text-white font-medium">{profile.personality}</p>
              </div>

              <div className="border border-gray-800 rounded-lg p-6">
                <h3 className="text-gray-300 text-sm mb-1">Livsstil</h3>
                <p className="text-white font-medium">{profile.lifestyle}</p>
              </div>

              <div className="border border-gray-800 rounded-lg p-6">
                <h3 className="text-gray-300 text-sm mb-1">Om meg</h3>
                <p className="text-gray-400 leading-relaxed">{profile.bio}</p>
              </div>

            </div>

            <a
              href={`/messages/${id}`}
              className="mt-12 px-8 py-4 bg-white text-black rounded-md font-medium hover:bg-gray-200 transition"
            >
              Start samtale
            </a>
          </>
        )}
      </main>
    </>
  )
}
