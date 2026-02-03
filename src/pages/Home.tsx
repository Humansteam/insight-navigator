import { useState, useRef } from 'react';
import { FileText, Search, Bot, X, Folder, File, Plus, ArrowUp, Mic, Link2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import DocumentSelector, { DocumentItem } from '@/components/home/DocumentSelector';
import DocumentsChatView, { ChatMessage } from '@/components/home/DocumentsChatView';

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
  const [showIntegrations, setShowIntegrations] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Chat state for Documents mode
  const [isInChatMode, setIsInChatMode] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

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
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    if (activeMode === 'documents') {
      // Add user message
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: query,
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, userMessage]);
      setIsInChatMode(true);
      setQuery('');
      setIsProcessing(true);

      // Simulate AI response
      setTimeout(() => {
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Анализирую выбранные документы по вашему запросу...\n\nНайдено 3 релевантных раздела в документах:\n\n1. **Lithium Battery Analysis.pdf** — раздел о характеристиках литий-ионных батарей\n2. **Solid-State Electrolytes.pdf** — сравнительный анализ электролитов\n3. **Manufacturing Processes.pdf** — технологии производства\n\nХотите, чтобы я подробнее раскрыл какой-либо из этих разделов?`,
          timestamp: new Date(),
          isThinking: true,
        };
        setChatMessages((prev) => [...prev, assistantMessage]);
        setIsProcessing(false);
      }, 2000);
    } else {
      console.log('Query:', query, 'Mode:', activeMode, 'Documents:', selectedDocuments);
    }
  };

  const handleChatMessage = (message: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };
    setChatMessages((prev) => [...prev, userMessage]);
    setIsProcessing(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Продолжаю анализ на основе вашего запроса "${message}"...\n\nВот что я нашел в документах...`,
        timestamp: new Date(),
        isThinking: true,
      };
      setChatMessages((prev) => [...prev, assistantMessage]);
      setIsProcessing(false);
    }, 1500);
  };

  const handleBackFromChat = () => {
    setIsInChatMode(false);
    setChatMessages([]);
  };

  const modeButtons: Mode[] = ['documents', 'research', 'agent'];

  // Full-screen chat mode for Documents
  if (isInChatMode && activeMode === 'documents') {
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

        {/* Chat View */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <DocumentsChatView
            messages={chatMessages}
            onSendMessage={handleChatMessage}
            isProcessing={isProcessing}
            selectedDocuments={selectedDocuments}
            onBack={handleBackFromChat}
          />
        </main>
      </div>
    );
  }

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

      {/* Main Content - positioned from top to prevent jumping */}
      <main className="flex-1 flex flex-col items-center px-6 pt-[20vh]">
        <div className="w-full max-w-3xl">
          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-serif text-center text-foreground mb-12">
            Let's dive into your knowledge
          </h1>

          {/* Search Input Area - Manus style */}
          <form onSubmit={handleSubmit}>
            <div className="w-full">
              {/* Form card */}
              <div className="bg-card border border-border rounded-2xl shadow-lg py-4">
                {/* Input row */}
                <div className="px-5">
                  {/* Active Mode Badge */}
                  {activeMode && (
                    <div className="flex items-center gap-1.5 mb-3 w-fit px-3 py-1.5 bg-muted rounded-full">
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
                  
                  <Textarea
                    ref={textareaRef}
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
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                    rows={1}
                    className={cn(
                      "w-full min-h-[28px] max-h-[200px] p-0 border-0 bg-transparent resize-none",
                      "focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0",
                      "placeholder:text-muted-foreground/70 text-base leading-relaxed"
                    )}
                  />
                </div>

                {/* Bottom toolbar */}
                <div className="flex items-center justify-between px-4 pt-3">
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80"
                    >
                      <Plus className="w-5 h-5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80"
                    >
                      <Link2 className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-lg text-muted-foreground hover:bg-muted"
                    >
                      <Mic className="w-5 h-5" />
                    </Button>
                    <Button
                      type="submit"
                      variant="ghost"
                      size="icon"
                      disabled={!query.trim()}
                      className={cn(
                        "h-10 w-10 rounded-full transition-all",
                        query.trim()
                          ? "bg-foreground text-background hover:bg-foreground/90"
                          : "bg-muted text-muted-foreground/50"
                      )}
                    >
                      <ArrowUp className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Integrations bar */}
              {showIntegrations && (
                <div className="w-full -mt-[22px]">
                  <div className="h-10 rounded-b-[22px] border border-border bg-card/95 px-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Link2 className="w-4 h-4" />
                      <span>Connect your tools to Strata</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowIntegrations(false)}
                      className="h-8 w-8 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      aria-label="Dismiss"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Fixed height container for content below input - prevents layout shift */}
            <div>
              {/* Mode Buttons - only when no mode is active */}
              {!activeMode && (
                <div className="flex items-center justify-center gap-3 mt-4">
                  {modeButtons.map((modeId) => {
                    const config = modeConfig[modeId];
                    const Icon = config.icon;
                    const hasDocuments = modeId === 'documents' && selectedDocuments.length > 0;

                    return (
                      <Button
                        key={modeId}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleModeSelect(modeId)}
                        className="h-10 px-5 rounded-full gap-2 transition-all border bg-transparent border-border text-muted-foreground hover:bg-card hover:text-foreground"
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
              )}

            {/* Content Area - only shows when mode is active */}
            {activeMode === 'documents' && (
              <div className="mt-4">
                <DocumentSelector
                  documents={mockDocuments}
                  selectedDocuments={selectedDocuments}
                  onSelect={handleDocumentSelect}
                  onClose={() => setActiveMode(null)}
                />
                
                {/* Selected Documents Pills - left aligned with row separators */}
                {selectedDocuments.length > 0 && (
                  <div className="pt-4 mt-4 border-t border-border">
                    {/* Group documents into rows of 4 */}
                    {Array.from({ length: Math.ceil(selectedDocuments.length / 4) }).map((_, rowIndex) => (
                      <div key={rowIndex}>
                        <div className="flex flex-wrap justify-start gap-2">
                          {selectedDocuments.slice(rowIndex * 4, (rowIndex + 1) * 4).map((doc) => (
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
                        {/* Separator line after each row of 4 (except last row) */}
                        {rowIndex < Math.ceil(selectedDocuments.length / 4) - 1 && (
                          <div className="border-t border-border my-2" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
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
