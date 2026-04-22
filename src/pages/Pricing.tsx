import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type ServiceType = 'recording' | 'mixing' | 'mastering' | 'production';
type PackageType = 'basic' | 'premium' | 'highend' | 'recommend';
type TrackCount = '0-30' | '31-60' | '61-100' | '100+';
type DeliveryType = 'standard' | 'priority';

const Pricing = () => {
  const { t } = useLanguage();
  
  const [service, setService] = useState<ServiceType>('mixing');
  const [pkg, setPkg] = useState<PackageType>('basic');
  const [tracks, setTracks] = useState<TrackCount>('0-30');
  const [delivery, setDelivery] = useState<DeliveryType>('standard');

  const price = useMemo(() => {
    let total = 0;
    let isQuote = false;

    if (service === 'mixing') {
      const trackPrices: Record<TrackCount, number> = {
        '0-30': 3000,
        '31-60': 3500,
        '61-100': 4500,
        '100+': 12000,
      };
      total = trackPrices[tracks];
      if (tracks === '100+') isQuote = true;
      if (pkg === 'premium') total += 2000;
      if (pkg === 'highend') total = 9000;
    } else if (service === 'mastering') {
      if (pkg === 'basic') total = 700;
      if (pkg === 'premium') total = 1350;
      if (pkg === 'highend') total = 2500;
    } else if (service === 'recording') {
      if (pkg === 'basic') total = 3200;
      if (pkg === 'premium') total = 5500;
      if (pkg === 'highend') total = 10000;
    } else if (service === 'production') {
      if (pkg === 'basic') total = 5000;
      if (pkg === 'premium') total = 12500;
      if (pkg === 'highend') total = 40000;
      isQuote = true;
    }

    if (delivery === 'priority') {
      if (service === 'mixing') total += 1000;
      if (service === 'mastering') total += 300;
    }

    return { total, isQuote };
  }, [service, pkg, tracks, delivery]);

  return (
    <Layout>
      <section className="pt-32 pb-24 md:pb-32">
        <div className="container px-6">

          {/* Header */}
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-4">
              {t('pricing.title')}
            </h1>
            <p className="text-muted-foreground font-sans">
              {t('pricing.subtitle')}
            </p>
            <div className="w-16 h-[1px] bg-primary mx-auto mt-8" />
          </div>

          {/* Configurator */}
          <div className="max-w-xl mx-auto mb-24">
            <div className="bg-card border border-border p-8">
              <h2 className="text-2xl font-serif font-semibold text-center mb-8">
                {t('pricing.configurator.title')}
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-sans text-muted-foreground mb-2">
                    {t('pricing.service')}
                  </label>
                  <Select value={service} onValueChange={(v) => setService(v as ServiceType)}>
                    <SelectTrigger className="w-full bg-input border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="recording">{t('pricing.service.recording')}</SelectItem>
                      <SelectItem value="mixing">{t('pricing.service.mixing')}</SelectItem>
                      <SelectItem value="mastering">{t('pricing.service.mastering')}</SelectItem>
                      <SelectItem value="production">{t('pricing.service.production')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-sans text-muted-foreground mb-2">
                    {t('pricing.package')}
                  </label>
                  <Select value={pkg} onValueChange={(v) => setPkg(v as PackageType)}>
                    <SelectTrigger className="w-full bg-input border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="basic">{t('pricing.package.basic')}</SelectItem>
                      <SelectItem value="premium">{t('pricing.package.premium')}</SelectItem>
                      <SelectItem value="highend">{t('pricing.package.highend')}</SelectItem>
                      <SelectItem value="recommend">{t('pricing.package.recommend')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {service === 'mixing' && (
                  <div>
                    <label className="block text-sm font-sans text-muted-foreground mb-2">
                      {t('pricing.tracks')}
                    </label>
                    <Select value={tracks} onValueChange={(v) => setTracks(v as TrackCount)}>
                      <SelectTrigger className="w-full bg-input border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        <SelectItem value="0-30">{t('pricing.tracks.0-30')}</SelectItem>
                        <SelectItem value="31-60">{t('pricing.tracks.31-60')}</SelectItem>
                        <SelectItem value="61-100">{t('pricing.tracks.61-100')}</SelectItem>
                        <SelectItem value="100+">{t('pricing.tracks.100+')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {(service === 'mixing' || service === 'mastering') && (
                  <div>
                    <label className="block text-sm font-sans text-muted-foreground mb-2">
                      {t('pricing.delivery')}
                    </label>
                    <Select value={delivery} onValueChange={(v) => setDelivery(v as DeliveryType)}>
                      <SelectTrigger className="w-full bg-input border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        <SelectItem value="standard">{t('pricing.delivery.standard')}</SelectItem>
                        <SelectItem value="priority">{t('pricing.delivery.priority')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="pt-6 border-t border-border">
                  <div className="flex items-baseline justify-between mb-6">
                    <span className="text-sm text-muted-foreground font-sans">
                      {t('pricing.total')}
                    </span>
                    <div className="text-right">
                      {price.isQuote && (
                        <span className="text-sm text-muted-foreground mr-2">{t('pricing.from')}</span>
                      )}
                      <span className="text-3xl font-serif font-semibold text-primary">
                        {price.total.toLocaleString()} SEK
                      </span>
                    </div>
                  </div>
                  <Button
                    asChild
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gold-glow py-6 font-sans tracking-wide"
                  >
                    <Link to="/booking">{t('pricing.book')}</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Standard Pricing Tables */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-24">
            <PricingTable
              title={t('pricing.mixing.title')}
              items={[
                { label: '0–30 ' + t('pricing.tracks').toLowerCase(), price: '3 000 SEK', note: `3 ${t('pricing.revisions')}` },
                { label: '31–60 ' + t('pricing.tracks').toLowerCase(), price: '3 500 SEK', note: `3 ${t('pricing.revisions')}` },
                { label: '61–100 ' + t('pricing.tracks').toLowerCase(), price: '4 500 SEK', note: `3 ${t('pricing.revisions')}` },
                { label: 'Premium Mix', price: '+2 000 SEK', note: `5 ${t('pricing.revisions')}` },
                { label: 'High-End Mix', price: '8 000–10 000 SEK', note: t('pricing.unlimited') },
              ]}
            />
            <PricingTable
              title={t('pricing.mastering.title')}
              items={[
                { label: t('pricing.stereo'), price: '600–800 SEK' },
                { label: t('pricing.hybrid'), price: '1 200–1 500 SEK' },
                { label: t('pricing.stem'), price: '2 500 SEK' },
              ]}
            />
            <PricingTable
              title={t('pricing.recording.title')}
              items={[
                { label: t('pricing.halfday'), price: '3 200 SEK' },
                { label: t('pricing.fullday'), price: '5 000–6 000 SEK' },
                { label: t('pricing.weekend'), price: `${t('pricing.from')} 10 000 SEK` },
              ]}
            />
            <PricingTable
              title={t('pricing.production.title')}
              items={[
                { label: t('pricing.exclusive'), price: '5 000–20 000 SEK' },
                { label: 'High-End', price: '20 000–60 000 SEK' },
              ]}
            />
          </div>

          {/* ── NEW: Beat Licensing Section ── */}
          <div className="max-w-4xl mx-auto mb-24">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-serif font-semibold mb-3">Beat Licensing</h2>
              <div className="w-16 h-[1px] bg-primary mx-auto mt-4 mb-4" />
              <p className="text-muted-foreground font-sans text-sm max-w-xl mx-auto">
                Alla beats skapas av Topliner Production. Du köper en licens att använda beatet — 
                inte upphovsrätten. Producentens STIM-andel (50%) kvarstår alltid.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {/* Non-exclusive */}
              <div className="border border-border p-6">
                <div className="text-xs font-sans tracking-widest text-muted-foreground uppercase mb-3">
                  Non-Exklusiv
                </div>
                <div className="text-3xl font-serif font-semibold text-primary mb-4">
                  1 500 SEK
                </div>
                <div className="space-y-2 text-sm font-sans text-muted-foreground">
                  <p>✓ Kommersiell användning tillåten</p>
                  <p>✓ Streaming på alla plattformar</p>
                  <p>✓ Upp till 100 000 streams</p>
                  <p>✓ Kredit till Topliner Production krävs</p>
                  <p className="opacity-40">✗ Beatet kan säljas till fler artister</p>
                  <p className="opacity-40">✗ Ingen TV / film / synk-rätt</p>
                </div>
              </div>

              {/* Exclusive */}
              <div className="border border-primary p-6 relative">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary" />
                <div className="text-xs font-sans tracking-widest text-primary uppercase mb-3">
                  Exklusiv
                </div>
                <div className="text-3xl font-serif font-semibold text-primary mb-4">
                  från 5 000 SEK
                </div>
                <div className="space-y-2 text-sm font-sans text-muted-foreground">
                  <p>✓ Du är enda användaren av beatet</p>
                  <p>✓ Obegränsat streaming</p>
                  <p>✓ TV, film, reklam & synk</p>
                  <p>✓ Beatet säljs inte till någon annan</p>
                  <p>✓ Kredit rekommenderas men ej krav</p>
                  <p>✓ Pris varierar per beat</p>
                </div>
              </div>
            </div>

            {/* Rights note */}
            <div className="border border-border p-6 bg-card">
              <h3 className="font-serif font-semibold mb-3 text-lg">Dina rättigheter som köpare</h3>
              <div className="grid md:grid-cols-2 gap-6 text-sm font-sans text-muted-foreground">
                <div>
                  <p className="text-foreground font-medium mb-1">Ekonomiska rättigheter</p>
                  <p>Regleras av licensen — non-exklusiv eller exklusiv. Bestämmer vem som får använda beatet kommersiellt.</p>
                </div>
                <div>
                  <p className="text-foreground font-medium mb-1">Ideell rätt</p>
                  <p>Tillhör alltid producenten. Oavsett vilken licens du köper har producenten rätt att stå med som upphovsperson på låten.</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── NEW: Complete Package ── */}
          <div className="max-w-4xl mx-auto mb-24">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-serif font-semibold mb-3">Komplett Paket</h2>
              <div className="w-16 h-[1px] bg-primary mx-auto mt-4 mb-4" />
              <p className="text-muted-foreground font-sans text-sm max-w-xl mx-auto">
                Beat, inspelning, mix och mastering under ett tak. Allt du behöver för en färdig låt.
              </p>
            </div>

            <div className="border border-primary p-8 relative">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary" />
              <div className="absolute top-4 right-6">
                <span className="text-xs font-sans tracking-widest text-primary uppercase border border-primary px-3 py-1">
                  Mest populärt
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-serif font-semibold mb-4">Per låt — allt inkluderat</h3>
                  <div className="space-y-2 text-sm font-sans text-muted-foreground mb-6">
                    <p>→ Skräddarsydd beat (exklusiv)</p>
                    <p>→ Inspelning upp till 4 timmar</p>
                    <p>→ Professionell mix</p>
                    <p>→ Mastering för streaming</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    * Familje- och samarbetsrabatter ges från fall till fall. Kontakta oss.
                  </p>
                </div>
                <div className="text-center md:text-right">
                  <div className="text-5xl font-serif font-semibold text-primary mb-2">
                    8 000 SEK
                  </div>
                  <div className="text-sm text-muted-foreground font-sans mb-6">per låt</div>
                  <div className="text-sm text-muted-foreground font-sans border-t border-border pt-4">
                    4 låtar/månad:{' '}
                    <span className="text-primary font-semibold text-lg font-serif">32 000 SEK</span>
                    <br />
                    <span className="text-xs">Kontakta oss för månadsavtal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── NEW: Revenue Split / Collaboration Deal ── */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-serif font-semibold mb-3">Samarbetsavtal</h2>
              <div className="w-16 h-[1px] bg-primary mx-auto mt-4 mb-4" />
            </div>

            <div className="border border-border p-8 bg-card">
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className="text-4xl font-serif font-semibold text-primary mb-2">50%</div>
                  <div className="text-sm font-sans text-muted-foreground">Producent (Topliner)</div>
                  <div className="text-xs text-muted-foreground mt-1">Komposition / Beat</div>
                </div>
                <div className="text-center border-x border-border">
                  <div className="text-4xl font-serif font-semibold text-primary mb-2">50%</div>
                  <div className="text-sm font-sans text-muted-foreground">Artist</div>
                  <div className="text-xs text-muted-foreground mt-1">Text / Framförande</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-serif font-semibold text-primary mb-2">∞</div>
                  <div className="text-sm font-sans text-muted-foreground">Båda parter</div>
                  <div className="text-xs text-muted-foreground mt-1">STIM-ersättning</div>
                </div>
              </div>

              <div className="border-t border-border pt-6 text-sm font-sans text-muted-foreground space-y-2">
                <p>
                  För utvalda samarbeten erbjuder Topliner Production reducerat upfront-pris mot en 
                  50/50-split på all intäkt — streaming, synk och framträdanden.
                </p>
                <p>
                  Detta är branschstandard: producenten äger 50% av kompositionen, 
                  artisten äger 50% via texten. Alla avtal tecknas skriftligt per låt.
                </p>
              </div>

              <div className="mt-6">
                <Button
                  asChild
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/10 font-sans tracking-wide"
                >
                  <Link to="/booking">Kontakta oss för samarbetsavtal</Link>
                </Button>
              </div>
            </div>
          </div>

        </div>
      </section>
    </Layout>
  );
};

interface PricingTableProps {
  title: string;
  items: { label: string; price: string; note?: string }[];
}

const PricingTable = ({ title, items }: PricingTableProps) => (
  <div className="border border-border p-6">
    <h3 className="text-xl font-serif font-semibold mb-6 text-center">{title}</h3>
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="flex justify-between items-baseline">
          <div>
            <span className="text-sm font-sans">{item.label}</span>
            {item.note && (
              <span className="block text-xs text-muted-foreground mt-0.5">{item.note}</span>
            )}
          </div>
          <span className="text-sm font-sans text-primary">{item.price}</span>
        </div>
      ))}
    </div>
  </div>
);

export default Pricing;
