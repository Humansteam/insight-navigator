import { cn } from '@/lib/utils';
import { DynamicDimension } from './types';

interface CriteriaTagsProps {
  dimensions: DynamicDimension[];
  className?: string;
}

export const CriteriaTags = ({ dimensions, className }: CriteriaTagsProps) => {
  const getStatusStyles = (status: DynamicDimension['status']) => {
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
      {dimensions.map((dimension, index) => (
        <span
          key={index}
          className={cn(
            'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border',
            getStatusStyles(dimension.status)
          )}
        >
          {dimension.name}
        </span>
      ))}
    </div>
  );
};
