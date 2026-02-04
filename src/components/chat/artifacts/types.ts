// Chat Artifact Types - структуры данных для rich-компонентов в чате

export type ArtifactType = 
  | 'map_points' 
  | 'schema' 
  | 'extraction' 
  | 'topology' 
  | 'report' 
  | 'tool_call' 
  | 'search_results' 
  | 'cluster_insight'
  | 'progress';

// === MAP POINTS ===
export interface ClusterCard {
  id: string;
  name: string;
  paperCount: number;
  growth: number; // YoY %
  topRegions: { name: string; count: number }[];
  topMetrics: { label: string; value: string }[];
  color: string;
}

export interface MapPointsArtifact {
  type: 'map_points';
  clusters: ClusterCard[];
  totalPapers: number;
  yearDistribution: { year: number; count: number }[];
  countryDistribution: { country: string; count: number }[];
}

// === SCHEMA ===
export interface Dimension {
  id: string;
  name: string;
  description: string;
  dataType: 'text' | 'number' | 'enum' | 'boolean';
  examples?: string[];
}

export interface SchemaArtifact {
  type: 'schema';
  title: string;
  queryType: string;
  rationale: string;
  dimensions: Dimension[];
  isEditable?: boolean;
}

// === EXTRACTION ===
export interface ExtractedFact {
  id: string;
  paperId: string;
  paperTitle: string;
  dimension: string;
  value: string;
  confidence: 'high' | 'medium' | 'low';
  region: string;
  rawQuote?: string;
}

export interface ExtractionArtifact {
  type: 'extraction';
  facts: ExtractedFact[];
  totalFacts: number;
  byDimension: { dimension: string; count: number }[];
  byConfidence: { level: string; count: number }[];
}

// === TOPOLOGY ===
export interface TopologyCluster {
  id: string;
  label: string;
  nodeCount: number;
  centroid: { x: number; y: number };
}

export interface BridgePaper {
  id: string;
  title: string;
  clusters: string[];
}

export interface TopologyArtifact {
  type: 'topology';
  insightText: string;
  divergenceScore: number;
  divergenceLevel: 'critical' | 'high' | 'medium' | 'low';
  clusters: TopologyCluster[];
  bridges: BridgePaper[];
  totalNodes: number;
  totalEdges: number;
}

// === REPORT ===
export interface ReportSource {
  id: string;
  title: string;
  year: number;
  citations: number;
}

export interface ReportArtifact {
  type: 'report';
  title: string;
  lead: string;
  abstract: string;
  markdown: string;
  sources: ReportSource[];
  parameters: {
    query: string;
    totalPapers: number;
    dimensions: string[];
    regions: string[];
  };
  hasTLDR?: boolean;
}

// === TOOL CALL ===
export interface ToolCallArtifact {
  type: 'tool_call';
  toolName: string;
  status: 'pending' | 'running' | 'complete' | 'error';
  input?: Record<string, unknown>;
  output?: {
    summary: string;
    details?: string;
    count?: number;
  };
}

// === SEARCH RESULTS ===
export interface SearchResult {
  id: string;
  title: string;
  year: number;
  fwci: number;
  citations: number;
  countries: string[];
  abstract?: string;
}

export interface SearchResultsArtifact {
  type: 'search_results';
  query: string;
  results: SearchResult[];
  totalFound: number;
  filters?: {
    years?: number[];
    countries?: string[];
    minFwci?: number;
  };
}

// === CLUSTER INSIGHT ===
export interface ClusterInsightArtifact {
  type: 'cluster_insight';
  clusterId: string;
  clusterLabel: string;
  technicalBrief: string;
  stats: {
    paperCount: number;
    avgCitations: number;
    avgFwci: number;
    yearRange: [number, number];
  };
  geoDistribution: { country: string; percentage: number }[];
  topPapers: {
    id: string;
    title: string;
    year: number;
    citations: number;
  }[];
}

// === PROGRESS ===
export interface ProgressStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'complete' | 'error';
  detail?: string;
}

export interface ProgressArtifact {
  type: 'progress';
  steps: ProgressStep[];
  currentStep: string;
  query?: string;
  focus?: string;
  regions?: string[];
  searchQueries?: { query: string; priority: 'high' | 'medium' | 'low' }[];
}

// Union type for all artifacts
export type ChatArtifact = 
  | MapPointsArtifact 
  | SchemaArtifact 
  | ExtractionArtifact 
  | TopologyArtifact 
  | ReportArtifact 
  | ToolCallArtifact 
  | SearchResultsArtifact 
  | ClusterInsightArtifact
  | ProgressArtifact;

// Structured message format
export interface StructuredMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
  // Text sections
  header?: string; // 1-2 sentence summary
  body?: string; // markdown content
  footer?: { label: string; action?: string }[]; // next steps
  // Rich artifacts
  artifacts?: ChatArtifact[];
  // Metadata
  isStreaming?: boolean;
  isThinking?: boolean;
}
