import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Check, ChevronUp, ChevronDown, Search, Globe, MousePointer, FileText, Loader2, Database, BarChart3, Map, FileEdit } from 'lucide-react';

interface ActionItem {
  id: string;
  type: 'searching' | 'browsing' | 'clicking' | 'creating' | 'extracting' | 'analyzing';
  label: string;
  detail?: string;
  status: 'pending' | 'running' | 'complete';
}

interface TaskBlock {
  id: string;
  stage: string; // Stage number/name for reference
  title: string;
  description: string;
  status: 'pending' | 'running' | 'complete';
  actions: ActionItem[];
  finding?: string;
  metrics?: { label: string; value: string | number }[];
}

interface ChatAnalysisProps {
  query: string;
  onComplete: () => void;
}

const actionIcons = {
  searching: Search,
  browsing: Globe,
  clicking: MousePointer,
  creating: FileText,
  extracting: Database,
  analyzing: BarChart3,
};

// All 6 stages from the Morphik pipeline specification
const initialTasks: TaskBlock[] = [
  {
    id: 'planning',
    stage: '1. PLANNING',
    title: 'Planning analysis strategy',
    description: 'AI analyzes query and creates research plan with focus areas, regions of interest, and search queries.',
    status: 'pending',
    actions: [
      { id: 'p1', type: 'analyzing', label: 'Analyzing', detail: 'query intent and scope', status: 'pending' },
      { id: 'p2', type: 'creating', label: 'Creating', detail: 'search_queries.json', status: 'pending' },
      { id: 'p3', type: 'creating', label: 'Defining', detail: 'regions: China, USA, Europe', status: 'pending' },
    ],
    finding: 'Research plan ready. Focus: comparative analysis of lithium battery manufacturing efficiency.',
    metrics: [
      { label: 'Search queries', value: 4 },
      { label: 'Regions', value: 'China, USA, EU' },
    ],
  },
  {
    id: 'retrieval',
    stage: '2. RETRIEVAL',
    title: 'Retrieving scientific papers',
    description: 'Searching scientific databases using generated queries. Up to 15 papers retrieved.',
    status: 'pending',
    actions: [
      { id: 'r1', type: 'searching', label: 'Searching', detail: 'lithium battery extraction efficiency comparison...', status: 'pending' },
      { id: 'r2', type: 'browsing', label: 'Browsing', detail: 'https://scholar.google.com', status: 'pending' },
      { id: 'r3', type: 'browsing', label: 'Browsing', detail: 'https://semantic-scholar.org', status: 'pending' },
      { id: 'r4', type: 'extracting', label: 'Extracting', detail: 'paper metadata and UMAP coordinates', status: 'pending' },
    ],
    finding: 'Retrieved 12 high-relevance papers from 3 databases. Papers clustered into 3 main research areas.',
    metrics: [
      { label: 'Papers found', value: 12 },
      { label: 'Clusters', value: 3 },
      { label: 'Sources', value: 3 },
    ],
  },
  {
    id: 'schema_design',
    stage: '3. SCHEMA_DESIGN',
    title: 'Designing analysis schema',
    description: 'AI generates dynamic dimensions schema based on query type for structured extraction.',
    status: 'pending',
    actions: [
      { id: 's1', type: 'analyzing', label: 'Analyzing', detail: 'query type: comparative', status: 'pending' },
      { id: 's2', type: 'creating', label: 'Creating', detail: 'dimensions_schema.json', status: 'pending' },
    ],
    finding: 'Schema generated with 6 dimensions optimized for comparative battery research analysis.',
    metrics: [
      { label: 'Dimensions', value: 6 },
      { label: 'Query type', value: 'Comparative' },
    ],
  },
  {
    id: 'extraction',
    stage: '4. EXTRACTION',
    title: 'Extracting facts and findings',
    description: 'Extracting structured data from each paper across defined dimensions with confidence scores.',
    status: 'pending',
    actions: [
      { id: 'e1', type: 'browsing', label: 'Reading', detail: '12 papers full-text', status: 'pending' },
      { id: 'e2', type: 'extracting', label: 'Extracting', detail: 'Temperature Range values', status: 'pending' },
      { id: 'e3', type: 'extracting', label: 'Extracting', detail: 'Efficiency % metrics', status: 'pending' },
      { id: 'e4', type: 'extracting', label: 'Extracting', detail: 'Recovery Rate data', status: 'pending' },
      { id: 'e5', type: 'creating', label: 'Creating', detail: 'dimension_findings.json', status: 'pending' },
    ],
    finding: 'Extracted 47 facts with source citations. Average confidence: 87%. Key finding: Chinese labs achieve 500 Wh/kg.',
    metrics: [
      { label: 'Facts extracted', value: 47 },
      { label: 'Confidence', value: '87%' },
      { label: 'With quotes', value: 38 },
    ],
  },
  {
    id: 'topology',
    stage: '5. TOPOLOGY',
    title: 'Analyzing spatial topology',
    description: 'UMAP clustering analysis to identify research divergence between regions and technology areas.',
    status: 'pending',
    actions: [
      { id: 't1', type: 'analyzing', label: 'Computing', detail: 'UMAP coordinates for 12 papers', status: 'pending' },
      { id: 't2', type: 'analyzing', label: 'Calculating', detail: 'cluster centroids by region', status: 'pending' },
      { id: 't3', type: 'analyzing', label: 'Measuring', detail: 'divergence score China vs USA', status: 'pending' },
    ],
    finding: 'High divergence detected (0.73). China clusters on manufacturing efficiency, USA on materials science fundamentals.',
    metrics: [
      { label: 'Divergence', value: 'High (0.73)' },
      { label: 'China centroid', value: '(-2.3, 1.1)' },
      { label: 'USA centroid', value: '(1.8, -0.9)' },
    ],
  },
  {
    id: 'synthesis',
    stage: '6. SYNTHESIS',
    title: 'Synthesizing strategic report',
    description: 'Generating final markdown report with executive summary, thematic analysis, and inline citations.',
    status: 'pending',
    actions: [
      { id: 'syn1', type: 'creating', label: 'Writing', detail: 'executive_summary.md', status: 'pending' },
      { id: 'syn2', type: 'creating', label: 'Writing', detail: 'thematic_analysis sections', status: 'pending' },
      { id: 'syn3', type: 'creating', label: 'Linking', detail: 'inline citations to papers', status: 'pending' },
      { id: 'syn4', type: 'creating', label: 'Formatting', detail: 'final_report.md', status: 'pending' },
    ],
    finding: 'Report complete. 5 sections with 12 inline citations. Ready for review.',
    metrics: [
      { label: 'Sections', value: 5 },
      { label: 'Citations', value: 12 },
      { label: 'Papers analyzed', value: 12 },
    ],
  },
];

