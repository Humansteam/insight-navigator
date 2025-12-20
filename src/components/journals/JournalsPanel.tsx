import { useState } from 'react';
import { format } from 'date-fns';
import { Plus, Search, BookOpen, Clock, FileText, ChevronRight } from 'lucide-react';
import { useJournals, Journal } from '@/contexts/JournalsContext';
import { JournalView } from './JournalView';
import { CreateJournalDialog } from './CreateJournalDialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const JournalsPanel = () => {
  const { journals, getJournalEntries } = useJournals();
  const [selectedJournalId, setSelectedJournalId] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [search, setSearch] = useState('');

  const selectedJournal = selectedJournalId 
    ? journals.find(j => j.id === selectedJournalId)
    : null;

  const filteredJournals = journals.filter(j =>
    j.title.toLowerCase().includes(search.toLowerCase())
  );

  // Sort by last updated
  const sortedJournals = [...filteredJournals].sort(
    (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
  );

  if (selectedJournal) {
    return (
      <JournalView
        journal={selectedJournal}
        onBack={() => setSelectedJournalId(null)}
      />
    );
  }

  return (
    <div className="h-full flex flex-col p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            Research Journals
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Your research diaries organized by topic
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="gap-1.5">
          <Plus className="w-4 h-4" />
          New Journal
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search journals..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      {/* Journals grid */}
      {sortedJournals.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            {search ? 'No journals found' : 'No journals yet'}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-sm">
            {search 
              ? 'Try a different search term'
              : 'Create your first research journal to start collecting insights from reports, chats, and topology views.'
            }
          </p>
          {!search && (
            <Button onClick={() => setShowCreateDialog(true)} className="gap-1.5">
              <Plus className="w-4 h-4" />
              Create your first journal
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-auto">
          {sortedJournals.map(journal => {
            const entries = getJournalEntries(journal.id);
            return (
              <button
                key={journal.id}
                onClick={() => setSelectedJournalId(journal.id)}
                className="group p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-all text-left"
              >
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-3xl">{journal.icon}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                      {journal.title}
                    </h3>
                    {journal.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {journal.description}
                      </p>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                </div>
                
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    {entries.length} entries
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {format(journal.updatedAt, 'MMM d')}
                  </span>
                </div>

                {/* Entry preview */}
                {entries.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border/50">
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {entries[entries.length - 1].content}
                    </p>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      <CreateJournalDialog
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onCreated={(id) => setSelectedJournalId(id)}
      />
    </div>
  );
};
