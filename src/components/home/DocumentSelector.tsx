import { useState } from 'react';
import { FileText, ChevronDown, ChevronRight, Folder, File } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
  const [open, setOpen] = useState(false);

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
  const hasSelectedDocuments = selectedDocuments.length > 0;

  const renderDocumentItem = (doc: DocumentItem, depth = 0) => {
    const selected = isSelected(doc.id);
    const Icon = doc.type === 'folder' ? Folder : File;
    const isExpanded = expandedFolders.has(doc.id);

    if (doc.type === 'folder' && doc.children) {
      return (
        <div key={doc.id}>
          <div
            className={cn(
              'flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer hover:bg-muted transition-colors',
              selected && 'bg-primary/10'
            )}
            style={{ paddingLeft: `${8 + depth * 16}px` }}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleFolder(doc.id);
              }}
              className="p-0.5 hover:bg-muted-foreground/20 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-3 h-3 text-muted-foreground" />
              )}
            </button>
            <Checkbox
              checked={selected}
              onCheckedChange={() => onSelect(doc)}
              onClick={(e) => e.stopPropagation()}
            />
            <Icon className="w-4 h-4 text-muted-foreground" />
            <span className="flex-1 text-sm truncate">{doc.name}</span>
          </div>
          {isExpanded && doc.children.map(child => renderDocumentItem(child, depth + 1))}
        </div>
      );
    }

    return (
      <div
        key={doc.id}
        className={cn(
          'flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer hover:bg-muted transition-colors',
          selected && 'bg-primary/10'
        )}
        style={{ paddingLeft: `${8 + depth * 16 + 20}px` }}
        onClick={() => onSelect(doc)}
      >
        <Checkbox
          checked={selected}
          onCheckedChange={() => onSelect(doc)}
          onClick={(e) => e.stopPropagation()}
        />
        <Icon className="w-4 h-4 text-muted-foreground" />
        <span className="flex-1 text-sm truncate">{doc.name}</span>
      </div>
    );
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            'h-8 px-3 gap-1.5 rounded-lg border transition-all',
            hasSelectedDocuments
              ? 'border-primary/50 bg-primary/10 text-primary hover:bg-primary/20'
              : 'border-border bg-background hover:bg-muted'
          )}
        >
          <FileText className="w-4 h-4" />
          <span className="text-sm font-medium">
            Documents{hasSelectedDocuments && ` (${selectedDocuments.length})`}
          </span>
          <ChevronDown className={cn(
            'w-3 h-3 transition-transform',
            open && 'rotate-180'
          )} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="start" 
        className="w-72 max-h-80 overflow-auto bg-popover border-border"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <div className="px-3 py-2 text-xs font-medium text-muted-foreground">
          Select documents for RAG analysis
        </div>
        <DropdownMenuSeparator />
        <div className="p-1">
          {documents.map(doc => renderDocumentItem(doc))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DocumentSelector;
