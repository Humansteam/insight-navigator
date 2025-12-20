import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, Loader2, Plus, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useChat } from '@/contexts/ChatContext';

export const TopologyChatPanel = () => {
  const [input, setInput] = useState('');
  const { messages, isProcessing, sendMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;
    sendMessage(input);
    setInput('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="relative flex flex-col h-full bg-muted/30">
      {/* Header */}
      <div className="p-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Bot className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-foreground">AI Ассистент</h3>
            <p className="text-xs text-muted-foreground">Анализ топологии</p>
          </div>
        </div>
      </div>

      {/* Messages - with padding bottom for floating input */}
      <ScrollArea className="flex-1 p-3 pb-40">
        <div className="space-y-3">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex gap-2",
                  msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                )}
              >
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center shrink-0",
                  msg.role === 'user' 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted text-muted-foreground"
                )}>
                  {msg.role === 'user' ? (
                    <User className="w-3 h-3" />
                  ) : (
                    <Bot className="w-3 h-3" />
                  )}
                </div>
                <div
                  className={cn(
                    "max-w-[85%] px-3 py-2 rounded-lg text-sm",
                    msg.role === 'user'
                      ? "bg-primary text-primary-foreground"
                      : "bg-background border border-border text-foreground"
                  )}
                >
                  {msg.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-2"
            >
              <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                <Bot className="w-3 h-3 text-muted-foreground" />
              </div>
              <div className="px-3 py-2 rounded-lg bg-background border border-border">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Floating Input Container - Lovable style */}
      <div className="absolute bottom-3 left-3 right-3">
        <form 
          onSubmit={handleSubmit} 
          className="rounded-xl bg-card border border-border shadow-lg shadow-black/25 overflow-hidden"
        >
          {/* Text input */}
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Ask Strata..."
            disabled={isProcessing}
            rows={1}
            className="w-full px-3 py-2.5 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none resize-none border-none min-h-[36px]"
          />
          
          {/* Bottom controls */}
          <div className="flex items-center justify-between px-2 py-1.5">
            {/* Left: Plus button */}
            <button
              type="button"
              className="h-7 w-7 rounded-full border border-border/60 bg-transparent hover:bg-muted/50 flex items-center justify-center transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
            
            {/* Right: Send button */}
            <button
              type="submit"
              disabled={!input.trim() || isProcessing}
              className="h-7 w-7 rounded-full border border-border/60 bg-transparent hover:bg-muted/50 flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <Loader2 className="w-3.5 h-3.5 text-muted-foreground animate-spin" />
              ) : (
                <ArrowUp className="w-3.5 h-3.5 text-muted-foreground" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};