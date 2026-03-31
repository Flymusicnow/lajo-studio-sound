import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  status: string;
  total_spent: number;
  created_at: string;
}

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) setCustomers(data as any);
      setLoading(false);
    };
    fetch();
  }, []);

  const filtered = customers.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
  );

  const statusLabel: Record<string, string> = { new: 'Ny', returning: 'Återkommande', high_value: 'Högt värde' };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-serif font-semibold">Kunder</h1>
        <p className="text-muted-foreground font-sans text-sm mt-1">{customers.length} kunder</p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Sök kund..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="space-y-3">
        {filtered.map((c) => (
          <button
            key={c.id}
            onClick={() => navigate(`/admin/customers/${c.id}`)}
            className="w-full text-left bg-card border border-border rounded p-4 hover:border-primary/30 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <p className="font-sans font-medium">{c.name}</p>
                <p className="text-xs text-muted-foreground font-sans">{c.email}</p>
              </div>
              <div className="flex items-center gap-3 text-sm font-sans">
                <span className="px-2 py-0.5 rounded-full bg-muted text-xs">{statusLabel[c.status] || c.status}</span>
                <span className="text-primary font-medium">{c.total_spent?.toLocaleString()} SEK</span>
              </div>
            </div>
          </button>
        ))}
        {!loading && filtered.length === 0 && (
          <p className="text-center text-muted-foreground font-sans py-12">Inga kunder hittades.</p>
        )}
      </div>
    </AdminLayout>
  );
};

export default Customers;
