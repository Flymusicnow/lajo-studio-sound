import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  accent?: boolean;
}

const StatsCard = ({ title, value, icon: Icon, accent }: StatsCardProps) => (
  <div className={cn(
    'p-5 rounded border border-border bg-card',
    accent && 'border-primary/30'
  )}>
    <div className="flex items-center justify-between mb-3">
      <Icon size={18} className={accent ? 'text-primary' : 'text-muted-foreground'} />
    </div>
    <p className="text-2xl font-serif font-semibold">{value}</p>
    <p className="text-xs text-muted-foreground font-sans mt-1">{title}</p>
  </div>
);

export default StatsCard;
