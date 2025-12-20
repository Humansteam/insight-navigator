import { DataNode } from '@/types/morphik';
import { ExternalLink, ArrowLeft, FileText, BookOpen, Quote, Users, Calendar, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TopologyDetailsPanelProps {
  node: DataNode | null;
  nodes?: DataNode[];
  onBack?: () => void;
}

// Country label mapping
const countryLabels: Record<string, string> = {
  china: 'China',
  usa: 'United States',
  europe: 'Europe',
  other: 'Other',
};

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
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground leading-snug">
              {node.title}
            </h3>
            
            {/* Authors */}
            <div className="flex items-start gap-2">
              <Users className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                {node.authors.length > 2 
                  ? `${node.authors[0]} + ${node.authors.length - 1} authors`
                  : node.authors.join(', ')
                }
              </p>
            </div>
            
            {/* Year and Journal */}
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{node.year}</span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">Scientific Reports</span>
            </div>
            
            {/* Citations */}
            <div className="flex items-center gap-2">
              <Quote className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs text-foreground font-medium">{node.citations} Citations</span>
            </div>

            {/* Country */}
            <div className="flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{countryLabels[node.country] || node.country}</span>
            </div>
          </div>

          {/* External Links */}
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Open in:</div>
            <div className="flex items-center gap-2">
              <button className="px-2 py-1 text-xs rounded border border-border hover:bg-muted/50 transition-colors flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                PDF
              </button>
              <button className="px-2 py-1 text-xs rounded border border-border hover:bg-muted/50 transition-colors flex items-center gap-1">
                <ExternalLink className="w-3 h-3" />
                DOI
              </button>
            </div>
          </div>

          {/* Abstract */}
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground font-medium">Abstract</div>
            <p className="text-sm text-foreground/80 leading-relaxed">
              {node.abstract}
            </p>
          </div>

          {/* Cluster Info */}
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Research Cluster</div>
            <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs inline-block font-medium">
              {node.cluster_label}
            </span>
          </div>

          {/* Relevance Score */}
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Relevance Score</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${node.score * 100}%` }}
                />
              </div>
              <span className="text-xs font-medium text-foreground">{Math.round(node.score * 100)}%</span>
            </div>
          </div>

          {/* Dimensions */}
          {node.dimensions && (
            <div className="space-y-3">
              <div className="text-xs text-muted-foreground font-medium">Extracted Dimensions</div>
              <div className="space-y-3">
                {Object.entries(node.dimensions).map(([key, value]) => (
                  value.value !== '—' && (
                    <div key={key} className="space-y-1">
                      <div className="text-xs font-medium text-foreground flex items-center gap-2">
                        {key}
                        <span className={cn(
                          "px-1.5 py-0.5 rounded text-[10px]",
                          value.confidence === 'high' 
                            ? 'bg-emerald-500/10 text-emerald-600' 
                            : value.confidence === 'med'
                            ? 'bg-amber-500/10 text-amber-600'
                            : 'bg-muted text-muted-foreground'
                        )}>
                          {value.confidence}
                        </span>
                      </div>
                      <div className="text-xs text-foreground/70 leading-relaxed pl-0">
                        {value.value}
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
