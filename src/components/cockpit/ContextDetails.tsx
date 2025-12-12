import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Users, Calendar, Quote, ExternalLink, MessageSquare, X, BarChart3, TrendingUp, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataNode } from '@/types/morphik';
import { cn } from '@/lib/utils';

interface ContextDetailsProps {
  selectedNode: DataNode | null;
  onClose: () => void;
  totalPapers: number;
  velocityScore: number;
  growthRate: number;
}

export const ContextDetails = ({
  selectedNode,
  onClose,
  totalPapers,
  velocityScore,
  growthRate,
}: ContextDetailsProps) => {
  const countryLabels: Record<string, string> = {
    china: 'China',
    usa: 'United States',
    europe: 'Europe',
    other: 'Other',
  };

  return (
    <div className="card-elevated rounded-lg overflow-hidden h-full flex flex-col">
      <AnimatePresence mode="wait">
        {selectedNode ? (
          <motion.div
            key="paper-details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col h-full"
          >
            {/* Header */}
            <div className="p-3 border-b border-card-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Paper Details</span>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Title */}
              <div>
                <h3 className="font-semibold text-foreground leading-tight mb-2">{selectedNode.title}</h3>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {selectedNode.year}
                  </div>
                  <div className="flex items-center gap-1">
                    <Quote className="w-3 h-3" />
                    {selectedNode.citations} citations
                  </div>
                  <div className={cn(
                    "px-1.5 py-0.5 rounded text-xs font-medium",
                    selectedNode.country === 'china' && "bg-data-china/20 text-data-china",
                    selectedNode.country === 'usa' && "bg-data-usa/20 text-data-usa",
                    selectedNode.country === 'europe' && "bg-data-europe/20 text-data-europe",
                    selectedNode.country === 'other' && "bg-data-other/20 text-data-other",
                  )}>
                    {countryLabels[selectedNode.country]}
                  </div>
                </div>
              </div>

              {/* Authors */}
              <div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Users className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">Authors</span>
                </div>
                <p className="text-sm text-foreground">{selectedNode.authors.join(', ')}</p>
              </div>

              {/* Abstract */}
              <div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <FileText className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">Abstract</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{selectedNode.abstract}</p>
              </div>

              {/* Extracted Facts */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Layers className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">Extracted Data</span>
                </div>
                <div className="space-y-1.5">
                  {Object.entries(selectedNode.dimensions).map(([key, val]) => (
                    <div key={key} className="flex items-center justify-between py-1.5 border-b border-card-border/50">
                      <span className="text-xs text-muted-foreground">{key}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-mono text-foreground">{val.value}</span>
                        <span className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          val.confidence === 'high' && "bg-confidence-high",
                          val.confidence === 'med' && "bg-confidence-med",
                          val.confidence === 'low' && "bg-confidence-low",
                        )} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-3 border-t border-card-border flex gap-2">
              <Button variant="glow" className="flex-1" size="sm">
                <MessageSquare className="w-3 h-3 mr-1" />
                Chat with Paper
              </Button>
              <Button variant="outline" size="sm">
                <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="overview"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col h-full"
          >
            {/* Header */}
            <div className="p-3 border-b border-card-border">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Overview</span>
              </div>
            </div>

            {/* Stats */}
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-muted/30 border border-card-border/50">
                  <div className="text-2xl font-bold text-foreground font-mono">{totalPapers.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Papers Analyzed</div>
                </div>
                <div className="p-3 rounded-lg bg-muted/30 border border-card-border/50">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-foreground font-mono">{velocityScore}</span>
                    <span className="text-xs text-muted-foreground">/100</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Velocity Score</div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-muted/30 border border-card-border/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">Growth Rate (YoY)</span>
                  <div className="flex items-center gap-1 text-success">
                    <TrendingUp className="w-3 h-3" />
                    <span className="text-sm font-mono font-semibold">+{growthRate}%</span>
                  </div>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-success rounded-full" 
                    style={{ width: `${Math.min(100, growthRate)}%` }} 
                  />
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground mb-2">Regional Distribution</div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-data-china" />
                      <span className="text-sm text-muted-foreground">China</span>
                    </div>
                    <span className="text-xs font-mono text-foreground">38%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-data-usa" />
                      <span className="text-sm text-muted-foreground">United States</span>
                    </div>
                    <span className="text-xs font-mono text-foreground">29%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-data-europe" />
                      <span className="text-sm text-muted-foreground">Europe</span>
                    </div>
                    <span className="text-xs font-mono text-foreground">24%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-data-other" />
                      <span className="text-sm text-muted-foreground">Other</span>
                    </div>
                    <span className="text-xs font-mono text-foreground">9%</span>
                  </div>
                </div>
              </div>

              {/* Confidence Legend */}
              <div className="pt-3 border-t border-card-border/50">
                <div className="text-xs font-medium text-muted-foreground mb-2">Confidence Levels</div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-confidence-high" />
                    <span className="text-xs text-muted-foreground">High</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-confidence-med" />
                    <span className="text-xs text-muted-foreground">Medium</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-confidence-low" />
                    <span className="text-xs text-muted-foreground">Low</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tip */}
            <div className="mt-auto p-4">
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-xs text-muted-foreground">
                  <span className="text-primary font-medium">Tip:</span> Click on any data point in the topology or table row to view detailed information.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
