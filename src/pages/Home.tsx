import { useState, useRef } from 'react';
import { FileText, Search, Bot, X, ChevronDown, Folder, File } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

type Mode = 'documents' | 'research' | 'agent';

interface DocumentItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  children?: DocumentItem[];
}

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
      setSelectedDocuments([]);
    } else {
      setActiveMode(mode);
      if (mode !== 'documents') {
        setSelectedDocuments([]);
      }
    }
  };

  const handleDocumentSelect = (doc: DocumentItem) => {
    const isSelected = selectedDocuments.some((d) => d.id === doc.id);
    if (isSelected) {
      setSelectedDocuments(selectedDocuments.filter((d) => d.id !== doc.id));
    } else {
      setSelectedDocuments([...selectedDocuments, doc]);
    }
  };

  const removeDocument = (docId: string) => {
    setSelectedDocuments(selectedDocuments.filter((d) => d.id !== docId));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsTyping(e.target.value.length > 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    // Handle search/query submission
    console.log('Query:', query, 'Mode:', activeMode, 'Documents:', selectedDocuments);
  };

  const modeButtons = [
    { id: 'documents' as Mode, label: 'Documents', icon: FileText },
    { id: 'research' as Mode, label: 'Research', icon: Search },
    { id: 'agent' as Mode, label: 'Agent Mode', icon: Bot },
  ];

  const renderDocumentItem = (doc: DocumentItem, depth = 0) => {
    const isSelected = selectedDocuments.some((d) => d.id === doc.id);
    const Icon = doc.type === 'folder' ? Folder : File;

    if (doc.type === 'folder' && doc.children) {
      return (
        <div key={doc.id}>
          <DropdownMenuItem
            className={cn(
              'cursor-pointer',
              isSelected && 'bg-primary/10'
            )}
            style={{ paddingLeft: `${12 + depth * 12}px` }}
            onClick={(e) => {
              e.preventDefault();
              handleDocumentSelect(doc);
            }}
          >
            <Icon className="w-4 h-4 mr-2 text-muted-foreground" />
            <span className="flex-1">{doc.name}</span>
            {isSelected && <Badge variant="secondary" className="ml-2 text-xs">Selected</Badge>}
          </DropdownMenuItem>
          {doc.children.map((child) => renderDocumentItem(child, depth + 1))}
        </div>
      );
    }

    return (
      <DropdownMenuItem
        key={doc.id}
        className={cn(
          'cursor-pointer',
          isSelected && 'bg-primary/10'
        )}
        style={{ paddingLeft: `${12 + depth * 12}px` }}
        onClick={(e) => {
          e.preventDefault();
          handleDocumentSelect(doc);
        }}
      >
        <Icon className="w-4 h-4 mr-2 text-muted-foreground" />
        <span className="flex-1">{doc.name}</span>
        {isSelected && <Badge variant="secondary" className="ml-2 text-xs">Selected</Badge>}
      </DropdownMenuItem>
    );
  };

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
            <div className="relative flex items-center">
              {/* Mode Pin */}
              {activeMode && (
                <div className="absolute left-3 flex items-center">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs font-medium border",
                      activeMode === 'documents' && "border-primary/50 text-primary bg-primary/5",
                      activeMode === 'research' && "border-accent/50 text-accent bg-accent/5",
                      activeMode === 'agent' && "border-warning/50 text-warning bg-warning/5"
                    )}
                  >
                    {activeMode === 'documents' && <FileText className="w-3 h-3 mr-1" />}
                    {activeMode === 'research' && <Search className="w-3 h-3 mr-1" />}
                    {activeMode === 'agent' && <Bot className="w-3 h-3 mr-1" />}
                    {modeButtons.find(m => m.id === activeMode)?.label}
                  </Badge>
                </div>
              )}

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
                    : 'Assign a task'
                }
                value={query}
                onChange={handleInputChange}
                className={cn(
                  "w-full h-14 rounded-2xl border-border bg-background-elevated text-foreground",
                  "pl-4 pr-12 text-base",
                  "focus:ring-2 focus:ring-primary/30 focus:border-primary/50",
                  "placeholder:text-muted-foreground",
                  activeMode && "pl-32"
                )}
              />

              {/* Document Selector Dropdown (only when Documents mode is active) */}
              {activeMode === 'documents' && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-12 h-8 w-8 text-muted-foreground hover:text-foreground"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-72 max-h-80 overflow-auto">
                    <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                      Select documents for RAG analysis
                    </div>
                    <DropdownMenuSeparator />
                    {mockDocuments.map((doc) => renderDocumentItem(doc))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

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
