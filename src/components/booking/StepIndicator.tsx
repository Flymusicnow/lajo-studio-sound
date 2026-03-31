import { useLanguage } from '@/contexts/LanguageContext';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator = ({ currentStep, totalSteps }: StepIndicatorProps) => {
  const { t } = useLanguage();
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-sans text-muted-foreground">
          {t('bb.step')} {currentStep} {t('bb.of')} {totalSteps}
        </span>
        <span className="text-sm font-sans text-muted-foreground">
          {t('bb.progress')}
        </span>
      </div>
      <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default StepIndicator;
