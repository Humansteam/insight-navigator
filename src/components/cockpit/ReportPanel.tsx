import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ReasoningProcess } from './ReasoningProcess';
import { mockSearchQueries, mockExtractionDimensions } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface ReportPanelProps {
  markdown: string;
  isGenerating: boolean;
  onCitationHover: (paperId: string | null) => void;
  onCitationClick: (paperId: string) => void;
  query?: string;
  totalPapers?: number;
}

export const ReportPanel = ({ 
  markdown, 
  isGenerating, 
  onCitationHover, 
  onCitationClick,
  query = 'Advanced Composite Materials in Aerospace, Focus on China vs. USA',
  totalPapers = 42,
}: ReportPanelProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [reasoningStage, setReasoningStage] = useState<'searching' | 'extracting' | 'complete'>('extracting');

  useEffect(() => {
    if (!markdown) {
      setDisplayedText('');
      return;
    }

    let index = 0;
    const interval = setInterval(() => {
      if (index < markdown.length) {
        setDisplayedText(markdown.slice(0, index + 20));
        index += 20;
      } else {
        clearInterval(interval);
        setReasoningStage('complete');
      }
    }, 8);

    return () => clearInterval(interval);
  }, [markdown]);

  const renderContent = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];

    lines.forEach((line, i) => {
      const citationRegex = /\[\[([^\]]+)\]\]/g;
      
      const renderWithCitations = (content: string) => {
        const parts = content.split(citationRegex);
        return parts.map((part, j) => {
          if (j % 2 === 1) {
            return (
              <button
                key={j}
                className="inline-flex items-center px-1 py-0 mx-0.5 rounded bg-primary/20 text-primary text-[11px] font-mono hover:bg-primary/30 transition-colors"
                onMouseEnter={() => onCitationHover(part)}
                onMouseLeave={() => onCitationHover(null)}
                onClick={() => onCitationClick(part)}
              >
                [{part.replace('paper-', '')}]
              </button>
            );
          }
          const boldParts = part.split(/\*\*([^*]+)\*\*/g);
          return boldParts.map((bp, k) => 
            k % 2 === 1 ? <strong key={`${j}-${k}`} className="text-foreground font-semibold">{bp}</strong> : bp
          );
        });
      };

      if (line.startsWith('## ')) {
        elements.push(
          <h2 key={i} className="text-sm font-semibold text-primary mt-6 mb-3 first:mt-0">
            {line.replace('## ', '')}
          </h2>
        );
        return;
      }
      if (line.startsWith('### ')) {
        elements.push(
          <h3 key={i} className="text-sm font-medium text-foreground mt-4 mb-2">
            {line.replace('### ', '')}
          </h3>
        );
        return;
      }

      if (line.startsWith('---')) {
        elements.push(<hr key={i} className="border-border my-4" />);
        return;
      }

      if (line.match(/^\d+\.\s/)) {
        elements.push(
          <li key={i} className="text-sm text-muted-foreground ml-4 mb-1 list-decimal list-inside">
            {renderWithCitations(line.replace(/^\d+\.\s/, ''))}
          </li>
        );
        return;
      }
      if (line.startsWith('- ')) {
        elements.push(
          <li key={i} className="text-sm text-muted-foreground ml-4 mb-1 list-disc list-inside">
            {renderWithCitations(line.replace('- ', ''))}
          </li>
        );
        return;
      }

      if (line.trim() === '') {
        elements.push(<div key={i} className="h-2" />);
        return;
      }

      elements.push(
        <p key={i} className="text-sm text-muted-foreground leading-relaxed mb-2">
          {renderWithCitations(line)}
        </p>
      );
    });

    return elements;
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Report Header */}
      <div className="p-4 border-b border-border space-y-2 shrink-0">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Report Header</span>
          <Badge variant="outline" className="text-[10px] h-4 px-1.5">Block 1</Badge>
        </div>
        <div className="text-xs">
          <span className="text-muted-foreground">Query: </span>
          <span className="text-foreground">{query}</span>
        </div>
        <div className="text-xs">
          <span className="text-muted-foreground">Query Type: </span>
          <span className="text-foreground">Materials Science & Geopolitics</span>
        </div>
        <div className="text-xs">
          <span className="text-muted-foreground">Total Papers: </span>
          <span className="text-foreground">{totalPapers}</span>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          <span className="text-xs text-muted-foreground">Dimensions:</span>
          {mockExtractionDimensions.slice(0, 4).map((dim) => (
            <Badge key={dim} variant="secondary" className="text-[10px] h-5">
              {dim}
            </Badge>
          ))}
        </div>
      </div>

      {/* Live Progress - Timeline */}
      <div className="px-4 py-3 border-b border-border bg-muted/30">
        <div className="text-xs text-muted-foreground mb-3">Live Progress</div>
        
        {/* Timeline */}
        <div className="relative">
          {/* Base line */}
          <div className="absolute top-1.5 left-0 right-0 h-[2px] bg-muted-foreground/20" />
          {/* Progress line */}
          <div className="absolute top-1.5 left-0 h-[2px] bg-primary transition-all duration-500" style={{ width: '62%' }} />
          
          {/* Steps on the line */}
          <div className="relative flex justify-between">
            {[
              { name: 'Planner', status: 'complete', detail: 'Defined Dimensions' },
              { name: 'Retriever', status: 'complete', detail: `${totalPapers} Papers Found` },
              { name: 'Extraction', status: 'active', detail: '85% Complete' },
              { name: 'Synthesis', status: 'pending', detail: 'In Progress...' },
            ].map((step) => (
              <div key={step.name} className="flex flex-col items-center">
                {/* Dot on line */}
                <div className={cn(
                  "w-3 h-3 rounded-full border-2 bg-background z-10",
                  step.status === 'complete' && "border-primary bg-primary",
                  step.status === 'active' && "border-primary bg-background shadow-[0_0_8px_hsl(var(--primary)/0.6)]",
                  step.status === 'pending' && "border-muted-foreground/30 bg-background"
                )}>
                  {step.status === 'active' && (
                    <div className="w-full h-full rounded-full bg-primary animate-pulse scale-50" />
                  )}
                </div>
                
                {/* Label below */}
                <div className={cn(
                  "text-[10px] font-medium mt-1.5 whitespace-nowrap",
                  step.status === 'complete' && "text-primary",
                  step.status === 'active' && "text-primary",
                  step.status === 'pending' && "text-muted-foreground/50"
                )}>
                  {step.name}
                </div>
                <div className={cn(
                  "text-[9px] whitespace-nowrap",
                  step.status === 'pending' ? "text-muted-foreground/40" : "text-muted-foreground"
                )}>
                  {step.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reasoning Process */}
      <ReasoningProcess
        isActive={isGenerating}
        stage={reasoningStage}
        searchQueries={mockSearchQueries}
        dimensions={mockExtractionDimensions}
        papersFound={totalPapers}
      />

      {/* Report Content */}
      <div className="flex-1 overflow-y-auto p-4 min-h-0">
        {displayedText ? (
          <div className="max-w-none">
            {renderContent(displayedText)}
            {displayedText.length < markdown.length && (
              <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-0.5" />
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <Loader2 className="w-8 h-8 mb-3 animate-spin opacity-30" />
            <p className="text-sm">Генерация отчёта...</p>
          </div>
        )}
      </div>
    </div>
  );
};