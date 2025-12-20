import { cn } from '@/lib/utils';
import { PaperWithScreening } from './types';
import { BarChart3, Star } from 'lucide-react';

interface PaperRowCardProps {
  paper: PaperWithScreening;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}

export const PaperRowCard = ({ paper, isSelected, onSelect }: PaperRowCardProps) => {
  const { screening } = paper;
  const isInclude = screening.verdict === 'include';
  
  const getRelevanceColor = (score: 'high' | 'medium' | 'low') => {
    switch (score) {
      case 'high': return 'text-emerald-500';
      case 'medium': return 'text-amber-500';
      case 'low': return 'text-red-400';
    }
  };
  
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
      <div className="py-4 px-5 border-l border-border/40 space-y-3 relative">
        {/* Metrics - Top Right */}
        <div className="absolute top-4 right-5 flex flex-col items-end gap-2">
          {/* Combined Score */}
          <div className="flex flex-col items-end gap-1">
            <span className="text-sm font-medium text-primary">
              {screening.combinedScore}%
            </span>
            <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full"
                style={{ width: `${screening.combinedScore}%` }}
              />
            </div>
          </div>
          
          {/* FWCI */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="w-3 h-3" />
            <span>{screening.metrics.fwci.toFixed(1)}x avg</span>
          </div>
        </div>

        {/* Verdict & Aspect Tag */}
        <div className="flex items-center gap-2">
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
          
          {/* Aspect Tag */}
          <span className="px-2 py-0.5 bg-accent/50 text-accent-foreground rounded text-xs">
            {screening.aspectTag}
          </span>
          
          {/* Relevance Score */}
          <span className={cn('text-xs font-medium capitalize', getRelevanceColor(screening.relevanceScore))}>
            {screening.relevanceScore} relevance
          </span>
        </div>
        
        {/* Rationale */}
        <p className="text-sm text-foreground/80 leading-relaxed pr-24">
          {screening.rationale}
        </p>
        
        {/* Dimensions (Dynamic) */}
        <div className="flex flex-wrap gap-2">
          {screening.dimensions.map((d, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 text-xs text-muted-foreground"
            >
              <div className={cn(
                'w-1.5 h-1.5 rounded-full',
                d.status === 'pass' ? 'bg-emerald-500' :
                d.status === 'partial' ? 'bg-amber-500' : 'bg-red-400'
              )} />
              {d.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
