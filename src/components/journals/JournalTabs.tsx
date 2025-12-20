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
    <div className="h-8 border-b border-border bg-muted/30 flex items-stretch overflow-x-auto">
      {openTabs.map((journal) => (
        <div
          key={journal.id}
          className={cn(
            "group flex items-center gap-2 px-3 border-r border-border cursor-pointer transition-colors min-w-0 max-w-48",
            "hover:bg-accent/30",
            activeTabId === journal.id 
              ? "bg-background" 
              : "bg-muted/50"
          )}
          onClick={() => onSelectTab(journal.id)}
        >
          <span className="truncate text-xs">{journal.icon} {journal.title}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCloseTab(journal.id);
            }}
            className="p-0.5 rounded hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
    </div>
  );
};
