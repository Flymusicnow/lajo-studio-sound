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
    'nav.about': 'Om LAJO',
    'nav.pricing': 'Priser',
    'nav.booking': 'Boka',
    
    // About page
    'about.label': 'Om Mig',
    'about.title': 'LAJO',
    'about.bio1': 'Med över 10 års erfarenhet inom musikproduktion har jag haft förmånen att arbeta med allt från spirande talanger till etablerade artister. Min resa började i ett litet sovrum med en dator och en dröm – idag driver jag en professionell studio på den svenska landsbygden.',
    'about.bio2': 'Min filosofi är enkel: varje låt förtjänar att behandlas som ett konstverk. Jag tror på att lyssna först, förstå artistens vision, och sedan använda min tekniska kunskap för att förstärka det som redan finns där. Det handlar inte om att sätta min prägel på musiken – det handlar om att hjälpa din musik att nå sin fulla potential.',
    'about.bio3': 'När jag inte är i studion hittar du mig förmodligen ute i naturen, jagandes inspiration i de svenska skogarna och sjöarna som omger min studio. Den tystnaden och friden är en stor del av varför jag valde att bygga min studio här – och varför så många artister hittar ett nytt kreativt flow när de besöker.',
    'about.credentials.title': 'Erfarenhet & Meriter',
    'about.credential1': '500+ mixade och mastrade låtar',
    'about.credential2': 'Arbetat med artister från 15+ länder',
    'about.credential3': 'Samarbeten med major och indie-labels',
    'about.credential4': 'Certifierad i Pro Tools & Logic Pro',
    'about.philosophy.title': 'Min Filosofi',
    'about.philosophy.text': 'Jag tror att den bästa produktionen är den som tjänar låten, inte tvärtom. Min roll är att vara en förlängning av din kreativa vision – att översätta känslan du har i huvudet till något som världen kan höra och känna.',
    
    // Portfolio
    'portfolio.title': 'Lyssna på Tidigare Arbeten',
    'portfolio.subtitle': 'Ett urval av projekt jag har arbetat med genom åren.',
    'portfolio.note': 'Dessa är exempel på tidigare produktioner. Kontakta mig för fler referenser.',
    
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
    'nav.about': 'About',
    'nav.pricing': 'Pricing',
    'nav.booking': 'Book',
    
    // About page
    'about.label': 'About Me',
    'about.title': 'LAJO',
    'about.bio1': 'With over 10 years of experience in music production, I\'ve had the privilege of working with everyone from emerging talents to established artists. My journey started in a small bedroom with a computer and a dream – today I run a professional studio in the Swedish countryside.',
    'about.bio2': 'My philosophy is simple: every song deserves to be treated as a work of art. I believe in listening first, understanding the artist\'s vision, and then using my technical knowledge to enhance what\'s already there. It\'s not about putting my stamp on the music – it\'s about helping your music reach its full potential.',
    'about.bio3': 'When I\'m not in the studio, you\'ll probably find me out in nature, chasing inspiration in the Swedish forests and lakes surrounding my studio. That silence and peace is a big part of why I chose to build my studio here – and why so many artists find a new creative flow when they visit.',
    'about.credentials.title': 'Experience & Credentials',
    'about.credential1': '500+ songs mixed and mastered',
    'about.credential2': 'Worked with artists from 15+ countries',
    'about.credential3': 'Collaborations with major and indie labels',
    'about.credential4': 'Certified in Pro Tools & Logic Pro',
    'about.philosophy.title': 'My Philosophy',
    'about.philosophy.text': 'I believe that the best production is one that serves the song, not the other way around. My role is to be an extension of your creative vision – to translate the feeling in your head into something the world can hear and feel.',
    
    // Portfolio
    'portfolio.title': 'Listen to Previous Work',
    'portfolio.subtitle': 'A selection of projects I\'ve worked on over the years.',
    'portfolio.note': 'These are examples of previous productions. Contact me for more references.',
    
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
