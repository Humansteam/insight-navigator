import React, { useState, useRef, useCallback, useEffect } from 'react';
import { FileText } from 'lucide-react';
import { useJournals } from '@/contexts/JournalsContext';
import { useToast } from '@/hooks/use-toast';
import { JournalsSidebar } from './JournalsSidebar';
import { JournalTabs } from './JournalTabs';
import { JournalEditor } from './JournalEditor';
import { JournalPreview } from './JournalPreview';
import { FormatToolbar } from './FormatToolbar';
import { CreateJournalDialog } from './CreateJournalDialog';

export const JournalsWorkspace = () => {
  const { journals, updateJournal, getJournalById, createJournal } = useJournals();
  const { toast } = useToast();
  
  const [openTabIds, setOpenTabIds] = useState<string[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  
  // Content state per journal to avoid re-renders
  const [contents, setContents] = useState<Record<string, string>>({});
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const activeJournal = activeTabId ? getJournalById(activeTabId) : null;
  const openTabs = openTabIds.map(id => getJournalById(id)).filter(Boolean) as NonNullable<ReturnType<typeof getJournalById>>[];

  // Initialize content when journal is opened
  useEffect(() => {
    if (activeJournal && contents[activeJournal.id] === undefined) {
      setContents(prev => ({ ...prev, [activeJournal.id]: activeJournal.content }));
    }
  }, [activeJournal, contents]);

  // Auto-save with debounce
  const handleContentChange = useCallback((newContent: string) => {
    if (!activeTabId) return;
    
    setContents(prev => ({ ...prev, [activeTabId]: newContent }));
    
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      updateJournal(activeTabId, { content: newContent });
    }, 800);
  }, [activeTabId, updateJournal]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const handleSelectJournal = useCallback((id: string) => {
    // Add to tabs if not already open
    if (!openTabIds.includes(id)) {
      setOpenTabIds(prev => [...prev, id]);
    }
    setActiveTabId(id);
    setIsPreview(false);
  }, [openTabIds]);

  const handleCloseTab = useCallback((id: string) => {
    // Save before closing
    if (contents[id] !== undefined) {
      updateJournal(id, { content: contents[id] });
    }
    
    setOpenTabIds(prev => prev.filter(tabId => tabId !== id));
    
    // If closing active tab, switch to another
    if (activeTabId === id) {
      const remainingTabs = openTabIds.filter(tabId => tabId !== id);
      setActiveTabId(remainingTabs.length > 0 ? remainingTabs[remainingTabs.length - 1] : null);
    }
    
    // Clean up content
    setContents(prev => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  }, [activeTabId, openTabIds, contents, updateJournal]);

  const handleCreateNew = useCallback(() => {
    setShowCreateDialog(true);
  }, []);

  const handleJournalCreated = useCallback((journal: { id: string }) => {
    setShowCreateDialog(false);
    handleSelectJournal(journal.id);
  }, [handleSelectJournal]);

  const insertFormatting = useCallback((before: string, after?: string) => {
    const textarea = textareaRef.current;
    if (!textarea || !activeTabId) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentContent = contents[activeTabId] || '';
    const selectedText = currentContent.substring(start, end);
    
    const newText = before + selectedText + (after || '');
    const newContent = currentContent.substring(0, start) + newText + currentContent.substring(end);
    
    handleContentChange(newContent);
    
    // Restore focus and selection
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length + (after?.length || 0);
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  }, [activeTabId, contents, handleContentChange]);

  const handleExport = useCallback(() => {
    if (!activeJournal) return;
    
    const currentContent = contents[activeJournal.id] || activeJournal.content;
    const blob = new Blob([currentContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeJournal.title.replace(/[^a-z0-9]/gi, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({ title: 'Exported', description: `${activeJournal.title}.md downloaded` });
  }, [activeJournal, contents, toast]);

  const wordCount = activeTabId && contents[activeTabId] 
    ? contents[activeTabId].split(/\s+/).filter(w => w.length > 0).length 
    : 0;

  return (
    <div className="h-full flex bg-background">
      {/* Left Sidebar - same width as chat panel (w-96) */}
      <JournalsSidebar
        journals={journals}
        activeJournalId={activeTabId}
        onSelectJournal={handleSelectJournal}
        onCreateNew={handleCreateNew}
      />

      {/* Right content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Tabs - starts after sidebar */}
        <JournalTabs
          openTabs={openTabs}
          activeTabId={activeTabId}
          onSelectTab={setActiveTabId}
          onCloseTab={handleCloseTab}
        />

        {/* Editor + Toolbar */}
        <div className="flex-1 flex min-h-0">
          {activeJournal ? (
            <>
              {isPreview ? (
                <JournalPreview content={contents[activeJournal.id] || ''} />
              ) : (
                <JournalEditor
                  journal={activeJournal}
                  content={contents[activeJournal.id] || ''}
                  onChange={handleContentChange}
                  textareaRef={textareaRef}
                />
              )}

              <FormatToolbar
                textareaRef={textareaRef}
                onInsertFormat={insertFormatting}
                isPreview={isPreview}
                onTogglePreview={() => setIsPreview(prev => !prev)}
                wordCount={wordCount}
                onExport={handleExport}
              />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center space-y-2">
                <FileText className="h-12 w-12 mx-auto opacity-50" />
                <p className="text-sm">Select a journal or create a new one</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <CreateJournalDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onCreated={handleJournalCreated}
      />
    </div>
  );
};
