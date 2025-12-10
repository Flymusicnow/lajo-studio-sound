import { useLanguage } from '@/contexts/LanguageContext';

const StudioIntro = () => {
  const { t } = useLanguage();

  return (
    <section className="py-24 md:py-32 bg-charcoal-light">
      <div className="container px-6">
        <div className="max-w-3xl mx-auto">
          {/* Section title */}
          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-center mb-12">
            {t('studio.title')}
          </h2>
          
          {/* Gold accent line */}
          <div className="w-16 h-[1px] bg-primary mx-auto mb-12" />
          
          {/* Text content */}
          <div className="space-y-6 text-muted-foreground font-sans font-light leading-relaxed text-lg">
            <p>{t('studio.text')}</p>
            <p>{t('studio.text2')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudioIntro;
