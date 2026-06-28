# Komponentstruktur — ToSom

**Generert:** 2026-06-26  
**Status:** Fase 4 — Analyse  
**Totalt:** ~180 komponentfiler i 25+ directory

---

## OVERSYKT

| Directory | Filantall | Kategori |
|------|-|--|
| Root | 17 | Feature-komponentar |
| ai/ | 3 | AI-assisterte komponentar |
| analytics/ | 1 | Analytics |
| animations/ | 1 | Animasjonar |
| app/ | 3 | App-struktur |
| branding/ | 6 | Merking |
| chat/ | 9 | Chat-komponentar |
| conversation/ | 7 | Samtale |
| dashboard/ | 11 | Dashboard |
| dynamic/ | 1 | Dynamisk |
| journey/ | 5 | Reise |
| launch/ | 6 | Launch |
| layout/ | 5 | Layout |
| legacy/ | 1 | Legacy |
| match/ | 7 | Matching |
| onboarding/ | 17 | Onboarding |
| profile/ | 9 | Profil |
| relationship/ | 5 | Relasjon |
| sections/ | 9 | Sections |
| system/ | 2 | System |
| ui/ | 30+ | UI-primitive |
| ui5/ | 15+ | UI 5.0 |

---

## DETALJERT ANALYSE PER DIRECTORY

### 🟢 AKTIV (brukt i kodebasen)

#### Root-komponentar (17 filer)

| Komponent | Status | Bruk |
|------|--|-----|
| ChatList.tsx | AKTIV | Chat UI |
| ChatWindow.tsx | AKTIV | Chat UI |
| DashboardMatchBanner.tsx | AKTIV | Dashboard |
| DashboardMatchStatus.tsx | AKTIV | Dashboard |
| DashboardSkeleton.tsx | AKTIV | Loading |
| ImageUpload.tsx | AKTIV | Filopplasting |
| MatchActions.tsx | AKTIV | Match UI |
| MatchBreakdown.tsx | AKTIV | Match UI |
| MatchBreakdownItem.tsx | AKTIV | Match UI |
| MatchBreakdownSkeleton.tsx | AKTIV | Loading |
| MatchCard.tsx | AKTIV | Match UI |
| MatchCardSkeleton.tsx | AKTIV | Loading |
| MatchPopup.tsx | AKTIV | Match UI |
| NotificationCenter.tsx | AKTIV | Notifikasjonar |
| PublicMatchCard.tsx | AKTIV | Public |
| Recommendation.tsx | AKTIV | Match UI |
| AgeRequirement.tsx | AKTIV | Auth |

#### ai/ (3 filer)

| Komponent | Status | Bruk |
|------|--|-----|
| ChatSuggestions.tsx | AKTIV | AI chat |
| IcebreakerGenerator.tsx | AKTIV | AI |
| MatchInsights.tsx | AKTIV | AI match |

#### analytics/ (1 fil)

| Komponent | Status | Bruk |
|------|--|-----|
| AnalyticsProvider.tsx | AKTIV | Analytics |

#### animations/ (1 fil)

| Komponent | Status | Bruk |
|------|--|-----|
| FadeIn.tsx | AKTIV | Animasjon |

#### app/ (3 filer)

| Komponent | Status | Bruk |
|------|--|-----|
| AppShell.tsx | AKTIV | Layout |
| ModalStack.tsx | AKTIV | Modal |
| NavigationDemo.tsx | AKTIV | Demo |

#### branding/ (6 filer)

| Komponent | Status | Bruk |
|------|--|-----|
| BrandButton.tsx | AKTIV | UI |
| BrandDemo.tsx | AKTIV | Demo |
| BrandIcon.tsx | AKTIV | UI |
| BrandProvider.tsx | AKTIV | Provider |
| BrandText.tsx | AKTIV | UI |
| LogoVariants.tsx | AKTIV | Branding |

#### chat/ (9 filer)

| Komponent | Status | Bruk |
|------|--|-----|
| ChatBubble.tsx | AKTIV | Chat |
| ChatHeader.tsx | AKTIV | Chat |
| ChatInputBar.tsx | AKTIV | Chat |
| ChatList.tsx | AKTIV | Chat |
| ChatMessageBubble.tsx | AKTIV | Chat |
| ChatPanel.tsx | AKTIV | Chat |
| ChatPanelDemo.tsx | AKTIV | Demo |
| ChatView.tsx | AKTIV | Chat |
| ChatViewDemo.tsx | AKTIV | Demo |
| ChatWindow.tsx | AKTIV | Chat |

