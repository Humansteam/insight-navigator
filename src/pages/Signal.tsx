import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const THRESHOLDS = Array.from({ length: 21 }, (_, i) => i / 20);

/* ── Data ── */
const SOURCES = [
  { name: "Reuters", time: "2ч" },
  { name: "Axios", time: "5ч" },
  { name: "The Verge", time: "8ч" },
  { name: "TechCrunch", time: "12ч" },
  { name: "Wired", time: "1д" },
];

const TIMELINE_EVENTS = [
  { date: "5 апр", label: "Meta нанимает Alexandr Wang (Scale AI)", count: 8, color: "#7c5cdb" },
  { date: "4 апр", label: "Утечка: гибридная лицензия для Llama 4", count: 6, color: "#9b7fe8" },
  { date: "3 апр", label: "Google отвечает: Gemma остаётся полностью открытой", count: 5, color: "#5caade" },
  { date: "2 апр", label: "EU регулятор запрашивает позицию по open-source AI", count: 4, color: "#c8a050" },
  { date: "1 апр", label: "Hugging Face публикует анализ лицензий", count: 4, color: "#50b478" },
];

const VOICES = [
  {
    initials: "PT", name: "Peter Thiel", role: "Zero to One · Founders Fund",
    quote: "Кто устанавливает правила платформы — тот и выигрывает.",
    full: "Открытость здесь инструмент контроля, а не ценность. Android показал это идеально: открытый снаружи, Google Play закрыт внутри.",
    stance: "control", color: "#e85d3a",
  },
  {
    initials: "AK", name: "Andrej Karpathy", role: "ex-OpenAI · ex-Tesla AI",
    quote: "Закрытое ядро — прагматичная страховка, не идеология.",
    full: "Open-source снижает барьер входа. Но закрытость ядра сохраняет leverage. Это не лицемерие — это архитектура бизнеса.",
    stance: "pragmatic", color: "#5caade",
  },
  {
    initials: "YL", name: "Yann LeCun", role: "Chief AI Scientist · Meta",
    quote: "Открытая наука двигает прогресс быстрее закрытой.",
    full: "Мы публикуем модели чтобы ускорить исследования. Коммерческие ограничения — это вопрос sustainability, не контроля.",
    stance: "open", color: "#50b478",
  },
];

