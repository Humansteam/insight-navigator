import React, { useState } from 'react';
import { Plus, Search, ChevronRight, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Journal } from '@/contexts/JournalsContext';

interface JournalsSidebarProps {
  journals: Journal[];
  activeJournalId: string | null;
  onSelectJournal: (id: string) => void;
  onCreateNew: () => void;
}

export const JournalsSidebar = ({
  journals,
  activeJournalId,
  onSelectJournal,
  onCreateNew,
}: JournalsSidebarProps) => {
  const [search, setSearch] = useState('');

  const filteredJournals = journals.filter(j =>
    j.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-64 border-r border-border bg-muted/20 flex flex-col h-full">
      {/* Header with icons */}
      <div className="h-9 flex items-center justify-between px-2 border-b border-border">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onCreateNew}>
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
        <div className="relative flex-1 mx-2">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
          <Input
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-6 pl-7 text-xs bg-background/50 border-0"
          />
        </div>
      </div>

      {/* Journal List */}
      <ScrollArea className="flex-1">
        <div className="py-1">
          {filteredJournals.length === 0 ? (
            <div className="text-xs text-muted-foreground text-center py-4">
              {search ? 'No results' : 'No journals'}
            </div>
          ) : (
            filteredJournals
              .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
              .map((journal) => (
                <button
                  key={journal.id}
                  onClick={() => onSelectJournal(journal.id)}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-1 text-left text-sm transition-colors",
                    "hover:bg-accent/50",
                    activeJournalId === journal.id && "bg-accent text-accent-foreground"
                  )}
                >
                  <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />
                  <span className="truncate text-xs">{journal.icon} {journal.title}</span>
                </button>
              ))
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="h-8 flex items-center justify-between px-3 border-t border-border text-xs text-muted-foreground">
        <span>Journals</span>
        <Button variant="ghost" size="icon" className="h-5 w-5" onClick={onCreateNew}>
          <Plus className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};
