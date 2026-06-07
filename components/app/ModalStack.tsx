"use client";

/** ModalStack.tsx — render modalane i modalStack-arrayen
 *  NS7/17
 *  overlay + backdrop-blur, stable z-index, smooth fade-in */

import { useMemo } from "react";
import type { ModalEntry } from "../../lib/app/navigationState";

/* ── Props ── */
interface ModalStackProps {
  stack: ModalEntry[];
  onClose: () => void;
  onReset: () => void;
}

/* ── Hjelp: modal-innhald basert på type ── */
function ModalContent({ entry }: { entry: ModalEntry }) {
  const { type, props } = entry;
  const p = props || {};

  switch (type) {
    case "partner_profile":
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-[#4A4A4A]">{p.title || "Partnerprofil"}</h3>
          <p className="text-sm text-[#4A4A4A]/60">Her vil partnerprofil-visninga koma.</p>
          {p.onClose && typeof p.onClose === "function" ? (
            <button onClick={p.onClose} className="px-5 py-2 text-xs rounded-xl bg-white border border-[#e2e8f0] text-[#4A4A4A]/60 hover:bg-[#f8fafc] transition-colors">← Lukk</button>
          ) : null}
        </div>
      );
    case "user_profile":
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-[#4A4A4A]">{p.title || "Min profil"}</h3>
          <p className="text-sm text-[#4A4A4A]/60">Her vil din eigen profil-visninga koma.</p>
          {p.onClose && typeof p.onClose === "function" ? (
            <button onClick={p.onClose} className="px-5 py-2 text-xs rounded-xl bg-white border border-[#e2e8f0] text-[#4A4A4A]/60 hover:bg-[#f8fafc] transition-colors">← Lukk</button>
          ) : null}
        </div>
      );
    case "info":
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-[#4A4A4A]">{p.title || "Info"}</h3>
          <p className="text-sm text-[#4A4A4A]/60">{p.message || "Ingen informasjon."}</p>
          {p.onClose && typeof p.onClose === "function" ? (
            <button onClick={p.onClose} className="px-5 py-2 text-xs rounded-xl bg-white border border-[#e2e8f0] text-[#4A4A4A]/60 hover:bg-[#f8fafc] transition-colors">← Lukk</button>
          ) : null}
        </div>
      );
    case "confirm":
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-[#4A4A4A]">{p.title || "Bekreft"}</h3>
          <p className="text-sm text-[#4A4A4A]/60">{p.message || "Er du sikker?"}</p>
          <div className="flex gap-3">
            {p.onConfirm && typeof p.onConfirm === "function" ? (
              <button onClick={p.onConfirm} className="px-5 py-2 text-xs rounded-xl bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors font-medium">Bekreft</button>
            ) : null}
            {p.onClose && typeof p.onClose === "function" ? (
              <button onClick={p.onClose} className="px-5 py-2 text-xs rounded-xl bg-white border border-[#e2e8f0] text-[#4A4A4A]/60 hover:bg-[#f8fafc] transition-colors">Avbryt</button>
            ) : null}
          </div>
        </div>
      );
    default:
      return (
        <div className="space-y-4">
          <p className="text-sm text-[#4A4A4A]/60">Modal av typen «{type}» er ikkje implementert enno.</p>
          {p.onClose && typeof p.onClose === "function" ? (
            <button onClick={p.onClose} className="px-5 py-2 text-xs rounded-xl bg-white border border-[#e2e8f0] text-[#4A4A4A]/60 hover:bg-[#f8fafc] transition-colors">← Lukk</button>
          ) : null}
        </div>
      );
  }
}

export default function ModalStack({ stack, onClose, onReset }: ModalStackProps) {
  const rendered = useMemo(
    () =>
      stack.map((entry, idx) => {
        const depth = idx;
        const isTop = idx === stack.length - 1;
        return (
          <div
            key={`${entry.type}-${idx}`}
            className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
              isTop
                ? "opacity-100 scale-100 z-50"
                : "opacity-0 scale-95 -z-10 pointer-events-none"
            }`}
            style={{ transitionDuration: `${150 + depth * 50}ms` }}
          >
            {/* backdrop-blur overlay */}
            <div
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
              onClick={isTop ? onClose : undefined}
            />
            {/* modal card */}
            <div
              className={`relative bg-white rounded-2xl shadow-2xl px-8 py-6 max-w-sm w-full mx-4 transition-transform duration-300 ${
                isTop ? "translate-y-0" : "translate-y-4"
              }`}
            >
              <ModalContent entry={entry} />
            </div>
          </div>
        );
      }),
    [stack, onClose]
  );

  if (stack.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50">
      {rendered}
    </div>
  );
}
