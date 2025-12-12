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

export const mockDimensions = ['Key Findings', 'Methodology', 'Quantitative Results', 'Applications', 'Limitations'];

export const mockNodes: DataNode[] = [
  {
    id: 'paper-001',
    title: 'Industrial-Scale Direct Lithium Extraction from Brines',
    umap_x: 0.25,
    umap_y: 0.72,
    cluster_label: 'Industrial Lithium Processing',
    country: 'china',
    score: 0.94,
    year: 2024,
    authors: ['Zhang, W.', 'Liu, H.', 'Chen, X.'],
    abstract: 'A membrane-based DLE system achieving 95% lithium recovery rate at industrial scale with reduced water consumption.',
    citations: 187,
    dimensions: {
      'Key Findings': { value: 'A membrane-based DLE system...', confidence: 'high' },
      'Methodology': { value: 'Membrane-based DLE system', confidence: 'high' },
      'Quantitative Results': { value: '95% lithium recovery rate at...', confidence: 'high' },
      'Applications': { value: 'Reduces water consumption by...', confidence: 'high' },
      'Limitations': { value: '—', confidence: 'low' },
    },
  },
  {
    id: 'paper-002',
    title: 'High-Nickel Cathode Manufacturing Optimization',
    umap_x: 0.31,
    umap_y: 0.68,
    cluster_label: 'Industrial Lithium Processing',
    country: 'china',
    score: 0.89,
    year: 2024,
    authors: ['Wang, L.', 'Li, M.'],
    abstract: 'NCM811 cathode production yield improvements through real-time AI monitoring systems.',
    citations: 64,
    dimensions: {
      'Key Findings': { value: 'NCM811 cathode production yield...', confidence: 'high' },
      'Methodology': { value: 'real-time AI monitoring', confidence: 'high' },
      'Quantitative Results': { value: 'Energy consumption reduced by 25%', confidence: 'high' },
      'Applications': { value: '—', confidence: 'low' },
      'Limitations': { value: '—', confidence: 'low' },
    },
  },
  {
    id: 'paper-003',
    title: 'Closed-Loop Battery Recycling: From End-of-Life to New Cells',
    umap_x: 0.72,
    umap_y: 0.45,
    cluster_label: 'Industrial Lithium Processing',
    country: 'usa',
    score: 0.91,
    year: 2023,
    authors: ['Smith, J.', 'Johnson, R.', 'Williams, K.'],
    abstract: 'Our hydrometallurgical process achieves 99.2% Li, 98.8% Co, 97.5% Ni recovery with cost optimization.',
    citations: 142,
    dimensions: {
      'Key Findings': { value: 'Our hydrometallurgical...', confidence: 'high' },
      'Methodology': { value: 'hydrometallurgical process', confidence: 'high' },
      'Quantitative Results': { value: '99.2% Li, 98.8% Co, 97.5% Ni, cost...', confidence: 'high' },
      'Applications': { value: 'recycling of spent batteries to produ...', confidence: 'low' },
      'Limitations': { value: '—', confidence: 'low' },
    },
  },
  {
    id: 'paper-004',
    title: 'Solid-State Electrolyte Discovery via High-Throughput Screening',
    umap_x: 0.68,
    umap_y: 0.52,
    cluster_label: 'Solid-State Electrolytes',
    country: 'usa',
    score: 0.87,
    year: 2024,
    authors: ['Davis, M.', 'Brown, A.'],
    abstract: '12 novel sulfide electrolytes with ionic conductivity exceeding 10 mS/cm identified via ML screening.',
    citations: 89,
    dimensions: {
      'Key Findings': { value: '12 novel sulfide electrolytes with...', confidence: 'high' },
      'Methodology': { value: 'Machine learning screening of...', confidence: 'high' },
      'Quantitative Results': { value: '100,000 compounds and 12 novel sulfi...', confidence: 'high' },
      'Applications': { value: '—', confidence: 'low' },
      'Limitations': { value: '—', confidence: 'low' },
    },
  },
  {
    id: 'paper-005',
    title: 'Understanding Lithium Dendrite Formation Using In-Situ TEM',
    umap_x: 0.45,
    umap_y: 0.28,
    cluster_label: 'Solid-State Electrolytes',
    country: 'europe',
    score: 0.82,
    year: 2023,
    authors: ['Müller, S.', 'Schmidt, T.', 'Weber, F.'],
    abstract: 'Direct observation of dendrite nucleation mechanism at solid electrolyte interfaces.',
    citations: 112,
    dimensions: {
      'Key Findings': { value: 'dendrite nucleation mechanism', confidence: 'high' },
      'Methodology': { value: 'In-Situ TEM', confidence: 'high' },
      'Quantitative Results': { value: '0.5 mA/cm²', confidence: 'high' },
      'Applications': { value: '—', confidence: 'low' },
      'Limitations': { value: '—', confidence: 'low' },
    },
  },
  {
    id: 'paper-006',
    title: 'Lithium Metal Anode Stabilization via Artificial SEI',
    umap_x: 0.52,
    umap_y: 0.35,
    cluster_label: 'Solid-State Electrolytes',
    country: 'europe',
    score: 0.93,
    year: 2024,
    authors: ['García, P.', 'Martin, C.'],
    abstract: 'LiF-rich artificial SEI enables 500 cycles at 99.2% Coulombic efficiency.',
    citations: 156,
    dimensions: {
      'Key Findings': { value: 'LiF-rich artificial SEI enables 500 cycle...', confidence: 'high' },
      'Methodology': { value: 'LiF-rich artificial SEI', confidence: 'high' },
      'Quantitative Results': { value: '500 cycles at 99.2% Coulombic...', confidence: 'high' },
      'Applications': { value: 'No dendrite formation observe...', confidence: 'high' },
      'Limitations': { value: '—', confidence: 'low' },
    },
  },
  {
    id: 'paper-007',
    title: 'All-Solid-State Battery with Sulfide Electrolyte: 500 Wh/kg',
    umap_x: 0.15,
    umap_y: 0.55,
    cluster_label: 'Solid-State Electrolytes',
    country: 'china',
    score: 0.78,
    year: 2024,
    authors: ['Zhao, Y.', 'Yang, J.'],
    abstract: 'Use of argyrodite Li6PS5Cl electrolyte enables 500 Wh/kg energy density with fast charging capability.',
    citations: 78,
    dimensions: {
      'Key Findings': { value: '500 Wh/kg energy density achieved', confidence: 'high' },
      'Methodology': { value: 'Use of argyrodite Li6PS5Cl electrolyte', confidence: 'high' },
      'Quantitative Results': { value: '500 Wh/kg', confidence: 'high' },
      'Applications': { value: 'Fast charging capability...', confidence: 'high' },
      'Limitations': { value: '—', confidence: 'low' },
    },
  },
];

