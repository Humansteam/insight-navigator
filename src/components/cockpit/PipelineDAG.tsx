import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TreeNode {
  id: string;
  label: string;
  type: 'query' | 'action' | 'result' | 'data';
  x: number;
  y: number;
  status: 'pending' | 'running' | 'complete';
  children: string[];
  value?: string;
}

interface PipelineDAGProps {
  query: string;
  onComplete: () => void;
}

// Build tree structure that shows how the system thinks
const buildQueryTree = (query: string): TreeNode[] => [
  // Level 0: User Query
  { id: 'q0', label: query.slice(0, 40) + (query.length > 40 ? '...' : ''), type: 'query', x: 500, y: 30, status: 'pending', children: ['p1', 'p2', 'p3'] },
  
  // Level 1: Planning branches
  { id: 'p1', label: 'analyze_focus', type: 'action', x: 200, y: 100, status: 'pending', children: ['s1'] },
  { id: 'p2', label: 'define_regions', type: 'action', x: 500, y: 100, status: 'pending', children: ['s2', 's3', 's4'] },
  { id: 'p3', label: 'generate_queries', type: 'action', x: 800, y: 100, status: 'pending', children: ['s5', 's6'] },
  
  // Level 2: Sub-results
  { id: 's1', label: 'comparative_analysis', type: 'result', x: 200, y: 170, status: 'pending', children: ['r1'] },
  { id: 's2', label: 'China', type: 'data', x: 380, y: 170, status: 'pending', children: ['r1'] },
  { id: 's3', label: 'USA', type: 'data', x: 500, y: 170, status: 'pending', children: ['r1'] },
  { id: 's4', label: 'Europe', type: 'data', x: 620, y: 170, status: 'pending', children: ['r1'] },
  { id: 's5', label: '"lithium battery efficiency"', type: 'data', x: 750, y: 170, status: 'pending', children: ['r1'] },
  { id: 's6', label: '"solid state manufacturing"', type: 'data', x: 920, y: 170, status: 'pending', children: ['r2'] },
  
  // Level 3: Retrieval
  { id: 'r1', label: 'search_papers', type: 'action', x: 400, y: 250, status: 'pending', children: ['d1', 'd2', 'd3'] },
  { id: 'r2', label: 'web_search', type: 'action', x: 750, y: 250, status: 'pending', children: ['d4'] },
  
  // Level 4: Papers found
  { id: 'd1', label: 'paper_001...004', type: 'data', x: 280, y: 320, status: 'pending', children: ['e1'], value: '4 papers' },
  { id: 'd2', label: 'paper_005...008', type: 'data', x: 450, y: 320, status: 'pending', children: ['e1'], value: '4 papers' },
  { id: 'd3', label: 'paper_009...012', type: 'data', x: 620, y: 320, status: 'pending', children: ['e1'], value: '4 papers' },
  { id: 'd4', label: 'external_sources', type: 'data', x: 750, y: 320, status: 'pending', children: ['e2'], value: '3 sources' },
  
  // Level 5: Extraction
  { id: 'e1', label: 'extract_dimensions', type: 'action', x: 400, y: 390, status: 'pending', children: ['f1', 'f2', 'f3'] },
  { id: 'e2', label: 'parse_external', type: 'action', x: 750, y: 390, status: 'pending', children: ['f4'] },
  
  // Level 6: Facts
  { id: 'f1', label: 'efficiency_data', type: 'result', x: 280, y: 460, status: 'pending', children: ['t1'], value: '18 facts' },
  { id: 'f2', label: 'temperature_data', type: 'result', x: 420, y: 460, status: 'pending', children: ['t1'], value: '15 facts' },
  { id: 'f3', label: 'cost_metrics', type: 'result', x: 560, y: 460, status: 'pending', children: ['t1'], value: '14 facts' },
  { id: 'f4', label: 'market_data', type: 'result', x: 750, y: 460, status: 'pending', children: ['t2'] },
  
  // Level 7: Topology
  { id: 't1', label: 'compute_topology', type: 'action', x: 420, y: 530, status: 'pending', children: ['div'] },
  { id: 't2', label: 'merge_sources', type: 'action', x: 700, y: 530, status: 'pending', children: ['div'] },
  
  // Level 8: Divergence
  { id: 'div', label: 'divergence: 0.73', type: 'result', x: 500, y: 600, status: 'pending', children: ['syn'] },
  
  // Level 9: Synthesis  
  { id: 'syn', label: 'synthesize_report', type: 'action', x: 500, y: 670, status: 'pending', children: ['out'] },
  
  // Level 10: Output
  { id: 'out', label: 'final_report.md', type: 'result', x: 500, y: 740, status: 'pending', children: [] },
];

// Execution order - groups of nodes to process together
const executionOrder = [
  ['q0'],
  ['p1', 'p2', 'p3'],
  ['s1', 's2', 's3', 's4', 's5', 's6'],
  ['r1', 'r2'],
  ['d1', 'd2', 'd3', 'd4'],
  ['e1', 'e2'],
  ['f1', 'f2', 'f3', 'f4'],
  ['t1', 't2'],
  ['div'],
  ['syn'],
  ['out'],
];

