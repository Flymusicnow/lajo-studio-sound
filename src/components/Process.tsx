import { useLanguage } from '@/contexts/LanguageContext';

const Process = () => {
  const { t } = useLanguage();

  const steps = [
    { num: '01', label: t('process.step1') },
    { num: '02', label: t('process.step2') },
    { num: '03', label: t('process.step3') },
    { num: '04', label: t('process.step4') },
    { num: '05', label: t('process.step5') },
    { num: '06', label: t('process.step6') },
  ];

  return (
    <section className="py-24 border-t border-border/50">
      <div className="container px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-4">
            {t('process.title')}
          </h2>
          <div className="w-16 h-[1px] bg-primary mx-auto mt-6" />
        </div>

        {/* Desktop: horizontal */}
        <div className="hidden md:flex items-start justify-between max-w-4xl mx-auto relative">
          {/* Connecting line */}
          <div className="absolute top-5 left-0 right-0 h-[1px] bg-border" />
          {steps.map((step, i) => (
            <div key={i} className="relative flex flex-col items-center text-center w-1/6">
              <div className="w-10 h-10 rounded-full bg-card border border-primary flex items-center justify-center text-primary text-xs font-sans font-medium z-10">
                {step.num}
              </div>
              <p className="text-sm font-sans text-foreground/80 mt-3">{step.label}</p>
            </div>
          ))}
        </div>

        {/* Mobile: vertical */}
        <div className="md:hidden max-w-xs mx-auto space-y-6">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-card border border-primary flex-shrink-0 flex items-center justify-center text-primary text-xs font-sans font-medium">
                {step.num}
              </div>
              <p className="text-sm font-sans text-foreground/80">{step.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
