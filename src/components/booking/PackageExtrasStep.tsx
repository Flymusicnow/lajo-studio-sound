import { useLanguage } from '@/contexts/LanguageContext';
import SelectableCard from './SelectableCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, X, Clock, Minus, Plus, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { RESULT_PACKAGES, ADDONS, MASTERING_PRICE_PER_TRACK } from './bookingConfig';
import type { BookingState, BookingAction } from './bookingConfig';

interface Props {
  state: BookingState;
  dispatch: React.Dispatch<BookingAction>;
  isRemote: boolean;
}

interface PackageDetail {
  id: string;
  labelKey: string;
  descKey: string;
  price: number;
  includes: string[];
  notIncluded: string[];
}

const PackageExtrasStep = ({ state, dispatch, isRemote }: Props) => {
  const { t } = useLanguage();
  const [extrasOpen, setExtrasOpen] = useState(false);

  const allPackages: PackageDetail[] = [
    { id: 'session-only', labelKey: 'bb.s5.sessionOnly', descKey: 'bb.s5.sessionOnly.desc', price: 0,
      includes: [t('bb.s5.inc.recording'), t('bb.s5.inc.basicMix'), t('bb.s5.inc.fileExport')],
      notIncluded: [t('bb.s5.exc.fullMix'), t('bb.s5.exc.mastering'), t('bb.s5.exc.production')] },
    { id: 'record-your-song', labelKey: 'bb.s5.record', descKey: 'bb.s5.record.desc', price: 8900,
      includes: [t('bb.s5.inc.recording'), t('bb.s5.inc.demoMix'), t('bb.s5.inc.delivery5')],
      notIncluded: [t('bb.s5.exc.mastering'), t('bb.s5.exc.fullProduction')] },
    { id: 'radio-ready', labelKey: 'bb.s5.radio', descKey: 'bb.s5.radio.desc', price: 18000,
      includes: [t('bb.s5.inc.fullProduction'), t('bb.s5.inc.proMix'), t('bb.s5.inc.mastering'), t('bb.s5.inc.delivery14')],
      notIncluded: [] },
    { id: 'ep-package', labelKey: 'bb.s5.ep', descKey: 'bb.s5.ep.desc', price: 45000,
      includes: [t('bb.s5.inc.3songs'), t('bb.s5.inc.fullProduction'), t('bb.s5.inc.proMix'), t('bb.s5.inc.mastering')],
      notIncluded: [] },
    { id: 'mixing-only', labelKey: 'bb.s5.mixOnly', descKey: 'bb.s5.mixOnly.desc', price: 5500,
      includes: [t('bb.s5.inc.proMix'), t('bb.s5.inc.stemDelivery'), t('bb.s5.inc.revisions2')],
      notIncluded: [t('bb.s5.exc.mastering'), t('bb.s5.exc.production')] },
    { id: 'mastering-only', labelKey: 'bb.s5.masterOnly', descKey: 'bb.s5.masterOnly.desc', price: 1500,
      includes: [t('bb.s5.inc.digitalMaster')], notIncluded: [t('bb.s5.exc.fullMix'), t('bb.s5.exc.production')] },
    { id: 'mix-and-master', labelKey: 'bb.s5.mixMaster', descKey: 'bb.s5.mixMaster.desc', price: 6500,
      includes: [t('bb.s5.inc.mixAndMaster'), t('bb.s5.inc.revisions2'), t('bb.s5.inc.delivery10')],
      notIncluded: [t('bb.s5.exc.production')] },
    { id: 'production-support', labelKey: 'bb.s5.prodSupport', descKey: 'bb.s5.prodSupport.desc', price: 12000,
      includes: [t('bb.s5.inc.arrangement'), t('bb.s5.inc.soundDesign'), t('bb.s5.inc.delivery14')],
      notIncluded: [t('bb.s5.exc.mastering')] },
  ];

  const packages = allPackages.filter(pkg => {
    const config = RESULT_PACKAGES.find(rp => rp.id === pkg.id);
    if (!config) return false;
    if (isRemote && config.studioOnly) return false;
    if (!isRemote && config.remoteOnly) return false;
    return true;
  });

  const pkg = RESULT_PACKAGES.find(p => p.id === state.resultPackage);
  const masteringIncluded = pkg?.includesMastering;

  const addonLabels: Record<string, string> = {
    arrangement: t('bb.s3.arrangement'),
    vocal: t('bb.s3.vocal'),
    'sound-design': t('bb.s3.sound'),
    'extra-revision': t('bb.s3.revision'),
    express: t('bb.s3.express'),
  };

  const setTracks = (count: number) =>
    dispatch({ type: 'SET_MASTERING_TRACKS', count: Math.max(1, Math.min(99, count)) });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-serif font-semibold">{t('bb.s5.title2')}</h2>
        <p className="text-muted-foreground font-sans text-sm mt-1">{t('bb.s5.sub2')}</p>
      </div>

      {/* Session (studio only) */}
      {!isRemote && (
        <section className="space-y-3">
          <p className="text-xs font-sans text-muted-foreground font-medium uppercase tracking-wider">
            {t('bb.s1.title')}
          </p>
          <div className="grid gap-3">
            <SelectableCard selected={state.session === '4h'} onClick={() => dispatch({ type: 'SET_SESSION', session: '4h' })}>
              <div className="flex justify-between items-center">
                <p className="font-sans font-medium">{t('bb.s1.4h')}</p>
                <p className="text-primary font-sans font-semibold">4 500 SEK</p>
              </div>
            </SelectableCard>
            <SelectableCard selected={state.session === '8h'} onClick={() => dispatch({ type: 'SET_SESSION', session: '8h' })} badge={t('bb.badge.popular')}>
              <div className="flex justify-between items-center">
                <p className="font-sans font-medium">{t('bb.s1.8h')}</p>
                <p className="text-primary font-sans font-semibold">8 500 SEK</p>
              </div>
            </SelectableCard>
            <SelectableCard selected={state.session === 'custom'} onClick={() => dispatch({ type: 'SET_SESSION', session: 'custom' })}>
              <p className="font-sans font-medium">{t('bb.s1.custom')}</p>
              <p className="text-muted-foreground font-sans text-xs mt-1">{t('bb.s1.custom.desc')}</p>
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
        </section>
      )}

      {/* Packages */}
      <section className="space-y-3">
        <p className="text-xs font-sans text-muted-foreground font-medium uppercase tracking-wider">
          {t('bb.s5.title')}
        </p>
        <div className="grid gap-3">
          {packages.map(p => {
            const isSelected = state.resultPackage === p.id;
            return (
              <SelectableCard
                key={p.id}
                selected={isSelected}
                onClick={() => dispatch({ type: 'SET_RESULT_PACKAGE', id: p.id })}
                badge={p.id === 'radio-ready' || p.id === 'mix-and-master' ? t('bb.badge.bestValue') : undefined}
              >
                <div className="flex justify-between items-start">
                  <p className="font-sans font-medium">{t(p.labelKey)}</p>
                  {p.price > 0 && (
                    <p className="text-primary font-sans text-lg font-semibold ml-4 shrink-0">
                      {p.price.toLocaleString()} SEK
                    </p>
                  )}
                </div>
                <div className={`overflow-hidden transition-all duration-300 ${isSelected ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
                  <p className="text-muted-foreground font-sans text-sm mb-3">{t(p.descKey)}</p>
                  {p.includes.length > 0 && (
                    <ul className="space-y-1 mb-2">
                      {p.includes.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm font-sans text-muted-foreground">
                          <Check size={14} className="text-primary shrink-0" /> {item}
                        </li>
                      ))}
                    </ul>
                  )}
                  {p.notIncluded.length > 0 && (
                    <ul className="space-y-1">
                      {p.notIncluded.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm font-sans text-muted-foreground/60">
                          <X size={14} className="shrink-0" /> {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {!isSelected && (
                  <p className="text-muted-foreground font-sans text-sm mt-1">{t(p.descKey)}</p>
                )}
              </SelectableCard>
            );
          })}
        </div>
      </section>

      {/* Mixing scope (required) */}
      <section className="space-y-3">
        <p className="text-xs font-sans text-muted-foreground font-medium uppercase tracking-wider">
          {t('bb.s6.title')}
        </p>
        <div className="grid gap-3">
          {[
            { id: '0-20', labelKey: 'bb.s6.standard', descKey: 'bb.s6.standard.desc' },
            { id: '20-50', labelKey: 'bb.s6.advanced', descKey: 'bb.s6.advanced.desc' },
            { id: '50+', labelKey: 'bb.s6.complex', descKey: 'bb.s6.complex.desc' },
          ].map(opt => (
            <SelectableCard
              key={opt.id}
              selected={state.mixingScope === opt.id}
              onClick={() => dispatch({ type: 'SET_MIXING_SCOPE', scope: opt.id })}
            >
              <p className="font-sans text-sm font-medium">{t(opt.labelKey)}</p>
              <p className="text-muted-foreground font-sans text-xs mt-1">{t(opt.descKey)}</p>
            </SelectableCard>
          ))}
        </div>
      </section>

      {/* Optional extras — collapsible */}
      <section className="border-t border-border pt-6">
        <button
          type="button"
          onClick={() => setExtrasOpen(!extrasOpen)}
          className="w-full flex items-center justify-between text-left mb-4"
        >
          <div>
            <p className="font-sans font-medium">{t('bb.extras.title')}</p>
            <p className="text-muted-foreground font-sans text-xs mt-0.5">{t('bb.extras.sub')}</p>
          </div>
          <ChevronDown size={18} className={`text-muted-foreground transition-transform ${extrasOpen ? 'rotate-180' : ''}`} />
        </button>

        {extrasOpen && (
          <div className="space-y-6">
            {/* Add-ons */}
            <div className="space-y-3">
              <p className="text-xs font-sans text-muted-foreground font-medium uppercase tracking-wider">
                {t('bb.s3.title')}
              </p>
              <div className="grid gap-2">
                {ADDONS.map(addon => (
                  <SelectableCard
                    key={addon.id}
                    selected={state.addOns.includes(addon.id)}
                    onClick={() => dispatch({ type: 'TOGGLE_ADDON', id: addon.id })}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <p className="font-sans text-sm font-medium">{addonLabels[addon.id]}</p>
                        {addon.estimatedHours > 0 && (
                          <span className="inline-flex items-center gap-1 text-xs font-sans text-muted-foreground/70 bg-secondary/50 px-1.5 py-0.5 rounded">
                            <Clock size={10} /> +{addon.estimatedHours}h
                          </span>
                        )}
                      </div>
                      <p className="text-primary font-sans text-sm font-semibold">{addon.price.toLocaleString()} SEK</p>
                    </div>
                  </SelectableCard>
                ))}
              </div>
            </div>

            {/* Mastering */}
            <div className="space-y-3">
              <p className="text-xs font-sans text-muted-foreground font-medium uppercase tracking-wider">
                {t('bb.s4.title')}
              </p>
              {masteringIncluded ? (
                <div className="p-3 bg-secondary/50 border border-primary/20 rounded text-sm font-sans text-muted-foreground">
                  {t('bb.s4.included')}
                </div>
              ) : (
                <div className="grid gap-2">
                  <SelectableCard selected={state.mastering === 'none'} onClick={() => dispatch({ type: 'SET_MASTERING', value: 'none' })}>
                    <p className="font-sans text-sm font-medium">{t('bb.s4.none')}</p>
                  </SelectableCard>
                  <SelectableCard selected={state.mastering === 'per-track'} onClick={() => dispatch({ type: 'SET_MASTERING', value: 'per-track' })}>
                    <div className="flex justify-between items-center">
                      <p className="font-sans text-sm font-medium">{t('bb.s4.perTrack')}</p>
                      <p className="text-primary font-sans text-sm font-semibold">
                        {MASTERING_PRICE_PER_TRACK.toLocaleString()} SEK / {t('bb.s4.track')}
                      </p>
                    </div>
                  </SelectableCard>
                  {state.mastering === 'per-track' && (
                    <div className="flex items-center gap-4 mt-1">
                      <label className="text-sm font-sans text-muted-foreground">{t('bb.s4.howMany')}</label>
                      <div className="flex items-center">
                        <Button type="button" variant="outline" size="icon"
                          className="h-10 w-10 rounded-r-none border-border"
                          onClick={() => setTracks(state.masteringTracks - 1)}
                          disabled={state.masteringTracks <= 1}>
                          <Minus size={16} />
                        </Button>
                        <div className="h-10 w-12 flex items-center justify-center border-y border-border bg-input text-sm font-sans font-medium">
                          {state.masteringTracks}
                        </div>
                        <Button type="button" variant="outline" size="icon"
                          className="h-10 w-10 rounded-l-none border-border"
                          onClick={() => setTracks(state.masteringTracks + 1)}
                          disabled={state.masteringTracks >= 99}>
                          <Plus size={16} />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default PackageExtrasStep;
