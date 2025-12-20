import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Journal } from '@/contexts/JournalsContext';

interface JournalTabsProps {
  openTabs: Journal[];
  activeTabId: string | null;
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string) => void;
}

export const JournalTabs = ({
  openTabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
}: JournalTabsProps) => {
  if (openTabs.length === 0) return null;

  return (
    <div className="h-9 border-b border-border bg-muted/30 flex items-end overflow-x-auto">
      {openTabs.map((journal) => (
        <div
          key={journal.id}
          className={cn(
            "group flex items-center gap-1 px-3 py-1.5 border-r border-border cursor-pointer transition-colors",
            "hover:bg-accent/30",
            activeTabId === journal.id 
              ? "bg-background border-t-2 border-t-primary -mb-px" 
              : "bg-muted/50"
          )}
          onClick={() => onSelectTab(journal.id)}
        >
          <span className="text-sm shrink-0">{journal.icon}</span>
          <span className="text-xs truncate max-w-24">{journal.title}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCloseTab(journal.id);
            }}
            className="ml-1 p-0.5 rounded hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
    </div>
  );
};
