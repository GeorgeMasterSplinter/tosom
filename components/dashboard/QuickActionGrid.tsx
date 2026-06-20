/* ═══════════════════════════════════════════
   ToSom Premium — QuickActionGrid Component
   4 quick actions: Chat, Matcher, Reise, Profil
   ═══════════════════════════════════════════ */

"use client";

import { Card } from "@/components/ui/Card";
import { FadeIn } from "@/components/ui/FadeIn";

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  color?: string;
}

interface QuickActionGridProps {
  actions?: QuickAction[];
  className?: string;
}

const defaultActions: QuickAction[] = [
  {
    id: "chat",
    label: "Chat",
    href: "/chat",
    color: "from-[var(--ts-gold)]/20 to-[var(--ts-gold)]/5",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    id: "matches",
    label: "Matcher",
    href: "/match",
    color: "from-emerald-400/20 to-emerald-400/5",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    id: "journey",
    label: "Reise",
    href: "/journey",
    color: "from-blue-400/20 to-blue-400/5",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    id: "profile",
    label: "Profil",
    href: "/profile/edit",
    color: "from-purple-400/20 to-purple-400/5",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
];

export const QuickActionGrid = ({ actions, className = "" }: QuickActionGridProps) => {
  const items = actions ?? defaultActions;

  return (
    <FadeIn delay={200} duration={500}>
      <Card variant="glass" className={`p-6 ${className}`}>
        <h3 className="text-sm font-medium text-white/60 mb-4">Hurtigtillgang</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {items.map((action, i) => (
            <a
              key={action.id}
              href={action.href}
              className="group relative flex flex-col items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/8 hover:bg-white/[0.06] hover:border-[var(--ts-gold)]/30 hover:scale-[1.03] transition-all duration-200"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* Hover gradient */}
              <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-100 transition-opacity duration-200`} />

              <div className="relative text-white/60 group-hover:text-[var(--ts-gold)] transition-colors duration-200">
                {action.icon}
              </div>

              <span className="relative text-sm text-white/60 group-hover:text-white transition-colors duration-200">
                {action.label}
              </span>
            </a>
          ))}
        </div>
      </Card>
    </FadeIn>
  );
};

export default QuickActionGrid;