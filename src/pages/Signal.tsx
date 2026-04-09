import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const THRESHOLDS = Array.from({ length: 21 }, (_, i) => i / 20);

/* ── Data ── */

const LENSES = [
  { id: "tech", label: "Tech", color: "#7c5cdb" },
  { id: "econ", label: "Econ", color: "#5caade" },
  { id: "geo", label: "Geo", color: "#e85d3a" },
  { id: "ethics", label: "Ethics", color: "#c8a050" },
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
      full: "Китай (DeepSeek, Qwen), EU (Mistral), и США (Meta, Google) строят параллельные open-source экосистемы.",
      type: "synthesis", color: "#e88a6a",
    },
    {
      initials: "EU", name: "EU AI Office", role: "Regulatory Statement",
      quote: "Open-source AI не освобождает от ответственности за harm.",
      full: "Позиция EU AI Act: open-source модели категории high-risk подлежат тем же требованиям, что и закрытые.",
      type: "verbatim", source: "EU AI Office, Apr 2026", color: "#5caade",
    },
  ],
  ethics: [
    {
      initials: "TG", name: "Timnit Gebru", role: "DAIR Institute",
      quote: "Open-washing — новая форма корпоративного greenwashing.",
      full: "Называть модель 'open-source' при закрытых данных обучения — это манипуляция термином.",
      type: "verbatim", source: "DAIR Report, Mar 2026", color: "#e85d3a",
    },
    {
      initials: "AI", name: "AI Synthesis", role: "5 источников",
      quote: "Этический парадокс: больше открытости может означать больше вреда.",
      full: "Открытые модели демократизируют доступ, но одновременно упрощают создание deepfakes и дезинформации.",
      type: "synthesis", color: "#c8a050",
    },
  ],
};

const SOURCE_LOGOS = [
  { name: "Reuters", fact: "Meta нанимает Alexandr Wang" },
  { name: "Axios", fact: "Гибридная лицензия Llama 4" },
  { name: "The Verge", fact: "Gemma остаётся открытой" },
  { name: "TechCrunch", fact: "Scale AI partnership" },
  { name: "Wired", fact: "EU позиция по open-source" },
  { name: "Ars Technica", fact: "Анализ лицензий" },
  { name: "FT", fact: "Экономика open-source AI" },
];

const BULLETS = [
  "Meta переходит к гибридной лицензии — Llama 4 open-weight, но с закрытым inference stack",
  "Alexandr Wang (Scale AI) присоединяется к Meta AI — сигнал о data moat стратегии",
  "Google отвечает: Gemma остаётся полностью открытой",
];

const TRANSCRIPT_SEGMENTS = [
  { time: 0, text: "Три дня назад Meta тихо изменила правила игры.", speaker: null, speakerColor: null },
  { time: 8, text: "Компания объявила о найме Александра Вана из Scale AI и одновременно анонсировала гибридную лицензию для Llama 4.", speaker: null, speakerColor: null },
  { time: 18, text: "Что это значит на практике?", speaker: null, speakerColor: null },
  { time: 22, text: "Open-source снижает барьер входа. Но закрытость ядра сохраняет leverage.", speaker: "Andrej Karpathy", speakerColor: "#5caade" },
  { time: 35, text: "Мы видим классический паттерн platform capture.", speaker: null, speakerColor: null },
  { time: 48, text: "Кто устанавливает правила платформы — тот и выигрывает.", speaker: "Peter Thiel", speakerColor: "#e85d3a" },
  { time: 62, text: "Параллельно, Китай строит свою экосистему.", speaker: null, speakerColor: null },
  { time: 75, text: "Мы публикуем модели чтобы ускорить исследования.", speaker: "Yann LeCun", speakerColor: "#50b478" },
  { time: 88, text: "Вопрос — кто контролирует данные, инфраструктуру и стандарты.", speaker: null, speakerColor: null },
  { time: 100, text: "Через 5 лет «open-source AI» может означать нечто совершенно иное.", speaker: null, speakerColor: null },
];

const SMART_PROMPTS = [
  "Спросить про этику — что думает Timnit Gebru?",
  "Сравнить лицензию Llama 4 с Apache 2.0",
];

