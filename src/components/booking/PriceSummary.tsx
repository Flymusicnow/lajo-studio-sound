import { useLanguage } from '@/contexts/LanguageContext';
import { calculateTotal, SESSIONS, ADDONS, RESULT_PACKAGES, MASTERING_PRICE_PER_TRACK } from './bookingConfig';
import type { BookingState } from './bookingConfig';

interface Props {
  state: BookingState;
}

const PriceSummary = ({ state }: Props) => {
  const { t } = useLanguage();
  const total = calculateTotal(state);
  const deposit = Math.round(total / 2);

  const session = SESSIONS.find(s => s.id === state.session);
  const pkg = RESULT_PACKAGES.find(p => p.id === state.resultPackage);

  return (
    <div className="bg-card border border-border rounded p-6 space-y-4">
      <h3 className="font-serif text-lg font-semibold">{t('bb.price.title')}</h3>
      <div className="w-10 h-[1px] bg-primary" />

      <div className="space-y-2 text-sm font-sans">
        {session && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t(`bb.s1.${session.id}`)}</span>
            <span>{session.price > 0 ? `${session.price.toLocaleString()} SEK` : '–'}</span>
          </div>
        )}

        {state.addOns.map(id => {
          const addon = ADDONS.find(a => a.id === id);
          return addon ? (
            <div key={id} className="flex justify-between">
              <span className="text-muted-foreground">{t(`bb.s3.${id === 'sound-design' ? 'sound' : id === 'extra-revision' ? 'revision' : id}`)}</span>
              <span>{addon.price.toLocaleString()} SEK</span>
            </div>
          ) : null;
        })}

        {state.mastering === 'per-track' && !pkg?.includesMastering && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t('bb.s4.perTrack')} ×{state.masteringTracks}</span>
            <span>{(state.masteringTracks * MASTERING_PRICE_PER_TRACK).toLocaleString()} SEK</span>
          </div>
        )}

        {pkg && pkg.price > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t(`bb.s5.${pkg.id === 'record-your-song' ? 'record' : pkg.id === 'radio-ready' ? 'radio' : 'ep'}`)}</span>
            <span>{pkg.price.toLocaleString()} SEK</span>
          </div>
        )}
      </div>

      <div className="border-t border-border pt-4 space-y-2">
        <div className="flex justify-between items-baseline">
          <span className="font-sans font-medium">{t('bb.price.total')}</span>
          <span className="text-primary font-sans text-2xl font-bold transition-all duration-300">
            {total.toLocaleString()} SEK
          </span>
        </div>

        {total > 0 && (
          <>
            <div className="flex justify-between text-sm text-muted-foreground font-sans">
              <span>{t('bb.price.deposit')}</span>
              <span>{deposit.toLocaleString()} SEK</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground font-sans">
              <span>{t('bb.price.remaining')}</span>
              <span>{(total - deposit).toLocaleString()} SEK</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PriceSummary;
