/**
 * ArtifactsDemo - демонстрация всех типов артефактов для чата
 * 
 * Используй этот файл как референс для Claude:
 * - Все типы артефактов
 * - Структуры данных
 * - Примеры использования
 */

import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MarkdownRenderer } from './MarkdownRenderer';
import { ArtifactRenderer } from './artifacts/ArtifactRenderer';
import { AgentRibbon } from './artifacts/ToolCallCard';
import { ReportFullscreen } from './artifacts/ReportArtifact';
import type { 
  StructuredMessage, 
  ProgressArtifact,
  MapPointsArtifact,
  SchemaArtifact,
  ExtractionArtifact,
  TopologyArtifact,
  ReportArtifact,
  ToolCallArtifact,
  SearchResultsArtifact,
  ClusterInsightArtifact
} from './artifacts/types';

// === MOCK DATA ===

const mockProgress: ProgressArtifact = {
  type: 'progress',
  steps: [
    { id: 'plan', name: 'Planning', status: 'complete', detail: 'Query analyzed' },
    { id: 'map', name: 'Map Points', status: 'complete', detail: '1,247 papers' },
    { id: 'extract', name: 'Extraction', status: 'running', detail: '85% complete' },
    { id: 'topology', name: 'Topology', status: 'pending' },
    { id: 'report', name: 'Report', status: 'pending' },
  ],
  currentStep: 'extract',
  query: 'Solid-state batteries: China vs USA innovation',
  focus: 'Technology comparison',
  regions: ['China', 'USA', 'Europe'],
  searchQueries: [
    { query: 'solid state battery electrolyte', priority: 'high' },
    { query: 'lithium ion solid electrolyte', priority: 'high' },
    { query: 'all-solid-state battery manufacturing', priority: 'medium' },
  ],
};

const mockMapPoints: MapPointsArtifact = {
  type: 'map_points',
  totalPapers: 1247,
  clusters: [
    {
      id: 'c1',
      name: 'Polymer Electrolytes',
      paperCount: 342,
      growth: 23,
      color: '#FF5A7F',
      topRegions: [
        { name: 'China', count: 156 },
        { name: 'USA', count: 89 },
        { name: 'Japan', count: 45 },
      ],
      topMetrics: [
        { label: 'Avg FWCI', value: '2.3' },
        { label: 'Avg Cites', value: '45' },
        { label: 'Hot Topics', value: '12' },
        { label: 'Patents', value: '89' },
      ],
    },
    {
      id: 'c2',
      name: 'Oxide Ceramics',
      paperCount: 287,
      growth: 15,
      color: '#4DC4C4',
      topRegions: [
        { name: 'Japan', count: 98 },
        { name: 'Korea', count: 76 },
        { name: 'Germany', count: 54 },
      ],
      topMetrics: [
        { label: 'Avg FWCI', value: '3.1' },
        { label: 'Avg Cites', value: '67' },
        { label: 'Hot Topics', value: '8' },
        { label: 'Patents', value: '134' },
      ],
    },
    {
      id: 'c3',
      name: 'Sulfide Glass',
      paperCount: 198,
      growth: 45,
      color: '#E8C547',
      topRegions: [
        { name: 'Korea', count: 67 },
        { name: 'USA', count: 54 },
        { name: 'China', count: 43 },
      ],
      topMetrics: [
        { label: 'Avg FWCI', value: '4.2' },
        { label: 'Avg Cites', value: '89' },
        { label: 'Hot Topics', value: '15' },
        { label: 'Patents', value: '67' },
      ],
    },
    {
      id: 'c4',
      name: 'Hybrid Systems',
      paperCount: 156,
      growth: -5,
      color: '#6BA8DC',
      topRegions: [
        { name: 'USA', count: 56 },
        { name: 'Germany', count: 43 },
        { name: 'UK', count: 32 },
      ],
      topMetrics: [
        { label: 'Avg FWCI', value: '1.8' },
        { label: 'Avg Cites', value: '32' },
        { label: 'Hot Topics', value: '5' },
        { label: 'Patents', value: '45' },
      ],
    },
  ],
  yearDistribution: [
    { year: 2019, count: 156 },
    { year: 2020, count: 198 },
    { year: 2021, count: 245 },
    { year: 2022, count: 312 },
    { year: 2023, count: 336 },
  ],
  countryDistribution: [
    { country: 'China', count: 423 },
    { country: 'USA', count: 287 },
    { country: 'Japan', count: 198 },
    { country: 'Korea', count: 156 },
    { country: 'Germany', count: 89 },
  ],
};

