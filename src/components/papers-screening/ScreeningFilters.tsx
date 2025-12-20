import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { FileText, CheckCircle, XCircle, Filter } from 'lucide-react';

interface ScreeningFiltersProps {
  totalPapers: number;
  includedCount: number;
  excludedCount: number;
  scoreThreshold: number;
  onScoreThresholdChange?: (value: number) => void;
  className?: string;
}

export const ScreeningFilters = ({
  totalPapers,
  includedCount,
  excludedCount,
  scoreThreshold,
  onScoreThresholdChange,
  className
}: ScreeningFiltersProps) => {
  const includePercent = totalPapers > 0 ? Math.round((includedCount / totalPapers) * 100) : 0;
  const excludePercent = totalPapers > 0 ? Math.round((excludedCount / totalPapers) * 100) : 0;

  return (
    <div className={cn('space-y-6', className)}>
      {/* Overview Header */}
      <div>
        <h3 className="text-sm font-medium text-foreground mb-1">Screening Overview</h3>
        <p className="text-xs text-muted-foreground">
          {totalPapers} papers analyzed
        </p>
      </div>

      {/* Stats Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span className="text-sm text-foreground">Included</span>
          </div>
          <div className="text-right">
            <span className="text-lg font-semibold text-emerald-500">{includedCount}</span>
            <span className="text-xs text-muted-foreground ml-1">({includePercent}%)</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-red-500/5 border border-red-500/20">
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4 text-red-500" />
            <span className="text-sm text-foreground">Excluded</span>
          </div>
          <div className="text-right">
            <span className="text-lg font-semibold text-red-500">{excludedCount}</span>
            <span className="text-xs text-muted-foreground ml-1">({excludePercent}%)</span>
          </div>
        </div>
      </div>

      {/* Visual Bar */}
      <div className="space-y-2">
        <div className="flex h-2 rounded-full overflow-hidden bg-muted">
          <div 
            className="bg-emerald-500 transition-all"
            style={{ width: `${includePercent}%` }}
          />
          <div 
            className="bg-red-500 transition-all"
            style={{ width: `${excludePercent}%` }}
          />
        </div>
      </div>

      {/* Score Threshold Filter */}
      <div className="space-y-3 pt-4 border-t border-border/50">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Score Threshold</span>
        </div>
        
        <div className="space-y-2">
          <Slider
            value={[scoreThreshold]}
            onValueChange={(values) => onScoreThresholdChange?.(values[0])}
            max={5}
            min={0}
            step={0.1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0</span>
            <span className="font-mono font-medium text-foreground">
              {scoreThreshold.toFixed(1)}
            </span>
            <span>5</span>
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground">
          Showing papers with score ≥ {scoreThreshold.toFixed(1)}
        </p>
      </div>

      {/* Criteria Legend */}
      <div className="space-y-2 pt-4 border-t border-border/50">
        <span className="text-sm font-medium text-foreground">Criteria Legend</span>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs text-muted-foreground">Pass</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-xs text-muted-foreground">Partial</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-xs text-muted-foreground">Fail</span>
          </div>
        </div>
      </div>
    </div>
  );
};
