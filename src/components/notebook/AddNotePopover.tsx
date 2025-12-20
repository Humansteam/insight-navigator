import { useState } from 'react';
import { X, Tag, Palette } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useNotes, Note } from '@/contexts/NotesContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface AddNotePopoverProps {
  trigger: React.ReactNode;
  defaultContent?: string;
  source: Note['source'];
  sourceLabel?: string;
  paperIds?: string[];
  onClose?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const colors: { id: Note['color']; label: string; class: string }[] = [
  { id: undefined, label: 'Default', class: 'bg-muted' },
  { id: 'yellow', label: 'Yellow', class: 'bg-yellow-500' },
  { id: 'blue', label: 'Blue', class: 'bg-blue-500' },
  { id: 'green', label: 'Green', class: 'bg-green-500' },
  { id: 'purple', label: 'Purple', class: 'bg-purple-500' },
  { id: 'red', label: 'Red', class: 'bg-red-500' },
];

export const AddNotePopover = ({
  trigger,
  defaultContent = '',
  source,
  sourceLabel,
  paperIds,
  onClose,
  open,
  onOpenChange,
}: AddNotePopoverProps) => {
  const { addNote, allTags } = useNotes();
  const [content, setContent] = useState(defaultContent);
  const [tagInput, setTagInput] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState<Note['color']>(undefined);
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);

  const resetForm = () => {
    setContent(defaultContent);
    setTagInput('');
    setSelectedTags([]);
    setSelectedColor(undefined);
  };

  const handleSave = () => {
    if (!content.trim()) {
      toast.error('Note content cannot be empty');
      return;
    }

    const finalTags = [...selectedTags];
    if (tagInput.trim()) {
      tagInput.split(',').forEach(t => {
        const trimmed = t.trim();
        if (trimmed && !finalTags.includes(trimmed)) {
          finalTags.push(trimmed);
        }
      });
    }

    addNote({
      content: content.trim(),
      source,
      sourceLabel,
      tags: finalTags,
      paperIds,
      color: selectedColor,
    });

    toast.success('Note added to notebook');
    resetForm();
    onClose?.();
    onOpenChange?.(false);
  };

  const handleTagSelect = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
    setTagInput('');
    setShowTagSuggestions(false);
  };

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  const filteredSuggestions = allTags.filter(
    tag => tag.toLowerCase().includes(tagInput.toLowerCase()) && !selectedTags.includes(tag)
  );

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end" sideOffset={8}>
        <div className="p-4 space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-foreground">Add to Notebook</h4>
            <span className="text-xs text-muted-foreground capitalize">{sourceLabel || source}</span>
          </div>

          {/* Content */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note..."
            className="w-full min-h-[100px] p-2 rounded-lg bg-muted/50 border border-border text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
          />

          {/* Tags */}
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1">
              {selectedTags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs"
                >
                  {tag}
                  <button onClick={() => handleRemoveTag(tag)} className="hover:text-primary/70">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="relative">
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-muted/50 border border-border">
                <Tag className="w-3.5 h-3.5 text-muted-foreground" />
                <input
                  value={tagInput}
                  onChange={(e) => {
                    setTagInput(e.target.value);
                    setShowTagSuggestions(true);
                  }}
                  onFocus={() => setShowTagSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowTagSuggestions(false), 150)}
                  placeholder="Add tags..."
                  className="flex-1 bg-transparent text-xs focus:outline-none placeholder:text-muted-foreground"
                />
              </div>
              {showTagSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 p-1 rounded-lg bg-popover border border-border shadow-lg z-10">
                  {filteredSuggestions.slice(0, 5).map(tag => (
                    <button
                      key={tag}
                      onClick={() => handleTagSelect(tag)}
                      className="w-full px-2 py-1 text-left text-xs text-foreground hover:bg-muted rounded"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Color picker */}
          <div className="flex items-center gap-2">
            <Palette className="w-3.5 h-3.5 text-muted-foreground" />
            <div className="flex gap-1">
              {colors.map(color => (
                <button
                  key={color.id || 'default'}
                  onClick={() => setSelectedColor(color.id)}
                  className={cn(
                    "w-5 h-5 rounded-full transition-all",
                    color.class,
                    selectedColor === color.id && "ring-2 ring-primary ring-offset-1 ring-offset-background"
                  )}
                  title={color.label}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => {
                resetForm();
                onClose?.();
                onOpenChange?.(false);
              }}
              className="px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1.5 rounded-lg text-xs bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Save Note
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
