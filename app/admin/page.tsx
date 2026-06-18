export const dynamic = "force-dynamic"

import GlassPanel from "@/components/ui/GlassPanel";
import GlassCard from "@/components/ui/GlassCard";
import PremiumButton from "@/components/ui/PremiumButton";

export default function Page() {
  return (
    <div className="flex flex-col gap-[var(--space-xl)] max-w-4xl mx-auto p-[var(--space-xl)]">

      {/* Header */}
      <GlassPanel className="flex flex-col gap-[var(--space-sm)]">
        <h1 className="text-3xl font-semibold text-[var(--color-text)] tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-[var(--color-muted)] leading-[var(--line-relaxed)]">
          Oversikt over system, brukarar og matcher.
        </p>
      </GlassPanel>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[var(--space-md)]">
        {[
          { label: "Brukarar", value: "—", color: "text-[var(--color-gold)]" },
          { label: "Aktive matcher", value: "—", color: "text-green-500" },
          { label: "Meldingar", value: "—", color: "text-blue-500" },
          { label: "System-status", value: "OK", color: "text-green-500" },
        ].map(({ label, value, color }) => (
          <GlassCard key={label} className="flex flex-col gap-[var(--space-xs)]">
            <span className="text-sm text-[var(--color-muted)]">{label}</span>
            <span className={`text-2xl font-bold ${color}`}>{value}</span>
          </GlassCard>
        ))}
      </div>

      {/* Quick actions */}
      <GlassPanel className="flex flex-col gap-[var(--space-md)]">
        <h2 className="text-xl font-semibold text-[var(--color-text)] tracking-tight">
          Hurtig-aksjonar
        </h2>
        <div className="flex flex-wrap gap-[var(--space-xs)]">
          <PremiumButton variant="primary" className="text-xs px-4 py-2">
            Sjå alle brukarar →
          </PremiumButton>
          <PremiumButton variant="secondary" className="text-xs px-4 py-2">
            System-loggar
          </PremiumButton>
          <PremiumButton variant="ghost" className="text-xs px-4 py-2">
            Rens cache
          </PremiumButton>
        </div>
      </GlassPanel>

      {/* Recent activity placeholder */}
      <GlassPanel className="flex flex-col gap-[var(--space-sm)]">
        <h2 className="text-xl font-semibold text-[var(--color-text)] tracking-tight">
          Aktivitet
        </h2>
        <p className="text-[var(--color-muted)] text-sm">
          Ingen aktivitet å vise enno.
        </p>
      </GlassPanel>

    </div>
  );
}