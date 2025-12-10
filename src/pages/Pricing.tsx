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

    // Base price by service and package
    if (service === 'mixing') {
      // Track-based pricing
      const trackPrices: Record<TrackCount, number> = {
        '0-30': 3000,
        '31-60': 3500,
        '61-100': 4500,
        '100+': 12000,
      };
      total = trackPrices[tracks];
      if (tracks === '100+') isQuote = true;

      // Package upgrades
      if (pkg === 'premium') total += 2000;
      if (pkg === 'highend') total = 9000;
    } else if (service === 'mastering') {
      if (pkg === 'basic') total = 700;
      if (pkg === 'premium') total = 1350;
      if (pkg === 'highend') total = 2500;
    } else if (service === 'recording') {
      if (pkg === 'basic') total = 3000; // Half-day
      if (pkg === 'premium') total = 5500; // Full-day
      if (pkg === 'highend') total = 10000; // Weekend
    } else if (service === 'production') {
      if (pkg === 'basic') total = 5000;
      if (pkg === 'premium') total = 12500;
      if (pkg === 'highend') total = 40000;
      isQuote = true;
    }

    // Priority delivery
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
                {/* Service */}
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

                {/* Package */}
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

                {/* Track Count (only for mixing) */}
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

                {/* Delivery */}
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

                {/* Price Display */}
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

          {/* Pricing Tables */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Mixing */}
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

            {/* Mastering */}
            <PricingTable
              title={t('pricing.mastering.title')}
              items={[
                { label: t('pricing.stereo'), price: '600–800 SEK' },
                { label: t('pricing.hybrid'), price: '1 200–1 500 SEK' },
                { label: t('pricing.stem'), price: '2 500 SEK' },
              ]}
            />

            {/* Recording */}
            <PricingTable
              title={t('pricing.recording.title')}
              items={[
                { label: t('pricing.halfday'), price: '3 000 SEK' },
                { label: t('pricing.fullday'), price: '5 000–6 000 SEK' },
                { label: t('pricing.weekend'), price: `${t('pricing.from')} 10 000 SEK` },
              ]}
            />

            {/* Production */}
            <PricingTable
              title={t('pricing.production.title')}
              items={[
                { label: t('pricing.exclusive'), price: '5 000–20 000 SEK' },
                { label: 'High-End', price: '20 000–60 000 SEK' },
              ]}
            />
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
