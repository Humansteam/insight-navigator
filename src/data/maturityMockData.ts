import { MaturityNode } from '@/types/morphik';

// Generate mock data for Maturity Matrix
// Distributed across 4 quadrants:
// - Winners (top-right): High TRL (5-9), High Velocity (50-100)
// - Emerging (top-left): Low TRL (1-5), High Velocity (50-100)
// - Mature (bottom-right): High TRL (5-9), Low Velocity (0-50)
// - Niche (bottom-left): Low TRL (1-5), Low Velocity (0-50)

export const maturityMockData: MaturityNode[] = [
  // Winners - High TRL, High Velocity (8 points)
  { id: 'w1', name: 'Solid State', trl: 7.2, velocity: 85, volume: 340, cluster: 'winners', growth: 45 },
  { id: 'w2', name: 'LFP Cathode', trl: 8.5, velocity: 78, volume: 280, cluster: 'winners', growth: 32 },
  { id: 'w3', name: 'Silicon Anode', trl: 6.8, velocity: 92, volume: 420, cluster: 'winners', growth: 67 },
  { id: 'w4', name: 'Fast Charging', trl: 7.5, velocity: 72, volume: 195, cluster: 'winners', growth: 28 },
  { id: 'w5', name: 'NMC 811', trl: 8.2, velocity: 65, volume: 310, cluster: 'winners', growth: 22 },
  { id: 'w6', name: 'Dry Electrode', trl: 6.1, velocity: 88, volume: 165, cluster: 'winners', growth: 55 },
  { id: 'w7', name: 'Cell-to-Pack', trl: 7.8, velocity: 58, volume: 145, cluster: 'winners', growth: 18 },
  { id: 'w8', name: 'BMS AI', trl: 6.5, velocity: 75, volume: 220, cluster: 'winners', growth: 42 },

  // Emerging - Low TRL, High Velocity (6 points)
  { id: 'e1', name: 'Sodium-Ion', trl: 4.2, velocity: 95, volume: 380, cluster: 'emerging', growth: 120 },
  { id: 'e2', name: 'Lithium-Air', trl: 2.8, velocity: 72, volume: 95, cluster: 'emerging', growth: 85 },
  { id: 'e3', name: 'Sulfur Battery', trl: 3.5, velocity: 68, volume: 142, cluster: 'emerging', growth: 58 },
  { id: 'e4', name: 'Quantum Dots', trl: 2.2, velocity: 82, volume: 75, cluster: 'emerging', growth: 95 },
  { id: 'e5', name: 'Graphene Anode', trl: 3.8, velocity: 78, volume: 185, cluster: 'emerging', growth: 72 },
  { id: 'e6', name: 'Solid Polymer', trl: 4.5, velocity: 62, volume: 120, cluster: 'emerging', growth: 48 },

  // Mature - High TRL, Low Velocity (6 points)
  { id: 'm1', name: 'Lead Acid', trl: 9.0, velocity: 12, volume: 520, cluster: 'mature', growth: -5 },
  { id: 'm2', name: 'NiMH', trl: 8.8, velocity: 18, volume: 285, cluster: 'mature', growth: -2 },
  { id: 'm3', name: 'LCO Cathode', trl: 8.5, velocity: 25, volume: 195, cluster: 'mature', growth: 8 },
  { id: 'm4', name: 'Cylindrical', trl: 9.0, velocity: 35, volume: 410, cluster: 'mature', growth: 12 },
  { id: 'm5', name: 'Pouch Cell', trl: 8.2, velocity: 42, volume: 320, cluster: 'mature', growth: 15 },
  { id: 'm6', name: 'LMO Cathode', trl: 8.0, velocity: 22, volume: 145, cluster: 'mature', growth: 3 },

  // Niche - Low TRL, Low Velocity (8 points)
  { id: 'n1', name: 'Zinc-Air', trl: 3.2, velocity: 28, volume: 85, cluster: 'niche', growth: 12 },
  { id: 'n2', name: 'Magnesium', trl: 2.5, velocity: 35, volume: 62, cluster: 'niche', growth: 18 },
  { id: 'n3', name: 'Aluminum-Ion', trl: 2.8, velocity: 22, volume: 48, cluster: 'niche', growth: 8 },
  { id: 'n4', name: 'Organic Battery', trl: 3.5, velocity: 42, volume: 95, cluster: 'niche', growth: 25 },
  { id: 'n5', name: 'Flow Battery', trl: 4.2, velocity: 38, volume: 110, cluster: 'niche', growth: 15 },
  { id: 'n6', name: 'Calcium-Ion', trl: 1.8, velocity: 18, volume: 35, cluster: 'niche', growth: 22 },
  { id: 'n7', name: 'Iron-Air', trl: 3.0, velocity: 45, volume: 78, cluster: 'niche', growth: 32 },
  { id: 'n8', name: 'Potassium-Ion', trl: 2.2, velocity: 32, volume: 55, cluster: 'niche', growth: 28 },
];

export const getQuadrantColor = (trl: number, velocity: number): string => {
  if (trl >= 5 && velocity >= 50) return '#4ADE80'; // Winners - Green
  if (trl < 5 && velocity >= 50) return '#38BDF8';  // Emerging - Cyan
  if (trl >= 5 && velocity < 50) return '#FBBF24';  // Mature - Amber
  return '#A78BFA';                                  // Niche - Purple
};

export const getQuadrantName = (trl: number, velocity: number): string => {
  if (trl >= 5 && velocity >= 50) return 'Winners';
  if (trl < 5 && velocity >= 50) return 'Emerging';
  if (trl >= 5 && velocity < 50) return 'Mature';
  return 'Niche';
};
