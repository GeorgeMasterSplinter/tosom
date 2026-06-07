"use client";

export default function MatchActions({ targetUserId }) {
  async function send(decision) {
    await fetch("/api/match/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetUserId, decision }),
    });
  }

  return (
    <div className="flex gap-4 mt-4">
      <button
        onClick={() => send("no")}
        className="px-6 py-2 rounded-full bg-neutral-200 text-neutral-700"
      >
        Nei
      </button>

      <button
        onClick={() => send("yes")}
        className="px-6 py-2 rounded-full bg-[#CBAA7A] text-black"
      >
        Ja
      </button>
    </div>
  );
}
