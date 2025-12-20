import { cn } from '@/lib/utils';
import { PaperWithScreening } from './types';
import { ScreeningBadge } from './ScreeningBadge';
import { CriteriaTags } from './CriteriaTags';
import { FileText, Users, Calendar, Quote } from 'lucide-react';

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
        'grid grid-cols-[1fr_300px] gap-4 p-4 border-b border-border/50 cursor-pointer transition-colors',
        'hover:bg-muted/30',
        isSelected && 'bg-accent/10 border-l-2 border-l-accent'
      )}
      onClick={() => onSelect?.(paper.id)}
    >
      {/* Paper Details Column */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-medium text-foreground leading-tight line-clamp-2">
            {paper.title}
          </h3>
          <ScreeningBadge verdict={screening.verdict} />
        </div>
        
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {paper.authors.slice(0, 2).join(', ')}
            {paper.authors.length > 2 && ` +${paper.authors.length - 2}`}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {paper.year}
          </span>
          <span className="flex items-center gap-1">
            <Quote className="w-3 h-3" />
            {paper.citations} citations
          </span>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2">
          {paper.abstract}
        </p>
      </div>
      
      {/* Screening Judgement Column */}
      <div className="space-y-3 border-l border-border/50 pl-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Confidence Score</span>
          <div className="flex items-center gap-2">
            <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
              <div 
                className={cn(
                  'h-full rounded-full transition-all',
                  screening.score >= 3.5 ? 'bg-emerald-500' : 
                  screening.score >= 2.5 ? 'bg-amber-500' : 'bg-red-500'
                )}
                style={{ width: `${(screening.score / 5) * 100}%` }}
              />
            </div>
            <span className="text-sm font-mono font-medium">
              {screening.score.toFixed(1)}
            </span>
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground line-clamp-3">
          {screening.rationale}
        </p>
        
        <CriteriaTags criteria={screening.criteria} />
      </div>
    </div>
  );
};
