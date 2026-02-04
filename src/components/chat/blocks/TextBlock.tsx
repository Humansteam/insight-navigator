import { MarkdownRenderer } from '../MarkdownRenderer';
import type { AssistantBlock } from '@/types/chat-blocks';

interface TextBlockProps {
  block: AssistantBlock;
}

export function TextBlock({ block }: TextBlockProps) {
  return (
    <div className="space-y-2">
      {block.title && (
        <h3 className="text-base font-semibold text-foreground">{block.title}</h3>
      )}
      {block.body && (
        <MarkdownRenderer content={block.body} />
      )}
    </div>
  );
}
