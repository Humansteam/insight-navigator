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
    
    // Create 5-12 bridge connections
    const numBridges = 5 + Math.floor(Math.random() * 8);
    
    for (let i = 0; i < numBridges; i++) {
      const nodeA = nodesA[Math.floor(Math.random() * nodesA.length)];
      const nodeB = nodesB[Math.floor(Math.random() * nodesB.length)];
      
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
