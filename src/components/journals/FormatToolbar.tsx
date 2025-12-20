import React from 'react';
import { 
  Heading1, Heading2, Heading3, 
  Bold, Italic, Strikethrough,
  List, ListOrdered, Quote, Code,
  Link, Minus, Eye, EyeOff,
  Download, FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface FormatToolbarProps {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  onInsertFormat: (before: string, after?: string) => void;
  isPreview: boolean;
  onTogglePreview: () => void;
  wordCount: number;
  onExport: () => void;
}

interface ToolButton {
  icon: React.ElementType;
  label: string;
  before: string;
  after?: string;
}

const formatButtons: ToolButton[] = [
  { icon: Heading1, label: 'Heading 1', before: '# ' },
  { icon: Heading2, label: 'Heading 2', before: '## ' },
  { icon: Heading3, label: 'Heading 3', before: '### ' },
];

const textButtons: ToolButton[] = [
  { icon: Bold, label: 'Bold', before: '**', after: '**' },
  { icon: Italic, label: 'Italic', before: '_', after: '_' },
  { icon: Strikethrough, label: 'Strikethrough', before: '~~', after: '~~' },
  { icon: Code, label: 'Code', before: '`', after: '`' },
];

const blockButtons: ToolButton[] = [
  { icon: List, label: 'Bullet List', before: '- ' },
  { icon: ListOrdered, label: 'Numbered List', before: '1. ' },
  { icon: Quote, label: 'Quote', before: '> ' },
  { icon: Link, label: 'Link', before: '[', after: '](url)' },
  { icon: Minus, label: 'Divider', before: '\n---\n' },
];

export const FormatToolbar = ({
  onInsertFormat,
  isPreview,
  onTogglePreview,
  wordCount,
  onExport,
}: FormatToolbarProps) => {
  const renderButtonGroup = (buttons: ToolButton[], title: string) => (
    <div className="space-y-1">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground px-1">
        {title}
      </div>
      <div className="flex flex-wrap gap-1">
        {buttons.map((btn) => (
          <Button
            key={btn.label}
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onInsertFormat(btn.before, btn.after)}
            title={btn.label}
            disabled={isPreview}
          >
            <btn.icon className="h-4 w-4" />
          </Button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-44 border-l border-border bg-muted/30 flex flex-col h-full">
      <div className="p-3 space-y-4 flex-1">
        {/* Preview Toggle */}
        <Button
          variant={isPreview ? "secondary" : "ghost"}
          size="sm"
          className="w-full justify-start gap-2"
          onClick={onTogglePreview}
        >
          {isPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          <span className="text-xs">{isPreview ? 'Edit' : 'Preview'}</span>
        </Button>

        <Separator />

        {/* Formatting Buttons */}
        {renderButtonGroup(formatButtons, 'Headings')}
        
        <Separator />
        
        {renderButtonGroup(textButtons, 'Text')}
        
        <Separator />
        
        {renderButtonGroup(blockButtons, 'Blocks')}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border space-y-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2"
          onClick={onExport}
        >
          <Download className="h-4 w-4" />
          <span className="text-xs">Export .md</span>
        </Button>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground px-1">
          <FileText className="h-3 w-3" />
          <span>{wordCount} words</span>
        </div>
      </div>
    </div>
  );
};
