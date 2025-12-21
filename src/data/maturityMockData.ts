import { MaturityNode } from '@/types/morphik';

// Generate mock data for Maturity Matrix
// ~60 points distributed across the visualization
// Volume determines both size AND opacity/brightness

export const maturityMockData: MaturityNode[] = [
  // Winners - High TRL (5-9), High Velocity (50-100) - GREEN
  { id: 'w1', name: 'Solid State', trl: 7.2, velocity: 85, volume: 520, cluster: 'winners', growth: 45 },
  { id: 'w2', name: 'LFP Cathode', trl: 8.5, velocity: 78, volume: 380, cluster: 'winners', growth: 32 },
  { id: 'w3', name: 'Silicon Anode', trl: 6.8, velocity: 92, volume: 620, cluster: 'winners', growth: 67 },
  { id: 'w4', name: 'Fast Charging', trl: 7.5, velocity: 72, volume: 280, cluster: 'winners', growth: 28 },
  { id: 'w5', name: 'NMC 811', trl: 8.2, velocity: 65, volume: 410, cluster: 'winners', growth: 22 },
  { id: 'w6', name: 'Dry Electrode', trl: 6.1, velocity: 88, volume: 195, cluster: 'winners', growth: 55 },
  { id: 'w7', name: 'Cell-to-Pack', trl: 7.8, velocity: 58, volume: 165, cluster: 'winners', growth: 18 },
  { id: 'w8', name: 'BMS AI', trl: 6.5, velocity: 75, volume: 320, cluster: 'winners', growth: 42 },
  { id: 'w9', name: 'High-Ni Cathode', trl: 8.8, velocity: 62, volume: 245, cluster: 'winners', growth: 15 },
  { id: 'w10', name: 'Thermal Mgmt', trl: 7.0, velocity: 68, volume: 185, cluster: 'winners', growth: 25 },
  { id: 'w11', name: 'Li-Metal Anode', trl: 5.5, velocity: 82, volume: 290, cluster: 'winners', growth: 52 },
  { id: 'w12', name: 'Electrode Coating', trl: 8.0, velocity: 55, volume: 130, cluster: 'winners', growth: 12 },
  { id: 'w13', name: 'Battery Recycling', trl: 6.2, velocity: 78, volume: 350, cluster: 'winners', growth: 48 },
  { id: 'w14', name: 'Single Crystal', trl: 7.3, velocity: 71, volume: 210, cluster: 'winners', growth: 35 },
  { id: 'w15', name: 'Electrolyte Opt', trl: 5.8, velocity: 65, volume: 155, cluster: 'winners', growth: 28 },

  // Emerging - Low TRL (1-5), High Velocity (50-100) - CYAN
  { id: 'e1', name: 'Sodium-Ion', trl: 4.2, velocity: 95, volume: 480, cluster: 'emerging', growth: 120 },
  { id: 'e2', name: 'Lithium-Air', trl: 2.8, velocity: 72, volume: 125, cluster: 'emerging', growth: 85 },
  { id: 'e3', name: 'Sulfur Battery', trl: 3.5, velocity: 68, volume: 185, cluster: 'emerging', growth: 58 },
  { id: 'e4', name: 'Quantum Dots', trl: 2.2, velocity: 82, volume: 95, cluster: 'emerging', growth: 95 },
  { id: 'e5', name: 'Graphene Anode', trl: 3.8, velocity: 78, volume: 245, cluster: 'emerging', growth: 72 },
  { id: 'e6', name: 'Solid Polymer', trl: 4.5, velocity: 62, volume: 160, cluster: 'emerging', growth: 48 },
  { id: 'e7', name: 'Li-S Battery', trl: 3.2, velocity: 75, volume: 195, cluster: 'emerging', growth: 65 },
  { id: 'e8', name: 'CNT Electrode', trl: 2.5, velocity: 58, volume: 85, cluster: 'emerging', growth: 42 },
  { id: 'e9', name: 'Ionic Liquids', trl: 4.0, velocity: 52, volume: 110, cluster: 'emerging', growth: 35 },
  { id: 'e10', name: 'Gel Electrolyte', trl: 3.7, velocity: 65, volume: 145, cluster: 'emerging', growth: 55 },
  { id: 'e11', name: '3D Printing', trl: 2.8, velocity: 88, volume: 75, cluster: 'emerging', growth: 92 },
  { id: 'e12', name: 'Self-Healing', trl: 1.8, velocity: 70, volume: 55, cluster: 'emerging', growth: 78 },

  // Mature - High TRL (5-9), Low Velocity (0-50) - AMBER/YELLOW (but shown as green-ish in ref)
  { id: 'm1', name: 'Lead Acid', trl: 9.0, velocity: 12, volume: 620, cluster: 'mature', growth: -5 },
  { id: 'm2', name: 'NiMH', trl: 8.8, velocity: 18, volume: 385, cluster: 'mature', growth: -2 },
  { id: 'm3', name: 'LCO Cathode', trl: 8.5, velocity: 25, volume: 255, cluster: 'mature', growth: 8 },
  { id: 'm4', name: 'Cylindrical', trl: 9.0, velocity: 35, volume: 510, cluster: 'mature', growth: 12 },
  { id: 'm5', name: 'Pouch Cell', trl: 8.2, velocity: 42, volume: 420, cluster: 'mature', growth: 15 },
  { id: 'm6', name: 'LMO Cathode', trl: 8.0, velocity: 22, volume: 195, cluster: 'mature', growth: 3 },
  { id: 'm7', name: 'Separator Film', trl: 8.5, velocity: 28, volume: 165, cluster: 'mature', growth: 6 },
  { id: 'm8', name: 'Formation', trl: 9.0, velocity: 15, volume: 135, cluster: 'mature', growth: 2 },
  { id: 'm9', name: 'Prismatic Cell', trl: 8.8, velocity: 38, volume: 320, cluster: 'mature', growth: 14 },
  { id: 'm10', name: 'Cu Foil', trl: 8.2, velocity: 20, volume: 95, cluster: 'mature', growth: 4 },
  { id: 'm11', name: 'Al Foil', trl: 8.5, velocity: 18, volume: 85, cluster: 'mature', growth: 3 },
  { id: 'm12', name: 'Electrolyte Salt', trl: 7.8, velocity: 32, volume: 145, cluster: 'mature', growth: 10 },

  // Niche - Low TRL (1-5), Low Velocity (0-50) - PURPLE/GRAY
  { id: 'n1', name: 'Zinc-Air', trl: 3.2, velocity: 28, volume: 115, cluster: 'niche', growth: 12 },
  { id: 'n2', name: 'Magnesium', trl: 2.5, velocity: 35, volume: 82, cluster: 'niche', growth: 18 },
  { id: 'n3', name: 'Aluminum-Ion', trl: 2.8, velocity: 22, volume: 68, cluster: 'niche', growth: 8 },
  { id: 'n4', name: 'Organic Battery', trl: 3.5, velocity: 42, volume: 125, cluster: 'niche', growth: 25 },
  { id: 'n5', name: 'Flow Battery', trl: 4.2, velocity: 38, volume: 150, cluster: 'niche', growth: 15 },
  { id: 'n6', name: 'Calcium-Ion', trl: 1.8, velocity: 18, volume: 45, cluster: 'niche', growth: 22 },
  { id: 'n7', name: 'Iron-Air', trl: 3.0, velocity: 45, volume: 98, cluster: 'niche', growth: 32 },
  { id: 'n8', name: 'Potassium-Ion', trl: 2.2, velocity: 32, volume: 75, cluster: 'niche', growth: 28 },
  { id: 'n9', name: 'Dual-Ion', trl: 1.5, velocity: 25, volume: 38, cluster: 'niche', growth: 15 },
  { id: 'n10', name: 'Aqueous Li', trl: 2.8, velocity: 15, volume: 55, cluster: 'niche', growth: 8 },
  { id: 'n11', name: 'Paper Battery', trl: 1.2, velocity: 12, volume: 28, cluster: 'niche', growth: 5 },
  { id: 'n12', name: 'Textile Battery', trl: 1.8, velocity: 20, volume: 42, cluster: 'niche', growth: 12 },
  { id: 'n13', name: 'Bio Battery', trl: 1.5, velocity: 8, volume: 35, cluster: 'niche', growth: 10 },
  { id: 'n14', name: 'Nuclear Battery', trl: 2.0, velocity: 5, volume: 22, cluster: 'niche', growth: 3 },
  { id: 'n15', name: 'Thermal Battery', trl: 4.0, velocity: 10, volume: 65, cluster: 'niche', growth: 5 },
  { id: 'n16', name: 'Metal-Air Gen', trl: 2.5, velocity: 28, volume: 88, cluster: 'niche', growth: 18 },
  { id: 'n17', name: 'Hybrid Capacitor', trl: 3.8, velocity: 35, volume: 105, cluster: 'niche', growth: 20 },
  { id: 'n18', name: 'Thin Film', trl: 4.5, velocity: 15, volume: 72, cluster: 'niche', growth: 6 },
];

