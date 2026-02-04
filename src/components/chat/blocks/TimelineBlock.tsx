import { Check, Loader2, Circle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AssistantBlock } from '@/types/chat-blocks';

interface TimelineBlockProps {
  block: AssistantBlock;
}

export function TimelineBlock({ block }: TimelineBlockProps) {
  const { timeline } = block;
  
  if (!timeline?.length) return null;
  
  return (
    <div className="space-y-3">
      {block.title && (
        <h3 className="text-sm font-semibold text-foreground">{block.title}</h3>
      )}
      <div className="relative pl-6">
        {/* Vertical line */}
        <div className="absolute left-[9px] top-2 bottom-2 w-px bg-border" />
        
        <div className="space-y-4">
          {timeline.map((event, i) => (
            <div key={event.id} className="relative flex items-start gap-3">
              {/* Status icon */}
              <div className={cn(
                "absolute left-[-15px] w-5 h-5 rounded-full flex items-center justify-center",
                "ring-4 ring-background",
                event.status === 'complete' && "bg-green-500",
                event.status === 'running' && "bg-primary",
                event.status === 'pending' && "bg-muted",
                event.status === 'error' && "bg-red-500"
              )}>
                {event.status === 'complete' && <Check className="w-3 h-3 text-white" />}
                {event.status === 'running' && <Loader2 className="w-3 h-3 text-white animate-spin" />}
                {event.status === 'pending' && <Circle className="w-2 h-2 fill-muted-foreground text-muted-foreground" />}
                {event.status === 'error' && <AlertCircle className="w-3 h-3 text-white" />}
              </div>
              
              <div className="flex-1 ml-3">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-sm font-medium",
                    event.status === 'complete' && "text-foreground",
                    event.status === 'running' && "text-primary",
                    event.status === 'pending' && "text-muted-foreground",
                    event.status === 'error' && "text-red-500"
                  )}>
                    {event.label}
                  </span>
                  <span className="text-xs text-muted-foreground">{event.timestamp}</span>
                </div>
                {event.detail && (
                  <p className="text-xs text-muted-foreground mt-0.5">{event.detail}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