#### conversation/ (7 filer)

| Komponent | Status | Bruk |
|------|--|-----|
| ContinueChoice.tsx | AKTIV | Samtale |
| ConversationView.tsx | AKTIV | Samtale |
| JourneyEndNotice.tsx | AKTIV | Samtale |
| JourneyTimeline.tsx | AKTIV | Samtale |
| MessageBubble.tsx | AKTIV | Samtale |
| SystemMessage.tsx | AKTIV | Samtale |
| TypingIndicator.tsx | AKTIV | Samtale |

#### dashboard/ (11 filer)

| Komponent | Status | Bruk |
|------|--|-----|
| ConversationCard.tsx | AKTIV | Dashboard |
| DashboardBottom.tsx | AKTIV | Dashboard |
| DashboardHeader.tsx | AKTIV | Dashboard |
| DashboardLayout.tsx | AKTIV | Dashboard |
| DashboardMiddle.tsx | AKTIV | Dashboard |
| DashboardTop.tsx | AKTIV | Dashboard |
| JourneySummary.tsx | AKTIV | Dashboard |
| NotificationFeed.tsx | AKTIV | Dashboard |
| QuickActionGrid.tsx | AKTIV | Dashboard |
| ReflectionBox.tsx | AKTIV | Dashboard |
| StreakDisplay.tsx | AKTIV | Dashboard |
| SystemNotice.tsx | AKTIV | Dashboard |

#### journey/ (5 filer)

| Komponent | Status | Bruk |
|------|--|-----|
| JourneyCard.tsx | AKTIV | Reise |
| journeyEngine.ts | AKTIV | Reise logikk |
| JourneyMap.tsx | AKTIV | Reise |
| JourneySummaryMini.tsx | AKTIV | Reise |
| JourneyView.tsx | AKTIV | Reise |

#### launch/ (6 filer)

| Komponent | Status | Bruk |
|------|--|-----|
| JourneyUpdateScreen.tsx | EKSPERIMENTELL | Launch |
| LaunchDemo.tsx | EKSPERIMENTELL | Demo |
| LaunchFlow.tsx | EKSPERIMENTELL | Launch |
| LoadingScreen.tsx | EKSPERIMENTELL | Launch |
| MatchSearchScreen.tsx | EKSPERIMENTELL | Launch |
| SplashScreen.tsx | EKSPERIMENTELL | Demo |

#### layout/ (5 filer)

| Komponent | Status | Bruk |
|------|--|-----|
| Footer.tsx | AKTIV | Layout |
| GlobalHeaderWrapper.tsx | AKTIV | Layout |
| Header.tsx | AKTIV | Layout |
| PageWrapper.tsx | AKTIV | Layout |

#### match/ (7 filer)

| Komponent | Status | Bruk |
|------|--|-----|
| MatchBanner.tsx | AKTIV | Match |
| MatchBannerBreakdown.tsx | AKTIV | Match |
| MatchBreakdown.tsx | AKTIV | Match |
| MatchCard | AKTIV | Match |
| MatchDetailModal.tsx | AKTIV | Match |
| MatchFlowPreview.tsx | AKTIV | Demo |
| MatchResultDemo.tsx | AKTIV | Demo |
| MatchResultView.tsx | AKTIV | Match |

#### onboarding/ (17 filer)

| Komponent | Status | Bruk |
|------|--|-----|
| HalfwayModal.tsx | AKTIV | Onboarding |
| OnboardingDemo.tsx | EKSPERIMENTELL | Demo |
| OnboardingFlow.tsx | AKTIV | Onboarding |
| OnboardingLayout.tsx | AKTIV | Onboarding |
| OnboardingScreen.tsx | AKTIV | Onboarding |
| OnboardingWizard.tsx | AKTIV | Onboarding |
| Progress.tsx | AKTIV | Onboarding |
| Timeline.tsx | AKTIV | Onboarding |
| StepFramtid.tsx | AKTIV | Onboarding |
| StepGrenser.tsx | AKTIV | Onboarding |
| StepIdentitet.tsx | AKTIV | Onboarding |
| StepIntimitet.tsx | AKTIV | Onboarding |
| StepKjerner.tsx | AKTIV | Onboarding |
| StepKommunikasjon.tsx | AKTIV | Onboarding |
| StepLivsrytme.tsx | AKTIV | Onboarding |
| StepLivssituasjon.tsx | AKTIV | Onboarding |
| StepOppsummering.tsx | AKTIV | Onboarding |
| StepPersonlighet.tsx | AKTIV | Onboarding |
| StepRelasjonsstil.tsx | AKTIV | Onboarding |

