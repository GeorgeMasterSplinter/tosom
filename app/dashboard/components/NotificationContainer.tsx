/**
 * Tosom Dashboard 2.0 — NotificationContainer
 * Viser alle aktive notifikasjoner i et globalt overlay.
 */

'use client';

import { FC, useEffect, useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import type { NotificationType } from '../context/NotificationContext';

const typeStyles: Record<NotificationType, string> = {
  info: 'border-[#5B9FC4]/50 bg-[#5B9FC4]/10 text-[#5B9FC4]',
  success: 'border-[#4DFF88]/50 bg-[#4DFF88]/10 text-[#4DFF88]',
  warning: 'border-[#FBBF24]/50 bg-[#FBBF24]/10 text-[#FBBF24]',
};

export const NotificationContainer: FC = () => {
  const { state, removeNotification } = useNotifications();
  const [visibleNotifications, setVisibleNotifications] = useState(state.notifications);

  useEffect(() => {
    setVisibleNotifications(state.notifications);
  }, [state.notifications]);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleNotifications((prev) => {
        if (prev.length === state.notifications.length) return prev;
        setVisibleNotifications(state.notifications);
        return prev;
      });
    }, 350);
    return () => clearInterval(timer);
  }, [state.notifications]);

  const handleRemove = (id: string) => {
    setVisibleNotifications((prev) => prev.filter((n) => n.id !== id));
    setTimeout(() => removeNotification(id), 300);
  };

  if (visibleNotifications.length === 0) return null;

  return (
    <div className="fixed top-6 right-6 space-y-3 z-50" aria-live="polite">
      {visibleNotifications.map((n) => (
        <div
          key={n.id}
          className={`${typeStyles[n.type]} border px-4 py-3 rounded-xl shadow-lg animate-fadeIn max-w-xs cursor-pointer`}
          onClick={() => handleRemove(n.id)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleRemove(n.id)}
        >
          <p className="text-gray-100 text-sm leading-[1.5]">{n.message}</p>
        </div>
      ))}
    </div>
  );
};

export default NotificationContainer;