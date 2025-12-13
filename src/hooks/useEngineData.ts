/**
 * useEngineData - Adapter hook for Morphik Intelligence Engine
 *
 * Connects to Engine API and converts output to Lovable UI format (DataNode)
 */

import { useState, useCallback, useRef } from 'react';
import { DataNode, DimensionValue } from '@/types/morphik';

// Engine API types
interface EnginePaper {
  id: number;
  title: string;
  year: number;
  country: string;
  umap_x: number;
  umap_y: number;
  cluster_id: number;
  cluster_label: string;
  // Extended fields (if available from hydrated data)
  authors?: string[];
  abstract?: string;
}

interface DimensionFinding {
  paper_id: number;
  dimension_name: string;
  value: string;
  raw_quote?: string;
  confidence: number;
  is_direct: boolean;
}

interface ResearchSchema {
  dimensions: Array<{
    name: string;
    description: string;
    data_type: string;
  }>;
  query_type: string;
  rationale: string;
}

interface EngineTopology {
  divergence_level: 'critical' | 'high' | 'medium' | 'low';
  divergence_score: number;
  insight_text: string;
  cluster_distribution: Record<string, number>;
  region_distribution: Record<string, number>;
}

interface EngineReport {
  title: string;
  executive_summary: string;
  markdown: string;
  total_papers_analyzed: number;
}

type EnginePhase = 'idle' | 'planning' | 'retrieval' | 'schema_design' | 'extraction' | 'topology' | 'synthesis' | 'complete' | 'error';

interface EngineState {
  phase: EnginePhase;
  papers: DataNode[];
  dimensions: string[];
  topology: EngineTopology | null;
  report: EngineReport | null;
  error: string | null;
}

// Configuration
const ENGINE_API_BASE = import.meta.env.VITE_ENGINE_API_URL || 'http://135.181.106.12:8787';

// Convert country string to union type
function normalizeCountry(country: string): 'china' | 'usa' | 'europe' | 'other' {
  const c = country.toLowerCase();
  if (c === 'china' || c === 'cn') return 'china';
  if (c === 'usa' || c === 'us' || c === 'united states') return 'usa';
  if (c === 'europe' || c === 'eu' || c === 'germany' || c === 'france' || c === 'uk') return 'europe';
  return 'other';
}

// Convert EnginePaper + DimensionFindings → DataNode
function convertToDataNode(
  paper: EnginePaper,
  findings: DimensionFinding[],
  schema: ResearchSchema | null
): DataNode {
  // Build dimensions map from findings
  const dimensions: Record<string, DimensionValue> = {};

  const paperFindings = findings.filter(f => f.paper_id === paper.id);
  for (const finding of paperFindings) {
    dimensions[finding.dimension_name] = {
      value: finding.value,
      confidence: finding.confidence >= 0.8 ? 'high' : finding.confidence >= 0.5 ? 'med' : 'low',
      source_snippet: finding.raw_quote,
    };
  }

  // Calculate score based on findings confidence
  const avgConfidence = paperFindings.length > 0
    ? paperFindings.reduce((sum, f) => sum + f.confidence, 0) / paperFindings.length
    : 0.5;

  return {
    id: `paper-${paper.id}`,
    title: paper.title,
    umap_x: paper.umap_x,
    umap_y: paper.umap_y,
    cluster_label: paper.cluster_label,
    country: normalizeCountry(paper.country),
    score: avgConfidence,
    year: paper.year,
    authors: paper.authors || ['Unknown'],
    abstract: paper.abstract || dimensions['Key Findings']?.value || '',
    citations: 0, // Not available from Engine
    dimensions,
  };
}

// Main hook
export function useEngineData() {
  const [state, setState] = useState<EngineState>({
    phase: 'idle',
    papers: [],
    dimensions: [],
    topology: null,
    report: null,
    error: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState('');
  const abortControllerRef = useRef<AbortController | null>(null);

  const analyze = useCallback(async (query: string) => {
    setIsLoading(true);
    setState(prev => ({ ...prev, phase: 'planning', error: null }));

    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Temporary storage during streaming
    let papers: EnginePaper[] = [];
    let findings: DimensionFinding[] = [];
    let schema: ResearchSchema | null = null;

    try {
      const response = await fetch(`${ENGINE_API_BASE}/api/engine/research`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          user_id: 'lovable-ui',
          max_papers: 15,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Engine error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const event = JSON.parse(line.slice(6));

                switch (event.type) {
                  case 'start':
                    setState(prev => ({ ...prev, phase: 'planning' }));
                    break;

                  case 'plan':
                    setState(prev => ({ ...prev, phase: 'retrieval' }));
                    break;

                  case 'papers':
                    papers = event.data.papers || [];
                    setState(prev => ({ ...prev, phase: 'schema_design' }));
                    break;

                  case 'schema':
                    schema = event.data;
                    const dimensionNames = schema?.dimensions.map(d => d.name) || [];
                    setState(prev => ({
                      ...prev,
                      phase: 'extraction',
                      dimensions: dimensionNames,
                    }));
                    break;

                  case 'extraction':
                    findings = event.data.dimension_findings || event.data.facts || [];
                    // Convert to DataNode format
                    const dataNodes = papers.map(p => convertToDataNode(p, findings, schema));
                    setState(prev => ({
                      ...prev,
                      phase: 'topology',
                      papers: dataNodes,
                    }));
                    break;

                  case 'topology':
                    setState(prev => ({
                      ...prev,
                      phase: 'synthesis',
                      topology: event.data,
                    }));
                    break;

                  case 'report':
                    setState(prev => ({
                      ...prev,
                      phase: 'complete',
                      report: event.data,
                    }));
                    break;

                  case 'done':
                    setState(prev => ({ ...prev, phase: 'complete' }));
                    break;

                  case 'error':
                    setState(prev => ({
                      ...prev,
                      phase: 'error',
                      error: event.data?.message || 'Unknown error',
                    }));
                    break;
                }
              } catch (e) {
                console.error('Failed to parse SSE event:', e);
              }
            }
          }
        }
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Engine error:', error);
        setState(prev => ({
          ...prev,
          phase: 'error',
          error: (error as Error).message,
        }));
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, []);

  const handleSubmit = useCallback((e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;
    analyze(input);
    setInput('');
  }, [input, analyze]);

  const stop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsLoading(false);
  }, []);

  return {
    // State
    phase: state.phase,
    papers: state.papers,
    dimensions: state.dimensions,
    topology: state.topology,
    report: state.report,
    error: state.error,
    isLoading,

    // Input
    input,
    setInput,

    // Actions
    analyze,
    handleSubmit,
    stop,
  };
}

export default useEngineData;