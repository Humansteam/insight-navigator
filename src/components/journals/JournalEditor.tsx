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

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-background">
      {/* Title bar */}
      <div className="px-12 pt-8 pb-2">
        <div className="text-xs text-muted-foreground mb-2">{journal.icon} {journal.title}</div>
        <h1 className="text-3xl font-semibold text-foreground">{journal.title}</h1>
      </div>
      
      {/* Editor area */}
      <div className="flex-1 px-12 pb-8">
        <textarea
          ref={ref}
          defaultValue={content}
          onInput={handleInput}
          placeholder="Start writing..."
          className="w-full h-full resize-none bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-base leading-relaxed"
          spellCheck={false}
        />
      </div>
    </div>
  );
};
