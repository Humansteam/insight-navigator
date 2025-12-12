import { motion } from 'framer-motion';
import { Cpu, Database, FileSearch, Network, PenTool, CheckCircle2, Loader2, Circle } from 'lucide-react';
import { PipelineStage, QueryTag } from '@/types/morphik';
import { cn } from '@/lib/utils';

interface LiveStatusHeaderProps {
  pipelineStages: PipelineStage[];
  queryTags: QueryTag[];
  dimensions: string[];
}

const stageIcons: Record<string, React.ElementType> = {
  planner: Cpu,
  retriever: Database,
  extractor: FileSearch,
  topology: Network,
  writer: PenTool,
};

export const LiveStatusHeader = ({ pipelineStages, queryTags, dimensions }: LiveStatusHeaderProps) => {
  const getTagColor = (type: QueryTag['type']) => {
    switch (type) {
      case 'domain':
        return 'bg-accent/20 text-accent border-accent/30';
      case 'method':
        return 'bg-primary/20 text-primary border-primary/30';
      case 'material':
        return 'bg-success/20 text-success border-success/30';
      case 'region':
        return 'bg-warning/20 text-warning border-warning/30';
    }
  };

  const getStatusIcon = (status: PipelineStage['status']) => {
    switch (status) {
      case 'complete':
        return <CheckCircle2 className="w-3 h-3 text-success" />;
      case 'running':
        return <Loader2 className="w-3 h-3 text-primary animate-spin" />;
      case 'error':
        return <Circle className="w-3 h-3 text-destructive" />;
      default:
        return <Circle className="w-3 h-3 text-muted-foreground/40" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-elevated rounded-lg p-4 space-y-4"
    >
      {/* Query Tags */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Query:</span>
        {queryTags.map((tag, i) => (
          <motion.span
            key={tag.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              "px-2 py-0.5 rounded text-xs font-medium border",
              getTagColor(tag.type)
            )}
          >
            {tag.label}
          </motion.span>
        ))}
      </div>

      {/* Pipeline Progress - Step Indicator */}
      <div className="relative">
        <div className="flex items-center justify-between">
          {pipelineStages.map((stage, i) => {
            const isActive = stage.status === 'running';
            const isComplete = stage.status === 'complete';
            const isLast = i === pipelineStages.length - 1;
            
            return (
              <div key={stage.id} className="flex items-center flex-1 last:flex-none">
                {/* Stage Node */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1, type: 'spring', stiffness: 300 }}
                  className="flex flex-col items-center gap-1.5"
                >
                  {/* Dot */}
                  <div className={cn(
                    "w-3 h-3 rounded-full border-2 transition-all duration-300",
                    isComplete && "bg-primary border-primary shadow-[0_0_8px_hsl(var(--primary)/0.5)]",
                    isActive && "bg-background border-primary animate-pulse shadow-[0_0_12px_hsl(var(--primary)/0.6)]",
                    !isActive && !isComplete && "bg-muted border-muted-foreground/30"
                  )}>
                    {isActive && (
                      <motion.div
                        className="w-full h-full rounded-full bg-primary"
                        animate={{ scale: [0.5, 1, 0.5], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    )}
                  </div>
                  
                  {/* Label */}
                  <div className={cn(
                    "text-[10px] font-medium text-center whitespace-nowrap",
                    isComplete && "text-primary",
                    isActive && "text-primary",
                    !isActive && !isComplete && "text-muted-foreground/50"
                  )}>
                    {stage.name}
                    {stage.progress !== undefined && isActive && (
                      <span className="text-primary/70 ml-1">{stage.progress}%</span>
                    )}
                  </div>
                </motion.div>

                {/* Connector Line */}
                {!isLast && (
                  <div className="flex-1 h-0.5 mx-2 bg-muted-foreground/20 relative overflow-hidden">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-primary"
                      initial={{ width: 0 }}
                      animate={{ 
                        width: isComplete ? '100%' : isActive ? '50%' : '0%' 
                      }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Dimensions */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Dimensions:</span>
        {dimensions.map((dim, i) => (
          <motion.span
            key={dim}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.05 }}
            className="px-2 py-0.5 rounded bg-muted text-muted-foreground text-xs font-medium"
          >
            {dim}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
};
