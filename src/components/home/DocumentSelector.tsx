import { useState } from 'react';
import { ChevronRight, Folder, File } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';

export interface DocumentItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  children?: DocumentItem[];
}

interface DocumentSelectorProps {
  documents: DocumentItem[];
  selectedDocuments: DocumentItem[];
  onSelect: (doc: DocumentItem) => void;
}

const DocumentSelector = ({ documents, selectedDocuments, onSelect }: DocumentSelectorProps) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  const isSelected = (docId: string) => selectedDocuments.some(d => d.id === docId);

  const renderDocumentItem = (doc: DocumentItem, depth = 0) => {
    const selected = isSelected(doc.id);
    const Icon = doc.type === 'folder' ? Folder : File;
    const isExpanded = expandedFolders.has(doc.id);

    if (doc.type === 'folder' && doc.children) {
      return (
        <div key={doc.id}>
          <div
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors',
              selected && 'bg-primary/10'
            )}
            style={{ paddingLeft: `${12 + depth * 16}px` }}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleFolder(doc.id);
              }}
              className="p-0.5 hover:bg-muted-foreground/20 rounded transition-colors"
            >
              <ChevronRight className={cn(
                'w-4 h-4 text-muted-foreground transition-transform',
                isExpanded && 'rotate-90'
              )} />
            </button>
            <Checkbox
              checked={selected}
              onCheckedChange={() => onSelect(doc)}
              onClick={(e) => e.stopPropagation()}
            />
            <Icon className="w-4 h-4 text-muted-foreground" />
            <span className="flex-1 text-sm">{doc.name}</span>
          </div>
          {isExpanded && doc.children.map(child => renderDocumentItem(child, depth + 1))}
        </div>
      );
    }

    return (
      <div
        key={doc.id}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors',
          selected && 'bg-primary/10'
        )}
        style={{ paddingLeft: `${12 + depth * 16 + 24}px` }}
        onClick={() => onSelect(doc)}
      >
        <Checkbox
          checked={selected}
          onCheckedChange={() => onSelect(doc)}
          onClick={(e) => e.stopPropagation()}
        />
        <Icon className="w-4 h-4 text-muted-foreground" />
        <span className="flex-1 text-sm">{doc.name}</span>
      </div>
    );
  };

  return (
    <div className="bg-card border border-border rounded-xl p-2 max-h-64 overflow-auto">
      <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-b border-border mb-2">
        Select documents for RAG analysis
      </div>
      {documents.map(doc => renderDocumentItem(doc))}
    </div>
  );
};

export default DocumentSelector;
