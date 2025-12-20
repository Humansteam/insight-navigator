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
    headings: true,
    text: true,
    blocks: true,
  });

  const toggleSection = (key: string) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const renderIconButton = (btn: ToolButton) => (
    <Button
      key={btn.label}
      variant="ghost"
      size="icon"
      className="h-10 w-10"
      onClick={() => onInsertFormat(btn.before, btn.after)}
      title={btn.label}
      disabled={isPreview}
    >
      {btn.icon && <btn.icon className="h-5 w-5" />}
    </Button>
  );

  const renderTextButton = (btn: ToolButton) => (
    <Button
      key={btn.label}
      variant="ghost"
      size="sm"
      className="h-10 px-4 text-base font-semibold"
      onClick={() => onInsertFormat(btn.before, btn.after)}
      title={btn.label}
      disabled={isPreview}
    >
      {btn.text}
    </Button>
  );

  const Section = ({ title, id, children }: { title: string; id: string; children: React.ReactNode }) => (
    <Collapsible open={openSections[id] ?? false} onOpenChange={() => toggleSection(id)}>
      <CollapsibleTrigger className="w-full flex items-center justify-between px-4 py-3 hover:bg-accent/30 transition-colors">
        <span className="text-base font-medium">{title}</span>
        <ChevronDown className={cn(
          "h-5 w-5 transition-transform",
          openSections[id] && "rotate-180"
        )} />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-4 pb-4">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );

  return (
    <div className="w-[360px] border-l border-border bg-muted/20 flex flex-col h-full">
      {/* Header */}
      <div className="h-12 flex items-center px-4 border-b border-border">
        <span className="text-base font-medium">Formatting</span>
      </div>

      {/* Sections */}
      <div className="flex-1 overflow-auto">
        <Section title="Headings" id="headings">
          <div className="flex flex-wrap gap-1">
            {headingButtons.map(renderTextButton)}
          </div>
        </Section>

        <Section title="Text Styles" id="text">
          {/* Text formatting */}
          <div className="flex flex-wrap gap-1 mb-3">
            {textButtons.map(renderIconButton)}
          </div>
          
          {/* Code, link, image */}
          <div className="flex flex-wrap gap-1 mb-3">
            {codeButtons.map(renderIconButton)}
          </div>
          
          {/* Lists */}
          <div className="flex flex-wrap gap-1">
            {listButtons.map(renderIconButton)}
          </div>
        </Section>

        <Section title="Blocks" id="blocks">
          <div className="space-y-2">
            <Button
              variant="ghost"
              size="lg"
              className="w-full justify-start text-base h-10"
              onClick={() => onInsertFormat('\n| Col1 | Col2 |\n|------|------|\n| A    | B    |\n')}
              disabled={isPreview}
            >
              Insert Table
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="w-full justify-start text-base h-10"
              onClick={() => onInsertFormat('\n---\n')}
              disabled={isPreview}
            >
              Horizontal Rule
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="w-full justify-start text-base h-10"
              onClick={() => onInsertFormat('> ')}
              disabled={isPreview}
            >
              Blockquote
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="w-full justify-start text-base h-10"
              onClick={() => onInsertFormat('```\n', '\n```')}
              disabled={isPreview}
            >
              Code Block
            </Button>
          </div>
        </Section>
      </div>

      {/* Footer */}
      <div className="border-t border-border p-4 space-y-3">
        <Button
          variant={isPreview ? "secondary" : "outline"}
          size="lg"
          className="w-full justify-center gap-2 text-base h-10"
          onClick={onTogglePreview}
        >
          <FileText className="h-5 w-5" />
          {isPreview ? 'Edit Mode' : 'Preview'}
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          className="w-full justify-center gap-2 text-base h-10"
          onClick={onExport}
        >
          <Download className="h-5 w-5" />
          Export .md
        </Button>
      </div>
      
      {/* Status bar */}
      <div className="h-10 flex items-center justify-end gap-4 px-4 border-t border-border text-sm text-muted-foreground">
        <span>{wordCount} words</span>
      </div>
    </div>
  );
};
