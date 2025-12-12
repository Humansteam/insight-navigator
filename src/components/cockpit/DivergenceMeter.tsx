import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { DivergenceMetric } from '@/types/morphik';

interface DivergenceMeterProps {
  divergence: DivergenceMetric;
}

export const DivergenceMeter = ({ divergence }: DivergenceMeterProps) => {
  const angle = (divergence.score * 180) - 90; // -90 to 90 degrees
  
  const getTrendIcon = () => {
    switch (divergence.trend) {
      case 'increasing':
        return <TrendingUp className="w-3 h-3 text-destructive" />;
      case 'decreasing':
        return <TrendingDown className="w-3 h-3 text-success" />;
      default:
        return <Minus className="w-3 h-3 text-muted-foreground" />;
    }
  };

  return (
    <div className="card-elevated rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
          Divergence Meter
        </span>
        <div className="flex items-center gap-1.5">
          {getTrendIcon()}
          <span className="text-xs text-muted-foreground">
            {divergence.cluster_a} vs {divergence.cluster_b}
          </span>
        </div>
      </div>
      
      <div className="flex items-center justify-center">
        <div className="relative w-32 h-16">
          {/* Background arc */}
          <svg viewBox="0 0 100 50" className="w-full h-full">
            {/* Background semi-circle */}
            <path
              d="M 5 50 A 45 45 0 0 1 95 50"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Gradient arc */}
            <defs>
              <linearGradient id="divergenceGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(210, 100%, 55%)" />
                <stop offset="50%" stopColor="hsl(280, 60%, 55%)" />
                <stop offset="100%" stopColor="hsl(0, 75%, 55%)" />
              </linearGradient>
            </defs>
            <path
              d="M 5 50 A 45 45 0 0 1 95 50"
              fill="none"
              stroke="url(#divergenceGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${divergence.score * 141.37} 141.37`}
            />
            {/* Needle */}
            <motion.line
              x1="50"
              y1="50"
              x2="50"
              y2="12"
              stroke="hsl(var(--foreground))"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ rotate: -90 }}
              animate={{ rotate: angle }}
              transition={{ duration: 1, ease: 'easeOut' }}
              style={{ transformOrigin: '50px 50px' }}
            />
            {/* Center dot */}
            <circle cx="50" cy="50" r="4" fill="hsl(var(--foreground))" />
          </svg>
          
          {/* Value */}
          <div className="absolute inset-x-0 bottom-0 text-center">
            <span className="text-xl font-bold font-mono text-foreground">
              {Math.round(divergence.score * 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
