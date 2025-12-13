import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Search, FileText, Database, BarChart3, Map, FileEdit, Globe, Loader2, Check } from 'lucide-react';

interface StageNode {
  id: string;
  stage: number;
  name: string;
  icon: 'search' | 'file' | 'database' | 'chart' | 'map' | 'edit' | 'globe';
  x: number;
  y: number;
  status: 'pending' | 'running' | 'complete';
  outputs: string[];
}

interface SubNode {
  id: string;
  parentId: string;
  label: string;
  x: number;
  y: number;
  status: 'pending' | 'running' | 'complete';
}

interface PipelineDAGProps {
  query: string;
  onComplete: () => void;
}

const iconMap = {
  search: Search,
  file: FileText,
  database: Database,
  chart: BarChart3,
  map: Map,
  edit: FileEdit,
  globe: Globe,
};

// Main 6 stages + optional web search
const mainStages: StageNode[] = [
  { 
    id: 'planning', 
    stage: 1, 
    name: 'PLANNING', 
    icon: 'search', 
    x: 100, y: 180, 
    status: 'pending',
    outputs: ['analysis_focus', 'regions', 'search_queries']
  },
  { 
    id: 'retrieval', 
    stage: 2, 
    name: 'RETRIEVAL', 
    icon: 'file', 
    x: 280, y: 180, 
    status: 'pending',
    outputs: ['papers_15', 'umap_coords', 'clusters']
  },
  { 
    id: 'schema', 
    stage: 3, 
    name: 'SCHEMA', 
    icon: 'database', 
    x: 460, y: 180, 
    status: 'pending',
    outputs: ['dimensions_6', 'query_type', 'rationale']
  },
  { 
    id: 'extraction', 
    stage: 4, 
    name: 'EXTRACTION', 
    icon: 'chart', 
    x: 640, y: 180, 
    status: 'pending',
    outputs: ['facts_47', 'confidence', 'quotes']
  },
  { 
    id: 'topology', 
    stage: 5, 
    name: 'TOPOLOGY', 
    icon: 'map', 
    x: 820, y: 180, 
    status: 'pending',
    outputs: ['divergence_0.73', 'centroids', 'clusters']
  },
  { 
    id: 'synthesis', 
    stage: 6, 
    name: 'SYNTHESIS', 
    icon: 'edit', 
    x: 1000, y: 180, 
    status: 'pending',
    outputs: ['report_md', 'citations_12', 'sections_5']
  },
];

// Optional web search branch
const webSearchNode: StageNode = {
  id: 'websearch',
  stage: 0,
  name: 'WEB SEARCH',
  icon: 'globe',
  x: 280, y: 80,
  status: 'pending',
  outputs: ['external_data']
};

// Output sub-nodes for each stage
const generateSubNodes = (stages: StageNode[]): SubNode[] => {
  const subNodes: SubNode[] = [];
  stages.forEach(stage => {
    stage.outputs.forEach((output, idx) => {
      subNodes.push({
        id: `${stage.id}-${output}`,
        parentId: stage.id,
        label: output.replace(/_/g, ' '),
        x: stage.x + (idx - 1) * 50,
        y: stage.y + 70,
        status: 'pending',
      });
    });
  });
  return subNodes;
};

