import { useState, useRef, useEffect } from 'react';
import { ArrowUp, Plus, ChevronDown, ArrowLeft, File, Folder } from 'lucide-react';
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
    <div className="flex flex-col h-full max-w-4xl mx-auto w-full">
      {/* Header with context */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
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

      {/* Messages Area */}
      <ScrollArea className="flex-1 px-4">
        <div className="py-6 space-y-6">
          <AnimatePresence mode="popLayout">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  'flex',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.role === 'user' ? (
                  <div className="max-w-[80%] px-4 py-3 rounded-2xl bg-card border border-border">
                    <p className="text-sm">{message.content}</p>
                  </div>
                ) : (
                  <div className="max-w-[90%] space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-semibold text-xs">S</span>
                      </div>
                      <span className="text-sm font-medium">Strata</span>
                    </div>
                    
                    {message.isThinking && (
                      <button
                        type="button"
                        onClick={() => setShowThinking(!showThinking)}
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Thinking process
                        <ChevronDown className={cn(
                          "w-3 h-3 transition-transform",
                          showThinking && "rotate-180"
                        )} />
                      </button>
                    )}
                    
                    <div className="pl-8">
                      <p className="text-sm text-foreground whitespace-pre-wrap">
                        {message.content}
                      </p>
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
              className="flex justify-start"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold text-xs">S</span>
                  </div>
                  <span className="text-sm font-medium">Strata</span>
                </div>
                <div className="pl-8 flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-sm text-muted-foreground">Thinking...</span>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4">
        <form onSubmit={handleSubmit} className="relative">
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="relative flex items-end">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-10 w-10 m-1 shrink-0 text-muted-foreground hover:text-foreground"
              >
                <Plus className="w-5 h-5" />
              </Button>
              
              <Textarea
                ref={textareaRef}
                placeholder="Ask Strata..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                className={cn(
                  "flex-1 min-h-[44px] max-h-[200px] py-3 px-0 border-0 bg-transparent resize-none",
                  "focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0",
                  "placeholder:text-muted-foreground text-sm"
                )}
              />
              
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                disabled={!input.trim() || isProcessing}
                className={cn(
                  "h-8 w-8 m-2 shrink-0 rounded-full transition-colors",
                  input.trim() && !isProcessing
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <ArrowUp className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DocumentsChatView;
