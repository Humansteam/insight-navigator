import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { DataNode, DataEdge } from '@/types/morphik';
import { mockNodes, mockEdges } from '@/data/mockData';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TopologyVisualization } from '@/components/cockpit/TopologyVisualization';
import { TopologyDetailsPanel } from './TopologyDetailsPanel';

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

  // Find origin paper (first paper or highest score)
  const originPaper = useMemo(() => {
    return nodes.reduce((best, node) => 
      node.score > best.score ? node : best
    , nodes[0]);
  }, [nodes]);

  return (
    <div className={cn('flex h-full', className)}>
      {/* Left Column - Papers List */}
      <div className="w-80 border-r border-border flex flex-col bg-background">
        <ScrollArea className="flex-1">
          {nodes.map((paper, index) => {
            const isOrigin = paper.id === originPaper?.id;
            const isSelected = selectedNodeId === paper.id;
            const isHovered = hoveredNodeId === paper.id;
            
            return (
              <div
                key={paper.id}
                onClick={() => setSelectedNodeId(paper.id)}
                onMouseEnter={() => setHoveredNodeId(paper.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
                className={cn(
                  "px-4 py-3 border-b border-border/50 cursor-pointer transition-colors",
                  isSelected ? "bg-primary/10" : isHovered ? "bg-muted/50" : "hover:bg-muted/30"
                )}
              >
                {isOrigin && (
                  <div className="text-xs text-red-500 font-medium mb-1">
                    Origin paper
                  </div>
                )}
                <h4 className="text-sm font-medium text-foreground leading-snug mb-1 line-clamp-2">
                  {paper.title}
                </h4>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                    {paper.authors.join(', ')}
                  </p>
                  <span className="text-xs text-muted-foreground">{paper.year}</span>
                </div>
              </div>
            );
          })}
        </ScrollArea>
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

      {/* Right Column - Details Panel */}
      <div className="w-80 border-l border-border bg-background">
        <TopologyDetailsPanel
          node={selectedNode}
          nodes={nodes}
          onBack={() => setSelectedNodeId(null)}
        />
      </div>
    </div>
  );
};
