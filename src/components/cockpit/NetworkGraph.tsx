import { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, Maximize2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataNode, DataEdge } from '@/types/morphik';
import { cn } from '@/lib/utils';

interface NetworkGraphProps {
  nodes: DataNode[];
  edges: DataEdge[];
  selectedNodeId: string | null;
  onSelectNode: (id: string | null) => void;
  hoveredNodeId: string | null;
  onHoverNode: (id: string | null) => void;
}

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

export const NetworkGraph = ({
  nodes,
  edges,
  selectedNodeId,
  onSelectNode,
  hoveredNodeId,
  onHoverNode,
}: NetworkGraphProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<Map<string, NodePosition>>(new Map());
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const animationRef = useRef<number>();

  // Initialize positions
  useEffect(() => {
    const newPositions = new Map<string, NodePosition>();
    const centerX = 400;
    const centerY = 300;
    
    nodes.forEach((node, i) => {
      const angle = (i / nodes.length) * Math.PI * 2;
      const radius = 150 + Math.random() * 100;
      newPositions.set(node.id, {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
      });
    });
    setPositions(newPositions);
  }, [nodes]);

  // Force simulation
  useEffect(() => {
    if (positions.size === 0) return;

    const simulate = () => {
      const newPositions = new Map(positions);
      const centerX = 400;
      const centerY = 300;
      const repulsion = 2000;
      const attraction = 0.01;
      const damping = 0.85;
      const centerForce = 0.005;

      // Apply forces
      nodes.forEach((node) => {
        const pos = newPositions.get(node.id);
        if (!pos) return;

        let fx = 0;
        let fy = 0;

        // Center force
        fx += (centerX - pos.x) * centerForce;
        fy += (centerY - pos.y) * centerForce;

        // Repulsion from other nodes
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

        // Update velocity and position
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
  }, [nodes, edges, positions.size]);

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
      ctx.strokeStyle = 'rgba(100, 150, 180, 0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Draw nodes
    nodes.forEach((node) => {
      const pos = positions.get(node.id);
      if (!pos) return;

      const isSelected = selectedNodeId === node.id;
      const isHovered = hoveredNodeId === node.id;
      const radius = 6 + (node.score * 8);
      const color = countryColors[node.country] || countryColors.other;

      // Glow effect
      if (isSelected || isHovered) {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, radius + 8, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(pos.x, pos.y, radius, pos.x, pos.y, radius + 8);
        gradient.addColorStop(0, color + '80');
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
      ctx.font = '10px Inter, sans-serif';
      ctx.fillStyle = isSelected || isHovered ? '#fff' : 'rgba(255,255,255,0.6)';
      ctx.textAlign = 'center';
      ctx.fillText(label, pos.x, pos.y + radius + 14);
    });

    ctx.restore();
  }, [positions, edges, nodes, selectedNodeId, hoveredNodeId, zoom, pan]);

  // Handle canvas click
  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;

    for (const node of nodes) {
      const pos = positions.get(node.id);
      if (!pos) continue;

      const radius = 6 + (node.score * 8);
      const dist = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);

      if (dist < radius + 5) {
        onSelectNode(selectedNodeId === node.id ? null : node.id);
        return;
      }
    }
    onSelectNode(null);
  }, [positions, nodes, selectedNodeId, onSelectNode, zoom, pan]);

  // Handle mouse move for hover
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

      const radius = 6 + (node.score * 8);
      const dist = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);

      if (dist < radius + 5) {
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
    <div className="flex flex-col h-full card-elevated rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-card-border flex items-center justify-between shrink-0">
        <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
          Граф связей статей
        </span>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setZoom(z => Math.max(0.5, z - 0.2))}>
            <ZoomOut className="w-3 h-3" />
          </Button>
          <span className="text-xs font-mono text-muted-foreground w-10 text-center">{Math.round(zoom * 100)}%</span>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setZoom(z => Math.min(2, z + 0.2))}>
            <ZoomIn className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={resetView}>
            <RotateCcw className="w-3 h-3" />
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
        <div className="absolute bottom-3 left-3 flex items-center gap-4 text-xs bg-background/80 backdrop-blur-sm px-3 py-2 rounded-lg">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: countryColors.china }} />
            <span className="text-muted-foreground">Китай</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: countryColors.usa }} />
            <span className="text-muted-foreground">США</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: countryColors.europe }} />
            <span className="text-muted-foreground">Европа</span>
          </div>
        </div>
      </div>
    </div>
  );
};
