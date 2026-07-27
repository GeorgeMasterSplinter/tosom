/**
 * ToSom — Dashboard ConversationCard
 * 
 * Viser éin aktiv samtale med siste melding og tid.
 * Radius: 20px (design system)
 * Semantisk knapp istedenfor div-link (tilgjengelegheit)
 */

'use client';

interface ConversationCardProps {
  convo: {
    id: string;
    otherUserId: string;
    otherUserName: string | null;
    otherUserPhotoUrl: string | null;
    lastMessagePreview: string | null;
    lastMessageAt: string | null;
    unreadCount: number;
    createdAt: string;
  };
}

export function ConversationCard({ convo }: ConversationCardProps) {
  const name = convo.otherUserName || 'Ukjent';
  const initial = name.charAt(0).toUpperCase();
  const lastMsg = convo.lastMessagePreview ?? 'Ingen meldingar enno';
  const time = convo.lastMessageAt
    ? formatTime(convo.lastMessageAt)
    : '';
  const isUnread = convo.unreadCount > 0;

  return (
    <button
      type="button"
      onClick={() => (window.location.href = `/chat/${convo.id}`)}
      aria-label={`Åpne samtale med ${name}`}
      className="block animate-[slideIn_0.3s_ease-out] w-full text-left border-0 bg-transparent cursor-pointer p-4 rounded-[20px] transition-all duration-300 ease-out group flex items-center gap-3"
      style={{
        background: isUnread ? 'rgba(212, 175, 55, 0.04)' : 'rgba(255, 255, 255, 0.02)',
        border: isUnread ? '1px solid rgba(212, 175, 55, 0.15)' : '1px solid rgba(255, 255, 255, 0.04)',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = isUnread
          ? 'rgba(212, 175, 55, 0.08)'
          : 'rgba(255, 255, 255, 0.06)';
        (e.currentTarget as HTMLElement).style.transform = 'scale(1.01)';
        (e.currentTarget as HTMLElement).style.boxShadow = isUnread
          ? '0 0 20px rgba(212, 175, 55, 0.15)'
          : '0 0 15px rgba(212, 175, 55, 0.08)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = isUnread
          ? 'rgba(212, 175, 55, 0.04)'
          : 'rgba(255, 255, 255, 0.02)';
        (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
      }}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium"
          style={{
            background: isUnread
              ? 'rgba(212, 175, 55, 0.12)'
              : 'rgba(255, 255, 255, 0.06)',
            border: isUnread
              ? '1px solid rgba(212, 175, 55, 0.25)'
              : '1px solid rgba(255, 255, 255, 0.1)',
            color: isUnread ? '#D4AF37' : 'rgba(255, 255, 255, 0.5)',
          }}
        >
          {initial}
        </div>
        {/* Unread dot */}
        {isUnread && (
          <div
            className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full"
            style={{ background: '#D4AF37' }}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-sm font-medium truncate" style={{ color: '#FFFFFF' }}>
            {name}
          </p>
          {time && (
            <span className="text-[10px] flex-shrink-0" style={{ color: 'rgba(255, 255, 255, 0.2)' }}>
              {time}
            </span>
          )}
        </div>
        <p
          className="text-sm truncate"
          style={{ color: 'rgba(255, 255, 255, 0.35)' }}
        >
          {lastMsg}
        </p>
      </div>
    </button>
  );
}

function formatTime(isoStr: string): string {
  const date = new Date(isoStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return 'No';
  if (diffMin < 60) return `${diffMin}m sidan`;
  if (diffHours < 24) return `${diffHours}t sidan`;
  if (diffDays === 1) return 'I går';
  if (diffDays < 7) return `${diffDays}d sidan`;
  return date.toLocaleDateString('no-NO', { day: 'numeric', month: 'short' });
}