"use client";

import { type SystemMessage } from "../../lib/system/systemMessages";

/** SystemMessageBox – viser systemets varme meldinger
 *  TODO: Her kan vi vise flere meldinger dynamisk senere. */

const icons: Record<SystemMessage["level"], string> = {
  info: "ℹ️",
  success: "✓",
  warning: "⚠️",
};

const bgColors: Record<SystemMessage["level"], string> = {
  info: "bg-[#E7EEF4]/80",
  success: "bg-[#E6F3EC]/80",
  warning: "bg-[#F7F1E3]/80",
};

export default function SystemMessageBox({
  messages,
}: {
  messages?: SystemMessage[];
}) {
  if (!messages || messages.length === 0) return null;

  return (
    <div className="bg-white/60 shadow-[0_1px_3px_rgba(0,0,0,0.03)] rounded-xl p-4 space-y-3">
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={`${bgColors[msg.level]} rounded-lg p-3 hover:bg-opacity-95 transition-colors`}
        >
          <div className="flex items-start gap-2">
            <span className="text-base leading-none flex-shrink-0">
              {icons[msg.level]}
            </span>
            <div className="space-y-1">
              <p className="text-sm font-medium text-[#2F3A45]">
                {msg.title}
              </p>
              <p className="text-sm leading-relaxed text-[#4A4A4A]">
                {msg.body}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
