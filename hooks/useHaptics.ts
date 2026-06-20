/**
 * useHaptics — PWA haptic feedback hook
 * 
 * Uses navigator.vibrate() for tactile feedback.
 * Gracefully handles environments without vibration API.
 * 
 * Usage:
 *   const { light, medium, heavy, success } = useHaptics();
 *   <button onClick={() => light()}>Press me</button>
 */

import { useCallback } from 'react';

export interface HapticPatterns {
  light: () => void;
  medium: () => void;
  heavy: () => void;
  success: () => void;
  error: () => void;
  impact: (style: 'light' | 'medium' | 'heavy') => void;
}

/** Check if vibration API is available */
const isVibrationSupported = (): boolean => {
  try {
    return 'vibrate' in navigator;
  } catch {
    return false;
  }
};

/**
 * Safe vibrate wrapper
 * Never throws even if vibration API is blocked
 */
const vibrate = (pattern: number | number[]): void => {
  try {
    if (isVibrationSupported()) {
      navigator.vibrate(pattern);
    }
  } catch {
    // Silently fail — no haptics is fine
  }
};

const useHaptics = (): HapticPatterns => {
  const light = useCallback(() => vibrate(50), []);
  const medium = useCallback(() => vibrate(100), []);
  const heavy = useCallback(() => vibrate(150), []);
  
  const success = useCallback(() => {
    vibrate([50, 30, 80]);
  }, []);
  
  const error = useCallback(() => {
    vibrate([100, 50, 100]);
  }, []);
  
  const impact = useCallback((style: 'light' | 'medium' | 'heavy') => {
    switch (style) {
      case 'light': vibrate(30); break;
      case 'medium': vibrate(70); break;
      case 'heavy': vibrate(120); break;
    }
  }, []);

  return { light, medium, heavy, success, error, impact };
};

export default useHaptics;
