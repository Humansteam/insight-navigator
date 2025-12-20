import { DataNode } from '@/types/morphik';
import { ExternalLink, ArrowLeft, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TopologyDetailsPanelProps {
  node: DataNode | null;
  nodes?: DataNode[];
  onBack?: () => void;
}

export const TopologyDetailsPanel = ({ node, nodes = [], onBack }: TopologyDetailsPanelProps) => {
  const totalPapers = nodes.length;

  // Show Overview when no paper selected
  if (!node) {
    return (
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="px-4 py-3 border-b border-border">
          <span className="text-sm font-medium">Details</span>
        </div>

        <div className="p-4 space-y-6">
          {/* Overview Title */}
          <div className="text-xs text-muted-foreground">Overview</div>
          
          {/* Stats */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-foreground">
                <span className="font-medium">{totalPapers}</span> papers in topology
              </span>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            Select a paper from the list or click on a node in the graph to view details.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <button
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-medium">Paper Details</span>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-5">
          {/* Paper Title */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground leading-snug">
              {node.title}
            </h3>
            
            {/* Authors */}
            <p className="text-xs text-muted-foreground">
              {node.authors.join(' · ')}
            </p>
            
            {/* Year and Citations */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{node.year}, Scientific Reports</span>
            </div>
            
            <div className="text-xs text-muted-foreground">
              {node.citations} Citations
            </div>
          </div>

          {/* External Links */}
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Open in:</div>
            <div className="flex items-center gap-2">
              <button className="p-1.5 rounded border border-border hover:bg-muted/50 transition-colors">
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Abstract */}
          <div className="space-y-2">
            <p className="text-sm text-foreground/80 leading-relaxed">
              {node.abstract}
            </p>
          </div>

          {/* Cluster Info */}
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Cluster</div>
            <span className="px-2 py-0.5 bg-muted/50 text-muted-foreground rounded text-xs inline-block">
              {node.cluster_label}
            </span>
          </div>

          {/* Dimensions */}
          {node.dimensions && (
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Extracted Dimensions</div>
              <div className="space-y-2">
                {Object.entries(node.dimensions).map(([key, value]) => (
                  <div key={key} className="space-y-1">
                    <div className="text-xs font-medium text-foreground">{key}</div>
                    <div className={cn(
                      "text-xs leading-relaxed",
                      value.confidence === 'high' ? 'text-foreground/80' : 'text-muted-foreground'
                    )}>
                      {value.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
