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
        <div className="max-w-3xl mx-auto px-6 py-8 pb-32">
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
                  /* User message - right aligned, dark bubble */
                  <div className="flex justify-end">
                    <div className="max-w-[80%] px-4 py-3 rounded-2xl bg-card border border-border">
                      <p className="text-sm text-foreground">{message.content}</p>
                    </div>
                  </div>
                ) : (
                  /* Assistant message - left aligned with Strata branding */
                  <div className="space-y-3">
                    {/* Strata header */}
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-primary" />
                      </div>
                      <span className="font-medium text-foreground">Strata</span>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5">
                        Lite
                      </Badge>
                    </div>
                    
                    {/* Thinking process toggle */}
                    {message.isThinking && (
                      <button
                        type="button"
                        onClick={() => setShowThinking(!showThinking)}
                        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Thinking process
                        <ChevronDown className={cn(
                          "w-4 h-4 transition-transform",
                          showThinking && "rotate-180"
                        )} />
                      </button>
                    )}
                    
                    {/* Message content */}
                    <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </div>

                    {/* Action buttons row */}
                    <div className="flex items-center gap-4 pt-2">
                      <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                        <Copy className="w-4 h-4" />
                      </button>
                      <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                        <Sparkles className="w-4 h-4" />
                        Start agent
                      </button>
                      <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                        <Plus className="w-4 h-4" />
                        Create
                        <ChevronDown className="w-3 h-3" />
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
              className="mb-8"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-medium text-foreground">Strata</span>
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5">
                    Lite
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-sm text-muted-foreground">Thinking...</span>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Fixed Input Area at bottom - Manus style */}
      <div className="fixed bottom-0 left-0 right-0 px-6 pb-6 pt-4 bg-gradient-to-t from-background via-background to-transparent">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="bg-muted/80 backdrop-blur-sm border border-border rounded-2xl overflow-hidden">
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
                    "w-full min-h-[24px] max-h-[200px] p-0 border-0 bg-transparent resize-none",
                    "focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0",
                    "placeholder:text-muted-foreground text-sm leading-relaxed"
                  )}
                />
              </div>
              
              {/* Bottom toolbar */}
              <div className="flex items-center justify-between px-3 pb-3">
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
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
                    "h-9 w-9 rounded-full transition-all",
                    input.trim() && !isProcessing
                      ? "bg-foreground text-background hover:bg-foreground/90"
                      : "bg-muted text-muted-foreground"
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
