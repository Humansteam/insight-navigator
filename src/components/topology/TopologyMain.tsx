import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { DataNode, DataEdge } from '@/types/morphik';
import { mockNodes, mockEdges } from '@/data/mockData';
import { TopologyVisualization } from '@/components/cockpit/TopologyVisualization';
import { SelectionActionBar } from './SelectionActionBar';
import { useChat } from '@/contexts/ChatContext';
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
  const { addMessage, setIsProcessing } = useChat();
  
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
    const selectedPapers = nodes.filter(n => selectedNodeIds.has(n.id));
    const paperTitles = selectedPapers.map(p => p.title).join(', ');
    
    // Add user message to chat
    addMessage(`Суммаризировать ${selectedPapers.length} выбранных статей: ${paperTitles}`, 'user');
    setIsProcessing(true);
    
    // Generate mock AI summary after delay
    setTimeout(() => {
      const clusters = [...new Set(selectedPapers.map(p => p.cluster_label))];
      const avgScore = (selectedPapers.reduce((sum, p) => sum + p.score, 0) / selectedPapers.length).toFixed(2);
      const years = [...new Set(selectedPapers.map(p => p.year))].sort();
      
      const summary = `**Анализ ${selectedPapers.length} выбранных статей:**

📊 **Общая статистика:**
- Средний score релевантности: ${avgScore}
- Годы публикаций: ${years.join(', ')}
- Кластеры: ${clusters.join(', ')}

📑 **Ключевые работы:**
${selectedPapers.slice(0, 3).map(p => `• "${p.title}" (${p.year}) — ${p.authors?.slice(0, 2).join(', ')}`).join('\n')}

🔗 **Выводы:**
Выбранные статьи формируют связанную группу исследований с фокусом на ${clusters[0] || 'общую тематику'}. Наблюдается ${selectedPapers.length > 3 ? 'значительное' : 'умеренное'} пересечение цитирований между работами.`;
      
      addMessage(summary, 'assistant');
      setIsProcessing(false);
    }, 1500);
    
    toast.success(`Запущена суммаризация ${selectedPapers.length} статей`);
  }, [nodes, selectedNodeIds, addMessage, setIsProcessing]);

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