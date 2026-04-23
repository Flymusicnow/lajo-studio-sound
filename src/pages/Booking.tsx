import { useReducer, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { bookingReducer, initialBookingState, calculateTotal, calculateWorkloadHours, SESSIONS, ADDONS, RESULT_PACKAGES, MASTERING_PRICE_PER_TRACK } from '@/components/booking/bookingConfig';
import StepIndicator from '@/components/booking/StepIndicator';
import WorkModeStep from '@/components/booking/WorkModeStep';
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

const TOTAL_STEPS = 5;

const Booking = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [state, dispatch] = useReducer(bookingReducer, initialBookingState);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Pre-select remote from URL param
  useEffect(() => {
    if (searchParams.get('mode') === 'remote' && !state.workMode) {
      dispatch({ type: 'SET_WORK_MODE', workMode: 'remote' });
    }
  }, [searchParams]);

  const isRemote = state.workMode === 'remote';

  const total = calculateTotal(state);
  const deposit = Math.round(total / 2);

  const canProceed = (): boolean => {
    switch (state.step) {
      case 1: return !!state.workMode;
      case 2: return isRemote ? true : !!state.session;
      case 3: return state.creativeTypes.length > 0;
      case 4: return !!state.resultPackage;
      case 5: return !!state.name && !!state.email;
      default: return false;
    }
  };

  const next = () => {
    if (state.step < TOTAL_STEPS && canProceed()) {
      let nextStep = state.step + 1;
      // Skip session step for remote
      if (nextStep === 2 && isRemote) {
        dispatch({ type: 'SET_SESSION', session: 'remote' });
        nextStep = 3;
      }
      dispatch({ type: 'SET_STEP', step: nextStep });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prev = () => {
    if (state.step > 1) {
      let prevStep = state.step - 1;
      // Skip session step for remote
      if (prevStep === 2 && isRemote) {
        prevStep = 1;
      }
      dispatch({ type: 'SET_STEP', step: prevStep });
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

      const workloadHours = calculateWorkloadHours(state);

      await supabase.from('booking_requests').insert({
        customer_id: customerId,
        work_mode: state.workMode || 'studio',
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
        promo_code: state.promoCode || null,
        estimated_workload_hours: workloadHours,
      });

      const payload = {
        language,
        name: state.name,
        email: state.email,
        phone: state.phone,
        workMode: state.workMode,
        session: { id: state.session, label: state.session === 'remote' ? 'Remote' : t(`bb.s1.${state.session}`), price: session?.price || 0, customText: state.customSessionText },
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

      try {
        const modeIcon = isRemote ? '🏠' : '🎙';
        await supabase.functions.invoke('send-telegram', {
          body: {
            message: `🎵 <b>Ny bokning!</b>\n\n${modeIcon} ${isRemote ? 'Remote' : 'Studio'}\n👤 ${state.name}\n📧 ${state.email}\n🎹 ${state.session === 'remote' ? 'Remote' : t(`bb.s1.${state.session}`)}\n💰 ${total.toLocaleString()} SEK`,
          },
        });
      } catch (e) {
        console.error('Telegram notification failed:', e);
      }

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

  if (isSubmitted) return <BookingConfirmation isRemote={isRemote} />;

  const renderStep = () => {
    switch (state.step) {
      case 1:
        return <WorkModeStep state={state} dispatch={dispatch} />;
      case 2:
        return <SessionStep state={state} dispatch={dispatch} />;
      case 3:
        return (
          <div className="space-y-10">
            <CreativeTypeStep state={state} dispatch={dispatch} />
            <div className="border-t border-border" />
            <AddOnsStep state={state} dispatch={dispatch} />
            <div className="border-t border-border" />
            <MasteringStep state={state} dispatch={dispatch} />
          </div>
        );
      case 4:
        return (
          <div className="space-y-10">
            <ResultPackageStep state={state} dispatch={dispatch} isRemote={isRemote} />
            <div className="border-t border-border" />
            <MixingScopeStep state={state} dispatch={dispatch} />
          </div>
        );
      case 5:
        return (
          <div className="space-y-10">
            <DetailsStep state={state} dispatch={dispatch} />
            <div className="border-t border-border" />
            <ReviewStep state={state} />
          </div>
        );
      default:
        return null;
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
              <div>
                <StepIndicator currentStep={state.step} totalSteps={TOTAL_STEPS} onStepClick={(step) => {
                  if (step === 2 && isRemote) return;
                  dispatch({ type: 'SET_STEP', step });
                }} />
                <div className="bg-card border border-border rounded p-6 md:p-8">
                  {renderStep()}
                </div>

                <div className="flex justify-between mt-6">
                  <Button variant="outline" onClick={prev} disabled={state.step === 1} className="border-border">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {t('bb.nav.back')}
                  </Button>

                  {state.step < TOTAL_STEPS ? (
                    <Button onClick={next} disabled={!canProceed()} className="bg-primary text-primary-foreground hover:bg-primary/90 gold-glow">
                      {t('bb.nav.next')}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <div className="flex flex-col items-end gap-2">
                      <Button onClick={handleSubmit} disabled={isLoading || !state.name || !state.email} className="bg-primary text-primary-foreground hover:bg-primary/90 gold-glow px-8">
                        {isLoading ? (
                          <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('bb.nav.sending')}</>
                        ) : (
                          t('bb.nav.submit')
                        )}
                      </Button>
                      <p className="text-xs font-sans text-muted-foreground text-right">
                        Vi återkommer inom 24 timmar för att bekräfta din bokning.
                      </p>
                    </div>
                  )}
                </div>

                {state.step === 4 && (
                  <p className="text-center text-sm font-sans text-muted-foreground mt-4">
                    ✨ {t('bb.nudge.almost')}
                  </p>
                )}
              </div>

              <div className="hidden lg:block">
                <div className="sticky top-24">
                  <PriceSummary state={state} />
                </div>
              </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-card border-t border-border p-4 z-50">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-muted-foreground font-sans">{t('bb.price.total')}</p>
                  {total > 0 ? (
                    <p className="text-primary font-sans text-xl font-bold transition-all duration-300">{total.toLocaleString()} SEK</p>
                  ) : (
                    <p className="text-sm font-sans text-muted-foreground">Välj alternativ ovan</p>
                  )}
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
      <div className="h-20 lg:hidden" />
    </Layout>
  );
};

export default Booking;
