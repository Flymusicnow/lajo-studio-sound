import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Booking = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    service: searchParams.get('service') || '',
    name: '',
    email: '',
    phone: '',
    description: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('send-booking-email', {
        body: { ...formData, language },
      });

      if (error) throw error;
      setIsSubmitted(true);
    } catch (error: any) {
      console.error('Error sending booking:', error);
      toast({
        title: language === 'sv' ? 'Något gick fel' : 'Something went wrong',
        description: language === 'sv' 
          ? 'Kunde inte skicka din förfrågan. Försök igen senare.'
          : 'Could not send your request. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <Layout>
        <section className="pt-32 pb-24 min-h-screen flex items-center">
          <div className="container px-6">
            <div className="max-w-md mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-6 text-primary">
                <CheckCircle size={48} strokeWidth={1.5} />
              </div>
              <h1 className="text-3xl font-serif font-semibold mb-4">
                {t('booking.success.title')}
              </h1>
              <p className="text-muted-foreground font-sans mb-8">
                {t('booking.success.text')}
              </p>
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
  }

  return (
    <Layout>
      <section className="pt-32 pb-24">
        <div className="container px-6">
          <div className="max-w-lg mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-4">
              {t('booking.title')}
            </h1>
            <p className="text-muted-foreground font-sans">
              {t('booking.intro')}
            </p>
            <div className="w-16 h-[1px] bg-primary mx-auto mt-8" />
          </div>

          <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
            <div className="bg-card border border-border p-8 space-y-6">
              <div>
                <label className="block text-sm font-sans text-muted-foreground mb-2">
                  {t('booking.service')} *
                </label>
                <Select 
                  value={formData.service} 
                  onValueChange={(v) => handleInputChange('service', v)}
                  required
                >
                  <SelectTrigger className="w-full bg-input border-border">
                    <SelectValue placeholder="..." />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="studio-session">{t('booking.service.studio')}</SelectItem>
                    <SelectItem value="producer-session">{t('booking.service.producer')}</SelectItem>
                    <SelectItem value="resultatpaket">{t('booking.service.result')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-sans text-muted-foreground mb-2">
                  {t('booking.name')} *
                </label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="bg-input border-border"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-sans text-muted-foreground mb-2">
                  {t('booking.email')} *
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="bg-input border-border"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-sans text-muted-foreground mb-2">
                  {t('booking.phone')}
                </label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="bg-input border-border"
                />
              </div>

              <div>
                <label className="block text-sm font-sans text-muted-foreground mb-2">
                  {t('booking.description')}
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="bg-input border-border min-h-[120px]"
                  placeholder="..."
                />
              </div>

              <Button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gold-glow py-6 font-sans tracking-wide"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {language === 'sv' ? 'Skickar...' : 'Sending...'}
                  </>
                ) : (
                  t('booking.submit')
                )}
              </Button>
            </div>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default Booking;
