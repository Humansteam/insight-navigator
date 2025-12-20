import { DataNode, DataEdge } from '@/types/morphik';

// 5 cluster colors matching the visualization
const CLUSTER_NAMES = ['cluster-pink', 'cluster-orange', 'cluster-yellow', 'cluster-cyan', 'cluster-blue'];
const COUNTRIES: Array<'china' | 'usa' | 'europe' | 'other'> = ['china', 'usa', 'europe', 'other'];

// Deterministic cluster assignment from node id
export const getClusterIndex = (nodeId: string): number => {
  let hash = 0;
  for (let i = 0; i < nodeId.length; i++) {
    hash = nodeId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 5;
};

// Generate satellite nodes for each cluster
export function generateSatelliteNodes(baseNodes: DataNode[]): DataNode[] {
  const satellites: DataNode[] = [];
  const nodesPerCluster = 40; // 40 satellites per cluster = 200 total

  for (let clusterIdx = 0; clusterIdx < 5; clusterIdx++) {
    for (let i = 0; i < nodesPerCluster; i++) {
      const id = `sat-${clusterIdx}-${i.toString().padStart(3, '0')}`;
      
      // Deterministic but varied properties
      const seed = clusterIdx * 1000 + i;
      const score = 0.15 + (seed % 30) / 100; // 0.15-0.45
      const year = 2020 + (seed % 5);
      const country = COUNTRIES[seed % 4];
      
      satellites.push({
        id,
        title: `Study ${clusterIdx + 1}.${i + 1}`,
        umap_x: 0, // Will be positioned by visualization
        umap_y: 0,
        cluster_label: CLUSTER_NAMES[clusterIdx],
        country,
        score,
        year,
        authors: [`Author ${i}`],
        abstract: '',
        citations: seed % 50,
        dimensions: {},
      });
    }
  }

  return satellites;
}

// Generate intra-cluster connections (dense internal network)
export function generateIntraClusterEdges(nodes: DataNode[]): DataEdge[] {
  const edges: DataEdge[] = [];
  
  // Group nodes by cluster
  const clusters: Map<number, DataNode[]> = new Map();
  nodes.forEach(node => {
    const idx = getClusterIndex(node.id);
    if (!clusters.has(idx)) clusters.set(idx, []);
    clusters.get(idx)!.push(node);
  });

  // For each cluster, connect each node to 5-8 neighbors
  clusters.forEach((clusterNodes) => {
    clusterNodes.forEach((node, i) => {
      // Connect to 5-8 random neighbors within same cluster
      const numConnections = 5 + (i % 4);
      const shuffled = [...clusterNodes].sort(() => 0.5 - Math.random());
      
      for (let j = 0; j < Math.min(numConnections, shuffled.length); j++) {
        const target = shuffled[j];
        if (target.id !== node.id) {
          // Avoid duplicate edges
          const exists = edges.some(e => 
            (e.source_id === node.id && e.target_id === target.id) ||
            (e.source_id === target.id && e.target_id === node.id)
          );
          if (!exists) {
            edges.push({
              source_id: node.id,
              target_id: target.id,
              weight: 0.4 + Math.random() * 0.4,
            });
          }
        }
      }
    });
  });

  return edges;
}

// Cluster centers for boundary node selection
const CLUSTER_CENTERS: Record<number, { x: number; y: number }> = {
  0: { x: 0.15, y: 0.25 },  // pink - top left
  1: { x: 0.75, y: 0.15 },  // orange - top right
  2: { x: 0.50, y: 0.50 },  // yellow - center
  3: { x: 0.20, y: 0.75 },  // cyan - bottom left
  4: { x: 0.80, y: 0.75 },  // blue - bottom right
};

// Generate inter-cluster bridges (bundles of connections between clusters)
export function generateInterClusterEdges(nodes: DataNode[]): DataEdge[] {
  const edges: DataEdge[] = [];
  
  // Group nodes by cluster
  const clusters: Map<number, DataNode[]> = new Map();
  nodes.forEach(node => {
    const idx = getClusterIndex(node.id);
    if (!clusters.has(idx)) clusters.set(idx, []);
    clusters.get(idx)!.push(node);
  });

  // Define bridge pairs (which clusters connect to which)
  const bridges: [number, number][] = [
    [0, 1], // pink-orange
    [0, 2], // pink-yellow
    [1, 2], // orange-yellow
    [2, 3], // yellow-cyan
    [2, 4], // yellow-blue
    [3, 4], // cyan-blue
    [1, 3], // orange-cyan
  ];

  bridges.forEach(([clusterA, clusterB]) => {
    const nodesA = clusters.get(clusterA) || [];
    const nodesB = clusters.get(clusterB) || [];
    
    if (nodesA.length === 0 || nodesB.length === 0) return;

    const centerA = CLUSTER_CENTERS[clusterA];
    const centerB = CLUSTER_CENTERS[clusterB];

    // Sort nodes by distance to the OTHER cluster's center (boundary nodes first)
    const sortedA = [...nodesA].sort((a, b) => {
      const distA = Math.hypot(centerB.x - (a.umap_x || 0), centerB.y - (a.umap_y || 0));
      const distB = Math.hypot(centerB.x - (b.umap_x || 0), centerB.y - (b.umap_y || 0));
      return distA - distB;
    });

    const sortedB = [...nodesB].sort((a, b) => {
      const distA = Math.hypot(centerA.x - (a.umap_x || 0), centerA.y - (a.umap_y || 0));
      const distB = Math.hypot(centerA.x - (b.umap_x || 0), centerA.y - (b.umap_y || 0));
      return distA - distB;
    });

    // Take top 30% of boundary nodes from each cluster
    const boundaryCountA = Math.max(5, Math.floor(sortedA.length * 0.3));
    const boundaryCountB = Math.max(5, Math.floor(sortedB.length * 0.3));
    const boundaryA = sortedA.slice(0, boundaryCountA);
    const boundaryB = sortedB.slice(0, boundaryCountB);
    
    // Create 20-35 bridge connections from boundary nodes
    const numBridges = 20 + Math.floor(Math.random() * 16);
    
    for (let i = 0; i < numBridges; i++) {
      const nodeA = boundaryA[Math.floor(Math.random() * boundaryA.length)];
      const nodeB = boundaryB[Math.floor(Math.random() * boundaryB.length)];
      
      if (nodeA && nodeB) {
        edges.push({
          source_id: nodeA.id,
          target_id: nodeB.id,
          weight: 0.3 + Math.random() * 0.4,
        });
      }
    }
  });

  return edges;
}

// Combine everything
export function generateTopologyData(baseNodes: DataNode[], baseEdges: DataEdge[]): {
  nodes: DataNode[];
  edges: DataEdge[];
} {
  const satellites = generateSatelliteNodes(baseNodes);
  const allNodes = [...baseNodes, ...satellites];
  
  const intraEdges = generateIntraClusterEdges(allNodes);
  const interEdges = generateInterClusterEdges(allNodes);
  
  // Combine but limit total edges for performance
  const allEdges = [...baseEdges, ...intraEdges.slice(0, 400), ...interEdges];
  
  return { nodes: allNodes, edges: allEdges };
}
