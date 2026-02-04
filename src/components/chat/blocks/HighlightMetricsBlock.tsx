import { TrendingUp, TrendingDown, Minus, Target, Calendar, DollarSign, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AssistantBlock, HighlightMetricItem } from '@/types/chat-blocks';

interface HighlightMetricsBlockProps {
  block: AssistantBlock & { highlightMetrics?: HighlightMetricItem[] };
}

const iconMap: Record<string, React.ElementType> = {
  'trending-up': TrendingUp,
  'trending-down': TrendingDown,
  target: Target,
  calendar: Calendar,
  dollar: DollarSign,
  zap: Zap,
};

const colorMap: Record<string, string> = {
  green: 'text-green-600',
  red: 'text-red-600',
  primary: 'text-primary',
  muted: 'text-muted-foreground',
  yellow: 'text-yellow-600',
  blue: 'text-blue-600',
};

export function HighlightMetricsBlock({ block }: HighlightMetricsBlockProps) {
  const { highlightMetrics, title } = block;
  
  if (!highlightMetrics?.length) return null;

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      {title && (
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-sm font-medium text-foreground">{title}</h3>
        </div>
      )}
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {highlightMetrics.map((metric, i) => {
          const TrendIcon = metric.trend === 'up' 
            ? TrendingUp 
            : metric.trend === 'down' 
              ? TrendingDown 
              : null;
          
          const CustomIcon = metric.icon ? iconMap[metric.icon] : null;
          const textColor = colorMap[metric.color || 'primary'] || 'text-foreground';
          
          return (
            <div 
              key={i}
              className="flex flex-col items-center justify-center p-3 rounded-lg bg-muted/50 border border-border/50 text-center"
            >
              {TrendIcon && (
                <TrendIcon className={cn("w-4 h-4 mb-1", textColor)} />
              )}
              {CustomIcon && !TrendIcon && (
                <CustomIcon className={cn("w-4 h-4 mb-1", textColor)} />
              )}
              <span className={cn("text-xl font-bold", textColor)}>
                {metric.value}
              </span>
              <span className="text-xs text-muted-foreground mt-0.5">
                {metric.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
