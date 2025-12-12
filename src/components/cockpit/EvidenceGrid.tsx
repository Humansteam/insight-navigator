import { motion } from 'framer-motion';
import { Download, AlertTriangle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataNode } from '@/types/morphik';
import { cn } from '@/lib/utils';

interface EvidenceGridProps {
  nodes: DataNode[];
  dimensions: string[];
  selectedNodeId: string | null;
  onSelectNode: (id: string | null) => void;
  hoveredNodeId: string | null;
  onHoverNode: (id: string | null) => void;
}

const confidenceColors = {
  high: 'bg-confidence-high/20 text-confidence-high border-confidence-high/30',
  med: 'bg-confidence-med/20 text-confidence-med border-confidence-med/30',
  low: 'bg-confidence-low/20 text-confidence-low border-confidence-low/30',
};

const confidenceLabels = {
  high: '●',
  med: '●',
  low: '●',
};

export const EvidenceGrid = ({
  nodes,
  dimensions,
  selectedNodeId,
  onSelectNode,
  hoveredNodeId,
  onHoverNode,
}: EvidenceGridProps) => {
  const handleExportCSV = () => {
    const headers = ['Paper ID', 'Title', 'Country', 'Score', ...dimensions];
    const rows = nodes.map(node => [
      node.id,
      node.title,
      node.country,
      node.score.toFixed(2),
      ...dimensions.map(dim => node.dimensions[dim]?.value || 'N/A'),
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'evidence-grid.csv';
    a.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="card-elevated rounded-lg overflow-hidden"
    >
      {/* Header */}
      <div className="p-3 border-b border-card-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Evidence Grid</span>
          <span className="text-xs text-muted-foreground/60 font-mono">{nodes.length} papers</span>
        </div>
        <Button variant="ghost" size="sm" onClick={handleExportCSV} className="h-7 text-xs">
          <Download className="w-3 h-3 mr-1" />
          Export CSV
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-card-border bg-muted/30">
              <th className="text-left p-3 font-medium text-muted-foreground text-xs uppercase tracking-wider sticky left-0 bg-muted/30 min-w-[250px]">
                Paper
              </th>
              {dimensions.map((dim) => (
                <th key={dim} className="text-left p-3 font-medium text-muted-foreground text-xs uppercase tracking-wider min-w-[120px]">
                  {dim}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {nodes.map((node, i) => {
              const isSelected = selectedNodeId === node.id;
              const isHovered = hoveredNodeId === node.id;
              
              return (
                <motion.tr
                  key={node.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  onClick={() => onSelectNode(isSelected ? null : node.id)}
                  onMouseEnter={() => onHoverNode(node.id)}
                  onMouseLeave={() => onHoverNode(null)}
                  className={cn(
                    "border-b border-card-border/50 cursor-pointer transition-colors",
                    isSelected && "bg-primary/10",
                    isHovered && !isSelected && "bg-muted/50"
                  )}
                >
                  <td className="p-3 sticky left-0 bg-inherit">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-2 h-2 rounded-full shrink-0",
                        node.country === 'china' && "bg-data-china",
                        node.country === 'usa' && "bg-data-usa",
                        node.country === 'europe' && "bg-data-europe",
                        node.country === 'other' && "bg-data-other",
                      )} />
                      <div className="min-w-0">
                        <div className="font-medium text-foreground truncate max-w-[220px]" title={node.title}>
                          {node.title}
                        </div>
                        <div className="text-xs text-muted-foreground font-mono">
                          {node.year} • {node.citations} cites
                        </div>
                      </div>
                    </div>
                  </td>
                  {dimensions.map((dim) => {
                    const dimValue = node.dimensions[dim];
                    if (!dimValue) {
                      return (
                        <td key={dim} className="p-3 text-muted-foreground/50 font-mono text-xs">
                          —
                        </td>
                      );
                    }
                    return (
                      <td key={dim} className="p-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs">{dimValue.value}</span>
                          <span
                            className={cn(
                              "text-[10px]",
                              dimValue.confidence === 'high' && "text-confidence-high",
                              dimValue.confidence === 'med' && "text-confidence-med",
                              dimValue.confidence === 'low' && "text-confidence-low",
                            )}
                          >
                            {confidenceLabels[dimValue.confidence]}
                          </span>
                        </div>
                      </td>
                    );
                  })}
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
