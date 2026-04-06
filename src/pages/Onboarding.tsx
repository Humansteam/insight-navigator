import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowUp, ArrowRight, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

interface OnboardingData {
  context: string;
  topics: string[];
  authorities: string[];
}

const STEPS = [
  { num: 1, title: 'What do you do?', sub: 'Tell us about your role — one or two sentences is plenty.' },
  { num: 2, title: 'What topics matter to you?', sub: 'Pick at least 2 areas you want Strata to track.' },
  { num: 3, title: 'Whose thinking do you trust?', sub: 'Optional — helps us prioritize sources for you.' },
];

const HINTS = [
  'Building an AI product',
  'VC fund, deeptech focus',
  'Product lead at SaaS startup',
  'Data analyst in fintech',
];

// ── Main ──────────────────────────────────────────────

const Onboarding = () => {
  const navigate = useNavigate();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<OnboardingData>({ context: '', topics: [], authorities: [] });

  const [contextInput, setContextInput] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [customTopic, setCustomTopic] = useState('');
  const [selectedAuthorities, setSelectedAuthorities] = useState<string[]>([]);

  useEffect(() => {
    const t = setTimeout(() => { setIsLoading(false); setStep(1); }, 800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (step === 1 && textareaRef.current) setTimeout(() => textareaRef.current?.focus(), 250);
  }, [step]);

  const goTo = useCallback((n: number) => {
    setIsLoading(true);
    setTimeout(() => { setIsLoading(false); setStep(n); }, 500);
  }, []);

  const handleTextarea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContextInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 140) + 'px';
  };

  const submit1 = () => { if (!contextInput.trim()) return; setData(d => ({ ...d, context: contextInput.trim() })); goTo(2); };
  const submit2 = () => { if (selectedTopics.length < 2) return; setData(d => ({ ...d, topics: selectedTopics })); goTo(3); };
  const submit3 = (skip = false) => { setData(d => ({ ...d, authorities: skip ? [] : selectedAuthorities })); goTo(4); };

  const toggleTopic = (t: string) => setSelectedTopics(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t]);
  const toggleAuth = (n: string) => setSelectedAuthorities(p => p.includes(n) ? p.filter(x => x !== n) : [...p, n]);
  const addCustom = () => { const t = customTopic.trim(); if (t && !selectedTopics.includes(t)) { setSelectedTopics(p => [...p, t]); setCustomTopic(''); } };

  const suggestedTopics = (() => {
    const l = data.context.toLowerCase();
    const s: string[] = [];
    if (l.includes('ai') || l.includes('ml')) s.push('AI / ML', 'LLM Agents');
    if (l.includes('vc') || l.includes('fund') || l.includes('invest')) s.push('VC & Fundraising', 'Startups');
    if (l.includes('product')) s.push('Product Management', 'SaaS / B2B');
    if (l.includes('data')) s.push('Data Engineering');
    return s.length ? s : ['AI / ML', 'Startups', 'Product Management'];
  })();

  const canSubmit = (step === 1 && contextInput.trim()) || (step === 2 && selectedTopics.length >= 2) || (step === 3 && selectedAuthorities.length > 0);

  const currentStep = step >= 1 && step <= 3 ? STEPS[step - 1] : null;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.07]" style={{ background: 'radial-gradient(circle, hsl(var(--primary)), transparent 70%)' }} />
      </div>

      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center">
        {/* Logo + title */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center mb-10"
        >
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-base mb-3">
            S
          </div>
          <h1 className="text-3xl font-semibold text-foreground tracking-tight">Welcome to Strata</h1>
          <p className="text-muted-foreground text-sm mt-1.5">Your personal analyst. Let's set things up.</p>

          {/* Progress */}
          <div className="flex gap-1.5 mt-6">
            {[1, 2, 3].map(s => (
              <div key={s} className={cn(
                'h-1 rounded-full transition-all duration-500',
                step >= s ? 'bg-primary w-10' : 'bg-muted w-1.5'
              )} />
            ))}
          </div>
        </motion.div>

        {/* Content area */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2.5 text-muted-foreground text-sm py-16"
            >
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span>Setting things up…</span>
            </motion.div>
          ) : step >= 1 && step <= 3 ? (
            <motion.div
              key={`step-${step}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
              className="w-full space-y-6"
            >
              {/* Step header */}
              <div className="text-center space-y-1">
                <p className="text-xs font-medium text-muted-foreground tracking-wide uppercase">Step {currentStep?.num} of 3</p>
                <h2 className="text-xl font-semibold text-foreground">{currentStep?.title}</h2>
                <p className="text-sm text-muted-foreground">{currentStep?.sub}</p>
              </div>

              {/* Step 1: Hints */}
              {step === 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex flex-wrap gap-2 justify-center">
                  {HINTS.map(h => (
                    <button
                      key={h}
                      onClick={() => setContextInput(h)}
                      className={cn(
                        'px-3.5 py-1.5 rounded-full text-[13px] transition-all duration-150 border',
                        contextInput === h
                          ? 'bg-primary/10 text-primary border-primary/30'
                          : 'bg-transparent text-muted-foreground border-border hover:border-muted-foreground/30 hover:text-foreground'
                      )}
                    >
                      {h}
                    </button>
                  ))}
                </motion.div>
              )}

              {/* Step 2: Suggested label */}
              {step === 2 && (
                <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  <Sparkles className="w-3 h-3 text-primary" />
                  <span>Suggested based on your profile</span>
                </div>
              )}

              {/* Main card */}
              <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm shadow-lg overflow-hidden">

                {/* Step 1 — Textarea */}
                {step === 1 && (
                  <div className="p-5">
                    <textarea
                      ref={textareaRef}
                      value={contextInput}
                      onChange={handleTextarea}
                      onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit1(); } }}
                      placeholder="Describe what you do…"
                      className="w-full resize-none bg-transparent text-[15px] text-foreground placeholder:text-muted-foreground/40 focus:outline-none min-h-[56px] leading-relaxed"
                      rows={2}
                    />
                  </div>
                )}

                {/* Step 2 — Topics */}
                {step === 2 && (
                  <div className="p-5 space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {TOPICS.map((topic, i) => {
                        const isSugg = suggestedTopics.includes(topic.label);
                        const isSel = selectedTopics.includes(topic.label);
                        return (
                          <motion.button
                            key={topic.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.02 }}
                            onClick={() => toggleTopic(topic.label)}
                            className={cn(
                              'inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-medium transition-all duration-150 border',
                              isSel
                                ? 'bg-primary text-primary-foreground border-primary'
                                : isSugg
                                  ? 'bg-transparent text-primary border-primary/25 border-dashed hover:border-primary/50 hover:bg-primary/5'
                                  : 'bg-transparent text-muted-foreground border-border hover:border-muted-foreground/40 hover:text-foreground'
                            )}
                          >
                            {isSel && <Check className="w-3 h-3" />}
                            <span>{topic.emoji}</span>
                            {topic.label}
                          </motion.button>
                        );
                      })}
                      {/* Custom topics */}
                      {selectedTopics.filter(t => !TOPICS.find(tt => tt.label === t)).map(t => (
                        <button
                          key={t}
                          onClick={() => toggleTopic(t)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-medium bg-primary text-primary-foreground border border-primary"
                        >
                          <Check className="w-3 h-3" />
                          {t}
                        </button>
                      ))}
                    </div>

                    {/* Custom topic input */}
                    <div className="flex gap-2 items-center">
                      <div className="flex-1 flex items-center gap-2 px-3.5 py-2 rounded-full border border-border bg-background/50 focus-within:border-muted-foreground/40 transition-colors">
                        <Plus className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
                        <input
                          placeholder="Add your own…"
                          value={customTopic}
                          onChange={e => setCustomTopic(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && addCustom()}
                          className="flex-1 bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3 — Authorities */}
                {step === 3 && (
                  <div className="p-5">
                    <div className="flex flex-wrap gap-2">
                      {AUTHORITIES.map((auth, i) => {
                        const isSel = selectedAuthorities.includes(auth.name);
                        return (
                          <motion.button
                            key={auth.name}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.02 }}
                            onClick={() => toggleAuth(auth.name)}
                            className={cn(
                              'inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-medium transition-all duration-150 border',
                              isSel
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'bg-transparent text-muted-foreground border-border hover:border-muted-foreground/40 hover:text-foreground'
                            )}
                          >
                            {isSel && <Check className="w-3 h-3" />}
                            {auth.name}
                            <span className={cn('text-[11px]', isSel ? 'text-primary-foreground/60' : 'text-muted-foreground/40')}>
                              · {auth.domain}
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Footer toolbar */}
                <div className="px-5 py-3 flex items-center justify-between border-t border-border/40">
                  <div className="flex items-center gap-3">
                    {step === 2 && selectedTopics.length > 0 && (
                      <span className="text-xs text-muted-foreground">{selectedTopics.length} selected</span>
                    )}
                    {step === 3 && (
                      <button onClick={() => submit3(true)} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                        Skip this step →
                      </button>
                    )}
                    {step === 3 && selectedAuthorities.length > 0 && (
                      <span className="text-xs text-muted-foreground">{selectedAuthorities.length} selected</span>
                    )}
                  </div>

                  <button
                    onClick={() => { if (step === 1) submit1(); else if (step === 2) submit2(); else submit3(false); }}
                    disabled={!canSubmit}
                    className={cn(
                      'h-9 w-9 rounded-full flex items-center justify-center transition-all duration-200',
                      canSubmit
                        ? 'bg-foreground text-background hover:scale-105 active:scale-95'
                        : 'bg-muted text-muted-foreground cursor-not-allowed opacity-40'
                    )}
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ) : step === 4 ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="w-full space-y-5"
            >
              <div className="text-center space-y-1">
                <h2 className="text-xl font-semibold text-foreground">All set! ✨</h2>
                <p className="text-sm text-muted-foreground">Here's what we know about you</p>
              </div>

              <div className="space-y-3">
                {/* Profile card */}
                <div className="rounded-xl border border-border bg-card/60 backdrop-blur-sm p-4">
                  <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Your role</p>
                  <p className="text-sm text-foreground leading-relaxed">{data.context}</p>
                </div>

                {/* Topics card */}
                <div className="rounded-xl border border-border bg-card/60 backdrop-blur-sm p-4">
                  <p className="text-xs font-medium text-muted-foreground mb-2.5 uppercase tracking-wide">Tracking</p>
                  <div className="flex flex-wrap gap-1.5">
                    {data.topics.map(t => (
                      <span key={t} className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">{t}</span>
                    ))}
                  </div>
                </div>

                {/* Authorities card */}
                {data.authorities.length > 0 && (
                  <div className="rounded-xl border border-border bg-card/60 backdrop-blur-sm p-4">
                    <p className="text-xs font-medium text-muted-foreground mb-2.5 uppercase tracking-wide">Voices you trust</p>
                    <div className="flex flex-wrap gap-1.5">
                      {data.authorities.map(a => (
                        <span key={a} className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">{a}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Button onClick={() => navigate('/')} size="lg" className="w-full gap-2 rounded-xl h-12">
                Go to your feed <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Onboarding;
