/* ═══════════════════════════════════════════
   ToSom Premium — NotificationFeed Component
   Glass list items with gold accent for important
   ═══════════════════════════════════════════ */

"use client";

import { Card } from "@/components/ui/Card";
import { FadeIn } from "@/components/ui/FadeIn";

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  important?: boolean;
  type?: "match" | "message" | "system" | "info";
}

interface NotificationFeedProps {
  notifications: NotificationItem[];
  onNotificationClick?: (id: string) => void;
  className?: string;
}

const typeColors: Record<string, string> = {
  match: "text-pink-400",
  message: "text-[var(--ts-gold)]",
  system: "text-white/40",
  info: "text-blue-400",
};

const typeIcons: Record<string, React.ReactNode> = {
  match: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  message: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  system: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  info: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

export const NotificationFeed = ({
  notifications,
  onNotificationClick,
  className = "",
}: NotificationFeedProps) => {
  if (notifications.length === 0) {
    return (
      <Card variant="glass" className={`p-6 ${className}`}>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <svg className="w-12 h-12 text-white/10 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <p className="text-white/30 text-sm">Ingen varsler ennå</p>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="glass" className={`p-6 ${className}`}>
      <h3 className="text-sm font-medium text-white/60 mb-4">Varsler</h3>
      <div className="space-y-1">
        {notifications.map((notif, i) => {
          const colorClass = notif.important
            ? "text-[var(--ts-gold)]"
            : (typeColors[notif.type ?? "system"] ?? "text-white/40");

          return (
            <FadeIn key={notif.id} duration={300} delay={i * 60}>
              <button
                onClick={() => onNotificationClick?.(notif.id)}
                className={`
                  group w-full flex items-start gap-3 px-4 py-3 rounded-xl text-left
                  transition-all duration-200
                  ${notif.important ? "border-l-2 border-l-[var(--ts-gold)]/40" : "border-l-2 border-l-transparent"}
                  hover:bg-white/[0.04]
                `}
              >
                {/* Icon */}
                <div className={`flex-shrink-0 mt-0.5 ${colorClass}`}>
                  {typeIcons[notif.type ?? "info"] ?? typeIcons.info}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white group-hover:text-white/80 transition-colors duration-200">
                    {notif.title}
                  </p>
                  <p className="text-xs text-white/30 mt-0.5 truncate">
                    {notif.description}
                  </p>
                  <p className="text-[11px] text-white/20 mt-1">
                    {notif.time}
                  </p>
                </div>

                {/* Arrow */}
                <svg className="flex-shrink-0 w-4 h-4 text-white/10 group-hover:text-white/30 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </FadeIn>
          );
        })}
      </div>
    </Card>
  );
};

export default NotificationFeed;