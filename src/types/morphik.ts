// Morphik Intelligence Cockpit Types

export interface DataNode {
  id: string;
  title: string;
  umap_x: number;
  umap_y: number;
  cluster_label: string;
  country: 'china' | 'usa' | 'europe' | 'other';
  score: number;
  year: number;
  authors: string[];
  abstract: string;
  citations: number;
  dimensions: Record<string, DimensionValue>;
}

export interface DimensionValue {
  value: string;
  confidence: 'high' | 'med' | 'low';
  source_snippet?: string;
}

export interface DataEdge {
  source_id: string;
  target_id: string;
  weight: number;
}

export interface PipelineStage {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'complete' | 'error';
  progress?: number;
}

export interface QueryTag {
  label: string;
  type: 'domain' | 'method' | 'material' | 'region';
}

export interface AnalysisSession {
  id: string;
  title: string;
  timestamp: Date;
  query: string;
  status: 'active' | 'complete' | 'archived';
}

export interface DivergenceMetric {
  cluster_a: string;
  cluster_b: string;
  score: number; // 0-1
  trend: 'increasing' | 'stable' | 'decreasing';
}

export interface Citation {
  id: string;
  text: string;
  paper_id: string;
}
