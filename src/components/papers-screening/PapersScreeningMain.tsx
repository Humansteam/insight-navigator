import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { PaperWithScreening } from './types';
import { PaperRowCard } from './PaperRowCard';
import { ScreeningFilters } from './ScreeningFilters';
import { mockScreeningData } from './mockData';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowUpDown } from 'lucide-react';

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
        {/* Column Headers */}
        <div className="grid grid-cols-[1fr_280px] border-b border-border bg-muted/30">
          <div className="px-5 py-2.5 text-xs font-medium text-muted-foreground">
            Paper
          </div>
          <div className="px-4 py-2.5 border-l border-border/40 flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Screening</span>
            <button
              onClick={toggleSort}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowUpDown className="w-3 h-3" />
              {sortOrder === 'desc' ? 'High→Low' : 'Low→High'}
            </button>
          </div>
        </div>

        {/* Papers List */}
        <ScrollArea className="flex-1">
          {filteredAndSortedPapers.map(paper => (
            <PaperRowCard
              key={paper.id}
              paper={paper}
              isSelected={selectedPaperId === paper.id}
              onSelect={handleSelect}
            />
          ))}
          
          {filteredAndSortedPapers.length === 0 && (
            <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
              No papers match current filters
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Filters Sidebar */}
      <div className="w-56 border-l border-border bg-muted/5 p-4">
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
