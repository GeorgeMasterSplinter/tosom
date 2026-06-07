export default function Footer() {
  return (
    <footer className="px-6 py-12 text-center text-[#4A4A4A] border-t border-[#E5E5E5]">
      <p className="mb-6 leading-relaxed font-normal tracking-wide">
        ToSom – et rolig sted for voksne som søker noe ekte.
      </p>

      <div className="flex flex-wrap justify-center gap-6 text-sm font-normal leading-relaxed">
        <a href="/hvordan-det-fungerer" className="hover:text-[#1A1A1A] transition-colors duration-300">Hvordan det fungerer</a>
        <a href="/om" className="hover:text-[#1A1A1A] transition-colors duration-300">Om ToSom</a>
        <a href="/personvern" className="hover:text-[#1A1A1A] transition-colors duration-300">Personvern</a>
        <a href="/kontakt" className="hover:text-[#1A1A1A] transition-colors duration-300">Kontakt</a>
      </div>
    </footer>
  );
}