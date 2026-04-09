export default function Header() {
  return (
    <header className="w-full py-4 px-6 flex items-center justify-between bg-black border-b border-gray-800">
      <div className="text-xl font-semibold tracking-tight">
        ToSom
      </div>

      <nav className="flex gap-6 text-gray-300">
        <a href="/" className="hover:text-white transition">Hjem</a>
        <a href="/about" className="hover:text-white transition">Om oss</a>
        <a href="/signup" className="hover:text-white transition">Bli medlem</a>
      </nav>
    </header>
  )
}
