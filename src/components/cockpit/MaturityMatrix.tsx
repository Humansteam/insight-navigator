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
import { motion } from 'framer-motion';
import { MaturityNode } from '@/types/morphik';
import { maturityMockData, maxVolume, getQuadrantColor, getQuadrantName } from '@/data/maturityMockData';

interface MaturityMatrixProps {
  data?: MaturityNode[];
  onNodeClick?: (node: MaturityNode) => void;
  onNodeHover?: (node: MaturityNode | null) => void;
}

// Custom SVG Glow Filters
const GlowFilters = () => (
  <defs>
    {/* Green glow for Winners/Mature */}
    <filter id="glow-green" x="-100%" y="-100%" width="300%" height="300%">
      <feGaussianBlur stdDeviation="6" result="coloredBlur" />
      <feMerge>
        <feMergeNode in="coloredBlur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    {/* Cyan glow for Emerging */}
    <filter id="glow-cyan" x="-100%" y="-100%" width="300%" height="300%">
      <feGaussianBlur stdDeviation="6" result="coloredBlur" />
      <feMerge>
        <feMergeNode in="coloredBlur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    {/* Purple glow for Niche */}
    <filter id="glow-purple" x="-100%" y="-100%" width="300%" height="300%">
      <feGaussianBlur stdDeviation="4" result="coloredBlur" />
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
  if (trl >= 5 && velocity < 50) return 'glow-green';
  return 'glow-purple';
};

// Custom Glowing Bubble Shape - NO inner bubble, gradient brightness based on volume
interface GlowingBubbleProps {
  cx?: number;
  cy?: number;
  payload?: MaturityNode;
  isHovered?: boolean;
}

const GlowingBubble: React.FC<GlowingBubbleProps> = ({ cx = 0, cy = 0, payload, isHovered }) => {
  if (!payload) return null;
  
  // Size based on volume
  const baseRadius = Math.sqrt(payload.volume) * 0.9 + 4;
  const radius = isHovered ? baseRadius * 1.15 : baseRadius;
  
  // Color and brightness based on volume - more volume = brighter
  const color = getQuadrantColor(payload.trl, payload.velocity);
  const filterId = getFilterId(payload.trl, payload.velocity);
  
  // Opacity gradient: volume determines brightness (0.15 to 0.7)
  const normalizedVolume = payload.volume / maxVolume;
  const fillOpacity = 0.15 + normalizedVolume * 0.55;
  const strokeOpacity = 0.3 + normalizedVolume * 0.7;
  
  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill={color}
        fillOpacity={isHovered ? Math.min(fillOpacity + 0.2, 0.9) : fillOpacity}
        stroke={color}
        strokeWidth={isHovered ? 2.5 : 2}
        strokeOpacity={isHovered ? 1 : strokeOpacity}
        filter={`url(#${filterId})`}
        style={{ 
          transition: 'all 0.2s ease-out',
          cursor: 'pointer'
        }}
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
    <text x="78%" y="15%" fill="#4ADE80" fontSize={13} fontWeight={600} opacity={0.9}>
      Winners
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
    <div className="w-full h-full relative" style={{ background: '#0F172A' }}>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{ top: 30, right: 30, bottom: 50, left: 60 }}
        >
          {/* SVG Filters */}
          <GlowFilters />
          
          {/* Quadrant Labels */}
          <QuadrantLabels />

          {/* Axes */}
          <XAxis
            type="number"
            dataKey="trl"
            domain={[1, 9]}
            tickCount={9}
            tick={{ fill: '#64748B', fontSize: 11 }}
            axisLine={{ stroke: '#334155', strokeWidth: 1 }}
            tickLine={{ stroke: '#334155' }}
            label={{
              value: 'Technology Readiness (TRL 1-9)',
              position: 'bottom',
              offset: 15,
              fill: '#94A3B8',
              fontSize: 12,
            }}
          />
          <YAxis
            type="number"
            dataKey="velocity"
            domain={[0, 100]}
            tickCount={8}
            tick={{ fill: '#64748B', fontSize: 11 }}
            axisLine={{ stroke: '#334155', strokeWidth: 1 }}
            tickLine={{ stroke: '#334155' }}
            label={{
              value: 'Market Velocity',
              angle: -90,
              position: 'left',
              offset: 15,
              fill: '#94A3B8',
              fontSize: 12,
            }}
            tickFormatter={(value) => {
              if (value === 0) return 'Low';
              if (value === 100) return 'High';
              return String(value);
            }}
          />
          <ZAxis
            type="number"
            dataKey="volume"
            range={[60, 600]}
          />

          {/* Quadrant Dividers - dashed lines */}
          <ReferenceLine
            x={5}
            stroke="#94A3B8"
            strokeDasharray="6 4"
            strokeOpacity={0.5}
          />
          <ReferenceLine
            y={50}
            stroke="#94A3B8"
            strokeDasharray="6 4"
            strokeOpacity={0.5}
          />

          {/* Crosshair for hovered node */}
          {hoveredNode && (
            <>
              <ReferenceLine
                x={data.find(d => d.id === hoveredNode)?.trl}
                stroke="rgba(255,255,255,0.25)"
                strokeDasharray="4 4"
              />
              <ReferenceLine
                y={data.find(d => d.id === hoveredNode)?.velocity}
                stroke="rgba(255,255,255,0.25)"
                strokeDasharray="4 4"
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
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-5 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ background: '#4ADE80', boxShadow: '0 0 10px #4ADE80' }} />
          <span className="text-slate-400">Winners / Mature</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ background: '#38BDF8', boxShadow: '0 0 10px #38BDF8' }} />
          <span className="text-slate-400">Emerging</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ background: '#A78BFA', boxShadow: '0 0 10px #A78BFA' }} />
          <span className="text-slate-400">Niche</span>
        </div>
        <div className="flex items-center gap-1.5 border-l border-slate-600 pl-4">
          <div className="w-3 h-3 rounded-full bg-slate-500/30 border border-slate-500" />
          <span className="text-slate-500">Low volume</span>
          <div className="w-3 h-3 rounded-full bg-slate-300/70 border border-slate-300 ml-2" />
          <span className="text-slate-400">High volume</span>
        </div>
      </div>
    </div>
  );
};

export default MaturityMatrix;
