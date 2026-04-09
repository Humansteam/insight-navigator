import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const THRESHOLDS = Array.from({ length: 21 }, (_, i) => i / 20);

/* ── Data ── */

const LENSES = [
  { id: "tech", label: "Технологическая", icon: "⚙", color: "#7c5cdb" },
  { id: "econ", label: "Экономическая", icon: "📊", color: "#5caade" },
  { id: "geo", label: "Геополитическая", icon: "🌐", color: "#e85d3a" },
  { id: "ethics", label: "Этическая", icon: "⚖", color: "#c8a050" },
];

const LENS_VOICES: Record<string, Array<{
  initials: string; name: string; role: string;
  quote: string; full: string; type: "verbatim" | "synthesis";
  source?: string; color: string; links?: string[];
}>> = {
  tech: [
    {
      initials: "AK", name: "Andrej Karpathy", role: "ex-OpenAI · ex-Tesla AI",
      quote: "Закрытое ядро — прагматичная страховка, не идеология.",
      full: "Open-source снижает барьер входа. Но закрытость ядра сохраняет leverage. Это не лицемерие — это архитектура бизнеса.",
      type: "verbatim", source: "YouTube, 12 Mar 2026, 14:32", color: "#5caade",
    },
    {
      initials: "YL", name: "Yann LeCun", role: "Chief AI Scientist · Meta",
      quote: "Открытая наука двигает прогресс быстрее закрытой.",
      full: "Мы публикуем модели чтобы ускорить исследования. Коммерческие ограничения — это вопрос sustainability, не контроля.",
      type: "verbatim", source: "NeurIPS 2025, Panel", color: "#50b478",
      links: ["Дополняет позицию Karpathy по sustainability"],
    },
  ],
  econ: [
    {
      initials: "PT", name: "Peter Thiel", role: "Zero to One · Founders Fund",
      quote: "Кто устанавливает правила платформы — тот и выигрывает.",
      full: "Открытость здесь инструмент контроля, а не ценность. Android показал это идеально: открытый снаружи, Google Play закрыт внутри.",
      type: "verbatim", source: "Stanford Lecture, Feb 2026", color: "#e85d3a",
    },
    {
      initials: "AI", name: "AI Synthesis", role: "на основе 8 источников",
      quote: "Гибридная лицензия Llama 4 создаёт двухуровневую экономику.",
      full: "Анализ 8 аналитических отчётов показывает: компании, использующие Llama, формируют зависимость от экосистемы Meta — аналог vendor lock-in через open-source.",
      type: "synthesis", color: "#9b7fe8",
    },
  ],
  geo: [
    {
      initials: "AI", name: "AI Synthesis", role: "12 источников · 4 страны",
      quote: "Open-source AI становится инструментом технологического суверенитета.",
      full: "Китай (DeepSeek, Qwen), EU (Mistral), и США (Meta, Google) строят параллельные open-source экосистемы. Каждая привязана к регуляторной среде своего региона.",
      type: "synthesis", color: "#e88a6a",
    },
    {
      initials: "EU", name: "EU AI Office", role: "Regulatory Statement",
      quote: "Open-source AI не освобождает от ответственности за harm.",
      full: "Позиция EU AI Act: open-source модели категории high-risk подлежат тем же требованиям, что и закрытые. Открытость кода ≠ открытость от регуляции.",
      type: "verbatim", source: "EU AI Office, Apr 2026", color: "#5caade",
    },
  ],
  ethics: [
    {
      initials: "TG", name: "Timnit Gebru", role: "DAIR Institute",
      quote: "Open-washing — новая форма корпоративного greenwashing.",
      full: "Называть модель 'open-source' при закрытых данных обучения — это манипуляция термином. Настоящая открытость требует прозрачности всего пайплайна.",
      type: "verbatim", source: "DAIR Report, Mar 2026", color: "#e85d3a",
    },
    {
      initials: "AI", name: "AI Synthesis", role: "5 источников",
      quote: "Этический парадокс: больше открытости может означать больше вреда.",
      full: "Открытые модели демократизируют доступ, но одновременно упрощают создание deepfakes, дезинформации и кибероружия. Баланс между доступностью и безопасностью остаётся нерешённым.",
      type: "synthesis", color: "#c8a050",
    },
  ],
};

