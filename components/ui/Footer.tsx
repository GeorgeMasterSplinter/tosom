/* ═══════════════════════════════════════════
   ToSom Premium — Footer Component
   ═══════════════════════════════════════════ */

import Link from "next/link";

export interface FooterProps {
  brand?: string;
  year?: string;
  links?: { label: string; href: string }[];
}

const defaultLinks = [
  { label: "Om ToSom", href: "/om" },
  { label: "Kontakt", href: "/kontakt" },
  { label: "Personvern", href: "/personvern" },
];

export const Footer = ({
  brand = "ToSom",
  year = "2026",
  links = defaultLinks,
}: FooterProps) => {
  return (
    <footer
      className="max-w-5xl mx-auto px-6 py-10"
      style={{ borderTop: "1px solid var(--ts-border)" }}
    >
      <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
        <p
          style={{
            color: "var(--ts-text-muted)",
            fontSize: "var(--ts-font-xs)",
            lineHeight: "1.5",
          }}
        >
          © {year} {brand} — bygget for ekte relasjoner
        </p>

        <nav className="flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors duration-[var(--ts-transition-fast)] hover:-translate-y-[1px]"
              style={{
                color: "var(--ts-text-muted)",
                fontSize: "var(--ts-font-small)",
                lineHeight: "1.6",
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
