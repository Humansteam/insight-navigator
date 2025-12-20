import { DataNode } from '@/types/morphik';
import { ExternalLink, ArrowLeft, FileText, Star, BarChart3, Clock, Sparkles, Globe, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getClusterIndex } from '@/data/topologyGenerator';

// 5 cluster colors matching TopologyVisualization
const clusterColors = [
  { name: 'Biological Mechanisms', color: '#FF5A7F' },
  { name: 'Clinical Applications', color: '#D97B3D' },
  { name: 'Drug Discovery', color: '#E8C547' },
  { name: 'Molecular Research', color: '#4DC4C4' },
  { name: 'Data Analysis', color: '#6BA8DC' },
];

interface TopologyRightPanelProps {
  nodes: DataNode[];
  selectedNode: DataNode | null;
  selectedNodeId: string | null;
  hoveredNodeId: string | null;
  onSelectNode: (id: string | null) => void;
  onHoverNode: (id: string | null) => void;
  onHighlightCluster?: (clusterIndex: number | null) => void;
}

export const TopologyRightPanel = ({
  nodes,
  selectedNode,
  selectedNodeId,
  hoveredNodeId,
  onSelectNode,
  onHoverNode,
  onHighlightCluster,
}: TopologyRightPanelProps) => {
  // If a paper is selected, show Details view
  if (selectedNode) {
    const node = selectedNode;
    
    // Calculate derived metrics
    const similarity = node.score;
    const citations = node.citations;
    const fwci = (node.citations / 50).toFixed(1);
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
            onClick={() => onSelectNode(null)}
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

            {/* Summary / Full Text */}
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Summary</div>
              <p className="text-sm text-foreground/80 leading-relaxed">
                This research contributes to the understanding of {node.cluster_label.toLowerCase()} by presenting novel findings in {node.title.split(' ').slice(0, 4).join(' ').toLowerCase()}. 
                The study employs rigorous methodology and provides quantitative evidence supporting the main conclusions. 
                Key implications include potential applications in industrial settings and future research directions in related areas.
              </p>
            </div>

            {/* Open in / Links */}
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Open in</div>
              <div className="flex flex-wrap gap-2">
                <a 
                  href="#" 
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded border border-border hover:bg-muted/50 transition-colors text-foreground"
                >
                  <FileText className="w-3.5 h-3.5" />
                  PDF
                </a>
                <a 
                  href="#" 
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded border border-border hover:bg-muted/50 transition-colors text-foreground"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  DOI
                </a>
                <a 
                  href="#" 
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded border border-border hover:bg-muted/50 transition-colors text-foreground"
                >
                  <Globe className="w-3.5 h-3.5" />
                  Publisher
                </a>
                <a 
                  href="#" 
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded border border-border hover:bg-muted/50 transition-colors text-foreground"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Google Scholar
                </a>
              </div>
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
  }

  // Default: Show Papers list with cluster legend
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border">
        <span className="text-sm font-medium text-primary">Papers</span>
        <span className="text-xs text-muted-foreground ml-2">({nodes.length})</span>
      </div>

      {/* Cluster Legend */}
      <div className="px-4 py-3 border-b border-border/50 space-y-2">
        <div className="text-xs text-muted-foreground font-medium">Clusters</div>
        <div className="flex flex-wrap gap-2">
          {clusterColors.map((cluster, idx) => (
            <button
              key={idx}
              onClick={() => onHighlightCluster?.(idx)}
              onMouseEnter={() => onHighlightCluster?.(idx)}
              onMouseLeave={() => onHighlightCluster?.(null)}
              className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <div 
                className="w-2.5 h-2.5 rounded-full shrink-0" 
                style={{ backgroundColor: cluster.color }}
              />
              <span className="text-muted-foreground">{cluster.name}</span>
            </button>
          ))}
        </div>
      </div>

      <ScrollArea className="flex-1">
        {nodes.map((paper) => {
          const isSelected = selectedNodeId === paper.id;
          const isHovered = hoveredNodeId === paper.id;
          const clusterIdx = getClusterIndex(paper.id);
          const clusterColor = clusterColors[clusterIdx]?.color;
          
          return (
            <div
              key={paper.id}
              onClick={() => onSelectNode(paper.id)}
              onMouseEnter={() => onHoverNode(paper.id)}
              onMouseLeave={() => onHoverNode(null)}
              className={cn(
                "px-4 py-3 border-b border-border/50 cursor-pointer transition-colors relative",
                isSelected ? "bg-primary/10" : isHovered ? "bg-muted/50" : "hover:bg-muted/30"
              )}
            >
              {/* Cluster indicator */}
              <div 
                className="absolute left-0 top-0 bottom-0 w-1"
                style={{ backgroundColor: clusterColor }}
              />
              
              {/* Score with progress bar - top right */}
              <div className="absolute top-3 right-4 flex flex-col items-end gap-1">
                <span className="text-xs font-medium text-primary">
                  {Math.round(paper.score * 100)}%
                </span>
                <div className="w-12 h-1 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${paper.score * 100}%` }}
                  />
                </div>
              </div>
              
              {/* Title */}
              <h4 className="text-sm font-medium text-foreground leading-snug mb-1 line-clamp-2 pr-16 pl-2">
                {paper.title}
              </h4>
              
              {/* Authors and Year */}
              <div className="flex items-center justify-between pr-16 pl-2">
                <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                  {paper.authors.join(', ')}
                </p>
                <span className="text-xs text-muted-foreground">{paper.year}</span>
              </div>
            </div>
          );
        })}
      </ScrollArea>
    </div>
  );
};
