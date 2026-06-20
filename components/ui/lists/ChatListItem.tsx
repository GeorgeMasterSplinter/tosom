/**
 * ChatListItem — Chat conversation list item with avatar, preview, unread count
 *
 * Usage:
 *   <ChatListItem
 *     name="Anna"
     avatar="/avatar.jpg"
     lastMessage="Hey, how are you?"
     timestamp={new Date()}
     unread={3}
     online={true}
   />
 */

import React from 'react';

export interface ChatListItemProps {
  /** User name */
  name: string;
  /** Avatar URL */
  avatar?: string;
  /** Last message preview */
  lastMessage?: string;
  /** Timestamp of last message */
  timestamp?: Date | string;
  /** Unread message count */
  unread?: number;
  /** Whether user is online */
  online?: boolean;
  /** Whether this conversation is active */
  active?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Custom class */
  className?: string;
}

const ChatListItem: React.FC<ChatListItemProps> = ({
  name,
  avatar,
  lastMessage,
  timestamp,
  unread = 0,
  online = false,
  active = false,
  onClick,
  className = '',
}) => {
  const formattedTime = timestamp
    ? formatRelativeTime(new Date(timestamp))
    : '';

  return (
    <div
      onClick={onClick}
      className={`
        flex items-center gap-3
        px-4 py-3
        cursor-pointer
        transition-all
        ${active ? 'bg-ts-gold/10' : 'hover:bg-ts-glass'}
        ${className}
      `}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-ts-gold/20 flex items-center justify-center">
            <span className="text-base font-semibold text-ts-gold">
              {name?.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        {/* Online indicator */}
        {online && (
          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-ts-success border-2 border-ts-bg" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4 className={`text-sm font-medium truncate ${active ? 'text-ts-gold' : 'text-ts-primary'}`}>
            {name}
          </h4>
          {formattedTime && (
            <span className="text-xs text-ts-text-subtle flex-shrink-0">{formattedTime}</span>
          )}
        </div>
        {lastMessage && (
          <p className="text-xs text-ts-text-subtle truncate mt-0.5">
            {lastMessage}
          </p>
        )}
      </div>

      {/* Unread badge */}
      {unread > 0 && (
        <div className="flex-shrink-0">
          <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-bold rounded-full bg-ts-gold text-ts-bg">
            {unread > 99 ? '99+' : unread}
          </span>
        </div>
      )}
    </div>
  );
};

/** Format timestamp to relative time */
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'nå';
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}t`;
  if (days < 7) return `${days}d`;

  return date.toLocaleDateString('no-NO', { month: 'short', day: 'numeric' });
}

ChatListItem.displayName = 'ChatListItem';
export default ChatListItem;