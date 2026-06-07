import { useEffect, useState } from "react";

export interface NotificationMessage {
  id: string;
  content: string;
  createdAt: string;
}

export default function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<NotificationMessage[]>([]);

  async function load() {
    const res = await fetch("/api/system/messages");
    const data = await res.json();
    setMessages(data);
  }

  async function markRead() {
    await fetch("/api/system/mark-read", { method: "POST" });
  }

  useEffect(() => {
    if (open) {
      load();
      markRead();
    }
  }, [open]);

  return (
    <div className="relative">
      {/* Knapp */}
      <button
        onClick={() => setOpen(!open)}
        className="text-neutral-300 hover:text-white transition"
      >
        Varsler
      </button>

      {/* Panel */}
      {open && (
        <div className="absolute right-0 mt-3 w-80 bg-[#1E2A38]/90 border border-[#CBAA7A]/20 rounded-xl p-4 shadow-xl backdrop-blur">
          <h3 className="text-lg font-light mb-3">Systemmeldinger</h3>

          {messages.length === 0 && (
            <p className="text-neutral-400 text-sm">
              Ingen meldinger akkurat nå.
            </p>
          )}

          <div className="flex flex-col gap-3 max-h-80 overflow-y-auto">
            {messages.map((m: NotificationMessage) => (
              <div
                key={m.id}
                className="bg-[#1E2A38]/60 border border-[#CBAA7A]/20 rounded-lg p-3"
              >
                <p className="text-neutral-200 text-sm">{m.content}</p>
                <p className="text-neutral-500 text-xs mt-1">
                  {new Date(m.createdAt).toLocaleString("no-NO")}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}