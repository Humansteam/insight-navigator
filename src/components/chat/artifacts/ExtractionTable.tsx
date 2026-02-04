import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Database, Filter, TableIcon, Grid3X3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ExtractionArtifact, ExtractedFact } from './types';

interface ExtractionTableProps {
  data: ExtractionArtifact;
}

function ConfidenceBadge({ level }: { level: 'high' | 'medium' | 'low' }) {
  const styles = {
    high: 'bg-green-500/20 text-green-400 border-green-500/30',
    medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    low: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  return (
    <Badge variant="outline" className={cn("text-[9px] h-4 px-1.5", styles[level])}>
      {level}
    </Badge>
  );
}

export function ExtractionTable({ data }: ExtractionTableProps) {
  const [activeTab, setActiveTab] = useState<'facts' | 'pivot'>('facts');
  const [filters, setFilters] = useState({
    region: 'all',
    confidence: 'all',
    dimension: 'all',
  });

  const regions = useMemo(() => 
    [...new Set(data.facts.map(f => f.region))],
    [data.facts]
  );

  const dimensions = useMemo(() => 
    [...new Set(data.facts.map(f => f.dimension))],
    [data.facts]
  );

  const filteredFacts = useMemo(() => {
    return data.facts.filter(fact => {
      if (filters.region !== 'all' && fact.region !== filters.region) return false;
      if (filters.confidence !== 'all' && fact.confidence !== filters.confidence) return false;
      if (filters.dimension !== 'all' && fact.dimension !== filters.dimension) return false;
      return true;
    });
  }, [data.facts, filters]);

  // Pivot table: dimension → values grouped by confidence
  const pivotData = useMemo(() => {
    const pivot: Record<string, { high: string[]; medium: string[]; low: string[] }> = {};
    
    data.facts.forEach(fact => {
      if (!pivot[fact.dimension]) {
        pivot[fact.dimension] = { high: [], medium: [], low: [] };
      }
      pivot[fact.dimension][fact.confidence].push(fact.value);
    });
    
    return Object.entries(pivot).map(([dimension, values]) => ({
      dimension,
      ...values,
    }));
  }, [data.facts]);

  return (
    <Card className="border-border bg-card overflow-hidden">
      <CardHeader className="p-3 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-primary" />
            <CardTitle className="text-sm">Extracted Facts</CardTitle>
            <Badge variant="secondary" className="text-[10px]">
              {data.totalFacts} facts
            </Badge>
          </div>
          
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'facts' | 'pivot')}>
            <TabsList className="h-7">
              <TabsTrigger value="facts" className="text-xs h-6 px-2">
                <TableIcon className="w-3 h-3 mr-1" />
                Facts
              </TabsTrigger>
              <TabsTrigger value="pivot" className="text-xs h-6 px-2">
                <Grid3X3 className="w-3 h-3 mr-1" />
                By Dimension
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Filters */}
        {activeTab === 'facts' && (
          <div className="flex items-center gap-2 mt-2">
            <Filter className="w-3 h-3 text-muted-foreground" />
            
            <Select value={filters.region} onValueChange={(v) => setFilters(f => ({ ...f, region: v }))}>
              <SelectTrigger className="h-7 w-24 text-xs">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {regions.map(r => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.confidence} onValueChange={(v) => setFilters(f => ({ ...f, confidence: v }))}>
              <SelectTrigger className="h-7 w-24 text-xs">
                <SelectValue placeholder="Confidence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.dimension} onValueChange={(v) => setFilters(f => ({ ...f, dimension: v }))}>
              <SelectTrigger className="h-7 w-28 text-xs">
                <SelectValue placeholder="Dimension" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dimensions</SelectItem>
                {dimensions.map(d => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-0">
        {activeTab === 'facts' ? (
          <div className="max-h-64 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs h-8">Paper</TableHead>
                  <TableHead className="text-xs h-8">Dimension</TableHead>
                  <TableHead className="text-xs h-8">Value</TableHead>
                  <TableHead className="text-xs h-8 w-16">Conf.</TableHead>
                  <TableHead className="text-xs h-8 w-16">Region</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFacts.slice(0, 10).map(fact => (
                  <TableRow key={fact.id} className="hover:bg-muted/50">
                    <TableCell className="text-xs py-2 max-w-32 truncate">
                      {fact.paperTitle}
                    </TableCell>
                    <TableCell className="text-xs py-2">
                      <Badge variant="outline" className="text-[9px]">{fact.dimension}</Badge>
                    </TableCell>
                    <TableCell className="text-xs py-2 text-muted-foreground max-w-48 truncate">
                      {fact.value}
                    </TableCell>
                    <TableCell className="py-2">
                      <ConfidenceBadge level={fact.confidence} />
                    </TableCell>
                    <TableCell className="text-xs py-2 text-muted-foreground">
                      {fact.region}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="p-3 space-y-3">
            {pivotData.map(row => (
              <div key={row.dimension} className="p-2 bg-muted/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="default" className="text-[10px]">{row.dimension}</Badge>
                  <span className="text-[10px] text-muted-foreground">
                    {row.high.length + row.medium.length + row.low.length} values
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[10px]">
                  <div>
                    <span className="text-primary">High ({row.high.length})</span>
                    <div className="text-muted-foreground truncate">
                      {row.high.slice(0, 2).join(', ')}
                    </div>
                  </div>
                  <div>
                    <span className="text-accent-foreground">Medium ({row.medium.length})</span>
                    <div className="text-muted-foreground truncate">
                      {row.medium.slice(0, 2).join(', ')}
                    </div>
                  </div>
                  <div>
                    <span className="text-destructive">Low ({row.low.length})</span>
                    <div className="text-muted-foreground truncate">
                      {row.low.slice(0, 2).join(', ')}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
