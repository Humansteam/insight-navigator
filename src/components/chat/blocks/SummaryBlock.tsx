import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AssistantBlock } from '@/types/chat-blocks';

interface SummaryBlockProps {
  block: AssistantBlock;
}

export function SummaryBlock({ block }: SummaryBlockProps) {
  return (
    <div className={cn(
      "relative p-4 rounded-xl",
      "bg-primary/5 border border-primary/20"
    )}>
      <div className="flex items-start gap-3">
        <div className="shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1 space-y-1">
          {block.title && (
            <h3 className="text-sm font-medium text-primary">{block.title}</h3>
          )}
          {block.body && (
            <p className="text-base leading-relaxed text-foreground">{block.body}</p>
          )}
        </div>
      </div>
    </div>
  );
}
