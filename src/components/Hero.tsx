import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

const Hero = () => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-charcoal-light opacity-50" />
      
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: 'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)',
          backgroundSize: '100px 100px'
        }}
      />

      <div className="container relative z-10 px-6 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-primary font-sans text-sm tracking-[0.3em] uppercase mb-6 fade-in">
            TOPLINER PRODUCTION
          </p>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold leading-tight mb-8 fade-in-delay">
            {t('hero.title')}
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground font-sans font-light max-w-2xl mx-auto mb-12 fade-in-delay-2">
            {t('hero.subtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 fade-in-delay-2">
            <Button 
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 gold-glow px-8 py-6 text-base font-sans tracking-wide"
            >
              <Link to="/booking">{t('hero.cta.book')}</Link>
            </Button>
            <Button 
              asChild
              variant="outline"
              size="lg"
              className="border-border text-foreground hover:bg-secondary hover:text-foreground px-8 py-6 text-base font-sans tracking-wide"
            >
              <a href="#paket">{t('hero.cta.packages')}</a>
            </Button>
          </div>
          
          <p className="mt-6 text-sm text-muted-foreground font-sans fade-in-delay-2">
            <Link to="/quick-booking" className="text-primary hover:underline">
              {t('hero.quickBooking')} →
            </Link>
          </p>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 fade-in-delay-2">
        <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-muted-foreground/50 to-transparent" />
      </div>
    </section>
  );
};

export default Hero;
