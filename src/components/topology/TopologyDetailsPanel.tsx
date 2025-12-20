import { DataNode } from '@/types/morphik';
import { ExternalLink, ArrowLeft, FileText, Star, BarChart3, Clock, Sparkles } from 'lucide-react';
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

  // Calculate derived metrics from node data
  const similarity = node.score;
  const citations = node.citations;
  const fwci = (node.citations / 50).toFixed(1); // Approximate FWCI
  const currentYear = new Date().getFullYear();
  const recency = Math.max(0, Math.min(1, 1 - (currentYear - node.year) / 10));

  // Convert dimensions to evaluation format
  const dimensionsList = node.dimensions 
    ? Object.entries(node.dimensions).map(([name, data]) => ({
        name,
        status: data.confidence === 'high' ? 'pass' as const : 
                data.confidence === 'med' ? 'partial' as const : 'fail' as const
      }))
    : [];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <span className="text-sm font-medium">Details</span>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-5">
          {/* Paper Title */}
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Paper</div>
            <div className="flex items-start gap-1">
              <span className="text-sm font-medium text-foreground leading-snug">
                {node.title}
              </span>
              <ExternalLink className="w-3 h-3 text-muted-foreground shrink-0 mt-1" />
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Core Metrics</div>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-muted/30 rounded space-y-1">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Sparkles className="w-3 h-3" />
                  Similarity
                </div>
                <div className="text-sm font-medium">{Math.round(similarity * 100)}%</div>
              </div>
              <div className="p-2 bg-muted/30 rounded space-y-1">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <BarChart3 className="w-3 h-3" />
                  Citations
                </div>
                <div className="text-sm font-medium">{citations}</div>
              </div>
              <div className="p-2 bg-muted/30 rounded space-y-1">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="w-3 h-3" />
                  FWCI
                </div>
                <div className="text-sm font-medium">{fwci}x</div>
              </div>
              <div className="p-2 bg-muted/30 rounded space-y-1">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  Recency
                </div>
                <div className="text-sm font-medium">{Math.round(recency * 100)}%</div>
              </div>
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Category</div>
            <span className="px-2 py-0.5 bg-muted/50 text-muted-foreground rounded text-xs inline-block">
              {node.cluster_label}
            </span>
          </div>

          {/* Abstract */}
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Abstract</div>
            <p className="text-sm text-foreground/80 leading-relaxed">
              {node.abstract}
            </p>
          </div>

          {/* Dimensions Evaluation */}
          {dimensionsList.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Dimensions evaluation</div>
              <div className="space-y-1.5">
                {dimensionsList.map((d, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <div className={cn(
                      'w-2 h-2 rounded-full shrink-0',
                      d.status === 'pass' ? 'bg-emerald-500' :
                      d.status === 'partial' ? 'bg-amber-500' : 'bg-red-400'
                    )} />
                    <span className="text-foreground/80">{d.name}</span>
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
