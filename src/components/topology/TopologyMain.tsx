import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { DataNode, DataEdge } from '@/types/morphik';
import { mockNodes, mockEdges } from '@/data/mockData';
import { TopologyVisualization } from '@/components/cockpit/TopologyVisualization';
import { TopologyRightPanel } from './TopologyRightPanel';
import { TopologyChatPanel } from './TopologyChatPanel';

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

  const selectedNode = useMemo(() => {
    return nodes.find(n => n.id === selectedNodeId) || null;
  }, [nodes, selectedNodeId]);

  return (
    <div className={cn('flex h-full', className)}>
      {/* Left Panel - Chat */}
      <div className="w-72 border-r border-border bg-background">
        <TopologyChatPanel />
      </div>

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

      {/* Right Panel - Papers List / Details */}
      <div className="w-80 border-l border-border bg-background">
        <TopologyRightPanel
          nodes={nodes}
          selectedNode={selectedNode}
          selectedNodeId={selectedNodeId}
          hoveredNodeId={hoveredNodeId}
          onSelectNode={setSelectedNodeId}
          onHoverNode={setHoveredNodeId}
        />
      </div>
    </div>
  );
};