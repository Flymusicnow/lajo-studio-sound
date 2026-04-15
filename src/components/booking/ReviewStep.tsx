import { useLanguage } from '@/contexts/LanguageContext';
import { calculateTotal, calculateWorkloadHours } from './bookingConfig';
import type { BookingState } from './bookingConfig';

interface Props {
  state: BookingState;
}

const ReviewStep = ({ state }: Props) => {
  const { t } = useLanguage();
  const total = calculateTotal(state);
  const deposit = Math.round(total / 2);
  const workload = calculateWorkloadHours(state);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif font-semibold">{t('bb.s8.title')}</h2>
      <p className="text-muted-foreground font-sans text-sm">{t('bb.s8.sub')}</p>

      <div className="bg-card border border-border rounded p-6 space-y-3 text-sm font-sans">
        {state.resultPackage && state.resultPackage !== 'session-only' ? null : (
          <Row label={t('bb.s1.title')} value={t(`bb.s1.${state.session}`)} />
        )}
        {state.creativeTypes.length > 0 && (
          <Row label={t('bb.s2.title')} value={state.creativeTypes.map(ct => t(`bb.s2.${ct === 'new-song' ? 'new' : ct === 'develop-existing' ? 'develop' : ct === 'beat-production' ? 'beat' : ct}`)).join(', ')} />
        )}
        {state.addOns.length > 0 && (
          <Row label={t('bb.s3.title')} value={state.addOns.map(a => t(`bb.s3.${a === 'sound-design' ? 'sound' : a === 'extra-revision' ? 'revision' : a}`)).join(', ')} />
        )}
        {state.resultPackage && (
          <Row label={t('bb.s5.title')} value={t(`bb.s5.${
            state.resultPackage === 'record-your-song' ? 'record' :
            state.resultPackage === 'radio-ready' ? 'radio' :
            state.resultPackage === 'session-only' ? 'sessionOnly' :
            state.resultPackage === 'mixing-only' ? 'mixOnly' :
            state.resultPackage === 'mastering-only' ? 'masterOnly' :
            state.resultPackage === 'mix-and-master' ? 'mixMaster' :
            state.resultPackage === 'production-support' ? 'prodSupport' :
            'ep'
          }`)} />
        )}
        {state.mixingScope && (
          <Row label={t('bb.s6.title')} value={t(`bb.s6.${state.mixingScope === '0-20' ? 'standard' : state.mixingScope === '20-50' ? 'advanced' : 'complex'}`)} />
        )}
        <Row label={t('booking.name')} value={state.name} />
        <Row label={t('booking.email')} value={state.email} />
        {state.phone && <Row label={t('booking.phone')} value={state.phone} />}
        {state.promoCode && <Row label={t('bb.s7.promo')} value={state.promoCode} />}
        <Row label={t('bb.s7.payment')} value={state.paymentChoice === 'deposit' ? t('bb.s7.deposit') : t('bb.s7.full')} />
        <Row label={t('bb.s8.workload')} value={`~${workload}h`} />
      </div>

      <div className="flex justify-between items-baseline pt-2">
        <span className="font-sans font-medium">{t('bb.price.total')}</span>
        <span className="text-primary font-sans text-3xl font-bold">{total.toLocaleString()} SEK</span>
      </div>
      {total > 0 && (
        <div className="flex justify-between text-sm text-muted-foreground font-sans">
          <span>{state.paymentChoice === 'deposit' ? t('bb.price.deposit') : t('bb.s7.full')}</span>
          <span>{state.paymentChoice === 'deposit' ? `${deposit.toLocaleString()} SEK` : `${total.toLocaleString()} SEK`}</span>
        </div>
      )}
    </div>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between py-1 border-b border-border/50">
    <span className="text-muted-foreground">{label}</span>
    <span className="text-foreground text-right max-w-[60%]">{value}</span>
  </div>
);

export default ReviewStep;
