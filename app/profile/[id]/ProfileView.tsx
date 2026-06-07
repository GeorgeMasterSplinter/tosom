"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfileView({ profile }: { profile: any }) {
  const router = useRouter();
  const [isMatching, setIsMatching] = useState(false);
  const [hasMatched, setHasMatched] = useState(false);
  const [isOpeningChat, setIsOpeningChat] = useState(false);

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <section className="flex flex-col items-center text-center">
        <div className="w-40 h-40 rounded-full overflow-hidden bg-[#E5E5E5]">
          {profile.imageUrl ? (
            <img
              src={profile.imageUrl}
              alt={profile.name}
              className="w-full h-full object-cover"
            />
          ) : null}
        </div>

        <h1 className="text-3xl font-semibold text-[#1A1A1A] mt-6">
          {profile.name}, {profile.age}
        </h1>

        <p className="text-[#4A4A4A] mt-2 text-[15px]">
          {profile.location || "Ukjent sted"}
        </p>
      </section>

      {profile.images && profile.images.length > 1 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4 tracking-tight">
            Bilder
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {profile.images.slice(1).map((img: any) => (
              <div
                key={img.id}
                className="w-full h-40 rounded-lg overflow-hidden bg-[#E5E5E5]"
              >
                <img
                  src={img.url}
                  alt="Profilbilde"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mt-10">
        <div className="flex gap-4">
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
              } catch (err) {
                setHasMatched(false);
                console.error("Match failed", err);
              }
              setIsMatching(false);
            }}
            className="flex-1 py-3 bg-[#1A1A1A] text-white rounded-lg text-center text-[15px] font-medium transition-colors hover:bg-[#000] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {hasMatched ? "Matchet" : isMatching ? "Matcher…" : "Match"}
          </button>

          <button
            type="button"
            className="flex-1 py-3 border border-[#1A1A1A] text-[#1A1A1A] rounded-lg text-center text-[15px] font-medium transition-colors hover:bg-[#1A1A1A] hover:text-white active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send melding
          </button>
        </div>
      </section>

      <div className="space-y-10 mt-10">
        <section>
          <h2 className="text-xl font-semibold text-[#1A1A1A] tracking-tight">
            Om meg
          </h2>
          <p className="text-[#4A4A4A] leading-relaxed text-[15px] mt-3">
            {profile.bio}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#1A1A1A] tracking-tight">
            Hobbyer
          </h2>
          <div className="flex flex-wrap gap-2 mt-3">
            {profile.hobbyTags?.map((tag: string) => (
              <span
                key={tag}
                className="px-3 py-1 bg-[#F5F5F5] rounded-full text-sm text-[#333]"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#1A1A1A] tracking-tight">
            Musikk
          </h2>
          <div className="flex flex-wrap gap-2 mt-3">
            {profile.musicTags?.map((tag: string) => (
              <span
                key={tag}
                className="px-3 py-1 bg-[#F5F5F5] rounded-full text-sm text-[#333]"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
