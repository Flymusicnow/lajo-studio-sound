import { useLanguage } from '@/contexts/LanguageContext';
import SelectableCard from './SelectableCard';
import { Mic, Globe } from 'lucide-react';
import type { BookingState, BookingAction } from './bookingConfig';

interface Props {
  state: BookingState;
  dispatch: React.Dispatch<BookingAction>;
}

const WorkModeStep = ({ state, dispatch }: Props) => {
  const { t } = useLanguage();

  const options = [
    { id: 'studio' as const, icon: Mic, labelKey: 'bb.s0.studio', descKey: 'bb.s0.studio.desc' },
    { id: 'remote' as const, icon: Globe, labelKey: 'bb.s0.remote', descKey: 'bb.s0.remote.desc' },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-serif font-semibold">{t('bb.s0.title')}</h2>
      <p className="text-muted-foreground font-sans text-sm mb-6">{t('bb.s0.sub')}</p>

      <div className="grid gap-4">
        {options.map(({ id, icon: Icon, labelKey, descKey }) => (
          <SelectableCard
            key={id}
            selected={state.workMode === id}
            onClick={() => dispatch({ type: 'SET_WORK_MODE', workMode: id })}
          >
            <div className="flex items-center gap-4">
              <Icon size={24} className="text-primary shrink-0" />
              <div>
                <p className="font-sans font-medium">{t(labelKey)}</p>
                <p className="text-muted-foreground font-sans text-sm mt-1">{t(descKey)}</p>
              </div>
            </div>
          </SelectableCard>
        ))}
      </div>
    </div>
  );
};

export default WorkModeStep;
