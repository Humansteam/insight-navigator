import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { DataNode, DataEdge } from '@/types/morphik';
import { mockNodes, mockEdges } from '@/data/mockData';
import { TopologyVisualization } from '@/components/cockpit/TopologyVisualization';
import { SelectionActionBar } from './SelectionActionBar';
import { toast } from 'sonner';

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
  const [selectedNodeIds, setSelectedNodeIds] = useState<Set<string>>(new Set());
  
  // Use external hover state if provided, otherwise local
  const hoveredNodeId = externalHoveredNodeId ?? localHoveredNodeId;
  
  const handleHoverNode = (id: string | null) => {
    setLocalHoveredNodeId(id);
    onExternalHoverNode?.(id);
  };

  const handleToggleNodeSelection = useCallback((id: string, addToSelection: boolean) => {
    setSelectedNodeIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const handleClearSelection = useCallback(() => {
    setSelectedNodeIds(new Set());
  }, []);

  const handleSummarize = useCallback(() => {
    toast.info(`Summarizing ${selectedNodeIds.size} papers...`, {
      description: 'AI summary will be generated for selected papers'
    });
  }, [selectedNodeIds.size]);

  const handleExport = useCallback(() => {
    const selectedPapers = nodes.filter(n => selectedNodeIds.has(n.id));
    const exportData = selectedPapers.map(p => ({
      title: p.title,
      authors: p.authors,
      year: p.year,
      score: p.score,
      abstract: p.abstract
    }));
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `selected-papers-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success(`Exported ${selectedPapers.length} papers`);
  }, [nodes, selectedNodeIds]);

  // Get selected nodes for action bar
  const selectedNodes = nodes.filter(n => selectedNodeIds.has(n.id));

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
          selectedNodeIds={selectedNodeIds}
          onToggleNodeSelection={handleToggleNodeSelection}
        />
      </div>

      {/* Selection Action Bar */}
      <SelectionActionBar
        selectedNodes={selectedNodes}
        onClearSelection={handleClearSelection}
        onSummarize={handleSummarize}
        onExport={handleExport}
      />
    </div>
  );
};