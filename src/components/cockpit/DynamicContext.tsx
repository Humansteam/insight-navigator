import { motion, AnimatePresence } from 'framer-motion';
import { FileText, MessageSquare, X, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
    <div className="h-full flex flex-col bg-background">
      <AnimatePresence mode="wait">
        {node ? (
          <motion.div
            key="details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col h-full"
          >
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center justify-between shrink-0">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Dynamic Context Details
              </span>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
              {/* Title */}
              <div>
                <div className="text-xs text-muted-foreground mb-1">Title</div>
                <h3 className="font-medium text-foreground text-sm leading-tight">
                  {node.title}
                </h3>
              </div>

              {/* Authors */}
              <div>
                <div className="text-xs text-muted-foreground mb-1">Authors</div>
                <p className="text-sm text-foreground">{node.authors.join(', ')}</p>
              </div>

              {/* Meta */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground">{node.year}</span>
                <span className="text-muted-foreground">•</span>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs",
                    node.country === 'china' && "border-red-500/50 text-red-400",
                    node.country === 'usa' && "border-blue-500/50 text-blue-400",
                    node.country === 'europe' && "border-yellow-500/50 text-yellow-400",
                  )}
                >
                  {countryLabels[node.country]}
                </Badge>
                <span className="text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">{node.citations} citations</span>
              </div>

              {/* Abstract */}
              <div>
                <div className="text-xs text-muted-foreground mb-1">Abstract</div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {node.abstract}
                </p>
              </div>

              {/* Extracted Insights */}
              <div>
                <div className="text-xs text-muted-foreground mb-2">Extracted Insights</div>
                <ul className="space-y-2">
                  {Object.entries(node.dimensions).map(([key, val]) => (
                    val.value !== '—' && (
                      <li key={key} className="text-sm">
                        <span className="text-primary">•</span>
                        <span className="text-muted-foreground ml-2">{key}:</span>
                        <span className="text-foreground ml-1">{val.value}</span>
                      </li>
                    )
                  ))}
                </ul>
              </div>

              {/* Source Links */}
              <div>
                <div className="text-xs text-muted-foreground mb-2">Source Links</div>
                <a href="#" className="flex items-center gap-1.5 text-sm text-primary hover:underline">
                  <Link2 className="w-4 h-4" />
                  View full paper
                </a>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-border shrink-0">
              <Button className="w-full" size="sm">
                <MessageSquare className="w-4 h-4 mr-2" />
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
            className="h-full flex flex-col items-center justify-center text-center p-6"
          >
            <FileText className="w-10 h-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">
              Select a paper from the graph or table to view details
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};