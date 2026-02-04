/**
 * ChatDemo - демо страница блочной системы чата
 * 
 * Показывает Agent Chat и Simple Chat режимы с разными типами блоков
 */

import { useState, useRef, useEffect } from 'react';
import { ArrowUp, Plus, Mic, Link2, X, Sparkles, Bot, MessageSquare, PanelRightOpen, PanelRightClose } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BlockRenderer } from '@/components/chat/blocks/BlockRenderer';
import { ToolCallsRibbon } from '@/components/chat/blocks/ToolCallsRibbon';
import type { BlockMessage, AssistantBlock, ToolCallData } from '@/types/chat-blocks';

// === MOCK DATA ===

const mockAgentToolCalls: ToolCallData[] = [
  {
    id: 'tc1',
    name: 'semantic_search',
    status: 'complete',
    duration: 1234,
    output: {
      summary: 'Found 423 papers on solid-state batteries',
      count: 423,
    },
  },
  {
    id: 'tc2',
    name: 'cluster_analysis',
    status: 'complete',
    duration: 856,
    output: {
      summary: 'Identified 5 major research clusters',
      count: 5,
    },
  },
  {
    id: 'tc3',
    name: 'extract_insights',
    status: 'complete',
    duration: 2103,
    output: {
      summary: 'Extracted 12 key insights from top papers',
    },
  },
  {
    id: 'tc4',
    name: 'reasoning_step',
    status: 'running',
    output: {
      summary: 'Synthesizing findings...',
    },
  },
];

const mockAgentBlocks: AssistantBlock[] = [
  {
    id: 'b1',
    kind: 'summary',
    title: 'Research Overview',
    body: 'Analysis of 423 papers reveals solid-state battery research is accelerating, with sulfide electrolytes showing highest performance but significant manufacturing challenges remain.',
  },
  {
    id: 'b2',
    kind: 'metric-group',
    title: 'Key Metrics',
    metrics: [
      { label: 'Papers Analyzed', value: 423, change: 12, trend: 'up' },
      { label: 'Avg Citations', value: 89, change: 8, trend: 'up' },
      { label: 'Clusters', value: 5, trend: 'neutral' },
      { label: 'Divergence Score', value: 0.73, change: -5, trend: 'down' },
    ],
  },
  {
    id: 'b3',
    kind: 'table',
    title: 'Top Countries by Publication',
    table: {
      columns: ['Country', 'Papers', 'Avg FWCI', 'Top Institution'],
      rows: [
        ['Japan', '142', '4.2', 'Toyota Research'],
        ['China', '128', '3.1', 'Chinese Academy of Sciences'],
        ['South Korea', '87', '3.8', 'Samsung SDI'],
        ['USA', '45', '4.5', 'MIT'],
        ['Germany', '21', '3.9', 'Fraunhofer'],
      ],
    },
  },
  {
    id: 'b4',
    kind: 'chart',
    title: 'Publications by Year',
    chart: {
      type: 'bar',
      x: ['2019', '2020', '2021', '2022', '2023', '2024'],
      series: {
        papers: [45, 62, 78, 98, 112, 28],
      },
    },
  },
  {
    id: 'b5',
    kind: 'insight',
    title: 'Key Finding',
    body: 'Sulfide-based electrolytes achieve ionic conductivity of 10-25 mS/cm, comparable to liquid electrolytes. However, air stability remains the critical barrier to commercialization.',
    meta: {
      paperIds: ['P2023-001', 'P2023-045', 'P2022-112'],
    },
  },
  {
    id: 'b6',
    kind: 'insight',
    title: 'Emerging Trend',
    body: 'Polymer-ceramic composite electrolytes are gaining traction as a "best of both worlds" approach, combining safety of polymers with conductivity of ceramics.',
    meta: {
      paperIds: ['P2024-008', 'P2023-089'],
    },
  },
  {
    id: 'b7',
    kind: 'list',
    title: 'Next Steps',
    list: [
      'Explore sulfide cluster papers for manufacturing innovations',
      'Compare interface engineering approaches across institutions',
      'Analyze patent landscape for commercialization timeline',
      'Review Toyota and Samsung research collaboration patterns',
      'Deep-dive into air stability solutions from recent publications',
    ],
  },
];

