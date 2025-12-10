import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CTA = () => {
  const { t } = useLanguage();

  return (
    <section className="py-24 md:py-32 bg-charcoal-light">
      <div className="container px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-8">
            {t('cta.title')}
          </h2>
          
          <Button 
            asChild
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 gold-glow px-8 py-6 text-base font-sans tracking-wide group"
          >
            <Link to="/booking">
              {t('cta.button')}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTA;