#### profile/ (9 filer)

| Komponent | Status | Bruk |
|------|--|-----|
| PartnerProfileDemo.tsx | EKSPERIMENTELL | Demo |
| PartnerProfileView.tsx | AKTIV | Profil |
| ProfileActions.tsx | AKTIV | Profil |
| ProfileDetails.tsx | AKTIV | Profil |
| ProfileForm.tsx | AKTIV | Profil |
| ProfileHeader.tsx | AKTIV | Profil |
| ProfileInput.tsx | AKTIV | Profil |
| ProfileView.tsx | AKTIV | Profil |
| UserProfileDemo.tsx | EKSPERIMENTELL | Demo |
| UserProfileView.tsx | AKTIV | Profil |

#### relationship/ (5 filer)

| Komponent | Status | Bruk |
|------|--|-----|
| Memories.tsx | AKTIV | Relasjon |
| MilestoneCard.tsx | AKTIV | Relasjon |
| SocialGraph.tsx | EKSPERIMENTELL | Relasjon |
| Timeline.tsx | AKTIV | Relasjon |
| WeeklyDigest.tsx | EKSPERIMENTELL | Relasjon |

#### sections/ (9 filer)

| Komponent | Status | Bruk |
|------|--|-----|
| Features.tsx | AKTIV | Landing |
| ForWho.tsx | AKTIV | Landing |
| Founder.tsx | AKTIV | Landing |
| Hero.tsx | AKTIV | Landing |
| Process.tsx | AKTIV | Landing |
| Safety.tsx | AKTIV | Landing |
| SectionCTA.tsx | AKTIV | Landing |
| SectionFeatures.tsx | AKTIV | Landing |
| SectionHero.tsx | AKTIV | Landing |
| Why.tsx | AKTIV | Landing |

#### system/ (2 filer)

| Komponent | Status | Bruk |
|------|--|-----|
| SentryErrorBoundary.tsx | AKTIV | System |
| SystemMessageBox.tsx | AKTIV | System |

#### ui/ (30+ filer)

| Komponent | Status | Bruk |
|------|--|-----|
| Avatar.tsx | AKTIV | UI |
| Button.tsx | AKTIV | UI |
| Card.tsx | AKTIV | UI |
| Chip.tsx | AKTIV | UI |
| Dialog.tsx | AKTIV | UI |
| Divider.tsx | AKTIV | UI |
| ErrorState.tsx | AKTIV | UI |
| FadeIn.tsx | AKTIV | UI |
| FeatureCard.tsx | AKTIV | UI |
| Footer.tsx | AKTIV | UI |
| GlassCard.tsx | AKTIV | UI |
| GlassPanel.tsx | AKTIV | UI |
| Input.tsx | AKTIV | UI |
| Modal.tsx | AKTIV | UI |
| ModalV2.tsx | AKTIV | UI |
| Navbar.tsx | AKTIV | UI |
| PremiumButton.tsx | EKSPERIMENTELL | Premium |
| ProgressBar.tsx | AKTIV | UI |
| ResonanceMeter.tsx | AKTIV | UI |
| Section.tsx | AKTIV | UI |
| SectionTitle.tsx | AKTIV | UI |
| Skeleton.tsx | AKTIV | UI |
| SkeletonPremium.tsx | EKSPERIMENTELL | Premium |
| StepIndicator.tsx | AKTIV | UI |
| Toast.tsx | AKTIV | UI |
| Tooltip.tsx | AKTIV | UI |
| Typography.tsx | AKTIV | UI |
| premiumFooter.tsx | EKSPERIMENTELL | Premium |
| premiumHero.tsx | EKSPERIMENTELL | Premium |
| premiumCTA.tsx | EKSPERIMENTELL | Premium |
| premiumOption.tsx | EKSPERIMENTELL | Premium |

