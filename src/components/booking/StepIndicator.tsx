import { useLanguage } from '@/contexts/LanguageContext';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  onStepClick?: (step: number) => void;
}

const StepIndicator = ({ currentStep, totalSteps, onStepClick }: StepIndicatorProps) => {
  const { t } = useLanguage();

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-sans text-muted-foreground">
          {t('bb.step')} {currentStep} {t('bb.of')} {totalSteps}
        </span>
        <span className="text-sm font-sans text-muted-foreground">
          {t('bb.progress')}
        </span>
      </div>
      
      {/* Step dots */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {Array.from({ length: totalSteps }, (_, i) => {
          const step = i + 1;
          const isCompleted = step < currentStep;
          const isActive = step === currentStep;
          const isFuture = step > currentStep;
          const canClick = step <= currentStep && onStepClick;

          return (
            <button
              key={step}
              type="button"
              disabled={isFuture || !onStepClick}
              onClick={() => canClick && onStepClick(step)}
              className={`
                relative flex-1 h-1.5 rounded-full transition-all duration-300
                ${isCompleted ? 'bg-primary cursor-pointer hover:bg-primary/80' : ''}
                ${isActive ? 'bg-primary' : ''}
                ${isFuture ? 'bg-secondary cursor-not-allowed' : ''}
              `}
              aria-label={`${t('bb.step')} ${step}`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
