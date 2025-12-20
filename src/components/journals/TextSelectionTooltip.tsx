import { useState, useEffect, useCallback, RefObject } from 'react';
import { StickyNote, Plus, ChevronRight, Search, Clock } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useJournals, Journal } from '@/contexts/JournalsContext';
import { CreateJournalDialog } from './CreateJournalDialog';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

interface TextSelectionTooltipProps {
  containerRef: RefObject<HTMLElement>;
  source: 'report' | 'chat' | 'topology' | 'papers' | 'manual';
  sourceLabel?: string;
}

export const TextSelectionTooltip = ({ containerRef, source, sourceLabel }: TextSelectionTooltipProps) => {
  const { journals, recentJournals, addEntry, createJournal } = useJournals();
  const { toast } = useToast();
  const [selectedText, setSelectedText] = useState('');
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [search, setSearch] = useState('');

  const handleSelection = useCallback(() => {
    // Don't update selection if popover is open
    if (isOpen) return;

    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !containerRef.current) {
      setSelectedText('');
      setPosition(null);
      return;
    }

    const text = selection.toString().trim();
    if (!text || text.length < 10) {
      setSelectedText('');
      setPosition(null);
      return;
    }

    // Check if selection is within container
    const range = selection.getRangeAt(0);
    const container = containerRef.current;
    if (!container.contains(range.commonAncestorContainer)) {
      setSelectedText('');
      setPosition(null);
      return;
    }

    // Get position
    const rect = range.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    setSelectedText(text);
    setPosition({
      top: rect.top - containerRect.top - 40,
      left: rect.left - containerRect.left + rect.width / 2,
    });
  }, [containerRef, isOpen]);

  useEffect(() => {
    document.addEventListener('mouseup', handleSelection);
    return () => document.removeEventListener('mouseup', handleSelection);
  }, [handleSelection]);

  const filteredJournals = journals.filter(j =>
    j.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddToJournal = (journal: Journal) => {
    addEntry({
      journalId: journal.id,
      content: selectedText,
      source,
      sourceLabel,
    });
    toast({
      title: 'Added to journal',
      description: `Saved to "${journal.title}"`,
    });
    setIsOpen(false);
    setSelectedText('');
    setPosition(null);
    setSearch('');
    // Clear selection
    window.getSelection()?.removeAllRanges();
  };

  const handleQuickCreate = () => {
    if (!search.trim()) return;
    const journal = createJournal({
      title: search.trim(),
      icon: '📓',
    });
    handleAddToJournal(journal);
  };

  const handleCreateAndAdd = (journalId: string) => {
    setTimeout(() => {
      const journal = journals.find(j => j.id === journalId);
      if (journal) {
        handleAddToJournal(journal);
      }
    }, 0);
    setShowCreateDialog(false);
  };

  if (!selectedText || !position) return null;

  return (
    <>
      <div
        className="absolute z-50 animate-in fade-in zoom-in-95 duration-150"
        style={{
          top: position.top,
          left: position.left,
          transform: 'translateX(-50%)',
        }}
      >
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button 
              size="sm" 
              className="gap-1.5 shadow-lg"
              onClick={() => setIsOpen(true)}
            >
              <StickyNote className="w-3.5 h-3.5" />
              Add to Journal
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="center" sideOffset={5}>
            {/* Header */}
            <div className="p-3 border-b border-border">
              <h4 className="text-sm font-semibold text-foreground mb-2">Add to Journal</h4>
              <div className="p-2 rounded-lg bg-muted/50 text-xs text-muted-foreground line-clamp-3">
                {selectedText}
              </div>
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
            <div className="max-h-48 overflow-y-auto">
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

              {/* All journals */}
              {(search ? filteredJournals : journals.filter(j => !recentJournals.some(r => r.id === j.id))).length > 0 && (
                <div className="p-2 border-t border-border">
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

              {/* Empty state */}
              {journals.length === 0 && (
                <div className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">No journals yet</p>
                </div>
              )}

              {/* Quick create */}
              {filteredJournals.length === 0 && search && (
                <div className="p-4 text-center">
                  <button
                    onClick={handleQuickCreate}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Create "{search}"
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
      </div>

      <CreateJournalDialog
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onCreated={handleCreateAndAdd}
      />
    </>
  );
};
