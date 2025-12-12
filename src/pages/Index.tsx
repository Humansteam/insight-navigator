import { useState, useMemo } from 'react';
import { ChatInterface } from '@/components/cockpit/ChatInterface';
import { ReportPanel } from '@/components/cockpit/ReportPanel';
import { TopologyVisualization } from '@/components/cockpit/TopologyVisualization';
import { DivergenceMeter } from '@/components/cockpit/DivergenceMeter';
import { MiniEvidenceGrid } from '@/components/cockpit/MiniEvidenceGrid';
import { DynamicContext } from '@/components/cockpit/DynamicContext';
import { mockNodes, mockEdges, mockReportText, mockDivergence, mockDimensions } from '@/data/mockData';
import { Zap } from 'lucide-react';

const Index = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [reportText, setReportText] = useState(mockReportText);
  const [isGenerating, setIsGenerating] = useState(true);

  const selectedNode = useMemo(
    () => mockNodes.find((n) => n.id === selectedNodeId) || null,
    [selectedNodeId]
  );

  const handleSendMessage = (message: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
    }, 2000);
  };

  const handleCitationHover = (paperId: string | null) => {
    setHoveredNodeId(paperId);
  };

  const handleCitationClick = (paperId: string) => {
    setSelectedNodeId(paperId);
  };

  return (
    <div className="h-screen w-full flex overflow-hidden bg-background">
      {/* Left Panel: Chat + Report */}
      <div className="w-[45%] flex flex-col border-r border-border min-w-0">
        {/* Header */}
        <header className="h-11 border-b border-border flex items-center px-4 shrink-0 bg-background-deep">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="font-semibold text-sm text-foreground tracking-tight">MORPHIK</span>
          </div>
          <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
            <span className="px-2 py-0.5 rounded bg-muted font-mono">165,432 papers</span>
          </div>
        </header>

        {/* Report */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <ReportPanel
            markdown={reportText}
            isGenerating={isGenerating}
            onCitationHover={handleCitationHover}
            onCitationClick={handleCitationClick}
          />
        </div>

        {/* Chat */}
        <div className="h-[180px] shrink-0">
          <ChatInterface
            onSendMessage={handleSendMessage}
            isProcessing={isProcessing}
          />
        </div>
      </div>

      {/* Right Panel: Context Panel */}
      <div className="flex-1 flex min-w-0">
        {/* Main visualizations */}
        <div className="flex-1 flex flex-col p-3 gap-3 min-w-0">
          {/* Topology Visualization */}
          <div className="h-[40%] min-h-[200px]">
            <TopologyVisualization
              nodes={mockNodes}
              edges={mockEdges}
              selectedNodeId={selectedNodeId}
              onSelectNode={setSelectedNodeId}
              hoveredNodeId={hoveredNodeId}
              onHoverNode={setHoveredNodeId}
            />
          </div>

          {/* Divergence Meter */}
          <DivergenceMeter divergence={mockDivergence} />

          {/* Evidence Grid */}
          <div className="flex-1 min-h-0">
            <MiniEvidenceGrid
              nodes={mockNodes}
              dimensions={mockDimensions}
              selectedNodeId={selectedNodeId}
              onSelectNode={setSelectedNodeId}
              hoveredNodeId={hoveredNodeId}
              onHoverNode={setHoveredNodeId}
            />
          </div>
        </div>

        {/* Dynamic Context Details */}
        <div className="p-3 pl-0">
          <DynamicContext
            node={selectedNode}
            onClose={() => setSelectedNodeId(null)}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
