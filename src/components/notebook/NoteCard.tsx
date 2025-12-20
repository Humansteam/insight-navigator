import { useState } from 'react';
import { format } from 'date-fns';
import { Trash2, Edit2, Check, X, Tag, FileText, MessageSquare, Network, BookOpen, Pencil } from 'lucide-react';
import { Note, useNotes } from '@/contexts/NotesContext';
import { cn } from '@/lib/utils';

interface NoteCardProps {
  note: Note;
  compact?: boolean;
}

const sourceIcons = {
  report: FileText,
  chat: MessageSquare,
  topology: Network,
  papers: BookOpen,
  manual: Pencil,
};

const colorClasses = {
  yellow: 'bg-yellow-500/10 border-yellow-500/30',
  blue: 'bg-blue-500/10 border-blue-500/30',
  green: 'bg-green-500/10 border-green-500/30',
  purple: 'bg-purple-500/10 border-purple-500/30',
  red: 'bg-red-500/10 border-red-500/30',
};

export const NoteCard = ({ note, compact = false }: NoteCardProps) => {
  const { updateNote, deleteNote } = useNotes();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(note.content);
  const [editTags, setEditTags] = useState(note.tags.join(', '));

  const SourceIcon = sourceIcons[note.source];

  const handleSave = () => {
    updateNote(note.id, {
      content: editContent,
      tags: editTags.split(',').map(t => t.trim()).filter(Boolean),
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditContent(note.content);
    setEditTags(note.tags.join(', '));
    setIsEditing(false);
  };

  if (compact) {
    return (
      <div className={cn(
        "p-2 rounded-lg border text-xs",
        note.color ? colorClasses[note.color] : "bg-muted/30 border-border"
      )}>
        <p className="text-foreground line-clamp-2">{note.content}</p>
        <div className="flex items-center gap-1 mt-1 text-muted-foreground">
          <SourceIcon className="w-3 h-3" />
          <span>{format(note.createdAt, 'MMM d')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "p-4 rounded-xl border transition-all group",
      note.color ? colorClasses[note.color] : "bg-card border-border hover:border-primary/30"
    )}>
      {isEditing ? (
        <div className="space-y-3">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full min-h-[100px] p-2 rounded-lg bg-background border border-border text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <input
            value={editTags}
            onChange={(e) => setEditTags(e.target.value)}
            placeholder="Tags (comma separated)"
            className="w-full px-2 py-1.5 rounded-lg bg-background border border-border text-xs focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={handleCancel}
              className="px-2 py-1 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <button
              onClick={handleSave}
              className="px-2 py-1 rounded-md text-xs text-primary hover:bg-primary/10 transition-colors"
            >
              <Check className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <SourceIcon className="w-4 h-4" />
              <span className="text-xs capitalize">{note.sourceLabel || note.source}</span>
              <span className="text-xs">•</span>
              <span className="text-xs">{format(note.createdAt, 'MMM d, yyyy HH:mm')}</span>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => deleteNote(note.id)}
                className="p-1 rounded text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
            {note.content}
          </p>

          {/* Tags */}
          {note.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {note.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Paper links */}
          {note.paperIds && note.paperIds.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border/50">
              <p className="text-xs text-muted-foreground">
                Linked to {note.paperIds.length} paper{note.paperIds.length > 1 ? 's' : ''}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
