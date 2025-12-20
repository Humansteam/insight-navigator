import { cn } from '@/lib/utils';
import { ScreeningCriteria } from './types';

interface CriteriaTagsProps {
  criteria: ScreeningCriteria[];
  className?: string;
}

export const CriteriaTags = ({ criteria, className }: CriteriaTagsProps) => {
  const getStatusStyles = (status: ScreeningCriteria['status']) => {
    switch (status) {
      case 'pass':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'fail':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'partial':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    }
  };

  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      {criteria.map((criterion, index) => (
        <span
          key={index}
          className={cn(
            'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border',
            getStatusStyles(criterion.status)
          )}
        >
          {criterion.name}
        </span>
      ))}
    </div>
  );
};
