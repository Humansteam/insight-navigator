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

// Cluster-based color palette matching reference (pink/magenta, yellow/cream, cyan/blue)
const clusterColors = [
  '#E85A8F', // Pink/Magenta
  '#D4A853', // Golden Yellow
  '#4DC4E8', // Cyan/Blue
  '#F5C853', // Bright Yellow
  '#FF6B8A', // Coral Pink
  '#5BBDD4', // Teal Blue
];

// Generate consistent cluster color based on node id
const getNodeColor = (nodeId: string): string => {
  let hash = 0;
  for (let i = 0; i < nodeId.length; i++) {
    hash = nodeId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return clusterColors[Math.abs(hash) % clusterColors.length];
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

  // Determine if a node is "major" (high score = larger, with label)
  const isMajorNode = (node: DataNode) => node.score >= 0.85;

  // Initialize positions - spread major nodes far apart
  useEffect(() => {
    const newPositions = new Map<string, NodePosition>();
    const centerX = 320;
    const centerY = 260;
    
    // First, position major nodes in a wide spread
    const majorNodes = nodes.filter(isMajorNode);
    const minorNodes = nodes.filter(n => !isMajorNode(n));
    
    majorNodes.forEach((node, i) => {
      if (viewMode === 'map') {
        const baseX = 100 + node.umap_x * 480;
        const baseY = 80 + node.umap_y * 360;
        newPositions.set(node.id, { x: baseX, y: baseY, vx: 0, vy: 0 });
      } else {
        // Place major nodes in a wide circle
        const angle = (i / majorNodes.length) * Math.PI * 2 - Math.PI / 2;
        const radius = 160 + Math.random() * 40;
        newPositions.set(node.id, {
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius,
          vx: 0,
          vy: 0,
        });
      }
    });
    
    // Then scatter minor nodes throughout
    minorNodes.forEach((node, i) => {
      if (viewMode === 'map') {
        const baseX = 80 + node.umap_x * 500;
        const baseY = 60 + node.umap_y * 400;
        newPositions.set(node.id, {
          x: baseX + (Math.random() - 0.5) * 40,
          y: baseY + (Math.random() - 0.5) * 40,
          vx: 0,
          vy: 0,
        });
      } else {
        // Scatter minor nodes randomly in the space
        const angle = Math.random() * Math.PI * 2;
        const radius = 40 + Math.random() * 200;
        newPositions.set(node.id, {
          x: centerX + Math.cos(angle) * radius + (Math.random() - 0.5) * 60,
          y: centerY + Math.sin(angle) * radius + (Math.random() - 0.5) * 60,
          vx: 0,
          vy: 0,
        });
      }
    });
    
    setPositions(newPositions);
  }, [nodes, viewMode]);

  // Force simulation with better spacing for major nodes
  useEffect(() => {
    if (viewMode !== 'network' || positions.size === 0 || draggingNodeId) return;

    const simulate = () => {
      const newPositions = new Map(positions);
      const centerX = 320;
      const centerY = 240;
      const baseRepulsion = 1500;
      const attraction = 0.008; // Weaker attraction for more spread
      const damping = 0.65;
      const centerForce = 0.001; // Weaker center pull

      nodes.forEach((node) => {
        const pos = newPositions.get(node.id);
        if (!pos) return;

        let fx = 0;
        let fy = 0;
        const nodeIsMajor = isMajorNode(node);

        // Weak center force
        fx += (centerX - pos.x) * centerForce;
        fy += (centerY - pos.y) * centerForce;

        // Repulsion between nodes - MUCH stronger for major nodes
        nodes.forEach((other) => {
          if (node.id === other.id) return;
          const otherPos = newPositions.get(other.id);
          if (!otherPos) return;

          const dx = pos.x - otherPos.x;
          const dy = pos.y - otherPos.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const otherIsMajor = isMajorNode(other);
          
          // Major-to-major: very strong repulsion (keep them far apart)
          // Major-to-minor: medium repulsion
          // Minor-to-minor: weak repulsion
          let repulsionMultiplier = 1;
          let minDistance = 35;
          
          if (nodeIsMajor && otherIsMajor) {
            repulsionMultiplier = 8; // Very strong - push major nodes far apart
            minDistance = 180;
          } else if (nodeIsMajor || otherIsMajor) {
            repulsionMultiplier = 2.5;
            minDistance = 70;
          }
          
          const repulsion = baseRepulsion * repulsionMultiplier;
          
          if (dist < minDistance) {
            // Strong push when too close
            const force = (minDistance - dist) * 0.8;
            fx += (dx / dist) * force;
            fy += (dy / dist) * force;
          } else {
            const force = repulsion / (dist * dist);
            fx += (dx / dist) * force;
            fy += (dy / dist) * force;
          }
        });

        // Weaker attraction along edges
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
          
          // Weaker attraction for major nodes (they should stay spread out)
          const attractionStrength = (nodeIsMajor || isMajorNode(otherNode)) ? attraction * 0.3 : attraction;
          fx += dx * attractionStrength;
          fy += dy * attractionStrength;
        });

        pos.vx = (pos.vx + fx) * damping;
        pos.vy = (pos.vy + fy) * damping;
        pos.x += pos.vx;
        pos.y += pos.vy;
      });

      setPositions(newPositions);
    };

    let iterations = 0;
    const maxIterations = 100;

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

    // Draw nodes - minor nodes first, then major nodes on top
    const sortedNodes = [...nodes].sort((a, b) => a.score - b.score);

    sortedNodes.forEach((node) => {
      const pos = positions.get(node.id);
      if (!pos) return;

      const isSelected = selectedNodeId === node.id;
      const isHovered = hoveredNodeId === node.id;
      const isDragging = draggingNodeId === node.id;
      const isMajor = isMajorNode(node);
      
      // Size based on score - major nodes are much larger
      let radius: number;
      if (isMajor) {
        radius = 25 + (node.score - 0.8) * 80; // 25-45px for major
      } else {
        radius = 4 + node.score * 12; // 4-14px for minor
      }
      
      if (isSelected || isHovered || isDragging) {
        radius += isMajor ? 5 : 2;
      }

      const color = getNodeColor(node.id);

      // Soft outer glow
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, radius + (isMajor ? 12 : 6), 0, Math.PI * 2);
      const outerGlow = ctx.createRadialGradient(pos.x, pos.y, radius * 0.3, pos.x, pos.y, radius + (isMajor ? 12 : 6));
      outerGlow.addColorStop(0, color + '40');
      outerGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = outerGlow;
      ctx.fill();

      // Main node
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
      const nodeGradient = ctx.createRadialGradient(
        pos.x - radius * 0.25, pos.y - radius * 0.25, 0,
        pos.x, pos.y, radius * 1.1
      );
      nodeGradient.addColorStop(0, color);
      nodeGradient.addColorStop(0.7, color);
      nodeGradient.addColorStop(1, color + 'BB');
      ctx.fillStyle = nodeGradient;
      ctx.fill();

      // Inner dot for major nodes (like reference)
      if (isMajor) {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
        ctx.fill();

        // Subtle inner ring
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, radius * 0.65, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Selection ring
      if (isSelected || isDragging) {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, radius + 3, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.lineWidth = 2;
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
        let radius = isMajor ? 25 + (node.score - 0.8) * 80 : 4 + node.score * 12;
        
        // Create short label
        const title = node.title.length > 30 ? node.title.substring(0, 30) + '...' : node.title;
        ctx.font = '10px Inter, sans-serif';
        const textMetrics = ctx.measureText(title);
        const textWidth = textMetrics.width;
        
        // Label position
        const labelX = pos.x;
        const labelY = pos.y + radius + 16;
        
        // Draw label box (like reference)
        const padding = 6;
        const boxWidth = textWidth + padding * 2;
        const boxHeight = 18;
        
        ctx.fillStyle = 'rgba(35, 35, 35, 0.92)';
        ctx.beginPath();
        ctx.roundRect(labelX - boxWidth / 2, labelY - boxHeight / 2, boxWidth, boxHeight, 3);
        ctx.fill();
        
        // Box border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
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