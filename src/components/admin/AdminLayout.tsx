import { ReactNode, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Users, Calendar, LogOut, Menu, X, Palette, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import NotificationBell from '@/components/admin/NotificationBell';
import { supabase } from '@/integrations/supabase/client';

const navItems = [
  { label: 'Översikt', icon: LayoutDashboard, path: '/admin' },
  { label: 'Förfrågningar', icon: FileText, path: '/admin/requests' },
  { label: 'Workload', icon: Layers, path: '/admin/workload' },
  { label: 'Kunder', icon: Users, path: '/admin/customers' },
  { label: 'Kalender', icon: Calendar, path: '/admin/calendar' },
  { label: 'Innehåll', icon: Palette, path: '/admin/content' },
];

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [capacityLabel, setCapacityLabel] = useState('');

  useEffect(() => {
    const fetchCapacity = async () => {
      const now = new Date();
      const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
      const [{ data: settings }, { data: bookings }] = await Promise.all([
        supabase.from('studio_settings').select('monthly_slot_cap').eq('id', 1).single(),
        supabase.from('booking_requests').select('id')
          .in('status', ['confirmed', 'paid', 'in_progress'])
          .gte('created_at', monthStart),
      ]);
      const cap = settings?.monthly_slot_cap || 7;
      const used = bookings?.length || 0;
      setCapacityLabel(`${used}/${cap} slots`);
    };
    fetchCapacity();
  }, []);

  const handleNav = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-card">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h1 className="text-primary font-serif text-lg font-semibold tracking-wide">TOPLINER</h1>
            <p className="text-xs text-muted-foreground font-sans mt-1">Studio OS</p>
          </div>
          <NotificationBell />
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path || 
              (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-sans transition-colors',
                  active
                    ? 'bg-primary/10 text-primary border-l-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border space-y-3">
          {capacityLabel && (
            <div className="px-4 py-2 text-xs font-sans text-muted-foreground bg-muted/30 rounded text-center">
              📊 {capacityLabel}
            </div>
          )}
          <button
            onClick={() => signOut()}
            className="w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-sans text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <LogOut size={18} />
            Logga ut
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex-1 flex flex-col">
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-card">
          <h1 className="text-primary font-serif text-lg font-semibold">TOPLINER</h1>
          <div className="flex items-center gap-2">
            <NotificationBell />
            <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </header>

        {/* Mobile nav overlay */}
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-background/95 backdrop-blur-sm">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h1 className="text-primary font-serif text-lg font-semibold">TOPLINER</h1>
              <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
                <X size={20} />
              </Button>
            </div>
            <nav className="p-4 space-y-2">
              {navItems.map((item) => {
                const active = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNav(item.path)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-4 rounded text-base font-sans transition-colors',
                      active
                        ? 'bg-primary/10 text-primary border-l-2 border-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <item.icon size={20} />
                    {item.label}
                  </button>
                );
              })}
              <button
                onClick={() => signOut()}
                className="w-full flex items-center gap-3 px-4 py-4 rounded text-base font-sans text-muted-foreground hover:text-foreground transition-colors"
              >
                <LogOut size={20} />
                Logga ut
              </button>
            </nav>
          </div>
        )}

        <main className="flex-1 p-4 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
