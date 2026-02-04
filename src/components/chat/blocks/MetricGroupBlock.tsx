import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AssistantBlock } from '@/types/chat-blocks';

interface MetricGroupBlockProps {
  block: AssistantBlock;
}

export function MetricGroupBlock({ block }: MetricGroupBlockProps) {
  const { metrics } = block;
  
  if (!metrics?.length) return null;
  
  return (
    <div className="space-y-3">
      {block.title && (
        <h3 className="text-sm font-semibold text-foreground">{block.title}</h3>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {metrics.map((metric, i) => (
          <div 
            key={i}
            className={cn(
              "p-3 rounded-lg border border-border",
              "bg-card hover:bg-muted/30 transition-colors"
            )}
          >
            <div className="text-xs text-muted-foreground mb-1">{metric.label}</div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-semibold text-foreground">
                {typeof metric.value === 'number' 
                  ? metric.value.toLocaleString() 
                  : metric.value}
              </span>
              {metric.change !== undefined && (
                <span className={cn(
                  "flex items-center gap-0.5 text-xs font-medium",
                  metric.trend === 'up' && "text-green-500",
                  metric.trend === 'down' && "text-red-500",
                  metric.trend === 'neutral' && "text-muted-foreground"
                )}>
                  {metric.trend === 'up' && <TrendingUp className="w-3 h-3" />}
                  {metric.trend === 'down' && <TrendingDown className="w-3 h-3" />}
                  {metric.trend === 'neutral' && <Minus className="w-3 h-3" />}
                  {metric.change > 0 ? '+' : ''}{metric.change}%
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
