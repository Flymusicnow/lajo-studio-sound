import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Check, Circle, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const WORKFLOW_STEPS = [
  { id: 'awaiting_files', label: 'Inväntar filer' },
  { id: 'files_received', label: 'Filer mottagna' },
  { id: 'prep', label: 'Förberedelse' },
  { id: 'mixing', label: 'Mixing' },
  { id: 'mastering', label: 'Mastering' },
  { id: 'ready_for_delivery', label: 'Redo för leverans' },
  { id: 'delivered', label: 'Levererad' },
  { id: 'completed', label: 'Slutförd' },
] as const;

type WorkflowStatus = typeof WORKFLOW_STEPS[number]['id'];

interface Props {
  projectStatus: any;
  bookingRequestId: string;
  onUpdate: () => void;
}

const ProjectWorkflow = ({ projectStatus, bookingRequestId, onUpdate }: Props) => {
  const { toast } = useToast();
  const [updating, setUpdating] = useState(false);

  const currentIndex = WORKFLOW_STEPS.findIndex(s => s.id === projectStatus?.status);

  const advanceStep = async () => {
    if (currentIndex >= WORKFLOW_STEPS.length - 1) return;
    setUpdating(true);
    const nextStatus = WORKFLOW_STEPS[currentIndex + 1].id;

    if (!projectStatus) {
      await supabase.from('project_status').insert({
        booking_request_id: bookingRequestId,
        status: nextStatus,
      });
    } else {
      await supabase.from('project_status').update({
        status: nextStatus,
        updated_at: new Date().toISOString(),
      }).eq('id', projectStatus.id);
    }

    toast({ title: `Status: ${WORKFLOW_STEPS[currentIndex + 1].label}` });
    onUpdate();
    setUpdating(false);
  };

  const setStep = async (stepId: WorkflowStatus) => {
    setUpdating(true);
    if (!projectStatus) {
      await supabase.from('project_status').insert({
        booking_request_id: bookingRequestId,
        status: stepId,
      });
    } else {
      await supabase.from('project_status').update({
        status: stepId,
        updated_at: new Date().toISOString(),
      }).eq('id', projectStatus.id);
    }
    toast({ title: `Status: ${WORKFLOW_STEPS.find(s => s.id === stepId)?.label}` });
    onUpdate();
    setUpdating(false);
  };

  return (
    <div className="bg-card border border-border rounded p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-serif font-semibold">Projektstatus</h2>
        {currentIndex < WORKFLOW_STEPS.length - 1 && (
          <Button onClick={advanceStep} size="sm" disabled={updating} className="bg-primary text-primary-foreground">
            <ArrowRight className="mr-2 h-4 w-4" />
            Nästa steg
          </Button>
        )}
      </div>

      <div className="space-y-1">
        {WORKFLOW_STEPS.map((step, i) => {
          const isDone = i < currentIndex;
          const isCurrent = i === currentIndex;
          return (
            <button
              key={step.id}
              onClick={() => setStep(step.id)}
              disabled={updating}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2 rounded text-sm font-sans transition-all text-left',
                isDone && 'text-muted-foreground',
                isCurrent && 'bg-primary/10 text-primary font-medium',
                !isDone && !isCurrent && 'text-muted-foreground/50 hover:text-muted-foreground'
              )}
            >
              {isDone ? (
                <Check className="h-4 w-4 text-emerald-400 shrink-0" />
              ) : isCurrent ? (
                <Circle className="h-4 w-4 text-primary fill-primary shrink-0" />
              ) : (
                <Circle className="h-4 w-4 shrink-0 opacity-30" />
              )}
              {step.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectWorkflow;
