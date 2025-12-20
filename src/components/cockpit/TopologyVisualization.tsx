import { useRef, useEffect, useState, useCallback } from 'react';
import { ZoomIn, ZoomOut, Locate } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataNode, DataEdge } from '@/types/morphik';

interface TopologyVisualizationProps {
  nodes: DataNode[];
  edges: DataEdge[];
  selectedNodeId: string | null;
  onSelectNode: (id: string | null) => void;
  hoveredNodeId: string | null;
  onHoverNode: (id: string | null) => void;
}

type ViewMode = 'map' | 'network';

interface NodePosition {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

// 5 cluster colors like in reference
const clusterColors = [
  '#FF5A7F', // Pink/Red (bottom left)
  '#D97B3D', // Orange (middle left)
  '#E8C547', // Yellow (center)
  '#4DC4C4', // Cyan/Teal (top right)
  '#6BA8DC', // Blue (bottom right)
];

// Get cluster index (0-4) from node id - deterministic
const getClusterIndex = (nodeId: string): number => {
  let hash = 0;
  for (let i = 0; i < nodeId.length; i++) {
    hash = nodeId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 5;
};

// Generate consistent cluster color based on node id
const getNodeColor = (nodeId: string): string => {
  return clusterColors[getClusterIndex(nodeId)];
};

// Cluster center positions (5 clusters spread around)
const clusterCenters = [
  { x: 0.15, y: 0.75 }, // Pink - bottom left
  { x: 0.25, y: 0.4 },  // Orange - middle left
  { x: 0.5, y: 0.55 },  // Yellow - center bottom
  { x: 0.55, y: 0.25 }, // Cyan - top center
  { x: 0.8, y: 0.5 },   // Blue - right
];

export const TopologyVisualization = ({
  nodes,
  edges,
  selectedNodeId,
  onSelectNode,
  hoveredNodeId,
  onHoverNode,
}: TopologyVisualizationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('network');
  const [positions, setPositions] = useState<Map<string, NodePosition>>(new Map());
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const animationRef = useRef<number>();
  const lastMousePos = useRef({ x: 0, y: 0 });

  // Determine if a node is "major" (high score = larger, with label)
  const isMajorNode = (node: DataNode) => node.score >= 0.85;

  // Initialize positions - cluster nodes together based on their cluster index
  useEffect(() => {
    const newPositions = new Map<string, NodePosition>();
    const width = 640;
    const height = 480;
    
    // Group nodes by cluster
    const nodesByCluster: Map<number, DataNode[]> = new Map();
    nodes.forEach(node => {
      const clusterIdx = getClusterIndex(node.id);
      if (!nodesByCluster.has(clusterIdx)) {
        nodesByCluster.set(clusterIdx, []);
      }
      nodesByCluster.get(clusterIdx)!.push(node);
    });
    
    // Position each node near its cluster center
    nodes.forEach((node) => {
      const clusterIdx = getClusterIndex(node.id);
      const center = clusterCenters[clusterIdx];
      const isMajor = isMajorNode(node);
      
      // Cluster spread radius
      const spreadRadius = isMajor ? 20 + Math.random() * 30 : 30 + Math.random() * 60;
      const angle = Math.random() * Math.PI * 2;
      
      const x = center.x * width + Math.cos(angle) * spreadRadius;
      const y = center.y * height + Math.sin(angle) * spreadRadius;
      
      newPositions.set(node.id, { x, y, vx: 0, vy: 0 });
    });
    
    setPositions(newPositions);
  }, [nodes, viewMode]);

  // Force simulation - cluster nodes together, separate clusters
  useEffect(() => {
    if (viewMode !== 'network' || positions.size === 0 || draggingNodeId) return;

    const width = 640;
    const height = 480;

    const simulate = () => {
      const newPositions = new Map(positions);
      const damping = 0.6;

      nodes.forEach((node) => {
        const pos = newPositions.get(node.id);
        if (!pos) return;

        const nodeCluster = getClusterIndex(node.id);
        const nodeIsMajor = isMajorNode(node);
        let fx = 0;
        let fy = 0;

        // Strong pull toward cluster center
        const center = clusterCenters[nodeCluster];
        const centerX = center.x * width;
        const centerY = center.y * height;
        fx += (centerX - pos.x) * 0.02;
        fy += (centerY - pos.y) * 0.02;

        // Repulsion/attraction between nodes
        nodes.forEach((other) => {
          if (node.id === other.id) return;
          const otherPos = newPositions.get(other.id);
          if (!otherPos) return;

          const dx = pos.x - otherPos.x;
          const dy = pos.y - otherPos.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const otherCluster = getClusterIndex(other.id);
          const sameCluster = nodeCluster === otherCluster;

          if (sameCluster) {
            // Same cluster: weak repulsion to prevent overlap, weak attraction to stay together
            if (dist < 20) {
              const force = (20 - dist) * 0.3;
              fx += (dx / dist) * force;
              fy += (dy / dist) * force;
            } else if (dist > 80) {
              // Pull back toward cluster if too far
              fx -= (dx / dist) * 0.5;
              fy -= (dy / dist) * 0.5;
            }
          } else {
            // Different cluster: strong repulsion to keep clusters separate
            if (dist < 120) {
              const force = (120 - dist) * 0.15;
              fx += (dx / dist) * force;
              fy += (dy / dist) * force;
            }
          }
        });

        // Edge attraction (weaker)
        edges.forEach((edge) => {
          let otherNode: DataNode | undefined;
          if (edge.source_id === node.id) {
            otherNode = nodes.find((n) => n.id === edge.target_id);
          } else if (edge.target_id === node.id) {
            otherNode = nodes.find((n) => n.id === edge.source_id);
          }
          if (!otherNode) return;

          const otherPos = newPositions.get(otherNode.id);
          if (!otherPos) return;

          const dx = otherPos.x - pos.x;
          const dy = otherPos.y - pos.y;
          
          // Weak attraction along edges
          fx += dx * 0.003;
          fy += dy * 0.003;
        });

        pos.vx = (pos.vx + fx) * damping;
        pos.vy = (pos.vy + fy) * damping;
        pos.x += pos.vx;
        pos.y += pos.vy;
        
        // Keep in bounds
        pos.x = Math.max(40, Math.min(width - 40, pos.x));
        pos.y = Math.max(40, Math.min(height - 40, pos.y));
      });

      setPositions(newPositions);
    };

    let iterations = 0;
    const maxIterations = 150;

    const tick = () => {
      if (iterations < maxIterations) {
        simulate();
        iterations++;
        animationRef.current = requestAnimationFrame(tick);
      }
    };

    tick();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [nodes, edges, positions.size, viewMode, draggingNodeId]);

  // Draw canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = container.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    // Dark cosmic background
    ctx.fillStyle = '#0a0e18';
    ctx.fillRect(0, 0, rect.width, rect.height);
    
    // Draw grid for depth effect (like in reference)
    const gridSpacing = 40;
    ctx.strokeStyle = 'rgba(60, 80, 120, 0.15)';
    ctx.lineWidth = 0.5;
    
    // Vertical lines
    for (let x = 0; x < rect.width; x += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, rect.height);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = 0; y < rect.height; y += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(rect.width, y);
      ctx.stroke();
    }
    
    // Draw subtle glowing dots at grid intersections
    for (let x = 0; x < rect.width; x += gridSpacing) {
      for (let y = 0; y < rect.height; y += gridSpacing) {
        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(80, 120, 180, 0.3)';
        ctx.fill();
      }
    }

    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);

    // Check if edge is connected to hovered node
    const isEdgeHighlighted = (edge: DataEdge) => {
      return hoveredNodeId && (edge.source_id === hoveredNodeId || edge.target_id === hoveredNodeId);
    };

    // Draw non-highlighted edges first - super thin hair-like lines
    edges.forEach((edge) => {
      if (isEdgeHighlighted(edge)) return;
      
      const sourcePos = positions.get(edge.source_id);
      const targetPos = positions.get(edge.target_id);
      if (!sourcePos || !targetPos) return;

      const sourceColor = getNodeColor(edge.source_id);

      // Straight thin lines (like reference)
      ctx.beginPath();
      ctx.moveTo(sourcePos.x, sourcePos.y);
      ctx.lineTo(targetPos.x, targetPos.y);
      ctx.strokeStyle = sourceColor + '30'; // Very transparent
      ctx.lineWidth = 0.3; // Super thin
      ctx.stroke();
    });

    // Draw highlighted edges on top - slightly brighter but still thin
    edges.forEach((edge) => {
      if (!isEdgeHighlighted(edge)) return;
      
      const sourcePos = positions.get(edge.source_id);
      const targetPos = positions.get(edge.target_id);
      if (!sourcePos || !targetPos) return;

      const sourceColor = getNodeColor(edge.source_id);

      // Subtle glow
      ctx.beginPath();
      ctx.moveTo(sourcePos.x, sourcePos.y);
      ctx.lineTo(targetPos.x, targetPos.y);
      ctx.strokeStyle = sourceColor + '40';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Bright thin line
      ctx.beginPath();
      ctx.moveTo(sourcePos.x, sourcePos.y);
      ctx.lineTo(targetPos.x, targetPos.y);
      ctx.strokeStyle = sourceColor + 'CC';
      ctx.lineWidth = 0.8;
      ctx.stroke();
    });

    // Draw nodes - minor nodes first, then major nodes on top (glowing synapse style)
    const sortedNodes = [...nodes].sort((a, b) => a.score - b.score);

    sortedNodes.forEach((node) => {
      const pos = positions.get(node.id);
      if (!pos) return;

      const isSelected = selectedNodeId === node.id;
      const isHovered = hoveredNodeId === node.id;
      const isDragging = draggingNodeId === node.id;
      const isMajor = isMajorNode(node);
      
      // Size based on score
      let radius: number;
      if (isMajor) {
        radius = 8 + (node.score - 0.8) * 30; // 8-14px for major
      } else {
        radius = 2 + node.score * 4; // 2-5px for minor
      }
      
      if (isSelected || isHovered || isDragging) {
        radius += isMajor ? 3 : 1.5;
      }

      const color = getNodeColor(node.id);

      // Large outer glow (synapse effect)
      const glowRadius = radius * (isMajor ? 5 : 4);
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, glowRadius, 0, Math.PI * 2);
      const outerGlow = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, glowRadius);
      outerGlow.addColorStop(0, color + '35');
      outerGlow.addColorStop(0.3, color + '18');
      outerGlow.addColorStop(0.7, color + '08');
      outerGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = outerGlow;
      ctx.fill();

      // Medium glow ring
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, radius * 2.5, 0, Math.PI * 2);
      const midGlow = ctx.createRadialGradient(pos.x, pos.y, radius * 0.5, pos.x, pos.y, radius * 2.5);
      midGlow.addColorStop(0, color + '60');
      midGlow.addColorStop(0.5, color + '25');
      midGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = midGlow;
      ctx.fill();

