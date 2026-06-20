export const dynamic = "force-dynamic"

import Link from "next/link"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const navItems = [
    { label: "Oversikt", href: "/admin" },
    { label: "Brukere", href: "/admin/users" },
    { label: "Matcher", href: "/admin/matches" },
    { label: "Konversasjoner", href: "/admin/conversations" },
    { label: "Reise", href: "/admin/journey" },
    { label: "Innstillinger", href: "/admin/settings" },
  ]

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">

      {/* Sidepanel */}
      <aside className="w-64 border-r border-[var(--color-card-border)] bg-[var(--color-card)] flex flex-col">
        {/* Logo */}
        <div className="p-[var(--space-lg)] border-b border-[var(--color-card-border)]">
          <Link href="/" className="text-xl font-semibold text-[var(--color-gold)] tracking-tight">
            ToSom Admin
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-[var(--space-sm)] flex flex-col gap-[var(--space-xs)]">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2 rounded-lg text-sm text-[var(--color-muted)] hover:text-[var(--color-gold)] hover:bg-[var(--color-gold)]/10 transition-colors duration-200"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-[var(--space-sm)] border-t border-[var(--color-card-border)]">
          <Link
            href="/"
            className="px-3 py-2 rounded-lg text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-white/[0.05] transition-colors duration-200"
          >
            ← Tilbake til høgskolen
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
