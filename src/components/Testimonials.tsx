import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import AnimatedSection from '@/components/AnimatedSection';
import { Quote } from 'lucide-react';

interface Testimonial {
  id: string;
  customer_name: string;
  customer_role: string | null;
  quote: string;
}

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('testimonials')
        .select('id, customer_name, customer_role, quote')
        .eq('is_approved', true)
        .order('display_order');
      if (data) setTestimonials(data as Testimonial[]);
    };
    fetch();
  }, []);

  if (testimonials.length === 0) return null;

  return (
    <section className="py-20 md:py-28 bg-secondary/20">
      <div className="container px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-3">Vad våra kunder säger</h2>
          <div className="w-16 h-[1px] bg-primary mx-auto" />
        </div>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map(t => (
            <AnimatedSection key={t.id}>
              <div className="bg-card border border-border rounded-lg p-6 h-full flex flex-col">
                <Quote className="h-6 w-6 text-primary/40 mb-3 shrink-0" />
                <p className="font-sans text-sm leading-relaxed flex-1 italic text-foreground/90">"{t.quote}"</p>
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="font-sans text-sm font-medium">{t.customer_name}</p>
                  {t.customer_role && <p className="text-xs text-muted-foreground font-sans">{t.customer_role}</p>}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
