// app/not-found.tsx — Global 404-side for ToSom
// Visar roleg, elegant melding når ein side ikkje finst.

import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12"
      style={{ background: "linear-gradient(180deg, #0B1520 0%, #0A1E30 100%)" }}
    >
      {/* Glass Panel */}
      <div
        className="w-full max-w-md rounded-3xl p-10 text-center"
        style={{
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* 404 Icon */}
        <div className="mb-6">
          <svg
            width="64"
            height="64"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="#D4AF37"
              strokeWidth="2"
              opacity="0.3"
            />
            <circle
              cx="32"
              cy="32"
              r="20"
              stroke="#D4AF37"
              strokeWidth="1.5"
              opacity="0.5"
            />
            <text
              x="32"
              y="40"
              textAnchor="middle"
              fill="#D4AF37"
              fontSize="20"
              fontFamily="Inter, sans-serif"
              fontWeight="300"
            >
              404
            </text>
          </svg>
        </div>

        {/* Heading */}
        <h1
          className="text-2xl font-semibold tracking-tight mb-3"
          style={{ color: "#FFFFFF" }}
        >
          Sidan finst ikkje
        </h1>

        {/* Description */}
        <p
          className="text-sm leading-relaxed mb-8"
          style={{ color: "rgba(255,255,255,0.45)" }}
        >
          Det er noko som ikkje stemmer. Sidan du leitar etter finst
          ikkje — eller så har den vorte fjerna.
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Link
            href="/"
            className="flex-1 font-medium transition-all duration-300 py-3 rounded-xl text-center"
            style={{
              background: "linear-gradient(135deg, #D4AF37, #E8C766)",
              color: "#0B1520",
              border: "none",
            }}
          >
            Til baka til forsida
          </Link>

          <Link
            href="/login"
            className="flex-1 font-medium transition-all duration-300 py-3 rounded-xl text-center"
            style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            Logg inn
          </Link>
        </div>

        {/* Footer hint */}
        <p
          className="text-xs leading-relaxed mt-6"
          style={{ color: "rgba(255,255,255,0.2)" }}
        >
          Treng du hjelp? Kontakt oss på{" "}
          <a
            href="mailto:hei@tosom.app"
            className="underline hover:no-underline transition-all"
            style={{ color: "rgba(212,175,55,0.6)" }}
          >
            heii@tosom.app
          </a>
        </p>
      </div>
    </div>
  );
}