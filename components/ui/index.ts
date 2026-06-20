/**
 * ToSom UI 2.0 — Minimal barrel export
 * Only exports that actually exist.
 */

// === FOUNDATION ===
export * from './tokens';

// === CORE UI (only files that exist and compile) ===
export { Button } from './Button';
export { default as GlassCard } from './GlassCard';
export { default as Input } from './Input';
export { default as Card } from './Card';
export { default as Avatar } from './Avatar';
export { Chip } from './Chip';
export { default as Dialog } from './Dialog';
export { default as Divider } from './Divider';
export { default as FadeIn } from './FadeIn';
export { default as Footer } from './Footer';
export { default as GlassPanel } from './GlassPanel';
export { default as MatchCard } from './MatchCard';
export { default as Modal } from './Modal';
export { default as ModalV2 } from './ModalV2';
export { default as Navbar } from './Navbar';
export { default as PremiumButton } from './PremiumButton';
export { default as ProgressBar } from './ProgressBar';
export { default as ResonanceMeter } from './ResonanceMeter';
export { default as SectionTitle } from './SectionTitle';
export { default as Skeleton } from './Skeleton';
export { default as StepIndicator } from './StepIndicator';
export { default as Toast } from './Toast';
export { default as Tooltip } from './Tooltip';
export { default as Typography } from './Typography';
export { default as ErrorState } from './ErrorState';
export { default as FeatureCard } from './FeatureCard';

// === FORMS (from subdirectory) ===
export { default as DatePicker } from './forms/DatePicker';
export { default as FormField } from './forms/FormField';
export { default as FormInput } from './forms/Input';
export { default as FormSelect } from './forms/Select';
export { default as FormSlider } from './forms/Slider';
export { default as FormTagInput } from './forms/TagInput';
export { default as FormTextarea } from './forms/Textarea';
export { default as FormToggle } from './forms/Toggle';

// === CARDS ===
export { default as ElevatedCard } from './cards/ElevatedCard';
export { default as GradientCard } from './cards/GradientCard';
export { default as ProfileCard } from './cards/ProfileCard';
export { default as JourneyCard } from './cards/JourneyCard';
export { default as MemoryCard } from './cards/MemoryCard';

// === LAYOUT ===
export { default as PageShell } from './layout/PageShell';
export { default as Section } from './layout/Section';
export { default as Container } from './layout/Container';
export { default as Grid } from './layout/Grid';
export { default as Stack } from './layout/Stack';

// === NAVIGATION ===
export { default as AppNavbar } from './navigation/AppNavbar';
export { default as MobileNavbar } from './navigation/MobileNavbar';
export { default as Sidebar } from './navigation/Sidebar';
export { default as BottomNav } from './navigation/BottomNav';

// === TYPOGRAPHY ===
export { default as Display } from './typography/Display';
export { default as Heading } from './typography/Heading';
export { default as Subheading } from './typography/Subheading';
export { default as Body } from './typography/Body';
export { default as Label } from './typography/Label';

// === CHAT ===
export { default as ChatWindowV2 } from './chat/ChatWindowV2';
export { default as ChatBubbleV2 } from './chat/ChatBubbleV2';
export { default as ChatInputV2 } from './chat/ChatInputV2';
export { default as ChatSuggestions } from './chat/ChatSuggestions';

// === COUPLES ===
export { default as SharedHome } from './couples/SharedHome';
export { default as SharedGoals } from './couples/SharedGoals';
export { default as SharedCalendar } from './couples/SharedCalendar';
export { default as SharedJournal } from './couples/SharedJournal';
export { default as MemoryLane } from './couples/MemoryLane';

// === AI ===
export { default as AIInsightsPanel } from './ai/AIInsightsPanel';
export { default as AIRewritePanel } from './ai/AIRewritePanel';
export { default as AIJourneyGuide } from './ai/AIJourneyGuide';
export { default as AIIcebreakers } from './ai/AIIcebreakers';

// === OVERLAYS ===
export { default as ModalV3 } from './overlays/ModalV3';
export { default as Drawer } from './overlays/Drawer';
export { default as Popover } from './overlays/Popover';

// === LISTS ===
export { default as List } from './lists/List';
export { default as ChatListItem } from './lists/ChatListItem';
export { default as NotificationItem } from './lists/NotificationItem';

// === RELATIONSHIP ===
export { default as TimelineV2 } from './relationship/TimelineV2';
export { default as MilestoneCardV2 } from './relationship/MilestoneCardV2';
export { default as SocialGraphV2 } from './relationship/SocialGraphV2';
export { default as WeeklyDigestV2 } from './relationship/WeeklyDigestV2';

// === TEMPLATES ===
export { default as DashboardTemplate } from './templates/DashboardTemplate';
export { default as ProfileTemplate } from './templates/ProfileTemplate';
export { default as MatchTemplate } from './templates/MatchTemplate';
export { default as ChatTemplate } from './templates/ChatTemplate';
export { default as JourneyTemplate } from './templates/JourneyTemplate';
export { default as CoupleTemplate } from './templates/CoupleTemplate';

// === MISC ===
export { default as illustrations, Illustration, type IllustrationType, type IllustrationProps } from './illustrations';
export { default as moodTag } from './moodTag';
export { default as microcopy } from './microcopy';