/**
 * SharedJournal — Couple's shared journal entries
 *
 * Usage:
 *   <SharedJournal
 *     entries={[
 *       { title: "Dagen i dag", content: "...", date: "...", mood: "happy" },
 *     ]}
 *     onAdd={handleAdd}
 *   />
 */

import Image from 'next/image';
import React from 'react';

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: Date | string;
  mood?: 'happy' | 'loving' | 'calm' | 'grateful' | 'reflective';
  author?: string;
  photo?: string;
}

export interface SharedJournalProps {
  entries: JournalEntry[];
  /** On add entry */
  onAdd?: () => void;
  /** On view entry */
  onView?: (entry: JournalEntry) => void;
  /** Entries per page */
  perPage?: number;
  /** Custom class */
  className?: string;
}

const moodEmoji: Record<string, string> = {
  happy: '😊',
  loving: '💕',
  calm: '🌙',
  grateful: '🙏',
  reflective: '💭',
};

const SharedJournal: React.FC<SharedJournalProps> = ({
  entries,
  onAdd,
  onView,
  perPage = 5,
  className = '',
}) => {
  const displayEntries = entries.slice(0, perPage);

  if (entries.length === 0) {
    return (
      <div className={`rounded-2xl border border-white/8 bg-ts-glass/50 backdrop-blur-xl p-8 text-center ${className}`}>
        <span className="text-3xl">📝</span>
        <p className="text-ts-text-subtle mt-3">Ingen journaloppføringar ennå</p>
        {onAdd && (
          <button onClick={onAdd} className="mt-4 px-4 py-2 rounded-xl bg-ts-gold text-ts-bg text-sm font-medium hover:bg-ts-gold/90 transition-all">
            Skriv første oppføring
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {displayEntries.map((entry) => (
        <div
          key={entry.id}
          onClick={() => onView?.(entry)}
          className="rounded-2xl border border-white/8 bg-ts-glass/50 backdrop-blur-xl p-5 cursor-pointer transition-all hover:bg-ts-glass hover:border-ts-gold/15"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {entry.mood && <span className="text-sm">{moodEmoji[entry.mood]}</span>}
                <span className="text-xs text-ts-text-subtle">
                  {new Date(entry.date).toLocaleDateString('no-NO', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
              <h4 className="text-sm font-semibold text-ts-primary">{entry.title}</h4>
              {entry.author && (
                <p className="text-xs text-ts-text-subtle mt-0.5">av {entry.author}</p>
              )}
            </div>
          </div>

          {/* Preview */}
          <p className="text-xs text-ts-text-secondary leading-relaxed line-clamp-3">
            {entry.content}
          </p>

          {/* Photo thumbnail */}
          {entry.photo && (
            <div className="mt-3 relative w-20 h-20">
              <Image src={entry.photo} alt="" fill className="rounded-xl object-cover border border-white/8" />
            </div>
          )}
        </div>
      ))}

      {/* Add button */}
      {onAdd && (
        <button
          onClick={onAdd}
          className="w-full rounded-2xl border border-dashed border-white/10 bg-ts-glass/30 p-4 text-center text-sm text-ts-text-subtle hover:border-ts-gold/30 hover:text-ts-gold transition-all"
        >
          + Ny journaloppføring
        </button>
      )}
    </div>
  );
};

SharedJournal.displayName = 'SharedJournal';
export default SharedJournal;