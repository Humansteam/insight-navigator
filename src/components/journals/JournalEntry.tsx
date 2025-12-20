import { useState } from 'react';
import { format } from 'date-fns';
import { Trash2, Edit2, Check, X, FileText, MessageSquare, Network, BookOpen, Pencil, GripVertical } from 'lucide-react';
import { JournalEntry as JournalEntryType, useJournals } from '@/contexts/JournalsContext';
import { cn } from '@/lib/utils';

interface JournalEntryProps {
  entry: JournalEntryType;
}

const sourceIcons = {
  report: FileText,
  chat: MessageSquare,
  topology: Network,
  papers: BookOpen,
  manual: Pencil,
};

const sourceColors = {
  report: 'text-blue-500 bg-blue-500/10',
  chat: 'text-purple-500 bg-purple-500/10',
  topology: 'text-green-500 bg-green-500/10',
  papers: 'text-orange-500 bg-orange-500/10',
  manual: 'text-muted-foreground bg-muted',
};

export const JournalEntry = ({ entry }: JournalEntryProps) => {
  const { updateEntry, deleteEntry } = useJournals();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(entry.content);

  const SourceIcon = sourceIcons[entry.source];

  const handleSave = () => {
    updateEntry(entry.id, { content: editContent });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditContent(entry.content);
    setIsEditing(false);
  };

  return (
    <div className="group relative pl-6 pb-6 border-l-2 border-border/50 last:border-l-transparent">
      {/* Timeline dot */}
      <div className={cn(
        "absolute -left-[9px] top-0 w-4 h-4 rounded-full flex items-center justify-center",
        sourceColors[entry.source]
      )}>
        <SourceIcon className="w-2.5 h-2.5" />
      </div>

      {/* Entry card */}
      <div className="ml-4 p-4 rounded-xl bg-card/50 border border-border/50 hover:border-border transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className={cn(
              "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
              sourceColors[entry.source]
            )}>
              <SourceIcon className="w-3 h-3" />
              {entry.sourceLabel || entry.source}
            </span>
            <span className="text-xs text-muted-foreground">
              {format(entry.createdAt, 'MMM d, yyyy · HH:mm')}
            </span>
          </div>
          
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setIsEditing(true)}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => deleteEntry(entry.id)}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Content */}
        {isEditing ? (
          <div className="space-y-3">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full min-h-[120px] p-3 rounded-lg bg-background border border-border text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary font-mono"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={handleCancel}
                className="px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1.5 rounded-lg text-xs text-primary-foreground bg-primary hover:bg-primary/90 transition-colors flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
            {entry.content}
          </div>
        )}

        {/* Paper links */}
        {entry.paperIds && entry.paperIds.length > 0 && (
          <div className="mt-3 pt-3 border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              📄 Linked to {entry.paperIds.length} paper{entry.paperIds.length > 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
