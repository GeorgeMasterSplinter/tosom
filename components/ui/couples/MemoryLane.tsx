/**
 * MemoryLane — Couple's shared memory lane (photo timeline)
 *
 * Usage:
 *   <MemoryLane
 *     memories={[
 *       { title: "Første reise", photo: "...", date: "..." },
 *     ]}
 *   />
 */

import Image from 'next/image';
import React from 'react';

export interface Memory {
  id: string;
  title: string;
  photo?: string;
  date: Date | string;
  description?: string;
  favorites?: number;
}

export interface MemoryLaneProps {
  memories: Memory[];
  /** On add memory */
  onAdd?: () => void;
  /** On view memory */
  onView?: (memory: Memory) => void;
  /** Custom class */
  className?: string;
}

const MemoryLane: React.FC<MemoryLaneProps> = ({ memories, onAdd, onView, className = '' }) => {
  if (memories.length === 0) {
    return (
      <div className={`rounded-2xl border border-white/8 bg-ts-glass/50 backdrop-blur-xl p-8 text-center ${className}`}>
        <span className="text-3xl">📸</span>
        <p className="text-ts-text-subtle mt-3">Inga minne ennå</p>
        {onAdd && (
          <button onClick={onAdd} className="mt-4 px-4 py-2 rounded-xl bg-ts-gold text-ts-bg text-sm font-medium hover:bg-ts-gold/90 transition-all">
            Legg til første minne
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {memories.map((memory) => (
        <div
          key={memory.id}
          onClick={() => onView?.(memory)}
          className="rounded-2xl border border-white/8 bg-ts-glass/50 backdrop-blur-xl overflow-hidden cursor-pointer transition-all hover:bg-ts-glass hover:scale-[1.01]"
        >
          {/* Photo */}
          {memory.photo ? (
            <div className="relative w-full h-40">
              <Image src={memory.photo} alt={memory.title} fill className="object-cover" />
            </div>
          ) : (
            <div className="w-full h-40 bg-gradient-to-br from-ts-gold/15 via-ts-purple/10 to-transparent flex items-center justify-center">
              <span className="text-4xl">📸</span>
            </div>
          )}

          {/* Content */}
          <div className="p-4">
            <h4 className="text-sm font-semibold text-ts-primary">{memory.title}</h4>
            <p className="text-xs text-ts-text-subtle mt-1">
              {new Date(memory.date).toLocaleDateString('no-NO', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            {memory.description && (
              <p className="text-xs text-ts-text-secondary mt-2 line-clamp-2">{memory.description}</p>
            )}
            {memory.favorites && memory.favorites > 0 && (
              <div className="flex items-center gap-1 mt-2">
                <span className="text-xs text-ts-gold">❤️</span>
                <span className="text-[10px] text-ts-text-subtle">{memory.favorites}</span>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Add button */}
      {onAdd && (
        <button
          onClick={onAdd}
          className="rounded-2xl border border-dashed border-white/10 bg-ts-glass/30 flex items-center justify-center h-48 text-center text-sm text-ts-text-subtle hover:border-ts-gold/30 hover:text-ts-gold transition-all"
        >
          + Legg til minne
        </button>
      )}
    </div>
  );
};

MemoryLane.displayName = 'MemoryLane';
export default MemoryLane;