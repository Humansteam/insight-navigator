import { useState, useMemo } from 'react';
import { ChevronRight, PanelRight, Loader2, Languages, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockNodes } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { InlinePaperCard } from '@/components/cockpit/InlinePaperCard';
import { PipelineDAG } from '@/components/cockpit/PipelineDAG';
import { useEngineData } from '@/hooks/useEngineData';
import { DataNode } from '@/types/morphik';

const Index = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Engine data hook
  const {
    phase,
    papers: enginePapers,
    dimensions,
    topology,
    report,
    error,
    isLoading,
    input,
    setInput,
    handleSubmit,
  } = useEngineData();

  // Use engine papers if available, otherwise mock data
  const papers = enginePapers.length > 0 ? enginePapers : mockNodes;

  // Helper to get paper by id
  const getPaperById = (id: string) => papers.find(p => p.id === id);
  const getPaperIndex = (id: string) => papers.findIndex(p => p.id === id) + 1;

  // Progress dots based on phase
  const phaseDots = useMemo(() => {
    const phases = ['planning', 'retrieval', 'schema_design', 'extraction', 'topology', 'synthesis'];
    const currentIndex = phases.indexOf(phase);
    return phases.map((_, i) => i <= currentIndex || phase === 'complete');
  }, [phase]);

  // Inline paper reference component
  const PaperReference = ({ id }: { id: string }) => {
    const paper = getPaperById(id);
    if (!paper) return null;
    return <InlinePaperCard paper={paper} index={getPaperIndex(id)} />;
  };

  // Dynamic paper reference by index
  const DynamicPaperRef = ({ index }: { index: number }) => {
    const paper = papers[index];
    if (!paper) return null;
    return <InlinePaperCard paper={paper} index={index + 1} />;
  };

  // Render report content - dynamic when engine data available
  const renderReportContent = () => {
    // If we have engine report with structured data, render it
    if (report?.title || report?.markdown) {
      return (
        <EngineReportRenderer
          report={{
            title: report.title || 'Research Analysis',
            lead: report.lead || '',
            abstract: report.abstract || '',
            methodology: report.methodology || '',
            markdown: report.markdown || '',
          }}
          papers={papers}
        />
      );
    }

    // Default static content (mockData)
    return (
      <>
        {/* Title */}
        <h1 className="text-4xl font-serif font-normal text-foreground mb-6">
          STRATA RESEARCH
        </h1>

        {/* Lead paragraph */}
        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
          В условиях ограниченного доступа к западным базам (Scopus/WoS), Strata Research выступает как единая точка доступа к глобальной науке. Мы легально агрегируем метаданные и полные тексты ведущих мировых издательств (Elsevier, Springer, IEEE, ACS) и российской науки (партнерство с изд. «Наука» РАН + 300 журналов).
        </p>

        {/* Abstract Section */}
        <SectionHeader title="ПРОБЛЕМА И РЕШЕНИЕ" />
        <p className="text-base text-foreground/90 leading-relaxed mb-6">
          Наш AI-движок превращает хаос неструктурированных данных в готовый аналитический продукт. Платформа обеспечивает единую точку доступа к глобальной научной информации, преодолевая барьеры ограниченного доступа к международным базам данных.
        </p>

        {/* Methods Section */}
        <CollapsibleSection title="ТЕХНОЛОГИЧЕСКОЕ ЯДРО (THE ENGINE)">
          <div className="space-y-3">
            <p className="text-base text-foreground/90 leading-relaxed">
              <span className="font-semibold text-primary">RAG + Visual RAG:</span> Гибридный поиск по текстам, диаграммам и таблицам.
            </p>
            <p className="text-base text-foreground/90 leading-relaxed">
              <span className="font-semibold text-primary">Graph RAG:</span> Выявление скрытых связей и цитирований.
            </p>
            <p className="text-base text-foreground/90 leading-relaxed">
              <span className="font-semibold text-primary">UMAP + KNN:</span> Топологическое моделирование ландшафта (вид "сверху").
            </p>
            <p className="text-base text-foreground/90 leading-relaxed">
              <span className="font-semibold text-primary">Agentic Reasoning:</span> Агентный синтез финальных выводов и гипотез.
            </p>
          </div>
        </CollapsibleSection>

        {/* Results Section */}
        <SectionHeader title="ПИЛОТНЫЙ КЕЙС: ADVANCED MATERIALS (2024–2025)" />
        <h4 className="text-lg font-semibold text-foreground mb-2">Масштаб исследования</h4>
        <p className="text-base text-foreground/90 leading-relaxed mb-6">
          Мы доказали эффективность на реальных данных. Обработано <span className="font-semibold text-primary">75 000</span> статей, из которых AI отобрал <span className="font-semibold text-primary">20 000</span> высокорелевантных исследований (США, Китай, РФ) по ключевым направлениям.
        </p>

        {/* Thematic Analysis */}
        <h4 className="text-lg font-semibold text-foreground mt-8 mb-4">Ключевые направления</h4>

        <h5 className="text-base font-semibold text-foreground mb-2">Композиты</h5>
        <p className="text-base text-foreground/90 leading-relaxed mb-4">
          Углеволокно, прекурсоры, современные эпоксидные связующие. Анализ патентного ландшафта и выявление технологических лидеров в области высокопрочных материалов.
        </p>

        <h5 className="text-base font-semibold text-foreground mb-2 mt-6">Аддитивные технологии</h5>
        <p className="text-base text-foreground/90 leading-relaxed mb-4">
          SLM-печать, металлопорошки, AI-дефектоскопия. Картирование исследовательских кластеров и определение точек технологического прорыва.
        </p>

        <h5 className="text-base font-semibold text-foreground mb-2 mt-6">Накопители энергии</h5>
        <p className="text-base text-foreground/90 leading-relaxed mb-4">
          Li-ion катоды, твердотельные электролиты, технологии рециклинга. Систематический обзор с выделением наиболее перспективных направлений развития.
        </p>

        {/* Result highlight */}
        <div className="mt-8 p-4 rounded-lg bg-primary/5 border border-primary/20">
          <p className="text-base text-foreground/90 leading-relaxed">
            <span className="font-semibold text-primary">Результат:</span> Заказчик получил не список ссылок, а интерактивную 3D-карту технологий и структурированный отчет с выявленными трендами.
          </p>
        </div>

        {/* Key Advantages */}
        <SectionHeader title="КЛЮЧЕВЫЕ ПРЕИМУЩЕСТВА" />
        
        <h5 className="text-base font-semibold text-foreground mb-2">Безопасность (On-premise)</h5>
        <p className="text-base text-foreground/90 leading-relaxed mb-4">
          Решение класса Enterprise, которое можно развернуть локально в закрытом контуре заказчика (на open-source моделях Qwen/Llama/Saiga). Полная конфиденциальность запросов.
        </p>

        <h5 className="text-base font-semibold text-foreground mb-2 mt-6">Глубокая структуризация</h5>
        <p className="text-base text-foreground/90 leading-relaxed mb-4">
          Многостадийный Reasoning Pipeline извлекает факты, которые пропускает обычный поиск.
        </p>

        <h5 className="text-base font-semibold text-foreground mb-2 mt-6">Визуальная навигация</h5>
        <p className="text-base text-foreground/90 leading-relaxed mb-4">
          В отличие от текстовых списков (Elicit, Consensus), мы даем 3D-обзор поля (UMAP), позволяя мгновенно видеть кластеры и белые пятна.
        </p>

        <h5 className="text-base font-semibold text-foreground mb-2 mt-6">Междисциплинарный поиск (Discovery)</h5>
        <p className="text-base text-foreground/90 leading-relaxed mb-4">
          Находит неочевидные пересечения (например, методы из «Физики плазмы» применимые в «Обработке материалов»).
        </p>

        <h5 className="text-base font-semibold text-foreground mb-2 mt-6">Мультиязычность</h5>
        <p className="text-base text-foreground/90 leading-relaxed mb-4">
          Мгновенный перевод и анализ материалов на 40+ языках (стираем языковой барьер с Китаем и Азией).
        </p>
      </>
    );
  };

  return (
    <div className="h-screen w-full flex bg-background relative">
      {/* Left Panel: Report + Chat */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-14 flex items-center justify-between px-6 border-b border-border">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-medium text-foreground">
              {report?.title || 'Exploring Lithium Battery Research'}
            </h2>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {phaseDots.map((active, i) => (
                <div key={i} className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  active ? "bg-primary" : "bg-muted"
                )} />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {phase === 'idle' ? 'Research report' : phase === 'complete' ? 'Complete' : phase.replace('_', ' ')}
            </span>
            <Link
              to="/about"
              className="w-9 h-9 rounded-lg border border-border flex items-center justify-center hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
              title="About Strata"
            >
              <Info className="w-4 h-4" />
            </Link>
            <Link
              to="/translate"
              className="w-9 h-9 rounded-lg border border-border flex items-center justify-center hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
              title="Translate"
            >
              <Languages className="w-4 h-4" />
            </Link>
            <ThemeSwitcher />
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={cn(
                "w-9 h-9 rounded-lg border flex items-center justify-center transition-colors",
                isSidebarOpen
                  ? "bg-secondary border-border"
                  : "bg-background border-border hover:bg-accent"
              )}
            >
              <PanelRight className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Report Content */}
        <div className="flex-1 overflow-auto">
          {isLoading && phase !== 'complete' ? (
            <PipelineDAG
              query={input || 'Analyzing...'}
              onComplete={() => {}}
            />
          ) : (
            <div className="max-w-3xl mx-auto px-8 py-10">
              {/* Date */}
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">
                {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()}
              </p>

              {error ? (
                <div className="text-red-500 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  Error: {error}
                </div>
              ) : (
                renderReportContent()
              )}
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="p-4 bg-background">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <input
                  type="text"
                  placeholder="Enter your research query..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-4 py-3 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-base disabled:opacity-50"
                />
                <div className="flex items-center justify-between px-4 py-2 border-t border-border/50">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      + 
                    </button>
                    <span className="text-xs text-muted-foreground">
                      {isLoading ? `${phase.replace('_', ' ')}...` : 'Searching 165K papers'}
                    </span>
                  </div>
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="w-7 h-7 rounded-full bg-muted flex items-center justify-center hover:bg-muted-foreground/20 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-muted-foreground rotate-[-90deg]" />
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Right Sidebar: Evidence Matrix */}
      <div className={cn(
        "border-l border-border flex flex-col transition-all duration-300 ease-in-out",
        isSidebarOpen ? "w-[360px]" : "w-0 overflow-hidden border-l-0"
      )}>
        <div className="p-4 border-b border-border min-w-[360px]">
          <h3 className="text-sm font-medium text-primary">Evidence Matrix</h3>
        </div>
        <div className="flex-1 overflow-auto min-w-[360px]">
          {papers.map((paper) => (
            <div
              key={paper.id}
              className="px-4 py-3 border-b border-border/50 hover:bg-muted/30 cursor-pointer transition-colors relative"
            >
              <div className="absolute top-3 right-4 flex flex-col items-end gap-1">
                <span className="text-xs font-medium text-primary">
                  {Math.round(paper.score * 100)}%
                </span>
                <div className="w-10 h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${paper.score * 100}%` }}
                  />
                </div>
              </div>
              <h4 className="text-sm font-medium text-foreground leading-snug mb-1 line-clamp-2 pr-14">
                {paper.title}
              </h4>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground truncate max-w-[220px]">
                  {paper.authors.join(', ')}
                </p>
                <span className="text-xs text-muted-foreground">{paper.year}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Engine Report Renderer - renders structured Lovable format
interface EngineReportProps {
  report: {
    title: string;
    lead: string;
    abstract: string;
    methodology: string;
    markdown: string;
  };
  papers: DataNode[];
}

const EngineReportRenderer = ({ report, papers }: EngineReportProps) => {
  const [methodsOpen, setMethodsOpen] = useState(false);

  const getPaperById = (id: number) => papers.find(p => p.id === `paper-${id}` || p.id === String(id));

  // Render markdown body with [[paper_id]] citations
  const renderMarkdownWithCitations = (text: string) => {
    if (!text) return null;

    const parts = text.split(/(\[\[\d+\]\])/g);

    return parts.map((part, i) => {
      const match = part.match(/\[\[(\d+)\]\]/);
      if (match) {
        const paperId = parseInt(match[1], 10);
        const paper = getPaperById(paperId);
        if (paper) {
          const index = papers.indexOf(paper) + 1;
          return <InlinePaperCard key={i} paper={paper} index={index} />;
        }
        return <sup key={i} className="text-primary cursor-pointer">*</sup>;
      }

      // Parse markdown headers and paragraphs
      const lines = part.split('\n');
      return lines.map((line, j) => {
        const trimmed = line.trim();
        if (!trimmed) return null;

        // ### Header
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={`${i}-${j}`} className="text-lg font-semibold text-foreground mt-8 mb-4">
              {trimmed.replace('### ', '')}
            </h4>
          );
        }

        // #### Subheader
        if (trimmed.startsWith('#### ')) {
          return (
            <h5 key={`${i}-${j}`} className="text-base font-semibold text-foreground mb-2 mt-6">
              {trimmed.replace('#### ', '')}
            </h5>
          );
        }

        // Regular paragraph (may end with *)
        const hasCitation = trimmed.endsWith('*');
        const cleanText = trimmed.replace(/\s*\*\s*$/, '');

        if (cleanText) {
          return (
            <p key={`${i}-${j}`} className="text-base text-foreground/90 leading-relaxed mb-2">
              {cleanText}
              {hasCitation && <sup className="text-primary mx-0.5">*</sup>}
            </p>
          );
        }

        return null;
      });
    });
  };

  return (
    <>
      {/* Title */}
      <h1 className="text-4xl font-serif font-normal text-foreground mb-6">
        {report.title}
      </h1>

      {/* Lead paragraph (italic/muted) */}
      {report.lead && (
        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
          {report.lead}
        </p>
      )}

      {/* ABSTRACT section */}
      {report.abstract && (
        <>
          <SectionHeader title="ABSTRACT" />
          <p className="text-base text-foreground/90 leading-relaxed mb-6">
            {report.abstract}
          </p>
        </>
      )}

      {/* METHODS section (collapsible) */}
      {report.methodology && (
        <div className="mb-6">
          <button
            onClick={() => setMethodsOpen(!methodsOpen)}
            className="flex items-center gap-2 text-sm font-semibold text-primary tracking-wide mb-3 hover:opacity-80 transition-opacity"
          >
            METHODS
            <ChevronRight className={cn("w-4 h-4 transition-transform", methodsOpen && "rotate-90")} />
          </button>
          {methodsOpen && (
            <p className="text-base text-foreground/90 leading-relaxed">
              {report.methodology}
            </p>
          )}
        </div>
      )}

      {/* RESULTS section header */}
      <SectionHeader title="RESULTS" />

      {/* Markdown body with citations */}
      {renderMarkdownWithCitations(report.markdown)}
    </>
  );
};

// Citation component
const Citation = ({ id }: { id: string }) => (
  <sup className="text-primary cursor-pointer hover:underline mx-0.5">*</sup>
);

// Section Header
const SectionHeader = ({ title }: { title: string }) => (
  <h3 className="text-sm font-semibold text-primary tracking-wide mb-3">{title}</h3>
);

// Collapsible Section
const CollapsibleSection = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm font-semibold text-primary tracking-wide mb-3 hover:opacity-80 transition-opacity"
      >
        {title}
        <ChevronRight className={cn("w-4 h-4 transition-transform", isOpen && "rotate-90")} />
      </button>
      {isOpen && children}
    </div>
  );
};

export default Index;