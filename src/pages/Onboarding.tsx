import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Plus, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

// ── Data ──────────────────────────────────────────────

const TOPICS = [
  { label: 'AI / ML', emoji: '🤖' },
  { label: 'RAG & Search', emoji: '🔍' },
  { label: 'LLM Agents', emoji: '🧠' },
  { label: 'Startups', emoji: '🚀' },
  { label: 'VC & Fundraising', emoji: '💰' },
  { label: 'Product Management', emoji: '📦' },
  { label: 'Data Engineering', emoji: '⚙️' },
  { label: 'Deep Tech', emoji: '🔬' },
  { label: 'SaaS / B2B', emoji: '🏢' },
  { label: 'Fintech', emoji: '🏦' },
  { label: 'Healthcare', emoji: '🏥' },
  { label: 'Cybersecurity', emoji: '🔒' },
  { label: 'DevTools', emoji: '🛠' },
  { label: 'Open Source', emoji: '🌐' },
  { label: 'Robotics', emoji: '🦾' },
  { label: 'Climate Tech', emoji: '🌱' },
];

const AUTHORITIES = [
  { name: 'Andrej Karpathy', domain: 'AI' },
  { name: 'Paul Graham', domain: 'Startups' },
  { name: 'Andrew Huberman', domain: 'Science' },
  { name: 'Lenny Rachitsky', domain: 'Product' },
  { name: 'Lex Fridman', domain: 'Tech' },
  { name: 'Yann LeCun', domain: 'AI' },
  { name: 'Naval Ravikant', domain: 'Investing' },
  { name: 'Sam Altman', domain: 'AI / Startups' },
  { name: 'Balaji Srinivasan', domain: 'Tech / Crypto' },
  { name: 'Elad Gil', domain: 'Startups' },
  { name: 'Patrick Collison', domain: 'Tech' },
  { name: 'Demis Hassabis', domain: 'AI' },
];

const STEPS_META = [
  { num: 1, title: 'WHAT DO YOU DO?', sub: "Tell us in a sentence or two — we'll tailor everything to you." },
  { num: 2, title: 'PICK YOUR TOPICS', sub: 'Choose at least 2 areas you want Strata to track for you.' },
  { num: 3, title: 'VOICES YOU TRUST', sub: 'Optional — helps us prioritize the right sources.' },
];

const EXAMPLES = [
  'Building an AI product for analysts',
  'VC fund partner, looking at deeptech',
  'Product lead at a B2B SaaS startup',
  'ML engineer working on search & RAG',
  'Data analyst in fintech',
  'Founder, pre-seed stage',
];

// ── Main ──────────────────────────────────────────────

