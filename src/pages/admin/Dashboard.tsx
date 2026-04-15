import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import StatusBadge from '@/components/admin/StatusBadge';
import { Inbox, CreditCard, FolderOpen, ArrowRight, Calendar, DollarSign, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ActionCard {
  label: string;
  count: number;
  icon: React.ElementType;
  path: string;
  color: string;
}

interface ActiveProject {
  id: string;
  customerName: string;
  sessionType: string;
  status: string;
  deadline: string | null;
  daysInStage: number;
}

interface WeekDay {
  date: string;
  dayName: string;
  dayNum: number;
  bookings: number;
  blocked: boolean;
  isToday: boolean;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [actions, setActions] = useState<ActionCard[]>([]);
  const [projects, setProjects] = useState<ActiveProject[]>([]);
  const [weekDays, setWeekDays] = useState<WeekDay[]>([]);
  const [slotsUsed, setSlotsUsed] = useState(0);
  const [slotCap, setSlotCap] = useState(7);
  const [revenue, setRevenue] = useState(0);
  const [deadlines, setDeadlines] = useState<{ name: string; days: number; id: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const now = new Date();
      const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;

      // Get week range (Mon-Sun)
      const dayOfWeek = (now.getDay() + 6) % 7;
      const monday = new Date(now);
      monday.setDate(now.getDate() - dayOfWeek);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);

      const weekStart = monday.toISOString().split('T')[0];
      const weekEndDate = new Date(sunday);
      weekEndDate.setDate(weekEndDate.getDate() + 1);
      const weekEnd = weekEndDate.toISOString().split('T')[0];

      const [
        { data: requests },
        { data: projectStatuses },
        { data: settings },
        { data: blockedDates },
        { data: weekBookings },
      ] = await Promise.all([
        supabase.from('booking_requests').select('id, status, payment_status, total_price, created_at, deadline, session_type, customer_id, customers(name)'),
        supabase.from('project_status').select('id, status, updated_at, booking_request_id, booking_requests(id, deadline, session_type, customer_id, customers(name))'),
        supabase.from('studio_settings').select('monthly_slot_cap').eq('id', 1).single(),
        supabase.from('blocked_dates').select('date').gte('date', weekStart).lt('date', weekEnd),
        supabase.from('booking_requests').select('requested_date')
          .in('status', ['confirmed', 'paid', 'in_progress'])
          .gte('requested_date', weekStart)
          .lt('requested_date', weekEnd),
      ]);

      if (!requests) { setLoading(false); return; }

      const cap = settings?.monthly_slot_cap || 7;
      setSlotCap(cap);

      // Action cards
      const newCount = requests.filter(r => r.status === 'new').length;
      const pendingPay = requests.filter(r => ['awaiting_payment', 'awaiting_deposit', 'ready_for_final_payment'].includes(r.status)).length;
      const filesWaiting = projectStatuses?.filter(p => p.status === 'awaiting_files').length || 0;

      setActions([
        { label: 'Nya förfrågningar', count: newCount, icon: Inbox, path: '/admin/requests', color: 'text-blue-400' },
        { label: 'Inväntar betalning', count: pendingPay, icon: CreditCard, path: '/admin/requests', color: 'text-amber-400' },
        { label: 'Inväntar filer', count: filesWaiting, icon: FolderOpen, path: '/admin/workload', color: 'text-indigo-400' },
      ]);

      // Active projects
      const activeProjects: ActiveProject[] = (projectStatuses || [])
        .filter(p => !['delivered', 'completed'].includes(p.status))
        .map(p => {
          const br = p.booking_requests as any;
          const daysSince = Math.floor((Date.now() - new Date(p.updated_at).getTime()) / 86400000);
          return {
            id: p.booking_request_id,
            customerName: br?.customers?.name || 'Okänd',
            sessionType: br?.session_type || '',
            status: p.status,
            deadline: br?.deadline || null,
            daysInStage: daysSince,
          };
        });
      setProjects(activeProjects);

      // Slots used this month
      const used = requests.filter(r =>
        ['confirmed', 'paid', 'in_progress'].includes(r.status) &&
        new Date(r.created_at) >= new Date(monthStart)
      ).length;
      setSlotsUsed(used);

      // Revenue this month
      const rev = requests
        .filter(r => ['deposit_paid', 'fully_paid'].includes(r.payment_status) && new Date(r.created_at) >= new Date(monthStart))
        .reduce((sum, r) => sum + (r.total_price || 0), 0);
      setRevenue(rev);

      // Deadlines
      const upcoming = requests
        .filter(r => r.deadline && !['delivered', 'declined'].includes(r.status))
        .map(r => ({
          name: (r.customers as any)?.name || 'Projekt',
          days: Math.ceil((new Date(r.deadline!).getTime() - Date.now()) / 86400000),
          id: r.id,
        }))
        .sort((a, b) => a.days - b.days)
        .slice(0, 3);
      setDeadlines(upcoming);

      // Week strip
      const todayStr = now.toISOString().split('T')[0];
      const dayNames = ['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön'];
      const week: WeekDay[] = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        const ds = d.toISOString().split('T')[0];
        week.push({
          date: ds,
          dayName: dayNames[i],
          dayNum: d.getDate(),
          bookings: weekBookings?.filter(b => b.requested_date === ds).length || 0,
          blocked: blockedDates?.some(b => b.date === ds) || false,
          isToday: ds === todayStr,
        });
      }
      setWeekDays(week);

      setLoading(false);
    };

    fetch();
  }, []);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'God morgon';
    if (h < 18) return 'God eftermiddag';
    return 'God kväll';
  };

  const now = new Date();
  const weekNum = Math.ceil(((now.getTime() - new Date(now.getFullYear(), 0, 1).getTime()) / 86400000 + new Date(now.getFullYear(), 0, 1).getDay() + 1) / 7);
  const dateStr = now.toLocaleDateString('sv-SE', { weekday: 'long', day: 'numeric', month: 'long' });

  const capacityPct = Math.min((slotsUsed / slotCap) * 100, 100);

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-semibold">{getGreeting()}</h1>
        <p className="text-muted-foreground font-sans text-sm mt-1 capitalize">{dateStr} · Vecka {weekNum}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
        {/* Left column */}
        <div className="space-y-6">
          {/* Action cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {actions.map(a => (
              <button
                key={a.label}
                onClick={() => navigate(a.path)}
                className="p-5 rounded border border-border bg-card hover:bg-muted/30 transition-colors text-left group"
              >
                <div className="flex items-center justify-between mb-3">
                  <a.icon size={18} className={a.color} />
                  <ArrowRight size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-2xl font-serif font-semibold">{a.count}</p>
                <p className="text-xs text-muted-foreground font-sans mt-1">{a.label}</p>
              </button>
            ))}
          </div>

          {/* Active projects pipeline */}
          <div className="bg-card border border-border rounded p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-serif font-semibold">Aktiva projekt</h2>
              <Button variant="ghost" size="sm" className="text-xs" onClick={() => navigate('/admin/workload')}>
                Workload →
              </Button>
            </div>
            {projects.length === 0 ? (
              <p className="text-sm text-muted-foreground font-sans">Inga aktiva projekt just nu.</p>
            ) : (
              <div className="space-y-3">
                {projects.map(p => {
                  const deadlineDays = p.deadline ? Math.ceil((new Date(p.deadline).getTime() - Date.now()) / 86400000) : null;
                  return (
                    <div
                      key={p.id}
                      onClick={() => navigate(`/admin/requests/${p.id}`)}
                      className="flex items-center justify-between py-3 px-4 rounded bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="text-sm font-sans font-medium">{p.customerName}</p>
                          <p className="text-xs text-muted-foreground font-sans">{p.sessionType}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge status={p.status} />
                        {deadlineDays !== null && (
                          <span className={cn(
                            'text-xs font-sans font-medium',
                            deadlineDays > 3 ? 'text-emerald-400' : deadlineDays > 0 ? 'text-amber-400' : 'text-red-400'
                          )}>
                            {deadlineDays > 0 ? `${deadlineDays}d kvar` : 'Försenad'}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Week strip */}
          <div className="bg-card border border-border rounded p-6">
            <h2 className="text-lg font-serif font-semibold mb-4">Denna vecka</h2>
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map(d => (
                <div
                  key={d.date}
                  className={cn(
                    'flex flex-col items-center py-3 rounded text-center',
                    d.isToday && 'ring-1 ring-primary',
                    d.blocked && 'bg-red-500/10',
                    d.bookings > 0 && !d.blocked && 'bg-primary/10',
                  )}
                >
                  <span className="text-xs text-muted-foreground font-sans">{d.dayName}</span>
                  <span className="text-lg font-serif font-semibold mt-1">{d.dayNum}</span>
                  {d.bookings > 0 && <span className="text-[10px] text-primary font-sans mt-1">{d.bookings} sess.</span>}
                  {d.blocked && <span className="text-[10px] text-red-400 font-sans mt-1">Stängd</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Capacity meter */}
          <div className="bg-card border border-border rounded p-6">
            <h3 className="text-sm font-sans font-medium text-muted-foreground mb-3">Kapacitet</h3>
            <div className="flex items-center justify-center mb-3">
              <div className="relative w-24 h-24">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="hsl(var(--muted))"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="3"
                    strokeDasharray={`${capacityPct}, 100`}
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-serif font-semibold">{slotsUsed}/{slotCap}</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground font-sans text-center">
              {slotCap - slotsUsed} platser kvar denna månad
            </p>
          </div>

          {/* Revenue */}
          <div className="bg-card border border-border rounded p-6">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign size={16} className="text-emerald-400" />
              <h3 className="text-sm font-sans font-medium text-muted-foreground">Intäkter denna månad</h3>
            </div>
            <p className="text-2xl font-serif font-semibold">{revenue.toLocaleString('sv-SE')} kr</p>
          </div>

          {/* Upcoming deadlines */}
          <div className="bg-card border border-border rounded p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock size={16} className="text-amber-400" />
              <h3 className="text-sm font-sans font-medium text-muted-foreground">Deadlines</h3>
            </div>
            {deadlines.length === 0 ? (
              <p className="text-xs text-muted-foreground font-sans">Inga kommande deadlines.</p>
            ) : (
              <div className="space-y-3">
                {deadlines.map(d => (
                  <div
                    key={d.id}
                    onClick={() => navigate(`/admin/requests/${d.id}`)}
                    className="flex justify-between items-center cursor-pointer hover:bg-muted/20 rounded px-2 py-1.5 -mx-2 transition-colors"
                  >
                    <span className="text-sm font-sans">{d.name}</span>
                    <span className={cn(
                      'text-xs font-sans font-medium',
                      d.days > 3 ? 'text-emerald-400' : d.days > 0 ? 'text-amber-400' : 'text-red-400'
                    )}>
                      {d.days > 0 ? `${d.days}d` : d.days === 0 ? 'Idag' : `${Math.abs(d.days)}d sen`}
                    </span>
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

export default Dashboard;
