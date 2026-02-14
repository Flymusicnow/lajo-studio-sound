import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

const UrgencyCTA = () => {
  const { t } = useLanguage();

  return (
    <section className="py-24 border-t border-border/50">
      <div className="container px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-4">
            {t('urgency.title')}
          </h2>
          <p className="text-muted-foreground font-sans mb-10">
            {t('urgency.text')}
          </p>
          <Button
            asChild
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 gold-glow px-10 py-6 text-base font-sans tracking-wide"
          >
            <Link to="/booking">{t('urgency.cta')}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default UrgencyCTA;
