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
    abstract: 'Use of argyrodite Li6PS5Cl electrolyte enables 500 Wh/kg energy density with fast charging capability. The all-solid-state configuration demonstrates exceptional thermal stability up to 200°C and maintains 85% capacity after 1000 cycles at 1C rate.',
    citations: 78,
    dimensions: {
      'Key Findings': { value: '500 Wh/kg energy density achieved', confidence: 'high' },
      'Methodology': { value: 'Use of argyrodite Li6PS5Cl electrolyte', confidence: 'high' },
      'Quantitative Results': { value: '500 Wh/kg', confidence: 'high' },
      'Applications': { value: 'Fast charging capability...', confidence: 'high' },
      'Limitations': { value: '—', confidence: 'low' },
    },
  },
  {
    id: 'paper-008',
    title: 'Thermal and catalytic pyrolysis of waste polypropylene plastic using spent FCC catalyst',
    umap_x: 0.42,
    umap_y: 0.18,
    cluster_label: 'Recycling Technologies',
    country: 'usa',
    score: 0.85,
    year: 2021,
    authors: ['E. T. Aisien', 'Ifechukwude Christopher Otuya', 'F. Aisien'],
    abstract: 'This study investigates the thermal and catalytic pyrolysis of waste polypropylene using spent FCC catalyst. The catalytic process significantly reduces the activation energy required for polymer decomposition and produces a liquid fuel with properties similar to commercial diesel. Maximum oil yield of 82% was achieved at 450°C with 10% catalyst loading.',
    citations: 156,
    dimensions: {
      'Key Findings': { value: 'Catalytic pyrolysis produces diesel-like fuel', confidence: 'high' },
      'Methodology': { value: 'Thermal and catalytic pyrolysis with FCC catalyst', confidence: 'high' },
      'Quantitative Results': { value: '82% oil yield at 450°C', confidence: 'high' },
      'Applications': { value: 'Waste plastic to fuel conversion', confidence: 'high' },
      'Limitations': { value: 'Catalyst regeneration required', confidence: 'med' },
    },
  },
  {
    id: 'paper-009',
    title: 'Comparison of various catalysts in pyrolysis process: A review',
    umap_x: 0.38,
    umap_y: 0.25,
    cluster_label: 'Recycling Technologies',
    country: 'europe',
    score: 0.72,
    year: 2023,
    authors: ['A. R. Palanivelrajan', 'M. Feroskhan'],
    abstract: 'A comprehensive review of catalyst types used in plastic pyrolysis including zeolites, metal oxides, and natural catalysts. The study compares conversion efficiency, product distribution, and economic viability across different catalyst categories. Natural catalysts show promising results with lower environmental impact.',
    citations: 89,
    dimensions: {
      'Key Findings': { value: 'Natural catalysts show promising low-impact results', confidence: 'high' },
      'Methodology': { value: 'Systematic literature review', confidence: 'high' },
      'Quantitative Results': { value: 'Compared 50+ catalyst studies', confidence: 'high' },
      'Applications': { value: 'Catalyst selection guidelines', confidence: 'med' },
      'Limitations': { value: 'Limited industrial validation data', confidence: 'med' },
    },
  },
  {
    id: 'paper-010',
    title: 'Liquid fluids from thermo-catalytic degradation of waste low-density polyethylene',
    umap_x: 0.55,
    umap_y: 0.12,
    cluster_label: 'Recycling Technologies',
    country: 'usa',
    score: 0.68,
    year: 2022,
    authors: ['F. Aisien', 'E. T. Aisien'],
    abstract: 'Investigation of thermo-catalytic degradation of LDPE waste using kaolin clay catalyst. The process yields liquid hydrocarbons suitable for fuel applications with carbon chain distribution C6-C20. Optimal conditions identified at 400°C with 15% catalyst loading achieving 76% liquid yield.',
    citations: 67,
    dimensions: {
      'Key Findings': { value: 'Kaolin clay effective as low-cost catalyst', confidence: 'high' },
      'Methodology': { value: 'Thermo-catalytic degradation in batch reactor', confidence: 'high' },
      'Quantitative Results': { value: '76% liquid yield, C6-C20 distribution', confidence: 'high' },
      'Applications': { value: 'Alternative fuel production', confidence: 'high' },
      'Limitations': { value: '—', confidence: 'low' },
    },
  },
  {
    id: 'paper-011',
    title: 'Performance of Different Catalysts for the In Situ Cracking of Oil-Waxes Obtained by the Pyrolysis',
    umap_x: 0.62,
    umap_y: 0.22,
    cluster_label: 'Recycling Technologies',
    country: 'europe',
    score: 0.81,
    year: 2020,
    authors: ['L. Quesada', 'M. C. Hoces', 'M. Martín-Lara', 'G. Luzón', 'G. Blázquez'],
    abstract: 'Comparative study of ZSM-5, HZSM-5, and beta zeolite catalysts for in-situ cracking of pyrolysis oil-waxes. HZSM-5 demonstrated superior performance with 91% conversion to light hydrocarbons. The study provides insights into catalyst pore structure effects on product selectivity.',
    citations: 124,
    dimensions: {
      'Key Findings': { value: 'HZSM-5 achieves 91% conversion to light hydrocarbons', confidence: 'high' },
      'Methodology': { value: 'In-situ catalytic cracking comparison', confidence: 'high' },
      'Quantitative Results': { value: '91% conversion with HZSM-5', confidence: 'high' },
      'Applications': { value: 'Fuel-grade hydrocarbon production', confidence: 'high' },
      'Limitations': { value: 'Catalyst deactivation over time', confidence: 'med' },
    },
  },
  {
    id: 'paper-012',
    title: 'A LaFeO3 supported natural-clay-mineral catalyst for efficient pyrolysis of polypropylene plastic material',
    umap_x: 0.48,
    umap_y: 0.35,
    cluster_label: 'Novel Catalysts',
    country: 'china',
    score: 0.76,
    year: 2021,
    authors: ['L. T. Nguyen', 'G. Poinern', 'Hanh T. N. Le', 'T. Nguyen', 'C. M. Dang'],
    abstract: 'Development of a novel LaFeO3/clay composite catalyst for polypropylene pyrolysis. The catalyst demonstrates excellent thermal stability and reusability with minimal activity loss after 5 cycles. Liquid product yield reaches 78% with high selectivity toward gasoline-range hydrocarbons.',
    citations: 93,
    dimensions: {
      'Key Findings': { value: 'LaFeO3/clay shows excellent reusability', confidence: 'high' },
      'Methodology': { value: 'Composite catalyst synthesis and testing', confidence: 'high' },
      'Quantitative Results': { value: '78% liquid yield, 5 cycle reusability', confidence: 'high' },
      'Applications': { value: 'Sustainable plastic recycling', confidence: 'high' },
      'Limitations': { value: 'Complex catalyst preparation', confidence: 'med' },
    },
  },
  {
    id: 'paper-013',
    title: 'A Study to Optimise Plastic to Fuel Technology - A Review',
    umap_x: 0.35,
    umap_y: 0.42,
    cluster_label: 'Industrial Processing',
    country: 'europe',
    score: 0.65,
    year: 2020,
    authors: ['M. Quadri', 'D. Dohare'],
    abstract: 'Comprehensive review of plastic-to-fuel conversion technologies including pyrolysis, gasification, and hydrocracking. Analysis of process parameters, economic feasibility, and environmental impact across different scales of operation. Identifies key barriers to commercialization and proposes optimization strategies.',
    citations: 187,
    dimensions: {
      'Key Findings': { value: 'Pyrolysis most economically viable at medium scale', confidence: 'high' },
      'Methodology': { value: 'Technology review and economic analysis', confidence: 'high' },
      'Quantitative Results': { value: 'Break-even at 10,000 tonnes/year capacity', confidence: 'med' },
      'Applications': { value: 'Industrial scale-up guidelines', confidence: 'high' },
      'Limitations': { value: 'Regional economic variations not addressed', confidence: 'med' },
    },
  },
  {
    id: 'paper-014',
    title: 'High Quality and Maximizing the Production of CNTs from the Pyrolysis of Waste Polypropylene',
    umap_x: 0.22,
    umap_y: 0.65,
    cluster_label: 'Novel Materials',
    country: 'china',
    score: 0.88,
    year: 2022,
    authors: ['A. I. Eldahshory', 'Karim Emara', 'M. Abd-Elhady', 'M. A. Ismail'],
    abstract: 'Novel approach to produce carbon nanotubes from waste polypropylene pyrolysis using nickel-iron bimetallic catalyst. The process achieves CNT yield of 45% with multi-walled structure and diameter range 20-50 nm. This provides a value-added pathway for plastic waste utilization.',
    citations: 112,
    dimensions: {
      'Key Findings': { value: '45% CNT yield from plastic waste', confidence: 'high' },
      'Methodology': { value: 'Catalytic pyrolysis with Ni-Fe catalyst', confidence: 'high' },
      'Quantitative Results': { value: '45% yield, 20-50 nm diameter MWCNTs', confidence: 'high' },
      'Applications': { value: 'High-value material from waste plastic', confidence: 'high' },
      'Limitations': { value: 'Catalyst cost considerations', confidence: 'med' },
    },
  },
  {
    id: 'paper-015',
    title: 'Recent Trends in the Pyrolysis of Non-Degradable Waste Plastics',
    umap_x: 0.28,
    umap_y: 0.48,
    cluster_label: 'Industrial Processing',
    country: 'usa',
    score: 0.71,
    year: 2021,
    authors: ['Shushay Hagos Gebre', 'M. G. Sendeku', 'M. Bahri'],
    abstract: 'Review of recent advances in pyrolysis technology for non-degradable plastics including PE, PP, PS, and PVC. Discusses reactor designs, process optimization, and product upgrading strategies. Highlights emerging technologies like microwave-assisted and plasma pyrolysis.',
    citations: 203,
    dimensions: {
      'Key Findings': { value: 'Microwave-assisted pyrolysis shows energy efficiency gains', confidence: 'high' },
      'Methodology': { value: 'Systematic review of recent literature', confidence: 'high' },
      'Quantitative Results': { value: 'Reviewed 120+ studies from 2018-2021', confidence: 'high' },
      'Applications': { value: 'Technology selection guidelines', confidence: 'high' },
      'Limitations': { value: 'Limited pilot-scale data', confidence: 'med' },
    },
  },
  // Small satellite nodes (low score = small dots)
  { id: 'paper-016', title: 'Electrolyte Additives', umap_x: 0.33, umap_y: 0.55, cluster_label: 'Additives', country: 'china', score: 0.35, year: 2023, authors: ['Chen, Y.'], abstract: 'Study of electrolyte additives.', citations: 12, dimensions: {} },
  { id: 'paper-017', title: 'Thermal Stability', umap_x: 0.67, umap_y: 0.42, cluster_label: 'Thermal', country: 'usa', score: 0.28, year: 2022, authors: ['Miller, J.'], abstract: 'Thermal analysis.', citations: 8, dimensions: {} },
  { id: 'paper-018', title: 'Coating Methods', umap_x: 0.45, umap_y: 0.78, cluster_label: 'Coating', country: 'europe', score: 0.42, year: 2023, authors: ['Weber, K.'], abstract: 'Coating methods.', citations: 15, dimensions: {} },
  { id: 'paper-019', title: 'Separator Design', umap_x: 0.58, umap_y: 0.25, cluster_label: 'Design', country: 'china', score: 0.31, year: 2021, authors: ['Liu, X.'], abstract: 'Separator study.', citations: 9, dimensions: {} },
  { id: 'paper-020', title: 'Anode Materials', umap_x: 0.22, umap_y: 0.45, cluster_label: 'Materials', country: 'usa', score: 0.38, year: 2022, authors: ['Brown, T.'], abstract: 'Anode research.', citations: 11, dimensions: {} },
  { id: 'paper-021', title: 'Cycle Life Analysis', umap_x: 0.75, umap_y: 0.68, cluster_label: 'Analysis', country: 'europe', score: 0.25, year: 2023, authors: ['Schmidt, H.'], abstract: 'Cycle life.', citations: 7, dimensions: {} },
  { id: 'paper-022', title: 'Safety Testing', umap_x: 0.18, umap_y: 0.32, cluster_label: 'Safety', country: 'china', score: 0.33, year: 2022, authors: ['Yang, P.'], abstract: 'Safety tests.', citations: 10, dimensions: {} },
  { id: 'paper-023', title: 'Fast Charging', umap_x: 0.82, umap_y: 0.55, cluster_label: 'Charging', country: 'usa', score: 0.29, year: 2021, authors: ['Davis, R.'], abstract: 'Fast charging.', citations: 6, dimensions: {} },
  { id: 'paper-024', title: 'Electrode Thickness', umap_x: 0.40, umap_y: 0.15, cluster_label: 'Electrode', country: 'europe', score: 0.36, year: 2023, authors: ['Martin, C.'], abstract: 'Electrode study.', citations: 13, dimensions: {} },
  { id: 'paper-025', title: 'Binder Systems', umap_x: 0.55, umap_y: 0.88, cluster_label: 'Binder', country: 'china', score: 0.22, year: 2022, authors: ['Zhao, M.'], abstract: 'Binder systems.', citations: 5, dimensions: {} },
  { id: 'paper-026', title: 'Impedance Study', umap_x: 0.12, umap_y: 0.65, cluster_label: 'Impedance', country: 'usa', score: 0.27, year: 2021, authors: ['Wilson, K.'], abstract: 'Impedance analysis.', citations: 8, dimensions: {} },
  { id: 'paper-027', title: 'Capacity Fade', umap_x: 0.88, umap_y: 0.38, cluster_label: 'Capacity', country: 'europe', score: 0.34, year: 2023, authors: ['Fischer, L.'], abstract: 'Capacity fade.', citations: 11, dimensions: {} },
  { id: 'paper-028', title: 'Interface Study', umap_x: 0.28, umap_y: 0.22, cluster_label: 'Interface', country: 'china', score: 0.30, year: 2022, authors: ['Huang, Y.'], abstract: 'Interface study.', citations: 9, dimensions: {} },
  { id: 'paper-029', title: 'Voltage Stability', umap_x: 0.65, umap_y: 0.82, cluster_label: 'Voltage', country: 'usa', score: 0.26, year: 2021, authors: ['Taylor, M.'], abstract: 'Voltage stability.', citations: 7, dimensions: {} },
  { id: 'paper-030', title: 'Porosity Effects', umap_x: 0.48, umap_y: 0.48, cluster_label: 'Porosity', country: 'europe', score: 0.32, year: 2023, authors: ['Müller, A.'], abstract: 'Porosity effects.', citations: 10, dimensions: {} },
  { id: 'paper-031', title: 'Particle Size', umap_x: 0.78, umap_y: 0.18, cluster_label: 'Particle', country: 'china', score: 0.24, year: 2022, authors: ['Wu, L.'], abstract: 'Particle size.', citations: 6, dimensions: {} },
  { id: 'paper-032', title: 'Current Density', umap_x: 0.15, umap_y: 0.85, cluster_label: 'Current', country: 'usa', score: 0.28, year: 2021, authors: ['Anderson, P.'], abstract: 'Current density.', citations: 8, dimensions: {} },
  { id: 'paper-033', title: 'Temperature Effects', umap_x: 0.92, umap_y: 0.72, cluster_label: 'Temperature', country: 'europe', score: 0.35, year: 2023, authors: ['Richter, S.'], abstract: 'Temperature effects.', citations: 12, dimensions: {} },
  { id: 'paper-034', title: 'Degradation Study', umap_x: 0.35, umap_y: 0.92, cluster_label: 'Degradation', country: 'china', score: 0.23, year: 2022, authors: ['Xu, J.'], abstract: 'Degradation study.', citations: 5, dimensions: {} },
  { id: 'paper-035', title: 'Electrolyte Aging', umap_x: 0.72, umap_y: 0.12, cluster_label: 'Aging', country: 'usa', score: 0.31, year: 2021, authors: ['Clark, D.'], abstract: 'Electrolyte aging.', citations: 9, dimensions: {} },
];

