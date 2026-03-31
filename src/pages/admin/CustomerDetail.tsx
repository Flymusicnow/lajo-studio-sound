import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import StatusBadge from '@/components/admin/StatusBadge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [customer, setCustomer] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data: cust } = await supabase.from('customers').select('*').eq('id', id).single();
      if (cust) {
        setCustomer(cust);
        setNotes(cust.notes || '');
      }
      const { data: bks } = await supabase
        .from('booking_requests')
        .select('id, status, payment_status, session_type, result_package, total_price, created_at')
        .eq('customer_id', id)
        .order('created_at', { ascending: false });
      if (bks) setBookings(bks);
      setLoading(false);
    };
    fetch();
  }, [id]);

  const saveNotes = async () => {
    await supabase.from('customers').update({ notes, updated_at: new Date().toISOString() }).eq('id', id);
    toast({ title: 'Anteckningar sparade' });
  };

  if (loading) return <AdminLayout><p className="text-muted-foreground">Laddar...</p></AdminLayout>;
  if (!customer) return <AdminLayout><p className="text-muted-foreground">Kunden hittades inte.</p></AdminLayout>;

  const avgOrder = bookings.length > 0
    ? Math.round(bookings.reduce((sum, b) => sum + (b.total_price || 0), 0) / bookings.length)
    : 0;

  const statusLabel: Record<string, string> = { new: 'Ny', returning: 'Återkommande', high_value: 'Högt värde' };

  return (
    <AdminLayout>
      <Button variant="ghost" onClick={() => navigate('/admin/customers')} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Tillbaka
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile */}
        <div className="bg-card border border-border rounded p-6">
          <h1 className="text-xl font-serif font-semibold mb-1">{customer.name}</h1>
          <span className="px-2 py-0.5 rounded-full bg-muted text-xs font-sans">{statusLabel[customer.status] || customer.status}</span>
          
          <div className="mt-6 space-y-3 text-sm font-sans">
            <div><span className="text-muted-foreground">E-post:</span> {customer.email}</div>
            <div><span className="text-muted-foreground">Telefon:</span> {customer.phone || '—'}</div>
            <div><span className="text-muted-foreground">Kund sedan:</span> {new Date(customer.created_at).toLocaleDateString('sv-SE')}</div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-muted/50 rounded p-3 text-center">
              <p className="text-lg font-serif font-semibold text-primary">{customer.total_spent?.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground font-sans">Total SEK</p>
            </div>
            <div className="bg-muted/50 rounded p-3 text-center">
              <p className="text-lg font-serif font-semibold">{bookings.length}</p>
              <p className="text-xs text-muted-foreground font-sans">Bokningar</p>
            </div>
            <div className="bg-muted/50 rounded p-3 text-center col-span-2">
              <p className="text-lg font-serif font-semibold">{avgOrder.toLocaleString()} SEK</p>
              <p className="text-xs text-muted-foreground font-sans">Snittorder</p>
            </div>
          </div>
        </div>

        {/* Bookings + Notes */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded p-6">
            <h2 className="text-lg font-serif font-semibold mb-4">Bokningshistorik</h2>
            {bookings.length === 0 ? (
              <p className="text-muted-foreground font-sans text-sm">Inga bokningar ännu.</p>
            ) : (
              <div className="space-y-3">
                {bookings.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => navigate(`/admin/requests/${b.id}`)}
                    className="w-full text-left bg-muted/30 rounded p-3 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={b.status} />
                        <StatusBadge status={b.payment_status} />
                      </div>
                      <span className="text-primary font-sans font-medium text-sm">{b.total_price?.toLocaleString()} SEK</span>
                    </div>
                    <div className="flex gap-3 mt-2 text-xs text-muted-foreground font-sans">
                      <span>{b.session_type || '—'}</span>
                      <span>{b.result_package || '—'}</span>
                      <span>{new Date(b.created_at).toLocaleDateString('sv-SE')}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="bg-card border border-border rounded p-6">
            <h2 className="text-lg font-serif font-semibold mb-4">Interna anteckningar</h2>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} className="mb-3" />
            <Button onClick={saveNotes} variant="outline" size="sm">Spara</Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CustomerDetail;
