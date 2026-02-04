import { Target, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AssistantBlock, ForecastData } from '@/types/chat-blocks';

interface ForecastBlockProps {
  block: AssistantBlock & { forecast?: ForecastData };
}

const riskConfig = {
  low: {
    color: 'bg-green-500',
    label: 'Низкий риск',
    textColor: 'text-green-600',
  },
  medium: {
    color: 'bg-yellow-500',
    label: 'Средний риск',
    textColor: 'text-yellow-600',
  },
  high: {
    color: 'bg-orange-500',
    label: 'Высокий риск',
    textColor: 'text-orange-600',
  },
  critical: {
    color: 'bg-red-500',
    label: 'Критический риск',
    textColor: 'text-red-600',
  },
};

export function ForecastBlock({ block }: ForecastBlockProps) {
  const { forecast, title } = block;
  
  if (!forecast) return null;
  
  // Calculate progress percentage
  const range = forecast.current.value - forecast.target.value;
  const progress = range > 0 ? (range / forecast.current.value) * 100 : 0;
  
  const risk = riskConfig[forecast.riskLevel];

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-4">
      {title && (
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-sm font-medium text-foreground">{title}</h3>
        </div>
      )}
      
      {/* Progress bar */}
      <div className="space-y-3">
        <div className="relative">
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full transition-all duration-500"
              style={{ width: `${100 - progress}%` }}
            />
          </div>
          
          {/* Current marker */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-foreground border-2 border-background shadow-sm"
            style={{ left: `calc(${100 - progress}% - 8px)` }}
          />
        </div>
        
        {/* Labels */}
        <div className="flex justify-between text-xs">
          <div className="text-left">
            <div className="font-semibold text-foreground">{forecast.current.value}</div>
            <div className="text-muted-foreground">{forecast.current.date}</div>
          </div>
          <div className="text-center text-muted-foreground font-medium">
            {forecast.timeToTarget}
          </div>
          <div className="text-right">
            <div className="font-semibold text-destructive">{forecast.target.value}</div>
            <div className="text-muted-foreground">{forecast.target.label}</div>
          </div>
        </div>
      </div>
      
      {/* Risk badge */}
      <div className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium",
        risk.color,
        "text-white"
      )}>
        <AlertTriangle className="w-3.5 h-3.5" />
        {risk.label}
        {forecast.confidence && (
          <span className="opacity-80">({forecast.confidence}% уверенность)</span>
        )}
      </div>
    </div>
  );
}
