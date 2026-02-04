import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Database, 
  FileText, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ToolCallArtifact } from './types';

interface ToolCallCardProps {
  data: ToolCallArtifact;
  onOpenDetails?: () => void;
}

const toolIcons: Record<string, React.ReactNode> = {
  search: <Search className="w-3.5 h-3.5" />,
  database: <Database className="w-3.5 h-3.5" />,
  file: <FileText className="w-3.5 h-3.5" />,
  default: <FileText className="w-3.5 h-3.5" />,
};

const toolLabels: Record<string, string> = {
  semantic_search: 'Поиск по базе',
  cluster_analysis: 'Анализ кластера',
  paper_extraction: 'Извлечение данных',
  topology_build: 'Построение топологии',
  report_generate: 'Генерация отчёта',
};

export function ToolCallCard({ data, onOpenDetails }: ToolCallCardProps) {
  const { toolName, status, output } = data;
  
  const getIcon = () => {
    if (toolName.includes('search')) return toolIcons.search;
    if (toolName.includes('database') || toolName.includes('cluster')) return toolIcons.database;
    return toolIcons.default;
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'running':
        return <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />;
      case 'complete':
        return <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-3.5 h-3.5 text-destructive" />;
      default:
        return null;
    }
  };

  return (
    <Card className={cn(
      "border-border bg-muted/30 overflow-hidden transition-all",
      status === 'running' && "border-primary/30 bg-primary/5"
    )}>
      <CardContent className="p-2.5">
        <div className="flex items-center gap-2">
          {/* Icon */}
          <div className={cn(
            "w-7 h-7 rounded-md flex items-center justify-center shrink-0",
            status === 'pending' && "bg-muted text-muted-foreground",
            status === 'running' && "bg-primary/20 text-primary",
            status === 'complete' && "bg-green-500/20 text-green-500",
            status === 'error' && "bg-destructive/20 text-destructive"
          )}>
            {getIcon()}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-foreground">
                {toolLabels[toolName] || toolName}
              </span>
              {getStatusIcon()}
            </div>
            
            {output && (
              <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                {output.summary}
              </p>
            )}
          </div>

          {/* Action */}
          {status === 'complete' && output && (
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-6 px-2 text-[10px] shrink-0"
              onClick={onOpenDetails}
            >
              {output.count && `${output.count} результатов`}
              <ChevronRight className="w-3 h-3 ml-1" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Agent Action Ribbon - sidebar for live tool calls
interface AgentRibbonProps {
  calls: ToolCallArtifact[];
  isExpanded?: boolean;
  onToggle?: () => void;
}

export function AgentRibbon({ calls, isExpanded = false, onToggle }: AgentRibbonProps) {
  const activeCall = calls.find(c => c.status === 'running');
  const completedCount = calls.filter(c => c.status === 'complete').length;

  if (!isExpanded) {
    return (
      <button
        onClick={onToggle}
        className={cn(
          "fixed right-4 top-1/2 -translate-y-1/2 z-40",
          "w-10 h-24 rounded-l-lg border border-border bg-card shadow-lg",
          "flex flex-col items-center justify-center gap-1",
          "hover:bg-muted transition-colors",
          activeCall && "border-primary/50 bg-primary/5"
        )}
      >
        <Database className="w-4 h-4 text-muted-foreground" />
        <Badge variant="secondary" className="text-[9px] h-4 px-1">
          {completedCount}/{calls.length}
        </Badge>
        {activeCall && (
          <Loader2 className="w-3 h-3 animate-spin text-primary" />
        )}
      </button>
    );
  }

  return (
    <div className="fixed right-0 top-0 h-full w-64 border-l border-border bg-card shadow-lg z-40">
      <div className="p-3 border-b border-border flex items-center justify-between">
        <span className="text-xs font-medium">Agent Actions</span>
        <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={onToggle}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="p-3 space-y-2 overflow-auto max-h-[calc(100vh-48px)]">
        {calls.map((call, i) => (
          <ToolCallCard key={i} data={call} />
        ))}
      </div>
    </div>
  );
}
