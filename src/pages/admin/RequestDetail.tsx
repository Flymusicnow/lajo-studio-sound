import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import StatusBadge from '@/components/admin/StatusBadge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, CheckCircle, XCircle, CreditCard, FileCheck, Mail, Upload, ExternalLink, DollarSign } from 'lucide-react';
import ProjectWorkflow from '@/components/admin/ProjectWorkflow';
import { useToast } from '@/hooks/use-toast';

const RequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [request, setRequest] = useState<any>(null);
  const [projectStatus, setProjectStatus] = useState<any>(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [emailSending, setEmailSending] = useState('');
  const [stripeLoading, setStripeLoading] = useState(false);

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

    const { data: ps } = await supabase
      .from('project_status')
      .select('*')
      .eq('booking_request_id', id)
      .maybeSingle();
    setProjectStatus(ps);

    setLoading(false);
  };

  useEffect(() => { fetchRequest(); }, [id]);

  const sendEmail = async (type: string, extraPayload: any = {}) => {
    setEmailSending(type);
    try {
      const customer = request.customers;
      await supabase.functions.invoke('send-studio-email', {
        body: {
          type,
          email: customer?.email,
          customerName: customer?.name || 'Kund',
          bookingId: id,
          totalPrice: request.total_price,
          depositAmount: request.deposit_amount,
          uploadUrl: `${window.location.origin}/upload/${id}`,
          ...extraPayload,
        },
      });
      toast({ title: 'E-post skickad' });
    } catch (e) {
      toast({ title: 'Kunde inte skicka e-post', variant: 'destructive' });
    } finally {
      setEmailSending('');
    }
  };

  const updateStatus = async (status: string, paymentStatus?: string, emailType?: string) => {
    const updates: any = { status, updated_at: new Date().toISOString() };
    if (paymentStatus) updates.payment_status = paymentStatus;
    
    await supabase.from('booking_requests').update(updates).eq('id', id);
    
    if (emailType) await sendEmail(emailType);
    else toast({ title: 'Status uppdaterad' });
    
    fetchRequest();
  };

  const requestFiles = async () => {
    if (!projectStatus) {
      await supabase.from('project_status').insert({
        booking_request_id: id,
        file_status: 'awaiting',
      });
    } else {
      await supabase.from('project_status').update({
        file_status: 'awaiting',
        updated_at: new Date().toISOString(),
      }).eq('id', projectStatus.id);
    }
    await sendEmail('files_requested');
    fetchRequest();
  };

  const saveNote = async () => {
    await supabase.from('booking_requests').update({ admin_notes: note, updated_at: new Date().toISOString() }).eq('id', id);
    toast({ title: 'Anteckning sparad' });
  };

  if (loading) return <AdminLayout><p className="text-muted-foreground">Laddar...</p></AdminLayout>;
  if (!request) return <AdminLayout><p className="text-muted-foreground">Hittades inte.</p></AdminLayout>;

  const customer = request.customers;
  const fileStatusLabels: Record<string, string> = {
    not_requested: 'Ej begärda',
    awaiting: 'Inväntar filer',
    received: 'Mottagna',
    reviewed: 'Granskade',
    ready: 'Redo att starta',
  };

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
              <span className={`px-2 py-0.5 rounded text-xs font-sans font-medium ${request.work_mode === 'remote' ? 'bg-blue-500/20 text-blue-400' : 'bg-muted text-muted-foreground'}`}>
                {request.work_mode === 'remote' ? '🏠 Remote' : '🎙 Studio'}
              </span>
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

          {/* File Status */}
          <div className="bg-card border border-border rounded p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-serif font-semibold">Filer</h2>
              {projectStatus?.file_status && (
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-sans font-medium ${
                  projectStatus.file_status === 'received' ? 'bg-emerald-500/20 text-emerald-400' :
                  projectStatus.file_status === 'awaiting' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {fileStatusLabels[projectStatus.file_status] || projectStatus.file_status}
                </span>
              )}
            </div>

            {projectStatus?.file_link && (
              <div className="mb-4">
                <p className="text-sm text-muted-foreground font-sans mb-1">Fil/länk:</p>
                {projectStatus.file_link.startsWith('http') ? (
                  <a href={projectStatus.file_link} target="_blank" rel="noopener noreferrer" className="text-sm text-primary underline font-sans flex items-center gap-1">
                    <ExternalLink size={14} /> {projectStatus.file_link}
                  </a>
                ) : (
                  <p className="text-sm font-sans">{projectStatus.file_link}</p>
                )}
              </div>
            )}

            {projectStatus?.file_notes && (
              <div className="mb-4">
                <p className="text-sm text-muted-foreground font-sans mb-1">Kundanteckningar:</p>
                <p className="text-sm font-sans bg-muted/30 rounded p-3">{projectStatus.file_notes}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <Button onClick={requestFiles} variant="outline" size="sm" disabled={emailSending === 'files_requested'}>
                <Upload className="mr-2 h-4 w-4" />
                {emailSending === 'files_requested' ? 'Skickar...' : 'Begär filer'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(`/upload/${id}`, '_blank')}
              >
                <ExternalLink className="mr-2 h-4 w-4" /> Visa uppladdningssida
              </Button>
            </div>
          </div>

          {/* Project Workflow */}
          <ProjectWorkflow
            projectStatus={projectStatus}
            bookingRequestId={id!}
            onUpdate={fetchRequest}
          />

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
                <Button
                  onClick={async () => {
                    setStripeLoading(true);
                    try {
                      const customer = request.customers;
                      // 1. Approve booking
                      await supabase.from('booking_requests').update({
                        status: 'awaiting_deposit',
                        updated_at: new Date().toISOString(),
                      }).eq('id', id);

                      // 2. Create Stripe checkout
                      const { data, error } = await supabase.functions.invoke('create-checkout', {
                        body: {
                          bookingRequestId: id,
                          amount: request.deposit_amount,
                          customerEmail: customer?.email,
                          customerName: customer?.name,
                        },
                      });
                      if (error) throw error;

                      // 3. Send approval email with payment link
                      await sendEmail('booking_approved', { stripeUrl: data?.url });

                      toast({ title: 'Godkänd + betalningslänk skickad' });
                      fetchRequest();
                    } catch (e) {
                      toast({ title: 'Något gick fel', variant: 'destructive' });
                    } finally {
                      setStripeLoading(false);
                    }
                  }}
                  className="w-full"
                  size="sm"
                  disabled={stripeLoading}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  {stripeLoading ? 'Bearbetar...' : 'Godkänn & skicka betalningslänk'}
                </Button>
                <Button onClick={() => updateStatus('approved', undefined, 'booking_approved')} variant="outline" className="w-full" size="sm">
                  <CheckCircle className="mr-2 h-4 w-4" /> Godkänn utan betalning
                </Button>
                <Button onClick={() => updateStatus('declined', undefined, 'booking_declined')} variant="outline" className="w-full" size="sm">
                  <XCircle className="mr-2 h-4 w-4" /> Neka + skicka mejl
                </Button>
              </>
            )}

            {(request.status === 'approved' || request.status === 'awaiting_deposit') && (
              <>
                <Button onClick={() => updateStatus('awaiting_payment', undefined, 'payment_request')} className="w-full" size="sm">
                  <CreditCard className="mr-2 h-4 w-4" /> Skicka betalningslänk (mejl)
                </Button>
                <Button
                  onClick={async () => {
                    setStripeLoading(true);
                    try {
                      const customer = request.customers;
                      const { data, error } = await supabase.functions.invoke('create-checkout', {
                        body: {
                          bookingRequestId: id,
                          amount: request.deposit_amount,
                          customerEmail: customer?.email,
                          customerName: customer?.name,
                        },
                      });
                      if (error) throw error;
                      if (data?.url) {
                        navigator.clipboard.writeText(data.url);
                        toast({ title: 'Stripe-länk kopierad till urklipp' });
                      }
                    } catch (e) {
                      toast({ title: 'Kunde inte skapa betalningslänk', variant: 'destructive' });
                    } finally {
                      setStripeLoading(false);
                    }
                  }}
                  variant="outline"
                  className="w-full"
                  size="sm"
                  disabled={stripeLoading}
                >
                  <DollarSign className="mr-2 h-4 w-4" />
                  {stripeLoading ? 'Skapar...' : 'Kopiera Stripe-länk'}
                </Button>
              </>
            )}

            {(request.status === 'awaiting_payment' || request.payment_status === 'unpaid') && request.status !== 'new' && (
              <>
                <Button onClick={() => updateStatus('paid', 'deposit_paid', 'payment_received')} variant="outline" className="w-full" size="sm">
                  Markera förskott betalt
                </Button>
                <Button onClick={() => updateStatus('paid', 'fully_paid', 'payment_received')} variant="outline" className="w-full" size="sm">
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

          {/* Manual email */}
          <div className="bg-card border border-border rounded p-6 space-y-2">
            <h2 className="text-sm font-serif font-semibold mb-2 text-muted-foreground">Manuella mejl</h2>
            <Button onClick={() => sendEmail('booking_approved')} variant="ghost" size="sm" className="w-full justify-start" disabled={!!emailSending}>
              <Mail className="mr-2 h-4 w-4" /> Godkännande
            </Button>
            <Button onClick={() => sendEmail('payment_request')} variant="ghost" size="sm" className="w-full justify-start" disabled={!!emailSending}>
              <Mail className="mr-2 h-4 w-4" /> Betalningsförfrågan
            </Button>
            <Button onClick={() => sendEmail('payment_received')} variant="ghost" size="sm" className="w-full justify-start" disabled={!!emailSending}>
              <Mail className="mr-2 h-4 w-4" /> Betalningsbekräftelse
            </Button>
            <Button onClick={() => sendEmail('files_requested')} variant="ghost" size="sm" className="w-full justify-start" disabled={!!emailSending}>
              <Mail className="mr-2 h-4 w-4" /> Filbegäran
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default RequestDetail;
