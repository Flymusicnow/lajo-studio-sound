import { useLanguage } from '@/contexts/LanguageContext';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqKeys = [
  'difference',
  'duration',
  'included',
  'delivery',
  'trial',
  'equipment',
  'payment',
  'musicians',
];

const FAQ = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-2 text-center">
          {t('faq.title')}
        </h2>
        <div className="w-12 h-[1px] bg-gold mx-auto mb-12" />

        <Accordion type="single" collapsible className="space-y-2">
          {faqKeys.map((key, i) => (
            <AccordionItem
              key={key}
              value={key}
              className="border-border/50 px-2"
            >
              <AccordionTrigger className="text-foreground hover:text-gold hover:no-underline text-left font-sans text-sm md:text-base [&>svg]:text-gold">
                {t(`faq.${key}.q`)}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground font-sans text-sm leading-relaxed">
                {t(`faq.${key}.a`)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;
