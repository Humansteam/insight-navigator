import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface Journal {
  id: string;
  title: string;
  icon: string; // emoji
  content: string; // markdown content
  createdAt: Date;
  updatedAt: Date;
}

interface JournalsContextType {
  journals: Journal[];
  createJournal: (journal: Omit<Journal, 'id' | 'createdAt' | 'updatedAt' | 'content'> & { content?: string }) => Journal;
  updateJournal: (id: string, updates: Partial<Omit<Journal, 'id' | 'createdAt'>>) => void;
  deleteJournal: (id: string) => void;
  appendToJournal: (id: string, content: string, sourceLabel?: string) => void;
  getJournalById: (id: string) => Journal | undefined;
  recentJournals: Journal[];
}

const JournalsContext = createContext<JournalsContextType | null>(null);

const JOURNALS_STORAGE_KEY = 'research-journals-v2';

export const JournalsProvider = ({ children }: { children: React.ReactNode }) => {
  const [journals, setJournals] = useState<Journal[]>(() => {
    try {
      const stored = localStorage.getItem(JOURNALS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.map((j: Journal) => ({
          ...j,
          createdAt: new Date(j.createdAt),
          updatedAt: new Date(j.updatedAt),
        }));
      }
    } catch (e) {
      console.error('Failed to parse stored journals:', e);
    }
    return [];
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(JOURNALS_STORAGE_KEY, JSON.stringify(journals));
  }, [journals]);

  const createJournal = useCallback((journalData: Omit<Journal, 'id' | 'createdAt' | 'updatedAt' | 'content'> & { content?: string }): Journal => {
    const now = new Date();
    const newJournal: Journal = {
      title: journalData.title,
      icon: journalData.icon,
      content: journalData.content || '',
      id: `journal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
      updatedAt: now,
    };
    setJournals(prev => [newJournal, ...prev]);
    return newJournal;
  }, []);

  const updateJournal = useCallback((id: string, updates: Partial<Omit<Journal, 'id' | 'createdAt'>>) => {
    setJournals(prev => prev.map(journal => 
      journal.id === id 
        ? { ...journal, ...updates, updatedAt: new Date() }
        : journal
    ));
  }, []);

  const deleteJournal = useCallback((id: string) => {
    setJournals(prev => prev.filter(j => j.id !== id));
  }, []);

  const appendToJournal = useCallback((id: string, content: string, sourceLabel?: string) => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    const separator = sourceLabel 
      ? `\n\n---\n\n**From ${sourceLabel}** · ${dateStr} ${timeStr}\n\n`
      : '\n\n';
    
    setJournals(prev => prev.map(journal => 
      journal.id === id 
        ? { 
            ...journal, 
            content: journal.content + separator + content,
            updatedAt: now 
          }
        : journal
    ));
  }, []);

  const getJournalById = useCallback((id: string) => {
    return journals.find(j => j.id === id);
  }, [journals]);

  // Recent journals (last 5 updated)
  const recentJournals = React.useMemo(() => {
    return [...journals]
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, 5);
  }, [journals]);

  return (
    <JournalsContext.Provider value={{
      journals,
      createJournal,
      updateJournal,
      deleteJournal,
      appendToJournal,
      getJournalById,
      recentJournals,
    }}>
      {children}
    </JournalsContext.Provider>
  );
};

export const useJournals = () => {
  const context = useContext(JournalsContext);
  if (!context) {
    throw new Error('useJournals must be used within a JournalsProvider');
  }
  return context;
};