// Max volume for normalization
export const maxVolume = Math.max(...maturityMockData.map(d => d.volume));

export const getQuadrantColor = (trl: number, velocity: number): string => {
  if (trl >= 5 && velocity >= 50) return '#4ADE80'; // Winners - Green
  if (trl < 5 && velocity >= 50) return '#38BDF8';  // Emerging - Cyan
  if (trl >= 5 && velocity < 50) return '#4ADE80';  // Mature - Also green (based on ref)
  return '#A78BFA';                                  // Niche - Purple
};

export const getQuadrantName = (trl: number, velocity: number): string => {
  if (trl >= 5 && velocity >= 50) return 'Winners';
  if (trl < 5 && velocity >= 50) return 'Emerging';
  if (trl >= 5 && velocity < 50) return 'Mature';
  return 'Niche';
};

// Cluster summary data for drill-down
export interface ClusterSummary {
  name: string;
  quadrant: 'winners' | 'emerging' | 'mature' | 'niche';
  badge: string;
  badgeEmoji: string;
  trlChange: { from: number; to: number };
  months: number;
  cohortRank: string;
  projectedScale: string;
  dominantRegion: string;
  dominantInstitution: string;
  keyRival: string;
  rivalGap: string;
  application: string;
  paperCount: number;
  growth: number;
  patents: number;
}

