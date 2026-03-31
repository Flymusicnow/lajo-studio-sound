import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import StatusBadge from '@/components/admin/StatusBadge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, CheckCircle, XCircle, CreditCard, FileCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const RequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [request, setRequest] = useState<any>(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchRequest = async () => {
    const { data } = await supabase
      .from('booking_requests')
      .select('*, customers(*)')
      .eq('id', id)
      .single();
    if (data) {
      setRequest(data);
      setNote(data.admin_notes || '');
    }
    setLoading(false);
  };

  useEffect(() => { fetchRequest(); }, [id]);

  const updateStatus = async (status: string, paymentStatus?: string) => {
    const updates: any = { status, updated_at: new Date().toISOString() };
    if (paymentStatus) updates.payment_status = paymentStatus;
    
    await supabase.from('booking_requests').update(updates).eq('id', id);
    toast({ title: 'Status uppdaterad' });
    fetchRequest();
  };

  const saveNote = async () => {
    await supabase.from('booking_requests').update({ admin_notes: note, updated_at: new Date().toISOString() }).eq('id', id);
    toast({ title: 'Anteckning sparad' });
  };

  if (loading) return <AdminLayout><p className="text-muted-foreground">Laddar...</p></AdminLayout>;
  if (!request) return <AdminLayout><p className="text-muted-foreground">Hittades inte.</p></AdminLayout>;

  const customer = request.customers;

  return (
    <AdminLayout>
      <Button variant="ghost" onClick={() => navigate('/admin/requests')} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Tillbaka
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="bg-card border border-border rounded p-6">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <h1 className="text-xl font-serif font-semibold">{customer?.name || 'Okänd kund'}</h1>
              <StatusBadge status={request.status} />
              <StatusBadge status={request.payment_status} />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm font-sans">
              <div><span className="text-muted-foreground">E-post:</span> {customer?.email}</div>
              <div><span className="text-muted-foreground">Telefon:</span> {customer?.phone || '—'}</div>
              <div><span className="text-muted-foreground">Datum:</span> {new Date(request.created_at).toLocaleDateString('sv-SE')}</div>
              <div><span className="text-muted-foreground">Deadline:</span> {request.deadline ? new Date(request.deadline).toLocaleDateString('sv-SE') : '—'}</div>
            </div>
          </div>

          {/* Booking details */}
          <div className="bg-card border border-border rounded p-6">
            <h2 className="text-lg font-serif font-semibold mb-4">Sessionsdetaljer</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-sans">
              <div><span className="text-muted-foreground">Session:</span> {request.session_type} — {request.session_price?.toLocaleString()} SEK</div>
              <div><span className="text-muted-foreground">Resultatpaket:</span> {request.result_package} — {request.result_package_price?.toLocaleString()} SEK</div>
              <div><span className="text-muted-foreground">Mixningskomplexitet:</span> {request.mixing_scope || '—'}</div>
              <div><span className="text-muted-foreground">Mastering:</span> {request.mastering_type || 'Ingen'} {request.mastering_tracks > 0 ? `(${request.mastering_tracks} spår)` : ''}</div>
              <div><span className="text-muted-foreground">Antal låtar:</span> {request.song_count || '—'}</div>
              <div><span className="text-muted-foreground">Antal spår:</span> {request.track_count || '—'}</div>
            </div>

            {request.creative_types && (request.creative_types as any[]).length > 0 && (
              <div className="mt-4">
                <p className="text-muted-foreground text-sm font-sans mb-2">Kreativa tjänster:</p>
                <div className="flex flex-wrap gap-2">
                  {(request.creative_types as any[]).map((ct: string, i: number) => (
                    <span key={i} className="px-2 py-1 bg-muted rounded text-xs font-sans">{ct}</span>
                  ))}
                </div>
              </div>
            )}

            {request.add_ons && (request.add_ons as any[]).length > 0 && (
              <div className="mt-4">
                <p className="text-muted-foreground text-sm font-sans mb-2">Tillägg:</p>
                <div className="flex flex-wrap gap-2">
                  {(request.add_ons as any[]).map((addon: any, i: number) => (
                    <span key={i} className="px-2 py-1 bg-muted rounded text-xs font-sans">
                      {addon.label || addon} — {addon.price?.toLocaleString()} SEK
                    </span>
                  ))}
                </div>
              </div>
            )}

            {request.description && (
              <div className="mt-4">
                <p className="text-muted-foreground text-sm font-sans mb-1">Beskrivning:</p>
                <p className="text-sm font-sans">{request.description}</p>
              </div>
            )}

            {request.reference_url && (
              <div className="mt-2">
                <p className="text-muted-foreground text-sm font-sans mb-1">Referens:</p>
                <a href={request.reference_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary underline font-sans">{request.reference_url}</a>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="bg-card border border-border rounded p-6">
            <h2 className="text-lg font-serif font-semibold mb-4">Interna anteckningar</h2>
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={4} className="mb-3" />
            <Button onClick={saveNote} variant="outline" size="sm">Spara anteckning</Button>
          </div>
        </div>

        {/* Sidebar: pricing + actions */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded p-6">
            <h2 className="text-lg font-serif font-semibold mb-4">Pris</h2>
            <div className="space-y-2 text-sm font-sans">
              <div className="flex justify-between"><span className="text-muted-foreground">Totalt</span><span className="text-primary font-semibold text-lg">{request.total_price?.toLocaleString()} SEK</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Förskott</span><span>{request.deposit_amount?.toLocaleString()} SEK</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Resterande</span><span>{(request.total_price - request.deposit_amount)?.toLocaleString()} SEK</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Betalningsval</span><span>{request.payment_choice === 'full' ? 'Fullbetalning' : '50% förskott'}</span></div>
            </div>
          </div>

          <div className="bg-card border border-border rounded p-6 space-y-3">
            <h2 className="text-lg font-serif font-semibold mb-2">Åtgärder</h2>
            
            {request.status === 'new' && (
              <>
                <Button onClick={() => updateStatus('approved')} className="w-full" size="sm">
                  <CheckCircle className="mr-2 h-4 w-4" /> Godkänn
                </Button>
                <Button onClick={() => updateStatus('declined')} variant="outline" className="w-full" size="sm">
                  <XCircle className="mr-2 h-4 w-4" /> Neka
                </Button>
              </>
            )}

            {request.status === 'approved' && (
              <Button onClick={() => updateStatus('awaiting_payment')} className="w-full" size="sm">
                <CreditCard className="mr-2 h-4 w-4" /> Skicka betalningslänk
              </Button>
            )}

            {(request.status === 'awaiting_payment' || request.payment_status === 'unpaid') && (
              <>
                <Button onClick={() => updateStatus('paid', 'deposit_paid')} variant="outline" className="w-full" size="sm">
                  Markera förskott betalt
                </Button>
                <Button onClick={() => updateStatus('paid', 'fully_paid')} variant="outline" className="w-full" size="sm">
                  Markera fullt betald
                </Button>
              </>
            )}

            {request.status === 'paid' && (
              <Button onClick={() => updateStatus('confirmed')} className="w-full" size="sm">
                <FileCheck className="mr-2 h-4 w-4" /> Bekräfta bokning
              </Button>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default RequestDetail;
