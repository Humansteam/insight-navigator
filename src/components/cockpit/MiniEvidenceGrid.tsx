import { motion } from 'framer-motion';
import { DataNode } from '@/types/morphik';
import { cn } from '@/lib/utils';

interface MiniEvidenceGridProps {
  nodes: DataNode[];
  dimensions: string[];
  selectedNodeId: string | null;
  onSelectNode: (id: string | null) => void;
  hoveredNodeId: string | null;
  onHoverNode: (id: string | null) => void;
}

export const MiniEvidenceGrid = ({
  nodes,
  dimensions,
  selectedNodeId,
  onSelectNode,
  hoveredNodeId,
  onHoverNode,
}: MiniEvidenceGridProps) => {
  const displayDimensions = dimensions.slice(0, 4);

  return (
    <div className="card-elevated rounded-lg overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-2 border-b border-card-border flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Evidence Grid</span>
        </div>
        <span className="text-[10px] text-muted-foreground/60 font-mono">
          {nodes.length} papers × {displayDimensions.length} dimensions
        </span>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto min-h-0">
        <table className="w-full text-xs">
          <thead className="sticky top-0 z-10">
            <tr className="bg-muted/50 backdrop-blur-sm">
              <th className="text-left p-2 font-medium text-muted-foreground text-[10px] uppercase tracking-wider min-w-[140px]">
                Paper
              </th>
              <th className="text-left p-2 font-medium text-muted-foreground text-[10px] uppercase tracking-wider w-12">
                Year
              </th>
              {displayDimensions.map((dim) => (
                <th key={dim} className="text-left p-2 font-medium text-muted-foreground text-[10px] uppercase tracking-wider">
                  {dim.slice(0, 8)}
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
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => onSelectNode(isSelected ? null : node.id)}
                  onMouseEnter={() => onHoverNode(node.id)}
                  onMouseLeave={() => onHoverNode(null)}
                  className={cn(
                    "border-b border-card-border/30 cursor-pointer transition-colors",
                    isSelected && "bg-primary/15",
                    isHovered && !isSelected && "bg-muted/30"
                  )}
                >
                  <td className="p-2">
                    <div className="flex items-center gap-1.5">
                      <div className={cn(
                        "w-2 h-2 rounded-full shrink-0",
                        node.country === 'china' && "bg-data-china",
                        node.country === 'usa' && "bg-data-usa",
                        node.country === 'europe' && "bg-data-europe",
                        node.country === 'other' && "bg-data-other",
                      )} />
                      <span className="text-foreground truncate max-w-[120px]" title={node.title}>
                        {node.title.split(' ').slice(0, 4).join(' ')}...
                      </span>
                    </div>
                  </td>
                  <td className="p-2">
                    <span className={cn(
                      "px-1.5 py-0.5 rounded text-[10px] font-medium",
                      node.country === 'china' && "bg-data-china/20 text-data-china",
                      node.country === 'usa' && "bg-data-usa/20 text-data-usa",
                      node.country === 'europe' && "bg-data-europe/20 text-data-europe",
                    )}>
                      {node.year}
                    </span>
                  </td>
                  {displayDimensions.map((dim) => {
                    const dimValue = node.dimensions[dim];
                    return (
                      <td key={dim} className="p-2">
                        {dimValue ? (
                          <div className="flex items-center gap-1">
                            <span className="font-mono text-[10px] text-foreground">{dimValue.value}</span>
                            <span className={cn(
                              "w-1.5 h-1.5 rounded-full shrink-0",
                              dimValue.confidence === 'high' && "bg-confidence-high",
                              dimValue.confidence === 'med' && "bg-confidence-med",
                              dimValue.confidence === 'low' && "bg-confidence-low",
                            )} />
                          </div>
                        ) : (
                          <span className="text-muted-foreground/40">—</span>
                        )}
                      </td>
                    );
                  })}
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
