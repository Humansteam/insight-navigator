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
    <div className="w-96 border-r border-border bg-muted/20 flex flex-col h-full">
      {/* Header */}
      <div className="h-12 flex items-center justify-between px-4 border-b border-border">
        <span className="text-base font-medium">Journals</span>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onCreateNew}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search journals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 pl-10 text-base bg-background/50"
          />
        </div>
      </div>

      {/* Journal List */}
      <ScrollArea className="flex-1">
        <div className="py-2">
          {filteredJournals.length === 0 ? (
            <div className="text-base text-muted-foreground text-center py-8">
              {search ? 'No results found' : 'No journals yet'}
            </div>
          ) : (
            filteredJournals
              .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
              .map((journal) => (
                <button
                  key={journal.id}
                  onClick={() => onSelectJournal(journal.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors",
                    "hover:bg-accent/50",
                    activeJournalId === journal.id && "bg-accent text-accent-foreground"
                  )}
                >
                  <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="block text-base truncate">{journal.icon} {journal.title}</span>
                  </div>
                </button>
              ))
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="h-12 flex items-center justify-between px-4 border-t border-border text-sm text-muted-foreground">
        <span>{journals.length} {journals.length === 1 ? 'journal' : 'journals'}</span>
        <Button variant="ghost" size="sm" className="h-8 gap-2" onClick={onCreateNew}>
          <Plus className="h-4 w-4" />
          New
        </Button>
      </div>
    </div>
  );
};
