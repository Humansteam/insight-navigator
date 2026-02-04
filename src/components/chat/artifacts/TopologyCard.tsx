import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Network, AlertTriangle, ArrowLeftRight, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TopologyArtifact } from './types';

interface TopologyCardProps {
  data: TopologyArtifact;
  onPaperClick?: (paperId: string) => void;
}

function DivergenceMeter({ score, level }: { score: number; level: string }) {
  const levelColors = {
    critical: 'text-red-400',
    high: 'text-orange-400',
    medium: 'text-amber-400',
    low: 'text-green-400',
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-muted-foreground">Divergence Score</span>
          <span className={cn("text-sm font-bold", levelColors[level as keyof typeof levelColors])}>
            {(score * 100).toFixed(0)}%
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className={cn(
              "h-full rounded-full transition-all",
              level === 'critical' && "bg-red-500",
              level === 'high' && "bg-orange-500",
              level === 'medium' && "bg-amber-500",
              level === 'low' && "bg-green-500"
            )}
            style={{ width: `${score * 100}%` }}
          />
        </div>
      </div>
      {(level === 'critical' || level === 'high') && (
        <AlertTriangle className={cn("w-5 h-5", levelColors[level as keyof typeof levelColors])} />
      )}
    </div>
  );
}

function MiniGraph({ clusters }: { clusters: TopologyArtifact['clusters'] }) {
  // Simple SVG representation of clusters
  const colors = ['#FF5A7F', '#D97B3D', '#E8C547', '#4DC4C4', '#6BA8DC'];
  
  return (
    <div className="aspect-video bg-[#0a0f1a] rounded-lg border border-border relative overflow-hidden">
      {/* Stars background */}
      <div className="absolute inset-0 opacity-30">
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={i}
            className="absolute w-0.5 h-0.5 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
      
      {/* Cluster nodes */}
      <svg className="w-full h-full" viewBox="0 0 100 60">
        {clusters.map((cluster, i) => {
          const cx = 20 + (i % 3) * 30;
          const cy = 15 + Math.floor(i / 3) * 30;
          const r = 3 + (cluster.nodeCount / 20);
          
          return (
            <g key={cluster.id}>
              {/* Glow */}
              <circle 
                cx={cx} 
                cy={cy} 
                r={r * 2} 
                fill={colors[i % colors.length]}
                opacity={0.2}
              />
              {/* Node */}
              <circle 
                cx={cx} 
                cy={cy} 
                r={r} 
                fill={colors[i % colors.length]}
                opacity={0.8}
              />
              {/* Label */}
              <text 
                x={cx} 
                y={cy + r + 5} 
                textAnchor="middle" 
                fill="white" 
                fontSize="4"
                opacity={0.7}
              >
                {cluster.label.split(' ')[0]}
              </text>
            </g>
          );
        })}
        
        {/* Connecting lines */}
        {clusters.slice(0, -1).map((cluster, i) => {
          const x1 = 20 + (i % 3) * 30;
          const y1 = 15 + Math.floor(i / 3) * 30;
          const x2 = 20 + ((i + 1) % 3) * 30;
          const y2 = 15 + Math.floor((i + 1) / 3) * 30;
          
          return (
            <line 
              key={`line-${i}`}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="white"
              strokeOpacity={0.1}
              strokeWidth={0.3}
            />
          );
        })}
      </svg>
    </div>
  );
}

export function TopologyCard({ data, onPaperClick }: TopologyCardProps) {
  return (
    <Card className="border-border bg-card overflow-hidden">
      <CardHeader className="p-3 pb-2 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-primary" />
          <CardTitle className="text-sm">Research Topology</CardTitle>
          <Badge variant="secondary" className="text-[10px]">
            {data.totalNodes} nodes · {data.totalEdges} edges
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-3 pt-0 space-y-4">
        {/* Insight Text */}
        <div className="p-2 bg-primary/10 border border-primary/20 rounded-md">
          <p className="text-xs text-foreground leading-relaxed">
            {data.insightText}
          </p>
        </div>

        {/* Divergence Meter */}
        <DivergenceMeter score={data.divergenceScore} level={data.divergenceLevel} />

        {/* Mini Graph */}
        <MiniGraph clusters={data.clusters} />

        {/* Clusters Summary */}
        <div className="space-y-1">
          <span className="text-xs text-muted-foreground">Clusters ({data.clusters.length})</span>
          <div className="flex flex-wrap gap-1.5">
            {data.clusters.map(cluster => (
              <Badge key={cluster.id} variant="outline" className="text-[10px]">
                {cluster.label} ({cluster.nodeCount})
              </Badge>
            ))}
          </div>
        </div>

        {/* Bridge Papers */}
        {data.bridges.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <ArrowLeftRight className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Bridge Papers ({data.bridges.length})</span>
            </div>
            <div className="space-y-1.5">
              {data.bridges.slice(0, 3).map(paper => (
                <button
                  key={paper.id}
                  onClick={() => onPaperClick?.(paper.id)}
                  className="w-full text-left p-2 bg-muted/30 rounded-md hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start gap-2">
                    <FileText className="w-3 h-3 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-foreground line-clamp-1">{paper.title}</p>
                      <div className="flex gap-1 mt-1">
                        {paper.clusters.map(c => (
                          <Badge key={c} variant="secondary" className="text-[9px] h-4">
                            {c}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
