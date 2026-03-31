import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import CalendarView from '@/components/admin/CalendarView';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Settings } from 'lucide-react';

interface CalendarEvent {
  date: string;
  type: 'booking' | 'blocked';
  label?: string;
  id?: string;
}

const Calendar = () => {
  const { toast } = useToast();
  const [month, setMonth] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [slotCap, setSlotCap] = useState(7);
  const [editCap, setEditCap] = useState('7');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const year = month.getFullYear();
    const m = month.getMonth();
    const start = `${year}-${String(m + 1).padStart(2, '0')}-01`;
    const end = `${year}-${String(m + 2 > 12 ? 1 : m + 2).padStart(2, '0')}-01`;

    const [{ data: blocked }, { data: bookings }, { data: settings }] = await Promise.all([
      supabase.from('blocked_dates').select('id, date, reason'),
      supabase.from('booking_requests').select('id, requested_date, customers(name), status')
        .in('status', ['confirmed', 'paid', 'approved'])
        .gte('requested_date', start)
        .lt('requested_date', end),
      supabase.from('studio_settings').select('monthly_slot_cap').eq('id', 1).single(),
    ]);

    const evts: CalendarEvent[] = [];
    blocked?.forEach(b => evts.push({ date: b.date, type: 'blocked', label: b.reason || 'Blockerad', id: b.id }));
    bookings?.forEach(b => {
      if (b.requested_date) {
        evts.push({ date: b.requested_date, type: 'booking', label: (b.customers as any)?.name || 'Bokning', id: b.id });
      }
    });

    setEvents(evts);
    if (settings) {
      setSlotCap(settings.monthly_slot_cap);
      setEditCap(String(settings.monthly_slot_cap));
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [month]);

  const handleDateClick = async (dateStr: string) => {
    const existing = events.find(e => e.date === dateStr && e.type === 'blocked');
    if (existing) {
      await supabase.from('blocked_dates').delete().eq('id', existing.id);
      toast({ title: `${dateStr} avblockerad` });
    } else {
      await supabase.from('blocked_dates').insert({ date: dateStr });
      toast({ title: `${dateStr} blockerad` });
    }
    fetchData();
  };

  const saveSlotCap = async () => {
    const cap = parseInt(editCap);
    if (isNaN(cap) || cap < 1) return;
    await supabase.from('studio_settings').update({ monthly_slot_cap: cap, updated_at: new Date().toISOString() }).eq('id', 1);
    setSlotCap(cap);
    toast({ title: 'Slot-tak uppdaterat' });
  };

  const confirmedThisMonth = events.filter(e => e.type === 'booking').length;

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-serif font-semibold">Kalender</h1>
        <p className="text-muted-foreground font-sans text-sm mt-1">Hantera tillgänglighet och se bokningar</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        <div className="bg-card border border-border rounded p-6">
          <CalendarView
            events={events}
            onDateClick={handleDateClick}
            month={month}
            onMonthChange={setMonth}
          />
          <p className="text-xs text-muted-foreground font-sans mt-4">Klicka på ett datum för att blockera/avblockera.</p>
        </div>

        <div className="space-y-6">
          {/* Slot control */}
          <div className="bg-card border border-border rounded p-6">
            <div className="flex items-center gap-2 mb-4">
              <Settings size={18} className="text-primary" />
              <h2 className="text-lg font-serif font-semibold">Slot-kontroll</h2>
            </div>

            <div className="space-y-4">
              <div className="text-center bg-muted/30 rounded p-4">
                <p className="text-2xl font-serif font-semibold text-primary">{confirmedThisMonth} / {slotCap}</p>
                <p className="text-xs text-muted-foreground font-sans mt-1">Sessioner denna månad</p>
              </div>

              <div className="space-y-2">
                <Label className="font-sans text-sm">Max sessioner/månad</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={editCap}
                    onChange={(e) => setEditCap(e.target.value)}
                    min={1}
                    className="w-20"
                  />
                  <Button onClick={saveSlotCap} variant="outline" size="sm">Spara</Button>
                </div>
              </div>
            </div>
          </div>

          {/* Today's bookings */}
          <div className="bg-card border border-border rounded p-6">
            <h2 className="text-lg font-serif font-semibold mb-4">Bokningar denna månad</h2>
            {events.filter(e => e.type === 'booking').length === 0 ? (
              <p className="text-sm text-muted-foreground font-sans">Inga bekräftade bokningar.</p>
            ) : (
              <div className="space-y-2">
                {events.filter(e => e.type === 'booking').map((e, i) => (
                  <div key={i} className="flex justify-between text-sm font-sans py-2 border-b border-border last:border-0">
                    <span>{e.label}</span>
                    <span className="text-muted-foreground">{e.date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Calendar;
