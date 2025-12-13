import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Check, Loader2, Search, FileText, Database, BarChart3, Map, FileEdit } from 'lucide-react';

export type StageStatus = 'pending' | 'running' | 'complete';

export interface AnalysisStageData {
  id: string;
  name: string;
  description: string;
  status: StageStatus;
  icon: 'search' | 'file' | 'database' | 'chart' | 'map' | 'edit';
  metrics?: {
    label: string;
    value: string | number;
  }[];
}

interface AnalysisStageProps {
  stage: AnalysisStageData;
  isLast?: boolean;
}

const iconMap = {
  search: Search,
  file: FileText,
  database: Database,
  chart: BarChart3,
  map: Map,
  edit: FileEdit,
};

export const AnalysisStage = ({ stage, isLast }: AnalysisStageProps) => {
  const Icon = iconMap[stage.icon];
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="relative flex gap-4"
    >
      {/* Timeline connector */}
      {!isLast && (
        <div className="absolute left-5 top-12 w-0.5 h-[calc(100%-24px)] bg-border">
          {stage.status === 'complete' && (
            <motion.div 
              initial={{ height: 0 }}
              animate={{ height: '100%' }}
              transition={{ duration: 0.5 }}
              className="w-full bg-primary"
            />
          )}
        </div>
      )}
      
      {/* Stage icon */}
      <div className={cn(
        "relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-300",
        stage.status === 'pending' && "bg-muted border border-border text-muted-foreground",
        stage.status === 'running' && "bg-primary/20 border-2 border-primary text-primary",
        stage.status === 'complete' && "bg-primary text-primary-foreground"
      )}>
        {stage.status === 'running' ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : stage.status === 'complete' ? (
          <Check className="w-5 h-5" />
        ) : (
          <Icon className="w-5 h-5" />
        )}
      </div>
      
      {/* Stage content */}
      <div className="flex-1 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <h3 className={cn(
            "font-medium transition-colors",
            stage.status === 'pending' && "text-muted-foreground",
            stage.status === 'running' && "text-foreground",
            stage.status === 'complete' && "text-foreground"
          )}>
            {stage.name}
          </h3>
          {stage.status === 'running' && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-primary font-medium"
            >
              Processing...
            </motion.span>
          )}
        </div>
        
        <p className={cn(
          "text-sm mb-2",
          stage.status === 'pending' ? "text-muted-foreground/50" : "text-muted-foreground"
        )}>
          {stage.description}
        </p>
        
        {/* Metrics */}
        <AnimatePresence>
          {stage.status !== 'pending' && stage.metrics && stage.metrics.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap gap-3 mt-2"
            >
              {stage.metrics.map((metric, idx) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/50 text-xs"
                >
                  <span className="text-muted-foreground">{metric.label}:</span>
                  <span className="font-medium text-foreground">{metric.value}</span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
