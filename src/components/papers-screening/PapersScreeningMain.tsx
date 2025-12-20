import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { PaperWithScreening } from './types';
import { PaperRowCard } from './PaperRowCard';
import { ScreeningFilters } from './ScreeningFilters';
import { mockScreeningData } from './mockData';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileSearch, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PapersScreeningMainProps {
  papers?: PaperWithScreening[];
  onPaperSelect?: (id: string) => void;
  className?: string;
}

export const PapersScreeningMain = ({ 
  papers = mockScreeningData, 
  onPaperSelect,
  className 
}: PapersScreeningMainProps) => {
  const [selectedPaperId, setSelectedPaperId] = useState<string | null>(null);
  const [scoreThreshold, setScoreThreshold] = useState(0);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredAndSortedPapers = useMemo(() => {
    return papers
      .filter(p => p.screening.score >= scoreThreshold)
      .sort((a, b) => {
        const diff = a.screening.score - b.screening.score;
        return sortOrder === 'desc' ? -diff : diff;
      });
  }, [papers, scoreThreshold, sortOrder]);

  const includedCount = papers.filter(p => p.screening.verdict === 'include').length;
  const excludedCount = papers.filter(p => p.screening.verdict === 'exclude').length;

  const handleSelect = (id: string) => {
    setSelectedPaperId(id);
    onPaperSelect?.(id);
  };

  const toggleSort = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
  };

  return (
    <div className={cn('flex h-full', className)}>
      {/* Main Table Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Table Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-muted/30">
          <div className="flex items-center gap-2">
            <FileSearch className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-medium text-foreground">
              Papers Screening
            </h2>
            <span className="text-xs text-muted-foreground">
              ({filteredAndSortedPapers.length} of {papers.length})
            </span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSort}
            className="text-xs gap-1.5"
          >
            <ArrowUpDown className="w-3 h-3" />
            Score {sortOrder === 'desc' ? '↓' : '↑'}
          </Button>
        </div>

        {/* Table Column Headers */}
        <div className="grid grid-cols-[1fr_300px] gap-4 px-4 py-2 border-b border-border/30 bg-muted/20 text-xs font-medium text-muted-foreground">
          <div>Paper Details</div>
          <div className="pl-4">Screening Judgement</div>
        </div>

        {/* Papers List */}
        <ScrollArea className="flex-1">
          <div className="divide-y divide-border/30">
            {filteredAndSortedPapers.map(paper => (
              <PaperRowCard
                key={paper.id}
                paper={paper}
                isSelected={selectedPaperId === paper.id}
                onSelect={handleSelect}
              />
            ))}
          </div>
          
          {filteredAndSortedPapers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <FileSearch className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-sm">No papers match current filters</p>
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Filters Sidebar */}
      <div className="w-64 border-l border-border/50 bg-muted/10 p-4">
        <ScreeningFilters
          totalPapers={papers.length}
          includedCount={includedCount}
          excludedCount={excludedCount}
          scoreThreshold={scoreThreshold}
          onScoreThresholdChange={setScoreThreshold}
        />
      </div>
    </div>
  );
};
