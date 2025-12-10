import { Mic, SlidersHorizontal, Disc, Music } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Services = () => {
  const { t } = useLanguage();

  const services = [
    {
      icon: Mic,
      title: t('services.recording'),
      description: t('services.recording.desc'),
    },
    {
      icon: SlidersHorizontal,
      title: t('services.mixing'),
      description: t('services.mixing.desc'),
    },
    {
      icon: Disc,
      title: t('services.mastering'),
      description: t('services.mastering.desc'),
    },
    {
      icon: Music,
      title: t('services.production'),
      description: t('services.production.desc'),
    },
  ];

  return (
    <section className="py-24 md:py-32">
      <div className="container px-6">
        {/* Section title */}
        <h2 className="text-3xl md:text-4xl font-serif font-semibold text-center mb-4">
          {t('services.title')}
        </h2>
        
        {/* Gold accent line */}
        <div className="w-16 h-[1px] bg-primary mx-auto mb-16" />

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {services.map((service, index) => (
            <div 
              key={index}
              className="group text-center p-8 border border-border/50 hover:border-primary/30 transition-all duration-500"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 mb-6 text-primary">
                <service.icon size={28} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-serif font-semibold mb-3 group-hover:text-primary transition-colors">
                {service.title}
              </h3>
              <p className="text-sm text-muted-foreground font-sans font-light leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
