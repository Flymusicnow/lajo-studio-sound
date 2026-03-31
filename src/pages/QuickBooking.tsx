import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import SelectableCard from '@/components/booking/SelectableCard';
import { CheckCircle, CalendarIcon, Loader2, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const SESSIONS = [
  { id: '4h-quick', label: '4h Studio Session', price: 3200, duration: '4 hours' },
  { id: '8h-quick', label: '8h Studio Session', price: 5900, duration: '8 hours' },
];

const QuickBooking = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [session, setSession] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const fetchBlocked = async () => {
      const { data } = await supabase.from('blocked_dates').select('date');
      if (data) {
        setBlockedDates(data.map((d) => new Date(d.date + 'T00:00:00')));
      }
    };
    fetchBlocked();
  }, []);

  const selectedSession = SESSIONS.find((s) => s.id === session);

  const handleSubmit = async () => {
    if (!session || !selectedDate || !name || !email) return;

    setIsLoading(true);
    try {
      // Find or create customer
      const { data: existing } = await supabase
        .from('customers')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      let customerId: string;
      if (existing) {
        customerId = existing.id;
      } else {
        const { data: newCustomer, error: custErr } = await supabase
          .from('customers')
          .insert({ name, email, phone: phone || null })
          .select('id')
          .single();
        if (custErr) throw custErr;
        customerId = newCustomer.id;
      }

      const price = selectedSession!.price;
      const deposit = Math.round(price / 2);

      const { error: bookErr } = await supabase.from('booking_requests').insert({
        customer_id: customerId,
        session_type: session,
        session_price: price,
        total_price: price,
        deposit_amount: deposit,
        creative_types: [],
        add_ons: [],
        requested_date: format(selectedDate, 'yyyy-MM-dd'),
        description: message || null,
        payment_choice: 'deposit',
      });

      if (bookErr) throw bookErr;

      // Send notification email
      try {
        await supabase.functions.invoke('send-studio-email', {
          body: {
            type: 'new_booking',
            customerName: name,
            customerEmail: email,
            sessionType: selectedSession!.label,
            totalPrice: price,
            requestedDate: format(selectedDate, 'yyyy-MM-dd'),
          },
        });
      } catch (e) {
        console.error('Email notification failed:', e);
      }

      setIsSubmitted(true);
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Something went wrong.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isDateBlocked = (date: Date) => {
    return (
      date < new Date(new Date().setHours(0, 0, 0, 0)) ||
      blockedDates.some((bd) => bd.toDateString() === date.toDateString())
    );
  };

  if (isSubmitted) {
    return (
      <Layout>
        <section className="min-h-[70vh] flex items-center justify-center px-4">
          <div className="max-w-md text-center">
            <CheckCircle className="h-16 w-16 text-primary mx-auto mb-6" />
            <h1 className="text-2xl font-serif font-semibold mb-3">{t('booking.success.title')}</h1>
            <p className="text-muted-foreground font-sans mb-6">{t('bb.confirm.text')}</p>
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              {t('booking.success.back')}
            </Button>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-20 px-4">
        <div className="max-w-xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="text-primary font-serif text-sm tracking-wider">{t('qb.label')}</span>
            <h1 className="text-3xl md:text-4xl font-serif font-semibold mt-2 mb-3">{t('qb.title')}</h1>
            <p className="text-muted-foreground font-sans text-sm max-w-md mx-auto">
              {t('qb.subtitle')}
            </p>
          </div>

          {/* Step 1: Session */}
          <div className="mb-10">
            <h2 className="font-serif font-semibold text-lg mb-4">{t('qb.step1')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SESSIONS.map((s) => (
                <SelectableCard
                  key={s.id}
                  selected={session === s.id}
                  onClick={() => setSession(s.id)}
                >
                  <p className="font-serif font-semibold">{s.label}</p>
                  <p className="text-primary font-semibold text-lg mt-1">
                    {s.price.toLocaleString('sv-SE')} SEK
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{s.duration}</p>
                </SelectableCard>
              ))}
            </div>
          </div>

          {/* Step 2: Date */}
          {session && (
            <div className="mb-10">
              <h2 className="font-serif font-semibold text-lg mb-4">{t('qb.step2')}</h2>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal h-12',
                      !selectedDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, 'PPP') : t('bb.s7.pickDate')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={isDateBlocked}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          {/* Step 3: Contact */}
          {session && selectedDate && (
            <div className="mb-10">
              <h2 className="font-serif font-semibold text-lg mb-4">{t('qb.step3')}</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="font-sans text-sm">{t('booking.name')} *</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label className="font-sans text-sm">{t('booking.email')} *</Label>
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
                </div>
                <div className="space-y-2">
                  <Label className="font-sans text-sm">{t('booking.phone')}</Label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" />
                </div>
                <div className="space-y-2">
                  <Label className="font-sans text-sm">{t('qb.message')}</Label>
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t('qb.messagePlaceholder')}
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Price summary + CTA */}
          {session && selectedDate && name && email && (
            <div className="bg-card border border-border rounded p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="font-sans text-sm text-muted-foreground">{selectedSession!.label}</span>
                <span className="font-semibold">{selectedSession!.price.toLocaleString('sv-SE')} SEK</span>
              </div>
              <div className="flex justify-between items-center mb-4 text-sm text-muted-foreground">
                <span>{t('bb.price.deposit')}</span>
                <span>{Math.round(selectedSession!.price / 2).toLocaleString('sv-SE')} SEK</span>
              </div>
              <div className="border-t border-border pt-4">
                <div className="flex justify-between items-center mb-1 text-xs text-muted-foreground">
                  <span>{format(selectedDate, 'PPP')}</span>
                </div>
              </div>
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full mt-4 gold-glow"
                size="lg"
              >
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t('bb.nav.sending')}</>
                ) : (
                  <>{t('qb.cta')} <ArrowRight className="ml-2 h-4 w-4" /></>
                )}
              </Button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default QuickBooking;
