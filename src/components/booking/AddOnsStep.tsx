import { useLanguage } from '@/contexts/LanguageContext';
import SelectableCard from './SelectableCard';
import { ADDONS } from './bookingConfig';
import type { BookingState, BookingAction } from './bookingConfig';

interface Props {
  state: BookingState;
  dispatch: React.Dispatch<BookingAction>;
}

const AddOnsStep = ({ state, dispatch }: Props) => {
  const { t } = useLanguage();

  const addonLabels: Record<string, { label: string; price: string }> = {
    arrangement: { label: t('bb.s3.arrangement'), price: '1 500 SEK' },
    vocal: { label: t('bb.s3.vocal'), price: '2 000 SEK' },
    'sound-design': { label: t('bb.s3.sound'), price: '1 500 SEK' },
    'extra-revision': { label: t('bb.s3.revision'), price: '1 000 SEK' },
    express: { label: t('bb.s3.express'), price: '2 500 SEK' },
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-serif font-semibold">{t('bb.s3.title')}</h2>
      <p className="text-muted-foreground font-sans text-sm mb-6">{t('bb.s3.sub')}</p>

      <div className="grid gap-3">
        {ADDONS.map(addon => {
          const info = addonLabels[addon.id];
          return (
            <SelectableCard
              key={addon.id}
              selected={state.addOns.includes(addon.id)}
              onClick={() => dispatch({ type: 'TOGGLE_ADDON', id: addon.id })}
            >
              <div className="flex justify-between items-center">
                <p className="font-sans text-sm font-medium">{info.label}</p>
                <p className="text-primary font-sans text-sm font-semibold">{info.price}</p>
              </div>
            </SelectableCard>
          );
        })}
      </div>
    </div>
  );
};

export default AddOnsStep;
