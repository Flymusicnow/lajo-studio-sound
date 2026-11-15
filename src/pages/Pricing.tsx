import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Check, X, Mic, Globe } from 'lucide-react';
import { RESULT_PACKAGES, ADDONS, MASTERING_PRICE_PER_TRACK } from '@/components/booking/bookingConfig';

type Mode = 'studio' | 'remote';

interface PackageRow {
  id: string;
  labelKey: string;
  descKey: string;
  price: number;
  includes: string[];
  notIncluded: string[];
}

const Pricing = () => {
  const { t } = useLanguage();
  const [mode, setMode] = useState<Mode>('studio');

  const allPackages: PackageRow[] = [
    { id: 'session-only', labelKey: 'bb.s5.sessionOnly', descKey: 'bb.s5.sessionOnly.desc', price: 0,
      includes: ['bb.s5.inc.recording', 'bb.s5.inc.basicMix', 'bb.s5.inc.fileExport'],
      notIncluded: ['bb.s5.exc.fullMix', 'bb.s5.exc.mastering', 'bb.s5.exc.production'] },
    { id: 'record-your-song', labelKey: 'bb.s5.record', descKey: 'bb.s5.record.desc', price: 8900,
      includes: ['bb.s5.inc.recording', 'bb.s5.inc.demoMix', 'bb.s5.inc.delivery5'],
      notIncluded: ['bb.s5.exc.mastering', 'bb.s5.exc.fullProduction'] },
    { id: 'radio-ready', labelKey: 'bb.s5.radio', descKey: 'bb.s5.radio.desc', price: 18000,
      includes: ['bb.s5.inc.fullProduction', 'bb.s5.inc.proMix', 'bb.s5.inc.mastering', 'bb.s5.inc.delivery14'],
      notIncluded: [] },
    { id: 'ep-package', labelKey: 'bb.s5.ep', descKey: 'bb.s5.ep.desc', price: 45000,
      includes: ['bb.s5.inc.3songs', 'bb.s5.inc.fullProduction', 'bb.s5.inc.proMix', 'bb.s5.inc.mastering'],
      notIncluded: [] },
    { id: 'mixing-only', labelKey: 'bb.s5.mixOnly', descKey: 'bb.s5.mixOnly.desc', price: 5500,
      includes: ['bb.s5.inc.proMix', 'bb.s5.inc.stemDelivery', 'bb.s5.inc.revisions2'],
      notIncluded: ['bb.s5.exc.mastering', 'bb.s5.exc.production'] },
    { id: 'mastering-only', labelKey: 'bb.s5.masterOnly', descKey: 'bb.s5.masterOnly.desc', price: 1500,
      includes: ['bb.s5.inc.digitalMaster'],
      notIncluded: ['bb.s5.exc.fullMix', 'bb.s5.exc.production'] },
    { id: 'mix-and-master', labelKey: 'bb.s5.mixMaster', descKey: 'bb.s5.mixMaster.desc', price: 6500,
      includes: ['bb.s5.inc.mixAndMaster', 'bb.s5.inc.revisions2', 'bb.s5.inc.delivery10'],
      notIncluded: ['bb.s5.exc.production'] },
    { id: 'production-support', labelKey: 'bb.s5.prodSupport', descKey: 'bb.s5.prodSupport.desc', price: 12000,
      includes: ['bb.s5.inc.arrangement', 'bb.s5.inc.soundDesign', 'bb.s5.inc.delivery14'],
      notIncluded: ['bb.s5.exc.mastering'] },
  ];

  const visible = allPackages.filter(p => {
    const config = RESULT_PACKAGES.find(rp => rp.id === p.id);
    if (!config) return false;
    if (mode === 'remote' && config.studioOnly) return false;
    if (mode === 'studio' && config.remoteOnly) return false;
    return true;
  });

  const addonLabelKey = (id: string) =>
    `bb.s3.${id === 'sound-design' ? 'sound' : id === 'extra-revision' ? 'revision' : id}`;

  const bookingHref = mode === 'remote' ? '/booking?mode=remote' : '/booking';

  return (
    <Layout>
      <section className="pt-32 pb-24 md:pb-32">
        <div className="container px-6">
          {/* Header */}
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-4">{t('pricing.title')}</h1>
            <p className="text-muted-foreground font-sans">{t('pricing.subtitle2')}</p>
            <div className="w-16 h-[1px] bg-primary mx-auto mt-8" />
          </div>

          {/* Mode toggle */}
          <div className="max-w-md mx-auto mb-12">
            <div className="grid grid-cols-2 bg-card border border-border rounded p-1">
              <button
                onClick={() => setMode('studio')}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded text-sm font-sans font-medium transition-all ${
                  mode === 'studio' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Mic size={16} /> {t('pricing.tab.studio')}
              </button>
              <button
                onClick={() => setMode('remote')}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded text-sm font-sans font-medium transition-all ${
                  mode === 'remote' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Globe size={16} /> {t('pricing.tab.remote')}
              </button>
            </div>
          </div>

          {/* Studio: session pricing */}
          {mode === 'studio' && (
            <div className="max-w-4xl mx-auto mb-12">
              <h2 className="text-xl font-serif font-semibold mb-4 text-center">{t('pricing.sessions.title')}</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="border border-border p-6 text-center bg-card">
                  <p className="font-sans font-medium mb-2">{t('bb.s1.4h')}</p>
                  <p className="text-primary font-serif text-2xl font-semibold">4 500 SEK</p>
                </div>
                <div className="border border-primary p-6 text-center bg-card relative">
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded font-sans">
                    {t('bb.badge.popular')}
                  </span>
                  <p className="font-sans font-medium mb-2">{t('bb.s1.8h')}</p>
                  <p className="text-primary font-serif text-2xl font-semibold">8 500 SEK</p>
                </div>
                <div className="border border-border p-6 text-center bg-card">
                  <p className="font-sans font-medium mb-2">{t('bb.s1.custom')}</p>
                  <p className="text-muted-foreground font-sans text-sm">{t('pricing.onRequest')}</p>
                </div>
              </div>
            </div>
          )}

          {/* Package comparison */}
          <div className="max-w-5xl mx-auto mb-16">
            <h2 className="text-xl font-serif font-semibold mb-6 text-center">
              {mode === 'studio' ? t('pricing.packages.studio') : t('pricing.packages.remote')}
            </h2>
            <div className="grid md:grid-cols-2 gap-5">
              {visible.map(p => (
                <div key={p.id} className="border border-border p-6 bg-card flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-serif text-lg font-semibold">{t(p.labelKey)}</h3>
                    {p.price > 0 ? (
                      <p className="text-primary font-serif text-xl font-semibold ml-3 shrink-0">
                        {p.price.toLocaleString()} SEK
                      </p>
                    ) : (
                      <p className="text-muted-foreground font-sans text-sm ml-3 shrink-0">
                        {t('pricing.includedInSession')}
                      </p>
                    )}
                  </div>
                  <p className="text-muted-foreground font-sans text-sm mb-4">{t(p.descKey)}</p>

                  <ul className="space-y-1.5 mb-3">
                    {p.includes.map((key, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm font-sans text-muted-foreground">
                        <Check size={14} className="text-primary shrink-0" /> {t(key)}
                      </li>
                    ))}
                  </ul>
                  {p.notIncluded.length > 0 && (
                    <ul className="space-y-1.5 mb-4">
                      {p.notIncluded.map((key, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm font-sans text-muted-foreground/50">
                          <X size={14} className="shrink-0" /> {t(key)}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-auto pt-4">
                    <Button asChild variant="outline" className="w-full border-border">
                      <Link to={bookingHref}>{t('pricing.book')}</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add-ons */}
          <div className="max-w-3xl mx-auto mb-12">
            <h2 className="text-xl font-serif font-semibold mb-4 text-center">{t('pricing.addons.title')}</h2>
            <div className="border border-border bg-card divide-y divide-border">
              {ADDONS.map(addon => (
                <div key={addon.id} className="flex justify-between items-center p-4">
                  <span className="font-sans text-sm">{t(addonLabelKey(addon.id))}</span>
                  <span className="font-sans text-sm text-primary font-medium">
                    {addon.price.toLocaleString()} SEK
                  </span>
                </div>
              ))}
              <div className="flex justify-between items-center p-4">
                <span className="font-sans text-sm">{t('bb.s4.perTrack')}</span>
                <span className="font-sans text-sm text-primary font-medium">
                  {MASTERING_PRICE_PER_TRACK.toLocaleString()} SEK / {t('bb.s4.track')}
                </span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="max-w-md mx-auto text-center">
            <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gold-glow py-6">
              <Link to={bookingHref}>{t('pricing.cta')}</Link>
            </Button>
            <p className="text-xs text-muted-foreground mt-3 font-sans">{t('pricing.depositNote')}</p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Pricing;
