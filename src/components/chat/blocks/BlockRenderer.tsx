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
import { DataSeriesBlock } from './DataSeriesBlock';
import { CalculationBlock } from './CalculationBlock';
import { ForecastBlock } from './ForecastBlock';
import { StrategyCardBlock } from './StrategyCardBlock';
import { RiskListBlock } from './RiskListBlock';
import { HighlightMetricsBlock } from './HighlightMetricsBlock';
import { SourceReferenceBlock } from './SourceReferenceBlock';
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
    
    case 'data-series':
      return <DataSeriesBlock block={block} />;
    
    case 'calculation':
      return <CalculationBlock block={block} />;
    
    case 'forecast':
      return <ForecastBlock block={block} />;
    
    case 'strategy-card':
      return <StrategyCardBlock block={block} />;
    
    case 'risk-list':
      return <RiskListBlock block={block} />;
    
    case 'highlight-metrics':
      return <HighlightMetricsBlock block={block} />;
    
    case 'source-reference':
      return <SourceReferenceBlock block={block} />;
    
    default:
      return null;
  }
}
