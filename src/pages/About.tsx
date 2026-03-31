import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import AnimatedSection from '@/components/AnimatedSection';
import { Headphones, Music, Users, Mic, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <Layout>
      <section className="pt-32 pb-24">
        <div className="container px-6">
          {/* Header */}
          <AnimatedSection>
            <div className="max-w-2xl mx-auto text-center mb-16">
              <p className="text-primary font-sans text-sm tracking-[0.3em] uppercase mb-4">
                {t('about.label')}
              </p>
              <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-4">
                {t('about.title')}
              </h1>
              <div className="w-16 h-[1px] bg-primary mx-auto mt-8" />
            </div>
          </AnimatedSection>

          {/* Who I am */}
          <div className="max-w-3xl mx-auto mb-20">
            <AnimatedSection delay={100}>
              <div className="space-y-6 text-muted-foreground font-sans font-light leading-relaxed text-lg">
                <p>{t('about.bio1')}</p>
                <p>{t('about.bio2')}</p>
                <p>{t('about.bio3')}</p>
              </div>
            </AnimatedSection>
          </div>

          {/* What I do */}
          <AnimatedSection delay={200}>
            <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-12">
              {t('about.what.title')}
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-20">
            {[
              { icon: Mic, key: 'about.what.1' },
              { icon: Music, key: 'about.what.2' },
              { icon: Headphones, key: 'about.what.3' },
              { icon: Users, key: 'about.what.4' },
            ].map((item, index) => (
              <AnimatedSection key={index} delay={300 + index * 100}>
                <div className="text-center p-6 border border-border hover:border-primary/30 transition-colors">
                  <div className="inline-flex items-center justify-center w-12 h-12 mb-4 text-primary">
                    <item.icon size={28} strokeWidth={1.5} />
                  </div>
                  <p className="text-sm font-sans text-muted-foreground">{t(item.key)}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Philosophy */}
          <AnimatedSection delay={500}>
            <div className="max-w-2xl mx-auto text-center bg-card p-12 border border-border mb-20">
              <h3 className="text-xl font-serif font-semibold mb-4 text-primary">
                {t('about.philosophy.title')}
              </h3>
              <p className="text-muted-foreground font-sans font-light leading-relaxed">
                {t('about.philosophy.text')}
              </p>
            </div>
          </AnimatedSection>

          {/* CTA */}
          <AnimatedSection delay={600}>
            <div className="max-w-lg mx-auto text-center">
              <h3 className="text-2xl font-serif font-semibold mb-6">{t('about.cta.title')}</h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => navigate('/booking')} className="gold-glow px-8">
                  {t('about.cta.book')} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
};

export default About;
