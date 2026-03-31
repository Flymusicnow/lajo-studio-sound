import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BookingSuccess = () => {
  const { language } = useLanguage();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('booking');

  return (
    <Layout>
      <section className="pt-28 pb-24 min-h-screen flex items-center">
        <div className="container px-6">
          <div className="max-w-md mx-auto text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-emerald-400" />
            </div>
            <h1 className="text-3xl font-serif font-semibold mb-4">
              {language === 'sv' ? 'Betalning mottagen!' : 'Payment received!'}
            </h1>
            <p className="text-muted-foreground font-sans mb-2">
              {language === 'sv'
                ? 'Tack för din betalning. Din session är nu säkrad.'
                : 'Thank you for your payment. Your session is now secured.'}
            </p>
            <p className="text-muted-foreground font-sans text-sm mb-8">
              {language === 'sv'
                ? 'Vi skickar en bekräftelse via e-post med nästa steg.'
                : 'We will send a confirmation email with next steps.'}
            </p>
            <div className="w-16 h-[1px] bg-primary mx-auto mb-8" />
            <Link to="/">
              <Button variant="outline" className="border-border">
                {language === 'sv' ? 'Tillbaka till startsidan' : 'Back to home'}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BookingSuccess;
