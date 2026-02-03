import { useState, useRef } from 'react';
import { FileText, Search, Bot, X, Folder, File, ChevronDown, ArrowUpRight } from 'lucide-react';
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

const modeConfig = {
  documents: { label: 'Documents', icon: FileText, color: 'primary' },
  research: { label: 'Research', icon: Search, color: 'accent' },
  agent: { label: 'Agent Mode', icon: Bot, color: 'warning' },
};

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
    console.log('Query:', query, 'Mode:', activeMode, 'Documents:', selectedDocuments);
  };

  const modeButtons: Mode[] = ['documents', 'research', 'agent'];

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
        <div className="w-full max-w-3xl">
          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-serif text-center text-foreground mb-12">
            Let's dive into your knowledge
          </h1>

          {/* Search Input Area - Fixed position, doesn't move */}
          <form onSubmit={handleSubmit} className="relative">
            {/* Input Container */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              {/* Input Field with optional mode badge */}
              <div className="relative flex items-center">
                {/* Active Mode Badge - inside input */}
                {activeMode && (
                  <div className="flex items-center gap-1.5 ml-3 px-3 py-1.5 bg-muted rounded-full">
                    {(() => {
                      const Icon = modeConfig[activeMode].icon;
                      return <Icon className="w-3.5 h-3.5" />;
                    })()}
                    <span className="text-xs font-medium">{modeConfig[activeMode].label}</span>
                    <button
                      type="button"
                      onClick={() => setActiveMode(null)}
                      className="ml-0.5 p-0.5 rounded-full hover:bg-foreground/10 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
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
                      : 'Assign a task or ask anything'
                  }
                  value={query}
                  onChange={handleInputChange}
                  className={cn(
                    "flex-1 h-14 border-0 bg-transparent text-foreground",
                    activeMode ? "pl-3" : "pl-4",
                    "pr-24 text-base",
                    "focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0",
                    "placeholder:text-muted-foreground"
                  )}
                />

                {/* Right side buttons */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  <Button
                    type="submit"
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-8 w-8 rounded-lg transition-colors",
                      query.trim() 
                        ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                        : "bg-muted text-muted-foreground"
                    )}
                    disabled={!query.trim()}
                  >
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Mode Buttons - always visible */}
            <div className="flex items-center justify-center gap-3 mt-4">
              {modeButtons.map((modeId) => {
                const config = modeConfig[modeId];
                const Icon = config.icon;
                const isActive = activeMode === modeId;
                const hasDocuments = modeId === 'documents' && selectedDocuments.length > 0;

                return (
                  <Button
                    key={modeId}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleModeSelect(modeId)}
                    className={cn(
                      "h-10 px-5 rounded-full gap-2 transition-all border",
                      isActive 
                        ? "bg-card border-foreground/20 text-foreground" 
                        : "bg-transparent border-border text-muted-foreground hover:bg-card hover:text-foreground"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">
                      {config.label}
                      {hasDocuments && ` (${selectedDocuments.length})`}
                    </span>
                  </Button>
                );
              })}
            </div>

            {/* Content Area - fixed height with pinned selections */}
            <div className="mt-4 min-h-[340px] flex flex-col">
              {/* Dynamic content */}
              <div className="flex-1">
                {activeMode === 'documents' ? (
                  <DocumentSelector
                    documents={mockDocuments}
                    selectedDocuments={selectedDocuments}
                    onSelect={handleDocumentSelect}
                    onClose={() => setActiveMode(null)}
                  />
                ) : (
                  <div className="space-y-2">
                    {(activeMode === 'research'
                      ? [
                          'Analyze trends in solid-state battery technology',
                          'Compare lithium-ion vs sodium-ion batteries',
                          'Review latest electrolyte research papers',
                          'Summarize manufacturing cost optimization studies',
                          'Explore cathode material innovations',
                          'Investigate recycling methods for EV batteries',
                          'Study thermal management in battery packs',
                        ]
                      : activeMode === 'agent'
                      ? [
                          'Create a comprehensive research report on battery materials',
                          'Build a comparison table of top 10 battery manufacturers',
                          'Generate an executive summary from selected documents',
                          'Analyze and extract key findings from research papers',
                          'Draft a patent landscape analysis for solid-state batteries',
                          'Compile a market trends report for Q1 2024',
                          'Create a technical brief on emerging battery technologies',
                        ]
                      : [
                          'Summarize the key findings from my research papers',
                          'What are the latest trends in battery technology?',
                          'Compare performance metrics across my documents',
                          'Create a literature review on solid-state electrolytes',
                          'Extract data tables from uploaded PDFs',
                          'Find contradictions between research papers',
                          'Identify gaps in current research coverage',
                        ]
                    ).map((suggestion, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setQuery(suggestion)}
                        className="w-full text-left px-4 py-3 text-sm text-foreground bg-card border border-border rounded-xl hover:bg-muted/50 transition-colors flex items-center justify-between group"
                      >
                        <span>{suggestion}</span>
                        <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Documents Pills - always pinned at bottom */}
              {selectedDocuments.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 pt-4 mt-4 border-t border-border">
                  {selectedDocuments.map((doc) => (
                    <Badge
                      key={doc.id}
                      variant="secondary"
                      className="pl-2 pr-1 py-1 flex items-center gap-1 bg-muted text-foreground border border-border"
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
                        className="ml-1 p-0.5 rounded-full hover:bg-foreground/10 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </form>
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
