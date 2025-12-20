import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface Note {
  id: string;
  content: string;
  source: 'report' | 'chat' | 'topology' | 'papers' | 'manual';
  sourceLabel?: string;
  tags: string[];
  paperIds?: string[];
  createdAt: Date;
  updatedAt: Date;
  color?: 'yellow' | 'blue' | 'green' | 'purple' | 'red';
}

interface NotesContextType {
  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Note;
  updateNote: (id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>) => void;
  deleteNote: (id: string) => void;
  getNotesByPaper: (paperId: string) => Note[];
  getNotesByTag: (tag: string) => Note[];
  getNotesBySource: (source: Note['source']) => Note[];
  allTags: string[];
}

const NotesContext = createContext<NotesContextType | null>(null);

const STORAGE_KEY = 'research-notebook-notes';

export const NotesProvider = ({ children }: { children: React.ReactNode }) => {
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.map((n: Note) => ({
          ...n,
          createdAt: new Date(n.createdAt),
          updatedAt: new Date(n.updatedAt),
        }));
      }
    } catch (e) {
      console.error('Failed to parse stored notes:', e);
    }
    return [];
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  const addNote = useCallback((noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Note => {
    const now = new Date();
    const newNote: Note = {
      ...noteData,
      id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
      updatedAt: now,
    };
    setNotes(prev => [newNote, ...prev]);
    return newNote;
  }, []);

  const updateNote = useCallback((id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>) => {
    setNotes(prev => prev.map(note => 
      note.id === id 
        ? { ...note, ...updates, updatedAt: new Date() }
        : note
    ));
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  }, []);

  const getNotesByPaper = useCallback((paperId: string) => {
    return notes.filter(note => note.paperIds?.includes(paperId));
  }, [notes]);

  const getNotesByTag = useCallback((tag: string) => {
    return notes.filter(note => note.tags.includes(tag));
  }, [notes]);

  const getNotesBySource = useCallback((source: Note['source']) => {
    return notes.filter(note => note.source === source);
  }, [notes]);

  const allTags = React.useMemo(() => {
    const tagSet = new Set<string>();
    notes.forEach(note => note.tags.forEach(tag => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, [notes]);

  return (
    <NotesContext.Provider value={{
      notes,
      addNote,
      updateNote,
      deleteNote,
      getNotesByPaper,
      getNotesByTag,
      getNotesBySource,
      allTags,
    }}>
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};