export const PipelineDAG = ({ query, onComplete }: PipelineDAGProps) => {
  const [nodes, setNodes] = useState<TreeNode[]>(() => buildQueryTree(query));
  const [currentStep, setCurrentStep] = useState(0);
  const [visibleNodes, setVisibleNodes] = useState<Set<string>>(new Set());

  // Process execution steps
  useEffect(() => {
    if (currentStep >= executionOrder.length) {
      setTimeout(onComplete, 600);
      return;
    }

    const currentIds = executionOrder[currentStep];
    
    // Make nodes visible and set to running
    setVisibleNodes(prev => new Set([...prev, ...currentIds]));
    setNodes(prev => prev.map(node => 
      currentIds.includes(node.id) ? { ...node, status: 'running' } : node
    ));

    // Complete after delay
    const timeout = setTimeout(() => {
      setNodes(prev => prev.map(node => 
        currentIds.includes(node.id) ? { ...node, status: 'complete' } : node
      ));
      setCurrentStep(prev => prev + 1);
    }, 500 + Math.random() * 300);

    return () => clearTimeout(timeout);
  }, [currentStep, onComplete]);

  // Get node style based on type
  const getNodeStyle = (node: TreeNode) => {
    const base = "transition-all duration-200";
    const typeStyles = {
      query: "bg-primary text-primary-foreground font-medium",
      action: "bg-muted border-l-2 border-l-primary",
      result: "bg-primary/10 border border-primary/30",
      data: "bg-muted/50 border border-dashed border-muted-foreground/30 text-muted-foreground",
    };
    const statusStyles = {
      pending: "opacity-40",
      running: "opacity-100 shadow-lg shadow-primary/20",
      complete: "opacity-100",
    };
    return cn(base, typeStyles[node.type], statusStyles[node.status]);
  };

  // Draw connecting lines
  const renderConnections = useCallback(() => {
    const lines: JSX.Element[] = [];
    
    nodes.forEach(node => {
      if (!visibleNodes.has(node.id)) return;
      
      node.children.forEach(childId => {
        const child = nodes.find(n => n.id === childId);
        if (!child || !visibleNodes.has(child.id)) return;
        
        const isActive = node.status === 'complete' || child.status === 'running';
        
        // Calculate line path (straight with right angles)
        const midY = (node.y + 20 + child.y) / 2;
        
        lines.push(
          <motion.g key={`${node.id}-${child.id}`}>
            {/* Vertical from parent */}
            <motion.line
              x1={node.x}
              y1={node.y + 20}
              x2={node.x}
              y2={midY}
              stroke={isActive ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'}
              strokeWidth={isActive ? 2 : 1}
              opacity={isActive ? 1 : 0.3}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.2 }}
            />
            {/* Horizontal connector */}
            <motion.line
              x1={node.x}
              y1={midY}
              x2={child.x}
              y2={midY}
              stroke={isActive ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'}
              strokeWidth={isActive ? 2 : 1}
              opacity={isActive ? 1 : 0.3}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            />
            {/* Vertical to child */}
            <motion.line
              x1={child.x}
              y1={midY}
              x2={child.x}
              y2={child.y}
              stroke={isActive ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'}
              strokeWidth={isActive ? 2 : 1}
              opacity={isActive ? 1 : 0.3}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.2, delay: 0.2 }}
            />
          </motion.g>
        );
      });
    });
    
    return lines;
  }, [nodes, visibleNodes]);

  return (
    <div className="w-full py-4 px-2">
      {/* Scrollable DAG container */}
      <div className="overflow-auto bg-background border border-border rounded-lg" style={{ height: 'calc(100vh - 220px)' }}>
        <div className="relative" style={{ width: 1100, height: 800, minWidth: 1100 }}>
          {/* SVG for connections */}
          <svg 
            className="absolute inset-0 pointer-events-none" 
            width={1100} 
            height={800}
          >
            {renderConnections()}
          </svg>

          {/* Nodes */}
          <AnimatePresence>
            {nodes.map(node => (
              visibleNodes.has(node.id) && (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={cn(
                    "absolute px-2 py-1 text-[11px] font-mono whitespace-nowrap",
                    getNodeStyle(node)
                  )}
                  style={{
                    left: node.x,
                    top: node.y,
                    transform: 'translateX(-50%)',
                  }}
                >
                  {/* Running indicator */}
                  {node.status === 'running' && (
                    <motion.span
                      className="absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    />
                  )}
                  
                  <span className={cn(
                    node.type === 'action' && "text-foreground",
                    node.type === 'query' && "text-primary-foreground",
                  )}>
                    {node.label}
                  </span>
                  
                  {/* Value badge */}
                  {node.value && node.status === 'complete' && (
                    <span className="ml-1.5 px-1 py-0.5 bg-primary/20 text-primary text-[9px] rounded">
                      {node.value}
                    </span>
                  )}
                </motion.div>
              )
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Progress */}
      <div className="mt-3 flex items-center justify-center gap-1">
        <span className="text-xs text-muted-foreground mr-2">
          Step {Math.min(currentStep + 1, executionOrder.length)}/{executionOrder.length}
        </span>
        {executionOrder.map((_, idx) => (
          <div
            key={idx}
            className={cn(
              "w-1.5 h-1.5 rounded-sm transition-all",
              idx < currentStep && "bg-primary",
              idx === currentStep && "bg-primary w-3",
              idx > currentStep && "bg-muted-foreground/20"
            )}
          />
        ))}
      </div>
    </div>
  );
};
