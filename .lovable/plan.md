

# TOPLINER PRODUCTION -- Konverteringsoptimerad hemsida

## Sammanfattning

Ombyggnad av hela sajten fran LAJO Studio till TOPLINER PRODUCTION. En ensidesstruktur optimerad for konvertering med tydliga sektioner, priser och bokningsknappar i varje sektion. Designstilen behalles (mork, premium, minimal) men anpassas till TOPLINER PRODUCTIONs varumarke.

## Vad som andras

### 1. Branding och navigation
- Logo: LAJO -> TOPLINER PRODUCTION
- Navigering: Hem, Paket, Boka (tar bort About-sidan)
- Sprakvaxlaren behalles (SV/EN)
- Header uppdateras med ny logotyp och ankarlankningar till sektioner pa startsidan

### 2. Startsidan (Index.tsx) -- ny sektionsstruktur

Alla sektioner byggs som separata komponenter pa en enda sida:

**Hero**
- Rubrik: "Professionell studio for artister, band och korer"
- Underrubrik om de tre arbetssatten
- Primart CTA: "Boka session" (lankar till /booking)
- Sekundart CTA: "Se paket & priser" (ankarlank till #paket)

**Tre satt att jobba (ny komponent: ThreeWays.tsx)**
- Tre kort/kolumner med Studio Session, Producer Session, Resultatpaket
- Varje kort visar: rubrik, text, "Passar for"-lista, priser, CTA-knapp
- Resultatpaketet visar tre underpaket: Record Your Song (8 900 kr), Radio-Ready (18 000 kr), EP Package (45 000 kr)

**Process (ny komponent: Process.tsx)**
- 6 steg visuellt: Boka -> Session -> Produktion -> Leverans -> Revision -> Klar for release
- Horisontell tidslinje pa desktop, vertikal pa mobil

**For Vem (ny komponent: ForWho.tsx)**
- Kort sektion med positioneringstext

**Urgency/CTA (uppdatera CTA.tsx)**
- "Begransat antal sessioner varje vecka"
- Stark bokningsknapp

### 3. Bokningssidan (Booking.tsx)
- Anpassas till TOPLINER: tjanstval blir Studio Session / Producer Session / Resultatpaket
- Behaller e-postnotifieringar via befintlig edge function
- Formularet forenklas: namn, email, telefon, tjanst, beskrivning

### 4. Prissidan tas bort
- All prisinformation visas direkt pa startsidan i "Tre satt att jobba"-sektionen
- /pricing-routen tas bort fran App.tsx

### 5. About-sidan tas bort
- /about-routen tas bort fran App.tsx

### 6. Oversattningar (LanguageContext.tsx)
- Alla LAJO-texter ersatts med TOPLINER PRODUCTION-texter
- Bade SV och EN uppdateras med nytt innehall

### 7. Filer som skapas
- `src/components/ThreeWays.tsx` -- De tre arbetssatten med priser och CTA
- `src/components/Process.tsx` -- 6-stegsprocessen
- `src/components/ForWho.tsx` -- Malgruppssektionen
- `src/components/UrgencyCTA.tsx` -- Urgency-sektion med bokningsknapp

### 8. Filer som uppdateras
- `src/pages/Index.tsx` -- Ny sektionsstruktur
- `src/components/Hero.tsx` -- Nytt innehall
- `src/components/Header.tsx` -- Ny logo och navigation
- `src/components/Footer.tsx` -- Ny logo
- `src/components/Layout.tsx` -- Oforandrad
- `src/contexts/LanguageContext.tsx` -- Helt nytt innehall
- `src/App.tsx` -- Ta bort /about och /pricing rutter
- `src/pages/Booking.tsx` -- Anpassat formular

### 9. Filer som tas bort / inte langre anvands
- `src/pages/Pricing.tsx` -- Ersatts av sektioner pa startsidan
- `src/pages/About.tsx` -- Tas bort
- `src/components/StudioIntro.tsx` -- Ersatts av nya komponenter
- `src/components/Services.tsx` -- Ersatts av ThreeWays
- `src/components/Portfolio.tsx` -- Tas bort (laggs till i v2)

## Tekniska detaljer

- Designsystemet (farger, typografi, animationer) behalles fran index.css och tailwind.config.ts -- det passar TOPLINER PRODUCTIONs stil
- Befintliga UI-komponenter (Button, Card, Select, Input, Textarea) ateranvands
- AnimatedSection-komponenten ateranvands for scroll-animationer
- Edge function for e-post behalles, uppdateras med nytt varumarke i mejlet
- Inga databasandringar behovs
- Mobilanpassning via Tailwind responsive classes (grid -> stack)

