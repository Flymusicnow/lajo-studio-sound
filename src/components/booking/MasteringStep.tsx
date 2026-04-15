import { useLanguage } from '@/contexts/LanguageContext';
import SelectableCard from './SelectableCard';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';
import { MASTERING_PRICE_PER_TRACK, RESULT_PACKAGES } from './bookingConfig';
import type { BookingState, BookingAction } from './bookingConfig';

interface Props {
  state: BookingState;
  dispatch: React.Dispatch<BookingAction>;
}

const MasteringStep = ({ state, dispatch }: Props) => {
  const { t } = useLanguage();

  const pkg = RESULT_PACKAGES.find(p => p.id === state.resultPackage);
  const masteringIncluded = pkg?.includesMastering;

  const setTracks = (count: number) => {
    dispatch({ type: 'SET_MASTERING_TRACKS', count: Math.max(1, Math.min(99, count)) });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-serif font-semibold">{t('bb.s4.title')}</h2>
      <p className="text-muted-foreground font-sans text-sm mb-6">{t('bb.s4.sub')}</p>

      {masteringIncluded && (
        <div className="p-4 bg-secondary/50 border border-primary/20 rounded text-sm font-sans text-muted-foreground">
          {t('bb.s4.included')}
        </div>
      )}

      {!masteringIncluded && (
        <div className="grid gap-3">
          <SelectableCard
            selected={state.mastering === 'none'}
            onClick={() => dispatch({ type: 'SET_MASTERING', value: 'none' })}
          >
            <p className="font-sans text-sm font-medium">{t('bb.s4.none')}</p>
          </SelectableCard>

          <SelectableCard
            selected={state.mastering === 'per-track'}
            onClick={() => dispatch({ type: 'SET_MASTERING', value: 'per-track' })}
          >
            <div className="flex justify-between items-center">
              <p className="font-sans text-sm font-medium">{t('bb.s4.perTrack')}</p>
              <p className="text-primary font-sans text-sm font-semibold">
                {MASTERING_PRICE_PER_TRACK.toLocaleString()} SEK / {t('bb.s4.track')}
              </p>
            </div>
          </SelectableCard>

          {state.mastering === 'per-track' && (
            <div className="flex items-center gap-4 mt-2">
              <label className="text-sm font-sans text-muted-foreground">{t('bb.s4.howMany')}</label>
              <div className="flex items-center gap-0">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-r-none border-border"
                  onClick={() => setTracks(state.masteringTracks - 1)}
                  disabled={state.masteringTracks <= 1}
                >
                  <Minus size={18} />
                </Button>
                <div className="h-12 w-14 flex items-center justify-center border-y border-border bg-input text-sm font-sans font-medium">
                  {state.masteringTracks}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-l-none border-border"
                  onClick={() => setTracks(state.masteringTracks + 1)}
                  disabled={state.masteringTracks >= 99}
                >
                  <Plus size={18} />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MasteringStep;
