import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import StatusBadge from '@/components/admin/StatusBadge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface BookingRequest {
  id: string;
  status: string;
  session_type: string;
  result_package: string;
  total_price: number;
  deposit_amount: number;
  payment_status: string;
  created_at: string;
  customers: { name: string; email: string } | null;
}

const Requests = () => {
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      const { data } = await supabase
        .from('booking_requests')
        .select('id, status, session_type, result_package, total_price, deposit_amount, payment_status, created_at, customers(name, email)')
        .order('created_at', { ascending: false });
      
      if (data) setRequests(data as any);
      setLoading(false);
    };
    fetchRequests();
  }, []);

  const filtered = requests.filter(r => {
    const matchSearch = !search || 
      r.customers?.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.customers?.email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-serif font-semibold">Förfrågningar</h1>
        <p className="text-muted-foreground font-sans text-sm mt-1">{requests.length} totalt</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Sök kund..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alla</SelectItem>
            <SelectItem value="new">Ny</SelectItem>
            <SelectItem value="under_review">Under granskning</SelectItem>
            <SelectItem value="approved">Godkänd</SelectItem>
            <SelectItem value="awaiting_payment">Inväntar betalning</SelectItem>
            <SelectItem value="paid">Betald</SelectItem>
            <SelectItem value="confirmed">Bekräftad</SelectItem>
            <SelectItem value="declined">Nekad</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {filtered.map((r) => (
          <button
            key={r.id}
            onClick={() => navigate(`/admin/requests/${r.id}`)}
            className="w-full text-left bg-card border border-border rounded p-4 hover:border-primary/30 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <p className="font-sans font-medium">{r.customers?.name || 'Okänd'}</p>
                <p className="text-xs text-muted-foreground font-sans">{r.customers?.email}</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <StatusBadge status={r.status} />
                <StatusBadge status={r.payment_status} />
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mt-3 text-xs text-muted-foreground font-sans">
              <span>{r.session_type || '—'}</span>
              <span>{r.result_package || '—'}</span>
              <span className="text-primary font-medium">{r.total_price?.toLocaleString()} SEK</span>
              <span>{new Date(r.created_at).toLocaleDateString('sv-SE')}</span>
            </div>
          </button>
        ))}
        {!loading && filtered.length === 0 && (
          <p className="text-center text-muted-foreground font-sans py-12">Inga förfrågningar hittades.</p>
        )}
      </div>
    </AdminLayout>
  );
};

export default Requests;
