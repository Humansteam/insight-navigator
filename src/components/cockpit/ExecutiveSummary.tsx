"use client";

import { motion } from 'framer-motion';
import { 
  Target, 
  AlertTriangle, 
  Lightbulb, 
  Compass, 
  TrendingUp, 
  TrendingDown,
  Minus,
  Shield,
  Zap,
  FlaskConical,
  Factory,
  Rocket,
  CheckCircle2,
  XCircle,
  HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

export interface TRLData {
  region: string;
  level: number;
  label: string;
  papers: string[];
}

export interface ConflictData {
  topic: string;
  status: 'consensus' | 'debate';
  description: string;
  sources: string[];
}

export interface GapData {
  area: string;
  description: string;
  opportunity: string;
}

export interface StrategicHorizonData {
  currentTrend: string;
  futureTrend: string;
  leader: string;
  leaderAdvantage: string;
  emergingApproach: string;
  emergingReason: string;
  confidence: 'high' | 'medium' | 'low';
  dataDensity: number;
  timeframe: string;
}

interface ExecutiveSummaryProps {
  trlData: TRLData[];
  conflicts: ConflictData[];
  gaps: GapData[];
  strategicHorizon: StrategicHorizonData;
  onCitationHover?: (paperId: string | null) => void;
  onCitationClick?: (paperId: string) => void;
}

const TRLMeter = ({ data, onCitationClick }: { data: TRLData; onCitationClick?: (id: string) => void }) => {
  const getTRLColor = (level: number) => {
    if (level <= 3) return 'bg-blue-500';
    if (level <= 6) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const getTRLIcon = (level: number) => {
    if (level <= 3) return <FlaskConical className="w-4 h-4" />;
    if (level <= 6) return <Zap className="w-4 h-4" />;
    return <Factory className="w-4 h-4" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-3 rounded-lg bg-card/50 border border-card-border"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {getTRLIcon(data.level)}
          <span className="text-sm font-medium text-foreground">{data.region}</span>
        </div>
        <Badge variant="outline" className={cn(
          "text-xs font-mono",
          data.level <= 3 && "border-blue-500/50 text-blue-400",
          data.level > 3 && data.level <= 6 && "border-amber-500/50 text-amber-400",
          data.level > 6 && "border-emerald-500/50 text-emerald-400"
        )}>
          TRL {data.level}
        </Badge>
      </div>
      
      <div className="relative h-2 bg-muted rounded-full overflow-hidden mb-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(data.level / 9) * 100}%` }}
          transition={{ duration: 1, delay: 0.3 }}
          className={cn("h-full rounded-full", getTRLColor(data.level))}
        />
        {/* TRL markers */}
        <div className="absolute inset-0 flex">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <div key={n} className="flex-1 border-r border-background/30 last:border-r-0" />
          ))}
        </div>
      </div>
      
      <p className="text-xs text-muted-foreground mb-2">{data.label}</p>
      
      <div className="flex gap-1 flex-wrap">
        {data.papers.map((paper) => (
          <button
            key={paper}
            onClick={() => onCitationClick?.(paper)}
            className="text-xs px-1.5 py-0.5 rounded bg-primary/20 text-primary hover:bg-primary/30 transition-colors font-mono"
          >
            [{paper.replace('paper-', '')}]
          </button>
        ))}
      </div>
    </motion.div>
  );
};

const ConflictCard = ({ data, onCitationClick }: { data: ConflictData; onCitationClick?: (id: string) => void }) => {
  const isConsensus = data.status === 'consensus';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "p-3 rounded-lg border",
        isConsensus 
          ? "bg-emerald-500/5 border-emerald-500/30" 
          : "bg-amber-500/5 border-amber-500/30"
      )}
    >
      <div className="flex items-start gap-2 mb-2">
        {isConsensus ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
        ) : (
          <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-foreground">{data.topic}</span>
            <Badge 
              variant="outline" 
              className={cn(
                "text-[10px] uppercase",
                isConsensus ? "border-emerald-500/50 text-emerald-400" : "border-amber-500/50 text-amber-400"
              )}
            >
              {isConsensus ? 'Confirmed Consensus' : 'Active Debate'}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">{data.description}</p>
        </div>
      </div>
      
      <div className="flex gap-1 flex-wrap ml-6">
        {data.sources.map((source) => (
          <button
            key={source}
            onClick={() => onCitationClick?.(source)}
            className="text-xs px-1.5 py-0.5 rounded bg-primary/20 text-primary hover:bg-primary/30 transition-colors font-mono"
          >
            [{source.replace('paper-', '')}]
          </button>
        ))}
      </div>
    </motion.div>
  );
};

const GapCard = ({ data }: { data: GapData }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="p-3 rounded-lg bg-violet-500/5 border border-violet-500/30"
  >
    <div className="flex items-start gap-2">
      <Lightbulb className="w-4 h-4 text-violet-400 mt-0.5 shrink-0" />
      <div>
        <span className="text-sm font-medium text-foreground block mb-1">{data.area}</span>
        <p className="text-xs text-muted-foreground mb-2">{data.description}</p>
        <div className="flex items-center gap-1.5">
          <Rocket className="w-3 h-3 text-violet-400" />
          <span className="text-xs text-violet-300">{data.opportunity}</span>
        </div>
      </div>
    </div>
  </motion.div>
);