export const mockEdges: DataEdge[] = [
  // Major node connections (large to large)
  { source_id: 'paper-001', target_id: 'paper-003', weight: 0.75 },
  { source_id: 'paper-001', target_id: 'paper-006', weight: 0.68 },
  { source_id: 'paper-003', target_id: 'paper-006', weight: 0.82 },
  { source_id: 'paper-006', target_id: 'paper-014', weight: 0.71 },
  { source_id: 'paper-001', target_id: 'paper-014', weight: 0.55 },
  { source_id: 'paper-003', target_id: 'paper-014', weight: 0.62 },
  
  // Major to medium nodes
  { source_id: 'paper-001', target_id: 'paper-002', weight: 0.85 },
  { source_id: 'paper-001', target_id: 'paper-007', weight: 0.62 },
  { source_id: 'paper-003', target_id: 'paper-004', weight: 0.78 },
  { source_id: 'paper-003', target_id: 'paper-005', weight: 0.65 },
  { source_id: 'paper-006', target_id: 'paper-004', weight: 0.72 },
  { source_id: 'paper-006', target_id: 'paper-005', weight: 0.82 },
  { source_id: 'paper-014', target_id: 'paper-012', weight: 0.81 },
  { source_id: 'paper-014', target_id: 'paper-015', weight: 0.64 },
  
  // Medium cluster connections
  { source_id: 'paper-002', target_id: 'paper-007', weight: 0.71 },
  { source_id: 'paper-004', target_id: 'paper-005', weight: 0.55 },
  { source_id: 'paper-008', target_id: 'paper-009', weight: 0.88 },
  { source_id: 'paper-008', target_id: 'paper-010', weight: 0.75 },
  { source_id: 'paper-009', target_id: 'paper-011', weight: 0.82 },
  { source_id: 'paper-010', target_id: 'paper-011', weight: 0.69 },
  { source_id: 'paper-011', target_id: 'paper-012', weight: 0.73 },
  { source_id: 'paper-012', target_id: 'paper-013', weight: 0.52 },
  { source_id: 'paper-013', target_id: 'paper-015', weight: 0.77 },
  
  // Small nodes to major nodes (creates dense web)
  { source_id: 'paper-016', target_id: 'paper-001', weight: 0.45 },
  { source_id: 'paper-016', target_id: 'paper-003', weight: 0.38 },
  { source_id: 'paper-017', target_id: 'paper-003', weight: 0.42 },
  { source_id: 'paper-017', target_id: 'paper-006', weight: 0.35 },
  { source_id: 'paper-018', target_id: 'paper-001', weight: 0.48 },
  { source_id: 'paper-018', target_id: 'paper-014', weight: 0.33 },
  { source_id: 'paper-019', target_id: 'paper-006', weight: 0.40 },
  { source_id: 'paper-019', target_id: 'paper-003', weight: 0.36 },
  { source_id: 'paper-020', target_id: 'paper-001', weight: 0.44 },
  { source_id: 'paper-020', target_id: 'paper-006', weight: 0.39 },
  { source_id: 'paper-021', target_id: 'paper-014', weight: 0.41 },
  { source_id: 'paper-021', target_id: 'paper-003', weight: 0.37 },
  { source_id: 'paper-022', target_id: 'paper-001', weight: 0.32 },
  { source_id: 'paper-022', target_id: 'paper-014', weight: 0.29 },
  { source_id: 'paper-023', target_id: 'paper-006', weight: 0.34 },
  { source_id: 'paper-023', target_id: 'paper-001', weight: 0.31 },
  { source_id: 'paper-024', target_id: 'paper-003', weight: 0.43 },
  { source_id: 'paper-024', target_id: 'paper-006', weight: 0.38 },
  { source_id: 'paper-025', target_id: 'paper-014', weight: 0.35 },
  { source_id: 'paper-025', target_id: 'paper-001', weight: 0.28 },
  { source_id: 'paper-026', target_id: 'paper-001', weight: 0.42 },
  { source_id: 'paper-026', target_id: 'paper-003', weight: 0.36 },
  { source_id: 'paper-027', target_id: 'paper-006', weight: 0.39 },
  { source_id: 'paper-027', target_id: 'paper-014', weight: 0.33 },
  { source_id: 'paper-028', target_id: 'paper-003', weight: 0.45 },
  { source_id: 'paper-028', target_id: 'paper-001', weight: 0.38 },
  { source_id: 'paper-029', target_id: 'paper-014', weight: 0.41 },
  { source_id: 'paper-029', target_id: 'paper-006', weight: 0.35 },
  { source_id: 'paper-030', target_id: 'paper-001', weight: 0.37 },
  { source_id: 'paper-030', target_id: 'paper-003', weight: 0.32 },
  { source_id: 'paper-030', target_id: 'paper-006', weight: 0.29 },
  { source_id: 'paper-031', target_id: 'paper-006', weight: 0.34 },
  { source_id: 'paper-031', target_id: 'paper-014', weight: 0.28 },
  { source_id: 'paper-032', target_id: 'paper-001', weight: 0.40 },
  { source_id: 'paper-032', target_id: 'paper-014', weight: 0.36 },
  { source_id: 'paper-033', target_id: 'paper-003', weight: 0.43 },
  { source_id: 'paper-033', target_id: 'paper-006', weight: 0.37 },
  { source_id: 'paper-034', target_id: 'paper-014', weight: 0.31 },
  { source_id: 'paper-034', target_id: 'paper-001', weight: 0.27 },
  { source_id: 'paper-035', target_id: 'paper-006', weight: 0.38 },
  { source_id: 'paper-035', target_id: 'paper-003', weight: 0.33 },
  
  // Small to medium nodes
  { source_id: 'paper-016', target_id: 'paper-002', weight: 0.35 },
  { source_id: 'paper-017', target_id: 'paper-004', weight: 0.32 },
  { source_id: 'paper-018', target_id: 'paper-007', weight: 0.38 },
  { source_id: 'paper-019', target_id: 'paper-005', weight: 0.29 },
  { source_id: 'paper-020', target_id: 'paper-008', weight: 0.36 },
  { source_id: 'paper-021', target_id: 'paper-012', weight: 0.33 },
  { source_id: 'paper-022', target_id: 'paper-009', weight: 0.31 },
  { source_id: 'paper-023', target_id: 'paper-010', weight: 0.28 },
  { source_id: 'paper-024', target_id: 'paper-011', weight: 0.35 },
  { source_id: 'paper-025', target_id: 'paper-013', weight: 0.30 },
  { source_id: 'paper-026', target_id: 'paper-015', weight: 0.27 },
  { source_id: 'paper-027', target_id: 'paper-002', weight: 0.34 },
  { source_id: 'paper-028', target_id: 'paper-004', weight: 0.31 },
  { source_id: 'paper-029', target_id: 'paper-007', weight: 0.29 },
  { source_id: 'paper-030', target_id: 'paper-005', weight: 0.33 },
  { source_id: 'paper-031', target_id: 'paper-008', weight: 0.26 },
  { source_id: 'paper-032', target_id: 'paper-009', weight: 0.32 },
  { source_id: 'paper-033', target_id: 'paper-010', weight: 0.35 },
  { source_id: 'paper-034', target_id: 'paper-011', weight: 0.28 },
  { source_id: 'paper-035', target_id: 'paper-012', weight: 0.31 },
  
  // Small to small connections (web effect)
  { source_id: 'paper-016', target_id: 'paper-020', weight: 0.28 },
  { source_id: 'paper-017', target_id: 'paper-019', weight: 0.25 },
  { source_id: 'paper-018', target_id: 'paper-025', weight: 0.32 },
  { source_id: 'paper-019', target_id: 'paper-024', weight: 0.27 },
  { source_id: 'paper-020', target_id: 'paper-022', weight: 0.30 },
  { source_id: 'paper-021', target_id: 'paper-023', weight: 0.26 },
  { source_id: 'paper-022', target_id: 'paper-026', weight: 0.29 },
  { source_id: 'paper-023', target_id: 'paper-027', weight: 0.24 },
  { source_id: 'paper-024', target_id: 'paper-028', weight: 0.31 },
  { source_id: 'paper-025', target_id: 'paper-029', weight: 0.28 },
  { source_id: 'paper-026', target_id: 'paper-032', weight: 0.25 },
  { source_id: 'paper-027', target_id: 'paper-033', weight: 0.30 },
  { source_id: 'paper-028', target_id: 'paper-031', weight: 0.27 },
  { source_id: 'paper-029', target_id: 'paper-034', weight: 0.23 },
  { source_id: 'paper-030', target_id: 'paper-035', weight: 0.29 },
  { source_id: 'paper-016', target_id: 'paper-030', weight: 0.26 },
  { source_id: 'paper-017', target_id: 'paper-021', weight: 0.28 },
  { source_id: 'paper-018', target_id: 'paper-032', weight: 0.24 },
  { source_id: 'paper-019', target_id: 'paper-031', weight: 0.27 },
  { source_id: 'paper-020', target_id: 'paper-028', weight: 0.30 },
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

// Executive Summary Data
export const mockTRLData = [
  {
    region: 'China',
    level: 7,
    label: 'Industrial scale manufacturing deployed with continuous optimization',
    papers: ['paper-001', 'paper-002', 'paper-007']
  },
  {
    region: 'USA',
    level: 5,
    label: 'Prototype validation in relevant environment',
    papers: ['paper-003', 'paper-004']
  },
  {
    region: 'Europe',
    level: 4,
    label: 'Laboratory validation and component testing',
    papers: ['paper-005', 'paper-006']
  }
];

export const mockConflicts = [
  {
    topic: 'Solid-State Electrolyte Stability',
    status: 'debate' as const,
    description: 'Paper 004 reports stable sulfide electrolytes, while Paper 005 observes dendrite formation at interfaces under similar conditions.',
    sources: ['paper-004', 'paper-005']
  },
  {
    topic: 'Recycling Process Economics',
    status: 'consensus' as const,
    description: 'All sources agree on hydrometallurgical superiority for mixed battery streams with >97% recovery rates.',
    sources: ['paper-003', 'paper-006']
  },
  {
    topic: 'Energy Density Ceiling',
    status: 'debate' as const,
    description: 'Chinese sources claim 500 Wh/kg achievable, while Western labs report practical limits at 400 Wh/kg for production cells.',
    sources: ['paper-007', 'paper-004']
  },
  {
    topic: 'DLE Efficiency Metrics',
    status: 'consensus' as const,
    description: 'Consensus on membrane-based extraction achieving 95%+ recovery across multiple studies.',
    sources: ['paper-001', 'paper-002']
  }
];

export const mockGaps = [
  {
    area: 'Long-term Recycling Economics',
    description: 'While efficiency metrics are well-documented, there is zero longitudinal data on 10+ year recycling infrastructure costs.',
    opportunity: 'First-mover advantage for comprehensive lifecycle cost modeling'
  },
  {
    area: 'Cold Climate Performance',
    description: 'Solid-state battery performance below -20°C remains largely unstudied in production-scale contexts.',
    opportunity: 'Critical gap for Nordic/Canadian EV market penetration'
  }
];

export const mockStrategicHorizon = {
  currentTrend: 'lithium-ion optimization',
  futureTrend: 'solid-state commercialization',
  leader: 'Chinese manufacturing ecosystem',
  leaderAdvantage: 'scale production and cost efficiency',
  emergingApproach: 'European sustainability-first approach',
  emergingReason: 'incoming EU battery passport regulations and circular economy mandates',
  confidence: 'high' as const,
  dataDensity: 165432,
  timeframe: '12-24 months'
};