import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface JournalEntry {
  id: string;
  journalId: string;
  content: string;
  source: 'report' | 'chat' | 'topology' | 'papers' | 'manual';
  sourceLabel?: string;
  paperIds?: string[];
  createdAt: Date;
}

export interface Journal {
  id: string;
  title: string;
  description?: string;
  icon: string; // emoji
  createdAt: Date;
  updatedAt: Date;
}

interface JournalsContextType {
  journals: Journal[];
  entries: JournalEntry[];
  createJournal: (journal: Omit<Journal, 'id' | 'createdAt' | 'updatedAt'>) => Journal;
  updateJournal: (id: string, updates: Partial<Omit<Journal, 'id' | 'createdAt'>>) => void;
  deleteJournal: (id: string) => void;
  addEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => JournalEntry;
  updateEntry: (id: string, updates: Partial<Omit<JournalEntry, 'id' | 'journalId' | 'createdAt'>>) => void;
  deleteEntry: (id: string) => void;
  getJournalEntries: (journalId: string) => JournalEntry[];
  getJournalById: (id: string) => Journal | undefined;
  recentJournals: Journal[];
}

const JournalsContext = createContext<JournalsContextType | null>(null);

const JOURNALS_STORAGE_KEY = 'research-journals';
const ENTRIES_STORAGE_KEY = 'research-journal-entries';

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

  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    try {
      const stored = localStorage.getItem(ENTRIES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.map((e: JournalEntry) => ({
          ...e,
          createdAt: new Date(e.createdAt),
        }));
      }
    } catch (e) {
      console.error('Failed to parse stored entries:', e);
    }
    return [];
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(JOURNALS_STORAGE_KEY, JSON.stringify(journals));
  }, [journals]);

  useEffect(() => {
    localStorage.setItem(ENTRIES_STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const createJournal = useCallback((journalData: Omit<Journal, 'id' | 'createdAt' | 'updatedAt'>): Journal => {
    const now = new Date();
    const newJournal: Journal = {
      ...journalData,
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
    setEntries(prev => prev.filter(e => e.journalId !== id));
  }, []);

  const addEntry = useCallback((entryData: Omit<JournalEntry, 'id' | 'createdAt'>): JournalEntry => {
    const newEntry: JournalEntry = {
      ...entryData,
      id: `entry-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
    };
    setEntries(prev => [...prev, newEntry]);
    // Update journal's updatedAt
    setJournals(prev => prev.map(j => 
      j.id === entryData.journalId 
        ? { ...j, updatedAt: new Date() }
        : j
    ));
    return newEntry;
  }, []);

  const updateEntry = useCallback((id: string, updates: Partial<Omit<JournalEntry, 'id' | 'journalId' | 'createdAt'>>) => {
    setEntries(prev => prev.map(entry => 
      entry.id === id 
        ? { ...entry, ...updates }
        : entry
    ));
  }, []);

  const deleteEntry = useCallback((id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  }, []);

  const getJournalEntries = useCallback((journalId: string) => {
    return entries
      .filter(e => e.journalId === journalId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }, [entries]);

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
      entries,
      createJournal,
      updateJournal,
      deleteJournal,
      addEntry,
      updateEntry,
      deleteEntry,
      getJournalEntries,
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
