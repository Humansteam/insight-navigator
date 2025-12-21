import { useState, useMemo, useRef, useCallback } from 'react';
import { ChevronRight, PanelRight, Loader2, Languages, FileText, FileSearch, Network, Clock, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockNodes, mockEdges } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { InlinePaperCard } from '@/components/cockpit/InlinePaperCard';
import { PipelineDAG } from '@/components/cockpit/PipelineDAG';
import { EvidenceMatrixPanel } from '@/components/cockpit/EvidenceMatrixPanel';
import { useEngineData } from '@/hooks/useEngineData';
import { DataNode } from '@/types/morphik';
import { PapersScreeningMain } from '@/components/papers-screening';
import { TopologyMain } from '@/components/topology';
import { ReportView } from '@/components/papers-screening/types';
import { ReportChatPanel } from '@/components/report';
import { JournalsWorkspaceProvider, JournalsLeftPanel, JournalsMainPanel, TextSelectionTooltip } from '@/components/journals';

const Index = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState<ReportView>('report');
  const [graphHoveredPaperId, setGraphHoveredPaperId] = useState<string | null>(null);
  const [listHoveredPaperId, setListHoveredPaperId] = useState<string | null>(null);
  
  // Ref for report content - used for text selection
  const reportContentRef = useRef<HTMLDivElement>(null);
  
  // Debounce timer for graph hover (only show details after 300ms)
  const graphHoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const handleGraphHover = useCallback((id: string | null) => {
    // Clear any pending timer
    if (graphHoverTimerRef.current) {
      clearTimeout(graphHoverTimerRef.current);
      graphHoverTimerRef.current = null;
    }
    
    if (id === null) {
      // Immediate clear when leaving
      setGraphHoveredPaperId(null);
    } else {
      // Delay showing details by 300ms
      graphHoverTimerRef.current = setTimeout(() => {
        setGraphHoveredPaperId(id);
      }, 300);
    }
  }, []);
  
  // Combined hover for graph highlighting (immediate) vs panel details (debounced)
  const [graphHighlightId, setGraphHighlightId] = useState<string | null>(null);
  
  const handleGraphNodeHover = useCallback((id: string | null) => {
    // Immediate highlight on graph
    setGraphHighlightId(id);
    // Debounced detail view
    handleGraphHover(id);
  }, [handleGraphHover]);

  // Engine data hook
  const {
    phase,
    papers: enginePapers,
    dimensions,
    topology,
    report,
    error,
    isLoading,
    input,
    setInput,
    handleSubmit,
  } = useEngineData();

  // Use engine papers if available, otherwise mock data
  const papers = enginePapers.length > 0 ? enginePapers : mockNodes;

  // Helper to get paper by id
  const getPaperById = (id: string) => papers.find(p => p.id === id);
  const getPaperIndex = (id: string) => papers.findIndex(p => p.id === id) + 1;

  // Progress dots based on phase
  const phaseDots = useMemo(() => {
    const phases = ['planning', 'retrieval', 'schema_design', 'extraction', 'topology', 'synthesis'];
    const currentIndex = phases.indexOf(phase);
    return phases.map((_, i) => i <= currentIndex || phase === 'complete');
  }, [phase]);

  // Inline paper reference component
  const PaperReference = ({ id }: { id: string }) => {
    const paper = getPaperById(id);
    if (!paper) return null;
    return <InlinePaperCard paper={paper} index={getPaperIndex(id)} />;
  };

  // Dynamic paper reference by index
  const DynamicPaperRef = ({ index }: { index: number }) => {
    const paper = papers[index];
    if (!paper) return null;
    return <InlinePaperCard paper={paper} index={index + 1} />;
  };

  // Render report content - dynamic when engine data available
  const renderReportContent = () => {
    // If we have engine report with structured data, render it
    if (report?.title || report?.markdown) {
      return (
        <EngineReportRenderer
          report={{
            title: report.title || 'Research Analysis',
            lead: report.lead || '',
            abstract: report.abstract || '',
            methodology: report.methodology || '',
            markdown: report.markdown || '',
          }}
          papers={papers}
        />
      );
    }

    // Default static content (mockData)
    return (
      <>
        {/* Title */}
        <h1 className="text-4xl font-serif font-normal text-foreground mb-6">
          Lithium Battery Research Analysis
        </h1>

        {/* Lead paragraph */}
        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
          The analysis reveals significant divergence in lithium battery research between major geopolitical regions.
          China leads in manufacturing scalability, while the United States demonstrates
          advantages in fundamental materials science.
        </p>

        {/* Abstract Section */}
        <SectionHeader title="ABSTRACT" />
        <p className="text-base text-foreground/90 leading-relaxed mb-6">
          This review synthesizes findings from 165,432 scientific articles examining lithium battery technology
          across industrial processing, recycling, and solid-state advances. Chinese research clusters around
          high-efficiency extraction methods with membrane-based DLE systems achieving 95% lithium recovery.
          Manufacturing optimization through AI monitoring shows 25% energy reduction. The highest recovery rates
          emerge from hydrometallurgical processes developed in US labs, achieving 99.2% Li, 98.8% Co recovery.
          A critical breakthrough exists in solid-state technology with Chinese protocols reporting 500 Wh/kg
          energy density.
        </p>

        {/* Methods Section */}
        <CollapsibleSection title="METHODS">
          <p className="text-base text-foreground/90 leading-relaxed">
            We analyzed {papers.length} sources from an initial pool of 165,432, using 5 screening criteria. Each paper was
            reviewed for {dimensions.length || 5} key aspects that mattered most to the research question.{' '}
            <span className="text-primary cursor-pointer hover:underline">More on methods</span>
          </p>
        </CollapsibleSection>

        {/* Results Section */}
        <SectionHeader title="RESULTS" />
        <h4 className="text-lg font-semibold text-foreground mb-2">Characteristics of Included Studies</h4>
        <p className="text-base text-foreground/90 leading-relaxed mb-6">
          This review includes {papers.length} sources examining lithium battery technology,
          covering industrial processing, solid-state electrolytes, and recycling methods.
        </p>

        {/* Thematic Analysis */}
        <h4 className="text-lg font-semibold text-foreground mt-8 mb-4">Thematic Analysis</h4>

        <h5 className="text-base font-semibold text-foreground mb-2">Industrial Processing and Manufacturing</h5>
        <p className="text-base text-foreground/90 leading-relaxed mb-2">
          Chinese research clusters around high-efficiency extraction methods with membrane-based DLE systems
          achieving 95% lithium recovery <Citation id="paper-001" />
        </p>
        <PaperReference id="paper-001" />

        <p className="text-base text-foreground/90 leading-relaxed mb-2">
          Manufacturing optimization through AI monitoring shows 25% energy reduction <Citation id="paper-002" />
        </p>
        <PaperReference id="paper-002" />

        <p className="text-base text-foreground/90 leading-relaxed mb-2">
          The highest recovery rates emerge from hydrometallurgical processes developed in US labs,
          achieving 99.2% Li, 98.8% Co recovery <Citation id="paper-003" />
        </p>
        <PaperReference id="paper-003" />

        <h5 className="text-base font-semibold text-foreground mb-2 mt-6">Solid-State Battery Advances</h5>
        <p className="text-base text-foreground/90 leading-relaxed mb-2">
          A critical breakthrough exists in solid-state technology. Chinese protocols report 500 Wh/kg
          energy density <Citation id="paper-007" />
        </p>
        <PaperReference id="paper-007" />

        <p className="text-base text-foreground/90 leading-relaxed mb-2">
          European artificial SEI enables 500 cycles at 99.2% efficiency <Citation id="paper-006" />
        </p>
        <PaperReference id="paper-006" />

        <h5 className="text-base font-semibold text-foreground mb-2 mt-6">Novel Materials Discovery</h5>
        <p className="text-base text-foreground/90 leading-relaxed mb-2">
          ML screening identifies 12 novel sulfide electrolytes with ionic conductivity exceeding 10 mS/cm <Citation id="paper-004" />
        </p>
        <PaperReference id="paper-004" />

        <p className="text-base text-foreground/90 leading-relaxed mb-2">
          Direct observation of dendrite nucleation mechanism at solid electrolyte interfaces provides
          crucial insights for battery safety <Citation id="paper-005" />
        </p>
        <PaperReference id="paper-005" />
      </>
    );
  };

  // View switcher options
  const viewOptions: { id: ReportView; label: string; icon: React.ReactNode }[] = [
    { id: 'report', label: 'Report', icon: <FileText className="w-3.5 h-3.5" /> },
    { id: 'topology', label: 'Topology', icon: <Network className="w-3.5 h-3.5" /> },
    { id: 'papers', label: 'Papers', icon: <FileSearch className="w-3.5 h-3.5" /> },
    { id: 'notes', label: 'Journals', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'timeline', label: 'Timeline', icon: <Clock className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="h-screen w-full flex bg-background relative">
      {/* Left Panel - fixed width to prevent header jumping */}
      <div className="w-96 border-r border-border bg-background">
{activeView === 'report' || activeView === 'topology' || activeView === 'papers' ? (
          <ReportChatPanel />
        ) : activeView === 'notes' ? (
          <JournalsWorkspaceProvider>
            <JournalsLeftPanel />
          </JournalsWorkspaceProvider>
        ) : (
          <div className="h-full" />
        )}
      </div>

      {/* Main Content Panel */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-14 flex items-center justify-between px-6 border-b border-border">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-medium text-foreground">
              {report?.title || 'Exploring Lithium Battery Research'}
            </h2>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex items-center gap-2">
            {/* View Switcher */}
            <div className="flex bg-muted/50 rounded-lg p-0.5 mr-2">
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
        </header>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto lovable-scrollbar">
          {isLoading && phase !== 'complete' ? (
            <PipelineDAG query={input || 'Analyzing...'} onComplete={() => {}} />
          ) : activeView === 'papers' ? (
            <PapersScreeningMain onPaperSelect={(id) => console.log('Selected paper:', id)} />
          ) : activeView === 'topology' ? (
            <TopologyMain
              nodes={papers}
              edges={mockEdges}
              externalHoveredNodeId={listHoveredPaperId || graphHighlightId}
              onExternalHoverNode={handleGraphNodeHover}
            />
          ) : activeView === 'notes' ? (
            <JournalsWorkspaceProvider>
              <JournalsMainPanel />
            </JournalsWorkspaceProvider>
          ) : activeView === 'timeline' ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Timeline view coming soon</p>
              </div>
            </div>
          ) : (
            <div ref={reportContentRef} className="max-w-3xl mx-auto px-8 py-10 relative">
              <TextSelectionTooltip
                containerRef={reportContentRef}
                source="report"
                sourceLabel="Research Report"
              />
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">
                {new Date()
                  .toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })
                  .toUpperCase()}
              </p>

              {error ? (
                <div className="text-red-500 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  Error: {error}
                </div>
              ) : (
                renderReportContent()
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar - hide for papers/notes/timeline */}
      {(activeView === 'report' || activeView === 'topology') && (
        <div
          className={cn(
            "border-l border-border flex flex-col transition-all duration-300 ease-in-out",
            isSidebarOpen ? "w-[360px]" : "w-0 overflow-hidden border-l-0"
          )}
        >
          <EvidenceMatrixPanel
            papers={papers}
            hoveredPaperId={graphHoveredPaperId}
            onHoverPaper={setListHoveredPaperId}
          />
        </div>
      )}
    </div>
  );
};

// Engine Report Renderer - renders structured Lovable format
interface EngineReportProps {
  report: {
    title: string;
    lead: string;
    abstract: string;
    methodology: string;
    markdown: string;
  };
  papers: DataNode[];
}

const EngineReportRenderer = ({ report, papers }: EngineReportProps) => {
  const [methodsOpen, setMethodsOpen] = useState(false);

  const getPaperById = (id: number) => papers.find(p => p.id === `paper-${id}` || p.id === String(id));

  // Render markdown body with [[paper_id]] citations
  const renderMarkdownWithCitations = (text: string) => {
    if (!text) return null;

    const parts = text.split(/(\[\[\d+\]\])/g);

    return parts.map((part, i) => {
      const match = part.match(/\[\[(\d+)\]\]/);
      if (match) {
        const paperId = parseInt(match[1], 10);
        const paper = getPaperById(paperId);
        if (paper) {
          const index = papers.indexOf(paper) + 1;
          return <InlinePaperCard key={i} paper={paper} index={index} />;
        }
        return <sup key={i} className="text-primary cursor-pointer">*</sup>;
      }

      // Parse markdown headers and paragraphs
      const lines = part.split('\n');
      return lines.map((line, j) => {
        const trimmed = line.trim();
        if (!trimmed) return null;

        // ### Header
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={`${i}-${j}`} className="text-lg font-semibold text-foreground mt-8 mb-4">
              {trimmed.replace('### ', '')}
            </h4>
          );
        }

        // #### Subheader
        if (trimmed.startsWith('#### ')) {
          return (
            <h5 key={`${i}-${j}`} className="text-base font-semibold text-foreground mb-2 mt-6">
              {trimmed.replace('#### ', '')}
            </h5>
          );
        }

        // Regular paragraph (may end with *)
        const hasCitation = trimmed.endsWith('*');
        const cleanText = trimmed.replace(/\s*\*\s*$/, '');

        if (cleanText) {
          return (
            <p key={`${i}-${j}`} className="text-base text-foreground/90 leading-relaxed mb-2">
              {cleanText}
              {hasCitation && <sup className="text-primary mx-0.5">*</sup>}
            </p>
          );
        }

        return null;
      });
    });
  };

  return (
    <>
      {/* Title */}
      <h1 className="text-4xl font-serif font-normal text-foreground mb-6">
        {report.title}
      </h1>

      {/* Lead paragraph (italic/muted) */}
      {report.lead && (
        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
          {report.lead}
        </p>
      )}

      {/* ABSTRACT section */}
      {report.abstract && (
        <>
          <SectionHeader title="ABSTRACT" />
          <p className="text-base text-foreground/90 leading-relaxed mb-6">
            {report.abstract}
          </p>
        </>
      )}

      {/* METHODS section (collapsible) */}
      {report.methodology && (
        <div className="mb-6">
          <button
            onClick={() => setMethodsOpen(!methodsOpen)}
            className="flex items-center gap-2 text-sm font-semibold text-primary tracking-wide mb-3 hover:opacity-80 transition-opacity"
          >
            METHODS
            <ChevronRight className={cn("w-4 h-4 transition-transform", methodsOpen && "rotate-90")} />
          </button>
          {methodsOpen && (
            <p className="text-base text-foreground/90 leading-relaxed">
              {report.methodology}
            </p>
          )}
        </div>
      )}

      {/* RESULTS section header */}
      <SectionHeader title="RESULTS" />

      {/* Markdown body with citations */}
      {renderMarkdownWithCitations(report.markdown)}
    </>
  );
};

// Citation component
const Citation = ({ id }: { id: string }) => (
  <sup className="text-primary cursor-pointer hover:underline mx-0.5">*</sup>
);

// Section Header
const SectionHeader = ({ title }: { title: string }) => (
  <h3 className="text-sm font-semibold text-primary tracking-wide mb-3">{title}</h3>
);

// Collapsible Section
const CollapsibleSection = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm font-semibold text-primary tracking-wide mb-3 hover:opacity-80 transition-opacity"
      >
        {title}
        <ChevronRight className={cn("w-4 h-4 transition-transform", isOpen && "rotate-90")} />
      </button>
      {isOpen && children}
    </div>
  );
};

export default Index;