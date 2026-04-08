import { useEffect, useRef, useState, useCallback } from "react";

const THRESHOLDS = Array.from({ length: 21 }, (_, i) => i / 20);

export default function Signal() {
  const drumRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [opacities, setOpacities] = useState([1, 0.15, 0.15]);
  const [active, setActive] = useState(0);

  const setSlideRef = useCallback((idx: number) => (el: HTMLDivElement | null) => {
    slideRefs.current[idx] = el;
  }, []);

  useEffect(() => {
    const drum = drumRef.current;
    if (!drum) return;
    const slides = slideRefs.current.filter(Boolean) as HTMLDivElement[];
    if (slides.length === 0) return;

    const obs = new IntersectionObserver(
      (entries) => {
        setOpacities((prev) => {
          const next = [...prev];
          entries.forEach((e) => {
            const idx = slides.indexOf(e.target as HTMLDivElement);
            if (idx !== -1) {
              next[idx] = Math.max(0.08, e.intersectionRatio);
            }
          });
          return next;
        });
        entries.forEach((e) => {
          if (e.intersectionRatio > 0.55) {
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

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#080705" }}>
      {/* Phone frame */}
      <div
        className="relative flex flex-col overflow-hidden"
        style={{
          width: 320,
          height: 640,
          borderRadius: 44,
          background: "#0e0b09",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 48px 96px rgba(0,0,0,0.85)",
        }}
      >
        {/* Status bar */}
        <div
          className="flex-shrink-0 flex justify-between items-center relative z-10"
          style={{ padding: "12px 20px 0", fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.25)" }}
        >
          <span>09:41</span>
          <span>LTE ●●●</span>
        </div>

        {/* Nav */}
        <div
          className="flex-shrink-0 flex items-center gap-2.5 relative z-10"
          style={{ padding: "6px 16px 8px", borderBottom: "1px solid rgba(255,255,255,0.04)", background: "#0e0b09" }}
        >
          <span style={{ fontSize: 18, color: "rgba(255,255,255,0.2)" }}>‹</span>
          <div className="flex-1">
            <div style={{ fontSize: 12, fontWeight: 600, color: "#e0d8d0" }}>Meta × Open-Source</div>
            <div
              className="inline-flex items-center gap-1 mt-0.5"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 7,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                padding: "1px 7px",
                borderRadius: 8,
                background: "rgba(124,92,219,0.14)",
                color: "#a088e8",
              }}
            >
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#7c5cdb", display: "inline-block" }} />
              Signal · AI Industry
            </div>
          </div>
        </div>

        {/* Drum — scroll-snap container */}
        <div
          ref={drumRef}
          className="flex-1 relative"
          style={{
            overflowY: "auto",
            scrollSnapType: "y mandatory",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
          }}
        >
          {/* Fade overlays */}
          <div
            className="sticky top-0 left-0 right-0 z-10 pointer-events-none"
            style={{ height: 60, background: "linear-gradient(to bottom, #0e0b09, transparent)", marginBottom: -60 }}
          />

          {/* SLIDE 1 — News */}
          <div
            ref={setSlideRef(0)}
            className="flex flex-col justify-center gap-2"
            style={{
              scrollSnapAlign: "center",
              minHeight: "100%",
              padding: "16px 16px",
              opacity: opacities[0],
              transition: "opacity 0.15s ease",
            }}
          >
            <div className="flex items-center gap-1.5" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(124,92,219,0.65)" }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#7c5cdb", display: "inline-block" }} />
              новость · тезис
            </div>

            <h1 style={{ fontSize: 20, fontWeight: 600, color: "#f0ece8", lineHeight: 1.25, letterSpacing: "-0.02em" }}>
              Meta и гибридный <span style={{ color: "#9b7fe8" }}>open-source</span>: новая форма контроля над экосистемой
            </h1>

            <p style={{ fontSize: 12, lineHeight: 1.6, color: "rgba(255,255,255,0.38)", marginTop: 2 }}>
              Компания нанимает Alexandr Wang и выпускает гибридную стратегию — открытые модели снаружи, закрытое ядро внутри.
            </p>

            <div style={{ height: 1, background: "rgba(255,255,255,0.05)", margin: "4px 0" }} />

            <p style={{ fontSize: 13, lineHeight: 1.65, color: "#c0b8b0" }}>
              Когда платформа открывает часть технологий, сохраняя закрытое ядро — это не уступка сообществу. Это захват стандарта. Android, Chromium, AWS прошли тот же путь. Разработчики переходят на открытый стек, а потом обнаруживают что критические компоненты закрыты.
            </p>

            <div className="flex items-center gap-1.5" style={{ marginTop: 4 }}>
              {["Axios", "Reuters", "The Verge", "+4"].map((s, i) => (
                <span key={i} className="flex items-center gap-1">
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.12)", display: "inline-block" }} />
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: "rgba(255,255,255,0.2)", letterSpacing: "0.05em" }}>{s}</span>
                </span>
              ))}
            </div>

            <div className="flex items-center gap-1.5" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: "rgba(255,255,255,0.15)", letterSpacing: "0.06em", marginTop: 8 }}>
              <span className="animate-bounce" style={{ animationDuration: "1.8s" }}>↓</span> мнения авторов
            </div>
          </div>

          {/* SLIDE 2 — Voices */}
          <div
            ref={setSlideRef(1)}
            className="flex flex-col justify-center gap-2"
            style={{
              scrollSnapAlign: "center",
              minHeight: "100%",
              padding: "16px 16px",
              opacity: opacities[1],
              transition: "opacity 0.15s ease",
            }}
          >
            <div className="flex items-center gap-1.5" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(92,170,219,0.6)" }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#5caade", display: "inline-block" }} />
              голоса · из базы знаний
            </div>

            <div style={{ fontSize: 15, fontWeight: 600, color: "#e8e0d8", lineHeight: 1.3, letterSpacing: "-0.01em", marginBottom: 6 }}>
              Что об этом думают авторы в KB
            </div>

            {/* Voice cards */}
            {[
              { initials: "PT", name: "Peter Thiel", role: "Zero to One · Founders Fund", quote: "Кто устанавливает правила платформы — тот и выигрывает. Открытость здесь инструмент контроля, а не ценность." },
              { initials: "AK", name: "Andrej Karpathy", role: "ex-OpenAI · ex-Tesla AI", quote: "Закрытое ядро — прагматичная страховка. Не идеология. Open-source снижает барьер, закрытость сохраняет leverage." },
            ].map((v, i) => (
              <div
                key={i}
                style={{
                  background: "#181412",
                  border: "1px solid rgba(255,255,255,0.05)",
                  borderRadius: 10,
                  padding: "10px 12px",
                }}
              >
                <div className="flex items-center gap-2" style={{ marginBottom: 6 }}>
                  <div
                    className="flex items-center justify-center flex-shrink-0"
                    style={{
                      width: 26, height: 26, borderRadius: "50%",
                      background: "#252015", border: "1px solid rgba(255,255,255,0.08)",
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 7, color: "rgba(255,255,255,0.35)",
                    }}
                  >
                    {v.initials}
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>{v.name}</div>
                    <div style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", fontFamily: "'JetBrains Mono', monospace" }}>{v.role}</div>
                  </div>
                </div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.42)", lineHeight: 1.5 }}>{v.quote}</div>
                <div style={{ marginTop: 6, fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: "rgba(92,170,219,0.4)", letterSpacing: "0.04em" }}>
                  развернуть позицию ›
                </div>
              </div>
            ))}

            {/* KB row */}
            <div
              className="flex items-center gap-2.5"
              style={{
                background: "#141a14",
                border: "1px solid rgba(80,180,120,0.1)",
                borderRadius: 10,
                padding: "9px 12px",
              }}
            >
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(80,180,120,0.5)", letterSpacing: "0.04em", flexShrink: 0 }}>⬡ KB</span>
              <div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", lineHeight: 1.4 }}>
                  Platform capture через open-source — 12 задокументированных кейсов
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: "rgba(80,180,120,0.4)", marginTop: 2 }}>
                  1,240 исследований · срок захвата: 4–7 лет
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: "rgba(255,255,255,0.15)", letterSpacing: "0.06em", marginTop: 4 }}>
              <span className="animate-bounce" style={{ animationDuration: "1.8s" }}>↓</span> сдвигающий вопрос
            </div>
          </div>

          {/* SLIDE 3 — Question */}
          <div
            ref={setSlideRef(2)}
            className="flex flex-col justify-center gap-2"
            style={{
              scrollSnapAlign: "center",
              minHeight: "100%",
              padding: "16px 16px",
              opacity: opacities[2],
              transition: "opacity 0.15s ease",
            }}
          >
            <div className="flex items-center gap-1.5" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(200,160,80,0.6)" }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#c8a050", display: "inline-block" }} />
              вопрос · для размышления
            </div>

            {/* Question card */}
            <div
              style={{
                background: "linear-gradient(135deg, rgba(124,92,219,0.07), rgba(200,160,80,0.04))",
                border: "1px solid rgba(124,92,219,0.14)",
                borderRadius: 12,
                padding: "16px 14px",
              }}
            >
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(200,160,80,0.55)", marginBottom: 8 }}>
                Сдвиг сознания
              </div>
              <div style={{ fontSize: 15, color: "#e8e0d8", lineHeight: 1.5, fontStyle: "italic", letterSpacing: "-0.01em" }}>
                Если открытость — это механизм захвата, а не ценность — что произойдёт с независимым open-source через 5 лет?
              </div>
            </div>

            {/* Collision hint */}
            <div
              style={{
                background: "#1a1714",
                border: "1px solid rgba(124,92,219,0.1)",
                borderRadius: 10,
                padding: "10px 12px",
              }}
            >
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 7, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.15)", marginBottom: 5 }}>
                Связанный Collision
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", lineHeight: 1.4 }}>
                Platform dynamics × Geopolitical fragmentation → <span style={{ color: "#9b7fe8" }}>Почему китайский open-source неизбежен</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: "rgba(255,255,255,0.15)", letterSpacing: "0.06em", marginTop: 8 }}>
              ↑ или задай свой вопрос
            </div>
          </div>

          {/* Bottom fade */}
          <div
            className="sticky bottom-0 left-0 right-0 z-10 pointer-events-none"
            style={{ height: 60, background: "linear-gradient(to top, #0e0b09, transparent)", marginTop: -60 }}
          />
        </div>

        {/* Progress dots */}
        <div className="absolute flex flex-col gap-1.5 z-20" style={{ right: 14, top: "50%", transform: "translateY(-50%)" }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 4,
                height: active === i ? 14 : 4,
                borderRadius: active === i ? 2 : "50%",
                background: active === i ? "#7c5cdb" : "rgba(255,255,255,0.1)",
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>

        {/* Input bar */}
        <div
          className="flex-shrink-0 flex gap-1.5 items-center relative z-10"
          style={{ padding: "8px 14px 16px", borderTop: "1px solid rgba(255,255,255,0.04)", background: "#0e0b09" }}
        >
          <div
            className="flex-1"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 20,
              padding: "8px 12px",
              fontSize: 11,
              color: "rgba(255,255,255,0.25)",
            }}
          >
            Задать вопрос...
          </div>
          <div
            className="flex items-center justify-center flex-shrink-0"
            style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "rgba(124,92,219,0.2)",
              border: "1px solid rgba(124,92,219,0.35)",
              fontSize: 13, color: "#c4aff8",
            }}
          >
            ↑
          </div>
        </div>
      </div>
    </div>
  );
}