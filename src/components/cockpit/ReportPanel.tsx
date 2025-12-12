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

      {/* Live Progress */}
      <div className="px-4 py-2 border-b border-border bg-muted/30">
        <div className="text-xs text-muted-foreground mb-1">Live Progress</div>
        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: '85%' }} />
        </div>
        <div className="text-[10px] text-muted-foreground mt-1">
          Planner: Defined Dimensions → Retriever: {totalPapers} Papers Found → Extraction: 85% Complete → Synthesis: In Progress...
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