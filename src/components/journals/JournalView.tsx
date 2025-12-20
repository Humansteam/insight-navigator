import { useState } from 'react';
import { format } from 'date-fns';
import { ArrowLeft, Edit2, Trash2, Plus, Download, MoreHorizontal, Check, X } from 'lucide-react';
import { Journal, useJournals } from '@/contexts/JournalsContext';
import { JournalEntry } from './JournalEntry';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface JournalViewProps {
  journal: Journal;
  onBack: () => void;
}

export const JournalView = ({ journal, onBack }: JournalViewProps) => {
  const { getJournalEntries, addEntry, updateJournal, deleteJournal } = useJournals();
  const { toast } = useToast();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState(journal.title);
  const [editIcon, setEditIcon] = useState(journal.icon);
  const [newNote, setNewNote] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  const entries = getJournalEntries(journal.id);

  const handleSaveTitle = () => {
    updateJournal(journal.id, { title: editTitle, icon: editIcon });
    setIsEditingTitle(false);
  };

  const handleAddManualNote = () => {
    if (!newNote.trim()) return;
    addEntry({
      journalId: journal.id,
      content: newNote,
      source: 'manual',
      sourceLabel: 'My Notes',
    });
    setNewNote('');
    setIsAddingNote(false);
    toast({ title: 'Note added', description: 'Your note has been added to the journal.' });
  };

  const handleExport = () => {
    const markdown = generateMarkdown();
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${journal.title.replace(/\s+/g, '-').toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Exported', description: 'Journal exported as Markdown file.' });
  };

  const generateMarkdown = () => {
    let md = `# ${journal.icon} ${journal.title}\n\n`;
    if (journal.description) {
      md += `> ${journal.description}\n\n`;
    }
    md += `---\n\n`;

    entries.forEach(entry => {
      md += `## From ${entry.sourceLabel || entry.source} · ${format(entry.createdAt, 'MMM d, yyyy')}\n\n`;
      md += `${entry.content}\n\n`;
      if (entry.paperIds?.length) {
        md += `*Linked to ${entry.paperIds.length} paper(s)*\n\n`;
      }
      md += `---\n\n`;
    });

    return md;
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this journal and all its entries?')) {
      deleteJournal(journal.id);
      onBack();
      toast({ title: 'Deleted', description: 'Journal has been deleted.' });
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          {isEditingTitle ? (
            <div className="flex-1 flex items-center gap-2">
              <input
                value={editIcon}
                onChange={(e) => setEditIcon(e.target.value)}
                className="w-12 text-center text-2xl bg-muted rounded-lg p-1"
                maxLength={2}
              />
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg bg-muted border border-border text-lg font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
                autoFocus
              />
              <button onClick={handleSaveTitle} className="p-2 text-primary hover:bg-primary/10 rounded-lg">
                <Check className="w-4 h-4" />
              </button>
              <button onClick={() => setIsEditingTitle(false)} className="p-2 text-muted-foreground hover:bg-muted rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex-1 flex items-center gap-2">
              <span className="text-2xl">{journal.icon}</span>
              <h1 className="text-xl font-semibold text-foreground">{journal.title}</h1>
              <button
                onClick={() => setIsEditingTitle(true)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors opacity-0 group-hover:opacity-100"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExport} className="gap-1.5">
              <Download className="w-3.5 h-3.5" />
              Export
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDelete} className="text-red-500 hover:text-red-600 hover:bg-red-500/10">
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {journal.description && (
          <p className="text-sm text-muted-foreground ml-11">{journal.description}</p>
        )}

        <div className="flex items-center gap-4 ml-11 mt-2 text-xs text-muted-foreground">
          <span>{entries.length} entries</span>
          <span>·</span>
          <span>Updated {format(journal.updatedAt, 'MMM d, yyyy')}</span>
        </div>
      </div>

      {/* Entries timeline */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl mx-auto">
          {entries.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No entries yet. Start adding insights!</p>
              <Button onClick={() => setIsAddingNote(true)} className="gap-1.5">
                <Plus className="w-4 h-4" />
                Add first note
              </Button>
            </div>
          ) : (
            <div className="space-y-0">
              {entries.map(entry => (
                <JournalEntry key={entry.id} entry={entry} />
              ))}
            </div>
          )}

          {/* Add note section */}
          {entries.length > 0 && (
            <div className="mt-6 pl-6">
              {isAddingNote ? (
                <div className="ml-4 p-4 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5">
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Write your thoughts..."
                    className="w-full min-h-[100px] p-3 rounded-lg bg-background border border-border text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                    autoFocus
                  />
                  <div className="flex justify-end gap-2 mt-3">
                    <Button variant="ghost" size="sm" onClick={() => setIsAddingNote(false)}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleAddManualNote} disabled={!newNote.trim()}>
                      Add note
                    </Button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsAddingNote(true)}
                  className="ml-4 w-full p-4 rounded-xl border-2 border-dashed border-border text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add your notes
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