const mockSchema: SchemaArtifact = {
  type: 'schema',
  title: 'How We Will Analyze',
  queryType: 'Technology Comparison',
  rationale: 'Comparing solid-state battery technologies between regions requires extracting specific technical parameters, manufacturing readiness levels, and innovation metrics to identify competitive advantages.',
  isEditable: true,
  dimensions: [
    {
      id: 'd1',
      name: 'Ionic Conductivity',
      description: 'Measured conductivity of the electrolyte material at room temperature',
      dataType: 'number',
      examples: ['1e-3 S/cm', '5e-4 S/cm'],
    },
    {
      id: 'd2',
      name: 'Electrolyte Type',
      description: 'Classification of the solid electrolyte material',
      dataType: 'enum',
      examples: ['Polymer', 'Oxide', 'Sulfide', 'Hybrid'],
    },
    {
      id: 'd3',
      name: 'Manufacturing TRL',
      description: 'Technology Readiness Level for manufacturing process',
      dataType: 'number',
      examples: ['TRL 4', 'TRL 7'],
    },
    {
      id: 'd4',
      name: 'Cycle Stability',
      description: 'Number of charge-discharge cycles before capacity degradation',
      dataType: 'number',
      examples: ['1000 cycles', '500 cycles'],
    },
    {
      id: 'd5',
      name: 'Commercial Viability',
      description: 'Assessment of commercial readiness',
      dataType: 'boolean',
      examples: ['Yes', 'No'],
    },
  ],
};

const mockExtraction: ExtractionArtifact = {
  type: 'extraction',
  totalFacts: 2847,
  facts: [
    {
      id: 'f1',
      paperId: 'p1',
      paperTitle: 'High-Performance Polymer Electrolytes for All-Solid-State Batteries',
      dimension: 'Ionic Conductivity',
      value: '1.2×10⁻³ S/cm at 25°C',
      confidence: 'high',
      region: 'China',
      rawQuote: 'The composite electrolyte achieved ionic conductivity of 1.2×10⁻³ S/cm...',
    },
    {
      id: 'f2',
      paperId: 'p2',
      paperTitle: 'Sulfide-Based Solid Electrolytes: A Review',
      dimension: 'Electrolyte Type',
      value: 'Li₆PS₅Cl (Argyrodite)',
      confidence: 'high',
      region: 'Japan',
    },
    {
      id: 'f3',
      paperId: 'p3',
      paperTitle: 'Manufacturing Challenges in Solid-State Battery Production',
      dimension: 'Manufacturing TRL',
      value: 'TRL 5 - Technology validated in relevant environment',
      confidence: 'medium',
      region: 'USA',
    },
    {
      id: 'f4',
      paperId: 'p4',
      paperTitle: 'Long-term Cycling Stability of Oxide Electrolytes',
      dimension: 'Cycle Stability',
      value: '1200 cycles at 80% capacity retention',
      confidence: 'high',
      region: 'Korea',
    },
    {
      id: 'f5',
      paperId: 'p5',
      paperTitle: 'Cost Analysis of Solid-State Battery Manufacturing',
      dimension: 'Commercial Viability',
      value: 'Expected commercial viability by 2027',
      confidence: 'low',
      region: 'Germany',
    },
  ],
  byDimension: [
    { dimension: 'Ionic Conductivity', count: 456 },
    { dimension: 'Electrolyte Type', count: 823 },
    { dimension: 'Manufacturing TRL', count: 312 },
    { dimension: 'Cycle Stability', count: 567 },
    { dimension: 'Commercial Viability', count: 189 },
  ],
  byConfidence: [
    { level: 'high', count: 1423 },
    { level: 'medium', count: 987 },
    { level: 'low', count: 437 },
  ],
};

