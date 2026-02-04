import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { AssistantBlock } from '@/types/chat-blocks';

interface CodeBlockProps {
  block: AssistantBlock;
}

export function CodeBlock({ block }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const { code } = block;
  
  if (!code) return null;
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(code.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="space-y-2">
      {block.title && (
        <h3 className="text-sm font-semibold text-foreground">{block.title}</h3>
      )}
      <div className="relative rounded-lg border border-border overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border">
          <span className="text-xs font-mono text-muted-foreground">{code.language}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-green-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </Button>
        </div>
        <pre className={cn(
          "p-4 overflow-x-auto",
          "bg-card text-sm font-mono text-foreground"
        )}>
          <code>{code.content}</code>
        </pre>
      </div>
    </div>
  );
}
