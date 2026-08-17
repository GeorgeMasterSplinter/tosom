/**
 * Tosom UI 3.0 — Platform Registry
 *
 * Maps platform identifiers to their component implementations.
 * Enables automatic platform-aware component selection.
 *
 * Usage:
 *   import { platform, getPlatformComponent, type Platform } from '@/components/ui/platform'
 *   const Button = getPlatformComponent('Button')
 */

import type { Platform } from './tokens';

/* ── Platform Capability Matrix ── */
export const platformCapabilities = {
  web: {
    cssVars: true,
    backdropBlur: true,
    gpuAccel: true,
    touch: false,
    safeArea: false,
    electron: false,
    pwa: false,
    rn: false,
    keyframes: true,
    reanimated: false,
    lottie: false,
  } as const,

  pwa: {
    cssVars: true,
    backdropBlur: true,
    gpuAccel: true,
    touch: true,
    safeArea: true,
    electron: false,
    pwa: true,
    rn: false,
    keyframes: true,
    reanimated: false,
    lottie: false,
  } as const,

  mobile: {
    cssVars: false,
    backdropBlur: false,
    gpuAccel: false,
    touch: true,
    safeArea: true,
    electron: false,
    pwa: false,
    rn: true,
    keyframes: false,
    reanimated: true,
    lottie: true,
  } as const,

  desktop: {
    cssVars: true,
    backdropBlur: true,
    gpuAccel: true,
    touch: false,
    safeArea: false,
    electron: true,
    pwa: false,
    rn: false,
    keyframes: true,
    reanimated: false,
    lottie: false,
  } as const,
} as const;

