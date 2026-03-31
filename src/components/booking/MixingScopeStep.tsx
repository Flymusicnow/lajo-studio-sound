import { useLanguage } from '@/contexts/LanguageContext';
import SelectableCard from './SelectableCard';
import type { BookingState, BookingAction } from './bookingConfig';

interface Props {
  state: BookingState;
  dispatch: React.Dispatch<BookingAction>;
}

const MixingScopeStep = ({ state, dispatch }: Props) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-serif font-semibold">{t('bb.s6.title')}</h2>
      <p className="text-muted-foreground font-sans text-sm mb-6">{t('bb.s6.sub')}</p>

      <div className="grid gap-3">
        <SelectableCard
          selected={state.mixingScope === '0-20'}
          onClick={() => dispatch({ type: 'SET_MIXING_SCOPE', scope: '0-20' })}
        >
          <p className="font-sans text-sm font-medium">{t('bb.s6.standard')}</p>
          <p className="text-muted-foreground font-sans text-xs mt-1">{t('bb.s6.standard.desc')}</p>
        </SelectableCard>

        <SelectableCard
          selected={state.mixingScope === '20-50'}
          onClick={() => dispatch({ type: 'SET_MIXING_SCOPE', scope: '20-50' })}
        >
          <p className="font-sans text-sm font-medium">{t('bb.s6.advanced')}</p>
          <p className="text-muted-foreground font-sans text-xs mt-1">{t('bb.s6.advanced.desc')}</p>
        </SelectableCard>

        <SelectableCard
          selected={state.mixingScope === '50+'}
          onClick={() => dispatch({ type: 'SET_MIXING_SCOPE', scope: '50+' })}
        >
          <p className="font-sans text-sm font-medium">{t('bb.s6.complex')}</p>
          <p className="text-muted-foreground font-sans text-xs mt-1">{t('bb.s6.complex.desc')}</p>
        </SelectableCard>
      </div>

      {(state.mixingScope === '20-50' || state.mixingScope === '50+') && (
        <p className="text-xs font-sans text-muted-foreground italic">
          {t('bb.s6.note')}
        </p>
      )}
    </div>
  );
};

export default MixingScopeStep;
