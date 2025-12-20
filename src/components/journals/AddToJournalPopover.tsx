import { useState, useEffect } from 'react';
import { Plus, ChevronRight, Search, Clock, StickyNote } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useJournals, Journal } from '@/contexts/JournalsContext';
import { CreateJournalDialog } from './CreateJournalDialog';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface AddToJournalPopoverProps {
  defaultContent: string;
  source: 'report' | 'chat' | 'topology' | 'papers' | 'manual';
  sourceLabel?: string;
  paperIds?: string[];
  children?: React.ReactNode;
  variant?: 'default' | 'icon';
}

export const AddToJournalPopover = ({
  defaultContent,
  source,
  sourceLabel,
  paperIds,
  children,
  variant = 'default',
}: AddToJournalPopoverProps) => {
  const { journals, recentJournals, appendToJournal, createJournal } = useJournals();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [search, setSearch] = useState('');
  const [content, setContent] = useState(defaultContent);
  const [isEditing, setIsEditing] = useState(false);

  // Update content when defaultContent changes
  useEffect(() => {
    setContent(defaultContent);
  }, [defaultContent]);

  // Reset state when popover opens
  useEffect(() => {
    if (isOpen) {
      setContent(defaultContent);
      setIsEditing(false);
      setSearch('');
    }
  }, [isOpen, defaultContent]);

  const filteredJournals = journals.filter(j =>
    j.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddToJournal = (journal: Journal) => {
    const finalContent = paperIds?.length 
      ? `${content || defaultContent}\n\n*Linked papers: ${paperIds.join(', ')}*`
      : content || defaultContent;
    
    appendToJournal(journal.id, finalContent, sourceLabel);
    toast({
      title: 'Added to journal',
      description: `Saved to "${journal.title}"`,
    });
    setIsOpen(false);
    setContent(defaultContent);
    setIsEditing(false);
  };

  const handleCreateAndAdd = (journal: { id: string }) => {
    const journalId = journal.id;
    setTimeout(() => {
      const journal = journals.find(j => j.id === journalId);
      if (journal) {
        handleAddToJournal(journal);
      }
    }, 50);
    setShowCreateDialog(false);
  };

  const handleQuickCreate = () => {
    if (!search.trim()) return;
    const journal = createJournal({
      title: search.trim(),
      icon: '📓',
    });
    handleAddToJournal(journal);
  };

  const defaultTrigger = variant === 'icon' ? (
    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
      <StickyNote className="w-4 h-4" />
    </Button>
  ) : (
    <Button variant="outline" size="sm" className="gap-1.5">
      <StickyNote className="w-3.5 h-3.5" />
      Save to journal
    </Button>
  );

  return (
    <>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          {children || defaultTrigger}
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start" sideOffset={5}>
          {/* Header */}
          <div className="p-3 border-b border-border">
            <h4 className="text-sm font-semibold text-foreground mb-2">Add to Journal</h4>
            
            {/* Content preview/edit */}
            {isEditing ? (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-24 p-2 rounded-lg bg-muted border border-border text-xs resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                autoFocus
              />
            ) : (
              <div 
                onClick={() => setIsEditing(true)}
                className="p-2 rounded-lg bg-muted/50 text-xs text-muted-foreground line-clamp-3 cursor-pointer hover:bg-muted transition-colors"
              >
                {content || defaultContent || 'No content selected'}
                <span className="text-primary ml-1">(click to edit)</span>
              </div>
            )}
          </div>

          {/* Search */}
          <div className="p-2 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search or create journal..."
                className="w-full pl-8 pr-3 py-2 rounded-lg bg-muted border-none text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Journal list */}
          <div className="max-h-64 overflow-y-auto">
            {/* Recent journals */}
            {!search && recentJournals.length > 0 && (
              <div className="p-2">
                <p className="text-xs text-muted-foreground px-2 py-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Recent
                </p>
                {recentJournals.map(journal => (
                  <button
                    key={journal.id}
                    onClick={() => handleAddToJournal(journal)}
                    className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-muted transition-colors text-left"
                  >
                    <span className="text-lg">{journal.icon}</span>
                    <span className="flex-1 text-sm text-foreground truncate">{journal.title}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            )}

            {/* All journals or search results */}
            {(search ? filteredJournals : journals.filter(j => !recentJournals.some(r => r.id === j.id))).length > 0 && (
              <div className={cn("p-2", !search && recentJournals.length > 0 && "border-t border-border")}>
                {!search && journals.filter(j => !recentJournals.some(r => r.id === j.id)).length > 0 && (
                  <p className="text-xs text-muted-foreground px-2 py-1">All Journals</p>
                )}
                {(search ? filteredJournals : journals.filter(j => !recentJournals.some(r => r.id === j.id))).map(journal => (
                  <button
                    key={journal.id}
                    onClick={() => handleAddToJournal(journal)}
                    className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-muted transition-colors text-left"
                  >
                    <span className="text-lg">{journal.icon}</span>
                    <span className="flex-1 text-sm text-foreground truncate">{journal.title}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            )}

            {/* Empty state - no journals */}
            {journals.length === 0 && (
              <div className="p-4 text-center">
                <p className="text-sm text-muted-foreground mb-3">No journals yet</p>
                <p className="text-xs text-muted-foreground">Create your first journal below</p>
              </div>
            )}

            {/* Empty state with quick create */}
            {filteredJournals.length === 0 && search && (
              <div className="p-4 text-center">
                <p className="text-sm text-muted-foreground mb-3">No journals found</p>
                <button
                  onClick={handleQuickCreate}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Create &quot;{search}&quot;
                </button>
              </div>
            )}
          </div>

          {/* Create new */}
          <div className="p-2 border-t border-border">
            <button
              onClick={() => setShowCreateDialog(true)}
              className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-muted transition-colors text-primary"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Create new journal</span>
            </button>
          </div>
        </PopoverContent>
      </Popover>

      <CreateJournalDialog
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onCreated={handleCreateAndAdd}
      />
    </>
  );
};