#### ui5/ (15+ filer)

| Komponent | Status | Bruk |
|------|--|-----|
| MatchCard.tsx | AKTIV | UI5 |
| ChatWindow.tsx | AKTIV | UI5 |
| ChatHeader.tsx | AKTIV | UI5 |
| ChatInputBar.tsx | AKTIV | UI5 |
| ChatView.tsx | AKTIV | UI5 |
| ChatBubble.tsx | AKTIV | UI5 |
| PremiumButton.tsx | EKSPERIMENTELL | Premium |
| PremiumFooter.tsx | EKSPERIMENTELL | Premium |
| PremiumHero.tsx | EKSPERIMENTELL | Premium |
| PremiumCTA.tsx | EKSPERIMENTELL | Premium |
| PremiumOption.tsx | EKSPERIMENTELL | Premium |

---

## OVERLAP OG DUPLIKAT

### MatchCard-duplikat (3+ variantar)

| Lokasjon | Status |
|-----|-|
| components/MatchCard.tsx | DEPRECATED (ui5 versjon) |
| components/ui5/MatchCard.tsx | AKTIV (kanonisk) |
| components/match/MatchCard | AKTIV (kanonisk) |

### ChatWindow-duplikat (3+ variantar)

| Lokasjon | Status |
|-----|-|
| components/ChatWindow.tsx | DEPRECATED (chat versjon) |
| components/chat/ChatWindow.tsx | AKTIV |
| components/ui5/ChatWindow.tsx | AKTIV (UI5) |

### ChatList-duplikat (2 variantar)

| Lokasjon | Status |
|-----|-|
| components/ChatList.tsx | DEPRECATED (chat versjon) |
| components/chat/ChatList.tsx | AKTIV |

### DashboardMatchBanner-duplikat (2 variantar)

| Lokasjon | Status |
|-----|-|
| components/DashboardMatchBanner.tsx | DEPRECATED (dashboard versjon) |
| components/dashboard/DashboardBanner.tsx | AKTIV |

### DashboardMatchStatus-duplikat (2 variantar)

| Lokasjon | Status |
|-----|-|
| components/DashboardMatchStatus.tsx | DEPRECATED (dashboard versjon) |
| components/dashboard/DashboardStatus.tsx | AKTIV |

---

## EKSPERIMENTELLE/LEGGACY-KOMPONENTER

### Launch/ wave-komponentar (6 filer)

| Komponent | Status |
|------|--|
| JourneyUpdateScreen.tsx | EKSPERIMENTELL |
| LaunchDemo.tsx | EKSPERIMENTELL |
| LaunchFlow.tsx | EKSPERIMENTELL |
| LoadingScreen.tsx | EKSPERIMENTELL |
| MatchSearchScreen.tsx | EKSPERIMENTELL |
| SplashScreen.tsx | EKSPERIMENTELL |

### Premium-komponentar (6 filer)

| Komponent | Status |
|------|--|
| PremiumButton.tsx | EKSPERIMENTELL |
| SkeletonPremium.tsx | EKSPERIMENTELL |
| PremiumFooter.tsx | EKSPERIMENTELL |
| PremiumHero.tsx | EKSPERIMENTELL |
| PremiumCTA.tsx | EKSPERIMENTELL |
| PremiumOption.tsx | EKSPERIMENTELL |

### Relationship-eksperiment (2 filer)

| Komponent | Status |
|------|--|
| SocialGraph.tsx | EKSPERIMENTELL |
| WeeklyDigest.tsx | EKSPERIMENTELL |

### Legacy (1 fil)

| Komponent | Status |
|------|--|
| LegacyChatHeader.tsx | DEPRECATED |

---

## STATISTIKK

| Kategori | Tal |
|------|--|
| Totalt komponentar | ~180 |
| AKTIV | ~120 |
| EKSPERIMENTELL/DEPRECATED | ~35 |
| Duplikat | ~10 |
| Kan fjernast | ~45 |
| Målstruktur | ~130 |

---

## OPPSUMMERING

| Kategori | Tal | Status |
|------|-|------|
| AKTIV | ~120 | Behold |
| EKSPERIMENTELL | ~35 | Merk/merge |
| DEPRECATED | ~5 | Slett |
| DUPLIKAT | ~10 | Merge/slett |
| **Mål** | **~130** | Etter Phase 5 |