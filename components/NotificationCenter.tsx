import { useEffect, useState } from "react";
import GlassPanel from "@/components/ui/GlassPanel";
import GlassCard from "@/components/ui/GlassCard";
import FadeIn from "@/components/ui/FadeIn";
import PremiumButton from "@/components/ui/PremiumButton";

export interface NotificationMessage {
  id: string;
  content: string;
  createdAt: string;
}

export default function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<NotificationMessage[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/system/messages");
    const data = await res.json();
    setMessages(data);
    setLoading(false);
  }

  async function markRead() {
    await fetch("/api/system/mark-read", { method: "POST" });
  }

  useEffect(() => {
    if (open) {
      load();
      markRead();
    }
  }, [open]);

  return (
    <div className="relative">
      {/* Knapp */}
      <button
        onClick={() => setOpen(!open)}
        className="text-[var(--color-muted)] hover:text-[var(--color-gold)] transition-colors duration-200 text-sm font-medium"
      >
        {open ? "✕ Varsler" : "🔔 Varsler"}
      </button>

      {/* Panel */}
      {open && (
        <div className="absolute right-0 mt-[var(--space-sm)] w-80 z-50">
          <FadeIn>
            <GlassPanel className="flex flex-col gap-[var(--space-sm)]">
              <h3 className="text-xl font-semibold text-[var(--color-text)] tracking-tight">
                Systemmeldinger
              </h3>

              {loading && <p className="text-[var(--color-muted)] text-sm">Listrar...</p>}

              {!loading && messages.length === 0 && (
                <p className="text-[var(--color-muted)] text-sm">
                  Ingen meldingar akkurat no.
                </p>
              )}

              <div className="flex flex-col gap-[var(--space-xs)] max-h-80 overflow-y-auto">
                {messages.map((m: NotificationMessage) => (
                  <GlassCard key={m.id} className="flex flex-col gap-[var(--space-xs)]">
                    <p className="text-[var(--color-text)] text-sm leading-relaxed">
                      {m.content}
                    </p>
                    <p className="text-[var(--color-muted)]/70 text-xs">
                      {new Date(m.createdAt).toLocaleString("no-NO")}
                    </p>
                  </GlassCard>
                ))}
              </div>

              <PremiumButton variant="ghost" className="w-full text-xs px-4 py-2" onClick={() => setOpen(false)}>
                Lukk
              </PremiumButton>
            </GlassPanel>
          </FadeIn>
        </div>
      )}
    </div>
  );
}