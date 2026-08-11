/**
 * ToSom UI 5.0 — Matching Page
 * 
 * Viser alle matcher for brukaren, sortert etter score.
 * Premium styling med glassmorphism, glow og gull-aksentar.
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Footer } from '@/components/ui/layout/Footer';
import { QuickMatchCard as MatchCard } from '@/components/QuickMatchCard';

interface MatchData {
  id?: string;
  score: number;
  otherUser?: {
    name?: string | null;
    age?: number | null;
    photoUrl?: string | null;
  };
  type?: string;
  explanation?: Record<string, unknown> | null;
  isTopMatch?: boolean;
  status?: string;
}

export default function MatchingPage() {
  const router = useRouter();
   const [matches, setMatches] = useState<MatchData[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [processing, setProcessing] = useState<string | null>(null);

   // Guiding-text per match-steg
   const guidingText = loading
     ? 'Vi jobber med å finne noen som passer deg.'
     : matches.length > 0
     ? 'Vi har funnet noen som kan passe deg.'
     : 'Vi gir oss ikke – vi leter videre.';

   const trustText = matches.length > 0
     ? 'Du kan endre preferansene dine når som helst.'
     : 'Dette brukes kun til å finne en god match.';

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/match', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          throw new Error('Kunne ikke hente matcher');
        }

        const data = await response.json();
        setMatches(data.matches || []);
      } catch (err) {
        console.error('Feil ved henting av matcher:', err);
        setError('Kunne ikke hente matcher. Prøv igjen seinare.');
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

   const handleAccept = async (match: MatchData) => {
     if (processing) return;
     setProcessing(match.id || 'accept');

     try {
        const response = await fetch('/api/match/accept', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ matchId: match.id }),
        });

       const data = await response.json();

       if (!response.ok) {
         setError(data.error || 'Hmm… dette gikk ikke helt som planlagt. Prøv igjen.');
         return;
       }

       // Oppdater match-status i UI
       setMatches(prev => prev.map(m =>
         m.id === match.id ? { ...m, status: data.status } : m
       ));

        if (data.status === 'matched') {
          // Begge har akseptert → redirect til chat
          if (data.conversationId) {
            router.push(`/chat/${data.conversationId}`);
          } else {
            alert(data.message || 'Dere er nå låste saman i 30 dager.');
          }
        }
     } catch (err) {
       setError('Kan du prøve igjen?');
     } finally {
       setProcessing(null);
     }
   };

   const handleDecline = async (match: MatchData) => {
     if (processing) return;
     setProcessing(match.id || 'decline');

     try {
        const response = await fetch('/api/match/accept', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ matchId: match.id }),
        });

       const data = await response.json();

       if (!response.ok) {
         setError('Hmm… dette gikk ikke helt som planlagt. Prøv igjen.');
         return;
       }

       // Fjern match frå liste
       setMatches(prev => prev.filter(m => m.id !== match.id));
     } catch (err) {
       setError('Vi gir oss ikke – vi leter videre.');
     } finally {
       setProcessing(null);
     }
   };

    const handleSeeMatch = async (match: MatchData) => {
      if (!match.id) return;
      router.push(`/matching/${match.id}`);
    };

   const handleRefresh = async () => {
     try {
       setLoading(true);
       setError(null);
        const response = await fetch('/api/match', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
       const data = await response.json();
       setMatches(data.matches || []);
     } catch (err) {
       setError('Vi jobber med å fikse dette. Prøv igjen om litt.');
     } finally {
       setLoading(false);
     }
   };

  return (
    <>
      {/* Animasjonar */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .match-card-enter {
          animation: fadeUp 0.5s ease-out both;
        }
        @keyframes pulseGlow {
          0%, 100% { filter: drop-shadow(0 0 8px rgba(212,175,55,0.3)); }
          50% { filter: drop-shadow(0 0 20px rgba(212,175,55,0.55)); }
        }
        .pulse-icon { animation: pulseGlow 2.5s infinite ease-in-out; }
      `}</style>

      <div className="min-h-screen relative" style={{ background: 'linear-gradient(180deg, #0E1218 0%, #1A1F26 100%)' }}>
        {/* Ambient glow */}
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            background: `
              radial-gradient(ellipse 60% 50% at 50% 30%, rgba(212,175,55,0.06), transparent 70%),
              radial-gradient(ellipse 80% 60% at 30% 70%, rgba(80,120,255,0.05), transparent 65%),
              linear-gradient(180deg, #0E1218 0%, #1A1F26 100%)
            `,
          }}
        />

        <main className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 py-20">
          {/* Guiding-text */}
          <div className="text-center mb-6">
            <p
              className="text-lg leading-relaxed"
              style={{ color: 'rgba(255, 255, 255, 0.75)' }}
            >
              {guidingText}
            </p>
          </div>

          {/* Seksjonstittel */}
          <div className="text-center mb-16">
            <span
              className="text-xs uppercase tracking-[0.3em] font-semibold mb-4 block"
              style={{ color: '#D4AF37' }}
            >
              Dine matcher
            </span>
            <h1
              className="text-3xl md:text-[42px] font-semibold tracking-[-0.02em] text-white leading-[1.1] mb-4"
            >
              {loading ? 'Søker etter din match...' : 'Dine matcher'}
            </h1>
            <p
              className="text-base md:text-lg max-w-lg mx-auto leading-[1.6]"
              style={{ color: 'rgba(255, 255, 255, 0.55)' }}
            >
              {loading
                ? 'Vi samanlikner profilen din med andre brukarar...'
                : matches.length > 0
                ? `Du har ${matches.length} potentielle match${matches.length > 1 ? 'r' : ''} basert på dykkar profil.`
                : 'Vi gir oss ikke – vi leter videre.'}
            </p>
          </div>

          {/* Loading-state */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 gap-6">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center pulse-icon"
                style={{
                  background: 'rgba(212, 175, 55, 0.12)',
                  border: '2px solid rgba(212, 175, 55, 0.25)',
                  color: '#D4AF37',
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L15 8L21 9L16.5 14L18 21L12 17.5L6 21L7.5 14L3 9L9 8L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-gray-400 text-sm">Søker etter din perfekte match...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex flex-col items-center justify-center py-24 gap-6">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                  background: 'rgba(255,77,77,0.1)',
                  border: '2px solid rgba(255,77,77,0.25)',
                  color: '#FF4D4D',
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 12V16M12 8H12.01M3 12C3 7.03 7.03 3 12 3C16.97 3 21 7.03 21 12C21 16.97 16.97 21 12 21C7.03 21 3 16.97 3 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-gray-400 text-sm">{error}</p>
              <button
                onClick={handleRefresh}
                className="px-8 py-3 rounded-xl text-sm font-medium transition-all duration-300"
                style={{
                  background: '#D4AF37',
                  color: '#0B0E11',
                  boxShadow: '0 0 25px rgba(212,175,55,0.3), 0 4px 12px rgba(0,0,0,0.2)',
                  border: '1px solid rgba(212,175,55,0.5)',
                }}
              >
                Prøv igjen
              </button>
            </div>
          )}

           {/* Match-grid */}
           {!loading && !error && matches.length > 0 && (
             <>
               {/* Trust-text */}
               <div className="text-center mb-8">
                 <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.55)' }}>
                   {trustText}
                 </p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                 {matches.map((match, index) => (
                   <div
                     key={`match-${index}`}
                     className="match-card-enter"
                     style={{ animationDelay: `${index * 0.08}s` }}
                   >
                     <MatchCard
                       score={match.score}
                       otherUser={match.otherUser}
                       type={match.type}
                       explanation={match.explanation}
                       highlight={index === 0}
                       onSeeMatch={() => handleSeeMatch(match)}
                       onAccept={() => handleAccept(match)}
                     />
                   </div>
                 ))}
               </div>

               {/* Action-knappar under card */}
               <div className="mt-8 flex gap-4 justify-center">
               <button
                 onClick={() => handleAccept(matches[0])}
                 disabled={processing !== null}
                 className="px-8 py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-[1.015]"
                 style={{
                   background: processing ? 'rgba(212,175,55,0.3)' : '#D4AF37',
                   color: '#0B0E11',
                   boxShadow: processing ? 'none' : '0 0 25px rgba(212,175,55,0.3), 0 4px 12px rgba(0,0,0,0.2)',
                   border: 'none',
                   cursor: processing ? 'not-allowed' : 'pointer',
                   opacity: processing ? 0.6 : 1,
                 }}
               >
                 {processing === matches[0]?.id ? 'Aksepterer...' : 'Se matchen din'}
               </button>
               <button
                 onClick={() => handleDecline(matches[0])}
                 disabled={processing !== null}
                 className="px-8 py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-[1.015]"
                 style={{
                   background: processing ? 'rgba(255,77,77,0.1)' : 'transparent',
                   color: 'rgba(255,255,255,0.4)',
                   border: '1px solid rgba(255,77,77,0.2)',
                   cursor: processing ? 'not-allowed' : 'pointer',
                   opacity: processing ? 0.6 : 1,
                 }}
               >
                 {processing === matches[0]?.id ? 'Avslåer...' : 'Gå tilbake'}
               </button>
               </div>
             </>
           )}

             {/* Empty-state */}
             {!loading && !error && matches.length === 0 && (
               <div className="flex flex-col items-center justify-center py-24 gap-6 fade-in">
                 <div
                   className="w-20 h-20 rounded-2xl flex items-center justify-center"
                   style={{
                     background: 'rgba(212,175,55,0.06)',
                     border: '1px solid rgba(212,175,55,0.15)',
                     color: 'rgba(212,175,55,0.4)',
                   }}
                 >
                   <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                     <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                   </svg>
                 </div>
                 <p className="text-base font-medium" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                   Vi gir oss ikke – vi leter videre.
                 </p>
                 <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                   Dette kan ta litt tid. I mellomtiden kan du oppdatere preferansene dine.
                 </p>
                  {/* Self-loop fixed: no longer redirects to /matching. 
                      Instead, guide the user to profile editing or waiting. */}
               </div>
             )}
        </main>

        <Footer />
      </div>
    </>
  );
}