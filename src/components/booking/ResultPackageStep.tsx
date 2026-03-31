import { useLanguage } from '@/contexts/LanguageContext';
import SelectableCard from './SelectableCard';
import type { BookingState, BookingAction } from './bookingConfig';

interface Props {
  state: BookingState;
  dispatch: React.Dispatch<BookingAction>;
}

const ResultPackageStep = ({ state, dispatch }: Props) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-serif font-semibold">{t('bb.s5.title')}</h2>
      <p className="text-muted-foreground font-sans text-sm mb-6">{t('bb.s5.sub')}</p>

      <div className="grid gap-4">
        <SelectableCard
          selected={state.resultPackage === 'session-only'}
          onClick={() => dispatch({ type: 'SET_RESULT_PACKAGE', id: 'session-only' })}
        >
          <p className="font-sans font-medium">{t('bb.s5.sessionOnly')}</p>
          <p className="text-muted-foreground font-sans text-sm mt-1">{t('bb.s5.sessionOnly.desc')}</p>
        </SelectableCard>

        <SelectableCard
          selected={state.resultPackage === 'record-your-song'}
          onClick={() => dispatch({ type: 'SET_RESULT_PACKAGE', id: 'record-your-song' })}
        >
          <p className="font-sans font-medium">{t('bb.s5.record')}</p>
          <p className="text-muted-foreground font-sans text-sm mt-1">{t('bb.s5.record.desc')}</p>
          <p className="text-primary font-sans text-lg font-semibold mt-2">8 900 SEK</p>
        </SelectableCard>

        <SelectableCard
          selected={state.resultPackage === 'radio-ready'}
          onClick={() => dispatch({ type: 'SET_RESULT_PACKAGE', id: 'radio-ready' })}
          badge={t('bb.badge.bestValue')}
        >
          <p className="font-sans font-medium">{t('bb.s5.radio')}</p>
          <p className="text-muted-foreground font-sans text-sm mt-1">{t('bb.s5.radio.desc')}</p>
          <p className="text-primary font-sans text-lg font-semibold mt-2">18 000 SEK</p>
        </SelectableCard>

        <SelectableCard
          selected={state.resultPackage === 'ep-package'}
          onClick={() => dispatch({ type: 'SET_RESULT_PACKAGE', id: 'ep-package' })}
        >
          <p className="font-sans font-medium">{t('bb.s5.ep')}</p>
          <p className="text-muted-foreground font-sans text-sm mt-1">{t('bb.s5.ep.desc')}</p>
          <p className="text-primary font-sans text-lg font-semibold mt-2">45 000 SEK</p>
        </SelectableCard>
      </div>

      {state.resultPackage === 'session-only' && (
        <div className="p-4 bg-secondary/50 border border-border rounded text-sm font-sans text-muted-foreground">
          💡 {t('bb.s5.nudge')}
        </div>
      )}
    </div>
  );
};

export default ResultPackageStep;
