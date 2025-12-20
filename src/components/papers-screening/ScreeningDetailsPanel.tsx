import { PaperWithScreening } from './types';
import { Check, X, ExternalLink, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ScreeningDetailsPanelProps {
  paper: PaperWithScreening | null;
  onBack?: () => void;
}

export const ScreeningDetailsPanel = ({ paper, onBack }: ScreeningDetailsPanelProps) => {
  if (!paper) {
    return (
      <div className="h-full flex items-center justify-center text-sm text-muted-foreground p-6">
        Select a paper to view details
      </div>
    );
  }

  const { screening } = paper;
  const isInclude = screening.verdict === 'include';

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <span className="text-sm font-medium">Details</span>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-5">
          {/* Screening Recommendation */}
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Screening recommendation</div>
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-sm font-medium',
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
              <span className="text-sm text-muted-foreground">
                {screening.score.toFixed(1)} / 5 inclusion score
              </span>
            </div>
          </div>

          {/* Paper Title */}
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Paper</div>
            <div className="flex items-start gap-1">
              <span className="text-sm font-medium text-foreground leading-snug">
                {paper.title}
              </span>
              <ExternalLink className="w-3 h-3 text-muted-foreground shrink-0 mt-1" />
            </div>
          </div>

          {/* Abstract */}
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Abstract</div>
            <p className="text-sm text-foreground/80 leading-relaxed">
              {paper.abstract}
            </p>
          </div>

          {/* Criteria Evaluation */}
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Criteria evaluation</div>
            <div className="space-y-1.5">
              {screening.criteria.map((c, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <div className={cn(
                    'w-2 h-2 rounded-full shrink-0',
                    c.status === 'pass' ? 'bg-emerald-500' :
                    c.status === 'partial' ? 'bg-amber-500' : 'bg-red-400'
                  )} />
                  <span className="text-foreground/80">{c.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
