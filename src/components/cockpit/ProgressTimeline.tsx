import { cn } from '@/lib/utils';

export interface ProgressStep {
  name: string;
  status: 'complete' | 'active' | 'pending';
  detail: string;
}

interface ProgressTimelineProps {
  steps: ProgressStep[];
  className?: string;
}

export const ProgressTimeline = ({ steps, className }: ProgressTimelineProps) => {
  // Calculate progress percentage based on completed steps
  const completedCount = steps.filter(s => s.status === 'complete').length;
  const activeIndex = steps.findIndex(s => s.status === 'active');
  const progressPercent = activeIndex >= 0 
    ? ((completedCount + 0.5) / steps.length) * 100 
    : (completedCount / steps.length) * 100;

  return (
    <div className={cn("px-4 py-3 border-b border-border bg-muted/30", className)}>
      <div className="text-xs text-muted-foreground mb-3">Live Progress</div>
      
      {/* Timeline */}
      <div className="relative">
        {/* Base line */}
        <div className="absolute top-1.5 left-0 right-0 h-[2px] bg-muted-foreground/20" />
        {/* Progress line */}
        <div 
          className="absolute top-1.5 left-0 h-[2px] bg-primary transition-all duration-500" 
          style={{ width: `${progressPercent}%` }} 
        />
        
        {/* Steps on the line */}
        <div className="relative flex justify-between">
          {steps.map((step) => (
            <div key={step.name} className="flex flex-col items-center">
              {/* Dot on line */}
              <div className={cn(
                "w-3 h-3 rounded-full border-2 bg-background z-10 transition-all duration-300",
                step.status === 'complete' && "border-primary bg-primary",
                step.status === 'active' && "border-primary bg-background shadow-[0_0_8px_hsl(var(--primary)/0.6)]",
                step.status === 'pending' && "border-muted-foreground/30 bg-background"
              )}>
                {step.status === 'active' && (
                  <div className="w-full h-full rounded-full bg-primary animate-pulse scale-50" />
                )}
              </div>
              
              {/* Label below */}
              <div className={cn(
                "text-[10px] font-medium mt-1.5 whitespace-nowrap",
                step.status === 'complete' && "text-primary",
                step.status === 'active' && "text-primary",
                step.status === 'pending' && "text-muted-foreground/50"
              )}>
                {step.name}
              </div>
              <div className={cn(
                "text-[9px] whitespace-nowrap",
                step.status === 'pending' ? "text-muted-foreground/40" : "text-muted-foreground"
              )}>
                {step.detail}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
