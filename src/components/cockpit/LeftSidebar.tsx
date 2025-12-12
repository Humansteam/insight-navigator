import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, MessageSquare, Settings, ChevronLeft, ChevronRight, Zap, Archive, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnalysisSession } from '@/types/morphik';
import { cn } from '@/lib/utils';

interface LeftSidebarProps {
  sessions: AnalysisSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewAnalysis: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const LeftSidebar = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewAnalysis,
  collapsed,
  onToggleCollapse,
}: LeftSidebarProps) => {
  const getStatusIcon = (status: AnalysisSession['status']) => {
    switch (status) {
      case 'active':
        return <Zap className="w-3 h-3 text-primary animate-pulse" />;
      case 'complete':
        return <Clock className="w-3 h-3 text-muted-foreground" />;
      case 'archived':
        return <Archive className="w-3 h-3 text-muted-foreground/50" />;
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 56 : 280 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="h-screen bg-sidebar border-r border-sidebar-border flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="p-3 border-b border-sidebar-border flex items-center justify-between min-h-[56px]">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-7 h-7 rounded bg-primary/20 flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <span className="font-semibold text-sm text-foreground tracking-tight">MORPHIK</span>
          </motion.div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="shrink-0"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* New Analysis Button */}
      <div className="p-3">
        <Button
          variant="glow"
          onClick={onNewAnalysis}
          className={cn("w-full justify-start", collapsed && "justify-center px-0")}
        >
          <Plus className="w-4 h-4" />
          {!collapsed && <span>New Analysis</span>}
        </Button>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto px-2 py-1">
        {!collapsed && (
          <div className="text-xs font-medium text-muted-foreground px-2 py-2 uppercase tracking-wider">
            History
          </div>
        )}
        <div className="space-y-1">
          {sessions.map((session) => (
            <button
              key={session.id}
              onClick={() => onSelectSession(session.id)}
              className={cn(
                "w-full text-left px-2 py-2 rounded-md transition-colors flex items-center gap-2 group",
                activeSessionId === session.id
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              <MessageSquare className="w-4 h-4 shrink-0 text-muted-foreground" />
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    {getStatusIcon(session.status)}
                    <span className="text-sm truncate">{session.title}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{formatDate(session.timestamp)}</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className={cn("w-full justify-start", collapsed && "justify-center px-0")}
        >
          <Settings className="w-4 h-4" />
          {!collapsed && <span>Settings</span>}
        </Button>
      </div>
    </motion.aside>
  );
};
