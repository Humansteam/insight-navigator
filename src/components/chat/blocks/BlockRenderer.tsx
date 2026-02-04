/**
 * BlockRenderer - универсальный рендерер для AssistantBlock
 */

import { TextBlock } from './TextBlock';
import { SummaryBlock } from './SummaryBlock';
import { TableBlock } from './TableBlock';
import { ChartBlock } from './ChartBlock';
import { MetricGroupBlock } from './MetricGroupBlock';
import { InsightBlock } from './InsightBlock';
import { ListBlock } from './ListBlock';
import { CodeBlock } from './CodeBlock';
import { TimelineBlock } from './TimelineBlock';
import { ToolCallBlock } from './ToolCallBlock';
import type { AssistantBlock } from '@/types/chat-blocks';

interface BlockRendererProps {
  block: AssistantBlock;
  onPaperClick?: (paperId: string) => void;
  onOpenResults?: () => void;
}

export function BlockRenderer({ block, onPaperClick, onOpenResults }: BlockRendererProps) {
  switch (block.kind) {
    case 'text':
      return <TextBlock block={block} />;
    
    case 'summary':
      return <SummaryBlock block={block} />;
    
    case 'table':
      return <TableBlock block={block} />;
    
    case 'chart':
      return <ChartBlock block={block} />;
    
    case 'metric-group':
      return <MetricGroupBlock block={block} />;
    
    case 'insight':
      return <InsightBlock block={block} onPaperClick={onPaperClick} />;
    
    case 'list':
      return <ListBlock block={block} />;
    
    case 'code':
      return <CodeBlock block={block} />;
    
    case 'timeline':
      return <TimelineBlock block={block} />;
    
    case 'tool-call':
      return <ToolCallBlock block={block} onOpenResults={onOpenResults} />;
    
    default:
      return null;
  }
}
