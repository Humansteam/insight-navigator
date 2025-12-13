import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface DAGNode {
  id: string;
  label: string;
  shortLabel: string;
  x: number;
  y: number;
  status: 'pending' | 'running' | 'complete';
  detail?: string;
}

interface DAGEdge {
  from: string;
  to: string;
  status: 'pending' | 'active' | 'complete';
}

interface PipelineDAGProps {
  query: string;
  onComplete: () => void;
}

// DAG layout for Morphik pipeline
const initialNodes: DAGNode[] = [
  // Row 1: Query input
  { id: 'query', label: 'Query Analysis', shortLabel: 'Query', x: 80, y: 200, status: 'pending' },
  
  // Row 2: Planning branches
  { id: 'focus', label: 'Analysis Focus', shortLabel: 'Focus', x: 200, y: 100, status: 'pending' },
  { id: 'regions', label: 'Regions', shortLabel: 'Regions', x: 200, y: 200, status: 'pending' },
  { id: 'queries', label: 'Search Queries', shortLabel: 'Queries', x: 200, y: 300, status: 'pending' },
  
  // Row 3: Retrieval
  { id: 'search', label: 'Paper Search', shortLabel: 'Search', x: 340, y: 150, status: 'pending' },
  { id: 'fetch', label: 'Fetch Papers', shortLabel: 'Fetch', x: 340, y: 250, status: 'pending' },
  
  // Row 4: Schema & Extraction
  { id: 'schema', label: 'Schema Design', shortLabel: 'Schema', x: 480, y: 120, status: 'pending' },
  { id: 'extract', label: 'Fact Extraction', shortLabel: 'Extract', x: 480, y: 200, status: 'pending' },
  { id: 'umap', label: 'UMAP Coords', shortLabel: 'UMAP', x: 480, y: 280, status: 'pending' },
  
  // Row 5: Analysis
  { id: 'topology', label: 'Topology Analysis', shortLabel: 'Topology', x: 620, y: 160, status: 'pending' },
  { id: 'divergence', label: 'Divergence Score', shortLabel: 'Diverge', x: 620, y: 240, status: 'pending' },
  
  // Row 6: Synthesis
  { id: 'synthesis', label: 'Report Synthesis', shortLabel: 'Synthesis', x: 760, y: 200, status: 'pending' },
  
  // Row 7: Output
  { id: 'report', label: 'Final Report', shortLabel: 'Report', x: 880, y: 200, status: 'pending' },
];

const initialEdges: DAGEdge[] = [
  // Query to planning
  { from: 'query', to: 'focus', status: 'pending' },
  { from: 'query', to: 'regions', status: 'pending' },
  { from: 'query', to: 'queries', status: 'pending' },
  
  // Planning to retrieval
  { from: 'focus', to: 'search', status: 'pending' },
  { from: 'queries', to: 'search', status: 'pending' },
  { from: 'regions', to: 'fetch', status: 'pending' },
  { from: 'search', to: 'fetch', status: 'pending' },
  
  // Retrieval to processing
  { from: 'fetch', to: 'schema', status: 'pending' },
  { from: 'fetch', to: 'extract', status: 'pending' },
  { from: 'fetch', to: 'umap', status: 'pending' },
  { from: 'schema', to: 'extract', status: 'pending' },
  
  // Processing to analysis
  { from: 'extract', to: 'topology', status: 'pending' },
  { from: 'umap', to: 'topology', status: 'pending' },
  { from: 'topology', to: 'divergence', status: 'pending' },
  
  // Analysis to synthesis
  { from: 'extract', to: 'synthesis', status: 'pending' },
  { from: 'divergence', to: 'synthesis', status: 'pending' },
  
  // Synthesis to output
  { from: 'synthesis', to: 'report', status: 'pending' },
];

// Execution order (groups of parallel nodes)
const executionSteps = [
  ['query'],
  ['focus', 'regions', 'queries'],
  ['search'],
  ['fetch'],
  ['schema', 'umap'],
  ['extract'],
  ['topology'],
  ['divergence'],
  ['synthesis'],
  ['report'],
];

