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
        'grid grid-cols-[1fr_280px] border-b border-border/40 cursor-pointer transition-colors',
        'hover:bg-muted/20',
        isSelected && 'bg-accent/5'
      )}
      onClick={() => onSelect?.(paper.id)}
    >
      {/* Paper Details Column */}
      <div className="py-4 px-5 space-y-2">
        <h3 className="text-sm font-medium text-foreground leading-snug">
          {paper.title}
        </h3>
        
        <p className="text-xs text-muted-foreground">
          {paper.authors.join(', ')} · {paper.year}
        </p>
        
        <p className="text-sm text-foreground/80 leading-relaxed">
          {paper.abstract}
        </p>
      </div>
      
      {/* Screening Judgement Column */}
      <div className="py-4 px-4 border-l border-border/40 space-y-3">
        <div className="flex items-center justify-between">
          <div
            className={cn(
              'inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium',
              isInclude 
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                : 'bg-red-500/10 text-red-600 dark:text-red-400'
            )}
          >
            {isInclude ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
            {isInclude ? 'Include' : 'Exclude'}
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
              <div 
                className={cn(
                  'h-full rounded-full',
                  screening.score >= 3.5 ? 'bg-emerald-500' : 
                  screening.score >= 2.5 ? 'bg-amber-500' : 'bg-red-400'
                )}
                style={{ width: `${(screening.score / 5) * 100}%` }}
              />
            </div>
            <span className="text-xs font-mono text-muted-foreground">
              {screening.score.toFixed(1)}
            </span>
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground leading-relaxed">
          {screening.rationale}
        </p>
        
        {/* Minimal criteria indicators */}
        <div className="flex gap-1">
          {screening.criteria.map((c, i) => (
            <div
              key={i}
              title={c.name}
              className={cn(
                'w-1.5 h-1.5 rounded-full',
                c.status === 'pass' ? 'bg-emerald-500' :
                c.status === 'partial' ? 'bg-amber-500' : 'bg-red-400'
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