const Onboarding = () => {
  const navigate = useNavigate();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [step, setStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [contextInput, setContextInput] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [customTopic, setCustomTopic] = useState('');
  const [selectedAuthorities, setSelectedAuthorities] = useState<string[]>([]);

  const [finalData, setFinalData] = useState<{ context: string; topics: string[]; authorities: string[] } | null>(null);

  useEffect(() => {
    const t = setTimeout(() => { setIsTransitioning(false); setStep(1); }, 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (step === 1 && textareaRef.current) setTimeout(() => textareaRef.current?.focus(), 300);
  }, [step]);

  const goTo = useCallback((n: number) => {
    setIsTransitioning(true);
    setTimeout(() => { setIsTransitioning(false); setStep(n); }, 400);
  }, []);

  const handleTextarea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContextInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 140) + 'px';
  };

  const submit1 = () => { if (!contextInput.trim()) return; goTo(2); };
  const submit2 = () => { if (selectedTopics.length < 2) return; goTo(3); };
  const submit3 = (skip = false) => {
    setFinalData({
      context: contextInput.trim(),
      topics: selectedTopics,
      authorities: skip ? [] : selectedAuthorities,
    });
    goTo(4);
  };

  const toggleTopic = (t: string) => setSelectedTopics(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t]);
  const toggleAuth = (n: string) => setSelectedAuthorities(p => p.includes(n) ? p.filter(x => x !== n) : [...p, n]);
  const addCustom = () => { const t = customTopic.trim(); if (t && !selectedTopics.includes(t)) { setSelectedTopics(p => [...p, t]); setCustomTopic(''); } };

  const canSubmit = (step === 1 && contextInput.trim()) || (step === 2 && selectedTopics.length >= 2) || (step === 3 && selectedAuthorities.length > 0);
  const meta = step >= 1 && step <= 3 ? STEPS_META[step - 1] : null;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Progress dots */}
      {step >= 1 && step <= 3 && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-2">
          {[1, 2, 3].map(s => (
            <div key={s} className={cn(
              'h-1.5 rounded-full transition-all duration-500',
              step >= s ? 'bg-foreground w-8' : 'bg-muted w-1.5'
            )} />
          ))}
        </div>
      )}

      <div className="relative z-10 w-full max-w-xl flex flex-col items-center">
        <AnimatePresence mode="wait">
          {isTransitioning ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-muted-foreground text-sm py-20"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-foreground animate-pulse" />
            </motion.div>
          ) : step >= 1 && step <= 3 ? (
            <motion.div
              key={`step-${step}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full space-y-8"
            >
              {/* Big title */}
              <div className="text-center space-y-3">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight leading-tight uppercase">
                  {meta?.title}
                </h1>
                <p className="text-base text-muted-foreground max-w-md mx-auto">
                  {meta?.sub}
                </p>
              </div>

              {/* Step 1: Examples + Input */}
              {step === 1 && (
                <div className="space-y-5">
                  {/* Example chips */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    {EXAMPLES.map((ex, i) => (
                      <motion.button
                        key={ex}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.04 }}
                        onClick={() => setContextInput(ex)}
                        className={cn(
                          'px-4 py-2.5 rounded-xl text-sm transition-all duration-200 border',
                          contextInput === ex
                            ? 'bg-foreground text-background border-foreground'
                            : 'bg-transparent text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground'
                        )}
                      >
                        {ex}
                      </motion.button>
                    ))}
                  </div>

                  {/* Input card */}
                  <div className="rounded-2xl border border-border bg-card/60 overflow-hidden">
                    <div className="p-5">
                      <textarea
                        ref={textareaRef}
                        value={contextInput}
                        onChange={handleTextarea}
                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit1(); } }}
                        placeholder="Describe what you do…"
                        className="w-full resize-none bg-transparent text-base text-foreground placeholder:text-muted-foreground/40 focus:outline-none min-h-[56px] leading-relaxed"
                        rows={2}
                      />
                    </div>
                    <div className="px-5 py-3 flex items-center justify-end border-t border-border/40">
                      <button
                        onClick={submit1}
                        disabled={!contextInput.trim()}
                        className={cn(
                          'h-10 px-6 rounded-xl text-sm font-medium flex items-center gap-2 transition-all duration-200',
                          contextInput.trim()
                            ? 'bg-foreground text-background hover:opacity-90'
                            : 'bg-muted text-muted-foreground cursor-not-allowed opacity-40'
                        )}
                      >
                        Continue <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Topics */}
              {step === 2 && (
                <div className="space-y-5">
                  <div className="rounded-2xl border border-border bg-card/60 overflow-hidden">
                    <div className="p-5 space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {TOPICS.map((topic, i) => {
                          const isSel = selectedTopics.includes(topic.label);
                          return (
                            <motion.button
                              key={topic.label}
                              initial={{ opacity: 0, scale: 0.92 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: i * 0.025 }}
                              onClick={() => toggleTopic(topic.label)}
                              className={cn(
                                'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border',
                                isSel
                                  ? 'bg-foreground text-background border-foreground'
                                  : 'bg-transparent text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground'
                              )}
                            >
                              {isSel ? <Check className="w-3.5 h-3.5" /> : <span>{topic.emoji}</span>}
                              {topic.label}
                            </motion.button>
                          );
                        })}
                        {/* Custom topics shown */}
                        {selectedTopics.filter(t => !TOPICS.find(tt => tt.label === t)).map(t => (
                          <button
                            key={t}
                            onClick={() => toggleTopic(t)}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-foreground text-background border border-foreground"
                          >
                            <Check className="w-3.5 h-3.5" />
                            {t}
                          </button>
                        ))}
                      </div>

                      {/* Custom topic input */}
                      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-background/50 focus-within:border-foreground/30 transition-colors">
                        <Plus className="w-4 h-4 text-muted-foreground/50 shrink-0" />
                        <input
                          placeholder="Add your own topic…"
                          value={customTopic}
                          onChange={e => setCustomTopic(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && addCustom()}
                          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="px-5 py-3 flex items-center justify-between border-t border-border/40">
                      <span className="text-xs text-muted-foreground">
                        {selectedTopics.length > 0 ? `${selectedTopics.length} selected` : 'Pick at least 2'}
                      </span>
                      <button
                        onClick={submit2}
                        disabled={selectedTopics.length < 2}
                        className={cn(
                          'h-10 px-6 rounded-xl text-sm font-medium flex items-center gap-2 transition-all duration-200',
                          selectedTopics.length >= 2
                            ? 'bg-foreground text-background hover:opacity-90'
                            : 'bg-muted text-muted-foreground cursor-not-allowed opacity-40'
                        )}
                      >
                        Continue <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Authorities */}
              {step === 3 && (
                <div className="space-y-5">
                  <div className="rounded-2xl border border-border bg-card/60 overflow-hidden">
                    <div className="p-5">
                      <div className="flex flex-wrap gap-2">
                        {AUTHORITIES.map((auth, i) => {
                          const isSel = selectedAuthorities.includes(auth.name);
                          return (
                            <motion.button
                              key={auth.name}
                              initial={{ opacity: 0, scale: 0.92 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: i * 0.025 }}
                              onClick={() => toggleAuth(auth.name)}
                              className={cn(
                                'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border',
                                isSel
                                  ? 'bg-foreground text-background border-foreground'
                                  : 'bg-transparent text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground'
                              )}
                            >
                              {isSel ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5 text-muted-foreground/40" />}
                              {auth.name}
                              <span className={cn('text-xs', isSel ? 'text-background/60' : 'text-muted-foreground/40')}>
                                {auth.domain}
                              </span>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="px-5 py-3 flex items-center justify-between border-t border-border/40">
                      <button onClick={() => submit3(true)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        Skip →
                      </button>
                      <div className="flex items-center gap-3">
                        {selectedAuthorities.length > 0 && (
                          <span className="text-xs text-muted-foreground">{selectedAuthorities.length} selected</span>
                        )}
                        <button
                          onClick={() => submit3(false)}
                          disabled={selectedAuthorities.length === 0}
                          className={cn(
                            'h-10 px-6 rounded-xl text-sm font-medium flex items-center gap-2 transition-all duration-200',
                            selectedAuthorities.length > 0
                              ? 'bg-foreground text-background hover:opacity-90'
                              : 'bg-muted text-muted-foreground cursor-not-allowed opacity-40'
                          )}
                        >
                          Continue <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ) : step === 4 && finalData ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="w-full space-y-8"
            >
              <div className="text-center space-y-3">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight uppercase">
                  ALL SET ✨
                </h1>
                <p className="text-base text-muted-foreground">Here's what Strata knows about you</p>
              </div>

              <div className="space-y-3">
                <div className="rounded-2xl border border-border bg-card/60 p-5">
                  <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-widest">Your role</p>
                  <p className="text-sm text-foreground leading-relaxed">{finalData.context}</p>
                </div>

                <div className="rounded-2xl border border-border bg-card/60 p-5">
                  <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-widest">Tracking</p>
                  <div className="flex flex-wrap gap-2">
                    {finalData.topics.map(t => (
                      <span key={t} className="px-3 py-1.5 rounded-lg bg-foreground/10 text-foreground text-xs font-medium">{t}</span>
                    ))}
                  </div>
                </div>

                {finalData.authorities.length > 0 && (
                  <div className="rounded-2xl border border-border bg-card/60 p-5">
                    <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-widest">Voices you trust</p>
                    <div className="flex flex-wrap gap-2">
                      {finalData.authorities.map(a => (
                        <span key={a} className="px-3 py-1.5 rounded-lg bg-foreground/10 text-foreground text-xs font-medium">{a}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => navigate('/')}
                className="w-full h-14 rounded-2xl bg-foreground text-background text-base font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                Go to your feed <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Onboarding;
