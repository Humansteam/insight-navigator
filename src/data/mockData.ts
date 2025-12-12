import { DataNode, DataEdge, PipelineStage, QueryTag, AnalysisSession, DivergenceMetric } from '@/types/morphik';

export const mockPipelineStages: PipelineStage[] = [
  { id: 'planner', name: 'Planner', status: 'complete', progress: 100 },
  { id: 'retriever', name: 'Retriever', status: 'complete', progress: 100 },
  { id: 'extractor', name: 'Extractor', status: 'running', progress: 67 },
  { id: 'topology', name: 'Topology', status: 'pending' },
  { id: 'writer', name: 'Writer', status: 'pending' },
];

export const mockQueryTags: QueryTag[] = [
  { label: 'Materials Science', type: 'domain' },
  { label: 'Perovskite Solar Cells', type: 'material' },
  { label: 'Geopolitics', type: 'region' },
  { label: 'Synthesis Methods', type: 'method' },
];

export const mockDimensions = ['Temperature', 'Yield', 'Efficiency', 'Cost', 'Stability'];

export const mockNodes: DataNode[] = [
  {
    id: 'paper-001',
    title: 'High-Efficiency Perovskite Solar Cells via Sequential Deposition',
    umap_x: 0.25,
    umap_y: 0.72,
    cluster_label: 'Synthesis Methods',
    country: 'china',
    score: 0.94,
    year: 2023,
    authors: ['Zhang, W.', 'Liu, H.', 'Chen, X.'],
    abstract: 'We demonstrate a novel sequential deposition method for high-efficiency perovskite solar cells achieving 25.7% power conversion efficiency under standard test conditions.',
    citations: 187,
    dimensions: {
      'Temperature': { value: '150°C', confidence: 'high' },
      'Yield': { value: '95%', confidence: 'high' },
      'Efficiency': { value: '25.7%', confidence: 'high' },
      'Cost': { value: '$0.25/W', confidence: 'med' },
      'Stability': { value: '1000h @ 85°C', confidence: 'high' },
    },
  },
  {
    id: 'paper-002',
    title: 'Scalable Manufacturing of Tandem Solar Modules',
    umap_x: 0.31,
    umap_y: 0.68,
    cluster_label: 'Manufacturing',
    country: 'china',
    score: 0.89,
    year: 2024,
    authors: ['Wang, L.', 'Li, M.'],
    abstract: 'This work presents a roll-to-roll manufacturing process for perovskite-silicon tandem modules with 28.3% efficiency.',
    citations: 64,
    dimensions: {
      'Temperature': { value: '120°C', confidence: 'high' },
      'Yield': { value: '87%', confidence: 'med' },
      'Efficiency': { value: '28.3%', confidence: 'high' },
      'Cost': { value: '$0.18/W', confidence: 'low' },
      'Stability': { value: '500h @ 85°C', confidence: 'med' },
    },
  },
  {
    id: 'paper-003',
    title: 'Interface Engineering for Enhanced Carrier Transport',
    umap_x: 0.72,
    umap_y: 0.45,
    cluster_label: 'Interface Studies',
    country: 'usa',
    score: 0.91,
    year: 2023,
    authors: ['Smith, J.', 'Johnson, R.', 'Williams, K.'],
    abstract: 'We report on interface engineering strategies that significantly enhance carrier transport in perovskite solar cells.',
    citations: 142,
    dimensions: {
      'Temperature': { value: '100°C', confidence: 'high' },
      'Yield': { value: '92%', confidence: 'high' },
      'Efficiency': { value: '24.8%', confidence: 'high' },
      'Cost': { value: '$0.32/W', confidence: 'med' },
      'Stability': { value: '2000h @ 65°C', confidence: 'high' },
    },
  },
  {
    id: 'paper-004',
    title: 'Mixed-Halide Perovskites for Bandgap Tuning',
    umap_x: 0.68,
    umap_y: 0.52,
    cluster_label: 'Material Design',
    country: 'usa',
    score: 0.87,
    year: 2024,
    authors: ['Davis, M.', 'Brown, A.'],
    abstract: 'Investigation of mixed-halide compositions for precise bandgap engineering in perovskite absorbers.',
    citations: 89,
    dimensions: {
      'Temperature': { value: '180°C', confidence: 'med' },
      'Yield': { value: '78%', confidence: 'low' },
      'Efficiency': { value: '23.1%', confidence: 'high' },
      'Cost': { value: '$0.45/W', confidence: 'low' },
      'Stability': { value: '800h @ 85°C', confidence: 'med' },
    },
  },
  {
    id: 'paper-005',
    title: 'Lead-Free Perovskite Alternatives: Tin-Based Systems',
    umap_x: 0.45,
    umap_y: 0.28,
    cluster_label: 'Alternative Materials',
    country: 'europe',
    score: 0.82,
    year: 2023,
    authors: ['Müller, S.', 'Schmidt, T.', 'Weber, F.'],
    abstract: 'Comprehensive study on tin-based perovskite alternatives for environmentally sustainable photovoltaics.',
    citations: 112,
    dimensions: {
      'Temperature': { value: '90°C', confidence: 'high' },
      'Yield': { value: '72%', confidence: 'med' },
      'Efficiency': { value: '14.2%', confidence: 'high' },
      'Cost': { value: '$0.55/W', confidence: 'med' },
      'Stability': { value: '300h @ 65°C', confidence: 'high' },
    },
  },
  {
    id: 'paper-006',
    title: 'Defect Passivation Using 2D/3D Heterostructures',
    umap_x: 0.52,
    umap_y: 0.35,
    cluster_label: 'Defect Engineering',
    country: 'europe',
    score: 0.93,
    year: 2024,
    authors: ['García, P.', 'Martin, C.'],
    abstract: 'Novel 2D/3D heterostructure approach for effective defect passivation in high-efficiency devices.',
    citations: 156,
    dimensions: {
      'Temperature': { value: '110°C', confidence: 'high' },
      'Yield': { value: '91%', confidence: 'high' },
      'Efficiency': { value: '26.1%', confidence: 'high' },
      'Cost': { value: '$0.28/W', confidence: 'high' },
      'Stability': { value: '1500h @ 85°C', confidence: 'high' },
    },
  },
  {
    id: 'paper-007',
    title: 'Accelerated Stability Testing Protocols',
    umap_x: 0.15,
    umap_y: 0.55,
    cluster_label: 'Testing Methods',
    country: 'china',
    score: 0.78,
    year: 2023,
    authors: ['Zhao, Y.', 'Yang, J.'],
    abstract: 'Standardized accelerated testing protocols for predicting long-term stability of perovskite modules.',
    citations: 78,
    dimensions: {
      'Temperature': { value: '85°C', confidence: 'high' },
      'Yield': { value: 'N/A', confidence: 'low' },
      'Efficiency': { value: 'N/A', confidence: 'low' },
      'Cost': { value: 'N/A', confidence: 'low' },
      'Stability': { value: '5000h protocol', confidence: 'high' },
    },
  },
  {
    id: 'paper-008',
    title: 'Machine Learning for Process Optimization',
    umap_x: 0.82,
    umap_y: 0.75,
    cluster_label: 'AI/ML Methods',
    country: 'usa',
    score: 0.86,
    year: 2024,
    authors: ['Anderson, T.', 'Lee, S.'],
    abstract: 'Application of machine learning algorithms for optimizing perovskite deposition parameters.',
    citations: 95,
    dimensions: {
      'Temperature': { value: '140°C (optimal)', confidence: 'high' },
      'Yield': { value: '89%', confidence: 'med' },
      'Efficiency': { value: '24.5%', confidence: 'high' },
      'Cost': { value: '$0.22/W', confidence: 'med' },
      'Stability': { value: '1200h @ 85°C', confidence: 'med' },
    },
  },
];

