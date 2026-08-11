/**
 * ToSom — Not Found (404)
 * 
 * Universal 404-komponent med glassmorphism-panel og gull-knapp.
 * Bruk på alle [id]-sider der ressursen ikke finst.
 */

import Link from "next/link";

interface NotFoundProps {
  title?: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
}

export default function NotFound({
  title = "Fant ikke ressursen",
  description = "Det ser ut som denne ressursen ikke finnes eller er blitt flytta.",
  backHref = "/dashboard",
  backLabel = "Tilbake til dashboard",
}: NotFoundProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div
        className="max-w-md w-full p-8 rounded-[20px] text-center"
        style={{
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
        }}
      >
        {/* Icon */}
        <div className="text-4xl mb-5">🔍</div>

        {/* Title */}
        <h2
          className="text-2xl font-semibold tracking-tight mb-3"
          style={{ color: "#FFFFFF" }}
        >
          {title}
        </h2>

        {/* Description */}
        <p
          className="text-sm leading-relaxed mb-8"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          {description}
        </p>

        {/* Back Button */}
        <Link
          href={backHref}
          className="inline-flex items-center justify-center px-6 py-3 font-medium rounded-xl transition-all duration-300 group"
          style={{
            background: "linear-gradient(135deg, #D4AF37, #E8C766)",
            color: "#0B1520",
          }}
        >
          {backLabel}
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
          >
            <path
              d="M6 4L10 8L6 12"
              stroke="#0B1520"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}