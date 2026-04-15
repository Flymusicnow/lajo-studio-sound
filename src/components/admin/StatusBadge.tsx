import { cn } from '@/lib/utils';

const statusColors: Record<string, string> = {
  new: 'bg-blue-500/20 text-blue-400',
  under_review: 'bg-yellow-500/20 text-yellow-400',
  approved: 'bg-green-500/20 text-green-400',
  counter_offer: 'bg-orange-500/20 text-orange-400',
  declined: 'bg-red-500/20 text-red-400',
  awaiting_payment: 'bg-amber-500/20 text-amber-400',
  awaiting_deposit: 'bg-amber-500/20 text-amber-400',
  awaiting_files: 'bg-indigo-500/20 text-indigo-400',
  files_received: 'bg-cyan-500/20 text-cyan-400',
  in_progress: 'bg-violet-500/20 text-violet-400',
  ready_for_final_payment: 'bg-orange-500/20 text-orange-400',
  final_payment_pending: 'bg-amber-500/20 text-amber-400',
  paid: 'bg-emerald-500/20 text-emerald-400',
  confirmed: 'bg-primary/20 text-primary',
  delivered: 'bg-teal-500/20 text-teal-400',
  unpaid: 'bg-red-500/20 text-red-400',
  deposit_paid: 'bg-amber-500/20 text-amber-400',
  fully_paid: 'bg-emerald-500/20 text-emerald-400',
  prep: 'bg-indigo-500/20 text-indigo-400',
  mixing: 'bg-violet-500/20 text-violet-400',
  mastering: 'bg-purple-500/20 text-purple-400',
  ready_for_delivery: 'bg-teal-500/20 text-teal-400',
  completed: 'bg-emerald-500/20 text-emerald-400',
};

const statusLabels: Record<string, string> = {
  new: 'Ny',
  under_review: 'Under granskning',
  approved: 'Godkänd',
  counter_offer: 'Motbud',
  declined: 'Nekad',
  awaiting_payment: 'Inväntar betalning',
  awaiting_deposit: 'Inväntar förskott',
  awaiting_files: 'Inväntar filer',
  files_received: 'Filer mottagna',
  in_progress: 'Pågår',
  ready_for_final_payment: 'Inväntar slutbetalning',
  final_payment_pending: 'Slutbetalning väntande',
  paid: 'Betald',
  confirmed: 'Bekräftad',
  delivered: 'Levererad',
  unpaid: 'Obetald',
  deposit_paid: 'Förskott betalt',
  fully_paid: 'Fullt betald',
  prep: 'Förberedelse',
  mixing: 'Mixing',
  mastering: 'Mastering',
  ready_for_delivery: 'Leverans redo',
  completed: 'Avslutad',
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => (
  <span className={cn(
    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-sans font-medium',
    statusColors[status] || 'bg-muted text-muted-foreground',
    className
  )}>
    {statusLabels[status] || status}
  </span>
);

export default StatusBadge;
