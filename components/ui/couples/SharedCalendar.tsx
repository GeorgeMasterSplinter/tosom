/**
 * SharedCalendar — Couple's shared event calendar
 *
 * Usage:
 *   <SharedCalendar
 *     events={[
 *       { title: "Date night", date: "2026-06-25", type: "date" },
 *     ]}
 *     onAddEvent={handleAdd}
 *   />
 */

import React from 'react';

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date | string;
  type: 'date' | 'milestone' | 'reminder' | 'birthday' | 'anniversary';
  color?: 'gold' | 'pink' | 'teal' | 'purple';
}

export interface SharedCalendarProps {
  events: CalendarEvent[];
  /** On add event */
  onAddEvent?: () => void;
  /** Month to display (0-11) */
  month?: number;
  /** Year */
  year?: number;
  /** Custom class */
  className?: string;
}

const typeColorMap: Record<CalendarEvent['type'], { bg: string; text: string; dot: string }> = {
  date: { bg: 'bg-ts-gold/10', text: 'text-ts-gold', dot: 'bg-ts-gold' },
  milestone: { bg: 'bg-ts-pink/10', text: 'text-ts-pink', dot: 'bg-ts-pink' },
  reminder: { bg: 'bg-ts-teal/10', text: 'text-ts-teal', dot: 'bg-ts-teal' },
  birthday: { bg: 'bg-ts-purple/10', text: 'text-ts-purple', dot: 'bg-ts-purple' },
  anniversary: { bg: 'bg-ts-gold/10', text: 'text-ts-gold', dot: 'bg-ts-gold' },
};

const SharedCalendar: React.FC<SharedCalendarProps> = ({
  events,
  onAddEvent,
  month = new Date().getMonth(),
  year = new Date().getFullYear(),
  className = '',
}) => {
  const monthNames = [
    'Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Desember',
  ];

  const getDaysInMonth = (m: number, y: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (m: number, y: number) => new Date(y, m, 1).getDay();

  const daysInMonth = getDaysInMonth(month, year);
  const firstDay = getFirstDayOfMonth(month, year);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay === 0 ? 6 : firstDay - 1 }, () => null);

  const getEventsForDay = (day: number) => {
    return events.filter((e) => {
      const d = new Date(e.date);
      return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
    });
  };

  return (
    <div className={`rounded-2xl border border-white/8 bg-ts-glass/50 backdrop-blur-xl p-5 ${className}`}>
      {/* Month header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-ts-primary">
          {monthNames[month]} {year}
        </h3>
        {onAddEvent && (
          <button onClick={onAddEvent} className="px-3 py-1.5 rounded-lg bg-ts-gold text-ts-bg text-xs font-medium hover:bg-ts-gold/90 transition-all">
            + Ny
          </button>
        )}
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Ma', 'Ti', 'On', 'To', 'Fr', 'Lø', 'Sø'].map((d) => (
          <span key={d} className="text-xs text-ts-text-subtle text-center font-medium">{d}</span>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {blanks.map((_, i) => (
          <div key={`blank-${i}`} />
        ))}
        {days.map((day) => {
          const dayEvents = getEventsForDay(day);
          const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
          return (
            <div
              key={day}
              className={`
                min-h-[60px] rounded-xl p-1.5
                ${isToday ? 'bg-ts-gold/10 border border-ts-gold/20' : 'border border-transparent'}
                ${dayEvents.length > 0 ? 'bg-ts-glass/30' : 'hover:bg-ts-glass/30'}
                transition-all
              `}
            >
              <span className={`text-xs font-medium ${isToday ? 'text-ts-gold' : 'text-ts-text-secondary'}`}>
                {day}
              </span>
              <div className="mt-1 space-y-0.5">
                {dayEvents.slice(0, 2).map((e, i) => {
                  const tc = typeColorMap[e.type];
                  return (
                    <div key={i} className={`flex items-center gap-1 ${tc.bg} rounded px-1 py-0.5`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${tc.dot}`} />
                      <span className="text-[9px] text-ts-text-secondary truncate">{e.title}</span>
                    </div>
                  );
                })}
                {dayEvents.length > 2 && (
                  <span className="text-[9px] text-ts-text-subtle">+{dayEvents.length - 2}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-4 pt-3 border-t border-white/5">
        {Object.entries(typeColorMap).map(([type, colors]) => (
          <div key={type} className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
            <span className="text-[10px] text-ts-text-subtle capitalize">{type}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

SharedCalendar.displayName = 'SharedCalendar';
export default SharedCalendar;