export const PipelineDAG = ({ query, onComplete }: PipelineDAGProps) => {
  const [nodes, setNodes] = useState<DAGNode[]>(initialNodes);
  const [edges, setEdges] = useState<DAGEdge[]>(initialEdges);
  const [currentStep, setCurrentStep] = useState(0);
  const [statusText, setStatusText] = useState('Initializing analysis...');

  // Process steps
  useEffect(() => {
    if (currentStep >= executionSteps.length) {
      setStatusText('Analysis complete. Generating report...');
      setTimeout(onComplete, 1000);
      return;
    }

    const currentNodeIds = executionSteps[currentStep];
    
    // Update status text
    const statusMessages: Record<string, string> = {
      query: 'Analyzing query intent...',
      focus: 'Determining analysis focus...',
      regions: 'Identifying target regions...',
      queries: 'Generating search queries...',
      search: 'Searching scientific databases...',
      fetch: 'Fetching papers (12 found)...',
      schema: 'Designing extraction schema...',
      umap: 'Computing UMAP coordinates...',
      extract: 'Extracting facts (47 found)...',
      topology: 'Analyzing spatial topology...',
      divergence: 'Calculating divergence (0.73)...',
      synthesis: 'Synthesizing report...',
      report: 'Finalizing output...',
    };
    setStatusText(statusMessages[currentNodeIds[0]] || 'Processing...');

    // Set current nodes to running
    setNodes(prev => prev.map(node => ({
      ...node,
      status: currentNodeIds.includes(node.id) ? 'running' : node.status,
    })));

    // Activate incoming edges
    setEdges(prev => prev.map(edge => ({
      ...edge,
      status: currentNodeIds.includes(edge.to) ? 'active' : edge.status,
    })));

    // Complete after delay
    const timeout = setTimeout(() => {
      setNodes(prev => prev.map(node => ({
        ...node,
        status: currentNodeIds.includes(node.id) ? 'complete' : node.status,
      })));
      setEdges(prev => prev.map(edge => ({
        ...edge,
        status: currentNodeIds.includes(edge.to) ? 'complete' : edge.status,
      })));
      setCurrentStep(prev => prev + 1);
    }, 800 + Math.random() * 400);

    return () => clearTimeout(timeout);
  }, [currentStep, onComplete]);

  // Calculate edge path
  const getEdgePath = (from: DAGNode, to: DAGNode) => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const controlX = from.x + dx * 0.5;
    return `M ${from.x} ${from.y} Q ${controlX} ${from.y} ${controlX} ${(from.y + to.y) / 2} T ${to.x} ${to.y}`;
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-6">
      {/* Query display */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center mb-6"
      >
        <div className="px-6 py-3 rounded-2xl border border-border bg-background text-foreground text-center max-w-xl">
          {query}
        </div>
      </motion.div>

      {/* Status */}
      <motion.div 
        key={statusText}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-sm text-muted-foreground mb-4"
      >
        {statusText}
      </motion.div>

      {/* DAG Visualization */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-muted/20 rounded-xl border border-border overflow-hidden"
        style={{ height: 400 }}
      >
        <svg width="100%" height="100%" viewBox="0 0 960 400" preserveAspectRatio="xMidYMid meet">
          <defs>
            {/* Gradient for active edges */}
            <linearGradient id="activeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
              <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="1" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
            </linearGradient>
            
            {/* Glow filter */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Edges */}
          {edges.map((edge) => {
            const fromNode = nodes.find(n => n.id === edge.from);
            const toNode = nodes.find(n => n.id === edge.to);
            if (!fromNode || !toNode) return null;

            return (
              <g key={`${edge.from}-${edge.to}`}>
                {/* Base edge */}
                <motion.path
                  d={getEdgePath(fromNode, toNode)}
                  fill="none"
                  stroke="hsl(var(--border))"
                  strokeWidth={2}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5 }}
                />
                
                {/* Active/complete overlay */}
                {edge.status !== 'pending' && (
                  <motion.path
                    d={getEdgePath(fromNode, toNode)}
                    fill="none"
                    stroke={edge.status === 'active' ? 'url(#activeGradient)' : 'hsl(var(--primary))'}
                    strokeWidth={edge.status === 'active' ? 3 : 2}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.4 }}
                    filter={edge.status === 'active' ? 'url(#glow)' : undefined}
                  />
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => (
            <g key={node.id}>
              {/* Node circle */}
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={node.status === 'running' ? 22 : 18}
                className={cn(
                  "transition-all duration-300",
                  node.status === 'pending' && "fill-muted stroke-border",
                  node.status === 'running' && "fill-primary/20 stroke-primary",
                  node.status === 'complete' && "fill-primary stroke-primary"
                )}
                strokeWidth={2}
                filter={node.status === 'running' ? 'url(#glow)' : undefined}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring' }}
              />
              
              {/* Pulse animation for running nodes */}
              {node.status === 'running' && (
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r={18}
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  initial={{ r: 18, opacity: 1 }}
                  animate={{ r: 35, opacity: 0 }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}

              {/* Label */}
              <text
                x={node.x}
                y={node.y + 35}
                textAnchor="middle"
                className={cn(
                  "text-[10px] font-medium fill-current",
                  node.status === 'pending' ? "text-muted-foreground/50" : "text-foreground"
                )}
              >
                {node.shortLabel}
              </text>
            </g>
          ))}
        </svg>
      </motion.div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-muted border border-border" />
          <span>Pending</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary/20 border-2 border-primary" />
          <span>Running</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span>Complete</span>
        </div>
      </div>
    </div>
  );
};
