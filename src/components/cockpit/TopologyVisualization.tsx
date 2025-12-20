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

// Soft pastel color palette like in reference image
const nodeColors = [
  '#E8A87C', // Coral/Peach
  '#85DCBA', // Mint Green
  '#7FBBE9', // Sky Blue
  '#C9A7C7', // Lavender
  '#F5D76E', // Soft Yellow
  '#F1948A', // Salmon
  '#B8B8B8', // Warm Grey
  '#9FD5D1', // Teal
  '#D4A5A5', // Dusty Rose
  '#A3C4BC', // Sage
];

// Generate consistent color based on node id
const getNodeColor = (nodeId: string): string => {
  let hash = 0;
  for (let i = 0; i < nodeId.length; i++) {
    hash = nodeId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return nodeColors[Math.abs(hash) % nodeColors.length];
};

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

  // Initialize positions
  useEffect(() => {
    const newPositions = new Map<string, NodePosition>();
    const centerX = 280;
    const centerY = 200;
    
    nodes.forEach((node, i) => {
      if (viewMode === 'map') {
        const baseX = 80 + node.umap_x * 400;
        const baseY = 60 + node.umap_y * 300;
        const offsetX = (i % 5 - 2) * 20;
        const offsetY = (Math.floor(i / 5) % 5 - 2) * 20;
        newPositions.set(node.id, {
          x: baseX + offsetX,
          y: baseY + offsetY,
          vx: 0,
          vy: 0,
        });
      } else {
        const angle = (i / nodes.length) * Math.PI * 2 + Math.random() * 0.5;
        const radius = 80 + Math.random() * 120;
        newPositions.set(node.id, {
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius,
          vx: 0,
          vy: 0,
        });
      }
    });
    setPositions(newPositions);
  }, [nodes, viewMode]);

  // Force simulation for network mode
  useEffect(() => {
    if (viewMode !== 'network' || positions.size === 0 || draggingNodeId) return;

    const simulate = () => {
      const newPositions = new Map(positions);
      const centerX = 280;
      const centerY = 200;
      const repulsion = 3000;
      const attraction = 0.015;
      const damping = 0.75;
      const centerForce = 0.003;

      nodes.forEach((node) => {
        const pos = newPositions.get(node.id);
        if (!pos) return;

        let fx = 0;
        let fy = 0;

        // Center force
        fx += (centerX - pos.x) * centerForce;
        fy += (centerY - pos.y) * centerForce;

        // Repulsion between all nodes
        nodes.forEach((other) => {
          if (node.id === other.id) return;
          const otherPos = newPositions.get(other.id);
          if (!otherPos) return;

          const dx = pos.x - otherPos.x;
          const dy = pos.y - otherPos.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = repulsion / (dist * dist);
          fx += (dx / dist) * force;
          fy += (dy / dist) * force;
        });

        // Attraction along edges
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
          fx += dx * attraction;
          fy += dy * attraction;
        });

        pos.vx = (pos.vx + fx) * damping;
        pos.vy = (pos.vy + fy) * damping;
        pos.x += pos.vx;
        pos.y += pos.vy;
      });

      setPositions(newPositions);
    };

    let iterations = 0;
    const maxIterations = 80;

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

    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);

    // Draw edges - thin curved lines
    edges.forEach((edge) => {
      const sourcePos = positions.get(edge.source_id);
      const targetPos = positions.get(edge.target_id);
      if (!sourcePos || !targetPos) return;

      const sourceColor = getNodeColor(edge.source_id);
      const targetColor = getNodeColor(edge.target_id);

      // Calculate midpoint with slight curve
      const midX = (sourcePos.x + targetPos.x) / 2;
      const midY = (sourcePos.y + targetPos.y) / 2;
      const dx = targetPos.x - sourcePos.x;
      const dy = targetPos.y - sourcePos.y;
      const perpX = -dy * 0.1;
      const perpY = dx * 0.1;

      // Create gradient
      const gradient = ctx.createLinearGradient(
        sourcePos.x, sourcePos.y,
        targetPos.x, targetPos.y
      );
      gradient.addColorStop(0, sourceColor + '40');
      gradient.addColorStop(0.5, 'rgba(180, 180, 180, 0.25)');
      gradient.addColorStop(1, targetColor + '40');

      ctx.beginPath();
      ctx.moveTo(sourcePos.x, sourcePos.y);
      ctx.quadraticCurveTo(midX + perpX, midY + perpY, targetPos.x, targetPos.y);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 0.8;
      ctx.stroke();
    });

    // Draw nodes
    nodes.forEach((node) => {
      const pos = positions.get(node.id);
      if (!pos) return;

      const isSelected = selectedNodeId === node.id;
      const isHovered = hoveredNodeId === node.id;
      const isDragging = draggingNodeId === node.id;
      const baseRadius = 6 + (node.score * 14);
      const radius = isSelected || isHovered || isDragging ? baseRadius + 4 : baseRadius;
      const color = getNodeColor(node.id);

      // Soft outer glow for all nodes
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, radius + 8, 0, Math.PI * 2);
      const outerGlow = ctx.createRadialGradient(pos.x, pos.y, radius * 0.5, pos.x, pos.y, radius + 8);
      outerGlow.addColorStop(0, color + '30');
      outerGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = outerGlow;
      ctx.fill();

      // Enhanced glow for interactive states
      if (isSelected || isHovered || isDragging) {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, radius + 20, 0, Math.PI * 2);
        const glowGradient = ctx.createRadialGradient(pos.x, pos.y, radius, pos.x, pos.y, radius + 20);
        glowGradient.addColorStop(0, color + '50');
        glowGradient.addColorStop(0.5, color + '20');
        glowGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = glowGradient;
        ctx.fill();
      }

      // Main node circle with subtle gradient
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
      const nodeGradient = ctx.createRadialGradient(
        pos.x - radius * 0.3, pos.y - radius * 0.3, 0,
        pos.x, pos.y, radius * 1.2
      );
      nodeGradient.addColorStop(0, color);
      nodeGradient.addColorStop(0.6, color);
      nodeGradient.addColorStop(1, color + 'CC');
      ctx.fillStyle = nodeGradient;
      ctx.fill();

      // Inner dot (center marker)
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fill();

      // Subtle ring pattern
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, radius * 0.7, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 0.5;
      ctx.stroke();

      // Outer border
      if (isSelected || isDragging) {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, radius + 2, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Label for selected/hovered nodes
      if (isSelected || isHovered) {
        const authors = node.authors[0]?.split(',')[0] || 'Unknown';
        const label = `${authors}, ${node.year}`;
        ctx.font = '10px Inter, sans-serif';
        
        // Label background
        const textWidth = ctx.measureText(label).width;
        const labelX = pos.x - textWidth / 2 - 6;
        const labelY = pos.y + radius + 10;
        
        ctx.fillStyle = 'rgba(40, 40, 40, 0.85)';
        ctx.beginPath();
        ctx.roundRect(labelX, labelY, textWidth + 12, 18, 4);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(label, pos.x, labelY + 13);
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

    // Check nodes in reverse order (top nodes first)
    for (let i = nodes.length - 1; i >= 0; i--) {
      const node = nodes[i];
      const pos = positions.get(node.id);
      if (!pos) continue;

      const radius = 6 + (node.score * 14) + 8;
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
      // Move the dragged node
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

    // Hover detection
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

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className="rounded-lg border border-border overflow-hidden flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-2 border-b border-border flex items-center justify-between shrink-0 bg-muted/30">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground px-1">
          Topology Visualization
        </span>
        <div className="flex items-center gap-2">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
            <TabsList className="h-7">
              <TabsTrigger value="map" className="text-xs h-6 px-3">Map</TabsTrigger>
              <TabsTrigger value="network" className="text-xs h-6 px-3">Network</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex items-center gap-0.5 ml-2">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setZoom(z => Math.max(0.5, z - 0.2))}>
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
        />
        
        {/* Hint */}
        <div className="absolute bottom-3 left-3 text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-border/50">
          Drag nodes to reposition • Scroll to pan
        </div>
      </div>
    </div>
  );
};