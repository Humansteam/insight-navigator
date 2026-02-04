import { Check, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AssistantBlock } from '@/types/chat-blocks';

interface ListBlockProps {
  block: AssistantBlock;
}

export function ListBlock({ block }: ListBlockProps) {
  const { list } = block;
  
  if (!list?.length) return null;
  
  const isActionList = block.title?.toLowerCase().includes('next') || 
                       block.title?.toLowerCase().includes('action') ||
                       block.title?.toLowerCase().includes('step');
  
  return (
    <div className="space-y-2">
      {block.title && (
        <h3 className="text-sm font-semibold text-foreground">{block.title}</h3>
      )}
      <ul className="space-y-2">
        {list.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <span className={cn(
              "shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center",
              isActionList 
                ? "bg-primary/10 text-primary" 
                : "bg-muted text-muted-foreground"
            )}>
              {isActionList ? (
                <Check className="w-3 h-3" />
              ) : (
                <Circle className="w-2 h-2 fill-current" />
              )}
            </span>
            <span className="text-sm text-foreground leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
