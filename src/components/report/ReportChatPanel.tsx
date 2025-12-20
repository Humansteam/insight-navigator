import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, Loader2, Plus, Lightbulb, ChevronRight, Bookmark, CornerDownLeft, ThumbsUp, ThumbsDown, Copy, MoreHorizontal, ArrowDown, Pencil } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useChat } from '@/contexts/ChatContext';

export const ReportChatPanel = () => {
  const [input, setInput] = useState('');
  const { messages, isProcessing, sendMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [showScrollDown, setShowScrollDown] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;
    sendMessage(input);
    setInput('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative flex flex-col h-full bg-background">
      {/* Messages - Lovable style */}
      <ScrollArea className="flex-1 px-4 py-4 pb-36" ref={scrollAreaRef}>
        <div className="space-y-6">
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                {msg.role === 'user' ? (
                  /* User message - right aligned, rounded box */
                  <div className="flex justify-end">
                    <div className="max-w-[90%] px-4 py-3 rounded-2xl bg-card border border-border text-foreground text-sm leading-relaxed">
                      {msg.content}
                    </div>
                  </div>
                ) : (
                  /* AI message - left aligned, no background */
                  <div className="space-y-3">
                    {/* Tool indicator */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Lightbulb className="w-4 h-4" />
                        <span className="text-xs">1 tool used</span>
                      </div>
                      <button className="px-3 py-1 rounded-md border border-border text-xs text-foreground hover:bg-muted transition-colors">
                        Show all
                      </button>
                    </div>
                    
                    {/* Message content */}
                    <div className="text-sm text-foreground/90 leading-relaxed">
                      {msg.content}
                    </div>
                    
                    {/* Code badge example */}
                    {idx === messages.length - 1 && (
                      <div className="inline-flex">
                        <span className="px-2 py-1 rounded-md bg-muted text-xs font-mono text-muted-foreground">
                          ReportChatPanel
                        </span>
                      </div>
                    )}
                    
                    {/* Action card */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 p-3 rounded-xl border border-border bg-card/50 hover:bg-card transition-colors cursor-pointer group">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                              View changes
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Preview this version
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </div>
                      </div>
                      <button className="h-10 w-10 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {/* Action buttons row */}
                    <div className="flex items-center gap-1 pt-1">
                      <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                        <CornerDownLeft className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                        <ThumbsUp className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                        <ThumbsDown className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                        <Copy className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-2"
            >
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs">Thinking...</span>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Scroll to bottom button */}
      {showScrollDown && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-36 left-1/2 -translate-x-1/2 h-8 w-8 rounded-full bg-card border border-border shadow-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowDown className="w-4 h-4" />
        </button>
      )}

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
