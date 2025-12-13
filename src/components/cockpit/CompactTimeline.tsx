import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { AnalysisStageData } from './AnalysisStage';

interface CompactTimelineProps {
  stages: AnalysisStageData[];
  className?: string;
}

export const CompactTimeline = ({ stages, className }: CompactTimelineProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const completedCount = stages.filter(s => s.status === 'complete').length;
  const totalFacts = stages.find(s => s.id === 'extraction')?.metrics?.find(m => m.label === 'Facts')?.value || 0;
  const totalPapers = stages.find(s => s.id === 'retrieval')?.metrics?.find(m => m.label === 'Papers found')?.value || 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("border-b border-border bg-muted/20", className)}
    >
      {/* Collapsed view */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-2 flex items-center justify-between hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {stages.map((stage, idx) => (
              <motion.div
                key={stage.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className={cn(
                  "w-2 h-2 rounded-full",
                  stage.status === 'complete' && "bg-primary",
                  stage.status === 'running' && "bg-primary/50 animate-pulse",
                  stage.status === 'pending' && "bg-muted-foreground/30"
                )}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            Analysis complete • {totalPapers} papers • {totalFacts} facts extracted
          </span>
        </div>
        
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
      
      {/* Expanded view */}
      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="px-4 pb-3 grid grid-cols-6 gap-2"
        >
          {stages.map((stage) => (
            <div key={stage.id} className="text-center">
              <div className={cn(
                "w-6 h-6 rounded-full mx-auto mb-1 flex items-center justify-center",
                stage.status === 'complete' && "bg-primary text-primary-foreground"
              )}>
                <Check className="w-3 h-3" />
              </div>
              <div className="text-[10px] font-medium text-foreground leading-tight">
                {stage.name}
              </div>
              {stage.metrics && stage.metrics[0] && (
                <div className="text-[9px] text-muted-foreground">
                  {stage.metrics[0].value}
                </div>
              )}
            </div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};