export const clusterSummaries: Record<string, ClusterSummary> = {
  'w1': { 
    name: 'Solid State Electrolytes', 
    quadrant: 'winners', 
    badge: 'WINNER',
    badgeEmoji: '🏆',
    trlChange: { from: 4, to: 7 }, 
    months: 18, 
    cohortRank: 'Top performer',
    projectedScale: 'Q3 2025',
    dominantRegion: 'China',
    dominantInstitution: 'CATL Research',
    keyRival: 'Japan (Toyota)',
    rivalGap: '+8 mo lead',
    application: 'High-Energy Density EV Batteries',
    paperCount: 2850, 
    growth: 67,
    patents: 345
  },
  'w3': { 
    name: 'Silicon Anode', 
    quadrant: 'winners', 
    badge: 'FAST MOVER',
    badgeEmoji: '🚀',
    trlChange: { from: 4, to: 7 }, 
    months: 12, 
    cohortRank: 'Fastest in cohort',
    projectedScale: 'Q1 2026',
    dominantRegion: 'USA',
    dominantInstitution: 'Stanford Univ.',
    keyRival: 'Korea (Samsung SDI)',
    rivalGap: '-3 mo lag',
    application: 'Next-Gen Consumer Electronics',
    paperCount: 3200, 
    growth: 72,
    patents: 280
  },
  'e1': { 
    name: 'Sodium-Ion Batteries', 
    quadrant: 'emerging', 
    badge: 'MOONSHOT',
    badgeEmoji: '🚀',
    trlChange: { from: 2, to: 4 }, 
    months: 15, 
    cohortRank: 'Fastest in cohort',
    projectedScale: 'Q2 2027',
    dominantRegion: 'China',
    dominantInstitution: 'CATL / BYD',
    keyRival: 'EU (Northvolt)',
    rivalGap: '+12 mo lead',
    application: 'Grid-Scale Energy Storage',
    paperCount: 1850, 
    growth: 120,
    patents: 95
  },
  'e9': { 
    name: 'Ionic Liquids', 
    quadrant: 'emerging', 
    badge: 'MOONSHOT',
    badgeEmoji: '🚀',
    trlChange: { from: 2, to: 4 }, 
    months: 15, 
    cohortRank: 'Fastest in cohort',
    projectedScale: 'Q2 2027',
    dominantRegion: 'USA',
    dominantInstitution: 'Stanford Univ.',
    keyRival: 'China (CAS)',
    rivalGap: '-6 mo lag',
    application: 'Safety for High-Voltage Cathodes',
    paperCount: 1850, 
    growth: 45,
    patents: 120
  },
  'm1': { 
    name: 'Lead Acid Technology', 
    quadrant: 'mature', 
    badge: 'LEGACY',
    badgeEmoji: '🏛️',
    trlChange: { from: 9, to: 9 }, 
    months: 60, 
    cohortRank: 'Stable',
    projectedScale: 'Active',
    dominantRegion: 'Global',
    dominantInstitution: 'Multiple',
    keyRival: 'N/A',
    rivalGap: 'Commoditized',
    application: 'Automotive Starting Batteries',
    paperCount: 620, 
    growth: -5,
    patents: 45
  },
  'n5': { 
    name: 'Flow Battery Systems', 
    quadrant: 'niche', 
    badge: 'SPECIALIST',
    badgeEmoji: '🔬',
    trlChange: { from: 3, to: 4 }, 
    months: 18, 
    cohortRank: 'Steady progress',
    projectedScale: 'Q4 2028',
    dominantRegion: 'China',
    dominantInstitution: 'Dalian Institute',
    keyRival: 'USA (PNNL)',
    rivalGap: '+4 mo lead',
    application: 'Long-Duration Grid Storage',
    paperCount: 450, 
    growth: 28,
    patents: 65
  },
};

