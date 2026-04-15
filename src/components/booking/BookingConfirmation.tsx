import { CheckCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';

interface Props {
  isRemote?: boolean;
}

const BookingConfirmation = ({ isRemote }: Props) => {
  const { t } = useLanguage();

  return (
    <Layout>
      <section className="pt-32 pb-24 min-h-screen flex items-center">
        <div className="container px-6">
          <div className="max-w-md mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 text-primary">
              <CheckCircle size={48} strokeWidth={1.5} />
            </div>
            <h1 className="text-3xl font-serif font-semibold mb-4">{t('booking.success.title')}</h1>
            <p className="text-muted-foreground font-sans mb-4">{t('bb.confirm.text')}</p>
            {isRemote && (
              <p className="text-muted-foreground font-sans text-sm mb-8 bg-card border border-border rounded p-4">
                📁 {t('bb.confirm.remote.note')}
              </p>
            )}
            <Button asChild variant="outline" className="border-border hover:bg-secondary">
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('booking.success.back')}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BookingConfirmation;
