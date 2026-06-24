/**
 * ToSom UI 4.0 — Experience Layer & Productization
 *
 * Single import for all UI components.
 *
 * Usage:
 *   import {
 *     tokens, platform, NavSystem3, DashboardTemplate3,
 *     Onboarding4, EmptyState, SuccessState, ErrorState,
 *     GuidedFlow, Illustration, PersonalizationPanel,
 *     microcopy, ...
 *   } from '@/components/ui'
 */

// ── Tokens ──
export { tokens, colors, glass, radius, typography, shadows, motion, platform } from './tokens';

// ── Platform Registry ──
export { isTouch, isNative, isDesktop, isPWA, getPlatformComponents } from './platformRegistry';

// ── Native Components ──
// Web-only (react-native not available in Next.js):
// export { NativeButton, type NativeButtonProps } from './native/Button';
// export { NativeInput, type NativeInputProps } from './native/Input';
// export { NativeCard, type NativeCardProps } from './native/Card';
// export { NativeModal, type NativeModalProps } from './native/Modal';
// export { NativeChatBubble, type NativeChatBubbleProps } from './native/ChatBubble';
// export { NativeNavigationBar, type NativeNavigationBarProps } from './native/NavigationBar';

// ── PWA ──
export { InstallPrompt, type InstallPromptProps } from './pwa/InstallPrompt';
export { OfflineState, type OfflineStateProps } from './pwa/OfflineState';
export { OfflineBanner } from './pwa/OfflineBanner';
export { LoadingScreen } from './pwa/LoadingScreen';

// ── Motion ──
export { webMotion, mobileMotion, desktopMotion, motionRegistry, getMotion, webKeyframesCSS } from './motion';
export type { MotionConfig, MotionPreset } from './motion';

// ── Navigation 3.0 ──
export { AppNavbar, Sidebar, CommandPalette, MobileBottomNav, MobileNavbar, NavSystem3 } from './navigation3';
export type { NavItem } from './navigation3';

// ── Platform-Aware ──
export { PlatformButton, type PlatformButtonProps } from './platformComponents';
export { PlatformCard, type PlatformCardProps } from './platformComponents';
export { PlatformModal, type PlatformModalProps } from './platformComponents';
export { PlatformInput, type PlatformInputProps } from './platformComponents';
export { platformComponents } from './platformComponents';

// ── Couples Mobile ──
export { SharedHomeMobile } from './couplesMobile';
export { SharedCalendarMobile } from './couplesMobile';
export { SharedJournalMobile } from './couplesMobile';
export { MemoryLaneMobile } from './couplesMobile';

// ── AI Mobile ──
export { AIInsightsMobile } from './aiMobile';
export { AIRewriteMobile } from './aiMobile';
export { AIIcebreakersMobile } from './aiMobile';
export { AIJourneyGuideMobile } from './aiMobile';

// ── Templates 3.0 ── (deprecated — use ui/templates/)
// Templates3 eksportert fra legacy/templates/templates3.tsx
// DashboardTemplate3, ChatTemplate3, ProfileTemplate3, CoupleTemplate3, JourneyTemplate3, MatchTemplate3

// ── Desktop 3.0 ──
export { DesktopSidebarResizable } from './desktop3';
export { useKeyboardShortcuts } from './desktop3';
export { DesktopNotifications } from './desktop3';
export { DesktopCommandPalette } from './desktop3';
export { DesktopWindow } from './desktop3';

// ── PWA (re-export) ──
export { PWALoadingScreen } from './pwa/LoadingScreen';

// ── Experience Layer (UI 4.0) ──
export { Onboarding4, PageTransition, StaggeredChildren, GlowEffect } from './onboarding4';
export type { OnboardingStep, OnboardingState } from './onboarding4';

export { EmptyState, type EmptyStateProps, type EmptyStateVariant } from './emptyStates';
export { EmptyStateFactory } from './emptyStates';

export { SuccessState, type SuccessStateProps, type SuccessVariant } from './successStates';
export { SuccessStateFactory } from './successStates';

export { ErrorState, type ErrorStateProps, type ErrorVariant } from './errorStates';
export { SuccessStateFactory as ErrorStateFactory } from './successStates';

