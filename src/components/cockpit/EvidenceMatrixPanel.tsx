import { useState, useMemo } from 'react';
import { DataNode } from '@/types/morphik';
import { ExternalLink, ArrowLeft, Star, BarChart3, Clock, Sparkles, FileText, Globe, BookOpen, X, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';

interface EvidenceMatrixPanelProps {
  papers: DataNode[];
  hoveredPaperId?: string | null;
  onHoverPaper?: (id: string | null) => void;
  matrixFilter?: { quadrant: string | null; nodeIds: string[] } | null;
  onClearMatrixFilter?: () => void;
}

// Quadrant colors for filter badge
const quadrantColors: Record<string, string> = {
  'winners': '#4ADE80',
  'emerging': '#38BDF8',
  'mature': '#4ADE80',
  'niche': '#A78BFA',
};

export const EvidenceMatrixPanel = ({ 
  papers, 
  hoveredPaperId,
  onHoverPaper,
  matrixFilter,
  onClearMatrixFilter,
}: EvidenceMatrixPanelProps) => {
  const [selectedPaperId, setSelectedPaperId] = useState<string | null>(null);

  // Filter papers if matrixFilter is active
  const displayPapers = useMemo(() => {
    if (matrixFilter?.quadrant && matrixFilter.nodeIds.length > 0) {
      // For matrix filter, we show papers based on their cluster_label matching the quadrant theme
      // This is a simulation - in real app, you'd have proper mapping
      const quadrantKeywords: Record<string, string[]> = {
        'winners': ['industrial', 'manufacturing', 'processing', 'cathode', 'production'],
        'emerging': ['solid-state', 'electrolyte', 'novel', 'discovery', 'next-gen'],
        'mature': ['recycling', 'recovery', 'established', 'standard'],
        'niche': ['specialized', 'research', 'experimental'],
      };
      const keywords = quadrantKeywords[matrixFilter.quadrant] || [];
      return papers.filter(p => 
        keywords.some(k => 
          p.title.toLowerCase().includes(k) || 
          p.cluster_label.toLowerCase().includes(k)
        )
      ).slice(0, 15); // Limit to 15 papers for demo
    }
    return papers;
  }, [papers, matrixFilter]);

  // Show hovered paper details instantly, or selected paper if clicked
  const displayPaperId = hoveredPaperId || selectedPaperId;
  
  const displayPaper = useMemo(() => {
    return papers.find(p => p.id === displayPaperId) || null;
  }, [papers, displayPaperId]);

  // If a paper is displayed (hovered or selected), show Details view
  if (displayPaper) {
    const node = displayPaper;
    const isHoveredView = hoveredPaperId === node.id;
    
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
      <div className="h-full flex flex-col min-w-[360px]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          {!isHoveredView ? (
            <button
              onClick={() => setSelectedPaperId(null)}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <span className="text-xs text-muted-foreground">Hover preview</span>
          )}
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

  // Default: Show Papers list
  return (
    <div className="h-full flex flex-col min-w-[360px]">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-primary">Evidence Matrix</h3>
          <span className="text-xs text-muted-foreground">
            {displayPapers.length} papers
          </span>
        </div>
        
        {/* Matrix Filter Badge */}
        <AnimatePresence>
          {matrixFilter?.quadrant && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3"
            >
              <div 
                className="flex items-center justify-between px-3 py-2 rounded-lg"
                style={{ 
                  backgroundColor: quadrantColors[matrixFilter.quadrant] + '15',
                  borderLeft: `3px solid ${quadrantColors[matrixFilter.quadrant]}`,
                }}
              >
                <div className="flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5" style={{ color: quadrantColors[matrixFilter.quadrant] }} />
                  <span className="text-xs font-medium capitalize" style={{ color: quadrantColors[matrixFilter.quadrant] }}>
                    {matrixFilter.quadrant} cluster
                  </span>
                </div>
                <button
                  onClick={onClearMatrixFilter}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                  <X className="w-3 h-3 text-muted-foreground" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ScrollArea className="flex-1">
        {displayPapers.map((paper) => (
          <div
            key={paper.id}
            onClick={() => setSelectedPaperId(paper.id)}
            onMouseEnter={() => onHoverPaper?.(paper.id)}
            onMouseLeave={() => onHoverPaper?.(null)}
            className={cn(
              "px-4 py-3 border-b border-border/50 cursor-pointer transition-all relative",
              hoveredPaperId === paper.id 
                ? "bg-primary/10 ring-1 ring-primary/30" 
                : "hover:bg-muted/30"
            )}
          >
            <div className="absolute top-3 right-4 flex flex-col items-end gap-1">
              <span className="text-xs font-medium text-primary">
                {Math.round(paper.score * 100)}%
              </span>
              <div className="w-12 h-1 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${paper.score * 100}%` }}
                />
              </div>
            </div>
            <h4 className="text-sm font-medium text-foreground leading-snug mb-1 line-clamp-2 pr-16">
              {paper.title}
            </h4>
            <div className="flex items-center justify-between pr-16">
              <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                {paper.authors.join(', ')}
              </p>
              <span className="text-xs text-muted-foreground">{paper.year}</span>
            </div>
          </div>
        ))}
        
        {displayPapers.length === 0 && (
          <div className="p-8 text-center text-muted-foreground text-sm">
            No papers match the current filter
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
