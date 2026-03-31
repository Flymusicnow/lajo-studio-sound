import { cn } from '@/lib/utils';

const statusColors: Record<string, string> = {
  new: 'bg-blue-500/20 text-blue-400',
  under_review: 'bg-yellow-500/20 text-yellow-400',
  approved: 'bg-green-500/20 text-green-400',
  counter_offer: 'bg-orange-500/20 text-orange-400',
  declined: 'bg-red-500/20 text-red-400',
  awaiting_payment: 'bg-amber-500/20 text-amber-400',
  paid: 'bg-emerald-500/20 text-emerald-400',
  confirmed: 'bg-primary/20 text-primary',
  unpaid: 'bg-red-500/20 text-red-400',
  deposit_paid: 'bg-amber-500/20 text-amber-400',
  fully_paid: 'bg-emerald-500/20 text-emerald-400',
};

const statusLabels: Record<string, string> = {
  new: 'Ny',
  under_review: 'Under granskning',
  approved: 'Godkänd',
  counter_offer: 'Motbud',
  declined: 'Nekad',
  awaiting_payment: 'Inväntar betalning',
  paid: 'Betald',
  confirmed: 'Bekräftad',
  unpaid: 'Obetald',
  deposit_paid: 'Förskott betalt',
  fully_paid: 'Fullt betald',
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