const mockSimpleChatBlocks: AssistantBlock[] = [
  {
    id: 's1',
    kind: 'summary',
    body: 'Solid-state batteries replace liquid electrolytes with solid materials, offering higher energy density, improved safety, and longer lifespan compared to traditional lithium-ion batteries.',
  },
  {
    id: 's2',
    kind: 'text',
    title: 'Key Advantages',
    body: `### Safety
No flammable liquid electrolyte means significantly reduced fire risk.

### Energy Density
Solid electrolytes enable use of lithium metal anodes, potentially doubling energy density.

### Lifespan
Reduced degradation mechanisms lead to longer cycle life.`,
  },
  {
    id: 's3',
    kind: 'list',
    title: 'Main Electrolyte Types',
    list: [
      'Sulfide-based (Li₆PS₅Cl) — highest conductivity, air-sensitive',
      'Oxide-based (LLZO garnet) — stable but brittle',
      'Polymer-based — flexible but lower conductivity',
      'Composite — combines polymer flexibility with ceramic conductivity',
    ],
  },
  {
    id: 's4',
    kind: 'code',
    title: 'Example Query',
    code: {
      language: 'python',
      content: `# Search for solid-state battery papers
results = strata.search(
    query="solid state battery electrolyte",
    filters={
        "year": {"gte": 2020},
        "fwci": {"gte": 2.0}
    },
    limit=100
)`,
    },
  },
];

const mockDocumentBlocks: AssistantBlock[] = [
  {
    id: 'd1',
    kind: 'summary',
    body: 'Based on the uploaded research paper, the authors propose a novel sulfide electrolyte with enhanced air stability through surface passivation with LiI.',
  },
  {
    id: 'd2',
    kind: 'table',
    title: 'Key Parameters from Document',
    table: {
      columns: ['Parameter', 'Value', 'Unit'],
      rows: [
        ['Ionic Conductivity', '12.5', 'mS/cm'],
        ['Activation Energy', '0.23', 'eV'],
        ['Air Exposure Time', '24', 'hours'],
        ['Capacity Retention', '95', '%'],
      ],
    },
  },
  {
    id: 'd3',
    kind: 'timeline',
    title: 'Research Progress',
    timeline: [
      { id: 't1', label: 'Material Synthesis', timestamp: 'Section 2.1', status: 'complete', detail: 'Li₆PS₅Cl prepared via ball milling' },
      { id: 't2', label: 'Surface Modification', timestamp: 'Section 2.2', status: 'complete', detail: 'LiI coating applied via vapor deposition' },
      { id: 't3', label: 'Characterization', timestamp: 'Section 3', status: 'complete', detail: 'XRD, SEM, EIS analysis' },
      { id: 't4', label: 'Cell Testing', timestamp: 'Section 4', status: 'complete', detail: '500 cycles at 0.5C rate' },
    ],
  },
  {
    id: 'd4',
    kind: 'insight',
    title: 'Main Contribution',
    body: 'The LiI surface passivation layer reduces interfacial resistance by 60% and enables stable cycling in ambient conditions for 24+ hours — a significant improvement over uncoated materials.',
  },
];

const initialMessages: BlockMessage[] = [
  {
    id: 'm1',
    role: 'assistant',
    timestamp: new Date(),
    blocks: [
      {
        id: 'welcome',
        kind: 'summary',
        body: 'Welcome to Strata Chat. I can help you analyze research papers, explore scientific topics, and extract insights from your documents. What would you like to explore?',
      },
    ],
  },
];

// === COMPONENT ===