const SOURCE_LOGOS = [
  { name: "Reuters", fact: "Meta нанимает Alexandr Wang", color: "#ff6b35" },
  { name: "Axios", fact: "Гибридная лицензия Llama 4", color: "#3b82f6" },
  { name: "The Verge", fact: "Google отвечает — Gemma остаётся открытой", color: "#a855f7" },
  { name: "TechCrunch", fact: "Scale AI partnership details", color: "#22c55e" },
  { name: "Wired", fact: "EU позиция по open-source AI", color: "#ef4444" },
  { name: "Ars Technica", fact: "Hugging Face анализ лицензий", color: "#f59e0b" },
  { name: "FT", fact: "Экономика open-source AI моделей", color: "#fecaca" },
];

const BULLETS = [
  "Meta переходит к гибридной лицензии — Llama 4 open-weight, но с закрытым inference stack",
  "Alexandr Wang (Scale AI) присоединяется к Meta AI — сигнал о data moat стратегии",
  "Google отвечает: Gemma остаётся полностью открытой, позиционируя себя как 'истинный open-source'",
  "EU AI Office впервые запрашивает позицию по регуляции open-source моделей",
  "Hugging Face публикует первый Open Source AI License Index — 47% моделей не соответствуют OSI определению",
];

const TRANSCRIPT_SEGMENTS = [
  { time: 0, text: "Три дня назад Meta тихо изменила правила игры.", speaker: null },
  { time: 8, text: "Компания объявила о найме Александра Вана из Scale AI и одновременно анонсировала гибридную лицензию для Llama 4.", speaker: null },
  { time: 18, text: "Что это значит на практике?", speaker: null },
  { time: 22, text: "Open-source снижает барьер входа. Но закрытость ядра сохраняет leverage.", speaker: "Andrej Karpathy", speakerColor: "#5caade" },
  { time: 35, text: "Мы видим классический паттерн platform capture — Android был 'открытым', но Google Play Store закрыт.", speaker: null },
  { time: 48, text: "Кто устанавливает правила платформы — тот и выигрывает. Это не про открытость, это про контроль.", speaker: "Peter Thiel", speakerColor: "#e85d3a" },
  { time: 62, text: "Параллельно, Китай строит свою экосистему. DeepSeek и Qwen формируют альтернативный центр притяжения.", speaker: null },
  { time: 75, text: "Мы публикуем модели чтобы ускорить исследования. Это не уступка — это стратегия ускорения.", speaker: "Yann LeCun", speakerColor: "#50b478" },
  { time: 88, text: "Вопрос не в том, открыт ли код. Вопрос — кто контролирует данные, инфраструктуру и стандарты.", speaker: null },
  { time: 100, text: "Через 5 лет 'open-source AI' может означать нечто совершенно иное, чем сегодня.", speaker: null },
];

const SMART_PROMPTS = [
  { text: "Мы обсудили технологию и экономику, но не затронули этику. Спросить, что думает Timnit Gebru?", icon: "💡" },
  { text: "Как именно гибридная лицензия Llama 4 отличается от существующих? Сравнить с Apache 2.0", icon: "🔍" },
  { text: "Есть ли исторические прецеденты? Как Java/Android прошли этот путь?", icon: "📜" },
];

const MEANING_MAP_NODES = [
  { id: "center", label: "Open-source\nкак оружие", x: 50, y: 50, size: 28, color: "#9b7fe8", type: "thesis" as const },
  { id: "f1", label: "Llama 4\nлицензия", x: 22, y: 30, size: 16, color: "#7c5cdb", type: "fact" as const },
  { id: "f2", label: "Scale AI\nнайм", x: 78, y: 25, size: 14, color: "#7c5cdb", type: "fact" as const },
  { id: "f3", label: "Gemma\nopen", x: 80, y: 65, size: 14, color: "#5caade", type: "fact" as const },
  { id: "o1", label: "Thiel:\nконтроль", x: 20, y: 70, size: 16, color: "#e85d3a", type: "opinion" as const },
  { id: "o2", label: "LeCun:\nпрогресс", x: 65, y: 82, size: 14, color: "#50b478", type: "opinion" as const },
  { id: "c1", label: "Захват\nстандарта", x: 35, y: 82, size: 15, color: "#c8a050", type: "conclusion" as const },
];

