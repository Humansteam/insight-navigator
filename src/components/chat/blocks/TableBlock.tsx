import { cn } from '@/lib/utils';
import type { AssistantBlock } from '@/types/chat-blocks';

interface TableBlockProps {
  block: AssistantBlock;
}

export function TableBlock({ block }: TableBlockProps) {
  const { table } = block;
  
  if (!table || !table.columns.length) return null;
  
  return (
    <div className="space-y-3">
      {block.title && (
        <h3 className="text-sm font-semibold text-foreground">{block.title}</h3>
      )}
      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50">
              {table.columns.map((col, i) => (
                <th 
                  key={i} 
                  className={cn(
                    "px-4 py-2.5 text-left font-medium text-muted-foreground",
                    i === 0 ? "rounded-tl-lg" : "",
                    i === table.columns.length - 1 ? "rounded-tr-lg" : ""
                  )}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, rowIdx) => (
              <tr 
                key={rowIdx} 
                className={cn(
                  "border-t border-border/50 transition-colors",
                  "hover:bg-muted/30"
                )}
              >
                {row.map((cell, cellIdx) => (
                  <td 
                    key={cellIdx} 
                    className="px-4 py-2.5 text-foreground"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
