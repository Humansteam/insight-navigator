/**
 * ToolCallsRibbon - боковая панель с историей tool calls
 */

import { Search, Check, Loader2, AlertCircle, Brain, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { ToolCallData } from '@/types/chat-blocks';

interface ToolCallsRibbonProps {
  toolCalls: ToolCallData[];
  className?: string;
}

export function ToolCallsRibbon({ toolCalls, className }: ToolCallsRibbonProps) {
  if (!toolCalls.length) return null;
  
  const getIcon = (call: ToolCallData) => {
    if (call.name.includes('search')) return <Search className="w-3.5 h-3.5" />;
    if (call.name.includes('reason') || call.name.includes('think')) return <Brain className="w-3.5 h-3.5" />;
    return <ChevronRight className="w-3.5 h-3.5" />;
  };
  
  const getStatusIcon = (status: ToolCallData['status']) => {
    switch (status) {
      case 'complete':
        return <Check className="w-3 h-3 text-green-500" />;
      case 'running':
        return <Loader2 className="w-3 h-3 text-primary animate-spin" />;
      case 'error':
        return <AlertCircle className="w-3 h-3 text-red-500" />;
      default:
        return <div className="w-2 h-2 rounded-full bg-muted-foreground/40" />;
    }
  };
  
  return (
    <div className={cn(
      "w-64 border-l border-border bg-card/50",
      className
    )}>
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-sm font-medium text-foreground">Agent Activity</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          {toolCalls.filter(t => t.status === 'complete').length} / {toolCalls.length} complete
        </p>
      </div>
      
      <ScrollArea className="h-[calc(100%-60px)]">
        <div className="p-3 space-y-2">
          {toolCalls.map((call) => (
            <div 
              key={call.id}
              className={cn(
                "p-2.5 rounded-lg border transition-colors",
                call.status === 'running' && "border-primary/50 bg-primary/5",
                call.status === 'complete' && "border-border bg-muted/30",
                call.status === 'error' && "border-red-500/50 bg-red-500/5",
                call.status === 'pending' && "border-border/50 bg-background"
              )}
            >
              <div className="flex items-center gap-2">
                <span className={cn(
                  "shrink-0",
                  call.status === 'running' && "text-primary",
                  call.status === 'complete' && "text-muted-foreground",
                  call.status === 'error' && "text-red-500",
                  call.status === 'pending' && "text-muted-foreground/50"
                )}>
                  {getIcon(call)}
                </span>
                <span className="text-xs font-medium text-foreground flex-1 truncate">
                  {call.name.replace(/_/g, ' ')}
                </span>
                {getStatusIcon(call.status)}
              </div>
              
              {call.output?.summary && (
                <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">
                  {call.output.summary}
                </p>
              )}
              
              {call.duration && call.status === 'complete' && (
                <p className="text-[10px] text-muted-foreground/70 mt-1">
                  {call.duration}ms
                </p>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
