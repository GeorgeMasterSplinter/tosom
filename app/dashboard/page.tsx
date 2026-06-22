/**
 * ToSom — Dashboard 2.0
 * 
 * Hovudside for innloggede brukarar.
 * - Velkomst
 * - Aktive matcher
 * - Aktive samtalar
 * - Innsikt og refleksjon
 * - Profilstatus og reise
 */

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { getUserProfile, getUserMatches, getUserConversations, getUserInsights } from '@/lib/dashboard/data';
import { MatchCard } from './_components/MatchCard';
import { ConversationCard } from './_components/ConversationCard';
import { InsightSection } from './_components/InsightSection';
import { ProfileStatusSection } from './_components/ProfileStatusSection';
import { redirect } from 'next/navigation';

/* ====== DashboardHeader ====== */

function DashboardHeader({ name }: { name: string }) {
  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 6) return 'God natt';
    if (hour < 12) return 'God morgon';
    if (hour < 18) return 'God dag';
    return 'God kveld';
  })();

  return (
    <div className="mb-8">
      <h1 className="text-2xl font-semibold mb-2" style={{ color: '#FFFFFF' }}>
        {greeting}, {name ? `${name.split(' ')[0]}` : 'vi'}
      </h1>
      <p
        className="text-sm leading-relaxed"
        style={{ color: 'rgba(255, 255, 255, 0.4)' }}
      >
        Her får du ei roleg oversikt over relasjonane dine. Ta deg tid.
      </p>
    </div>
  );
}

/* ====== Main Dashboard Page (Server Component) ====== */

export default async function DashboardPage() {
  // Auth
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/login');
  }

  const userId = session.user.id;

  // Data
  const profile = await getUserProfile(userId);
  const matches = await getUserMatches(userId);
  const conversations = await getUserConversations(userId);
  const profileComplete = !!profile && profile.deepProfileComplete;
  const insights = await getUserInsights(
    userId,
    matches.length,
    conversations.length,
    profileComplete,
  );

  const displayName = profile?.identityName || 'vi';

  return (
    <div
      className="min-h-screen"
      style={{ background: '#0B0E11' }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Toppseksjon */}
        <DashboardHeader name={displayName} />

        {/* Grid: 2 kolonnar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Venstre kolonne: Matcher + Samtaler */}
          <div className="space-y-6">
            {/* Dine matcher */}
            <section>
              <h2
                className="text-xs font-medium uppercase tracking-wider mb-3"
                style={{ color: 'rgba(212, 175, 55, 0.5)' }}
              >
                Dine matcher
              </h2>
              {matches.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {matches.slice(0, 6).map((match) => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              ) : (
                <EmptyState text="Du har ingen aktive matcher enno. Det kjem éin god match om dagen." />
              )}
            </section>

            {/* Dine samtalar */}
            <section>
              <h2
                className="text-xs font-medium uppercase tracking-wider mb-3"
                style={{ color: 'rgba(212, 175, 55, 0.5)' }}
              >
                Dine samtalar
              </h2>
              {conversations.length > 0 ? (
                <div className="space-y-2">
                  {conversations.slice(0, 6).map((convo) => (
                    <ConversationCard key={convo.id} convo={convo} />
                  ))}
                </div>
              ) : (
                <EmptyState text="Når du startar ein samtale, dukkar han opp her." />
              )}
            </section>
          </div>

          {/* Høgre kolonne: Innsikt + Profil */}
          <div className="space-y-6">
            {/* Innsikt og refleksjon */}
            <section>
              <h2
                className="text-xs font-medium uppercase tracking-wider mb-3"
                style={{ color: 'rgba(212, 175, 55, 0.5)' }}
              >
                Innsikt og refleksjon
              </h2>
              <InsightSection insights={insights} />
            </section>

            {/* Profil og reise */}
            <section>
              <h2
                className="text-xs font-medium uppercase tracking-wider mb-3"
                style={{ color: 'rgba(212, 175, 55, 0.5)' }}
              >
                Profil og reise
              </h2>
              {profile ? (
                <ProfileStatusSection profile={profile} />
              ) : (
                <div
                  className="p-5 rounded-2xl"
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.04)',
                  }}
                >
                  <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.3)' }}>
                    Last opp profilen din for å sjå status.
                  </p>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ====== EmptyState ====== */

function EmptyState({ text }: { text: string }) {
  return (
    <div
      className="p-5 rounded-2xl text-center"
      style={{
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.04)',
      }}
    >
      <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.3)' }}>
        {text}
      </p>
    </div>
  );
}

/* ====== Metadata ====== */

export const metadata = {
  title: 'Min side — ToSom',
  description: 'Din rolige oversikt over matcher, samtaler og reise.',
};