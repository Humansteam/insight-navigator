/**
 * ArtifactRenderer - универсальный рендерер артефактов для чата
 * 
 * Принимает ChatArtifact и рендерит соответствующий rich-компонент
 */

import { ProgressPanel } from './ProgressPanel';
import { MapPointsCard } from './MapPointsCard';
import { SchemaCard } from './SchemaCard';
import { ExtractionTable } from './ExtractionTable';
import { TopologyCard } from './TopologyCard';
import { ReportArtifactCard } from './ReportArtifact';
import { ToolCallCard } from './ToolCallCard';
import { SearchResultsCard } from './SearchResultsCard';
import { ClusterInsightCard } from './ClusterInsightCard';
import type { ChatArtifact } from './types';

interface ArtifactRendererProps {
  artifact: ChatArtifact;
  onPaperClick?: (paperId: string) => void;
  onExpand?: () => void;
}

export function ArtifactRenderer({ artifact, onPaperClick, onExpand }: ArtifactRendererProps) {
  switch (artifact.type) {
    case 'progress':
      return <ProgressPanel data={artifact} />;
    
    case 'map_points':
      return <MapPointsCard data={artifact} />;
    
    case 'schema':
      return <SchemaCard data={artifact} />;
    
    case 'extraction':
      return <ExtractionTable data={artifact} />;
    
    case 'topology':
      return <TopologyCard data={artifact} onPaperClick={onPaperClick} />;
    
    case 'report':
      return <ReportArtifactCard data={artifact} onExpand={onExpand} />;
    
    case 'tool_call':
      return <ToolCallCard data={artifact} />;
    
    case 'search_results':
      return <SearchResultsCard data={artifact} onPaperClick={onPaperClick} />;
    
    case 'cluster_insight':
      return <ClusterInsightCard data={artifact} onPaperClick={onPaperClick} />;
    
    default:
      return null;
  }
}
