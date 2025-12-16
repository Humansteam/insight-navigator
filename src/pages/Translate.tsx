import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  FileText, 
  Languages, 
  FolderOpen,
  Settings,
  ArrowRightLeft,
  Copy,
  Volume2,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

const workspaceItems = [
  { id: 'translate', icon: Languages, label: 'Translate AI', description: 'Переводчик текста', active: true },
  { id: 'document', icon: FileText, label: 'Document View', description: '.pdf .docx .pptx' },
  { id: 'batch', icon: FolderOpen, label: 'Translate Files', description: 'Batch processing' },
];

const languages = [
  { value: 'en', label: 'English' },
  { value: 'ru', label: 'Русский' },
  { value: 'zh', label: '中文' },
  { value: 'de', label: 'Deutsch' },
  { value: 'fr', label: 'Français' },
  { value: 'es', label: 'Español' },
  { value: 'ja', label: '日本語' },
];

const llmModels = [
  { value: 'gpt4o-mini', label: 'GPT-4o Mini', provider: 'OpenAI' },
  { value: 'gpt4o', label: 'GPT-4o', provider: 'OpenAI' },
  { value: 'claude-3', label: 'Claude 3.5', provider: 'Anthropic' },
];

const styles = [
  { value: 'general', label: 'General Scientific / Общенаучный' },
  { value: 'technical', label: 'Technical / Технический' },
  { value: 'legal', label: 'Legal / Юридический' },
  { value: 'medical', label: 'Medical / Медицинский' },
];

export default function Translate() {
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('ru');
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt4o-mini');
  const [selectedStyle, setSelectedStyle] = useState('general');
  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    setIsTranslating(true);
    // Simulate translation
    setTimeout(() => {
      setTranslatedText(`[Перевод]: ${sourceText}`);
      setIsTranslating(false);
    }, 1500);
  };

  const handleSwapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  const handleClear = () => {
    setSourceText('');
    setTranslatedText('');
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Left Sidebar */}
      <aside className="w-60 border-r border-border bg-sidebar flex flex-col">
        <div className="p-4 border-b border-border">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Default Organization</p>
        </div>
        
        <div className="p-3">
          <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Menu
          </Button>
        </div>

        <div className="px-4 py-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Workspace</p>
          <nav className="space-y-1">
            {workspaceItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ x: 2 }}
                className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                  item.active 
                    ? 'bg-muted text-foreground border border-border' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <item.icon className={`h-4 w-4 mt-0.5 ${item.active ? 'text-primary' : ''}`} />
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              </motion.button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-4 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium text-sm">
              M
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Super Admin</p>
              <p className="text-xs text-muted-foreground truncate">admin@example.com</p>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Breadcrumb Header */}
        <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-card/50">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground hover:text-foreground cursor-pointer">Home</span>
            <span className="text-muted-foreground">&gt;</span>
            <span className="text-muted-foreground hover:text-foreground cursor-pointer">New_02</span>
            <span className="text-muted-foreground">&gt;</span>
            <span className="text-foreground font-medium">Translate</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
              <Sparkles className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Translation Panels */}
        <div className="flex-1 p-6 flex gap-4 overflow-hidden bg-background">
          {/* Source Panel */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 flex flex-col bg-card border border-border rounded-xl overflow-hidden"
          >
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-medium text-foreground">Original</h3>
              <Select value={sourceLang} onValueChange={setSourceLang}>
                <SelectTrigger className="w-36 bg-muted border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map(lang => (
                    <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 p-4">
              <Textarea 
                placeholder="Enter or paste your text here..."
                className="h-full resize-none bg-transparent border-none focus-visible:ring-0 text-foreground placeholder:text-muted-foreground"
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
              />
            </div>
            <div className="p-3 border-t border-border flex items-center justify-end gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                <Volume2 className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>

          {/* Swap Button */}
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleSwapLanguages}
              className="h-10 w-10 rounded-full border border-border bg-card text-muted-foreground hover:text-primary hover:border-primary transition-colors"
            >
              <ArrowRightLeft className="h-4 w-4" />
            </Button>
          </div>

          {/* Target Panel */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 flex flex-col bg-card border border-border rounded-xl overflow-hidden"
          >
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-medium text-foreground">Translation</h3>
              <Select value={targetLang} onValueChange={setTargetLang}>
                <SelectTrigger className="w-36 bg-muted border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map(lang => (
                    <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 p-4">
              <ScrollArea className="h-full">
                {isTranslating ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Languages className="h-4 w-4" />
                    </motion.div>
                    <span className="text-sm">Translating...</span>
                  </div>
                ) : translatedText ? (
                  <p className="text-foreground whitespace-pre-wrap">{translatedText}</p>
                ) : (
                  <p className="text-muted-foreground">Translation will appear here...</p>
                )}
              </ScrollArea>
            </div>
            <div className="p-3 border-t border-border flex items-center justify-end gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                <Volume2 className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Right Settings Panel */}
      <aside className="w-72 border-l border-border bg-sidebar flex flex-col">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Settings</span>
          </div>
          <Button variant="link" className="text-xs text-primary hover:text-primary/80 p-0 h-auto">
            Manage Styles
          </Button>
        </div>

        <div className="flex-1 p-4 space-y-6">
          {/* LLM Selection */}
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground uppercase tracking-wider">LLM</label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-full bg-muted border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {llmModels.map(model => (
                  <SelectItem key={model.value} value={model.value}>
                    <div className="flex items-center justify-between w-full">
                      <span>{model.label}</span>
                      <span className="text-xs text-muted-foreground ml-2">{model.provider}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Style Selection */}
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground uppercase tracking-wider">Style</label>
            <Select value={selectedStyle} onValueChange={setSelectedStyle}>
              <SelectTrigger className="w-full bg-muted border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {styles.map(style => (
                  <SelectItem key={style.value} value={style.value}>{style.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Glossary Selection */}
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground uppercase tracking-wider">Glossary</label>
            <Select defaultValue="none">
              <SelectTrigger className="w-full bg-muted border-border">
                <SelectValue placeholder="No glossary" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No glossary</SelectItem>
                <SelectItem value="tech">Technical Terms</SelectItem>
                <SelectItem value="medical">Medical Terms</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 space-y-2">
          <Button 
            onClick={handleTranslate}
            disabled={!sourceText.trim() || isTranslating}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isTranslating ? 'Translating...' : 'Translate'}
          </Button>
          <Button 
            variant="outline" 
            onClick={handleClear}
            className="w-full border-border text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            Clear
          </Button>
        </div>
      </aside>
    </div>
  );
}
