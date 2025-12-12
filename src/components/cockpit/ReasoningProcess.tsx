import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Search, Loader2, BarChart3, Sparkles } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ReasoningProcessProps {
  isActive: boolean;
  stage: 'searching' | 'extracting' | 'complete';
  searchQueries: string[];
  dimensions: string[];
  papersFound: number;
}

export const ReasoningProcess = ({
  isActive,
  stage,
  searchQueries,
  dimensions,
  papersFound,
}: ReasoningProcessProps) => {
  const [isOpen, setIsOpen] = useState(true);

  if (!isActive && stage === 'complete') return null;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border-b border-border">
      <CollapsibleTrigger className="w-full p-3 flex items-center gap-3 hover:bg-muted/30 transition-colors">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1 text-left">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">Intelligence Engine</span>
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
              {stage === 'searching' ? 'searching' : stage === 'extracting' ? 'extraction' : 'complete'}
            </Badge>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
            {stage !== 'complete' && <Loader2 className="w-3 h-3 animate-spin" />}
            <span>
              {stage === 'searching' 
                ? `Searching for relevant papers...`
                : stage === 'extracting'
                ? `Extracting facts from ${papersFound} papers...`
                : `Analysis complete`
              }
            </span>
          </div>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="px-3 pb-3 pl-14 space-y-4">
          {/* Search Queries */}
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="text-xs text-muted-foreground mb-2">Search Queries:</div>
            <div className="space-y-1.5">
              {searchQueries.map((query, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-sm text-foreground"
                >
                  {query}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Extraction Progress */}
          <div className="flex items-center gap-2 text-sm">
            <BarChart3 className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">
              Extracting across {dimensions.length} dimensions...
            </span>
          </div>

          {/* Dimensions */}
          <div>
            <div className="text-sm font-medium text-foreground mb-2">**Dimensions:**</div>
            <ul className="space-y-1">
              {dimensions.map((dim, i) => (
                <motion.li
                  key={dim}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="text-sm text-muted-foreground flex items-center gap-2"
                >
                  <span className="text-primary">•</span>
                  {dim}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};