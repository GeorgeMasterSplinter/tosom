"use client";

const colors = {
  neutral: "bg-[#F7F1E3] text-[#4A4A4A]",
  info: "bg-[#E7EEF4] text-[#2F3A45]",
  success: "bg-[#E6F3EC] text-[#2F4538]"
};

const icons = {
  neutral: "📝",
  info: "ℹ️",
  success: "✓"
};

export default function ReflectionBox({
  reflectionText = "Du har ei refleksjon tilgjengeleg i dag.",
  reflectionType = "neutral",
  onOpen
}: {
  reflectionText?: string;
  reflectionType?: string;
  onOpen?: () => void;
}) {
  return (
    <div
      className={`${colors[reflectionType as keyof typeof colors]} border border-[#CBAA7A]/30 rounded-xl p-4 text-sm leading-relaxed cursor-pointer hover:bg-opacity-95`}
      onClick={onOpen}
    >
      <div className="flex gap-2">
        <span className="text-base leading-none">{icons[reflectionType as keyof typeof icons]}</span>
        <p>{reflectionText}</p>
      </div>
    </div>
  );
}
