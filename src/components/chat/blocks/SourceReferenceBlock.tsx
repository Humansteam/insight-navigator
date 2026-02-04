import { FileText, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AssistantBlock, SourceReference } from '@/types/chat-blocks';

interface SourceReferenceBlockProps {
  block: AssistantBlock & { sources?: SourceReference[] };
}

export function SourceReferenceBlock({ block }: SourceReferenceBlockProps) {
  const { sources } = block;
  
  if (!sources?.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-border">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <FileText className="w-3.5 h-3.5" />
        <span>Источники:</span>
      </div>
      
      {sources.map((source, i) => (
        <button
          key={i}
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs",
            "bg-muted/50 hover:bg-muted border border-border/50",
            "text-muted-foreground hover:text-foreground transition-colors"
          )}
        >
          <span className="font-medium">{source.documentName}</span>
          {source.page && <span className="opacity-70">стр. {source.page}</span>}
          {source.section && <span className="opacity-70">• {source.section}</span>}
          {source.confidence && (
            <span className={cn(
              "ml-1 px-1.5 py-0.5 rounded text-[10px] font-medium",
              source.confidence >= 90 ? "bg-green-500/10 text-green-600" :
              source.confidence >= 70 ? "bg-yellow-500/10 text-yellow-600" :
              "bg-muted text-muted-foreground"
            )}>
              {source.confidence}%
            </span>
          )}
          <ExternalLink className="w-3 h-3 opacity-50" />
        </button>
      ))}
    </div>
  );
}
