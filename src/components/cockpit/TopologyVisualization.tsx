import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { ZoomIn, ZoomOut, Locate } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataNode, DataEdge } from '@/types/morphik';
import { getClusterIndex, generateTopologyData } from '@/data/topologyGenerator';

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

// Generate consistent cluster color based on node id
const getNodeColor = (nodeId: string): string => {
  return clusterColors[getClusterIndex(nodeId)];
};

// Cluster center positions - more spread out for organic feel
const clusterCenters = [
  { x: 0.12, y: 0.78, rx: 0.12, ry: 0.15 }, // Pink - bottom left, ellipse
  { x: 0.28, y: 0.35, rx: 0.10, ry: 0.18 }, // Orange - upper left
  { x: 0.50, y: 0.60, rx: 0.14, ry: 0.12 }, // Yellow - center
  { x: 0.58, y: 0.18, rx: 0.11, ry: 0.14 }, // Cyan - top center
  { x: 0.85, y: 0.50, rx: 0.10, ry: 0.20 }, // Blue - right
];

export const TopologyVisualization = ({
  nodes: baseNodes,
  edges: baseEdges,
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
  const starsRef = useRef<Array<{ x: number; y: number; size: number; brightness: number }>>([]);

  // Generate topology with satellites
  const { nodes, edges } = useMemo(() => 
    generateTopologyData(baseNodes, baseEdges), 
    [baseNodes, baseEdges]
  );

  // Determine if a node is "major" (high score = larger, with label)
  const isMajorNode = (node: DataNode) => node.score >= 0.7;

  // Generate stars for background (once)
  useEffect(() => {
    if (starsRef.current.length === 0) {
      const numStars = 150;
      for (let i = 0; i < numStars; i++) {
        starsRef.current.push({
          x: Math.random(),
          y: Math.random(),
          size: 0.5 + Math.random() * 1.5,
          brightness: 0.2 + Math.random() * 0.4,
        });
      }
    }
  }, []);

  // Initialize positions - cluster nodes in organic ellipsoid shapes
  useEffect(() => {
    const newPositions = new Map<string, NodePosition>();
    const width = 640;
    const height = 480;
    
    nodes.forEach((node) => {
      const clusterIdx = getClusterIndex(node.id);
      const center = clusterCenters[clusterIdx];
      const isMajor = isMajorNode(node);
      
      // Organic ellipsoid distribution
      const angle = Math.random() * Math.PI * 2;
      const radiusFactor = Math.pow(Math.random(), 0.6); // More nodes toward center
      
      // Different spread for major vs minor nodes
      const spreadX = (isMajor ? 0.3 : 0.7 + Math.random() * 0.3) * center.rx * width * radiusFactor;
      const spreadY = (isMajor ? 0.3 : 0.7 + Math.random() * 0.3) * center.ry * height * radiusFactor;
      
      // Add organic noise
      const noiseX = (Math.random() - 0.5) * 15;
      const noiseY = (Math.random() - 0.5) * 15;
      
      const x = center.x * width + Math.cos(angle) * spreadX + noiseX;
      const y = center.y * height + Math.sin(angle) * spreadY + noiseY;
      
      newPositions.set(node.id, { x, y, vx: 0, vy: 0 });
    });
    
    setPositions(newPositions);
  }, [nodes, viewMode]);

  // Force simulation - organic cluster formation
  useEffect(() => {
    if (viewMode !== 'network' || positions.size === 0 || draggingNodeId) return;

    const width = 640;
    const height = 480;

    const simulate = () => {
      const newPositions = new Map(positions);
      const damping = 0.5;

      nodes.forEach((node) => {
        const pos = newPositions.get(node.id);
        if (!pos) return;

        const nodeCluster = getClusterIndex(node.id);
        const center = clusterCenters[nodeCluster];
        let fx = 0;
        let fy = 0;

        // Gentle pull toward cluster center (organic, not rigid)
        const centerX = center.x * width;
        const centerY = center.y * height;
        const toCenterX = centerX - pos.x;
        const toCenterY = centerY - pos.y;
        const distToCenter = Math.sqrt(toCenterX * toCenterX + toCenterY * toCenterY);
        
        // Soft boundary - stronger pull when far from center
        const maxDist = Math.max(center.rx * width, center.ry * height) * 1.2;
        if (distToCenter > maxDist * 0.5) {
          const pullStrength = 0.01 + (distToCenter / maxDist) * 0.02;
          fx += toCenterX * pullStrength;
          fy += toCenterY * pullStrength;
        }

        // Repulsion between nearby nodes (prevent overlap)
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
            // Same cluster: very soft repulsion only when very close
            if (dist < 12) {
              const force = (12 - dist) * 0.15;
              fx += (dx / dist) * force;
              fy += (dy / dist) * force;
            }
          } else {
            // Different cluster: moderate repulsion to maintain separation
            if (dist < 80) {
              const force = (80 - dist) * 0.08;
              fx += (dx / dist) * force;
              fy += (dy / dist) * force;
            }
          }
        });

        // Very weak edge attraction (keeps connected nodes slightly closer)
        edges.slice(0, 100).forEach((edge) => {
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
          
          fx += dx * 0.001;
          fy += dy * 0.001;
        });

        pos.vx = (pos.vx + fx) * damping;
        pos.vy = (pos.vy + fy) * damping;
        pos.x += pos.vx;
        pos.y += pos.vy;
        
        // Keep in bounds
        pos.x = Math.max(30, Math.min(width - 30, pos.x));
        pos.y = Math.max(30, Math.min(height - 30, pos.y));
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

    // Dark cosmic background
    const bgGradient = ctx.createRadialGradient(
      rect.width / 2, rect.height / 2, 0,
      rect.width / 2, rect.height / 2, rect.width
    );
    bgGradient.addColorStop(0, '#0d1220');
    bgGradient.addColorStop(1, '#060a12');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, rect.width, rect.height);
    
    // Draw stars for depth (like reference)
    starsRef.current.forEach(star => {
      const x = star.x * rect.width;
      const y = star.y * rect.height;
      
      ctx.beginPath();
      ctx.arc(x, y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(150, 180, 220, ${star.brightness})`;
      ctx.fill();
    });

    // Subtle grid overlay for depth
    ctx.strokeStyle = 'rgba(50, 70, 100, 0.08)';
    ctx.lineWidth = 0.5;
    const gridSize = 50;
    for (let x = 0; x < rect.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, rect.height);
      ctx.stroke();
    }
    for (let y = 0; y < rect.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(rect.width, y);
      ctx.stroke();
    }

    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);

    // Check if edge is connected to hovered node
    const isEdgeHighlighted = (edge: DataEdge) => {
      return hoveredNodeId && (edge.source_id === hoveredNodeId || edge.target_id === hoveredNodeId);
    };

    // Draw non-highlighted edges - thin hairlines
    edges.forEach((edge) => {
      if (isEdgeHighlighted(edge)) return;
      
      const sourcePos = positions.get(edge.source_id);
      const targetPos = positions.get(edge.target_id);
      if (!sourcePos || !targetPos) return;

      // Color based on source cluster
      const sourceColor = getNodeColor(edge.source_id);
      const targetColor = getNodeColor(edge.target_id);
      const sameCluster = getClusterIndex(edge.source_id) === getClusterIndex(edge.target_id);

      ctx.beginPath();
      ctx.moveTo(sourcePos.x, sourcePos.y);
      ctx.lineTo(targetPos.x, targetPos.y);
      
      if (sameCluster) {
        // Internal cluster edges - very subtle
        ctx.strokeStyle = sourceColor + '15';
        ctx.lineWidth = 0.3;
      } else {
        // Bridge edges - slightly more visible
        ctx.strokeStyle = sourceColor + '25';
        ctx.lineWidth = 0.5;
      }
      ctx.stroke();
    });

    // Draw highlighted edges on top
    edges.forEach((edge) => {
      if (!isEdgeHighlighted(edge)) return;
      
      const sourcePos = positions.get(edge.source_id);
      const targetPos = positions.get(edge.target_id);
      if (!sourcePos || !targetPos) return;

      const sourceColor = getNodeColor(edge.source_id);

      // Glow
      ctx.beginPath();
      ctx.moveTo(sourcePos.x, sourcePos.y);
      ctx.lineTo(targetPos.x, targetPos.y);
      ctx.strokeStyle = sourceColor + '50';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Bright line
      ctx.beginPath();
      ctx.moveTo(sourcePos.x, sourcePos.y);
      ctx.lineTo(targetPos.x, targetPos.y);
      ctx.strokeStyle = sourceColor + 'DD';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Draw nodes - satellites first, then major nodes on top
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
        radius = 5 + (node.score - 0.7) * 20; // 5-11px for major
      } else {
        radius = 1.5 + node.score * 3; // 1.5-3px for satellites
      }
      
      if (isSelected || isHovered || isDragging) {
        radius += isMajor ? 3 : 2;
      }

      const color = getNodeColor(node.id);

      // Outer glow (synapse effect)
      if (isMajor || isHovered || isSelected) {
        const glowRadius = radius * (isMajor ? 4 : 3);
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, glowRadius, 0, Math.PI * 2);
        const outerGlow = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, glowRadius);
        outerGlow.addColorStop(0, color + '30');
        outerGlow.addColorStop(0.4, color + '15');
        outerGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = outerGlow;
        ctx.fill();
      }

      // Medium glow
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, radius * 2, 0, Math.PI * 2);
      const midGlow = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, radius * 2);
      midGlow.addColorStop(0, color + '50');
      midGlow.addColorStop(0.6, color + '20');
      midGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = midGlow;
      ctx.fill();

      // Core node
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
      const coreGradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, radius);
      coreGradient.addColorStop(0, '#ffffff');
      coreGradient.addColorStop(0.4, color);
      coreGradient.addColorStop(1, color + 'AA');
      ctx.fillStyle = coreGradient;
      ctx.fill();

      // White center highlight
      if (radius > 2) {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, radius * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.fill();
      }

      // Selection ring
      if (isSelected || isDragging) {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, radius + 4, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    });

    // Draw labels for major nodes or hovered
    sortedNodes.forEach((node) => {
      const pos = positions.get(node.id);
      if (!pos) return;

      const isMajor = isMajorNode(node);
      const isSelected = selectedNodeId === node.id;
      const isHovered = hoveredNodeId === node.id;
      
      if ((isMajor && node.score >= 0.85) || isSelected || isHovered) {
        const radius = isMajor ? 5 + (node.score - 0.7) * 20 : 3;
        
        const title = node.title.length > 22 ? node.title.substring(0, 22) + '...' : node.title;
        ctx.font = '8px Inter, sans-serif';
        const textMetrics = ctx.measureText(title);
        const textWidth = textMetrics.width;
        
        const labelX = pos.x;
        const labelY = pos.y + radius + 12;
        
        const padding = 4;
        const boxWidth = textWidth + padding * 2;
        const boxHeight = 14;
        
        ctx.fillStyle = 'rgba(30, 60, 120, 0.9)';
        ctx.beginPath();
        ctx.roundRect(labelX - boxWidth / 2, labelY - boxHeight / 2, boxWidth, boxHeight, 2);
        ctx.fill();
        
        ctx.strokeStyle = 'rgba(80, 130, 200, 0.5)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
        
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

    // Check major nodes first
    const sortedNodes = [...nodes].sort((a, b) => b.score - a.score);
    
    for (const node of sortedNodes) {
      const pos = positions.get(node.id);
      if (!pos) continue;

      const isMajor = isMajorNode(node);
      let hitRadius = isMajor ? 15 + (node.score - 0.7) * 40 : 6 + node.score * 10;
      hitRadius += 5;

      const dist = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);

      if (dist < hitRadius) {
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
        const newPos = new Map(prev);
        const pos = newPos.get(draggingNodeId);
        if (pos) {
          pos.x += dx / zoom;
          pos.y += dy / zoom;
        }
        return newPos;
      });
    } else if (isDraggingCanvas) {
      setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
    } else {
      const nodeId = findNodeAtPosition(e.clientX, e.clientY);
      onHoverNode(nodeId);
    }
  }, [draggingNodeId, isDraggingCanvas, zoom, findNodeAtPosition, onHoverNode]);

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
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.min(3, Math.max(0.5, prev * delta)));
  }, []);

  const resetView = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  return (
    <div className="flex flex-col h-full bg-background-deep rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-card-border bg-card/50">
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)} className="h-7">
          <TabsList className="h-7 bg-muted/50">
            <TabsTrigger value="map" className="h-5 text-xs px-2">Map</TabsTrigger>
            <TabsTrigger value="network" className="h-5 text-xs px-2">Network</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setZoom(z => Math.min(3, z * 1.2))}>
            <ZoomIn className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setZoom(z => Math.max(0.5, z * 0.8))}>
            <ZoomOut className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={resetView}>
            <Locate className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div ref={containerRef} className="flex-1 relative">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onWheel={handleWheel}
        />
        
        {/* Legend */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2 pointer-events-none">
          {['Pink', 'Orange', 'Yellow', 'Cyan', 'Blue'].map((name, idx) => (
            <div key={name} className="flex items-center gap-1">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: clusterColors[idx] }}
              />
              <span className="text-[10px] text-muted-foreground">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
