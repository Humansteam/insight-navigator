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
  { name: "Reuters", fact: "Meta нанимает Alexandr Wang" },
  { name: "Axios", fact: "Гибридная лицензия Llama 4" },
  { name: "The Verge", fact: "Google отвечает — Gemma остаётся открытой" },
  { name: "TechCrunch", fact: "Scale AI partnership details" },
  { name: "Wired", fact: "EU позиция по open-source AI" },
  { name: "Ars Technica", fact: "Hugging Face анализ лицензий" },
  { name: "FT", fact: "Экономика open-source AI моделей" },
];

const BULLETS = [
  "Meta переходит к гибридной лицензии — Llama 4 open-weight, но с закрытым inference stack",
  "Alexandr Wang (Scale AI) присоединяется к Meta AI — сигнал о data moat стратегии",
  "Google отвечает: Gemma остаётся полностью открытой, позиционируя себя как «истинный open-source»",
  "EU AI Office впервые запрашивает позицию по регуляции open-source моделей",
  "Hugging Face публикует первый Open Source AI License Index",
];

const TRANSCRIPT_SEGMENTS = [
  { time: 0, text: "Три дня назад Meta тихо изменила правила игры.", speaker: null, speakerColor: null },
  { time: 8, text: "Компания объявила о найме Александра Вана из Scale AI и одновременно анонсировала гибридную лицензию для Llama 4.", speaker: null, speakerColor: null },
  { time: 18, text: "Что это значит на практике?", speaker: null, speakerColor: null },
  { time: 22, text: "Open-source снижает барьер входа. Но закрытость ядра сохраняет leverage.", speaker: "Andrej Karpathy", speakerColor: "#5caade" },
  { time: 35, text: "Мы видим классический паттерн platform capture — Android был «открытым», но Google Play Store закрыт.", speaker: null, speakerColor: null },
  { time: 48, text: "Кто устанавливает правила платформы — тот и выигрывает. Это не про открытость, это про контроль.", speaker: "Peter Thiel", speakerColor: "#e85d3a" },
  { time: 62, text: "Параллельно, Китай строит свою экосистему. DeepSeek и Qwen формируют альтернативный центр притяжения.", speaker: null, speakerColor: null },
  { time: 75, text: "Мы публикуем модели чтобы ускорить исследования. Это не уступка — это стратегия ускорения.", speaker: "Yann LeCun", speakerColor: "#50b478" },
  { time: 88, text: "Вопрос не в том, открыт ли код. Вопрос — кто контролирует данные, инфраструктуру и стандарты.", speaker: null, speakerColor: null },
  { time: 100, text: "Через 5 лет «open-source AI» может означать нечто совершенно иное, чем сегодня.", speaker: null, speakerColor: null },
];

