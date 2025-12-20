// Papers Screening Types

// Dynamic dimensions from Schema Designer
export interface DynamicDimension {
  name: string;
  status: 'pass' | 'fail' | 'partial';
}

// Core metrics for paper scoring
export interface PaperMetrics {
  similarity: number;      // 0-1, semantic similarity via SPECTER2
  citations: number;       // Raw citation count
  fwci: number;           // Field Weighted Citation Index
  recency: number;        // 0-1, based on publication year
}

export interface PaperScreening {
  verdict: 'include' | 'exclude';
  combinedScore: number;   // 0-100, weighted combination of metrics
  relevanceScore: 'high' | 'medium' | 'low';  // LLM evaluation
  aspectTag: string;       // Category badge e.g. "Manufacturing"
  rationale: string;
  metrics: PaperMetrics;
  dimensions: DynamicDimension[];  // Dynamic dimensions from Schema Designer
}

export interface PaperWithScreening {
  id: string;
  title: string;
  authors: string[];
  year: number;
  abstract: string;
  citations: number;
  country: 'china' | 'usa' | 'europe' | 'other';
  screening: PaperScreening;
}

export type ReportView = 'report' | 'papers' | 'topology' | 'timeline' | 'notes';
