"use client";

import { useState } from "react";
import PremiumButton from "@/components/ui/PremiumButton";

// trigger rebuild
console.log("login rebuild");

export default function LoginPage() {
  const [phone, setPhone] = useState("");

  return (
    <div className="
      min-h-screen 
      flex flex-col 
      items-center 
      justify-start 
      pt-32 pb-24
      bg-gradient-to-b from-[#0B1520] via-[#121E2E] to-[#0B1520]
      text-white
    ">


      {/* Premium Glass Container */}
      <div className="
        bg-white/5
        backdrop-blur-xl
        rounded-2xl
        shadow-xl shadow-black/30
        px-4 sm:px-8 md:px-10 lg:px-14
        max-w-3xl mx-auto
        flex flex-col gap-12
        text-white/80
        font-light tracking-wide leading-relaxed
        items-center text-center
        w-full
        mt-24
      ">

        {/* Header */}
        <div className="flex flex-col gap-6 items-center text-center">
          <h1 className="
            text-5xl md:text-7xl
            font-light
            tracking-wide
            text-[#D4AF37]
            text-center
          ">
            VELKOMMEN TILBAKE
          </h1>
          <p className="
            text-lg
            text-white/60
            tracking-wider
          ">
            Logg inn med telefonnummer for å fortsette reisen
          </p>
        </div>

        {/* Phone Input */}
        <div className="flex flex-col gap-6 items-center w-full max-w-md">
          <div className="w-full flex flex-col gap-3 items-center">
            <label className="text-sm font-medium text-white/80 tracking-wide">
              Telefonnummer
            </label>

            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+47 123 45 678"
              className="
                w-full
                bg-white/5
                backdrop-blur-md
                rounded-xl
                px-6 py-4
                shadow-lg shadow-black/20
                text-white
                placeholder-white/40
                focus:outline-none
                focus:ring-2 focus:ring-[#D4AF37]/40
              "
            />
          </div>

          {/* Testbruker-knapp */}
          <button
            onClick={() => {
              window.location.href = "/api/dev-login?userId=test-user-1";
            }}
            className="
              w-full text-center
              px-5 py-3
              rounded-xl
              bg-white/10
              hover:bg-white/20
              text-white/80
              font-light tracking-wide
              shadow-lg shadow-black/20
              transition-all duration-300
            "
          >
            Logg inn som testbruker
          </button>
        </div>

        {/* Vipps-informasjon */}
        <div className="
          bg-white/5
          backdrop-blur-md
          rounded-xl
          p-6
          flex flex-col items-center text-center gap-3
          shadow-lg shadow-black/20
          max-w-md w-full
        ">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="mx-auto">
            <path d="M12 5V19M5 12L12 19L19 12" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="text-sm text-white/60">
            Kom snart: Logg inn med Vipps for en trygg og rask opplevelse.
          </p>
        </div>

      </div>
    </div>
  );
}