.
├── ${file_path}
├── app
│   ├── admin
│   │   ├── conversations
│   │   │   ├── flagged
│   │   │   │   ├── [id]
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── journey
│   │   │   ├── [id]
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   ├── matches
│   │   │   ├── [id]
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── page.tsx
│   │   ├── settings
│   │   │   └── page.tsx
│   │   └── users
│   │       ├── [id]
│   │       │   └── page.tsx
│   │       └── page.tsx
│   ├── api
│   │   ├── admin
│   │   │   ├── conversations
│   │   │   │   └── [id]
│   │   │   │       ├── block
│   │   │   │       │   └── route.ts
│   │   │   │       ├── close
│   │   │   │       │   └── route.ts
│   │   │   │       └── review
│   │   │   │           └── route.ts
│   │   │   ├── journey
│   │   │   │   └── [id]
│   │   │   │       ├── complete
│   │   │   │       │   └── route.ts
│   │   │   │       ├── next-step
│   │   │   │       │   └── route.ts
│   │   │   │       └── reset
│   │   │   │           └── route.ts
│   │   │   └── matches
│   │   │       └── [id]
│   │   │           ├── reset
│   │   │           │   └── route.ts
│   │   │           ├── review
│   │   │           │   └── route.ts
│   │   │           └── unmatch
│   │   │               └── route.ts
│   │   ├── conversation
│   │   │   ├── [id]
│   │   │   │   ├── messages
│   │   │   │   │   └── route.ts
│   │   │   │   └── send
│   │   │   │       └── route.ts
│   │   │   └── route.ts
│   │   ├── match
│   │   │   └── route.ts
│   │   └── profile
│   │       └── route.ts
│   ├── chat
│   │   └── ChatWindow.tsx
│   ├── conversation
│   │   └── [id]
│   │       └── page.tsx
│   └── profile
│       ├── edit
│       │   ├── actions.ts
│       │   ├── page.tsx
│       │   └── ProfileEditForm.tsx
│       └── [id]
│           ├── getProfileById.ts
│           ├── page.tsx
│           └── ProfileView.tsx
├── cascade-spec.modelfile
├── components
│   ├── animations
│   │   └── FadeIn.tsx
│   ├── chat
│   ├── ChatHeader.tsx
│   ├── ChatList.tsx
│   ├── ChatWindow.tsx
│   ├── conversation
│   │   ├── ConversationView.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── SystemMessage.tsx
│   │   └── TypingIndicator.tsx
│   ├── DashboardMatchBanner.tsx
│   ├── DashboardMatchStatus.tsx
│   ├── DashboardSkeleton.tsx
│   ├── ImageUpload.tsx
│   ├── KnowYourCard.js
│   ├── layout
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   └── PageWrapper.tsx
│   ├── Layout.js
│   ├── MatchActions.tsx
│   ├── MatchBreakdownItem.tsx
│   ├── MatchBreakdownSkeleton.tsx
│   ├── MatchBreakdown.tsx
│   ├── MatchCardSkeleton.tsx
│   ├── MatchCard.tsx
│   ├── MatchHistory
│   │   ├── MatchHistoryEmpty.tsx
│   │   ├── MatchHistoryItem.tsx
│   │   ├── MatchHistoryList.tsx
│   │   └── MatchHistorySkeleton.tsx
│   ├── MatchPopup.tsx
│   ├── NotificationCenter.tsx
│   ├── onboarding
│   │   ├── HalfwayModal.tsx
│   │   ├── Progress.tsx
│   │   └── Timeline.tsx
│   ├── PublicMatchCard.tsx
│   ├── Recommendation.tsx
│   ├── sections
│   │   ├── Features.tsx
│   │   ├── ForWho.tsx
│   │   ├── Founder.tsx
│   │   ├── Hero.tsx
│   │   ├── Process.tsx
│   │   ├── Safety.tsx
│   │   └── Why.tsx
│   └── ui
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Divider.tsx
│       └── SectionTitle.tsx
├── config
│   ├── matching.export.ts
│   └── matching.ts
├── Donatello.md
├── .env
├── .env.local
├── .gitignore
├── hooks
│   ├── useAutoSaveForm.ts
│   ├── useAutoSave.ts
│   ├── useFadeIn.ts
│   ├── useMediaQuery.ts
│   └── useScroll.ts
├── lib
│   ├── analytics.ts
│   ├── api.ts
│   ├── auth
│   │   ├── hash.ts
│   │   └── session.ts
│   ├── baseScore.ts
│   ├── chat
│   │   ├── createConversation.ts
│   │   ├── createMessage.ts
│   │   ├── getConversation.ts
│   │   ├── getMessages.ts
│   │   └── getUserConversations.ts
│   ├── constants.ts
│   ├── createSystemMessage.ts
│   ├── deepMatch.ts
│   ├── email.ts
│   ├── journey
│   │   └── getJourneyState.ts
│   ├── journeyTasks.ts
│   ├── jwt.ts
│   ├── matchHistory.ts
│   ├── matching
│   │   └── breakdown.ts
│   ├── matching.ts
│   ├── match.ts
│   ├── onboardingGuard.ts
│   ├── prisma.ts
│   ├── profileCompletion.ts
│   ├── realtime.ts
│   ├── resonance.ts
│   ├── semantic.ts
│   ├── supabase.ts
│   ├── user.ts
│   └── utils.ts
├── middleware.ts
├── Nemo.md
├── .next
│   ├── cache
│   │   ├── .rscinfo
│   │   ├── swc
│   │   │   └── plugins
│   │   │       └── v7_linux_x86_64_4.0.0
│   │   ├── .tsbuildinfo
│   │   └── webpack
│   │       ├── client-development
│   │       │   ├── 0.pack.gz
│   │       │   ├── 1.pack.gz
│   │       │   ├── index.pack.gz
│   │       │   └── index.pack.gz.old
│   │       ├── client-production
│   │       │   ├── 0.pack
│   │       │   └── index.pack
│   │       ├── edge-server-production
│   │       │   ├── 0.pack
│   │       │   └── index.pack
│   │       ├── server-development
│   │       │   ├── 0.pack.gz
│   │       │   └── index.pack.gz
│   │       └── server-production
│   │           ├── 0.pack
│   │           └── index.pack
│   ├── diagnostics
│   │   ├── build-diagnostics.json
│   │   └── framework.json
│   └── package.json
├── next.config.js
├── next-env.d.ts
├── .npmrc
├── package.json
├── package-lock.json
├── pages
│   ├── 404.tsx
│   ├── admin
│   │   └── login.tsx
│   ├── api
│   │   ├── admin
│   │   │   └── login.ts
│   │   ├── auth
│   │   │   ├── login.ts
│   │   │   └── [...nextauth].ts
│   │   ├── bli-kjent
│   │   │   └── list.ts
│   │   ├── cards
│   │   │   └── list.ts
│   │   ├── chat
│   │   │   ├── can-send-image.ts
│   │   │   ├── conversations
│   │   │   │   ├── [id].ts
│   │   │   │   └── new.ts
│   │   │   ├── conversations.ts
│   │   │   ├── is-locked.ts
│   │   │   ├── list.ts
│   │   │   ├── mark-read.ts
│   │   │   ├── matches.ts
│   │   │   ├── [matchId].ts
│   │   │   ├── messages
│   │   │   │   └── [conversationId].ts
│   │   │   ├── messages.ts
│   │   │   ├── send-card.ts
│   │   │   ├── send.ts
│   │   │   ├── state.ts
│   │   │   ├── typing-status.ts
│   │   │   ├── typing.ts
│   │   │   ├── unread-count.ts
│   │   │   └── unread.ts
│   │   ├── conversation
│   │   │   └── status.ts
│   │   ├── cron
│   │   │   └── system-message.ts
│   │   ├── dashboard
│   │   │   └── overview.ts
│   │   ├── dashboard.ts
│   │   ├── journey
│   │   │   ├── complete.ts
│   │   │   ├── current.ts
│   │   │   ├── match
│   │   │   │   └── [matchId].ts
│   │   │   ├── next.ts
│   │   │   ├── start.ts
│   │   │   ├── status.ts
│   │   │   └── today.ts
│   │   ├── login.ts
│   │   ├── logout.ts
│   │   ├── match
│   │   │   ├── active.ts
│   │   │   ├── breakdown.ts
│   │   │   ├── cards.ts
│   │   │   ├── decision.ts
│   │   │   ├── end.ts
│   │   │   ├── expire.ts
│   │   │   ├── history.ts
│   │   │   ├── last-ended.ts
│   │   │   ├── like.ts
│   │   │   ├── mark-seen.ts
│   │   │   ├── new-status.ts
│   │   │   ├── next.ts
│   │   │   ├── process.ts
│   │   │   ├── public-card.ts
│   │   │   ├── queue.ts
│   │   │   ├── recommendations.ts
│   │   │   ├── request.ts
│   │   │   ├── run.ts
│   │   │   └── status.ts
│   │   ├── matches
│   │   ├── matching
│   │   │   └── run-process.ts
│   │   ├── match-request
│   │   │   ├── new.ts
│   │   │   └── status.ts
│   │   ├── me.ts
│   │   ├── notifications
│   │   │   ├── create.ts
│   │   │   ├── list.ts
│   │   │   └── read.ts
│   │   ├── onboarding
│   │   │   ├── complete.ts
│   │   │   ├── firstname.ts
│   │   │   ├── progress.ts
│   │   │   ├── save.ts
│   │   │   ├── step1.ts
│   │   │   ├── step2.ts
│   │   │   ├── step3.ts
│   │   │   ├── step4.ts
│   │   │   ├── step5.ts
│   │   │   ├── step6.ts
│   │   │   ├── step7.ts
│   │   │   └── step8.ts
│   │   ├── profile
│   │   │   ├── [id].ts
│   │   │   ├── index.ts
│   │   │   ├── me.ts
│   │   │   └── update.ts
│   │   ├── recommendations
│   │   │   └── index.ts
│   │   ├── signup.ts
│   │   ├── system
│   │   │   ├── mark-read.ts
│   │   │   └── messages.ts
│   │   └── uploadthing
│   │       ├── core.ts
│   │       └── index.ts
│   ├── _app.js
│   ├── betingelser.tsx
│   ├── chat
│   │   ├── [id].tsx
│   │   └── index.tsx
│   ├── dashboard.tsx
│   ├── faq.tsx
│   ├── find-match.tsx
│   ├── history.tsx
│   ├── hvordan-det-fungerer.tsx
│   ├── index.tsx
│   ├── journey
│   ├── kontakt.tsx
│   ├── login.tsx
│   ├── match
│   │   ├── history.tsx
│   │   ├── [id].tsx
│   │   ├── index.tsx
│   │   ├── request.tsx
│   │   └── view
│   │       └── [id].tsx
│   ├── match-history
│   │   └── index.tsx
│   ├── match-ready.tsx
│   ├── match.tsx
│   ├── notifications
│   │   └── index.tsx
│   ├── om.tsx
│   ├── onboarding
│   │   ├── complete.tsx
│   │   ├── index.tsx
│   │   ├── resume.tsx
│   │   ├── step1.tsx
│   │   ├── step2.tsx
│   │   ├── step3.tsx
│   │   ├── step4.tsx
│   │   ├── step5.tsx
│   │   ├── step6.tsx
│   │   ├── step7.tsx
│   │   └── step8.tsx
│   ├── personvern.tsx
│   ├── profile
│   │   ├── edit.tsx
│   │   ├── [id].tsx
│   │   └── index.tsx
│   ├── recommendations.tsx
│   ├── searching.tsx
│   ├── settings
│   │   └── index.tsx
│   └── signup.tsx
├── postcss.config.js
├── prisma
│   ├── migrations
│   │   ├── 20260407132539_init
│   │   │   └── migration.sql
│   │   ├── 20260407133622_add_user_profile
│   │   │   └── migration.sql
│   │   ├── 20260407134050_add_user_model
│   │   │   └── migration.sql
│   │   ├── 20260407173706_add_profile
│   │   │   └── migration.sql
│   │   ├── 20260407190123_add_preferences
│   │   │   └── migration.sql
│   │   ├── 20260409132704_fix_relations
│   │   │   └── migration.sql
│   │   ├── 20260409135714_add_system_messages
│   │   │   └── migration.sql
│   │   ├── 20260410161531_init_auth
│   │   │   └── migration.sql
│   │   ├── 20260411084029_add_onboarding_step2_fields
│   │   │   └── migration.sql
│   │   ├── 20260411084351_add_job_status_field
│   │   │   └── migration.sql
│   │   ├── 20260411093601_add_target_user_id_and_decision
│   │   │   └── migration.sql
│   │   ├── 20260411103518_add_onboarding_step
│   │   │   └── migration.sql
│   │   ├── 20260411211609_cleanup
│   │   │   └── migration.sql
│   │   ├── 20260412080737_update_profile_schema
│   │   │   └── migration.sql
│   │   ├── 20260412130732_final_schema_update
│   │   │   └── migration.sql
│   │   ├── 20260412151220_add_typing_status
│   │   │   └── migration.sql
│   │   ├── 20260412151926_final_full_schema
│   │   │   └── migration.sql
│   │   ├── 20260414143609_add_chat_fields
│   │   │   └── migration.sql
│   │   ├── 20260414143638_add_match_status
│   │   │   └── migration.sql
│   │   ├── 20260416195128_add_onboarding_step
│   │   │   └── migration.sql
│   │   ├── 20260416202013_add_bli_kjent_card
│   │   │   └── migration.sql
│   │   ├── 20260416203313_add_chat_until
│   │   │   └── migration.sql
│   │   ├── 20260416212340_add_started_at_to_match
│   │   │   └── migration.sql
│   │   ├── 20260416212830_add_journey_task
│   │   │   └── migration.sql
│   │   └── migration_lock.toml
│   └── schema.prisma
├── public
│   ├── favicon.ico
│   ├── hero.jpg
│   └── vercel.svg
├── qwen3.6-spec.modelfile
├── README.md
├── styles
│   ├── globals.css
│   └── Home.module.css
├── tailwind.config.js
├── tosom-structure.md
├── tosom_structure.txt
├── tsconfig.json
├── types
│   ├── api.ts
│   ├── match.ts
│   ├── next-auth.d.ts
│   └── user.ts
└── utils
    ├── format.ts
    └── uploadthing.ts

134 directories, 317 files
