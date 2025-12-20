import { useRef, useEffect, useState, useCallback } from 'react';
import { ZoomIn, ZoomOut, Locate } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataNode, DataEdge } from '@/types/morphik';
import { cn } from '@/lib/utils';

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

// Stylish color palette inspired by modern design
const countryColors: Record<string, string> = {
  china: '#FF9408',    // Merin's Fire - vibrant orange
  usa: '#16E9D7',      // Polar Aqua - teal
  europe: '#1845CD',   // Liquid Sapphire - deep blue
  other: '#732553',    // Pico Eggplant - purple
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
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [positions, setPositions] = useState<Map<string, NodePosition>>(new Map());
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const animationRef = useRef<number>();

  // Initialize positions with better separation
  useEffect(() => {
    const newPositions = new Map<string, NodePosition>();
    const centerX = 280;
    const centerY = 180;
    
    nodes.forEach((node, i) => {
      if (viewMode === 'map') {
        // Better spread with more separation
        const baseX = 60 + node.umap_x * 420;
        const baseY = 40 + node.umap_y * 280;
        // Add small offset based on index to avoid overlaps
        const offsetX = (i % 3 - 1) * 15;
        const offsetY = (Math.floor(i / 3) % 3 - 1) * 15;
        newPositions.set(node.id, {
          x: baseX + offsetX,
          y: baseY + offsetY,
          vx: 0,
          vy: 0,
        });
      } else {
        // Larger radius for network view
        const angle = (i / nodes.length) * Math.PI * 2;
        const radius = 100 + Math.random() * 80;
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

  // Force simulation for network mode - with stronger separation
  useEffect(() => {
    if (viewMode !== 'network' || positions.size === 0) return;

    const simulate = () => {
      const newPositions = new Map(positions);
      const centerX = 280;
      const centerY = 180;
      const repulsion = 2500; // Increased for more separation
      const attraction = 0.008; // Decreased for looser connections
      const damping = 0.82;
      const centerForce = 0.004;

      nodes.forEach((node) => {
        const pos = newPositions.get(node.id);
        if (!pos) return;

        let fx = 0;
        let fy = 0;

        fx += (centerX - pos.x) * centerForce;
        fy += (centerY - pos.y) * centerForce;

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
    const maxIterations = 60;

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
  }, [nodes, edges, positions.size, viewMode]);

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

    // Draw edges with stylish gradients and visibility
    edges.forEach((edge) => {
      const sourcePos = positions.get(edge.source_id);
      const targetPos = positions.get(edge.target_id);
      if (!sourcePos || !targetPos) return;

      const sourceNode = nodes.find(n => n.id === edge.source_id);
      const targetNode = nodes.find(n => n.id === edge.target_id);
      const sourceColor = countryColors[sourceNode?.country || 'other'];
      const targetColor = countryColors[targetNode?.country || 'other'];

      // Create gradient for edge
      const gradient = ctx.createLinearGradient(
        sourcePos.x, sourcePos.y,
        targetPos.x, targetPos.y
      );
      gradient.addColorStop(0, sourceColor + '60');
      gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.15)');
      gradient.addColorStop(1, targetColor + '60');

      ctx.beginPath();
      ctx.moveTo(sourcePos.x, sourcePos.y);
      ctx.lineTo(targetPos.x, targetPos.y);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1.5 + (edge.weight * 1.5); // Thickness based on weight
      ctx.lineCap = 'round';
      ctx.stroke();
    });

    // Draw nodes with enhanced styling
    nodes.forEach((node) => {
      const pos = positions.get(node.id);
      if (!pos) return;

      const isSelected = selectedNodeId === node.id;
      const isHovered = hoveredNodeId === node.id;
      const baseRadius = 8 + (node.score * 10);
      const radius = isSelected || isHovered ? baseRadius + 3 : baseRadius;
      const color = countryColors[node.country] || countryColors.other;

      // Outer glow ring for all nodes (subtle)
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, radius + 6, 0, Math.PI * 2);
      const outerGlow = ctx.createRadialGradient(pos.x, pos.y, radius, pos.x, pos.y, radius + 6);
      outerGlow.addColorStop(0, color + '30');
      outerGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = outerGlow;
      ctx.fill();

      // Enhanced glow for selected/hovered
      if (isSelected || isHovered) {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, radius + 15, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(pos.x, pos.y, radius, pos.x, pos.y, radius + 15);
        gradient.addColorStop(0, color + '70');
        gradient.addColorStop(0.5, color + '30');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      // Node circle with gradient fill
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
      const nodeGradient = ctx.createRadialGradient(
        pos.x - radius * 0.3, pos.y - radius * 0.3, 0,
        pos.x, pos.y, radius
      );
      nodeGradient.addColorStop(0, color);
      nodeGradient.addColorStop(0.7, color);
      nodeGradient.addColorStop(1, color + 'AA');
      ctx.fillStyle = nodeGradient;
      ctx.fill();

      // Inner highlight
      ctx.beginPath();
      ctx.arc(pos.x - radius * 0.25, pos.y - radius * 0.25, radius * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.fill();

      // Border
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
      ctx.strokeStyle = isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = isSelected ? 2.5 : 1;
      ctx.stroke();

      // Label with background
      const authors = node.authors[0]?.split(',')[0] || 'Unknown';
      const label = `${authors}, ${node.year}`;
      ctx.font = '9px Inter, sans-serif';
      
      if (isSelected || isHovered) {
        // Draw label background
        const textWidth = ctx.measureText(label).width;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(pos.x - textWidth / 2 - 4, pos.y + radius + 6, textWidth + 8, 14);
        ctx.fillStyle = '#ffffff';
      } else {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      }
      ctx.textAlign = 'center';
      ctx.fillText(label, pos.x, pos.y + radius + 16);
    });

    ctx.restore();
  }, [positions, edges, nodes, selectedNodeId, hoveredNodeId, zoom, pan]);

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;

    for (const node of nodes) {
      const pos = positions.get(node.id);
      if (!pos) continue;

      const radius = 10 + (node.score * 8);
      const dist = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);

      if (dist < radius + 8) {
        onSelectNode(selectedNodeId === node.id ? null : node.id);
        return;
      }
    }
    onSelectNode(null);
  }, [positions, nodes, selectedNodeId, onSelectNode, zoom, pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      setPan({
        x: pan.x + e.movementX,
        y: pan.y + e.movementY,
      });
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;

    for (const node of nodes) {
      const pos = positions.get(node.id);
      if (!pos) continue;

      const radius = 10 + (node.score * 8);
      const dist = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);

      if (dist < radius + 8) {
        onHoverNode(node.id);
        return;
      }
    }
    onHoverNode(null);
  }, [positions, nodes, onHoverNode, isDragging, pan, zoom]);

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
          {/* View Mode Toggle */}
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
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setZoom(z => Math.min(2, z + 0.2))}>
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
          className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
          onClick={handleCanvasClick}
          onMouseMove={handleMouseMove}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => {
            setIsDragging(false);
            onHoverNode(null);
          }}
        />
        
        {/* Legend */}
        <div className="absolute bottom-3 left-3 flex items-center gap-3 text-xs bg-background/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-border/50 shadow-lg">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full shadow-sm" style={{ background: countryColors.china, boxShadow: `0 0 8px ${countryColors.china}50` }} />
            <span className="text-foreground/80 font-medium">China</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full shadow-sm" style={{ background: countryColors.usa, boxShadow: `0 0 8px ${countryColors.usa}50` }} />
            <span className="text-foreground/80 font-medium">USA</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full shadow-sm" style={{ background: countryColors.europe, boxShadow: `0 0 8px ${countryColors.europe}50` }} />
            <span className="text-foreground/80 font-medium">Europe</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full shadow-sm" style={{ background: countryColors.other, boxShadow: `0 0 8px ${countryColors.other}50` }} />
            <span className="text-foreground/80 font-medium">Other</span>
          </div>
        </div>
      </div>
    </div>
  );
};