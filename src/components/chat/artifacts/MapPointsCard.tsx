import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Map, BarChart3, TrendingUp, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MapPointsArtifact, ClusterCard } from './types';

interface MapPointsCardProps {
  data: MapPointsArtifact;
}

function ClusterCardItem({ cluster }: { cluster: ClusterCard }) {
  return (
    <Card className="border-border bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
      <CardContent className="p-3 space-y-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: cluster.color }} 
            />
            <span className="text-sm font-medium text-foreground">{cluster.name}</span>
          </div>
          <Badge 
            variant={cluster.growth > 0 ? 'default' : 'secondary'}
            className={cn(
              "text-[10px]",
              cluster.growth > 0 && "bg-green-500/20 text-green-400 border-green-500/30"
            )}
          >
            {cluster.growth > 0 ? '+' : ''}{cluster.growth}%
          </Badge>
        </div>
        
        <div className="text-xs text-muted-foreground">
          {cluster.paperCount} papers
        </div>
        
        <div className="flex flex-wrap gap-1">
          {cluster.topRegions.slice(0, 3).map(r => (
            <Badge key={r.name} variant="outline" className="text-[9px] h-4 px-1.5">
              {r.name} ({r.count})
            </Badge>
          ))}
        </div>
        
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border">
          {cluster.topMetrics.slice(0, 4).map(m => (
            <div key={m.label} className="text-[10px]">
              <span className="text-muted-foreground">{m.label}: </span>
              <span className="text-foreground font-medium">{m.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function MiniBarChart({ data, label }: { data: { name: string; value: number }[]; label: string }) {
  const max = Math.max(...data.map(d => d.value));
  
  return (
    <div className="space-y-1.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="space-y-1">
        {data.slice(0, 5).map(item => (
          <div key={item.name} className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground w-16 truncate">{item.name}</span>
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${(item.value / max) * 100}%` }}
              />
            </div>
            <span className="text-[10px] text-foreground w-8 text-right">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MapPointsCard({ data }: MapPointsCardProps) {
  const [activeTab, setActiveTab] = useState<'map' | 'summary'>('summary');

  return (
    <Card className="border-border bg-card overflow-hidden">
      <CardHeader className="p-3 pb-2 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Map className="w-4 h-4 text-primary" />
          <CardTitle className="text-sm">Research Landscape</CardTitle>
          <Badge variant="secondary" className="text-[10px]">
            {data.totalPapers} papers
          </Badge>
        </div>
        
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'map' | 'summary')}>
          <TabsList className="h-7">
            <TabsTrigger value="map" className="text-xs h-6 px-2">
              <Map className="w-3 h-3 mr-1" />
              Map
            </TabsTrigger>
            <TabsTrigger value="summary" className="text-xs h-6 px-2">
              <BarChart3 className="w-3 h-3 mr-1" />
              Summary
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>

      <CardContent className="p-3 pt-0">
        {activeTab === 'map' ? (
          <div className="aspect-video bg-muted/30 rounded-lg border border-border flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Map className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs">Interactive UMAP visualization</p>
              <p className="text-[10px]">Click clusters to explore</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Clusters Grid */}
            <div className="grid grid-cols-2 gap-2">
              {data.clusters.slice(0, 4).map(cluster => (
                <ClusterCardItem key={cluster.id} cluster={cluster} />
              ))}
            </div>
            
            {/* Charts Row */}
            <div className="grid grid-cols-2 gap-4 p-3 bg-muted/20 rounded-lg">
              <MiniBarChart 
                data={data.yearDistribution.map(y => ({ name: String(y.year), value: y.count }))}
                label="By Year"
              />
              <MiniBarChart 
                data={data.countryDistribution.map(c => ({ name: c.country, value: c.count }))}
                label="By Country"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
