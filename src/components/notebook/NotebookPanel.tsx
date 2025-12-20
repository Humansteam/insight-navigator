import { useState, useMemo } from 'react';
import { BookOpen, Search, Plus, Filter, Tag, FileText, MessageSquare, Network, StickyNote } from 'lucide-react';
import { useNotes, Note } from '@/contexts/NotesContext';
import { NoteCard } from './NoteCard';
import { AddNotePopover } from './AddNotePopover';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

type FilterSource = 'all' | Note['source'];

export const NotebookPanel = () => {
  const { notes, allTags } = useNotes();
  const [search, setSearch] = useState('');
  const [filterSource, setFilterSource] = useState<FilterSource>('all');
  const [filterTag, setFilterTag] = useState<string | null>(null);

  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      // Search filter
      if (search && !note.content.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      // Source filter
      if (filterSource !== 'all' && note.source !== filterSource) {
        return false;
      }
      // Tag filter
      if (filterTag && !note.tags.includes(filterTag)) {
        return false;
      }
      return true;
    });
  }, [notes, search, filterSource, filterTag]);

  const sourceFilters: { id: FilterSource; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All', icon: <StickyNote className="w-3.5 h-3.5" /> },
    { id: 'report', label: 'Report', icon: <FileText className="w-3.5 h-3.5" /> },
    { id: 'chat', label: 'Chat', icon: <MessageSquare className="w-3.5 h-3.5" /> },
    { id: 'topology', label: 'Graph', icon: <Network className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Research Notebook</h2>
          </div>
          <AddNotePopover
            trigger={
              <button className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            }
            source="manual"
            sourceLabel="Manual note"
          />
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-muted/50 border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {/* Source filters */}
          <div className="flex bg-muted/50 rounded-lg p-0.5">
            {sourceFilters.map(source => (
              <button
                key={source.id}
                onClick={() => setFilterSource(source.id)}
                className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-all",
                  filterSource === source.id
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {source.icon}
                {source.label}
              </button>
            ))}
          </div>

          {/* Tag filter */}
          {filterTag && (
            <button
              onClick={() => setFilterTag(null)}
              className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs"
            >
              <Tag className="w-3 h-3" />
              {filterTag}
              <span className="ml-1">×</span>
            </button>
          )}
        </div>

        {/* Quick tags */}
        {allTags.length > 0 && !filterTag && (
          <div className="flex flex-wrap gap-1">
            {allTags.slice(0, 8).map(tag => (
              <button
                key={tag}
                onClick={() => setFilterTag(tag)}
                className="px-2 py-0.5 rounded-full border border-border text-xs text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Notes list */}
      <ScrollArea className="flex-1 p-4">
        {filteredNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <StickyNote className="w-12 h-12 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">
              {notes.length === 0
                ? "No notes yet. Start collecting insights!"
                : "No notes match your filters"}
            </p>
            {notes.length === 0 && (
              <p className="text-xs text-muted-foreground mt-2">
                Select text in the report or save AI insights to add notes
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotes.map(note => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Stats footer */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{notes.length} note{notes.length !== 1 ? 's' : ''} total</span>
          <span>{allTags.length} tag{allTags.length !== 1 ? 's' : ''}</span>
        </div>
      </div>
    </div>
  );
};