const MEANING_MAP_EDGES = [
  { from: "center", to: "f1" }, { from: "center", to: "f2" }, { from: "center", to: "f3" },
  { from: "center", to: "o1" }, { from: "center", to: "o2" }, { from: "center", to: "c1" },
  { from: "f1", to: "o1" }, { from: "o1", to: "c1" }, { from: "o2", to: "c1" },
];

/* ═══════════════════════════════════════════════
   SIGNAL PAGE — Golden Path: Сигнал → Контекст → Синтез
   ═══════════════════════════════════════════════ */

export default function Signal() {
  const drumRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const SLIDE_COUNT = 5;
  const [opacities, setOpacities] = useState(Array(SLIDE_COUNT).fill(0.08).map((v, i) => i === 0 ? 1 : v));
  const [active, setActive] = useState(0);

  // Lens state
  const [activeLens, setActiveLens] = useState("tech");
  const [expandedVoice, setExpandedVoice] = useState<number | null>(null);

  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const totalDuration = 110; // seconds
  const currentTime = (audioProgress / 100) * totalDuration;

  // Source tooltip
  const [hoveredSource, setHoveredSource] = useState<number | null>(null);

  // Meaning map node
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Temperature
  const temperature = 87;

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setAudioProgress((p) => {
        if (p >= 100) { setIsPlaying(false); return 0; }
        return p + 0.15;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const setSlideRef = useCallback(
    (idx: number) => (el: HTMLDivElement | null) => { slideRefs.current[idx] = el; },
    []
  );

  useEffect(() => {
    const drum = drumRef.current;
    if (!drum) return;
    const slides = slideRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!slides.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        setOpacities((prev) => {
          const next = [...prev];
          entries.forEach((e) => {
            const idx = slides.indexOf(e.target as HTMLDivElement);
            if (idx !== -1) next[idx] = Math.max(0.06, e.intersectionRatio);
          });
          return next;
        });
        entries.forEach((e) => {
          if (e.intersectionRatio > 0.5) {
            const idx = slides.indexOf(e.target as HTMLDivElement);
            if (idx !== -1) setActive(idx);
          }
        });
      },
      { root: drum, threshold: THRESHOLDS }
    );
    slides.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  const slideLabels = ["СИГНАЛ", "ЛИНЗЫ", "СИНТЕЗ", "RABBIT HOLE", ""];
  const slideColors = ["#9b7fe8", "#5caade", "#c4aff8", "#c8a050", "#50b478"];
  const currentLensVoices = LENS_VOICES[activeLens] || [];

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#060504" }}>
      <div
        className="relative flex flex-col overflow-hidden"
        style={{
          width: 380,
          height: 780,
          borderRadius: 48,
          background: "#0c0a08",
          border: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "0 60px 120px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.03)",
        }}
      >
        {/* Status bar */}
        <div className="flex-shrink-0 flex justify-between items-center relative z-10" style={{ padding: "16px 28px 0", fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.15)" }}>
          <span>09:41</span>
          <span style={{ fontSize: 8, letterSpacing: "0.08em" }}>●●● 5G</span>
        </div>

        {/* Nav header */}
        <div className="flex-shrink-0 flex items-center gap-3 relative z-10" style={{ padding: "10px 20px 12px", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
          <span style={{ fontSize: 22, color: "rgba(255,255,255,0.12)", cursor: "pointer" }}>‹</span>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span style={{ fontSize: 14, fontWeight: 600, color: "#e8e0d8", letterSpacing: "-0.02em" }}>Signal</span>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 7,
                padding: "2px 7px", borderRadius: 6,
                background: "rgba(155,127,232,0.1)", color: "#a088e8",
                letterSpacing: "0.08em", textTransform: "uppercase",
              }}>
                LIVE
              </span>
            </div>
          </div>
          {/* Path indicator */}
          <div className="flex items-center gap-1">
            {slideLabels.slice(0, 4).map((label, i) => (
              <div key={i} className="flex items-center gap-1">
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 6,
                  color: active >= i ? slideColors[i] : "rgba(255,255,255,0.1)",
                  letterSpacing: "0.04em",
                  transition: "color 0.3s",
                }}>
                  {i === 0 ? "◉" : i <= active ? "◉" : "○"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Drum */}
        <div
          ref={drumRef}
          className="flex-1 relative"
          style={{ overflowY: "auto", scrollSnapType: "y mandatory", WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
        >
          {/* Top fade */}
          <div className="sticky top-0 left-0 right-0 z-10 pointer-events-none" style={{ height: 40, background: "linear-gradient(to bottom, #0c0a08, transparent)", marginBottom: -40 }} />

          {/* ═══════════ LEVEL 1: СИГНАЛ (THE PULSE) ═══════════ */}
          <div
            ref={setSlideRef(0)}
            className="flex flex-col justify-center"
            style={{ scrollSnapAlign: "center", minHeight: "100%", padding: "16px 20px", opacity: opacities[0], transition: "opacity 0.2s ease" }}
          >
            <Mono color="rgba(155,127,232,0.5)">
              <Dot color="#9b7fe8" /> УРОВЕНЬ 1 · СИГНАЛ
            </Mono>

            {/* Main thesis */}
            <h1 style={{ fontSize: 20, fontWeight: 700, color: "#f0ece8", lineHeight: 1.25, letterSpacing: "-0.03em", marginTop: 10 }}>
              <span style={{ color: "#9b7fe8" }}>Open-source</span> становится оружием:{" "}
              Meta строит <span style={{ color: "#9b7fe8" }}>закрытую</span> экосистему через открытый код
            </h1>

            {/* Summary bullets */}
            <div className="flex flex-col gap-1.5" style={{ marginTop: 10 }}>
              {BULLETS.slice(0, 4).map((b, i) => (
                <div key={i} className="flex items-start gap-2" style={{ fontSize: 10.5, color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>
                  <span style={{ color: "#9b7fe8", fontSize: 6, marginTop: 4, flexShrink: 0 }}>●</span>
                  <span>{b}</span>
                </div>
              ))}
            </div>

            {/* Source cloud */}
            <div className="flex flex-wrap gap-1.5 items-center" style={{ marginTop: 10 }}>
              {SOURCE_LOGOS.map((s, i) => (
                <div
                  key={i}
                  onMouseEnter={() => setHoveredSource(i)}
                  onMouseLeave={() => setHoveredSource(null)}
                  className="relative"
                >
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 8,
                    padding: "3px 8px", borderRadius: 6,
                    background: hoveredSource === i ? s.color + "20" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${hoveredSource === i ? s.color + "40" : "rgba(255,255,255,0.04)"}`,
                    color: hoveredSource === i ? s.color : "rgba(255,255,255,0.2)",
                    cursor: "pointer", transition: "all 0.2s",
                    display: "inline-block",
                  }}>
                    {s.name}
                  </span>
                  <AnimatePresence>
                    {hoveredSource === i && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        style={{
                          position: "absolute", bottom: "100%", left: 0,
                          background: "#1a1816", border: `1px solid ${s.color}30`,
                          borderRadius: 8, padding: "6px 10px",
                          fontSize: 9, color: "rgba(255,255,255,0.5)",
                          whiteSpace: "nowrap", marginBottom: 4, zIndex: 20,
                          boxShadow: `0 4px 12px rgba(0,0,0,0.5)`,
                        }}
                      >
                        {s.fact}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Temperature gauge */}
            <div className="flex items-center gap-2.5" style={{ marginTop: 10 }}>
              <Mono color="rgba(232,93,58,0.5)">🌡 температура</Mono>
              <div style={{ flex: 1, height: 3, background: "rgba(255,255,255,0.04)", borderRadius: 2, position: "relative" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${temperature}%` }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  style={{
                    height: "100%", borderRadius: 2,
                    background: `linear-gradient(90deg, #50b478, #c8a050, #e85d3a)`,
                  }}
                />
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "#e88a6a" }}>{temperature}%</span>
            </div>

            {/* Audio player */}
            <div
              className="flex items-center gap-2.5"
              style={{
                marginTop: 10, background: "rgba(155,127,232,0.04)",
                border: "1px solid rgba(155,127,232,0.08)",
                borderRadius: 12, padding: "8px 12px",
              }}
            >
              <div
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center justify-center flex-shrink-0"
                style={{
                  width: 30, height: 30, borderRadius: "50%",
                  background: isPlaying ? "rgba(196,175,248,0.15)" : "rgba(155,127,232,0.12)",
                  border: `1px solid ${isPlaying ? "rgba(196,175,248,0.25)" : "rgba(155,127,232,0.2)"}`,
                  cursor: "pointer", fontSize: 12, color: "#c4aff8",
                }}
              >
                {isPlaying ? "⏸" : "▶"}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-[1.5px]" style={{ height: 18 }}>
                  {Array.from({ length: 40 }).map((_, i) => {
                    const h = Math.sin(i * 0.4) * 5 + Math.random() * 3 + 3;
                    const filled = (i / 40) * 100 < audioProgress;
                    return (
                      <div key={i} style={{
                        width: 2, borderRadius: 1, height: h,
                        background: filled ? "#c4aff8" : "rgba(255,255,255,0.06)",
                        transition: "background 0.15s",
                      }} />
                    );
                  })}
                </div>
                <div className="flex justify-between" style={{ marginTop: 1 }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 7, color: "rgba(255,255,255,0.12)" }}>
                    {Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, "0")}
                  </span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 7, color: "rgba(255,255,255,0.12)" }}>1:50 · AI essay</span>
                </div>
              </div>
            </div>

            <ScrollHint text="контекст и линзы" />
          </div>

          {/* ═══════════ LEVEL 2: КОНТЕКСТ И ЛИНЗЫ ═══════════ */}
          <div
            ref={setSlideRef(1)}
            className="flex flex-col justify-center"
            style={{ scrollSnapAlign: "center", minHeight: "100%", padding: "16px 20px", opacity: opacities[1], transition: "opacity 0.2s ease" }}
          >
            <Mono color="rgba(92,170,219,0.5)">
              <Dot color="#5caade" /> УРОВЕНЬ 2 · ЛИНЗЫ
            </Mono>

            <div style={{ fontSize: 14, fontWeight: 600, color: "#e8e0d8", marginTop: 8, marginBottom: 8, letterSpacing: "-0.01em" }}>
              Посмотри через разные линзы
            </div>

            {/* Lens switcher */}
            <div className="flex gap-1.5 flex-wrap" style={{ marginBottom: 10 }}>
              {LENSES.map((lens) => (
                <button
                  key={lens.id}
                  onClick={() => { setActiveLens(lens.id); setExpandedVoice(null); }}
                  style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 8,
                    padding: "4px 10px", borderRadius: 8,
                    background: activeLens === lens.id ? lens.color + "18" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${activeLens === lens.id ? lens.color + "35" : "rgba(255,255,255,0.04)"}`,
                    color: activeLens === lens.id ? lens.color : "rgba(255,255,255,0.2)",
                    cursor: "pointer", transition: "all 0.25s",
                    letterSpacing: "0.04em",
                  }}
                >
                  {lens.icon} {lens.label}
                </button>
              ))}
            </div>

            {/* Voice cards for active lens */}
            <div className="flex flex-col gap-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeLens}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col gap-2"
                >
                  {currentLensVoices.map((v, i) => (
                    <motion.div
                      key={i}
                      layout
                      onClick={() => setExpandedVoice(expandedVoice === i ? null : i)}
                      style={{
                        background: "#12100e",
                        border: `1px solid ${expandedVoice === i ? v.color + "25" : "rgba(255,255,255,0.04)"}`,
                        borderRadius: 10,
                        padding: "10px 12px",
                        cursor: "pointer",
                        transition: "border-color 0.2s",
                      }}
                    >
                      <div className="flex items-center gap-2.5" style={{ marginBottom: 5 }}>
                        <div className="flex items-center justify-center flex-shrink-0" style={{
                          width: 26, height: 26, borderRadius: "50%",
                          background: v.color + "14", border: `1px solid ${v.color}25`,
                          fontFamily: "'JetBrains Mono', monospace", fontSize: 7, color: v.color,
                        }}>
                          {v.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>{v.name}</div>
                          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 7, color: "rgba(255,255,255,0.15)" }}>{v.role}</div>
                        </div>
                        {/* Trust badge */}
                        <span style={{
                          fontFamily: "'JetBrains Mono', monospace", fontSize: 6,
                          padding: "2px 6px", borderRadius: 4,
                          background: v.type === "verbatim" ? "rgba(80,180,120,0.1)" : "rgba(155,127,232,0.1)",
                          color: v.type === "verbatim" ? "#50b478" : "#9b7fe8",
                          letterSpacing: "0.06em", textTransform: "uppercase",
                        }}>
                          {v.type === "verbatim" ? "ДОСЛОВНО" : "СИНТЕЗ AI"}
                        </span>
                      </div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", lineHeight: 1.5 }}>
                        «{v.quote}»
                      </div>
                      <AnimatePresence>
                        {expandedVoice === i && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            style={{ overflow: "hidden" }}
                          >
                            <div style={{ marginTop: 6, paddingTop: 6, borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", lineHeight: 1.6 }}>{v.full}</div>
                              {v.source && (
                                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 7, color: v.color, opacity: 0.5, marginTop: 4 }}>
                                  📎 {v.source}
                                </div>
                              )}
                              {v.links?.map((link, li) => (
                                <div key={li} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 7, color: "rgba(255,255,255,0.15)", marginTop: 3 }}>
                                  🔗 {link}
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            <ScrollHint text="синтез и аудио-эссе" />
          </div>

          {/* ═══════════ LEVEL 3: СИНТЕЗ (THE DEEP DIVE) ═══════════ */}
          <div
            ref={setSlideRef(2)}
            className="flex flex-col justify-center"
            style={{ scrollSnapAlign: "center", minHeight: "100%", padding: "16px 20px", opacity: opacities[2], transition: "opacity 0.2s ease" }}
          >
            <Mono color="rgba(196,175,248,0.5)">
              <Dot color="#c4aff8" /> УРОВЕНЬ 3 · СИНТЕЗ
            </Mono>

            <div style={{ fontSize: 14, fontWeight: 600, color: "#e8e0d8", marginTop: 8, marginBottom: 8, letterSpacing: "-0.01em" }}>
              Интерактивный аудио-эссе
            </div>

            {/* Interactive transcript */}
            <div style={{
              background: "#0f0d0b",
              border: "1px solid rgba(196,175,248,0.08)",
              borderRadius: 12, padding: "10px 12px",
              maxHeight: 200, overflowY: "auto", scrollbarWidth: "none",
            }}>
              {TRANSCRIPT_SEGMENTS.map((seg, i) => {
                const isActive = currentTime >= seg.time && (i === TRANSCRIPT_SEGMENTS.length - 1 || currentTime < TRANSCRIPT_SEGMENTS[i + 1].time);
                return (
                  <div
                    key={i}
                    style={{
                      padding: "4px 6px",
                      borderRadius: 6,
                      background: isActive ? "rgba(196,175,248,0.06)" : "transparent",
                      transition: "all 0.3s",
                      marginBottom: 2,
                    }}
                  >
                    {seg.speaker && (
                      <span style={{
                        fontFamily: "'JetBrains Mono', monospace", fontSize: 7,
                        color: seg.speakerColor || "#9b7fe8",
                        letterSpacing: "0.04em", display: "block", marginBottom: 1,
                      }}>
                        {seg.speaker}
                      </span>
                    )}
                    <span style={{
                      fontSize: 10, lineHeight: 1.5,
                      color: isActive ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.2)",
                      transition: "color 0.3s",
                    }}>
                      {seg.text}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Meaning map */}
            <div style={{ marginTop: 10 }}>
              <Mono color="rgba(155,127,232,0.4)">карта смыслов</Mono>
              <div style={{
                position: "relative", height: 160, marginTop: 6,
                background: "rgba(155,127,232,0.02)",
                border: "1px solid rgba(155,127,232,0.06)",
                borderRadius: 12, overflow: "hidden",
              }}>
                {/* Edges */}
                <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
                  {MEANING_MAP_EDGES.map((edge, i) => {
                    const from = MEANING_MAP_NODES.find(n => n.id === edge.from)!;
                    const to = MEANING_MAP_NODES.find(n => n.id === edge.to)!;
                    return (
                      <line
                        key={i}
                        x1={`${from.x}%`} y1={`${from.y}%`}
                        x2={`${to.x}%`} y2={`${to.y}%`}
                        stroke="rgba(155,127,232,0.1)" strokeWidth={1}
                      />
                    );
                  })}
                </svg>
                {/* Nodes */}
                {MEANING_MAP_NODES.map((node) => (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                    style={{
                      position: "absolute",
                      left: `${node.x}%`, top: `${node.y}%`,
                      transform: "translate(-50%, -50%)",
                      width: node.size * 2, height: node.size * 2,
                      borderRadius: "50%",
                      background: selectedNode === node.id ? node.color + "25" : node.color + "10",
                      border: `1px solid ${node.color}${selectedNode === node.id ? "50" : "20"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", transition: "all 0.2s",
                      boxShadow: selectedNode === node.id ? `0 0 12px ${node.color}30` : "none",
                    }}
                  >
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: node.id === "center" ? 6 : 5,
                      color: node.color,
                      textAlign: "center", lineHeight: 1.2,
                      whiteSpace: "pre-line",
                    }}>
                      {node.label}
                    </span>
                  </div>
                ))}
              </div>
              {/* Legend */}
              <div className="flex items-center gap-3" style={{ marginTop: 4 }}>
                {[
                  { label: "факт", color: "#7c5cdb" },
                  { label: "мнение", color: "#e85d3a" },
                  { label: "вывод", color: "#c8a050" },
                ].map((l, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: l.color, display: "inline-block" }} />
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 6, color: "rgba(255,255,255,0.15)" }}>{l.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <ScrollHint text="провокация" />
          </div>

          {/* ═══════════ LEVEL 4: RABBIT HOLE + REFLECTION ═══════════ */}
          <div
            ref={setSlideRef(3)}
            className="flex flex-col justify-center gap-3"
            style={{ scrollSnapAlign: "center", minHeight: "100%", padding: "16px 20px", opacity: opacities[3], transition: "opacity 0.2s ease" }}
          >
            <Mono color="rgba(200,160,80,0.5)">
              <Dot color="#c8a050" /> ПРОВОКАЦИЯ
            </Mono>

            {/* Provocative question */}
            <div style={{
              background: "linear-gradient(135deg, rgba(200,160,80,0.06), rgba(155,127,232,0.04))",
              border: "1px solid rgba(200,160,80,0.1)",
              borderRadius: 14, padding: "18px 16px",
            }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 7, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(200,160,80,0.45)", marginBottom: 10 }}>
                THE RABBIT HOLE
              </div>
              <div style={{ fontSize: 15, color: "#e8e0d8", lineHeight: 1.55, fontStyle: "italic", letterSpacing: "-0.01em" }}>
                Если открытость — это механизм захвата, а не ценность — не станет ли «независимый open-source» через 5 лет оксюмороном?
              </div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", lineHeight: 1.5, marginTop: 10 }}>
                В данных нет однозначного ответа. 43% источников видят консолидацию, 31% — фрагментацию, 26% — гибридный сценарий.
              </div>
            </div>

            {/* Save to Second Brain */}
            <div style={{
              background: "rgba(80,180,120,0.04)",
              border: "1px solid rgba(80,180,120,0.1)",
              borderRadius: 10, padding: "10px 14px",
              display: "flex", alignItems: "center", gap: 8,
              cursor: "pointer",
            }}>
              <span style={{ fontSize: 16 }}>🧠</span>
              <div>
                <div style={{ fontSize: 10, color: "rgba(80,180,120,0.6)", fontWeight: 500 }}>Добавить в Second Brain</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 7, color: "rgba(255,255,255,0.12)", marginTop: 1 }}>
                  Сохранить инсайт + связи в личную базу
                </div>
              </div>
            </div>

            {/* Next collision */}
            <div style={{
              background: "#14120f",
              border: "1px solid rgba(155,127,232,0.08)",
              borderRadius: 10, padding: "12px 14px",
            }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 7, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.1)", marginBottom: 6 }}>
                Следующий Signal →
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", lineHeight: 1.5 }}>
                Platform dynamics × Geopolitical fragmentation →{" "}
                <span style={{ color: "#9b7fe8" }}>Почему китайский open-source неизбежен</span>
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 7, color: "rgba(255,255,255,0.1)", marginTop: 4 }}>
                19 источников · 2 дня · формируется
              </div>
            </div>

            <ScrollHint text="↑ или задай вопрос" />
          </div>

          {/* Bottom spacer for last snap */}
          <div ref={setSlideRef(4)} style={{ scrollSnapAlign: "center", minHeight: "1px" }} />

          {/* Bottom fade */}
          <div className="sticky bottom-0 left-0 right-0 z-10 pointer-events-none" style={{ height: 40, background: "linear-gradient(to top, #0c0a08, transparent)", marginTop: -40 }} />
        </div>

        {/* Progress dots (right) */}
        <div className="absolute flex flex-col gap-1.5 z-20" style={{ right: 14, top: "50%", transform: "translateY(-50%)" }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 4,
                height: active === i ? 18 : 4,
                borderRadius: active === i ? 2 : "50%",
                background: active === i ? slideColors[i] : "rgba(255,255,255,0.06)",
                transition: "all 0.3s ease",
                boxShadow: active === i ? `0 0 8px ${slideColors[i]}30` : "none",
              }}
            />
          ))}
        </div>

        {/* Smart input bar */}
        <div className="flex-shrink-0 relative z-10" style={{ borderTop: "1px solid rgba(255,255,255,0.03)", background: "#0c0a08" }}>
          {/* Smart prompts */}
          <AnimatePresence>
            {active >= 2 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                style={{ overflow: "hidden" }}
              >
                <div className="flex flex-col gap-1" style={{ padding: "6px 16px 0" }}>
                  {SMART_PROMPTS.slice(0, 2).map((p, i) => (
                    <div
                      key={i}
                      style={{
                        fontSize: 8, color: "rgba(255,255,255,0.2)",
                        padding: "5px 8px", borderRadius: 8,
                        background: "rgba(155,127,232,0.03)",
                        border: "1px solid rgba(155,127,232,0.06)",
                        cursor: "pointer",
                        lineHeight: 1.4,
                      }}
                    >
                      <span style={{ marginRight: 4 }}>{p.icon}</span>
                      {p.text}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-2 items-center" style={{ padding: "8px 16px 20px" }}>
            <div className="flex-1" style={{
              background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: 20, padding: "9px 14px",
              fontSize: 11, color: "rgba(255,255,255,0.15)",
            }}>
              Задать вопрос к Signal...
            </div>
            <div className="flex items-center justify-center flex-shrink-0" style={{
              width: 34, height: 34, borderRadius: "50%",
              background: "rgba(155,127,232,0.12)", border: "1px solid rgba(155,127,232,0.2)",
              fontSize: 14, color: "#c4aff8", cursor: "pointer",
            }}>
              ↑
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Helpers ── */

function Mono({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <div className="flex items-center gap-1.5" style={{
      fontFamily: "'JetBrains Mono', monospace", fontSize: 8,
      letterSpacing: "0.1em", textTransform: "uppercase", color,
    }}>
      {children}
    </div>
  );
}

function Dot({ color }: { color: string }) {
  return <span style={{ width: 5, height: 5, borderRadius: "50%", background: color, display: "inline-block", flexShrink: 0 }} />;
}

function ScrollHint({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-1.5" style={{
      fontFamily: "'JetBrains Mono', monospace", fontSize: 8,
      color: "rgba(255,255,255,0.1)", letterSpacing: "0.05em", marginTop: 10,
    }}>
      <motion.span animate={{ y: [0, 3, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>↓</motion.span>
      {text}
    </div>
  );
}
