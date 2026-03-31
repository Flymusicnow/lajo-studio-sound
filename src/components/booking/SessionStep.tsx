import { useLanguage } from '@/contexts/LanguageContext';
import SelectableCard from './SelectableCard';
import { Input } from '@/components/ui/input';
import type { BookingState, BookingAction } from './bookingConfig';

interface Props {
  state: BookingState;
  dispatch: React.Dispatch<BookingAction>;
}

const SessionStep = ({ state, dispatch }: Props) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-serif font-semibold">{t('bb.s1.title')}</h2>
      <p className="text-muted-foreground font-sans text-sm mb-6">{t('bb.s1.sub')}</p>

      <div className="grid gap-4">
        <SelectableCard
          selected={state.session === '4h'}
          onClick={() => dispatch({ type: 'SET_SESSION', session: '4h' })}
        >
          <p className="font-sans font-medium">{t('bb.s1.4h')}</p>
          <p className="text-primary font-sans text-lg font-semibold mt-1">4 500 SEK</p>
        </SelectableCard>

        <SelectableCard
          selected={state.session === '8h'}
          onClick={() => dispatch({ type: 'SET_SESSION', session: '8h' })}
          badge={t('bb.badge.popular')}
        >
          <p className="font-sans font-medium">{t('bb.s1.8h')}</p>
          <p className="text-primary font-sans text-lg font-semibold mt-1">8 500 SEK</p>
        </SelectableCard>

        <SelectableCard
          selected={state.session === 'custom'}
          onClick={() => dispatch({ type: 'SET_SESSION', session: 'custom' })}
        >
          <p className="font-sans font-medium">{t('bb.s1.custom')}</p>
          <p className="text-muted-foreground font-sans text-sm mt-1">{t('bb.s1.custom.desc')}</p>
        </SelectableCard>

        {state.session === 'custom' && (
          <Input
            value={state.customSessionText}
            onChange={e => dispatch({ type: 'SET_CUSTOM_SESSION_TEXT', text: e.target.value })}
            placeholder={t('bb.s1.custom.placeholder')}
            className="bg-input border-border"
          />
        )}
      </div>
    </div>
  );
};

export default SessionStep;
