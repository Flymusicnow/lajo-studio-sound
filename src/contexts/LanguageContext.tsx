import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'sv' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations
const translations: Record<Language, Record<string, string>> = {
  sv: {
    // Navigation
    'nav.home': 'Hem',
    'nav.pricing': 'Priser',
    'nav.booking': 'Boka',
    
    // Hero
    'hero.title': 'Professionell Mixning & Mastring för Artister som Menar Allvar',
    'hero.subtitle': 'Privat studio på landet i Sverige. Internationell kvalitet och full fokus på detaljer.',
    'hero.cta.book': 'Boka projekt',
    'hero.cta.packages': 'Se paket',
    
    // Studio Intro
    'studio.title': 'Studion',
    'studio.text': 'Jag driver en privat high-end studio på landet – en lugn och inspirerande plats där artister kan arbeta ostört, långt bort från stadens brus. Studion är utrustad med premiumutrustning: kraftfull arbetsstation, high-end mikrofoner, förstklassiga preamps och de bästa pluggarna jag kan få tag på. Här får varje projekt min fulla fokus, inga avbrott, ingen stress – bara musik, kvalitet och kreativ energi.',
    'studio.text2': 'Det här är en miljö där många hittar ett helt nytt flow: tystnaden, naturen, atmosfären och känslan av att vara helt närvarande i musiken. Oavsett om du spelar in på plats eller skickar ditt projekt online får du samma nivå av omsorg, precision och professionellt resultat.',
    
    // Services
    'services.title': 'Tjänster',
    'services.recording': 'Inspelning',
    'services.recording.desc': 'Spela in i en inspirerande miljö med professionell utrustning.',
    'services.mixing': 'Mixning',
    'services.mixing.desc': 'Balansera och polera din musik till perfektion.',
    'services.mastering': 'Mastring',
    'services.mastering.desc': 'Slutfinish för streaming, vinyl eller CD.',
    'services.production': 'Produktion',
    'services.production.desc': 'Skräddarsydda beats och fullständig produktion.',
    
    // Pricing
    'pricing.title': 'Priser & Paket',
    'pricing.subtitle': 'Transparent prissättning för alla projekt',
    'pricing.configurator.title': 'Bygg ditt paket',
    'pricing.service': 'Välj tjänst',
    'pricing.package': 'Välj paket',
    'pricing.tracks': 'Antal spår',
    'pricing.delivery': 'Leveranstid',
    'pricing.total': 'Totalt',
    'pricing.book': 'Boka nu',
    
    // Services dropdown
    'pricing.service.recording': 'Inspelning i studion',
    'pricing.service.mixing': 'Mixning (online)',
    'pricing.service.mastering': 'Mastring (online)',
    'pricing.service.production': 'Produktion / Beat',
    
    // Packages dropdown
    'pricing.package.basic': 'Basic',
    'pricing.package.premium': 'Premium',
    'pricing.package.highend': 'High-End',
    'pricing.package.recommend': 'Osäker – rekommendera paket',
    
    // Tracks dropdown
    'pricing.tracks.0-30': '0–30 spår',
    'pricing.tracks.31-60': '31–60 spår',
    'pricing.tracks.61-100': '61–100 spår',
    'pricing.tracks.100+': '100+ spår (offert)',
    
    // Delivery dropdown
    'pricing.delivery.standard': 'Standard (5 dagar)',
    'pricing.delivery.priority': 'Prioriterad (3 dagar)',
    
    // Pricing tables
    'pricing.mixing.title': 'Mixning',
    'pricing.mastering.title': 'Mastring',
    'pricing.recording.title': 'Inspelning',
    'pricing.production.title': 'Produktion',
    'pricing.revisions': 'revisioner ingår',
    'pricing.unlimited': 'obegränsade revisioner',
    'pricing.from': 'från',
    'pricing.halfday': 'Halvdag',
    'pricing.fullday': 'Heldag',
    'pricing.weekend': 'Helg-retreat',
    'pricing.exclusive': 'Exklusiv',
    'pricing.stereo': 'Stereo Master',
    'pricing.hybrid': 'Premium Hybrid Master',
    'pricing.stem': 'High-End Stem Master',
    
    // Booking
    'booking.title': 'Boka tid eller skicka projektförfrågan',
    'booking.intro': 'Fyll i formuläret för att boka studiotid eller skicka in mix-/mastringsprojekt. Du får en bekräftelse via e-post (och sms om du anger ditt nummer). Jag återkommer med bekräftad tid, pris och nästa steg.',
    'booking.songs': 'Antal låtar',
    'booking.date': 'Inspelningsdatum',
    'booking.name': 'Namn',
    'booking.artist': 'Artistnamn',
    'booking.email': 'E-post',
    'booking.phone': 'Telefon',
    'booking.location': 'Stad/Land',
    'booking.link': 'Länk till musik',
    'booking.description': 'Projektbeskrivning',
    'booking.submit': 'Skicka förfrågan',
    'booking.success.title': 'Tack!',
    'booking.success.text': 'Din bokningsförfrågan är skickad. Du får snart en bekräftelse via e-post (och sms om möjligt).',
    'booking.success.back': 'Tillbaka till startsidan',
    
    // CTA
    'cta.title': 'Redo att ta din musik till nästa nivå?',
    'cta.button': 'Starta ditt projekt',
    
    // Footer
    'footer.rights': 'Alla rättigheter förbehållna.',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.pricing': 'Pricing',
    'nav.booking': 'Book',
    
    // Hero
    'hero.title': 'Premium Mixing & Mastering for Artists Who Take Their Sound Seriously',
    'hero.subtitle': 'Private countryside studio in Sweden. International-quality sound with full attention to detail.',
    'hero.cta.book': 'Start Your Project',
    'hero.cta.packages': 'View Packages',
    
    // Studio Intro
    'studio.title': 'The Studio',
    'studio.text': 'I run a private high-end studio in the Swedish countryside – a quiet, inspiring environment where artists can work without distractions. The studio is equipped with premium gear: a powerful workstation, high-end microphones, world-class preamps, and top-tier plugins. Every project receives my full attention — no interruptions, no pressure, just music, quality and creative energy.',
    'studio.text2': 'Many artists find a new creative flow here: the silence, the nature, the atmosphere, and the feeling of being fully present with the music. Whether you record on-site or submit your project remotely, you receive the same level of care, precision and professional quality.',
    
    // Services
    'services.title': 'Services',
    'services.recording': 'Recording',
    'services.recording.desc': 'Record in an inspiring environment with professional equipment.',
    'services.mixing': 'Mixing',
    'services.mixing.desc': 'Balance and polish your music to perfection.',
    'services.mastering': 'Mastering',
    'services.mastering.desc': 'Final finish for streaming, vinyl or CD.',
    'services.production': 'Production',
    'services.production.desc': 'Custom beats and full production services.',
    
    // Pricing
    'pricing.title': 'Pricing & Packages',
    'pricing.subtitle': 'Transparent pricing for all projects',
    'pricing.configurator.title': 'Build Your Package',
    'pricing.service': 'Choose service',
    'pricing.package': 'Choose package',
    'pricing.tracks': 'Track count',
    'pricing.delivery': 'Delivery time',
    'pricing.total': 'Total',
    'pricing.book': 'Book now',
    
    // Services dropdown
    'pricing.service.recording': 'Recording in studio',
    'pricing.service.mixing': 'Mixing (online)',
    'pricing.service.mastering': 'Mastering (online)',
    'pricing.service.production': 'Production / Beat',
    
    // Packages dropdown
    'pricing.package.basic': 'Basic',
    'pricing.package.premium': 'Premium',
    'pricing.package.highend': 'High-End',
    'pricing.package.recommend': 'Not sure – recommend package',
    
    // Tracks dropdown
    'pricing.tracks.0-30': '0–30 tracks',
    'pricing.tracks.31-60': '31–60 tracks',
    'pricing.tracks.61-100': '61–100 tracks',
    'pricing.tracks.100+': '100+ tracks (quote)',
    
    // Delivery dropdown
    'pricing.delivery.standard': 'Standard (5 days)',
    'pricing.delivery.priority': 'Priority (3 days)',
    
    // Pricing tables
    'pricing.mixing.title': 'Mixing',
    'pricing.mastering.title': 'Mastering',
    'pricing.recording.title': 'Recording',
    'pricing.production.title': 'Production',
    'pricing.revisions': 'revisions included',
    'pricing.unlimited': 'unlimited revisions',
    'pricing.from': 'from',
    'pricing.halfday': 'Half-day',
    'pricing.fullday': 'Full-day',
    'pricing.weekend': 'Weekend retreat',
    'pricing.exclusive': 'Exclusive',
    'pricing.stereo': 'Stereo Master',
    'pricing.hybrid': 'Premium Hybrid Master',
    'pricing.stem': 'High-End Stem Master',
    
    // Booking
    'booking.title': 'Book a Session / Submit Your Project',
    'booking.intro': 'Fill out the form to book studio time or submit your project. You\'ll receive an email confirmation (and SMS if phone number is provided).',
    'booking.songs': 'Number of songs',
    'booking.date': 'Recording date',
    'booking.name': 'Name',
    'booking.artist': 'Artist name',
    'booking.email': 'Email',
    'booking.phone': 'Phone',
    'booking.location': 'City/Country',
    'booking.link': 'Link to music',
    'booking.description': 'Project description',
    'booking.submit': 'Submit request',
    'booking.success.title': 'Thank you!',
    'booking.success.text': 'Your request has been submitted. You will receive confirmation shortly.',
    'booking.success.back': 'Back to home',
    
    // CTA
    'cta.title': 'Ready to take your music to the next level?',
    'cta.button': 'Start Your Project',
    
    // Footer
    'footer.rights': 'All rights reserved.',
  },
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('lajo-language');
    return (saved as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('lajo-language', lang);
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