export const ChatAnalysis = ({ query, onComplete }: ChatAnalysisProps) => {
  const [tasks, setTasks] = useState<TaskBlock[]>(initialTasks);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [currentActionIndex, setCurrentActionIndex] = useState(0);
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set(['planning']));

  const toggleTask = (taskId: string) => {
    setExpandedTasks(prev => {
      const next = new Set(prev);
      if (next.has(taskId)) next.delete(taskId);
      else next.add(taskId);
      return next;
    });
  };

  // Simulate the analysis process
  useEffect(() => {
    if (currentTaskIndex >= tasks.length) {
      setTimeout(onComplete, 500);
      return;
    }

    const currentTask = tasks[currentTaskIndex];
    
    // Start task if pending
    if (currentTask.status === 'pending') {
      setTasks(prev => prev.map((t, idx) => 
        idx === currentTaskIndex ? { ...t, status: 'running' } : t
      ));
      setExpandedTasks(prev => new Set([...prev, currentTask.id]));
    }

    // Process actions
    if (currentActionIndex < currentTask.actions.length) {
      // Set current action to running
      setTasks(prev => prev.map((t, idx) => {
        if (idx !== currentTaskIndex) return t;
        return {
          ...t,
          actions: t.actions.map((a, aIdx) => 
            aIdx === currentActionIndex ? { ...a, status: 'running' } : a
          ),
        };
      }));

      // Complete action after delay
      const timeout = setTimeout(() => {
        setTasks(prev => prev.map((t, idx) => {
          if (idx !== currentTaskIndex) return t;
          return {
            ...t,
            actions: t.actions.map((a, aIdx) => 
              aIdx === currentActionIndex ? { ...a, status: 'complete' } : a
            ),
          };
        }));
        setCurrentActionIndex(prev => prev + 1);
      }, 600 + Math.random() * 300);

      return () => clearTimeout(timeout);
    } else {
      // All actions complete, mark task complete
      setTasks(prev => prev.map((t, idx) => 
        idx === currentTaskIndex ? { ...t, status: 'complete' } : t
      ));
      
      const timeout = setTimeout(() => {
        setCurrentTaskIndex(prev => prev + 1);
        setCurrentActionIndex(0);
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [currentTaskIndex, currentActionIndex, tasks, onComplete]);

  return (
    <div className="max-w-3xl mx-auto py-8 px-6">
      {/* User query */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center mb-8"
      >
        <div className="px-6 py-3 rounded-2xl border border-border bg-background text-foreground text-center max-w-xl">
          {query}
        </div>
      </motion.div>

      {/* AI Response */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        {/* AI intro */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold shrink-0">
            M
          </div>
          <div>
            <p className="text-foreground leading-relaxed">
              Got it! I will perform a comprehensive analysis following the Morphik pipeline. 
              Starting with planning the research strategy.
            </p>
          </div>
        </div>

        {/* Task blocks */}
        <div className="space-y-4 ml-11">
          <AnimatePresence mode="sync">
            {tasks.map((task, taskIdx) => (
              taskIdx <= currentTaskIndex && (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  {/* Task header */}
                  <button
                    onClick={() => toggleTask(task.id)}
                    className="flex items-center gap-2 w-full text-left group"
                  >
                    <div className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors",
                      task.status === 'complete' && "bg-primary text-primary-foreground",
                      task.status === 'running' && "border-2 border-primary",
                      task.status === 'pending' && "border-2 border-muted-foreground/30"
                    )}>
                      {task.status === 'complete' && <Check className="w-3 h-3" />}
                      {task.status === 'running' && <Loader2 className="w-3 h-3 animate-spin text-primary" />}
                    </div>
                    <span className={cn(
                      "font-medium flex-1",
                      task.status === 'pending' ? "text-muted-foreground" : "text-foreground"
                    )}>
                      {task.title}
                    </span>
                    {expandedTasks.has(task.id) ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>

                  {/* Expanded content */}
                  <AnimatePresence>
                    {expandedTasks.has(task.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="ml-7 space-y-3 overflow-hidden"
                      >
                        <p className="text-muted-foreground text-sm">
                          {task.description}
                        </p>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2">
                          {task.actions.map((action, actionIdx) => {
                            const Icon = actionIcons[action.type];
                            const isVisible = taskIdx < currentTaskIndex || 
                              (taskIdx === currentTaskIndex && actionIdx <= currentActionIndex);
                            
                            if (!isVisible) return null;

                            return (
                              <motion.div
                                key={action.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={cn(
                                  "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border",
                                  action.status === 'running' && "bg-muted/50 border-primary/30",
                                  action.status === 'complete' && "bg-muted/30 border-border",
                                  action.status === 'pending' && "bg-muted/20 border-border/50"
                                )}
                              >
                                {action.status === 'running' ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                                ) : (
                                  <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                                )}
                                <span className="text-muted-foreground">{action.label}</span>
                                {action.detail && (
                                  <code className="text-xs text-foreground/70 font-mono truncate max-w-[200px]">
                                    {action.detail}
                                  </code>
                                )}
                              </motion.div>
                            );
                          })}
                        </div>

                        {/* Finding + Metrics */}
                        {task.status === 'complete' && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-2"
                          >
                            {task.finding && (
                              <p className="text-foreground text-sm leading-relaxed">
                                {task.finding}
                              </p>
                            )}
                            {task.metrics && task.metrics.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {task.metrics.map((metric) => (
                                  <span 
                                    key={metric.label}
                                    className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary/10 text-xs"
                                  >
                                    <span className="text-muted-foreground">{metric.label}:</span>
                                    <span className="font-medium text-primary">{metric.value}</span>
                                  </span>
                                ))}
                              </div>
                            )}
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
