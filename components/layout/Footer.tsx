import React from "react";

export default function Footer() {
  return (
    <footer className="section fade-in border-t border-[var(--color-card-border)] mt-[var(--space-2xl)]">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-[var(--space-md)] text-center md:text-left">
        <p className="text-[var(--color-muted)] text-sm">
          © {new Date().getFullYear()} ToSom — alle rettar reservert.
        </p>

        <div className="flex gap-[var(--space-md)]">
          <a
            href="/privacy"
            className="text-[var(--color-muted)] hover:text-[var(--color-gold)] transition"
          >
            Personvern
          </a>
          <a
            href="/terms"
            className="text-[var(--color-muted)] hover:text-[var(--color-gold)] transition"
          >
            Vilkår
          </a>
          <a
            href="/contact"
            className="text-[var(--color-muted)] hover:text-[var(--color-gold)] transition"
          >
            Kontakt
          </a>
        </div>
      </div>
    </footer>
  );
}
