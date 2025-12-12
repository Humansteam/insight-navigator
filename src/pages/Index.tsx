import { useState, useMemo } from 'react';
import { ChatInterface } from '@/components/cockpit/ChatInterface';
import { ReportPanel } from '@/components/cockpit/ReportPanel';
import { TopologyVisualization } from '@/components/cockpit/TopologyVisualization';
import { DynamicContext } from '@/components/cockpit/DynamicContext';
import { EvidenceGrid } from '@/components/cockpit/EvidenceGrid';
import { mockNodes, mockEdges, mockReportText, mockDimensions } from '@/data/mockData';

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
      {/* Left Panel: Report + Chat */}
      <div className="w-[560px] flex flex-col border-r border-border min-w-0 shrink-0">
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
        <ChatInterface
          onSendMessage={handleSendMessage}
          isProcessing={isProcessing}
        />
      </div>

      {/* Right Panel: Graph/Table + Details */}
      <div className="flex-1 flex min-w-0 overflow-hidden">
        {/* Left column: Graph + Table */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Graph */}
          <div className="h-[280px] shrink-0 p-3 border-b border-border">
            <TopologyVisualization
              nodes={mockNodes}
              edges={mockEdges}
              selectedNodeId={selectedNodeId}
              onSelectNode={setSelectedNodeId}
              hoveredNodeId={hoveredNodeId}
              onHoverNode={setHoveredNodeId}
            />
          </div>

          {/* Table */}
          <div className="flex-1 min-h-0 overflow-auto">
            <EvidenceGrid
              nodes={mockNodes}
              dimensions={mockDimensions}
              selectedNodeId={selectedNodeId}
              onSelectNode={setSelectedNodeId}
              hoveredNodeId={hoveredNodeId}
              onHoverNode={setHoveredNodeId}
            />
          </div>
        </div>

        {/* Right column: Details - full height */}
        <div className="w-[320px] shrink-0 border-l border-border">
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