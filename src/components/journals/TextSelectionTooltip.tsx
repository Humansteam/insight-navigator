import { useState, useEffect, useCallback, RefObject } from 'react';
import { StickyNote } from 'lucide-react';
import { AddToJournalPopover } from './AddToJournalPopover';

interface TextSelectionTooltipProps {
  containerRef: RefObject<HTMLElement>;
  source: 'report' | 'chat' | 'topology' | 'papers' | 'manual';
  sourceLabel?: string;
}

export const TextSelectionTooltip = ({ containerRef, source, sourceLabel }: TextSelectionTooltipProps) => {
  const [selectedText, setSelectedText] = useState('');
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

  const handleSelection = useCallback(() => {
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
  }, [containerRef]);

  useEffect(() => {
    document.addEventListener('selectionchange', handleSelection);
    return () => document.removeEventListener('selectionchange', handleSelection);
  }, [handleSelection]);

  if (!selectedText || !position) return null;

  return (
    <div
      className="absolute z-50 animate-in fade-in zoom-in-95 duration-150"
      style={{
        top: position.top,
        left: position.left,
        transform: 'translateX(-50%)',
      }}
    >
      <AddToJournalPopover
        trigger={
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium shadow-lg hover:bg-primary/90 transition-colors">
            <StickyNote className="w-3.5 h-3.5" />
            Add to Journal
          </button>
        }
        defaultContent={selectedText}
        source={source}
        sourceLabel={sourceLabel}
      />
    </div>
  );
};
