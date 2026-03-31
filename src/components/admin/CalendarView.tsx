import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Lock, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CalendarEvent {
  date: string;
  type: 'booking' | 'blocked';
  label?: string;
  id?: string;
}

interface CalendarViewProps {
  events: CalendarEvent[];
  onDateClick: (date: string) => void;
  month: Date;
  onMonthChange: (date: Date) => void;
}

const WEEKDAYS = ['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön'];

const CalendarView = ({ events, onDateClick, month, onMonthChange }: CalendarViewProps) => {
  const year = month.getFullYear();
  const m = month.getMonth();

  const firstDay = new Date(year, m, 1);
  const lastDay = new Date(year, m + 1, 0);
  const startDayOfWeek = (firstDay.getDay() + 6) % 7; // Monday = 0
  const daysInMonth = lastDay.getDate();

  const cells = useMemo(() => {
    const result: (number | null)[] = [];
    for (let i = 0; i < startDayOfWeek; i++) result.push(null);
    for (let d = 1; d <= daysInMonth; d++) result.push(d);
    return result;
  }, [startDayOfWeek, daysInMonth]);

  const getDateStr = (day: number) => {
    const dd = String(day).padStart(2, '0');
    const mm = String(m + 1).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  };

  const getEventsForDay = (day: number) => {
    const dateStr = getDateStr(day);
    return events.filter(e => e.date === dateStr);
  };

  const today = new Date().toISOString().split('T')[0];

  const prevMonth = () => onMonthChange(new Date(year, m - 1, 1));
  const nextMonth = () => onMonthChange(new Date(year, m + 1, 1));

  const monthName = month.toLocaleDateString('sv-SE', { month: 'long', year: 'numeric' });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" onClick={prevMonth}>
          <ChevronLeft size={18} />
        </Button>
        <h3 className="text-lg font-serif font-semibold capitalize">{monthName}</h3>
        <Button variant="ghost" size="icon" onClick={nextMonth}>
          <ChevronRight size={18} />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {WEEKDAYS.map(d => (
          <div key={d} className="text-center text-xs text-muted-foreground font-sans py-2">{d}</div>
        ))}

        {cells.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} />;
          
          const dateStr = getDateStr(day);
          const dayEvents = getEventsForDay(day);
          const isBlocked = dayEvents.some(e => e.type === 'blocked');
          const hasBooking = dayEvents.some(e => e.type === 'booking');
          const isToday = dateStr === today;
          const isPast = dateStr < today;

          return (
            <button
              key={dateStr}
              onClick={() => onDateClick(dateStr)}
              className={cn(
                'relative aspect-square flex flex-col items-center justify-center rounded text-sm font-sans transition-colors',
                isPast && 'opacity-40',
                isToday && 'ring-1 ring-primary',
                isBlocked && 'bg-red-500/10 text-red-400',
                hasBooking && !isBlocked && 'bg-primary/10 text-primary',
                !isBlocked && !hasBooking && 'hover:bg-muted/50',
              )}
            >
              <span>{day}</span>
              <div className="flex gap-0.5 mt-0.5">
                {isBlocked && <Lock size={10} className="text-red-400" />}
                {hasBooking && <Music size={10} className="text-primary" />}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex gap-4 mt-4 text-xs font-sans text-muted-foreground">
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-primary/20" /> Bokad session</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-red-500/20" /> Blockerad</div>
      </div>
    </div>
  );
};

export default CalendarView;
