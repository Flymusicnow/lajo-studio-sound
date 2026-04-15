import { useEffect, useState, useMemo } from 'react';
import { format, addDays } from 'date-fns';
import { CalendarIcon, AlertCircle, Tag } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import SelectableCard from './SelectableCard';
import { cn } from '@/lib/utils';
import { calculateWorkloadHours, calculateMinDeadlineDays } from './bookingConfig';
import type { BookingState, BookingAction } from './bookingConfig';

interface Props {
  state: BookingState;
  dispatch: React.Dispatch<BookingAction>;
}

const DetailsStep = ({ state, dispatch }: Props) => {
  const { t, language } = useLanguage();
  const setField = (field: string, value: any) => dispatch({ type: 'SET_FIELD', field, value });
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [slotCap, setSlotCap] = useState(7);
  const [bookedThisMonth, setBookedThisMonth] = useState(0);

  const workloadHours = useMemo(() => calculateWorkloadHours(state), [state.session, state.addOns, state.mastering, state.masteringTracks]);
  const minDeadlineDays = useMemo(() => calculateMinDeadlineDays(workloadHours), [workloadHours]);
  const minDeadlineDate = useMemo(() => addDays(new Date(), minDeadlineDays), [minDeadlineDays]);

  useEffect(() => {
    const fetchAvailability = async () => {
      const [{ data: blocked }, { data: settings }, { data: bookings }] = await Promise.all([
        supabase.from('blocked_dates').select('date'),
        supabase.from('studio_settings').select('monthly_slot_cap').eq('id', 1).single(),
        supabase.from('booking_requests').select('created_at, status').in('status', ['confirmed', 'paid']),
      ]);

      if (blocked) {
        setBlockedDates(blocked.map(b => new Date(b.date + 'T00:00:00')));
      }
      if (settings) setSlotCap(settings.monthly_slot_cap);
      if (bookings) {
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        setBookedThisMonth(bookings.filter(b => new Date(b.created_at) >= monthStart).length);
      }
    };
    fetchAvailability();
  }, []);

  const isDateBlocked = (date: Date) => {
    if (date < minDeadlineDate) return true;
    return blockedDates.some(bd => 
      bd.getFullYear() === date.getFullYear() && bd.getMonth() === date.getMonth() && bd.getDate() === date.getDate()
    );
  };

  const slotsRemaining = slotCap - bookedThisMonth;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif font-semibold">{t('bb.s7.title')}</h2>

      {/* Availability warning */}
      {slotsRemaining <= 2 && slotsRemaining > 0 && (
        <div className="flex items-center gap-2 p-3 bg-primary/10 border border-primary/20 rounded text-sm font-sans">
          <AlertCircle className="h-4 w-4 text-primary shrink-0" />
          <span>{language === 'sv' ? `Begränsad tillgänglighet — ${slotsRemaining} plats(er) kvar denna månad` : `Limited availability — ${slotsRemaining} slot(s) remaining this month`}</span>
        </div>
      )}

      {/* Project details */}
      <div className="space-y-4">
        <p className="text-sm font-sans text-muted-foreground font-medium uppercase tracking-wider">{t('bb.s7.project')}</p>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-sans text-muted-foreground mb-1">{t('bb.s7.songs')}</label>
            <Input value={state.songCount} onChange={e => setField('songCount', e.target.value)} className="bg-input border-border h-12" />
          </div>
          <div>
            <label className="block text-sm font-sans text-muted-foreground mb-1">{t('bb.s7.tracks')}</label>
            <Input value={state.trackCount} onChange={e => setField('trackCount', e.target.value)} className="bg-input border-border h-12" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-sans text-muted-foreground mb-1">{t('bb.s7.reference')}</label>
          <Input value={state.referenceUrl} onChange={e => setField('referenceUrl', e.target.value)} placeholder="https://..." className="bg-input border-border h-12" />
        </div>

        <div>
          <label className="block text-sm font-sans text-muted-foreground mb-1">{t('bb.s7.deadline')}</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn('w-full justify-start text-left font-normal bg-input border-border h-12', !state.deadline && 'text-muted-foreground')}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {state.deadline ? format(state.deadline, 'PPP') : t('bb.s7.pickDate')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={state.deadline} onSelect={d => setField('deadline', d)} disabled={isDateBlocked} className="p-3 pointer-events-auto" />
            </PopoverContent>
          </Popover>
          <p className="text-xs text-muted-foreground mt-1.5 font-sans">
            {language === 'sv' 
              ? `Baserat på ditt projekt, tidigaste leverans: ${format(minDeadlineDate, 'PPP')}`
              : `Based on your project, earliest delivery: ${format(minDeadlineDate, 'PPP')}`
            }
          </p>
        </div>

        <div>
          <label className="block text-sm font-sans text-muted-foreground mb-1">{t('bb.s7.desc')}</label>
          <Textarea
            value={state.description}
            onChange={e => setField('description', e.target.value.slice(0, 300))}
            className="bg-input border-border min-h-[100px]"
            placeholder="..."
          />
          <p className="text-xs text-muted-foreground mt-1 font-sans">{state.description.length}/300</p>
        </div>
      </div>

      {/* Track prep info */}
      <div className="p-4 bg-secondary/30 border border-border rounded text-sm font-sans">
        <p className="font-medium text-foreground mb-2">{t('bb.s7.prep.title')}</p>
        <ul className="text-muted-foreground space-y-1 text-xs">
          <li>• {t('bb.s7.prep.1')}</li>
          <li>• {t('bb.s7.prep.2')}</li>
          <li>• {t('bb.s7.prep.3')}</li>
          <li>• {t('bb.s7.prep.4')}</li>
        </ul>
      </div>

      {/* Contact */}
      <div className="space-y-4">
        <p className="text-sm font-sans text-muted-foreground font-medium uppercase tracking-wider">{t('bb.s7.contact')}</p>
        <div>
          <label className="block text-sm font-sans text-muted-foreground mb-1">{t('booking.name')} *</label>
          <Input value={state.name} onChange={e => setField('name', e.target.value)} className="bg-input border-border h-12" required />
        </div>
        <div>
          <label className="block text-sm font-sans text-muted-foreground mb-1">{t('booking.email')} *</label>
          <Input type="email" value={state.email} onChange={e => setField('email', e.target.value)} className="bg-input border-border h-12" required />
        </div>
        <div>
          <label className="block text-sm font-sans text-muted-foreground mb-1">{t('booking.phone')}</label>
          <Input type="tel" value={state.phone} onChange={e => setField('phone', e.target.value)} className="bg-input border-border h-12" />
        </div>
      </div>

      {/* Promo code */}
      <div className="space-y-2">
        <p className="text-sm font-sans text-muted-foreground font-medium uppercase tracking-wider">{t('bb.s7.promo')}</p>
        <div className="relative">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={state.promoCode}
            onChange={e => setField('promoCode', e.target.value.toUpperCase())}
            placeholder={t('bb.s7.promo.placeholder')}
            className="bg-input border-border h-12 pl-10 uppercase tracking-wider"
          />
        </div>
      </div>

      {/* Payment choice */}
      <div className="space-y-3">
        <p className="text-sm font-sans text-muted-foreground font-medium uppercase tracking-wider">{t('bb.s7.payment')}</p>
        <div className="grid gap-3">
          <SelectableCard
            selected={state.paymentChoice === 'deposit'}
            onClick={() => setField('paymentChoice', 'deposit')}
          >
            <p className="font-sans text-sm font-medium">{t('bb.s7.deposit')}</p>
            <p className="text-muted-foreground font-sans text-xs mt-1">{t('bb.s7.deposit.desc')}</p>
          </SelectableCard>
          <SelectableCard
            selected={state.paymentChoice === 'full'}
            onClick={() => setField('paymentChoice', 'full')}
          >
            <p className="font-sans text-sm font-medium">{t('bb.s7.full')}</p>
          </SelectableCard>
        </div>
      </div>
    </div>
  );
};

export default DetailsStep;
