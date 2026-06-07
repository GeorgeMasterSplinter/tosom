import NotificationCenter from "@/components/NotificationCenter";
import { useEffect, useState } from "react";
import FadeIn from "@/components/animations/FadeIn";

export default function Header() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    async function check() {
      try {
        const res = await fetch("/api/me");
        const data = await res.json();
        if (data?.id) setLoggedIn(true);
      } catch (e) {
        setLoggedIn(false);
      }
    }
    check();
  }, []);

  return (
    <header className="flex justify-between items-center px-6 py-5 bg-[#1E2A38]/70 backdrop-blur-md border-b border-[#CBAA7A]/20 sticky top-0 z-50 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
      {/* Logo */}
      <a href="/" className="text-[#CBAA7A] hover:text-[#CBAA7A] transition-colors duration-300 ease-out text-2xl font-light tracking-wide">
        ToSom
      </a>

      {/* Navigasjon */}
      <nav className="flex items-center gap-6 text-sm text-[#EDEDED]/80">
        <a href="/hvordan-det-fungerer" className="hover:text-[#CBAA7A] transition-colors duration-300 ease-out">
          Hvordan det fungerer
        </a>
        <a href="/om" className="hover:text-[#CBAA7A] transition-colors duration-300 ease-out">
          Om ToSom
        </a>

        {/* Hvis bruker er innlogget → vis NotificationCenter + Dashboard */}
        {loggedIn ? (
          <>
            <a href="/dashboard" className="hover:text-[#CBAA7A] transition-colors duration-300 ease-out text-[#CBAA7A]">
              Dashboard
            </a>

            <NotificationCenter />

            <a
              href="/logout"
              className="bg-[#CBAA7A]/20 border border-[#CBAA7A]/30 px-4 py-2 rounded-lg hover:text-[#CBAA7A] transition-colors duration-300 ease-out"
            >
              Logg ut
            </a>
          </>
        ) : (
          <>
            <a href="/login" className="hover:text-[#CBAA7A] transition-colors duration-300 ease-out">
              Logg inn
            </a>
            <a
              href="/signup"
              className="bg-[#CBAA7A] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#CBAA7A]/30 hover:text-[#CBAA7A] transition-colors duration-300 ease-out"
            >
              Start reisen
            </a>
          </>
        )}
      </nav>
    </header>
  );
}