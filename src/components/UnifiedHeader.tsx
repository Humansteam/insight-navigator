import { Link } from 'react-router-dom';
import { Languages, PanelRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { ReportView } from '@/components/papers-screening/types';

interface ViewOption {
  id: ReportView;
  label: string;
  icon: React.ReactNode;
}

interface UnifiedHeaderProps {
  activeView: ReportView;
  setActiveView: (view: ReportView) => void;
  viewOptions: ViewOption[];
  projectTitle: string;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

const viewLabels: Record<ReportView, string> = {
  report: 'Research Report',
  topology: 'Knowledge Graph',
  papers: 'Paper Screening',
  notes: 'Research Journals',
  timeline: 'Project Timeline',
};

export const UnifiedHeader = ({
  activeView,
  setActiveView,
  viewOptions,
  projectTitle,
  isSidebarOpen,
  setIsSidebarOpen,
}: UnifiedHeaderProps) => {
  return (
    <header className="h-14 flex items-center border-b border-border bg-background">
      {/* Column 1: App Name - matches left panel width (434px) */}
      <div className="w-[434px] flex items-center px-4 border-r border-border h-full flex-shrink-0">
        <Link
          to="/"
          className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
        >
          <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-bold text-sm">S</span>
          </div>
          <span className="font-semibold text-base">Stata</span>
        </Link>
      </div>

      {/* Column 2: Project Title + Navigation + Actions - flex to fill between sidebars */}
      <div className="flex-1 flex items-center justify-between px-4 h-full border-r border-border">
        <div className="flex items-center gap-4">
          {/* Project Title */}
          <h2 className="text-sm font-medium text-foreground truncate max-w-[240px]" title={projectTitle}>
            {projectTitle}
          </h2>

          {/* Navigation Tabs */}
          <div className="flex bg-muted/50 rounded-lg p-0.5">
            {viewOptions.map((view) => (
              <button
                key={view.id}
                onClick={() => setActiveView(view.id)}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all",
                  activeView === view.id
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {view.icon}
                {view.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Link
            to="/translate"
            className="w-9 h-9 rounded-lg border border-border flex items-center justify-center hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
            title="Translate"
          >
            <Languages className="w-4 h-4" />
          </Link>
          <ThemeSwitcher />
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={cn(
              "w-9 h-9 rounded-lg border flex items-center justify-center transition-colors",
              isSidebarOpen
                ? "bg-secondary border-border"
                : "bg-background border-border hover:bg-accent"
            )}
          >
            <PanelRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Column 3: Section Label - matches right sidebar width (360px) */}
      <div 
        className={cn(
          "flex items-center justify-end px-4 h-full flex-shrink-0 transition-all duration-300",
          isSidebarOpen ? "w-[360px]" : "w-0 overflow-hidden px-0"
        )}
      >
        <span className="text-sm text-muted-foreground font-medium truncate">
          {viewLabels[activeView]}
        </span>
      </div>
    </header>
  );
};
