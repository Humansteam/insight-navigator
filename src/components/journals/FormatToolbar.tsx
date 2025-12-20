import React, { useState } from 'react';
import { 
  Bold, Italic, Strikethrough, Underline, Highlighter,
  Code, Link, Image, ListOrdered, List, CheckSquare,
  ChevronDown, Download, FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface FormatToolbarProps {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  onInsertFormat: (before: string, after?: string) => void;
  isPreview: boolean;
  onTogglePreview: () => void;
  wordCount: number;
  onExport: () => void;
}

interface ToolButton {
  icon?: React.ElementType;
  label: string;
  before: string;
  after?: string;
  text?: string;
}

const headingButtons: ToolButton[] = [
  { label: 'H1', before: '# ', text: 'H1' },
  { label: 'H2', before: '## ', text: 'H2' },
  { label: 'H3', before: '### ', text: 'H3' },
  { label: 'H4', before: '#### ', text: 'H4' },
  { label: 'H5', before: '##### ', text: 'H5' },
  { label: 'H6', before: '###### ', text: 'H6' },
];

const textButtons: ToolButton[] = [
  { icon: Bold, label: 'Bold', before: '**', after: '**' },
  { icon: Italic, label: 'Italic', before: '_', after: '_' },
  { icon: Strikethrough, label: 'Strikethrough', before: '~~', after: '~~' },
  { icon: Underline, label: 'Underline', before: '<u>', after: '</u>' },
  { icon: Highlighter, label: 'Highlight', before: '==', after: '==' },
];

const codeButtons: ToolButton[] = [
  { icon: Code, label: 'Code', before: '`', after: '`' },
  { icon: Link, label: 'Link', before: '[', after: '](url)' },
  { icon: Image, label: 'Image', before: '![alt](', after: ')' },
];

const listButtons: ToolButton[] = [
  { icon: List, label: 'Bullet List', before: '- ' },
  { icon: ListOrdered, label: 'Numbered', before: '1. ' },
  { icon: CheckSquare, label: 'Checkbox', before: '- [ ] ' },
];

export const FormatToolbar = ({
  onInsertFormat,
  isPreview,
  onTogglePreview,
  wordCount,
  onExport,
}: FormatToolbarProps) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    text: true,
  });

  const toggleSection = (key: string) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const renderIconButton = (btn: ToolButton) => (
    <Button
      key={btn.label}
      variant="ghost"
      size="icon"
      className="h-7 w-7"
      onClick={() => onInsertFormat(btn.before, btn.after)}
      title={btn.label}
      disabled={isPreview}
    >
      {btn.icon && <btn.icon className="h-4 w-4" />}
    </Button>
  );

  const renderTextButton = (btn: ToolButton) => (
    <Button
      key={btn.label}
      variant="ghost"
      size="sm"
      className="h-7 px-2 text-xs font-semibold"
      onClick={() => onInsertFormat(btn.before, btn.after)}
      title={btn.label}
      disabled={isPreview}
    >
      {btn.text}
    </Button>
  );

  const Section = ({ title, id, children }: { title: string; id: string; children: React.ReactNode }) => (
    <Collapsible open={openSections[id] ?? false} onOpenChange={() => toggleSection(id)}>
      <CollapsibleTrigger className="w-full flex items-center justify-between px-3 py-2 hover:bg-accent/30 transition-colors">
        <span className="text-sm font-medium">{title}</span>
        <ChevronDown className={cn(
          "h-4 w-4 transition-transform",
          openSections[id] && "rotate-180"
        )} />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-3 pb-2">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );

  return (
    <div className="w-[360px] border-l border-border bg-muted/20 flex flex-col h-full">
      {/* Sections */}
      <div className="flex-1 overflow-auto">
        <Section title="Text Edit" id="text">
          {/* Headings */}
          <div className="flex gap-0.5 mb-2">
            {headingButtons.map(renderTextButton)}
          </div>
          
          {/* Text formatting */}
          <div className="flex gap-0.5 mb-2">
            {textButtons.map(renderIconButton)}
          </div>
          
          {/* Code, link, image */}
          <div className="flex gap-0.5 mb-2">
            {codeButtons.map(renderIconButton)}
          </div>
          
          {/* Lists */}
          <div className="flex gap-0.5">
            {listButtons.map(renderIconButton)}
          </div>
        </Section>

        <Section title="Tables" id="tables">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-xs"
            onClick={() => onInsertFormat('\n| Col1 | Col2 |\n|------|------|\n| A    | B    |\n')}
            disabled={isPreview}
          >
            Insert Table
          </Button>
        </Section>

        <Section title="More" id="more">
          <div className="space-y-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-xs"
              onClick={() => onInsertFormat('\n---\n')}
              disabled={isPreview}
            >
              Horizontal Rule
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-xs"
              onClick={() => onInsertFormat('> ')}
              disabled={isPreview}
            >
              Blockquote
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-xs"
              onClick={() => onInsertFormat('```\n', '\n```')}
              disabled={isPreview}
            >
              Code Block
            </Button>
          </div>
        </Section>
      </div>

      {/* Footer */}
      <div className="border-t border-border p-2 space-y-2">
        <Button
          variant={isPreview ? "secondary" : "ghost"}
          size="sm"
          className="w-full justify-start gap-2 text-xs"
          onClick={onTogglePreview}
        >
          {isPreview ? 'Edit Mode' : 'Preview'}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-xs"
          onClick={onExport}
        >
          <Download className="h-3.5 w-3.5" />
          Export .md
        </Button>
      </div>
      
      {/* Status bar */}
      <div className="h-7 flex items-center justify-end gap-3 px-3 border-t border-border text-[10px] text-muted-foreground">
        <span>Words: {wordCount}</span>
      </div>
    </div>
  );
};
