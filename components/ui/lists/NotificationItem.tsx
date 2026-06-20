/**
 * NotificationItem — Notification list item with icon, timestamp, unread state
 *
 * Usage:
 *   <NotificationItem
 *     icon={<HeartIcon />}
 *     title="New match!"
 *     description="You matched with Anna"
 *     timestamp={new Date()}
 *     unread={true}
 *   />
 */

import React from 'react';

export interface NotificationItemProps {
  /** Icon element */
  icon?: React.ReactNode;
  /** Notification title */
  title: string;
  /** Description text */
  description?: string;
  /** Timestamp */
  timestamp?: Date | string;
  /** Whether unread */
  unread?: boolean;
  /** Notification type */
  type?: 'info' | 'success' | 'warning' | 'error' | 'gold';
  /** Custom class */
  className?: string;
}

const typeColorMap: Record<NonNullable<NotificationItemProps['type']>, { icon: string; dot: string }> = {
  info: { icon: 'text-ts-blue', dot: 'bg-ts-blue' },
  success: { icon: 'text-ts-success', dot: 'bg-ts-success' },
  warning: { icon: 'text-ts-warning', dot: 'bg-ts-warning' },
  error: { icon: 'text-ts-error', dot: 'bg-ts-error' },
  gold: { icon: 'text-ts-gold', dot: 'bg-ts-gold' },
};

const NotificationItem: React.FC<NotificationItemProps> = ({
  icon,
  title,
  description,
  timestamp,
  unread = false,
  type = 'info',
  className = '',
}) => {
  const colors = typeColorMap[type];

  const formattedTime = timestamp
    ? formatRelativeTime(new Date(timestamp))
    : '';

  return (
    <div
      className={`
        flex items-start gap-3
        px-4 py-3
        transition-all
        ${unread ? 'bg-ts-gold/5' : 'hover:bg-ts-glass'}
        ${className}
      `}
    >
      {/* Icon */}
      <div className={`w-9 h-9 flex-shrink-0 rounded-xl flex items-center justify-center ${unread ? 'bg-ts-gold/10' : 'bg-ts-glass'}`}>
        <span className={colors.icon}>
          {icon || (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          )}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className={`text-sm font-medium ${unread ? 'text-ts-primary' : 'text-ts-text-secondary'}`}>
            {title}
          </p>
          {formattedTime && (
            <span className="text-xs text-ts-text-subtle flex-shrink-0">{formattedTime}</span>
          )}
        </div>
        {description && (
          <p className="text-xs text-ts-text-subtle mt-0.5 truncate">{description}</p>
        )}
      </div>

      {/* Unread dot */}
      {unread && (
        <div className={`w-2.5 h-2.5 flex-shrink-0 mt-1.5 rounded-full ${colors.dot}`} />
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
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return 'nå';
  if (minutes < 60) return `${minutes}m siden`;
  if (hours < 24) return `${hours}t siden`;
  if (days < 7) return `${days}d siden`;
  if (weeks < 5) return `${weeks}u siden`;
  if (months < 12) return `${months}m siden`;
  return `${years}år siden`;
}

NotificationItem.displayName = 'NotificationItem';
export default NotificationItem;