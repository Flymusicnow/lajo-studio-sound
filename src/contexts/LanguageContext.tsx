import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'sv' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  sv: {
    // Navigation
    'nav.home': 'Hem',
    'nav.packages': 'Paket',
    'nav.booking': 'Boka',

    // Hero
    'hero.title': 'Professionell studio för artister, band och körer',
    'hero.subtitle': 'Välj hur du vill arbeta – Studio Session, Producer Session eller Resultatpaket.',
    'hero.cta.book': 'Boka session',
    'hero.cta.packages': 'Se paket & priser',

    // Three Ways
    'ways.title': 'Tre sätt att skapa musik hos TOPLINER PRODUCTION',
    'ways.subtitle': 'Alla sessioner sker med ansvarig producent på plats. Du väljer nivå av kreativt stöd och omfattning.',
    'ways.fits': 'Passar för',
    'ways.includes': 'Ingår',

    // Studio Session
    'ways.studio.title': 'Studio Session – Teknisk inspelning',
    'ways.studio.desc': 'För dig som vet vad du vill spela in. Jag ansvarar för inspelning och teknisk kvalitet medan du leder det kreativa innehållet.',
    'ways.studio.fit1': 'Lägga vox på färdig beat',
    'ways.studio.fit2': 'Spela in band',
    'ways.studio.fit3': 'Spela in kör',
    'ways.studio.fit4': 'Fortsätta på befintligt projekt',
    'ways.studio.inc1': 'Professionell studio',
    'ways.studio.inc2': 'Inspelning & teknisk hantering',
    'ways.studio.inc3': 'Grundläggande mixbalans',
    'ways.studio.inc4': 'Fil-export',
    'ways.studio.cta': 'Boka Studio Session',

    // Producer Session
    'ways.producer.title': 'Producer Session – Kreativ utveckling',
    'ways.producer.desc': 'För dig som vill utveckla låten tillsammans med producent. Vi arbetar aktivt med struktur, sound, arrangemang och riktning.',
    'ways.producer.fit1': 'Bygga beat från scratch',
    'ways.producer.fit2': 'Utveckla ofärdig låt',
    'ways.producer.fit3': 'Omstrukturera refräng eller arrangemang',
    'ways.producer.fit4': 'Forma artistens sound',
    'ways.producer.inc1': 'Aktiv produktion',
    'ways.producer.inc2': 'Arrangementstöd',
    'ways.producer.inc3': 'Strukturjustering',
    'ways.producer.inc4': 'Grundmix',
    'ways.producer.inc5': 'Kreativ riktning',
    'ways.producer.cta': 'Boka Producer Session',

    // Resultatpaket
    'ways.result.title': 'Resultatpaket – Färdig låt klar för release',
    'ways.result.desc': 'För dig som vill ha en definierad leverans. Vi arbetar mot ett tydligt slutmål med fast omfattning.',
    'ways.result.pkg1.detail': '1 låt – Demo levereras inom 5 arbetsdagar från session.',
    'ways.result.pkg2.detail': '1 låt – Full produktion + mix + master. Leverans inom 14 arbetsdagar.',
    'ways.result.pkg3.detail': '3 låtar – Produktion + mix + master enligt överenskommen tidsplan. 50% förskott.',
    'ways.result.cta': 'Se paket',

    // Process
    'process.title': 'Så går det till',
    'process.step1': 'Boka',
    'process.step2': 'Session',
    'process.step3': 'Produktion',
    'process.step4': 'Leverans',
    'process.step5': 'Revision',
    'process.step6': 'Klar för release',

    // For Who
    'forwho.title': 'För artister, band och körer',
    'forwho.text': 'TOPLINER PRODUCTION är en professionell miljö för seriösa projekt. Vi kombinerar kreativ precision med kommersiellt fokus.',

    // Urgency
    'urgency.title': 'Begränsat antal sessioner varje vecka',
    'urgency.text': 'Boka i förväg för att säkra din plats.',
    'urgency.cta': 'Boka nu',

    // Booking
    'booking.title': 'Boka session',
    'booking.intro': 'Fyll i formuläret nedan så återkommer jag med bekräftelse, pris och nästa steg.',
    'booking.service': 'Typ av session',
    'booking.service.studio': 'Studio Session',
    'booking.service.producer': 'Producer Session',
    'booking.service.result': 'Resultatpaket',
    'booking.name': 'Namn',
    'booking.email': 'E-post',
    'booking.phone': 'Telefon',
    'booking.description': 'Berätta om ditt projekt',
    'booking.submit': 'Skicka förfrågan',
    'booking.success.title': 'Tack!',
    'booking.success.text': 'Din bokningsförfrågan är skickad. Du får snart en bekräftelse via e-post.',
    'booking.success.back': 'Tillbaka till startsidan',

    // FAQ
    'faq.title': 'Vanliga frågor',
    'faq.difference.q': 'Vad är skillnaden mellan Studio Session och Producer Session?',
    'faq.difference.a': 'I en Studio Session ansvarar jag för inspelning och teknisk kvalitet – du leder det kreativa. I en Producer Session arbetar vi aktivt tillsammans med låtens struktur, sound och arrangemang.',
    'faq.duration.q': 'Hur lång tid tar en session?',
    'faq.duration.a': 'Studio Session bokas i block om 4 eller 8 timmar. Producer Session bokas på samma sätt. Resultatpaket har sin egen tidsram beroende på paket.',
    'faq.included.q': 'Vad ingår i priset?',
    'faq.included.a': 'Alla sessioner inkluderar professionell studio, inspelning, teknisk hantering och fil-export. Producer Session inkluderar även aktiv produktion, arrangementstöd och kreativ riktning.',
    'faq.delivery.q': 'Hur snabbt får jag leverans?',
    'faq.delivery.a': 'Record Your Song levereras inom 5 arbetsdagar. Radio-Ready inom 14 arbetsdagar. EP Package enligt överenskommen tidsplan.',
    'faq.trial.q': 'Kan jag boka en provtimme?',
    'faq.trial.a': 'Just nu erbjuder vi inte enskilda provtimmar, men du kan boka ett kort samtal för att diskutera ditt projekt innan du bestämmer dig.',
    'faq.equipment.q': 'Vilken utrustning används i studion?',
    'faq.equipment.a': 'Vi arbetar med professionell inspelningsutrustning, högkvalitativa mikrofoner, preamps och monitorer i en akustiskt behandlad miljö.',
    'faq.payment.q': 'Hur går betalningen till?',
    'faq.payment.a': 'Timbaserade sessioner faktureras efter genomförd session. Resultatpaket faktureras enligt avtal – EP Package kräver 50% förskott.',
    'faq.musicians.q': 'Kan jag ta med egna musiker?',
    'faq.musicians.a': 'Absolut. Du är välkommen att ta med bandmedlemmar eller andra musiker till sessionen.',

    // Footer
    'footer.rights': 'Alla rättigheter förbehållna.',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.packages': 'Packages',
    'nav.booking': 'Book',

    // Hero
    'hero.title': 'Professional Studio for Artists, Bands & Choirs',
    'hero.subtitle': 'Choose how you want to work – Studio Session, Producer Session or Result Package.',
    'hero.cta.book': 'Book a Session',
    'hero.cta.packages': 'See Packages & Pricing',

    // Three Ways
    'ways.title': 'Three Ways to Create Music at TOPLINER PRODUCTION',
    'ways.subtitle': 'All sessions are led by the responsible producer on site. You choose the level of creative support and scope.',
    'ways.fits': 'Ideal for',
    'ways.includes': 'Included',

    // Studio Session
    'ways.studio.title': 'Studio Session – Technical Recording',
    'ways.studio.desc': 'For you who know what you want to record. I handle the recording and technical quality while you lead the creative content.',
    'ways.studio.fit1': 'Laying vocals on a finished beat',
    'ways.studio.fit2': 'Recording a band',
    'ways.studio.fit3': 'Recording a choir',
    'ways.studio.fit4': 'Continuing an existing project',
    'ways.studio.inc1': 'Professional studio',
    'ways.studio.inc2': 'Recording & technical handling',
    'ways.studio.inc3': 'Basic mix balance',
    'ways.studio.inc4': 'File export',
    'ways.studio.cta': 'Book Studio Session',

    // Producer Session
    'ways.producer.title': 'Producer Session – Creative Development',
    'ways.producer.desc': 'For you who want to develop the song together with a producer. We actively work on structure, sound, arrangement and direction.',
    'ways.producer.fit1': 'Building a beat from scratch',
    'ways.producer.fit2': 'Developing an unfinished song',
    'ways.producer.fit3': 'Restructuring chorus or arrangement',
    'ways.producer.fit4': 'Shaping the artist\'s sound',
    'ways.producer.inc1': 'Active production',
    'ways.producer.inc2': 'Arrangement support',
    'ways.producer.inc3': 'Structure adjustment',
    'ways.producer.inc4': 'Basic mix',
    'ways.producer.inc5': 'Creative direction',
    'ways.producer.cta': 'Book Producer Session',

    // Resultatpaket
    'ways.result.title': 'Result Package – Finished Song Ready for Release',
    'ways.result.desc': 'For you who want a defined deliverable. We work towards a clear end goal with a fixed scope.',
    'ways.result.pkg1.detail': '1 song – Demo delivered within 5 business days from session.',
    'ways.result.pkg2.detail': '1 song – Full production + mix + master. Delivery within 14 business days.',
    'ways.result.pkg3.detail': '3 songs – Production + mix + master per agreed timeline. 50% upfront.',
    'ways.result.cta': 'See Packages',

    // Process
    'process.title': 'How It Works',
    'process.step1': 'Book',
    'process.step2': 'Session',
    'process.step3': 'Production',
    'process.step4': 'Delivery',
    'process.step5': 'Revision',
    'process.step6': 'Ready for Release',

    // For Who
    'forwho.title': 'For Artists, Bands & Choirs',
    'forwho.text': 'TOPLINER PRODUCTION is a professional environment for serious projects. We combine creative precision with commercial focus.',

    // Urgency
    'urgency.title': 'Limited Sessions Available Each Week',
    'urgency.text': 'Book in advance to secure your spot.',
    'urgency.cta': 'Book Now',

    // Booking
    'booking.title': 'Book a Session',
    'booking.intro': 'Fill out the form below and I\'ll get back to you with confirmation, pricing and next steps.',
    'booking.service': 'Session type',
    'booking.service.studio': 'Studio Session',
    'booking.service.producer': 'Producer Session',
    'booking.service.result': 'Result Package',
    'booking.name': 'Name',
    'booking.email': 'Email',
    'booking.phone': 'Phone',
    'booking.description': 'Tell me about your project',
    'booking.submit': 'Submit Request',
    'booking.success.title': 'Thank you!',
    'booking.success.text': 'Your booking request has been submitted. You\'ll receive confirmation shortly.',
    'booking.success.back': 'Back to home',

    // Footer
    'footer.rights': 'All rights reserved.',
  },
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('topliner-language');
    return (saved as Language) || 'sv';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('topliner-language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