export const mockEdges: DataEdge[] = [
  { source_id: 'paper-001', target_id: 'paper-002', weight: 0.85 },
  { source_id: 'paper-001', target_id: 'paper-007', weight: 0.62 },
  { source_id: 'paper-002', target_id: 'paper-007', weight: 0.71 },
  { source_id: 'paper-003', target_id: 'paper-004', weight: 0.78 },
  { source_id: 'paper-003', target_id: 'paper-008', weight: 0.65 },
  { source_id: 'paper-004', target_id: 'paper-005', weight: 0.55 },
  { source_id: 'paper-005', target_id: 'paper-006', weight: 0.82 },
  { source_id: 'paper-006', target_id: 'paper-003', weight: 0.68 },
  { source_id: 'paper-008', target_id: 'paper-001', weight: 0.59 },
];

export const mockSessions: AnalysisSession[] = [
  { id: 'sess-001', title: 'Perovskite Solar Cell Analysis', timestamp: new Date('2024-12-12T10:30:00'), query: 'Compare perovskite synthesis methods by country', status: 'active' },
  { id: 'sess-002', title: 'Battery Technology Landscape', timestamp: new Date('2024-12-11T15:20:00'), query: 'Solid-state battery developments', status: 'complete' },
  { id: 'sess-003', title: 'Quantum Computing Materials', timestamp: new Date('2024-12-10T09:15:00'), query: 'Superconducting materials for qubits', status: 'complete' },
  { id: 'sess-004', title: 'Carbon Capture Methods', timestamp: new Date('2024-12-08T14:00:00'), query: 'DAC technology comparison', status: 'archived' },
];

export const mockDivergence: DivergenceMetric = {
  cluster_a: 'China',
  cluster_b: 'USA',
  score: 0.73,
  trend: 'increasing',
};

export const mockReportText = `## Executive Summary

The analysis of **165,432 scientific articles** reveals significant divergence in perovskite solar cell research between major geopolitical regions. China leads in manufacturing scalability [[paper-001]] [[paper-002]], while the United States demonstrates advantages in fundamental materials science [[paper-003]] [[paper-004]].

## Key Findings by Dimension

### Temperature Processing
Chinese research clusters around **lower processing temperatures** (90-150°C), optimizing for energy efficiency in manufacturing [[paper-001]]. US approaches favor slightly higher temperatures (100-180°C) with emphasis on crystallinity control [[paper-004]].

### Efficiency Metrics
The highest reported efficiencies emerge from **2D/3D heterostructure** approaches developed in European labs, achieving **26.1%** [[paper-006]]. Chinese sequential deposition methods follow closely at **25.7%** [[paper-001]].

### Stability Concerns
A critical **conflict** exists in stability data:
- Chinese protocols report **1000-1500h** at 85°C [[paper-001]] [[paper-002]]
- European standardized testing suggests **longer protocols needed** [[paper-005]]

### Cost Analysis
Manufacturing cost estimates vary significantly by region:
| Region | Cost Range | Confidence |
|--------|-----------|------------|
| China | $0.18-0.25/W | Medium |
| USA | $0.32-0.45/W | Low |
| Europe | $0.28-0.55/W | Medium |

## Strategic Recommendations

1. **Monitor Chinese manufacturing advances** - Scale advantages widening
2. **Invest in interface engineering** - US fundamental research yielding efficiency gains
3. **Prioritize stability standardization** - Current metrics not comparable across regions
4. **Consider lead-free alternatives** - Regulatory pressure increasing [[paper-005]]

---
*Analysis confidence: **High** | Papers analyzed: 165,432 | Last updated: 2024-12-12*`;
