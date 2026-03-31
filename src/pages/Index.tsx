import Layout from '@/components/Layout';
import Hero from '@/components/Hero';
import ThreeWays from '@/components/ThreeWays';
import Process from '@/components/Process';
import ForWho from '@/components/ForWho';
import FAQ from '@/components/FAQ';
import UrgencyCTA from '@/components/UrgencyCTA';
import AnimatedSection from '@/components/AnimatedSection';

const Index = () => {
  return (
    <Layout>
      <Hero />
      <AnimatedSection>
        <ThreeWays />
      </AnimatedSection>
      <AnimatedSection>
        <Process />
      </AnimatedSection>
      <AnimatedSection>
        <ForWho />
      </AnimatedSection>
      <AnimatedSection>
        <UrgencyCTA />
      </AnimatedSection>
    </Layout>
  );
};

export default Index;
