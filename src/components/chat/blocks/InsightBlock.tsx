import { Lightbulb, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { AssistantBlock } from '@/types/chat-blocks';

interface InsightBlockProps {
  block: AssistantBlock;
  onPaperClick?: (paperId: string) => void;
}

export function InsightBlock({ block, onPaperClick }: InsightBlockProps) {
  const paperIds = block.meta?.paperIds as string[] | undefined;
  
  return (
    <div className={cn(
      "relative p-4 rounded-xl",
      "bg-amber-500/5 border border-amber-500/20"
    )}>
      <div className="flex items-start gap-3">
        <div className="shrink-0 w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
          <Lightbulb className="w-4 h-4 text-amber-500" />
        </div>
        <div className="flex-1 space-y-2">
          {block.title && (
            <h3 className="text-sm font-medium text-amber-600 dark:text-amber-400">
              {block.title}
            </h3>
          )}
          {block.body && (
            <p className="text-sm leading-relaxed text-foreground">{block.body}</p>
          )}
          {paperIds && paperIds.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {paperIds.map((id) => (
                <Button
                  key={id}
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => onPaperClick?.(id)}
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  {id}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