const mockTopology: TopologyArtifact = {
  type: 'topology',
  insightText: 'Analysis reveals significant divergence between Asian (China, Japan, Korea) and Western (USA, Europe) research approaches. Asian research focuses on sulfide-based electrolytes with higher conductivity, while Western research emphasizes oxide ceramics for safety.',
  divergenceScore: 0.73,
  divergenceLevel: 'high',
  totalNodes: 1247,
  totalEdges: 8934,
  clusters: [
    { id: 'c1', label: 'Polymer Electrolytes', nodeCount: 342, centroid: { x: 20, y: 30 } },
    { id: 'c2', label: 'Oxide Ceramics', nodeCount: 287, centroid: { x: 60, y: 25 } },
    { id: 'c3', label: 'Sulfide Glass', nodeCount: 198, centroid: { x: 45, y: 55 } },
    { id: 'c4', label: 'Hybrid Systems', nodeCount: 156, centroid: { x: 75, y: 50 } },
  ],
  bridges: [
    {
      id: 'b1',
      title: 'Hybrid Polymer-Ceramic Electrolytes: Bridging the Gap',
      clusters: ['Polymer Electrolytes', 'Oxide Ceramics'],
    },
    {
      id: 'b2',
      title: 'Sulfide-Oxide Composite Solid Electrolytes',
      clusters: ['Sulfide Glass', 'Oxide Ceramics'],
    },
    {
      id: 'b3',
      title: 'Multi-layer Electrolyte Architectures for Enhanced Performance',
      clusters: ['Polymer Electrolytes', 'Sulfide Glass', 'Hybrid Systems'],
    },
  ],
};

const mockReport: ReportArtifact = {
  type: 'report',
  title: 'Strategic Analysis: Solid-State Battery Innovation Landscape',
  lead: 'Comprehensive analysis of 1,247 research papers reveals significant regional divergence in solid-state battery development, with China leading in polymer electrolytes while Japan and Korea dominate sulfide-based systems.',
  abstract: 'This report synthesizes findings from major research clusters in solid-state battery technology, identifying key innovation patterns, competitive dynamics, and strategic implications for industry stakeholders.',
  markdown: `## Executive Summary

The global solid-state battery research landscape is characterized by distinct regional specializations and divergent technological approaches.

### Key Findings

1. **China** leads in polymer electrolyte research with 34% of global publications
2. **Japan and Korea** dominate sulfide-based systems with 45% market share
3. **USA and Europe** focus on oxide ceramics for enhanced safety profiles

### Technology Readiness Assessment

| Technology | TRL | Leading Region | Key Challenge |
|------------|-----|----------------|---------------|
| Polymer Electrolytes | 6 | China | Conductivity |
| Sulfide Glass | 5 | Japan | Air Stability |
| Oxide Ceramics | 4 | USA | Interface Resistance |

### Strategic Implications

> "The divergence in research approaches creates opportunities for technology licensing and cross-regional partnerships."

**Recommendations:**
1. Monitor sulfide electrolyte developments from Toyota and Samsung SDI
2. Evaluate polymer-ceramic hybrid approaches for near-term applications
3. Invest in interface engineering R&D for oxide systems`,
  hasTLDR: true,
  sources: [
    { id: 's1', title: 'High-Performance Polymer Electrolytes for All-Solid-State Batteries', year: 2023, citations: 156 },
    { id: 's2', title: 'Sulfide-Based Solid Electrolytes: A Comprehensive Review', year: 2023, citations: 234 },
    { id: 's3', title: 'Manufacturing Challenges in Solid-State Battery Production', year: 2022, citations: 89 },
    { id: 's4', title: 'Oxide Ceramic Electrolytes: Safety and Performance Trade-offs', year: 2023, citations: 112 },
  ],
  parameters: {
    query: 'Solid-state batteries: China vs USA innovation',
    totalPapers: 1247,
    dimensions: ['Ionic Conductivity', 'Electrolyte Type', 'Manufacturing TRL', 'Cycle Stability'],
    regions: ['China', 'USA', 'Japan', 'Korea', 'Europe'],
  },
};

