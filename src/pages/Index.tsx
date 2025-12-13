import { useState, useMemo } from 'react';
import { ChevronRight, PanelRight, Loader2 } from 'lucide-react';
import { mockNodes } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { InlinePaperCard } from '@/components/cockpit/InlinePaperCard';
import { PipelineDAG } from '@/components/cockpit/PipelineDAG';
import { useEngineData } from '@/hooks/useEngineData';
import { DataNode } from '@/types/morphik';

const Index = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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

  return (
    <div className="h-screen w-full flex bg-background relative">
      {/* Left Panel: Report + Chat */}
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
            <div className="flex gap-1">
              {phaseDots.map((active, i) => (
                <div key={i} className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  active ? "bg-primary" : "bg-muted"
                )} />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {phase === 'idle' ? 'Research report' : phase === 'complete' ? 'Complete' : phase.replace('_', ' ')}
            </span>
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

        {/* Report Content */}
        <div className="flex-1 overflow-auto">
          {isLoading && phase !== 'complete' ? (
            <PipelineDAG
              query={input || 'Analyzing...'}
              onComplete={() => {}}
            />
          ) : (
            <div className="max-w-3xl mx-auto px-8 py-10">
              {/* Date */}
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">
                {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()}
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

        {/* Chat Input */}
        <div className="border-t border-border p-4">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="bg-muted/50 rounded-xl p-4">
                <input
                  type="text"
                  placeholder="Enter your research query..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading}
                  className="w-full bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm disabled:opacity-50"
                />
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="px-3 py-1.5 text-xs font-medium bg-background rounded-md border border-border hover:bg-accent transition-colors"
                    >
                      Engine Mode
                    </button>
                    <span className="text-xs text-muted-foreground">
                      {isLoading ? `${phase.replace('_', ' ')}...` : 'Searching 165K papers'}
                    </span>
                  </div>
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center hover:opacity-80 transition-opacity disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 text-background animate-spin" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-background rotate-[-90deg]" />
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Right Sidebar: Evidence Matrix */}
      <div className={cn(
        "border-l border-border flex flex-col transition-all duration-300 ease-in-out",
        isSidebarOpen ? "w-[360px]" : "w-0 overflow-hidden border-l-0"
      )}>
        <div className="p-4 border-b border-border min-w-[360px]">
          <h3 className="text-sm font-medium text-primary">Evidence Matrix</h3>
        </div>
        <div className="flex-1 overflow-auto min-w-[360px]">
          {papers.map((paper) => (
            <div
              key={paper.id}
              className="px-4 py-3 border-b border-border/50 hover:bg-muted/30 cursor-pointer transition-colors relative"
            >
              <div className="absolute top-3 right-4 flex flex-col items-end gap-1">
                <span className="text-xs font-medium text-primary">
                  {Math.round(paper.score * 100)}%
                </span>
                <div className="w-10 h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${paper.score * 100}%` }}
                  />
                </div>
              </div>
              <h4 className="text-sm font-medium text-foreground leading-snug mb-1 line-clamp-2 pr-14">
                {paper.title}
              </h4>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground truncate max-w-[220px]">
                  {paper.authors.join(', ')}
                </p>
                <span className="text-xs text-muted-foreground">{paper.year}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
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