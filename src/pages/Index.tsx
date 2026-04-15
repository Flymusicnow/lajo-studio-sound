import Layout from '@/components/Layout';
import Hero from '@/components/Hero';
import StudioEntry from '@/components/StudioEntry';
import ThreeWays from '@/components/ThreeWays';
import Process from '@/components/Process';
import ForWho from '@/components/ForWho';
import FAQ from '@/components/FAQ';
import UrgencyCTA from '@/components/UrgencyCTA';
import Portfolio from '@/components/Portfolio';
import Testimonials from '@/components/Testimonials';
import AnimatedSection from '@/components/AnimatedSection';
import { Helmet } from 'react-helmet-async';

const Index = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    "name": "TOPLINER PRODUCTION",
    "description": "Professionell studio för artister, band och körer. Inspelning, produktion, mixing och mastering.",
    "url": "https://lajo-studio-sound.lovable.app",
    "genre": "Music Production",
    "sameAs": [],
    "address": { "@type": "PostalAddress", "addressCountry": "SE" },
    "makesOffer": [
      { "@type": "Offer", "name": "Studio Session 4h", "price": "4500", "priceCurrency": "SEK" },
      { "@type": "Offer", "name": "Studio Session 8h", "price": "8500", "priceCurrency": "SEK" },
      { "@type": "Offer", "name": "Record Your Song", "price": "8900", "priceCurrency": "SEK" },
      { "@type": "Offer", "name": "Radio Ready", "price": "18000", "priceCurrency": "SEK" },
      { "@type": "Offer", "name": "EP Package", "price": "45000", "priceCurrency": "SEK" },
    ],
  };

  return (
    <Layout>
      <Helmet>
        <link rel="canonical" href="https://lajo-studio-sound.lovable.app/" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <Hero />
      <AnimatedSection>
        <StudioEntry />
      </AnimatedSection>
      <AnimatedSection>
        <ThreeWays />
      </AnimatedSection>
      <AnimatedSection>
        <Portfolio />
      </AnimatedSection>
      <AnimatedSection>
        <Testimonials />
      </AnimatedSection>
      <AnimatedSection>
        <Process />
      </AnimatedSection>
      <AnimatedSection>
        <ForWho />
      </AnimatedSection>
      <AnimatedSection>
        <FAQ />
      </AnimatedSection>
      <AnimatedSection>
        <UrgencyCTA />
      </AnimatedSection>
    </Layout>
  );
};

export default Index;
