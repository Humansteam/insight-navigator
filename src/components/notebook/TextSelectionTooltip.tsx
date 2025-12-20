import { useState, useEffect, useCallback } from 'react';
import { StickyNote } from 'lucide-react';
import { AddNotePopover } from './AddNotePopover';
import { Note } from '@/contexts/NotesContext';

interface TextSelectionTooltipProps {
  containerRef: React.RefObject<HTMLElement>;
  source: Note['source'];
  sourceLabel?: string;
}

export const TextSelectionTooltip = ({ containerRef, source, sourceLabel }: TextSelectionTooltipProps) => {
  const [selectedText, setSelectedText] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleMouseUp = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      if (!isPopoverOpen) {
        setSelectedText('');
        setTooltipPosition(null);
      }
      return;
    }

    const text = selection.toString().trim();
    if (!text || text.length < 10) {
      return;
    }

    // Check if selection is within our container
    const range = selection.getRangeAt(0);
    const container = containerRef.current;
    if (!container || !container.contains(range.commonAncestorContainer)) {
      return;
    }

    // Get position for tooltip
    const rect = range.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    setSelectedText(text);
    setTooltipPosition({
      x: rect.left - containerRect.left + rect.width / 2,
      y: rect.top - containerRect.top - 8,
    });
  }, [containerRef, isPopoverOpen]);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (!isPopoverOpen) {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-selection-tooltip]')) {
        setSelectedText('');
        setTooltipPosition(null);
      }
    }
  }, [isPopoverOpen]);

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleMouseUp, handleClickOutside]);

  if (!tooltipPosition || !selectedText) {
    return null;
  }

  return (
    <div
      data-selection-tooltip
      className="absolute z-50 animate-in fade-in-0 zoom-in-95"
      style={{
        left: tooltipPosition.x,
        top: tooltipPosition.y,
        transform: 'translate(-50%, -100%)',
      }}
    >
      <AddNotePopover
        trigger={
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border shadow-lg text-sm font-medium text-foreground hover:bg-muted transition-colors">
            <StickyNote className="w-4 h-4 text-primary" />
            Add to notes
          </button>
        }
        defaultContent={selectedText}
        source={source}
        sourceLabel={sourceLabel}
        open={isPopoverOpen}
        onOpenChange={(open) => {
          setIsPopoverOpen(open);
          if (!open) {
            setSelectedText('');
            setTooltipPosition(null);
          }
        }}
        onClose={() => {
          setSelectedText('');
          setTooltipPosition(null);
          window.getSelection()?.removeAllRanges();
        }}
      />
    </div>
  );
};
