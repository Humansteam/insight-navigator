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

      {/* Pipeline Progress */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Pipeline:</span>
          <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-primary-glow"
              initial={{ width: 0 }}
              animate={{ 
                width: `${(pipelineStages.filter(s => s.status === 'complete').length / pipelineStages.length) * 100}%` 
              }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between gap-1">
          {pipelineStages.map((stage, i) => {
            const Icon = stageIcons[stage.id] || Circle;
            const isActive = stage.status === 'running';
            const isComplete = stage.status === 'complete';
            
            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "flex items-center gap-1.5 px-2 py-1 rounded text-xs font-mono",
                  isActive && "bg-primary/10 text-primary",
                  isComplete && "text-success",
                  !isActive && !isComplete && "text-muted-foreground/50"
                )}
              >
                <Icon className={cn("w-3.5 h-3.5", isActive && "animate-pulse")} />
                <span className="hidden sm:inline">{stage.name}</span>
                {getStatusIcon(stage.status)}
                {stage.progress !== undefined && stage.status === 'running' && (
                  <span className="text-[10px] text-primary/70">{stage.progress}%</span>
                )}
              </motion.div>
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
