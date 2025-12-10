import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import AnimatedSection from '@/components/AnimatedSection';
import { Award, Headphones, Music, Users } from 'lucide-react';

const About = () => {
  const { t } = useLanguage();

  const credentials = [
    { icon: Headphones, key: 'about.credential1' },
    { icon: Music, key: 'about.credential2' },
    { icon: Users, key: 'about.credential3' },
    { icon: Award, key: 'about.credential4' },
  ];

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

          {/* Bio Section */}
          <div className="max-w-3xl mx-auto mb-20">
            <AnimatedSection delay={100}>
              <div className="space-y-6 text-muted-foreground font-sans font-light leading-relaxed text-lg">
                <p>{t('about.bio1')}</p>
                <p>{t('about.bio2')}</p>
                <p>{t('about.bio3')}</p>
              </div>
            </AnimatedSection>
          </div>

          {/* Credentials */}
          <AnimatedSection delay={200}>
            <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-12">
              {t('about.credentials.title')}
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-20">
            {credentials.map((cred, index) => (
              <AnimatedSection key={index} delay={300 + index * 100}>
                <div className="text-center p-6 border border-border hover:border-primary/30 transition-colors">
                  <div className="inline-flex items-center justify-center w-12 h-12 mb-4 text-primary">
                    <cred.icon size={28} strokeWidth={1.5} />
                  </div>
                  <p className="text-sm font-sans text-muted-foreground">
                    {t(cred.key)}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Philosophy */}
          <AnimatedSection delay={500}>
            <div className="max-w-2xl mx-auto text-center bg-charcoal-light p-12 border border-border">
              <h3 className="text-xl font-serif font-semibold mb-4 text-primary">
                {t('about.philosophy.title')}
              </h3>
              <p className="text-muted-foreground font-sans font-light leading-relaxed">
                {t('about.philosophy.text')}
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
};

export default About;
