"use client";

const colors = {
  info: "bg-[#E7EEF4] text-[#2F3A45]",
  success: "bg-[#E6F3EC] text-[#2F4538]",
  warning: "bg-[#F7F1E3] text-[#4A3F2A]"
};

const icons = {
  info: "ℹ️",
  success: "✓",
  warning: "⚠️"
};

export default function SystemNotice({
  noticeText = "Systemet har en oppdatering til deg.",
  noticeType = "info",
}: {
  noticeText?: string;
  noticeType?: string;
}) {
  return (
    <div className={`rounded-md p-3 flex items-start gap-2 text-sm ${colors[noticeType as keyof typeof colors]}`}>
      <span className="text-base leading-none">{icons[noticeType as keyof typeof icons]}</span>
      <p className="text-sm leading-relaxed">{noticeText}</p>
    </div>
  );
}