const MEANING_MAP_NODES = [
  { id: "center", label: "Open-source\nкак оружие", x: 50, y: 50, size: 28, color: "#9b7fe8" },
  { id: "f1", label: "Llama 4\nлицензия", x: 22, y: 30, size: 16, color: "#7c5cdb" },
  { id: "f2", label: "Scale AI\nнайм", x: 78, y: 25, size: 14, color: "#7c5cdb" },
  { id: "f3", label: "Gemma\nopen", x: 80, y: 65, size: 14, color: "#5caade" },
  { id: "o1", label: "Thiel:\nконтроль", x: 20, y: 70, size: 16, color: "#e85d3a" },
  { id: "o2", label: "LeCun:\nпрогресс", x: 65, y: 82, size: 14, color: "#50b478" },
  { id: "c1", label: "Захват\nстандарта", x: 35, y: 82, size: 15, color: "#c8a050" },
];

const MEANING_MAP_EDGES = [
  { from: "center", to: "f1" }, { from: "center", to: "f2" }, { from: "center", to: "f3" },
  { from: "center", to: "o1" }, { from: "center", to: "o2" }, { from: "center", to: "c1" },
  { from: "f1", to: "o1" }, { from: "o1", to: "c1" }, { from: "o2", to: "c1" },
];

/* ═══════════════════════════════════════════════ */

