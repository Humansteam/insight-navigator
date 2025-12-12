import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Map, Network, ZoomIn, ZoomOut, Maximize2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataNode, DivergenceMetric } from '@/types/morphik';
import { cn } from '@/lib/utils';

interface TopologyWidgetProps {
  nodes: DataNode[];
  divergence: DivergenceMetric;
  selectedNodeId: string | null;
  onSelectNode: (id: string | null) => void;
  hoveredNodeId: string | null;
  onHoverNode: (id: string | null) => void;
}

type ViewMode = 'map' | 'network';

const countryColors: Record<string, string> = {
  china: 'bg-data-china',
  usa: 'bg-data-usa',
  europe: 'bg-data-europe',
  other: 'bg-data-other',
};

const countryGlowColors: Record<string, string> = {
  china: 'shadow-[0_0_8px_hsl(0,75%,55%/0.6)]',
  usa: 'shadow-[0_0_8px_hsl(210,100%,55%/0.6)]',
  europe: 'shadow-[0_0_8px_hsl(45,95%,55%/0.6)]',
  other: 'shadow-[0_0_8px_hsl(280,60%,55%/0.6)]',
};

export const TopologyWidget = ({
  nodes,
  divergence,
  selectedNodeId,
  onSelectNode,
  hoveredNodeId,
  onHoverNode,
}: TopologyWidgetProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [zoom, setZoom] = useState(1);

  const getTrendIcon = () => {
    switch (divergence.trend) {
      case 'increasing':
        return <TrendingUp className="w-3 h-3 text-destructive" />;
      case 'decreasing':
        return <TrendingDown className="w-3 h-3 text-success" />;
      default:
        return <Minus className="w-3 h-3 text-muted-foreground" />;
    }
  };

  const minX = Math.min(...nodes.map(n => n.umap_x));
  const maxX = Math.max(...nodes.map(n => n.umap_x));
  const minY = Math.min(...nodes.map(n => n.umap_y));
  const maxY = Math.max(...nodes.map(n => n.umap_y));

  const normalizePosition = (x: number, y: number) => ({
    x: ((x - minX) / (maxX - minX)) * 100,
    y: ((y - minY) / (maxY - minY)) * 100,
  });

  return (
    <div className="card-elevated rounded-lg overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b border-card-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Topology</span>
          <div className="flex items-center bg-muted rounded-md p-0.5">
            <button
              onClick={() => setViewMode('map')}
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors",
                viewMode === 'map' ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Map className="w-3 h-3" />
              Map
            </button>
            <button
              onClick={() => setViewMode('network')}
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors",
                viewMode === 'network' ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Network className="w-3 h-3" />
              Network
            </button>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}>
            <ZoomOut className="w-3 h-3" />
          </Button>
          <span className="text-xs font-mono text-muted-foreground w-10 text-center">{Math.round(zoom * 100)}%</span>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setZoom(z => Math.min(2, z + 0.25))}>
            <ZoomIn className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Maximize2 className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Visualization Area */}
      <div className="flex-1 relative overflow-hidden bg-background-deep grid-pattern">
        <div
          className="absolute inset-0 transition-transform duration-200"
          style={{ transform: `scale(${zoom})` }}
        >
          {/* Nodes */}
          {nodes.map((node) => {
            const pos = normalizePosition(node.umap_x, node.umap_y);
            const isSelected = selectedNodeId === node.id;
            const isHovered = hoveredNodeId === node.id;
            const size = 8 + (node.score * 12);

            return (
              <motion.button
                key={node.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: 1, 
                  scale: isSelected || isHovered ? 1.3 : 1,
                }}
                transition={{ duration: 0.3, delay: Math.random() * 0.3 }}
                onClick={() => onSelectNode(isSelected ? null : node.id)}
                onMouseEnter={() => onHoverNode(node.id)}
                onMouseLeave={() => onHoverNode(null)}
                className={cn(
                  "absolute rounded-full transition-all duration-200 cursor-pointer",
                  countryColors[node.country],
                  (isSelected || isHovered) && countryGlowColors[node.country],
                  isSelected && "ring-2 ring-foreground/50"
                )}
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  width: size,
                  height: size,
                  transform: 'translate(-50%, -50%)',
                }}
              />
            );
          })}
        </div>

        {/* Legend */}
        <div className="absolute bottom-3 left-3 flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-data-china" />
            <span className="text-muted-foreground">China</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-data-usa" />
            <span className="text-muted-foreground">USA</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-data-europe" />
            <span className="text-muted-foreground">Europe</span>
          </div>
        </div>
      </div>

      {/* Divergence Meter */}
      <div className="p-3 border-t border-card-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            Divergence: {divergence.cluster_a} vs {divergence.cluster_b}
          </span>
          <div className="flex items-center gap-1">
            {getTrendIcon()}
            <span className="text-xs font-mono text-foreground">{(divergence.score * 100).toFixed(0)}%</span>
          </div>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: `linear-gradient(90deg, hsl(210, 100%, 55%) 0%, hsl(280, 60%, 55%) 50%, hsl(0, 75%, 55%) 100%)`,
            }}
            initial={{ width: 0 }}
            animate={{ width: `${divergence.score * 100}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  );
};
