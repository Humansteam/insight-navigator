import { useState, useRef, useEffect } from 'react';
import { ArrowUp, Plus, ChevronDown, ArrowLeft, File, Folder, Copy, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { DocumentItem } from './DocumentSelector';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isThinking?: boolean;
}

interface DocumentsChatViewProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isProcessing: boolean;
  selectedDocuments: DocumentItem[];
  onBack: () => void;
}

const DocumentsChatView = ({
  messages,
  onSendMessage,
  isProcessing,
  selectedDocuments,
  onBack,
}: DocumentsChatViewProps) => {
  const [input, setInput] = useState('');
  const [showThinking, setShowThinking] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header with back button and context */}
      <div className="flex items-center gap-3 px-6 py-3 border-b border-border">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="h-8 w-8"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1 flex items-center gap-2 overflow-x-auto">
          <span className="text-sm text-muted-foreground shrink-0">Context:</span>
          {selectedDocuments.slice(0, 3).map((doc) => (
            <Badge
              key={doc.id}
              variant="secondary"
              className="shrink-0 gap-1 bg-muted text-foreground"
            >
              {doc.type === 'folder' ? (
                <Folder className="w-3 h-3" />
              ) : (
                <File className="w-3 h-3" />
              )}
              <span className="text-xs truncate max-w-[100px]">{doc.name}</span>
            </Badge>
          ))}
          {selectedDocuments.length > 3 && (
            <span className="text-xs text-muted-foreground">
              +{selectedDocuments.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Messages Area - scrollable, takes remaining space */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-[640px] mx-auto px-8 py-10 pb-48">
          <AnimatePresence mode="popLayout">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="mb-10"
              >
                {message.role === 'user' ? (
                  /* User message - right aligned, dark bubble */
                  <div className="flex justify-end">
                    <div className="max-w-[80%] px-4 py-3 rounded-xl bg-[hsl(var(--muted)/0.6)]">
                      <p className="text-base text-foreground leading-relaxed">{message.content}</p>
                    </div>
                  </div>
                ) : (
                  /* Assistant message - left aligned with Strata branding */
                  <div className="space-y-4">
                    {/* Strata header */}
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="w-5 h-5 text-primary" />
                      <span className="text-base font-medium text-foreground">Strata</span>
                      <Badge variant="outline" className="text-[11px] px-2 py-0.5 h-5 font-normal text-muted-foreground border-border/60">
                        Lite
                      </Badge>
                    </div>
                    
                    {/* Thinking process toggle */}
                    {message.isThinking && (
                      <button
                        type="button"
                        onClick={() => setShowThinking(!showThinking)}
                        className="flex items-center gap-1.5 text-[15px] text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Thinking process
                        <ChevronDown className={cn(
                          "w-4 h-4 transition-transform",
                          showThinking && "rotate-180"
                        )} />
                      </button>
                    )}
                    
                    {/* Message content */}
                    <div className="text-base text-foreground leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </div>

                    {/* Action buttons row */}
                    <div className="flex items-center gap-4 pt-2">
                      <button className="flex items-center gap-1.5 text-[14px] text-muted-foreground hover:text-foreground transition-colors">
                        <Copy className="w-4 h-4" />
                      </button>
                      <button className="flex items-center gap-2 text-[14px] text-muted-foreground hover:text-foreground transition-colors">
                        <Sparkles className="w-4 h-4" />
                        Start agent
                      </button>
                      <button className="flex items-center gap-1.5 text-[14px] text-muted-foreground hover:text-foreground transition-colors">
                        <Plus className="w-4 h-4" />
                        Create
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Thinking indicator */}
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-10"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <span className="text-base font-medium text-foreground">Strata</span>
                  <Badge variant="outline" className="text-[11px] px-2 py-0.5 h-5 font-normal text-muted-foreground border-border/60">
                    Lite
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-[15px] text-muted-foreground">Thinking...</span>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Fixed Input Area at bottom - Manus style */}
      <div className="fixed bottom-0 left-0 right-0 px-8 pb-8 pt-6 bg-gradient-to-t from-background via-background/95 to-transparent">
        <div className="max-w-[640px] mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="bg-[hsl(var(--muted)/0.5)] backdrop-blur-md border border-border/40 rounded-3xl overflow-hidden shadow-lg">
              {/* Input row */}
              <div className="px-4 py-3">
                <Textarea
                  ref={textareaRef}
                  placeholder="Send message to Strata"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  className={cn(
                    "w-full min-h-[28px] max-h-[200px] p-0 border-0 bg-transparent resize-none",
                    "focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0",
                    "placeholder:text-muted-foreground/70 text-[15px] leading-relaxed"
                  )}
                />
              </div>
              
              {/* Bottom toolbar */}
              <div className="flex items-center justify-between px-4 pb-4 pt-1">
                <div className="flex items-center gap-0.5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-transparent"
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-transparent"
                  >
                    <Sparkles className="w-5 h-5" />
                  </Button>
                </div>
                
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon"
                  disabled={!input.trim() || isProcessing}
                  className={cn(
                    "h-10 w-10 rounded-full transition-all",
                    input.trim() && !isProcessing
                      ? "bg-foreground/90 text-background hover:bg-foreground"
                      : "bg-muted/60 text-muted-foreground/50"
                  )}
                >
                  <ArrowUp className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DocumentsChatView;
