import { X, Sparkles, FileText, Trash2, StickyNote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataNode } from '@/types/morphik';
import { AddNotePopover } from '@/components/notebook/AddNotePopover';

interface SelectionActionBarProps {
  selectedNodes: DataNode[];
  onClearSelection: () => void;
  onSummarize: () => void;
  onExport: () => void;
}

export const SelectionActionBar = ({
  selectedNodes,
  onClearSelection,
  onSummarize,
  onExport,
}: SelectionActionBarProps) => {
  if (selectedNodes.length === 0) return null;

  const noteContent = `Selection of ${selectedNodes.length} papers:\n\n${selectedNodes.map(p => `• ${p.title} (${p.year})`).join('\n')}`;
  const paperIds = selectedNodes.map(p => p.id);

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-card/95 backdrop-blur-md border border-border rounded-xl px-4 py-3 shadow-xl z-20 animate-fade-in">
      <div className="flex items-center gap-4">
        {/* Count */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-sm font-semibold text-primary">{selectedNodes.length}</span>
          </div>
          <span className="text-sm text-muted-foreground">papers selected</span>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-border" />

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="default"
            size="sm"
            className="gap-1.5"
            onClick={onSummarize}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Summarize
          </Button>
          
          <AddNotePopover
            trigger={
              <Button variant="outline" size="sm" className="gap-1.5">
                <StickyNote className="w-3.5 h-3.5" />
                Save to notes
              </Button>
            }
            defaultContent={noteContent}
            source="topology"
            sourceLabel="Graph Selection"
            paperIds={paperIds}
          />
          
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={onExport}
          >
            <FileText className="w-3.5 h-3.5" />
            Export
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground hover:text-destructive"
            onClick={onClearSelection}
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </Button>
        </div>

        {/* Close */}
        <button
          onClick={onClearSelection}
          className="ml-2 p-1 rounded-full hover:bg-muted transition-colors"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
};
