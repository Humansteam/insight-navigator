import { useState } from 'react';
import { File, Folder, FileText, X, ArrowLeft, Eye, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { DocumentItem } from './DocumentSelector';

interface DocumentContextPanelProps {
  documents: DocumentItem[];
  onClose?: () => void;
}

// Mock content for document preview
const mockDocumentContent: Record<string, { pages: number; preview: string[] }> = {
  'Lithium Battery Analysis.pdf': {
    pages: 45,
    preview: [
      '## 1. Executive Summary\n\nThis report provides a comprehensive analysis of lithium-ion battery technologies, covering current market trends, technical specifications, and future outlook.\n\n### Key Findings\n- Global Li-ion market reached $56.8B in 2024\n- Energy density improved by 12% year-over-year\n- Manufacturing costs decreased 35% over 5 years',
      '## 2. Technical Specifications\n\n| Parameter | Value | Unit |\n|-----------|-------|------|\n| Energy Density | 250-300 | Wh/kg |\n| Cycle Life | 1000-2000 | cycles |\n| Charge Rate | 1C-3C | — |\n| Operating Temp | -20 to 60 | °C |\n\nModern lithium-ion cells demonstrate significant improvements in volumetric energy density...',
      '## 3. Market Analysis\n\nThe battery market is experiencing exponential growth driven by EV adoption and grid storage demands.\n\n> "We expect the global battery market to exceed $150B by 2030" — Bloomberg NEF\n\n### Regional Breakdown\n- **China**: 65% of global production\n- **Europe**: 15%, growing rapidly\n- **USA**: 12%, supported by IRA incentives',
    ],
  },
  'Solid-State Electrolytes.pdf': {
    pages: 18,
    preview: [
      '## Abstract\n\nSolid-state electrolytes represent the next frontier in battery technology, offering improved safety and energy density over conventional liquid electrolytes.\n\n### Research Highlights\n- Ionic conductivity exceeding 10 mS/cm at room temperature\n- 80% reduction in fire risk compared to liquid electrolytes\n- Commercial viability expected by 2028',
    ],
  },
  'Manufacturing Processes.pdf': {
    pages: 67,
    preview: [
      '## Manufacturing Overview\n\nModern battery manufacturing involves several critical stages:\n\n1. **Electrode Preparation** — Slurry mixing, coating, and calendering\n2. **Cell Assembly** — Stacking/winding, electrolyte filling\n3. **Formation** — Initial charging and aging\n4. **Quality Control** — Capacity testing, impedance measurement\n\n### Cost Breakdown\n| Stage | Cost Share |\n|-------|------------|\n| Materials | 60% |\n| Manufacturing | 25% |\n| Overhead | 15% |',
    ],
  },
  'Q4 Performance Report.pdf': {
    pages: 24,
    preview: [
      '## Q4 2024 Performance Summary\n\n### Revenue\n- Total Revenue: $12.4M (+18% QoQ)\n- Recurring Revenue: $8.2M\n- New Contracts: 14\n\n### Key Metrics\n| Metric | Q3 | Q4 | Change |\n|--------|-----|-----|--------|\n| MRR | $2.5M | $2.9M | +16% |\n| Churn | 3.2% | 2.8% | -0.4pp |\n| NPS | 72 | 78 | +6 |',
    ],
  },
};

const getDocumentPreview = (name: string) => {
  return mockDocumentContent[name] || {
    pages: Math.floor(Math.random() * 30) + 5,
    preview: [`## ${name}\n\nDocument content preview is not available for this file type. Click "Open" to view the full document.`],
  };
};

const DocumentContextPanel = ({ documents, onClose }: DocumentContextPanelProps) => {
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [activePage, setActivePage] = useState(0);

  // Flatten documents for display (extract files from folders)
  const allFiles = documents.flatMap((doc) =>
    doc.type === 'folder' && doc.children ? doc.children : [doc]
  );

  const preview = selectedDoc ? getDocumentPreview(selectedDoc.name) : null;

  return (
    <div className="h-full flex flex-col border-l border-border bg-background">
      <AnimatePresence mode="wait">
        {selectedDoc && preview ? (
          /* Document Preview Mode */
          <motion.div
            key="preview"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.15 }}
            className="h-full flex flex-col"
          >
            {/* Preview Header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0"
                onClick={() => setSelectedDoc(null)}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{selectedDoc.name}</p>
                <p className="text-xs text-muted-foreground">{preview.pages} pages</p>
              </div>
            </div>

            {/* Page Navigation */}
            {preview.preview.length > 1 && (
              <div className="flex items-center gap-1 px-4 py-2 border-b border-border/50 bg-muted/20">
                {preview.preview.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActivePage(i)}
                    className={cn(
                      'px-2.5 py-1 text-xs rounded-md transition-colors',
                      activePage === i
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted'
                    )}
                  >
                    p.{i + 1}
                  </button>
                ))}
              </div>
            )}

            {/* Document Content */}
            <ScrollArea className="flex-1">
              <div className="p-5">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  {preview.preview[activePage]?.split('\n').map((line, i) => {
                    if (line.startsWith('## ')) {
                      return <h2 key={i} className="text-base font-semibold text-foreground mt-0 mb-3">{line.replace('## ', '')}</h2>;
                    }
                    if (line.startsWith('### ')) {
                      return <h3 key={i} className="text-sm font-medium text-foreground mt-4 mb-2">{line.replace('### ', '')}</h3>;
                    }
                    if (line.startsWith('> ')) {
                      return (
                        <blockquote key={i} className="border-l-2 border-primary/40 pl-3 my-3 text-sm text-muted-foreground italic">
                          {line.replace('> ', '')}
                        </blockquote>
                      );
                    }
                    if (line.startsWith('| ')) {
                      return (
                        <div key={i} className="text-xs font-mono text-foreground/80 py-0.5">
                          {line}
                        </div>
                      );
                    }
                    if (line.startsWith('- **')) {
                      const match = line.match(/- \*\*(.+?)\*\*[:\s—]*(.*)/);
                      if (match) {
                        return (
                          <div key={i} className="flex gap-2 text-sm py-0.5">
                            <span className="font-medium text-foreground">{match[1]}:</span>
                            <span className="text-muted-foreground">{match[2]}</span>
                          </div>
                        );
                      }
                    }
                    if (line.startsWith('- ')) {
                      return (
                        <div key={i} className="flex items-start gap-2 text-sm py-0.5 text-foreground/80">
                          <span className="text-muted-foreground mt-1.5">•</span>
                          {line.replace('- ', '')}
                        </div>
                      );
                    }
                    if (line.match(/^\d+\. \*\*/)) {
                      const match = line.match(/^(\d+)\. \*\*(.+?)\*\*\s*[—-]?\s*(.*)/);
                      if (match) {
                        return (
                          <div key={i} className="flex gap-2 text-sm py-1">
                            <span className="text-muted-foreground shrink-0">{match[1]}.</span>
                            <div>
                              <span className="font-medium text-foreground">{match[2]}</span>
                              {match[3] && <span className="text-muted-foreground"> — {match[3]}</span>}
                            </div>
                          </div>
                        );
                      }
                    }
                    if (line.trim() === '') return <div key={i} className="h-2" />;
                    return <p key={i} className="text-sm text-foreground/80 leading-relaxed my-1">{line}</p>;
                  })}
                </div>
              </div>
            </ScrollArea>
          </motion.div>
        ) : (
          /* Documents List Mode */
          <motion.div
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.15 }}
            className="h-full flex flex-col"
          >
            {/* List Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Context</span>
              </div>
              <span className="text-xs text-muted-foreground">{allFiles.length} files</span>
            </div>

            {/* Documents List */}
            <ScrollArea className="flex-1">
              <div className="p-2">
                {documents.map((doc) => {
                  if (doc.type === 'folder' && doc.children) {
                    return (
                      <div key={doc.id} className="mb-1">
                        {/* Folder header */}
                        <div className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground">
                          <Folder className="w-3.5 h-3.5" />
                          <span className="font-medium uppercase tracking-wide">{doc.name}</span>
                        </div>
                        {/* Folder children */}
                        {doc.children.map((child) => (
                          <button
                            key={child.id}
                            onClick={() => {
                              setSelectedDoc(child);
                              setActivePage(0);
                            }}
                            className={cn(
                              'w-full flex items-center gap-2.5 px-3 py-2.5 ml-2 rounded-lg',
                              'text-left hover:bg-muted/50 transition-colors group'
                            )}
                          >
                            <File className="w-4 h-4 text-muted-foreground shrink-0" />
                            <span className="text-sm text-foreground truncate flex-1">{child.name}</span>
                            <Eye className="w-3.5 h-3.5 text-muted-foreground/0 group-hover:text-muted-foreground transition-colors shrink-0" />
                          </button>
                        ))}
                      </div>
                    );
                  }
                  return (
                    <button
                      key={doc.id}
                      onClick={() => {
                        setSelectedDoc(doc);
                        setActivePage(0);
                      }}
                      className={cn(
                        'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg',
                        'text-left hover:bg-muted/50 transition-colors group'
                      )}
                    >
                      <File className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span className="text-sm text-foreground truncate flex-1">{doc.name}</span>
                      <Eye className="w-3.5 h-3.5 text-muted-foreground/0 group-hover:text-muted-foreground transition-colors shrink-0" />
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DocumentContextPanel;
