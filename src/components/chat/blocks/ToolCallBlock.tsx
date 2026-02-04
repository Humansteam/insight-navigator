import { Search, Check, Loader2, AlertCircle, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { AssistantBlock } from '@/types/chat-blocks';

interface ToolCallBlockProps {
  block: AssistantBlock;
  onOpenResults?: () => void;
}

export function ToolCallBlock({ block, onOpenResults }: ToolCallBlockProps) {
  const { toolCall } = block;
  
  if (!toolCall) return null;
  
  const getStatusIcon = () => {
    switch (toolCall.status) {
      case 'complete':
        return <Check className="w-3.5 h-3.5 text-green-500" />;
      case 'running':
        return <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />;
      case 'error':
        return <AlertCircle className="w-3.5 h-3.5 text-red-500" />;
      default:
        return <Search className="w-3.5 h-3.5 text-muted-foreground" />;
    }
  };
  
  const getToolIcon = () => {
    if (toolCall.name.includes('search')) return '🔍';
    if (toolCall.name.includes('cluster')) return '🧩';
    if (toolCall.name.includes('extract')) return '📊';
    if (toolCall.name.includes('topology')) return '🕸️';
    return '⚙️';
  };
  
  return (
    <div className={cn(
      "rounded-lg border border-border overflow-hidden",
      "bg-muted/30"
    )}>
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border/50">
        <span className="text-base">{getToolIcon()}</span>
        <span className="text-sm font-medium text-foreground flex-1">
          {toolCall.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </span>
        {getStatusIcon()}
        {toolCall.duration && (
          <span className="text-xs text-muted-foreground">{toolCall.duration}ms</span>
        )}
      </div>
      
      {/* Result */}
      {toolCall.output && (
        <div className="px-3 py-2.5 space-y-2">
          <p className="text-sm text-foreground">{toolCall.output.summary}</p>
          {toolCall.output.count !== undefined && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Found {toolCall.output.count} results
              </span>
              {onOpenResults && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs text-primary hover:text-primary"
                  onClick={onOpenResults}
                >
                  Open list
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Pending state */}
      {toolCall.status === 'running' && !toolCall.output && (
        <div className="px-3 py-2.5">
          <span className="text-sm text-muted-foreground">Processing...</span>
        </div>
      )}
    </div>
  );
}
