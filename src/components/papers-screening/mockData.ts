import { PaperWithScreening } from './types';

export const mockScreeningData: PaperWithScreening[] = [
  {
    id: 'paper-1',
    title: 'Direct Lithium Extraction from Geothermal Brines Using Novel Ion-Exchange Membranes',
    authors: ['Wang, L.', 'Chen, X.', 'Liu, H.'],
    year: 2024,
    abstract: 'This study presents a membrane-based direct lithium extraction (DLE) system achieving 94% recovery rates from high-salinity geothermal brines. The novel ion-exchange membrane demonstrates superior selectivity for lithium ions over competing magnesium and calcium species.',
    citations: 45,
    country: 'china',
    screening: {
      verdict: 'include',
      score: 4.2,
      rationale: 'The abstract describes a membrane-based DLE system with specific performance metrics (94% recovery). Directly relevant to systematic review on lithium extraction technologies.',
      criteria: [
        { name: 'Clinical Outcomes', status: 'fail' },
        { name: 'Data Quality', status: 'pass' },
        { name: 'Study Design', status: 'pass' },
        { name: 'Relevance', status: 'pass' },
        { name: 'Sample Size', status: 'partial' },
      ]
    }
  },
  {
    id: 'paper-2',
    title: 'Electrochemical Recovery of Lithium from Spent Batteries: A Comparative Analysis',
    authors: ['Smith, J.', 'Johnson, M.'],
    year: 2023,
    abstract: 'Comparative study of electrochemical methods for lithium recovery from spent lithium-ion batteries. Analysis includes energy efficiency, purity levels, and scalability considerations.',
    citations: 32,
    country: 'usa',
    screening: {
      verdict: 'include',
      score: 3.8,
      rationale: 'Relevant comparative study on lithium recovery methods. Good methodology description but focuses on battery recycling rather than primary extraction.',
      criteria: [
        { name: 'Clinical Outcomes', status: 'partial' },
        { name: 'Data Quality', status: 'pass' },
        { name: 'Study Design', status: 'pass' },
        { name: 'Relevance', status: 'partial' },
        { name: 'Sample Size', status: 'pass' },
      ]
    }
  },
  {
    id: 'paper-3',
    title: 'Machine Learning Optimization of Sorbent Materials for Lithium Capture',
    authors: ['Mueller, K.', 'Schmidt, P.', 'Weber, A.'],
    year: 2024,
    abstract: 'Application of machine learning algorithms to optimize sorbent material compositions for enhanced lithium capture from brine sources. Neural network models predict optimal material structures.',
    citations: 18,
    country: 'europe',
    screening: {
      verdict: 'exclude',
      score: 2.1,
      rationale: 'Focuses on computational modeling rather than experimental results. No empirical data on actual lithium extraction performance.',
      criteria: [
        { name: 'Clinical Outcomes', status: 'fail' },
        { name: 'Data Quality', status: 'fail' },
        { name: 'Study Design', status: 'partial' },
        { name: 'Relevance', status: 'pass' },
        { name: 'Sample Size', status: 'fail' },
      ]
    }
  },
  {
    id: 'paper-4',
    title: 'Sustainable Lithium Production: Environmental Impact Assessment',
    authors: ['Garcia, R.', 'Martinez, L.'],
    year: 2023,
    abstract: 'Comprehensive environmental impact assessment of various lithium production methods. Compares water usage, carbon footprint, and land requirements across extraction technologies.',
    citations: 56,
    country: 'europe',
    screening: {
      verdict: 'include',
      score: 3.5,
      rationale: 'Valuable environmental perspective on lithium extraction. High citation count indicates field relevance.',
      criteria: [
        { name: 'Clinical Outcomes', status: 'fail' },
        { name: 'Data Quality', status: 'pass' },
        { name: 'Study Design', status: 'pass' },
        { name: 'Relevance', status: 'partial' },
        { name: 'Sample Size', status: 'pass' },
      ]
    }
  },
  {
    id: 'paper-5',
    title: 'Adsorption-Based Lithium Extraction: Kinetic Studies',
    authors: ['Kim, S.', 'Park, J.', 'Lee, H.'],
    year: 2024,
    abstract: 'Detailed kinetic analysis of lithium adsorption on manganese oxide sorbents. Determines rate constants and activation energies for lithium uptake processes.',
    citations: 12,
    country: 'other',
    screening: {
      verdict: 'exclude',
      score: 1.8,
      rationale: 'Too focused on fundamental chemistry. Lacks practical extraction performance data.',
      criteria: [
        { name: 'Clinical Outcomes', status: 'fail' },
        { name: 'Data Quality', status: 'partial' },
        { name: 'Study Design', status: 'pass' },
        { name: 'Relevance', status: 'fail' },
        { name: 'Sample Size', status: 'fail' },
      ]
    }
  },
  {
    id: 'paper-6',
    title: 'Hybrid Electrodialysis-Membrane System for Lithium Concentration',
    authors: ['Zhang, Y.', 'Li, W.'],
    year: 2024,
    abstract: 'Novel hybrid system combining electrodialysis with selective membranes achieves 99.2% lithium purity. Pilot-scale testing demonstrates commercial viability.',
    citations: 28,
    country: 'china',
    screening: {
      verdict: 'include',
      score: 4.7,
      rationale: 'Excellent pilot-scale results with high purity metrics. Directly applicable to industrial lithium extraction.',
      criteria: [
        { name: 'Clinical Outcomes', status: 'pass' },
        { name: 'Data Quality', status: 'pass' },
        { name: 'Study Design', status: 'pass' },
        { name: 'Relevance', status: 'pass' },
        { name: 'Sample Size', status: 'pass' },
      ]
    }
  },
];
