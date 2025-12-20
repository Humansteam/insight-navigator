import React, { useRef, useEffect, useCallback } from 'react';
import { Journal } from '@/contexts/JournalsContext';
import { format } from 'date-fns';

interface JournalEditorProps {
  journal: Journal;
  content: string;
  onChange: (content: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
}

export const JournalEditor = ({
  journal,
  content,
  onChange,
  textareaRef,
}: JournalEditorProps) => {
  const internalRef = useRef<HTMLTextAreaElement>(null);
  const ref = textareaRef || internalRef;
  const isUserTyping = useRef(false);
  const lastContent = useRef(content);

  // Only update textarea value when content changes externally
  useEffect(() => {
    if (ref.current && !isUserTyping.current && content !== lastContent.current) {
      const cursorPos = ref.current.selectionStart;
      ref.current.value = content;
      ref.current.setSelectionRange(cursorPos, cursorPos);
    }
    lastContent.current = content;
  }, [content, ref]);

  // Initialize textarea with content
  useEffect(() => {
    if (ref.current) {
      ref.current.value = content;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [journal.id]);

  const handleInput = useCallback((e: React.FormEvent<HTMLTextAreaElement>) => {
    isUserTyping.current = true;
    onChange(e.currentTarget.value);
    setTimeout(() => {
      isUserTyping.current = false;
    }, 100);
  }, [onChange]);

  const formattedDate = format(new Date(journal.updatedAt), 'MMMM d, yyyy');

  return (
    <div className="flex-1 overflow-auto lovable-scrollbar">
      <div className="max-w-3xl mx-auto px-8 py-10">
        {/* Date - like Report */}
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">
          {formattedDate}
        </p>
        
        {/* Title - like Report text-4xl */}
        <h1 className="text-4xl font-semibold text-foreground mb-6">
          {journal.icon} {journal.title}
        </h1>
        
        {/* Textarea for content - text-base like Report paragraphs */}
        <textarea
          ref={ref}
          defaultValue={content}
          onInput={handleInput}
          placeholder="Start writing your journal..."
          className="w-full min-h-[500px] resize-none bg-transparent text-base text-foreground/90 leading-relaxed placeholder:text-muted-foreground focus:outline-none"
          spellCheck={false}
        />
      </div>
    </div>
  );
};
