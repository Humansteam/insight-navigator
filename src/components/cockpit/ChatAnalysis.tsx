import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Check, ChevronUp, ChevronDown, Search, Globe, MousePointer, FileText, Loader2 } from 'lucide-react';

interface ActionItem {
  id: string;
  type: 'searching' | 'browsing' | 'clicking' | 'creating' | 'extracting';
  label: string;
  detail?: string;
  status: 'pending' | 'running' | 'complete';
}

interface TaskBlock {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'running' | 'complete';
  actions: ActionItem[];
  finding?: string;
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
  extracting: FileText,
};

const initialTasks: TaskBlock[] = [
  {
    id: 'research',
    title: 'Research scientific publication data and trends',
    description: 'I will gather data on publication volume, impact, and trends to compare research markets.',
    status: 'pending',
    actions: [
      { id: 'a1', type: 'searching', label: 'Searching', detail: 'lithium battery research publications comparison...', status: 'pending' },
      { id: 'a2', type: 'browsing', label: 'Browsing', detail: 'https://scholar.google.com/citations', status: 'pending' },
      { id: 'a3', type: 'extracting', label: 'Extracting', detail: 'publication metrics and trends', status: 'pending' },
    ],
    finding: 'Found 165,432 papers across China, USA, and Europe. China leads in manufacturing research with 45% share.',
  },
  {
    id: 'schema',
    title: 'Design analysis schema for comparison',
    description: 'Creating dynamic dimensions for structured data extraction.',
    status: 'pending',
    actions: [
      { id: 'b1', type: 'creating', label: 'Creating', detail: 'analysis_dimensions.json', status: 'pending' },
      { id: 'b2', type: 'clicking', label: 'Configuring', detail: '6 dimensions for extraction', status: 'pending' },
    ],
    finding: 'Schema ready: Temperature Range, Efficiency %, Recovery Rate, Energy Density, Cycle Life, Cost Factor.',
  },
  {
    id: 'extract',
    title: 'Extract findings from top papers',
    description: 'Analyzing each paper across defined dimensions.',
    status: 'pending',
    actions: [
      { id: 'c1', type: 'browsing', label: 'Reading', detail: '12 high-relevance papers', status: 'pending' },
      { id: 'c2', type: 'extracting', label: 'Extracting', detail: 'facts and metrics from abstracts', status: 'pending' },
      { id: 'c3', type: 'creating', label: 'Creating', detail: 'structured_findings.json', status: 'pending' },
    ],
    finding: 'Extracted 47 facts with 87% average confidence. Key finding: 500 Wh/kg energy density achieved.',
  },
  {
    id: 'synthesis',
    title: 'Synthesize strategic report',
    description: 'Generating final analysis with citations and recommendations.',
    status: 'pending',
    actions: [
      { id: 'd1', type: 'creating', label: 'Writing', detail: 'executive summary and sections', status: 'pending' },
      { id: 'd2', type: 'creating', label: 'Formatting', detail: 'report with inline citations', status: 'pending' },
    ],
    finding: 'Report complete with 5 sections and 12 inline citations.',
  },
];

export const ChatAnalysis = ({ query, onComplete }: ChatAnalysisProps) => {
  const [tasks, setTasks] = useState<TaskBlock[]>(initialTasks);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [currentActionIndex, setCurrentActionIndex] = useState(0);
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set(['research']));

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
      }, 800 + Math.random() * 400);

      return () => clearTimeout(timeout);
    } else {
      // All actions complete, mark task complete
      setTasks(prev => prev.map((t, idx) => 
        idx === currentTaskIndex ? { ...t, status: 'complete' } : t
      ));
      
      const timeout = setTimeout(() => {
        setCurrentTaskIndex(prev => prev + 1);
        setCurrentActionIndex(0);
      }, 600);

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
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-medium shrink-0">
            M
          </div>
          <div>
            <p className="text-foreground leading-relaxed">
              Got it! I will perform a comparative analysis of lithium battery research. 
              I will start by planning the research and analysis steps.
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

                        {/* Finding */}
                        {task.status === 'complete' && task.finding && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-foreground text-sm leading-relaxed"
                          >
                            {task.finding}
                          </motion.p>
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