const mockToolCalls: ToolCallArtifact[] = [
  {
    type: 'tool_call',
    toolName: 'semantic_search',
    status: 'complete',
    output: {
      summary: 'Found 1,247 papers matching query',
      count: 1247,
    },
  },
  {
    type: 'tool_call',
    toolName: 'cluster_analysis',
    status: 'complete',
    output: {
      summary: 'Identified 4 major research clusters',
      count: 4,
    },
  },
  {
    type: 'tool_call',
    toolName: 'paper_extraction',
    status: 'running',
  },
  {
    type: 'tool_call',
    toolName: 'topology_build',
    status: 'pending',
  },
];

const mockSearchResults: SearchResultsArtifact = {
  type: 'search_results',
  query: 'solid state battery electrolyte conductivity',
  totalFound: 423,
  results: [
    {
      id: 'r1',
      title: 'Ultra-High Ionic Conductivity in Sulfide Solid Electrolytes',
      year: 2023,
      fwci: 4.2,
      citations: 156,
      countries: ['Japan', 'Korea'],
    },
    {
      id: 'r2',
      title: 'Polymer-Ceramic Composite Electrolytes for Safe Batteries',
      year: 2023,
      fwci: 3.1,
      citations: 89,
      countries: ['China', 'USA'],
    },
    {
      id: 'r3',
      title: 'Room-Temperature Lithium Superionic Conductors',
      year: 2022,
      fwci: 5.8,
      citations: 234,
      countries: ['Germany'],
    },
    {
      id: 'r4',
      title: 'Garnet-Type Oxide Electrolytes: Progress and Challenges',
      year: 2023,
      fwci: 2.7,
      citations: 67,
      countries: ['USA', 'UK'],
    },
    {
      id: 'r5',
      title: 'All-Solid-State Batteries: From Laboratory to Production',
      year: 2022,
      fwci: 3.9,
      citations: 178,
      countries: ['China', 'Japan'],
    },
  ],
};

const mockClusterInsight: ClusterInsightArtifact = {
  type: 'cluster_insight',
  clusterId: 'c3',
  clusterLabel: 'Sulfide Glass Electrolytes',
  technicalBrief: 'Sulfide-based solid electrolytes represent the highest-performing class of solid-state battery materials, achieving ionic conductivities comparable to liquid electrolytes. Key materials include Li₆PS₅Cl (argyrodite) and Li₁₀GeP₂S₁₂ (LGPS). Major challenges include air stability and interface compatibility with cathode materials.',
  stats: {
    paperCount: 198,
    avgCitations: 89,
    avgFwci: 4.2,
    yearRange: [2018, 2024],
  },
  geoDistribution: [
    { country: 'Japan', percentage: 34 },
    { country: 'Korea', percentage: 28 },
    { country: 'China', percentage: 22 },
    { country: 'USA', percentage: 10 },
    { country: 'Germany', percentage: 6 },
  ],
  topPapers: [
    { id: 'tp1', title: 'Ultra-High Ionic Conductivity in Sulfide Solid Electrolytes', year: 2023, citations: 156 },
    { id: 'tp2', title: 'Air-Stable Sulfide Electrolytes via Surface Modification', year: 2023, citations: 112 },
    { id: 'tp3', title: 'Interface Engineering for Sulfide-Cathode Compatibility', year: 2022, citations: 98 },
  ],
};

// === DEMO COMPONENT ===

