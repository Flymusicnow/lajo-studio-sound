import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Users, Calendar, LogOut, Menu, X, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import NotificationBell from '@/components/admin/NotificationBell';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { label: 'Requests', icon: FileText, path: '/admin/requests' },
  { label: 'Customers', icon: Users, path: '/admin/customers' },
  { label: 'Calendar', icon: Calendar, path: '/admin/calendar' },
  { label: 'Innehåll', icon: Palette, path: '/admin/content' },
];

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

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
            <p className="text-xs text-muted-foreground font-sans mt-1">Studio Admin</p>
          </div>
          <NotificationBell />
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNav(item.path)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-sans transition-colors',
                location.pathname === item.path
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
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
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
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
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNav(item.path)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-4 rounded text-base font-sans transition-colors',
                    location.pathname === item.path
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <item.icon size={20} />
                  {item.label}
                </button>
              ))}
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
