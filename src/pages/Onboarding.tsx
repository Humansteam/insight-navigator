import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowUp, ArrowRight, Plus, User, BookOpen, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

// ── Summary card ──────────────────────────────────────

function SummaryCard({ icon: Icon, title, items }: {
  icon: React.ElementType;
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-xl border border-border bg-card/50 p-4 space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Icon className="w-4 h-4 text-primary" />
        {title}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <span
            key={item}
            className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Step labels ───────────────────────────────────────

const STEP_QUESTIONS = [
  { label: 'Step 1 of 3', question: 'What do you do?', sub: 'Describe your role in a couple of sentences' },
  { label: 'Step 2 of 3', question: 'Which topics matter to you?', sub: 'Select at least 2 topics you want to track' },
  { label: 'Step 3 of 3', question: 'Whose thinking do you trust?', sub: 'Optional — helps prioritize sources' },
];

// ── Main component ────────────────────────────────────

const Onboarding = () => {
  const navigate = useNavigate();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [step, setStep] = useState(0); // 0=loading, 1-3=steps, 4=summary
  const [isTyping, setIsTyping] = useState(true);
  const [data, setData] = useState<OnboardingData>({ context: '', topics: [], authorities: [] });

  // Step inputs
  const [contextInput, setContextInput] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [customTopic, setCustomTopic] = useState('');
  const [selectedAuthorities, setSelectedAuthorities] = useState<string[]>([]);

  // Initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTyping(false);
      setStep(1);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Auto-focus textarea on step 1
  useEffect(() => {
    if (step === 1 && textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 300);
    }
  }, [step]);

  // Auto-resize textarea
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContextInput(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 160) + 'px';
  };

  const transitionToStep = useCallback((nextStep: number) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setStep(nextStep);
    }, 600);
  }, []);

  // ── Handlers ──

  const handleStep1Submit = () => {
    if (!contextInput.trim()) return;
    setData((d) => ({ ...d, context: contextInput.trim() }));
    transitionToStep(2);
  };

  const handleStep2Submit = () => {
    if (selectedTopics.length < 2) return;
    setData((d) => ({ ...d, topics: selectedTopics }));
    transitionToStep(3);
  };

  const handleStep3Submit = (skip = false) => {
    const authorities = skip ? [] : selectedAuthorities;
    setData((d) => ({ ...d, authorities }));
    transitionToStep(4);
  };

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const addCustomTopic = () => {
    const t = customTopic.trim();
    if (t && !selectedTopics.includes(t)) {
      setSelectedTopics((prev) => [...prev, t]);
      setCustomTopic('');
    }
  };

  const toggleAuthority = (name: string) => {
    setSelectedAuthorities((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]
    );
  };

  // Suggested topics based on context (mock)
  const suggestedTopics = (() => {
    const lower = data.context.toLowerCase();
    const suggestions: string[] = [];
    if (lower.includes('ai') || lower.includes('ml') || lower.includes('machine')) suggestions.push('AI / ML', 'LLM Agents');
    if (lower.includes('vc') || lower.includes('fund') || lower.includes('invest')) suggestions.push('VC & Fundraising', 'Startups');
    if (lower.includes('product')) suggestions.push('Product Management', 'SaaS / B2B');
    if (lower.includes('data')) suggestions.push('Data Engineering');
    if (lower.includes('deep') || lower.includes('tech')) suggestions.push('Deep Tech');
    return suggestions.length > 0 ? suggestions : ['AI / ML', 'Startups', 'Product Management'];
  })();

  const currentQ = step >= 1 && step <= 3 ? STEP_QUESTIONS[step - 1] : null;

  // ── Render ──

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      {/* Header with gradient orb */}
      <div className="relative flex flex-col items-center mb-8">
        {/* Gradient orb */}
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full opacity-15 -top-44"
          style={{ background: 'radial-gradient(circle, hsl(var(--primary) / 0.5), transparent 70%)' }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
            S
          </div>
          <h1 className="text-2xl font-bold text-foreground">Welcome to Strata</h1>
          <p className="text-muted-foreground text-sm">Your personal analyst. Let's set things up.</p>
        </div>

        {/* Progress dots */}
        <div className="flex gap-2 mt-5">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={cn(
                'h-1.5 rounded-full transition-all duration-500',
                step >= s ? 'bg-primary w-8' : 'bg-muted-foreground/20 w-1.5'
              )}
            />
          ))}
        </div>
      </div>

      {/* Main input card — Manus style */}
      <AnimatePresence mode="wait">
        {isTyping ? (
          <motion.div
            key="typing"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="w-full max-w-3xl"
          >
            <div className="rounded-2xl border border-border bg-card shadow-lg p-6 flex items-center justify-center">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                <span>Setting things up...</span>
              </div>
            </div>
          </motion.div>
        ) : step >= 1 && step <= 3 ? (
          <motion.div
            key={`step-${step}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-3xl space-y-4"
          >
            {/* Question above the card */}
            <div className="text-center space-y-1.5">
              <span className="text-xs text-muted-foreground font-medium">{currentQ?.label}</span>
              <h2 className="text-xl font-semibold text-foreground">{currentQ?.question}</h2>
              <p className="text-sm text-muted-foreground">{currentQ?.sub}</p>
            </div>

            {/* Hint chips ABOVE card for step 1 */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="flex flex-wrap gap-2 justify-center"
              >
                {['Building an AI product', 'VC fund, deeptech focus', 'Product lead at SaaS', 'Data analyst in fintech'].map((hint) => (
                  <button
                    key={hint}
                    onClick={() => setContextInput(hint)}
                    className="px-4 py-2 rounded-xl bg-card border border-border text-muted-foreground text-sm hover:border-primary/40 hover:text-foreground hover:bg-muted/50 transition-all duration-200"
                  >
                    {hint}
                  </button>
                ))}
              </motion.div>
            )}

            {/* Main input card */}
            <div className="rounded-2xl border border-border bg-card shadow-lg overflow-hidden">

              {/* Step 1 — Textarea */}
              {step === 1 && (
                <div className="px-5 pt-5 pb-2">
                  <textarea
                    ref={textareaRef}
                    value={contextInput}
                    onChange={handleTextareaChange}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleStep1Submit(); }
                    }}
                    placeholder='Describe what you do...'
                    className="w-full resize-none bg-transparent text-base text-foreground placeholder:text-muted-foreground/50 focus:outline-none min-h-[60px] leading-relaxed"
                    rows={2}
                  />
                </div>
              )}

              {/* Step 2 — Topics */}
              {step === 2 && (
                <div className="px-5 pt-5 pb-2 space-y-3">
                  {/* Suggested hint */}
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-primary" />
                    Suggested based on your profile
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {TOPICS.map((topic) => {
                      const isSuggested = suggestedTopics.includes(topic.label);
                      const isSelected = selectedTopics.includes(topic.label);
                      return (
                        <button
                          key={topic.label}
                          onClick={() => toggleTopic(topic.label)}
                          className={cn(
                            'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border',
                            isSelected
                              ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                              : isSuggested
                                ? 'bg-primary/5 text-primary border-primary/30 border-dashed hover:bg-primary/10'
                                : 'bg-background text-muted-foreground border-border hover:border-primary/30 hover:bg-muted/50'
                          )}
                        >
                          {topic.emoji} {topic.label}
                        </button>
                      );
                    })}
                    {selectedTopics.filter((t) => !TOPICS.find((tt) => tt.label === t)).map((t) => (
                      <button
                        key={t}
                        onClick={() => toggleTopic(t)}
                        className="px-4 py-2 rounded-xl text-sm font-medium bg-primary text-primary-foreground border border-primary"
                      >
                        ✦ {t}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Input
                      placeholder="Add your own topic..."
                      value={customTopic}
                      onChange={(e) => setCustomTopic(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addCustomTopic()}
                      className="text-sm h-10 bg-background flex-1"
                    />
                    <Button size="sm" variant="outline" onClick={addCustomTopic} disabled={!customTopic.trim()} className="h-10 w-10 p-0">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3 — Authorities */}
              {step === 3 && (
                <div className="px-5 pt-5 pb-2 space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {AUTHORITIES.map((auth) => {
                      const isSelected = selectedAuthorities.includes(auth.name);
                      return (
                        <button
                          key={auth.name}
                          onClick={() => toggleAuthority(auth.name)}
                          className={cn(
                            'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border flex items-center gap-1.5',
                            isSelected
                              ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                              : 'bg-background text-muted-foreground border-border hover:border-primary/30 hover:bg-muted/50'
                          )}
                        >
                          {auth.name}
                          <span className={cn(
                            'text-xs',
                            isSelected ? 'text-primary-foreground/70' : 'text-muted-foreground/50'
                          )}>
                            · {auth.domain}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Toolbar row */}
              <div className="px-4 py-3 flex items-center justify-between border-t border-border/50">
                <div className="flex items-center gap-2">
                  {step === 2 && selectedTopics.length > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {selectedTopics.length} selected
                    </span>
                  )}
                  {step === 3 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleStep3Submit(true)}
                      className="text-xs text-muted-foreground h-8"
                    >
                      Skip this step
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {step === 3 && selectedAuthorities.length > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {selectedAuthorities.length} selected
                    </span>
                  )}
                  <button
                    onClick={() => {
                      if (step === 1) handleStep1Submit();
                      else if (step === 2) handleStep2Submit();
                      else if (step === 3) handleStep3Submit(false);
                    }}
                    disabled={
                      (step === 1 && !contextInput.trim()) ||
                      (step === 2 && selectedTopics.length < 2) ||
                      (step === 3 && selectedAuthorities.length === 0)
                    }
                    className={cn(
                      'h-10 w-10 rounded-full flex items-center justify-center transition-all duration-200',
                      ((step === 1 && contextInput.trim()) ||
                       (step === 2 && selectedTopics.length >= 2) ||
                       (step === 3 && selectedAuthorities.length > 0))
                        ? 'bg-foreground text-background hover:opacity-80'
                        : 'bg-muted text-muted-foreground cursor-not-allowed'
                    )}
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : step === 4 ? (
          <motion.div
            key="summary"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-3xl"
          >
            <div className="rounded-2xl border border-border bg-card shadow-lg p-6 space-y-4">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">All set!</h2>
                  <p className="text-sm text-muted-foreground">Here's your profile summary</p>
                </div>
              </div>

              <SummaryCard icon={User} title="You" items={[data.context]} />
              <SummaryCard icon={BookOpen} title="Tracking" items={data.topics} />
              {data.authorities.length > 0 && (
                <SummaryCard icon={Users} title="Voices" items={data.authorities} />
              )}

              <Button onClick={() => navigate('/')} className="gap-2 w-full mt-2" size="lg">
                Go to your feed <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default Onboarding;
