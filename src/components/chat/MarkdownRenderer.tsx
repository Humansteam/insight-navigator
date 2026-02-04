import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

interface ParsedElement {
  type: 'heading' | 'paragraph' | 'list' | 'table' | 'blockquote' | 'hr' | 'code';
  content: string | string[];
  level?: number;
  listType?: 'ordered' | 'unordered';
  rows?: string[][];
}

const parseMarkdown = (text: string): ParsedElement[] => {
  const lines = text.split('\n');
  const elements: ParsedElement[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Skip empty lines
    if (line.trim() === '') {
      i++;
      continue;
    }

    // Table detection
    if (line.includes('|') && line.trim().startsWith('|')) {
      const tableRows: string[][] = [];
      let j = i;
      
      while (j < lines.length && lines[j].includes('|')) {
        const row = lines[j]
          .split('|')
          .map(cell => cell.trim())
          .filter(cell => cell !== '' && !cell.match(/^[-:]+$/));
        
        // Skip separator row (|---|---|)
        if (!lines[j].match(/^\|[\s-:|]+\|$/)) {
          if (row.length > 0) {
            tableRows.push(row);
          }
        }
        j++;
      }
      
      if (tableRows.length > 0) {
        elements.push({ type: 'table', content: '', rows: tableRows });
      }
      i = j;
      continue;
    }

    // Headings
    if (line.startsWith('### ')) {
      elements.push({ type: 'heading', content: line.slice(4), level: 3 });
      i++;
      continue;
    }
    if (line.startsWith('## ')) {
      elements.push({ type: 'heading', content: line.slice(3), level: 2 });
      i++;
      continue;
    }
    if (line.startsWith('# ')) {
      elements.push({ type: 'heading', content: line.slice(2), level: 1 });
      i++;
      continue;
    }

    // Horizontal rule
    if (line.match(/^[-*_]{3,}$/)) {
      elements.push({ type: 'hr', content: '' });
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      elements.push({ type: 'blockquote', content: line.slice(2) });
      i++;
      continue;
    }

    // Code block
    if (line.startsWith('```')) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push({ type: 'code', content: codeLines.join('\n') });
      i++;
      continue;
    }

    // Unordered list
    if (line.match(/^[-*•]\s/)) {
      const listItems: string[] = [];
      while (i < lines.length && lines[i].match(/^[-*•]\s/)) {
        listItems.push(lines[i].replace(/^[-*•]\s/, ''));
        i++;
      }
      elements.push({ type: 'list', content: listItems, listType: 'unordered' });
      continue;
    }

    // Ordered list
    if (line.match(/^\d+\.\s/)) {
      const listItems: string[] = [];
      while (i < lines.length && lines[i].match(/^\d+\.\s/)) {
        listItems.push(lines[i].replace(/^\d+\.\s/, ''));
        i++;
      }
      elements.push({ type: 'list', content: listItems, listType: 'ordered' });
      continue;
    }

    // Regular paragraph
    elements.push({ type: 'paragraph', content: line });
    i++;
  }

  return elements;
};

const renderInlineMarkdown = (text: string) => {
  // Bold
  let result = text.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>');
  // Italic
  result = result.replace(/(?<!\*)_(.+?)_(?!_)/g, '<em>$1</em>');
  result = result.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');
  // Inline code
  result = result.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-muted text-sm font-mono">$1</code>');
  // Links
  result = result.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-primary underline underline-offset-2 hover:no-underline" target="_blank">$1</a>');
  // Arrows (→)
  result = result.replace(/->/g, '→');
  
  return result;
};

export const MarkdownRenderer = ({ content, className }: MarkdownRendererProps) => {
  const elements = parseMarkdown(content);

  return (
    <div className={cn("space-y-4", className)}>
      {elements.map((element, index) => {
        switch (element.type) {
          case 'heading':
            if (element.level === 1) {
              return (
                <h1 key={index} className="text-xl font-semibold text-foreground mt-6 mb-3">
                  {element.content as string}
                </h1>
              );
            }
            if (element.level === 2) {
              return (
                <h2 key={index} className="text-lg font-semibold text-foreground mt-5 mb-2">
                  {element.content as string}
                </h2>
              );
            }
            return (
              <h3 key={index} className="text-base font-medium text-foreground mt-4 mb-2">
                {element.content as string}
              </h3>
            );

          case 'paragraph':
            return (
              <p 
                key={index} 
                className="text-base text-foreground/90 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(element.content as string) }}
              />
            );

          case 'list':
            const ListTag = element.listType === 'ordered' ? 'ol' : 'ul';
            return (
              <ListTag 
                key={index} 
                className={cn(
                  "space-y-1.5 pl-1",
                  element.listType === 'ordered' ? "list-decimal" : "list-none"
                )}
              >
                {(element.content as string[]).map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-base text-foreground/90 leading-relaxed">
                    {element.listType === 'unordered' && (
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    )}
                    {element.listType === 'ordered' && (
                      <span className="text-primary font-medium shrink-0 min-w-[20px]">{i + 1}.</span>
                    )}
                    <span dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(item) }} />
                  </li>
                ))}
              </ListTag>
            );

          case 'table':
            if (!element.rows || element.rows.length === 0) return null;
            const [header, ...body] = element.rows;
            return (
              <div key={index} className="my-4 rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      {header.map((cell, i) => (
                        <TableHead 
                          key={i} 
                          className="text-xs font-medium text-muted-foreground uppercase tracking-wider h-10 px-4"
                        >
                          {cell}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {body.map((row, i) => (
                      <TableRow key={i} className="hover:bg-muted/30">
                        {row.map((cell, j) => (
                          <TableCell 
                            key={j} 
                            className="text-sm text-foreground/90 px-4 py-3"
                            dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(cell) }}
                          />
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            );

          case 'blockquote':
            return (
              <blockquote 
                key={index} 
                className="border-l-2 border-primary pl-4 text-foreground/80 italic"
                dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(element.content as string) }}
              />
            );

          case 'hr':
            return <hr key={index} className="my-6 border-border" />;

          case 'code':
            return (
              <pre key={index} className="p-4 rounded-lg bg-muted overflow-x-auto">
                <code className="text-sm font-mono text-foreground/90">
                  {element.content as string}
                </code>
              </pre>
            );

          default:
            return null;
        }
      })}
    </div>
  );
};
