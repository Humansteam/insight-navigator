import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Users, Calendar, Quote, ExternalLink, MessageSquare, X, Layers, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataNode } from '@/types/morphik';
import { cn } from '@/lib/utils';

interface DynamicContextProps {
  node: DataNode | null;
  onClose: () => void;
}

const countryLabels: Record<string, string> = {
  china: 'China',
  usa: 'USA',
  europe: 'Europe',
  other: 'Other',
};

export const DynamicContext = ({ node, onClose }: DynamicContextProps) => {
  return (
    <div className="w-[280px] shrink-0 overflow-hidden flex flex-col">
      <AnimatePresence mode="wait">
        {node ? (
          <motion.div
            key="details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="card-elevated rounded-lg flex flex-col h-full overflow-hidden"
          >
            {/* Header */}
            <div className="p-3 border-b border-card-border flex items-center justify-between shrink-0">
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Dynamic Context Details
              </span>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
                <X className="w-3 h-3" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
              {/* Title */}
              <div>
                <div className="text-[10px] text-muted-foreground mb-1">Title</div>
                <h3 className="font-medium text-foreground text-sm leading-tight">
                  {node.title}
                </h3>
              </div>

              {/* Authors */}
              <div>
                <div className="text-[10px] text-muted-foreground mb-1">Authors</div>
                <p className="text-sm text-foreground">{node.authors.join(', ')}</p>
              </div>

              {/* Meta */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground">{node.year}</span>
                <span className="text-muted-foreground">•</span>
                <span className={cn(
                  "px-1.5 py-0.5 rounded text-[10px] font-medium",
                  node.country === 'china' && "bg-data-china/20 text-data-china",
                  node.country === 'usa' && "bg-data-usa/20 text-data-usa",
                  node.country === 'europe' && "bg-data-europe/20 text-data-europe",
                )}>
                  {countryLabels[node.country]}
                </span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">{node.citations} citations</span>
              </div>

              {/* Abstract */}
              <div>
                <div className="text-[10px] text-muted-foreground mb-1">Abstract</div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {node.abstract}
                </p>
              </div>

              {/* Extracted Insights */}
              <div>
                <div className="text-[10px] text-muted-foreground mb-2">Extracted Insights</div>
                <ul className="space-y-1.5">
                  {Object.entries(node.dimensions).map(([key, val]) => (
                    <li key={key} className="flex items-start gap-2 text-xs">
                      <span className="text-primary">•</span>
                      <span className="text-foreground">
                        <span className="text-muted-foreground">{key}:</span> {val.value}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Links */}
              <div>
                <div className="text-[10px] text-muted-foreground mb-2">Source Links</div>
                <div className="space-y-1">
                  <a href="#" className="flex items-center gap-1.5 text-xs text-primary hover:underline">
                    <Link2 className="w-3 h-3" />
                    View full paper
                  </a>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-3 border-t border-card-border shrink-0">
              <Button variant="glow" className="w-full" size="sm">
                <MessageSquare className="w-3 h-3 mr-1.5" />
                Chat with Paper
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="card-elevated rounded-lg p-4 h-full flex flex-col items-center justify-center text-center"
          >
            <FileText className="w-8 h-8 text-muted-foreground/30 mb-2" />
            <p className="text-xs text-muted-foreground">
              Select a paper from the graph or grid to view details
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
