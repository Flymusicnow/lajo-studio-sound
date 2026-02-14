import { useLanguage } from '@/contexts/LanguageContext';

const ForWho = () => {
  const { t } = useLanguage();

  return (
    <section className="py-24 border-t border-border/50">
      <div className="container px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-6">
            {t('forwho.title')}
          </h2>
          <p className="text-muted-foreground font-sans leading-relaxed">
            {t('forwho.text')}
          </p>
          <div className="w-16 h-[1px] bg-primary mx-auto mt-8" />
        </div>
      </div>
    </section>
  );
};

export default ForWho;
