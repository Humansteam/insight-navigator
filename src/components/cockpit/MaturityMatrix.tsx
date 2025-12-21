import React, { useState, useCallback } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { MaturityNode } from '@/types/morphik';
import { maturityMockData, getQuadrantColor, getQuadrantName } from '@/data/maturityMockData';

interface MaturityMatrixProps {
  data?: MaturityNode[];
  onNodeClick?: (node: MaturityNode) => void;
  onNodeHover?: (node: MaturityNode | null) => void;
}

// Custom SVG Glow Filters
const GlowFilters = () => (
  <defs>
    {/* Green glow for Winners */}
    <filter id="glow-green" x="-100%" y="-100%" width="300%" height="300%">
      <feGaussianBlur stdDeviation="4" result="coloredBlur" />
      <feMerge>
        <feMergeNode in="coloredBlur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    {/* Cyan glow for Emerging */}
    <filter id="glow-cyan" x="-100%" y="-100%" width="300%" height="300%">
      <feGaussianBlur stdDeviation="4" result="coloredBlur" />
      <feMerge>
        <feMergeNode in="coloredBlur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    {/* Amber glow for Mature */}
    <filter id="glow-amber" x="-100%" y="-100%" width="300%" height="300%">
      <feGaussianBlur stdDeviation="3" result="coloredBlur" />
      <feMerge>
        <feMergeNode in="coloredBlur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    {/* Purple glow for Niche */}
    <filter id="glow-purple" x="-100%" y="-100%" width="300%" height="300%">
      <feGaussianBlur stdDeviation="3" result="coloredBlur" />
      <feMerge>
        <feMergeNode in="coloredBlur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
);

// Get filter ID based on quadrant
const getFilterId = (trl: number, velocity: number): string => {
  if (trl >= 5 && velocity >= 50) return 'glow-green';
  if (trl < 5 && velocity >= 50) return 'glow-cyan';
  if (trl >= 5 && velocity < 50) return 'glow-amber';
  return 'glow-purple';
};

// Custom Glowing Bubble Shape
interface GlowingBubbleProps {
  cx?: number;
  cy?: number;
  payload?: MaturityNode;
  isHovered?: boolean;
}

const GlowingBubble: React.FC<GlowingBubbleProps> = ({ cx = 0, cy = 0, payload, isHovered }) => {
  if (!payload) return null;
  
  const baseRadius = Math.sqrt(payload.volume) * 0.8;
  const radius = isHovered ? baseRadius * 1.2 : baseRadius;
  const color = getQuadrantColor(payload.trl, payload.velocity);
  const filterId = getFilterId(payload.trl, payload.velocity);
  
  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill={color}
        fillOpacity={isHovered ? 0.7 : 0.45}
        stroke={color}
        strokeWidth={2}
        strokeOpacity={isHovered ? 1 : 0.8}
        filter={`url(#${filterId})`}
        style={{ 
          transition: 'all 0.2s ease-out',
          cursor: 'pointer'
        }}
      />
      {/* Inner highlight */}
      <circle
        cx={cx - radius * 0.2}
        cy={cy - radius * 0.2}
        r={radius * 0.3}
        fill="white"
        fillOpacity={0.15}
      />
    </g>
  );
};

