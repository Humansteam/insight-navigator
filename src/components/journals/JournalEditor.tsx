import React, { useRef, useEffect, useCallback } from 'react';
import { Journal } from '@/contexts/JournalsContext';

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
  // Prevent cursor jump by using uncontrolled input with manual sync
  const internalRef = useRef<HTMLTextAreaElement>(null);
  const ref = textareaRef || internalRef;
  const isUserTyping = useRef(false);
  const lastContent = useRef(content);

  // Only update textarea value when content changes externally
  useEffect(() => {
    if (ref.current && !isUserTyping.current && content !== lastContent.current) {
      const cursorPos = ref.current.selectionStart;
      ref.current.value = content;
      // Restore cursor position
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
    // Reset typing flag after a short delay
    setTimeout(() => {
      isUserTyping.current = false;
    }, 100);
  }, [onChange]);

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-background">
      <textarea
        ref={ref}
        defaultValue={content}
        onInput={handleInput}
        placeholder="Start writing..."
        className="flex-1 w-full p-6 resize-none bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none font-mono text-sm leading-relaxed"
        spellCheck={false}
      />
    </div>
  );
};
