import { useState } from 'react';
import { ChevronRight, PanelRight } from 'lucide-react';
import { mockNodes } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { StudiesTable } from '@/components/cockpit/StudiesTable';

const Index = () => {
  const [inputValue, setInputValue] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Parse report into sections
  const renderReportContent = () => {
    // Simplified content based on mockReportText
    return (
      <>
        {/* Title */}
        <h1 className="text-4xl font-serif font-normal text-foreground mb-6">
          Lithium Battery Research Analysis
        </h1>

        {/* Lead paragraph */}
        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
          The analysis reveals significant divergence in lithium battery research between major geopolitical regions. 
          China leads in manufacturing scalability <Citation id="paper-001" />, while the United States demonstrates 
          advantages in fundamental materials science <Citation id="paper-003" /> <Citation id="paper-004" />.
        </p>

        {/* Abstract Section */}
        <SectionHeader title="ABSTRACT" />
        <p className="text-base text-foreground/90 leading-relaxed mb-6">
          This review synthesizes findings from 165,432 scientific articles examining lithium battery technology 
          across industrial processing, recycling, and solid-state advances <Citation id="paper-001" />. 
          Chinese research clusters around high-efficiency extraction methods with membrane-based DLE systems 
          achieving 95% lithium recovery <Citation id="paper-002" />. Manufacturing optimization through AI monitoring 
          shows 25% energy reduction <Citation id="paper-002" />. The highest recovery rates emerge from 
          hydrometallurgical processes developed in US labs, achieving 99.2% Li, 98.8% Co recovery <Citation id="paper-003" />. 
          A critical breakthrough exists in solid-state technology with Chinese protocols reporting 500 Wh/kg 
          energy density <Citation id="paper-007" />.
        </p>

        {/* Methods Section */}
        <CollapsibleSection title="METHODS">
          <p className="text-base text-foreground/90 leading-relaxed">
            We analyzed 7 sources from an initial pool of 165,432, using 5 screening criteria. Each paper was 
            reviewed for 5 key aspects that mattered most to the research question.{' '}
            <span className="text-primary cursor-pointer hover:underline">More on methods</span>
          </p>
        </CollapsibleSection>

        {/* Results Section with Studies Table */}
        <SectionHeader title="RESULTS" />
        <h4 className="text-lg font-semibold text-foreground mb-2">Characteristics of Included Studies</h4>
        <p className="text-base text-foreground/90 leading-relaxed mb-4">
          This review includes {mockNodes.length} sources examining lithium battery technology, 
          covering industrial processing, solid-state electrolytes, and recycling methods.
        </p>

        <StudiesTable
          nodes={mockNodes}
          selectedNodeId={selectedNodeId}
          onSelectNode={setSelectedNodeId}
          hoveredNodeId={hoveredNodeId}
          onHoverNode={setHoveredNodeId}
        />

        {/* Thematic Analysis */}
        <h4 className="text-lg font-semibold text-foreground mt-8 mb-4">Thematic Analysis</h4>
        <h5 className="text-base font-semibold text-foreground mb-2">Industrial Processing and Manufacturing</h5>
        <p className="text-base text-foreground/90 leading-relaxed mb-4">
          Chinese research clusters around high-efficiency extraction methods with membrane-based DLE systems 
          achieving 95% lithium recovery <Citation id="paper-001" />. Manufacturing optimization through 
          AI monitoring shows 25% energy reduction <Citation id="paper-002" />.
        </p>

        <h5 className="text-base font-semibold text-foreground mb-2">Solid-State Battery Advances</h5>
        <p className="text-base text-foreground/90 leading-relaxed mb-4">
          A critical breakthrough exists in solid-state technology. Chinese protocols report 500 Wh/kg 
          energy density <Citation id="paper-007" />. European artificial SEI enables 500 cycles at 
          99.2% efficiency <Citation id="paper-006" />.
        </p>
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
              Exploring Lithium Battery Research
            </h2>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[...Array(6)].map((_, i) => (
                <div key={i} className={cn(
                  "w-2 h-2 rounded-full",
                  i < 5 ? "bg-primary" : "bg-muted"
                )} />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">Research report</span>
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
          <div className="max-w-3xl mx-auto px-8 py-10">
            {/* Date */}
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">
              December 13, 2025
            </p>

            {renderReportContent()}
          </div>
        </div>

        {/* Chat Input */}
        <div className="border-t border-border p-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-muted/50 rounded-xl p-4">
              <input
                type="text"
                placeholder="Ask about scientific papers..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm"
              />
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-3">
                  <button className="px-3 py-1.5 text-xs font-medium bg-background rounded-md border border-border hover:bg-accent transition-colors">
                    Chat Mode
                  </button>
                  <span className="text-xs text-muted-foreground">
                    Searching 165K papers
                  </span>
                </div>
                <button className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center hover:opacity-80 transition-opacity">
                  <ChevronRight className="w-4 h-4 text-background rotate-[-90deg]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Right Sidebar: Origin Papers */}
      <div className={cn(
        "border-l border-border flex flex-col transition-all duration-300 ease-in-out",
        isSidebarOpen ? "w-[360px]" : "w-0 overflow-hidden border-l-0"
      )}>
        <div className="p-4 border-b border-border min-w-[360px]">
          <h3 className="text-sm font-medium text-primary">Origin paper</h3>
        </div>
        <div className="flex-1 overflow-auto min-w-[360px]">
          {mockNodes.map((paper) => (
            <div
              key={paper.id}
              className="px-4 py-3 border-b border-border/50 hover:bg-muted/30 cursor-pointer transition-colors"
            >
              <h4 className="text-sm font-medium text-foreground leading-snug mb-1 line-clamp-2">
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
