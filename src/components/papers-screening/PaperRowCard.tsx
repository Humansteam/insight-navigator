import { cn } from '@/lib/utils';
import { PaperWithScreening } from './types';
import { Check, X } from 'lucide-react';

interface PaperRowCardProps {
  paper: PaperWithScreening;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}

export const PaperRowCard = ({ paper, isSelected, onSelect }: PaperRowCardProps) => {
  const { screening } = paper;
  const isInclude = screening.verdict === 'include';
  
  return (
    <div
      className={cn(
        'grid grid-cols-[300px_1fr] border-b border-border/40 cursor-pointer transition-colors',
        'hover:bg-muted/20',
        isSelected && 'bg-accent/5'
      )}
      onClick={() => onSelect?.(paper.id)}
    >
      {/* Paper Column - Fixed 300px */}
      <div className="py-4 px-4 space-y-1.5">
        <h3 className="text-sm font-medium text-foreground leading-snug line-clamp-2">
          {paper.title}
        </h3>
        <p className="text-xs text-muted-foreground">
          {paper.authors.slice(0, 2).join(', ')}
        </p>
        <p className="text-xs text-muted-foreground">
          {paper.year} · {paper.citations} citations
        </p>
      </div>
      
      {/* Screening Judgement Column - Flex 1 */}
      <div className="py-4 px-5 border-l border-border/40 space-y-3">
        {/* Verdict and Score */}
        <div className="flex items-center justify-between">
          <div
            className={cn(
              'inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium',
              isInclude 
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                : 'bg-red-500/10 text-red-600 dark:text-red-400'
            )}
          >
            <div className={cn(
              'w-2 h-2 rounded-full',
              isInclude ? 'bg-emerald-500' : 'bg-red-500'
            )} />
            {isInclude ? 'Include' : 'Exclude'}
          </div>
          
          <span className="text-xs text-muted-foreground">
            {screening.score.toFixed(1)} / 5
          </span>
        </div>
        
        {/* Rationale */}
        <p className="text-sm text-foreground/80 leading-relaxed">
          {screening.rationale}
        </p>
        
        {/* Criteria Tags */}
        <div className="flex flex-wrap gap-2">
          {screening.criteria.map((c, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 text-xs text-muted-foreground"
            >
              <div className={cn(
                'w-1.5 h-1.5 rounded-full',
                c.status === 'pass' ? 'bg-emerald-500' :
                c.status === 'partial' ? 'bg-amber-500' : 'bg-red-400'
              )} />
              {c.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
