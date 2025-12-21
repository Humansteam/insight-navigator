import { PaperWithScreening } from './types';
import { ExternalLink, ArrowLeft, Star, BarChart3, Clock, Sparkles, FileText, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ScreeningDetailsPanelProps {
  paper: PaperWithScreening | null;
  papers?: PaperWithScreening[];
  onBack?: () => void;
}

export const ScreeningDetailsPanel = ({ paper, papers = [], onBack }: ScreeningDetailsPanelProps) => {
  // Calculate overview stats
  const totalPapers = papers.length;
  const includedCount = papers.filter(p => p.screening.combinedScore >= 70).length;
  const excludedCount = totalPapers - includedCount;

  // Show Overview when no paper selected
  if (!paper) {
    return (
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="h-12 px-4 flex items-center border-b border-border">
          <span className="text-sm font-medium">Screening results</span>
        </div>

        <div className="p-4 space-y-6">
          {/* Overview Title */}
          <div className="text-xs text-muted-foreground">Overview</div>
          
          {/* Stats */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-foreground">
                <span className="font-medium">{totalPapers}</span> abstracts evaluated
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span className="text-sm text-foreground">
                <span className="font-medium">{includedCount}</span> abstract{includedCount !== 1 ? 's' : ''} included
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <XCircle className="w-4 h-4 text-red-400" />
              <span className="text-sm text-foreground">
                <span className="font-medium">{excludedCount}</span> abstract{excludedCount !== 1 ? 's' : ''} excluded
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { screening } = paper;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between h-12 px-4 border-b border-border">
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

          {/* Metrics Grid */}
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Core Metrics</div>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-muted/30 rounded space-y-1">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Sparkles className="w-3 h-3" />
                  Similarity
                </div>
                <div className="text-sm font-medium">{Math.round(screening.metrics.similarity * 100)}%</div>
              </div>
              <div className="p-2 bg-muted/30 rounded space-y-1">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <BarChart3 className="w-3 h-3" />
                  Citations
                </div>
                <div className="text-sm font-medium">{screening.metrics.citations}</div>
              </div>
              <div className="p-2 bg-muted/30 rounded space-y-1">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="w-3 h-3" />
                  FWCI
                </div>
                <div className="text-sm font-medium">{screening.metrics.fwci.toFixed(1)}x</div>
              </div>
              <div className="p-2 bg-muted/30 rounded space-y-1">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  Recency
                </div>
                <div className="text-sm font-medium">{Math.round(screening.metrics.recency * 100)}%</div>
              </div>
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Category</div>
            <span className="px-2 py-0.5 bg-muted/50 text-muted-foreground rounded text-xs inline-block">
              {screening.aspectTag}
            </span>
          </div>

          {/* Abstract */}
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Abstract</div>
            <p className="text-sm text-foreground/80 leading-relaxed">
              {paper.abstract}
            </p>
          </div>

          {/* Dimensions Evaluation */}
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Dimensions evaluation</div>
            <div className="space-y-1.5">
              {screening.dimensions.map((d, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <div className={cn(
                    'w-2 h-2 rounded-full shrink-0',
                    d.status === 'pass' ? 'bg-emerald-500' :
                    d.status === 'partial' ? 'bg-amber-500' : 'bg-red-400'
                  )} />
                  <span className="text-foreground/80">{d.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