export const PipelineDAG = ({ query, onComplete }: PipelineDAGProps) => {
  const [stages, setStages] = useState<StageNode[]>(mainStages);
  const [subNodes, setSubNodes] = useState<SubNode[]>(generateSubNodes(mainStages));
  const [webSearch, setWebSearch] = useState<StageNode>(webSearchNode);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [showWebSearch] = useState(true); // Could be dynamic based on query

  // Process stages sequentially
  useEffect(() => {
    if (currentStageIndex >= stages.length) {
      setTimeout(onComplete, 800);
      return;
    }

    const currentStage = stages[currentStageIndex];

    // Set stage to running
    setStages(prev => prev.map((s, idx) => 
      idx === currentStageIndex ? { ...s, status: 'running' } : s
    ));

    // If first stage and web search enabled, run it in parallel
    if (currentStageIndex === 0 && showWebSearch) {
      setWebSearch(prev => ({ ...prev, status: 'running' }));
      setTimeout(() => {
        setWebSearch(prev => ({ ...prev, status: 'complete' }));
      }, 600);
    }

    // Complete stage and sub-nodes after delay
    const timeout = setTimeout(() => {
      // Complete main stage
      setStages(prev => prev.map((s, idx) => 
        idx === currentStageIndex ? { ...s, status: 'complete' } : s
      ));

      // Complete sub-nodes
      setSubNodes(prev => prev.map(sub => 
        sub.parentId === currentStage.id ? { ...sub, status: 'complete' } : sub
      ));

      setCurrentStageIndex(prev => prev + 1);
    }, 1000 + Math.random() * 500);

    return () => clearTimeout(timeout);
  }, [currentStageIndex, stages.length, showWebSearch, onComplete]);

  const getStageColor = (status: string) => {
    switch (status) {
      case 'complete': return 'bg-primary text-primary-foreground border-primary';
      case 'running': return 'bg-primary/20 text-primary border-primary';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-4">
      {/* Query display */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center mb-6"
      >
        <div className="px-5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm text-center max-w-xl">
          {query}
        </div>
      </motion.div>

      {/* DAG Container */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative bg-muted/10 rounded-xl border border-border p-6 overflow-x-auto"
      >
        <svg width="1100" height="320" className="min-w-[1100px]">
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--primary))" />
            </marker>
            <marker
              id="arrowhead-muted"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--muted-foreground))" opacity="0.3" />
            </marker>
          </defs>

          {/* Main pipeline connections (straight lines) */}
          {stages.slice(0, -1).map((stage, idx) => {
            const nextStage = stages[idx + 1];
            const isActive = stage.status === 'complete';
            return (
              <g key={`conn-${stage.id}`}>
                <motion.line
                  x1={stage.x + 60}
                  y1={stage.y}
                  x2={nextStage.x - 60}
                  y2={nextStage.y}
                  stroke={isActive ? 'hsl(var(--primary))' : 'hsl(var(--border))'}
                  strokeWidth={isActive ? 3 : 2}
                  strokeDasharray={isActive ? "0" : "5,5"}
                  markerEnd={isActive ? 'url(#arrowhead)' : 'url(#arrowhead-muted)'}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                />
              </g>
            );
          })}

          {/* Web search connection to retrieval */}
          {showWebSearch && (
            <motion.line
              x1={webSearch.x}
              y1={webSearch.y + 30}
              x2={stages[1].x}
              y2={stages[1].y - 40}
              stroke={webSearch.status === 'complete' ? 'hsl(var(--primary))' : 'hsl(var(--border))'}
              strokeWidth={2}
              strokeDasharray={webSearch.status === 'complete' ? "0" : "5,5"}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
            />
          )}

          {/* Sub-node connections (vertical lines from stages) */}
          {subNodes.map((sub) => {
            const parent = stages.find(s => s.id === sub.parentId);
            if (!parent) return null;
            return (
              <motion.line
                key={sub.id}
                x1={parent.x}
                y1={parent.y + 35}
                x2={sub.x}
                y2={sub.y - 10}
                stroke={sub.status === 'complete' ? 'hsl(var(--primary))' : 'hsl(var(--border))'}
                strokeWidth={1}
                opacity={0.5}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: sub.status !== 'pending' ? 1 : 0 }}
              />
            );
          })}

          {/* Web Search Node */}
          {showWebSearch && (
            <motion.g
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <rect
                x={webSearch.x - 55}
                y={webSearch.y - 20}
                width={110}
                height={40}
                rx={8}
                className={cn(
                  "stroke-2 transition-all duration-300",
                  getStageColor(webSearch.status)
                )}
                fill="currentColor"
                stroke="currentColor"
              />
              <foreignObject x={webSearch.x - 50} y={webSearch.y - 15} width={100} height={30}>
                <div className="flex items-center justify-center gap-1.5 h-full">
                  {webSearch.status === 'running' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : webSearch.status === 'complete' ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <Globe className="w-3.5 h-3.5" />
                  )}
                  <span className="text-[10px] font-medium">WEB SEARCH</span>
                </div>
              </foreignObject>
            </motion.g>
          )}

          {/* Main Stage Nodes */}
          {stages.map((stage, idx) => {
            const Icon = iconMap[stage.icon];
            return (
              <motion.g
                key={stage.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
              >
                {/* Stage box */}
                <rect
                  x={stage.x - 55}
                  y={stage.y - 35}
                  width={110}
                  height={70}
                  rx={12}
                  className={cn(
                    "transition-all duration-300",
                    stage.status === 'complete' && "fill-primary stroke-primary",
                    stage.status === 'running' && "fill-primary/20 stroke-primary stroke-2",
                    stage.status === 'pending' && "fill-muted stroke-border"
                  )}
                />
                
                {/* Running pulse */}
                {stage.status === 'running' && (
                  <motion.rect
                    x={stage.x - 55}
                    y={stage.y - 35}
                    width={110}
                    height={70}
                    rx={12}
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    initial={{ opacity: 1 }}
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}

                {/* Stage content */}
                <foreignObject x={stage.x - 50} y={stage.y - 30} width={100} height={60}>
                  <div className={cn(
                    "flex flex-col items-center justify-center h-full gap-1",
                    stage.status === 'complete' && "text-primary-foreground",
                    stage.status === 'running' && "text-primary",
                    stage.status === 'pending' && "text-muted-foreground"
                  )}>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-bold opacity-60">{stage.stage}.</span>
                      {stage.status === 'running' ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : stage.status === 'complete' ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                    </div>
                    <span className="text-[11px] font-bold tracking-wide">{stage.name}</span>
                  </div>
                </foreignObject>
              </motion.g>
            );
          })}

          {/* Sub-nodes (outputs) */}
          {subNodes.map((sub, idx) => (
            <AnimatePresence key={sub.id}>
              {sub.status !== 'pending' && (
                <motion.g
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <rect
                    x={sub.x - 40}
                    y={sub.y}
                    width={80}
                    height={24}
                    rx={4}
                    className="fill-muted/50 stroke-border"
                  />
                  <foreignObject x={sub.x - 38} y={sub.y + 2} width={76} height={20}>
                    <div className="text-[9px] text-muted-foreground font-mono text-center truncate px-1">
                      {sub.label}
                    </div>
                  </foreignObject>
                </motion.g>
              )}
            </AnimatePresence>
          ))}
        </svg>
      </motion.div>

      {/* Progress indicator */}
      <div className="mt-4 flex items-center justify-center gap-2">
        {stages.map((stage, idx) => (
          <div
            key={stage.id}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              stage.status === 'complete' && "bg-primary",
              stage.status === 'running' && "bg-primary animate-pulse w-3 h-3",
              stage.status === 'pending' && "bg-muted-foreground/30"
            )}
          />
        ))}
      </div>
    </div>
  );
};
