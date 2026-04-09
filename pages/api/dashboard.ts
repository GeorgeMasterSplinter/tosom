import { useEffect, useState } from "react";
import Link from "next/link";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return <div className="p-6 text-neutral-400">Laster…</div>;

  const { journey, matches } = data;

  return (
    <div className="p-6 space-y-8 text-white bg-neutral-950 min-h-screen">

      {/* Journey status */}
      {journey && (
        <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-800">
          <h2 className="text-lg font-semibold mb-2">Din reise</h2>
          <p className="text-neutral-400 mb-4">
            Du er på dag {journey.day} av 8.
          </p>
          <Link
            href="/onboarding"
            className="bg-blue-600 px-4 py-2 rounded-lg inline-block"
          >
            Fortsett reisen
          </Link>
        </div>
      )}

      {/* Matches */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Dine matcher</h2>

        {matches.length === 0 && (
          <div className="text-neutral-400">
            Ingen matcher ennå. Vi jobber med saken.
          </div>
        )}

        {matches.map((m) => {
          const chatLocked = new Date(m.chatUntil) < new Date();
          const decisionPhase = new Date(m.decideUntil) < new Date();

          return (
            <div
              key={m.id}
              className="bg-neutral-900 p-4 rounded-xl border border-neutral-800"
            >
              <div className="flex justify-between items-center mb-3">
                <div>
                  <div className="text-lg font-semibold">
                    {m.matchUser.profile.name}
                  </div>
                  <div className="text-neutral-400 text-sm">
                    Matchscore: {m.score}
                  </div>
                </div>

                {!decisionPhase && !chatLocked && (
                  <Link
                    href={`/chat/${m.id}`}
                    className="bg-blue-600 px-4 py-2 rounded-lg"
                  >
                    Åpne chat
                  </Link>
                )}
              </div>

              {/* Breakdown */}
              <div className="grid grid-cols-2 gap-2 text-sm text-neutral-400">
                <div>Base: {m.breakdown.base}</div>
                <div>Deep: {m.breakdown.deep}</div>
                <div>Resonans: {m.breakdown.resonance}</div>
                <div>Semantikk: {m.breakdown.semantic}</div>
              </div>

              {/* Timers */}
              <div className="mt-3 text-xs text-neutral-500">
                Chat til: {new Date(m.chatUntil).toLocaleDateString()}
                <br />
                Beslutning til: {new Date(m.decideUntil).toLocaleDateString()}
              </div>

              {/* Chat locked */}
              {chatLocked && (
                <div className="mt-2 text-xs text-red-400">
                  Chatten er avsluttet.
                </div>
              )}

            </div>
          );
        })}
      </div>
    </div>
  );
}