export default function Signal() {
  const drumRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const SLIDE_COUNT = 4;
  const [opacities, setOpacities] = useState<number[]>([1, 0.08, 0.08, 0.08]);
  const [active, setActive] = useState(0);

  const [activeLens, setActiveLens] = useState<string | null>(null);
  const [expandedVoice, setExpandedVoice] = useState<number | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const totalDuration = 110;
  const currentTime = (audioProgress / 100) * totalDuration;

  const [sourcesExpanded, setSourcesExpanded] = useState(false);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const waveformRef = useRef(Array.from({ length: 40 }, (_, i) => Math.sin(i * 0.4) * 5 + Math.random() * 3 + 3));

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
            if (idx !== -1) next[idx] = Math.max(0.08, e.intersectionRatio);
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

  const currentLensVoices = activeLens ? (LENS_VOICES[activeLens] || []) : [];
  const slideColors = ["#9b7fe8", "#c4aff8", "#c8a050"];

  // Common styles
  const bg = "#111111";
  const cardBg = "#1a1a1a";
  const cardBorder = "rgba(255,255,255,0.08)";
  const textPrimary = "#f5f5f5";
  const textSecondary = "rgba(255,255,255,0.65)";
  const textTertiary = "rgba(255,255,255,0.4)";
  const textMuted = "rgba(255,255,255,0.25)";

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#080808" }}>
      <div
        className="relative flex flex-col overflow-hidden"
        style={{
          width: 380,
          height: 780,
          borderRadius: 48,
          background: bg,
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 40px 80px rgba(0,0,0,0.8)",
        }}
      >
        {/* Status bar */}
        <div className="flex-shrink-0 flex justify-between items-center" style={{ padding: "14px 28px 0", fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: textTertiary }}>
          <span>09:41</span>
          <span style={{ fontSize: 9 }}>●●● 5G</span>
        </div>

        {/* Nav */}
        <div className="flex-shrink-0 flex items-center gap-3" style={{ padding: "10px 24px 12px", borderBottom: `1px solid ${cardBorder}` }}>
          <span style={{ fontSize: 22, color: textTertiary, cursor: "pointer", fontWeight: 300 }}>‹</span>
          <span style={{ fontSize: 15, fontWeight: 600, color: textPrimary, letterSpacing: "-0.02em", flex: 1 }}>Signal</span>
          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <div key={i} style={{
                width: active === i ? 18 : 5,
                height: 5,
                borderRadius: 3,
                background: active === i ? slideColors[i] : "rgba(255,255,255,0.1)",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              }} />
            ))}
          </div>
        </div>

        {/* Drum */}
        <div
          ref={drumRef}
          className="flex-1 relative"
          style={{ overflowY: "auto", scrollSnapType: "y mandatory", WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
        >
          <div className="sticky top-0 left-0 right-0 z-10 pointer-events-none" style={{ height: 24, background: `linear-gradient(to bottom, ${bg}, transparent)`, marginBottom: -24 }} />

          {/* ═══════════ SCREEN 1: THE SIGNAL ═══════════ */}
          <div
            ref={setSlideRef(0)}
            className="flex flex-col justify-center"
            style={{ scrollSnapAlign: "center", minHeight: "100%", padding: "16px 24px", opacity: opacities[0], transition: "opacity 0.2s ease" }}
          >
            {/* Trending */}
            <div className="flex items-center gap-2" style={{ marginBottom: 12 }}>
              <div style={{ position: "relative", width: 7, height: 7 }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#ef4444" }} />
                <motion.div
                  animate={{ scale: [1, 2.2, 1], opacity: [0.7, 0, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                  style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#ef4444" }}
                />
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#ef4444", fontWeight: 500 }}>
                В тренде
              </span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: textTertiary }}>
                обсуждения растут · 3 дня · 4 страны
              </span>
            </div>

            {/* Headline */}
            <h1 style={{ fontSize: 24, fontWeight: 700, color: textPrimary, lineHeight: 1.2, letterSpacing: "-0.03em", margin: 0 }}>
              Open-source как оружие
            </h1>
            <p style={{ fontSize: 14, color: textSecondary, lineHeight: 1.5, marginTop: 6 }}>
              Meta строит закрытую экосистему через открытый код
            </p>

            {/* Source compression */}
            <div
              onClick={() => setSourcesExpanded(!sourcesExpanded)}
              style={{
                marginTop: 14, padding: "10px 14px", borderRadius: 12,
                background: cardBg, border: `1px solid ${cardBorder}`,
                cursor: "pointer",
              }}
            >
              <div className="flex items-center gap-3" style={{ marginBottom: 6 }}>
                <div style={{ flex: 1, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.06)", position: "relative", overflow: "hidden" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "90%" }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                    style={{ height: "100%", borderRadius: 2, background: "rgba(155,127,232,0.5)" }}
                  />
                </div>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: textSecondary, flexShrink: 0 }}>
                  27 из 30
                </span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {SOURCE_LOGOS.slice(0, sourcesExpanded ? SOURCE_LOGOS.length : 3).map((s, i) => (
                  <span key={i} style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
                    color: textTertiary,
                  }}>
                    {s.name}{i < (sourcesExpanded ? SOURCE_LOGOS.length : 3) - 1 ? " ·" : ""}
                  </span>
                ))}
                {!sourcesExpanded && (
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "#9b7fe8" }}>
                    +24 ↓
                  </span>
                )}
              </div>
              <AnimatePresence>
                {sourcesExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    style={{ overflow: "hidden" }}
                  >
                    <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${cardBorder}` }}>
                      {SOURCE_LOGOS.map((s, i) => (
                        <div key={i} className="flex items-center justify-between" style={{ padding: "4px 0" }}>
                          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: textSecondary }}>{s.name}</span>
                          <span style={{ fontSize: 9, color: textTertiary }}>{s.fact}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Key facts */}
            <div className="flex flex-col gap-2.5" style={{ marginTop: 14 }}>
              {BULLETS.map((b, i) => (
                <div key={i} className="flex items-start gap-2.5" style={{ fontSize: 12, color: textSecondary, lineHeight: 1.55 }}>
                  <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#9b7fe8", marginTop: 6, flexShrink: 0 }} />
                  <span>{b}</span>
                </div>
              ))}
            </div>

            {/* Audio player */}
            <div
              className="flex items-center gap-3"
              style={{
                marginTop: 16, padding: "12px 14px", borderRadius: 14,
                background: cardBg, border: `1px solid ${cardBorder}`,
              }}
            >
              <div
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center justify-center flex-shrink-0"
                style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: isPlaying ? "rgba(155,127,232,0.2)" : "rgba(155,127,232,0.1)",
                  border: "1px solid rgba(155,127,232,0.25)",
                  cursor: "pointer", color: "#c4aff8", fontSize: 13,
                }}
              >
                {isPlaying ? "❚❚" : "▶"}
              </div>
              <div className="flex-1">
                <div className="flex items-end gap-[1.5px]" style={{ height: 22 }}>
                  {waveformRef.current.map((h, i) => {
                    const filled = (i / 40) * 100 < audioProgress;
                    return (
                      <div key={i} style={{
                        width: 2.5, borderRadius: 1, height: h,
                        background: filled ? "#c4aff8" : "rgba(255,255,255,0.08)",
                        transition: "background 0.1s",
                      }} />
                    );
                  })}
                </div>
                <div className="flex justify-between" style={{ marginTop: 4 }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: textTertiary }}>
                    {Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, "0")}
                  </span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: textMuted }}>
                    1:50 · AI анализ
                  </span>
                </div>
              </div>
            </div>

            <ScrollHint text="синтез" />
          </div>

          {/* ═══════════ SCREEN 2: SYNTHESIS ═══════════ */}
          <div
            ref={setSlideRef(1)}
            className="flex flex-col"
            style={{ scrollSnapAlign: "center", minHeight: "100%", padding: "16px 24px", opacity: opacities[1], transition: "opacity 0.2s ease" }}
          >
            {/* Mini-player */}
            <div
              className="flex items-center gap-2.5"
              style={{
                padding: "8px 12px", borderRadius: 10, marginBottom: 12,
                background: cardBg, border: `1px solid ${cardBorder}`,
              }}
            >
              <div
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center justify-center flex-shrink-0"
                style={{
                  width: 26, height: 26, borderRadius: "50%",
                  background: "rgba(155,127,232,0.12)",
                  border: "1px solid rgba(155,127,232,0.2)",
                  cursor: "pointer", color: "#c4aff8", fontSize: 10,
                }}
              >
                {isPlaying ? "❚❚" : "▶"}
              </div>
              <div className="flex-1">
                <div className="flex items-end gap-[1px]" style={{ height: 14 }}>
                  {waveformRef.current.slice(0, 30).map((h, i) => (
                    <div key={i} style={{
                      width: 2, borderRadius: 0.5, height: h * 0.65,
                      background: (i / 30) * 100 < audioProgress ? "rgba(196,175,248,0.6)" : "rgba(255,255,255,0.06)",
                    }} />
                  ))}
                </div>
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: textTertiary }}>
                {Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, "0")} / 1:50
              </span>
            </div>

            {/* Transcript */}
            <div style={{
              flex: 1, borderRadius: 14, padding: "14px 16px",
              background: cardBg, border: `1px solid ${cardBorder}`,
              overflowY: "auto", scrollbarWidth: "none",
            }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: textTertiary, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
                транскрипт · интерактивный
              </div>
              {TRANSCRIPT_SEGMENTS.map((seg, i) => {
                const isActive = currentTime >= seg.time && (i === TRANSCRIPT_SEGMENTS.length - 1 || currentTime < TRANSCRIPT_SEGMENTS[i + 1].time);
                return (
                  <div
                    key={i}
                    onClick={() => setAudioProgress((seg.time / totalDuration) * 100)}
                    style={{
                      padding: "6px 10px",
                      borderRadius: 8,
                      background: isActive ? "rgba(196,175,248,0.08)" : "transparent",
                      borderLeft: isActive ? "2px solid #c4aff8" : "2px solid transparent",
                      transition: "all 0.3s",
                      marginBottom: 3,
                      cursor: "pointer",
                    }}
                  >
                    {seg.speaker && (
                      <span style={{
                        fontFamily: "'JetBrains Mono', monospace", fontSize: 8,
                        color: seg.speakerColor || "#9b7fe8",
                        fontWeight: 500, display: "block", marginBottom: 2,
                      }}>
                        {seg.speaker}
                      </span>
                    )}
                    <span style={{
                      fontSize: 12, lineHeight: 1.6,
                      color: isActive ? textPrimary : textTertiary,
                      transition: "color 0.3s",
                    }}>
                      {seg.text}
                    </span>
                  </div>
                );
              })}

              {/* Meaning map */}
              <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${cardBorder}` }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: textTertiary, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
                  карта смыслов
                </div>
                <div style={{
                  position: "relative", height: 150,
                  borderRadius: 12, overflow: "hidden",
                  background: "rgba(155,127,232,0.03)",
                  border: `1px solid rgba(155,127,232,0.08)`,
                }}>
                  <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
                    {MEANING_MAP_EDGES.map((edge, i) => {
                      const from = MEANING_MAP_NODES.find(n => n.id === edge.from)!;
                      const to = MEANING_MAP_NODES.find(n => n.id === edge.to)!;
                      return (
                        <line key={i}
                          x1={`${from.x}%`} y1={`${from.y}%`}
                          x2={`${to.x}%`} y2={`${to.y}%`}
                          stroke="rgba(155,127,232,0.12)" strokeWidth={0.5}
                        />
                      );
                    })}
                  </svg>
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
                        background: selectedNode === node.id ? node.color + "30" : node.color + "14",
                        border: `1px solid ${node.color}${selectedNode === node.id ? "50" : "25"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", transition: "all 0.2s",
                      }}
                    >
                      <span style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: node.id === "center" ? 7 : 6,
                        color: node.color,
                        textAlign: "center", lineHeight: 1.2,
                        whiteSpace: "pre-line",
                      }}>
                        {node.label}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-3" style={{ marginTop: 6 }}>
                  {[
                    { label: "факт", color: "#7c5cdb" },
                    { label: "мнение", color: "#e85d3a" },
                    { label: "вывод", color: "#c8a050" },
                  ].map((l, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span style={{ width: 5, height: 5, borderRadius: "50%", background: l.color, display: "inline-block" }} />
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 7, color: textTertiary }}>{l.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <ScrollHint text="вопрос" />
          </div>

          {/* ═══════════ SCREEN 3: RABBIT HOLE ═══════════ */}
          <div
            ref={setSlideRef(2)}
            className="flex flex-col justify-center gap-4"
            style={{ scrollSnapAlign: "center", minHeight: "100%", padding: "20px 24px", opacity: opacities[2], transition: "opacity 0.2s ease" }}
          >
            <div style={{
              padding: "24px 20px", borderRadius: 16,
              background: "linear-gradient(135deg, rgba(200,160,80,0.08), rgba(155,127,232,0.05))",
              border: "1px solid rgba(200,160,80,0.15)",
            }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, letterSpacing: "0.1em", textTransform: "uppercase", color: "#c8a050", marginBottom: 12, opacity: 0.7 }}>
                вопрос для размышления
              </div>
              <div style={{ fontSize: 17, color: textPrimary, lineHeight: 1.5, fontStyle: "italic", letterSpacing: "-0.01em" }}>
                Если открытость — это механизм захвата, а не ценность — не станет ли «независимый open-source» через 5 лет оксюмороном?
              </div>
              <div style={{ fontSize: 11, color: textTertiary, lineHeight: 1.5, marginTop: 14 }}>
                43% источников видят консолидацию, 31% — фрагментацию, 26% — гибридный сценарий.
              </div>
            </div>

            {/* Save */}
            <div style={{
              padding: "12px 16px", borderRadius: 12,
              background: cardBg, border: "1px solid rgba(80,180,120,0.15)",
              display: "flex", alignItems: "center", gap: 12,
              cursor: "pointer",
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: "rgba(80,180,120,0.1)",
                border: "1px solid rgba(80,180,120,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'JetBrains Mono', monospace", fontSize: 14, color: "#50b478",
              }}>
                +
              </div>
              <div>
                <div style={{ fontSize: 12, color: "#50b478", fontWeight: 500 }}>Сохранить в базу знаний</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: textTertiary, marginTop: 2 }}>
                  инсайт + связи
                </div>
              </div>
            </div>

            {/* Next signal */}
            <div style={{
              padding: "14px 16px", borderRadius: 12,
              background: cardBg, border: `1px solid ${cardBorder}`,
              cursor: "pointer",
            }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, letterSpacing: "0.06em", textTransform: "uppercase", color: textTertiary, marginBottom: 6 }}>
                следующий signal →
              </div>
              <div style={{ fontSize: 14, color: textSecondary, lineHeight: 1.5 }}>
                Почему <span style={{ color: "#9b7fe8" }}>китайский open-source</span> неизбежен
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: textMuted, marginTop: 4 }}>
                19 источников · 2 дня
              </div>
            </div>
          </div>

          {/* Spacer */}
          <div ref={setSlideRef(3)} style={{ scrollSnapAlign: "center", minHeight: "1px" }} />

          <div className="sticky bottom-0 left-0 right-0 z-10 pointer-events-none" style={{ height: 24, background: `linear-gradient(to top, ${bg}, transparent)`, marginTop: -24 }} />
        </div>

        {/* ═══════════ LENS OVERLAY ═══════════ */}
        <AnimatePresence>
          {activeLens && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => { setActiveLens(null); setExpandedVoice(null); }}
                style={{
                  position: "absolute", inset: 0, zIndex: 30,
                  background: "rgba(0,0,0,0.5)",
                  backdropFilter: "blur(6px)",
                }}
              />
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                drag="y"
                dragConstraints={{ top: 0 }}
                dragElastic={0.1}
                onDragEnd={(_, info) => {
                  if (info.offset.y > 100) { setActiveLens(null); setExpandedVoice(null); }
                }}
                style={{
                  position: "absolute",
                  bottom: 85, left: 0, right: 0,
                  maxHeight: "55%",
                  zIndex: 31,
                  background: "rgba(20,20,20,0.97)",
                  backdropFilter: "blur(20px)",
                  borderTop: `1px solid rgba(255,255,255,0.1)`,
                  borderRadius: "20px 20px 0 0",
                  padding: "12px 20px 20px",
                  overflowY: "auto",
                  scrollbarWidth: "none",
                }}
              >
                <div className="flex justify-center" style={{ marginBottom: 10 }}>
                  <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.12)" }} />
                </div>

                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: LENSES.find(l => l.id === activeLens)?.color, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 14 }}>
                  {LENSES.find(l => l.id === activeLens)?.label} линза
                </div>

                <div className="flex flex-col gap-3">
                  {currentLensVoices.map((v, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      onClick={() => setExpandedVoice(expandedVoice === i ? null : i)}
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: `1px solid ${expandedVoice === i ? v.color + "30" : cardBorder}`,
                        borderRadius: 12,
                        padding: "12px 14px",
                        cursor: "pointer",
                      }}
                    >
                      <div className="flex items-center gap-2.5" style={{ marginBottom: 6 }}>
                        <div className="flex items-center justify-center flex-shrink-0" style={{
                          width: 30, height: 30, borderRadius: "50%",
                          background: v.color + "14", border: `1px solid ${v.color}25`,
                          fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: v.color,
                        }}>
                          {v.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div style={{ fontSize: 12, fontWeight: 500, color: textSecondary }}>{v.name}</div>
                          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: textTertiary }}>{v.role}</div>
                        </div>
                        <span style={{
                          fontFamily: "'JetBrains Mono', monospace", fontSize: 7,
                          padding: "2px 7px", borderRadius: 4,
                          background: v.type === "verbatim" ? "rgba(80,180,120,0.1)" : "rgba(155,127,232,0.1)",
                          color: v.type === "verbatim" ? "#50b478" : "#9b7fe8",
                          letterSpacing: "0.04em", textTransform: "uppercase",
                        }}>
                          {v.type === "verbatim" ? "ЦИТАТА" : "СИНТЕЗ"}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: textSecondary, lineHeight: 1.55 }}>
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
                            <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${cardBorder}` }}>
                              <div style={{ fontSize: 11, color: textTertiary, lineHeight: 1.6 }}>{v.full}</div>
                              {v.source && (
                                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: v.color, marginTop: 6, opacity: 0.7 }}>
                                  {v.source}
                                </div>
                              )}
                              {v.links?.map((link, li) => (
                                <div key={li} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: textMuted, marginTop: 3 }}>
                                  → {link}
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* ═══════════ INPUT BAR + LENS PINS ═══════════ */}
        <div className="flex-shrink-0 relative z-20" style={{ background: bg, borderTop: `1px solid ${cardBorder}` }}>
          <AnimatePresence>
            {active >= 1 && !activeLens && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                style={{ overflow: "hidden" }}
              >
                <div className="flex flex-col gap-1" style={{ padding: "6px 20px 0" }}>
                  {SMART_PROMPTS.map((p, i) => (
                    <div key={i} style={{
                      fontSize: 10, color: textTertiary,
                      padding: "6px 10px", borderRadius: 8,
                      background: "rgba(255,255,255,0.02)",
                      border: `1px solid ${cardBorder}`,
                      cursor: "pointer", lineHeight: 1.4,
                    }}>
                      {p}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Lens pins */}
          <div className="flex gap-1.5" style={{ padding: "8px 20px 0" }}>
            {LENSES.map((lens) => (
              <button
                key={lens.id}
                onClick={() => {
                  setActiveLens(activeLens === lens.id ? null : lens.id);
                  setExpandedVoice(null);
                }}
                style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
                  padding: "5px 12px", borderRadius: 8,
                  background: activeLens === lens.id ? lens.color + "18" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${activeLens === lens.id ? lens.color + "35" : cardBorder}`,
                  color: activeLens === lens.id ? lens.color : textTertiary,
                  cursor: "pointer", transition: "all 0.2s",
                }}
              >
                {lens.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-2 items-center" style={{ padding: "8px 20px 22px" }}>
            <div className="flex-1" style={{
              background: "rgba(255,255,255,0.03)", border: `1px solid ${cardBorder}`,
              borderRadius: 20, padding: "10px 14px",
              fontSize: 12, color: textTertiary,
            }}>
              Задать вопрос...
            </div>
            <div className="flex items-center justify-center flex-shrink-0" style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "rgba(155,127,232,0.12)", border: "1px solid rgba(155,127,232,0.25)",
              fontSize: 15, color: "#c4aff8", cursor: "pointer",
            }}>
              ↑
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScrollHint({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-1.5" style={{
      fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
      color: textMutedColor, letterSpacing: "0.04em", marginTop: 14,
    }}>
      <motion.span animate={{ y: [0, 3, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>↓</motion.span>
      {text}
    </div>
  );
}

const textMutedColor = "rgba(255,255,255,0.2)";
