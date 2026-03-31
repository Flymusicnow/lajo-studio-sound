import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  message: string;
  time: string;
  type: 'new_booking' | 'payment' | 'files';
}

const NotificationBell = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Fetch recent new bookings as initial notifications
    const fetchRecent = async () => {
      const { data } = await supabase
        .from('booking_requests')
        .select('id, created_at, status, customers(name)')
        .eq('status', 'new')
        .order('created_at', { ascending: false })
        .limit(5);

      if (data) {
        setNotifications(data.map((r: any) => ({
          id: r.id,
          message: `Ny förfrågan från ${r.customers?.name || 'Okänd'}`,
          time: new Date(r.created_at).toLocaleString('sv-SE', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
          type: 'new_booking' as const,
        })));
      }
    };

    fetchRecent();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('admin-notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'booking_requests' },
        (payload) => {
          setNotifications(prev => [{
            id: payload.new.id,
            message: `Ny bokningsförfrågan`,
            time: new Date().toLocaleString('sv-SE', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
            type: 'new_booking',
          }, ...prev].slice(0, 10));
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'booking_requests' },
        (payload) => {
          if (payload.new.payment_status !== payload.old?.payment_status && payload.new.payment_status !== 'unpaid') {
            setNotifications(prev => [{
              id: payload.new.id,
              message: `Betalning mottagen`,
              time: new Date().toLocaleString('sv-SE', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
              type: 'payment',
            }, ...prev].slice(0, 10));
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'project_status' },
        (payload) => {
          if (payload.new.file_status === 'received' && payload.old?.file_status !== 'received') {
            setNotifications(prev => [{
              id: payload.new.id,
              message: `Filer uppladdade`,
              time: new Date().toLocaleString('sv-SE', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
              type: 'files',
            }, ...prev].slice(0, 10));
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const unreadCount = notifications.length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] font-sans font-bold flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-3 border-b border-border">
          <h3 className="text-sm font-serif font-semibold">Notiser</h3>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground font-sans text-center">Inga notiser</p>
          ) : (
            notifications.map(n => (
              <div key={n.id + n.time} className="px-3 py-2.5 border-b border-border/50 hover:bg-muted/30 transition-colors">
                <p className="text-sm font-sans">{n.message}</p>
                <p className="text-xs text-muted-foreground font-sans mt-0.5">{n.time}</p>
              </div>
            ))
          )}
        </div>
        {notifications.length > 0 && (
          <div className="p-2 border-t border-border">
            <Button variant="ghost" size="sm" className="w-full text-xs" onClick={() => { setNotifications([]); setOpen(false); }}>
              Rensa alla
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
