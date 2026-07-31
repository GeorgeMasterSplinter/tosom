/* ═══════════════════════════════════════════
   ToSom — Relationship Timeline
   Vertikal timeline med relasjons-milepæler
   ═══════════════════════════════════════════ */

"use client";

import Image from 'next/image';
import { useState, useEffect } from "react";
import { isFlagEnabled } from "@/utils/flags";

interface TimelineEvent {
  id?: string;
  date: string;
  type: "match" | "first_message" | "first_meeting" | "milestone" | "journey_complete" | "custom";
  title: string;
  description?: string;
  imageUrl?: string;
}

interface TimelineProps {
  conversationId: string;
  variant?: "compact" | "full";
}

const eventIcons: Record<string, string> = {
  match: "💛",
  first_message: "💬",
  first_meeting: "🤝",
  milestone: "🏆",
  journey_complete: "✨",
  custom: "📌",
};

const eventColors: Record<string, string> = {
  match: "rgba(212, 175, 55, 0.3)",
  first_message: "rgba(100, 180, 255, 0.3)",
  first_meeting: "rgba(255, 120, 120, 0.3)",
  milestone: "rgba(212, 175, 55, 0.5)",
  journey_complete: "rgba(100, 255, 180, 0.3)",
  custom: "rgba(255, 255, 255, 0.15)",
};

export function Timeline({ conversationId, variant = "full" }: TimelineProps) {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  const hasAccess = isFlagEnabled("enableRelationshipTimeline");

  useEffect(() => {
    if (!hasAccess) return;
    fetchTimeline();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchTimeline() {
    try {
      const res = await fetch(`/api/relationship/timeline?conversationId=${conversationId}`);
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events);
      }
    } catch {
      /* Silently fail */
    } finally {
      setLoading(false);
    }
  }

  async function addEvent(eventData: Omit<TimelineEvent, "createdAt" | "id">) {
    const res = await fetch("/api/relationship/timeline", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventData),
    });
    if (res.ok) {
      fetchTimeline();
      setShowAddForm(false);
    }
  }

  if (!hasAccess) return null;

  const isCompact = variant === "compact";

  return (
    <div className={isCompact ? "space-y-3" : "space-y-4"}>
      {/* Header */}
      {!isCompact && (
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-white">Relasjonsreise</h3>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="text-sm text-[var(--ts-gold)] hover:text-[var(--ts-gold-hover)] transition-colors"
          >
            {showAddForm ? "Lukk" : "+ Legg til"}
          </button>
        </div>
      )}

      {/* Add Event Form */}
      {showAddForm && (
        <AddEventForm onSubmit={addEvent} onCancel={() => setShowAddForm(false)} />
      )}

      {/* Loading State */}
      {loading ? (
        <div className="text-center text-white/40 py-8">Laster timeline...</div>
      ) : (
        /* Timeline */
        <div className="relative">
          {/* Vertical Line */}
          {!isCompact && (
            <div
              className="absolute left-4 top-0 bottom-0 w-px"
              style={{ background: "rgba(255, 255, 255, 0.08)" }}
            />
          )}

          {/* Events */}
          <div className="space-y-4">
            {events.map((event, i) => (
              <TimelineEventItem
                key={event.id || i}
                event={event}
                variant={isCompact ? "compact" : "full"}
                showLine={!isCompact && i < events.length - 1}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------- */
/*  TimelineEventItem                                         */
/* ---------------------------------------------------------- */

function TimelineEventItem({
  event,
  variant,
  showLine,
}: {
  event: TimelineEvent;
  variant: "compact" | "full";
  showLine?: boolean;
}) {
  const date = new Date(event.date);
  const formattedDate = date.toLocaleDateString("no-NO", {
    day: "numeric",
    month: "long",
    year: date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
  });

  if (variant === "compact") {
    return (
      <div className="flex items-center gap-3 p-2 rounded-lg" style={{ background: "rgba(255, 255, 255, 0.02)" }}>
        <span className="text-sm">{eventIcons[event.type] || "📌"}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-white/80 truncate">{event.title}</p>
          <p className="text-xs text-white/40">{formattedDate}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex gap-4">
      {/* Icon */}
      <div
        className="relative z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm"
        style={{ background: eventColors[event.type] || eventColors.custom }}
      >
        {eventIcons[event.type] || "📌"}
      </div>

      {/* Content */}
      <div className="flex-1 pb-6">
        <div
          className="p-4 rounded-xl"
          style={{ background: "rgba(255, 255, 255, 0.04)" }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-[var(--ts-gold)] uppercase tracking-wide">{event.type}</span>
          </div>
          <h4 className="text-base font-medium text-white mb-1">{event.title}</h4>
          {event.description && (
            <p className="text-sm text-white/60">{event.description}</p>
          )}
          {event.imageUrl && (
            <div className="mt-3 rounded-lg w-full h-32 relative overflow-hidden">
              <Image
                src={event.imageUrl}
                alt={event.title}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          )}
        </div>
        <p className="text-xs text-white/40 mt-1 ml-1">{formattedDate}</p>
      </div>

      {/* Connector Line */}
      {showLine && (
        <div
          className="absolute left-4 top-8 w-px h-full"
          style={{ background: "rgba(255, 255, 255, 0.08)" }}
        />
      )}
    </div>
  );
}

/* ---------------------------------------------------------- */
/*  AddEventForm                                              */
/* ---------------------------------------------------------- */

function AddEventForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: Omit<TimelineEvent, "createdAt" | "id">) => Promise<void>;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("milestone");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !date) return;
    await onSubmit({ date: new Date(date).toISOString(), type: type as TimelineEvent["type"], title, description });
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 rounded-xl" style={{ background: "rgba(255, 255, 255, 0.06)" }}>
      <h4 className="text-sm font-medium text-white mb-3">Legg til milepæl</h4>
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Tittel"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 rounded-lg text-sm bg-transparent border border-white/10 text-white placeholder-white/40 focus:border-[var(--ts-gold)] focus:ring-1 focus:ring-[var(--ts-gold)]/30 outline-none transition-all"
          required
        />
        <textarea
          placeholder="Beskrivelse (valgfritt)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 rounded-lg text-sm bg-transparent border border-white/10 text-white placeholder-white/40 focus:border-[var(--ts-gold)] focus:ring-1 focus:ring-[var(--ts-gold)]/30 outline-none transition-all resize-none"
          rows={2}
        />
        <div className="flex gap-3">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-white focus:border-[var(--ts-gold)] outline-none"
          >
            <option value="match" className="bg-[#111418]">Match</option>
            <option value="first_message" className="bg-[#111418]">Første melding</option>
            <option value="first_meeting" className="bg-[#111418]">Første møte</option>
            <option value="milestone" className="bg-[#111418]">Milepæl</option>
            <option value="journey_complete" className="bg-[#111418]">Journey fullført</option>
            <option value="custom" className="bg-[#111418]">Egendefinert</option>
          </select>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-white focus:border-[var(--ts-gold)] outline-none"
            required
          />
        </div>
        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm text-white/60 hover:text-white transition-colors"
          >
            Avbryt
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm rounded-lg bg-[var(--ts-gold)] text-[#0B0E11] font-medium hover:bg-[var(--ts-gold-hover)] transition-colors"
          >
            Lagre
          </button>
        </div>
      </div>
    </form>
  );
}

export default Timeline;