export default function Signal() {
  const drumRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [opacities, setOpacities] = useState([1, 0.08, 0.08, 0.08, 0.08, 0.08]);
  const [active, setActive] = useState(0);
  const [expandedVoice, setExpandedVoice] = useState<number | null>(null);
  const [expandedSource, setExpandedSource] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);

  // Fake audio progress
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setAudioProgress((p) => {
        if (p >= 100) { setIsPlaying(false); return 0; }
        return p + 0.5;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const setSlideRef = useCallback(
    (idx: number) => (el: HTMLDivElement | null) => {
      slideRefs.current[idx] = el;
    },
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

  const SLIDE_COUNT = 5;
  const slideColors = ["#7c5cdb", "#e85d3a", "#5caade", "#9b7fe8", "#c8a050"];

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#080705" }}>
      <div
        className="relative flex flex-col overflow-hidden"
        style={{
          width: 360,
          height: 720,
          borderRadius: 44,
          background: "#0e0b09",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 48px 96px rgba(0,0,0,0.85)",
        }}
      >
        {/* Status bar */}
        <div className="flex-shrink-0 flex justify-between items-center relative z-10" style={{ padding: "14px 24px 0", fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.2)" }}>
          <span>09:41</span>
          <span style={{ fontSize: 8, letterSpacing: "0.05em" }}>●●● LTE</span>
        </div>

        {/* Nav */}
        <div className="flex-shrink-0 flex items-center gap-3 relative z-10" style={{ padding: "8px 18px 10px", borderBottom: "1px solid rgba(255,255,255,0.04)", background: "#0e0b09" }}>
          <span style={{ fontSize: 20, color: "rgba(255,255,255,0.15)", cursor: "pointer" }}>‹</span>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span style={{ fontSize: 13, fontWeight: 600, color: "#e0d8d0" }}>Open-Source × Control</span>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 7,
                padding: "2px 6px", borderRadius: 6,
                background: "rgba(124,92,219,0.12)", color: "#a088e8",
                letterSpacing: "0.06em", textTransform: "uppercase",
              }}>
                SIGNAL
              </span>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: "rgba(255,255,255,0.18)", marginTop: 2, letterSpacing: "0.04em" }}>
              27 источников · 3 дня · 4 страны
            </div>
          </div>
        </div>

        {/* Drum */}
        <div
          ref={drumRef}
          className="flex-1 relative"
          style={{ overflowY: "auto", scrollSnapType: "y mandatory", WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
        >
          {/* Top fade */}
          <div className="sticky top-0 left-0 right-0 z-10 pointer-events-none" style={{ height: 50, background: "linear-gradient(to bottom, #0e0b09, transparent)", marginBottom: -50 }} />

          {/* ═══ SLIDE 1: ТЕЗИС + КОНФЛИКТ ═══ */}
          <div
            ref={setSlideRef(0)}
            className="flex flex-col justify-center"
            style={{ scrollSnapAlign: "center", minHeight: "100%", padding: "20px 18px", opacity: opacities[0], transition: "opacity 0.2s ease" }}
          >
            <Mono color="rgba(124,92,219,0.6)">
              <Dot color="#7c5cdb" /> тезис · ai industry
            </Mono>

            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#f0ece8", lineHeight: 1.22, letterSpacing: "-0.025em", marginTop: 8 }}>
              <span style={{ color: "#9b7fe8" }}>Open-source</span> как оружие: Meta строит{" "}
              <span style={{ color: "#9b7fe8" }}>закрытую</span> экосистему через открытый код
            </h1>

            {/* Scale badge */}
            <div className="flex items-center gap-2 flex-wrap" style={{ marginTop: 10 }}>
              {[
                { label: "27 источников", bg: "rgba(124,92,219,0.1)", color: "#a088e8" },
                { label: "5 ключевых событий", bg: "rgba(92,170,219,0.1)", color: "#5caade" },
                { label: "3 позиции", bg: "rgba(232,93,58,0.1)", color: "#e88a6a" },
              ].map((b, i) => (
                <span key={i} style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 7,
                  padding: "3px 8px", borderRadius: 8,
                  background: b.bg, color: b.color,
                  letterSpacing: "0.04em",
                }}>
                  {b.label}
                </span>
              ))}
            </div>

            <div style={{ height: 1, background: "rgba(255,255,255,0.04)", margin: "12px 0" }} />

            {/* Conflict hook */}
            <div style={{
              background: "linear-gradient(135deg, rgba(232,93,58,0.06), rgba(92,170,219,0.06))",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 10, padding: "10px 12px",
            }}>
              <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
                <Mono color="rgba(232,93,58,0.5)">⚡ столкновение</Mono>
              </div>
              <div style={{ fontSize: 12, color: "#c0b8b0", lineHeight: 1.55 }}>
                <span style={{ color: "#e88a6a" }}>Thiel:</span> «Открытость — инструмент контроля»
                <br />
                <span style={{ color: "#7eb8e8" }}>LeCun:</span> «Открытая наука двигает прогресс быстрее»
              </div>
            </div>

            <div style={{ marginTop: 12, fontSize: 13, color: "rgba(255,255,255,0.32)", lineHeight: 1.6 }}>
              Когда платформа открывает часть технологий, сохраняя закрытое ядро — это захват стандарта.
            </div>

            <ScrollHint text="хронология событий" />
          </div>

          {/* ═══ SLIDE 2: TIMELINE СЖАТИЯ ═══ */}
          <div
            ref={setSlideRef(1)}
            className="flex flex-col justify-center"
            style={{ scrollSnapAlign: "center", minHeight: "100%", padding: "20px 18px", opacity: opacities[1], transition: "opacity 0.2s ease" }}
          >
            <Mono color="rgba(232,93,58,0.6)">
              <Dot color="#e85d3a" /> хронология · 5 дней
            </Mono>

            <div style={{ fontSize: 14, fontWeight: 600, color: "#e8e0d8", marginTop: 8, marginBottom: 12 }}>
              27 новостей → 5 событий → 1 тезис
            </div>

            <div className="flex flex-col gap-1" style={{ position: "relative", paddingLeft: 16 }}>
              {/* Vertical line */}
              <div style={{ position: "absolute", left: 5, top: 4, bottom: 4, width: 1, background: "rgba(255,255,255,0.06)" }} />

              {TIMELINE_EVENTS.map((evt, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.3 }}
                  style={{
                    position: "relative",
                    padding: "8px 10px",
                    borderRadius: 8,
                    background: i === 0 ? "rgba(124,92,219,0.08)" : "transparent",
                    border: i === 0 ? "1px solid rgba(124,92,219,0.12)" : "1px solid transparent",
                  }}
                >
                  {/* Dot on timeline */}
                  <div style={{
                    position: "absolute", left: -14, top: 12,
                    width: 7, height: 7, borderRadius: "50%",
                    background: evt.color,
                    boxShadow: i === 0 ? `0 0 8px ${evt.color}60` : "none",
                  }} />

                  <div className="flex items-center justify-between" style={{ marginBottom: 3 }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: "rgba(255,255,255,0.2)", letterSpacing: "0.04em" }}>
                      {evt.date}
                    </span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 7, color: evt.color, opacity: 0.6 }}>
                      {evt.count} ист.
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: i === 0 ? "#e0d8d0" : "rgba(255,255,255,0.4)", lineHeight: 1.4 }}>
                    {evt.label}
                  </div>
                </motion.div>
              ))}
            </div>

            <ScrollHint text="мнения из базы знаний" />
          </div>

          {/* ═══ SLIDE 3: ГОЛОСА + KB ═══ */}
          <div
            ref={setSlideRef(2)}
            className="flex flex-col justify-center"
            style={{ scrollSnapAlign: "center", minHeight: "100%", padding: "20px 18px", opacity: opacities[2], transition: "opacity 0.2s ease" }}
          >
            <Mono color="rgba(92,170,219,0.6)">
              <Dot color="#5caade" /> голоса · 3 позиции
            </Mono>

            <div style={{ fontSize: 14, fontWeight: 600, color: "#e8e0d8", marginTop: 8, marginBottom: 10 }}>
              Что думают ключевые авторы
            </div>

            <div className="flex flex-col gap-2">
              {VOICES.map((v, i) => (
                <motion.div
                  key={i}
                  layout
                  onClick={() => setExpandedVoice(expandedVoice === i ? null : i)}
                  style={{
                    background: "#151210",
                    border: `1px solid ${expandedVoice === i ? v.color + "30" : "rgba(255,255,255,0.05)"}`,
                    borderRadius: 10,
                    padding: "10px 12px",
                    cursor: "pointer",
                    transition: "border-color 0.2s",
                  }}
                >
                  <div className="flex items-center gap-2" style={{ marginBottom: 5 }}>
                    <div className="flex items-center justify-center flex-shrink-0" style={{
                      width: 26, height: 26, borderRadius: "50%",
                      background: v.color + "18", border: `1px solid ${v.color}30`,
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 7, color: v.color,
                    }}>
                      {v.initials}
                    </div>
                    <div className="flex-1">
                      <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.55)" }}>{v.name}</div>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: "rgba(255,255,255,0.2)" }}>{v.role}</div>
                    </div>
                    <div style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 7,
                      padding: "2px 6px", borderRadius: 6,
                      background: v.color + "15", color: v.color + "90",
                      letterSpacing: "0.04em",
                    }}>
                      {v.stance}
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>
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
                        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", lineHeight: 1.6, marginTop: 6, paddingTop: 6, borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                          {v.full}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            {/* KB row */}
            <div className="flex items-center gap-2.5" style={{
              background: "#121a12", border: "1px solid rgba(80,180,120,0.1)",
              borderRadius: 10, padding: "8px 12px", marginTop: 8,
            }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(80,180,120,0.5)", letterSpacing: "0.04em" }}>⬡ KB</span>
              <div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", lineHeight: 1.4 }}>
                  Platform capture через open-source — 12 кейсов
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 7, color: "rgba(80,180,120,0.4)", marginTop: 1 }}>
                  1,240 статей · медиана захвата: 4–7 лет
                </div>
              </div>
            </div>

            <ScrollHint text="источники" />
          </div>

          {/* ═══ SLIDE 4: ИСТОЧНИКИ (провал вглубь) ═══ */}
          <div
            ref={setSlideRef(3)}
            className="flex flex-col justify-center"
            style={{ scrollSnapAlign: "center", minHeight: "100%", padding: "20px 18px", opacity: opacities[3], transition: "opacity 0.2s ease" }}
          >
            <Mono color="rgba(155,127,232,0.6)">
              <Dot color="#9b7fe8" /> 27 источников · кластер
            </Mono>

            <div style={{ fontSize: 14, fontWeight: 600, color: "#e8e0d8", marginTop: 8, marginBottom: 6 }}>
              Откуда собран этот Signal
            </div>

            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: "rgba(255,255,255,0.15)", marginBottom: 10 }}>
              тап на источник → развернуть
            </div>

            <div className="flex flex-col gap-1.5" style={{ maxHeight: 340, overflowY: "auto", scrollbarWidth: "none" }}>
              {SOURCES.map((s, i) => (
                <motion.div
                  key={i}
                  layout
                  onClick={() => setExpandedSource(expandedSource === i ? null : i)}
                  style={{
                    background: expandedSource === i ? "rgba(155,127,232,0.06)" : "#131110",
                    border: `1px solid ${expandedSource === i ? "rgba(155,127,232,0.15)" : "rgba(255,255,255,0.04)"}`,
                    borderRadius: 8,
                    padding: "8px 10px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(155,127,232,0.4)" }} />
                      <span style={{ fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.45)" }}>{s.name}</span>
                    </div>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: "rgba(255,255,255,0.15)" }}>{s.time} назад</span>
                  </div>
                  <AnimatePresence>
                    {expandedSource === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{ overflow: "hidden" }}
                      >
                        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", lineHeight: 1.5, marginTop: 6, paddingTop: 6, borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                          Meta's hybrid approach to open-source AI signals a strategic shift in how tech giants leverage community development while maintaining competitive moats...
                        </div>
                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 7, color: "#9b7fe8", marginTop: 4, opacity: 0.6 }}>
                          открыть оригинал ›
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}

              {/* Remaining sources collapsed */}
              <div style={{
                textAlign: "center", padding: "10px",
                fontFamily: "'JetBrains Mono', monospace", fontSize: 8,
                color: "rgba(255,255,255,0.15)", letterSpacing: "0.04em",
              }}>
                + ещё 22 источника
              </div>
            </div>

            <ScrollHint text="вопрос для размышления" />
          </div>

          {/* ═══ SLIDE 5: ВОПРОС ═══ */}
          <div
            ref={setSlideRef(4)}
            className="flex flex-col justify-center gap-3"
            style={{ scrollSnapAlign: "center", minHeight: "100%", padding: "20px 18px", opacity: opacities[4], transition: "opacity 0.2s ease" }}
          >
            <Mono color="rgba(200,160,80,0.6)">
              <Dot color="#c8a050" /> вопрос · сдвиг
            </Mono>

            {/* Question card */}
            <div style={{
              background: "linear-gradient(135deg, rgba(124,92,219,0.07), rgba(200,160,80,0.05))",
              border: "1px solid rgba(200,160,80,0.12)",
              borderRadius: 12, padding: "18px 16px",
            }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(200,160,80,0.5)", marginBottom: 10 }}>
                Сдвиг сознания
              </div>
              <div style={{ fontSize: 16, color: "#e8e0d8", lineHeight: 1.5, fontStyle: "italic", letterSpacing: "-0.01em" }}>
                Если открытость — это механизм захвата, а не ценность — что произойдёт с независимым open-source через 5 лет?
              </div>
            </div>

            {/* Related collision */}
            <div style={{
              background: "#1a1714",
              border: "1px solid rgba(124,92,219,0.1)",
              borderRadius: 10, padding: "12px 14px",
            }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 7, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.12)", marginBottom: 6 }}>
                Следующий Signal →
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", lineHeight: 1.5 }}>
                Platform dynamics × Geopolitical fragmentation →{" "}
                <span style={{ color: "#9b7fe8" }}>Почему китайский open-source неизбежен</span>
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 7, color: "rgba(255,255,255,0.12)", marginTop: 6 }}>
                19 источников · 2 дня · формируется
              </div>
            </div>

            {/* Your take */}
            <div style={{
              background: "rgba(200,160,80,0.04)",
              border: "1px dashed rgba(200,160,80,0.15)",
              borderRadius: 10, padding: "10px 12px",
              textAlign: "center",
            }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: "rgba(200,160,80,0.4)", letterSpacing: "0.06em" }}>
                Записать мысль в журнал ✦
              </div>
            </div>
          </div>

          {/* Bottom fade */}
          <div className="sticky bottom-0 left-0 right-0 z-10 pointer-events-none" style={{ height: 50, background: "linear-gradient(to top, #0e0b09, transparent)", marginTop: -50 }} />
        </div>

        {/* Progress dots */}
        <div className="absolute flex flex-col gap-1 z-20" style={{ right: 14, top: "50%", transform: "translateY(-50%)" }}>
          {Array.from({ length: SLIDE_COUNT }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 4,
                height: active === i ? 16 : 4,
                borderRadius: active === i ? 2 : "50%",
                background: active === i ? slideColors[i] : "rgba(255,255,255,0.08)",
                transition: "all 0.3s ease",
                boxShadow: active === i ? `0 0 6px ${slideColors[i]}40` : "none",
              }}
            />
          ))}
        </div>

        {/* Input bar */}
        <div className="flex-shrink-0 flex gap-2 items-center relative z-10" style={{ padding: "8px 16px 18px", borderTop: "1px solid rgba(255,255,255,0.04)", background: "#0e0b09" }}>
          <div className="flex-1" style={{
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 20, padding: "9px 14px",
            fontSize: 11, color: "rgba(255,255,255,0.2)",
          }}>
            Задать вопрос к этому Signal...
          </div>
          <div className="flex items-center justify-center flex-shrink-0" style={{
            width: 34, height: 34, borderRadius: "50%",
            background: "rgba(124,92,219,0.15)", border: "1px solid rgba(124,92,219,0.3)",
            fontSize: 14, color: "#c4aff8", cursor: "pointer",
          }}>
            ↑
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
      color: "rgba(255,255,255,0.12)", letterSpacing: "0.05em", marginTop: 10,
    }}>
      <motion.span animate={{ y: [0, 3, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>↓</motion.span>
      {text}
    </div>
  );
}