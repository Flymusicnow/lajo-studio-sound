import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

const ThreeWays = () => {
  const { t } = useLanguage();

  const services = [
    {
      title: t('ways.studio.title'),
      desc: t('ways.studio.desc'),
      fits: [
        t('ways.studio.fit1'),
        t('ways.studio.fit2'),
        t('ways.studio.fit3'),
        t('ways.studio.fit4'),
      ],
      baseRate: '950 kr / h',
      pricing: [
        { label: '4h', price: '3 200 kr', save: 'Spara 600 kr' },
        { label: '8h', price: '5 900 kr', save: 'Spara 1 700 kr', badge: 'Bäst värde' },
      ],
      includes: [
        t('ways.studio.inc1'),
        t('ways.studio.inc2'),
        t('ways.studio.inc3'),
        t('ways.studio.inc4'),
      ],
      cta: t('ways.studio.cta'),
      service: 'studio-session',
    },
    {
      title: t('ways.producer.title'),
      desc: t('ways.producer.desc'),
      fits: [
        t('ways.producer.fit1'),
        t('ways.producer.fit2'),
        t('ways.producer.fit3'),
        t('ways.producer.fit4'),
      ],
      pricing: [
        { label: '4h', price: '4 500 kr' },
        { label: '8h', price: '8 500 kr' },
      ],
      includes: [
        t('ways.producer.inc1'),
        t('ways.producer.inc2'),
        t('ways.producer.inc3'),
        t('ways.producer.inc4'),
        t('ways.producer.inc5'),
      ],
      cta: t('ways.producer.cta'),
      service: 'producer-session',
      featured: true,
    },
    {
      title: t('ways.result.title'),
      desc: t('ways.result.desc'),
      packages: [
        { name: 'Record Your Song', detail: t('ways.result.pkg1.detail'), price: '8 900 kr' },
        { name: 'Radio-Ready', detail: t('ways.result.pkg2.detail'), price: '18 000 kr' },
        { name: 'EP Package', detail: t('ways.result.pkg3.detail'), price: '45 000 kr' },
      ],
      cta: t('ways.result.cta'),
      service: 'resultatpaket',
    },
  ];

  return (
    <section id="paket" className="py-24">
      <div className="container px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-4">
            {t('ways.title')}
          </h2>
          <p className="text-muted-foreground font-sans">
            {t('ways.subtitle')}
          </p>
          <div className="w-16 h-[1px] bg-primary mx-auto mt-8" />
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {services.map((s, i) => (
            <div
              key={i}
              className={`bg-card border p-8 flex flex-col ${
                s.featured ? 'border-primary' : 'border-border'
              }`}
            >
              <h3 className="text-xl font-serif font-semibold mb-3">{s.title}</h3>
              <p className="text-muted-foreground font-sans text-sm mb-6 leading-relaxed">{s.desc}</p>

              {s.fits && (
                <div className="mb-6">
                  <p className="text-xs font-sans text-muted-foreground uppercase tracking-wider mb-3">
                    {t('ways.fits')}
                  </p>
                  <ul className="space-y-1.5">
                    {s.fits.map((f, j) => (
                      <li key={j} className="text-sm font-sans text-foreground/80 flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {s.pricing && (
                <div className="mb-6 space-y-3">
                  {'baseRate' in s && s.baseRate && (
                    <div className="flex justify-between items-center text-sm font-sans pb-2 border-b border-border">
                      <span className="text-muted-foreground">Löpande</span>
                      <span className="text-muted-foreground">{s.baseRate}</span>
                    </div>
                  )}
                  {s.pricing.map((p, j) => (
                    <div key={j} className="flex justify-between items-center text-sm font-sans">
                      <div>
                        <span className="text-foreground font-medium">{p.label}</span>
                        {'save' in p && p.save && (
                          <span className="ml-2 text-xs text-primary font-sans">{p.save}</span>
                        )}
                        {'badge' in p && p.badge && (
                          <span className="ml-2 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded font-sans">
                            {p.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-foreground font-semibold">{p.price}</span>
                    </div>
                  ))}
                </div>
              )}

              {s.includes && (
                <div className="mb-6">
                  <p className="text-xs font-sans text-muted-foreground uppercase tracking-wider mb-3">
                    {t('ways.includes')}
                  </p>
                  <ul className="space-y-1.5">
                    {s.includes.map((inc, j) => (
                      <li key={j} className="text-sm font-sans text-foreground/80 flex items-start gap-2">
                        <span className="text-primary mt-0.5">✓</span>
                        {inc}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {s.packages && (
                <div className="mb-6 space-y-4">
                  {s.packages.map((pkg, j) => (
                    <div key={j} className="border-b border-border pb-3 last:border-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-sans font-medium text-foreground">{pkg.name}</span>
                        <span className="text-sm font-sans text-primary font-medium">{pkg.price}</span>
                      </div>
                      <p className="text-xs font-sans text-muted-foreground">{pkg.detail}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-auto">
                <Button
                  asChild
                  className={`w-full py-5 font-sans tracking-wide ${
                    s.featured
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90 gold-glow'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  <Link to={`/booking?service=${s.service}`}>{s.cta}</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ThreeWays;
