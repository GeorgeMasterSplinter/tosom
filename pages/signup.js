import Header from '../components/Header'

export default function Signup() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-black text-white flex flex-col items-center px-6 py-24">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-center">
          Bli medlem
        </h1>

        <p className="text-gray-400 text-lg mt-4 max-w-xl text-center">
          Opprett en konto og start reisen mot en ekte relasjon.
        </p>

        <form className="mt-12 w-full max-w-md flex flex-col gap-6">

          <div className="flex flex-col">
            <label className="text-gray-300 mb-1">E‑post</label>
            <input
              type="email"
              className="bg-black border border-gray-700 rounded-md px-4 py-3 text-white focus:outline-none focus:border-gray-400"
              placeholder="din@epost.no"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-300 mb-1">Passord</label>
            <input
              type="password"
              className="bg-black border border-gray-700 rounded-md px-4 py-3 text-white focus:outline-none focus:border-gray-400"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="mt-4 px-6 py-3 bg-white text-black rounded-md font-medium hover:bg-gray-200 transition"
          >
            Opprett konto
          </button>

        </form>

        <p className="text-gray-500 text-sm mt-6">
          Allerede medlem?{' '}
          <a href="/login" className="text-gray-300 hover:text-white transition">
            Logg inn
          </a>
        </p>
      </main>
    </>
  )
}
