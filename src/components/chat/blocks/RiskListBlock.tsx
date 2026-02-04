import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AssistantBlock, RiskItem } from '@/types/chat-blocks';

interface RiskListBlockProps {
  block: AssistantBlock & { risks?: RiskItem[] };
}

const riskConfig = {
  low: {
    icon: Info,
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    text: 'text-green-600',
    dot: 'bg-green-500',
    label: 'Низкий',
  },
  medium: {
    icon: AlertCircle,
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    text: 'text-yellow-600',
    dot: 'bg-yellow-500',
    label: 'Средний',
  },
  high: {
    icon: AlertTriangle,
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    text: 'text-orange-600',
    dot: 'bg-orange-500',
    label: 'Высокий',
  },
  critical: {
    icon: AlertTriangle,
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    text: 'text-red-600',
    dot: 'bg-red-500',
    label: 'Критический',
  },
};

export function RiskListBlock({ block }: RiskListBlockProps) {
  const { risks, title } = block;
  
  if (!risks?.length) return null;

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      {title && (
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-sm font-medium text-foreground">{title}</h3>
        </div>
      )}
      
      <div className="space-y-2">
        {risks.map((risk, i) => {
          const config = riskConfig[risk.level];
          const Icon = config.icon;
          
          return (
            <div 
              key={i}
              className={cn(
                "rounded-lg border p-3 space-y-1",
                config.bg,
                config.border
              )}
            >
              <div className="flex items-center gap-2">
                <span className={cn("w-2 h-2 rounded-full", config.dot)} />
                <span className={cn("text-sm font-medium", config.text)}>
                  {risk.title}
                </span>
              </div>
              {(risk.description || risk.impact) && (
                <p className="text-sm text-muted-foreground pl-4">
                  {risk.description || risk.impact}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