/* ── Component Registry ── */
export const componentRegistry: Record<Platform, Record<string, string>> = {
  web: {
    Button: '@/components/ui/Button',
    Input: '@/components/ui/Input',
    Card: '@/components/ui/Card',
    Modal: '@/components/ui/ModalV3',
    ChatBubble: '@/components/chat/ChatBubbleV2',
    NavigationBar: '@/components/ui/Navbar',
    GlassCard: '@/components/ui/cards/GlassCard',
    ElevatedCard: '@/components/ui/cards/ElevatedCard',
    GradientCard: '@/components/ui/cards/GradientCard',
    ProfileCard: '@/components/ui/cards/ProfileCard',
    MatchCard: '@/components/ui/cards/MatchCard',
    JourneyCard: '@/components/ui/cards/JourneyCard',
    MemoryCard: '@/components/ui/cards/MemoryCard',
    Sidebar: '@/components/ui/navigation/Sidebar',
    AppNavbar: '@/components/ui/navigation/AppNavbar',
    BottomNav: '@/components/ui/navigation/BottomNav',
    MobileNavbar: '@/components/ui/navigation/MobileNavbar',
    PageShell: '@/components/ui/layout/PageShell',
    Section: '@/components/ui/layout/Section',
    Container: '@/components/ui/layout/Container',
    Grid: '@/components/ui/layout/Grid',
    Stack: '@/components/ui/layout/Stack',
    SplitView: '@/components/ui/layout/SplitView',
    TimelineV2: '@/components/relationship/TimelineV2',
    MilestoneCardV2: '@/components/relationship/MilestoneCardV2',
    SharedHome: '@/components/couples/SharedHome',
    SharedGoals: '@/components/couples/SharedGoals',
    SharedCalendar: '@/components/couples/SharedCalendar',
    SharedJournal: '@/components/couples/SharedJournal',
    MemoryLane: '@/components/couples/MemoryLane',
  },
  pwa: {
    Button: '@/components/ui/mobile/Button',
    Input: '@/components/ui/mobile/Input',
    Card: '@/components/ui/mobile/Card',
    Modal: '@/components/ui/mobile/Modal',
    ChatBubble: '@/components/ui/mobile/ChatBubble',
    NavigationBar: '@/components/ui/mobile/NavigationBar',
    GlassCard: '@/components/ui/mobile/GlassCard',
    ElevatedCard: '@/components/ui/mobile/ElevatedCard',
    GradientCard: '@/components/ui/mobile/GradientCard',
    ProfileCard: '@/components/ui/mobile/ProfileCard',
    MatchCard: '@/components/ui/mobile/MatchCard',
    JourneyCard: '@/components/ui/mobile/JourneyCard',
    MemoryCard: '@/components/ui/mobile/MemoryCard',
    Sidebar: '@/components/ui/mobile/Sidebar',
    AppNavbar: '@/components/ui/mobile/AppNavbar',
    BottomNav: '@/components/ui/mobile/BottomNav',
    MobileNavbar: '@/components/ui/mobile/MobileNavbar',
    PageShell: '@/components/ui/mobile/PageShell',
    Section: '@/components/ui/mobile/Section',
    Container: '@/components/ui/mobile/Container',
    Grid: '@/components/ui/mobile/Grid',
    Stack: '@/components/ui/mobile/Stack',
    SplitView: '@/components/ui/mobile/SplitView',
    TimelineV2: '@/components/ui/mobile/TimelineV2',
    MilestoneCardV2: '@/components/ui/mobile/MilestoneCardV2',
    SharedHome: '@/components/ui/mobile/SharedHome',
    SharedGoals: '@/components/ui/mobile/SharedGoals',
    SharedCalendar: '@/components/ui/mobile/SharedCalendar',
    SharedJournal: '@/components/ui/mobile/SharedJournal',
    MemoryLane: '@/components/ui/mobile/MemoryLane',
  },
  mobile: {
    // Native components moved to native-legacy/ (react-native not available in web builds)
    Button: '', Input: '', Card: '', Modal: '', ChatBubble: '',
    NavigationBar: '', GlassCard: '', ElevatedCard: '', GradientCard: '',
    ProfileCard: '', MatchCard: '', JourneyCard: '', MemoryCard: '',
    Sidebar: '', AppNavbar: '', BottomNav: '', MobileNavbar: '',
    PageShell: '', Section: '', Container: '', Grid: '',
    MilestoneCardV2: '', SharedHome: '', SharedGoals: '', SharedCalendar: '',
    SharedJournal: '', MemoryLane: '',
  },
  desktop: {
    Button: '@/components/ui/desktop/Button',
    Input: '@/components/ui/desktop/Input',
    Card: '@/components/ui/desktop/Card',
    Modal: '@/components/ui/desktop/Modal',
    ChatBubble: '@/components/ui/desktop/ChatBubble',
    NavigationBar: '@/components/ui/desktop/NavigationBar',
    GlassCard: '@/components/ui/desktop/GlassCard',
    ElevatedCard: '@/components/ui/desktop/ElevatedCard',
    GradientCard: '@/components/ui/desktop/GradientCard',
    ProfileCard: '@/components/ui/desktop/ProfileCard',
    MatchCard: '@/components/ui/desktop/MatchCard',
    JourneyCard: '@/components/ui/desktop/JourneyCard',
    MemoryCard: '@/components/ui/desktop/MemoryCard',
    Sidebar: '@/components/ui/desktop/Sidebar',
    AppNavbar: '@/components/ui/desktop/AppNavbar',
    BottomNav: '@/components/ui/desktop/BottomNav',
    MobileNavbar: '@/components/ui/desktop/MobileNavbar',
    PageShell: '@/components/ui/desktop/PageShell',
    Section: '@/components/ui/desktop/Section',
    Container: '@/components/ui/desktop/Container',
    Grid: '@/components/ui/desktop/Grid',
    Stack: '@/components/ui/desktop/Stack',
    SplitView: '@/components/ui/desktop/SplitView',
    TimelineV2: '@/components/ui/desktop/TimelineV2',
    MilestoneCardV2: '@/components/ui/desktop/MilestoneCardV2',
    SharedHome: '@/components/ui/desktop/SharedHome',
    SharedGoals: '@/components/ui/desktop/SharedGoals',
    SharedCalendar: '@/components/ui/desktop/SharedCalendar',
    SharedJournal: '@/components/ui/desktop/SharedJournal',
    MemoryLane: '@/components/ui/desktop/MemoryLane',
  },
} as const;

