import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectableCardProps {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  badge?: string;
  className?: string;
}

const SelectableCard = ({ selected, onClick, children, badge, className }: SelectableCardProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative w-full text-left p-5 border rounded transition-all duration-200',
        'bg-card hover:border-primary/50',
        selected ? 'border-primary' : 'border-border',
        className,
      )}
    >
      {badge && (
        <span className="absolute -top-3 left-4 px-3 py-0.5 text-xs font-sans tracking-wide bg-primary text-primary-foreground rounded-full">
          {badge}
        </span>
      )}
      {selected && (
        <span className="absolute top-3 right-3 text-primary">
          <Check size={18} />
        </span>
      )}
      {children}
    </button>
  );
};

export default SelectableCard;
