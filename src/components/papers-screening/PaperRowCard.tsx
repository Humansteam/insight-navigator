import { cn } from '@/lib/utils';
import { PaperWithScreening } from './types';

interface PaperRowCardProps {
  paper: PaperWithScreening;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}

export const PaperRowCard = ({ paper, isSelected, onSelect }: PaperRowCardProps) => {
  const { screening } = paper;
  
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
        {/* Score - Top Right */}
        <div className="absolute top-4 right-5 flex flex-col items-end gap-1">
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
        
        {/* Rationale - Main Content */}
        <p className="text-sm text-foreground/80 leading-relaxed pr-24">
          {screening.rationale}
        </p>
        
        {/* Tags at Bottom */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {/* Aspect Tag */}
          <span className="px-2 py-0.5 bg-muted/50 text-muted-foreground rounded text-[11px]">
            {screening.aspectTag}
          </span>
          
          {/* Divider */}
          <span className="w-px h-3 bg-border/50" />
          
          {/* Dimensions */}
          {screening.dimensions.map((d, i) => (
            <div
              key={i}
              className="flex items-center gap-1 text-[11px] text-muted-foreground/80"
            >
              <div className={cn(
                'w-1.5 h-1.5 rounded-full opacity-70',
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
