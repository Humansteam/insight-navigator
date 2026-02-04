import { Calculator, ArrowRight } from 'lucide-react';
import type { AssistantBlock, CalculationData } from '@/types/chat-blocks';

interface CalculationBlockProps {
  block: AssistantBlock & { calculation?: CalculationData };
}

export function CalculationBlock({ block }: CalculationBlockProps) {
  const { calculation, title } = block;
  
  if (!calculation) return null;

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-4">
      {title && (
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-sm font-medium text-foreground">{title}</h3>
        </div>
      )}
      
      {/* Formula */}
      <div className="px-3 py-2 rounded-lg bg-muted/50 border border-border/50">
        <code className="text-sm font-mono text-foreground">
          {calculation.formula}
        </code>
      </div>
      
      {/* Inputs table */}
      <div className="space-y-2">
        <div className="grid grid-cols-3 gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
          <span>Параметр</span>
          <span className="text-right col-span-2">Значение</span>
        </div>
        {calculation.inputs.map((input, i) => (
          <div key={i} className="grid grid-cols-3 gap-2 text-sm">
            <span className="text-muted-foreground">{input.label}</span>
            <span className="text-right col-span-2 font-medium text-foreground">
              {input.value}
            </span>
          </div>
        ))}
        <div className="border-t border-border pt-2 mt-2">
          <div className="grid grid-cols-3 gap-2 text-sm">
            <span className="text-foreground font-medium">{calculation.result.label}</span>
            <span className="text-right col-span-2 font-semibold text-primary">
              {calculation.result.value} {calculation.result.unit}
            </span>
          </div>
        </div>
      </div>
      
      {/* Steps */}
      {calculation.steps && calculation.steps.length > 0 && (
        <div className="space-y-1.5 pt-2 border-t border-border">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Шаги расчёта
          </span>
          <div className="space-y-1">
            {calculation.steps.map((step, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                <ArrowRight className="w-3 h-3 shrink-0" />
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
