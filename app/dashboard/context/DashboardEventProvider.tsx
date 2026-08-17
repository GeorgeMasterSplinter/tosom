/**
 * Tosom Dashboard 2.0 — DashboardEventProvider
 * Kobler eventStream med addNotification fra NotificationContext.
 */

'use client';

import { useEffect } from 'react';
import { useNotifications } from './NotificationContext';
import { useDashboard } from './DashboardContext';
import { connectEventStream, type AddNotification } from './eventStream';

export const DashboardEventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { addNotification } = useNotifications();
  const { dispatch } = useDashboard();

  useEffect(() => {
    const disconnect = connectEventStream(dispatch, addNotification as AddNotification);
    return () => disconnect();
  }, [dispatch, addNotification]);

  return <>{children}</>;
};

export default DashboardEventProvider;