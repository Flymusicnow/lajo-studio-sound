import Layout from '@/components/Layout';
import Hero from '@/components/Hero';
import StudioIntro from '@/components/StudioIntro';
import Services from '@/components/Services';
import Portfolio from '@/components/Portfolio';
import CTA from '@/components/CTA';
import AnimatedSection from '@/components/AnimatedSection';

const Index = () => {
  return (
    <Layout>
      <Hero />
      <AnimatedSection>
        <StudioIntro />
      </AnimatedSection>
      <AnimatedSection>
        <Services />
      </AnimatedSection>
      <AnimatedSection>
        <Portfolio />
      </AnimatedSection>
      <AnimatedSection>
        <CTA />
      </AnimatedSection>
    </Layout>
  );
};

export default Index;
