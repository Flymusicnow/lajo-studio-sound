import { useLanguage } from '@/contexts/LanguageContext';
import SelectableCard from './SelectableCard';
import { Check, X } from 'lucide-react';
import { RESULT_PACKAGES } from './bookingConfig';
import type { BookingState, BookingAction } from './bookingConfig';

interface Props {
  state: BookingState;
  dispatch: React.Dispatch<BookingAction>;
  isRemote?: boolean;
}

interface PackageDetail {
  id: string;
  labelKey: string;
  descKey: string;
  price: number;
  includes: string[];
  notIncluded: string[];
}

const PACKAGE_LABEL_MAP: Record<string, string> = {
  'session-only': 'bb.s5.sessionOnly',
  'record-your-song': 'bb.s5.record',
  'radio-ready': 'bb.s5.radio',
  'ep-package': 'bb.s5.ep',
  'mixing-only': 'bb.s5.mixOnly',
  'mastering-only': 'bb.s5.masterOnly',
  'mix-and-master': 'bb.s5.mixMaster',
  'production-support': 'bb.s5.prodSupport',
};

const ResultPackageStep = ({ state, dispatch, isRemote }: Props) => {
  const { t } = useLanguage();

  const allPackages: PackageDetail[] = [
    // Studio packages
    {
      id: 'session-only',
      labelKey: 'bb.s5.sessionOnly',
      descKey: 'bb.s5.sessionOnly.desc',
      price: 0,
      includes: [t('bb.s5.inc.recording'), t('bb.s5.inc.basicMix'), t('bb.s5.inc.fileExport')],
      notIncluded: [t('bb.s5.exc.fullMix'), t('bb.s5.exc.mastering'), t('bb.s5.exc.production')],
    },
    {
      id: 'record-your-song',
      labelKey: 'bb.s5.record',
      descKey: 'bb.s5.record.desc',
      price: 8900,
      includes: [t('bb.s5.inc.recording'), t('bb.s5.inc.demoMix'), t('bb.s5.inc.delivery5')],
      notIncluded: [t('bb.s5.exc.mastering'), t('bb.s5.exc.fullProduction')],
    },
    // Shared packages
    {
      id: 'radio-ready',
      labelKey: 'bb.s5.radio',
      descKey: 'bb.s5.radio.desc',
      price: 18000,
      includes: [t('bb.s5.inc.fullProduction'), t('bb.s5.inc.proMix'), t('bb.s5.inc.mastering'), t('bb.s5.inc.delivery14')],
      notIncluded: [],
    },
    {
      id: 'ep-package',
      labelKey: 'bb.s5.ep',
      descKey: 'bb.s5.ep.desc',
      price: 45000,
      includes: [t('bb.s5.inc.3songs'), t('bb.s5.inc.fullProduction'), t('bb.s5.inc.proMix'), t('bb.s5.inc.mastering')],
      notIncluded: [],
    },
    // Remote packages
    {
      id: 'mixing-only',
      labelKey: 'bb.s5.mixOnly',
      descKey: 'bb.s5.mixOnly.desc',
      price: 5500,
      includes: [t('bb.s5.inc.proMix'), t('bb.s5.inc.stemDelivery'), t('bb.s5.inc.revisions2')],
      notIncluded: [t('bb.s5.exc.mastering'), t('bb.s5.exc.production')],
    },
    {
      id: 'mastering-only',
      labelKey: 'bb.s5.masterOnly',
      descKey: 'bb.s5.masterOnly.desc',
      price: 1500,
      includes: [t('bb.s5.inc.digitalMaster')],
      notIncluded: [t('bb.s5.exc.fullMix'), t('bb.s5.exc.production')],
    },
    {
      id: 'mix-and-master',
      labelKey: 'bb.s5.mixMaster',
      descKey: 'bb.s5.mixMaster.desc',
      price: 6500,
      includes: [t('bb.s5.inc.mixAndMaster'), t('bb.s5.inc.revisions2'), t('bb.s5.inc.delivery10')],
      notIncluded: [t('bb.s5.exc.production')],
    },
    {
      id: 'production-support',
      labelKey: 'bb.s5.prodSupport',
      descKey: 'bb.s5.prodSupport.desc',
      price: 12000,
      includes: [t('bb.s5.inc.arrangement'), t('bb.s5.inc.soundDesign'), t('bb.s5.inc.delivery14')],
      notIncluded: [t('bb.s5.exc.mastering')],
    },
  ];

  // Filter by work mode using flags from RESULT_PACKAGES config
  const packages = allPackages.filter(pkg => {
    const config = RESULT_PACKAGES.find(rp => rp.id === pkg.id);
    if (!config) return false;
    if (isRemote && config.studioOnly) return false;
    if (!isRemote && config.remoteOnly) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-serif font-semibold">{t('bb.s5.title2')}</h2>
      <p className="text-muted-foreground font-sans text-sm mb-2">{t('bb.s5.sub2')}</p>
      <p className="text-muted-foreground/70 font-sans text-xs italic mb-6">{t('bb.s5.explain')} {t('bb.s5.includesNote')}</p>

      <div className="grid gap-4">
        {packages.map(pkg => {
          const isSelected = state.resultPackage === pkg.id;
          return (
            <SelectableCard
              key={pkg.id}
              selected={isSelected}
              onClick={() => dispatch({ type: 'SET_RESULT_PACKAGE', id: pkg.id })}
              badge={pkg.id === 'radio-ready' ? t('bb.badge.bestValue') : pkg.id === 'mix-and-master' ? t('bb.badge.bestValue') : undefined}
            >
              <div className="flex justify-between items-start">
                <p className="font-sans font-medium">{t(pkg.labelKey)}</p>
                {pkg.price > 0 && (
                  <p className="text-primary font-sans text-lg font-semibold ml-4 shrink-0">
                    {pkg.price.toLocaleString()} SEK
                  </p>
                )}
              </div>

              {/* Expanded details when selected */}
              <div className={`overflow-hidden transition-all duration-300 ${isSelected ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
                <p className="text-muted-foreground font-sans text-sm mb-3">{t(pkg.descKey)}</p>
                
                {pkg.includes.length > 0 && (
                  <div className="mb-2">
                    <p className="text-xs font-sans font-medium text-foreground/80 uppercase tracking-wider mb-1.5">{t('bb.s5.included')}</p>
                    <ul className="space-y-1">
                      {pkg.includes.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm font-sans text-muted-foreground">
                          <Check size={14} className="text-primary shrink-0" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {pkg.notIncluded.length > 0 && (
                  <div>
                    <p className="text-xs font-sans font-medium text-foreground/80 uppercase tracking-wider mb-1.5 mt-3">{t('bb.s5.notIncluded')}</p>
                    <ul className="space-y-1">
                      {pkg.notIncluded.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm font-sans text-muted-foreground/60">
                          <X size={14} className="text-muted-foreground shrink-0" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Compact description when not selected */}
              {!isSelected && (
                <p className="text-muted-foreground font-sans text-sm mt-1">{t(pkg.descKey)}</p>
              )}
            </SelectableCard>
          );
        })}
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
