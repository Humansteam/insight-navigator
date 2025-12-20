import React, { useState } from 'react';
import { Plus, Search, FileText } from 'lucide-react';
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
    <div className="w-48 border-r border-border bg-muted/30 flex flex-col h-full">
      {/* Header */}
      <div className="p-2 border-b border-border">
        <div className="flex items-center gap-1">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-7 pl-7 text-xs bg-background"
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0"
            onClick={onCreateNew}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Journal List */}
      <ScrollArea className="flex-1">
        <div className="p-1">
          {filteredJournals.length === 0 ? (
            <div className="text-xs text-muted-foreground text-center py-4">
              {search ? 'No results' : 'No journals yet'}
            </div>
          ) : (
            filteredJournals
              .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
              .map((journal) => (
                <button
                  key={journal.id}
                  onClick={() => onSelectJournal(journal.id)}
                  className={cn(
                    "w-full flex items-center gap-2 px-2 py-1.5 rounded text-left text-sm transition-colors",
                    "hover:bg-accent/50",
                    activeJournalId === journal.id && "bg-accent text-accent-foreground"
                  )}
                >
                  <span className="text-base shrink-0">{journal.icon}</span>
                  <span className="truncate text-xs">{journal.title}</span>
                </button>
              ))
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-2 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 h-7 text-xs text-muted-foreground"
          onClick={onCreateNew}
        >
          <FileText className="h-3 w-3" />
          New Journal
        </Button>
      </div>
    </div>
  );
};
