import { useState, useMemo } from 'react';
import { ChevronRight, Folder, File, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';

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
  const [searchQuery, setSearchQuery] = useState('');
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

  // Recursive filtering of documents
  const filterDocuments = (docs: DocumentItem[], query: string): DocumentItem[] => {
    if (!query.trim()) return docs;
    
    return docs.reduce((acc, doc) => {
      if (doc.type === 'folder' && doc.children) {
        const filteredChildren = filterDocuments(doc.children, query);
        if (filteredChildren.length > 0 || doc.name.toLowerCase().includes(query.toLowerCase())) {
          acc.push({ ...doc, children: filteredChildren });
        }
      } else if (doc.name.toLowerCase().includes(query.toLowerCase())) {
        acc.push(doc);
      }
      return acc;
    }, [] as DocumentItem[]);
  };

  const filteredDocuments = useMemo(
    () => filterDocuments(documents, searchQuery),
    [documents, searchQuery]
  );

  // Auto-expand folders when searching
  const shouldExpand = (folderId: string) => {
    if (searchQuery.trim()) return true;
    return expandedFolders.has(folderId);
  };

  const isSelected = (docId: string) => selectedDocuments.some(d => d.id === docId);

  const renderDocumentItem = (doc: DocumentItem, depth = 0) => {
    const selected = isSelected(doc.id);
    const Icon = doc.type === 'folder' ? Folder : File;
    const isExpanded = shouldExpand(doc.id);

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
            <Icon className="w-4 h-4 text-muted-foreground" />
            <span className="flex-1 text-sm">{doc.name}</span>
            <Checkbox
              checked={selected}
              onCheckedChange={() => onSelect(doc)}
              onClick={(e) => e.stopPropagation()}
            />
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
        <Icon className="w-4 h-4 text-muted-foreground" />
        <span className="flex-1 text-sm">{doc.name}</span>
        <Checkbox
          checked={selected}
          onCheckedChange={() => onSelect(doc)}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    );
  };

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      {/* Search documents input */}
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 bg-muted/30 border-0 focus-visible:ring-1"
          />
        </div>
      </div>
      
      {/* Documents list */}
      <div className="max-h-64 overflow-auto p-2">
        {filteredDocuments.length > 0 ? (
          filteredDocuments.map(doc => renderDocumentItem(doc))
        ) : (
          <div className="text-center py-4 text-sm text-muted-foreground">
            No documents found
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentSelector;
