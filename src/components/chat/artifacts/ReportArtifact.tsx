import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Maximize2, X, BookOpen, Settings, ExternalLink, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MarkdownRenderer } from '../MarkdownRenderer';
import type { ReportArtifact as ReportArtifactType } from './types';

interface ReportArtifactProps {
  data: ReportArtifactType;
  onExpand?: () => void;
}

function SourceCard({ source }: { source: ReportArtifactType['sources'][0] }) {
  return (
    <div className="p-2 bg-muted/30 rounded-md hover:bg-muted/50 transition-colors cursor-pointer">
      <p className="text-xs text-foreground line-clamp-2">{source.title}</p>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-[10px] text-muted-foreground">{source.year}</span>
        <span className="text-[10px] text-muted-foreground">·</span>
        <span className="text-[10px] text-muted-foreground">{source.citations} cites</span>
      </div>
    </div>
  );
}

export function ReportArtifactCard({ data, onExpand }: ReportArtifactProps) {
  const [viewMode, setViewMode] = useState<'tldr' | 'full'>('tldr');
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(data.markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="border-border bg-card overflow-hidden">
      <CardHeader className="p-3 pb-2 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          <CardTitle className="text-sm line-clamp-1">{data.title}</CardTitle>
        </div>
        
        <div className="flex items-center gap-1">
          {data.hasTLDR && (
            <div className="flex bg-muted rounded-md p-0.5">
              <Button 
                size="sm" 
                variant={viewMode === 'tldr' ? 'secondary' : 'ghost'}
                className="h-6 px-2 text-[10px]"
                onClick={() => setViewMode('tldr')}
              >
                TL;DR
              </Button>
              <Button 
                size="sm" 
                variant={viewMode === 'full' ? 'secondary' : 'ghost'}
                className="h-6 px-2 text-[10px]"
                onClick={() => setViewMode('full')}
              >
                Full
              </Button>
            </div>
          )}
          <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={handleCopy}>
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          </Button>
          <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={onExpand}>
            <Maximize2 className="w-3 h-3" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-3 pt-0">
        <div className="grid grid-cols-3 gap-3">
          {/* Main content */}
          <div className="col-span-2 space-y-3">
            {/* Lead */}
            <p className="text-sm text-foreground font-medium leading-relaxed">
              {data.lead}
            </p>

            {viewMode === 'tldr' ? (
              <p className="text-xs text-muted-foreground leading-relaxed">
                {data.abstract}
              </p>
            ) : (
              <ScrollArea className="h-48">
                <MarkdownRenderer content={data.markdown.slice(0, 1000) + '...'} />
              </ScrollArea>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-3 border-l border-border pl-3">
            {/* Parameters */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <Settings className="w-3 h-3 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground font-medium">Parameters</span>
              </div>
              <div className="space-y-1 text-[10px]">
                <div>
                  <span className="text-muted-foreground">Papers: </span>
                  <span className="text-foreground">{data.parameters.totalPapers}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Regions: </span>
                  <span className="text-foreground">{data.parameters.regions.join(', ')}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {data.parameters.dimensions.slice(0, 3).map(d => (
                  <Badge key={d} variant="outline" className="text-[9px]">{d}</Badge>
                ))}
              </div>
            </div>

            {/* Sources */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-3 h-3 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground font-medium">
                  Sources ({data.sources.length})
                </span>
              </div>
              <div className="space-y-1.5 max-h-32 overflow-auto">
                {data.sources.slice(0, 3).map(source => (
                  <SourceCard key={source.id} source={source} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Fullscreen Report View
export function ReportFullscreen({ 
  data, 
  onClose 
}: { 
  data: ReportArtifactType; 
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-background">
      {/* Header */}
      <div className="h-12 border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">{data.title}</span>
        </div>
        <Button size="sm" variant="ghost" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex h-[calc(100vh-48px)]">
        {/* Markdown */}
        <ScrollArea className="flex-1 p-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-foreground mb-4">{data.title}</h1>
            <p className="text-lg text-muted-foreground mb-6">{data.lead}</p>
            <MarkdownRenderer content={data.markdown} />
          </div>
        </ScrollArea>

        {/* Right Panel */}
        <div className="w-80 border-l border-border p-4 space-y-6 overflow-auto">
          {/* Parameters */}
          <div className="space-y-3">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Research Parameters
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Query</span>
                <span className="text-foreground text-right max-w-48 truncate">{data.parameters.query}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Papers Analyzed</span>
                <span className="text-foreground">{data.parameters.totalPapers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Regions</span>
                <span className="text-foreground">{data.parameters.regions.join(', ')}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {data.parameters.dimensions.map(d => (
                <Badge key={d} variant="secondary" className="text-[10px]">{d}</Badge>
              ))}
            </div>
          </div>

          {/* Sources */}
          <div className="space-y-3">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Sources ({data.sources.length})
            </h3>
            <div className="space-y-2">
              {data.sources.map(source => (
                <SourceCard key={source.id} source={source} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
