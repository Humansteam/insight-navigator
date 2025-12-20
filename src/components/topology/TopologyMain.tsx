import { useState } from 'react';
import { cn } from '@/lib/utils';
import { DataNode, DataEdge } from '@/types/morphik';
import { mockNodes, mockEdges } from '@/data/mockData';
import { TopologyVisualization } from '@/components/cockpit/TopologyVisualization';

interface TopologyMainProps {
  nodes?: DataNode[];
  edges?: DataEdge[];
  className?: string;
  externalHoveredNodeId?: string | null;
  onExternalHoverNode?: (id: string | null) => void;
}

export const TopologyMain = ({ 
  nodes = mockNodes,
  edges = mockEdges,
  className,
  externalHoveredNodeId,
  onExternalHoverNode
}: TopologyMainProps) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [localHoveredNodeId, setLocalHoveredNodeId] = useState<string | null>(null);
  
  // Use external hover state if provided, otherwise local
  const hoveredNodeId = externalHoveredNodeId ?? localHoveredNodeId;
  
  const handleHoverNode = (id: string | null) => {
    setLocalHoveredNodeId(id);
    onExternalHoverNode?.(id);
  };

  // Get hovered node details
  const hoveredNode = hoveredNodeId 
    ? nodes.find(n => n.id === hoveredNodeId) 
    : null;

  return (
    <div className={cn('flex h-full relative', className)}>
      {/* Center - Graph Visualization */}
      <div className="flex-1 min-w-0">
        <TopologyVisualization
          nodes={nodes}
          edges={edges}
          selectedNodeId={selectedNodeId}
          onSelectNode={setSelectedNodeId}
          hoveredNodeId={hoveredNodeId}
          onHoverNode={handleHoverNode}
        />
      </div>

      {/* Hover tooltip */}
      {hoveredNode && (
        <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 max-w-sm shadow-lg animate-fade-in">
          <h4 className="font-medium text-sm text-foreground line-clamp-2">{hoveredNode.title}</h4>
          <div className="flex gap-2 mt-1 text-xs text-muted-foreground">
            <span>{hoveredNode.year}</span>
            <span>•</span>
            <span>{hoveredNode.authors?.[0]}</span>
            <span>•</span>
            <span className="text-primary">{Math.round(hoveredNode.score * 100)}%</span>
          </div>
        </div>
      )}
    </div>
  );
};