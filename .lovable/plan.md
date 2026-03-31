

# FAQ-sektion for TOPLINER PRODUCTION

## Sammanfattning
Lagg till en FAQ-sektion pa startsidan med vanliga fragor om sessioner, priser och leveranstider. Sektionen placeras mellan "For Vem" och "Urgency CTA" for att bemota invandningar innan sista bokningsknappen.

## Testresultat

Fore implementering testades hela sajten:

- **Bokningsflode**: Fungerar korrekt. "Boka session" leder till formular, val av tjanst/namn/email fungerar, bekraftelsesidan visas efter inskickning.
- **Edge function**: Startar korrekt (boot time 36ms). E-postfunktionen ar redo.
- **Mobilvy (390x844)**: Hamburger-meny visas, alla sektioner renderas korrekt, CTA-knappar ar valplacerade, texten ar lasbar.
- **Desktop**: Hero, ThreeWays (priser), Process, ForWho och UrgencyCTA visas som forvantat.

## Vad som byggs

### 1. Ny komponent: `src/components/FAQ.tsx`
- Anvander befintlig Accordion-komponent fran `@radix-ui/react-accordion`
- 6-8 vanliga fragor pa bade svenska och engelska
- Samma designsprak som ovriga sektioner (mork bakgrund, serif-rubriker, sans-serif brodtext)
- Fragor fokuserade pa konvertering: pris, leverans, vad som ingar, hur bokning fungerar

### 2. Fragor som ingar

**Svenska:**
1. Vad ar skillnaden mellan Studio Session och Producer Session?
2. Hur lang tid tar en session?
3. Vad ingar i priset?
4. Hur snabbt far jag leverans?
5. Kan jag boka en provtimme?
6. Vilken utrustning anvands i studion?
7. Hur gar betalningen till?
8. Kan jag ta med egna musiker?

### 3. Uppdaterade filer

- `src/contexts/LanguageContext.tsx` -- Nya oversattningsnycklar for alla FAQ-fragor och svar (SV + EN)
- `src/pages/Index.tsx` -- Lagg till FAQ-komponenten mellan ForWho och UrgencyCTA, inuti AnimatedSection

### 4. Designval
- Accordion-stil med ett fragetecken i taget oppet
- Guldaccent pa chevron-ikonen
- Sektionsrubrik: "Vanliga fragor" / "Frequently Asked Questions"
- Tunn guldlinje som visuell separator under rubriken (samma stil som ovriga sektioner)

## Tekniska detaljer

- Ateranvander befintliga `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent` fran `src/components/ui/accordion.tsx`
- Ateranvander `AnimatedSection` for scroll-animation
- Inga databasandringar, inga nya beroenden
- Mobilanpassning via `max-w-3xl mx-auto` och Tailwind responsive classes

