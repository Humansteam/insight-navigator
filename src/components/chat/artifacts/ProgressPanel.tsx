import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Circle, Loader2, AlertCircle } from 'lucide-react';
import type { ProgressArtifact } from './types';

interface ProgressPanelProps {
  data: ProgressArtifact;
  isSticky?: boolean;
}

export function ProgressPanel({ data, isSticky = true }: ProgressPanelProps) {
  const { steps, currentStep, query, focus, regions, searchQueries } = data;

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle2 className="w-4 h-4 text-primary" />;
      case 'running':
        return <Loader2 className="w-4 h-4 text-primary animate-spin" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      default:
        return <Circle className="w-4 h-4 text-muted-foreground/40" />;
    }
  };

  return (
    <Card className={cn(
      "border-border bg-card/80 backdrop-blur-sm",
      isSticky && "sticky top-0 z-10"
    )}>
      {/* Progress Steps Timeline */}
      <div className="p-3 border-b border-border">
        <div className="flex items-center justify-between gap-2">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                {getStepIcon(step.status)}
                <span className={cn(
                  "text-[10px] mt-1 whitespace-nowrap",
                  step.status === 'running' && "text-primary font-medium",
                  step.status === 'complete' && "text-primary",
                  step.status === 'pending' && "text-muted-foreground/50"
                )}>
                  {step.name}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={cn(
                  "flex-1 h-[2px] mx-2",
                  step.status === 'complete' ? "bg-primary" : "bg-muted-foreground/20"
                )} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Query Info */}
      {(query || focus || regions) && (
        <div className="p-3 space-y-2">
          {query && (
            <div className="text-sm">
              <span className="text-muted-foreground">Query: </span>
              <span className="text-foreground font-medium">{query}</span>
            </div>
          )}
          {focus && (
            <div className="text-xs">
              <span className="text-muted-foreground">Focus: </span>
              <span className="text-foreground">{focus}</span>
            </div>
          )}
          {regions && regions.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-muted-foreground">Regions:</span>
              {regions.map(r => (
                <Badge key={r} variant="secondary" className="text-[10px] h-5">
                  {r}
                </Badge>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Search Queries */}
      {searchQueries && searchQueries.length > 0 && (
        <div className="p-3 pt-0 space-y-1.5">
          <span className="text-xs text-muted-foreground">Search queries:</span>
          <div className="flex flex-wrap gap-1.5">
            {searchQueries.map((sq, i) => (
              <Badge 
                key={i} 
                variant={sq.priority === 'high' ? 'default' : 'outline'}
                className={cn(
                  "text-[10px]",
                  sq.priority === 'high' && "bg-primary",
                  sq.priority === 'medium' && "border-primary/50 text-primary"
                )}
              >
                {sq.query}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
