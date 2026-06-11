"use client";

import { useState } from "react";

export default function ProfileView({ profile }: { profile: any }) {
  const [isMatching, setIsMatching] = useState(false);
  const [hasMatched, setHasMatched] = useState(false);

  const alleInteresser = [
    ...(profile.hobbyTags ?? []),
    ...(profile.musicTags ?? []),
  ];

  return (
    <main className="min-h-screen bg-gray-950">
      <div className="max-w-xl mx-auto py-10 space-y-10">
        {/* Sekjon: Oversikt */}
        <section className="text-center space-y-3">
          <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-gray-800 ring-1 ring-white/10">
            {profile.imageUrl ? (
              <img
                src={profile.imageUrl}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-600 text-4xl font-light">
                {(profile.name ?? "U")[0].toUpperCase()}
              </div>
            )}
          </div>

          <div>
            <h1 className="text-3xl font-light text-white">
              {profile.name}
            </h1>
            {profile.age && (
              <p className="text-gray-400 mt-1">{profile.age} år</p>
            )}
          </div>

          {profile.location && (
            <p className="text-gray-500 text-sm">{profile.location}</p>
          )}
        </section>

        {/* Seksjon: Om meg */}
        <section>
          <h2 className="text-lg font-medium text-white">Om meg</h2>
          {profile.bio ? (
            <p className="text-gray-300 leading-relaxed mt-3">
              {profile.bio}
            </p>
          ) : (
            <p className="text-gray-500 mt-3">Ingen beskrivelse ennå.</p>
          )}
        </section>

        {/* Seksjon: Interesser */}
        <section>
          <h2 className="text-lg font-medium text-white">Interesser</h2>
          {alleInteresser.length > 0 ? (
            <div className="flex flex-wrap gap-2 mt-3">
              {alleInteresser.map((tag: string) => (
                <span
                  key={tag}
                  className="inline-block rounded-full px-3 py-1 bg-white/10 text-gray-200 border border-white/10 backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mt-3">Ingen interesser lagt inn ennå.</p>
          )}
        </section>

        {/* Seksjon: Bilder */}
        <section>
          <h2 className="text-lg font-medium text-white">Bilder</h2>
          {profile.images && profile.images.length > 1 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {profile.images.slice(1).map((img: any) => (
                <div
                  key={img.id}
                  className="rounded-xl shadow-md shadow-black/20 overflow-hidden aspect-[4/5]"
                >
                  <img
                    src={img.url}
                    alt="Profilbilde"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mt-3">Ingen bilder ennå.</p>
          )}
        </section>

        {/* Seksjon: Handlingar */}
        <section className="flex gap-4">
          <button
            type="button"
            disabled={isMatching || hasMatched}
            onClick={async () => {
              setIsMatching(true);
              setHasMatched(true);
              try {
                await fetch("/api/match", {
                  method: "POST",
                  body: JSON.stringify({ targetUserId: profile.id }),
                });
              } catch {
                setHasMatched(false);
              }
              setIsMatching(false);
            }}
            className="flex-1 py-3 bg-white text-gray-950 rounded-full text-sm font-medium transition-colors hover:bg-gray-100 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {hasMatched ? "Matcha" : isMatching ? "Matcher…" : "Match"}
          </button>

          <button
            type="button"
            className="flex-1 py-3 border border-white/20 text-white rounded-full text-sm font-medium transition-colors hover:bg-white/10 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send melding
          </button>
        </section>
      </div>
    </main>
  );
}
