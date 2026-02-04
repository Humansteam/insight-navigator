import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, TrendingUp, Calendar, MapPin, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SearchResultsArtifact, SearchResult } from './types';

interface SearchResultsCardProps {
  data: SearchResultsArtifact;
  onPaperClick?: (paperId: string) => void;
  onFilterClick?: (filter: { type: string; value: string }) => void;
}

function ResultCard({ 
  result, 
  onClick 
}: { 
  result: SearchResult; 
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-3 bg-muted/30 rounded-lg border border-transparent hover:border-border hover:bg-muted/50 transition-all group"
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {result.title}
        </h4>
        <ExternalLink className="w-3.5 h-3.5 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      
      <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {result.year}
        </div>
        <div className="flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          FWCI: {result.fwci.toFixed(2)}
        </div>
        <div>
          {result.citations} cites
        </div>
      </div>
      
      <div className="flex items-center gap-1.5 mt-2">
        {result.countries.slice(0, 3).map(country => (
          <Badge key={country} variant="outline" className="text-[9px] h-4 px-1.5">
            {country}
          </Badge>
        ))}
      </div>
    </button>
  );
}

function MiniChart({ 
  data, 
  type 
}: { 
  data: { label: string; value: number }[]; 
  type: 'bar' | 'line';
}) {
  const max = Math.max(...data.map(d => d.value));
  
  return (
    <div className="h-16 flex items-end gap-1">
      {data.map((item, i) => (
        <div key={i} className="flex-1 flex flex-col items-center">
          <div 
            className="w-full bg-primary/60 rounded-t transition-all hover:bg-primary"
            style={{ height: `${(item.value / max) * 100}%` }}
          />
          <span className="text-[8px] text-muted-foreground mt-1 rotate-45 origin-left">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}

export function SearchResultsCard({ data, onPaperClick, onFilterClick }: SearchResultsCardProps) {
  // Aggregate data for charts
  const yearData = data.results.reduce((acc, r) => {
    const year = String(r.year);
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const countryData = data.results.reduce((acc, r) => {
    r.countries.forEach(c => {
      acc[c] = (acc[c] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const fwciRanges = [
    { label: '<1', min: 0, max: 1 },
    { label: '1-2', min: 1, max: 2 },
    { label: '2-5', min: 2, max: 5 },
    { label: '>5', min: 5, max: 100 },
  ];

  const fwciData = fwciRanges.map(range => ({
    label: range.label,
    value: data.results.filter(r => r.fwci >= range.min && r.fwci < range.max).length,
  }));

  return (
    <Card className="border-border bg-card overflow-hidden">
      <CardHeader className="p-3 pb-2 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-primary" />
          <CardTitle className="text-sm">Search Results</CardTitle>
          <Badge variant="secondary" className="text-[10px]">
            {data.totalFound} found
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-3 pt-0 space-y-4">
        {/* Query */}
        <div className="p-2 bg-muted/30 rounded-md">
          <p className="text-xs text-muted-foreground">
            <span className="text-foreground font-medium">Query:</span> {data.query}
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(countryData).slice(0, 5).map(([country, count]) => (
            <Button
              key={country}
              variant="outline"
              size="sm"
              className="h-6 px-2 text-[10px]"
              onClick={() => onFilterClick?.({ type: 'country', value: country })}
            >
              <MapPin className="w-2.5 h-2.5 mr-1" />
              {country} ({count})
            </Button>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-3 gap-3 p-3 bg-muted/20 rounded-lg">
          <div>
            <span className="text-[10px] text-muted-foreground">By Year</span>
            <MiniChart 
              data={Object.entries(yearData)
                .sort(([a], [b]) => Number(a) - Number(b))
                .slice(-6)
                .map(([year, count]) => ({ label: year.slice(-2), value: count }))} 
              type="bar" 
            />
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground">By Country</span>
            <MiniChart 
              data={Object.entries(countryData)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([country, count]) => ({ label: country.slice(0, 3), value: count }))} 
              type="bar" 
            />
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground">By FWCI</span>
            <MiniChart data={fwciData} type="bar" />
          </div>
        </div>

        {/* Results List */}
        <div className="space-y-2">
          {data.results.slice(0, 5).map(result => (
            <ResultCard 
              key={result.id} 
              result={result} 
              onClick={() => onPaperClick?.(result.id)}
            />
          ))}
          
          {data.results.length > 5 && (
            <Button variant="outline" className="w-full h-8 text-xs">
              Show all {data.totalFound} results
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