const ConfidenceIndicator = ({ level, dataDensity }: { level: 'high' | 'medium' | 'low'; dataDensity: number }) => {
  const getColor = () => {
    switch (level) {
      case 'high': return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
      case 'medium': return 'text-amber-400 bg-amber-500/20 border-amber-500/30';
      case 'low': return 'text-red-400 bg-red-500/20 border-red-500/30';
    }
  };

  const getIcon = () => {
    switch (level) {
      case 'high': return <Shield className="w-5 h-5" />;
      case 'medium': return <HelpCircle className="w-5 h-5" />;
      case 'low': return <XCircle className="w-5 h-5" />;
    }
  };

  return (
    <div className={cn("flex items-center gap-3 p-3 rounded-lg border", getColor())}>
      {getIcon()}
      <div>
        <div className="text-sm font-medium capitalize">{level} Confidence</div>
        <div className="text-xs opacity-70">Based on {dataDensity} data points</div>
      </div>
    </div>
  );
};

export const ExecutiveSummary = ({
  trlData,
  conflicts,
  gaps,
  strategicHorizon,
  onCitationHover,
  onCitationClick
}: ExecutiveSummaryProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 mt-8 pt-6 border-t border-card-border"
    >
      {/* Section Header */}
      <motion.div variants={itemVariants} className="flex items-center gap-3">
        <div className="w-1 h-8 bg-gradient-to-b from-primary to-primary/30 rounded-full" />
        <div>
          <h2 className="text-lg font-semibold text-foreground">Meta-Synthesis Layer</h2>
          <p className="text-xs text-muted-foreground">Strategic intelligence beyond aggregation</p>
        </div>
      </motion.div>

      {/* TRL Assessment */}
      <motion.div variants={itemVariants} className="space-y-3">
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
            Technology Readiness Level (TRL) Assessment
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {trlData.map((data, i) => (
            <TRLMeter 
              key={data.region} 
              data={data} 
              onCitationClick={onCitationClick}
            />
          ))}
        </div>
        
        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2 px-1">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-blue-500" />
            <span>TRL 1-3: Fundamental</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-amber-500" />
            <span>TRL 4-6: Applied R&D</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-emerald-500" />
            <span>TRL 7-9: Industrial</span>
          </div>
        </div>
      </motion.div>

      {/* Conflicts & Consensus */}
      <motion.div variants={itemVariants} className="space-y-3">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
            Critical Conflicts & Consensus
          </h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {conflicts.map((conflict, i) => (
            <ConflictCard 
              key={i} 
              data={conflict}
              onCitationClick={onCitationClick}
            />
          ))}
        </div>
      </motion.div>

      {/* White Space / Gaps */}
      <motion.div variants={itemVariants} className="space-y-3">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
            The "White Space" — Research Gaps
          </h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {gaps.map((gap, i) => (
            <GapCard key={i} data={gap} />
          ))}
        </div>
      </motion.div>

      {/* Strategic Horizon */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center gap-2 mb-4">
          <Compass className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
            Strategic Horizon & Outlook
          </h3>
          <Badge variant="outline" className="text-[10px] ml-2">
            {strategicHorizon.timeframe}
          </Badge>
        </div>
        
        <div className="relative p-5 rounded-xl bg-gradient-to-br from-card/80 to-card/40 border border-card-border overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-violet-500/5 rounded-full blur-2xl" />
          
          <div className="relative space-y-4">
            {/* Trend pivot */}
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-foreground leading-relaxed">
                  The field is currently pivoting from{' '}
                  <span className="font-semibold text-primary">{strategicHorizon.currentTrend}</span>
                  {' '}to{' '}
                  <span className="font-semibold text-primary">{strategicHorizon.futureTrend}</span>.
                </p>
              </div>
            </div>

            {/* Current leader */}
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 shrink-0">
                <Shield className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-foreground leading-relaxed">
                  While <span className="font-semibold text-emerald-400">{strategicHorizon.leader}</span>
                  {' '}holds the immediate advantage in{' '}
                  <span className="text-muted-foreground">{strategicHorizon.leaderAdvantage}</span>,
                  the emerging data suggests that{' '}
                  <span className="font-semibold text-violet-400">{strategicHorizon.emergingApproach}</span>
                  {' '}will dominate the long-term horizon due to{' '}
                  <span className="text-muted-foreground">{strategicHorizon.emergingReason}</span>.
                </p>
              </div>
            </div>

            {/* Confidence score */}
            <div className="pt-3 border-t border-card-border/50">
              <ConfidenceIndicator 
                level={strategicHorizon.confidence} 
                dataDensity={strategicHorizon.dataDensity}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Final verdict badge */}
      <motion.div 
        variants={itemVariants}
        className="flex justify-center pt-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-mono text-primary uppercase tracking-wider">
            Meta-Analysis Complete
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};
