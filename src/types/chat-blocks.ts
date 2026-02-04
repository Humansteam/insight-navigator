/**
 * AssistantBlock - блочная система для структурированных ответов AI
 * 
 * Унифицированный формат для Agent Chat, Simple Chat и Document Q&A
 */

export type BlockKind = 
  | 'text'
  | 'summary'
  | 'table'
  | 'chart'
  | 'list'
  | 'code'
  | 'insight'
  | 'metric-group'
  | 'timeline'
  | 'tool-call'
  // Corporate RAG blocks
  | 'data-series'
  | 'calculation'
  | 'forecast'
  | 'strategy-card'
  | 'risk-list'
  | 'highlight-metrics'
  | 'source-reference';

export interface TableData {
  columns: string[];
  rows: string[][];
}

export interface ChartData {
  type: 'bar' | 'line' | 'pie';
  x: string[];
  series: Record<string, number[]>;
}

export interface MetricItem {
  label: string;
  value: string | number;
  change?: number; // percentage change
  trend?: 'up' | 'down' | 'neutral';
}

export interface TimelineEvent {
  id: string;
  label: string;
  timestamp: string;
  status: 'pending' | 'running' | 'complete' | 'error';
  detail?: string;
}

export interface ToolCallData {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'complete' | 'error';
  input?: Record<string, unknown>;
  output?: {
    summary: string;
    count?: number;
    details?: string;
  };
  duration?: number; // ms
}

// Corporate RAG data types
export interface DataSeriesData {
  periods: string[];
  values?: number[];
  groups?: { label: string; data: number[] }[];
  threshold?: { value: number; label: string };
  source?: { page?: number; document: string };
}

export interface CalculationData {
  formula: string;
  inputs: { label: string; value: number | string }[];
  result: { label: string; value: number | string; unit?: string };
  steps?: string[];
}

export interface ForecastData {
  current: { value: number; label: string; date: string };
  target: { value: number; label: string };
  timeToTarget: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  confidence?: number;
}

export interface StrategyCardData {
  columns: {
    title: string;
    items: { text: string; done?: boolean }[];
  }[];
  urgency?: number; // 0-100
  timeframe?: string;
}

export interface RiskItem {
  level: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description?: string;
  impact?: string;
}

export interface HighlightMetricItem {
  label: string;
  value: string;
  trend?: 'up' | 'down';
  icon?: string;
  color?: string;
}

export interface SourceReference {
  documentName: string;
  page?: number;
  section?: string;
  confidence?: number;
}

export interface AssistantBlock {
  id: string;
  kind: BlockKind;
  title?: string;
  body?: string; // markdown / rich text
  
  // Specific data by kind
  table?: TableData;
  chart?: ChartData;
  list?: string[];
  code?: { language: string; content: string };
  metrics?: MetricItem[];
  timeline?: TimelineEvent[];
  toolCall?: ToolCallData;
  
  // Corporate RAG data
  dataSeries?: DataSeriesData;
  calculation?: CalculationData;
  forecast?: ForecastData;
  strategy?: StrategyCardData;
  risks?: RiskItem[];
  highlightMetrics?: HighlightMetricItem[];
  sources?: SourceReference[];
  
  // Metadata
  meta?: {
    paperIds?: string[];
    clusterId?: string;
    link?: string;
    [key: string]: unknown;
  };
}

// Structured chat message with blocks
export interface BlockMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
  
  // Plain text for user messages
  content?: string;
  
  // Structured blocks for assistant messages
  blocks?: AssistantBlock[];
  
  // Tool calls sidebar
  toolCalls?: ToolCallData[];
  
  // Status
  isStreaming?: boolean;
  isThinking?: boolean;
}
