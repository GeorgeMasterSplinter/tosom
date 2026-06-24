import Header from './Header'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="pt-20">
        {children}
      </main>

      <footer className="mt-20 py-10 text-center text-gray-600 text-sm border-t border-gray-800">
        © {new Date().getFullYear()} ToSom. Alle rettigheter forbeholdt.
      </footer>
    </div>
  )
}
