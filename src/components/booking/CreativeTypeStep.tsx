import { useLanguage } from '@/contexts/LanguageContext';
import SelectableCard from './SelectableCard';
import { Input } from '@/components/ui/input';
import type { BookingState, BookingAction } from './bookingConfig';

interface Props {
  state: BookingState;
  dispatch: React.Dispatch<BookingAction>;
}

const CreativeTypeStep = ({ state, dispatch }: Props) => {
  const { t } = useLanguage();

  const types = [
    { id: 'new-song', label: t('bb.s2.new') },
    { id: 'develop-existing', label: t('bb.s2.develop') },
    { id: 'topline', label: t('bb.s2.topline') },
    { id: 'beat-production', label: t('bb.s2.beat') },
    { id: 'mixing', label: t('bb.s2.mixing') },
    { id: 'other', label: t('bb.s2.other') },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-serif font-semibold">{t('bb.s2.title')}</h2>
      <p className="text-muted-foreground font-sans text-sm mb-6">{t('bb.s2.sub')}</p>

      <div className="grid grid-cols-2 gap-3">
        {types.map(type => (
          <SelectableCard
            key={type.id}
            selected={state.creativeTypes.includes(type.id)}
            onClick={() => dispatch({ type: 'TOGGLE_CREATIVE_TYPE', id: type.id })}
          >
            <p className="font-sans text-sm font-medium">{type.label}</p>
          </SelectableCard>
        ))}
      </div>

      {state.creativeTypes.includes('other') && (
        <Input
          value={state.creativeOtherText}
          onChange={e => dispatch({ type: 'SET_CREATIVE_OTHER_TEXT', text: e.target.value })}
          placeholder={t('bb.s2.other.placeholder')}
          className="bg-input border-border mt-3"
        />
      )}
    </div>
  );
};

export default CreativeTypeStep;
