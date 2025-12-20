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
  selectedNodeIds: Set<string>;
  onToggleNodeSelection: (id: string, addToSelection: boolean) => void;
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
  selectedNodeIds,
  onToggleNodeSelection,
}: TopologyVisualizationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('network');
  const [positions, setPositions] = useState<Map<string, NodePosition>>(new Map());
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const animationRef = useRef<number>();
  const lastMousePos = useRef({ x: 0, y: 0 });

  // Generate topology with satellites
  const { nodes, edges } = useMemo(() => 
    generateTopologyData(baseNodes, baseEdges), 
    [baseNodes, baseEdges]
  );

  // Determine if a node is "major" (high score = larger, with label)
  const isMajorNode = (node: DataNode) => node.score >= 0.7;

  // Initialize positions - score-based: high score = closer to center, low = further
  useEffect(() => {
    const newPositions = new Map<string, NodePosition>();
    const width = 900;
    const height = 700;
    const globalCenterX = width / 2;
    const globalCenterY = height / 2;
    
    nodes.forEach((node) => {
      const clusterIdx = getClusterIndex(node.id);
      
      // Score determines distance from global center (inverted: high score = close)
      const normalizedScore = Math.max(0.1, Math.min(1, node.score));
      const distanceFromCenter = (1 - normalizedScore) * 0.85 + 0.15;
      
      // Angle based on cluster (spread clusters around the center)
      const clusterAngle = (clusterIdx / 5) * Math.PI * 2 + Math.PI / 10;
      const angleOffset = (Math.random() - 0.5) * 0.8;
      const angle = clusterAngle + angleOffset;
      
      // Maximum distance from center - larger canvas
      const maxRadius = Math.min(width, height) * 0.4;
      const radius = distanceFromCenter * maxRadius;
      
      // Add organic noise
      const noiseX = (Math.random() - 0.5) * 25;
      const noiseY = (Math.random() - 0.5) * 25;
      
      const x = globalCenterX + Math.cos(angle) * radius + noiseX;
      const y = globalCenterY + Math.sin(angle) * radius + noiseY;
      
      newPositions.set(node.id, { x, y, vx: 0, vy: 0 });
    });
    
    setPositions(newPositions);
  }, [nodes, viewMode]);

  // Force simulation - score-based radial positioning
  useEffect(() => {
    if (viewMode !== 'network' || positions.size === 0 || draggingNodeId) return;

    const width = 900;
    const height = 700;
    const globalCenterX = width / 2;
    const globalCenterY = height / 2;

    const simulate = () => {
      const newPositions = new Map(positions);
      const damping = 0.5;

      nodes.forEach((node) => {
        const pos = newPositions.get(node.id);
        if (!pos) return;

        const nodeCluster = getClusterIndex(node.id);
        let fx = 0;
        let fy = 0;

        // Score-based radial positioning
        const normalizedScore = Math.max(0.1, Math.min(1, node.score));
        const targetDistanceRatio = (1 - normalizedScore) * 0.85 + 0.15;
        const maxRadius = Math.min(width, height) * 0.4;
        const targetRadius = targetDistanceRatio * maxRadius;
        
        const toCenterX = globalCenterX - pos.x;
        const toCenterY = globalCenterY - pos.y;
        const distToCenter = Math.sqrt(toCenterX * toCenterX + toCenterY * toCenterY) || 1;
        
        // Pull toward target radius
        const radiusDiff = distToCenter - targetRadius;
        const pullStrength = 0.03;
        fx += (toCenterX / distToCenter) * radiusDiff * pullStrength;
        fy += (toCenterY / distToCenter) * radiusDiff * pullStrength;

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
    ctx.fillStyle = '#0a0e18';
    ctx.fillRect(0, 0, rect.width, rect.height);
    
    // Subtle grid for depth (barely visible like reference)
    ctx.strokeStyle = 'rgba(40, 60, 100, 0.06)';
    ctx.lineWidth = 0.5;
    const gridSize = 40;
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
        // Bridge edges - gradient from source to target color
        const gradient = ctx.createLinearGradient(sourcePos.x, sourcePos.y, targetPos.x, targetPos.y);
        gradient.addColorStop(0, sourceColor + '30');
        gradient.addColorStop(1, targetColor + '30');
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 0.5;
      }
      ctx.stroke();
    });

    // Draw highlighted edges on top - same thickness, just brighter
    edges.forEach((edge) => {
      if (!isEdgeHighlighted(edge)) return;
      
      const sourcePos = positions.get(edge.source_id);
      const targetPos = positions.get(edge.target_id);
      if (!sourcePos || !targetPos) return;

      const sourceColor = getNodeColor(edge.source_id);
      const targetColor = getNodeColor(edge.target_id);
      const sameCluster = getClusterIndex(edge.source_id) === getClusterIndex(edge.target_id);

      ctx.beginPath();
      ctx.moveTo(sourcePos.x, sourcePos.y);
      ctx.lineTo(targetPos.x, targetPos.y);
      
      if (sameCluster) {
        ctx.strokeStyle = sourceColor + 'FF';
      } else {
        // Bright gradient for highlighted bridges
        const gradient = ctx.createLinearGradient(sourcePos.x, sourcePos.y, targetPos.x, targetPos.y);
        gradient.addColorStop(0, sourceColor + 'FF');
        gradient.addColorStop(1, targetColor + 'FF');
        ctx.strokeStyle = gradient;
      }
      ctx.lineWidth = sameCluster ? 0.3 : 0.5;
      ctx.stroke();
    });

    // Draw nodes - low score first (back), high score on top (front)
    const sortedNodes = [...nodes].sort((a, b) => a.score - b.score);

    sortedNodes.forEach((node) => {
      const pos = positions.get(node.id);
      if (!pos) return;

      const isSelected = selectedNodeId === node.id;
      const isMultiSelected = selectedNodeIds.has(node.id);
      const isHovered = hoveredNodeId === node.id;
      const isDragging = draggingNodeId === node.id;
      const isMajor = isMajorNode(node);
      
      // Score-based opacity: high score = bright, low score = dim
      const baseOpacity = 0.3 + node.score * 0.7; // 0.3-1.0 range
      const opacityHex = Math.round(baseOpacity * 255).toString(16).padStart(2, '0');
      
      // Size based on score
      let radius: number;
      if (isMajor) {
        radius = 5 + (node.score - 0.7) * 20; // 5-11px for major
      } else {
        radius = 1.5 + node.score * 3; // 1.5-3px for satellites
      }
      
      if (isSelected || isHovered || isDragging || isMultiSelected) {
        radius += isMajor ? 3 : 2;
      }

      const color = getNodeColor(node.id);

      // Outer glow (synapse effect) - intensity based on score
      if ((isMajor || isHovered || isSelected || isMultiSelected) && node.score > 0.4) {
        const glowRadius = radius * (isMajor ? 4 : 3);
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, glowRadius, 0, Math.PI * 2);
        const outerGlow = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, glowRadius);
        const glowOpacity = Math.round(baseOpacity * 48).toString(16).padStart(2, '0');
        outerGlow.addColorStop(0, color + glowOpacity);
        outerGlow.addColorStop(0.4, color + Math.round(baseOpacity * 21).toString(16).padStart(2, '0'));
        outerGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = outerGlow;
        ctx.fill();
      }

      // Medium glow - intensity based on score
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, radius * 2, 0, Math.PI * 2);
      const midGlow = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, radius * 2);
      const midGlowOpacity = Math.round(baseOpacity * 80).toString(16).padStart(2, '0');
      midGlow.addColorStop(0, color + midGlowOpacity);
      midGlow.addColorStop(0.6, color + Math.round(baseOpacity * 32).toString(16).padStart(2, '0'));
      midGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = midGlow;
      ctx.fill();

      // Core node - opacity based on score
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
      const coreGradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, radius);
      coreGradient.addColorStop(0, `rgba(255, 255, 255, ${baseOpacity})`);
      coreGradient.addColorStop(0.4, color + opacityHex);
      coreGradient.addColorStop(1, color + Math.round(baseOpacity * 170).toString(16).padStart(2, '0'));
      ctx.fillStyle = coreGradient;
      ctx.fill();

      // White center highlight - only for brighter nodes
      if (radius > 2 && node.score > 0.5) {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, radius * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${baseOpacity * 0.85})`;
        ctx.fill();
      }

      // Multi-selection ring (cyan)
      if (isMultiSelected) {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, radius + 6, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(100, 200, 255, 0.9)';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 2]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Selection ring (primary selection)
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
  }, [positions, edges, nodes, selectedNodeId, selectedNodeIds, hoveredNodeId, draggingNodeId, zoom, pan]);

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
      // Shift+click for multi-select, regular click for single select
      if (e.shiftKey) {
        onToggleNodeSelection(nodeId, true);
      } else {
        onSelectNode(nodeId);
      }
    } else {
      setIsDraggingCanvas(true);
    }
  }, [findNodeAtPosition, onSelectNode, onToggleNodeSelection]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    
    // Track mouse position for tooltip
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }

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

        {/* Selection hint */}
        {selectedNodeIds.size === 0 && (
          <div className="absolute top-3 left-3 text-xs text-muted-foreground bg-card/80 backdrop-blur-sm px-2 py-1 rounded pointer-events-none">
            Shift+Click to multi-select
          </div>
        )}
      </div>
    </div>
  );
};
