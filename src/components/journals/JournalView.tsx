import { useState, useEffect, useRef, useCallback } from 'react';
import { format } from 'date-fns';
import { 
  ArrowLeft, Edit2, Trash2, Download, Check, X, 
  Bold, Italic, Heading1, Heading2, Heading3, List, ListOrdered, 
  Quote, Code, Link2, Minus, Eye, Pencil
} from 'lucide-react';
import { Journal, useJournals } from '@/contexts/JournalsContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface JournalViewProps {
  journal: Journal;
  onBack: () => void;
}

export const JournalView = ({ journal, onBack }: JournalViewProps) => {
  const { updateJournal, deleteJournal, getJournalById } = useJournals();
  const { toast } = useToast();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState(journal.title);
  const [editIcon, setEditIcon] = useState(journal.icon);
  const [content, setContent] = useState(journal.content);
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync content when journal updates from external source
  useEffect(() => {
    const currentJournal = getJournalById(journal.id);
    if (currentJournal && currentJournal.content !== content) {
      setContent(currentJournal.content);
    }
  }, [journal.id, getJournalById]);

  // Auto-save with debounce
  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
    setIsSaving(true);
    
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      updateJournal(journal.id, { content: newContent });
      setIsSaving(false);
    }, 500);
  }, [journal.id, updateJournal]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        // Save immediately on unmount
        updateJournal(journal.id, { content });
      }
    };
  }, [journal.id, content, updateJournal]);

  const handleSaveTitle = () => {
    updateJournal(journal.id, { title: editTitle, icon: editIcon });
    setIsEditingTitle(false);
  };

  const handleExport = () => {
    const markdown = `# ${journal.icon} ${journal.title}\n\n${content}`;
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${journal.title.replace(/\s+/g, '-').toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Exported', description: 'Journal exported as Markdown file.' });
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this journal?')) {
      deleteJournal(journal.id);
      onBack();
      toast({ title: 'Deleted', description: 'Journal has been deleted.' });
    }
  };

  // Insert markdown formatting
  const insertFormatting = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    const newContent = 
      content.substring(0, start) + 
      before + selectedText + after + 
      content.substring(end);
    
    handleContentChange(newContent);
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length + after.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const toolbarButtons = [
    { icon: Heading1, action: () => insertFormatting('# '), title: 'Heading 1' },
    { icon: Heading2, action: () => insertFormatting('## '), title: 'Heading 2' },
    { icon: Heading3, action: () => insertFormatting('### '), title: 'Heading 3' },
    { divider: true },
    { icon: Bold, action: () => insertFormatting('**', '**'), title: 'Bold' },
    { icon: Italic, action: () => insertFormatting('*', '*'), title: 'Italic' },
    { icon: Code, action: () => insertFormatting('`', '`'), title: 'Code' },
    { divider: true },
    { icon: List, action: () => insertFormatting('- '), title: 'Bullet List' },
    { icon: ListOrdered, action: () => insertFormatting('1. '), title: 'Numbered List' },
    { icon: Quote, action: () => insertFormatting('> '), title: 'Quote' },
    { divider: true },
    { icon: Link2, action: () => insertFormatting('[', '](url)'), title: 'Link' },
    { icon: Minus, action: () => insertFormatting('\n---\n'), title: 'Divider' },
  ];

  // Simple markdown to HTML renderer
  const renderMarkdown = (md: string) => {
    if (!md) return '<p class="text-muted-foreground">Start writing...</p>';
    
    let html = md
      // Escape HTML
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      // Headers
      .replace(/^### (.*)$/gm, '<h3 class="text-lg font-semibold mt-6 mb-2">$1</h3>')
      .replace(/^## (.*)$/gm, '<h2 class="text-xl font-semibold mt-8 mb-3">$1</h2>')
      .replace(/^# (.*)$/gm, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
      // Bold and italic
      .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // Code
      .replace(/`(.+?)`/g, '<code class="px-1.5 py-0.5 rounded bg-muted text-sm font-mono">$1</code>')
      // Horizontal rule
      .replace(/^---$/gm, '<hr class="my-6 border-border" />')
      // Blockquote
      .replace(/^&gt; (.*)$/gm, '<blockquote class="border-l-4 border-primary/50 pl-4 italic text-muted-foreground my-4">$1</blockquote>')
      // Lists
      .replace(/^- (.*)$/gm, '<li class="ml-4">$1</li>')
      .replace(/^\d+\. (.*)$/gm, '<li class="ml-4 list-decimal">$1</li>')
      // Links
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-primary hover:underline" target="_blank">$1</a>')
      // Paragraphs
      .replace(/\n\n/g, '</p><p class="my-3">')
      .replace(/\n/g, '<br />');
    
    return `<p class="my-3">${html}</p>`;
  };

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          {isEditingTitle ? (
            <div className="flex items-center gap-2">
              <input
                value={editIcon}
                onChange={(e) => setEditIcon(e.target.value)}
                className="w-10 text-center text-xl bg-muted rounded-lg p-1"
                maxLength={2}
              />
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-muted border border-border font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
              />
              <button onClick={handleSaveTitle} className="p-1.5 text-primary hover:bg-primary/10 rounded-lg">
                <Check className="w-4 h-4" />
              </button>
              <button onClick={() => setIsEditingTitle(false)} className="p-1.5 text-muted-foreground hover:bg-muted rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsEditingTitle(true)}
              className="flex items-center gap-2 hover:bg-muted px-2 py-1 rounded-lg transition-colors group"
            >
              <span className="text-xl">{journal.icon}</span>
              <span className="font-medium text-foreground">{journal.title}</span>
              <Edit2 className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Save status */}
          <span className="text-xs text-muted-foreground">
            {isSaving ? 'Saving...' : 'Saved'}
          </span>
          
          {/* Preview toggle */}
          <Button 
            variant={isPreview ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setIsPreview(!isPreview)}
            className="gap-1.5"
          >
            {isPreview ? <Pencil className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {isPreview ? 'Edit' : 'Preview'}
          </Button>
          
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-1.5">
            <Download className="w-3.5 h-3.5" />
            Export
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDelete} className="text-red-500 hover:text-red-600 hover:bg-red-500/10">
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      {!isPreview && (
        <div className="flex items-center gap-1 px-4 py-2 border-b border-border bg-muted/30">
          {toolbarButtons.map((btn, i) => 
            btn.divider ? (
              <div key={i} className="w-px h-5 bg-border mx-1" />
            ) : (
              <button
                key={i}
                onClick={btn.action}
                title={btn.title}
                className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                {btn.icon && <btn.icon className="w-4 h-4" />}
              </button>
            )
          )}
        </div>
      )}

      {/* Editor / Preview */}
      <div className="flex-1 overflow-auto">
        {isPreview ? (
          <div className="max-w-3xl mx-auto px-8 py-6">
            <div 
              className="prose prose-sm dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
            />
          </div>
        ) : (
          <div className="h-full flex flex-col">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="Start writing your research notes..."
              className="flex-1 w-full max-w-3xl mx-auto px-8 py-6 bg-transparent text-foreground text-base leading-relaxed resize-none focus:outline-none font-mono"
              spellCheck={false}
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-border text-xs text-muted-foreground">
        <span>Updated {format(journal.updatedAt, 'MMM d, yyyy HH:mm')}</span>
        <span>{wordCount} words</span>
      </div>
    </div>
  );
};