const SMART_PROMPTS = [
  "Мы обсудили технологию, но не этику. Спросить Timnit Gebru?",
  "Сравнить лицензию Llama 4 с Apache 2.0",
  "Исторические прецеденты: Java → Android",
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
   SIGNAL PAGE — Apple/Ive: Signal → Synthesis → Rabbit Hole
   Lenses as persistent pins above input bar
   ═══════════════════════════════════════════════ */

export default function Signal() {
  const drumRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const SLIDE_COUNT = 4; // 3 screens + spacer
  const [opacities, setOpacities] = useState<number[]>([1, 0.06, 0.06, 0.06]);
  const [active, setActive] = useState(0);

  // Lens overlay
  const [activeLens, setActiveLens] = useState<string | null>(null);
  const [expandedVoice, setExpandedVoice] = useState<number | null>(null);

  // Audio
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const totalDuration = 110;
  const currentTime = (audioProgress / 100) * totalDuration;

  // Sources expanded
  const [sourcesExpanded, setSourcesExpanded] = useState(false);

  // Meaning map
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Waveform bars (stable across renders)
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

  const currentLensVoices = activeLens ? (LENS_VOICES[activeLens] || []) : [];
  const slideColors = ["#9b7fe8", "#c4aff8", "#c8a050"];

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#060504" }}>
      <div
        className="relative flex flex-col overflow-hidden"
        style={{
          width: 380,
          height: 780,
          borderRadius: 48,
          background: "#0c0a08",
          border: "0.5px solid rgba(255,255,255,0.04)",
          boxShadow: "0 60px 120px rgba(0,0,0,0.9), inset 0 0.5px 0 rgba(255,255,255,0.02)",
        }}
      >
        {/* Status bar */}
        <div className="flex-shrink-0 flex justify-between items-center" style={{ padding: "16px 28px 0", fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.12)" }}>
          <span>09:41</span>
          <span style={{ fontSize: 8, letterSpacing: "0.08em" }}>●●● 5G</span>
        </div>

        {/* Nav — minimal */}
        <div className="flex-shrink-0 flex items-center gap-3" style={{ padding: "10px 24px 12px", borderBottom: "0.5px solid rgba(255,255,255,0.03)" }}>
          <span style={{ fontSize: 20, color: "rgba(255,255,255,0.1)", cursor: "pointer", fontWeight: 300 }}>‹</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#e8e0d8", letterSpacing: "-0.03em", flex: 1 }}>Signal</span>
          {/* Progress dots */}
          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <div key={i} style={{
                width: active === i ? 16 : 4,
                height: 4,
                borderRadius: 2,
                background: active === i ? slideColors[i] : "rgba(255,255,255,0.06)",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: active === i ? `0 0 8px ${slideColors[i]}25` : "none",
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
          {/* Top fade */}
          <div className="sticky top-0 left-0 right-0 z-10 pointer-events-none" style={{ height: 32, background: "linear-gradient(to bottom, #0c0a08, transparent)", marginBottom: -32 }} />

          {/* ═══════════ SCREEN 1: THE SIGNAL ═══════════ */}
          <div
            ref={setSlideRef(0)}
            className="flex flex-col justify-center"
            style={{ scrollSnapAlign: "center", minHeight: "100%", padding: "20px 24px", opacity: opacities[0], transition: "opacity 0.2s ease" }}
          >
            {/* Trending indicator */}
            <div className="flex items-center gap-2" style={{ marginBottom: 14 }}>
              <div style={{ position: "relative", width: 6, height: 6 }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#e85d3a" }} />
                <motion.div
                  animate={{ scale: [1, 2, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                  style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#e85d3a" }}
                />
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "#e88a6a", letterSpacing: "0.02em" }}>
                В тренде
              </span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: "rgba(255,255,255,0.12)" }}>
                обсуждения растут · 3 дня · 4 страны
              </span>
            </div>

            {/* Headline */}
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#f0ece8", lineHeight: 1.2, letterSpacing: "-0.04em", margin: 0 }}>
              Open-source как оружие
            </h1>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", lineHeight: 1.5, marginTop: 6, letterSpacing: "-0.01em" }}>
              Meta строит закрытую экосистему через открытый код
            </p>

            {/* Source compression bar */}
            <div
              onClick={() => setSourcesExpanded(!sourcesExpanded)}
              style={{
                marginTop: 16, padding: "10px 14px", borderRadius: 12,
                background: "rgba(255,255,255,0.015)",
                border: "0.5px solid rgba(255,255,255,0.04)",
                cursor: "pointer",
              }}
            >
              <div className="flex items-center gap-3" style={{ marginBottom: 6 }}>
                <div style={{ flex: 1, height: 3, borderRadius: 2, background: "rgba(255,255,255,0.04)", position: "relative", overflow: "hidden" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "90%" }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                    style={{ height: "100%", borderRadius: 2, background: "rgba(155,127,232,0.35)" }}
                  />
                </div>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: "rgba(255,255,255,0.2)", flexShrink: 0 }}>
                  27 из 30
                </span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {SOURCE_LOGOS.slice(0, sourcesExpanded ? SOURCE_LOGOS.length : 3).map((s, i) => (
                  <span key={i} style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 8,
                    color: "rgba(255,255,255,0.18)", letterSpacing: "-0.01em",
                  }}>
                    {s.name}{i < (sourcesExpanded ? SOURCE_LOGOS.length : 3) - 1 ? " ·" : ""}
                  </span>
                ))}
                {!sourcesExpanded && (
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: "rgba(155,127,232,0.4)" }}>
                    +24
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
                    <div style={{ marginTop: 8, paddingTop: 8, borderTop: "0.5px solid rgba(255,255,255,0.04)" }}>
                      {SOURCE_LOGOS.map((s, i) => (
                        <div key={i} className="flex items-center justify-between" style={{ padding: "3px 0" }}>
                          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: "rgba(255,255,255,0.2)" }}>{s.name}</span>
                          <span style={{ fontSize: 8, color: "rgba(255,255,255,0.1)", maxWidth: "60%", textAlign: "right" }}>{s.fact}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Key facts */}
            <div className="flex flex-col gap-2" style={{ marginTop: 14 }}>
              {BULLETS.slice(0, 3).map((b, i) => (
                <div key={i} className="flex items-start gap-2.5" style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", lineHeight: 1.55 }}>
                  <span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(155,127,232,0.4)", marginTop: 6, flexShrink: 0 }} />
                  <span>{b}</span>
                </div>
              ))}
            </div>

            {/* Audio player — inline */}
            <div
              className="flex items-center gap-3"
              style={{
                marginTop: 16, padding: "10px 14px", borderRadius: 16,
                background: "rgba(255,255,255,0.015)",
                border: "0.5px solid rgba(255,255,255,0.04)",
              }}
            >
              <div
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center justify-center flex-shrink-0"
                style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: isPlaying ? "rgba(155,127,232,0.12)" : "rgba(255,255,255,0.03)",
                  border: "0.5px solid rgba(155,127,232,0.15)",
                  cursor: "pointer", color: "#c4aff8", fontSize: 12,
                  transition: "all 0.2s",
                }}
              >
                {isPlaying ? "❚❚" : "▶"}
              </div>
              <div className="flex-1">
                <div className="flex items-end gap-[1.5px]" style={{ height: 20 }}>
                  {waveformRef.current.map((h, i) => {
                    const filled = (i / 40) * 100 < audioProgress;
                    return (
                      <div key={i} style={{
                        width: 2, borderRadius: 1, height: h,
                        background: filled ? "rgba(196,175,248,0.6)" : "rgba(255,255,255,0.04)",
                        transition: "background 0.1s",
                      }} />
                    );
                  })}
                </div>
                <div className="flex justify-between" style={{ marginTop: 3 }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: "rgba(255,255,255,0.1)" }}>
                    {Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, "0")}
                  </span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: "rgba(255,255,255,0.08)" }}>
                    1:50
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
            style={{ scrollSnapAlign: "center", minHeight: "100%", padding: "20px 24px", opacity: opacities[1], transition: "opacity 0.2s ease" }}
          >
            {/* Sticky mini-player */}
            <div
              className="flex items-center gap-2.5"
              style={{
                padding: "8px 12px", borderRadius: 12, marginBottom: 12,
                background: "rgba(255,255,255,0.015)",
                border: "0.5px solid rgba(196,175,248,0.06)",
              }}
            >
              <div
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center justify-center flex-shrink-0"
                style={{
                  width: 24, height: 24, borderRadius: "50%",
                  background: "rgba(155,127,232,0.08)",
                  border: "0.5px solid rgba(155,127,232,0.12)",
                  cursor: "pointer", color: "#c4aff8", fontSize: 9,
                }}
              >
                {isPlaying ? "❚❚" : "▶"}
              </div>
              <div className="flex-1">
                <div className="flex items-end gap-[1px]" style={{ height: 12 }}>
                  {waveformRef.current.slice(0, 30).map((h, i) => (
                    <div key={i} style={{
                      width: 1.5, borderRadius: 0.5, height: h * 0.6,
                      background: (i / 30) * 100 < audioProgress ? "rgba(196,175,248,0.5)" : "rgba(255,255,255,0.03)",
                    }} />
                  ))}
                </div>
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: "rgba(255,255,255,0.1)" }}>
                {Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, "0")} / 1:50
              </span>
            </div>

            {/* Interactive transcript */}
            <div style={{
              flex: 1, borderRadius: 16, padding: "12px 14px",
              background: "rgba(255,255,255,0.01)",
              border: "0.5px solid rgba(255,255,255,0.03)",
              overflowY: "auto", scrollbarWidth: "none",
            }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 7, color: "rgba(255,255,255,0.08)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
                транскрипт
              </div>
              {TRANSCRIPT_SEGMENTS.map((seg, i) => {
                const isActive = currentTime >= seg.time && (i === TRANSCRIPT_SEGMENTS.length - 1 || currentTime < TRANSCRIPT_SEGMENTS[i + 1].time);
                return (
                  <div
                    key={i}
                    onClick={() => setAudioProgress((seg.time / totalDuration) * 100)}
                    style={{
                      padding: "5px 8px",
                      borderRadius: 8,
                      background: isActive ? "rgba(196,175,248,0.04)" : "transparent",
                      borderLeft: isActive ? "2px solid rgba(196,175,248,0.3)" : "2px solid transparent",
                      transition: "all 0.3s",
                      marginBottom: 2,
                      cursor: "pointer",
                    }}
                  >
                    {seg.speaker && (
                      <span style={{
                        fontFamily: "'JetBrains Mono', monospace", fontSize: 7,
                        color: seg.speakerColor || "#9b7fe8",
                        letterSpacing: "0.02em", display: "block", marginBottom: 2,
                      }}>
                        {seg.speaker}
                      </span>
                    )}
                    <span style={{
                      fontSize: 11, lineHeight: 1.6,
                      color: isActive ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.15)",
                      transition: "color 0.3s",
                    }}>
                      {seg.text}
                    </span>
                  </div>
                );
              })}

              {/* Meaning map — below transcript */}
              <div style={{ marginTop: 16, paddingTop: 12, borderTop: "0.5px solid rgba(255,255,255,0.03)" }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 7, color: "rgba(255,255,255,0.08)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
                  карта смыслов
                </div>
                <div style={{
                  position: "relative", height: 140,
                  borderRadius: 12, overflow: "hidden",
                }}>
                  <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
                    {MEANING_MAP_EDGES.map((edge, i) => {
                      const from = MEANING_MAP_NODES.find(n => n.id === edge.from)!;
                      const to = MEANING_MAP_NODES.find(n => n.id === edge.to)!;
                      return (
                        <line
                          key={i}
                          x1={`${from.x}%`} y1={`${from.y}%`}
                          x2={`${to.x}%`} y2={`${to.y}%`}
                          stroke="rgba(155,127,232,0.06)" strokeWidth={0.5}
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
                        background: selectedNode === node.id ? node.color + "18" : node.color + "08",
                        border: `0.5px solid ${node.color}${selectedNode === node.id ? "35" : "12"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", transition: "all 0.3s",
                        boxShadow: selectedNode === node.id ? `0 0 16px ${node.color}15` : "none",
                      }}
                    >
                      <span style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: node.id === "center" ? 6 : 5,
                        color: node.color + (selectedNode === node.id ? "cc" : "60"),
                        textAlign: "center", lineHeight: 1.2,
                        whiteSpace: "pre-line",
                      }}>
                        {node.label}
                      </span>
                    </div>
                  ))}
                </div>
                {/* Legend */}
                <div className="flex items-center gap-3" style={{ marginTop: 6 }}>
                  {[
                    { label: "факт", color: "#7c5cdb" },
                    { label: "мнение", color: "#e85d3a" },
                    { label: "вывод", color: "#c8a050" },
                  ].map((l, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <span style={{ width: 4, height: 4, borderRadius: "50%", background: l.color + "50", display: "inline-block" }} />
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 6, color: "rgba(255,255,255,0.1)" }}>{l.label}</span>
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
            {/* Provocative question */}
            <div style={{
              padding: "24px 20px", borderRadius: 16,
              background: "linear-gradient(135deg, rgba(200,160,80,0.03), rgba(155,127,232,0.02))",
              border: "0.5px solid rgba(200,160,80,0.08)",
            }}>
              <div style={{ fontSize: 16, color: "#e8e0d8", lineHeight: 1.55, fontStyle: "italic", letterSpacing: "-0.02em" }}>
                Если открытость — это механизм захвата, а не ценность — не станет ли «независимый open-source» через 5 лет оксюмороном?
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.15)", lineHeight: 1.5, marginTop: 14 }}>
                В данных нет однозначного ответа. 43% источников видят консолидацию, 31% — фрагментацию, 26% — гибридный сценарий.
              </div>
            </div>

            {/* Save to brain */}
            <div style={{
              padding: "12px 16px", borderRadius: 12,
              background: "rgba(255,255,255,0.01)",
              border: "0.5px solid rgba(80,180,120,0.08)",
              display: "flex", alignItems: "center", gap: 10,
              cursor: "pointer",
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: "rgba(80,180,120,0.06)",
                border: "0.5px solid rgba(80,180,120,0.12)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: "rgba(80,180,120,0.5)",
              }}>
                +
              </div>
              <div>
                <div style={{ fontSize: 11, color: "rgba(80,180,120,0.5)", fontWeight: 500 }}>Сохранить в базу знаний</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 7, color: "rgba(255,255,255,0.08)", marginTop: 2 }}>
                  инсайт + связи
                </div>
              </div>
            </div>

            {/* Next signal */}
            <div style={{
              padding: "14px 16px", borderRadius: 12,
              background: "rgba(255,255,255,0.01)",
              border: "0.5px solid rgba(155,127,232,0.06)",
              cursor: "pointer",
            }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 7, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,0.08)", marginBottom: 6 }}>
                следующий signal
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.25)", lineHeight: 1.5, letterSpacing: "-0.01em" }}>
                Почему <span style={{ color: "rgba(155,127,232,0.6)" }}>китайский open-source</span> неизбежен
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 7, color: "rgba(255,255,255,0.06)", marginTop: 4 }}>
                19 источников · 2 дня
              </div>
            </div>
          </div>

          {/* Bottom spacer */}
          <div ref={setSlideRef(3)} style={{ scrollSnapAlign: "center", minHeight: "1px" }} />

          {/* Bottom fade */}
          <div className="sticky bottom-0 left-0 right-0 z-10 pointer-events-none" style={{ height: 32, background: "linear-gradient(to top, #0c0a08, transparent)", marginTop: -32 }} />
        </div>

        {/* ═══════════ LENS HALF-SHEET OVERLAY ═══════════ */}
        <AnimatePresence>
          {activeLens && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => { setActiveLens(null); setExpandedVoice(null); }}
                style={{
                  position: "absolute", inset: 0, zIndex: 30,
                  background: "rgba(0,0,0,0.4)",
                  backdropFilter: "blur(4px)",
                }}
              />
              {/* Sheet */}
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
                  bottom: 80, left: 0, right: 0,
                  maxHeight: "60%",
                  zIndex: 31,
                  background: "rgba(14,12,10,0.95)",
                  backdropFilter: "blur(20px)",
                  borderTop: "0.5px solid rgba(255,255,255,0.06)",
                  borderRadius: "24px 24px 0 0",
                  padding: "12px 20px 20px",
                  overflowY: "auto",
                  scrollbarWidth: "none",
                }}
              >
                {/* Drag handle */}
                <div className="flex justify-center" style={{ marginBottom: 12 }}>
                  <div style={{ width: 32, height: 3, borderRadius: 2, background: "rgba(255,255,255,0.08)" }} />
                </div>

                {/* Lens title */}
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: LENSES.find(l => l.id === activeLens)?.color || "#fff", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12, opacity: 0.6 }}>
                  {LENSES.find(l => l.id === activeLens)?.label} линза
                </div>

                {/* Voice cards */}
                <div className="flex flex-col gap-2.5">
                  {currentLensVoices.map((v, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      onClick={() => setExpandedVoice(expandedVoice === i ? null : i)}
                      style={{
                        background: "rgba(255,255,255,0.015)",
                        border: `0.5px solid ${expandedVoice === i ? v.color + "20" : "rgba(255,255,255,0.03)"}`,
                        borderRadius: 12,
                        padding: "12px 14px",
                        cursor: "pointer",
                        transition: "border-color 0.2s",
                      }}
                    >
                      <div className="flex items-center gap-2.5" style={{ marginBottom: 6 }}>
                        <div className="flex items-center justify-center flex-shrink-0" style={{
                          width: 28, height: 28, borderRadius: "50%",
                          background: v.color + "0a", border: `0.5px solid ${v.color}18`,
                          fontFamily: "'JetBrains Mono', monospace", fontSize: 7, color: v.color + "80",
                        }}>
                          {v.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div style={{ fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.45)" }}>{v.name}</div>
                          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 7, color: "rgba(255,255,255,0.12)" }}>{v.role}</div>
                        </div>
                        <span style={{
                          fontFamily: "'JetBrains Mono', monospace", fontSize: 6,
                          padding: "2px 6px", borderRadius: 4,
                          background: v.type === "verbatim" ? "rgba(80,180,120,0.06)" : "rgba(155,127,232,0.06)",
                          color: v.type === "verbatim" ? "rgba(80,180,120,0.5)" : "rgba(155,127,232,0.5)",
                          letterSpacing: "0.06em", textTransform: "uppercase",
                        }}>
                          {v.type === "verbatim" ? "ЦИТАТА" : "СИНТЕЗ"}
                        </span>
                      </div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", lineHeight: 1.55 }}>
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
                            <div style={{ marginTop: 8, paddingTop: 8, borderTop: "0.5px solid rgba(255,255,255,0.03)" }}>
                              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", lineHeight: 1.6 }}>{v.full}</div>
                              {v.source && (
                                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 7, color: v.color + "60", marginTop: 6 }}>
                                  {v.source}
                                </div>
                              )}
                              {v.links?.map((link, li) => (
                                <div key={li} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 7, color: "rgba(255,255,255,0.1)", marginTop: 3 }}>
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
        <div className="flex-shrink-0 relative z-20" style={{ background: "#0c0a08", borderTop: "0.5px solid rgba(255,255,255,0.03)" }}>
          {/* Smart prompts — show when deep */}
          <AnimatePresence>
            {active >= 1 && !activeLens && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                style={{ overflow: "hidden" }}
              >
                <div className="flex flex-col gap-1" style={{ padding: "6px 20px 0" }}>
                  {SMART_PROMPTS.slice(0, 2).map((p, i) => (
                    <div
                      key={i}
                      style={{
                        fontSize: 9, color: "rgba(255,255,255,0.15)",
                        padding: "6px 10px", borderRadius: 8,
                        background: "rgba(255,255,255,0.01)",
                        border: "0.5px solid rgba(255,255,255,0.03)",
                        cursor: "pointer",
                        lineHeight: 1.4,
                      }}
                    >
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
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 8,
                  padding: "4px 10px", borderRadius: 8,
                  background: activeLens === lens.id ? lens.color + "12" : "rgba(255,255,255,0.015)",
                  border: `0.5px solid ${activeLens === lens.id ? lens.color + "25" : "rgba(255,255,255,0.04)"}`,
                  color: activeLens === lens.id ? lens.color : "rgba(255,255,255,0.15)",
                  cursor: "pointer", transition: "all 0.2s",
                  letterSpacing: "0.02em",
                }}
              >
                {lens.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-2 items-center" style={{ padding: "8px 20px 22px" }}>
            <div className="flex-1" style={{
              background: "rgba(255,255,255,0.015)", border: "0.5px solid rgba(255,255,255,0.04)",
              borderRadius: 20, padding: "9px 14px",
              fontSize: 11, color: "rgba(255,255,255,0.12)",
            }}>
              Задать вопрос...
            </div>
            <div className="flex items-center justify-center flex-shrink-0" style={{
              width: 34, height: 34, borderRadius: "50%",
              background: "rgba(155,127,232,0.08)", border: "0.5px solid rgba(155,127,232,0.15)",
              fontSize: 14, color: "rgba(196,175,248,0.5)", cursor: "pointer",
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

function ScrollHint({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-1.5" style={{
      fontFamily: "'JetBrains Mono', monospace", fontSize: 8,
      color: "rgba(255,255,255,0.07)", letterSpacing: "0.04em", marginTop: 14,
    }}>
      <motion.span animate={{ y: [0, 3, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>↓</motion.span>
      {text}
    </div>
  );
}
