import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

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
    <div className={cn('space-y-5', className)}>
      {/* Overview */}
      <div>
        <h3 className="text-xs font-medium text-foreground mb-3">Overview</h3>
        <div className="text-2xl font-light text-foreground">{totalPapers}</div>
        <p className="text-xs text-muted-foreground">papers analyzed</p>
      </div>

      {/* Stats */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-emerald-600 dark:text-emerald-400">Included</span>
          <span className="font-medium">{includedCount}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-red-600 dark:text-red-400">Excluded</span>
          <span className="font-medium">{excludedCount}</span>
        </div>
      </div>

      {/* Visual Bar */}
      <div className="flex h-1.5 rounded-full overflow-hidden bg-muted">
        <div 
          className="bg-emerald-500 transition-all"
          style={{ width: `${includePercent}%` }}
        />
        <div 
          className="bg-red-400 transition-all"
          style={{ width: `${excludePercent}%` }}
        />
      </div>

      {/* Score Filter */}
      <div className="pt-3 border-t border-border/50">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-foreground">Min. Score</span>
          <span className="text-xs font-mono text-muted-foreground">
            {scoreThreshold.toFixed(1)}
          </span>
        </div>
        
        <Slider
          value={[scoreThreshold]}
          onValueChange={(values) => onScoreThresholdChange?.(values[0])}
          max={5}
          min={0}
          step={0.1}
          className="w-full"
        />
        
        <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
          <span>0</span>
          <span>5</span>
        </div>
      </div>

      {/* Legend */}
      <div className="pt-3 border-t border-border/50">
        <span className="text-xs font-medium text-foreground block mb-2">Criteria</span>
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />Pass
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />Partial
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />Fail
          </span>
        </div>
      </div>
    </div>
  );
};
