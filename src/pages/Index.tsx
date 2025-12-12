import { useState, useMemo } from 'react';
import { LeftSidebar } from '@/components/cockpit/LeftSidebar';
import { LiveStatusHeader } from '@/components/cockpit/LiveStatusHeader';
import { TopologyWidget } from '@/components/cockpit/TopologyWidget';
import { EvidenceGrid } from '@/components/cockpit/EvidenceGrid';
import { StrategicReport } from '@/components/cockpit/StrategicReport';
import { ContextDetails } from '@/components/cockpit/ContextDetails';
import {
  mockPipelineStages,
  mockQueryTags,
  mockDimensions,
  mockNodes,
  mockDivergence,
  mockSessions,
  mockReportText,
} from '@/data/mockData';

const Index = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string | null>('sess-001');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const selectedNode = useMemo(
    () => mockNodes.find((n) => n.id === selectedNodeId) || null,
    [selectedNodeId]
  );

  const handleCitationHover = (paperId: string | null) => {
    setHoveredNodeId(paperId);
  };

  const handleCitationClick = (paperId: string) => {
    setSelectedNodeId(paperId);
  };

  return (
    <div className="h-screen w-full flex overflow-hidden bg-background">
      {/* Left Sidebar */}
      <LeftSidebar
        sessions={mockSessions}
        activeSessionId={activeSessionId}
        onSelectSession={setActiveSessionId}
        onNewAnalysis={() => console.log('New analysis')}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex min-w-0">
        {/* Center Feed */}
        <main className="flex-1 min-w-0 overflow-y-auto p-4 space-y-4">
          {/* Live Status Header */}
          <LiveStatusHeader
            pipelineStages={mockPipelineStages}
            queryTags={mockQueryTags}
            dimensions={mockDimensions}
          />

          {/* Evidence Grid */}
          <EvidenceGrid
            nodes={mockNodes}
            dimensions={mockDimensions}
            selectedNodeId={selectedNodeId}
            onSelectNode={setSelectedNodeId}
            hoveredNodeId={hoveredNodeId}
            onHoverNode={setHoveredNodeId}
          />

          {/* Strategic Report */}
          <StrategicReport
            markdown={mockReportText}
            onCitationHover={handleCitationHover}
            onCitationClick={handleCitationClick}
          />
        </main>

        {/* Right Context Panel */}
        <aside className="w-[420px] shrink-0 border-l border-border p-4 flex flex-col gap-4 overflow-hidden">
          {/* Topology Widget */}
          <div className="h-[45%] min-h-[280px]">
            <TopologyWidget
              nodes={mockNodes}
              divergence={mockDivergence}
              selectedNodeId={selectedNodeId}
              onSelectNode={setSelectedNodeId}
              hoveredNodeId={hoveredNodeId}
              onHoverNode={setHoveredNodeId}
            />
          </div>

          {/* Context Details */}
          <div className="flex-1 min-h-0">
            <ContextDetails
              selectedNode={selectedNode}
              onClose={() => setSelectedNodeId(null)}
              totalPapers={165432}
              velocityScore={87}
              growthRate={23}
            />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Index;
