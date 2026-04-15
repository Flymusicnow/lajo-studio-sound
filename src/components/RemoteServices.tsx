import { useLanguage } from '@/contexts/LanguageContext';
import { Globe, Headphones, Music, Mic, AudioWaveform, Disc3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const services = [
  { key: 'mixing', icon: Headphones },
  { key: 'mastering', icon: Disc3 },
  { key: 'production', icon: Music },
  { key: 'topline', icon: Mic },
  { key: 'development', icon: AudioWaveform },
];

const RemoteServices = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 md:py-28">
      <div className="container px-6">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 mb-6 text-primary">
            <Globe size={32} strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-4">
            {t('remote.title')}
          </h2>
          <p className="text-muted-foreground font-sans text-base leading-relaxed">
            {t('remote.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 max-w-3xl mx-auto mb-10">
          {services.map(({ key, icon: Icon }) => (
            <div
              key={key}
              className="flex flex-col items-center gap-2 p-4 bg-card border border-border rounded text-center"
            >
              <Icon size={20} className="text-primary" />
              <span className="text-sm font-sans text-foreground">
                {t(`remote.service.${key}`)}
              </span>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link to="/booking?mode=remote">{t('remote.cta')} →</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default RemoteServices;