export { Illustration, type IllustrationProps, type IllustrationType } from './illustrations';
export { JourneyIllustration, ConnectionIllustration, HeartbeatIllustration } from './illustrations';
export { StarsIllustration, FlowersIllustration, WavesIllustration } from './illustrations';
export { MoonIllustration, SunriseIllustration, ButterflyIllustration } from './illustrations';
export { TreeIllustration, HomeIllustration, HandsIllustration } from './illustrations';

export { GuidedFlow, type GuidedFlowProps, type FlowType } from './guidedFlows';
export { MatchToChatFlow, JourneyOnboardingFlow, CouplesModeFlow } from './guidedFlows';
export { MemoryCreationFlow, AIInsightsFlow } from './guidedFlows';

export {
  PersonalizationPanel,
  PersonalizationProvider,
  usePersonalization,
  useApplyTheme,
} from './personalization';
export type { Theme, MotionLevel, Density, CardStyle, PersonalizationState } from './personalization';

// ── Microcopy System (UI 4.0) ──
export { microcopy } from './microcopy';

// ── Emotional Intelligence (UI 5.0) ──
export type {
  ToneSignal,
  Mood,
  MoodSignal,
  HealthDimension,
  HealthSignal,
  SuggestionType,
  EmotionalSuggestion,
  DeescalationStep,
  DeescalationStepDef,
  MemoryHighlight,
  CoupleInsight,
  InsightItem,
  ExerciseType,
  ExerciseDef,
  JournalPrompt,
  EmotionalAnalysis,
} from './emotionTypes';

export { moodPalettes, exerciseDefs, deescalationSteps, journalPromptsByMood } from './emotionTypes';

export { ToneMeter, ToneMeterRing, ToneMeterBar, type ToneMeterProps } from './toneMeter';

export { MoodTag, MoodGrid, MoodHistory, ChatMoodBadge, type MoodTagProps, type MoodGridProps, type MoodHistoryProps, type ChatMoodBadgeProps } from './moodTag';

export { EmotionalSuggestions, SuggestionCard, type EmotionalSuggestionsProps } from './emotionalSuggestions';

export { RelationshipHealth, DimensionCard, OverallGauge, HealthSummary, type RelationshipHealthProps } from './relationshipHealth';

export { DeescalationPanel, type DeescalationPanelProps } from './deescalationPanel';

export { MemorySummary, type MemorySummaryProps, type MemorySummarySection } from './memorySummary';

export { CoupleInsights, type CoupleInsightsProps, type CoupleInsightSection } from './coupleInsights';

export { JournalCompanion, type JournalCompanionProps } from './journalCompanion';

export { EmotionalExercise, type EmotionalExerciseProps, type ExercisePlayerProps } from './emotionalExercise';

// ── Emotion Templates 5.0 ──
export { ChatTemplate5, CoupleTemplate5, JourneyTemplate5 } from './emotionTemplates';
export type { ChatTemplate5Props, CoupleTemplate5Props, JourneyTemplate5Props } from './emotionTemplates';

// ── Default Export ──
export default {
  tokens,
  platform,
  NavSystem3,
  DashboardTemplate3,
  ChatTemplate3,
  PlatformButton,
  PlatformCard,
  PlatformModal,
  PlatformInput,
  platformComponents,
  motionRegistry,
  getMotion,
  SharedHomeMobile,
  SharedCalendarMobile,
  SharedJournalMobile,
  MemoryLaneMobile,
  AIInsightsMobile,
  AIRewriteMobile,
  AIIcebreakersMobile,
  AIJourneyGuideMobile,
  InstallPrompt,
  OfflineBanner,
  LoadingScreen,
  DesktopWindow,
  useKeyboardShortcuts,
  DesktopNotifications,
  DesktopCommandPalette,
  DesktopSidebarResizable,
  AppNavbar,
  Sidebar,
  CommandPalette,
  MobileBottomNav,
  MobileNavbar,
  ProfileTemplate3,
  CoupleTemplate3,
  JourneyTemplate3,
  MatchTemplate3,
  Onboarding4,
  EmptyState,
  SuccessState,
  ErrorState,
  GuidedFlow,
  Illustration,
  PersonalizationPanel,
};