import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Layers, TrendingUp, Globe, FileText, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ClusterInsightArtifact } from './types';

interface ClusterInsightCardProps {
  data: ClusterInsightArtifact;
  onPaperClick?: (paperId: string) => void;
}

function StatBox({ label, value, icon }: { label: string; value: string | number; icon?: React.ReactNode }) {
  return (
    <div className="p-2 bg-muted/30 rounded-md text-center">
      <div className="flex items-center justify-center gap-1 mb-1">
        {icon}
        <span className="text-lg font-bold text-foreground">{value}</span>
      </div>
      <span className="text-[10px] text-muted-foreground">{label}</span>
    </div>
  );
}

function GeoBar({ country, percentage }: { country: string; percentage: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-muted-foreground w-12 truncate">{country}</span>
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-[10px] text-foreground w-8 text-right">{percentage}%</span>
    </div>
  );
}

export function ClusterInsightCard({ data, onPaperClick }: ClusterInsightCardProps) {
  return (
    <Card className="border-border bg-card overflow-hidden">
      <CardHeader className="p-3 pb-2 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-primary" />
          <CardTitle className="text-sm">{data.clusterLabel}</CardTitle>
          <Badge variant="default" className="text-[10px]">
            Cluster Insight
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-3 pt-0 space-y-4">
        {/* Technical Brief */}
        <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
          <h4 className="text-xs font-medium text-foreground mb-1">What is this cluster?</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {data.technicalBrief}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-2">
          <StatBox 
            label="Papers" 
            value={data.stats.paperCount} 
            icon={<FileText className="w-3 h-3 text-muted-foreground" />}
          />
          <StatBox 
            label="Avg Citations" 
            value={data.stats.avgCitations.toFixed(0)} 
            icon={<TrendingUp className="w-3 h-3 text-muted-foreground" />}
          />
          <StatBox 
            label="Avg FWCI" 
            value={data.stats.avgFwci.toFixed(2)} 
            icon={<BarChart3 className="w-3 h-3 text-muted-foreground" />}
          />
          <StatBox 
            label="Years" 
            value={`${data.stats.yearRange[0]}-${data.stats.yearRange[1]}`}
          />
        </div>

        {/* Geo Distribution */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <Globe className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Geographic Distribution</span>
          </div>
          <div className="space-y-1.5">
            {data.geoDistribution.slice(0, 5).map(geo => (
              <GeoBar key={geo.country} country={geo.country} percentage={geo.percentage} />
            ))}
          </div>
        </div>

        {/* Top Papers */}
        <div className="space-y-2">
          <span className="text-xs text-muted-foreground">Top Papers ({data.topPapers.length})</span>
          <div className="space-y-1.5">
            {data.topPapers.slice(0, 3).map(paper => (
              <button
                key={paper.id}
                onClick={() => onPaperClick?.(paper.id)}
                className="w-full text-left p-2 bg-muted/30 rounded-md hover:bg-muted/50 transition-colors group"
              >
                <p className="text-xs text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                  {paper.title}
                </p>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                  <span>{paper.year}</span>
                  <span>·</span>
                  <span>{paper.citations} citations</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
