import { useState, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ChatInterface } from '@/components/cockpit/ChatInterface';
import { ReportPanel } from '@/components/cockpit/ReportPanel';
import { NetworkGraph } from '@/components/cockpit/NetworkGraph';
import { PaperDetails } from '@/components/cockpit/PaperDetails';
import { mockNodes, mockEdges, mockReportText } from '@/data/mockData';
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
    // Simulate processing
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
      <div className="w-1/2 flex flex-col border-r border-border min-w-0">
        {/* Header */}
        <header className="h-12 border-b border-border flex items-center px-4 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-primary/20 flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <span className="font-semibold text-sm text-foreground tracking-tight">MORPHIK</span>
          </div>
          <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
            <span className="px-2 py-0.5 rounded bg-muted font-mono">165,432 статей</span>
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
        <div className="h-[200px] shrink-0">
          <ChatInterface
            onSendMessage={handleSendMessage}
            isProcessing={isProcessing}
          />
        </div>
      </div>

      {/* Right Panel: Graph + Details */}
      <div className="w-1/2 flex flex-col p-4 gap-4 min-w-0">
        {/* Network Graph */}
        <div className="flex-1 min-h-0">
          <NetworkGraph
            nodes={mockNodes}
            edges={mockEdges}
            selectedNodeId={selectedNodeId}
            onSelectNode={setSelectedNodeId}
            hoveredNodeId={hoveredNodeId}
            onHoverNode={setHoveredNodeId}
          />
        </div>

        {/* Paper Details */}
        <AnimatePresence>
          {selectedNode && (
            <PaperDetails
              node={selectedNode}
              onClose={() => setSelectedNodeId(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Index;