export default function ChatDemo() {
  const [mode, setMode] = useState<'agent' | 'simple' | 'document'>('agent');
  const [messages, setMessages] = useState<BlockMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRibbon, setShowRibbon] = useState(true);
  const [activeToolCalls, setActiveToolCalls] = useState<ToolCallData[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateAgentResponse = () => {
    // Simulate tool calls appearing one by one
    setActiveToolCalls([]);
    
    const calls = [...mockAgentToolCalls];
    calls.forEach((call, i) => {
      setTimeout(() => {
        setActiveToolCalls(prev => [...prev, { ...call, status: i < calls.length - 1 ? 'complete' : 'running' }]);
        
        // Last call completes and we add response
        if (i === calls.length - 1) {
          setTimeout(() => {
            setActiveToolCalls(prev => prev.map(c => ({ ...c, status: 'complete' as const })));
            setMessages(prev => [...prev, {
              id: Date.now().toString(),
              role: 'assistant',
              timestamp: new Date(),
              blocks: mockAgentBlocks,
              toolCalls: calls.map(c => ({ ...c, status: 'complete' as const })),
            }]);
            setIsProcessing(false);
          }, 1500);
        }
      }, i * 800);
    });
  };

  const simulateSimpleResponse = () => {
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        timestamp: new Date(),
        blocks: mockSimpleChatBlocks,
      }]);
      setIsProcessing(false);
    }, 1000);
  };

  const simulateDocumentResponse = () => {
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        timestamp: new Date(),
        blocks: mockDocumentBlocks,
      }]);
      setIsProcessing(false);
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    // Add user message
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'user',
      timestamp: new Date(),
      content: input.trim(),
    }]);
    
    setInput('');
    setIsProcessing(true);

    // Simulate response based on mode
    if (mode === 'agent') {
      simulateAgentResponse();
    } else if (mode === 'simple') {
      simulateSimpleResponse();
    } else {
      simulateDocumentResponse();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const getModeIcon = () => {
    switch (mode) {
      case 'agent': return <Bot className="w-4 h-4" />;
      case 'simple': return <MessageSquare className="w-4 h-4" />;
      case 'document': return <Sparkles className="w-4 h-4" />;
    }
  };

  const getModeLabel = () => {
    switch (mode) {
      case 'agent': return 'Agent Chat';
      case 'simple': return 'Simple Chat';
      case 'document': return 'Document Q&A';
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-3 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-base font-semibold text-foreground">Strata</span>
            </div>
            
            <Tabs value={mode} onValueChange={(v) => setMode(v as typeof mode)}>
              <TabsList className="h-8">
                <TabsTrigger value="agent" className="text-xs gap-1.5">
                  <Bot className="w-3.5 h-3.5" />
                  Agent
                </TabsTrigger>
                <TabsTrigger value="simple" className="text-xs gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" />
                  Simple
                </TabsTrigger>
                <TabsTrigger value="document" className="text-xs gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Document
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Demo Mode
            </Badge>
            {mode === 'agent' && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setShowRibbon(!showRibbon)}
              >
                {showRibbon ? (
                  <PanelRightClose className="w-4 h-4" />
                ) : (
                  <PanelRightOpen className="w-4 h-4" />
                )}
              </Button>
            )}
          </div>
        </header>

        {/* Messages */}
        <ScrollArea className="flex-1">
          <div className="max-w-[720px] mx-auto px-8 py-10 pb-48">
            <AnimatePresence mode="popLayout">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="mb-8"
                >
                  {message.role === 'user' ? (
                    <div className="flex justify-end">
                      <div className="max-w-[80%] px-4 py-3 rounded-xl bg-muted/60">
                        <p className="text-base text-foreground leading-relaxed">
                          {message.content}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Assistant header */}
                      <div className="flex items-center gap-2.5">
                        {getModeIcon()}
                        <span className="text-base font-medium text-foreground">Strata</span>
                        <Badge variant="outline" className="text-[11px] px-2 py-0.5 h-5 font-normal text-muted-foreground border-border/60">
                          {getModeLabel()}
                        </Badge>
                      </div>
                      
                      {/* Blocks */}
                      <div className="space-y-4">
                        {message.blocks?.map((block) => (
                          <BlockRenderer 
                            key={block.id} 
                            block={block}
                            onPaperClick={(id) => console.log('Paper clicked:', id)}
                            onOpenResults={() => console.log('Open results')}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Processing indicator */}
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-2.5">
                    {getModeIcon()}
                    <span className="text-base font-medium text-foreground">Strata</span>
                    <Badge variant="outline" className="text-[11px] px-2 py-0.5 h-5 font-normal text-muted-foreground border-border/60">
                      {getModeLabel()}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {mode === 'agent' ? 'Running analysis...' : 'Thinking...'}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="fixed bottom-0 left-0 right-0 px-8 pb-8 pt-6 bg-gradient-to-t from-background via-background/95 to-transparent" style={{ right: showRibbon && mode === 'agent' ? '256px' : '0' }}>
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="w-full">
                <div className="bg-card border border-border rounded-2xl shadow-lg py-4">
                  <div className="px-5">
                    <Textarea
                      ref={textareaRef}
                      placeholder={
                        mode === 'agent' 
                          ? "Ask me to analyze research topics, find papers, or explore scientific fields..."
                          : mode === 'document'
                          ? "Ask questions about your uploaded documents..."
                          : "Ask me anything..."
                      }
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      rows={1}
                      className={cn(
                        "w-full min-h-[28px] max-h-[200px] p-0 border-0 bg-transparent resize-none",
                        "focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0",
                        "placeholder:text-muted-foreground/70 text-base leading-relaxed"
                      )}
                    />
                  </div>

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
                        disabled={!input.trim() || isProcessing}
                        className={cn(
                          "h-10 w-10 rounded-full transition-all",
                          input.trim() && !isProcessing
                            ? "bg-foreground text-background hover:bg-foreground/90"
                            : "bg-muted text-muted-foreground/50"
                        )}
                      >
                        <ArrowUp className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="w-full -mt-[22px]">
                  <div className="h-10 rounded-b-[22px] border border-border bg-card/95 px-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Link2 className="w-4 h-4" />
                      <span>Connect your tools to Strata</span>
                    </div>
                    <button
                      type="button"
                      className="h-8 w-8 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Tool Calls Ribbon - only in Agent mode */}
      {mode === 'agent' && showRibbon && (
        <ToolCallsRibbon toolCalls={activeToolCalls} />
      )}
    </div>
  );
}