// Get cluster summary by node id
export const getClusterSummary = (nodeId: string): ClusterSummary | null => {
  return clusterSummaries[nodeId] || null;
};

// Get default summary for a quadrant
export const getQuadrantSummary = (quadrant: string): ClusterSummary => {
  const defaults: Record<string, ClusterSummary> = {
    'winners': { 
      name: 'High-Performance Technologies', 
      quadrant: 'winners', 
      badge: 'WINNER',
      badgeEmoji: '🏆',
      trlChange: { from: 5, to: 7 }, 
      months: 18, 
      cohortRank: 'Top performers',
      projectedScale: 'Q2 2026',
      dominantRegion: 'China',
      dominantInstitution: 'Multiple Leaders',
      keyRival: 'USA/Japan',
      rivalGap: 'Competitive',
      application: 'EV & Grid Applications',
      paperCount: 3200, 
      growth: 45,
      patents: 520
    },
    'emerging': { 
      name: 'Next-Gen Innovation', 
      quadrant: 'emerging', 
      badge: 'MOONSHOT',
      badgeEmoji: '🚀',
      trlChange: { from: 2, to: 4 }, 
      months: 15, 
      cohortRank: 'Fast movers',
      projectedScale: 'Q3 2027',
      dominantRegion: 'USA',
      dominantInstitution: 'Academic Leaders',
      keyRival: 'China',
      rivalGap: 'Race ongoing',
      application: 'Future Energy Systems',
      paperCount: 1850, 
      growth: 85,
      patents: 180
    },
    'mature': { 
      name: 'Established Technologies', 
      quadrant: 'mature', 
      badge: 'LEGACY',
      badgeEmoji: '🏛️',
      trlChange: { from: 8, to: 9 }, 
      months: 48, 
      cohortRank: 'Stable',
      projectedScale: 'Active',
      dominantRegion: 'Global',
      dominantInstitution: 'Industry',
      keyRival: 'N/A',
      rivalGap: 'Commoditized',
      application: 'Industrial Applications',
      paperCount: 2800, 
      growth: 5,
      patents: 890
    },
    'niche': { 
      name: 'Specialized Research', 
      quadrant: 'niche', 
      badge: 'SPECIALIST',
      badgeEmoji: '🔬',
      trlChange: { from: 2, to: 3 }, 
      months: 24, 
      cohortRank: 'Exploratory',
      projectedScale: 'Q1 2029',
      dominantRegion: 'EU',
      dominantInstitution: 'Research Labs',
      keyRival: 'Multiple',
      rivalGap: 'Fragmented',
      application: 'Specialized Use Cases',
      paperCount: 950, 
      growth: 22,
      patents: 75
    },
  };
  return defaults[quadrant] || defaults['niche'];
};
