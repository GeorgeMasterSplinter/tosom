/**
 * ToSom UI 3.0 — Motion System 3.0
 *
 * Unified motion tokens for:
 * - Web: CSS keyframes (already in globals.css)
 * - Mobile: react-native-reanimated equivalents
 * - Desktop: GPU-accelerated CSS transitions
 *
 * Usage:
 *   import { motion, type MotionConfig } from '@/components/ui/motion'
 */

import { tokens } from './tokens';

/* ── Motion Configuration ── */
export interface MotionConfig {
  duration: string | number;
  easing: string;
  delay?: number;
  iterations?: number;
}

/* ── Web Motion Presets (CSS) ── */
export const webMotion = {
  /* Fade animations */
  fadeIn: {
    duration: tokens.motion.duration.fast,
    easing: tokens.motion.easing.fadeIn,
    keyframe: 'fadeIn',
  } as MotionConfig,
  fadeOut: {
    duration: tokens.motion.duration.fast,
    easing: tokens.motion.easing.fadeIn,
    keyframe: 'fadeOut',
  } as MotionConfig,

  /* Slide animations */
  slideUp: {
    duration: tokens.motion.duration.normal,
    easing: tokens.motion.easing.smooth,
    keyframe: 'slideUp',
  } as MotionConfig,
  slideDown: {
    duration: tokens.motion.duration.normal,
    easing: tokens.motion.easing.smooth,
    keyframe: 'slideDown',
  } as MotionConfig,
  slideLeft: {
    duration: tokens.motion.duration.normal,
    easing: tokens.motion.easing.slideIn,
    keyframe: 'slideLeft',
  } as MotionConfig,
  slideRight: {
    duration: tokens.motion.duration.normal,
    easing: tokens.motion.easing.slideIn,
    keyframe: 'slideRight',
  } as MotionConfig,

  /* Scale animations */
  scaleIn: {
    duration: "var(--ts-motion-duration-slow)",
    easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    keyframe: 'scaleIn',
  } as MotionConfig,
  scaleOut: {
    duration: tokens.motion.duration.fast,
    easing: tokens.motion.easing.fadeIn,
    keyframe: 'scaleOut',
  } as MotionConfig,

  /* Bounce animations */
  bounceIn: {
    duration: tokens.motion.duration.slow,
    easing: tokens.motion.easing.subtleBounce,
    keyframe: 'bounceIn',
  } as MotionConfig,
  popIn: {
    duration: tokens.motion.duration.slow,
    easing: tokens.motion.easing.overshoot,
    keyframe: 'popIn',
  } as MotionConfig,

  /* Shimmer / loading */
  shimmer: {
    duration: '1.5s',
    easing: 'ease-in-out',
    keyframe: 'shimmer',
    iterations: Infinity,
  } as MotionConfig,

  /* Pulse / breathing */
  pulse: {
    duration: '2s',
    easing: 'ease-in-out',
    keyframe: 'pulse',
    iterations: Infinity,
  } as MotionConfig,
  breathe: {
    duration: '4s',
    easing: 'ease-in-out',
    keyframe: 'breathe',
    iterations: Infinity,
  } as MotionConfig,

  /* Page transitions */
  pageTransition: {
    duration: tokens.motion.duration.pageTransition,
    easing: tokens.motion.easing.fadeIn,
  } as MotionConfig,
} as const;

/* ── Mobile Motion Presets (Reanimated) ── */
export const mobileMotion = {
  fadeIn: {
    duration: 150,
    type: 'timing',
    easing: 'easeInOut',
  },
  fadeOut: {
    duration: 150,
    type: 'timing',
    easing: 'easeInOut',
  },
  slideUp: {
    duration: 250,
    type: 'spring',
    damping: 16,
    stiffness: 200,
  },
  slideDown: {
    duration: 250,
    type: 'spring',
    damping: 16,
    stiffness: 200,
  },
  scaleIn: {
    duration: 300,
    type: 'spring',
    damping: 12,
    stiffness: 200,
  },
  scaleOut: {
    duration: 200,
    type: 'timing',
    easing: 'easeInOut',
  },
  bounceIn: {
    duration: 500,
    type: 'spring',
    damping: 8,
    stiffness: 150,
  },
  popIn: {
    duration: 300,
    type: 'spring',
    damping: 10,
    stiffness: 180,
  },
  pageTransition: {
    duration: 400,
    type: 'timing',
    easing: 'easeInOut',
  },
} as const;

/* ── Desktop Motion Presets (GPU-accelerated) ── */
export const desktopMotion = {
  fadeIn: {
    duration: tokens.motion.duration.fast,
    easing: tokens.motion.easing.smooth,
    gpu: true,
    transform: 'translate3d(0, 4px, 0)',
    toTransform: 'translate3d(0, 0, 0)',
  } as MotionConfig,
  fadeOut: {
    duration: tokens.motion.duration.fast,
    easing: tokens.motion.easing.smooth,
    gpu: true,
  } as MotionConfig,
  slideUp: {
    duration: tokens.motion.duration.normal,
    easing: tokens.motion.easing.smooth,
    gpu: true,
    transform: 'translate3d(0, 16px, 0)',
    toTransform: 'translate3d(0, 0, 0)',
  } as MotionConfig,
  pageTransition: {
    duration: tokens.motion.duration.pageTransition,
    easing: tokens.motion.easing.fadeIn,
    gpu: true,
  } as MotionConfig,
} as const;

/* ── Motion Preset Registry ── */
export type MotionPreset = keyof typeof webMotion;

export const motionRegistry = {
  web: webMotion,
  mobile: mobileMotion,
  desktop: desktopMotion,
} as const;

export function getMotion(preset: MotionPreset, platform: 'web' | 'mobile' | 'desktop') {
  return motionRegistry[platform][preset];
}

/* ── Web CSS Keyframes (for globals.css injection) ── */
export const webKeyframesCSS = `
@keyframes ts-fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes ts-fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes ts-slideUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes ts-slideDown {
  from { opacity: 0; transform: translateY(-16px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes ts-slideLeft {
  from { transform: translateX(16px); }
  to { transform: translateX(0); }
}

@keyframes ts-slideRight {
  from { transform: translateX(-16px); }
  to { transform: translateX(0); }
}

@keyframes ts-scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes ts-scaleOut {
  from { opacity: 1; transform: scale(1); }
  to { opacity: 0; transform: scale(0.95); }
}

@keyframes ts-bounceIn {
  0% { opacity: 0; transform: scale(0.8); }
  50% { transform: scale(1.02); }
  100% { opacity: 1; transform: scale(1); }
}

@keyframes ts-popIn {
  0% { opacity: 0; transform: scale(0.7); }
  70% { transform: scale(1.05); }
  100% { opacity: 1; transform: scale(1); }
}

@keyframes ts-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@keyframes ts-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

@keyframes ts-breathe {
  0%, 100% { opacity: 0.8; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.01); }
}
`;

/* ── Export all ── */
export default {
  web: webMotion,
  mobile: mobileMotion,
  desktop: desktopMotion,
  getMotion,
  webKeyframesCSS,
};