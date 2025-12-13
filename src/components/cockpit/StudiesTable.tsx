import { motion } from 'framer-motion';
import { Filter, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DataNode } from '@/types/morphik';

interface StudiesTableProps {
  nodes: DataNode[];
  selectedNodeId: string | null;
  onSelectNode: (id: string | null) => void;
  hoveredNodeId: string | null;
  onHoverNode: (id: string | null) => void;
}

const getMethodologyBadge = (node: DataNode) => {
  const methodology = node.dimensions?.['Methodology']?.value || '';
  if (methodology.toLowerCase().includes('machine learning') || methodology.toLowerCase().includes('ai')) {
    return 'Analysis';
  }
  if (methodology.toLowerCase().includes('tem') || methodology.toLowerCase().includes('observation')) {
    return 'Experimental';
  }
  if (methodology.toLowerCase().includes('hydrometallurgical') || methodology.toLowerCase().includes('process')) {
    return 'Process';
  }
  if (methodology.toLowerCase().includes('membrane') || methodology.toLowerCase().includes('system')) {
    return 'System';
  }
  return 'Review';
};

export const StudiesTable = ({
  nodes,
  selectedNodeId,
  onSelectNode,
  hoveredNodeId,
  onHoverNode,
}: StudiesTableProps) => {
  return (
    <div className="my-6">
      {/* Table Header */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-2 w-8">
                <span className="text-xs font-medium text-muted-foreground">#</span>
              </th>
              <th className="text-left py-3 px-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground">Study (Paper)</span>
                  <div className="flex gap-1">
                    <button className="p-1 rounded hover:bg-muted/50 transition-colors">
                      <Filter className="w-3 h-3 text-muted-foreground" />
                    </button>
                    <button className="p-1 rounded hover:bg-muted/50 transition-colors">
                      <ArrowUpDown className="w-3 h-3 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              </th>
              <th className="text-left py-3 px-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground">Methodology / Type</span>
                  <div className="flex gap-1">
                    <button className="p-1 rounded hover:bg-muted/50 transition-colors">
                      <Filter className="w-3 h-3 text-muted-foreground" />
                    </button>
                    <button className="p-1 rounded hover:bg-muted/50 transition-colors">
                      <ArrowUpDown className="w-3 h-3 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              </th>
              <th className="text-left py-3 px-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground">Key Findings / Focus</span>
                  <div className="flex gap-1">
                    <button className="p-1 rounded hover:bg-muted/50 transition-colors">
                      <Filter className="w-3 h-3 text-muted-foreground" />
                    </button>
                    <button className="p-1 rounded hover:bg-muted/50 transition-colors">
                      <ArrowUpDown className="w-3 h-3 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              </th>
              <th className="text-right py-3 px-2 w-24">
                <div className="flex items-center justify-end gap-2">
                  <span className="text-xs font-medium text-muted-foreground">Relevance</span>
                  <div className="flex gap-1">
                    <button className="p-1 rounded hover:bg-muted/50 transition-colors">
                      <Filter className="w-3 h-3 text-muted-foreground" />
                    </button>
                    <button className="p-1 rounded hover:bg-muted/50 transition-colors">
                      <ArrowUpDown className="w-3 h-3 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {nodes.map((node, index) => {
              const isSelected = selectedNodeId === node.id;
              const isHovered = hoveredNodeId === node.id;
              const relevancePercent = Math.round(node.score * 100);
              
              return (
                <motion.tr
                  key={node.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onSelectNode(isSelected ? null : node.id)}
                  onMouseEnter={() => onHoverNode(node.id)}
                  onMouseLeave={() => onHoverNode(null)}
                  className={cn(
                    "border-b border-border/50 cursor-pointer transition-colors",
                    isSelected && "bg-primary/10",
                    isHovered && !isSelected && "bg-muted/30"
                  )}
                >
                  <td className="py-4 px-2">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                      isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    )}>
                      {index + 1}
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-foreground line-clamp-2">
                        {node.title}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {node.year} • {node.authors?.slice(0, 2).join(', ')}...
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <span className={cn(
                      "inline-flex px-2 py-1 rounded text-xs font-medium",
                      "bg-secondary text-secondary-foreground"
                    )}>
                      {getMethodologyBadge(node)}
                    </span>
                  </td>
                  <td className="py-4 px-2">
                    <span className="text-sm text-muted-foreground line-clamp-2">
                      {node.dimensions?.['Key Findings']?.value || '—'}
                    </span>
                  </td>
                  <td className="py-4 px-2 text-right">
                    <div className="flex flex-col items-end gap-1">
                      <span className={cn(
                        "text-sm font-semibold",
                        relevancePercent >= 90 ? "text-green-500" :
                        relevancePercent >= 80 ? "text-yellow-500" :
                        "text-muted-foreground"
                      )}>
                        {relevancePercent}%
                      </span>
                      <div className="w-12 h-1 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full",
                            relevancePercent >= 90 ? "bg-green-500" :
                            relevancePercent >= 80 ? "bg-yellow-500" :
                            "bg-muted-foreground"
                          )}
                          style={{ width: `${relevancePercent}%` }}
                        />
                      </div>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
