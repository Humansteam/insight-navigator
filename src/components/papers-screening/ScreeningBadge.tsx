import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';

interface ScreeningBadgeProps {
  verdict: 'include' | 'exclude';
  className?: string;
}

export const ScreeningBadge = ({ verdict, className }: ScreeningBadgeProps) => {
  const isInclude = verdict === 'include';
  
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
        isInclude 
          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
          : 'bg-red-500/10 text-red-500 border border-red-500/20',
        className
      )}
    >
      {isInclude ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
      {isInclude ? 'Include' : 'Exclude'}
    </div>
  );
};
