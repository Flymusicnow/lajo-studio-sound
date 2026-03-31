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
    'nav.quickBooking': 'Snabbbokning',

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

    // Booking Builder
    'bb.title': 'Bygg din session',
    'bb.subtitle': 'Välj alternativ nedan och se priset uppdateras direkt.',
    'bb.step': 'Steg',
    'bb.of': 'av',
    'bb.progress': 'Bygg din session',
    'bb.nav.back': 'Tillbaka',
    'bb.nav.next': 'Fortsätt',
    'bb.nav.submit': 'Säkra din session',
    'bb.nav.sending': 'Skickar...',
    'bb.badge.popular': 'Mest populär',
    'bb.badge.bestValue': 'Bäst värde',
    'bb.nudge.almost': 'Du är nästan klar',
    'bb.confirm.text': 'Din sessionförfrågan är skickad. Du får bekräftelse via e-post inom kort.',
    // Step 1
    'bb.s1.title': 'Välj din session',
    'bb.s1.sub': 'Alla sessioner leds av ansvarig producent på plats.',
    'bb.s1.4h': '4h Producer Session',
    'bb.s1.8h': '8h Producer Session',
    'bb.s1.custom': 'Custom session',
    'bb.s1.custom.desc': 'Beskriv vad du behöver så återkommer vi med pris.',
    'bb.s1.custom.placeholder': 'Beskriv din session...',
    // Step 2
    'bb.s2.title': 'Vad skapar vi?',
    'bb.s2.sub': 'Välj ett eller flera alternativ.',
    'bb.s2.new': 'Ny låt från scratch',
    'bb.s2.develop': 'Utveckla befintligt spår',
    'bb.s2.topline': 'Topline-skrivande',
    'bb.s2.beat': 'Beat-produktion',
    'bb.s2.mixing': 'Mixning',
    'bb.s2.other': 'Annat',
    'bb.s2.other.placeholder': 'Beskriv...',
    // Step 3
    'bb.s3.title': 'Kreativa tillägg',
    'bb.s3.sub': 'Välj tillägg för att förstärka din session.',
    'bb.s3.arrangement': 'Arrangemang & struktur',
    'bb.s3.vocal': 'Vokalproduktion',
    'bb.s3.sound': 'Sound design',
    'bb.s3.revision': 'Extra revisionsrunda',
    'bb.s3.express': 'Expressleverans',
    // Step 4
    'bb.s4.title': 'Slutför ditt spår',
    'bb.s4.sub': 'Vill du ha mastering?',
    'bb.s4.none': 'Ingen mastering',
    'bb.s4.perTrack': 'Mastering per spår',
    'bb.s4.track': 'spår',
    'bb.s4.howMany': 'Antal spår',
    'bb.s4.included': 'Mastering ingår i ditt valda resultatpaket.',
    // Step 5
    'bb.s5.title': 'Välj ditt resultat',
    'bb.s5.sub': 'Vad vill du ha ut av sessionen?',
    'bb.s5.sessionOnly': 'Enbart session',
    'bb.s5.sessionOnly.desc': 'Inspelning och grundmix. Du tar med dig filerna.',
    'bb.s5.record': 'Record Your Song',
    'bb.s5.record.desc': '1 låt — demo levereras inom 5 arbetsdagar.',
    'bb.s5.radio': 'Radio Ready',
    'bb.s5.radio.desc': 'Full produktion, mix & mastering. Klar för release.',
    'bb.s5.ep': 'EP Package',
    'bb.s5.ep.desc': '3 låtar — produktion + mix + master enligt tidsplan. 50% förskott.',
    'bb.s5.nudge': 'De flesta kunder väljer ett resultatpaket för bästa slutresultat.',
    // Step 6
    'bb.s6.title': 'Projektkomplexitet',
    'bb.s6.sub': 'Ungefär hur många spår har ditt projekt?',
    'bb.s6.standard': '0–20 spår (standard)',
    'bb.s6.standard.desc': 'Typiskt för de flesta produktioner.',
    'bb.s6.advanced': '20–50 spår (avancerat)',
    'bb.s6.advanced.desc': 'Större arrangemang med fler element.',
    'bb.s6.complex': '50+ spår (komplext)',
    'bb.s6.complex.desc': 'Omfattande projekt med många lager.',
    'bb.s6.note': 'Större sessioner kan kräva ytterligare tid och budgetjustering.',
    // Step 7
    'bb.s7.title': 'Detaljer & kontakt',
    'bb.s7.project': 'Projektdetaljer',
    'bb.s7.songs': 'Antal låtar',
    'bb.s7.tracks': 'Antal spår/stems',
    'bb.s7.reference': 'Referenslänk',
    'bb.s7.deadline': 'Deadline',
    'bb.s7.pickDate': 'Välj datum',
    'bb.s7.desc': 'Kort beskrivning',
    'bb.s7.prep.title': 'Förbered dina filer',
    'bb.s7.prep.1': 'Rena exporter (ingen clipping)',
    'bb.s7.prep.2': 'Tydligt namngivna spår',
    'bb.s7.prep.3': 'Ta bort oanvända filer',
    'bb.s7.prep.4': 'Inkludera referensspår',
    'bb.s7.contact': 'Kontaktuppgifter',
    'bb.s7.payment': 'Betalningsval',
    'bb.s7.deposit': '50% förskott (rekommenderat)',
    'bb.s7.deposit.desc': 'Säkra din session med förskott. Resterande betalas före leverans.',
    'bb.s7.full': 'Fullbetalning',
    // Step 8
    'bb.s8.title': 'Granska din session',
    'bb.s8.sub': 'Kontrollera att allt stämmer innan du skickar.',
    // Price panel
    'bb.price.title': 'Din session',
    'bb.price.total': 'Totalt',
    'bb.price.deposit': 'Förskott (50%)',
    'bb.price.remaining': 'Resterande',

    // About
    'about.label': 'Om mig',
    'about.title': 'Topliner Production',
    'about.bio1': 'Jag driver Topliner Production – en professionell studio för artister, band och körer som vill ta sin musik till nästa nivå.',
    'about.bio2': 'Varje session leds av mig som ansvarig producent. Det handlar inte om att hyra en studio – det handlar om att arbeta med någon som bryr sig om resultatet lika mycket som du.',
    'about.bio3': 'Min bakgrund spänner över kommersiell produktion, mixing och mastering. Jag arbetar med artister som är seriösa med sin musik och vill ha en tydlig kreativ riktning.',
    'about.what.title': 'Vad jag gör',
    'about.what.1': 'Produktion – från idé till färdig låt',
    'about.what.2': 'Mixing & mastering för release',
    'about.what.3': 'Kreativ riktning & arrangemang',
    'about.what.4': 'Sessioner för artister, band & körer',
    'about.philosophy.title': 'Kvalitet, riktning, smak',
    'about.philosophy.text': 'Jag tror på att varje projekt förtjänar en tydlig kreativ vision. Kvalitet handlar inte bara om ljud – det handlar om riktning, smak och att våga ta beslut som gör musiken bättre.',
    'about.cta.title': 'Redo att börja?',
    'about.cta.book': 'Bygg din session',

    // Quick Booking
    'qb.label': 'Snabbbokning',
    'qb.title': 'Quick Studio Booking',
    'qb.subtitle': 'Snabbbokning för artister som redan vet vad de behöver och bara vill ha studiotid.',
    'qb.step1': '1. Välj session',
    'qb.step2': '2. Välj datum',
    'qb.step3': '3. Kontaktuppgifter',
    'qb.message': 'Meddelande (valfritt)',
    'qb.messagePlaceholder': 'Berätta kort om ditt projekt...',
    'qb.cta': 'Skicka bokningsförfrågan',
    'qb.link': 'Bara studiotid? Snabboka här',

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

    // FAQ
    'faq.title': 'Frequently Asked Questions',
    'faq.difference.q': 'What is the difference between Studio Session and Producer Session?',
    'faq.difference.a': 'In a Studio Session, I handle recording and technical quality – you lead the creative direction. In a Producer Session, we actively collaborate on the song\'s structure, sound and arrangement.',
    'faq.duration.q': 'How long is a session?',
    'faq.duration.a': 'Studio Sessions are booked in 4 or 8 hour blocks. Producer Sessions work the same way. Result Packages have their own timeline depending on the package.',
    'faq.included.q': 'What is included in the price?',
    'faq.included.a': 'All sessions include professional studio, recording, technical handling and file export. Producer Session also includes active production, arrangement support and creative direction.',
    'faq.delivery.q': 'How fast do I get delivery?',
    'faq.delivery.a': 'Record Your Song is delivered within 5 business days. Radio-Ready within 14 business days. EP Package per agreed timeline.',
    'faq.trial.q': 'Can I book a trial session?',
    'faq.trial.a': 'We don\'t currently offer single trial hours, but you can book a short call to discuss your project before committing.',
    'faq.equipment.q': 'What equipment is used in the studio?',
    'faq.equipment.a': 'We work with professional recording equipment, high-quality microphones, preamps and monitors in an acoustically treated environment.',
    'faq.payment.q': 'How does payment work?',
    'faq.payment.a': 'Hourly sessions are invoiced after the session. Result Packages are invoiced per agreement – EP Package requires 50% upfront.',
    'faq.musicians.q': 'Can I bring my own musicians?',
    'faq.musicians.a': 'Absolutely. You\'re welcome to bring band members or other musicians to the session.',

    // Booking Builder
    'bb.title': 'Build Your Session',
    'bb.subtitle': 'Select options below and watch the price update in real time.',
    'bb.step': 'Step',
    'bb.of': 'of',
    'bb.progress': 'Build your session',
    'bb.nav.back': 'Back',
    'bb.nav.next': 'Continue',
    'bb.nav.submit': 'Secure your session',
    'bb.nav.sending': 'Sending...',
    'bb.badge.popular': 'Most popular',
    'bb.badge.bestValue': 'Best value',
    'bb.nudge.almost': "You're almost done",
    'bb.confirm.text': 'Your session request has been sent. You will receive confirmation via email shortly.',
    'bb.s1.title': 'Choose your session',
    'bb.s1.sub': 'All sessions are led by the responsible producer on site.',
    'bb.s1.4h': '4h Producer Session',
    'bb.s1.8h': '8h Producer Session',
    'bb.s1.custom': 'Custom session',
    'bb.s1.custom.desc': 'Describe what you need and we will get back with pricing.',
    'bb.s1.custom.placeholder': 'Describe your session...',
    'bb.s2.title': 'What are we creating?',
    'bb.s2.sub': 'Select one or more options.',
    'bb.s2.new': 'New song from scratch',
    'bb.s2.develop': 'Develop existing track',
    'bb.s2.topline': 'Topline writing',
    'bb.s2.beat': 'Beat production',
    'bb.s2.mixing': 'Mixing',
    'bb.s2.other': 'Other',
    'bb.s2.other.placeholder': 'Describe...',
    'bb.s3.title': 'Creative Add-Ons',
    'bb.s3.sub': 'Enhance your session with add-ons.',
    'bb.s3.arrangement': 'Arrangement & structure',
    'bb.s3.vocal': 'Vocal production',
    'bb.s3.sound': 'Sound design',
    'bb.s3.revision': 'Extra revision round',
    'bb.s3.express': 'Express delivery',
    'bb.s4.title': 'Finalize your track',
    'bb.s4.sub': 'Would you like mastering?',
    'bb.s4.none': 'No mastering',
    'bb.s4.perTrack': 'Mastering per track',
    'bb.s4.track': 'track',
    'bb.s4.howMany': 'Number of tracks',
    'bb.s4.included': 'Mastering is included in your selected result package.',
    'bb.s5.title': 'Choose your result',
    'bb.s5.sub': 'What do you want from your session?',
    'bb.s5.sessionOnly': 'Session only',
    'bb.s5.sessionOnly.desc': 'Recording and basic mix. You take the files.',
    'bb.s5.record': 'Record Your Song',
    'bb.s5.record.desc': '1 song — demo delivered within 5 business days.',
    'bb.s5.radio': 'Radio Ready',
    'bb.s5.radio.desc': 'Full production, mix & mastering. Ready for release.',
    'bb.s5.ep': 'EP Package',
    'bb.s5.ep.desc': '3 songs — production + mix + master per agreed timeline. 50% upfront.',
    'bb.s5.nudge': 'Most clients choose a result package for the best final outcome.',
    'bb.s6.title': 'Project complexity',
    'bb.s6.sub': 'Approximately how many tracks does your project have?',
    'bb.s6.standard': '0–20 tracks (standard)',
    'bb.s6.standard.desc': 'Typical for most productions.',
    'bb.s6.advanced': '20–50 tracks (advanced)',
    'bb.s6.advanced.desc': 'Larger arrangements with more elements.',
    'bb.s6.complex': '50+ tracks (complex)',
    'bb.s6.complex.desc': 'Extensive projects with many layers.',
    'bb.s6.note': 'Larger sessions may require additional time and budget adjustment.',
    'bb.s7.title': 'Details & Contact',
    'bb.s7.project': 'Project details',
    'bb.s7.songs': 'Number of songs',
    'bb.s7.tracks': 'Number of tracks/stems',
    'bb.s7.reference': 'Reference link',
    'bb.s7.deadline': 'Deadline',
    'bb.s7.pickDate': 'Pick a date',
    'bb.s7.desc': 'Short description',
    'bb.s7.prep.title': 'Prepare your files',
    'bb.s7.prep.1': 'Clean exports (no clipping)',
    'bb.s7.prep.2': 'Clearly named tracks',
    'bb.s7.prep.3': 'Remove unused files',
    'bb.s7.prep.4': 'Include reference track',
    'bb.s7.contact': 'Contact details',
    'bb.s7.payment': 'Payment choice',
    'bb.s7.deposit': '50% deposit (recommended)',
    'bb.s7.deposit.desc': 'Secure your session with a deposit. Remaining balance paid before delivery.',
    'bb.s7.full': 'Full payment',
    'bb.s8.title': 'Review your session',
    'bb.s8.sub': 'Make sure everything looks right before submitting.',
    'bb.price.title': 'Your Session',
    'bb.price.total': 'Total',
    'bb.price.deposit': 'Deposit (50%)',
    'bb.price.remaining': 'Remaining',

    // About
    'about.label': 'About',
    'about.title': 'Topliner Production',
    'about.bio1': 'I run Topliner Production – a professional studio for artists, bands and choirs who want to take their music to the next level.',
    'about.bio2': 'Every session is led by me as the responsible producer. This is not about renting a studio – it\'s about working with someone who cares about the result as much as you do.',
    'about.bio3': 'My background spans commercial production, mixing and mastering. I work with artists who are serious about their music and want a clear creative direction.',
    'about.what.title': 'What I do',
    'about.what.1': 'Production – from idea to finished song',
    'about.what.2': 'Mixing & mastering for release',
    'about.what.3': 'Creative direction & arrangement',
    'about.what.4': 'Sessions for artists, bands & choirs',
    'about.philosophy.title': 'Quality, direction, taste',
    'about.philosophy.text': 'I believe every project deserves a clear creative vision. Quality isn\'t just about sound – it\'s about direction, taste, and having the courage to make decisions that make the music better.',
    'about.cta.title': 'Ready to start?',
    'about.cta.book': 'Build your session',

    // Quick Booking
    'qb.label': 'Quick Booking',
    'qb.title': 'Quick Studio Booking',
    'qb.subtitle': 'Quick booking for artists who already know what they need and just want studio time.',
    'qb.step1': '1. Select session',
    'qb.step2': '2. Select date',
    'qb.step3': '3. Contact details',
    'qb.message': 'Message (optional)',
    'qb.messagePlaceholder': 'Tell us briefly about your project...',
    'qb.cta': 'Send booking request',
    'qb.link': 'Just need studio time? Quick book here',

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
