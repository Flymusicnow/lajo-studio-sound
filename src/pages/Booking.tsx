import { useReducer, useState } from 'react';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { bookingReducer, initialBookingState, calculateTotal, SESSIONS, ADDONS, RESULT_PACKAGES, MASTERING_PRICE_PER_TRACK } from '@/components/booking/bookingConfig';
import StepIndicator from '@/components/booking/StepIndicator';
import SessionStep from '@/components/booking/SessionStep';
import CreativeTypeStep from '@/components/booking/CreativeTypeStep';
import AddOnsStep from '@/components/booking/AddOnsStep';
import MasteringStep from '@/components/booking/MasteringStep';
import ResultPackageStep from '@/components/booking/ResultPackageStep';
import MixingScopeStep from '@/components/booking/MixingScopeStep';
import DetailsStep from '@/components/booking/DetailsStep';
import ReviewStep from '@/components/booking/ReviewStep';
import PriceSummary from '@/components/booking/PriceSummary';
import BookingConfirmation from '@/components/booking/BookingConfirmation';

const TOTAL_STEPS = 8;

const Booking = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [state, dispatch] = useReducer(bookingReducer, initialBookingState);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const total = calculateTotal(state);
  const deposit = Math.round(total / 2);

  const canProceed = (): boolean => {
    switch (state.step) {
      case 1: return !!state.session;
      case 2: return state.creativeTypes.length > 0;
      case 3: return true; // optional
      case 4: return true; // optional
      case 5: return !!state.resultPackage;
      case 6: return !!state.mixingScope;
      case 7: return !!state.name && !!state.email;
      case 8: return true;
      default: return false;
    }
  };

  const next = () => {
    if (state.step < TOTAL_STEPS && canProceed()) {
      dispatch({ type: 'SET_STEP', step: state.step + 1 });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prev = () => {
    if (state.step > 1) {
      dispatch({ type: 'SET_STEP', step: state.step - 1 });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const session = SESSIONS.find(s => s.id === state.session);
      const pkg = RESULT_PACKAGES.find(p => p.id === state.resultPackage);
      const selectedAddons = state.addOns.map(id => {
        const addon = ADDONS.find(a => a.id === id);
        return { id, label: t(`bb.s3.${id === 'sound-design' ? 'sound' : id === 'extra-revision' ? 'revision' : id}`), price: addon?.price || 0 };
      });

      // Find or create customer
      let customerId: string | null = null;
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id')
        .eq('email', state.email)
        .maybeSingle();

      if (existingCustomer) {
        customerId = existingCustomer.id;
      } else {
        const { data: newCustomer } = await supabase
          .from('customers')
          .insert({ name: state.name, email: state.email, phone: state.phone || null })
          .select('id')
          .single();
        if (newCustomer) customerId = newCustomer.id;
      }

      // Insert booking request
      await supabase.from('booking_requests').insert({
        customer_id: customerId,
        session_type: state.session,
        session_price: session?.price || 0,
        creative_types: state.creativeTypes,
        add_ons: selectedAddons,
        mastering_type: state.mastering,
        mastering_tracks: state.masteringTracks,
        result_package: state.resultPackage,
        result_package_price: pkg?.price || 0,
        mixing_scope: state.mixingScope,
        total_price: total,
        deposit_amount: deposit,
        payment_choice: state.paymentChoice,
        song_count: state.songCount,
        track_count: state.trackCount,
        reference_url: state.referenceUrl || null,
        deadline: state.deadline?.toISOString().split('T')[0] || null,
        description: state.description || null,
        custom_session_text: state.customSessionText || null,
      });

      // Send email notification
      const payload = {
        language,
        name: state.name,
        email: state.email,
        phone: state.phone,
        session: { id: state.session, label: t(`bb.s1.${state.session}`), price: session?.price || 0, customText: state.customSessionText },
        creativeTypes: state.creativeTypes.map(ct => t(`bb.s2.${ct === 'new-song' ? 'new' : ct === 'develop-existing' ? 'develop' : ct === 'beat-production' ? 'beat' : ct}`)),
        addOns: selectedAddons,
        mastering: { type: state.mastering, tracks: state.masteringTracks, pricePerTrack: MASTERING_PRICE_PER_TRACK },
        resultPackage: { id: state.resultPackage, label: pkg ? t(`bb.s5.${pkg.id === 'record-your-song' ? 'record' : pkg.id === 'radio-ready' ? 'radio' : pkg.id === 'session-only' ? 'sessionOnly' : 'ep'}`) : '', price: pkg?.price || 0 },
        mixingScope: state.mixingScope,
        projectDetails: { songs: state.songCount, tracks: state.trackCount, reference: state.referenceUrl, deadline: state.deadline?.toISOString(), description: state.description },
        paymentChoice: state.paymentChoice,
        totalPrice: total,
        depositAmount: deposit,
      };

      await supabase.functions.invoke('send-booking-email', { body: payload });
      setIsSubmitted(true);
    } catch (error: any) {
      console.error('Error sending booking:', error);
      toast({
        title: language === 'sv' ? 'Något gick fel' : 'Something went wrong',
        description: language === 'sv' ? 'Kunde inte skicka din förfrågan. Försök igen senare.' : 'Could not send your request. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) return <BookingConfirmation />;

  const renderStep = () => {
    switch (state.step) {
      case 1: return <SessionStep state={state} dispatch={dispatch} />;
      case 2: return <CreativeTypeStep state={state} dispatch={dispatch} />;
      case 3: return <AddOnsStep state={state} dispatch={dispatch} />;
      case 4: return <MasteringStep state={state} dispatch={dispatch} />;
      case 5: return <ResultPackageStep state={state} dispatch={dispatch} />;
      case 6: return <MixingScopeStep state={state} dispatch={dispatch} />;
      case 7: return <DetailsStep state={state} dispatch={dispatch} />;
      case 8: return <ReviewStep state={state} />;
      default: return null;
    }
  };

  return (
    <Layout>
      <section className="pt-28 pb-24">
        <div className="container px-6">
          <div className="max-w-lg mx-auto text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-serif font-semibold mb-3">{t('bb.title')}</h1>
            <p className="text-muted-foreground font-sans text-sm">{t('bb.subtitle')}</p>
            <a href="/quick-booking" className="inline-block mt-4 text-primary font-sans text-sm hover:underline">
              {t('qb.link')} →
            </a>
            <div className="w-16 h-[1px] bg-primary mx-auto mt-6" />
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
              {/* Left: Steps */}
              <div>
                <StepIndicator currentStep={state.step} totalSteps={TOTAL_STEPS} />
                <div className="bg-card border border-border rounded p-6 md:p-8">
                  {renderStep()}
                </div>

                {/* Navigation */}
                <div className="flex justify-between mt-6">
                  <Button
                    variant="outline"
                    onClick={prev}
                    disabled={state.step === 1}
                    className="border-border"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {t('bb.nav.back')}
                  </Button>

                  {state.step < TOTAL_STEPS ? (
                    <Button
                      onClick={next}
                      disabled={!canProceed()}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 gold-glow"
                    >
                      {t('bb.nav.next')}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={isLoading || !state.name || !state.email}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 gold-glow px-8"
                    >
                      {isLoading ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('bb.nav.sending')}</>
                      ) : (
                        t('bb.nav.submit')
                      )}
                    </Button>
                  )}
                </div>

                {/* Almost done nudge */}
                {state.step >= 6 && state.step < 8 && (
                  <p className="text-center text-sm font-sans text-muted-foreground mt-4">
                    ✨ {t('bb.nudge.almost')}
                  </p>
                )}
              </div>

              {/* Right: Sticky Price Summary */}
              <div className="hidden lg:block">
                <div className="sticky top-24">
                  <PriceSummary state={state} />
                </div>
              </div>
            </div>

            {/* Mobile: Fixed bottom price bar */}
            <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-card border-t border-border p-4 z-50">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-muted-foreground font-sans">{t('bb.price.total')}</p>
                  <p className="text-primary font-sans text-xl font-bold transition-all duration-300">{total.toLocaleString()} SEK</p>
                </div>
                {total > 0 && (
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground font-sans">{t('bb.price.deposit')}</p>
                    <p className="text-sm font-sans">{deposit.toLocaleString()} SEK</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Spacer for mobile bottom bar */}
      <div className="h-20 lg:hidden" />
    </Layout>
  );
};

export default Booking;
