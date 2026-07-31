/* ═══════════════════════════════════════════
   ToSom — Shared Memories
   Grid layout for felles minner med glassmorphism
   ═══════════════════════════════════════════ */

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { isFlagEnabled } from "@/utils/flags";

interface Memory {
  id?: string;
  conversationId: string;
  imageUrl?: string;
  note?: string;
  date: string;
  tags: string[];
  createdAt?: string;
}

interface MemoriesProps {
  conversationId: string;
  variant?: "compact" | "grid";
}

export function Memories({ conversationId, variant = "grid" }: MemoriesProps) {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  const hasAccess = isFlagEnabled("enableSharedMemories");

  useEffect(() => {
    if (!hasAccess) return;
    fetchMemories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchMemories() {
    try {
      const res = await fetch(`/api/relationship/memories?conversationId=${conversationId}`);
      if (res.ok) {
        const data = await res.json();
        setMemories(data.memories);
      }
    } catch {
      /* Silently fail */
    } finally {
      setLoading(false);
    }
  }

  async function addMemory(memoryData: Omit<Memory, "id" | "createdAt">) {
    const res = await fetch("/api/relationship/memories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(memoryData),
    });
    if (res.ok) {
      fetchMemories();
      setShowAddForm(false);
    }
  }

  if (!hasAccess) return null;

  return (
    <div className={variant === "compact" ? "space-y-2" : "space-y-4"}>
      {/* Header */}
      {variant === "grid" && (
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-white">Felles Minner</h3>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="text-sm text-[var(--ts-gold)] hover:text-[var(--ts-gold-hover)] transition-colors"
          >
            {showAddForm ? "Lukk" : "+ Legg til minne"}
          </button>
        </div>
      )}

      {/* Add Memory Form */}
      {showAddForm && (
        <AddMemoryForm onSubmit={addMemory} onCancel={() => setShowAddForm(false)} />
      )}

      {/* Loading State */}
      {loading ? (
        <div className="text-center text-white/40 py-8">Laster minner...</div>
      ) : memories.length === 0 ? (
        <div className="text-center text-white/30 py-12">
          <p className="text-sm">Ingen minner ennå.</p>
          <p className="text-xs text-white/20 mt-1">Del deres første øyeblikk!</p>
        </div>
      ) : variant === "grid" ? (
        /* Grid Layout */
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {memories.map((memory) => (
            <MemoryCard key={memory.id || memory.date} memory={memory} />
          ))}
        </div>
      ) : (
        /* Compact List */
        <div className="space-y-2">
          {memories.map((memory) => (
            <MemoryCompact key={memory.id || memory.date} memory={memory} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------- */
/*  MemoryCard (grid view)                                    */
/* ---------------------------------------------------------- */

function MemoryCard({ memory }: { memory: Memory }) {
  return (
    <div
      className="group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:scale-[1.02]"
      style={{ background: "rgba(255, 255, 255, 0.04)" }}
    >
      {memory.imageUrl ? (
        <div className="relative w-full h-40">
          <Image
            src={memory.imageUrl}
            alt={memory.note || "Minne"}
            fill
            className="object-cover"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="w-full h-32 flex items-center justify-center" style={{ background: "rgba(255, 255, 255, 0.03)" }}>
          <span className="text-3xl">📸</span>
        </div>
      )}
      {memory.note && (
        <div className="p-3">
          <p className="text-sm text-white/80 line-clamp-2">{memory.note}</p>
          <p className="text-xs text-white/40 mt-1">
            {new Date(memory.date).toLocaleDateString("no-NO")}
          </p>
        </div>
      )}
      {/* Hover overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: "rgba(11, 14, 17, 0.5)" }}
      >
        <div className="absolute bottom-2 right-2">
          <span className="text-xs text-[var(--ts-gold)] bg-[rgba(212,175,55,0.15)] px-2 py-1 rounded">
            Se detaljer
          </span>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------- */
/*  MemoryCompact (list view)                                 */
/* ---------------------------------------------------------- */

function MemoryCompact({ memory }: { memory: Memory }) {
  return (
    <div
      className="flex items-center gap-3 p-2 rounded-lg"
      style={{ background: "rgba(255, 255, 255, 0.02)" }}
    >
      {memory.imageUrl ? (
        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
          <Image src={memory.imageUrl} alt="" fill className="object-cover" />
        </div>
      ) : (
        <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,255,255,0.04)" }}>
          <span className="text-lg">📸</span>
        </div>
      )}
      <div className="flex-1 min-w-0">
        {memory.note && (
          <p className="text-sm text-white/80 truncate">{memory.note}</p>
        )}
        <p className="text-xs text-white/40">
          {new Date(memory.date).toLocaleDateString("no-NO")}
        </p>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------- */
/*  AddMemoryForm                                             */
/* ---------------------------------------------------------- */

function AddMemoryForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: Omit<Memory, "id" | "createdAt">) => Promise<void>;
  onCancel: () => void;
}) {
  const [note, setNote] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!date) return;
    await onSubmit({
      conversationId: "",
      date: new Date(date).toISOString(),
      note: note || undefined,
      imageUrl: imageUrl || undefined,
      tags: [],
    });
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 rounded-xl" style={{ background: "rgba(255, 255, 255, 0.06)" }}>
      <h4 className="text-sm font-medium text-white mb-3">Legg til minne</h4>
      <div className="space-y-3">
        <textarea
          placeholder="Hva skjedde? (valgfritt)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full px-3 py-2 rounded-lg text-sm bg-transparent border border-white/10 text-white placeholder-white/40 focus:border-[var(--ts-gold)] focus:ring-1 focus:ring-[var(--ts-gold)]/30 outline-none transition-all resize-none"
          rows={2}
        />
        <input
          type="text"
          placeholder="Bilde URL (valgfritt)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full px-3 py-2 rounded-lg text-sm bg-transparent border border-white/10 text-white placeholder-white/40 focus:border-[var(--ts-gold)] focus:ring-1 focus:ring-[var(--ts-gold)]/30 outline-none transition-all"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-white focus:border-[var(--ts-gold)] outline-none"
          required
        />
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

export default Memories;