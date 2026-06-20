"use client";

/* ═══════════════════════════════════════════
   ToSom Premium — Navbar Component
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
  { label: "Om ToSom", href: "/om" },
  { label: "Logg inn", href: "/login" },
];

export const Navbar = ({ brand = "ToSom", links = defaultLinks }: NavbarProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop */}
      <nav
        className="sticky top-0 z-50 w-full border-b backdrop-blur-xl"
        style={{
          borderColor: "rgba(255, 255, 255, 0.08)",
          background: "rgba(10, 15, 31, 0.7)",
        }}
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link
            href="/"
            className="text-lg font-semibold transition-colors duration-150 hover:opacity-80"
            style={{ color: "var(--ts-gold)" }}
          >
            {brand}
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-8 md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-colors duration-200 hover:text-ts-gold"
                style={{ color: "var(--ts-text-muted)" }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Meny"
            style={{ color: "var(--ts-text-muted)" }}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
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
          className="fixed inset-0 z-40 pt-20 px-6 md:hidden"
          style={{
            background: "rgba(10, 15, 31, 0.95)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div className="flex flex-col items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-lg font-medium transition-colors duration-200"
                style={{ color: "var(--ts-text-primary)" }}
                onClick={() => setMobileOpen(false)}
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
