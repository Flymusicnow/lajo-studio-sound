import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudioEntry = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 md:py-28">
      <div className="container px-6">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-4">
            {t('entry.title')}
          </h2>
          <p className="text-muted-foreground font-sans text-sm max-w-xl mx-auto leading-relaxed">
            {t('entry.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Starta enkelt */}
          <Link
            to="/quick-booking"
            className="group relative bg-card border border-border rounded-lg p-8 hover:border-primary/50 transition-all duration-300"
          >
            <div className="space-y-4">
              <h3 className="text-xl font-serif font-semibold">{t('entry.simple.title')}</h3>
              <p className="text-muted-foreground font-sans text-sm leading-relaxed">
                {t('entry.simple.desc')}
              </p>
              <ul className="space-y-2 text-sm font-sans text-muted-foreground">
                <li>• {t('entry.simple.1')}</li>
                <li>• {t('entry.simple.2')}</li>
                <li>• {t('entry.simple.3')}</li>
              </ul>
              <p className="text-primary font-sans text-sm font-semibold">{t('entry.simple.from')}</p>
              <span className="inline-flex items-center text-primary font-sans text-sm font-medium group-hover:gap-2 gap-1 transition-all">
                {t('entry.simple.cta')} <ArrowRight size={16} />
              </span>
            </div>
          </Link>

          {/* Bygg din låt */}
          <Link
            to="/booking"
            className="group relative bg-card border border-primary/30 rounded-lg p-8 hover:border-primary transition-all duration-300 md:scale-[1.02]"
          >
            <span className="absolute -top-3 left-6 px-3 py-0.5 text-xs font-sans tracking-wide bg-primary text-primary-foreground rounded-full">
              {t('entry.build.badge')}
            </span>
            <div className="space-y-4">
              <h3 className="text-xl font-serif font-semibold">{t('entry.build.title')}</h3>
              <p className="text-muted-foreground font-sans text-sm leading-relaxed">
                {t('entry.build.desc')}
              </p>
              <ul className="space-y-2 text-sm font-sans text-muted-foreground">
                <li>• {t('entry.build.1')}</li>
                <li>• {t('entry.build.2')}</li>
                <li>• {t('entry.build.3')}</li>
              </ul>
              <p className="text-primary font-sans text-sm font-semibold">{t('entry.build.from')}</p>
              <span className="inline-flex items-center text-primary font-sans text-sm font-medium group-hover:gap-2 gap-1 transition-all">
                {t('entry.build.cta')} <ArrowRight size={16} />
              </span>
            </div>
          </Link>
        </div>

        <p className="text-center text-muted-foreground font-sans text-sm mt-8">
          {t('entry.unsure')}
        </p>
      </div>
    </section>
  );
};

export default StudioEntry;
