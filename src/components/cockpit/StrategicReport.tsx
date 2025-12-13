import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ExecutiveSummary, TRLData, ConflictData, GapData, StrategicHorizonData } from './ExecutiveSummary';
import { mockTRLData, mockConflicts, mockGaps, mockStrategicHorizon } from '@/data/mockData';

interface StrategicReportProps {
  markdown: string;
  onCitationHover: (paperId: string | null) => void;
  onCitationClick: (paperId: string) => void;
  trlData?: TRLData[];
  conflicts?: ConflictData[];
  gaps?: GapData[];
  strategicHorizon?: StrategicHorizonData;
}

export const StrategicReport = ({ 
  markdown, 
  onCitationHover, 
  onCitationClick,
  trlData = mockTRLData,
  conflicts = mockConflicts,
  gaps = mockGaps,
  strategicHorizon = mockStrategicHorizon
}: StrategicReportProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showExecutiveSummary, setShowExecutiveSummary] = useState(false);

  // Show executive summary after typing completes
  useEffect(() => {
    if (!isTyping) {
      const timer = setTimeout(() => setShowExecutiveSummary(true), 500);
      return () => clearTimeout(timer);
    }
  }, [isTyping]);

  useEffect(() => {
    setIsTyping(true);
    let index = 0;
    const interval = setInterval(() => {
      if (index < markdown.length) {
        setDisplayedText(markdown.slice(0, index + 10));
        index += 10;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 5);

    return () => clearInterval(interval);
  }, [markdown]);

  const renderMarkdown = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let inTable = false;
    let tableRows: string[] = [];

    const renderLine = (line: string, key: number) => {
      // Citation handling
      const citationRegex = /\[\[([^\]]+)\]\]/g;
      const parts = line.split(citationRegex);
      
      const rendered = parts.map((part, i) => {
        if (i % 2 === 1) {
          return (
            <button
              key={i}
              className="inline-flex items-center px-1.5 py-0.5 mx-0.5 rounded bg-primary/20 text-primary text-xs font-mono hover:bg-primary/30 transition-colors"
              onMouseEnter={() => onCitationHover(part)}
              onMouseLeave={() => onCitationHover(null)}
              onClick={() => onCitationClick(part)}
            >
              [{part.replace('paper-', '')}]
            </button>
          );
        }
        return <span key={i}>{part}</span>;
      });

      return <>{rendered}</>;
    };

    lines.forEach((line, i) => {
      // Table detection
      if (line.startsWith('|')) {
        if (!inTable) {
          inTable = true;
          tableRows = [];
        }
        tableRows.push(line);
        return;
      } else if (inTable) {
        // Render accumulated table
        elements.push(renderTable(tableRows, elements.length));
        inTable = false;
        tableRows = [];
      }

      // Headers
      if (line.startsWith('## ')) {
        elements.push(
          <h2 key={i} className="text-lg font-semibold text-foreground mt-6 mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-primary rounded-full" />
            {line.replace('## ', '')}
          </h2>
        );
        return;
      }
      if (line.startsWith('### ')) {
        elements.push(
          <h3 key={i} className="text-sm font-semibold text-foreground mt-4 mb-2 text-primary/90">
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

      // Bold text handling
      const boldRegex = /\*\*([^*]+)\*\*/g;
      let processedLine = line;
      const boldMatches = line.match(boldRegex);
      if (boldMatches) {
        processedLine = line.replace(boldRegex, '<strong class="text-foreground font-semibold">$1</strong>');
      }

      // Lists
      if (line.match(/^\d+\.\s/)) {
        elements.push(
          <li key={i} className="text-muted-foreground ml-4 mb-1 list-decimal list-inside">
            {renderLine(line.replace(/^\d+\.\s/, ''), i)}
          </li>
        );
        return;
      }
      if (line.startsWith('- ')) {
        elements.push(
          <li key={i} className="text-muted-foreground ml-4 mb-1 list-disc list-inside">
            {renderLine(line.replace('- ', ''), i)}
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
        <p key={i} className="text-muted-foreground leading-relaxed mb-2">
          {renderLine(line, i)}
        </p>
      );
    });

    // Handle remaining table
    if (inTable && tableRows.length > 0) {
      elements.push(renderTable(tableRows, elements.length));
    }

    return elements;
  };

  const renderTable = (rows: string[], key: number) => {
    if (rows.length < 2) return null;
    
    const headers = rows[0].split('|').filter(c => c.trim());
    const dataRows = rows.slice(2).map(row => row.split('|').filter(c => c.trim()));

    return (
      <div key={key} className="overflow-x-auto my-4">
        <table className="w-full text-sm border border-card-border rounded">
          <thead>
            <tr className="bg-muted/30">
              {headers.map((h, i) => (
                <th key={i} className="text-left p-2 text-xs font-medium text-muted-foreground border-b border-card-border">
                  {h.trim()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataRows.map((row, i) => (
              <tr key={i} className="border-b border-card-border/50">
                {row.map((cell, j) => (
                  <td key={j} className="p-2 text-muted-foreground font-mono text-xs">
                    {cell.trim()}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="card-elevated rounded-lg overflow-hidden"
    >
      {/* Header */}
      <div className="p-3 border-b border-card-border flex items-center gap-2">
        <FileText className="w-4 h-4 text-primary" />
        <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Strategic Report</span>
        {isTyping && (
          <span className="text-xs text-primary animate-pulse font-mono">generating...</span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 prose prose-sm prose-invert max-w-none">
        {renderMarkdown(displayedText)}
        {isTyping && <span className="cursor-blink" />}
        
        {/* Executive Summary - Meta-Synthesis Layer */}
        {showExecutiveSummary && (
          <ExecutiveSummary
            trlData={trlData}
            conflicts={conflicts}
            gaps={gaps}
            strategicHorizon={strategicHorizon}
            onCitationHover={onCitationHover}
            onCitationClick={onCitationClick}
          />
        )}
      </div>
    </motion.div>
  );
};