      // Core node - bright center
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
      const coreGradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, radius);
      coreGradient.addColorStop(0, '#ffffff');
      coreGradient.addColorStop(0.3, color);
      coreGradient.addColorStop(1, color + 'CC');
      ctx.fillStyle = coreGradient;
      ctx.fill();

      // Bright white center dot
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, radius * 0.35, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fill();

      // Selection ring
      if (isSelected || isDragging) {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, radius + 4, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    });

    // Draw labels for major nodes AFTER all nodes (on top)
    sortedNodes.forEach((node) => {
      const pos = positions.get(node.id);
      if (!pos) return;

      const isMajor = isMajorNode(node);
      const isSelected = selectedNodeId === node.id;
      const isHovered = hoveredNodeId === node.id;
      
      // Labels for major nodes or hovered/selected nodes
      if (isMajor || isSelected || isHovered) {
        let radius = isMajor ? 8 + (node.score - 0.8) * 30 : 2 + node.score * 4;
        
        // Create short label
        const title = node.title.length > 25 ? node.title.substring(0, 25) + '...' : node.title;
        ctx.font = '9px Inter, sans-serif';
        const textMetrics = ctx.measureText(title);
        const textWidth = textMetrics.width;
        
        // Label position
        const labelX = pos.x;
        const labelY = pos.y + radius + 14;
        
        // Draw label box (blue like reference)
        const padding = 5;
        const boxWidth = textWidth + padding * 2;
        const boxHeight = 16;
        
        ctx.fillStyle = 'rgba(40, 80, 160, 0.9)';
        ctx.beginPath();
        ctx.roundRect(labelX - boxWidth / 2, labelY - boxHeight / 2, boxWidth, boxHeight, 2);
        ctx.fill();
        
        // Box border
        ctx.strokeStyle = 'rgba(100, 150, 220, 0.6)';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Text
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(title, labelX, labelY);
      }
    });

    ctx.restore();
  }, [positions, edges, nodes, selectedNodeId, hoveredNodeId, draggingNodeId, zoom, pan]);

  // Find node at position
  const findNodeAtPosition = useCallback((clientX: number, clientY: number): string | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const x = (clientX - rect.left - pan.x) / zoom;
    const y = (clientY - rect.top - pan.y) / zoom;

    // Check major nodes first (they're on top visually)
    const sortedNodes = [...nodes].sort((a, b) => b.score - a.score);
    
    for (const node of sortedNodes) {
      const pos = positions.get(node.id);
      if (!pos) continue;

      const isMajor = isMajorNode(node);
      let radius = isMajor ? 25 + (node.score - 0.8) * 80 : 4 + node.score * 12;
      radius += 8; // Hit area padding

      const dist = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);

      if (dist < radius) {
        return node.id;
      }
    }
    return null;
  }, [nodes, positions, pan, zoom]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    
    const nodeId = findNodeAtPosition(e.clientX, e.clientY);
    if (nodeId) {
      setDraggingNodeId(nodeId);
      onSelectNode(nodeId);
    } else {
      setIsDraggingCanvas(true);
    }
  }, [findNodeAtPosition, onSelectNode]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    lastMousePos.current = { x: e.clientX, y: e.clientY };

    if (draggingNodeId) {
      setPositions(prev => {
        const newPositions = new Map(prev);
        const pos = newPositions.get(draggingNodeId);
        if (pos) {
          pos.x += dx / zoom;
          pos.y += dy / zoom;
          pos.vx = 0;
          pos.vy = 0;
        }
        return newPositions;
      });
      return;
    }

    if (isDraggingCanvas) {
      setPan(prev => ({
        x: prev.x + dx,
        y: prev.y + dy,
      }));
      return;
    }

    const nodeId = findNodeAtPosition(e.clientX, e.clientY);
    onHoverNode(nodeId);
  }, [draggingNodeId, isDraggingCanvas, findNodeAtPosition, onHoverNode, zoom]);

  const handleMouseUp = useCallback(() => {
    setDraggingNodeId(null);
    setIsDraggingCanvas(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setDraggingNodeId(null);
    setIsDraggingCanvas(false);
    onHoverNode(null);
  }, [onHoverNode]);

  const handleWheel = useCallback((e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(z => Math.max(0.3, Math.min(3, z + delta)));
  }, []);

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className="rounded-lg border border-border overflow-hidden flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-2 border-b border-border flex items-center justify-between shrink-0 bg-muted/30">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground px-1">
          Topology
        </span>
        <div className="flex items-center gap-2">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
            <TabsList className="h-7">
              <TabsTrigger value="map" className="text-xs h-6 px-3">Map</TabsTrigger>
              <TabsTrigger value="network" className="text-xs h-6 px-3">Network</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex items-center gap-0.5 ml-2">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setZoom(z => Math.max(0.3, z - 0.2))}>
              <ZoomOut className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setZoom(z => Math.min(3, z + 0.2))}>
              <ZoomIn className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={resetView}>
              <Locate className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div ref={containerRef} className="flex-1 relative overflow-hidden min-h-0">
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 w-full h-full ${draggingNodeId ? 'cursor-grabbing' : 'cursor-grab'}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onWheel={handleWheel}
        />
        
        {/* Hint */}
        <div className="absolute bottom-3 left-3 text-[10px] text-muted-foreground/70 bg-background/70 backdrop-blur-sm px-2 py-1 rounded border border-border/30">
          Drag nodes • Scroll to zoom
        </div>
      </div>
    </div>
  );
};