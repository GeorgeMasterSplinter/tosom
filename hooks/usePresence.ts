/**
 * ToSom — Use Presence Hook (Partner Presence v2026) 🟡⭐
 * 
 * Pakke 6.6 — Partner Presence (Steg 3)
 * 
 * Poller /api/presence/get/[id] hvert 3. sek og returnerer:
 * - isOnline: boolean
 * - isTyping: boolean
 * - lastSeen: number | null
 */

"use client";

import { useState, useEffect, useRef } from 'react';

export interface PresenceData {
  userId: string;
  isOnline: boolean;
  isTyping: boolean;
  lastSeen: number | null;
}

/**
 * Hook for tracking partner presence status.
 * @param partnerId - The ID of the partner/user to track
 * @param enabled - Set to false to pause polling (e.g., when component unmounts)
 */
export function usePresence(partnerId: string | null, enabled: boolean = true): PresenceData {
  const [data, setData] = useState<PresenceData>({
    userId: partnerId || '',
    isOnline: false,
    isTyping: false,
    lastSeen: null,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  // Fetch presence once
  const fetchPresence = async () => {
    if (!partnerId) return;

    try {
      const res = await fetch(`/api/presence/get/${partnerId}`);
      if (!res.ok) return;
      const result = await res.json();
      
      if (isMountedRef.current) {
        setData({
          userId: result.userId,
          isOnline: result.isOnline || false,
          isTyping: result.isTyping || false,
          lastSeen: result.lastSeen || null,
        });
      }
    } catch (err) {
      console.error('usePresence: Feil ved henting av status:', err);
    }
  };

  useEffect(() => {
    if (!partnerId || !enabled) return;

    // Initial fetch
    fetchPresence();

    // Poll every 3 seconds
    intervalRef.current = setInterval(() => {
      fetchPresence();
    }, 3000);

    return () => {
      isMountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [partnerId, enabled]);

  return data;
}

export default usePresence;