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
  | 'tool-call';

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
