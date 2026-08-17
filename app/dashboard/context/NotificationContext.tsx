/**
 * Tosom Dashboard 2.0 — NotificationContext
 * Globalt notifikasjonssystem som reagerer på realtime-eventer.
 */

'use client';

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from 'react';

// ─── Types ──────────────────────

export type NotificationType = 'info' | 'success' | 'warning';

interface Notification {
  id: string;
  message: string;
  type: NotificationType;
}

interface NotificationState {
  notifications: Notification[];
}

interface NotificationContextValue {
  state: NotificationState;
  addNotification: (message: string, type: NotificationType) => void;
  removeNotification: (id: string) => void;
}

// ─── Action Types ───────────────

type NotificationAction =
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: string };

// ─── Reducer ────────────────────

const notificationReducer = (
  state: NotificationState,
  action: NotificationAction
): NotificationState => {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [...state.notifications, action.payload] };
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== action.payload),
      };
    default:
      return state;
  }
};

// ─── Context ────────────────────

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

// ─── Provider ───────────────────

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, { notifications: [] });

  useEffect(() => {
    const unsubscribe = () => {};
    return unsubscribe;
  }, []);

  const addNotification = (message: string, type: NotificationType) => {
    const id = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2, 10);
    dispatch({ type: 'ADD_NOTIFICATION', payload: { id, message, type } });
    setTimeout(() => removeNotification(id), 4000);
  };

  const removeNotification = (id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  };

  return (
    <NotificationContext.Provider value={{ state, addNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

// ─── Hook ───────────────────────

export const useNotifications = (): NotificationContextValue => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;