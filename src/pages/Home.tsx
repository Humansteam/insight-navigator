import { useState, useRef } from 'react';
import { Search, Bot, X, Folder, File } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import DocumentSelector, { DocumentItem } from '@/components/home/DocumentSelector';

type Mode = 'documents' | 'research' | 'agent';

// Mock documents data - in real app this would come from RAG system
const mockDocuments: DocumentItem[] = [
  {
    id: 'folder-1',
    name: 'Research Papers',
    type: 'folder',
    children: [
      { id: 'doc-1', name: 'Lithium Battery Analysis.pdf', type: 'file' },
      { id: 'doc-2', name: 'Solid-State Electrolytes.pdf', type: 'file' },
      { id: 'doc-3', name: 'Manufacturing Processes.pdf', type: 'file' },
    ],
  },
  {
    id: 'folder-2',
    name: 'Technical Reports',
    type: 'folder',
    children: [
      { id: 'doc-4', name: 'Q4 Performance Report.pdf', type: 'file' },
      { id: 'doc-5', name: 'Material Science Review.pdf', type: 'file' },
    ],
  },
  { id: 'doc-6', name: 'Executive Summary.pdf', type: 'file' },
  { id: 'doc-7', name: 'Market Analysis 2024.xlsx', type: 'file' },
];

const Home = () => {
  const [activeMode, setActiveMode] = useState<Mode | null>(null);
  const [query, setQuery] = useState('');
  const [selectedDocuments, setSelectedDocuments] = useState<DocumentItem[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleModeSelect = (mode: Mode) => {
    if (activeMode === mode) {
      setActiveMode(null);
      if (mode === 'documents') {
        setSelectedDocuments([]);
      }
    } else {
      setActiveMode(mode);
    }
  };

  const handleDocumentSelect = (doc: DocumentItem) => {
    const isSelected = selectedDocuments.some((d) => d.id === doc.id);
    if (isSelected) {
      const newSelected = selectedDocuments.filter((d) => d.id !== doc.id);
      setSelectedDocuments(newSelected);
      // If no documents selected, clear documents mode
      if (newSelected.length === 0 && activeMode === 'documents') {
        setActiveMode(null);
      }
    } else {
      setSelectedDocuments([...selectedDocuments, doc]);
      // Auto-activate documents mode when selecting
      if (activeMode !== 'documents') {
        setActiveMode('documents');
      }
    }
  };

  const removeDocument = (docId: string) => {
    const newSelected = selectedDocuments.filter((d) => d.id !== docId);
    setSelectedDocuments(newSelected);
    if (newSelected.length === 0 && activeMode === 'documents') {
      setActiveMode(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsTyping(e.target.value.length > 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    console.log('Query:', query, 'Mode:', activeMode, 'Documents:', selectedDocuments);
  };

  // Only Research and Agent Mode buttons (Documents is now in input)
  const modeButtons = [
    { id: 'research' as Mode, label: 'Research', icon: Search },
    { id: 'agent' as Mode, label: 'Agent Mode', icon: Bot },
  ];

  // renderDocumentItem moved to DocumentSelector component

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-semibold text-sm">S</span>
          </div>
          <span className="text-lg font-medium text-foreground">Stata</span>
        </div>
        <ThemeSwitcher />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6">
        <div className={cn(
          "w-full max-w-3xl transition-all duration-500",
          isTyping ? "translate-y-[-20%]" : ""
        )}>
          {/* Title */}
          <h1 className={cn(
            "text-4xl md:text-5xl font-serif text-center text-foreground mb-12 transition-opacity duration-300",
            isTyping ? "opacity-0" : "opacity-100"
          )}>
            Let's dive into your knowledge
          </h1>

          {/* Search Input Area */}
          <form onSubmit={handleSubmit} className="relative">
            {/* Selected Documents Pills */}
            {selectedDocuments.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedDocuments.map((doc) => (
                  <Badge
                    key={doc.id}
                    variant="secondary"
                    className="pl-2 pr-1 py-1 flex items-center gap-1 bg-primary/10 text-primary border-primary/20"
                  >
                    {doc.type === 'folder' ? (
                      <Folder className="w-3 h-3" />
                    ) : (
                      <File className="w-3 h-3" />
                    )}
                    <span className="text-xs">{doc.name}</span>
                    <button
                      type="button"
                      onClick={() => removeDocument(doc.id)}
                      className="ml-1 p-0.5 rounded-full hover:bg-primary/20 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Input Field */}
            <div className="relative flex items-center gap-2">
              {/* Document Selector - always visible */}
              <DocumentSelector
                documents={mockDocuments}
                selectedDocuments={selectedDocuments}
                onSelect={handleDocumentSelect}
              />

              {/* Mode Pin for Research/Agent */}
              {activeMode && activeMode !== 'documents' && (
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs font-medium border shrink-0",
                    activeMode === 'research' && "border-accent/50 text-accent bg-accent/5",
                    activeMode === 'agent' && "border-warning/50 text-warning bg-warning/5"
                  )}
                >
                  {activeMode === 'research' && <Search className="w-3 h-3 mr-1" />}
                  {activeMode === 'agent' && <Bot className="w-3 h-3 mr-1" />}
                  {modeButtons.find(m => m.id === activeMode)?.label}
                </Badge>
              )}

              <div className="relative flex-1">
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder={
                    activeMode === 'documents'
                      ? 'Ask about your documents...'
                      : activeMode === 'research'
                      ? 'Enter your research query...'
                      : activeMode === 'agent'
                      ? 'Assign a task to the agent...'
                      : 'Ask anything...'
                  }
                  value={query}
                  onChange={handleInputChange}
                  className={cn(
                    "w-full h-14 rounded-2xl border-border bg-background-elevated text-foreground",
                    "pl-4 pr-12 text-base",
                    "focus:ring-2 focus:ring-primary/30 focus:border-primary/50",
                    "placeholder:text-muted-foreground"
                  )}
                />

                {/* Submit Button */}
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                  className="absolute right-2 h-10 w-10 rounded-xl bg-primary/10 text-primary hover:bg-primary/20"
                  disabled={!query.trim()}
                >
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </form>

          {/* Mode Buttons */}
          <div className="flex items-center justify-center gap-3 mt-6">
            {modeButtons.map((mode) => {
              const Icon = mode.icon;
              const isActive = activeMode === mode.id;

              return (
                <Button
                  key={mode.id}
                  variant={isActive ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleModeSelect(mode.id)}
                  className={cn(
                    "rounded-full px-4 transition-all",
                    isActive && "shadow-glow-sm"
                  )}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {mode.label}
                </Button>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer hint */}
      <footer className="py-4 text-center">
        <p className="text-sm text-muted-foreground">
          Select a mode and start exploring your knowledge base
        </p>
      </footer>
    </div>
  );
};

export default Home;