export const mockEdges: DataEdge[] = [
  { source_id: 'paper-001', target_id: 'paper-002', weight: 0.85 },
  { source_id: 'paper-001', target_id: 'paper-007', weight: 0.62 },
  { source_id: 'paper-002', target_id: 'paper-007', weight: 0.71 },
  { source_id: 'paper-003', target_id: 'paper-004', weight: 0.78 },
  { source_id: 'paper-003', target_id: 'paper-006', weight: 0.65 },
  { source_id: 'paper-004', target_id: 'paper-005', weight: 0.55 },
  { source_id: 'paper-005', target_id: 'paper-006', weight: 0.82 },
  { source_id: 'paper-006', target_id: 'paper-003', weight: 0.68 },
  { source_id: 'paper-007', target_id: 'paper-001', weight: 0.59 },
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

The analysis of **165,432 scientific articles** reveals significant divergence in lithium battery research between major geopolitical regions. China leads in manufacturing scalability [[paper-001]] [[paper-002]], while the United States demonstrates advantages in fundamental materials science [[paper-003]] [[paper-004]].

## Key Findings by Dimension

### Industrial Processing
Chinese research clusters around **high-efficiency extraction methods** with membrane-based DLE systems achieving 95% lithium recovery [[paper-001]]. Manufacturing optimization through AI monitoring shows 25% energy reduction [[paper-002]].

### Recycling Technologies
The highest recovery rates emerge from **hydrometallurgical processes** developed in US labs, achieving **99.2% Li, 98.8% Co** recovery [[paper-003]]. European standardized approaches focus on process sustainability [[paper-005]].

### Solid-State Advances
A critical **breakthrough** exists in solid-state technology:
- Chinese protocols report **500 Wh/kg** energy density [[paper-007]]
- European artificial SEI enables **500 cycles at 99.2% efficiency** [[paper-006]]

### Novel Materials Discovery
ML screening identifies 12 novel sulfide electrolytes [[paper-004]] with ionic conductivity >10 mS/cm.

## Strategic Recommendations

1. **Monitor Chinese manufacturing advances** - Scale advantages widening
2. **Invest in solid-state technology** - Breakthrough energy densities achieved
3. **Prioritize recycling infrastructure** - High recovery rates demonstrated
4. **Consider ML-driven discovery** - Accelerated materials screening

---
*Analysis confidence: **High** | Papers analyzed: 165,432 | Last updated: 2024-12-12*`;

export const mockSearchQueries = [
  'Основные подходы к производству литиевых батарей в Китае',
  'Как изменилось производство электролитов за последние 5 лет',
  'Какие материалы используются в solid-state батареях',
  'Какие показатели эффективности характерны для DLE систем',
];

export const mockExtractionDimensions = [
  'Key Findings',
  'Methodology', 
  'Quantitative Results',
  'Applications',
  'Limitations',
];