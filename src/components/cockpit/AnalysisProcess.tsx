import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnalysisStage, AnalysisStageData } from './AnalysisStage';
import { CompactTimeline } from './CompactTimeline';

interface AnalysisProcessProps {
  query: string;
  onComplete: () => void;
  isCollapsed?: boolean;
}

const initialStages: AnalysisStageData[] = [
  {
    id: 'planning',
    name: 'Planning',
    description: 'Analyzing query and creating research strategy',
    status: 'pending',
    icon: 'search',
    metrics: [],
  },
  {
    id: 'retrieval',
    name: 'Retrieval',
    description: 'Searching scientific papers across databases',
    status: 'pending',
    icon: 'file',
    metrics: [],
  },
  {
    id: 'schema',
    name: 'Schema Design',
    description: 'Generating dynamic dimensions for analysis',
    status: 'pending',
    icon: 'database',
    metrics: [],
  },
  {
    id: 'extraction',
    name: 'Extraction',
    description: 'Extracting facts and findings from papers',
    status: 'pending',
    icon: 'chart',
    metrics: [],
  },
  {
    id: 'topology',
    name: 'Topology Analysis',
    description: 'Analyzing spatial distribution and divergence',
    status: 'pending',
    icon: 'map',
    metrics: [],
  },
  {
    id: 'synthesis',
    name: 'Synthesis',
    description: 'Generating strategic report',
    status: 'pending',
    icon: 'edit',
    metrics: [],
  },
];

// Simulated metrics for each stage
const stageMetrics: Record<string, { label: string; value: string | number }[]> = {
  planning: [
    { label: 'Queries', value: 4 },
    { label: 'Regions', value: 'China, USA, EU' },
  ],
  retrieval: [
    { label: 'Papers found', value: 12 },
    { label: 'Sources', value: 3 },
  ],
  schema: [
    { label: 'Dimensions', value: 6 },
    { label: 'Type', value: 'Comparative' },
  ],
  extraction: [
    { label: 'Facts', value: 47 },
    { label: 'Confidence', value: '87%' },
  ],
  topology: [
    { label: 'Clusters', value: 3 },
    { label: 'Divergence', value: 'High' },
  ],
  synthesis: [
    { label: 'Sections', value: 5 },
    { label: 'Citations', value: 12 },
  ],
};

export const AnalysisProcess = ({ query, onComplete, isCollapsed = false }: AnalysisProcessProps) => {
  const [stages, setStages] = useState<AnalysisStageData[]>(initialStages);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [isProcessComplete, setIsProcessComplete] = useState(false);

  // Simulate the analysis process
  useEffect(() => {
    if (currentStageIndex >= stages.length) {
      setIsProcessComplete(true);
      onComplete();
      return;
    }

    // Set current stage to running
    setStages(prev => prev.map((stage, idx) => ({
      ...stage,
      status: idx === currentStageIndex ? 'running' : stage.status,
    })));

    // Complete current stage after delay
    const timeout = setTimeout(() => {
      setStages(prev => prev.map((stage, idx) => ({
        ...stage,
        status: idx === currentStageIndex ? 'complete' : stage.status,
        metrics: idx === currentStageIndex ? stageMetrics[stage.id] : stage.metrics,
      })));
      setCurrentStageIndex(prev => prev + 1);
    }, 1500 + Math.random() * 1000); // 1.5-2.5s per stage

    return () => clearTimeout(timeout);
  }, [currentStageIndex, stages.length, onComplete]);

  // Show compact timeline when collapsed
  if (isCollapsed && isProcessComplete) {
    return <CompactTimeline stages={stages} />;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-2xl mx-auto py-8 px-6"
    >
      {/* Query display */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 p-4 rounded-lg bg-muted/30 border border-border"
      >
        <div className="text-xs text-muted-foreground mb-1">Analyzing query</div>
        <div className="text-foreground font-medium">{query}</div>
      </motion.div>

      {/* Stages */}
      <div className="space-y-0">
        <AnimatePresence mode="sync">
          {stages.map((stage, idx) => (
            <AnalysisStage
              key={stage.id}
              stage={stage}
              isLast={idx === stages.length - 1}
            />
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
