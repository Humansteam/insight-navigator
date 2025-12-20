import { useState } from 'react';
import { X } from 'lucide-react';
import { useJournals } from '@/contexts/JournalsContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CreateJournalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (journalId: string) => void;
}

const emojiSuggestions = ['📓', '🔬', '💡', '🧬', '⚡', '🎯', '📊', '🌟', '🔍', '💎', '🚀', '📚'];

export const CreateJournalDialog = ({ isOpen, onClose, onCreated }: CreateJournalDialogProps) => {
  const { createJournal } = useJournals();
  const [title, setTitle] = useState('');
  const [icon, setIcon] = useState('📓');

  if (!isOpen) return null;

  const handleCreate = () => {
    if (!title.trim()) return;
    const journal = createJournal({
      title: title.trim(),
      icon,
    });
    onCreated?.(journal.id);
    setTitle('');
    setIcon('📓');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="relative w-full max-w-md mx-4 bg-card border border-border rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Create New Journal</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Icon selector */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Icon</label>
            <div className="flex flex-wrap gap-2">
              {emojiSuggestions.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => setIcon(emoji)}
                  className={cn(
                    "w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all",
                    icon === emoji
                      ? "bg-primary/20 ring-2 ring-primary"
                      : "bg-muted hover:bg-muted/80"
                  )}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., CRISPR Gene Therapy Research"
              className="w-full px-3 py-2.5 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-4 border-t border-border">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!title.trim()}>
            Create Journal
          </Button>
        </div>
      </div>
    </div>
  );
};
