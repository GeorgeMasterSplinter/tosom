"use client";

const colors = {
  not_started: "bg-[#F7F1E3] text-[#4A4A4A]",
  in_progress: "bg-[#E7EEF4] text-[#2F3A45]",
  completed: "bg-[#E6F3EC] text-[#2F4538]"
};

const icons = {
  not_started: "🌱",
  in_progress: "⏳",
  completed: "✨"
};

export default function JourneySummary({
  journeyText = "Du er på vei gjennom dag‑reisen din. Fortsett når du er klar.",
  journeyStatus = "in_progress",
}: {
  journeyText?: string;
  journeyStatus?: string;
}) {
  const progressMap = {
    not_started: 0,
    in_progress: 50,
    completed: 100
  };

  return (
    <div
      className={`${colors[journeyStatus as keyof typeof colors]} border border-[#CBAA7A]/30 rounded-xl p-4 text-sm leading-relaxed cursor-pointer hover:bg-opacity-95`}
    >
      <div className="flex gap-2">
        <span className="text-base leading-none">{icons[journeyStatus as keyof typeof icons]}</span>
        <p>{journeyText}</p>
      </div>
      <div className="mt-3 rounded-full h-1.5 bg-[#000000]/10 overflow-hidden">
        <div
          className="h-full bg-[#4A3F2A]/40 rounded-full"
          style={{ width: `${progressMap[journeyStatus as keyof typeof progressMap]}%` }}
        />
      </div>
    </div>
  );
}
