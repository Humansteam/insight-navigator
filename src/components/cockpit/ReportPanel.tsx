import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReportPanelProps {
  markdown: string;
  isGenerating: boolean;
  onCitationHover: (paperId: string | null) => void;
  onCitationClick: (paperId: string) => void;
}

export const ReportPanel = ({ markdown, isGenerating, onCitationHover, onCitationClick }: ReportPanelProps) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    if (!markdown) {
      setDisplayedText('');
      return;
    }

    let index = 0;
    const interval = setInterval(() => {
      if (index < markdown.length) {
        setDisplayedText(markdown.slice(0, index + 15));
        index += 15;
      } else {
        clearInterval(interval);
      }
    }, 8);

    return () => clearInterval(interval);
  }, [markdown]);

  const renderContent = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];

    lines.forEach((line, i) => {
      // Citation handling
      const citationRegex = /\[\[([^\]]+)\]\]/g;
      
      const renderWithCitations = (content: string) => {
        const parts = content.split(citationRegex);
        return parts.map((part, j) => {
          if (j % 2 === 1) {
            return (
              <button
                key={j}
                className="inline-flex items-center px-1.5 py-0.5 mx-0.5 rounded bg-primary/20 text-primary text-xs font-mono hover:bg-primary/30 transition-colors"
                onMouseEnter={() => onCitationHover(part)}
                onMouseLeave={() => onCitationHover(null)}
                onClick={() => onCitationClick(part)}
              >
                [{part.replace('paper-', '')}]
              </button>
            );
          }
          // Handle bold text
          const boldParts = part.split(/\*\*([^*]+)\*\*/g);
          return boldParts.map((bp, k) => 
            k % 2 === 1 ? <strong key={`${j}-${k}`} className="text-foreground font-semibold">{bp}</strong> : bp
          );
        });
      };

      // Headers
      if (line.startsWith('## ')) {
        elements.push(
          <h2 key={i} className="text-base font-semibold text-foreground mt-5 mb-2 flex items-center gap-2 first:mt-0">
            <span className="w-1 h-4 bg-primary rounded-full" />
            {line.replace('## ', '')}
          </h2>
        );
        return;
      }
      if (line.startsWith('### ')) {
        elements.push(
          <h3 key={i} className="text-sm font-medium text-primary/90 mt-3 mb-1.5">
            {line.replace('### ', '')}
          </h3>
        );
        return;
      }

      // Horizontal rule
      if (line.startsWith('---')) {
        elements.push(<hr key={i} className="border-card-border my-4" />);
        return;
      }

      // Lists
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

      // Empty lines
      if (line.trim() === '') {
        elements.push(<div key={i} className="h-2" />);
        return;
      }

      // Regular paragraphs
      elements.push(
        <p key={i} className="text-sm text-muted-foreground leading-relaxed mb-2">
          {renderWithCitations(line)}
        </p>
      );
    });

    return elements;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b border-border flex items-center gap-2 shrink-0">
        <FileText className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-foreground">Стратегический отчёт</span>
        {isGenerating && (
          <div className="flex items-center gap-1.5 ml-auto">
            <Loader2 className="w-3 h-3 text-primary animate-spin" />
            <span className="text-xs text-primary font-mono">генерация...</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 min-h-0">
        {displayedText ? (
          <div className="prose prose-sm prose-invert max-w-none">
            {renderContent(displayedText)}
            {displayedText.length < markdown.length && (
              <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-0.5" />
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <FileText className="w-10 h-10 mb-3 opacity-30" />
            <p className="text-sm">Введите запрос в чат для генерации отчёта</p>
          </div>
        )}
      </div>
    </div>
  );
};
