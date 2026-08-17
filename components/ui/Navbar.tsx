"use client";

/* ═══════════════════════════════════════════
   Tosom Premium — Navbar Component
   Glassmorphism sticky header med mobilmeny
   ═══════════════════════════════════════════ */

import Link from "next/link";
import { useState } from "react";

interface NavbarProps {
  brand?: string;
  links?: { label: string; href: string }[];
}

const defaultLinks = [
  { label: "Hjem", href: "/" },
  { label: "Om Tosom", href: "/om" },
  { label: "Logg inn", href: "/login" },
];

export const Navbar = ({ brand = "Tosom", links = defaultLinks }: NavbarProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop */}
      <nav
        className="sticky top-0 z-50 w-full border-b backdrop-blur-xl animate-fadeInUp"
        style={{
          borderColor: "rgba(255, 255, 255, 0.08)",
          background: "rgba(10, 15, 31, 0.7)",
        }}
        role="navigation"
        aria-label="Hovednavigasjon"
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link
            href="/"
            className="text-lg font-semibold transition-colors duration-150 hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[var(--ts-gold)]/50"
            style={{ color: "var(--ts-gold)" }}
            aria-label="Tosom forsiden"
          >
            {brand}
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-8 md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-colors duration-200 hover:text-[var(--ts-gold)] focus-visible:ring-2 focus-visible:ring-[var(--ts-gold)]/50 rounded px-1 py-0.5"
                style={{ color: "var(--ts-text-muted)" }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden focus-visible:ring-2 focus-visible:ring-[var(--ts-gold)]/50 rounded p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Lukk meny" : "Åpne meny"}
            aria-expanded={mobileOpen}
            aria-controls="tosom-mobile-menu"
            style={{ color: "var(--ts-text-muted)" }}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div
          id="tosom-mobile-menu"
          className="fixed inset-0 z-40 pt-20 px-6 md:hidden animate-scaleIn"
          style={{
            background: "rgba(10, 15, 31, 0.95)",
            backdropFilter: "blur(12px)",
          }}
          role="menu"
        >
          <div className="flex flex-col items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-lg font-medium transition-colors duration-200 hover:text-[var(--ts-gold)] focus-visible:ring-2 focus-visible:ring-[var(--ts-gold)]/50 rounded px-4 py-2"
                style={{ color: "var(--ts-text-primary)" }}
                onClick={() => setMobileOpen(false)}
                role="menuitem"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
