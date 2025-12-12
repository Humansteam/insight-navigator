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
      <div className="w-[480px] flex flex-col border-r border-border min-w-0 shrink-0">
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

      {/* Right Panel: 4 blocks */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top row: Graph + Details */}
        <div className="flex h-[45%] min-h-[280px] border-b border-border">
          {/* Block 1: Graph */}
          <div className="flex-1 p-3 min-w-0">
            <TopologyVisualization
              nodes={mockNodes}
              edges={mockEdges}
              selectedNodeId={selectedNodeId}
              onSelectNode={setSelectedNodeId}
              hoveredNodeId={hoveredNodeId}
              onHoverNode={setHoveredNodeId}
            />
          </div>

          {/* Block 2: Details / Notes */}
          <div className="w-[300px] shrink-0 border-l border-border">
            <DynamicContext
              node={selectedNode}
              onClose={() => setSelectedNodeId(null)}
            />
          </div>
        </div>

        {/* Bottom: Table - full width */}
        <div className="flex-1 min-h-0 overflow-hidden">
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
    </div>
  );
};

export default Index;