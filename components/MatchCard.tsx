"use client";

export default function MatchCard({ match }) {
  return (
    <div className="bg-white border border-[#CBAA7A]/20 rounded-xl shadow-sm p-6 space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold leading-tight text-[#1A1A1A]">
          {match.name}, {match.age}
        </h2>

        <span className="text-[#4A4A4A] text-xs leading-relaxed">
          {new Date(match.createdAt).toLocaleDateString("no-NO")}
        </span>
      </div>

      {/* Distance */}
      <p className="text-[#4A4A4A] text-xs leading-relaxed">
        {match.distance}
      </p>

      {/* Score */}
      <div className="leading-relaxed">
        <span className="text-[#1A1A1A] text-xs font-medium">
          <span className="text-[#4A4A4A] text-xs font-normal">Matchscore:</span> <span className="text-[#CBAA7A]">{match.score}%</span>
        </span>
      </div>

      {/* Breakdown */}
      <div className="space-y-4 text-[#1A1A1A] text-sm leading-relaxed">
        <p>
          <span className="font-medium text-[#1A1A1A]">Hvorfor dere passer:</span>{" "}
          <span className="text-[#4A4A4A]">{match.summary.whyGood}</span>
        </p>
        <p>
          <span className="font-medium text-[#1A1A1A]">Mulig utfordring:</span>{" "}
          <span className="text-[#4A4A4A]">{match.summary.challenge}</span>
        </p>
      </div>

      {/* Action */}
      <button
        onClick={() => (window.location.href = `/chat/${match.conversationId}`)}
        className="w-full rounded-full bg-[#CBAA7A] text-[#1A1A1A] py-3 text-sm font-medium hover:bg-[#CBAA7A]/90 transition border border-[#CBAA7A]"
      >
        Åpne chat
      </button>
    </div>
  );
}
