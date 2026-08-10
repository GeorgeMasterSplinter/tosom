/**
 * ToSom — Presence State (Partner Presence v2026) 🟡⭐
 * In-memory state for tracking user online/typing status.
 * 
 * Pakke: Partner Presence (Steg 1)
 * 
 * Merk: Dette er in-memory, så state mister ved server restart.
 * For production med flere Node-instanser, bruk Redis eller DB.
 */

export type PresenceState = {
  userId: string;
  isOnline: boolean;
  isTyping: boolean;
  lastSeen: number; // timestamp
};

/* ═══════════════════════════════════════
   IN-MEMORY STORE
   ═══════════════════════════════════════ */

const presenceMap = new Map<string, PresenceState>();

/**
 * Set user as online and update last seen
 */
export function setOnline(userId: string): void {
  const existing = presenceMap.get(userId);
  if (existing) {
    existing.isOnline = true;
    existing.lastSeen = Date.now();
    // Clear typing when going online (typing resets)
    existing.isTyping = false;
  } else {
    presenceMap.set(userId, {
      userId,
      isOnline: true,
      isTyping: false,
      lastSeen: Date.now(),
    });
  }
}

/**
 * Set user as offline
 */
export function setOffline(userId: string): void {
  const existing = presenceMap.get(userId);
  if (existing) {
    existing.isOnline = false;
    existing.lastSeen = Date.now();
    // Also clear typing when going offline
    existing.isTyping = false;
  } else {
    // Still create a record so we know they were last seen
    presenceMap.set(userId, {
      userId,
      isOnline: false,
      isTyping: false,
      lastSeen: Date.now(),
    });
  }
}

/**
 * Set user as typing (auto-clears after timeout)
 */
let typingTimeouts = new Map<string, NodeJS.Timeout>();

export function setTyping(userId: string): void {
  const existing = presenceMap.get(userId);
  if (existing) {
    existing.isTyping = true;
    existing.lastSeen = Date.now();
  } else {
    // If user doesn't exist yet, assume they're online and typing
    presenceMap.set(userId, {
      userId,
      isOnline: true,
      isTyping: true,
      lastSeen: Date.now(),
    });
  }

  // Auto-clear typing after 3 seconds
  const existingTimeout = typingTimeouts.get(userId);
  if (existingTimeout) {
    clearTimeout(existingTimeout);
  }

  const timeout = setTimeout(() => {
    clearTyping(userId);
  }, 3000);

  typingTimeouts.set(userId, timeout);
}

/**
 * Clear typing status for a user
 */
export function clearTyping(userId: string): void {
  const existing = presenceMap.get(userId);
  if (existing) {
    existing.isTyping = false;
  }

  // Clear timeout
  const timeout = typingTimeouts.get(userId);
  if (timeout) {
    clearTimeout(timeout);
    typingTimeouts.delete(userId);
  }
}

/**
 * Get presence state for a user
 */
export function getPresence(userId: string): PresenceState | undefined {
  return presenceMap.get(userId);
}

/**
 * Get all presence states (for admin/debug)
 */
export function getAllPresence(): Map<string, PresenceState> {
  return new Map(presenceMap);
}

/**
 * Clean up old entries (run periodically, e.g., every 60s)
 * Removes users who haven't been seen in 5 minutes
 */
export function cleanupOldEntries(maxAgeMs: number = 5 * 60 * 1000): void {
  const now = Date.now();
  for (const [userId, state] of presenceMap.entries()) {
    if (now - state.lastSeen > maxAgeMs) {
      // If user was online but not seen recently, mark as offline
      if (state.isOnline) {
        state.isOnline = false;
      }
      // Also clear typing
      state.isTyping = false;
    }
  }
}

// Auto-cleanup every 60 seconds
const cleanupInterval = setInterval(() => {
  cleanupOldEntries();
}, 60 * 1000);

// Don't let this keep the process open in development
if (cleanupInterval.unref) {
  cleanupInterval.unref();
}

export default presenceMap;