/* ── Platform Component Resolver ── */
let currentPlatform: Platform = 'web';

export function setPlatform(platform: Platform): void {
  currentPlatform = platform;
}

export function getPlatform(): Platform {
  return currentPlatform;
}

export function getPlatformComponent<T extends keyof (typeof componentRegistry)['web']>(
  componentName: T
): string {
  return componentRegistry[currentPlatform][componentName] ?? componentRegistry.web[componentName] ?? '';
}

export function getPlatformComponents(): Record<string, string> {
  return { ...componentRegistry.web, ...componentRegistry[currentPlatform] };
}

/* ── Platform-Aware Component Factory ── */
export function createPlatformComponent<T extends keyof (typeof componentRegistry)['web']>(
  componentName: T
): {
  web: string;
  pwa: string;
  mobile: string;
  desktop: string;
  current: string;
} {
  const base = componentRegistry.web[componentName] ?? '';
  return {
    web: componentRegistry.web[componentName] ?? '',
    pwa: componentRegistry.pwa[componentName] ?? '',
    mobile: componentRegistry.mobile[componentName] ?? '',
    desktop: componentRegistry.desktop[componentName] ?? '',
    current: getPlatformComponent(componentName),
  };
}

/* ── Platform-Specific Styles ── */
export const platformStyles = {
  web: {
    borderRadius: 'var(--ts-radius-md)',
    shadow: 'var(--ts-shadow-md)',
    glassBg: 'var(--ts-glass-bg)',
    glassBorder: 'var(--ts-glass-border)',
    glassBlur: 'var(--ts-glass-blur)',
    touchTarget: '44px',
    spacing: {
      xs: 'var(--ts-spacing-xs)',
      sm: 'var(--ts-spacing-sm)',
      md: 'var(--ts-spacing-md)',
      lg: 'var(--ts-spacing-lg)',
      xl: 'var(--ts-spacing-xl)',
    },
  },
  pwa: {
    borderRadius: 'var(--ts-radius-lg)',
    shadow: 'var(--ts-shadow-md)',
    glassBg: 'var(--ts-glass-bg)',
    glassBorder: 'var(--ts-glass-border)',
    glassBlur: '10px',
    touchTarget: '48px',
    safeArea: true,
    spacing: {
      xs: 'var(--ts-spacing-xs)',
      sm: 'var(--ts-spacing-sm)',
      md: 'var(--ts-spacing-md)',
      lg: 'var(--ts-spacing-lg)',
      xl: 'var(--ts-spacing-xl)',
    },
  },
  mobile: {
    borderRadius: 12,
    shadow: '0 2px 8px rgba(0,0,0,0.2)',
    touchTarget: '48dp',
    safeArea: true,
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
    },
  },
  desktop: {
    borderRadius: 'var(--ts-radius-md)',
    shadow: '0 4px 12px rgba(0,0,0,0.3)',
    glassBg: 'var(--ts-glass-bg)',
    glassBorder: 'var(--ts-glass-border)',
    glassBlur: '6px',
    touchTarget: '44px',
    spacing: {
      xs: 'var(--ts-spacing-xs)',
      sm: 'var(--ts-spacing-sm)',
      md: 'var(--ts-spacing-md)',
      lg: 'var(--ts-spacing-lg)',
      xl: 'var(--ts-spacing-xl)',
    },
  },
} as const;

/* ── Platform Registry (default export) ── */
const platformConfig = {
  platformCapabilities,
  componentRegistry,
  setPlatform,
  getPlatform,
  getPlatformComponent,
  getPlatformComponents,
  createPlatformComponent,
  platformStyles,
};

export default platformConfig;
