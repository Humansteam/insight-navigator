import { Target, Clock } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import type { AssistantBlock, StrategyCardData } from '@/types/chat-blocks';

interface StrategyCardBlockProps {
  block: AssistantBlock & { strategy?: StrategyCardData };
}

export function StrategyCardBlock({ block }: StrategyCardBlockProps) {
  const { strategy, title } = block;
  
  if (!strategy) return null;

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-4">
      {title && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-medium text-foreground">{title}</h3>
          </div>
          {strategy.timeframe && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              {strategy.timeframe}
            </div>
          )}
        </div>
      )}
      
      {/* Columns grid */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${strategy.columns.length}, 1fr)` }}>
        {strategy.columns.map((column, colIndex) => (
          <div key={colIndex} className="space-y-3">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {column.title}
            </h4>
            <div className="space-y-2">
              {column.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-start gap-2.5">
                  <Checkbox 
                    checked={item.done} 
                    className="mt-0.5 shrink-0"
                    disabled
                  />
                  <span className="text-sm text-foreground leading-relaxed">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Urgency meter */}
      {strategy.urgency !== undefined && (
        <div className="pt-3 border-t border-border space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground font-medium">Срочность</span>
            <span className="font-semibold text-foreground">{strategy.urgency}%</span>
          </div>
          <Progress value={strategy.urgency} className="h-2" />
        </div>
      )}
    </div>
  );
}
