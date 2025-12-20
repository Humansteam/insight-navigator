import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { DataNode, DataEdge } from '@/types/morphik';
import { mockNodes, mockEdges } from '@/data/mockData';
import { TopologyVisualization } from '@/components/cockpit/TopologyVisualization';

interface TopologyMainProps {
  nodes?: DataNode[];
  edges?: DataEdge[];
  className?: string;
}

export const TopologyMain = ({ 
  nodes = mockNodes,
  edges = mockEdges,
  className 
}: TopologyMainProps) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  return (
    <div className={cn('flex h-full', className)}>
      {/* Center - Graph Visualization */}
      <div className="flex-1 min-w-0">
        <TopologyVisualization
          nodes={nodes}
          edges={edges}
          selectedNodeId={selectedNodeId}
          onSelectNode={setSelectedNodeId}
          hoveredNodeId={hoveredNodeId}
          onHoverNode={setHoveredNodeId}
        />
      </div>
    </div>
  );
};