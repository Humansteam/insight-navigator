import { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, RotateCcw, Locate } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

const countryColors: Record<string, string> = {
  china: '#ef4444',
  usa: '#3b82f6',
  europe: '#eab308',
  other: '#a855f7',
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
  const [isDragging, setIsDragging] = useState(false);
  const animationRef = useRef<number>();

  // Initialize positions
  useEffect(() => {
    const newPositions = new Map<string, NodePosition>();
    const centerX = 250;
    const centerY = 180;
    
    nodes.forEach((node, i) => {
      if (viewMode === 'map') {
        // Use UMAP coordinates for map mode
        newPositions.set(node.id, {
          x: 50 + node.umap_x * 400,
          y: 50 + node.umap_y * 280,
          vx: 0,
          vy: 0,
        });
      } else {
        // Random positions for network mode
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

  // Force simulation for network mode
  useEffect(() => {
    if (viewMode !== 'network' || positions.size === 0) return;

    const simulate = () => {
      const newPositions = new Map(positions);
      const centerX = 250;
      const centerY = 180;
      const repulsion = 1500;
      const attraction = 0.015;
      const damping = 0.8;
      const centerForce = 0.008;

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

    // Draw edges
    edges.forEach((edge) => {
      const sourcePos = positions.get(edge.source_id);
      const targetPos = positions.get(edge.target_id);
      if (!sourcePos || !targetPos) return;

      ctx.beginPath();
      ctx.moveTo(sourcePos.x, sourcePos.y);
      ctx.lineTo(targetPos.x, targetPos.y);
      ctx.strokeStyle = 'rgba(100, 180, 200, 0.25)';
      ctx.lineWidth = 1 + edge.weight;
      ctx.stroke();
    });

    // Draw nodes
    nodes.forEach((node) => {
      const pos = positions.get(node.id);
      if (!pos) return;

      const isSelected = selectedNodeId === node.id;
      const isHovered = hoveredNodeId === node.id;
      const radius = 8 + (node.score * 10);
      const color = countryColors[node.country] || countryColors.other;

      // Glow effect
      if (isSelected || isHovered) {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, radius + 12, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(pos.x, pos.y, radius, pos.x, pos.y, radius + 12);
        gradient.addColorStop(0, color + '60');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      // Node circle
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      if (isSelected) {
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Label
      const authors = node.authors[0]?.split(',')[0] || 'Unknown';
      const label = `${authors}, ${node.year}`;
      ctx.font = '9px Inter, sans-serif';
      ctx.fillStyle = isSelected || isHovered ? '#fff' : 'rgba(255,255,255,0.5)';
      ctx.textAlign = 'center';
      ctx.fillText(label, pos.x, pos.y + radius + 12);
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

      const radius = 8 + (node.score * 10);
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

      const radius = 8 + (node.score * 10);
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
    <div className="card-elevated rounded-lg overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-2 border-b border-card-border flex items-center justify-between shrink-0">
        <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
          Topology Visualization
        </span>
        <div className="flex items-center gap-1">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-muted rounded p-0.5 mr-2">
            <button
              onClick={() => setViewMode('map')}
              className={cn(
                "px-2 py-0.5 rounded text-[10px] font-medium transition-colors",
                viewMode === 'map' ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Map
            </button>
            <button
              onClick={() => setViewMode('network')}
              className={cn(
                "px-2 py-0.5 rounded text-[10px] font-medium transition-colors",
                viewMode === 'network' ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Network
            </button>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setZoom(z => Math.max(0.5, z - 0.2))}>
            <ZoomOut className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setZoom(z => Math.min(2, z + 0.2))}>
            <ZoomIn className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={resetView}>
            <Locate className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div ref={containerRef} className="flex-1 relative bg-background-deep overflow-hidden min-h-0">
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
        <div className="absolute bottom-2 left-2 flex items-center gap-3 text-[10px] bg-background/70 backdrop-blur-sm px-2 py-1 rounded">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ background: countryColors.china }} />
            <span className="text-muted-foreground">China</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ background: countryColors.usa }} />
            <span className="text-muted-foreground">USA</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ background: countryColors.europe }} />
            <span className="text-muted-foreground">Europe</span>
          </div>
        </div>
      </div>
    </div>
  );
};