// Custom Glassmorphism Tooltip
interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (!active || !payload || payload.length === 0) return null;
  
  const data = payload[0].payload as MaturityNode;
  const color = getQuadrantColor(data.trl, data.velocity);
  const quadrant = getQuadrantName(data.trl, data.velocity);
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="backdrop-blur-md bg-slate-900/90 border border-white/10 rounded-lg p-3 shadow-xl"
      style={{ borderLeftColor: color, borderLeftWidth: 3 }}
    >
      <div className="font-medium text-white text-sm mb-1">{data.name}</div>
      <div className="text-xs text-slate-400 mb-2">{quadrant}</div>
      <div className="space-y-1 text-xs">
        <div className="flex justify-between gap-4">
          <span className="text-slate-400">TRL:</span>
          <span className="text-white font-mono">{data.trl.toFixed(1)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-400">Velocity:</span>
          <span className="text-white font-mono">{data.velocity}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-400">Volume:</span>
          <span className="text-white font-mono">{data.volume} papers</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-400">Growth:</span>
          <span 
            className="font-mono"
            style={{ color: data.growth >= 0 ? '#4ADE80' : '#F87171' }}
          >
            {data.growth >= 0 ? '+' : ''}{data.growth}%
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// Quadrant Label Component
const QuadrantLabels = () => (
  <>
    {/* Winners - Top Right */}
    <text x="78%" y="18%" fill="#4ADE80" fontSize={11} fontWeight={500} opacity={0.7}>
      Winners
    </text>
    {/* Emerging - Top Left */}
    <text x="18%" y="18%" fill="#38BDF8" fontSize={11} fontWeight={500} opacity={0.7}>
      Emerging
    </text>
    {/* Mature - Bottom Right */}
    <text x="78%" y="88%" fill="#FBBF24" fontSize={11} fontWeight={500} opacity={0.7}>
      Mature
    </text>
    {/* Niche - Bottom Left */}
    <text x="18%" y="88%" fill="#A78BFA" fontSize={11} fontWeight={500} opacity={0.7}>
      Niche
    </text>
  </>
);

export const MaturityMatrix: React.FC<MaturityMatrixProps> = ({
  data = maturityMockData,
  onNodeClick,
  onNodeHover,
}) => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const handleMouseEnter = useCallback((node: MaturityNode) => {
    setHoveredNode(node.id);
    onNodeHover?.(node);
  }, [onNodeHover]);

  const handleMouseLeave = useCallback(() => {
    setHoveredNode(null);
    onNodeHover?.(null);
  }, [onNodeHover]);

  return (
    <div className="w-full h-full" style={{ background: '#0B1120' }}>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{ top: 30, right: 30, bottom: 50, left: 50 }}
        >
          {/* SVG Filters */}
          <GlowFilters />
          
          {/* Quadrant Labels */}
          <QuadrantLabels />

          {/* Grid with subtle styling */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="0.5" opacity="0.2" />
            </pattern>
          </defs>

          {/* Axes */}
          <XAxis
            type="number"
            dataKey="trl"
            domain={[1, 9]}
            tickCount={9}
            tick={{ fill: '#94A3B8', fontSize: 10 }}
            axisLine={{ stroke: '#334155', strokeWidth: 1 }}
            tickLine={{ stroke: '#334155' }}
            label={{
              value: 'Technology Readiness Level',
              position: 'bottom',
              offset: 15,
              fill: '#64748B',
              fontSize: 11,
            }}
          />
          <YAxis
            type="number"
            dataKey="velocity"
            domain={[0, 100]}
            tickCount={6}
            tick={{ fill: '#94A3B8', fontSize: 10 }}
            axisLine={{ stroke: '#334155', strokeWidth: 1 }}
            tickLine={{ stroke: '#334155' }}
            label={{
              value: 'Market Velocity',
              angle: -90,
              position: 'left',
              offset: 10,
              fill: '#64748B',
              fontSize: 11,
            }}
          />
          <ZAxis
            type="number"
            dataKey="volume"
            range={[50, 400]}
          />

          {/* Quadrant Dividers */}
          <ReferenceLine
            x={5}
            stroke="#94A3B8"
            strokeDasharray="5 5"
            strokeOpacity={0.4}
          />
          <ReferenceLine
            y={50}
            stroke="#94A3B8"
            strokeDasharray="5 5"
            strokeOpacity={0.4}
          />

          {/* Crosshair for hovered node */}
          {hoveredNode && (
            <>
              <ReferenceLine
                x={data.find(d => d.id === hoveredNode)?.trl}
                stroke="rgba(255,255,255,0.2)"
                strokeDasharray="3 3"
              />
              <ReferenceLine
                y={data.find(d => d.id === hoveredNode)?.velocity}
                stroke="rgba(255,255,255,0.2)"
                strokeDasharray="3 3"
              />
            </>
          )}

          {/* Custom Tooltip */}
          <Tooltip
            content={<CustomTooltip />}
            cursor={false}
            wrapperStyle={{ zIndex: 100 }}
          />

          {/* Data Points */}
          <Scatter
            data={data}
            shape={(props: any) => (
              <GlowingBubble
                {...props}
                isHovered={hoveredNode === props.payload?.id}
              />
            )}
            onMouseEnter={(data: any) => handleMouseEnter(data)}
            onMouseLeave={handleMouseLeave}
            onClick={(data: any) => onNodeClick?.(data)}
          >
            {data.map((entry) => (
              <Cell
                key={entry.id}
                fill={getQuadrantColor(entry.trl, entry.velocity)}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
      
      {/* Legend */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#4ADE80', boxShadow: '0 0 8px #4ADE80' }} />
          <span className="text-slate-400">Winners</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#38BDF8', boxShadow: '0 0 8px #38BDF8' }} />
          <span className="text-slate-400">Emerging</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#FBBF24', boxShadow: '0 0 8px #FBBF24' }} />
          <span className="text-slate-400">Mature</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#A78BFA', boxShadow: '0 0 8px #A78BFA' }} />
          <span className="text-slate-400">Niche</span>
        </div>
      </div>
    </div>
  );
};

export default MaturityMatrix;
