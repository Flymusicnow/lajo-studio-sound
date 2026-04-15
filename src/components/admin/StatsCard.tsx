import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  accent?: boolean;
  subtitle?: string;
  trend?: { direction: 'up' | 'down'; label: string };
}

const StatsCard = ({ title, value, icon: Icon, accent, subtitle, trend }: StatsCardProps) => (
  <div className={cn(
    'p-6 rounded border border-border bg-card',
    accent && 'border-primary/30'
  )}>
    <div className="flex items-center justify-between mb-3">
      <Icon size={18} className={accent ? 'text-primary' : 'text-muted-foreground'} />
      {trend && (
        <div className={cn(
          'flex items-center gap-1 text-xs font-sans',
          trend.direction === 'up' ? 'text-emerald-400' : 'text-red-400'
        )}>
          {trend.direction === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {trend.label}
        </div>
      )}
    </div>
    <p className="text-2xl font-serif font-semibold">{value}</p>
    <p className="text-xs text-muted-foreground font-sans mt-1">{title}</p>
    {subtitle && <p className="text-xs text-muted-foreground/70 font-sans mt-0.5">{subtitle}</p>}
  </div>
);

export default StatsCard;