export function ArtifactsDemo() {
  const [showRibbon, setShowRibbon] = useState(false);
  const [showFullReport, setShowFullReport] = useState(false);

  return (
    <div className="h-full bg-background">
      <ScrollArea className="h-full">
        <div className="max-w-4xl mx-auto p-6 space-y-8">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">Chat Artifacts Demo</h1>
            <p className="text-sm text-muted-foreground">
              Демонстрация всех типов rich-компонентов для AI-ответов
            </p>
          </div>

          <Tabs defaultValue="progress" className="space-y-4">
            <TabsList className="flex flex-wrap h-auto gap-1">
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="map">Map Points</TabsTrigger>
              <TabsTrigger value="schema">Schema</TabsTrigger>
              <TabsTrigger value="extraction">Extraction</TabsTrigger>
              <TabsTrigger value="topology">Topology</TabsTrigger>
              <TabsTrigger value="report">Report</TabsTrigger>
              <TabsTrigger value="tools">Tool Calls</TabsTrigger>
              <TabsTrigger value="search">Search Results</TabsTrigger>
              <TabsTrigger value="cluster">Cluster Insight</TabsTrigger>
            </TabsList>

            <TabsContent value="progress" className="space-y-4">
              <h2 className="text-lg font-semibold">Progress Panel</h2>
              <p className="text-sm text-muted-foreground">
                Sticky-панель прогресса исследования с шагами, query info и search queries
              </p>
              <ArtifactRenderer artifact={mockProgress} />
            </TabsContent>

            <TabsContent value="map" className="space-y-4">
              <h2 className="text-lg font-semibold">Map Points</h2>
              <p className="text-sm text-muted-foreground">
                Интерактивная карта с кластерами, мини-чартами по годам и странам
              </p>
              <ArtifactRenderer artifact={mockMapPoints} />
            </TabsContent>

            <TabsContent value="schema" className="space-y-4">
              <h2 className="text-lg font-semibold">Schema Card</h2>
              <p className="text-sm text-muted-foreground">
                Редактируемая форма с dimension-чипсами
              </p>
              <ArtifactRenderer artifact={mockSchema} />
            </TabsContent>

            <TabsContent value="extraction" className="space-y-4">
              <h2 className="text-lg font-semibold">Extraction Table</h2>
              <p className="text-sm text-muted-foreground">
                Таблица фактов с фильтрами и pivot-видом по измерениям
              </p>
              <ArtifactRenderer artifact={mockExtraction} />
            </TabsContent>

            <TabsContent value="topology" className="space-y-4">
              <h2 className="text-lg font-semibold">Topology Card</h2>
              <p className="text-sm text-muted-foreground">
                Граф-вид с insight, divergence meter и bridge papers
              </p>
              <ArtifactRenderer artifact={mockTopology} />
            </TabsContent>

            <TabsContent value="report" className="space-y-4">
              <h2 className="text-lg font-semibold">Report Artifact</h2>
              <p className="text-sm text-muted-foreground">
                Документ-режим с TL;DR/Full переключателем и боковой панелью
              </p>
              <ArtifactRenderer 
                artifact={mockReport} 
                onExpand={() => setShowFullReport(true)}
              />
            </TabsContent>

            <TabsContent value="tools" className="space-y-4">
              <h2 className="text-lg font-semibold">Tool Calls</h2>
              <p className="text-sm text-muted-foreground">
                Карточки инструментов агента и боковая лента действий
              </p>
              <div className="space-y-2">
                {mockToolCalls.map((tool, i) => (
                  <ArtifactRenderer key={i} artifact={tool} />
                ))}
              </div>
              <button 
                onClick={() => setShowRibbon(!showRibbon)}
                className="text-xs text-primary underline"
              >
                Toggle Agent Ribbon
              </button>
            </TabsContent>

            <TabsContent value="search" className="space-y-4">
              <h2 className="text-lg font-semibold">Search Results</h2>
              <p className="text-sm text-muted-foreground">
                Conversational dashboard с карточками, чартами и фильтрами
              </p>
              <ArtifactRenderer artifact={mockSearchResults} />
            </TabsContent>

            <TabsContent value="cluster" className="space-y-4">
              <h2 className="text-lg font-semibold">Cluster Insight</h2>
              <p className="text-sm text-muted-foreground">
                Insight card с technical brief, stats и top papers
              </p>
              <ArtifactRenderer artifact={mockClusterInsight} />
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>

      {/* Agent Ribbon */}
      {showRibbon && (
        <AgentRibbon 
          calls={mockToolCalls} 
          isExpanded={showRibbon}
          onToggle={() => setShowRibbon(false)}
        />
      )}

      {/* Fullscreen Report */}
      {showFullReport && (
        <ReportFullscreen 
          data={mockReport}
          onClose={() => setShowFullReport(false)}
        />
      )}
    </div>
  );
}
